

## Plan: Update Module 2 Content and FolderStructureWorkspace

### Changes needed

**1. Update `src/data/courseData.ts` (Module 2 entry, lines 62-97)**
- Replace `lessonContent` with the full provided markdown (kebab-case rules, SKILL.md casing, frontmatter explanation, optional folders, "No README.md" rule)
- Update `challengeInstructions` to describe the 3 tasks clearly
- Update `hints` to match the provided hints (free kebab-case hint, -25 XP required files hint, -50 XP show answer)
- Update `completionSummary` with relevant bullets

**2. Rewrite `src/components/workspaces/FolderStructureWorkspace.tsx`**
Key changes to match the spec:
- **Task 1 (Folder name)**: Keep as-is but update label to "Folder name for a Skill that turns meeting notes into action items"
- **Task 2 (Checkboxes)**: Change from "Select Files" to "Which files/folders are REQUIRED?" — make all checkboxes unchecked by default (remove pre-selected SKILL.md). Validation: only SKILL.md checked, README.md NOT checked
- **Task 3 (Frontmatter)**: Change label to "Write the opening YAML frontmatter with just the name field". Update placeholder to show `---\nname: meeting-action-extractor\n---`. Remove the description validation check — only validate `---` delimiters and kebab-case `name:` field
- Update validation checks to match:
  1. Folder name is kebab-case
  2. Only SKILL.md is checked as required (no other files checked as required)
  3. README.md is NOT checked
  4. Frontmatter has `---` delimiters
  5. Frontmatter has valid kebab-case `name:` field

### No other files need changes
The `LessonView.tsx` already routes `folder_structure` challenge type to `FolderStructureWorkspace` correctly.

