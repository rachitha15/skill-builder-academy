

## Fix: Module 1 XP Base Tier

### Problem
The 4/4 base XP (150) equals the maxXP cap, making the first-attempt bonus and hint penalties invisible.

### Change
**File: `src/lib/validation.ts` line 97**

Change Module 1 tier from:
```
1: { maxXP: 150, tiers: [[4, 150], [3, 100]], minPass: 3 },
```
to:
```
1: { maxXP: 150, tiers: [[4, 100], [3, 100]], minPass: 3 },
```

This single change makes the +50 first-attempt bonus meaningful and ensures hint penalties are always deducted visibly. All 10 scoring combinations shown above become correct.

