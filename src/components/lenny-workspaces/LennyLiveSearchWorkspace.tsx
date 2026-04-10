import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Search, CheckCircle2, ChevronRight, RotateCcw, XCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { PlaybookSection } from '@/context/LennyCourseContext';
import { lennySearch, synthesizeSection } from '@/lib/lennyLayer2Evaluator';
import { toast } from '@/hooks/use-toast';
import mission5Data from '@/data/lenny/mission_5_playbooks.json';

type Stage = 'configure' | 'results' | 'synthesized';
type SourceOption = 'newsletter' | 'podcast' | 'both';
type ThresholdOption = 'strict' | 'medium' | 'loose';

const THRESHOLD_MAP: Record<ThresholdOption, number> = {
  strict: 0.55,
  medium: 0.45,
  loose: 0.35,
};

const PLAYBOOK_SECTIONS: Record<string, Array<{ title: string; suggestedQuery: string }>> = {
  product_strategy: [
    { title: 'Frameworks for Product Strategy', suggestedQuery: 'product strategy frameworks best practices' },
    { title: 'Common Product Strategy Mistakes', suggestedQuery: 'product strategy mistakes pitfalls' },
    { title: 'Product Strategy Examples from Tech Companies', suggestedQuery: 'product strategy real company examples' },
  ],
  user_research: [
    { title: 'User Research Methods and Frameworks', suggestedQuery: 'user research methods frameworks' },
    { title: 'Customer Discovery Mistakes to Avoid', suggestedQuery: 'customer discovery interview mistakes' },
    { title: 'User Research Case Studies', suggestedQuery: 'user research case study company example' },
  ],
  plg: [
    { title: 'PLG Readiness Framework and Requirements', suggestedQuery: 'product led growth readiness framework' },
    { title: 'Common PLG Pitfalls and Mistakes', suggestedQuery: 'PLG implementation mistakes pitfalls' },
    { title: 'B2B Company PLG Transition Examples', suggestedQuery: 'B2B company PLG transition example' },
  ],
  metrics: [
    { title: 'Product Metrics Frameworks and North Star', suggestedQuery: 'product metrics north star framework' },
    { title: 'Metrics Mistakes and Vanity Metrics', suggestedQuery: 'product metrics mistakes vanity metrics' },
    { title: 'Product Metrics Examples from Successful Companies', suggestedQuery: 'product metrics examples successful companies' },
  ],
  onboarding: [
    { title: 'User Onboarding Best Practices and Frameworks', suggestedQuery: 'user onboarding best practices activation' },
    { title: 'Onboarding Mistakes and Low Activation', suggestedQuery: 'onboarding mistakes low activation rate' },
    { title: 'Onboarding Improvement Case Studies', suggestedQuery: 'onboarding improvement case study activation' },
  ],
};

interface SearchResult {
  text: string;
  source: string;
  chunk_type: string;
  content_type: string;
  similarity: number;
}

interface EvalResult {
  synthesis: string;
  criteria: Array<{ name: string; passed: boolean; detail: string }>;
  score: number;
  maxScore: number;
  feedback: string;
}

interface Props {
  selectedTopic: string;
  onComplete: (score: number, maxScore: number) => void;
  onSectionComplete: (section: PlaybookSection) => void;
}

function getPrebuiltSections(topic: string, excludeIndex: number): PlaybookSection[] {
  const topicData = (mission5Data as any).topics?.[topic];
  if (!topicData?.sections) return [];
  return topicData.sections
    .map((s: any, i: number) => ({ s, i }))
    .filter(({ i }: { i: number }) => i !== excludeIndex)
    .map(({ s }: { s: any }) => ({
      title: s.title,
      query: s.suggested_query ?? '',
      sourceFilter: 'both' as SourceOption,
      threshold: 0.45,
      synthesis: s.content ?? '',
      sources: s.sources_used ?? [],
      explanation: 'Auto-generated from Lenny archive',
    }));
}

