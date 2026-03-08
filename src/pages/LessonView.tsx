import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lightbulb, ChevronDown } from 'lucide-react';
import { useCourse } from '@/context/CourseContext';
import { MODULE_DATA } from '@/data/courseData';
import { XPCounter } from '@/components/XPCounter';
import { calculateXP } from '@/lib/validation';
import { validateFrontmatter, validateInstructions, validateEdgeCases } from '@/lib/validation';
import { MultipleChoiceWorkspace } from '@/components/workspaces/MultipleChoiceWorkspace';
import { FolderStructureWorkspace } from '@/components/workspaces/FolderStructureWorkspace';
import { CodeEditorWorkspace } from '@/components/workspaces/CodeEditorWorkspace';
import { TriggerTestWorkspace } from '@/components/workspaces/TriggerTestWorkspace';
import { FinalReviewWorkspace } from '@/components/workspaces/FinalReviewWorkspace';

const LessonView = () => {
  const { id } = useParams<{ id: string }>();
  const moduleId = parseInt(id || '1');
  const navigate = useNavigate();
  const { state, dispatch } = useCourse();
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);

  const moduleData = MODULE_DATA.find(m => m.id === moduleId);
  const moduleState = state.modules.find(m => m.id === moduleId);

  if (!moduleData || !moduleState) {
    navigate('/course');
    return null;
  }

  if (moduleState.status === 'locked') {
    navigate('/course');
    return null;
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
    dispatch({ type: 'INCREMENT_ATTEMPTS', moduleId });
    const { total } = calculateXP(moduleId, score, maxScore, moduleState.attempts, moduleState.hintsUsed);
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

  // Build assembled content for module 7
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
        <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.5 }} className="text-5xl">✅</motion.div>
          <h3 className="text-xl font-display font-bold text-foreground">Module Complete!</h3>
          <p className="text-muted-foreground text-sm">You earned {moduleState.xpEarned} XP</p>
          {moduleId < 7 ? (
            <button
              onClick={() => navigate(`/course/module/${moduleId + 1}`)}
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Next Module →
            </button>
          ) : (
            <button
              onClick={() => navigate('/course/complete')}
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              View Certificate 🎉
            </button>
          )}
          <Link to="/course" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Back to Course Map
          </Link>
        </div>
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
      <div className="flex-shrink-0 border-b border-border bg-background/80 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/course" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Course Map
          </Link>
          <div className="h-4 w-px bg-border" />
          <span className="text-sm text-muted-foreground">Module {moduleId} of 7</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-display font-semibold text-foreground">{moduleData.title}</span>
          <XPCounter />
        </div>
      </div>

      {/* Split panel */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left panel - lesson */}
        <div className="md:w-[40%] border-r border-border overflow-y-auto p-6">
          <div className="lesson-content">
            <ReactMarkdown>{moduleData.lessonContent}</ReactMarkdown>
          </div>

          {/* Challenge instructions */}
          <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-5">
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
        <div className="md:w-[60%] flex-1 overflow-hidden">
          {renderWorkspace()}
        </div>
      </div>
    </div>
  );
};

export default LessonView;
