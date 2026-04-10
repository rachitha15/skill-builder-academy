import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ALLOWED_ORIGINS = ['https://untutorial.in', 'https://www.untutorial.in', 'http://localhost:8080'];

// 8 expert chunks per topic, pre-compiled from mission_4_synthesis.json
const TOPIC_CHUNKS: Record<string, string> = {
  product_strategy: `[Ebi Atawodi — Crafting a compelling product vision | Ebi Atawodi (YouTube, Netflix, Uber)]
Q: Okay, awesome. So before we get to that, just again reminding people what we just talked about, which is just like here's all these ways of framing your vision, and there's a lot of ways to do it. It's not like you need to make a beautiful deck that you can just write it out. You could write a press release, you could write a tweet or you could get a designer help you mock it up or just mock it up yourself. Awesome. Okay, so let's talk about your suggestions of how to actually go about developing and figuring out the vision for your product.

A: Yeah. There are three pieces if you think about it. So one is what I call empathize. The second is create. So we spend a lot of time talking about create, the middle piece. Another's evangelize. And so I empathize with the customer, the problem. I put myself in their shoes. I really get a visual understanding of what those problems are. I'll talk about it in a second the tactical way I have done that across Uber, Netflix, and Google in a way that scales. Then the create piece where it's okay, now we've solved this problem. What does the world look like? That's the vision we've just been talking about. And then finally, evangelize.

---

[The Best of Lenny’s Newsletter 2022]
### Building product

1. [Mission → Vision → Strategy → Goals → Roadmap → Task](https://www.lennysnewsletter.com/p/mission-vision-strategy-goals-roadmap)
2. [My favorite product management templates](https://www.lennysnewsletter.com/p/my-favorite-templates-issue-37)
3. [How Figma builds product](https://www.lennysnewsletter.com/p/how-figma-builds-product)
4. [How to develop product sense](https://www.lennysnewsletter.com/p/product-sense)
5. [Prioritizing a roadmap](https://www.lennysnewsletter.com/p/prioritizing)
6. [Getting better at product strategy](https://www.lennysnewsletter.com/p/getting-better-at-product-strategy)
7. [How to get better at influence](https://www.lennysnewsletter.com/p/how-to-get-better-at-influence)
8. [The Minto Pyramid Principle and the SCR framework](https://www.lennysnewsletter.com/p/minto-pyramid-principle-scr)
9. [The top 5 things PMs should know about engineering](https://www.lennysnewsletter.com/p/the-top-5-things-pms-should-know)
10. [The nature of product, with Marty Cagan (Silicon Valley Product Group)](https://www.lennysnewsletter.com/p/the-nature-of-product-marty-cagan#details)
11. [Five big ideas, with Shreyas Doshi (Stripe, Twitter, Google)](https://www.lennysnewsletter.com/p/episode-3-shreyas-doshi#details)

---

[Ebi Atawodi — Crafting a compelling product vision | Ebi Atawodi (YouTube, Netflix, Uber)]
Q: It's my pleasure. First, I just want to give a big thank you to Andre Albuquerque, who is the founder of One Month PM, who actually posted on LinkedIn about how much of a fan of yours he is and that I need to have you on this podcast. And so here we are. I want to start by talking about vision. Every product manager I've ever worked with and managed vision has always been this development area for every single one. It's always this like, "You need to get better at crafting a vision, telling your story." It's also this very powerful tool. The product managers have to align teams to be more successful in the products they're building. And you have a really neat way of thinking about a framework for developing a vision and then telling the story. What are elements of a good vision for a product or even a company?

A: I think the first piece is that you absolutely need to have one, to start by saying that. Regardless of what level you are in the company. So people say, "Oh, I'm just a junior PM." Whatever level, there is some micro macro vision that you need to have. Because essentially if you got on a plane and the pilot was like, "I don't really know where we're going, but I'm a really good pilot. The company needs to fly 400 flights this year. So I'm trying to make that happen, but trust me, we'll get there. There might be turbulence, I'm not sure." You probably would be thinking twice about staying on that flight, right? What happens is you get on there, it's like, "Our destination is Miami." Maybe I'm dreaming of beaches, "And it's going to be 24 degrees when we get there." And he always paints or she paints this image of the destination.

---

[The Best of Lenny’s Newsletter—2024 Edition]
### I want to learn to build better products

1. How the best companies operate: [Linear](https://www.lennysnewsletter.com/p/how-linear-builds-product), [Perplexity](https://www.lennysnewsletter.com/p/how-perplexity-builds-product), [Stripe](https://www.lennysnewsletter.com/p/building-product-at-stripe-jeff-weinstein), [Figma](https://www.lennysnewsletter.com/p/how-figma-builds-product), [Ramp](https://www.lennysnewsletter.com/p/how-ramp-builds-product), [Shopify](https://www.lennysnewsletter.com/p/how-shopify-builds-product), [Notion](https://www.lennysnewsletter.com/p/how-notion-builds-product), [Wiz](https://www.lennysnewsletter.com/p/building-wiz-raaz-herzberg), [Duolingo](https://www.lennysnewsletter.com/p/how-duolingo-builds-product), [Coda](https://www.lennysnewsletter.com/p/how-coda-builds-product), [Deel](https://www.lennyspodcast.com/an-inside-look-at-deels-unprecedented-growth-meltem-kuran-berkowitz-head-of-growth/), [Palantir](https://www.lennysnewsletter.com/p/the-unconventional-palantir-principles), [Gong](https://www.lennysnewsletter.com/p/how-gong-builds-product), [Meta](https://www.lennysnewsletter.com/p/metas-head-of-product-naomi-gleit)
2. [Mission → Vision → Strategy → Goals → Roadmap → Task](https://www.lennysnewsletter.com/p/mission-vision-strategy-goals-roadmap)
3. [How to get better at product strategy](https://www.lennysnewsletter.com/p/getting-better-at-product-strategy) (also check out [this](https://www.lennysnewsletter.com/p/the-ultimate-guide-to-strategy-roger-martin), [this](https://www.lennysnewsletter.com/p/good-strategy-bad-strategy-richard), and [this](https://www.lennyspodcast.com/mastering-product-strategy-and-growing-as-a-pm-maggie-crowley-toast-drift-tripadvisor/) podcast episodes)
4. [How to develop product sense](https://www.lennysnewsletter.com/p/product-sense) (also check out [this](https://www.lennysnewsletter.com/p/building-beautiful-products-with) podcast)
5. [How to develop first-principles thinking](https://www.lennysnewsletter.com/p/first-principles-thinking)

---

[Mission → Vision → Strategy → Goals → Roadmap → Task]
> ## Q: How do strategy, vision, mission, goals, and roadmap all work together? Where should I start?

First, some definitions:

- **Mission:** What are we trying to achieve?
- **Vision:** What does the world look like when we’ve achieved it?
- **Strategy:** What’s our plan for achieving it, i.e. what’s our plan to win?
- **Goals:** How will we measure progress?
- **Roadmap:** What do we need to build in order to get there?
- **Task:** What’s one unit of work we can tackle next?

#### Where should you start?

Normally you start with your **mission**—why does your team (or company) even exist? What are you trying to achieve? What is your purpose?

Some examples of great missions:

1. **Tesla**: “Accelerate the world’s transition to sustainable energy.”
2. **TED**: “Spread ideas.”
3. **Stripe:** “Increase the GDP of the internet.”
4. **IKEA**: “Create a better everyday life for the many people.”
5. **Patagonia**: “Use business to inspire and implement solutions to the environmental crisis.”
6. **Slack:** “Make work life simpler, more pleasant, and more productive.”
7. **Google:** “Organize the world’s information and make it universally accessible and useful.”
8. **World Wildlife Fund:** “Conserve nature and reduce the most pressing threats to the diversity of life on Earth.”
9. **Nike:** “Do everything possible to expand human potential.”
10. **Square:** “Make commerce easy.”

#### Vision

Next comes your **vision:** What does the world (or your product) look like when you’ve achieved your mission?

Some examples of great **vision** statements:

1. **Microsoft: “**A computer on every desk and in every home.”
2. **Alzheimer’s Association**: “A world without Alzheimer’s disease.”
3. **Teach for America: “**One day, all children in this nation will have the opportunity to attain an excellent education.”
4. **Tesla:** “Create the most compelling car company of the 21st century.”
5. **Lyft:** “A world where cities feel small again. Where transportation and tech bring people together, instead of apart.”
6. **Netflix:** “Become the best global entertainment distribution service.”

If you start with your vision before your mission, that’s totally OK. Elon Musk likely started with a vision of the world he wanted to see and then developed his mission around that. No problem. Don’t overthink it.

#### Strategy

Once you have your mission and vision, this is where **strategy** comes in. Your strategy is simply your plan to achieve your vision—your plan to win.

[I’ve written about getting better at strategy](https://www.lennysnewsletter.com/p/getting-better-at-product-strategy), and, to boil it down, a strategy is essentially a short description of your plan, with 3 to 5 concrete investments that, if you get right, will bring you closer to winning (i.e. achieving your vision). [Here are some templates](https://www.lennysnewsletter.com/i/683946/strategy) to help you frame your thinking.

Here are some high-level examples of **strategies**:

---

[Prioritizing at startups]
### **Where do I get ideas for what to build?**

You’re at a huge advantage if you’re building a product that you yourself need or wish you had. If that’s the case, then your best initial ideas will come from you and your founding team. Pay attention to these ideas.

> #### “We’d prioritize the features we wish we had when using existing ML tools. That was our base roadmap—build features that could’ve made our jobs easier back then. Until we got our product in the hands of real paying customers, we kept building things we needed as users of our own product.”
>
> #### —Tommy Dang, CEO of [Mage](https://mage.ai/)

Outside of that, the best ideas will come from conversations with your early users (and potential users). When talking to them, look for:

1. Significant pain points
2. Ideas that get them visibly excited, especially if that happens with multiple people
3. Features that would get them to switch from a competitor
4. Table stakes—features that would keep them from being able to use your product even if they wanted to
5. Potential solutions you could test quickly without a lot of code
6. Products that they’d pay you for right now if those existed
7. Early adopters to try out your early product—people who love trying new products

[Check out this post](https://www.lennysnewsletter.com/p/where-great-product-roadmap-ideas) for more ideas.

To close: remember, you are building something that has never existed before. It’s hard. There is no magical framework that will tell you what to build. And even if you prioritize perfectly, there’s no guarantee you’ll build something people will want, or a business that will last. But prioritizing smartly, and laser-focusing on making 10 (and later, many more) customers *very* happy, will give you a fighting chance at building a roaring business. Good luck!

---

[Strategy Blocks: An operator’s guide to product strategy]
### Step 1: Preparation

1. Form a small working group with a senior design leader, one or two designers, and a UX researcher.
2. Start with the company mission and vision as a grounding anchor.
3. Run some lightweight analysis on long-term cultural, social, competitive, and technological trends that are particularly relevant to the product space. It is OK to use external research or AI tools to quickly gain some of these insights.
4. Conduct interviews with senior leaders and stakeholders to understand their desire for the long-term direction of the company/product. Some questions to consider during these interviews are:

1. What does a day in the life of a user look like in 3/5/10 years?
   2. What does the product look like in 3/5/10 years?
   3. Why is the world better in 3/5/10 years as a result of our efforts?
   4. What is the most exciting version of that view?

---

[Ebi Atawodi — Crafting a compelling product vision | Ebi Atawodi (YouTube, Netflix, Uber)]
Q: Yeah. Awesome. So what is a vision concretely as a document in your experience? So we've talked about vision so far, mostly as this tagline, like a sentence, is that usually all you need when you're thinking about a vision, your experience? Do you often suggest going further into dock-deck, storyboards along those lines?

A: So I have a very simplistic framework. I actually don't know who put it together at Uber, but I see as well, one of the most powerful skills of a product manager is storytelling, right? Because you look at generation after generation after generation, what people pass on as stories, they're not numbers, they're not stats, it's stories. And actually when you blend stories with numbers, so if you do numbers alone or numbers with stories or stories alone, the gap is so wide in stories alone. So it's not metrics blended with stories. It's a story, just a pure story. This doesn't mean don't be analytical. So one of the very simplistic tools that I've used, and I use it as well right now at Google, when my team ships the product, I'll put the vision in there to remind what the vision was that they set out to do, right?`,
  user_research: `[Oji Udezue — Picking sharp problems, increasing virality, and unique product frameworks | Oji Udezue (Typeform)]
Q: Speaking of talking to customers, another one of your big bullet points in the book is around continuous customer discovery, and I'm curious what you found to be successful in actually doing that. A lot of people talk about it when you keep talking to customers, get feedback constantly. What actually works in your experience?

A: Yeah, I feel like all of park management is about discovery these days. Everyone talks about it, and I want to make a distinction. I think discovery is when you use customer conversations to understand a very specific thing that you want to optimize further workflow that you want to optimize further. And then you call the people who are most likely to be affected and you do use various research strategies to talk to them. There's a version of that also that is what I call continuous conversations, which is a Calendly and a Typeform, which we'll do more and more of. You should organize it so that your PMs, your designers, your engineering managers and your PMMs are constantly talking to customers by default. Meaning that customer conversations show up on their calendar every week automagically, without them getting involved. And then they're trained on how to have the conversation, because the death of customer discovery is friction. If you ask individuals to do customer discovery, they will not do customer discovery.

---

[Paige Costello — How to ask the right questions, project confidence, and win over skeptics | Paige Costello (Asana)]
Q: In terms of knowing the insight and knowing thy customer, putting the time, I imagine, is a big element of that. Is that how you do that, or is there anything else along those lines that's just like, "Here's how I get really good at this?"

A: When you take a new role, become best friends with a researcher, and spend time watching customers use the product firsthand because what they maybe report on or are trying to do a study about might be very different from what you observe, but you really just need that front row seat with customers, and so asking, "How do I actually set up time with customers? How do I compensate them? How do I read the tickets?" Whatever. It's amazing how little you have to do to quickly catch up to understanding who the organization is solving for well and poorly, and how people really use your product versus how your teams use your product, especially in organizations where there are heavy dogfooding cultures. It's really risky to become less sensitive to the needs and behaviors of customers because people think they are their customer, and it also becomes very navel-gazey. So I think the more you get out and break up how people are having conversations about what we should do and why, and what we shouldn't do and why, and it's not about your opinion, it's about asking questions, and then bringing insight can really change the nature of the conversation and build trust.

---

[Todd Jackson — A framework for finding product-market fit | Todd Jackson (First Round Capital)]
And I was talking a little bit about we think of it as dollar-driven customer discovery. And I think a lot of founders are familiar with customer discovery. I think they at least talk to customers, which is good. I don't think most of them do it in the highest signal way because again, the customers, they're people, they're nice, they're going to be polite. They're also not good at predicting things that they will use or buy or want.

---

[Jag Duggal — Be fundamentally different, not incrementally better | Jag Duggal (Nubank, Facebook, Google)]
I want to come back to one more thread and then I'm going to go in a different direction. You talked a bit about talking to customers, finding innovative ideas, not just listening to what they're telling you. There's this whole skill of user research and interviewing customers and finding the pain point, figuring out what to build. Do you have any just, I don't know, tips or tactics or lessons you've learned about just how to do this well, how to uncover the pain point and then figure out what to actually build when you're interviewing customers?

---

[My favorite PM interview questions]
### 7. Customer insights

> **Tell me about a time you did user research on a product/feature, and that research had a big impact on the product.**

What to look for:

- Examples of them talking to customers before launch
- These conversations impacting what they launch
- Experience using different modes of research (e.g. survey, 1:1 conversations)

Flags:

- Haven’t spent time talking to customers
- It’s hard for them to think of an example

---

[Startup to exit: Lessons from a first-time founder]
In the weeks that followed, we brought our vision to prospective customers to validate the market need. At first, we received excitement and validation. However, we realized our first several “interviews” were actually sales pitches (e.g. “here’s this cool new thing, what do you think?”). Far too biased to get any real signal. After reading up on customer interview best practices, we tried again, this time [with an unbiased script](https://www.momtestbook.com/). Not one person brought up health debit cards as a problem they needed to solve. We concluded that our vision, which we had spent many painstaking hours developing, was off the mark. Back to the drawing board—or in our case, the dining table!

---

[What to ask your users about Product-Market Fit]
### **If you can't easily survey 100+ active users, talk to 6-12 of them** 🗣

Ask questions along the lines of:

1. **Walk me through the last time you did X [where X is some essential function of your product]. For each key decision you made along the way, tell me a bit about why you made those decisions.**

*You’ll notice this question doesn’t even refer to your product at all – ask it to understand how people typically go about the key task your product is meant to enable. Then ask the following questions to see how well-suited your product is to replacing or improving that work.*
2. **What are the different products you use to do X? What are the best and worst parts of using those products? The last time you did X using this product, why did you use it instead of something else?**

*Again, where X is some essential function of your product.*
3. **Why did you try this product in the first place? What were you hoping it would do for you? How well has it delivered on that hope?**

You’ll want to keep an ear out for two things that may signal product-market fit: **a recognition of explicit, superior value relative to competitors or alternatives, and genuine enthusiasm.** There should be clear, qualitative daylight between the ways that people talk about using your product and the ways they use alternatives, and people should have no trouble articulating detailed specifics of why your product is preferable.

**There should also be an element of excitement.** If your users are telling you that they *want* to love your product because it has so much potential, then you’re only halfway there. This is where you can rely on your intuition a bit-- it may be tough to define product-market fit, but you’ll know it when you see it. You’ll also know it when you don’t.

---

[Gia Laudi — Customer-led growth | Georgiana Laudi (Forget The Funnel)]
So I mentioned it before, but we are heavy believers in the jobs-to-be-done theory, which is basically this idea that people don't buy your product, they buy the better version of themselves, yada yada. I don't need to explain any of that. But we use that to guide our research. And with SparkToro, we were in a position, and the purists will hate me saying this, but we were in a position to be able to run surveys. So yes, interviews are ideal always, but we did think that we could learn a ton from surveys to then, if needed, double down with interviews. We didn't end up actually needing to run the interviews because the surface that we ran were pretty decisive and clear in terms of what we learned. So what we did was, we identified SparkToro's best customers. Now, what I mean by best customers is those that get a ton of value from your product as of exist today, pay obviously. They're happy. They're low maintenance. And very importantly, they signed up for your product recently enough that they remember what life was like before.`,
  plg: `[Summary: The ultimate guide to adding a PLG motion | Hila Qu (Reforge, GitLab)]
### [The first step to adding a PLG motion ▶️](https://www.youtube.com/watch?v=7l1fIxk7SnA&t=1492s)

The first step in understanding the difference between the PLG funnel and the sales-led funnel (SLG)

**Sales-Led Funnel (SLG):** The sales-led funnel begins with the marketing team attracting visitors and turning them into leads. Leads are assessed based on how much they interact with marketing campaigns, like opening emails or attending webinars. A scoring system is employed, and those who reach a certain score become marketing-qualified leads and are handed over to the sales team.

**Product-Led Funnel (PLG):** This approach mirrors the B2C model more closely. Visitors sign up for a free version, account, or trial of the product, and the aim is to encourage product usage. This becomes the primary success indicator for PLG. Usage can lead to two conversion paths: a self-service purchase or sales team involvement.

- In the self-service purchase route, if the product isn't very expensive, customers may decide to buy it online without interacting with the sales team.
- In the sales team involvement route, if the customer fits the ideal customer profile (like being from a Fortune 500 company), the sales or customer success team may reach out to them to provide personalized service, potentially leading to a larger deal.

Once you understand PLG and SLG funnels, think about the user journey your product needs to have to enable successful conversion in the PLG funnel. Establish the steps necessary for users to convert, utilize the product optimally, and create a revenue-generating pathway.

---

[Five steps to starting your product-led growth motion]
## **Step 3. Anticipate the most common pitfalls**

Before going further, I want to spend some time sharing the most common pitfalls you’re likely to face when adding a PLG motion, to help you avoid them. Here’s an overview of the most common challenges, how to identify them, and how to address them:

#### **Pitfall #1: Lack of commitment and investment**

I often see companies wanting to do PLG but not committing any meaningful resources to give it a chance to be successful. You need to think deeply about why you want to add a PLG motion. What is the problem you are trying to solve, and what is the goal you are trying to achieve, with PLG? Make sure you are considering PLG not because it’s trendy but for a clear strategic reason. Because the investment—and the change required to stand up a PLG motion—is not trivial.

Each of the following is a valid strategic reason:

1. **Efficiency seeker:** Improve sales and marketing efficiency and lower CAC via a  PLG motion. Many SLG companies add a PLG motion for this reason.
2. **Growth chaser:** Unlock more growth and reach new segments, especially SMB. This is why HubSpot went downmarket with PLG.
3. **Disruptor:** Use freemium and PLG to disrupt established B2B incumbents that dominate a category. This is how Figma disrupted Adobe.
4. **Defender:** An established sales-led enterprise product may want to test PLG on a new product to develop the muscle and defend its position. This is how Gainsight experimented with PLG on Gainsight PX (its newly acquired analytics tool).
5. **PLG native:** PLG is a natural fit for your product (i.e. bottom-up SaaS), and the team wants to grow to a large scale via a PLG-native approach. Notion and Canva both fall under this category.

You may need to spend some time to think deeper, conduct research, and collect evidence. But if you build enough conviction and believe PLG is a strategic fit, you should commit to investing in the roadmap, team, and infrastructure for the next one or two years at least.

#### **Pitfall #2: The product is not ready**

In order to go PLG, you need to have a product vehicle: a free version or a free trial of your product.

Some companies have these vehicles in place already. At GitLab, we had a free version and a free trial, plus an open source product. I didn’t need to build these from scratch—the product already had a large free user base. In that case, the growth team could start developing usage-data insights and creating a PLG funnel right away.

But there are also companies that enter the PLG era without an existing free version or free trials. For example, when visitors land on their website, the only CTAs available are “request a trial” or “book a demo.”

---

[Summary: The ultimate guide to adding a PLG motion | Hila Qu (Reforge, GitLab)]
### [Why companies should have PLG and sales ▶️](https://www.youtube.com/watch?v=7l1fIxk7SnA&t=312s)

The question is not either or but both and a matter of sequencing. PLG is perfect for lowering the barrier for more people to try the product and broaden the reach. Sales motion is for a very targeted list of big customer for big orders and having a clear hit list for revenue targets.

If you are in a sales motion dominated traditional B2B software industry, you’ll will need to add PLG because competitors will be adding it and gaining an advantage. It is easier to have PLG from early on rather than trying to add it to a pure sales-led company

---

[Five steps to starting your product-led growth motion]
- **SLG** is your best bet if your product primarily targets enterprise accounts with a high price point and requires a lot of customization and configuration before anyone can use it successfully. Think Salesforce as an example. The average implementation takes three weeks to a few months, and larger enterprises even hire external consultants to assist. That level of product complexity makes time-to-value extremely long and PLG not a viable option. Although I would advise these SLG-native products to challenge their own status quo, because next-generation B2B startups may build many easy-to-use products in the same category that will unlock PLG.

For any company in between—and that is the majority of B2B SaaS companies—for maximum reach with high efficiency, there is a benefit to starting with one growth motion and eventually layering on the other. Companies like Canva and Slack started with PLG and added an SLG motion. Companies like HubSpot and GitLab started with SLG and added a PLG motion.

GitLab actually started as an open source product. Developers used it for both personal and work purposes, and so we ended up selling into all segments (i.e. SMB, mid-market, enterprise). PLG would have been a natural fit, but since the early team established a sales motion first, it made sense for us to later layer on PLG to support SMB self-service purchases, which I’ll expand on below. As it turned out, the new PLG motion also generated additional usage-based leads for enterprise sales to go after.

**🔑 Takeaway:** If you don’t have a PLG funnel today, draw a potential funnel out on a whiteboard. Imagine how a potential customer would travel through that journey, and how your product and teams might need to change to support it.

---

[Five steps to starting your product-led growth motion]
The solution goes back to executive buy-in and commitment, but there also needs to be alignment from functional leaders in sales, marketing, and growth/product to try this out. Initially there will be a lot of ambiguity about how the different pieces fit together and how the new workflow between marketing, sales, and growth should work. But I often see successful teams eventually align on the funnel, metrics, org design, and incentives to make this streamlined and effective.

**🔑 Takeaway:** You need a good reason and strong conviction to launch a PLG motion, because the investment is not trivial. If you are layering PLG on top of SLG, expect some resistance from internal teams and workflows. If you are starting net-new with PLG, your main challenge will be a lack of foundation and expertise. And make sure you have a vehicle for PLG, either a free trial or free version. If not, the first step is to build one.

---

[Five steps to starting your product-led growth motion, part 2]
## Step 5. Build your team

If you are serious about your PLG motion, you will need to have a dedicated team working on it. But, importantly, there is no “standard” PLG team setup that works for all companies. And even within a company, the ideal structure will change over time too.

---

[Summary: The ultimate guide to adding a PLG motion | Hila Qu (Reforge, GitLab)]
### [Common pitfalls in adding a PLG motion ▶️](https://www.youtube.com/watch?v=7l1fIxk7SnA&t=684s)

- **Make your product more accessible:** A big pitfall for many B2B companies is that the entry point to product-led growth (PLG) is often cut off. Their "biggest CTA is called book demo," which means you have to submit a form before even getting a taste of the product.

- The first step is you need to either have a free product, free trial, some sort of a low barrier entry for anyone who stumble upon this product to give it a try.
- **Commit to the process:** Some companies may think a simple three-month free trial will bring in leads and conversions, but that's not the case.

- They think the leads will come, conversion will come, self-service revenue will come. It's not that easy.
  - PLG is a complete motion that requires commitment and a well-thought-out roadmap, potentially spanning a year or more.
- **Don't just go 'free', go 'data-led':** Companies that want to do PLG but lack usage data are setting themselves up for failure. When offering a free product, the two returns you want are broader reach and user data. Without that you're basically giving away your product for nothing.

---

[Hila Qu — The ultimate guide to adding a PLG motion | Hila Qu (Reforge, GitLab)]
Q: You kind of shared some of the attributes of what allows you to be product led, like quick time to value. If you have this in your head, what are some of those bullet points of what you need to figure out for it to be successful potentially as product led?

A: The first thing is that have a... And you mentioned you are able to have a vehicle, have a free version, have a free trial. Sometimes it's a open source product. A lot of developer products start as a open source product. It has its constraints, but it is also a great kind of vehicle for PLG or if none of those are option, you can build a really realistic kind of experience. For example, I remember Amplitude, they are pursuing PLG now, but they used to have a lot of barrier. As an end user, it's hard for me to put that code into my product and see my data, but they build a really realistic interactive demo that's getting closer to PLG. So it's not PLG, but it's getting closer and you can already see the value and play with it yourself. So that's the first step. Have a vehicle.`,
  metrics: `[Jeff Weinstein — Building product at Stripe: craft, metrics, and customer obsession | Jeff Weinstein (Product lead)]
I somewhat walk around with the belief that the product manager's responsibility is to produce product market fit. And okay, how do you know you have product market fit? Charts that showcase things are going up into the right on one hand, and then tweets on the other. So metrics like quantitative and qualitative, and I really see them as deep siblings and equals, you really need both. It's not oh, OKRs versus something. There are some things you want the texture of the person on video showing how complicated a thing was. And then also, we're trying to make an economically viable system that we can run at large scale and you can't keep all that stuff in your head and need to measure it. And so, I think metrics at their best are a numerical representation of the value we're providing for the customer.

---

[Jeff Weinstein — Building product at Stripe: craft, metrics, and customer obsession | Jeff Weinstein (Product lead)]
Let's talk about metrics, going in a different direction. Many people told me I need to ask you about picking metrics and the importance of metrics and how you think about metrics. So let me just maybe start with a question of, just why do you think picking the right metric and why are metrics so important in building successful products?

---

[Gia Laudi — Customer-led growth | Georgiana Laudi (Forget The Funnel)]
We know we've done a good job when the conversion rate on whatever our primary CTA is on our website, whether or not it's start a trial or request a demo, something like that. Generally, the struggle phase is very straightforward in terms of measurement. That's like marketers' bread and butter, that's where they live and breathe all day long. Where things start to change though generally when we're working with companies is helping them figure out how should they be measuring first value or product activation and how should they be measuring actual product engagement. Generally, what we do there is, we can associate basically what they told us brings them the most amount of value with the product attribute or parts of the product that deliver that value. We try to tie the KPI obviously to some sort of meaningful product usage of that key part of the product or product attribute.

---

[Gia Laudi — Customer-led growth | Georgiana Laudi (Forget The Funnel)]
A critical part of that process obviously is identifying we have to measure success along the way. There should be a KPI for each of those stages in that customer journey. And for the most part, they won't be a big surprise on the struggle side of things. People out in the world experience the problem, how are we going to know we're doing a good job reaching them? We bring in new unique website visitors. In general, that would be the measure of success for the problem milestone. And then next piece of the puzzle is like, okay, once they discover that we exist, even if they are visiting, reading product reviews and visiting competitor sites or whatever, we'll know we've done a good job of convincing them that we can help solve their problem and deterring the people that we don't want.

---

[How Gong builds product]
### **4. Do you use OKRs in some form?**

We don’t use OKRs on the product team.

We tried using OKRs at Gong at some stage across the company, but we found out that the process of updating OKRs to align with reality was time-consuming and the framework did not provide us with enough benefits to justify the effort. However, we review this decision annually. We may decide to give OKRs another shot at a company level in the coming year or two, since we haven’t found a better mechanism to drive cross-functional goal alignment.

Individual groups within the product team set up KPIs or metrics to track product progress. These are usually not managed top-down but serve as a vehicle for tracking and optimization rather than a true objective.

During periods preceding new product launches, we’ve set up more structured KPIs to ensure we launch with confidence. That ensures that both internal metrics (e.g. stability) and external metrics (e.g. number of successful customers) would drive a successful launch.

For example, when we recently launched our sales engagement product, we initially looked at metrics such as connect rates for our web dialer (a stability metric). As we became convinced that the product is stable, we focused our attention more on outcome metrics. For example, since the product helps sellers book meetings, we looked at the number of meetings booked by a typical seller to ensure that we deliver the intended value. As we became convinced that the product delivers value, we focused our attention on more operational metrics, for example, how long it takes a new customer to launch. And naturally, business metrics such as attach rates to existing customers, ARPU [average revenue per user], and similar.

---

[The most important marketplace metrics to track]
Whether you’re building a marketplace, a SaaS platform, a DTC business, or most any type of online business, you should also be tracking these five foundational metrics:

1. **Cohort-based retention:** Percentage of users who come back x months later
2. **Net revenue retention:** How much you grow revenue per customer over time
3. **New user growth:** Number of new users per day/week/month
4. **CAC/LTV, payback period, or contribution margin:** Cost to acquire a new user vs. money you make from each new user
5. **Unit economics (optional):** How much profit you make per order

#### Other marketplace-specific metrics to consider tracking:

For completeness, though the four marketplace KPIs above are the *most* essential for every marketplace, I’d also track and work to optimize 3-5 metrics from the list below that most support your current growth strategy:

1. **Average order value:** Average dollars spent per transaction
2. **Share of wallet:** The percentage of spend in this category that goes to you
3. **Supply success:** The average and/or median number of transactions per seller
4. **Demand conversion:** Visit → Search → “Add to cart” → Book
5. **Supply conversion:** Visit → Learn more → Begin signing up → Go live → Activated
6. **Time to fill:** How long it takes to fill a customer request (e.g. Uber request)
7. **Supply retention:** The percentage of supply that sticks around x months later
8. **Frequency of transactions**: How often customers use your product per week/month
9. **Results per search:** Number of viable options customers see when searching
10. **Take rate:** How much you able to take from each transaction, on average

---

[Jeff Weinstein — Building product at Stripe: craft, metrics, and customer obsession | Jeff Weinstein (Product lead)]
Well, what was the value that we're trying to produce for the customer and can we measure it from their perspective? And okay, how do you know you have product market fit? Charts that showcase things are going up into the right on one hand and then tweets on the other.

---

[The definitive guide to mastering analytical thinking interviews]
### How to practice metrics frameworks

With the products you chose earlier, spend about 10 minutes doing the following exercise with each:

- Identify the ecosystem players, map out what value they get and what actions they take, and create specific metrics with time frames that actually make sense.
- Then define a North Star metric that can grow indefinitely, and pair it with guardrail metrics that address the biggest ways your NSM could mislead you.
- To build your verbal communication muscle, walk a friend or two through your thinking. Ask them if they understand who benefits from the product, how success would be measured, and why you chose your specific North Star metric over alternatives. If they can clearly explain back your measurement logic and see the connection between value and metrics, you’re in good shape!`,
  onboarding: `[What is a good activation rate]
## 1. What is activation rate?

Your activation rate is the percentage of your new users who hit your activation milestone. Concretely:

\`activation rate = [users who hit your activation milestone] / [users who completed your signup flow].\`

Your activation milestone (often referred to as your “aha moment”) is the earliest point in your onboarding flow that, by showing your product’s value, is predictive of long-term retention. A user is typically considered activated when they reach this milestone.

A good activation event is often associated with the beginnings of a user forming a new habit inside the product, and since increasing activation rate is one of the best levers for increasing retention, it’s often a major focus for growth teams.

---

[What is a good activation rate]
## 4. What are the most common ways to increase activation?

In our survey, we asked, “**If you’ve had success improving activation rate, what change has had the biggest impact?**”

Here are the eight most commonly referenced tactics:

1. [Simpler onboarding UI/UX](https://www.lennysnewsletter.com/i/77646597/i-simpler-onboarding-uiux)
2. [Reducing onboarding friction](https://www.lennysnewsletter.com/i/77646597/ii-reducing-onboarding-friction)
3. [Emails and follow-up comms](https://www.lennysnewsletter.com/i/77646597/iii-emails-and-follow-up-comms)
4. [Optimizing copy](https://www.lennysnewsletter.com/i/77646597/iv-optimizing-copy)
5. [Smarter top-of-funnel targeting](https://www.lennysnewsletter.com/i/77646597/v-smarter-top-of-funnel-targeting)
6. [Sales outreach](https://www.lennysnewsletter.com/i/77646597/vi-sales-outreach)
7. [Adding incentives](https://www.lennysnewsletter.com/i/77646597/vii-adding-incentives)
8. [Showing value earlier](https://www.lennysnewsletter.com/i/77646597/viii-showing-value-earlier)

Here are direct quotes from survey responders sharing what most helped them increase their activation rate:

#### **i. Simpler onboarding UI/UX**

1. “Removing distracting CTAs between sign-up event and activation event”
2. “Hiding a confusing button on home page for new users”
3. “Simplifying the flow”
4. “Simplify setup process”
5. “Simplify the flow to make a first booking”
6. “Changed the flow to have fewer steps and improved it 20%”
7. “Reducing number of steps”
8. “Removing unnecessary steps, calming anxieties at each stage”
9. “Break down the core steps to simplify booking flow”
10. “Reducing the number of steps during onboarding”
11. “Reduce steps to onboarding flow”
12. “Reducing the steps required in the onboarding flow”
13. “Reducing multiple steps in onboarding flow”
14. “Reducing steps in the onboard flow”
15. “Shorten funnel”
16. “Shorten steps”
17. “Simplifying the onboarding process and requirements”
18. “Focused onboarding—improving relevance of the features we expose to the customer”
19. “Driving all attention into one seeded task for guided completion”
20. “Order of how tasks are presented made the biggest difference”
21. “Breaking down the learning curve to 3-4 actionable steps and guiding them through it in the product”
22. “Simple, mobile-optimized sign-up flow”
23. “Don’t allow the user to do anything before the group is created”

#### ii. Reducing onboarding friction

---

[Lauryn Isford — Mastering onboarding | Lauryn Isford (Head of Growth at Airtable)]
An activation rate that falls in a lower percentage range, maybe for most companies five to 15%, is better than one that falls in a higher percentage range because it means that there's likely much higher correlation with long-term retention and you're really working hard to get most of your users to reach a state that they're not reaching today.

---

[Summary: The ultimate guide to adding a PLG motion | Hila Qu (Reforge, GitLab)]
### [Activation and conversion ▶️](https://youtu.be/7l1fIxk7SnA?t=2851)

- Focus on activation if users are confused on their first interaction with the product: Identify the ideal aha moment metric and design a product experience that leads users towards that goal. Use warm starts by providing templates or samples to reduce friction and engage them immediately.
- Focus on activation: If you're finding that people are initially entering your product but don't know what to do next, then you have an activation problem. To solve this, you need to identify your "aha moment metric and then, design a product experience to help more people together."
- Improve conversion if the checkout process has friction: If your activation is in good shape but your conversion is low, it could be that the checkout process is too difficult or confusing. It could be that users can't even find where to buy your product or they encounter issues during the checkout process that are specific to their region.
- Explore product-led acquisition for collaboration software: If your product is something that encourages collaboration, you could leverage this to help spread the word about your product. Think about how companies like Airtable or Figma encourage users to invite their team members to join the platform.

---

[28 Ways to Grow Supply in a Marketplace 📈]
### Tactic #20: Optimize activation 🥳

> When I think about the ROI of things that you can do in a business, make certain that your customer is safely handed from acquisition to the activation. Make certain that they are activated and you have done everything in your power in order to make certain they have found their “Aha” moment and they have began habit forming.
>
> — [Shaun Clowes](https://twitter.com/shaunmclowes?lang=en), CPO at Metromile

**What:** Getting new users to a key milestone that you believe is important for long-term retention. This is sometimes called the “aha” moment.

**Stage:** Early/Mid-stage

**Cost:** Small

**Impact on Airbnb supply growth:** Small/Medium

**Examples**:

- At Airbnb, an activation was getting a new listing to its first booking within the first month.
- At Uber, an activation was completing the first ride.
- [Inside the 6 Hypotheses that Doubled Patreon’s Activation Success](https://brianbalfour.com/essays/patreon-onboarding-growth)

**Tips**:

- First, you need to figure out what milestone is key to a new “hosts” long-term success. It’s rarely an exact science.
- Goal your supply teams on reaching this point, vs. simply when they go live.
- Adjust this milestone if you learn something new down the road.

**Question:** What’s the one most impactful thing a “host” can do to improve their chances of getting booked?

---

[How to determine your activation metric]
## How to determine your activation metric

Follow this three-step process:

1. Brainstorm, and explore your product usage data, for some potential “aha” moments in the user journey.
2. Run a [regression analysis](https://hbr.org/2015/11/a-refresher-on-regression-analysis) to see if there’s an inflection in retention when someone hits any of those moments, to establish a correlative relationship between some potential activation milestones and product retention.
3. Run some experiments to see if increasing the percentage of users hitting that moment increases their retention rate, to see if any of those correlative relationships translate into true causality. A good activation metric is causal for your retention, not just correlative.

Here are six real stories from readers putting this process into action:

> “For our new products with little or no usage data:
>
> 1. **We conducted in-depth interviews with our target segment and asked them, ‘What are the signals that this product is solving your problem?’**
> 2. **We brainstormed a list of actions that reflect those signals.**
> 3. **We ran a quantitative survey targeting the target segment, showing the list of actions and asking respondents, ‘Which of the following is the first moment that you feel that this product solves your problem?’**
>
> We then picked the milestone that had been selected by the majority.
>
> For existing products with a lot of historical data, we started with steps one and two above, but after that, we ran regression analyses to find which action completion correlated with long-term retention (30 days in our case).”

> “We have a lot of qualitative data from our users because we do interviews on a weekly basis with them. So when we asked this question, we already knew about some candidates for the activation milestone.
>
> **We focused on when the users were getting value from our product. Then, once we had some candidates, we used data to see which of them were correlated with long-term retention. [Mark Roberge has a really good process on how to do this](https://f.hubspotusercontent10.net/hubfs/6575667/Stage%202s%20Science%20of%20Scaling.pdf).**
>
> After we saw some results, we just went with the one that ‘felt’ the best. That’s because we don’t have too much data. Around 300 customers. So we know there could be a lot of errors in the numbers, so we thought we shouldn’t do a decision based solely on data if the results were similar.”

> “Building [a top-five e-commerce site’s] self-checkout product, we looked at retention rates across customer segments that completed various tasks successfully, for example:
>
> - Scanning an item
> - Completing a checkout
> - Placing 1, 2, 3, *n* orders per month
>
> **We noticed that completing a transaction was the best indicator of long-term retention. Particularly, customers who placed at least two orders retained at a 2x higher rate than with one order. So that became our activation milestone.”**

---

[Sean Ellis — The original growth hacker reveals his secrets | Sean Ellis (author of “Hacking Growth”)]
The other element of this is coming up with an activation metric and aligning on here's what we consider so activated. I know this is very dependent on the product, but any advice or heuristic for how to help people decide this is our activated user.

---

[What is a good activation rate]
## 3. What is a good activation rate?

Based on our survey results, broadly, the **average activation rate is 34%**, and the **median activation rate is 25%**.

For just SaaS products (removing marketplaces, e-commerce, and DTC), the **average activation rate is 36%**, and the **median is 30%**.

Here’s what activation rates look like by individual product types:

#### Why such variance in activation rates?

Mostly due to the milestone definition, and how much effort it takes to get there.

For example, marketplaces and e-commerce companies have the lowest activation rates because they generally define their activation milestone as the first transaction (i.e. spending money). B2C freemium products have the highest activation rate because their typical activation milestone is low-friction (e.g. starting a meditation session, logging a meal, listening to a music track).`,
};

