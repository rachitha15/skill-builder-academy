export interface ModuleData {
  id: number;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  maxXP: number;
  lessonContent: string;
  challengeType: 'multiple_choice' | 'folder_structure' | 'code_editor' | 'trigger_test' | 'final_review';
  challengeInstructions: string;
  hints: string[];
  layer1Checks: string[];
  completionSummary: string[];
}

export const MODULE_DATA: ModuleData[] = [
  {
    id: 1,
    title: "What Even Is a Skill?",
    subtitle: "Understand what Skills are and when to use them",
    estimatedMinutes: 10,
    maxXP: 150,
    challengeType: 'multiple_choice',
    lessonContent: `Most people use Claude the same way every time — they type a request, get a response, and start from scratch next conversation. If you've ever found yourself typing "You are a PM who..." for the fifth time this week, you already feel the problem.

A **Claude Skill** is a set of instructions — packaged as a simple folder — that teaches Claude how to handle a specific task or workflow. Instead of re-explaining what you want every time, you teach Claude once, and it remembers.

Here's the key insight: **a Skill is not code.** It's a markdown file. If you can write a clear set of instructions for a new hire, you can write a Skill. That's the bar.

A Skill folder contains:

- **SKILL.md** (required) — The instructions file
- **scripts/** (optional) — Code Claude can run
- **references/** (optional) — Extra documentation
- **assets/** (optional) — Templates and files

For most Skills — including the one you'll build — all you need is the SKILL.md file. One file.

**Three things that make Skills powerful:**

1. **Progressive Disclosure** — Claude only loads the full Skill when needed
2. **Composability** — Multiple Skills work together
3. **Portability** — Works in Claude.ai, Claude Code, and the API

**What you're building in this course:**

By Module 7, you'll have a working Skill called \`meeting-action-extractor\`. Paste messy meeting notes into Claude, get clean action items with owners, deadlines, and priorities. No templates. No re-explaining.`,
    challengeInstructions: `### Challenge: Skill or Not a Skill?

For each scenario, pick the best answer. You need **3/4 correct** to pass.`,
    hints: [
      "Think about whether the task is repetitive and follows a consistent pattern. Skills shine when you find yourself re-explaining the same instructions.",
      "Consider what requires external system access (like monitoring Slack) versus what Claude can do with just text input. MCP connectors bridge the gap to external systems.",
      "For Scenario 2: One-off factual questions don't need Skills. For Scenario 3: Real-time monitoring needs more than just instructions."
    ],
    layer1Checks: ['At least 3 out of 4 correct answers'],
    completionSummary: [
      "Skills are instruction files (not code) that teach Claude specific workflows",
      "Skills are best for repetitive tasks where you re-explain the same thing",
      "A Skill folder only requires SKILL.md — everything else is optional"
    ]
  },
  {
    id: 2,
    title: "The Anatomy of a Skill",
    subtitle: "Learn the folder structure and file requirements",
    estimatedMinutes: 10,
    maxXP: 150,
    challengeType: 'folder_structure',
    lessonContent: `Every Skill is a folder. The folder name matters — it must be in **kebab-case** (lowercase words separated by hyphens). So \`meeting-action-extractor\` is correct. \`Meeting Action Extractor\` is not.

Inside the folder, one required file: \`SKILL.md\`. Note the exact casing — it must be exactly \`SKILL.md\`. Not \`skill.md\`. Not \`Skill.md\`.

This file has two parts:

**Part 1: YAML Frontmatter** — Metadata at the top, wrapped in \`---\` delimiters. Claude reads this first to decide if it should load the full Skill.

\`\`\`yaml
---
name: meeting-action-extractor
description: Extracts structured action items from messy meeting notes. Use when user pastes meeting notes and asks for action items, to-dos, or follow-ups.
---
\`\`\`

**Part 2: Markdown Body** — The actual instructions below the frontmatter.

**Optional folders:**

- \`scripts/\` — Executable code (Python, Bash)
- \`references/\` — Extra documentation
- \`assets/\` — Templates, fonts, icons

**Critical rule: No README.md** inside the Skill folder. Documentation goes in SKILL.md or references/.`,
    challengeInstructions: `### Challenge: Build the Skeleton

Complete all 3 tasks to set up your Skill's folder structure:

1. **Name the folder** for your meeting-notes-to-action-items Skill
2. **Identify the required files** — check only what's truly required
3. **Write the opening frontmatter** with just the name field`,
    hints: [
      "Folder names use kebab-case: all lowercase, words separated by hyphens.",
      "Only one file is truly required. The others are optional. And remember — one of the options should definitely NOT be in a Skill folder. (-25 XP)",
      "Here's the complete answer:\n- Folder name: meeting-action-extractor\n- Only SKILL.md is required (don't check README.md!)\n- Frontmatter:\n---\nname: meeting-action-extractor\n--- (-50 XP)"
    ],
    layer1Checks: ['Folder name is kebab-case', 'Only SKILL.md checked as required', 'README.md not checked', 'Valid YAML frontmatter delimiters', 'Name field is kebab-case'],
    completionSummary: [
      "Skill folders use kebab-case names (e.g., meeting-action-extractor)",
      "SKILL.md is the only required file — everything else is optional",
      "README.md does NOT belong inside a Skill folder",
      "YAML frontmatter goes between --- delimiters at the top of SKILL.md"
    ]
  },
  {
    id: 3,
    title: "Frontmatter is Everything",
    subtitle: "Write the metadata that makes your Skill discoverable",
    estimatedMinutes: 20,
    maxXP: 300,
    challengeType: 'code_editor',
    lessonContent: `The frontmatter is the first thing Claude reads when it encounters your Skill. It's YAML metadata between \`---\` delimiters at the top of your SKILL.md file.

Good frontmatter tells Claude:
- **What** the Skill is called (\`name\`)
- **What** it does (\`description\`)
- **When** to use it (trigger language in the description)

**Required fields:**
- \`name\`: kebab-case identifier (e.g., \`meeting-action-extractor\`)
- \`description\`: 50+ characters explaining what the Skill does and when to use it

**Rules:**
- Name must be kebab-case
- Name cannot contain "claude" or "anthropic"
- Description should include trigger language ("Use when...", "Use for...")
- No XML tags allowed in frontmatter

\`\`\`yaml
---
name: meeting-action-extractor
description: >
  Use when processing meeting notes or transcripts to extract
  structured action items with owners, deadlines, and priorities.
  Turns messy meeting documentation into clear, actionable tasks.
---
\`\`\``,
    challengeInstructions: `### Challenge: Write Your Frontmatter

Write the complete YAML frontmatter for your meeting-action-extractor Skill. It must pass all structural checks.`,
    hints: [
      "Start with --- on its own line, end with --- on its own line. Put name and description between them.",
      "Use the > character for multi-line description in YAML. Make sure it's at least 50 characters. (-25 XP)",
      "Here's the structure:\n---\nname: meeting-action-extractor\ndescription: >\n  Use when... [at least 50 chars total]\n--- (-50 XP)"
    ],
    layer1Checks: ['YAML delimiters present', 'Name is kebab-case', 'Description 50+ chars', 'Trigger language present', 'No XML tags', 'No reserved names'],
    completionSummary: [
      "Frontmatter uses YAML between --- delimiters",
      "Name must be kebab-case, description must be 50+ characters",
      "Include trigger language so Claude knows when to activate the Skill"
    ]
  },
  {
    id: 4,
    title: "Writing Instructions That Work",
    subtitle: "Create clear instructions Claude can follow",
    estimatedMinutes: 30,
    maxXP: 400,
    challengeType: 'code_editor',
    lessonContent: `After the frontmatter comes the instructions — the actual content that teaches Claude how to perform the task.

Great Skill instructions follow a pattern:

1. **Context** — What is this Skill for? (1-2 sentences)
2. **Input format** — What will the user provide?
3. **Steps** — What should Claude do, step by step?
4. **Output format** — What should the result look like?
5. **Edge cases** — What if the input is weird or incomplete?

**Tips for writing good instructions:**
- Be specific. "Extract action items" is vague. "For each action item, identify: the task, the owner, the deadline, and the priority (high/medium/low)" is clear.
- Use markdown formatting (headers, lists, bold) to structure your instructions
- Think about what a smart new hire would need to know
- Include an example of expected output`,
    challengeInstructions: `### Challenge: Write the Instructions

Write the markdown instructions section for your meeting-action-extractor Skill. Include context, input format, steps, and output format.`,
    hints: [
      "Start with a ## Context section explaining what this Skill does with meeting notes.",
      "Include clear steps: 1) Read the notes, 2) Identify action items, 3) For each item extract owner/deadline/priority, 4) Format as structured output. (-25 XP)",
      "Here's a skeleton:\n## Context\n...\n## Input\n...\n## Steps\n1. ...\n## Output Format\n...\n## Edge Cases\n... (-50 XP)"
    ],
    layer1Checks: ['Has context/overview section', 'Has input format section', 'Has steps/process section', 'Has output format section', 'At least 200 characters'],
    completionSummary: [
      "Good instructions follow: Context → Input → Steps → Output → Edge Cases",
      "Be specific about what Claude should extract and how to format it",
      "Think like you're training a smart new hire"
    ]
  },
  {
    id: 5,
    title: "Make It Trigger Right",
    subtitle: "Test and tune when your Skill activates",
    estimatedMinutes: 20,
    maxXP: 300,
    challengeType: 'trigger_test',
    lessonContent: `A great Skill is useless if Claude doesn't know when to use it. The description field in your frontmatter acts as a trigger — Claude reads it to decide whether to activate your Skill.

**Good triggers are:**
- Specific enough that the Skill doesn't fire on unrelated requests
- Broad enough that it catches all relevant requests
- Written from the user's perspective

**Example trigger phrases:**
- "Use when the user provides meeting notes or transcripts and wants action items extracted"
- "Activate when asked to process meeting documentation into structured tasks"

**Testing triggers means thinking about:**
- What queries SHOULD activate the Skill
- What queries should NOT activate it
- Edge cases that could go either way`,
    challengeInstructions: `### Challenge: Trigger Testing

Write 5 queries that SHOULD trigger your Skill and 5 that should NOT. Then we'll test them.`,
    hints: [
      "For 'should trigger': think about different ways someone might ask to process meeting notes.",
      "For 'should NOT trigger': think about requests that mention meetings but don't need action item extraction. (-25 XP)",
      "Should trigger examples: 'Here are my meeting notes, extract action items', 'Process this transcript'. Should NOT: 'Schedule a meeting', 'What was discussed in yesterday's meeting?' (-50 XP)"
    ],
    layer1Checks: ['5 trigger queries provided', '5 non-trigger queries provided', 'All fields filled'],
    completionSummary: [
      "The description field acts as a trigger for your Skill",
      "Good triggers are specific enough to avoid false activations",
      "Test both positive and negative cases"
    ]
  },
  {
    id: 6,
    title: "Break It and Fix It",
    subtitle: "Handle messy real-world inputs",
    estimatedMinutes: 25,
    maxXP: 400,
    challengeType: 'code_editor',
    lessonContent: `Real meeting notes are messy. People write in fragments, misspell names, skip dates, and mix in off-topic chatter. Your Skill needs to handle this gracefully.

**Common edge cases:**
- No clear action items in the notes
- Action items without owners or deadlines
- Multiple meetings mixed together
- Very short or very long notes
- Notes in different formats (bullet points, paragraphs, transcripts)

**Adding robustness to your instructions:**
- Add an "Edge Cases" section to your SKILL.md
- Include fallback behaviors ("If no deadline is mentioned, mark as 'TBD'")
- Add a confidence indicator ("If an action item is ambiguous, mark it as 'uncertain'")`,
    challengeInstructions: `### Challenge: Add Edge Case Handling

Update your instructions to handle messy, real-world meeting notes. Add an Edge Cases section with at least 3 edge cases and their handling strategies.`,
    hints: [
      "Think about what happens when meeting notes don't have clear owners or deadlines assigned to action items.",
      "Consider: What if the notes contain no action items? What if dates are ambiguous? What if the same task is mentioned multiple times? (-25 XP)",
      "Add sections like:\n## Edge Cases\n- **No action items found**: Return a note saying...\n- **Missing owner**: Default to...\n- **Ambiguous deadline**: ... (-50 XP)"
    ],
    layer1Checks: ['Has edge cases section', 'At least 3 edge cases', 'Has fallback behaviors', 'At least 150 characters'],
    completionSummary: [
      "Real-world inputs are messy — your Skill needs fallback behaviors",
      "Always handle: missing data, ambiguous inputs, unexpected formats",
      "Confidence indicators help users know when output might be uncertain"
    ]
  },
  {
    id: 7,
    title: "Ship It",
    subtitle: "Package and download your finished Skill",
    estimatedMinutes: 10,
    maxXP: 200,
    challengeType: 'final_review',
    lessonContent: `You've built all the pieces. Now it's time to assemble your complete SKILL.md and ship it.

**Final checklist:**
1. ✅ Frontmatter has valid name and description
2. ✅ Description includes trigger language
3. ✅ Instructions have context, input, steps, output sections
4. ✅ Edge cases are handled
5. ✅ No XML tags or reserved names
6. ✅ Markdown is well-formatted
7. ✅ The Skill actually solves the problem it claims to

**How to install your Skill:**
1. Go to Claude Settings → Skills
2. Upload your Skill folder
3. Test it with real meeting notes!`,
    challengeInstructions: `### Challenge: Final Review & Ship

Review your complete SKILL.md below. Make any final edits, then run the final test and download your Skill!`,
    hints: [
      "Review each section carefully. Make sure the frontmatter, instructions, and edge cases all work together.",
      "Check that your description clearly explains when to use the Skill. (-25 XP)",
      "If the final test fails, look at which checks failed and fix those specific sections. (-50 XP)"
    ],
    layer1Checks: ['Valid frontmatter', 'Has instructions', 'Has edge cases', 'Well-formatted markdown', 'No XML tags', 'No reserved names', 'Description has trigger language'],
    completionSummary: [
      "You built a complete, working Claude Skill from scratch!",
      "Your meeting-action-extractor can turn messy notes into structured action items",
      "Install it in Claude Settings → Skills → Upload"
    ]
  }
];

