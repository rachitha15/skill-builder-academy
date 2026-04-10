import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Quote, Zap, Target, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Untutorial — Stop watching tutorials. Start building.';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Build real AI tools in under 2 hours. Walk away with something you actually use. Free, no sign-up.');
    }
  }, []);

  const handleWaitlistSubmit = async () => {
    const trimmed = email.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      await supabase
        .from('course_interest_waitlist')
        .insert([{ email: trimmed.toLowerCase(), course_interest: 'Product Thinking for Engineers' }]);
    } catch {}
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background noise-bg">
      {/* Nav */}
      <nav className="border-b border-border/50 bg-background">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-display font-bold text-lg text-foreground">
            un<span className="text-primary">tutorial</span>
          </span>
          <a
            href="#courses"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Browse Courses →
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Build real AI tools in under 2 hours. No theory, no videos — you make decisions,
            produce work, and walk away with something you'll actually use.
          </p>
          <a
            href="#courses"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-all"
          >
            See What You Can Build <ArrowRight className="h-5 w-5" />
          </a>
          <p className="text-sm text-muted-foreground mt-3">Free · No sign-up · Takes 1-2 hours</p>
        </motion.div>
      </section>

      {/* Social proof — pulled up from bottom */}
      <section className="max-w-2xl mx-auto px-6 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-base text-slate-400 italic">
            "Finally, an AI course where I actually built something instead of just watching someone else do it."
          </p>
          <p className="text-sm text-muted-foreground mt-2">— Pratibha, Early-stage Founder</p>
        </motion.div>
      </section>

      {/* What you walk away with — outcome-focused */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-8 text-center"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <p className="text-foreground font-semibold mb-1">You build it, not watch it</p>
            <p className="text-sm text-muted-foreground">Every course ends with a real artifact — a working tool you download and use at work.</p>
          </div>
          <div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <p className="text-foreground font-semibold mb-1">AI grades your work</p>
            <p className="text-sm text-muted-foreground">Your work gets tested against real-world inputs. Not quizzes — genuine evaluation of what you built.</p>
          </div>
          <div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
              <Download className="h-6 w-6 text-primary" />
            </div>
            <p className="text-foreground font-semibold mb-1">Take something home</p>
            <p className="text-sm text-muted-foreground">A Claude Skill you install. A PM playbook you reference. Something real, not a certificate.</p>
          </div>
        </motion.div>
      </section>

      {/* Courses */}
      <section id="courses" className="max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-display font-bold text-foreground text-center mb-4">
            Courses
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-lg mx-auto">
            Pick one. Build something. Walk away knowing more than when you started.
          </p>

          <div className="grid md:grid-cols-3 gap-6">

            {/* Course 1 — Claude Skills */}
            <div className="bg-[#111] border-2 border-primary shadow-lg shadow-primary/10 rounded-xl p-6 flex flex-col">
              <div className="mb-4">
                <span className="text-xs font-bold text-primary uppercase tracking-wide px-2 py-1 rounded bg-primary/10 border border-primary/20">
                  Available Now · 7 modules · ~2 hours
                </span>
              </div>
              <h3 className="font-display font-bold text-foreground text-lg mb-2">
                Build Your First Claude Skill
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                For PMs and professionals who use AI daily
              </p>
              <div className="text-sm text-muted-foreground mb-6 flex-1 space-y-2">
                <p><span className="text-foreground font-medium">You'll build:</span> A working AI automation that turns messy meeting notes into structured action items</p>
                <p><span className="text-foreground font-medium">You'll take home:</span> A downloadable Skill file you install in Claude and use every day</p>
              </div>
              <Link
                to="/course/skills"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all"
              >
                Start Building →
              </Link>
            </div>

            {/* Course 2 — The Lens (Lenny) */}
            <div className="bg-[#111] border-2 border-primary shadow-lg shadow-primary/10 rounded-xl p-6 flex flex-col">
              <div className="mb-4">
                <span className="text-xs font-bold text-primary uppercase tracking-wide px-2 py-1 rounded bg-primary/10 border border-primary/20">
                  Available Now · 5 missions · ~1 hour
                </span>
              </div>
              <h3 className="font-display font-bold text-foreground text-lg mb-2">
                The Lens: Build PM Playbooks with AI
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                For PMs who want to understand how AI search works
              </p>
              <div className="text-sm text-muted-foreground mb-6 flex-1 space-y-2">
                <p><span className="text-foreground font-medium">You'll build:</span> A PM playbook on your chosen topic, synthesized from Lenny Rachitsky's 600+ posts and episodes</p>
                <p><span className="text-foreground font-medium">You'll take home:</span> A downloadable playbook citing real experts by name — plus the skills to spec AI search for your team</p>
              </div>
              <Link
                to="/course/lenny"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all"
              >
                Start Building →
              </Link>
            </div>

            {/* Course 3 — Coming Soon */}
            <div className="bg-[#111] border border-[#222] rounded-xl p-6 flex flex-col opacity-80">
              <div className="mb-4">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide px-2 py-1 rounded bg-muted/20 border border-border">
                  Coming Soon · ~2 hours
                </span>
              </div>
              <h3 className="font-display font-bold text-foreground text-lg mb-2">
                Product Thinking for Engineers
              </h3>
              <p className="text-sm text-muted-foreground mb-6 flex-1">
                For engineers who want to think beyond code
              </p>

              {!submitted ? (
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 min-w-0 px-3 py-2 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    onKeyDown={e => e.key === 'Enter' && handleWaitlistSubmit()}
                  />
                  <button
                    onClick={handleWaitlistSubmit}
                    disabled={submitting}
                    className="px-3 py-2 rounded-md bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {submitting ? '...' : 'Notify Me'}
                  </button>
                </div>
              ) : (
                <p className="text-sm text-[hsl(var(--success))] font-medium">
                  You're on the list! We'll let you know when it launches.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
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
                — Keerthan, ML Engineer
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

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <a
            href="#courses"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-lg font-semibold mb-4"
          >
            → Pick a course and start building — Free, no sign-up
          </a>
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

export default HomePage;
