

## Option A: "Live Grading Reveal" — Duolingo-style

### How it works today
One API call to Claude returns all 7 results at once. The frontend currently renders them all simultaneously.

### What changes

**`src/components/workspaces/CodeEditorWorkspace.tsx`** — single file change:

1. **Add a `TEST_QUERIES` constant** mirroring the edge function's 7 queries (text + expected behavior) so they can be shown during loading.

2. **Loading state**: Replace the current spinner + progress bar with a numbered list of all 7 queries. Each row shows the query text + a grey "Pending..." badge. User can read them and predict outcomes while waiting.

3. **Results reveal**: When results arrive, don't show them all at once. Use a staggered animation (200ms per row) that flips each "Pending..." badge to either a green "Activated ✓" or red "Skipped ✗" pill, with the expected answer beside it. Correct rows get a subtle green background, incorrect get red. A running score counter at the top increments with each reveal (e.g., "3/7 correct so far...").

4. **After all revealed**: Show the final score, multiplier badge, and feedback paragraph — same as today but with the improved labels from the earlier plan ("Step 2 — Does Claude know when to activate?" instead of "Layer 2").

### Technical approach
- Use a `revealedCount` state that increments via `setInterval` after results arrive
- Each query row checks `index < revealedCount` to decide whether to show the result or "Pending..."
- The score counter derives from `results.slice(0, revealedCount).filter(r => r.correct).length`

