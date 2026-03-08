import { ValidationResult } from '@/context/CourseContext';

export function validateFrontmatter(yaml: string): ValidationResult[] {
  const results: ValidationResult[] = [];

  results.push({
    check: 'YAML delimiters',
    passed: yaml.trim().startsWith('---') && yaml.trim().indexOf('---', 3) > 3,
    message: 'Frontmatter must start and end with ---'
  });

  const nameMatch = yaml.match(/name:\s*(.+)/);
  const nameValue = nameMatch?.[1]?.trim();
  results.push({
    check: 'Name field',
    passed: !!nameValue && /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(nameValue),
    message: 'Name must be kebab-case (e.g., meeting-action-extractor)'
  });

  const descMatch = yaml.match(/description:\s*[>|]?\s*([\s\S]*?)(?=\n[a-z]|\n---)/i);
  const descValue = descMatch?.[1]?.trim() || '';
  const fullDesc = yaml.match(/description:\s*([\s\S]*?)(?=\n---|\n[a-z]+:)/i)?.[1]?.trim() || '';
  const descLength = fullDesc.replace(/[>\|]\s*/g, '').trim().length;

  results.push({
    check: 'Description field',
    passed: descLength >= 50,
    message: 'Description must be at least 50 characters'
  });

  results.push({
    check: 'Trigger phrases',
    passed: /use when|use for|trigger|invoke|activate/i.test(fullDesc),
    message: 'Description should include when to use the skill (e.g., "Use when...")'
  });

  results.push({
    check: 'No XML tags',
    passed: !yaml.includes('<') && !yaml.includes('>'),
    message: 'YAML must not contain < or > characters'
  });

  results.push({
    check: 'No reserved names',
    passed: !nameValue?.includes('claude') && !nameValue?.includes('anthropic'),
    message: 'Skill name cannot contain "claude" or "anthropic"'
  });

  return results;
}

