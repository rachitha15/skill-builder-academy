export interface LessonStep {
  title: string;
  content: string;
}

export interface ModuleData {
  id: number;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  maxXP: number;
  lessonContent: string;
  lessonSteps: LessonStep[];
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
    lessonSteps: [
      {
        title: "What is a Skill?",
        content: `Most people use Claude the same way every time — they type a request, get a response, and start from scratch next conversation. If you've ever found yourself typing "You are a PM who..." for the fifth time this week, you already feel the problem.

A **Claude Skill** is a set of instructions — packaged as a simple folder — that teaches Claude how to handle a specific task or workflow. Instead of re-explaining what you want every time, you teach Claude once, and it remembers.

Here's the key insight: **a Skill is not code.** It's a markdown file. If you can write a clear set of instructions for a new hire, you can write a Skill. That's the bar.

A Skill folder contains:

- **SKILL.md** (required) — The instructions file. Written in Markdown with some YAML metadata at the top.
- **scripts/** (optional) — Code Claude can run to help with the task.
- **references/** (optional) — Extra documentation Claude can look at when needed.
- **assets/** (optional) — Templates, images, or other files used in the output.

For most Skills — including the one you'll build in this course — all you need is the SKILL.md file. That's it. One file.`
      },
      {
        title: "Why Skills are powerful",
        content: `**Three things that make Skills powerful:**

1. **Progressive Disclosure** — Claude doesn't load the full Skill into memory until it's needed. First it reads a short description. Only if the task matches does it read the full instructions. This keeps things fast.
2. **Composability** — Multiple Skills can work together. A meeting-notes Skill could work alongside a Skill that formats documents, or one that creates Slack messages.
3. **Portability** — A Skill works in Claude.ai, Claude Code, and the API. Build once, use everywhere.

> **"But can't Claude just build a Skill for me?"**
> Sure — and it'll work fine for simple tasks. But when it doesn't trigger right, when it chokes on messy inputs, when you want something Claude's defaults can't handle — you'll wish you understood what's under the hood. This course gives you the ability to build, debug, and improve *any* Skill.`
      },
      {
        title: "Raj's example",
        content: `**Let's see a real example.**

Imagine a customer support lead named Raj who gets hundreds of feedback emails weekly. He built a Skill called \`feedback-categorizer\` that reads raw customer feedback and sorts it into categories: bug report, feature request, praise, or complaint — with severity and a suggested response template. He taught Claude once, and now it handles feedback consistently every time.

That's the power of Skills. You define the workflow once, and Claude executes it reliably.`
      },
      {
        title: "Meet Clara — your project",
        content: `> **Now meet Clara.**
>
> Clara is a programme manager at Tidepool, a 40-person startup. She runs 3 standups a week, has 1:1s with 6 reports, and sits in a weekly leadership sync. After every meeting, she has a Google Doc full of chaotic notes — abbreviations, half-sentences, implied tasks.
>
> She's been pasting her notes into Claude with "give me the action items" but the results are inconsistent. She wants a Skill that handles her messy notes reliably. **You're going to build it for her.**

By Module 7, you'll have a working Skill called \`meeting-action-extractor\`. Clara will paste her messy notes, and the Skill will produce clean action items with owners, deadlines, and priority. Let's start.`
      }
    ],
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

> **"But can't Claude just build a Skill for me?"**
> Sure — and it'll work fine for simple tasks. But when it doesn't trigger right, when it chokes on messy inputs, when you want something Claude's defaults can't handle — you'll wish you understood what's under the hood. This course gives you the ability to build, debug, and improve *any* Skill.

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
    lessonContent: `Your frontmatter gets Claude to load the Skill. The instructions body tells Claude what to actually DO. This is where most Skills succeed or fail.

**The #1 rule: Write for a smart new hire, not for yourself.**

Let's look at how Raj structured his feedback categorizer instructions:

❌ **Vague:** "Categorize the feedback."

✅ **Specific:**
\`\`\`
For each piece of customer feedback:
1. Read the full message
2. Categorize as ONE of: Bug Report, Feature Request, Praise, Complaint
3. Assign severity:
   - Critical: service outage, data loss, security issue
   - High: major feature broken, billing error
   - Medium: minor bug, UX confusion
   - Low: cosmetic issue, nice-to-have suggestion
4. Write a 1-sentence summary (max 15 words)
5. Suggest a response using the templates in references/
\`\`\`

See the difference? Raj defined exactly what each severity level means. He didn't leave Claude guessing.

**Structuring your instructions — the pattern:**

1. **Context** — What is this Skill for? One sentence.
2. **Steps** — What should Claude do? Number them.
3. **Output format** — What should the result look like? Show a template.
4. **Edge cases** — What happens when things are messy?
5. **Example** — Show an input/output pair. This is the most powerful thing you can include.

**The power of examples:**

Raj included this in his Skill:

\`\`\`
## Example

Input: "Your app crashed three times today and I lost my
draft. This is unacceptable for a paid product."

Output:
- Category: Bug Report
- Severity: Critical
- Summary: App crashes causing data loss for paid user
- Response: [Apology template + escalation to engineering]
\`\`\`

Claude learns patterns from examples faster than from rules. One good example is worth five paragraphs of instructions.

**Handling messy reality:**

Raj knew customer feedback is messy — sometimes a message is both a complaint AND a feature request. Sometimes the sentiment is unclear. So he added:

\`\`\`
## Edge Cases
- If feedback contains multiple categories, create separate entries for each
- If sentiment is ambiguous, categorize as "Needs Review" and flag for human
- If the message is not customer feedback (e.g., spam, internal), skip it
\`\`\`

Now it's your turn to write instructions for Clara. Her meeting notes are different from customer feedback — messier, with abbreviations, vague deadlines, and non-action items mixed in. Apply the same structure you just saw from Raj: Context → Steps → Output Format → Edge Cases → Example.`,
    challengeInstructions: `### Challenge: Write Clara's Instructions

Clara's standup notes are chaotic. Names are sometimes full, sometimes just initials. Deadlines are vague ("end of week", "soonish"). Some things discussed aren't action items at all. Write instructions that handle Clara's reality.

You'll write the SKILL.md body (everything below the frontmatter). **After you submit, we'll test your instructions against one of Clara's actual standups — one you haven't seen yet.**

**Requirements:**
- At least 200 characters
- Contains numbered steps or structured instructions
- Handles missing info (unassigned owners, vague deadlines)

**After submit:** Claude runs your instructions against the test input and evaluates on 6 criteria. You need **3/6** to pass.`,
    hints: [
      "Look at how Raj structured his feedback categorizer: Context → Steps → Output Format → Edge Cases → Example. Clara's Skill needs the same structure, but for meeting notes. And don't skip the example — it's the most powerful part.",
      "Clara's notes use abbreviations (T, S, J, P, mktg) and have two non-action items mixed in: the standup time change (that's a decision) and the Jira migration FYI. Your instructions need to tell Claude how to handle both. (-25 XP)",
      "Here's a complete reference:\n\n# Meeting Action Extractor\n\n## Context\nThis Skill extracts structured action items from Clara's messy meeting notes at Tidepool.\n\n## Steps\n1. Read through all notes carefully\n2. Identify each action item (task someone needs to do)\n3. For each action item, extract: task description, owner, deadline, priority\n4. Skip non-action items (decisions, FYIs, general discussion)\n5. Format as a clean list\n\n## Output Format\n- **Task** | Owner: name | Deadline: date | Priority: High/Medium/Low\n\n## Edge Cases\n- No owner mentioned → \"Unassigned\"\n- Abbreviations/initials → expand if possible, keep as-is if not\n- Vague deadline → keep original phrasing (\"end of week\")\n- Decisions (e.g., schedule changes) → exclude, note as decision\n- FYI items (no action needed) → exclude, note as FYI\n\n## Example\nInput: \"Sarah will update the roadmap by Friday. Someone should look at the billing bug.\"\nOutput:\n- **Update roadmap** | Owner: Sarah | Deadline: Friday | Priority: High\n- **Look at billing bug** | Owner: Unassigned | Deadline: No deadline | Priority: Low (-50 XP)"
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
    lessonContent: `You've built Clara's Skill and it works. But how do you know it triggers at the right times?

Clara shares the Claude workspace with 3 other PMs at Tidepool. If her Skill's description is too broad, it will hijack their unrelated queries — imagine a colleague asking Claude to draft a product brief and getting back a list of action items instead. That's **over-triggering**.

If the description is too narrow, Clara's own queries will miss — she pastes her 1:1 notes and says "what did we agree to do?" but the Skill doesn't activate because it only recognizes "extract action items." That's **under-triggering**.

**The testing framework:**

Professional Skill builders test three types of queries:

**1. Obvious triggers** — Queries that should clearly activate the Skill.

Raj tested his feedback-categorizer with: "Categorize these support tickets"

**2. Paraphrased triggers** — Same intent, completely different words. This tests whether the description is robust.

Raj tested with: "Which of these customer emails are complaints vs feature requests?" — same intent as categorizing, but phrased as a question, not a command.

**3. Negative triggers** — Queries that *seem* related but should NOT activate the Skill. These are the hardest to get right.

Raj tested with: "Write a response to this angry customer" — this is about customer feedback, but it's drafting a response, not categorizing. His Skill should NOT trigger.

**Diagnosing trigger problems:**

If your Skill **under-triggers** (misses queries it should catch), your description is missing keyword coverage. Add more trigger phrases and synonyms — "to-dos", "follow-ups", "next steps", "action items" are all ways people ask for the same thing.

If your Skill **over-triggers** (fires on unrelated queries), your description is too generic. Add specificity about the input type and output, or add negative guidance like "Do NOT use for meeting scheduling or agenda creation."

**The debugging trick:**

Ask Claude directly: "When would you use the meeting-action-extractor skill?" Claude will quote the description back and explain when it would trigger. If the answer doesn't match your intent, revise the description.`,
    challengeInstructions: `### Challenge: Test Clara's Triggers

Write 5 queries that SHOULD trigger Clara's Skill and 5 that should NOT. Think about how Clara and her colleagues actually talk to Claude.

**Requirements:**
- At least 2 positive queries must NOT contain "action items" — try paraphrasing
- At least 2 negative queries must contain "meeting" — these are the trickiest

After Layer 1 checks pass, we'll run a **trigger simulation** against Clara's Skill description from Module 3. You need **5/10 correct** to pass.

Score multipliers: 10/10 = 2.0×, 8-9/10 = 1.7×, 6-7/10 = 1.4×, 5/10 = 1.1×`,
    hints: [
      "Think about how different people ask for the same thing. Clara says 'what did we commit to?' while an engineer might say 'pull the tasks from the retro.' Same intent, very different words. For negatives, think about meeting-related tasks that AREN'T about extracting actions.",
      "The trickiest negatives are meeting-related but NOT about action extraction: 'write an agenda for tomorrow's standup', 'summarize what we discussed without listing action items', 'schedule a follow-up meeting', 'create meeting notes template'. (-25 XP)",
      "Here's a complete example test suite:\n\nShould trigger:\n1. \"Here are my standup notes, what needs to get done?\"\n2. \"What are the follow-ups from my 1:1 with Jake?\"\n3. \"Go through this retro summary and find the commitments\"\n4. \"I pasted the leadership sync notes, who owes what?\"\n5. \"Pull out everything with a deadline from these notes\"\n\nShould NOT trigger:\n1. \"Write an agenda for tomorrow's sprint planning\"\n2. \"Summarize this meeting for the team newsletter\"\n3. \"Draft a follow-up email after the client call\"\n4. \"Schedule a meeting with design and engineering\"\n5. \"Create a template for weekly status reports\" (-50 XP)"
    ],
    layer1Checks: ['All 10 fields filled (5+ chars each)', 'At least 2 positive queries without "action items"', 'At least 2 negative queries contain "meeting"'],
    completionSummary: [
      "Professional Skill builders test obvious triggers, paraphrased triggers, and negative triggers",
      "Under-triggering means missing keyword coverage — add synonyms",
      "Over-triggering means the description is too generic — add specificity",
      "The trickiest tests are meeting-related queries that AREN'T about action extraction"
    ]
  },
  {
    id: 6,
    title: "Break It and Fix It",
    subtitle: "Handle messy real-world inputs",
    estimatedMinutes: 25,
    maxXP: 400,
    challengeType: 'code_editor',
    lessonContent: `Your Skill works on Clara's Tuesday standup. But Clara doesn't only have standups — she has 1:1s, retros, and leadership syncs. Each produces a different kind of mess.

**Common ways Skills break on messy inputs:**

Raj discovered this with his feedback categorizer. It worked great on standard English emails, but then:

- A customer wrote in Spanglish: *"The app es terrible, siempre crashing"* — Raj's Skill couldn't categorize it
- Another sent just *"????"* with zero context — the Skill crashed trying to extract sentiment from nothing
- A third wrote a 2000-word essay mixing praise, complaints, AND feature requests in one message — the Skill picked one category and missed the rest

Each failure taught Raj something his instructions didn't cover. He fixed them not by adding more rules, but by **adding more examples.** Examples beat rules because rules can conflict, but examples show Claude exactly what you mean.

Here's what Raj added after the Spanglish failure:

\`\`\`
Example: Mixed Language Input

Input: "The app es terrible, siempre crashing when I try to upload files"

Output:
Category: Bug Report
Severity: High
Summary: App crashes on file upload (reported in Spanish/English)
Note: Non-English content — interpret intent, don't skip
\`\`\`

One example fixed the entire class of problems. That's the power of examples over rules.

**The iteration mindset:**

The best Skills aren't written in one pass. They're written, broken, and rewritten. This module is about building that muscle.

Clara just sent you three meeting dumps from this week. They're her worst ones. Your Skill is going to break. **That's the point.**`,
    challengeInstructions: `### Challenge: Break It and Fix It

Your instructions from Module 4 are pre-loaded in the editor. Above the editor, you'll see 3 of Clara's messiest meeting dumps — each a different kind of chaos.

**Your task:** Edit your instructions so they handle all 3 inputs. You have **up to 3 attempts**.

**Layer 1 checks:**
- At least 300 characters
- Modified from Module 4 (you can't just resubmit unchanged)
- Addresses at least 2 of: abbreviations, ambiguous ownership, implied actions, contradictions

**Layer 2:** Claude tests your instructions against all 3 inputs and evaluates on 4 criteria per input (12 total). You need **5/12** to pass.

**XP multipliers:** 11-12 = 2.0×, 9-10 = 1.7×, 7-8 = 1.4×, 5-6 = 1.1×`,
    hints: [
      "Focus on three failure modes: (1) Who owns it when the notes don't say? Input 1 has 'someone remind me' and 'probably should figure that out' — no clear owner. (2) Is this an action or just a status update? Input 2's 'FYI staging env is down' isn't an action. (3) What do abbreviations like EOW, TBD, and AI mean in context? Hint: 'AI' in Input 2 means 'Action Item', not 'Artificial Intelligence'.",
      "Add examples of tricky inputs to your instructions. Take Input 3's contradiction — 'T will take the first pass. Actually wait, S already started. Let T and S figure out who's owning it.' — and show Claude the correct output: ownership is disputed, flag both names, mark as 'Needs Resolution'. Examples fix ambiguity better than rules. (-25 XP)",
      "Add these sections to your instructions:\n\n## Handling Abbreviations\n- EOW = End of Week, TBD = To Be Determined, ASAP = As Soon As Possible\n- Single letters (J, M, S, T) are name initials\n- \"AI:\" means Action Item, not Artificial Intelligence\n- \"FYI\" = informational only, NOT an action item\n\n## Handling Ambiguous Ownership\n- \"someone should...\" = Owner: Unassigned\n- \"let X and Y figure it out\" = Owner: X & Y (Needs Resolution)\n- \"remind me to...\" = Owner: note-taker\n\n## Handling Contradictions\n- Disputed ownership → flag both parties as 'Needs Resolution'\n- Priority changes mid-note → flag as 'Priority: Conditional' (-50 XP)"
    ],
    layer1Checks: ['At least 300 characters', 'Modified from Module 4', 'Handles 2+ messy input categories'],
    completionSummary: [
      "The best Skills are written, broken, and rewritten — iteration is the skill",
      "Examples beat rules: one good example fixes an entire class of problems",
      "Handle abbreviations, ambiguous ownership, contradictions, and non-actions explicitly",
      "Real-world inputs will always surprise you — build for messiness"
    ]
  },
  {
    id: 7,
    title: "Ship It",
    subtitle: "Package and download your finished Skill",
    estimatedMinutes: 10,
    maxXP: 250,
    challengeType: 'final_review',
    lessonContent: `Clara's Skill is ready. You built it, tested it, broke it on her worst notes, and fixed it. Now let's package it.

**Your complete \`meeting-action-extractor\` Skill:**

\`\`\`
meeting-action-extractor/
└── SKILL.md
\`\`\`

One folder, one file. Simple by design.

The SKILL.md contains:
1. Your YAML frontmatter (from Module 3)
2. Your instructions body (from Module 4, refined in Module 6)

**Installing your Skill in Claude:**

1. Download the .zip file (button on the right →)
2. Open Claude.ai → Settings → Capabilities → Skills
3. Click "Upload skill"
4. Select the .zip file
5. Toggle the Skill on
6. Test it: paste meeting notes and ask for action items

Clara's Skill will now trigger automatically whenever she (or you!) pastes meeting notes and asks for action items. No more re-explaining. No more templates. Just results.

**What you've learned — the framework:**

1. Define the use case (Clara's repeatable workflow)
2. Write clear frontmatter (what + when)
3. Write specific instructions (steps + examples + edge cases)
4. Test triggers (obvious + paraphrased + negative)
5. Break it with messy inputs and fix it
6. Ship it

This framework works for ANY Skill — competitive analysis, customer research synthesis, OKR drafting, sprint planning, or whatever your workflow needs. The meeting-action-extractor was the vehicle. The skill-building framework is what you take with you.

**One more thing before you ship:**

Your Skill needs to pass one final test — a set of Clara's notes you haven't seen yet. Think of it as the final boss. Review your SKILL.md, make any last edits, and run the test.`,
    challengeInstructions: `### Challenge: Final Review & Ship

Review your complete SKILL.md below. Check off each item in the pre-ship checklist, make any final edits, then run the final test against Clara's unseen notes.

**Pass threshold:** 4/6 criteria. Base XP: 200 (+50 first attempt bonus).`,
    hints: [
      "Review each section carefully. Make sure the frontmatter, instructions, and edge cases all work together.",
      "Check that your description clearly explains when to use the Skill. (-25 XP)",
      "If the final test fails, look at which criteria failed and fix those specific sections. (-50 XP)"
    ],
    layer1Checks: ['At least 500 characters', 'Has --- delimiters', 'Has name: field', 'Has description: field', 'Has numbered steps', 'Handles edge cases'],
    completionSummary: [
      "You built a complete, working Claude Skill from scratch!",
      "Your meeting-action-extractor can turn messy notes into structured action items",
      "Install it in Claude Settings → Skills → Upload",
      "The skill-building framework works for ANY repeatable workflow"
    ]
  }
];

