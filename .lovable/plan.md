

# Major Content Update: Modules 1-4 Narrative Structure

## Overview
Replace text content across 4 modules to introduce Raj (lesson examples) and Clara (exercises) as recurring characters. This is a content-only update — no structural, routing, XP, or validation logic changes.

## Files to Modify

### 1. `src/data/courseData.ts`
**Module 1 (`lessonContent`):** Replace with v2 content — add Raj's feedback-categorizer example, Clara's introduction paragraph, and updated closing text about `meeting-action-extractor`.

**Module 1 (`challengeInstructions`):** Update to reference Clara/Raj scenarios.

**Module 1 (`hints`):** Update to reference characters and new scenarios.

**Module 2 (`lessonContent`):** Replace folder/YAML examples with `feedback-categorizer`. Add Raj's YAML frontmatter and markdown body examples.

**Module 2 (`challengeInstructions`):** Change heading to "Build Clara's Skeleton", add context line about Clara.

**Module 2 (`hints`):** Update hint 2 to new wording about required files.

**Module 3 (`lessonContent`):** Replace with Raj's description as GOOD example, generic BAD examples, pro tips referencing Raj's trigger words.

**Module 3 (`challengeInstructions`):** Add Clara-specific context about trigger/non-trigger scenarios.

**Module 3 (`hints`):** Update all 3 hints to reference Raj's patterns.

**Module 4 (`lessonContent`):** Replace vague/specific comparison with Raj's feedback categorizer, replace example input/output with Raj's, replace edge cases with Raj's, add transition paragraph to Clara's challenge.

**Module 4 (`challengeInstructions`):** Update heading to "Write Clara's Instructions", add Clara-specific context.

**Module 4 (`hints`):** Update all 3 hints to reference Raj's patterns and Clara's abbreviations.

**SCENARIOS array:** Replace all 4 scenarios with Clara/Raj versions from the v2 doc (Clara's standup notes, London office, Slack monitoring, Raj's weekly summary).

### 2. `src/pages/LessonView.tsx`
**Module 4 placeholder** (line 98): Replace starter template with Clara-specific sections (Context, Steps, Output Format, Edge Cases, Example).

### 3. `supabase/functions/evaluate-description/index.ts`
**TEST_QUERIES** (lines 9-17): Replace 7 queries with Clara-specific ones:
- 5 should-trigger (standup notes, 1:1 follow-ups, sprint retro, leadership sync, meeting notes with owners)
- 2 should-not-trigger (draft email, write project brief)

### 4. `supabase/functions/evaluate-instructions/index.ts`
**MESSY_NOTES** (lines 14-20): Replace with Clara's Tidepool standup (abbreviations T/S/J/P, Jira-to-Linear FYI, standup time change decision).

**Evaluation criteria** in the user prompt (lines 52-68): Replace 6 criteria with:
- At least 4 action items extracted
- Demo prep marked high priority
- Welcome email bug has Unassigned owner
- Standup time change correctly excluded as decision
- Jira-to-Linear note excluded as FYI
- Clean readable output format

### 5. `src/pages/LessonView.tsx` — Clara intro styling
Add a custom markdown renderer or CSS class for Clara's introduction callout card (dark background `#1a1a1a`, left border accent). This can be done via a custom component in the ReactMarkdown `components` prop, detecting Clara's intro section.

## What stays unchanged
- App structure, routing, navigation
- Color scheme, typography, design system
- XP calculation logic
- Layer 1 validation logic (structural checks in `validation.ts`)
- Edge function integration patterns
- Gamification mechanics (hints, XP, progress)
- All workspace component logic

