import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import { useCourse } from '@/context/CourseContext';
import { MODULE_DATA } from '@/data/courseData';
import { XPCounter } from '@/components/XPCounter';
import { calculateXP } from '@/lib/validation';
import { validateFrontmatter, validateInstructions, validateEdgeCases } from '@/lib/validation';
import { evaluateDescription } from '@/lib/layer2Evaluator';
import { MultipleChoiceWorkspace } from '@/components/workspaces/MultipleChoiceWorkspace';
import { FolderStructureWorkspace } from '@/components/workspaces/FolderStructureWorkspace';
import { CodeEditorWorkspace } from '@/components/workspaces/CodeEditorWorkspace';
import { TriggerTestWorkspace } from '@/components/workspaces/TriggerTestWorkspace';
import { FinalReviewWorkspace } from '@/components/workspaces/FinalReviewWorkspace';
import confetti from 'canvas-confetti';

const LessonView = () => {
  const { id } = useParams<{ id: string }>();
  const moduleId = parseInt(id || '1');
  const navigate = useNavigate();
  const { state, dispatch } = useCourse();
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);

  // Reset local state when navigating between modules
  useEffect(() => {
    setCompleted(false);
    setRevealedHints([]);
  }, [moduleId]);

  // Auto-start module on first visit
  useEffect(() => {
    const mod = state.modules.find(m => m.id === moduleId);
    if (mod && mod.status === 'locked') {
      // Allow module 1 to always be startable, others only if previous is completed
      const canStart = moduleId === 1 || state.modules.find(m => m.id === moduleId - 1)?.status === 'completed';
      if (canStart) {
        dispatch({ type: 'START_MODULE', moduleId });
      }
    }
  }, [moduleId, state.modules, dispatch]);

  const moduleData = MODULE_DATA.find(m => m.id === moduleId);
  const moduleState = state.modules.find(m => m.id === moduleId);

  if (!moduleData || !moduleState) {
    navigate('/course');
    return null;
  }

  if (moduleState.status === 'locked' && moduleId !== 1) {
    const prevCompleted = state.modules.find(m => m.id === moduleId - 1)?.status === 'completed';
    if (!prevCompleted) {
      navigate('/course');
      return null;
    }
  }

  const revealHint = () => {
    const next = revealedHints.length;
    if (next < moduleData.hints.length) {
      setRevealedHints([...revealedHints, next]);
      if (next > 0) {
        dispatch({ type: 'USE_HINT', moduleId });
      }
    }
  };

  const handleComplete = (score: number, maxScore: number) => {
    const currentAttempts = moduleState.attempts + 1;
    dispatch({ type: 'INCREMENT_ATTEMPTS', moduleId });
    const { total } = calculateXP(moduleId, score, maxScore, currentAttempts, moduleState.hintsUsed);
    dispatch({ type: 'COMPLETE_MODULE', moduleId, xpEarned: total });
    setCompleted(true);
  };

  const handleWorkUpdate = (work: string) => {
    dispatch({ type: 'UPDATE_WORK', moduleId, work });
  };

  const getValidatorForModule = (id: number) => {
    switch (id) {
      case 3: return validateFrontmatter;
      case 4: return validateInstructions;
      case 6: return validateEdgeCases;
      default: return validateFrontmatter;
    }
  };

  const getPlaceholder = (id: number) => {
    switch (id) {
      case 3: return '---\nname: meeting-action-extractor\ndescription: >\n  Use when...\n---';
      case 4: return '## Context\n\n## Input\n\n## Steps\n\n## Output Format';
      case 6: return '## Edge Cases\n\n- **No action items found**: ...\n- **Missing owner**: ...\n- **Ambiguous deadline**: ...';
      default: return '';
    }
  };

  const getAssembledContent = () => {
    const m3 = state.modules[2]?.userWork || '---\nname: meeting-action-extractor\ndescription: >\n  ...\n---';
    const m4 = state.modules[3]?.userWork || '';
    const m6 = state.modules[5]?.userWork || '';
    return `${m3}\n\n${m4}\n\n${m6}`;
  };

  const hintLabel = () => {
    const next = revealedHints.length;
    if (next === 0) return '💡 Hint (Free)';
    if (next === 1) return '💡 Hint (-25 XP)';
    if (next === 2) return '💡 Show Solution (-50 XP)';
    return null;
  };

  const renderWorkspace = () => {
    if (completed || moduleState.status === 'completed') {
      return (
        <CompletionState
          moduleId={moduleId}
          xpEarned={moduleState.xpEarned}
          onNext={() => moduleId < 7 ? navigate(`/course/module/${moduleId + 1}`) : navigate('/course/complete')}
          isLast={moduleId >= 7}
        />
      );
    }

    switch (moduleData.challengeType) {
      case 'multiple_choice':
        return <MultipleChoiceWorkspace onComplete={handleComplete} />;
      case 'folder_structure':
        return <FolderStructureWorkspace onComplete={handleComplete} onWorkUpdate={handleWorkUpdate} />;
      case 'code_editor':
        return (
          <CodeEditorWorkspace
            moduleId={moduleId}
            initialCode={moduleState.userWork}
            placeholder={getPlaceholder(moduleId)}
            validate={getValidatorForModule(moduleId)}
            layer2Evaluate={moduleId === 3 ? (code: string) => {
              const descMatch = code.match(/description:\s*[>|]?\s*([\s\S]*?)(?=\n---|\n[a-z]+:)/i);
              const desc = descMatch?.[1]?.replace(/[>|]\s*/g, '').trim() || code;
              return evaluateDescription(desc);
            } : undefined}
            onComplete={handleComplete}
            onWorkUpdate={handleWorkUpdate}
          />
        );
      case 'trigger_test':
        return <TriggerTestWorkspace onComplete={handleComplete} onWorkUpdate={handleWorkUpdate} />;
      case 'final_review':
        return (
          <FinalReviewWorkspace
            initialCode={moduleState.userWork || getAssembledContent()}
            onComplete={handleComplete}
            onWorkUpdate={handleWorkUpdate}
          />
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top bar */}
      <div className="flex-shrink-0 border-b border-border bg-background px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/course" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Course Map
          </Link>
          <div className="h-4 w-px bg-border" />
          <span className="text-sm text-muted-foreground">Module <span className="text-primary font-bold">{moduleId}</span> of 7</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-display font-semibold text-foreground">{moduleData.title}</span>
          <XPCounter />
        </div>
      </div>

      {/* Split panel */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        {/* Left panel - lesson */}
        <div className="max-h-[35vh] md:max-h-none md:w-[40%] border-r border-border border-l-4 border-l-primary overflow-y-auto p-6 flex-shrink-0">
          <div className="lesson-content">
            <ReactMarkdown>{moduleData.lessonContent}</ReactMarkdown>
          </div>

          {/* Challenge instructions */}
          <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-5">
            <div className="lesson-content">
              <ReactMarkdown>{moduleData.challengeInstructions}</ReactMarkdown>
            </div>
          </div>

          {/* Hints */}
          <div className="mt-4 space-y-2">
            <AnimatePresence>
              {revealedHints.map(idx => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="rounded-lg border border-secondary/30 bg-secondary/10 p-4"
                >
                  <p className="text-sm text-foreground">{moduleData.hints[idx]}</p>
                </motion.div>
              ))}
            </AnimatePresence>
            {hintLabel() && revealedHints.length < moduleData.hints.length && (
              <button
                onClick={revealHint}
                className="flex items-center gap-2 text-sm text-secondary hover:text-secondary/80 transition-colors"
              >
                <Lightbulb className="h-4 w-4" /> {hintLabel()}
              </button>
            )}
          </div>
        </div>

        {/* Right panel - workspace */}
        <div className="flex-1 md:w-[60%] min-h-[50vh] md:min-h-0 overflow-y-auto">
          {renderWorkspace()}
        </div>
      </div>
    </div>
  );
};

/* Completion state with confetti + burst */
function CompletionState({ moduleId, xpEarned, onNext, isLast }: { moduleId: number; xpEarned: number; onNext: () => void; isLast: boolean }) {
  useEffect(() => {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#ff6b35', '#ffd60a', '#22c55e'] });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 p-8 text-center">
      {/* Burst ring behind checkmark */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border-2 border-primary/40 burst-ring" />
        </div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.5 }} className="text-6xl relative z-10">
          ✅
        </motion.div>
      </div>
      <h3 className="text-3xl font-display font-bold tracking-tight text-foreground">Module Complete!</h3>
      <div className="relative">
        <p className="font-mono text-4xl font-extrabold text-primary" style={{ textShadow: '0 0 20px hsl(18 100% 60% / 0.4)' }}>
          +{xpEarned} XP
        </p>
      </div>
      <button
        onClick={onNext}
        className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
      >
        {isLast ? 'View Certificate 🎉' : 'Next Module →'}
      </button>
      <Link to="/course" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        Back to Course Map
      </Link>
    </div>
  );
}

export default LessonView;
