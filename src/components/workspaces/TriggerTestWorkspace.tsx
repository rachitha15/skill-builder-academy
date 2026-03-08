import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Lightbulb, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useCourse } from '@/context/CourseContext';

interface Props {
  onComplete: (score: number, maxScore: number) => void;
  onWorkUpdate: (work: string) => void;
}

interface TriggerResult {
  query_number: number;
  query_text: string;
  triggered: boolean;
  expected: boolean;
  correct: boolean;
}

interface SuiteQuality {
  diverse_positive: boolean;
  tricky_negatives: boolean;
  missing_scenarios: string[];
}

interface EvalResponse {
  results: TriggerResult[];
  trigger_score: number;
  suite_quality: SuiteQuality;
  feedback: string;
}

const POSITIVE_PLACEHOLDERS = [
  "e.g., Here are my standup notes, what needs doing?",
  "e.g., What are the follow-ups from this 1:1?",
  "e.g., Pull the to-dos from this retro summary",
  "e.g., What did we commit to in leadership sync?",
  "e.g., Find everything that needs an owner in these notes",
];

const NEGATIVE_PLACEHOLDERS = [
  "e.g., Draft an email to the marketing team",
  "e.g., Write an agenda for tomorrow's standup",
  "e.g., Summarize this article about product strategy",
  "e.g., Schedule a meeting with the design team",
  "e.g., Create a project brief for the new feature",
];

