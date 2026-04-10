import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2 } from 'lucide-react';
import { PlaybookSection } from '@/context/LennyCourseContext';
import { LENNY_TOPICS } from '@/data/lennyLabData';

interface Props {
  playbook: PlaybookSection[] | null;
  selectedTopic: string;
  totalXP: number;
  onComplete: (score: number, maxScore: number) => void;
}

export function LennyPlaybookWorkspace({ playbook, selectedTopic, totalXP, onComplete }: Props) {
  const [copied, setCopied] = useState(false);

  // Mark mission complete on mount
  useEffect(() => {
    onComplete(1, 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const topicLabel = LENNY_TOPICS.find(t => t.id === selectedTopic)?.label ?? selectedTopic;

  const generateMarkdown = (): string => {
    if (!playbook || playbook.length === 0) return '# Playbook\n\nNo sections built yet.';

    const lines: string[] = [
      `# ${topicLabel} Playbook`,
      `> Built with The Lens on Untutorial · ${totalXP} XP earned`,
      '',
      `---`,
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
    a.download = `${selectedTopic}-playbook.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const linkedInShareText =
    `I just built a ${topicLabel} playbook from Lenny Rachitsky's archive of 600+ posts and episodes 🔍\n\n` +
    `Learned how AI search actually works — chunking, embeddings, retrieval, and RAG — by building something real.\n\n` +
    `${totalXP} XP earned across 5 missions on Untutorial.\n\n` +
    `Try it yourself: https://untutorial.in/course/lenny\n\n` +
    `#BuildWithAI #ProductManagement #RAG`;

  const tweetText = encodeURIComponent(
    `I just built a ${topicLabel} playbook from @lennysan's archive of 600+ posts and episodes 🔍 ` +
    `Learned how RAG actually works by building something real. ` +
    `${totalXP} XP on @untutorial. Try it:`
  );

  const handleCopyLinkedIn = () => {
    navigator.clipboard.writeText(linkedInShareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  if (!playbook || playbook.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
        <p className="text-muted-foreground text-sm">Your playbook sections will appear here after completing Mission 5.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 overflow-y-auto h-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border-2 border-primary/50 bg-[#111] p-6 text-center"
        style={{ boxShadow: '0 0 30px hsl(18 100% 60% / 0.15)' }}
      >
        <p className="text-xs text-primary uppercase tracking-[0.3em] font-bold mb-2">Your Playbook</p>
        <h2 className="text-xl font-display font-bold text-foreground mb-1">{topicLabel}</h2>
        <p className="text-sm text-muted-foreground mb-3">Built with The Lens · {playbook.length} sections · {totalXP} XP earned</p>
        <p className="text-xs text-muted-foreground">Synthesized from Lenny Rachitsky's archive of 349 newsletters + 289 podcasts</p>
      </motion.div>

      {/* Sections */}
      {playbook.map((section, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-lg border border-border bg-card p-5"
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="font-display font-bold text-foreground">{section.title}</h3>
            <span className="flex-shrink-0 text-xs text-muted-foreground font-mono px-2 py-0.5 rounded bg-muted/30">
              {section.sourceFilter} · {section.threshold}
            </span>
          </div>
          <p className="text-sm text-foreground leading-relaxed mb-3">{section.synthesis}</p>
          {section.sources.length > 0 && (
            <div className="pt-3 border-t border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-1">Sources:</p>
              <ul className="space-y-0.5">
                {section.sources.map((src, j) => (
                  <li key={j} className="text-xs text-muted-foreground">· {src}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      ))}

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
        >
          <Download className="h-4 w-4" /> Download Playbook (.md)
        </button>

        <div className="flex gap-3">
          <a
            href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Funtutorial.in%2Fcourse%2Flenny"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-border bg-card text-sm text-foreground hover:bg-muted transition-colors"
          >
            Share on LinkedIn
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${tweetText}&url=https://untutorial.in/course/lenny`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-border bg-card text-sm text-foreground hover:bg-muted transition-colors"
          >
            Share on X
          </a>
        </div>

        <button
          onClick={handleCopyLinkedIn}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-border bg-card text-sm text-foreground hover:bg-muted transition-colors"
        >
          <Share2 className="h-4 w-4" /> {copied ? '✓ Copied!' : 'Copy LinkedIn text (paste into post)'}
        </button>
      </div>
    </div>
  );
}
