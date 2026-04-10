import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { MISSION_1_SCENARIOS, MISSION_3_SCENARIOS } from '@/data/lennyLabData';
import mission2Data from '@/data/lenny/mission_2_embeddings.json';

interface Props {
  missionId: number;
  selectedTopic: string;
  onComplete: (score: number, maxScore: number) => void;
}

// ─── Mission 1 ───────────────────────────────────────────────────────────────

function Mission1({ onComplete }: { onComplete: (score: number, maxScore: number) => void }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    let correct = 0;
    MISSION_1_SCENARIOS.forEach(s => {
      const selected = answers[s.id];
      const correctOpt = s.options.find(o => o.correct);
      if (selected === correctOpt?.label) correct++;
    });
    setScore(correct);
    setSubmitted(true);
    if (correct >= 3) {
      onComplete(correct, 4);
    }
  };

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto h-full">
      {MISSION_1_SCENARIOS.map((scenario, i) => (
        <motion.div
          key={scenario.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-lg border border-border bg-card p-4"
        >
          <p className="text-sm text-foreground mb-3 font-medium">Scenario {scenario.id}</p>
          <p className="text-sm text-foreground/70 mb-4 italic">"{scenario.text}"</p>
          <div className="flex flex-col gap-2">
            {scenario.options.map(opt => {
              const isSelected = answers[scenario.id] === opt.label;
              const showResult = submitted;
              let borderClass = 'border-border';
              if (showResult && isSelected && opt.correct) borderClass = 'border-success bg-success/10';
              else if (showResult && isSelected && !opt.correct) borderClass = 'border-destructive bg-destructive/10';
              else if (isSelected) borderClass = 'border-primary';

              return (
                <div
                  key={opt.label}
                  role="button"
                  tabIndex={0}
                  onClick={() => { if (!submitted) setAnswers(a => ({ ...a, [scenario.id]: opt.label })); }}
                  onKeyDown={(e) => { if (!submitted && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setAnswers(a => ({ ...a, [scenario.id]: opt.label })); } }}
                  className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${borderClass} ${submitted ? 'pointer-events-none' : 'hover:border-primary'}`}
                >
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-mono font-bold ${isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground text-muted-foreground'}`}>
                    {opt.label}
                  </span>
                  <span className="text-sm text-foreground">{opt.text}</span>
                  {showResult && isSelected && opt.correct && <CheckCircle2 className="ml-auto h-4 w-4 text-success pop-in" />}
                  {showResult && isSelected && !opt.correct && <XCircle className="ml-auto h-4 w-4 text-destructive pop-in" />}
                </div>
              );
            })}
          </div>
        </motion.div>
      ))}

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border ${score >= 3 ? 'border-success bg-success/10' : 'border-destructive bg-destructive/10'}`}
        >
          <p className="font-bold text-foreground">
            {score}/4 correct {score >= 3 ? '— Passed! ✅' : '— Need 3/4 to pass'}
          </p>
          {score < 3 && (
            <button
              onClick={reset}
              className="mt-2 px-4 py-2 rounded-md bg-card border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Try Again
            </button>
          )}
        </motion.div>
      )}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < 4}
          className="mt-2 px-6 py-3 rounded-md bg-primary text-primary-foreground font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          Check Answers
        </button>
      )}
    </div>
  );
}

// ─── Mission 2 ───────────────────────────────────────────────────────────────

type ResultItem = {
  text: string;
  source: string;
  isRelevant: boolean;
  whyExplanation?: string;
};

const IRRELEVANT_RESULTS: Record<string, Array<{ text: string; source: string }>> = {
  product_strategy: [
    { text: "The most important thing in any negotiation is understanding what the other side truly values. Most people focus on price, but the real leverage comes from understanding priorities.", source: "Salary Negotiation Tips — Lenny's Podcast" },
    { text: "We reorganized the entire engineering team into squads. Each squad has a PM, a designer, and four engineers. The key was giving each squad full ownership of their domain.", source: "Engineering Org Design — Lenny's Podcast" },
  ],
  user_research: [
    { text: "The pricing page is the most important page on your website. It's where intent is highest and where most companies lose their customers with confusing tier structures.", source: "SaaS Pricing Strategies — Lenny's Newsletter" },
    { text: "When I joined as the new VP, the first thing I did was cancel half the meetings. You can't think strategically when your calendar is wall-to-wall syncs.", source: "First 90 Days as VP Product — Lenny's Podcast" },
  ],
  plg: [
    { text: "The best customer support is no customer support. If users need to contact you, something in the product failed. Every support ticket is a product bug.", source: "Customer Support Philosophy — Lenny's Podcast" },
    { text: "We track engineer happiness quarterly. Turns out, the biggest driver isn't compensation — it's whether they feel their work ships and matters to users.", source: "Engineering Culture — Lenny's Podcast" },
  ],
  metrics: [
    { text: "The single best thing you can do for your career is write publicly. It compounds in ways that networking never will. Every post is a permanent asset.", source: "Career Growth Advice — Lenny's Newsletter" },
    { text: "Remote work isn't about where you sit. It's about how you communicate. The best remote teams over-document decisions and under-rely on synchronous meetings.", source: "Remote Work Playbook — Lenny's Podcast" },
  ],
  onboarding: [
    { text: "Technical debt is a strategic choice, not a failure. Early-stage companies SHOULD take on technical debt — the cost of perfect code is missed market windows.", source: "Technical Debt Strategy — Lenny's Podcast" },
    { text: "Brand is what people say about you when you're not in the room. For startups, your brand IS your product experience in the first year. Don't hire a brand team yet.", source: "Brand Strategy for Startups — Lenny's Newsletter" },
  ],
};

function deterministicShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = (seed * (i + 7)) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function Mission2({ selectedTopic, onComplete }: { selectedTopic: string; onComplete: (score: number, maxScore: number) => void }) {
  const topicsData = (mission2Data as any).topics;
  const topicData = topicsData[selectedTopic];

  const [classifications, setClassifications] = useState<Record<number, 'relevant' | 'irrelevant'>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const items = useMemo((): ResultItem[] => {
    if (!topicData?.keyword_matches || !topicData?.semantic_only_matches) return [];
    const keywordItems: ResultItem[] = topicData.keyword_matches.slice(0, 2).map((m: any) => ({
      text: m.text,
      source: m.source,
      isRelevant: true,
    }));
    const semanticItems: ResultItem[] = topicData.semantic_only_matches.slice(0, 2).map((m: any) => ({
      text: m.text,
      source: m.source,
      isRelevant: true,
      whyExplanation: m.why_relevant,
    }));
    const irrelevantData = IRRELEVANT_RESULTS[selectedTopic] || [];
    const irrelevantItems: ResultItem[] = irrelevantData.map((r) => ({
      text: r.text,
      source: r.source,
      isRelevant: false,
    }));
    const seed = selectedTopic.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return deterministicShuffle([...keywordItems, ...semanticItems, ...irrelevantItems], seed);
  }, [selectedTopic, topicData]);

  if (!topicData?.keyword_matches) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        No embedding data found for this topic. Please try a different topic.
      </div>
    );
  }

  const handleClassify = (idx: number, val: 'relevant' | 'irrelevant') => {
    if (!submitted) setClassifications(c => ({ ...c, [idx]: val }));
  };

  const handleSubmit = () => {
    let correct = 0;
    items.forEach((item, idx) => {
      const chosen = classifications[idx];
      if ((chosen === 'relevant' && item.isRelevant) || (chosen === 'irrelevant' && !item.isRelevant)) {
        correct++;
      }
    });
    setScore(correct);
    setSubmitted(true);
    if (correct >= 4) onComplete(correct, 6);
  };

  const reset = () => {
    setClassifications({});
    setSubmitted(false);
    setScore(0);
  };

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto h-full">
      <p className="text-sm text-muted-foreground">
        6 search results from Lenny's archive on your topic. Some are genuinely relevant. Some are the embedding making a wrong connection. Classify each.
      </p>

      {items.map((item, idx) => {
        const chosen = classifications[idx];
        const isCorrect = submitted && ((chosen === 'relevant' && item.isRelevant) || (chosen === 'irrelevant' && !item.isRelevant));
        const isWrong = submitted && !!chosen && !isCorrect;

        let cardClass = 'border-border bg-card';
        if (submitted && isCorrect) cardClass = 'border-success bg-success/10';
        if (submitted && isWrong) cardClass = 'border-destructive bg-destructive/10';

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className={`rounded-lg border p-4 ${cardClass}`}
          >
            <p className="text-sm text-foreground/80 italic mb-2">
              "{item.text.length > 220 ? item.text.slice(0, 220) + '…' : item.text}"
            </p>
            <p className="text-xs text-muted-foreground mb-3">— {item.source}</p>

            {!submitted && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleClassify(idx, 'relevant')}
                  className={`flex-1 px-3 py-2 rounded-md border text-sm font-medium transition-colors ${chosen === 'relevant' ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary text-muted-foreground'}`}
                >
                  Relevant ✓
                </button>
                <button
                  onClick={() => handleClassify(idx, 'irrelevant')}
                  className={`flex-1 px-3 py-2 rounded-md border text-sm font-medium transition-colors ${chosen === 'irrelevant' ? 'border-destructive bg-destructive/10 text-destructive' : 'border-border hover:border-destructive text-muted-foreground'}`}
                >
                  Irrelevant ✗
                </button>
              </div>
            )}

            {submitted && (
              <div className="mt-2 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  {isCorrect && <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />}
                  {isWrong && <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />}
                  <span className="text-xs font-semibold text-foreground">
                    {item.isRelevant ? 'Relevant' : 'Irrelevant'} — {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                {isWrong && item.isRelevant && item.whyExplanation && (
                  <p className="text-xs text-muted-foreground">{item.whyExplanation}</p>
                )}
                {isWrong && !item.isRelevant && (
                  <p className="text-xs text-muted-foreground">This result is about a different topic. The embedding matched on a surface-level word, not the main concept you searched for.</p>
                )}
              </div>
            )}
          </motion.div>
        );
      })}

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border ${score >= 4 ? 'border-success bg-success/10' : 'border-destructive bg-destructive/10'}`}
        >
          <p className="font-bold text-foreground">
            {score}/6 correct {score >= 4 ? '— Passed! ✅' : '— Need 4/6 to pass'}
          </p>
          {score < 4 && (
            <button
              onClick={reset}
              className="mt-2 px-4 py-2 rounded-md bg-card border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Try Again
            </button>
          )}
        </motion.div>
      )}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(classifications).length < 6}
          className="mt-2 px-6 py-3 rounded-md bg-primary text-primary-foreground font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          Submit Classifications
        </button>
      )}
    </div>
  );
}

// ─── Mission 3 ───────────────────────────────────────────────────────────────

function Mission3({ onComplete }: { onComplete: (score: number, maxScore: number) => void }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    let correct = 0;
    MISSION_3_SCENARIOS.forEach(s => {
      const selected = answers[s.id];
      const correctOpt = s.options.find(o => o.correct);
      if (selected === correctOpt?.label) correct++;
    });
    setScore(correct);
    setSubmitted(true);
    if (correct >= 3) {
      onComplete(correct, 4);
    }
  };

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto h-full">
      {MISSION_3_SCENARIOS.map((scenario, i) => (
        <motion.div
          key={scenario.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-lg border border-border bg-card p-4"
        >
          <p className="text-sm text-foreground mb-3 font-medium">Scenario {scenario.id}</p>
          <p className="text-sm text-foreground/70 mb-4">
            {scenario.text.split(/\*\*(.*?)\*\*/g).map((part, j) =>
              j % 2 === 1 ? <strong key={j}>{part}</strong> : part
            )}
          </p>
          <div className="flex flex-col gap-2">
            {scenario.options.map(opt => {
              const isSelected = answers[scenario.id] === opt.label;
              let borderClass = 'border-border';
              if (submitted && isSelected && opt.correct) borderClass = 'border-success bg-success/10';
              else if (submitted && isSelected && !opt.correct) borderClass = 'border-destructive bg-destructive/10';
              else if (isSelected) borderClass = 'border-primary';

              return (
                <div
                  key={opt.label}
                  role="button"
                  tabIndex={0}
                  onClick={() => { if (!submitted) setAnswers(a => ({ ...a, [scenario.id]: opt.label })); }}
                  onKeyDown={(e) => { if (!submitted && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setAnswers(a => ({ ...a, [scenario.id]: opt.label })); } }}
                  className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${borderClass} ${submitted ? 'pointer-events-none' : 'hover:border-primary'}`}
                >
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-mono font-bold ${isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground text-muted-foreground'}`}>
                    {opt.label}
                  </span>
                  <span className="text-sm text-foreground">{opt.text}</span>
                  {submitted && isSelected && opt.correct && <CheckCircle2 className="ml-auto h-4 w-4 text-success pop-in" />}
                  {submitted && isSelected && !opt.correct && <XCircle className="ml-auto h-4 w-4 text-destructive pop-in" />}
                </div>
              );
            })}
          </div>
        </motion.div>
      ))}

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border ${score >= 3 ? 'border-success bg-success/10' : 'border-destructive bg-destructive/10'}`}
        >
          <p className="font-bold text-foreground">
            {score}/4 correct {score >= 3 ? '— Passed! ✅' : '— Need 3/4 to pass'}
          </p>
          {score < 3 && (
            <button
              onClick={reset}
              className="mt-2 px-4 py-2 rounded-md bg-card border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Try Again
            </button>
          )}
        </motion.div>
      )}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < 4}
          className="mt-2 px-6 py-3 rounded-md bg-primary text-primary-foreground font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          Check Answers
        </button>
      )}
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function LennyMultipleChoiceWorkspace({ missionId, selectedTopic, onComplete }: Props) {
  if (missionId === 1) {
    return <Mission1 onComplete={onComplete} />;
  }
  if (missionId === 2) {
    return <Mission2 selectedTopic={selectedTopic} onComplete={onComplete} />;
  }
  if (missionId === 3) {
    return <Mission3 onComplete={onComplete} />;
  }
  return <div className="p-4 text-sm text-muted-foreground">Unknown mission: {missionId}</div>;
}