export const SCENARIOS = [
  {
    id: 1,
    text: 'Every Monday, Clara pastes her standup notes into Claude and asks for action items. She always has to remind it to use bullet points, flag overdue items, and sort by priority.',
    options: [
      { label: 'A', text: 'Good use case for a Skill', correct: true },
      { label: 'B', text: 'A saved prompt template would be better', correct: false },
      { label: 'C', text: "This doesn't need AI at all", correct: false },
    ]
  },
  {
    id: 2,
    text: 'Clara needs to ask Claude what time the London office opens.',
    options: [
      { label: 'A', text: 'Good use case for a Skill', correct: false },
      { label: 'B', text: 'Just ask Claude directly', correct: true },
      { label: 'C', text: 'You need an MCP connector', correct: false },
    ]
  },
  {
    id: 3,
    text: 'Clara wants Claude to automatically monitor the #engineering Slack channel and flag whenever a launch blocker is mentioned.',
    options: [
      { label: 'A', text: 'Good use case for a standalone Skill', correct: false },
      { label: 'B', text: 'This needs a Skill + MCP connector', correct: true },
      { label: 'C', text: "Skills can't do this at all", correct: false },
    ]
  },
  {
    id: 4,
    text: 'Raj (the support lead) writes the same weekly summary for leadership every Friday. Same structure, same sections, same format. He re-explains the template to Claude every time.',
    options: [
      { label: 'A', text: 'Good use case for a Skill', correct: true },
      { label: 'B', text: 'A Word template would be better', correct: false },
      { label: 'C', text: 'Too complex for a Skill', correct: false },
    ]
  }
];
