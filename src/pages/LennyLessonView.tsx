import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lightbulb, Lock } from 'lucide-react';
import { useLennyCourse } from '@/context/LennyCourseContext';
import { LENNY_MODULE_DATA, LENNY_TOPICS } from '@/data/lennyLabData';
import { LennyXPCounter } from '@/components/LennyXPCounter';
import { calculateLennyXP } from '@/lib/lennyValidation';
import { validateSearchBrief, validateSynthesisPrompt } from '@/lib/lennyValidation';
import { evaluateSearchBrief, evaluateSynthesisPrompt } from '@/lib/lennyLayer2Evaluator';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LessonStepper } from '@/components/LessonStepper';
import { LennyMultipleChoiceWorkspace } from '@/components/lenny-workspaces/LennyMultipleChoiceWorkspace';
import { LennyCodeEditorWorkspace } from '@/components/lenny-workspaces/LennyCodeEditorWorkspace';
import { LennyFixThePromptWorkspace } from '@/components/lenny-workspaces/LennyFixThePromptWorkspace';
import { LennyLiveSearchWorkspace } from '@/components/lenny-workspaces/LennyLiveSearchWorkspace';
import { LennyPlaybookWorkspace } from '@/components/lenny-workspaces/LennyPlaybookWorkspace';
import mission4BadOutputs from '@/data/lenny/mission_4_bad_outputs.json';
import confetti from 'canvas-confetti';

