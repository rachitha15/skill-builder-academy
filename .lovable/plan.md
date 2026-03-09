

## Plan: Mobile Tab Layout for LessonView

### What changes
**File: `src/pages/LessonView.tsx`** — single file change.

On mobile (`<768px`), replace the stacked split layout with a tab-based layout:

1. **Import** `useIsMobile` hook and `Tabs`/`TabsList`/`TabsTrigger`/`TabsContent` from existing UI components
2. **Add state**: `activeTab` defaulting to `"lesson"`, reset to `"lesson"` on `moduleId` change
3. **Add scroll-bottom detection**: attach a ref + `IntersectionObserver` to a sentinel div at the bottom of the lesson content. When visible, show a "Ready? Switch to the Challenge tab →" prompt (animated fade-in)
4. **When completion triggers** (`handleComplete`): auto-switch to `"challenge"` tab on mobile
5. **Render logic**:
   - `isMobile` → render `<Tabs>` with sticky 44px tab bar ("📖 Lesson" / "🛠️ Challenge"), each `TabsContent` is full-width scrollable
   - `!isMobile` → keep existing `flex-row` split layout unchanged

### Mobile layout structure
```text
┌─────────────────────────┐
│ Top bar (unchanged)     │
├─────────────────────────┤
│ [📖 Lesson] [🛠 Challenge] ← sticky 44px tab bar
├─────────────────────────┤
│                         │
│  Full-height scrollable │
│  content for active tab │
│                         │
└─────────────────────────┘
```

### Key details
- Tab bar: `sticky top-0 z-10 bg-background border-b`, height `h-11` (44px)
- Lesson tab content: lesson markdown + challenge instructions + hints (same as current left panel, minus the `max-h-[35vh]` cap)
- Challenge tab content: `renderWorkspace()` output, full height scrollable
- "Ready?" prompt: small `motion.div` at bottom of lesson content, only on mobile, clickable to switch tab
- On completion, force `activeTab = "challenge"` so results show inline
- Reset `activeTab` to `"lesson"` when `moduleId` changes

