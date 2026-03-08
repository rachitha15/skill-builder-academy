import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Terminal, Sparkles, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background noise-bg">
      {/* Nav */}
      <nav className="border-b border-border/50">
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

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-3 py-1 mb-6 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium">
            Free · No sign-up required
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-extrabold text-foreground leading-tight mb-6">
            Build Your First
            <br />
            <span className="text-primary">Claude Skill</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-2 font-display font-semibold">
            Stop watching tutorials. Start building.
          </p>
          <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
            7 hands-on modules. One real AI workflow. ~2 hours. No experience required.
          </p>
          <Link
            to="/course"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-bold text-lg glow-primary hover:opacity-90 transition-all"
          >
            Start Building <ArrowRight className="h-5 w-5" />
          </Link>
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
            <div className="rounded-xl border border-border bg-card p-6">
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
            <div className="rounded-xl border border-primary/30 bg-card p-6">
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
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-4">
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
