import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, AlertTriangle, RotateCcw } from 'lucide-react';
import { ValidationResult } from '@/context/CourseContext';
import { Layer2Result } from '@/lib/layer2Evaluator';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

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
  const [loadingProgress, setLoadingProgress] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const startLoadingProgress = () => {
    setLoadingProgress(0);
    progressInterval.current = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          if (progressInterval.current) clearInterval(progressInterval.current);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 300);
  };

  const stopLoadingProgress = () => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    setLoadingProgress(100);
    setTimeout(() => setLoadingProgress(0), 400);
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

    const allLayer1Passed = res.every(r => r.passed);

    if (allLayer1Passed && layer2Evaluate) {
      setLayer2Loading(true);
      startLoadingProgress();
      try {
        const l2 = await layer2Evaluate(code);
        setLayer2Results(l2);
        if (l2.score >= 4) {
          setPassed(true);
          onComplete(l2.score, l2.maxScore);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
        setLayer2Error(message);
        toast({
          title: 'Evaluation failed',
          description: message,
          variant: 'destructive',
        });
      } finally {
        stopLoadingProgress();
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
            <p className="font-semibold text-foreground mb-3 text-sm">Layer 1 — Structural Checks</p>
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
          </motion.div>
        )}

        {/* Layer 2 Loading */}
        {layer2Loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-lg border border-border bg-card p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
              <div>
                <p className="text-sm font-semibold text-foreground">Running trigger test...</p>
                <p className="text-xs text-muted-foreground">Testing your description against 7 real user queries • Usually takes 2–3 seconds</p>
              </div>
            </div>
            <Progress value={loadingProgress} className="h-1.5" />
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

        {/* Layer 2 Results */}
        {layer2Results && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-foreground text-sm">Layer 2 — Trigger Test Results</p>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold font-mono ${layer2Results.score >= 4 ? 'text-primary' : 'text-destructive'}`}>
                  {layer2Results.score}/{layer2Results.maxScore}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  layer2Results.score >= 4
                    ? 'bg-primary/15 text-primary'
                    : 'bg-destructive/15 text-destructive'
                }`}>
                  {getMultiplierLabel(layer2Results.score)}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              {layer2Results.results.map((r) => (
                <div key={r.query} className="flex items-start gap-2 text-sm rounded-md p-2 bg-background/50">
                  {r.correct ? (
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground truncate text-xs">
                      <span className="text-muted-foreground font-mono mr-1">Q{r.query}</span>
                      "{r.queryText}"
                    </p>
                    <div className="flex gap-3 mt-0.5 text-xs text-muted-foreground">
                      <span>Expected: <span className={r.expected ? 'text-primary' : 'text-muted-foreground'}>{r.expected ? 'trigger' : 'skip'}</span></span>
                      <span>Got: <span className={r.triggered === r.expected ? 'text-primary' : 'text-destructive'}>{r.triggered ? 'trigger' : 'skip'}</span></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-md bg-background/50 border border-border">
              <p className="text-xs text-muted-foreground leading-relaxed">{layer2Results.feedback}</p>
            </div>

            {layer2Results.score >= 4 && (
              <p className="mt-3 text-primary font-semibold text-sm">Trigger test passed! ✅</p>
            )}
            {layer2Results.score < 4 && (
              <p className="mt-3 text-destructive font-semibold text-sm">Need at least 4/7 correct. Revise your description and try again.</p>
            )}
          </motion.div>
        )}
      </div>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleSubmit}
          disabled={code.trim().length === 0 || layer2Loading}
          className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          {layer2Loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Testing...</> : 'Submit'}
        </button>
      </div>
    </div>
  );
}
