

## Plan: Add "Why learn this?" callout in two places

### 1. Landing Page — FAQ-style callout section
Add a new section between "How it works" and the footer in `src/pages/Landing.tsx`. Styled as a single standout callout card (not a full FAQ accordion — one punchy question deserves a punchy format):

- Bordered card with a quote-like feel
- Bold question as heading: *"But can't Claude just build a Skill for me?"*
- The provided copy as body text
- Sits between "How it works" and footer

### 2. Module 1 lesson content — inline section
In `src/data/courseData.ts`, insert a new section in Module 1's `lessonContent` after the "Three things that make Skills powerful" list (after line ~47, before "Let's see a real example"). Add a blockquote or bold callout with a condensed version:

> **"But can't Claude just build a Skill for me?"**
> Sure — and it'll work fine for simple tasks. But when it doesn't trigger right, when it chokes on messy inputs, when you want something Claude's defaults can't handle — you'll wish you understood what's under the hood. This course gives you the ability to build, debug, and improve *any* Skill.

### Files changed
- `src/pages/Landing.tsx` — new callout section (~20 lines)
- `src/data/courseData.ts` — ~5 lines added to Module 1 lessonContent string

