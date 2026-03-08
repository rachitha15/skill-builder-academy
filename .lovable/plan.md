

## Your Questions Answered

### Layer 1 Trigger Phrase Check
The Layer 1 check on line 33 of `validation.ts` is **exact substring matching** via regex, not fuzzy:
```
/use when|use for|trigger|invoke|activate/i
```
It's case-insensitive but requires one of those exact phrases to appear anywhere in the description. So "Use when..." passes, but "used whenever..." would not (no match for "use when" since "used" != "use"). "Activate" alone passes though.

### Layer 2 UI/UX Problem
The current UI shows 7 query rows with cryptic "Expected: Activate / Got: Skip" badges. The user has no context for:
- **Why** these queries exist
- **What "Activate" vs "Skip" means** in this context
- **How this relates to their description**

## Proposed UI Redesign

Replace the raw results table with a narrative, explainer-first approach:

### 1. Add an intro paragraph before the queries
Explain: "We simulated 7 real user messages to see if Claude would correctly recognize when to use your Skill based on your description. 5 queries *should* activate your Skill, and 2 should be ignored."

### 2. Split queries into two labeled groups
Instead of a flat list of 7, show two sections:
- **"Should activate your Skill" (5 queries)** -- these are requests where a user wants action items extracted from meeting notes
- **"Should NOT activate" (2 queries)** -- these are meeting-related but not about extracting action items

### 3. Simplify the result badges
Replace "Expected: Activate / Got: Skip" with a single human-readable verdict per query:
- Pass: "Correctly activated" or "Correctly skipped"  
- Fail: "Missed -- should have activated" or "Over-triggered -- should have skipped"

### 4. Increase reveal interval
Change from 250ms to 400ms per query so users can actually read each result.

### Changes Summary

**File: `src/components/workspaces/CodeEditorWorkspace.tsx`**

1. Add `expected` field to `TEST_QUERIES` display (already exists in data)
2. Add an explanatory paragraph before the query list when loading and after results
3. Split the query list into two visual groups: "Should Activate" and "Should Not Activate"
4. Replace dual "Expected/Got" badges with a single contextual verdict label
5. Change reveal interval from 250ms to 400ms

