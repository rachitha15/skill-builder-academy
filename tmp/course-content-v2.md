# Untutorial — Course Content (v2)

## Course: "Build Your First Claude Skill"

> **Artifact built across the course:** A Claude Skill called `meeting-action-extractor` built for Clara, a programme manager who runs 3 standups a week and drowns in messy notes.

> **Key design principle:** Lesson examples use a DIFFERENT skill (customer feedback categorizer) to teach concepts. Exercises use Clara's story and meeting notes. This prevents copy-pasting and forces application of principles.

> **Total duration:** ~2-3 hours | **Total XP available:** ~1,050 base (up to ~1,750 with perfect multipliers)

---

## The Story

**Clara** is a programme manager at a 40-person B2B startup called Tidepool. She runs standups for 3 cross-functional pods (engineering, marketing, ops), has 1:1s with 6 direct reports, and attends a weekly leadership sync. Every meeting produces a messy Google Doc full of half-sentences, abbreviations, and unfinished thoughts.

She's been copy-pasting her notes into Claude and typing "what are the action items?" but the results are inconsistent — sometimes Claude misses implied tasks, sometimes it includes discussion points that aren't actions, and she always has to re-explain her formatting preferences.

Clara heard about Claude Skills and wants to build one that handles her chaotic notes reliably. **You're going to help her build it.**

---

## Module 1: What Even Is a Skill?

**Estimated time:** 10 minutes  
**XP available:** 100 base (up to 150 with bonus)  
**Challenge type:** Multiple choice + identification  

### Lesson Content

Most people use Claude the same way every time — they type a request, get a response, and start from scratch next conversation. If you've ever found yourself typing "You are a PM who..." for the fifth time this week, you already feel the problem.

A **Claude Skill** is a set of instructions — packaged as a simple folder — that teaches Claude how to handle a specific task or workflow. Instead of re-explaining what you want every time, you teach Claude once, and it remembers.

Here's the key insight: **a Skill is not code.** It's a markdown file. If you can write a clear set of instructions for a new hire, you can write a Skill. That's the bar.

A Skill folder contains:
- `SKILL.md` (required) — The instructions file. Written in Markdown with some YAML metadata at the top.
- `scripts/` (optional) — Code Claude can run to help with the task.
- `references/` (optional) — Extra documentation Claude can look at when needed.
- `assets/` (optional) — Templates, images, or other files used in the output.

For most Skills — including the one you'll build in this course — all you need is the SKILL.md file. That's it. One file.

**Three things that make Skills powerful:**

1. **Progressive Disclosure** — Claude doesn't load the full Skill into memory until it's needed. First it reads a short description. Only if the task matches does it read the full instructions. This keeps things fast.

2. **Composability** — Multiple Skills can work together. A meeting-notes Skill could work alongside a Skill that formats documents, or one that creates Slack messages.

3. **Portability** — A Skill works in Claude.ai, Claude Code, and the API. Build once, use everywhere.

**Let's see a real example.**

Imagine a customer support lead named Raj who gets hundreds of feedback emails weekly. He built a Skill called `feedback-categorizer` that reads raw customer feedback and sorts it into categories: bug report, feature request, praise, or complaint — with severity and a suggested response template. He taught Claude once, and now it handles feedback consistently every time.

That's the power of Skills. You define the workflow once, and Claude executes it reliably.

**Now meet Clara.**

Clara is a programme manager at Tidepool, a 40-person startup. She runs 3 standups a week, has 1:1s with 6 reports, and sits in a weekly leadership sync. After every meeting, she has a Google Doc full of chaotic notes — abbreviations, half-sentences, implied tasks.

She's been pasting her notes into Claude with "give me the action items" but the results are inconsistent. She wants a Skill that handles her messy notes reliably. **You're going to build it for her.**

By Module 7, you'll have a working Skill called `meeting-action-extractor`. Clara will paste her messy notes, and the Skill will produce clean action items with owners, deadlines, and priority. Let's start.