const LennyLessonView = () => {
  const { id } = useParams<{ id: string }>();
  const missionId = parseInt(id || '1');
  const navigate = useNavigate();
  const { state, dispatch } = useLennyCourse();
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState('lesson');
  const [challengeUnlocked, setChallengeUnlocked] = useState(false);
  const isMobile = useIsMobile();

  const missionData = LENNY_MODULE_DATA.find(m => m.id === missionId);
  const missionState = state.modules.find(m => m.id === missionId);
  const selectedTopic = state.selectedTopic ?? '';
  const topicLabel = LENNY_TOPICS.find(t => t.id === selectedTopic)?.label ?? selectedTopic;

  // Reset local state when navigating between missions
  useEffect(() => {
    setCompleted(false);
    setRevealedHints([]);
    setActiveTab('lesson');
    const currentModule = state.modules.find(m => m.id === missionId);
    setChallengeUnlocked(currentModule?.status === 'completed');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missionId]);

  useEffect(() => {
    if (missionData) {
      document.title = `Mission ${missionId}: ${missionData.title} — The Lens`;
    }
  }, [missionId, missionData]);

  // Auto-start mission on first visit (Mission 1 is unlocked by SELECT_TOPIC)
  useEffect(() => {
    const mod = state.modules.find(m => m.id === missionId);
    if (mod && mod.status === 'locked') {
      const canStart = missionId > 1 && state.modules.find(m => m.id === missionId - 1)?.status === 'completed';
      if (canStart) {
        dispatch({ type: 'START_MODULE', moduleId: missionId });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missionId]);

  if (!missionData || !missionState) {
    navigate('/course/lenny');
    return null;
  }

  // Redirect if no topic selected
  if (!selectedTopic) {
    navigate('/course/lenny');
    return null;
  }

  // Guard locked missions
  if (missionState.status === 'locked' && missionId !== 1) {
    const prevCompleted = state.modules.find(m => m.id === missionId - 1)?.status === 'completed';
    if (!prevCompleted) {
      navigate('/course/lenny');
      return null;
    }
  }

  const handleAllStepsViewed = () => {
    setChallengeUnlocked(true);
    if (isMobile) {
      setActiveTab('challenge');
    }
  };

  const revealHint = () => {
    const next = revealedHints.length;
    if (next < missionData.hints.length) {
      setRevealedHints([...revealedHints, next]);
      if (next > 0) {
        dispatch({ type: 'USE_HINT', moduleId: missionId });
      }
    }
  };

  const handleComplete = (score: number, maxScore: number) => {
    const currentAttempts = missionState.attempts + 1;
    const effectiveHintsUsed = Math.max(missionState.hintsUsed, revealedHints.length - 1);

    dispatch({ type: 'INCREMENT_ATTEMPTS', moduleId: missionId });
    const { total } = calculateLennyXP(missionId, score, maxScore, currentAttempts, effectiveHintsUsed);
    dispatch({ type: 'COMPLETE_MODULE', moduleId: missionId, xpEarned: total });
    setCompleted(true);
    if (isMobile) setActiveTab('challenge');
  };

  const handleWorkUpdate = (work: string) => {
    dispatch({ type: 'UPDATE_WORK', moduleId: missionId, work });
  };

  const hintLabel = () => {
    const next = revealedHints.length;
    if (next === 0) return '💡 Hint (Free)';
    if (next === 1) return '💡 Hint (-25 XP)';
    if (next === 2) return '💡 Show Solution (-50 XP)';
    return null;
  };

  const renderWorkspace = () => {
    if (completed || missionState.status === 'completed') {
      return (
        <CompletionState
          missionId={missionId}
          xpEarned={missionState.xpEarned}
          onNext={() => {
            if (missionId >= 5) {
              navigate('/course/lenny/6');
            } else {
              navigate(`/course/lenny/${missionId + 1}`);
            }
          }}
          isLast={missionId >= 6}
          onViewPlaybook={() => navigate('/course/lenny/complete')}
        />
      );
    }

    if (!challengeUnlocked) {
      return <LockedChallenge />;
    }

    switch (missionData.challengeType) {
      case 'multiple_choice':
        return (
          <LennyMultipleChoiceWorkspace
            missionId={missionId}
            selectedTopic={selectedTopic}
            onComplete={handleComplete}
          />
        );

      case 'code_editor':
        if (missionId === 3) {
          return (
            <LennyCodeEditorWorkspace
              missionId={missionId}
              selectedTopic={selectedTopic}
              initialCode={missionState.userWork || ''}
              placeholder={`Write your search brief for the "${topicLabel}" topic.\n\nFor each of 3 playbook sections, specify:\n- Section name and search query\n- Source filter (newsletters / podcasts / both) and why\n- Threshold (strict 0.55+ / medium 0.45+ / loose 0.35+) and why\n\nAlso describe your synthesis approach.`}
              validate={validateSearchBrief}
              layer2Evaluate={(text) => evaluateSearchBrief(text, selectedTopic)}
              onComplete={handleComplete}
              onWorkUpdate={handleWorkUpdate}
            />
          );
        }
        if (missionId === 4) {
          const topicBadOutput = (mission4BadOutputs as any).topics?.[selectedTopic]?.bad_output ?? '';
          return (
            <LennyFixThePromptWorkspace
              selectedTopic={selectedTopic}
              badOutput={topicBadOutput}
              initialCode={missionState?.userWork || ''}
              validate={validateSynthesisPrompt}
              layer2Evaluate={(text) => evaluateSynthesisPrompt(text, selectedTopic)}
              onComplete={handleComplete}
              onWorkUpdate={handleWorkUpdate}
            />
          );
        }
        return <div className="p-4 text-muted-foreground text-sm">Unknown code_editor mission: {missionId}</div>;

      case 'live_search':
        return (
          <LennyLiveSearchWorkspace
            selectedTopic={selectedTopic}
            onComplete={handleComplete}
            onSectionComplete={(section) => dispatch({ type: 'ADD_PLAYBOOK_SECTION', section })}
          />
        );

      case 'final_review':
        return (
          <LennyPlaybookWorkspace
            playbook={state.playbook}
            selectedTopic={selectedTopic}
            totalXP={state.totalXP}
            onComplete={handleComplete}
          />
        );

      default:
        return <div className="p-4 text-muted-foreground text-sm">Unknown challenge type</div>;
    }
  };

  const renderLessonPanel = () => (
    <>
      <LessonStepper
        steps={missionData.lessonSteps as any}
        moduleId={missionId}
        onAllStepsViewed={handleAllStepsViewed}
        allViewed={challengeUnlocked}
      />
      {challengeUnlocked && (
        <>
          <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-5">
            <div className="lesson-content">
              <ReactMarkdown>{missionData.challengeInstructions}</ReactMarkdown>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <AnimatePresence>
              {revealedHints.map(idx => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="rounded-lg border border-secondary/30 bg-secondary/10 p-4"
                >
                  <p className="text-sm text-foreground">{missionData.hints[idx]}</p>
                </motion.div>
              ))}
            </AnimatePresence>
            {hintLabel() && revealedHints.length < missionData.hints.length && (
              <button
                onClick={revealHint}
                className="flex items-center gap-2 text-sm text-secondary hover:text-secondary/80 transition-colors"
              >
                <Lightbulb className="h-4 w-4" /> {hintLabel()}
              </button>
            )}
          </div>
        </>
      )}
    </>
  );

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top bar */}
      <div className="flex-shrink-0 border-b border-border bg-background px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/course/lenny" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Course Map
          </Link>
          <div className="h-4 w-px bg-border" />
          <span className="text-sm text-muted-foreground">
            Mission <span className="text-primary font-bold">{missionId}</span> of 6
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-display font-semibold text-foreground">{missionData.title}</span>
          <LennyXPCounter />
        </div>
      </div>

      {/* Mobile: Tab layout */}
      {isMobile ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="sticky top-0 z-10 h-11 w-full rounded-none border-b border-border bg-background shrink-0">
            <TabsTrigger value="lesson" className="flex-1 text-sm">📖 Lesson</TabsTrigger>
            <TabsTrigger value="challenge" className="flex-1 text-sm">
              {challengeUnlocked ? '🛠️ Challenge' : '🔒 Challenge'}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="lesson" className="flex-1 overflow-y-auto p-6 mt-0 border-l-4 border-l-primary">
            {renderLessonPanel()}
          </TabsContent>
          <TabsContent value="challenge" className="flex-1 overflow-y-auto mt-0">
            {renderWorkspace()}
          </TabsContent>
        </Tabs>
      ) : (
        /* Desktop: Split panel */
        <div className="flex-1 flex flex-row overflow-hidden min-h-0">
          <div className="w-[40%] border-r border-border border-l-4 border-l-primary overflow-y-auto p-6 flex-shrink-0">
            {renderLessonPanel()}
          </div>
          <div className="flex-1 w-[60%] overflow-y-auto">
            {renderWorkspace()}
          </div>
        </div>
      )}
    </div>
  );
};

