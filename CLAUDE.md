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
