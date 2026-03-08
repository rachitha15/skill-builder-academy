

## Module 3: "Frontmatter is Everything" — Full Content

Since Supabase isn't connected yet, I'll implement Module 3 with **client-side Layer 2 simulation** that mimics the AI evaluation using deterministic keyword matching. This lets you test the full two-layer flow now. When Supabase is connected later, we swap in the real AI edge function.

---

### Changes

**1. Update lesson content (`src/data/courseData.ts`, Module 3)**

Replace the current placeholder lesson content with the full engaging content covering:
- Description field's two jobs (WHAT + WHEN)
- 3 good vs 3 bad description examples
- Trigger phrases users would say
- Input types (meeting notes, standup recaps)
- Under 1024 chars rule, no XML, no reserved names
- "Use when" pro tip

Update `challengeInstructions` to explain the two-layer evaluation.

Update `hints` to the 3 specified hints:
1. Free: "Include both WHAT and WHEN..."
2. -25 XP: "To avoid over-triggering..."
3. -50 XP: Show example good description

---

**2. Upgrade `CodeEditorWorkspace` to support two-layer validation (`src/components/workspaces/CodeEditorWorkspace.tsx`)**

Add a `layer2Evaluate` optional prop. Flow:
- Click "Submit" → run Layer 1 checks (existing `validate` prop)
- Show Layer 1 results as checklist (existing UI)
- If ALL Layer 1 checks pass → automatically run Layer 2
- Show "Running trigger test..." loading state
- Display Layer 2 results as a test-runner table:
  - 7 rows, each with query text, expected result, actual result, pass/fail icon
  - Score: X/7
  - Feedback text below
- If score >= 4/7 → call `onComplete(score, 7)`

Props change:
```typescript
interface Props {
  moduleId: number;
  initialCode: string;
  placeholder: string;
  validate: (code: string) => ValidationResult[];
  layer2Evaluate?: (code: string) => Promise<Layer2Result>;  // NEW
  onComplete: (score: number, maxScore: number) => void;
  onWorkUpdate: (work: string) => void;
}
```

---

**3. Create Layer 2 mock evaluator (`src/lib/layer2Evaluator.ts`)**

A function that takes the user's description and runs 7 test queries against it using keyword matching:

```typescript
export async function evaluateDescription(description: string): Promise<Layer2Result>
```

**Test queries** (from the spec):
1. "Here are my meeting notes from today, can you extract the action items?" → expected: true
2. "Pull out the to-dos from this standup recap" → expected: true
3. "What are the follow-ups from this meeting?" → expected: true
4. "I pasted my 1:1 notes, can you find the next steps?" → expected: true
5. "Extract action items and owners from these notes" → expected: true
6. "Help me schedule a meeting with the design team" → expected: false
7. "Write an agenda for tomorrow's sprint planning" → expected: false

The mock evaluator checks if the description contains relevant keywords (action items, meeting notes, to-dos, follow-ups, etc.) and determines if it would "trigger" for each query. Adds a small delay (800ms) to simulate API latency.

Returns `{ results: [...], score: number, feedback: string }`.

---

**4. Wire it up in `LessonView.tsx`**

Pass the `layer2Evaluate` prop to `CodeEditorWorkspace` when `moduleId === 3`.

---

**5. Layer 2 result UI in CodeEditorWorkspace**

After Layer 1 passes, show a "test runner" panel:
- Header: "Trigger Test Results"
- 7 rows in a table-like layout, each showing:
  - Query number + text (truncated)
  - Expected: true/false
  - Actual: true/false  
  - Result: green check or red X
- Score bar: "5/7 triggers correct"
- Feedback paragraph below
- Styled with the existing dark card theme (#111, #222 borders)

---

### Files to create/modify

1. `src/data/courseData.ts` — Update Module 3 lesson content, instructions, hints
2. `src/lib/layer2Evaluator.ts` — NEW: mock Layer 2 evaluation function
3. `src/components/workspaces/CodeEditorWorkspace.tsx` — Add Layer 2 flow + test runner UI
4. `src/pages/LessonView.tsx` — Pass layer2Evaluate prop for module 3

