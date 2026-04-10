import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, AlertTriangle, RotateCcw } from 'lucide-react';
import { ValidationResult } from '@/context/LennyCourseContext';
import { toast } from '@/hooks/use-toast';

interface Props {
  missionId: number;
  selectedTopic: string;
  initialCode: string;
  placeholder: string;
  validate: (text: string) => ValidationResult[];
  layer2Evaluate: (text: string) => Promise<any>;
  onComplete: (score: number, maxScore: number) => void;
  onWorkUpdate: (work: string) => void;
}

export function LennyCodeEditorWorkspace({
  initialCode,
  placeholder,
  validate,
  layer2Evaluate,
  onComplete,
  onWorkUpdate,
}: Props) {
  const [code, setCode] = useState(initialCode);
  const [results, setResults] = useState<ValidationResult[] | null>(null);
  const [layer2Results, setLayer2Results] = useState<any | null>(null);
  const [layer2Loading, setLayer2Loading] = useState(false);
  const [layer2Error, setLayer2Error] = useState<string | null>(null);
  const [passed, setPassed] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const continueRef = useRef<HTMLDivElement>(null);
  const revealInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (revealInterval.current) clearInterval(revealInterval.current);
    };
  }, []);

  const startReveal = (count: number) => {
    setRevealedCount(0);
    revealInterval.current = setInterval(() => {
      setRevealedCount(prev => {
        if (prev >= count) {
          if (revealInterval.current) clearInterval(revealInterval.current);
          return count;
        }
        return prev + 1;
      });
    }, 400);
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

    const allLayer1Passed = res.every(r => r.passed);

    if (allLayer1Passed) {
      setLayer2Loading(true);
      setTimeout(() => layer2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 200);
      try {
        const l2 = await layer2Evaluate(code);
        setLayer2Results(l2);
        setLayer2Loading(false);
        startReveal(l2.criteria?.length ?? 6);
        if (l2.score >= 3) {
          setPassed(true);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
        setLayer2Error(message);
        toast({
          title: 'Evaluation failed',
          description: message,
          variant: 'destructive',
        });
        setLayer2Loading(false);
      }
    }
  };

  const allRevealed = layer2Results !== null && revealedCount >= (layer2Results.criteria?.length ?? 6);

  const getMultiplierLabel = (score: number) => {
    if (score >= 6) return '2.0×';
    if (score === 5) return '1.7×';
    if (score === 4) return '1.4×';
    if (score === 3) return '1.1×';
    return 'Retry';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Code editor */}
        <div className={`rounded-lg border border-border bg-editor overflow-hidden transition-opacity ${layer2Loading ? 'opacity-60 pointer-events-none' : ''}`}>
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-secondary/60" />
            <div className="w-3 h-3 rounded-full bg-primary/60" />
            <span className="ml-2 text-xs text-muted-foreground font-mono">search-brief.txt</span>
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
            {results.every(r => r.passed) && layer2Loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 flex items-center justify-center gap-2 py-3 rounded-md bg-primary/5 border border-primary/20"
              >
                <Loader2 className="h-4 w-4 text-primary animate-spin" />
                <span className="text-xs font-semibold text-primary">Claude is evaluating your work — scroll down ↓</span>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Layer 2 Results */}
        {layer2Results && (
          <motion.div
            ref={layer2Ref}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {layer2Loading && <Loader2 className="h-4 w-4 text-primary animate-spin" />}
                <p className="font-semibold text-foreground text-sm">Step 2 — Claude Evaluation</p>
              </div>
              <div className="flex items-center gap-2">
                <motion.span
                  key={revealedCount}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  className="text-sm font-bold font-mono text-primary"
                >
                  {layer2Results.criteria?.slice(0, revealedCount).filter((c: any) => c.passed).length ?? 0}/{layer2Results.maxScore ?? 6}
                </motion.span>
                {allRevealed && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      layer2Results.score >= 3
                        ? 'bg-primary/15 text-primary'
                        : 'bg-destructive/15 text-destructive'
                    }`}
                  >
                    {getMultiplierLabel(layer2Results.score)}
                  </motion.span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {layer2Results.criteria?.map((criterion: any, i: number) => {
                const isRevealed = i < revealedCount;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: isRevealed ? 1 : 0.3, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-start gap-2 text-sm rounded-md p-2 transition-colors duration-300 ${
                      isRevealed ? (criterion.passed ? 'bg-primary/5' : 'bg-destructive/5') : 'bg-background/50'
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      <AnimatePresence mode="wait">
                        {isRevealed ? (
                          criterion.passed ? (
                            <motion.div key="pass" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                            </motion.div>
                          ) : (
                            <motion.div key="fail" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                              <XCircle className="h-4 w-4 text-destructive" />
                            </motion.div>
                          )
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-muted-foreground/30" />
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="flex-1">
                      <p className={`text-xs font-medium ${isRevealed ? (criterion.passed ? 'text-foreground' : 'text-destructive') : 'text-muted-foreground'}`}>
                        {criterion.name}
                      </p>
                      {isRevealed && criterion.detail && (
                        <p className="text-xs text-muted-foreground mt-0.5">{criterion.detail}</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {allRevealed && (
              <motion.div
                ref={continueRef}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onAnimationComplete={() => continueRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })}
              >
                {layer2Results.feedback && (
                  <div className="mt-4 p-3 rounded-md bg-background/50 border border-border">
                    <p className="text-xs text-muted-foreground leading-relaxed">{layer2Results.feedback}</p>
                  </div>
                )}

                {layer2Results.score >= 3 ? (
                  <>
                    <p className="mt-3 text-primary font-semibold text-sm">Evaluation passed! ✅</p>
                    <button
                      onClick={() => onComplete(layer2Results.score, layer2Results.maxScore ?? 6)}
                      className="mt-4 w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                    >
                      Continue →
                    </button>
                  </>
                ) : (
                  <p className="mt-3 text-destructive font-semibold text-sm">
                    Need at least 3/6. Revise and try again.
                  </p>
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
                <p className="text-sm font-semibold text-destructive">Evaluation failed</p>
                <p className="text-xs text-muted-foreground mt-1">{layer2Error}</p>
                <button
                  onClick={handleSubmit}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:opacity-80 transition-opacity"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Try again
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
            {layer2Loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Evaluating...</> : 'Evaluate'}
          </button>
        </div>
      )}
    </div>
  );
}
