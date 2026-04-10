import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Play, CheckCircle2, Clock } from 'lucide-react';
import { useLennyCourse } from '@/context/LennyCourseContext';
import { LENNY_MODULE_DATA, LENNY_TOPICS } from '@/data/lennyLabData';
import { LennyXPCounter } from '@/components/LennyXPCounter';
import { useEffect } from 'react';

const topicsWithDetails = [
  {
    id: 'product_strategy',
    label: 'Product Strategy & Roadmap',
    icon: '🎯',
    description: 'Frameworks for setting vision, prioritizing roadmaps, and making strategic bets.',
    guestCount: 282,
  },
  {
    id: 'user_research',
    label: 'User Research & Customer Discovery',
    icon: '🔍',
    description: 'How to talk to users, validate ideas, and build products people actually want.',
    guestCount: 242,
  },
  {
    id: 'plg',
    label: 'Product-Led Growth',
    icon: '🚀',
    description: 'When PLG makes sense, how to add it, and what goes wrong when companies try.',
    guestCount: 56,
  },
  {
    id: 'metrics',
    label: 'Metrics and KPIs',
    icon: '📊',
    description: 'Choosing north star metrics, avoiding vanity metrics, and measuring what matters.',
    guestCount: 172,
  },
  {
    id: 'onboarding',
    label: 'Onboarding and Activation',
    icon: '⚡',
    description: 'Getting new users to their aha moment faster and improving activation rates.',
    guestCount: 108,
  },
];