serve(async (req) => {
  const origin = req.headers.get('origin') || '';
  const corsHeaders = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : 'https://untutorial.in',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, topic, rawChunks: customChunks } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing prompt' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (prompt.length > 2000) {
      return new Response(JSON.stringify({ error: 'Input too long', details: 'Prompt must be under 2000 characters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (customChunks && typeof customChunks === 'string' && customChunks.length > 10000) {
      return new Response(JSON.stringify({ error: 'Input too long', details: 'rawChunks must be under 10,000 characters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const rawChunks = (customChunks && typeof customChunks === 'string') ? customChunks : TOPIC_CHUNKS[topic as string];
    if (!rawChunks) {
      return new Response(JSON.stringify({ error: 'Unknown topic', details: `No chunks found for topic: ${topic}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const callClaude = async (userContent: string, maxTokens: number) => {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: maxTokens,
          messages: [{ role: 'user', content: userContent }],
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Anthropic API error: ${errText}`);
      }
      const data = await res.json();
      return data.content?.[0]?.text?.trim() || '';
    };

    // Step 1: Generate synthesis using the learner's prompt + hardcoded chunks
    const synthesisUserContent = `You are a synthesis assistant. The user has provided instructions for how to synthesize expert content into a playbook section. Follow their instructions exactly.

Here are 8 expert chunks from Lenny Rachitsky's archive on the topic "${topic}":

---
${rawChunks}
---

Follow these synthesis instructions from the user:

${prompt}

Produce the playbook section now.`;

    const synthesis = await callClaude(synthesisUserContent, 2000);

    // Step 2: Evaluate the synthesis on 4 criteria
    const evaluationUserContent = `You are evaluating the quality of a PM playbook section.

Here is the synthesized output:

---
${synthesis}
---

Evaluate on these 4 criteria. Return ONLY valid JSON:

{
  "criteria": [
    {"name": "Experts named", "passed": true, "detail": "Are specific experts mentioned by name? (e.g., 'According to Ebi Atawodi...' not 'some experts say')"},
    {"name": "Has structure", "passed": true, "detail": "Does the output have clear organization — headers, sections, bullet points, or logical groupings? Not a wall of text?"},
    {"name": "Multiple perspectives", "passed": true, "detail": "Does the output represent more than one voice or viewpoint? At least 2-3 different experts or angles?"},
    {"name": "Practically useful", "passed": true, "detail": "Would a PM actually reference this at work? Is it specific and actionable, not just generic advice?"}
  ],
  "score": 3,
  "feedback": "One specific suggestion to improve the synthesis instructions"
}

IMPORTANT: Replace the "detail" fields with your actual assessment. Set "passed" to actual booleans. Set "score" to the count of passed criteria.`;

    const evalRaw = await callClaude(evaluationUserContent, 800);

    let evalJson = evalRaw;
    const jsonMatch = evalRaw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) evalJson = jsonMatch[1].trim();

    let result;
    try {
      result = JSON.parse(evalJson);
      if (!result.criteria || typeof result.score !== 'number') {
        throw new Error('Invalid evaluation response structure');
      }
    } catch {
      console.error('Failed to parse evaluation response:', evalRaw);
      return new Response(JSON.stringify({ error: 'Failed to parse AI evaluation response', raw: evalRaw }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      synthesis,
      criteria: result.criteria,
      score: result.score,
      maxScore: 4,
      feedback: result.feedback,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Edge function error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