function LockedChallenge() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
        <Lock className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-display font-semibold text-foreground">Complete the lesson first</h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        Read through all lesson steps to unlock the challenge.
      </p>
    </div>
  );
}

function CompletionState({
  missionId,
  xpEarned,
  onNext,
  isLast,
  onViewPlaybook,
}: {
  missionId: number;
  xpEarned: number;
  onNext: () => void;
  isLast: boolean;
  onViewPlaybook: () => void;
}) {
  useEffect(() => {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#ff6b35', '#ffd60a', '#22c55e'] });
  }, []);

  const isMission5 = missionId === 5;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 p-8 text-center">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border-2 border-primary/40 burst-ring" />
        </div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.5 }} className="text-6xl relative z-10">
          ✅
        </motion.div>
      </div>
      <h3 className="text-3xl font-display font-bold tracking-tight text-foreground">Mission Complete!</h3>
      {xpEarned > 0 && (
        <div className="relative">
          <p className="font-mono text-4xl font-extrabold text-primary" style={{ textShadow: '0 0 20px hsl(18 100% 60% / 0.4)' }}>
            +{xpEarned} XP
          </p>
        </div>
      )}
      {isMission5 ? (
        <button
          onClick={onNext}
          className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
        >
          View Your Playbook 🎉
        </button>
      ) : isLast ? (
        <button
          onClick={onViewPlaybook}
          className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
        >
          View Certificate 🎉
        </button>
      ) : (
        <button
          onClick={onNext}
          className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
        >
          Next Mission →
        </button>
      )}
      <Link to="/course/lenny" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        Back to Course Map
      </Link>
    </div>
  );
}

export default LennyLessonView;