### Challenge: Skill or Not a Skill?

You'll be shown 4 scenarios. For each one, identify whether a Claude Skill is the right solution.

**Scenario 1:**  
> "Every Monday, Clara pastes her standup notes into Claude and asks for action items. She always has to remind it to use bullet points, flag overdue items, and sort by priority."

- A) Good use case for a Skill ✅
- B) A saved prompt template would be better
- C) This doesn't need AI at all

**Scenario 2:**  
> "Clara needs to ask Claude what time the London office opens."

- A) Good use case for a Skill
- B) Just ask Claude directly — no Skill needed ✅
- C) You need an MCP connector for this

**Scenario 3:**  
> "Clara wants Claude to automatically monitor the #engineering Slack channel and flag whenever a launch blocker is mentioned."

- A) Good use case for a standalone Skill
- B) This needs a Skill + MCP connector ✅
- C) Skills can't do this at all

**Scenario 4:**  
> "Raj (the support lead) writes the same weekly summary for leadership every Friday. Same structure, same sections, same format. He re-explains the template to Claude every time."

- A) Good use case for a Skill ✅
- B) A Word template would be better
- C) Too complex for a Skill

### Layer 1 Validation
- User must get at least 3 out of 4 correct to pass.

### Layer 2 Evaluation
- Not applicable for multiple choice. Full XP for 4/4. Partial for 3/4.

### Hints
1. **Free hint:** "Think about repetition. Skills shine when you do the same type of task regularly and want consistent results."
2. **-25 XP:** "Scenario 3 involves real-time monitoring of an external service. A standalone Skill can't connect to Slack on its own — it would need something extra."
3. **-50 XP (reveal):** Shows all correct answers with explanations.

---

## Module 2: The Anatomy of a Skill

**Estimated time:** 10 minutes  
**XP available:** 100 base (up to 150 with bonus)  
**Challenge type:** Ordering + fill-in  

### Lesson Content

Now you know what a Skill is. Let's look at what one actually looks like on the inside.

Every Skill is a folder. The folder name matters — it must be in **kebab-case** (lowercase words separated by hyphens). So `feedback-categorizer` is correct. `Feedback Categorizer` is not. `feedback_categorizer` is not.

Inside the folder, there's one required file: `SKILL.md`. Note the exact casing — it must be exactly `SKILL.md`. Not `skill.md`. Not `Skill.md`. Exactly `SKILL.md`.

This file has two parts:

**Part 1: YAML Frontmatter** — This is metadata at the very top of the file, wrapped in `---` delimiters. It tells Claude the name of your Skill and when to use it.

Here's what Raj's feedback categorizer looks like:

```yaml
---
name: feedback-categorizer
description: Categorizes customer feedback into bug reports, feature requests, praise, or complaints with severity level. Use when user pastes customer emails, survey responses, or support tickets and asks to sort, categorize, or triage feedback.
---
```

**Part 2: Markdown Body** — Everything below the frontmatter is the instructions Claude follows when the Skill is active.

```markdown
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
```

**The optional folders:**

- `scripts/` — Python or Bash scripts Claude can run. Example: a validation script that checks output format.
- `references/` — Extra documentation Claude reads for context.
- `assets/` — Files used in the output, like report templates.

**Critical rule: No README.md** inside the Skill folder. All documentation goes in SKILL.md or references/.

### Challenge: Build Clara's Skeleton

Clara wants a Skill for extracting action items from her meeting notes. Help her set up the structure.

**Task 1:** Type the correct folder name for Clara's Skill.

**Expected answer:** `meeting-action-extractor` (accept reasonable alternatives like `meeting-notes-actions`, `standup-action-items` — must be kebab-case)

**Task 2:** Which files/folders are REQUIRED for Clara's Skill to work?

- [ ] SKILL.md ✅
- [ ] scripts/
- [ ] references/
- [ ] README.md
- [ ] assets/
- [ ] package.json