export const SCENARIOS = [
  {
    id: 1,
    text: 'Every Monday, I paste our team\'s meeting notes into Claude and ask it to extract action items with owners and deadlines. I always have to remind it to use bullet points and sort by priority.',
    options: [
      { label: 'A', text: 'Good use case for a Skill', correct: true },
      { label: 'B', text: 'A saved prompt template would be better', correct: false },
      { label: 'C', text: "This doesn't need AI at all", correct: false },
    ]
  },
  {
    id: 2,
    text: 'I need to ask Claude what the capital of France is.',
    options: [
      { label: 'A', text: 'Good use case for a Skill', correct: false },
      { label: 'B', text: 'Just ask Claude directly', correct: true },
      { label: 'C', text: 'You need an MCP connector', correct: false },
    ]
  },
  {
    id: 3,
    text: 'I want Claude to automatically monitor my Slack channels and alert me when a decision is made.',
    options: [
      { label: 'A', text: 'Good use case for a standalone Skill', correct: false },
      { label: 'B', text: 'This needs a Skill + MCP connector', correct: true },
      { label: 'C', text: "Skills can't do this at all", correct: false },
    ]
  },
  {
    id: 4,
    text: 'I write competitive analysis reports every quarter. The format is always the same. I always have to re-explain the structure.',
    options: [
      { label: 'A', text: 'Good use case for a Skill', correct: true },
      { label: 'B', text: 'A Word template would be better', correct: false },
      { label: 'C', text: 'Too complex for a Skill', correct: false },
    ]
  }
];