function ScoreBar({ score }: { score: number }) {
  const color = score > 0.55 ? 'bg-green-500' : score >= 0.45 ? 'bg-yellow-500' : 'bg-orange-500';
  const widthPct = Math.min(100, Math.round(score * 100));
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-mono font-bold text-foreground">{score.toFixed(2)}</span>
      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${widthPct}%` }} />
      </div>
    </div>
  );
}

export function LennyLiveSearchWorkspace({ selectedTopic, onComplete, onSectionComplete }: Props) {
  const [stage, setStage] = useState<Stage>('configure');
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<SourceOption>('both');
  const [threshold, setThreshold] = useState<ThresholdOption>('medium');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [sourcesUsed, setSourcesUsed] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [retryUsed, setRetryUsed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [synthesisPrompt, setSynthesisPrompt] = useState('');
  const [synthesisLoading, setSynthesisLoading] = useState(false);
  const [evalResult, setEvalResult] = useState<EvalResult | null>(null);
  const [allSections, setAllSections] = useState<PlaybookSection[] | null>(null);
  const sections = PLAYBOOK_SECTIONS[selectedTopic] ?? PLAYBOOK_SECTIONS['product_strategy'];

  const handleSectionSelect = (idx: number) => {
    setSelectedSectionIndex(idx);
    setQuery(sections[idx].suggestedQuery);
  };

  const handleSearch = async () => {
    if (selectedSectionIndex === null || !query.trim()) {
      toast({ title: 'Missing fields', description: 'Pick a section and enter a search query first.', variant: 'destructive' });
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await lennySearch(query, sourceFilter, THRESHOLD_MAP[threshold], selectedTopic);
      setSearchResults((result.results ?? []).slice(0, 6).map((r: any) => ({ ...r, similarity: Number(r.similarity) })));
      setSourcesUsed(result.sources_used ?? []);
      setStage('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryUsed(true);
    setSynthesisPrompt('');
    setStage('configure');
  };

  const handleBuildSection = async () => {
    if (!synthesisPrompt.trim()) {
      toast({ title: 'Write your synthesis prompt first', description: 'Tell the AI how to turn these chunks into a playbook section.', variant: 'destructive' });
      return;
    }
    setError(null);
    setSynthesisLoading(true);
    try {
      const rawChunksText = searchResults
        .map((r, i) => `[${i + 1}] Source: ${r.source}\n${r.text}`)
        .join('\n\n---\n\n');

      const result: EvalResult = await synthesizeSection(synthesisPrompt, selectedTopic, rawChunksText);
      setEvalResult(result);

      const selectedSection = sections[selectedSectionIndex!];
      const userSection: PlaybookSection = {
        title: selectedSection.title,
        query: query.trim(),
        sourceFilter,
        threshold: THRESHOLD_MAP[threshold],
        synthesis: result.synthesis,
        sources: sourcesUsed,
        explanation: '',
      };

      const prebuilt = getPrebuiltSections(selectedTopic, selectedSectionIndex!);
      const full = [userSection, ...prebuilt];
      full.forEach(sec => onSectionComplete(sec));
      setAllSections(full);
      setStage('synthesized');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Synthesis failed. Please try again.');
    } finally {
      setSynthesisLoading(false);
    }
  };


  // ─── STAGE 3: Synthesized ────────────────────────────────────────────────
  if (stage === 'synthesized' && allSections && evalResult) {
    const passed = evalResult.criteria.filter(c => c.passed).length;
    return (
      <div className="flex flex-col gap-5 p-4 overflow-y-auto h-full">
        {/* Section output */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-primary/40 bg-card p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-xs font-bold text-primary uppercase tracking-wide">Your section — built live</span>
          </div>
          <h3 className="font-display font-bold text-foreground mb-3">{allSections[0].title}</h3>
          <div className="prose prose-sm prose-invert max-w-none text-foreground leading-relaxed">
            <ReactMarkdown>{evalResult.synthesis}</ReactMarkdown>
          </div>
          {allSections[0].sources.length > 0 && (
            <div className="pt-3 mt-3 border-t border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-1">Sources ({allSections[0].sources.length}):</p>
              <ul className="space-y-0.5">
                {allSections[0].sources.map((src, j) => (
                  <li key={j} className="text-xs text-muted-foreground">· {src}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        {/* Criteria scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg border border-border bg-card p-4"
        >
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
            How your prompt did — {passed}/{evalResult.maxScore}
          </p>
          <div className="space-y-2">
            {evalResult.criteria.map((c, i) => (
              <div key={i} className="flex items-start gap-2">
                {c.passed
                  ? <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  : <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                }
                <div>
                  <p className="text-xs font-semibold text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
          {evalResult.feedback && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">💡 </span>{evalResult.feedback}
              </p>
            </div>
          )}
        </motion.div>

        {/* Other 2 auto-generated sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg border border-border bg-card p-4"
        >
          <p className="text-xs font-medium text-muted-foreground mb-2">Your other two sections are ready:</p>
          <div className="space-y-1.5">
            {allSections.slice(1).map((sec, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                <span className="text-sm text-foreground">{sec.title}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => onComplete(1, 1)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md border border-primary/40 text-primary font-bold text-sm hover:bg-primary/10 transition-colors"
          >
            Continue to Mission 6 →
          </button>
        </motion.div>
      </div>
    );
  }

  // ─── STAGE 2: Results + Synthesis Prompt ────────────────────────────────
  if (stage === 'results') {
    return (
      <div className="flex flex-col gap-4 p-4 overflow-y-auto h-full">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-semibold text-foreground mb-0.5">
            The pipeline found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
          </p>
          <p className="text-xs text-muted-foreground">
            Query: "{query}" · Source: {sourceFilter === 'both' ? 'Both' : sourceFilter === 'newsletter' ? 'Newsletters' : 'Podcasts'} · Threshold: {threshold.charAt(0).toUpperCase() + threshold.slice(1)}
          </p>
        </motion.div>

        {/* Error banner */}
        {error && (
          <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400">
            {error}{' '}
            <button className="underline font-medium" onClick={() => setError(null)}>Try again</button>
          </div>
        )}

        {/* Chunk cards */}
        <div className="space-y-2">
          {searchResults.map((result, i) => {
            const isNewsletter = result.chunk_type === 'newsletter_section';
            const icon = isNewsletter ? '📰' : '🎙️';
            const preview = result.text.length > 80 ? result.text.slice(0, 80) + '...' : result.text;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-lg border border-border bg-card p-3"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-sm">{icon}</span>
                  <ScoreBar score={result.similarity} />
                </div>
                <p className="text-xs font-semibold text-foreground mb-0.5 truncate">{result.source}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">"{preview}"</p>
              </motion.div>
            );
          })}
        </div>

        {/* Retry button */}
        <div>
          <button
            onClick={handleRetry}
            disabled={retryUsed}
            title={retryUsed ? 'Retry already used' : 'Go back and adjust your settings'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-card text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw className="h-3 w-3" />
            {retryUsed ? 'Retry used' : '← Adjust & retry'}
          </button>
        </div>

        {/* Synthesis prompt */}
        <div className="border-t border-border/50 pt-4">
          <label className="text-xs font-bold text-primary uppercase tracking-wide block mb-1">
            Write your synthesis prompt
          </label>
          <p className="text-xs text-muted-foreground mb-2">
            Tell the AI how to turn these {searchResults.length} chunks into a playbook section. Mission 4 taught you what works.
          </p>
          <textarea
            value={synthesisPrompt}
            onChange={e => setSynthesisPrompt(e.target.value)}
            placeholder="e.g. Create a playbook section from these expert sources. Cite each expert by name. Organize by key themes. When experts disagree, present both views. Keep it under 300 words with clear subheadings."
            disabled={synthesisLoading}
            rows={5}
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 resize-none"
          />
          <button
            onClick={handleBuildSection}
            disabled={synthesisLoading || !synthesisPrompt.trim()}
            className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {synthesisLoading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Building your section...</>
            ) : (
              <>Build my section <ChevronRight className="h-4 w-4" /></>
            )}
          </button>
        </div>
      </div>
    );
  }

  // ─── STAGE 1: Configure ──────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto h-full">
      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400">
          {error}{' '}
          <button className="underline font-medium" onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card p-4 space-y-5">
        {/* Section picker */}
        <div>
          <p className="text-xs font-bold text-primary uppercase tracking-wide mb-2">Pick your section</p>
          <div className="space-y-2">
            {sections.map((sec, idx) => (
              <label
                key={idx}
                className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                  selectedSectionIndex === idx
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <input
                  type="radio"
                  name="section"
                  checked={selectedSectionIndex === idx}
                  onChange={() => handleSectionSelect(idx)}
                  className="mt-0.5 accent-primary"
                />
                <span className="text-sm text-foreground">{sec.title}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-border/50" />

        {/* Query */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Search query</label>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. product strategy frameworks best practices"
            disabled={loading}
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
          />
        </div>

        {/* Source filter */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Source</label>
          <div className="flex gap-2">
            {(['newsletter', 'podcast', 'both'] as SourceOption[]).map(opt => (
              <button
                key={opt}
                onClick={() => setSourceFilter(opt)}
                disabled={loading}
                className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold border transition-colors disabled:opacity-60 ${
                  sourceFilter === opt
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/50'
                }`}
              >
                {opt === 'newsletter' ? 'Newsletters' : opt === 'podcast' ? 'Podcasts' : 'Both'}
              </button>
            ))}
          </div>
        </div>

        {/* Threshold */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Threshold</label>
          <div className="flex gap-2">
            {(['strict', 'medium', 'loose'] as ThresholdOption[]).map(opt => (
              <button
                key={opt}
                onClick={() => setThreshold(opt)}
                disabled={loading}
                className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold border transition-colors disabled:opacity-60 ${
                  threshold === opt
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/50'
                }`}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Search button */}
        <button
          onClick={handleSearch}
          disabled={loading || selectedSectionIndex === null || !query.trim()}
          className="w-full px-4 py-2.5 rounded-md bg-primary text-primary-foreground font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Searching 40,000+ chunks across Lenny's archive...</>
          ) : (
            <><Search className="h-4 w-4" /> Search Lenny's Archive</>
          )}
        </button>
      </div>
    </div>
  );
}
