import { useState } from 'react';
import { motion } from 'framer-motion';
import { SCENARIOS } from '@/data/courseData';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  onComplete: (score: number, maxScore: number) => void;
}

export function MultipleChoiceWorkspace({ onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    let correct = 0;
    SCENARIOS.forEach(s => {
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
      {SCENARIOS.map((scenario, i) => (
        <motion.div
          key={scenario.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-lg border border-border bg-card p-4"
        >
          <p className="text-sm text-foreground mb-3 font-medium">
            Scenario {scenario.id}
          </p>
          <p className="text-sm text-foreground/70 mb-4 italic">
            "{scenario.text}"
          </p>
          <div className="flex flex-col gap-2">
            {scenario.options.map(opt => {
              const isSelected = answers[scenario.id] === opt.label;
              const showResult = submitted;
              let borderClass = 'border-border';
              if (showResult && isSelected && opt.correct) borderClass = 'border-success bg-success/10';
              else if (showResult && isSelected && !opt.correct) borderClass = 'border-destructive bg-destructive/10';
              else if (showResult && opt.correct) borderClass = 'border-success/50';
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
                  {showResult && opt.correct && (
                    <CheckCircle2 className="ml-auto h-4 w-4 text-success pop-in" />
                  )}
                  {showResult && isSelected && !opt.correct && (
                    <XCircle className="ml-auto h-4 w-4 text-destructive pop-in" />
                  )}
                </label>
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
