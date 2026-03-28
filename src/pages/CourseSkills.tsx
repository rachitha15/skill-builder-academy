import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Play, CheckCircle2, Clock, BookOpen, Terminal, Sparkles, Quote } from 'lucide-react';
import { useCourse } from '@/context/CourseContext';
import { MODULE_DATA } from '@/data/courseData';
import { XPCounter } from '@/components/XPCounter';
import { useEffect } from 'react';

const CourseSkills = () => {
  const { state } = useCourse();
  const navigate = useNavigate();

  const totalTime = MODULE_DATA.reduce((acc, m) => {
    const mod = state.modules.find(sm => sm.id === m.id);
    if (mod?.status === 'completed') return acc;
    return acc + m.estimatedMinutes;
  }, 0);

  const completedCount = state.modules.filter(m => m.status === 'completed').length;

  const hasStarted = state.modules.some(m => {
    if (m.status === 'completed') return true;
    if (m.status === 'in_progress' && (m.attempts > 0 || m.hintsUsed > 0 || m.userWork.length > 0)) return true;
    return false;
  });

  const allCompleted = state.modules.every(m => m.status === 'completed');

  const nextIncompleteModule = state.modules.find(m => m.status !== 'completed');

  const ctaHref = allCompleted
    ? '/course/complete'
    : hasStarted
    ? `/course/skills/${nextIncompleteModule?.id ?? 1}`
    : '/course/skills/1';

  const ctaLabel = allCompleted
    ? 'View Certificate 🎉'
    : hasStarted
    ? 'Continue →'
    : 'Start Module 1 →';

  useEffect(() => {
    document.title = 'Build Your First Claude Skill — Untutorial';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Build Your First Claude Skill — 7 modules, ~2 hours, one real AI workflow you can download and use.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background noise-bg">
      {/* Nav */}
      <nav className="border-b border-border/50 sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-display font-bold text-lg text-foreground">
            ← un<span className="text-primary">tutorial</span>
          </Link>
          <XPCounter />
        </div>
      </nav>

      {/* Hero */}
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
              Build Your First Claude Skill
            </h1>
            <p className="text-lg text-muted-foreground mb-4 max-w-md">
              Turn messy meeting notes into structured action items — automatically.
              7 hands-on modules. One real AI workflow. No experience required.
            </p>
            <Link
              to={ctaHref}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-md bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-all"
            >
              {ctaLabel}
            </Link>
            <p className="text-sm text-muted-foreground mt-3">Free · No sign-up required · ~2 hours</p>
          </motion.div>

          {/* Right — mock screenshot */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="md:w-1/2"
          >
            <div className="rounded-lg border border-border bg-card p-1 rotate-2 shadow-2xl shadow-primary/10">
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-secondary/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
                <span className="ml-2 text-[10px] text-muted-foreground font-mono">Module 3 — Trigger Test</span>
              </div>
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

      {/* Live Module List */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> ~{totalTime} min remaining</span>
              <span>{completedCount}/7 modules complete</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                style={{ width: `${(completedCount / 7) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-4">
            {MODULE_DATA.map((mod, i) => {
              const modState = state.modules[i];
              const isFirstModule = mod.id === 1;
              const isLocked = modState.status === 'locked' && !isFirstModule;
              const isCompleted = modState.status === 'completed';
              const hasStartedModule = modState.attempts > 0 || modState.hintsUsed > 0 || modState.userWork.trim().length > 0;
              const isInProgress = modState.status === 'in_progress' && (!isFirstModule || hasStartedModule);

              return (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => {
                    if (isLocked) return;
                    navigate(`/course/skills/${mod.id}`);
                  }}
                  className={`group relative rounded-lg border p-5 transition-all cursor-pointer ${
                    isLocked
                      ? 'border-border opacity-50 cursor-not-allowed bg-card'
                      : isCompleted
                      ? 'border-border bg-card border-l-4 border-l-success hover:border-l-success/80'
                      : isInProgress
                      ? 'border-border bg-card border-l-4 border-l-primary hover:border-l-primary/80'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                  title={isLocked ? `Complete Module ${mod.id - 1} first` : undefined}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-sm ${
                      isCompleted ? 'bg-success text-primary-foreground' : isInProgress ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-muted text-muted-foreground'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : isLocked ? <Lock className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-mono">Module {mod.id}</span>
                        {isInProgress && <span className="px-1.5 py-0.5 text-[10px] rounded bg-primary text-primary-foreground font-bold">In Progress</span>}
                      </div>
                      <h3 className="font-display font-bold text-foreground text-base mt-0.5">{mod.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{mod.subtitle}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`font-mono text-sm font-bold ${isCompleted ? 'text-primary' : 'text-muted-foreground'}`}>
                        {isCompleted ? `+${modState.xpEarned}` : mod.maxXP} XP
                      </p>
                      <p className="text-xs text-muted-foreground">{mod.estimatedMinutes} min</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Link
              to={ctaHref}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-md bg-primary text-primary-foreground font-bold glow-primary hover:opacity-90 transition-all"
            >
              {ctaLabel}
            </Link>
          </div>
        </motion.div>
      </section>

      {/* "Can't Claude just build a Skill?" callout */}
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

export default CourseSkills;
