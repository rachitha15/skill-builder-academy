import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Rocket, CheckCircle2, XCircle, Loader2, ChevronDown, FlaskConical } from 'lucide-react';
import { useCourse } from '@/context/CourseContext';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface ShipItWorkspaceProps {
  onComplete: (score: number, maxScore: number) => void;
  onWorkUpdate: (work: string) => void;
}

const CHECKLIST_ITEMS = [
  'Frontmatter has correct --- delimiters',
  'Name is kebab-case',
  'Description includes WHAT and WHEN',
  'Instructions have numbered steps',
  'Output format is defined',
  'Edge cases are handled',
  'At least one example is included',
];

interface CriterionResult {
  name: string;
  passed: boolean;
  detail: string;
}

export function ShipItWorkspace({ onComplete, onWorkUpdate }: ShipItWorkspaceProps) {
  const { state } = useCourse();

  // Assemble initial content
  const assembleContent = () => {
    const frontmatter = state.modules[2]?.userWork || '';
    const instructions = state.modules[5]?.userWork || state.modules[3]?.userWork || '';
    if (frontmatter && instructions) return `${frontmatter}\n\n${instructions}`;
    if (frontmatter) return frontmatter;
    if (instructions) return instructions;
    return '';
  };

  const moduleState = state.modules[6];
  const [code, setCode] = useState(moduleState?.userWork?.trim() ? moduleState.userWork : assembleContent());
  const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(7).fill(false));
  const [loading, setLoading] = useState(false);
  const [layer1Results, setLayer1Results] = useState<{ check: string; passed: boolean }[] | null>(null);
  const [testResult, setTestResult] = useState<{
    output: string;
    criteria: CriterionResult[];
    score: number;
    passed: boolean;
    feedback: string;
  } | null>(null);
  const [passed, setPassed] = useState(moduleState?.status === 'completed');

  // Try your own notes
  const [tryOpen, setTryOpen] = useState(false);
  const [userNotes, setUserNotes] = useState('');
  const [tryLoading, setTryLoading] = useState(false);
  const [tryOutput, setTryOutput] = useState('');

  useEffect(() => {
    onWorkUpdate(code);
  }, [code]);

  const checkedCount = checkedItems.filter(Boolean).length;

  const runLayer1 = (): { check: string; passed: boolean }[] => {
    const checks = [
      { check: 'At least 500 characters', passed: code.length >= 500 },
      { check: 'Contains --- delimiters', passed: /^---\s/m.test(code) && (code.match(/^---/gm) || []).length >= 2 },
      { check: 'Contains name: field', passed: /name:/i.test(code) },
      { check: 'Contains description: field', passed: /description:/i.test(code) },
      { check: 'Has numbered steps', passed: /\d+\.\s/m.test(code) },
      { check: 'Handles edge cases', passed: /edge case|if no|unassigned|missing|ambiguous|unclear/i.test(code) },
    ];
    return checks;
  };

  const handleRunFinalTest = async () => {
    setTestResult(null);
    setLayer1Results(null);

    const l1 = runLayer1();
    setLayer1Results(l1);

    if (l1.some(c => !c.passed)) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('evaluate-final', {
        body: { skillmd: code },
      });

      if (error) throw error;

      const result = data as {
        output: string;
        criteria: CriterionResult[];
        score: number;
        passed: boolean;
        feedback: string;
      };

      setTestResult(result);
      if (result.passed || result.score >= 4) {
        setPassed(true);
      }
    } catch (err: any) {
      setTestResult({
        output: '',
        criteria: [],
        score: 0,
        passed: false,
        feedback: `Error: ${err.message || 'Failed to run final test. Please try again.'}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    const zip = new JSZip();
    const folder = zip.folder('meeting-action-extractor');
    folder?.file('SKILL.md', code);
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'meeting-action-extractor.zip');
  };

  const handleComplete = () => {
    // Base 200 XP, +50 first attempt bonus
    const attempts = state.modules[6]?.attempts || 0;
    const bonus = attempts <= 1 ? 50 : 0;
    onComplete(200 + bonus, 250);
  };

  const handleTryNotes = async () => {
    if (!userNotes.trim()) return;
    setTryLoading(true);
    setTryOutput('');
    try {
      const { data, error } = await supabase.functions.invoke('evaluate-final', {
        body: { skillmd: code, userNotes },
      });
      if (error) throw error;
      setTryOutput(data.output || 'No output generated.');
    } catch {
      setTryOutput('Error running your notes. Please try again.');
    } finally {
      setTryLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Section 1: Pre-Ship Checklist */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-foreground text-sm">Pre-Ship Checklist</h3>
          <span className="text-xs text-muted-foreground font-mono">{checkedCount}/7 checked</span>
        </div>
        <div className="space-y-3">
          {CHECKLIST_ITEMS.map((item, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer group">
              <Checkbox
                checked={checkedItems[i]}
                onCheckedChange={(checked) => {
                  const next = [...checkedItems];
                  next[i] = !!checked;
                  setCheckedItems(next);
                }}
              />
              <span className={`text-sm transition-colors ${checkedItems[i] ? 'text-foreground' : 'text-muted-foreground'}`}>
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Section 2: SKILL.md Editor */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-2 border-b border-border bg-muted/30 flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">SKILL.md</span>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full min-h-[300px] p-4 bg-[hsl(var(--editor))] text-[hsl(var(--editor-foreground))] font-mono text-sm leading-relaxed resize-y focus:outline-none"
          spellCheck={false}
        />
      </div>

      {/* Section 3: Controls */}
      <div className="flex gap-3">
        <button
          onClick={handleRunFinalTest}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 rounded-md bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
          {loading ? 'Running Final Test...' : 'Run Final Test'}
        </button>
        <button
          onClick={handleDownload}
          disabled={!passed}
          className="flex items-center gap-2 px-6 py-3 rounded-md border border-border bg-card text-foreground font-bold text-sm hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Download className="h-4 w-4" /> Download Skill
        </button>
      </div>

      {/* Layer 1 Results */}
      <AnimatePresence>
        {layer1Results && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-border bg-card p-5 space-y-2"
          >
            <h4 className="text-sm font-bold text-foreground mb-3">Structural Checks</h4>
            {layer1Results.map((r, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                {r.passed ? <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" /> : <XCircle className="h-4 w-4 text-destructive" />}
                <span className={r.passed ? 'text-muted-foreground' : 'text-destructive'}>{r.check}</span>
              </div>
            ))}
            {layer1Results.some(r => !r.passed) && (
              <p className="text-xs text-destructive mt-2">Fix the failing checks above, then try again.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      {loading && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-5 flex items-center gap-3">
          <Loader2 className="h-5 w-5 text-primary animate-spin" />
          <span className="text-sm text-foreground">Running final test against Clara's unseen notes...</span>
        </div>
      )}

      {/* Test Results */}
      <AnimatePresence>
        {testResult && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Clara's Output */}
            {testResult.output && (
              <div className="rounded-lg border border-border bg-card p-5">
                <h4 className="text-sm font-bold text-foreground mb-3">Clara's Output</h4>
                <div className="bg-[hsl(var(--editor))] rounded-md p-4 text-sm text-[hsl(var(--editor-foreground))] font-mono whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                  {testResult.output}
                </div>
              </div>
            )}

            {/* Criteria */}
            {testResult.criteria?.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-5 space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-foreground">Evaluation Criteria</h4>
                  <span className={`font-mono text-sm font-bold ${testResult.score >= 4 ? 'text-[hsl(var(--success))]' : 'text-destructive'}`}>
                    {testResult.score}/6 passed
                  </span>
                </div>
                {testResult.criteria.map((c, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    {c.passed ? <CheckCircle2 className="h-4 w-4 mt-0.5 text-[hsl(var(--success))] shrink-0" /> : <XCircle className="h-4 w-4 mt-0.5 text-destructive shrink-0" />}
                    <div>
                      <span className={c.passed ? 'text-foreground' : 'text-destructive'}>{c.name}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Feedback */}
            {testResult.feedback && (
              <div className={`rounded-lg border p-4 text-sm ${testResult.passed || testResult.score >= 4 ? 'border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/5 text-foreground' : 'border-destructive/30 bg-destructive/5 text-foreground'}`}>
                {testResult.feedback}
              </div>
            )}

            {/* Pass: show XP + actions */}
            {(testResult.passed || testResult.score >= 4) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <p className="font-mono text-2xl font-extrabold text-primary" style={{ textShadow: '0 0 20px hsl(18 100% 60% / 0.4)' }}>
                    +{(state.modules[6]?.attempts || 0) <= 1 ? 250 : 200} XP
                  </p>
                </div>

                {/* Try Your Own Notes */}
                <Collapsible open={tryOpen} onOpenChange={setTryOpen}>
                  <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full">
                    <FlaskConical className="h-4 w-4" />
                    <span>🧪 Try it with YOUR meeting notes (optional)</span>
                    <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${tryOpen ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3 space-y-3">
                    <Textarea
                      value={userNotes}
                      onChange={(e) => setUserNotes(e.target.value)}
                      placeholder="Paste your own meeting notes here..."
                      className="min-h-[120px] bg-[hsl(var(--editor))] text-[hsl(var(--editor-foreground))] font-mono text-sm border-border"
                    />
                    <button
                      onClick={handleTryNotes}
                      disabled={tryLoading || !userNotes.trim()}
                      className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {tryLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
                      Run My Notes
                    </button>
                    {tryOutput && (
                      <div className="rounded-lg border border-border bg-card p-4">
                        <h4 className="text-sm font-bold text-foreground mb-2">Output</h4>
                        <div className="bg-[hsl(var(--editor))] rounded-md p-4 text-sm text-[hsl(var(--editor-foreground))] font-mono whitespace-pre-wrap">
                          {tryOutput}
                        </div>
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>

                {/* Complete Course button */}
                <div className="flex justify-center pt-2">
                  <button
                    onClick={handleComplete}
                    className="px-8 py-3 rounded-md bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
                  >
                    Complete Course →
                  </button>
                </div>
              </motion.div>
            )}

            {/* Fail: revise button */}
            {!testResult.passed && testResult.score < 4 && (
              <div className="text-center">
                <button
                  onClick={() => { setTestResult(null); setLayer1Results(null); }}
                  className="px-6 py-3 rounded-md border border-border bg-card text-foreground font-bold text-sm hover:bg-muted transition-colors"
                >
                  Revise & Try Again
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
