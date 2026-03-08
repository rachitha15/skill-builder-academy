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

- **SKILL.md** (required) — The instructions file. Written in Markdown with some YAML metadata at the top.
- **scripts/** (optional) — Code Claude can run to help with the task.
- **references/** (optional) — Extra documentation Claude can look at when needed.
- **assets/** (optional) — Templates, images, or other files used in the output.

For most Skills — including the one you'll build in this course — all you need is the SKILL.md file. That's it. One file.

**Three things that make Skills powerful:**

1. **Progressive Disclosure** — Claude doesn't load the full Skill into memory until it's needed. First it reads a short description. Only if the task matches does it read the full instructions. This keeps things fast.
2. **Composability** — Multiple Skills can work together. A meeting-notes Skill could work alongside a Skill that formats documents, or one that creates Slack messages.
3. **Portability** — A Skill works in Claude.ai, Claude Code, and the API. Build once, use everywhere.

**Let's see a real example.**

Imagine a customer support lead named Raj who gets hundreds of feedback emails weekly. He built a Skill called \`feedback-categorizer\` that reads raw customer feedback and sorts it into categories: bug report, feature request, praise, or complaint — with severity and a suggested response template. He taught Claude once, and now it handles feedback consistently every time.

That's the power of Skills. You define the workflow once, and Claude executes it reliably.

---

> **Now meet Clara.**
>
> Clara is a programme manager at Tidepool, a 40-person startup. She runs 3 standups a week, has 1:1s with 6 reports, and sits in a weekly leadership sync. After every meeting, she has a Google Doc full of chaotic notes — abbreviations, half-sentences, implied tasks.
>
> She's been pasting her notes into Claude with "give me the action items" but the results are inconsistent. She wants a Skill that handles her messy notes reliably. **You're going to build it for her.**

By Module 7, you'll have a working Skill called \`meeting-action-extractor\`. Clara will paste her messy notes, and the Skill will produce clean action items with owners, deadlines, and priority. Let's start.`,
    challengeInstructions: `### Challenge: Skill or Not a Skill?

You'll be shown 4 scenarios. For each one, identify whether a Claude Skill is the right solution. You need **3/4 correct** to pass.`,
    hints: [
      "Think about repetition. Skills shine when you do the same type of task regularly and want consistent results.",
      "Scenario 3 involves real-time monitoring of an external service. A standalone Skill can't connect to Slack on its own — it would need something extra. (-25 XP)",
      "Scenario 1: ✅ Skill (repetitive, same format every time). Scenario 2: ✅ Just ask Claude (one-off question). Scenario 3: ✅ Skill + MCP (needs external access). Scenario 4: ✅ Skill (same structure re-explained weekly). (-50 XP)"
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
    lessonContent: `Now you know what a Skill is. Let's look at what one actually looks like on the inside.

Every Skill is a folder. The folder name matters — it must be in **kebab-case** (lowercase words separated by hyphens). So \`feedback-categorizer\` is correct. \`Feedback Categorizer\` is not. \`feedback_categorizer\` is not.

Inside the folder, there's one required file: \`SKILL.md\`. Note the exact casing — it must be exactly \`SKILL.md\`. Not \`skill.md\`. Not \`Skill.md\`. Exactly \`SKILL.md\`.

This file has two parts:

**Part 1: YAML Frontmatter** — This is metadata at the very top of the file, wrapped in \`---\` delimiters. It tells Claude the name of your Skill and when to use it.

Here's what Raj's feedback categorizer looks like:

\`\`\`yaml
---
name: feedback-categorizer
description: Categorizes customer feedback into bug reports, feature requests, praise, or complaints with severity level. Use when user pastes customer emails, survey responses, or support tickets and asks to sort, categorize, or triage feedback.
---
\`\`\`

**Part 2: Markdown Body** — Everything below the frontmatter is the instructions Claude follows when the Skill is active.

\`\`\`markdown
# Feedback Categorizer

## Instructions
1. Read the customer feedback provided
2. Categorize into: Bug Report, Feature Request, Praise, or Complaint
3. Assign severity: Critical, High, Medium, Low
4. Write a 1-sentence summary
5. Suggest a response template

## Edge Cases
- If feedback contains multiple categories, create separate entries
- If sentiment is ambiguous, default to "Needs Review"
\`\`\`

**The optional folders:**

- \`scripts/\` — Python or Bash scripts Claude can run. Example: a validation script that checks output format.
- \`references/\` — Extra documentation Claude reads for context.
- \`assets/\` — Files used in the output, like report templates.

**Critical rule: No README.md** inside the Skill folder. All documentation goes in SKILL.md or references/.`,
    challengeInstructions: `### Challenge: Build Clara's Skeleton

Clara wants a Skill for extracting action items from her meeting notes. Help her set up the structure.

1. **Name the folder** for Clara's meeting-notes-to-action-items Skill
2. **Identify the required files** — check only what's truly required
3. **Write the opening frontmatter** with just the name field`,
    hints: [
      "Folder names use kebab-case: all lowercase, words separated by hyphens. No spaces, no underscores, no capitals.",
      "Only one file is truly required. The others are optional. And remember — there's one file that should NEVER be inside a Skill folder. (-25 XP)",
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
    lessonContent: `The YAML frontmatter is the most important thing you'll write. Here's why: Claude reads the frontmatter of every installed Skill at startup. It uses the \`description\` field to decide which Skills to load for any given task.

**The description field has two jobs:**

1. **What it does** — A clear statement of the Skill's purpose.
2. **When to use it** — Specific trigger phrases or situations.

Both are required. Missing either one is the #1 reason Skills fail.

**Let's look at how Raj wrote his description:**

\`\`\`yaml
description: Categorizes customer feedback into bug reports,
  feature requests, praise, or complaints with severity level
  and suggested response. Use when user pastes customer emails,
  survey responses, support tickets, or NPS comments and asks
  to sort, categorize, triage, or prioritize feedback.
\`\`\`

Why this works: It says WHAT (categorizes into specific types with severity) and WHEN (specific input types + specific trigger phrases like "sort", "categorize", "triage").

**Bad descriptions:**

❌ *"Helps with customer stuff."*
Too vague. Claude has no idea when to use it.

❌ *"An advanced NLP pipeline for multi-label sentiment classification with hierarchical taxonomy mapping."*
Technically accurate but zero trigger phrases. Claude won't match this to "hey can you sort through these support emails?"

**Pro tips for writing descriptions:**
- **Include words users actually say** — Raj used "sort", "categorize", "triage"
- **Mention input types** — Raj listed "customer emails", "survey responses", "support tickets"
- Keep it under **1024 characters** total
- **No XML tags** (\`<\` or \`>\` characters) — security restriction
- Don't put "claude" or "anthropic" in the Skill name

> **Pro tip:** "Use when" is your best friend. It's the clearest signal to Claude that what follows is trigger criteria.`,
    challengeInstructions: `### Challenge: Write Clara's Frontmatter

Clara's Skill needs to trigger when she pastes standup notes, 1:1 notes, sprint retro summaries, or leadership sync notes. It should NOT trigger when she asks Claude to draft emails, write docs, or schedule meetings.

Write the complete YAML frontmatter for Clara's \`meeting-action-extractor\` Skill. Your frontmatter needs both a \`name\` and a \`description\` field.

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
      "Remember how Raj listed specific input types AND specific actions in his description? Clara's Skill needs the same — list the types of notes she pastes AND what she asks Claude to do with them.",
      "To avoid triggering on email drafting or doc writing, be specific about what the Skill DOES (extracts action items) and what it DOESN'T do. Clara's Skill processes existing notes — it doesn't create new content. (-25 XP)",
      "Here's an example that scores 7/7:\n\n---\nname: meeting-action-extractor\ndescription: >\n  Extracts structured action items with owners, deadlines,\n  and priorities from meeting notes. Use when a user pastes\n  standup notes, 1:1 notes, sprint retro summaries, or\n  leadership sync notes and asks for action items, to-dos,\n  follow-ups, or next steps.\n--- (-50 XP)"
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
