// lennyLabData.ts — "The Lens" course for Untutorial
// Course 2: Learn RAG by building PM playbooks from Lenny's archive

export interface LessonStep {
  title: string;
  content: string;
}

export interface LennyModuleData {
  id: number;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  maxXP: number;
  lessonContent: string;
  lessonSteps: LessonStep[];
  challengeType: 'multiple_choice' | 'code_editor' | 'live_search' | 'final_review';
  challengeInstructions: string;
  hints: string[];
  layer1Checks: string[];
  completionSummary: string[];
}

export const LENNY_TOPICS = [
  { id: 'product_strategy', label: 'Product Strategy & Roadmap', icon: '🎯' },
  { id: 'user_research', label: 'User Research & Customer Discovery', icon: '🔍' },
  { id: 'plg', label: 'Product-Led Growth', icon: '🚀' },
  { id: 'metrics', label: 'Metrics and KPIs', icon: '📊' },
  { id: 'onboarding', label: 'Onboarding and Activation', icon: '⚡' },
];

export const LENNY_MODULE_DATA: LennyModuleData[] = [
  // ═══════════════════════════════════════════════════════════════
  // MISSION 1: THE FILING ROOM (Chunking)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 1,
    title: "The Filing Room",
    subtitle: "Why how you break up content matters more than how smart the AI is",
    estimatedMinutes: 8,
    maxXP: 150,
    challengeType: 'multiple_choice',
    lessonSteps: [
      {
        title: "Welcome to The Lens",
        content: `Welcome to **The Lens**.

You're about to build a PM playbook — a structured guide on a topic you care about — extracted from Lenny Rachitsky's archive of **349 newsletter posts** and **289 podcast episodes**.

But here's the catch: you can't just read 600+ pieces of content. You need AI to search, retrieve, and synthesize it for you. That's what this course teaches — how AI search actually works, learned by doing, not reading.

**By the end, you'll have:**
- A real PM playbook on your chosen topic, built from Lenny's archive
- A practical understanding of how RAG (Retrieval-Augmented Generation) works
- Enough knowledge to spec AI search for your own team

**There's one rule:** you earn the playbook by understanding how every layer works. No shortcuts.

Your first mission starts on the next step.`
      },
      {
        title: "Here's your answer",
        content: `Let's say you need advice on keeping your product competitive. You search Lenny's archive: **"How do I ensure my product stays competitive?"**

Here's what comes back:

> *"In order for a company to stay competitive, a company needs to stay entrepreneurial. If you are not constantly thinking about what's next, defining the industry standard, seeing around the corner from your competitors, you will get taken over."*
> — **Mihika Kapoor**, Product at Figma (Lenny's Podcast)

A named expert. A direct answer. Ten seconds to read.

That felt effortless. But it wasn't. Someone made a decision behind the scenes that made this possible — and if they'd made it differently, you would have gotten something very different.`
      },
      {
        title: "Without that decision",
        content: `Same search. Same podcast episode. But without that decision:

> *"I asked on Twitter, 'Who's the best product manager you've worked with?' You were the most mentioned..."*
> — **15,000 words of conversation.** Mihika's answer about staying competitive is buried at the 1 hour 16 minute mark.

The search found the right episode. But it returned ALL of it — because the transcript was never broken into searchable pieces. That 60-word answer was hiding inside 15,000 words of conversation.

**The difference?** Someone broke the podcast transcript into searchable pieces beforehand. That process is called **chunking** — and it's the most underrated decision in AI search. Get it wrong, and every search returns a wall of text. Get it right, and you get a 60-word answer from a named expert.`
      },
      {
        title: "Three ways to chunk",
        content: `There's no single "right" way to break up content. Here's the same Lenny newsletter chunked three different ways:

**By paragraph:** 72 pieces, averaging 56 words each. Many are just a transition sentence like "Let's turn to the next step." Useless on their own.

**By section headings:** 23 pieces, averaging 183 words each. Each piece is a complete topic — "How to roll out your strategy" stays intact with all its steps. **This is what produced the clean result you saw.**

**By fixed word count (every 200 words):** 21 pieces, averaging 192 words each. Uniform size, but piece #7 starts mid-sentence and piece #12 cuts a numbered list between items 2 and 3.

Same content. Three different chunking decisions. Completely different search quality.

The Mihika Kapoor quote you saw earlier? That only existed as a findable result because the podcast was chunked by **speaker turns** — keeping each speaker's complete thought together. With paragraph chunking, her answer would have been split into fragments. With fixed-size, it would have been cut mid-sentence.`
      },
    ],
    lessonContent: '',
    challengeInstructions: `### Mission Challenge: File the Intelligence

4 scenarios about chunking real content from Lenny's archive. Choose the right approach for each.

**3/4 correct to pass.**

Base XP: 100 (+50 first-mission bonus)`,
    hints: [
      "Think about what makes a search result USEFUL — is it a complete thought you can act on, or a fragment you'd need to piece together with other fragments?",
      "Think about content structure. Newsletters have section headings — that's a natural split point. Podcasts have speakers taking turns — that's a different natural split point. What happens when you use the wrong split point for the wrong content type? (-25 XP)",
      "Section-based splitting for structured content (newsletters). Speaker-turn splitting for conversations (podcasts). Fixed-size splitting for nothing — it cuts mid-thought every time. And ALWAYS inspect your data before choosing. (-50 XP)"
    ],
    layer1Checks: ['At least 3 out of 4 correct answers'],
    completionSummary: [
      "Chunking = breaking content into searchable pieces. Most overlooked decision in AI search.",
      "Different content types need different strategies — newsletters (section headings) vs podcasts (speaker turns).",
      "The same content chunked differently produces completely different search quality.",
      "✅ Mission 1 complete. Next: The Decoder."
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // MISSION 2: THE DECODER (Embeddings)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 2,
    title: "The Decoder",
    subtitle: "Why keyword search misses most of what you're looking for",
    estimatedMinutes: 8,
    maxXP: 150,
    challengeType: 'multiple_choice',
    lessonSteps: [
      {
        title: "The keyword problem",
        content: `Your content is chunked. Now you need to search it.

You search for **"How do I run effective customer discovery interviews?"**

A keyword search scans every chunk and finds: **chunks that contain the words "customer" and "discovery."** A handful of results.

But Lenny's archive has dozens of chunks about this exact topic under different words: "talking to users," "user interviews," "validating assumptions," "voice of the customer." Same concept, different vocabulary.

Keyword search is blind to meaning. It matches strings, not ideas.

When tested on Lenny's archive, keyword search found **3 matches** for a product strategy query. Semantic search found **38** — because it understood that "setting product vision" and "roadmap prioritization" and "strategic planning" are all about the same thing, even though they share few keywords.

That's a 92% miss rate from keyword search. Your playbook would be built on a fraction of available knowledge.`
      },
      {
        title: "How semantic search works",
        content: `The fix is surprisingly simple in concept: convert every chunk into a list of **1,536 numbers** that represent its meaning, not its words.

\`\`\`
"Customer discovery"  → [0.234, -0.456, 0.678, ...]
"Talking to users"    → [0.229, -0.448, 0.671, ...]
\`\`\`

These numbers are close because the **meaning** is close — even though the words are completely different.

When you search, your query also gets converted to numbers. Then the system finds chunks whose numbers are most similar to your query's numbers. Not similar words — **similar meaning.**

These meaning-numbers are called **embeddings.** Every AI search system uses them. The concept is simple: text goes in, meaning-numbers come out, and you can compare meanings mathematically.`
      },
      {
        title: "Your judgment still matters",
        content: `Semantic search is a massive upgrade over keywords. But it's not magic.

It will ALWAYS return results — ranked by similarity. It never says "I found nothing." It just gives you its best guesses.

Most of those guesses will be good. A chunk about "talking to users" will correctly show up when you search "customer discovery." That's semantic search doing its job.

But some results will be loosely related or off-topic. The system can't tell the difference between "relevant to your playbook" and "vaguely similar in meaning." **That's your job.**

As a PM working with AI search, the most important skill isn't understanding the math. It's learning to look at results critically and judge: **does this actually belong, or is the system reaching?**

That's exactly what your challenge tests.`
      }
    ],
    lessonContent: '',
    challengeInstructions: `### Mission Challenge: Trust or Toss?

You searched Lenny's archive on your chosen topic. Below are 6 search results — some are genuinely relevant to your topic, some are the embedding making a wrong connection.

For each result, decide: **Relevant** (belongs in your playbook) or **Irrelevant** (wrong connection).

**4/6 correct to pass.**

Base XP: 100 (+50 bonus)`,
    hints: [
      "Read each result carefully and ask: does this actually help someone build a playbook on my topic? Don't be fooled by shared vocabulary — 'product discovery' and 'customer discovery' sound similar but mean different things.",
      "Look at the source context. A chunk from a podcast about hiring might mention your topic in passing but not actually be ABOUT your topic. The embedding matched on a tangent, not the main point. (-25 XP)",
      "If the chunk gives actionable advice or a framework directly related to your topic, it's relevant. If it merely mentions a keyword from your topic while discussing something else entirely, it's irrelevant. (-50 XP)"
    ],
    layer1Checks: ['At least 4 out of 6 correct classifications'],
    completionSummary: [
      "Embeddings convert text into numbers representing meaning — not keywords.",
      "Semantic search finds 'talking to users' when you search 'customer discovery' — zero shared words needed.",
      "But not every result is relevant — your judgment decides what belongs in your playbook.",
      "✅ Mission 2 complete. Next: The Tracker."
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // MISSION 3: THE TRACKER (Retrieval & Threshold)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 3,
    title: "The Tracker",
    subtitle: "Finding everything is just as useless as finding nothing",
    estimatedMinutes: 10,
    maxXP: 150,
    challengeType: 'multiple_choice',
    lessonSteps: [
      {
        title: "Every result has a score",
        content: `In Mission 2, you learned that semantic search matches meaning, not keywords. But not all matches are equal.

When you search for **"How do I build a product vision and roadmap?"**, the system doesn't just find matching chunks — it scores each one. How closely does this chunk's meaning match your query?

That score is called **similarity** — a number where higher means more relevant. Think of it like a confidence level: the system is saying "I'm quite confident this chunk is what you're looking for" or "this is only loosely related."

Some chunks score high — they're directly about your query. Others score lower — they're related but not a direct hit. And some barely register — they share a vague thematic connection but aren't really what you asked for.

The question is: **where do you draw the line?**`
      },
      {
        title: "You control the cutoff",
        content: `You set the minimum similarity score you'll accept. This is called the **threshold.**

Here's what happens with the same query at three different thresholds — using real data from Lenny's archive:

**Strict threshold:**
"Product vision and roadmap" → **22 results.** 9 from newsletters, 13 from podcasts. Every result is directly about product strategy. Clean, focused, no noise.

**Medium threshold:**
Same query → **38 results.** 16 from newsletters, 22 from podcasts. You now see results that use different vocabulary — "strategic planning," "roadmap prioritization," "product direction." Broader coverage, but some results are tangentially related.

**Loose threshold:**
Same query → still 38 for this topic. But for other queries like "customer discovery," loosening the threshold adds 10+ results that are only vaguely related — diluting the useful ones.

**The threshold is a dial between two extremes:** too strict and you miss relevant content. Too loose and you drown in noise.`
      },
      {
        title: "Match the cutoff to the job",
        content: `There's no "correct" threshold. The right setting depends on what you're building.

**Need a specific framework for your playbook?**
→ Go strict. You want the 4-5 chunks that are MOST relevant. You'll get Lenny's best framework post and the podcast guest who explained it most clearly. No noise.

**Building a comprehensive section with multiple perspectives?**
→ Go medium. You want 15-20 chunks covering different angles — some experts agree, some disagree, some approach the topic differently. Breadth matters more than precision here.

**Exploring a topic you're new to?**
→ Go loose. You're not sure what you're looking for yet. Cast a wide net, scan the results, then refine with a tighter query once you know what's there.

**The decision rule is simple: what's the JOB this search needs to do?**

A playbook section called "Top Frameworks" needs strict search — precision over volume.
A section called "What Can Go Wrong" needs medium — you want every pitfall people have mentioned, even in different words.
A section called "Related Topics to Explore" needs loose — serendipity is the point.`
      },
      {
        title: "This applies everywhere",
        content: `This isn't just about building playbooks from Lenny's archive. The same threshold decision shows up in every AI search product.

**Example: a customer service bot for your company's help center.**

A customer asks: **"How do I get a refund?"**
→ You want the ONE document that explains the refund policy. Strict threshold. Show the most relevant result. Done.

A customer asks: **"I'm unhappy with my experience."**
→ Could be about billing, product quality, shipping, or support. You DON'T know what they need yet. Loose threshold. Pull in related articles across topics so the bot can address whatever the real issue is.

A customer asks: **"How do I change my subscription plan?"**
→ There's probably a main article about plan changes, plus a few related ones about billing, upgrades, and cancellation. Medium threshold. Cover the core answer plus related scenarios.

**Same product, three different queries, three different threshold settings.** The threshold isn't a one-time configuration — it's a decision you make (or let the system make) based on the type of question being asked.

This is what makes AI search a product problem, not just an engineering problem. An engineer builds the search. **A PM decides how it behaves for different situations.**`
      },
      {
        title: "Newsletters vs podcasts",
        content: `There's one more filter that matters for your playbook: **source type.**

The data reveals a pattern — newsletters and podcasts return different types of results, even on the same topic.

**Newsletter chunks** tend to be: frameworks, checklists, step-by-step guides, benchmarks. Lenny writes in a structured, actionable style.

**Podcast chunks** tend to be: stories, real examples, nuanced opinions, first-person experience. Guests share what actually happened at their companies.

For product strategy at medium threshold: **16 newsletter chunks** (frameworks) and **22 podcast chunks** (practitioner stories).

A playbook section built only from newsletters has great structure but no proof it works. One built only from podcasts has great stories but no actionable steps.

**Smart playbook builders filter by source deliberately:**
- Need a step-by-step framework? → Filter to newsletters
- Need "here's what actually happened" evidence? → Filter to podcasts
- Building a complete section? → Use both

Time to prove you can match the right approach to the right section.`
      }
    ],
    lessonContent: '',
    challengeInstructions: `### Mission Challenge: Match the Search to the Section

You're building a playbook on your chosen topic. Each section needs a different search approach.

For each playbook section below, pick the search approach that would find the best content.

**3/4 correct to pass.**

Base XP: 100 (+50 bonus)`,
    hints: [
      "Think about what type of content each section needs. A checklist needs precision. A collection of cautionary tales needs breadth. Real company stories live in podcast conversations, not written guides.",
      "Frameworks and checklists are structured — that's how Lenny writes newsletters. War stories and real examples come from podcast conversations where guests describe what actually happened. (-25 XP)",
      "Pattern: specific framework → newsletters + strict. Multiple perspectives/pitfalls → both + medium. Real company examples → podcasts + medium. Broad exploration → both + loose. (-50 XP)"
    ],
    layer1Checks: ['At least 3 out of 4 correct answers'],
    completionSummary: [
      "Different playbook sections need different search approaches — there's no one-size-fits-all.",
      "Specific frameworks → newsletters + strict. Real stories → podcasts + medium. Pitfalls → both sources.",
      "The threshold decision depends on the JOB: precision for frameworks, breadth for perspectives.",
      "✅ Mission 3 complete. Next: The Synthesizer."
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // MISSION 4: THE SYNTHESIZER (RAG)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 4,
    title: "The Synthesizer",
    subtitle: "Same search results, completely different playbook — the prompt is the product",
    estimatedMinutes: 15,
    maxXP: 300,
    challengeType: 'code_editor',
    lessonSteps: [
      {
        title: "8 Post-it notes aren't a playbook",
        content: `You've searched Lenny's archive on your topic. The system returned 8 relevant chunks — quotes from podcast guests, sections from newsletters, frameworks, and real examples.

But **8 raw chunks aren't a playbook.** They're scattered pieces from different sources, in no particular order, with no thread connecting them.

Imagine a colleague hands you 8 Post-it notes and says "here's your playbook on that topic you asked about." You'd say: "Can you... organize this? And tell me who said what? And what do I do if two of these contradict each other?"

That's exactly the gap between "search found relevant content" and "this is actually useful." Closing that gap is your job as a PM — and it all comes down to the instructions you give the AI.`
      },
      {
        title: "Same chunks, different instructions",
        content: `Here's what happens when the same 8 chunks get two different sets of instructions.

**Instruction 1:** "Summarize what these sources say."

**The result:** A generic paragraph. No expert names. No structure. You can't tell who said what or where any insight came from. It reads like ChatGPT making things up — even though every word is grounded in real sources.

**Instruction 2:** "Create a structured playbook section. Organize by theme. Cite each expert by name and company. When experts disagree, present both views."

**The result:** A structured section with headers, named experts ("According to Ebi Atawodi from YouTube/Netflix/Uber..."), and explicit contrasts where people disagree. Every claim traces back to someone real.

**Same 8 chunks. Same AI model. The ONLY difference was the instructions.** That's how much the prompt matters.`
      },
      {
        title: "This is RAG",
        content: `What you just saw has a name: **RAG — Retrieval Augmented Generation.**

- **Retrieval** = finding relevant chunks (Missions 1-3)
- **Augmented** = feeding those chunks to the AI as context
- **Generation** = the AI writes output grounded in those chunks

The key word is **augmented.** The AI doesn't make things up from memory — it generates from the content you retrieved. That's why RAG is more trustworthy than asking ChatGPT cold.

But the generation quality depends entirely on your instructions. "Summarize this" produces garbage. Specific instructions about structure, attribution, and how to handle disagreement produce something you'd actually use.

**This is where PMs have the most leverage in AI products.** Engineers build the search pipeline. PMs write the prompt that shapes what users see. Same pipeline, different prompt, completely different product.`
      },
      {
        title: "Your turn to fix it",
        content: `In the challenge, you'll see a bad prompt and its bad output — generated from real chunks on your chosen topic.

Your job: **edit the prompt to make the output useful.**

You don't need to write from scratch. Start with the bad prompt and add what's missing. Think about:
- Should the output name the experts? (Yes — you want to know who said what)
- Should it be structured? (Yes — a wall of text isn't a playbook)
- What if two experts disagree? (Surface it — don't hide it)

After you submit, the AI will run YOUR prompt against the same chunks. You'll see the bad output and your output **side by side.** The difference is the lesson.`
      }
    ],
    lessonContent: '',
    challengeInstructions: `### Mission Challenge: Fix the Prompt

Below you'll see a naive prompt and the output it produced from 8 real chunks of expert advice on your topic.

**The bad prompt:** "Summarize what these sources say."

**The bad output:** [shown above the editor — loaded from mission_4_bad_outputs.json for their topic]

Your job: **rewrite the prompt to produce a useful playbook section.**

The editor is pre-filled with the bad prompt. Edit it however you want. When you submit, the AI will run YOUR prompt against the same 8 chunks and show you the result alongside the bad output.

---

**Layer 1 checks:**
- At least 100 characters (you need to add more than "summarize")
- Different from the original bad prompt
- Mentions how to handle experts or sources (attribution)
- Mentions structure or organization

**Layer 2** — The AI runs your prompt against 8 real chunks from Lenny's archive. The output is evaluated on 4 criteria:

1. Experts are named (not anonymous advice)
2. Output has structure (headers, sections, or clear organization)
3. Multiple perspectives represented (not just one voice)
4. Output is useful (you'd reference this at work, not just skim and forget)

**3/4 to pass.**

Score multipliers: 4/4 = 2.0×, 3/4 = 1.1×`,
    hints: [
      "The bad prompt is missing three things: it doesn't ask for expert names, it doesn't ask for structure, and it doesn't say what to do when experts disagree. Add those three things and you'll pass.",
      "Try something like: 'Create a structured summary organized by theme. Cite each expert by name. When experts have different views, present both perspectives.' That's enough to dramatically improve the output. (-25 XP)",
      "Here's a prompt that scores 4/4:\n\nCreate a playbook section from these expert sources.\n- Organize by key themes, not by source\n- Cite every expert by name (e.g., 'According to [Name]...')\n- When experts disagree, present both views and explain when each applies\n- Keep it under 400 words\n- Use clear subheadings\n- Focus on actionable advice, not theory (-50 XP)"
    ],
    layer1Checks: ['At least 100 characters', 'Different from original prompt', 'Mentions experts or sources or attribution or cite', 'Mentions structure or organize or theme or section'],
    completionSummary: [
      "RAG = Retrieval + Augmented + Generation. The AI synthesizes from retrieved content, not memory.",
      "A vague prompt ('summarize this') produces generic output. Specific instructions produce useful playbooks.",
      "The three things that matter most: name the experts, add structure, surface disagreements.",
      "✅ Mission 4 complete. Next: Build your playbook."
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // MISSION 5: BUILD YOUR PLAYBOOK
  // ═══════════════════════════════════════════════════════════════
  {
    id: 5,
    title: "Build Your Playbook",
    subtitle: "Apply everything — search, calibrate, synthesize — and walk away with something real",
    estimatedMinutes: 15,
    maxXP: 250,
    challengeType: 'live_search',
    lessonSteps: [
      {
        title: "Everything you've learned",
        content: `You've completed 4 missions. Here's what you know:

**Mission 1 — The Filing Room:** You saw a clean 60-word expert quote from Mihika Kapoor — and then saw the 15,000-word wall of text you'd get without chunking. Newsletters need section-based chunking. Podcasts need speaker-turn chunking. Wrong strategy fails silently.

**Mission 2 — The Decoder:** Keyword search misses 92% of relevant content. Semantic search matches meaning, not words — "talking to users" and "customer discovery" are the same thing to the system. But it's not perfect. You had to judge which results genuinely belonged.

**Mission 3 — The Tracker:** Every result has a similarity score, and you control the cutoff. Strict for precise frameworks. Medium for broad perspectives. Loose for exploration. Newsletters return structured guides. Podcasts return practitioner stories.

**Mission 4 — The Synthesizer:** You fixed a bad prompt and saw the difference side by side. "Summarize this" produces anonymous garbage. Specific instructions about structure, attribution, and disagreement produce a playbook you'd actually use. That's RAG — retrieval augmented generation.

Now you put it all together.`
      },
      {
        title: "Your playbook",
        content: `Your playbook has **3 sections** — each covering a different angle on your chosen topic:

1. **Frameworks & best practices** — structured mental models and step-by-step guides
2. **Common mistakes & pitfalls** — what goes wrong and how to avoid it
3. **Real examples from companies** — implementation stories with specific details

The exact section titles depend on your topic — you'll see them in the challenge. You pick one to build live. The other two are pre-generated.`
      },
      {
        title: "The pipeline, visible",
        content: `Here's what happens in the challenge:

**Stage 1 — You configure:** Write your search query, pick newsletters or podcasts or both, set strict/medium/loose threshold. Every choice maps to a mission you completed.

**Stage 2 — The pipeline shows its work:** You'll see the top 6 chunks the system retrieved — with similarity scores, expert names, and source types. This is the retrieval step, made visible. You can see whether your query found what you expected. If not, you get one retry to adjust.

**Stage 3 — You write the synthesis prompt:** This is Mission 4 applied. The chunks are in front of you. Write the instructions that turn them into a useful playbook section. Name the experts. Add structure. Surface disagreements.

**Stage 4 — Build and score:** Hit "Build my section" and the AI synthesizes using YOUR prompt. You see the output and a score across 4 criteria — the same ones Mission 4 taught you.

The point isn't to get a perfect score. It's to see the full pipeline working end to end, with you making every decision.

**Head to the Challenge tab to build your playbook.**`
      }
    ],
    lessonContent: '',
    challengeInstructions: `### Mission Challenge: Build Your Playbook

Your playbook has 3 sections. Pick the one you want to build yourself — you'll run the full pipeline for that section. The other two are pre-built.

**Step 1:** Choose your section
**Step 2:** Write a search query for that section
**Step 3:** Pick source filter (newsletters / podcasts / both)
**Step 4:** Pick threshold (strict / medium / loose)
**Step 5:** Hit Search — see the top 6 chunks the pipeline retrieved
**Step 6:** Write your synthesis prompt — tell the AI how to turn those chunks into a playbook section
**Step 7:** Hit "Build my section" — see the output and how your prompt scored

Not happy with the results? You get **one retry** to adjust your query or settings before writing your prompt.

When your section is ready, the full 3-section playbook assembles automatically.

**Complete one synthesis to pass.**

Base XP: 150 (+100 bonus)`,
    hints: [
      "Match your settings to the section type. Frameworks → newsletters + strict. Mistakes → both + medium. Examples → podcasts + medium. This is what Mission 3 taught you.",
      "Your query wording matters more than your settings. Be specific: 'common PLG implementation mistakes' will find better results than 'PLG problems.' If your first search returns weak results, use your retry to rephrase. (-25 XP)",
      "Just pick any section, write a reasonable query, and hit Search. There's no wrong answer — this is your playbook. The pipeline will show you what it found, and you can decide whether to retry or synthesize. (-50 XP)"
    ],
    layer1Checks: ['1 section completed with search and synthesis'],
    completionSummary: [
      "🏆 Your playbook is ready to download.",
      "You saw the full pipeline: query → retrieval (6 chunks with scores) → synthesis.",
      "Every setting you chose was an informed product decision, not a guess.",
      "The same pipeline works on any dataset — your company docs, support tickets, research repos."
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // COMPLETION: DOWNLOAD PLAYBOOK
  // ═══════════════════════════════════════════════════════════════
  {
    id: 6,
    title: "Your Playbook",
    subtitle: "Download, share, and use what you built",
    estimatedMinutes: 5,
    maxXP: 0,
    challengeType: 'final_review',
    lessonSteps: [
      {
        title: "What you built",
        content: `Your playbook is assembled from your searches across Lenny's archive — **349 newsletters** and **289 podcast episodes** from the best minds in product.

Every section traces back to real expert advice:
- The frameworks came from Lenny's structured newsletter posts
- The examples came from practitioner conversations on the podcast
- The synthesis named experts, structured insights by theme, and surfaced different perspectives

This isn't a generic template. It's a playbook built on **your chosen topic**, using a pipeline **you understand** — from chunking to embeddings to retrieval to synthesis.`
      },
      {
        title: "What you learned",
        content: `**The RAG pipeline — in plain English:**

1. **Chunk it right** — break content into searchable pieces. Different content needs different strategies. Always inspect your data first.
2. **Embed for meaning** — convert chunks to numbers that represent meaning, not keywords. "Talking to users" and "customer discovery" are the same thing.
3. **Calibrate your search** — tune the threshold to your need. Strict for precision, loose for exploration. Newsletters return frameworks, podcasts return stories.
4. **Write the prompt** — the synthesis instructions determine the entire output quality. Same retrieval + different prompt = different product.

**Where you'll use this:**
- **Your company's knowledge base** → the same pipeline turns scattered docs into structured answers
- **Customer support chatbot** → chunk your help articles, embed them, tune thresholds per query type, write synthesis prompts for customer-facing answers
- **Research repository** → search across hundreds of reports the same way you just searched Lenny's archive
- **Any time you evaluate an AI search vendor** → you now know the right questions: how do they chunk, what embedding model, what threshold strategy, how do they synthesize?`
      },
      {
        title: "Share it",
        content: `**Your playbook is ready to download.** Use it at work. Reference it in meetings. Share it with your team.

**Your shareable card is ready.** One click to share on LinkedIn.

> *"I built a PM playbook on [your topic] — synthesized from 600+ Lenny Rachitsky posts and episodes. Along the way, I learned how RAG actually works: chunking, embeddings, retrieval, and synthesis. Built with Untutorial."*

Every PM who shares their playbook becomes a signal to others: there's a better way to learn AI than reading about it.

**Welcome to The Lens. Use what you've built.**`
      }
    ],
    lessonContent: '',
    challengeInstructions: `### Download Your Playbook

Review your complete playbook below — assembled from your searches across Lenny's archive. When ready, download the PDF and share your achievement.`,
    hints: [],
    layer1Checks: [],
    completionSummary: [
      "You built a real PM playbook by understanding every layer of AI search.",
      "The RAG framework works beyond Lenny's archive — apply it to any knowledge base.",
      "Share your playbook and your learning journey.",
      "Welcome to The Lens. 🔍"
    ]
  }
];

// ═══════════════════════════════════════════════════════════════
// MISSION 1 SCENARIOS
// ═══════════════════════════════════════════════════════════════
export const MISSION_1_SCENARIOS = [
  {
    id: 1,
    text: 'A 4,500-word newsletter about product strategy with sections like "Basic definitions," "Crafting the 2-year strategy," and "Setting roadmap priorities." You need to quickly find the section about roadmap priorities. Which chunking approach?',
    options: [
      { label: 'A', text: 'Split by paragraph — 72 pieces, avg 56 words. Fast but most pieces are fragments with no context.', correct: false },
      { label: 'B', text: 'Split by section headings — 23 pieces, avg 183 words. Each piece is a complete topic with full context.', correct: true },
      { label: 'C', text: 'Split every 200 words — 21 pieces, avg 192 words. Uniform but cuts mid-sentence and splits lists.', correct: false },
    ]
  },
  {
    id: 2,
    text: 'A 15,000-word podcast transcript between Lenny and Mihika Kapoor about product management. Two speakers taking turns for 45 minutes. No headings or sections in the raw text. Which chunking approach?',
    options: [
      { label: 'A', text: 'Split by section headings — but there are no headings in a conversation transcript.', correct: false },
      { label: 'B', text: 'Split by speaker turns — keeps each speaker\'s complete thought together as one chunk.', correct: true },
      { label: 'C', text: 'Split every 200 words — at least the pieces will be uniform, even if speakers get cut off mid-thought.', correct: false },
    ]
  },
  {
    id: 3,
    text: 'Your team adds a new content type to the archive: Lenny\'s Twitter/X threads — short, numbered posts (1/ 2/ 3/ etc), each 40-80 words long. The full thread is usually 300-500 words. How should you chunk these?',
    options: [
      { label: 'A', text: 'By paragraph — each tweet is already short enough to be its own chunk.', correct: false },
      { label: 'B', text: 'Keep the full thread as one chunk — threads are meant to be read together as one complete thought.', correct: true },
      { label: 'C', text: 'By fixed word count (200 words) — normalize them to match your other chunk sizes.', correct: false },
    ]
  },
  {
    id: 4,
    text: 'You search "How do I run pricing experiments?" and get this result: "...which is why companies that try to retrofit PLG often" — the chunk starts mid-sentence and ends mid-thought. Which chunking strategy most likely produced this?',
    options: [
      { label: 'A', text: 'Section-based chunking — splits on headings, keeps complete sections intact.', correct: false },
      { label: 'B', text: 'Speaker-turn chunking — splits when a different person starts talking.', correct: false },
      { label: 'C', text: 'Fixed-size chunking (every 200 words) — cuts at arbitrary word boundaries regardless of meaning.', correct: true },
    ]
  }
];

// ═══════════════════════════════════════════════════════════════
// MISSION 3 SCENARIOS
// ═══════════════════════════════════════════════════════════════
export const MISSION_3_SCENARIOS = [
  {
    id: 1,
    text: 'Your playbook section: **"Core frameworks and best practices"** — You need the most actionable, structured frameworks that experts have shared on your topic. Quality over quantity.',
    options: [
      { label: 'A', text: 'Search newsletters with strict threshold — Lenny\'s written guides have the most structured frameworks, and strict ensures only the most relevant ones.', correct: true },
      { label: 'B', text: 'Search podcasts with loose threshold — cast a wide net across all conversations.', correct: false },
      { label: 'C', text: 'Search both with loose threshold — get as many results as possible and sort through them.', correct: false },
    ]
  },
  {
    id: 2,
    text: 'Your playbook section: **"What can go wrong"** — You want pitfalls, mistakes, and cautionary tales from as many different perspectives as possible.',
    options: [
      { label: 'A', text: 'Search newsletters with strict threshold — find the one definitive list of mistakes.', correct: false },
      { label: 'B', text: 'Search both sources with medium threshold — newsletters have pitfall lists, podcast guests share what actually failed at their companies. Medium threshold catches varied vocabulary.', correct: true },
      { label: 'C', text: 'Search podcasts with strict threshold — only want the most relevant war stories.', correct: false },
    ]
  },
  {
    id: 3,
    text: 'Your playbook section: **"Real examples from companies"** — You need actual stories of companies implementing this, with specific details about what they did and what happened.',
    options: [
      { label: 'A', text: 'Search newsletters with strict threshold — Lenny probably wrote case studies.', correct: false },
      { label: 'B', text: 'Search both with strict threshold — only want the most precise matches.', correct: false },
      { label: 'C', text: 'Search podcasts with medium threshold — guests describe real implementation stories in conversation, and medium threshold catches examples described in different words.', correct: true },
    ]
  },
  {
    id: 4,
    text: 'You\'re not sure what subtopics exist within your playbook topic. You want to explore broadly before deciding your final section structure. What search approach?',
    options: [
      { label: 'A', text: 'Search newsletters with strict threshold — start with the best frameworks.', correct: false },
      { label: 'B', text: 'Search podcasts with medium threshold — guests cover a range of subtopics.', correct: false },
      { label: 'C', text: 'Search both sources with loose threshold — cast the widest net to discover what subtopics are covered across the entire archive.', correct: true },
    ]
  }
];

// ═══════════════════════════════════════════════════════════════
// MISSION 2 SCENARIOS — loaded dynamically per topic from JSON
// Each topic has its own guess_the_pair data with real snippets
// and similarity scores. The frontend loads the appropriate
// topic's data from mission_2_embeddings.json
// ═══════════════════════════════════════════════════════════════
// Note: Mission 2 uses the same multiple_choice UI but with
// 5 rounds of A+B / A+C / B+C options per topic.
// The scenario data is in the JSON files, not hardcoded here,
// because it varies by chosen topic.
