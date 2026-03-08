import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, AlertTriangle, RotateCcw, FileText, MessageSquare } from 'lucide-react';
import { ValidationResult } from '@/context/CourseContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface CriterionResult {
  name: string;
  passed: boolean;
  detail: string;
}

interface EvalResult {
  output: string;
  criteria: CriterionResult[];
  score: number;
  maxScore: number;
  feedback: string;
}

interface Props {
  initialCode: string;
  placeholder: string;
  validate: (code: string) => ValidationResult[];
  onComplete: (score: number, maxScore: number) => void;
  onWorkUpdate: (work: string) => void;
}

export function InstructionTestWorkspace({ initialCode, placeholder, validate, onComplete, onWorkUpdate }: Props) {
  const [code, setCode] = useState(initialCode);
  const [results, setResults] = useState<ValidationResult[] | null>(null);
  const [evalResult, setEvalResult] = useState<EvalResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passed, setPassed] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

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
    setEvalResult(null);
    setError(null);

    const allPassed = res.every(r => r.passed);
    if (!allPassed) return;

    // Layer 2: AI evaluation
    setLoading(true);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 200);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('evaluate-instructions', {
        body: { instructions: code },
      });

      if (fnError) throw new Error(fnError.message || 'Evaluation failed');
      if (data?.error) throw new Error(data.error);

      const evalData = data as EvalResult;
      setEvalResult(evalData);
      setLoading(false);

      if (evalData.score >= 3) {
        setPassed(true);
      }

      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 300);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(message);
      toast({ title: 'Evaluation failed', description: message, variant: 'destructive' });
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Code editor */}
        <div className={`rounded-lg border border-border bg-editor overflow-hidden transition-opacity ${loading ? 'opacity-60 pointer-events-none' : ''}`}>
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
            disabled={loading}
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
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
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
            {results.every(r => r.passed) && loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 flex items-center justify-center gap-2 py-3 rounded-md bg-primary/5 border border-primary/20"
              >
                <Loader2 className="h-4 w-4 text-primary animate-spin" />
                <span className="text-xs font-semibold text-primary">Testing your instructions against messy meeting notes...</span>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Layer 2 Results */}
        {evalResult && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 space-y-4"
          >
            {/* Section A: Claude's Output */}
            <div className="rounded-lg border border-border bg-editor p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-primary" />
                <p className="font-semibold text-foreground text-sm">Claude's Output</p>
              </div>
              <div className="rounded-md bg-card p-4 text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-mono">
                {evalResult.output}
              </div>
            </div>

            {/* Section B: Quality Check */}
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold text-foreground text-sm">Quality Check</p>
                <span className={`text-sm font-bold font-mono ${evalResult.score >= 3 ? 'text-primary' : 'text-destructive'}`}>
                  {evalResult.score}/{evalResult.maxScore} criteria passed
                </span>
              </div>
              <div className="space-y-2">
                {evalResult.criteria.map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-start gap-2 text-sm rounded-md p-2 ${c.passed ? 'bg-primary/5' : 'bg-destructive/5'}`}
                  >
                    {c.passed ? (
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <span className={c.passed ? 'text-foreground' : 'text-destructive'}>{c.name}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Feedback callout */}
              {evalResult.feedback && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-4 p-3 rounded-md bg-secondary/10 border border-secondary/20"
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-foreground/80 leading-relaxed">{evalResult.feedback}</p>
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              {evalResult.score >= 3 ? (
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => onComplete(evalResult.score, evalResult.maxScore)}
                    className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    Continue →
                  </button>
                  {evalResult.score < 6 && (
                    <button
                      onClick={() => { setEvalResult(null); setResults(null); setPassed(false); }}
                      className="w-full px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Try again for more XP
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-4">
                  <p className="text-destructive font-semibold text-sm mb-2">Need at least 3/6 criteria to pass. Revise your instructions and try again.</p>
                  <button
                    onClick={() => { setEvalResult(null); setResults(null); }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:opacity-80 transition-opacity"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Try again
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Error state */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-destructive">Evaluation failed</p>
                <p className="text-xs text-muted-foreground mt-1">{error}</p>
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
            disabled={code.trim().length === 0 || loading}
            className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Testing...</> : '🧪 Test My Instructions'}
          </button>
        </div>
      )}
    </div>
  );
}
