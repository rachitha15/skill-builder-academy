import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Folder, FileText } from 'lucide-react';
import { ValidationResult } from '@/context/CourseContext';

interface Props {
  onComplete: (score: number, maxScore: number) => void;
  onWorkUpdate: (work: string) => void;
}

const FILE_OPTIONS = ['SKILL.md', 'scripts/', 'references/', 'README.md', 'assets/', 'package.json'];

export function FolderStructureWorkspace({ onComplete, onWorkUpdate }: Props) {
  const [folderName, setFolderName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [frontmatter, setFrontmatter] = useState('');
  const [results, setResults] = useState<ValidationResult[] | null>(null);
  const [passed, setPassed] = useState(false);

  const isKebabCase = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(folderName);

  const toggleFile = (file: string) => {
    setSelectedFiles(prev =>
      prev.includes(file) ? prev.filter(f => f !== file) : [...prev, file]
    );
  };

  const handleSubmit = () => {
    const nameMatch = frontmatter.match(/name:\s*(.+)/);
    const nameValue = nameMatch?.[1]?.trim();
    const hasDelimiters = frontmatter.trim().startsWith('---') && frontmatter.trim().indexOf('---', 3) > 0;
    const nameIsKebab = !!nameValue && /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(nameValue);

    const checks: ValidationResult[] = [
      { check: 'Folder name is kebab-case', passed: isKebabCase, message: 'Use lowercase with hyphens (e.g., meeting-action-extractor)' },
      { check: 'Only SKILL.md checked as required', passed: selectedFiles.includes('SKILL.md') && selectedFiles.filter(f => f !== 'SKILL.md').length === 0, message: 'SKILL.md is the only required file' },
      { check: 'README.md not checked', passed: !selectedFiles.includes('README.md'), message: 'README.md does NOT belong in a Skill folder' },
      { check: 'Valid YAML frontmatter delimiters', passed: hasDelimiters, message: 'Frontmatter must start and end with ---' },
      { check: 'Name field is kebab-case', passed: nameIsKebab, message: 'Include a name field with a kebab-case value' },
    ];
    setResults(checks);
    const allPassed = checks.every(c => c.passed);
    setPassed(allPassed);
    onWorkUpdate(JSON.stringify({ folderName, selectedFiles, frontmatter }));
    if (allPassed) onComplete(checks.length, checks.length);
  };

  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto gap-6">
      {/* Task 1: Folder name */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Folder name for a Skill that turns meeting notes into action items</label>
        <div className="flex items-center gap-2">
          <Folder className="h-4 w-4 text-secondary" />
          <input
            value={folderName}
            onChange={e => setFolderName(e.target.value)}
            placeholder="my-skill-name"
            className={`flex-1 px-3 py-2 rounded-md bg-editor border text-sm font-mono text-editor-foreground focus:outline-none focus:ring-1 ${
              folderName && isKebabCase ? 'border-success focus:ring-success' : folderName ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'
            }`}
          />
          {folderName && (
            isKebabCase
              ? <CheckCircle2 className="h-4 w-4 text-success" />
              : <XCircle className="h-4 w-4 text-destructive" />
          )}
        </div>
        {folderName && !isKebabCase && (
          <p className="text-xs text-destructive mt-1 ml-6">Use kebab-case: all lowercase, words separated by hyphens</p>
        )}
      </div>

      {/* Task 2: Required files */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Which files/folders are REQUIRED?</label>
        <div className="space-y-2">
          {FILE_OPTIONS.map(file => (
            <label
              key={file}
              className={`flex items-center gap-3 p-2.5 rounded-md border cursor-pointer transition-colors ${
                selectedFiles.includes(file) ? 'border-primary bg-primary/10' : 'border-border hover:border-primary'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedFiles.includes(file)}
                onChange={() => toggleFile(file)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                selectedFiles.includes(file) ? 'bg-primary border-primary' : 'border-muted-foreground'
              }`}>
                {selectedFiles.includes(file) && <CheckCircle2 className="h-3 w-3 text-primary-foreground" />}
              </div>
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-mono text-foreground">{file}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Task 3: Frontmatter */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Write the opening YAML frontmatter with just the name field</label>
        <textarea
          value={frontmatter}
          onChange={e => setFrontmatter(e.target.value)}
          placeholder={"---\nname: my-skill-name\n---"}
          className="w-full min-h-[120px] px-4 py-3 rounded-md bg-[#1a1200] border border-border text-sm font-mono text-editor-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-y code-editor"
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
                {r.passed ? <CheckCircle2 className="h-4 w-4 text-success mt-0.5" /> : <XCircle className="h-4 w-4 text-destructive mt-0.5" />}
                <div>
                  <span className={r.passed ? 'text-foreground' : 'text-destructive'}>{r.check}</span>
                  {!r.passed && <p className="text-xs text-muted-foreground mt-0.5">{r.message}</p>}
                </div>
              </div>
            ))}
          </div>
          {passed && <p className="mt-3 text-success font-semibold text-sm">All checks passed! ✅</p>}
        </motion.div>
      )}

      <button
        onClick={handleSubmit}
        className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
      >
        Submit
      </button>
    </div>
  );
}
