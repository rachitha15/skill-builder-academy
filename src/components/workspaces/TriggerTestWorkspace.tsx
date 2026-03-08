import { useState } from 'react';
import { motion } from 'framer-motion';
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
      onWorkUpdate(JSON.stringify({ shouldTrigger, shouldNotTrigger }));

      // Don't auto-complete — let user review results and click Continue
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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Should Trigger Results */}
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold text-foreground text-sm">✅ Should Trigger (1–5)</p>
                <span className={`text-sm font-bold font-mono ${
                  evalResult.results.filter((r, i) => i < 5 && r.correct).length >= 4 ? 'text-primary' : 'text-destructive'
                }`}>
                  {evalResult.results.filter((r, i) => i < 5 && r.correct).length}/5 correct
                </span>
              </div>
              <div className="space-y-2">
                {evalResult.results.filter((_, i) => i < 5).map((r, i) => (
                  <motion.div
                    key={r.query_number}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-start gap-2 text-sm rounded-md p-2 ${r.correct ? 'bg-primary/5' : 'bg-destructive/5'}`}
                  >
                    {r.correct ? (
                      <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))] mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground font-mono text-xs">{r.query_text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {r.correct
                          ? 'Correctly triggered'
                          : 'Expected to trigger, but didn\'t — your description may not cover this phrasing'}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Should NOT Trigger Results */}
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold text-foreground text-sm">❌ Should NOT Trigger (6–10)</p>
                <span className={`text-sm font-bold font-mono ${
                  evalResult.results.filter((r, i) => i >= 5 && r.correct).length >= 4 ? 'text-primary' : 'text-destructive'
                }`}>
                  {evalResult.results.filter((r, i) => i >= 5 && r.correct).length}/5 correct
                </span>
              </div>
              <div className="space-y-2">
                {evalResult.results.filter((_, i) => i >= 5).map((r, i) => (
                  <motion.div
                    key={r.query_number}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (i + 5) * 0.1 }}
                    className={`flex items-start gap-2 text-sm rounded-md p-2 ${r.correct ? 'bg-primary/5' : 'bg-destructive/5'}`}
                  >
                    {r.correct ? (
                      <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))] mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground font-mono text-xs">{r.query_text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {r.correct
                          ? 'Correctly ignored'
                          : 'Incorrectly triggered — your description is too broad for this query'}
                      </p>
                    </div>
                  </motion.div>
                ))}
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

            {/* Score + Actions (matching Module 3 pattern) */}
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold text-foreground text-sm">Overall Score</p>
                <span className={`text-sm font-bold font-mono ${evalResult.trigger_score >= 5 ? 'text-primary' : 'text-destructive'}`}>
                  {evalResult.trigger_score}/10 tests passed
                </span>
              </div>

              {evalResult.trigger_score >= 5 ? (
                <div className="space-y-2">
                  <button
                    onClick={() => onComplete(evalResult.trigger_score, 10)}
                    className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    Continue →
                  </button>
                  {evalResult.trigger_score < 10 && (
                    <button
                      onClick={() => {
                        setEvalResult(null);
                        setShowResults(false);
                        setError(null);
                      }}
                      className="w-full px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Try again for more XP
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-destructive font-semibold text-sm mb-3">
                    Need at least 5/10 to pass. Review the feedback above and revise your triggers.
                  </p>
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
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
