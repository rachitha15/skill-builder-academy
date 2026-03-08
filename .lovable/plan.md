
## Rewrite calculateXP Function

### Problem
Current implementation has logic issues causing incorrect XP awards (e.g., 150 instead of 100 on second attempt).

### New Implementation

**File: `src/lib/validation.ts`**

Replace the `MODULE_SCORING` config and `calculateXP` function with cleaner logic:

```typescript
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
```

### Key Changes
1. **Explicit scoring tiers** per module matching your exact rules
2. **Module 2 special handling** - first attempt distinction built into base XP
3. **Fixed hint penalty** - first hint free, second -25, third -50 (not per-hint multiplication)
4. **Cleaner structure** - each module has its own `getBaseXP` function for clarity
