

## Bugs Found and Fixes

### Bug 1: Module 1 shows "In Progress" before user starts it
**Root cause**: In `CourseContext.tsx` line ~43, `initialModules` sets module 1's status to `in_progress` by default. The course map then shows the "In Progress" badge immediately.
**Fix**: Change initial status of module 1 from `in_progress` to a new state or reuse the existing logic. Since the module system only has `locked | in_progress | completed`, the simplest fix is to keep module 1 as `locked` initially but allow clicking on it (treat module 1 as always unlockable). Alternatively, just don't show the "In Progress" badge until the user actually navigates into the module — set module 1 to `in_progress` only when `START_MODULE` is dispatched on first visit.

### Bug 2: Test Case 1.4 — 3/4 correct awards 150 XP instead of 100
**Root cause**: In `LessonView.tsx` line 57-58, `INCREMENT_ATTEMPTS` is dispatched but `moduleState.attempts` is still `0` when passed to `calculateXP`. This triggers a +50 "first attempt bonus" (line 123 of `validation.ts`), inflating 100 → 150.
**Fix**: Pass `moduleState.attempts + 1` to `calculateXP` so the first real submission counts as attempt 1, not 0. The first attempt bonus should only apply when the user scored perfectly (4/4) on their first try.

### Bug 3: Test Case 1.7 — Hint penalties not visible (3 hints used, still 150 XP)
**Root cause**: Two compounding issues:
1. Same attempts timing bug as Bug 2 — +50 bonus offsets the hint penalty
2. Hint penalty formula is too lenient: 3 hints revealed = 2 `USE_HINT` dispatches (first is free) = only 25 XP penalty. Combined with the false +50 bonus, net effect is still 150 (capped at max).

**Fix**: After fixing Bug 2 (no false bonus), 4/4 with 2 hint penalties = 150 - 25 = 125 XP. This makes the penalty visible. If user expects a larger penalty, we can also adjust the penalty formula.

### Implementation Plan

1. **CourseContext.tsx**: Change module 1 initial status from `in_progress` to `locked`. Add logic in `LessonView.tsx` to auto-dispatch `START_MODULE` when user first navigates to a module. Update course map click handler to allow clicking module 1 even when "locked" (or add a new `available` concept where module 1 is always available).

2. **LessonView.tsx line 58**: Change `moduleState.attempts` to `moduleState.attempts + 1` in the `calculateXP` call, so first submission = attempt 1 (no bonus). Also move `INCREMENT_ATTEMPTS` before the calculation or account for it.

3. **No formula changes needed** — fixing the attempts timing bug alone will make hint penalties visible and stop inflating 3/4 scores.

### Files to modify
- `src/context/CourseContext.tsx` — initial module 1 status
- `src/pages/LessonView.tsx` — attempts parameter fix, auto-start module on visit
- `src/pages/CourseMap.tsx` — allow clicking module 1 when status is technically locked (or handle the new flow)

