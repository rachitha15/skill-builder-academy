import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Trophy, ChevronDown } from 'lucide-react';
import { useCourse } from '@/context/CourseContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import confetti from 'canvas-confetti';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const CourseComplete = () => {
  const { state } = useCourse();
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const [installOpen, setInstallOpen] = useState(false);

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
    document.title = 'Course Complete — You built your first Claude Skill on Untutorial';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Course Complete — You built your first Claude Skill on Untutorial');
    }
  }, []);

  const handleDownload = async () => {
    const content = state.modules[6]?.userWork || state.modules[5]?.userWork || state.modules[2]?.userWork || '# SKILL.md';
    const zip = new JSZip();
    const folder = zip.folder('meeting-action-extractor');
    folder?.file('SKILL.md', content);
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'meeting-action-extractor.zip');
  };

  const handleJoinWaitlist = () => {
    if (!email.trim()) return;
    const existing = JSON.parse(localStorage.getItem('untutorial-waitlist') || '[]');
    existing.push({ email, date: new Date().toISOString() });
    localStorage.setItem('untutorial-waitlist', JSON.stringify(existing));
    setJoined(true);
  };

  const tweetText = encodeURIComponent(`I just built my first Claude Skill on Untutorial! 🛠️ ${state.totalXP} XP earned. Stop watching tutorials. Start building. #ClaudeSkills #BuildWithAI`);
  const linkedInText = encodeURIComponent(`I just built my first Claude Skill on Untutorial! 🛠️ ${state.totalXP} XP earned. Stop watching tutorials. Start building.\n\nhttps://untutorial.in\n\n#ClaudeSkills #BuildWithAI`);

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
          You built your first Claude Skill! 🎉
        </h1>
        <p className="text-muted-foreground mb-8">Clara's meeting chaos doesn't stand a chance.</p>

        {/* Skill Builder Badge */}
        <div className="rounded-xl border-2 border-primary/50 bg-[#111] p-8 mb-8 text-center" style={{ boxShadow: '0 0 30px hsl(18 100% 60% / 0.2), 0 0 80px hsl(18 100% 60% / 0.08)' }}>
          <p className="text-xs text-primary uppercase tracking-[0.3em] font-bold mb-3">Skill Builder</p>
          <p className="font-mono text-lg text-muted-foreground mb-1">meeting-action-extractor</p>
          <p className="font-mono text-4xl font-extrabold text-primary mb-2">{state.totalXP} XP</p>
          <p className="text-xs text-muted-foreground mb-3">7 modules completed</p>
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
          <Download className="h-4 w-4" /> Download Your Skill
        </button>

        {/* How to Install */}
        <Collapsible open={installOpen} onOpenChange={setInstallOpen} className="rounded-lg border border-border bg-card mb-6 text-left">
          <CollapsibleTrigger className="w-full px-5 py-4 flex items-center justify-between">
            <span className="font-display font-bold text-foreground text-sm">How to install in Claude.ai</span>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${installOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-5 pb-4">
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal ml-4">
              <li>Open Claude.ai → Settings → Capabilities → Skills</li>
              <li>Click "Upload skill"</li>
              <li>Select the .zip file</li>
              <li>Toggle the Skill on</li>
              <li>Paste any meeting notes and ask for action items</li>
            </ol>
          </CollapsibleContent>
        </Collapsible>

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
            href={`https://twitter.com/intent/tweet?text=${tweetText}&url=https://untutorial.in`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-md border border-border bg-card text-sm text-foreground hover:bg-muted transition-colors"
          >
            Share on X
          </a>
        </div>

        {/* Waitlist */}
        <div className="rounded-lg border border-border bg-card p-6 mb-8 text-center">
          <h3 className="font-display font-bold text-foreground mb-1">Want to build more?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Advanced course coming soon — Claude Skills with MCP connectors, multi-step workflows, and team deployment.
          </p>
          {joined ? (
            <p className="text-sm text-[hsl(var(--success))] font-bold">You're on the list! We'll email you when the next course drops. 🎉</p>
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

        <Link to="/course" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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

export default CourseComplete;
