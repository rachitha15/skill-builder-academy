import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Folder, FileText } from 'lucide-react';
import { ValidationResult } from '@/context/CourseContext';

interface Props {
  onComplete: (score: number, maxScore: number) => void;
  onWorkUpdate: (work: string) => void;
}

const REQUIRED_FILES = ['SKILL.md'];
const OPTIONAL_FILES = ['scripts/', 'references/', 'README.md', 'assets/', 'package.json'];

export function FolderStructureWorkspace({ onComplete, onWorkUpdate }: Props) {
  const [folderName, setFolderName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>(['SKILL.md']);
  const [frontmatter, setFrontmatter] = useState('');
  const [results, setResults] = useState<ValidationResult[] | null>(null);
  const [passed, setPassed] = useState(false);

  const isKebabCase = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(folderName);

  const toggleFile = (file: string) => {
    if (REQUIRED_FILES.includes(file)) return;
    setSelectedFiles(prev =>
      prev.includes(file) ? prev.filter(f => f !== file) : [...prev, file]
    );
  };

  const handleSubmit = () => {
    const checks: ValidationResult[] = [
      { check: 'Folder name is kebab-case', passed: isKebabCase, message: 'Use lowercase with hyphens (e.g., meeting-action-extractor)' },
      { check: 'SKILL.md selected', passed: selectedFiles.includes('SKILL.md'), message: 'SKILL.md is required' },
      { check: 'Valid frontmatter start', passed: frontmatter.trim().startsWith('---'), message: 'Frontmatter must start with ---' },
      { check: 'Has name field', passed: /name:\s*.+/.test(frontmatter), message: 'Include a name field' },
      { check: 'Has description field', passed: /description:\s*.+/.test(frontmatter), message: 'Include a description field' },
    ];
    setResults(checks);
    const allPassed = checks.every(c => c.passed);
    setPassed(allPassed);
    onWorkUpdate(JSON.stringify({ folderName, selectedFiles, frontmatter }));
    if (allPassed) onComplete(checks.length, checks.length);
  };

  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto gap-6">
      {/* Folder name */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Folder Name</label>
        <div className="flex items-center gap-2">
          <Folder className="h-4 w-4 text-secondary" />
          <input
            value={folderName}
            onChange={e => setFolderName(e.target.value)}
            placeholder="meeting-action-extractor"
            className={`flex-1 px-3 py-2 rounded-md bg-editor border text-sm font-mono text-editor-foreground focus:outline-none focus:ring-1 focus:ring-ring ${
              folderName && (isKebabCase ? 'border-primary' : 'border-destructive')
            } ${!folderName ? 'border-border' : ''}`}
          />
          {folderName && (
            isKebabCase
              ? <CheckCircle2 className="h-4 w-4 text-primary" />
              : <XCircle className="h-4 w-4 text-destructive" />
          )}
        </div>
      </div>

      {/* File selection */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Select Files</label>
        <div className="space-y-2">
          {[...REQUIRED_FILES, ...OPTIONAL_FILES].map(file => (
            <label
              key={file}
              className={`flex items-center gap-3 p-2.5 rounded-md border cursor-pointer transition-colors ${
                selectedFiles.includes(file) ? 'border-primary bg-primary/10' : 'border-border hover:border-muted-foreground'
              } ${REQUIRED_FILES.includes(file) ? 'opacity-90' : ''}`}
            >
              <input
                type="checkbox"
                checked={selectedFiles.includes(file)}
                onChange={() => toggleFile(file)}
                disabled={REQUIRED_FILES.includes(file)}
                className="sr-only"
              />
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-mono text-foreground">{file}</span>
              {REQUIRED_FILES.includes(file) && (
                <span className="ml-auto text-xs text-primary font-medium">Required</span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Frontmatter editor */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Opening Frontmatter</label>
        <textarea
          value={frontmatter}
          onChange={e => setFrontmatter(e.target.value)}
          placeholder={"---\nname: meeting-action-extractor\ndescription: ...\n---"}
          className="w-full min-h-[120px] px-4 py-3 rounded-md bg-editor border border-border text-sm font-mono text-editor-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-y code-editor"
          spellCheck={false}
        />
      </div>

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-border bg-card p-4"
        >
          <div className="space-y-2">
            {results.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                {r.passed ? <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /> : <XCircle className="h-4 w-4 text-destructive mt-0.5" />}
                <span className={r.passed ? 'text-foreground' : 'text-destructive'}>{r.check}</span>
              </div>
            ))}
          </div>
          {passed && <p className="mt-3 text-primary font-semibold text-sm">All checks passed! ✅</p>}
        </motion.div>
      )}

      <button
        onClick={handleSubmit}
        className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        Submit
      </button>
    </div>
  );
}
