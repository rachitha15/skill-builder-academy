# Untutorial — Claude Code Context

## What this project is
Untutorial is a hands-on learning platform at **untutorial.in**. Learners build real Claude Skills (SKILL.md files) through guided modules, get AI-graded feedback, and earn XP. No sign-up required.

## Tech stack
- React + TypeScript + Vite (port 8080 in dev)
- Tailwind CSS + shadcn/ui components
- Framer Motion for animations
- Supabase (auth-free; anonymous inserts for waitlist/survey)
- Vercel for hosting (`vercel.json` has SPA rewrite: all routes → `/`)

---

## Current routes

| Route | Component | Notes |
|-------|-----------|-------|
| `/` | `HomePage` | Platform homepage — hero, 3 course cards, testimonials |
| `/course` | redirect | → `/course/skills` (backward compat) |
| `/course/skills` | `CourseSkills` | Merged course page: hero + live module list + bottom sections |
| `/course/skills/:id` | `LessonView` | Individual module lesson + challenge workspace |
| `/course/module/:id` | `ModuleRedirect` | → `/course/skills/:id` (backward compat) |
| `/course/complete` | `CourseComplete` | Certificate + download + waitlist |
| `/survey` | `Survey` | Anonymous post-course survey |

---

## Key files

### Pages
- `src/pages/HomePage.tsx` — platform homepage; "Join Waitlist" for coming soon courses inserts into `course_interest_waitlist` Supabase table
- `src/pages/CourseSkills.tsx` — merged course page (was Landing.tsx + CourseMap.tsx); module cards navigate to `/course/skills/:id`; CTA logic: no progress → "Start Module 1 →", in progress → "Continue →", all done → "View Certificate 🎉"
- `src/pages/LessonView.tsx` — lesson + challenge split panel; all nav points to `/course/skills`
- `src/pages/CourseComplete.tsx` — inserts into `waitlist` table (email + total_xp); "← Back to Course Map" → `/course/skills`

### State
- `src/context/CourseContext.tsx` — localStorage key: **`untutorial-progress`** — do not rename
- `src/data/courseData.ts` — 7 module definitions (MODULE_DATA)
- `src/lib/validation.ts` — XP calculation, frontmatter/instructions/edge case validators
- `src/lib/layer2Evaluator.ts` — calls `evaluate-description` Supabase edge function

### Supabase tables
| Table | Used by | Schema |
|-------|---------|--------|
| `waitlist` | `CourseComplete.tsx` | `email` (text, unique), `total_xp` (int) |
| `course_interest_waitlist` | `HomePage.tsx` | `email`, `course_interest`, `created_at` |
| `survey_responses` | `Survey.tsx` | survey answers |

---

## Courses

### Live
- **Build Your First Claude Skill** — 7 modules, ~2 hours, available at `/course/skills`

### Coming soon (waitlist on homepage)
- **Build Reusable AI Workflows** — ~2 hours
- **Product Thinking for Engineers** — ~2 hours

---

## Things that must not change
- localStorage key `untutorial-progress`
- State shape in `CourseContext.tsx`
- `vercel.json` SPA rewrite
- Supabase `waitlist` table schema (used in CourseComplete)

---

## Recent changes (March 2026)
- Refactored routing: separated homepage (`/`) from course page (`/course/skills`)
- Created `HomePage.tsx` — new platform homepage with course catalog
- Created `CourseSkills.tsx` — merged Landing + CourseMap into one unified course page
- Deleted `Landing.tsx` and `CourseMap.tsx`
- Added `/course` → `/course/skills` redirect and `/course/module/:id` → `/course/skills/:id` redirect
- Created `course_interest_waitlist` Supabase table for homepage waitlist
- Updated all internal navigation in `LessonView.tsx` and `CourseComplete.tsx` to use `/course/skills`
- Hardened all 5 edge functions: CORS locked to `https://untutorial.in`, input length caps added

---

## Security setup

### Claude API protection
- `ANTHROPIC_API_KEY` stored as Supabase secret — never in browser or JS bundle
- All Claude calls go through Supabase edge functions (server-side only)

### Edge function hardening (all 5 functions)
- CORS: `Access-Control-Allow-Origin` restricted to `https://untutorial.in` (was `*`)
- Input length caps to prevent token abuse:
  - `evaluate-description`: description ≤ 3,000 chars
  - `evaluate-instructions`: instructions ≤ 8,000 chars
  - `evaluate-triggers`: description ≤ 3,000 chars, each query ≤ 500 chars
  - `evaluate-messy-inputs`: instructions ≤ 8,000 chars
  - `evaluate-final`: skillmd ≤ 15,000 chars, userNotes ≤ 5,000 chars

