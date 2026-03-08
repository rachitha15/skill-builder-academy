import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Download } from 'lucide-react';
import { validateFinalReview } from '@/lib/validation';
import { ValidationResult } from '@/context/CourseContext';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface Props {
  initialCode: string;
  onComplete: (score: number, maxScore: number) => void;
  onWorkUpdate: (work: string) => void;
}

export function FinalReviewWorkspace({ initialCode, onComplete, onWorkUpdate }: Props) {
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
    const res = validateFinalReview(code);
    setResults(res);
    const allPassed = res.every(r => r.passed);
    setPassed(allPassed);
    onWorkUpdate(code);
    if (allPassed) onComplete(res.length, res.length);
  };

  const handleDownload = async () => {
    const zip = new JSZip();
    const folder = zip.folder('meeting-action-extractor');
    folder?.file('SKILL.md', code);
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'meeting-action-extractor.zip');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="rounded-lg border border-border bg-editor overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-secondary/60" />
            <div className="w-3 h-3 rounded-full bg-primary/60" />
            <span className="ml-2 text-xs text-muted-foreground font-mono">SKILL.md (Final)</span>
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={e => { setCode(e.target.value); onWorkUpdate(e.target.value); }}
            onKeyDown={handleKeyDown}
            className="w-full min-h-[400px] p-4 bg-editor text-editor-foreground font-mono text-sm leading-relaxed resize-y focus:outline-none code-editor"
            spellCheck={false}
          />
        </div>

        {results && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-lg border border-border bg-card p-4">
            <div className="space-y-2">
              {results.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  {r.passed ? <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /> : <XCircle className="h-4 w-4 text-destructive mt-0.5" />}
                  <span className={r.passed ? 'text-foreground' : 'text-destructive'}>{r.check}</span>
                </div>
              ))}
            </div>
            {passed && (
              <div className="mt-4">
                <p className="text-primary font-semibold text-sm mb-3">All checks passed! 🎉</p>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  <Download className="h-4 w-4" /> Download Skill
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleSubmit}
          className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Run Final Test
        </button>
      </div>
    </div>
  );
}