export function TriggerTestWorkspace({ onComplete, onWorkUpdate }: Props) {
  const { state } = useCourse();
  const [shouldTrigger, setShouldTrigger] = useState(Array(5).fill(''));
  const [shouldNotTrigger, setShouldNotTrigger] = useState(Array(5).fill(''));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [sectionWarnings, setSectionWarnings] = useState<{ positive?: string; negative?: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evalResult, setEvalResult] = useState<EvalResponse | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [visibleRows, setVisibleRows] = useState(0);

  // Get Module 3 description
  const module3Work = state.modules[2]?.userWork || '';
  const getDescription = () => {
    const descMatch = module3Work.match(/description:\s*[>|]?\s*([\s\S]*?)(?=\n---|\n[a-z]+:)/i);
    return descMatch?.[1]?.replace(/[>|]\s*/g, '').trim() || module3Work;
  };

  const validateLayer1 = (): boolean => {
    const errors: Record<string, string> = {};
    const warnings: { positive?: string; negative?: string } = {};
    let valid = true;

    // Check all fields non-empty and 5+ chars
    shouldTrigger.forEach((q, i) => {
      if (q.trim().length < 5) {
        errors[`pos_${i}`] = 'Enter a query';
        valid = false;
      }
    });
    shouldNotTrigger.forEach((q, i) => {
      if (q.trim().length < 5) {
        errors[`neg_${i}`] = 'Enter a query';
        valid = false;
      }
    });

    // At least 2 positive queries must NOT contain "action items"/"action item"
    const withoutActionItems = shouldTrigger.filter(
      q => q.trim().length >= 5 && !/action\s*items?/i.test(q)
    ).length;
    if (withoutActionItems < 2) {
      warnings.positive = 'At least 2 queries must NOT contain "action items" — try paraphrasing';
      valid = false;
    }

    // At least 2 negative queries must contain "meeting"
    const withMeeting = shouldNotTrigger.filter(
      q => q.trim().length >= 5 && /meeting/i.test(q)
    ).length;
    if (withMeeting < 2) {
      warnings.negative = 'At least 2 queries should be meeting-related — these are the trickiest to get right';
      valid = false;
    }

    setFieldErrors(errors);
    setSectionWarnings(warnings);
    return valid;
  };

  const handleSubmit = async () => {
    setError(null);
    setEvalResult(null);
    setShowResults(false);
    setVisibleRows(0);

    if (!validateLayer1()) return;

    if (!module3Work || module3Work.trim().length === 0) {
      setError('You need to complete Module 3 first — your Skill description is needed for trigger testing.');
      return;
    }

    const description = getDescription();
    setLoading(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('evaluate-triggers', {
        body: { description, shouldTrigger, shouldNotTrigger },
      });

      if (fnError) throw new Error(fnError.message || 'Evaluation failed');
      if (data?.error) throw new Error(data.error);

      const result = data as EvalResponse;
      setEvalResult(result);
      setShowResults(true);

      // Stagger row animations
      result.results.forEach((_, i) => {
        setTimeout(() => setVisibleRows(v => Math.max(v, i + 1)), (i + 1) * 100);
      });

      onWorkUpdate(JSON.stringify({ shouldTrigger, shouldNotTrigger }));

      const score = result.trigger_score;
      if (score >= 5) {
        onComplete(score, 10);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getXPInfo = (score: number) => {
    if (score >= 10) return { multiplier: '2.0×', xp: 300 };
    if (score >= 8) return { multiplier: '1.7×', xp: 255 };
    if (score >= 6) return { multiplier: '1.4×', xp: 210 };
    if (score >= 5) return { multiplier: '1.1×', xp: 165 };
    return { multiplier: '—', xp: 0 };
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Instruction header */}
      <div className="p-4 border-b border-border">
        <p className="text-sm text-muted-foreground">
          Write 5 queries that SHOULD trigger Clara's Skill and 5 that should NOT. Think about how Clara and her colleagues actually talk to Claude.
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="outline" className="text-xs">At least 2 positive queries must NOT contain "action items"</Badge>
          <Badge variant="outline" className="text-xs">At least 2 negative queries must contain "meeting"</Badge>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-6">
        {/* Should Trigger section */}
        <div>
          <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-xs">✅</span>
            Should Trigger
          </h3>
          <div className="space-y-2">
            {shouldTrigger.map((q, i) => (
              <div key={i}>
                <input
                  value={q}
                  onChange={e => {
                    const next = [...shouldTrigger];
                    next[i] = e.target.value;
                    setShouldTrigger(next);
                    if (fieldErrors[`pos_${i}`]) {
                      const errs = { ...fieldErrors };
                      delete errs[`pos_${i}`];
                      setFieldErrors(errs);
                    }
                  }}
                  placeholder={POSITIVE_PLACEHOLDERS[i]}
                  className={`w-full px-3 py-2 rounded-md bg-editor border text-sm text-editor-foreground font-mono focus:outline-none focus:ring-1 focus:ring-ring ${
                    fieldErrors[`pos_${i}`] ? 'border-destructive' : 'border-border'
                  }`}
                />
                {fieldErrors[`pos_${i}`] && (
                  <p className="text-xs text-destructive mt-1">{fieldErrors[`pos_${i}`]}</p>
                )}
              </div>
            ))}
          </div>
          {sectionWarnings.positive && (
            <div className="flex items-start gap-2 mt-2 text-xs text-secondary">
              <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span>{sectionWarnings.positive}</span>
            </div>
          )}
        </div>

        {/* Should NOT Trigger section */}
        <div>
          <h3 className="text-sm font-semibold text-destructive mb-3 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-destructive/20 text-xs">❌</span>
            Should NOT Trigger
          </h3>
          <div className="space-y-2">
            {shouldNotTrigger.map((q, i) => (
              <div key={i}>
                <input
                  value={q}
                  onChange={e => {
                    const next = [...shouldNotTrigger];
                    next[i] = e.target.value;
                    setShouldNotTrigger(next);
                    if (fieldErrors[`neg_${i}`]) {
                      const errs = { ...fieldErrors };
                      delete errs[`neg_${i}`];
                      setFieldErrors(errs);
                    }
                  }}
                  placeholder={NEGATIVE_PLACEHOLDERS[i]}
                  className={`w-full px-3 py-2 rounded-md bg-editor border text-sm text-editor-foreground font-mono focus:outline-none focus:ring-1 focus:ring-ring ${
                    fieldErrors[`neg_${i}`] ? 'border-destructive' : 'border-border'
                  }`}
                />
                {fieldErrors[`neg_${i}`] && (
                  <p className="text-xs text-destructive mt-1">{fieldErrors[`neg_${i}`]}</p>
                )}
              </div>
            ))}
          </div>
          {sectionWarnings.negative && (
            <div className="flex items-start gap-2 mt-2 text-xs text-secondary">
              <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span>{sectionWarnings.negative}</span>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Run Tests button */}
        {!evalResult && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running trigger simulation against Clara's Skill description...
              </>
            ) : (
              'Run Tests'
            )}
          </button>
        )}

        {/* Results */}
        {showResults && evalResult && (
          <div className="space-y-4">
            {/* Trigger Results */}
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h4 className="text-sm font-semibold text-foreground">Trigger Results</h4>
              </div>
              <div className="divide-y divide-border">
                <AnimatePresence>
                  {evalResult.results.map((r, i) => (
                    i < visibleRows && (
                      <motion.div
                        key={r.query_number}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`px-4 py-3 text-sm ${
                          r.correct ? 'bg-[hsl(142_71%_45%/0.05)]' : 'bg-[hsl(0_84%_60%/0.05)]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {r.correct ? (
                              <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />
                            ) : (
                              <XCircle className="h-4 w-4 text-destructive" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-foreground font-mono text-xs truncate">
                              <span className="text-muted-foreground">#{r.query_number}</span>{' '}
                              {r.query_text}
                            </p>
                            <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                              <span>Expected: <span className={r.expected ? 'text-[hsl(var(--success))]' : 'text-destructive'}>{r.expected ? 'Should trigger' : 'Should NOT trigger'}</span></span>
                              <span>Actual: <span className={r.triggered ? 'text-[hsl(var(--success))]' : 'text-destructive'}>{r.triggered ? 'Triggered' : 'Did not trigger'}</span></span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  ))}
                </AnimatePresence>
              </div>
              <div className="px-4 py-3 border-t border-border bg-muted/30">
                <p className="text-sm font-semibold text-foreground">
                  {evalResult.trigger_score}/10 tests passed
                </p>
              </div>
            </div>

            {/* Suite Quality */}
            <div className="rounded-lg border border-border bg-card p-4 space-y-2">
              <h4 className="text-sm font-semibold text-foreground mb-2">Suite Quality</h4>
              <div className="flex items-center gap-2 text-sm">
                {evalResult.suite_quality.diverse_positive ? (
                  <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
                <span className="text-muted-foreground">Diverse positive queries</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {evalResult.suite_quality.tricky_negatives ? (
                  <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
                <span className="text-muted-foreground">Tricky negative queries</span>
              </div>
              {evalResult.suite_quality.missing_scenarios?.length > 0 && (
                <div className="mt-2 pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Missing scenarios:</p>
                  {evalResult.suite_quality.missing_scenarios.map((s, i) => (
                    <p key={i} className="text-xs text-muted-foreground italic ml-2">• {s}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Feedback */}
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">{evalResult.feedback}</p>
              </div>
            </div>

            {/* XP Summary */}
            {(() => {
              const score = evalResult.trigger_score;
              const info = getXPInfo(score);
              const passed = score >= 5;
              return (
                <div className="rounded-lg border border-border bg-card p-4 text-center space-y-3">
                  {passed ? (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Score multiplier: <span className="text-primary font-bold">{info.multiplier}</span>
                      </p>
                      <p className="text-2xl font-display font-bold text-primary" style={{ textShadow: '0 0 20px hsl(18 100% 60% / 0.4)' }}>
                        +{info.xp} XP
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-destructive font-semibold">
                      Below 5/10 — must retry to advance
                    </p>
                  )}
                  <div className="flex gap-3 justify-center">
                    {!passed && (
                      <button
                        onClick={() => {
                          setEvalResult(null);
                          setShowResults(false);
                          setError(null);
                        }}
                        className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                      >
                        Try Again
                      </button>
                    )}
                    {passed && score < 10 && (
                      <button
                        onClick={() => {
                          setEvalResult(null);
                          setShowResults(false);
                          setError(null);
                        }}
                        className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Try Again for More XP
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
