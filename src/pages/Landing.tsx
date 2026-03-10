import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Terminal, Sparkles, ArrowRight, Quote } from 'lucide-react';
import { useEffect } from 'react';

const Landing = () => {
  // Update meta description for landing page
  useEffect(() => {
    document.title = 'Untutorial — Build Your First Claude Skill';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Stop watching tutorials. Start building. Learn to build Claude Skills through 7 hands-on modules with AI-powered feedback.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background noise-bg">
      {/* Nav */}
      <nav className="border-b border-border/50 bg-background">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-display font-bold text-lg text-foreground">
            un<span className="text-primary">tutorial</span>
          </span>
          <Link
            to="/course"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Start Learning →
          </Link>
        </div>
      </nav>

      {/* Hero — split layout */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-20">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:w-1/2 text-left"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight text-foreground leading-tight mb-6">
              Stop watching{' '}
              <span className="relative inline-block">
                <span className="relative z-10">tutorials</span>
                <span className="absolute inset-x-[-4px] top-1/2 h-[4px] bg-destructive -rotate-2 z-20" />
              </span>
              .<br />
              Start building.
            </h1>
            <p className="text-lg text-muted-foreground mb-4 max-w-md">
              Build your first <span className="text-primary font-semibold">Claude Skill</span> in ~2 hours.
              7 hands-on modules. One real AI workflow. No experience required.
            </p>
            <Link
              to="/course"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-md bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-all"
            >
              Start Building <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="text-sm text-muted-foreground mt-3">Free · No sign-up required</p>
            <p className="text-sm text-muted-foreground/80 mt-2">Earn XP as you build. Lose some when you ask for hints.</p>
          </motion.div>

          {/* Right — mock screenshot */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="md:w-1/2"
          >
            <div className="rounded-lg border border-border bg-card p-1 rotate-2 shadow-2xl shadow-primary/10">
              {/* Fake window chrome */}
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-secondary/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
                <span className="ml-2 text-[10px] text-muted-foreground font-mono">Module 3 — Trigger Test</span>
              </div>
              {/* Mock editor + results */}
              <div className="flex divide-x divide-border">
                <div className="w-1/2 p-3 bg-editor text-[10px] font-mono leading-relaxed text-muted-foreground">
                  <p><span className="text-primary">---</span></p>
                  <p><span className="text-primary">name:</span> meeting-action-extractor</p>
                  <p><span className="text-primary">description:</span> &gt;</p>
                  <p className="pl-2">Extract action items from</p>
                  <p className="pl-2">meeting transcripts</p>
                  <p><span className="text-primary">---</span></p>
                  <p className="mt-2"><span className="text-foreground">## Triggers</span></p>
                  <p>- meeting notes</p>
                  <p>- action items</p>
                </div>
                <div className="w-1/2 p-3 bg-card text-[10px] leading-relaxed">
                  <p className="text-foreground font-semibold mb-1">Test Results</p>
                  <div className="space-y-1">
                    <p className="text-success">✓ Trigger: meeting notes</p>
                    <p className="text-success">✓ Trigger: standup recap</p>
                    <p className="text-success">✓ Trigger: action items</p>
                    <p className="text-primary">✓ 7/7 triggers matched</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Featured testimonial */}
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <div className="relative">
              <Quote className="absolute -top-4 -left-4 h-12 w-12 text-primary/20" />
              <blockquote className="text-xl md:text-2xl text-slate-300 leading-relaxed border-l-4 border-primary pl-6 py-4">
                "The DIY model is brilliant — I finished all 7 modules and walked away with a real Skill I actually use."
              </blockquote>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              — Amritha, Product Manager
            </p>
          </div>

          {/* Two-column testimonials */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-[#111111] border border-[#222222] rounded-xl p-6">
              <p className="text-base text-gray-300 mb-4">
                "You break things on purpose, then learn to fix them properly. The gamification keeps you hooked."
              </p>
              <p className="text-sm text-gray-400">
                — Keerthan, Deep Learning Engineer
              </p>
            </div>
            <div className="bg-[#111111] border border-[#222222] rounded-xl p-6">
              <p className="text-base text-gray-300 mb-4">
                "Finally, an AI course where I actually built something instead of just watching someone else do it."
              </p>
              <p className="text-sm text-gray-400">
                — Pratibha, Early-stage Founder
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* What you'll build */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-display font-bold text-foreground text-center mb-10">
            What you'll build
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Before */}
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-destructive" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Before</span>
              </div>
              <div className="bg-editor rounded-lg p-4 font-mono text-xs text-muted-foreground leading-relaxed">
                <p>ok so from todays standup -</p>
                <p>jake said he'd fix the login bug by friday</p>
                <p>sarah needs to review the design mockups, not sure when</p>
                <p>we're behind on the API integration, mark is handling it</p>
                <p>oh and someone mentioned we need to update the docs</p>
                <p>emily volunteered I think?? due next sprint</p>
              </div>
            </div>
            {/* After */}
            <div className="rounded-lg border border-primary/30 bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs font-medium text-primary uppercase tracking-wide">After</span>
              </div>
              <div className="bg-editor rounded-lg p-4 text-sm space-y-3">
                <div className="border-l-2 border-primary pl-3">
                  <p className="text-foreground font-medium">Fix login bug</p>
                  <p className="text-muted-foreground text-xs">Owner: Jake · Due: Friday · Priority: <span className="text-destructive">High</span></p>
                </div>
                <div className="border-l-2 border-primary pl-3">
                  <p className="text-foreground font-medium">Review design mockups</p>
                  <p className="text-muted-foreground text-xs">Owner: Sarah · Due: TBD · Priority: <span className="text-secondary">Medium</span></p>
                </div>
                <div className="border-l-2 border-primary pl-3">
                  <p className="text-foreground font-medium">Complete API integration</p>
                  <p className="text-muted-foreground text-xs">Owner: Mark · Due: TBD · Priority: <span className="text-destructive">High</span></p>
                </div>
                <div className="border-l-2 border-primary pl-3">
                  <p className="text-foreground font-medium">Update documentation</p>
                  <p className="text-muted-foreground text-xs">Owner: Emily · Due: Next sprint · Priority: <span className="text-muted-foreground">Low</span></p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* "But can't Claude just build a Skill for me?" callout */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-lg border border-border bg-[#0a0a0a] p-8 md:p-10"
        >
          <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-4">
            "But can't Claude just build a Skill for me?"
          </h2>
          <div className="space-y-4 leading-relaxed">
            <p className="text-lg text-foreground">Sure. And you can ask someone else to cook your dinner.</p>
            <p className="text-gray-300">
              Claude can generate a SKILL.md in 30 seconds. But when it doesn't trigger right, when it chokes on messy inputs, when you want something Claude's defaults can't handle — you'll wish you understood what's under the hood.
            </p>
            <p className="text-gray-300">
              This course doesn't just give you a Skill. It gives you the ability to build, debug, and improve <em>any</em> Skill. That's the difference between using AI and being fluent in AI.
            </p>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-display font-bold text-foreground text-center mb-12">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: 'Learn the concept', desc: 'Short, focused lessons with zero fluff' },
              { icon: Terminal, title: 'Build in the sandbox', desc: 'Write real Skill code in the browser' },
              { icon: Sparkles, title: 'Get AI feedback', desc: 'Claude reads your SKILL.md, tests it against messy meeting notes, flags weak triggers, and tells you exactly what to fix.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* The Curriculum / Module List */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-display font-bold text-foreground text-center mb-8">
            7 Modules. ~2 Hours.
          </h2>
          <div className="border border-border rounded-lg bg-card overflow-hidden">
            {[
              { num: 1, title: 'What Even Is a Skill?', time: '10 min' },
              { num: 2, title: 'The Anatomy of a Skill', time: '10 min' },
              { num: 3, title: 'Frontmatter is Everything', time: '20 min' },
              { num: 4, title: 'Writing Instructions That Work', time: '30 min' },
              { num: 5, title: 'Make It Trigger Right', time: '20 min' },
              { num: 6, title: 'Break It and Fix It', time: '25 min' },
              { num: 7, title: 'Ship It', time: '10 min' },
            ].map(({ num, title, time }, i) => (
              <div
                key={num}
                className={`flex items-center justify-between px-6 py-4 ${
                  i !== 6 ? 'border-b border-[#222222]' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-primary font-bold font-mono text-lg">{num}</span>
                  <span className="text-foreground">{title}</span>
                </div>
                <span className="text-muted-foreground text-sm">{time}</span>
              </div>
            ))}
            <div className="px-6 py-4 bg-[#0a0a0a] border-t border-[#222222]">
              <p className="text-sm text-muted-foreground text-center">
                Total: ~2 hours · 1 working Claude Skill
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Link
            to="/course"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-lg font-semibold mb-4"
          >
            → Start Module 1 — Free, no sign-up
          </Link>
          <p className="text-sm text-muted-foreground">
            Built by{' '}
            <a
              href="https://rachithasuresh.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Rachitha
            </a>
            {' · '}Powered by{' '}
            <a
              href="https://anthropic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Claude
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
