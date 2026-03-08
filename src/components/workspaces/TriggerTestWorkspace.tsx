import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { validateTriggers } from '@/lib/validation';
import { ValidationResult } from '@/context/CourseContext';

interface Props {
  onComplete: (score: number, maxScore: number) => void;
  onWorkUpdate: (work: string) => void;
}

export function TriggerTestWorkspace({ onComplete, onWorkUpdate }: Props) {
  const [shouldTrigger, setShouldTrigger] = useState(Array(5).fill(''));
  const [shouldNotTrigger, setShouldNotTrigger] = useState(Array(5).fill(''));
  const [results, setResults] = useState<ValidationResult[] | null>(null);
  const [passed, setPassed] = useState(false);

  const handleSubmit = () => {
    const res = validateTriggers(shouldTrigger, shouldNotTrigger);
    setResults(res);
    const allPassed = res.every(r => r.passed);
    setPassed(allPassed);
    onWorkUpdate(JSON.stringify({ shouldTrigger, shouldNotTrigger }));
    if (allPassed) onComplete(res.length, res.length);
  };

  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto gap-6">
      <div>
        <h3 className="text-sm font-semibold text-primary mb-3">✅ Should Trigger</h3>
        <div className="space-y-2">
          {shouldTrigger.map((q, i) => (
            <input
              key={i}
              value={q}
              onChange={e => {
                const next = [...shouldTrigger];
                next[i] = e.target.value;
                setShouldTrigger(next);
              }}
              placeholder={`Query ${i + 1}`}
              className="w-full px-3 py-2 rounded-md bg-editor border border-border text-sm text-editor-foreground font-mono focus:outline-none focus:ring-1 focus:ring-ring"
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-destructive mb-3">❌ Should NOT Trigger</h3>
        <div className="space-y-2">
          {shouldNotTrigger.map((q, i) => (
            <input
              key={i}
              value={q}
              onChange={e => {
                const next = [...shouldNotTrigger];
                next[i] = e.target.value;
                setShouldNotTrigger(next);
              }}
              placeholder={`Query ${i + 1}`}
              className="w-full px-3 py-2 rounded-md bg-editor border border-border text-sm text-editor-foreground font-mono focus:outline-none focus:ring-1 focus:ring-ring"
            />
          ))}
        </div>
      </div>

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-border bg-card p-4"
        >
          <div className="space-y-2">
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                {r.passed ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <XCircle className="h-4 w-4 text-destructive" />}
                <span className={r.passed ? 'text-foreground' : 'text-destructive'}>{r.check}</span>
              </div>
            ))}
          </div>
          {passed && <p className="mt-3 text-primary font-semibold text-sm">All tests passed! ✅</p>}
        </motion.div>
      )}

      <button
        onClick={handleSubmit}
        className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        Run Tests
      </button>
    </div>
  );
}
