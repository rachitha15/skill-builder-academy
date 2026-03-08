

# Plan: Module 7 "Ship It" + Course Complete Overhaul

## Overview

Rebuild Module 7's workspace, create a new edge function for the final test + try-your-own-notes, and overhaul the Course Complete page per the detailed spec.

## Files to Create

### 1. `supabase/functions/evaluate-final/index.ts`
New edge function handling two modes:
- **Final test mode**: receives `{ skillmd }` — tests against Clara's unseen 1:1 notes with Jake, evaluates 6 criteria, returns JSON with output/criteria/score/passed/feedback
- **Try-your-own mode**: receives `{ skillmd, userNotes }` — applies the skill to user's notes, returns `{ output }` only
- Uses same pattern as existing edge functions (Anthropic API, CORS headers, JSON parsing)
- `max_tokens: 2048` for the final test, `1024` for try-your-own

### 2. `src/components/workspaces/ShipItWorkspace.tsx`
Complete rewrite of the Module 7 workspace (replaces existing `FinalReviewWorkspace` usage). Three stacked sections:

**Section 1 — Pre-Ship Checklist**: 7 interactive checkboxes (self-assessment only), progress indicator "4/7 checked"

**Section 2 — Full SKILL.md Editor**: Assembles from `modules[2].userWork` (frontmatter) + `modules[5].userWork` (or fallback to `modules[3].userWork`). Same code editor styling as Modules 4/6.

**Section 3 — Controls + Results**:
- Two buttons side-by-side: "Run Final Test" (primary) + "Download Skill" (secondary, disabled until pass)
- Layer 1 validation (500+ chars, `---` delimiters, `name:`, `description:`, numbered steps, edge case keywords)
- On Layer 1 pass → call `evaluate-final` edge function
- Results: Claude's output card + 6 criteria checklist + score badge
- Pass threshold: 4/6
- If passed: enable download, show XP (base 200, +50 first attempt bonus), show "Try Your Own Notes" collapsible, show "Complete Course →" button
- If failed: show feedback + "Revise & Try Again" (no attempt limit)
- No attempt limit — don't block completion
- Download uses JSZip (already installed)

**"Try Your Own Notes" section**: Collapsible, textarea + "Run My Notes" button → calls edge function in try-your-own mode → displays output card. No scoring.

## Files to Modify

### 3. `src/data/courseData.ts` — Module 7 entry
Replace the current Module 7 `lessonContent` with the full markdown from the spec (Clara's Skill packaging narrative, the framework summary, final boss intro). Update `challengeInstructions` accordingly.

### 4. `supabase/config.toml`
Add `[functions.evaluate-final]` with `verify_jwt = false`.

### 5. `src/pages/LessonView.tsx`
- Import `ShipItWorkspace` instead of using `FinalReviewWorkspace` for module 7
- Update the `final_review` case in `renderWorkspace()` to render `ShipItWorkspace` with proper props (module state for assembling content, onComplete, onWorkUpdate)

### 6. `src/pages/CourseComplete.tsx` — Full overhaul
Per spec:
- Confetti animation (already works, keep 3-second burst)
- Updated headline: "You built your first Claude Skill! 🎉" + subtext "Clara's meeting chaos doesn't stand a chance."
- **Skill Builder Badge**: Dark `#111` bg, coral border, "SKILL BUILDER" title, skill name, total XP, date, "Built on Untutorial" — styled as a screenshottable certificate
- Download button (JSZip, same as Module 7)
- **How to Install** — collapsible accordion with 5 steps
- Social share buttons (LinkedIn + X with pre-filled URLs from spec)
- **Waitlist section**: "Want to build more?" + email input + localStorage storage + confirmation
- Footer: "Built by Rachitha" (link to rachithasuresh.com) + "Powered by Claude" (Anthropic link)
- "Back to Course Map" link

## State Management
- Module 7 reads from modules[2], modules[5] (fallback modules[3]) to assemble initial content
- Every edit saves to modules[6].userWork via onWorkUpdate
- On "Complete Course →": dispatch COMPLETE_MODULE for module 7, then navigate to `/course/complete`
- CourseComplete reads totalXP and modules[6].userWork for download

## Key Decisions
- Existing `FinalReviewWorkspace.tsx` will no longer be used by LessonView (replaced by ShipItWorkspace) — can keep file but won't be imported
- Edge function uses Anthropic API (same pattern as all other edge functions — ANTHROPIC_API_KEY secret already configured)
- No database changes needed