### Known gaps
- No per-IP rate limiting on edge functions (curl bypasses CORS)
- Recommended: set a monthly spend cap at console.anthropic.com → Billing

---

## The Lens — Course 2

### Routes

| Route | Component | Notes |
|-------|-----------|-------|
| `/course/lenny` | `LennyCoursePage` | Topic selection (if no topic) or mission list |
| `/course/lenny/:id` | `LennyLessonView` | Individual mission lesson + challenge |
| `/course/lenny/complete` | `LennyCourseComplete` | Certificate + playbook download + waitlist |

All 3 Lenny routes are wrapped with `<LennyCourseProvider>` in `App.tsx`.

### Pages
- `src/pages/LennyCoursePage.tsx` — Topic selection grid (5 topics) → dispatches `SELECT_TOPIC` → navigates to Mission 1. Once topic selected, shows mission list with CTA logic.
- `src/pages/LennyLessonView.tsx` — 6-mission lesson + challenge split panel. Uses `LennyCourseContext`. Labels: "Mission X" not "Module X".
- `src/pages/LennyCourseComplete.tsx` — Certificate with topic + XP. Download `.md` playbook. Waitlist inserts into `course_interest_waitlist` with `course_interest: 'lenny-advanced'`.

### Context
- `src/context/LennyCourseContext.tsx`
- localStorage key: `untutorial-lenny-progress` (DO NOT RENAME)
- State: 6 modules + `selectedTopic: string | null` + `playbook: PlaybookSection[] | null`
- Extra actions: `SELECT_TOPIC` (locks topic, unlocks Mission 1), `ADD_PLAYBOOK_SECTION`

### Lib files
- `src/lib/lennyValidation.ts` — `validateSearchBrief()`, `validateSynthesisPrompt()`, `calculateLennyXP()`
- `src/lib/lennyLayer2Evaluator.ts` — `evaluateSearchBrief()`, `evaluateSynthesisPrompt()`, `lennySearch()`

### Components
- `src/components/LennyXPCounter.tsx` — XPCounter wired to `useLennyCourse()`
- `src/components/lenny-workspaces/LennyMultipleChoiceWorkspace.tsx` — Missions 1 & 2
- `src/components/lenny-workspaces/LennyCodeEditorWorkspace.tsx` — Missions 3 & 4
- `src/components/lenny-workspaces/LennyLiveSearchWorkspace.tsx` — Mission 5 (live RAG search)
- `src/components/lenny-workspaces/LennyPlaybookWorkspace.tsx` — Mission 6 (playbook display)

### Edge functions (3 new, deploy with `supabase functions deploy`)
- `evaluate-search-brief`: `{ brief: string, topic: string }`, brief ≤ 5,000 chars
- `evaluate-synthesis-prompt`: `{ instructions: string, topic: string, rawChunks: string }`, instructions ≤ 5,000 chars, rawChunks ≤ 10,000 chars
- `lenny-search`: `{ query: string, sourceFilter: 'newsletter'|'podcast'|'both', threshold: number, topic: string }`, query ≤ 500 chars. Uses `OPENAI_API_KEY`, `NEON_DATABASE_URL`, `ANTHROPIC_API_KEY`.

### Data files (no changes)
- `src/data/lennyLabData.ts` — `LENNY_MODULE_DATA`, `LENNY_TOPICS`, `MISSION_1_SCENARIOS`
- `src/data/lenny/mission_2_embeddings.json` — guess_the_pair data per topic
- `src/data/lenny/mission_4_synthesis.json` — raw_chunks for synthesis evaluation
- `src/data/lenny/stats.json` — aggregate counts shown on topic selection page

### XP config (6 modules)
| Module | maxXP | minPass | Notes |
|--------|-------|---------|-------|
| 1 | 150 | 3/4 | Multiple choice — chunking |
| 2 | 150 | 1/1 | Guess the pair — embeddings |
| 3 | 300 | 3/6 | Search brief — retrieval |
| 4 | 400 | 3/6 | Synthesis prompt — RAG |
| 5 | 250 | 2/3 | Live search — build playbook |
| 6 | 0 | auto | Completion only |
