import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Trophy } from 'lucide-react';
import { useLennyCourse } from '@/context/LennyCourseContext';
import { LENNY_TOPICS } from '@/data/lennyLabData';
import confetti from 'canvas-confetti';
import { supabase } from '@/integrations/supabase/client';

const LennyCourseComplete = () => {
  const { state } = useLennyCourse();
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const topicLabel = LENNY_TOPICS.find(t => t.id === state.selectedTopic)?.label ?? 'Your Topic';
  const playbook = state.playbook ?? [];

  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ff6b35', '#ffd60a', '#22c55e'] });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#ff6b35', '#ffd60a', '#22c55e'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  useEffect(() => {
    document.title = 'Playbook Complete — The Lens on Untutorial';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', `You built a ${topicLabel} PM playbook using RAG on Untutorial.`);
    }
  }, [topicLabel]);

  const generateMarkdown = (): string => {
    if (playbook.length === 0) return `# ${topicLabel} Playbook\n\nNo playbook sections found.`;

    const lines: string[] = [
      `# ${topicLabel} Playbook`,
      `> Built with The Lens on Untutorial.in · ${state.totalXP} XP earned · ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
      '',
      '---',
      '',
    ];

    playbook.forEach((section, i) => {
      lines.push(`## Section ${i + 1}: ${section.title}`);
      lines.push('');
      lines.push(section.synthesis);
      lines.push('');
      if (section.sources.length > 0) {
        lines.push('**Sources:**');
        section.sources.forEach(src => lines.push(`- ${src}`));
        lines.push('');
      }
      lines.push(`*Search: "${section.query}" · ${section.sourceFilter} · threshold ${section.threshold}*`);
      lines.push(`*Rationale: ${section.explanation}*`);
      lines.push('');
      lines.push('---');
      lines.push('');
    });

    // RAG Decision Sheet — built from Mission 5 activity
    const m5 = playbook[0];
    const thresholdLabel = m5
      ? (m5.threshold >= 0.55 ? 'strict — precision over coverage'
        : m5.threshold >= 0.45 ? 'medium — balancing relevance with coverage'
        : 'loose — broad exploration')
      : 'medium';
    const sourceLabel = m5
      ? (m5.sourceFilter === 'newsletter' ? 'newsletters only — structured frameworks'
        : m5.sourceFilter === 'podcast' ? 'podcasts only — practitioner stories'
        : 'both sources — frameworks + stories')
      : 'both sources';
    const userQuery = m5?.query || 'your chosen topic query';

    lines.push('## The RAG Pipeline — Your Decision Framework');
    lines.push('');
    lines.push('| Decision | What it means | What you did in this course |');
    lines.push('|---|---|---|');
    lines.push('| **Chunking** | How you break content into searchable pieces. Different content types need different strategies. | Your playbook searched section-split newsletters and speaker-turn podcast transcripts from Lenny\'s archive. |');
    lines.push(`| **Embeddings** | How search matches meaning, not keywords. Finds "talking to users" when you search "customer discovery." | You searched: "${userQuery}" — the system found results using different vocabulary. |`);
    lines.push(`| **Threshold** | How strict or broad your search is. Strict = precision, Loose = exploration. | Your section used: ${thresholdLabel}. Source: ${sourceLabel}. |`);
    lines.push('| **Synthesis Prompt** | The instructions that shape the AI\'s output. Structure + attribution + disagreements = useful output. | Your playbook sections cite experts by name, organize by theme, and surface disagreements — because that\'s what Mission 4 taught you. |');
    lines.push('');
    lines.push('*When you need this next:* This framework applies to any AI search product — internal knowledge bases, customer support bots, document retrieval, research tools. The four decisions are always the same: how to chunk, how to embed, where to set the threshold, and what instructions to give the synthesizer. Only the data changes.');
    lines.push('');
    lines.push('---');
    lines.push('Built with Untutorial · The Lens · untutorial.in');

    return lines.join('\n');
  };

  const handleDownload = () => {
    const content = generateMarkdown();
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(state.selectedTopic ?? 'playbook').replace(/_/g, '-')}-playbook.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleJoinWaitlist = async () => {
    if (!email.trim()) return;
    try {
      await supabase
        .from('course_interest_waitlist')
        .insert([{ email: email.trim().toLowerCase(), course_interest: 'lenny-advanced' }]);
    } catch {
      // swallow errors
    }
    setJoined(true);
  };

  const linkedInText = encodeURIComponent(
    `I just built a ${topicLabel} playbook from Lenny Rachitsky's archive of 600+ posts and episodes 🔍\n\n` +
    `Learned how AI search actually works — chunking, embeddings, retrieval, and RAG — by building something real.\n\n` +
    `${state.totalXP} XP earned across 5 missions on Untutorial.\n\n` +
    `https://untutorial.in\n\n` +
    `#BuildWithAI #ProductManagement #RAG`
  );

  const tweetText = encodeURIComponent(
    `I just built a ${topicLabel} playbook from @lennysan's archive of 600+ posts and episodes 🔍 ` +
    `Learned how RAG actually works by building something real. ` +
    `${state.totalXP} XP on @untutorial. Try it:`
  );

  return (
    <div className="min-h-screen bg-background noise-bg flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center"
      >
        {/* Trophy */}
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border-2 border-primary/40 burst-ring" />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.3 }}
            className="relative z-10 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/20 border border-primary/30"
          >
            <Trophy className="h-10 w-10 text-primary" />
          </motion.div>
        </div>

        <h1 className="text-4xl font-display font-bold tracking-tight text-foreground mb-2">
          You built your first AI playbook! 🎉
        </h1>
        <p className="text-muted-foreground mb-8">
          Synthesized from Lenny's archive using RAG — every layer, understood.
        </p>

        {/* Badge */}
        <div className="rounded-xl border-2 border-primary/50 bg-[#111] p-8 mb-8 text-center" style={{ boxShadow: '0 0 30px hsl(18 100% 60% / 0.2), 0 0 80px hsl(18 100% 60% / 0.08)' }}>
          <p className="text-xs text-primary uppercase tracking-[0.3em] font-bold mb-3">The Lens</p>
          <p className="font-mono text-lg text-muted-foreground mb-1">{topicLabel}</p>
          <p className="font-mono text-4xl font-extrabold text-primary mb-2">{state.totalXP} XP</p>
          <p className="text-xs text-muted-foreground mb-3">6 missions completed</p>
          <div className="h-px bg-border my-4" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Built on Untutorial</span>
            <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Download */}
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity mb-6"
        >
          <Download className="h-4 w-4" /> Download Your Playbook (.md)
        </button>

        {/* Social Share */}
        <div className="flex gap-3 justify-center mb-8">
          <a
            href={`https://www.linkedin.com/feed/?shareActive=true&text=${linkedInText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-md border border-border bg-card text-sm text-foreground hover:bg-muted transition-colors"
          >
            Share on LinkedIn
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${tweetText}&url=https://untutorial.in/course/lenny`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-md border border-border bg-card text-sm text-foreground hover:bg-muted transition-colors"
          >
            Share on X
          </a>
        </div>

        {/* Waitlist */}
        <div className="rounded-lg border border-border bg-card p-6 mb-8 text-center">
          <h3 className="font-display font-bold text-foreground mb-1">Want to go deeper?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Advanced course coming soon — build your own RAG pipeline on your company's knowledge base.
          </p>
          {joined ? (
            <p className="text-sm text-[hsl(var(--success))] font-bold">You're on the list! We'll email you when it drops. 🎉</p>
          ) : (
            <div className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                onKeyDown={(e) => e.key === 'Enter' && handleJoinWaitlist()}
              />
              <button
                onClick={handleJoinWaitlist}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Join Waitlist
              </button>
            </div>
          )}
        </div>

        <Link to="/course/lenny" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Course Map
        </Link>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-border flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <a href="https://rachithasuresh.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            Built by Rachitha
          </a>
          <span>·</span>
          <a href="https://anthropic.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            Powered by Claude
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default LennyCourseComplete;