const LennyCoursePage = () => {
  const { state, dispatch } = useLennyCourse();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'The Lens — Build PM Playbooks from Lenny\'s Archive';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Build a PM playbook from Lenny Rachitsky\'s archive of 600+ posts and episodes. 5 missions, ~1 hour. Free, no sign-up.');
    }
  }, []);

  const selectedTopic = state.selectedTopic;
  const topicLabel = LENNY_TOPICS.find(t => t.id === selectedTopic)?.label ?? '';

  const handleSelectTopic = (topicId: string) => {
    dispatch({ type: 'SELECT_TOPIC', topic: topicId });
    navigate('/course/lenny/1');
  };

  // ─── Topic selection screen ───────────────────────────────────────────────
  if (!selectedTopic) {
    return (
      <div className="min-h-screen bg-background noise-bg">
        {/* Nav */}
        <nav className="border-b border-border/50 sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/" className="font-display font-bold text-lg text-foreground">
              ← un<span className="text-primary">tutorial</span>
            </Link>
            <LennyXPCounter />
          </div>
        </nav>

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-4">The Lens</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-foreground leading-tight mb-6">
              Build a PM Playbook<br />from Lenny's Archive
            </h1>
            <p className="text-lg text-muted-foreground mb-4 max-w-2xl mx-auto">
              Pick a topic. Go through 5 hands-on missions. Walk away with a
              downloadable playbook citing real experts from <strong className="text-foreground">349 newsletters</strong> and <strong className="text-foreground">289 podcast episodes</strong>.
            </p>
            <p className="text-sm text-muted-foreground">Free · No sign-up · ~1 hour</p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="text-xs text-muted-foreground">Content from</span>
              <a
                href="https://www.lennysnewsletter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
              >
                <img src="/lenny-logo.webp" alt="Lenny's Newsletter" className="h-5 w-auto" />
                <span className="text-xs text-muted-foreground">Lenny Rachitsky</span>
              </a>
            </div>
          </motion.div>
        </section>

        {/* How it works */}
        <section className="max-w-3xl mx-auto px-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-5 gap-3 text-center"
          >
            {[
              { num: '1', label: 'Learn chunking', sub: 'Why breaking up content matters' },
              { num: '2', label: 'Learn search', sub: 'How AI matches meaning, not words' },
              { num: '3', label: 'Learn retrieval', sub: 'Finding the right results' },
              { num: '4', label: 'Learn synthesis', sub: 'Turning results into a playbook' },
              { num: '5', label: 'Build it', sub: 'Your playbook, your topic' },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-sm font-bold text-primary">{step.num}</span>
                </div>
                <p className="text-xs font-semibold text-foreground">{step.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{step.sub}</p>
                {i < 4 && (
                  <div className="hidden md:block absolute top-5 left-[calc(50%+24px)] w-[calc(100%-48px)] h-px bg-border" />
                )}
              </div>
            ))}
          </motion.div>
        </section>

        {/* Choose your topic — header */}
        <section className="max-w-4xl mx-auto px-6 pb-8">
          <h2 className="text-2xl font-display font-bold text-foreground text-center mb-2">
            Choose your playbook topic
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-lg mx-auto text-sm">
            Your playbook will be built from expert advice on this topic — pulled from Lenny's newsletters and podcast guests. Pick what's most useful to you right now.
          </p>
        </section>

        {/* Topic cards */}
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topicsWithDetails.map((topic, i) => (
                <motion.button
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => handleSelectTopic(topic.id)}
                  className="bg-[#111] border border-[#222] hover:border-primary/50 rounded-xl p-5 text-left transition-all hover:shadow-lg hover:shadow-primary/5 group"
                >
                  <div className="text-2xl mb-3">{topic.icon}</div>
                  <h3 className="font-display font-bold text-foreground text-base mb-1 group-hover:text-primary transition-colors">
                    {topic.label}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {topic.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {topic.guestCount}+ experts · newsletters & podcasts
                  </p>
                </motion.button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-6">
              You can always start over with a different topic.
            </p>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 py-12">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-sm text-muted-foreground">
              Built by{' '}
              <a href="https://rachithasuresh.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                Rachitha
              </a>
              {' · '}Powered by{' '}
              <a href="https://anthropic.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                Claude
              </a>
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // ─── Mission list screen (topic already selected) ─────────────────────────
  const completedCount = state.modules.filter(m => m.status === 'completed').length;
  const allCompleted = state.modules.every(m => m.status === 'completed');
  const hasStarted = state.modules.some(m => {
    if (m.status === 'completed') return true;
    if (m.status === 'in_progress' && (m.attempts > 0 || m.hintsUsed > 0 || m.userWork.trim().length > 0)) return true;
    return false;
  });

  const nextIncompleteModule = state.modules.find(m => m.status !== 'completed');
  const totalTime = LENNY_MODULE_DATA.reduce((acc, m) => {
    const mod = state.modules.find(sm => sm.id === m.id);
    if (mod?.status === 'completed') return acc;
    return acc + m.estimatedMinutes;
  }, 0);

  const ctaHref = allCompleted
    ? '/course/lenny/complete'
    : hasStarted
    ? `/course/lenny/${nextIncompleteModule?.id ?? 1}`
    : '/course/lenny/1';

  const ctaLabel = allCompleted
    ? 'View Playbook 🎉'
    : hasStarted
    ? 'Continue →'
    : 'Start Mission 1 →';

  return (
    <div className="min-h-screen bg-background noise-bg">
      {/* Nav */}
      <nav className="border-b border-border/50 sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-display font-bold text-lg text-foreground">
            ← un<span className="text-primary">tutorial</span>
          </Link>
          <LennyXPCounter />
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs text-primary uppercase tracking-[0.3em] font-bold mb-4">The Lens</p>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground leading-tight mb-3">
            Build a PM Playbook with AI
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs text-primary font-semibold">
              Topic: {topicLabel}
            </span>
          </div>
          <Link
            to={ctaHref}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-all"
          >
            {ctaLabel}
          </Link>
          <p className="text-sm text-muted-foreground mt-3">Free · No sign-up · ~1 hour</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-xs text-muted-foreground">Content from</span>
            <a
              href="https://www.lennysnewsletter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            >
              <img src="/lenny-logo.webp" alt="Lenny's Newsletter" className="h-5 w-auto" />
              <span className="text-xs text-muted-foreground">Lenny Rachitsky</span>
            </a>
          </div>
        </motion.div>
      </section>

      {/* Mission List */}
      <section className="max-w-3xl mx-auto px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> ~{totalTime} min remaining</span>
              <span>{completedCount}/6 missions complete</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                style={{ width: `${(completedCount / 6) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-4">
            {LENNY_MODULE_DATA.map((mod, i) => {
              const modState = state.modules[i];
              const isFirstMission = mod.id === 1;
              const isLocked = modState.status === 'locked' && !isFirstMission;
              const isCompleted = modState.status === 'completed';
              const hasStartedModule = modState.attempts > 0 || modState.hintsUsed > 0 || modState.userWork.trim().length > 0;
              const isInProgress = modState.status === 'in_progress' && (!isFirstMission || hasStartedModule);

              return (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => {
                    if (isLocked) return;
                    navigate(`/course/lenny/${mod.id}`);
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
                  title={isLocked ? `Complete Mission ${mod.id - 1} first` : undefined}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-sm ${
                      isCompleted ? 'bg-success text-primary-foreground' : isInProgress ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-muted text-muted-foreground'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : isLocked ? <Lock className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-mono">Mission {mod.id}</span>
                        {isInProgress && <span className="px-1.5 py-0.5 text-[10px] rounded bg-primary text-primary-foreground font-bold">In Progress</span>}
                      </div>
                      <h3 className="font-display font-bold text-foreground text-base mt-0.5">{mod.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{mod.subtitle}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`font-mono text-sm font-bold ${isCompleted ? 'text-primary' : 'text-muted-foreground'}`}>
                        {isCompleted ? `+${modState.xpEarned}` : mod.maxXP > 0 ? mod.maxXP : '—'} {mod.maxXP > 0 ? 'XP' : ''}
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

      {/* Playbook preview */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border border-border bg-[#0a0a0a] p-6"
        >
          <p className="text-xs text-primary uppercase tracking-wide font-bold mb-3">What you'll walk away with</p>
          <h3 className="font-display font-bold text-foreground text-lg mb-4">
            Your {topicLabel} Playbook
          </h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex gap-3">
              <span className="text-primary font-mono font-bold">01</span>
              <span>Key frameworks and best practices — from Lenny's newsletters</span>
            </div>
            <div className="flex gap-3">
              <span className="text-primary font-mono font-bold">02</span>
              <span>Common mistakes and pitfalls — from podcast guests who've been there</span>
            </div>
            <div className="flex gap-3">
              <span className="text-primary font-mono font-bold">03</span>
              <span>Real examples from companies — cited by name with context</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
            Downloadable .md file · Experts cited by name · Built from 600+ real sources
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            Built by{' '}
            <a href="https://rachithasuresh.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              Rachitha
            </a>
            {' · '}Powered by{' '}
            <a href="https://anthropic.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              Claude
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LennyCoursePage;
