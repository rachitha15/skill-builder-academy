import { ValidationResult } from '@/context/LennyCourseContext';

export function validateSearchBrief(text: string): ValidationResult[] {
  // Check for 3 section titles: lines that look like headings (e.g., bold, numbered, or capitalized)
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const sectionLines = lines.filter(l =>
    /^\*\*|^#+\s|^section\s*\d|^\d+[.)]/i.test(l) || l.toUpperCase() === l.toUpperCase() && l.length > 5
  );
  const hasThreeSections = sectionLines.length >= 3 || (text.match(/section/gi) || []).length >= 3;

  // Check for content type mentions
  const hasContentType = /framework|example|pitfall|mistake|benchmark|story|stories|case study|how-to|step|guide/i.test(text);

  // Check for source mentions
  const hasSource = /newsletter|podcast|both/i.test(text);

  return [
    {
      check: 'At least 200 characters',
      passed: text.length >= 200,
      message: 'Outline must be at least 200 characters',
    },
    {
      check: 'Contains 3 section titles or headings',
      passed: hasThreeSections,
      message: 'Include 3 section titles (e.g., "Section 1: ..." or bold headers)',
    },
    {
      check: 'Each section mentions content type',
      passed: hasContentType,
      message: 'Describe the type of content needed (frameworks, examples, pitfalls, benchmarks, etc.)',
    },
    {
      check: 'Each section mentions source (newsletter/podcast/both)',
      passed: hasSource,
      message: 'Specify source for each section: "newsletters", "podcasts", or "both"',
    },
  ];
}

const BAD_PROMPT = 'summarize what these sources say';

export function validateSynthesisPrompt(text: string): ValidationResult[] {
  const lower = text.toLowerCase().trim();
  const isDifferent = lower !== BAD_PROMPT && lower.length > BAD_PROMPT.length + 10;

  return [
    {
      check: 'At least 100 characters',
      passed: text.length >= 100,
      message: 'Your prompt must be at least 100 characters — add more detail',
    },
    {
      check: 'Different from original prompt',
      passed: isDifferent,
      message: 'Edit the prompt — don\'t just resubmit the original',
    },
    {
      check: 'Mentions experts or sources or attribution or cite',
      passed: /expert|source|attribution|cite|citation|name|author/i.test(text),
      message: 'Ask the AI to attribute or name the experts',
    },
    {
      check: 'Mentions structure or organize or theme or section',
      passed: /structure|organiz|theme|section|header|format/i.test(text),
      message: 'Ask the AI to structure or organize the output',
    },
  ];
}

// XP config for Lenny course modules
const LENNY_MODULE_CONFIG: Record<number, {
  maxXP: number;
  minPass: number;
  maxScore: number;
  multipliers?: Record<number, number>;
}> = {
  1: { maxXP: 150, minPass: 3, maxScore: 4 },
  2: { maxXP: 150, minPass: 4, maxScore: 6 },
  3: { maxXP: 150, minPass: 3, maxScore: 4 },
  4: { maxXP: 300, minPass: 3, maxScore: 4, multipliers: { 4: 2.0, 3: 1.1 } },
  5: { maxXP: 250, minPass: 1, maxScore: 1 },
  6: { maxXP: 0, minPass: 0, maxScore: 1 },
};

export function calculateLennyXP(
  moduleId: number,
  score: number,
  _maxScore: number,
  attempts: number,
  hintsUsed: number
): { total: number; breakdown: { label: string; value: number }[] } {
  const config = LENNY_MODULE_CONFIG[moduleId];
  if (!config || config.maxXP === 0) return { total: 0, breakdown: [] };

  const passes = score >= config.minPass;
  if (!passes) return { total: 0, breakdown: [{ label: 'Below passing', value: 0 }] };

  const isFirstAttempt = attempts === 1;
  let base: number;

  if (config.multipliers) {
    // Multiplier-based XP for modules 3 & 4
    const baseAmount = config.maxXP / 2; // base before multiplier
    const multiplier = config.multipliers[score] ?? 1.0;
    base = Math.round(baseAmount * multiplier);
  } else if (moduleId === 1) {
    // Module 1: 4/4 = 150, 3/4 = 100
    base = score >= 4 ? 150 : 100;
  } else if (moduleId === 2) {
    // Module 2: 1/1 = 100 base
    base = 100;
  } else if (moduleId === 5) {
    base = 150;
  } else {
    base = config.maxXP;
  }

  // First attempt bonus (+50 XP)
  const firstAttemptBonus = isFirstAttempt ? 50 : 0;

  // Hint penalty: first free, second -25, third -50 cumulative
  let hintPenalty = 0;
  if (hintsUsed >= 2) hintPenalty += 25;
  if (hintsUsed >= 3) hintPenalty += 50;

  const total = Math.min(config.maxXP, Math.max(0, base + firstAttemptBonus - hintPenalty));

  const breakdown: { label: string; value: number }[] = [{ label: 'Base XP', value: base }];
  if (firstAttemptBonus > 0) breakdown.push({ label: 'First attempt bonus', value: firstAttemptBonus });
  if (hintPenalty > 0) breakdown.push({ label: 'Hint penalty', value: -hintPenalty });

  return { total, breakdown };
}
