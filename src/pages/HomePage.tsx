import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const COMING_SOON_COURSES = [
  {
    id: 'ai-workflows',
    title: 'Build Reusable AI Workflows',
    subtitle: 'For professionals who use AI daily but feel stuck at the basics',
    badge: 'Coming Soon · ~2 hours',
  },
  {
    id: 'product-thinking',
    title: 'Product Thinking for Engineers',
    subtitle: 'For engineers who want to think beyond code',
    badge: 'Coming Soon · ~2 hours',
  },
];

const HomePage = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [emails, setEmails] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    document.title = 'Untutorial — Stop watching tutorials. Start building.';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Hands-on courses where Claude grades your work and you take home something real.');
    }
  }, []);

  const handleWaitlistToggle = (courseId: string) => {
    setExpandedCard(prev => (prev === courseId ? null : courseId));
  };

  const handleSubmit = async (courseId: string, courseTitle: string) => {
    const email = emails[courseId]?.trim();
    if (!email) return;

    setSubmitting(prev => ({ ...prev, [courseId]: true }));

    try {
      await supabase
        .from('course_interest_waitlist')
        .insert([{ email: email.toLowerCase(), course_interest: courseTitle }]);
      // Show success regardless of duplicate
    } catch {
      // swallow errors — still show success
    }

    setSubmitted(prev => ({ ...prev, [courseId]: true }));
    setSubmitting(prev => ({ ...prev, [courseId]: false }));
  };

  return (
    <div className="min-h-screen bg-background noise-bg">
      {/* Nav */}
      <nav className="border-b border-border/50 bg-background">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-display font-bold text-lg text-foreground">
            un<span className="text-primary">tutorial</span>
          </span>
          <Link
            to="/course/skills"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Start Learning →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-20 text-center">
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
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Hands-on courses where Claude grades your work and you take home something real.
          </p>
          <Link
            to="/course/skills"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-all"
          >
            Start Your First Course <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-sm text-muted-foreground mt-3">Free · No sign-up · ~2 hours</p>
        </motion.div>
      </section>

      {/* How untutorial is different */}
      <section className="max-w-2xl mx-auto px-6 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-3"
        >
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-semibold">You build it</span>, not watch it
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-semibold">Claude tests your work</span> against messy real inputs
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-semibold">Hints cost XP</span> — struggling is the point
          </p>
        </motion.div>
      </section>

      {/* Courses */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-display font-bold text-foreground text-center mb-10">
            Courses
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 — Live */}
            <div className="bg-[#111] border-2 border-primary shadow-lg shadow-primary/10 rounded-xl p-6 flex flex-col">
              <div className="mb-4">
                <span className="text-xs font-bold text-primary uppercase tracking-wide px-2 py-1 rounded bg-primary/10 border border-primary/20">
                  Available Now · 7 modules · ~2 hours
                </span>
              </div>
              <h3 className="font-display font-bold text-foreground text-lg mb-1">
                Build Your First Claude Skill
              </h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1">
                For professionals ready to build with AI
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Build a Claude Skill that turns messy meeting notes into structured action items. Download it and install in Claude.
              </p>
              <Link
                to="/course/skills"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all"
              >
                Start Course →
              </Link>
            </div>

            {/* Cards 2 & 3 — Coming Soon */}
            {COMING_SOON_COURSES.map(course => (
              <div key={course.id} className="bg-[#111] border border-[#222] rounded-xl p-6 flex flex-col opacity-80">
                <div className="mb-4">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide px-2 py-1 rounded bg-muted/20 border border-border">
                    {course.badge}
                  </span>
                </div>
                <h3 className="font-display font-bold text-foreground text-lg mb-1">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-6 flex-1">
                  {course.subtitle}
                </p>

                {!expandedCard || expandedCard !== course.id ? (
                  <button
                    onClick={() => handleWaitlistToggle(course.id)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md border border-border text-foreground text-sm font-bold hover:bg-muted/20 transition-all"
                  >
                    Join Waitlist
                  </button>
                ) : submitted[course.id] ? (
                  <p className="text-sm text-success font-medium">
                    You're on the list! We'll let you know when it launches.
                  </p>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={emails[course.id] || ''}
                      onChange={e => setEmails(prev => ({ ...prev, [course.id]: e.target.value }))}
                      placeholder="your@email.com"
                      autoFocus
                      className="flex-1 min-w-0 px-3 py-2 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      onKeyDown={e => e.key === 'Enter' && handleSubmit(course.id, course.title)}
                    />
                    <button
                      onClick={() => handleSubmit(course.id, course.title)}
                      disabled={submitting[course.id]}
                      className="px-3 py-2 rounded-md bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {submitting[course.id] ? '...' : 'Join'}
                    </button>
                  </div>
                )}
              </div>
            ))}
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
          <Link
            to="/course/skills"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-lg font-semibold mb-4"
          >
            → Start with Build Your First Claude Skill — Free, no sign-up
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

export default HomePage;
