import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, AlertTriangle, RotateCcw, Clock } from 'lucide-react';
import { ValidationResult } from '@/context/CourseContext';
import { Layer2Result } from '@/lib/layer2Evaluator';
import { toast } from '@/hooks/use-toast';

const TEST_QUERIES = [
  { text: "Here are my meeting notes from today, can you extract the action items?", expected: true },
  { text: "Pull out the to-dos from this standup recap", expected: true },
  { text: "What are the follow-ups from this meeting?", expected: true },
  { text: "I pasted my 1:1 notes, can you find the next steps?", expected: true },
  { text: "Extract action items and owners from these notes", expected: true },
  { text: "Help me schedule a meeting with the design team", expected: false },
  { text: "Write an agenda for tomorrow's sprint planning", expected: false },
];

interface Props {
  moduleId: number;
  initialCode: string;
  placeholder: string;
  validate: (code: string) => ValidationResult[];
  layer2Evaluate?: (code: string) => Promise<Layer2Result>;
  onComplete: (score: number, maxScore: number) => void;
  onWorkUpdate: (work: string) => void;
}

export function CodeEditorWorkspace({ initialCode, placeholder, validate, layer2Evaluate, onComplete, onWorkUpdate }: Props) {
  const [code, setCode] = useState(initialCode);
  const [results, setResults] = useState<ValidationResult[] | null>(null);
  const [layer2Results, setLayer2Results] = useState<Layer2Result | null>(null);
  const [layer2Loading, setLayer2Loading] = useState(false);
  const [layer2Error, setLayer2Error] = useState<string | null>(null);
  const [passed, setPassed] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [showingQueries, setShowingQueries] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const revealInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (revealInterval.current) clearInterval(revealInterval.current);
    };
  }, []);

  const startReveal = () => {
    setRevealedCount(0);
    revealInterval.current = setInterval(() => {
      setRevealedCount(prev => {
        if (prev >= 7) {
          if (revealInterval.current) clearInterval(revealInterval.current);
          return 7;
        }
        return prev + 1;
      });
    }, 400);
  };

  const shouldActivateQueries = TEST_QUERIES.map((q, i) => ({ ...q, originalIndex: i })).filter(q => q.expected);
  const shouldNotActivateQueries = TEST_QUERIES.map((q, i) => ({ ...q, originalIndex: i })).filter(q => !q.expected);

  const getVerdict = (result: { correct: boolean; triggered: boolean }, expected: boolean) => {
    if (result.correct) {
      return expected
        ? { label: 'Correctly activated', className: 'text-primary' }
        : { label: 'Correctly skipped', className: 'text-primary' };
    }
    return expected
      ? { label: 'Missed — should have activated', className: 'text-destructive' }
      : { label: 'Over-triggered — should have skipped', className: 'text-destructive' };
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      onWorkUpdate(newCode);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 2; }, 0);
    }
  };

  const handleSubmit = async () => {
    const res = validate(code);
    setResults(res);
    setLayer2Results(null);
    setLayer2Error(null);
    setRevealedCount(0);
    setShowingQueries(false);

    const allLayer1Passed = res.every(r => r.passed);

    if (allLayer1Passed && layer2Evaluate) {
      setLayer2Loading(true);
      setShowingQueries(true);
      // Auto-scroll to Layer 2 section after it renders
      setTimeout(() => layer2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 200);
      try {
        const l2 = await layer2Evaluate(code);
        setLayer2Results(l2);
        setLayer2Loading(false);
        startReveal();
        if (l2.score >= 4) {
          setPassed(true);
          // User will click Continue button to proceed
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
        setLayer2Error(message);
        setShowingQueries(false);
        toast({
          title: 'Evaluation failed',
          description: message,
          variant: 'destructive',
        });
        setLayer2Loading(false);
      }
    } else if (allLayer1Passed && !layer2Evaluate) {
      const passedCount = res.filter(r => r.passed).length;
      setPassed(true);
      onComplete(passedCount, res.length);
    }
  };

  const getMultiplierLabel = (score: number) => {
    if (score === 7) return '2.0×';
    if (score === 6) return '1.7×';
    if (score === 5) return '1.4×';
    if (score === 4) return '1.1×';
    return 'Retry';
  };

  const revealedScore = layer2Results
    ? layer2Results.results.slice(0, revealedCount).filter(r => r.correct).length
    : 0;

  const allRevealed = revealedCount >= 7 && layer2Results !== null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Code editor */}
        <div className={`rounded-lg border border-border bg-editor overflow-hidden transition-opacity ${layer2Loading ? 'opacity-60 pointer-events-none' : ''}`}>
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-secondary/60" />
            <div className="w-3 h-3 rounded-full bg-primary/60" />
            <span className="ml-2 text-xs text-muted-foreground font-mono">SKILL.md</span>
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={e => { setCode(e.target.value); onWorkUpdate(e.target.value); }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={layer2Loading}
            className="w-full min-h-[300px] p-4 bg-editor text-editor-foreground font-mono text-sm leading-relaxed resize-y focus:outline-none placeholder:text-muted-foreground/40 code-editor disabled:cursor-not-allowed"
            spellCheck={false}
          />
        </div>

        {/* Layer 1 Results */}
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-lg border border-border bg-card p-4"
          >
            <p className="font-semibold text-foreground mb-3 text-sm">Step 1 — Structural Checks</p>
            <div className="space-y-2">
              {results.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  {r.passed ? (
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0 pop-in" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <span className={r.passed ? 'text-foreground' : 'text-destructive'}>{r.check}</span>
                    {!r.passed && <p className="text-xs text-muted-foreground mt-0.5">{r.message}</p>}
                  </div>
                </div>
              ))}
            </div>
            {results.every(r => r.passed) && !layer2Evaluate && (
              <p className="mt-3 text-primary font-semibold text-sm">All checks passed! ✅</p>
            )}
            {results.every(r => r.passed) && layer2Evaluate && layer2Loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 flex items-center justify-center gap-2 py-3 rounded-md bg-primary/5 border border-primary/20"
              >
                <Loader2 className="h-4 w-4 text-primary animate-spin" />
                <span className="text-xs font-semibold text-primary">Running trigger test — scroll down ↓</span>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Layer 2 — Live Grading Reveal */}
        {showingQueries && (
          <motion.div
            ref={layer2Ref}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {layer2Loading && <Loader2 className="h-4 w-4 text-primary animate-spin" />}
                <p className="font-semibold text-foreground text-sm">
                  Step 2 — Does Claude know when to activate?
                </p>
              </div>
              {layer2Results && (
                <div className="flex items-center gap-2">
                  <motion.span
                    key={revealedScore}
                    initial={{ scale: 1.3 }}
                    animate={{ scale: 1 }}
                    className={`text-sm font-bold font-mono ${revealedScore > 0 ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    {revealedScore}/{layer2Results.maxScore}
                  </motion.span>
                  {allRevealed && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        layer2Results.score >= 4
                          ? 'bg-primary/15 text-primary'
                          : 'bg-destructive/15 text-destructive'
                      }`}
                    >
                      {getMultiplierLabel(layer2Results.score)}
                    </motion.span>
                  )}
                </div>
              )}
            </div>

            {/* Explainer paragraph */}
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              We're simulating 7 real user messages to see if Claude would correctly recognize when to use your Skill based on your description. 5 queries <span className="font-semibold text-foreground">should</span> activate it, and 2 <span className="font-semibold text-foreground">should not</span>.
            </p>

            {/* Should Activate group */}
            {/* Should Activate group */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-primary mb-1.5">Should activate your Skill ({shouldActivateQueries.length})</p>
              <div className="space-y-1.5">
                {shouldActivateQueries.map((tq) => {
                  const i = tq.originalIndex;
                  const isRevealed = layer2Results && i < revealedCount;
                  const result = layer2Results?.results[i];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-start gap-2 text-sm rounded-md p-2 transition-colors duration-300 ${
                        isRevealed ? (result?.correct ? 'bg-primary/5' : 'bg-destructive/5') : 'bg-background/50'
                      }`}
                    >
                      <div className="mt-0.5 flex-shrink-0 w-4 h-4">
                        <AnimatePresence mode="wait">
                          {isRevealed ? (
                            result?.correct ? (
                              <motion.div key="pass" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                              </motion.div>
                            ) : (
                              <motion.div key="fail" initial={{ scale: 0, rotate: 90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                                <XCircle className="h-4 w-4 text-destructive" />
                              </motion.div>
                            )
                          ) : (
                            <Clock className="h-4 w-4 text-muted-foreground/40" />
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground text-xs leading-relaxed">"{tq.text}"</p>
                        {isRevealed && result && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-xs font-medium mt-1 ${getVerdict(result, tq.expected).className}`}>
                            {getVerdict(result, tq.expected).label}
                          </motion.p>
                        )}
                        {!isRevealed && (
                          <span className="inline-block mt-1 text-xs px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground/60 font-medium">Pending...</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Should NOT Activate group */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1.5">Should NOT activate ({shouldNotActivateQueries.length})</p>
              <div className="space-y-1.5">
                {shouldNotActivateQueries.map((tq) => {
                  const i = tq.originalIndex;
                  const isRevealed = layer2Results && i < revealedCount;
                  const result = layer2Results?.results[i];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-start gap-2 text-sm rounded-md p-2 transition-colors duration-300 ${
                        isRevealed ? (result?.correct ? 'bg-primary/5' : 'bg-destructive/5') : 'bg-background/50'
                      }`}
                    >
                      <div className="mt-0.5 flex-shrink-0 w-4 h-4">
                        <AnimatePresence mode="wait">
                          {isRevealed ? (
                            result?.correct ? (
                              <motion.div key="pass" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                              </motion.div>
                            ) : (
                              <motion.div key="fail" initial={{ scale: 0, rotate: 90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                                <XCircle className="h-4 w-4 text-destructive" />
                              </motion.div>
                            )
                          ) : (
                            <Clock className="h-4 w-4 text-muted-foreground/40" />
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground text-xs leading-relaxed">"{tq.text}"</p>
                        {isRevealed && result && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-xs font-medium mt-1 ${getVerdict(result, tq.expected).className}`}>
                            {getVerdict(result, tq.expected).label}
                          </motion.p>
                        )}
                        {!isRevealed && (
                          <span className="inline-block mt-1 text-xs px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground/60 font-medium">Pending...</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Feedback after all revealed */}
            {allRevealed && layer2Results && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="mt-4 p-3 rounded-md bg-background/50 border border-border">
                  <p className="text-xs text-muted-foreground leading-relaxed">{layer2Results.feedback}</p>
                </div>

                {layer2Results.score >= 4 ? (
                  <>
                    <p className="mt-3 text-primary font-semibold text-sm">Trigger test passed! ✅</p>
                    <button
                      onClick={() => onComplete(layer2Results.score, layer2Results.maxScore)}
                      className="mt-4 w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                    >
                      Continue →
                    </button>
                  </>
                ) : (
                  <p className="mt-3 text-destructive font-semibold text-sm">Need at least 4/7 correct. Revise your description and try again.</p>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Layer 2 Error */}
        {layer2Error && !layer2Loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-destructive">Trigger test failed</p>
                <p className="text-xs text-muted-foreground mt-1">{layer2Error}</p>
                <button
                  onClick={handleSubmit}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:opacity-80 transition-opacity"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Try again
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {!passed && (
        <div className="p-4 border-t border-border">
          <button
            onClick={handleSubmit}
            disabled={code.trim().length === 0 || layer2Loading}
            className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            {layer2Loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Testing...</> : 'Submit'}
          </button>
        </div>
      )}
    </div>
  );
}