**Task 3:** Write the opening YAML frontmatter delimiters and the `name` field only.

```yaml
---
name: meeting-action-extractor
---
```

### Layer 1 Validation
- Task 1: kebab-case regex check
- Task 2: Only SKILL.md is checked ✅. Deduct if README.md is selected.
- Task 3: Has `---` delimiters, `name` field present, value is kebab-case.

### Layer 2 Evaluation
- Bonus points if folder name is descriptive (Claude evaluates)

### Hints
1. **Free hint:** "Folder names use kebab-case: all lowercase, words separated by hyphens. No spaces, no underscores, no capitals."
2. **-25 XP:** "Only one file is truly required for a Skill to work. The others are optional enhancements. And remember — there's one file that should NEVER be inside a Skill folder."
3. **-50 XP (reveal):** Shows complete answer with explanation.

---

## Module 3: Frontmatter is Everything

**Estimated time:** 20 minutes  
**XP available:** 150 base (up to 300 with perfect multiplier)  
**Challenge type:** Write YAML, test against trigger queries  

### Lesson Content

The YAML frontmatter is the most important thing you'll write. Here's why: Claude reads the frontmatter of every installed Skill at startup. It uses the `description` field to decide which Skills to load for any given task.

**The description field has two jobs:**

1. **What it does** — A clear statement of the Skill's purpose.
2. **When to use it** — Specific trigger phrases or situations.

Both are required. Missing either one is the #1 reason Skills fail.

**Let's look at how Raj wrote his description:**

```yaml
description: Categorizes customer feedback into bug reports, 
  feature requests, praise, or complaints with severity level 
  and suggested response. Use when user pastes customer emails, 
  survey responses, support tickets, or NPS comments and asks 
  to sort, categorize, triage, or prioritize feedback.
```

Why this works: It says WHAT (categorizes into specific types with severity) and WHEN (specific input types + specific trigger phrases like "sort", "categorize", "triage").

**Bad descriptions:**

```yaml
description: Helps with customer stuff.
```
Too vague. Claude has no idea when to use it.

```yaml
description: An advanced NLP pipeline for multi-label 
  sentiment classification with hierarchical taxonomy mapping.
```
Technically accurate but zero trigger phrases. Claude won't match this to "hey can you sort through these support emails?"

**Pro tips for writing descriptions:**
- Include words users actually say: "action items", "to-dos", "follow-ups"
- Mention input types: "meeting notes", "standup recaps", "1:1 notes"
- Keep it under 1024 characters
- No XML tags (< >) — security restriction
- Don't put "claude" or "anthropic" in the Skill name

### Challenge: Write Clara's Frontmatter

Clara's Skill needs to trigger when she pastes standup notes, 1:1 notes, sprint retro summaries, or leadership sync notes. It should NOT trigger when she asks Claude to draft emails, write docs, or schedule meetings.

Write the complete YAML frontmatter for Clara's `meeting-action-extractor` Skill.

**Test queries (revealed AFTER submission):**

Should trigger (5):
1. "Here are my standup notes from today, can you pull out the action items?"
2. "What are the follow-ups from my 1:1 with Jake?"
3. "Extract the to-dos from this sprint retro"
4. "I pasted the leadership sync notes, what did we commit to doing?"
5. "Go through these meeting notes and find everything that needs an owner"

Should NOT trigger (2):
1. "Draft an email to the marketing team about the product launch"
2. "Write a project brief for the new onboarding flow"

### Layer 1 Validation
- `---` delimiters present
- `name` field present and in kebab-case
- `description` field present and at least 50 characters
- Description contains trigger language ("use when", "use for", etc.)
- No `<` or `>` characters
- Name does not contain "claude" or "anthropic"

### Layer 2 Evaluation Prompt