export function validateInstructions(content: string): ValidationResult[] {
  const lower = content.toLowerCase();
  return [
    { check: 'Has context/overview', passed: /##\s*(context|overview|about)/i.test(content), message: 'Include a ## Context or ## Overview section' },
    { check: 'Has input format', passed: /##\s*(input|what you|user provides)/i.test(content), message: 'Include a ## Input section' },
    { check: 'Has steps/process', passed: /##\s*(steps|process|how|instructions)/i.test(content), message: 'Include a ## Steps section' },
    { check: 'Has output format', passed: /##\s*(output|result|format)/i.test(content), message: 'Include a ## Output section' },
    { check: 'Sufficient detail', passed: content.length >= 200, message: 'Instructions should be at least 200 characters' },
  ];
}

export function validateEdgeCases(content: string): ValidationResult[] {
  const edgeCaseSection = content.match(/##\s*edge\s*cases?([\s\S]*)/i)?.[1] || '';
  const bulletPoints = edgeCaseSection.match(/[-*]\s+\*?\*?.+/g) || [];
  return [
    { check: 'Has edge cases section', passed: /##\s*edge\s*cases?/i.test(content), message: 'Include a ## Edge Cases section' },
    { check: 'At least 3 edge cases', passed: bulletPoints.length >= 3, message: 'List at least 3 edge cases' },
    { check: 'Has fallback behaviors', passed: /default|fallback|if no|if missing|mark as|tbd/i.test(edgeCaseSection), message: 'Include fallback behaviors for edge cases' },
    { check: 'Sufficient detail', passed: content.length >= 150, message: 'Edge case handling should be at least 150 characters' },
  ];
}

export function validateTriggers(shouldTrigger: string[], shouldNotTrigger: string[]): ValidationResult[] {
  const filledTrigger = shouldTrigger.filter(s => s.trim().length > 0);
  const filledNot = shouldNotTrigger.filter(s => s.trim().length > 0);
  return [
    { check: '5 trigger queries', passed: filledTrigger.length >= 5, message: 'Provide 5 queries that should trigger the Skill' },
    { check: '5 non-trigger queries', passed: filledNot.length >= 5, message: 'Provide 5 queries that should NOT trigger the Skill' },
    { check: 'All fields filled', passed: filledTrigger.length >= 5 && filledNot.length >= 5, message: 'All query fields must be filled' },
  ];
}

export function validateFinalReview(content: string): ValidationResult[] {
  const fmResults = validateFrontmatter(content);
  const hasInstructions = /##\s*(context|overview)/i.test(content);
  const hasEdgeCases = /##\s*edge\s*cases?/i.test(content);
  return [
    ...fmResults,
    { check: 'Has instructions', passed: hasInstructions, message: 'Include instruction sections' },
    { check: 'Has edge cases', passed: hasEdgeCases, message: 'Include edge case handling' },
    { check: 'Well-formatted', passed: content.includes('## ') && content.includes('- '), message: 'Use markdown headers and lists' },
  ];
}

const MODULE_CONFIG: Record<number, { maxXP: number; minPass: number; getBaseXP: (score: number, isFirstAttempt: boolean) => number }> = {
  1: {
    maxXP: 150,
    minPass: 3,
    getBaseXP: (score) => score >= 4 ? 150 : score >= 3 ? 100 : 0
  },
  2: {
    maxXP: 150,
    minPass: 3,
    getBaseXP: (score, isFirst) => score >= 3 ? (isFirst ? 150 : 100) : 0
  },
  3: {
    maxXP: 300,
    minPass: 4,
    getBaseXP: (score) => score >= 7 ? 300 : score >= 6 ? 255 : score >= 5 ? 210 : score >= 4 ? 165 : 0
  },
  4: {
    maxXP: 400,
    minPass: 3,
    getBaseXP: (score) => score >= 6 ? 400 : score >= 5 ? 340 : score >= 4 ? 280 : score >= 3 ? 220 : 0
  },
  5: {
    maxXP: 300,
    minPass: 5,
    getBaseXP: (score) => score >= 10 ? 300 : score >= 8 ? 255 : score >= 6 ? 210 : score >= 5 ? 165 : 0
  },
  6: {
    maxXP: 400,
    minPass: 5,
    getBaseXP: (score) => score >= 11 ? 400 : score >= 9 ? 340 : score >= 7 ? 280 : score >= 5 ? 220 : 0
  },
  7: {
    maxXP: 200,
    minPass: 1,
    getBaseXP: (score) => score >= 1 ? 200 : 0
  }
};

export function calculateXP(
  moduleId: number,
  score: number,
  _maxScore: number,
  attempts: number,
  hintsUsed: number
): { total: number; breakdown: { label: string; value: number }[] } {
  const config = MODULE_CONFIG[moduleId];
  if (!config) return { total: 0, breakdown: [] };

  const isFirstAttempt = attempts === 1;
  const base = config.getBaseXP(score, isFirstAttempt);
  
  // Below passing = 0 XP
  if (base === 0) {
    return { total: 0, breakdown: [{ label: 'Below passing', value: 0 }] };
  }

  // First attempt bonus (Module 2 handles this in getBaseXP, others get +50)
  const firstAttemptBonus = (moduleId !== 2 && isFirstAttempt) ? 50 : 0;

  // Hint penalty: first free, second -25, third -50
  let hintPenalty = 0;
  if (hintsUsed >= 2) hintPenalty += 25;  // second hint
  if (hintsUsed >= 3) hintPenalty += 50;  // third hint (cumulative: 75 total)

  const total = Math.min(config.maxXP, Math.max(0, base + firstAttemptBonus - hintPenalty));

  const breakdown: { label: string; value: number }[] = [{ label: 'Base XP', value: base }];
  if (firstAttemptBonus > 0) breakdown.push({ label: 'First attempt bonus', value: firstAttemptBonus });
  if (hintPenalty > 0) breakdown.push({ label: 'Hint penalty', value: -hintPenalty });

  return { total, breakdown };
}
