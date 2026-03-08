import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, AlertTriangle, RotateCcw, ChevronDown, ChevronRight, MessageSquare } from 'lucide-react';
import { useCourse } from '@/context/CourseContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface CriterionResult {
  name: string;
  passed: boolean;
  detail: string;
}

interface InputResult {
  title: string;
  output: string;
  criteria: CriterionResult[];
  score: number;
}

interface EvalResult {
  input_1: InputResult;
  input_2: InputResult;
  input_3: InputResult;
  total_score: number;
  max_score: number;
  feedback: string;
}

interface Props {
  onComplete: (score: number, maxScore: number) => void;
  onWorkUpdate: (work: string) => void;
}

const MESSY_INPUTS = [
  {
    id: 1,
    title: 'The Run-On Ramble',
    type: 'Leadership Sync',
    borderColor: 'border-l-orange-500',
    badgeColor: 'bg-orange-500/10 text-orange-400',
    text: `talked to marketing today. they want to redo the landing page AND the pricing page but cant agree on timeline. lisa thinks 2 weeks, dev says 4. probably should figure that out. oh and compliance needs the privacy policy updated before we launch anything public-facing. thats probably most urgent actually. also someone remind me to cancel the old analytics subscription its costing us like $500/mo for nothing.`,
  },
  {
    id: 2,
    title: 'The Abbreviation Fest',
    type: 'Engineering Standup',
    borderColor: 'border-l-yellow-500',
    badgeColor: 'bg-yellow-500/10 text-yellow-400',
    text: `eng sync re: API perf issues
- J will own the db query optimization, ETA tbd
- M to check w/ infra on caching layer, prob by EOW
- need to loop in S from security for the auth token thing asap
- also FYI the staging env is down again, not blocking but annoying
- AI: revisit rate limiting strategy next sprint`,
  },
  {
    id: 3,
    title: 'The Contradiction',
    type: 'Product Review',
    borderColor: 'border-l-red-500',
    badgeColor: 'bg-red-500/10 text-red-400',
    text: `Product review meeting 3/7:
- Homepage hero section: T will take the first pass at copy. Actually wait, S said she already started on this. Let T and S figure out who's owning it.
- Mobile nav: Everyone agrees it's broken. Priority is high but we don't have bandwidth until next sprint. Mark it as P1 but no action until sprint 14.
- Analytics dashboard: "Would be nice to have real-time data" per J. Not a priority. Or actually, if the client demo goes well Thursday it might become urgent. Let's revisit after the demo.`,
  },
];

const SOLUTION_HINT = `## Handling Abbreviations
- Common abbreviations: EOW = End of Week, TBD = To Be Determined, EOD = End of Day, ASAP = As Soon As Possible
- Single letters (J, M, S, T, P) are likely name initials — keep as-is if full name isn't available
- "AI:" at the start of a line typically means "Action Item", not Artificial Intelligence
- "FYI" = informational only, NOT an action item
- "re:" = regarding/about, provides context

## Handling Ambiguous Ownership
- "someone should..." / "we need to..." = Owner: Unassigned
- "let X and Y figure it out" = Owner: X & Y (Needs Resolution)
- Implied self-assignment ("remind me to...") = Owner: note-taker/author

## Handling Contradictions
- If ownership is disputed, list both parties and flag as "Ownership: Needs Resolution"
- If priority changes mid-note ("not a priority... or actually it might be urgent"), flag as "Priority: Conditional" with the condition noted

## Handling Non-Actions
- "FYI" items = skip, or list separately as "Informational"
- Status updates with no action needed = skip
- Decisions without follow-up tasks = skip
- "not blocking" / "nothing to do right now" = skip`;