```
You are evaluating a Claude Skill's YAML frontmatter description for trigger accuracy.

Here is the user's description:
{user_description}

For each of the following queries, respond with YES if you would load this Skill, or NO if you would not.

Queries:
1. "Here are my standup notes from today, can you pull out the action items?"
2. "What are the follow-ups from my 1:1 with Jake?"
3. "Extract the to-dos from this sprint retro"
4. "I pasted the leadership sync notes, what did we commit to doing?"
5. "Go through these meeting notes and find everything that needs an owner"
6. "Draft an email to the marketing team about the product launch"
7. "Write a project brief for the new onboarding flow"

Expected: Queries 1-5 should be YES. Queries 6-7 should be NO.

Respond in JSON:
{
  "results": [
    {"query": 1, "triggered": true/false, "correct": true/false},
    ...
  ],
  "score": X out of 7,
  "feedback": "Brief specific feedback on how to improve the description"
}
```

**XP multiplier mapping:**
- 7/7: 2.0x (300 XP)
- 6/7: 1.7x (255 XP)
- 5/7: 1.4x (210 XP)
- 4/7: 1.1x (165 XP)
- Below 4: Must retry

### Hints
1. **Free hint:** "Remember how Raj listed specific input types AND specific actions in his description? Clara's Skill needs the same — list the types of notes she pastes AND what she asks Claude to do with them."
2. **-25 XP:** "To avoid triggering on email drafting or doc writing, be specific about what the Skill DOES (extracts action items) and what it DOESN'T do. Clara's Skill processes existing notes — it doesn't create new content."
3. **-50 XP (reveal):** Shows an example good description for Clara's use case.

---

## Module 4: Writing Instructions That Work

**Estimated time:** 30 minutes  
**XP available:** 200 base (up to 400 with perfect multiplier)  
**Challenge type:** Write SKILL.md body, see Claude execute it  

### Lesson Content

Your frontmatter gets Claude to load the Skill. The instructions body tells Claude what to actually DO. This is where most Skills succeed or fail.

**The #1 rule: Write for a smart new hire, not for yourself.**

Let's look at how Raj structured his feedback categorizer instructions:

❌ **Vague:** "Categorize the feedback."

✅ **Specific:** 
```
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
```

See the difference? Raj defined exactly what each severity level means. He didn't leave Claude guessing.

**Structuring your instructions — the pattern:**

1. **Context** — What is this Skill for? One sentence.
2. **Steps** — What should Claude do? Number them.
3. **Output format** — What should the result look like? Show a template.
4. **Edge cases** — What happens when things are messy?
5. **Example** — Show an input/output pair. This is the most powerful thing you can include.

**The power of examples:**

Raj included this in his Skill:

```
## Example

Input: "Your app crashed three times today and I lost my 
draft. This is unacceptable for a paid product."

Output:
- Category: Bug Report
- Severity: Critical
- Summary: App crashes causing data loss for paid user
- Response: [Apology template + escalation to engineering]
```

Claude learns patterns from examples faster than from rules. One good example is worth five paragraphs of instructions.

**Handling messy reality:**

Raj knew customer feedback is messy — sometimes a message is both a complaint AND a feature request. Sometimes the sentiment is unclear. So he added:

```
## Edge Cases
- If feedback contains multiple categories, create separate entries for each
- If sentiment is ambiguous, categorize as "Needs Review" and flag for human
- If the message is not customer feedback (e.g., spam, internal), skip it
```

Now it's your turn to write instructions for Clara.

### Challenge: Write Clara's Instructions

Clara's standup notes are chaotic. Names are sometimes full, sometimes just initials. Deadlines are vague ("end of week", "soonish"). Some things discussed aren't action items at all. Write instructions that handle Clara's reality.

**You'll write the SKILL.md body (everything below the frontmatter). After you submit, we'll test your instructions against one of Clara's actual standups — one you haven't seen yet.**

Pre-populated starter template in the editor:

```markdown
# Meeting Action Extractor

## Context

[What is this Skill for? One sentence about Clara's needs.]

## Steps

[Numbered steps for processing meeting notes]

## Output Format

[What should the structured output look like?]

## Edge Cases

[How to handle missing owners, vague deadlines, non-actions]

## Example

[Show an input/output pair — make it realistic]
```

**Test input (revealed AFTER submission — this is one of Clara's real standups):**

```
tidepool standup - tues 3/5

- T mentioned homepage redesign is stuck waiting on copy from 
  mktg. S said she'd have it by end of week but no promises
- discussed Q2 planning doc, J is supposed to have a draft 
  but didn't commit to a date
- onboarding flow bug: new users aren't getting welcome email. 
  seems urgent. no owner yet
- P asked if we can move standup to 10am starting next wk. 
  everyone agreed
- IMPORTANT: client demo thurs. T needs to prep demo env 
  by wed EOD
- quick note: we're switching from Jira to Linear next month, 
  nothing to do right now just FYI
```

**Expected output qualities:**
- At least 4 action items extracted
- "prep demo env" identified as high priority
- The standup time change and Jira→Linear note recognized as decisions/FYI, not action items
- "no owner yet" on the welcome email bug handled (e.g., "Unassigned")
- Abbreviations handled (T=Tom, S=Sarah, J=Jake, P=Priya, mktg=marketing)
- Vague deadlines surfaced clearly ("end of week", "no date committed")

### Layer 1 Validation
- Content at least 200 characters
- Contains numbered steps or structured instructions
- Contains handling for missing info ("unassigned", "no deadline", "not specified", "if no", or similar)
- Contains an example section (looks for "## Example" or "example" + an input/output pattern)

### Layer 2 Evaluation Prompt

```
You are Claude executing a Skill's instructions on meeting notes. Follow the instructions exactly, then evaluate their quality. Respond ONLY in valid JSON.

Here are the instructions to follow:
{user_instructions}

Apply them to Clara's standup notes:

tidepool standup - tues 3/5
- T mentioned homepage redesign is stuck waiting on copy from mktg. S said she'd have it by end of week but no promises
- discussed Q2 planning doc, J is supposed to have a draft but didn't commit to a date
- onboarding flow bug: new users aren't getting welcome email. seems urgent. no owner yet
- P asked if we can move standup to 10am starting next wk. everyone agreed
- IMPORTANT: client demo thurs. T needs to prep demo env by wed EOD
- quick note: we're switching from Jira to Linear next month, nothing to do right now just FYI

Respond in this JSON format:
{
  "output": "The full output produced by following the instructions",
  "criteria": [
    {"name": "At least 4 action items extracted", "passed": bool, "detail": "explanation"},
    {"name": "Demo prep marked high priority", "passed": bool, "detail": "explanation"},
    {"name": "Welcome email bug has Unassigned owner", "passed": bool, "detail": "explanation"},
    {"name": "Standup time change correctly excluded as decision", "passed": bool, "detail": "explanation"},
    {"name": "Jira-to-Linear note excluded as FYI", "passed": bool, "detail": "explanation"},
    {"name": "Clean readable output format", "passed": bool, "detail": "explanation"}
  ],
  "score": number_out_of_6,
  "feedback": "One specific, actionable suggestion to improve the instructions"
}
```

**XP multiplier mapping:**
- 6/6: 2.0x (400 XP)
- 5/6: 1.7x (340 XP)
- 4/6: 1.4x (280 XP)
- 3/6: 1.1x (220 XP)
- Below 3: Must retry

### Hints
1. **Free hint:** "Look at how Raj structured his feedback categorizer: Context → Steps → Output Format → Edge Cases → Example. Clara's Skill needs the same structure, but for meeting notes. And don't skip the example — it's the most powerful part."
2. **-25 XP:** "Clara's notes use abbreviations (T, S, J, P, mktg) and have two non-action items mixed in: the standup time change (that's a decision) and the Jira migration FYI. Your instructions need to tell Claude how to handle both."
3. **-50 XP (reveal):** Shows a complete reference set of instructions for Clara's Skill.

---

## Module 5: Make It Trigger Right

**Estimated time:** 20 minutes  
**XP available:** 150 base (up to 300 with perfect multiplier)  
**Challenge type:** Write test queries, run trigger simulation  

### Lesson Content

You've built Clara's Skill and it works. But how do you know it triggers at the right times?

Clara shares the Claude workspace with 3 other PMs at Tidepool. If her Skill's description is too broad, it will hijack their unrelated queries (over-triggering). If it's too narrow, it'll miss Clara's own notes when she phrases things differently (under-triggering).

**The testing framework:**

1. **Obvious triggers** — Queries that should clearly activate the Skill.  
   Example for Raj's feedback categorizer: "Categorize these support tickets"

2. **Paraphrased triggers** — Same intent, different words.  
   Example: "Which of these customer emails are complaints vs feature requests?"

3. **Negative triggers** — Queries that seem related but should NOT activate.  
   Example: "Write a response to this angry customer" (that's drafting, not categorizing)

**Diagnosing trigger problems:**

If your Skill under-triggers, add more keyword coverage to the description. If it over-triggers, add specificity about the input type and task, or add negative guidance.

**The debugging trick:** Ask Claude: "When would you use the meeting-action-extractor skill?" Claude will tell you based on the description. If the answer doesn't match your intent, revise.

### Challenge: Write Clara's Test Suite

Clara's Skill needs to work for her standup notes, 1:1 notes, retro summaries, and leadership sync notes. But it should NOT fire when her colleagues ask Claude to draft documents, write emails, summarize articles, or create meeting agendas.

Write 5 queries that SHOULD trigger and 5 that should NOT.

**Requirements:**
- At least 2 positive triggers must be paraphrased (not just "extract action items" variations)
- At least 2 negative triggers must be meeting-related (the tricky ones — about meetings but NOT about extracting actions)

### Layer 1 Validation
- All 10 fields filled
- At least 2 positive queries don't contain "action items"
- At least 2 negative queries contain "meeting"

### Layer 2 Evaluation Prompt

```
Given this Skill description: {user_description_from_module_3}

Test each query — would you load this skill?

Should trigger:
{queries 1-5}

Should NOT trigger:
{queries 6-10}

Also evaluate suite quality:
- Are positive triggers diverse?
- Are negative triggers genuinely tricky?
- What scenarios are missing?

JSON: {"results": [...], "trigger_score": N, "suite_quality": {"diverse": bool, "tricky": bool, "missing": [...]}, "feedback": "..."}
```

**XP mapping:** 10/10=2.0x, 8-9=1.7x, 6-7=1.4x, 5=1.1x, below 5=retry

### Hints
1. **Free hint:** "Think about how Clara describes her needs vs how her colleague might. Clara says 'what did we commit to?' while an engineer might say 'pull the tasks from the retro.' Same intent, different words."
2. **-25 XP:** "The trickiest negatives are meeting-related but NOT about action extraction: 'write an agenda for tomorrow's standup', 'summarize what we discussed', 'schedule a follow-up meeting.'"
3. **-50 XP (reveal):** Shows example test suite.

---

## Module 6: Break It and Fix It

**Estimated time:** 25 minutes  
**XP available:** 200 base (up to 400 with perfect multiplier)  
**Challenge type:** Debug a failing Skill  

### Lesson Content

Your Skill works on Clara's standup notes. But Clara doesn't only have standups — she has 1:1s, retros, and leadership syncs. Each produces a different kind of mess.

**Common ways Skills break on messy inputs:**

Raj discovered this with his feedback categorizer. It worked great on English emails, but then:
- A customer wrote in Spanglish: "The app es terrible, siempre crashing"
- Another sent just "????" with no context
- A third wrote a 2000-word essay mixing praise, complaints, and feature requests in one message

Each failure taught Raj something his instructions didn't cover. He fixed them not by adding more rules, but by adding more examples. **Examples beat rules** because rules can conflict, but examples show Claude exactly what you mean.

**The iteration mindset:** The best Skills aren't written in one pass. They're written, broken, and rewritten. Each failure is a learning signal.

### Challenge: Clara's Worst Meeting Notes

Your instructions (from Module 4) are pre-loaded in the editor. Clara just sent you three real meeting dumps from this week. They're the worst ones. Your Skill will run against each. Fix it.

**Clara's Input 1: "The Run-On Ramble" (Leadership Sync)**
```
talked to marketing today. they want to redo the landing page 
AND the pricing page but cant agree on timeline. lisa thinks 
2 weeks, dev says 4. probably should figure that out. oh and 
compliance needs the privacy policy updated before we launch 
anything public-facing. thats probably most urgent actually. 
also someone remind me to cancel the old analytics subscription 
its costing us like $500/mo for nothing.
```

**Clara's Input 2: "The Abbreviation Fest" (Engineering Standup)**
```
eng sync re: API perf issues
- J will own the db query optimization, ETA tbd
- M to check w/ infra on caching layer, prob by EOW
- need to loop in S from security for the auth token thing asap
- also FYI the staging env is down again, not blocking but annoying
- AI: revisit rate limiting strategy next sprint
```

**Clara's Input 3: "The Contradiction" (Product Review)**
```
Product review meeting 3/7:
- Homepage hero section: T will take the first pass at copy. 
  Actually wait, S said she already started on this. Let T 
  and S figure out who's owning it.
- Mobile nav: Everyone agrees it's broken. Priority is high 
  but we don't have bandwidth until next sprint. Mark it as 
  P1 but no action until sprint 14.
- Analytics dashboard: "Would be nice to have real-time data" 
  per J. Not a priority. Or actually, if the client demo goes 
  well Thursday it might become urgent. Let's revisit after 
  the demo.
```

**Task:** After seeing the output from each input, update your instructions. Up to 3 revision attempts.

### Layer 1 Validation
- Updated instructions are at least 300 characters
- Instructions were modified (diff from Module 4 version)
- Contains handling for at least 2 of: abbreviations, ambiguous ownership, implied actions, contradictions

### Layer 2 Evaluation Prompt

```
You are evaluating updated Claude Skill instructions against messy edge cases.

Instructions: {user_updated_instructions}

Run against all three inputs. For each, evaluate 4 criteria:
1. All genuine action items found
2. Non-actions correctly excluded
3. Ambiguities handled gracefully
4. Output format consistent

[Include all 3 inputs in the prompt]

JSON response with score out of 12, per-input breakdown, and feedback.
```

**XP mapping:** 11-12/12=2.0x, 9-10=1.7x, 7-8=1.4x, 5-6=1.1x, below 5=retry

### Hints
1. **Free hint:** "Focus on three failure modes: who owns it when notes don't say, is this an action or just discussion, and what do abbreviations like EOW and TBD mean in context?"
2. **-25 XP:** "Add examples of tricky inputs to your instructions. Show Claude what Input 3's contradiction looks like and what the correct output should be. Examples beat rules."
3. **-50 XP (reveal):** Shows reference updated instructions.

---

## Module 7: Ship It

**Estimated time:** 10 minutes  
**XP available:** 150 base (up to 200 with bonus)  
**Challenge type:** Assembly + download  

### Lesson Content

Clara's Skill is ready. You built it, tested it, broke it on her worst notes, and fixed it. Now let's package it.

**Your complete `meeting-action-extractor` Skill:**

```
meeting-action-extractor/
└── SKILL.md
```

One folder, one file. Simple by design.

The SKILL.md contains:
1. Your YAML frontmatter (from Module 3)
2. Your instructions body (from Module 4, refined in Module 6)

**Installing Clara's Skill:**

1. Download the .zip file
2. Open Claude.ai → Settings → Capabilities → Skills
3. Click "Upload skill"
4. Select the .zip file
5. Toggle the Skill on

Clara's Skill will now trigger automatically whenever she pastes meeting notes and asks for action items.

**What you've learned — the framework:**

1. Define the use case (Clara's repeatable workflow)
2. Write clear frontmatter (what + when)
3. Write specific instructions (steps + examples + edge cases)
4. Test triggers (obvious + paraphrased + negative)
5. Break it with messy inputs and fix it
6. Ship it

This framework works for ANY Skill — competitive analysis, customer research synthesis, OKR drafting, or whatever your workflow needs.

**Try it with your own notes (optional bonus):**

Before you download, paste YOUR OWN meeting notes in the sandbox and see Clara's Skill handle them. This is where it gets real.

### Challenge: Final Assembly

Review your complete SKILL.md (assembled from Modules 3+4+6). Make final edits. Pass the final test.

**Checklist:**
- [ ] Frontmatter has correct `---` delimiters
- [ ] Name is kebab-case
- [ ] Description includes WHAT and WHEN
- [ ] Instructions have numbered steps
- [ ] Output format is defined
- [ ] Edge cases are handled
- [ ] At least one example is included

**Final test — a NEW unseen set of Clara's notes:**

```
clara's 1:1 with jake (product eng lead) 3/8

ran long, lots to cover. mktg wants the blog post about the 
new feature out by next weds but legal hasn't signed off on 
the claims yet. jake mentioned eng isn't confident the feature 
is stable — maybe push to the week after? I (clara) need to 
make the call.

design showed new onboarding mockups in the product review — 
everyone loved them but we need to figure out who builds it. 
maybe outsource? jake will get quotes from 3 agencies by fri.

one more thing: the customer advisory board meeting got moved 
to the 15th. not an action item just FYI.

oh and jake wants to take PTO week of the 20th — I need to 
check coverage for his team. will sort that out by monday.
```

Must pass to complete. Then: download .zip + optional "try your own notes" sandbox.

### Post-Completion

- Download `meeting-action-extractor.zip`
- "Skill Builder" badge with total XP
- Social share CTA
- Optional: "Try with your own notes" sandbox
- "Want to build more?" waitlist signup

---

## Summary of Lesson vs Exercise Separation

| Module | Lesson Examples (teach concepts) | Exercise (Clara's story) |
|--------|----------------------------------|--------------------------|
| 1 | Raj's feedback-categorizer | Clara's scenario identification |
| 2 | Raj's folder structure + frontmatter | Build Clara's skeleton |
| 3 | Raj's description (good vs bad) | Write Clara's description + trigger test |
| 4 | Raj's instructions + edge cases + examples | Write Clara's instructions, tested on her standup |
| 5 | Raj's trigger testing approach | Write Clara's trigger suite (shared workspace) |
| 6 | Raj's iteration story (Spanglish, ????) | Fix Clara's Skill on 3 messy inputs |
| 7 | N/A (assembly) | Package and download Clara's Skill |

This ensures users CANNOT copy lesson examples into exercises. They learn principles from Raj, then APPLY them to Clara's different domain.

---

## Appendix: API Cost Estimates

| Module | API Calls | Estimated Cost per User |
|--------|-----------|------------------------|
| 1 | 0 (multiple choice) | $0.00 |
| 2 | 0-1 (name evaluation) | $0.00-0.01 |
| 3 | 1 (trigger simulation) | $0.01-0.02 |
| 4 | 1 (instruction execution) | $0.02-0.04 |
| 5 | 1 (trigger test suite) | $0.01-0.02 |
| 6 | 1-3 (per revision attempt) | $0.04-0.10 |
| 7 | 1 (final exam) | $0.02-0.04 |
| Hints | 0-7 (on demand) | $0.00-0.07 |
| **Total** | **5-14 calls** | **$0.10-0.30** |

With $100 in credits: **~330-1000 complete course runs**
