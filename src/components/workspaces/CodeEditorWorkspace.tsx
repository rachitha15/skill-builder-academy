import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { ValidationResult } from '@/context/CourseContext';

interface Props {
  moduleId: number;
  initialCode: string;
  placeholder: string;
  validate: (code: string) => ValidationResult[];
  onComplete: (score: number, maxScore: number) => void;
  onWorkUpdate: (work: string) => void;
}

export function CodeEditorWorkspace({ initialCode, placeholder, validate, onComplete, onWorkUpdate }: Props) {
  const [code, setCode] = useState(initialCode);
  const [results, setResults] = useState<ValidationResult[] | null>(null);
  const [passed, setPassed] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleSubmit = () => {
    const res = validate(code);
    setResults(res);
    const passedCount = res.filter(r => r.passed).length;
    const allPassed = res.every(r => r.passed);
    setPassed(allPassed);
    if (allPassed) {
      onComplete(passedCount, res.length);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="rounded-lg border border-border bg-editor overflow-hidden">
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
            className="w-full min-h-[300px] p-4 bg-editor text-editor-foreground font-mono text-sm leading-relaxed resize-y focus:outline-none placeholder:text-muted-foreground/40 code-editor"
            spellCheck={false}
          />
        </div>

        {results && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-lg border border-border bg-card p-4"
          >
            <p className="font-semibold text-foreground mb-3 text-sm">Validation Results</p>
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
            {passed && (
              <p className="mt-3 text-primary font-semibold text-sm">All checks passed! ✅</p>
            )}
          </motion.div>
        )}
      </div>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleSubmit}
          disabled={code.trim().length === 0}
          className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