export function MessyInputsWorkspace({ onComplete, onWorkUpdate }: Props) {
  const { state } = useCourse();
  const module4Work = state.modules[3]?.userWork || '';
  const module6State = state.modules[5];

  const [code, setCode] = useState(() => module6State?.userWork?.trim() ? module6State.userWork : module4Work);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set([1, 2, 3]));
  const [attempts, setAttempts] = useState(module6State?.attempts || 0);
  const [layer1Results, setLayer1Results] = useState<{ check: string; passed: boolean; message: string }[] | null>(null);
  const [evalResult, setEvalResult] = useState<EvalResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passed, setPassed] = useState(false);
  const [expandedResults, setExpandedResults] = useState<Set<number>>(new Set([1, 2, 3]));
  const [showSolution, setShowSolution] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const toggleCard = (id: number) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleResult = (id: number) => {
    setExpandedResults(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
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

  const validateLayer1 = () => {
    const lower = code.toLowerCase();
    const isModified = code.trim() !== module4Work.trim();

    // Check for at least 2 keyword categories
    const categories = [
      /abbreviat|initial|shorthand/i,
      /unassigned|unclear\s+owner|no\s+owner|ambiguous/i,
      /implied|indirect|suggest/i,
      /contradict|conflict|disagree|figure\s+out/i,
    ];
    const matchedCategories = categories.filter(r => r.test(code)).length;

    return [
      { check: 'At least 300 characters', passed: code.length >= 300, message: 'Instructions should be at least 300 characters to handle messy inputs' },
      { check: 'Modified from Module 4', passed: isModified, message: "Your instructions haven't changed from Module 4. Read through Clara's messy inputs above — what would break?" },
      { check: 'Handles 2+ messy input categories', passed: matchedCategories >= 2, message: 'Address at least 2 of: abbreviations, ambiguous ownership, implied actions, contradictions' },
    ];
  };

  const handleSubmit = async () => {
    if (attempts >= 3 && !passed) return;

    const l1 = validateLayer1();
    setLayer1Results(l1);
    setEvalResult(null);
    setError(null);

    if (!l1.every(r => r.passed)) {
      toast({
        title: 'Fix structural checks first',
        description: 'Update the failed checks, then try again.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const currentAttempt = attempts + 1;

    try {
      const { data, error: fnError } = await supabase.functions.invoke('evaluate-messy-inputs', {
        body: { instructions: code },
      });

      if (fnError) throw new Error(fnError.message || 'Evaluation failed');
      if (data?.error) throw new Error(data.error);

      const evalData = data as EvalResult;
      setEvalResult(evalData);
      setLoading(false);
      setAttempts(currentAttempt);

      if (evalData.total_score >= 5) {
        setPassed(true);
      }

      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 300);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(message);
      toast({
        title: "Claude took too long",
        description: "This doesn't count as an attempt — try again.",
        variant: 'destructive',
      });
      setLoading(false);
      // Don't count failed API calls as attempts
    }
  };

  const getXPForScore = (score: number) => {
    if (score >= 11) return 400;
    if (score >= 9) return 340;
    if (score >= 7) return 280;
    if (score >= 5) return 220;
    return 0;
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 3) return 'text-green-400 bg-green-500/10';
    if (score === 2) return 'text-yellow-400 bg-yellow-500/10';
    return 'text-red-400 bg-red-500/10';
  };

  const handleComplete = () => {
    if (evalResult) {
      onComplete(evalResult.total_score, 12);
    }
  };

  const handleForceComplete = () => {
    // Award minimum XP when all attempts used
    onComplete(5, 12);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {/* TOP: Clara's Messy Inputs */}
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            📋 Clara's Messy Inputs
            <span className="text-xs text-muted-foreground font-normal">(click to collapse)</span>
          </h3>
          <div className="space-y-2">
            {MESSY_INPUTS.map(input => (
              <div key={input.id} className={`rounded-lg border border-border bg-card overflow-hidden border-l-4 ${input.borderColor}`}>
                <button
                  onClick={() => toggleCard(input.id)}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {expandedCards.has(input.id) ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${input.badgeColor}`}>
                      {input.title}
                    </span>
                    <span className="text-xs text-muted-foreground">{input.type}</span>
                  </div>
                </button>
                <AnimatePresence>
                  {expandedCards.has(input.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 pb-3">
                        <pre className="text-xs text-muted-foreground leading-relaxed font-mono whitespace-pre-wrap bg-muted/30 rounded-md p-3">
                          {input.text}
                        </pre>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* MIDDLE: Code Editor */}
        <div className="p-4">
          <div className={`rounded-lg border border-border bg-editor overflow-hidden transition-opacity ${loading ? 'opacity-60 pointer-events-none' : ''}`}>
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-secondary/60" />
              <div className="w-3 h-3 rounded-full bg-primary/60" />
              <span className="ml-2 text-xs text-muted-foreground font-mono">SKILL.md — Your Instructions</span>
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={e => {
                const v = e.target.value;
                setCode(v);
                onWorkUpdate(v);
                if (layer1Results || evalResult || error) {
                  setLayer1Results(null);
                  setEvalResult(null);
                  setError(null);
                }
              }}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="Your instructions from Module 4 are pre-loaded above. Edit them to handle Clara's messy inputs..."
              className="w-full min-h-[250px] p-4 bg-editor text-editor-foreground font-mono text-sm leading-relaxed resize-y focus:outline-none placeholder:text-muted-foreground/40 code-editor disabled:cursor-not-allowed"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Layer 1 Results */}
        {layer1Results && (
          <div className="px-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-border bg-card p-4 mb-4">
              <p className="font-semibold text-foreground mb-3 text-sm">Structural Checks</p>
              <div className="space-y-2">
                {layer1Results.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    {r.passed ? <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" /> : <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />}
                    <div>
                      <span className={r.passed ? 'text-foreground' : 'text-destructive'}>{r.check}</span>
                      {!r.passed && <p className="text-xs text-muted-foreground mt-0.5">{r.message}</p>}
                    </div>
                  </div>
                ))}
              </div>
              {layer1Results.every(r => r.passed) && loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center justify-center gap-2 py-3 rounded-md bg-primary/5 border border-primary/20">
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                  <span className="text-xs font-semibold text-primary">Testing your instructions against Clara's 3 worst meeting dumps... Attempt {attempts + 1} of 3</span>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}

        {/* Layer 2 Results */}
        {evalResult && (
          <div ref={resultsRef} className="px-4 pb-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              {/* Per-input results */}
              {(['input_1', 'input_2', 'input_3'] as const).map((key, idx) => {
                const inputResult = evalResult[key];
                const inputMeta = MESSY_INPUTS[idx];
                return (
                  <div key={key} className={`rounded-lg border border-border bg-card overflow-hidden border-l-4 ${inputMeta.borderColor}`}>
                    <button
                      onClick={() => toggleResult(idx + 1)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {expandedResults.has(idx + 1) ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                        <span className="text-sm font-semibold text-foreground">{inputResult.title}</span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getScoreBadgeColor(inputResult.score)}`}>
                        {inputResult.score}/4
                      </span>
                    </button>
                    <AnimatePresence>
                      {expandedResults.has(idx + 1) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-4 pb-4 space-y-3">
                            {/* Claude's output */}
                            <div className="rounded-md bg-muted/30 p-3">
                              <p className="text-xs font-semibold text-muted-foreground mb-2">Claude's Output</p>
                              <pre className="text-xs text-foreground/90 leading-relaxed font-mono whitespace-pre-wrap">
                                {inputResult.output}
                              </pre>
                            </div>
                            {/* Criteria */}
                            <div className="space-y-1.5">
                              {inputResult.criteria.map((c, ci) => (
                                <div key={ci} className={`flex items-start gap-2 text-xs rounded-md p-2 ${c.passed ? 'bg-primary/5' : 'bg-destructive/5'}`}>
                                  {c.passed ? <CheckCircle2 className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" /> : <XCircle className="h-3.5 w-3.5 text-destructive mt-0.5 flex-shrink-0" />}
                                  <div>
                                    <span className={c.passed ? 'text-foreground' : 'text-destructive'}>{c.name}</span>
                                    <span className="text-muted-foreground ml-1">— {c.detail}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* Total score */}
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Total Score</p>
                  <p className={`text-3xl font-display font-bold ${evalResult.total_score >= 5 ? 'text-primary' : 'text-destructive'}`}>
                    {evalResult.total_score}/12 <span className="text-sm font-normal text-muted-foreground">criteria passed</span>
                  </p>
                </div>

                {/* Feedback */}
                {evalResult.feedback && (
                  <div className="p-3 rounded-md bg-secondary/10 border border-secondary/20 mb-4">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-foreground/80 leading-relaxed">{evalResult.feedback}</p>
                    </div>
                  </div>
                )}

                {/* XP earned */}
                {evalResult.total_score >= 5 && (
                  <div className="text-center mb-4">
                    <p className="font-mono text-2xl font-extrabold text-primary" style={{ textShadow: '0 0 20px hsl(18 100% 60% / 0.4)' }}>
                      +{getXPForScore(evalResult.total_score)} XP
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {evalResult.total_score >= 11 ? '2.0× multiplier' : evalResult.total_score >= 9 ? '1.7× multiplier' : evalResult.total_score >= 7 ? '1.4× multiplier' : '1.1× multiplier'}
                    </p>
                  </div>
                )}

                {/* Actions */}
                {evalResult.total_score >= 5 ? (
                  <div className="space-y-2">
                    <button onClick={handleComplete} className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
                      Next Module →
                    </button>
                    {evalResult.total_score < 12 && attempts < 3 && (
                      <button
                        onClick={() => { setEvalResult(null); setLayer1Results(null); }}
                        className="w-full px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Revise for More XP (Attempt {attempts} of 3 used)
                      </button>
                    )}
                  </div>
                ) : attempts >= 3 ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      You've used all 3 attempts. Here's what would make Clara's Skill handle these inputs:
                    </p>
                    <div className="rounded-md bg-muted/30 p-3">
                      <pre className="text-xs text-foreground/80 leading-relaxed font-mono whitespace-pre-wrap">{SOLUTION_HINT}</pre>
                    </div>
                    <button onClick={handleForceComplete} className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
                      Continue with 220 XP →
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-destructive font-semibold text-sm mb-2">
                      Need at least 5/12 to pass. Revise your instructions and try again.
                    </p>
                    <button
                      onClick={() => { setEvalResult(null); setLayer1Results(null); }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:opacity-80 transition-opacity"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Revise & Try Again (Attempt {attempts} of 3 used)
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="px-4 pb-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-destructive">Claude took too long</p>
                  <p className="text-xs text-muted-foreground mt-1">This doesn't count as an attempt — try again.</p>
                  <button onClick={handleSubmit} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:opacity-80 transition-opacity">
                    <RotateCcw className="h-3.5 w-3.5" /> Try again
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Solution shown when all attempts used */}
        {showSolution && (
          <div className="px-4 pb-4">
            <div className="rounded-md bg-muted/30 p-3 border border-border">
              <pre className="text-xs text-foreground/80 leading-relaxed font-mono whitespace-pre-wrap">{SOLUTION_HINT}</pre>
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      {!passed && !evalResult && (
        <div className="p-4 border-t border-border flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-mono">Attempt {Math.min(attempts + 1, 3)} of 3</span>
            {attempts >= 3 && <span className="text-xs text-destructive">All attempts used</span>}
          </div>
          <button
            onClick={handleSubmit}
            disabled={code.trim().length === 0 || loading || (attempts >= 3 && !passed)}
            className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Testing...</> : '🧪 Test Against All 3 Inputs'}
          </button>
          {layer1Results?.some(r => !r.passed) && (
            <p className="mt-2 text-xs text-destructive">Fix the structural checks above, then try again.</p>
          )}
        </div>
      )}
    </div>
  );
}
