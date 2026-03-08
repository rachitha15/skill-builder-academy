

## Major Design Overhaul — Rebellious Anti-Tutorial Brand

This is a comprehensive visual rebrand touching every screen. The changes break down into foundational (theme, fonts, global CSS) and per-screen updates.

---

### 1. Foundational Changes

**`index.html`** — Add Syne font to Google Fonts link:
```html
family=Syne:wght@600;700;800&family=Plus+Jakarta+Sans...
```

**`tailwind.config.ts`** — Update font-display to Syne:
```js
display: ['"Syne"', 'system-ui', 'sans-serif'],
```
Add keyframes for `burst-ring` (expanding ring animation) and `float-up` (XP float).

**`src/index.css`** — Complete CSS variable overhaul:
- `--background`: near-black (`0 0% 4%` → #0a0a0a)
- `--foreground`: white (`0 0% 100%`)
- `--primary`: electric coral (`18 100% 60%` → #ff6b35)
- `--primary-foreground`: black (`0 0% 0%`)
- `--secondary`: warm yellow (`51 100% 52%` → #ffd60a)
- `--secondary-foreground`: black
- `--card`: `0 0% 7%` (#111111)
- `--card-foreground`: white
- `--border`: `0 0% 13%` (#222222)
- `--muted`: `0 0% 13%`
- `--muted-foreground`: `0 0% 64%` (#9ca3af)
- `--destructive`: red (`0 84% 60%` → #ef4444)
- `--editor`: `0 0% 10%` (#1a1a1a)
- `--xp`: same as primary (coral)
- `--ring`: same as primary
- Remove all teal/emerald values, replace with coral equivalents
- `--radius`: `0.375rem` (6px — squared corners)

Update `.lesson-content code` to use orange-tinted background (`45 100% 5%` → #1a1200).
Add `.burst-ring` keyframe animation (expanding semi-transparent ring).
Update `.glow-primary` to use coral glow.

---

### 2. Landing Page (`src/pages/Landing.tsx`)

- **Hero layout**: Change from centered to split — left 50% text (left-aligned), right 50% mock screenshot card
- **Tagline**: "Stop watching ~~tutorials~~. Start building." — wrap "tutorials" in `<span>` with `line-through` + coral/red strikethrough styling
- **"Free · No sign-up" pill**: Remove the floating badge. Add plain text below the CTA button instead
- **CTA button**: `bg-primary text-black font-bold rounded-[6px]` — no glow, squared corners
- **Mock screenshot on right**: A slightly rotated card (`rotate-2`, shadow) showing a fake code editor + results panel (static HTML/CSS mockup representing Module 3's trigger test view)
- **Before/After section**: Update card borders from teal to coral accent
- **How it works icons**: Coral tint instead of teal

---

### 3. Course Map (`src/pages/CourseMap.tsx`)

- **Module cards**: `bg-[#111] border-[#222]`. Add left border: coral for in-progress, green for completed, `#333` for locked
- **Progress bar**: Coral fill on `#222` track
- **XP counter**: Number in `text-3xl` or `text-4xl`, coral colored, with subtle text-shadow glow
- **"In Progress" badge**: Coral bg with black text
- **Lock icon**: Show `Lock` icon on locked modules (already there, just ensure styling is coral/gray not teal)
- **Completed XP**: Coral colored text
- **Nav bar**: `bg-black` not dark slate

---

### 4. XP Counter (`src/components/XPCounter.tsx`)

- Make the XP number larger (`text-2xl` or `text-3xl`), coral colored
- "XP" label: smaller, gray
- Add subtle `text-shadow` glow on the number

---

### 5. Lesson View (`src/pages/LessonView.tsx`)

- **Top bar**: Pure black background
- **Left panel**: Add `border-l-4 border-primary` accent. Increase paragraph spacing
- **Challenge instructions box**: Coral border tint instead of teal
- **Hint buttons**: Keep yellow/secondary styling (already correct)
- **Module complete state**: 
  - Add burst ring animation behind the checkmark emoji
  - Larger "Module Complete!" text in Syne
  - XP number: big coral with float-up animation
  - "Next Module →" button: coral, squared corners
  - Trigger confetti (canvas-confetti) on completion

---

### 6. MultipleChoiceWorkspace (`src/components/workspaces/MultipleChoiceWorkspace.tsx`)

- Scenario cards: `bg-[#111] border-[#222]`
- Radio options: hover shows coral border, selected shows coral fill
- Submit button: coral, squared corners
- Pass/fail result borders: coral for pass, red for fail (already uses primary/destructive)

---

### 7. FolderStructureWorkspace (`src/components/workspaces/FolderStructureWorkspace.tsx`)

- Input field: dark bg, coral border on focus, green border when valid
- Checkboxes: coral accent when checked (follows from CSS variable change)
- Code editor textarea: orange-tinted bg
- Submit button: coral, squared corners

---

### 8. CourseComplete (`src/pages/CourseComplete.tsx`)

- Update confetti colors from `['#10b981', '#f59e0b', '#e2e8f0']` to `['#ff6b35', '#ffd60a', '#22c55e']`
- Trophy icon: coral tint
- Badge card: coral glow
- Download button: coral
- Add burst ring animation behind trophy

---

### Files to modify (9 files total)

1. `index.html` — Add Syne font
2. `tailwind.config.ts` — Font family + new keyframes
3. `src/index.css` — All CSS variables, lesson-content styles, new animations
4. `src/pages/Landing.tsx` — Split hero, strikethrough, mock screenshot, squared CTA
5. `src/pages/CourseMap.tsx` — Card styling, left borders, XP size, progress bar
6. `src/pages/LessonView.tsx` — Left panel accent, completion state with confetti + burst
7. `src/components/XPCounter.tsx` — Larger coral number with glow
8. `src/components/workspaces/MultipleChoiceWorkspace.tsx` — Card/button styling
9. `src/components/workspaces/FolderStructureWorkspace.tsx` — Input/checkbox/editor styling
10. `src/pages/CourseComplete.tsx` — Confetti colors, coral accents

