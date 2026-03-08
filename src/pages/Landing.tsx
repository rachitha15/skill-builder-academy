import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Terminal, Sparkles, ArrowRight } from 'lucide-react';

const Landing = () => {
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
            <h1 className="text-5xl md:text-6xl font-display font-extrabold text-foreground leading-tight mb-6">
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
              { icon: Sparkles, title: 'Get AI feedback', desc: 'Claude evaluates your work and guides you' },
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

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <p className="text-center text-sm text-muted-foreground">
          Stop watching tutorials. Start untutorialing.{' '}
          <span className="text-foreground font-medium">untutorial.in</span>
        </p>
      </footer>
    </div>
  );
};

export default Landing;
