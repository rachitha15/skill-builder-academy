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
    lessonContent: `Your frontmatter's \`description\` field has **two jobs** — and most people only do one of them.

**Job 1: WHAT does the Skill do?**
This is the easy part. "Extracts action items from meeting notes." Done.

**Job 2: WHEN should Claude use it?**
This is where most Skills fail. Without trigger language, Claude has to *guess* when to activate your Skill. And Claude's guesses aren't great.

### Good vs. Bad Descriptions

**✅ Good — clear WHAT + WHEN:**
- *"Extracts structured action items from meeting notes. Use when a user pastes meeting notes, standup recaps, or 1:1 notes and asks for action items, to-dos, or follow-ups."*
- *"Converts raw meeting transcripts into actionable task lists. Use when someone asks to pull out next steps, owners, or deadlines from meeting documentation."*
- *"Identifies and structures follow-up tasks from meetings. Use for processing meeting notes, standup summaries, or any notes where action items need extraction."*

**❌ Bad — vague or missing trigger:**
- *"Helps with meetings."* — Too vague, no trigger
- *"An AI assistant for extracting information."* — What information? When?
- *"meeting-action-extractor skill for Claude"* — Just repeats the name

### Trigger Phrases Users Actually Say
Think about what someone types before pasting their notes:
- *"Here are my meeting notes, can you extract the action items?"*
- *"Pull out the to-dos from this standup recap"*
- *"What are the follow-ups from this meeting?"*
- *"I pasted my 1:1 notes, find the next steps"*

Your description should contain the **keywords** from these phrases: action items, to-dos, follow-ups, next steps, meeting notes, standup.

### Input Types to Mention
Be specific about what your Skill processes:
- Meeting notes (bullet points, free-form)
- Standup recaps
- 1:1 notes
- Meeting transcripts

### Rules
- Under **1024 characters** total
- **No XML tags** (\`<\` or \`>\` characters)
- Name can't contain "claude" or "anthropic"
- Name must be **kebab-case**

> **Pro tip:** "Use when" is your best friend. It's the clearest signal to Claude that what follows is trigger criteria.`,
    challengeInstructions: `### Challenge: Write Your Frontmatter

Write the complete YAML frontmatter for your meeting-action-extractor Skill. Your frontmatter needs both a \`name\` and a \`description\` field.

**Layer 1** — Structural checks run instantly:
- \`---\` delimiters present
- \`name\` is kebab-case
- \`description\` is 50+ characters
- Trigger language included
- No \`<\` or \`>\` characters
- No reserved names

**Layer 2** — If Layer 1 passes, we run a **trigger accuracy test**. Your description is tested against 7 real user queries to see if Claude would correctly activate (or skip) your Skill. You need **4/7 correct** to pass.

Score multipliers: 7/7 = 2.0×, 6/7 = 1.7×, 5/7 = 1.4×, 4/7 = 1.1×`,
    hints: [
      "Include both WHAT and WHEN. Use phrases like 'action items', 'to-dos', 'follow-ups', 'next steps'. Mention the input types: meeting notes, standup recaps, 1:1 notes.",
      "To avoid over-triggering on scheduling queries, be specific about INPUT (meeting notes, transcripts) and OUTPUT (action items with owners and deadlines). Don't just say 'helps with meetings'. (-25 XP)",
      "Here's an example that scores 7/7:\n\n---\nname: meeting-action-extractor\ndescription: >\n  Extracts structured action items with owners, deadlines,\n  and priorities from meeting notes. Use when a user pastes\n  meeting notes, standup recaps, or 1:1 notes and asks for\n  action items, to-dos, follow-ups, or next steps.\n--- (-50 XP)"
    ],
    layer1Checks: ['YAML delimiters present', 'Name is kebab-case', 'Description 50+ chars', 'Trigger language present', 'No XML tags', 'No reserved names'],
    completionSummary: [
      "The description field has two jobs: WHAT the Skill does + WHEN to use it",
      "Trigger language ('Use when...') tells Claude when to activate your Skill",
      "Be specific about inputs (meeting notes) and outputs (action items) to avoid over-triggering"
    ]
  },
  {
    id: 4,
    title: "Writing Instructions That Work",
    subtitle: "Create clear instructions Claude can follow",
    estimatedMinutes: 30,
    maxXP: 400,
    challengeType: 'code_editor',
    lessonContent: `Your frontmatter gets Claude to load the Skill. The instructions body tells Claude what to actually DO. This is where most Skills succeed or fail — not because the idea is bad, but because the instructions are vague.

**The #1 rule: Write for a smart new hire, not for yourself.**

You know what "good action items" look like. Claude doesn't — unless you tell it. Compare:

❌ **Vague:** "Extract action items from the notes."

✅ **Specific:** "For each action item found in the meeting notes, extract: (1) the task description in one clear sentence, (2) the owner — the person responsible, identified by name, (3) the deadline — the specific date or timeframe mentioned, or 'No deadline specified' if none, (4) priority — High if blocking other work or mentioned urgently, Medium if important but not blocking, Low if nice-to-have or minor."

The second version removes ambiguity. Claude doesn't have to guess what you mean by "priority" because you defined it.

**Structuring your instructions:**

Use this pattern:
1. **Context** — What is this Skill for? One sentence.
2. **Input** — What will the user provide? Be specific about format.
3. **Steps** — What should Claude do? Number them.
4. **Output format** — What should the result look like? Show an example.
5. **Edge cases** — What happens when things are messy? (Missing owners, vague deadlines, etc.)

**The power of examples:**

Including an example input/output pair in your instructions is one of the most powerful things you can do. Claude learns patterns from examples faster than from rules.

\`\`\`
## Example

Input:
"Met with Sarah and Jake. Sarah will update the roadmap by Friday.
Jake needs to review the API docs. Oh and someone should probably
look at the billing bug eventually."

Output:
- **Update roadmap** | Owner: Sarah | Deadline: Friday | Priority: High
- **Review API docs** | Owner: Jake | Deadline: No deadline specified | Priority: Medium
- **Look at billing bug** | Owner: Unassigned | Deadline: No deadline specified | Priority: Low
\`\`\`

**Handling messy reality:**

Real meeting notes are messy. Your instructions should tell Claude how to handle this:
- If no owner is mentioned → set to "Unassigned"
- If deadline is vague → convert to nearest reasonable date or keep original phrasing
- If an action item is implied but not explicit → extract it but note "(Implied)"
- If notes contain non-action discussion → ignore it`,
    challengeInstructions: `### Challenge: Write Your Skill Instructions

Write the complete Markdown body (everything below the frontmatter) for your \`meeting-action-extractor\` Skill.

Your instructions will be tested against a sample of **messy meeting notes you haven't seen**. Claude will execute your Skill, and you'll see the actual output it produces.

**Requirements:**
- At least 200 characters
- Contains numbered steps or structured instructions
- Handles missing info (unassigned owners, vague deadlines)

**After submit:** Claude runs your instructions against the test input and evaluates on 6 criteria. You need **3/6** to pass.`,
    hints: [
      "Structure your instructions with: Context → Input → Steps → Output Format → Edge Cases. Don't forget to include an example input/output pair — Claude learns from examples faster than rules.",
      "Make sure you define what to do when: (1) no owner is mentioned → 'Unassigned', (2) deadlines are vague like 'end of week', (3) something is discussed but isn't actually an action item (like changing the standup time). These edge cases are where most Skills fail. (-25 XP)",
      "Here's a complete reference:\n\n# Meeting Action Extractor\n\n## Context\nThis Skill extracts structured action items from messy meeting notes.\n\n## Input\nUnstructured meeting notes, standup recaps, or 1:1 notes.\n\n## Steps\n1. Read through all notes carefully\n2. Identify each action item (task someone needs to do)\n3. For each action item, extract: task description, owner, deadline, priority\n4. Skip non-action items (decisions, general discussion)\n5. Format as a clean list\n\n## Output Format\n- **Task** | Owner: name | Deadline: date | Priority: High/Medium/Low\n\n## Edge Cases\n- No owner → \"Unassigned\"\n- Vague deadline → keep original phrasing\n- Implied task → extract with \"(Implied)\" note\n- Non-action discussion → skip entirely\n\n## Example\nInput: \"Sarah will update the roadmap by Friday. Someone should look at the billing bug.\"\nOutput:\n- **Update roadmap** | Owner: Sarah | Deadline: Friday | Priority: High\n- **Look at billing bug** | Owner: Unassigned | Deadline: No deadline | Priority: Low (-50 XP)"
    ],
    layer1Checks: ['Content is 200+ characters', 'Has structured instructions', 'Handles missing info', 'Contains relevant task keywords'],
    completionSummary: [
      "Good instructions follow: Context → Input → Steps → Output → Edge Cases",
      "Be specific about what Claude should extract and how to format it",
      "Include an example input/output pair — Claude learns from examples faster than rules",
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
