import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Trophy } from 'lucide-react';
import { useCourse } from '@/context/CourseContext';
import confetti from 'canvas-confetti';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const CourseComplete = () => {
  const { state } = useCourse();

  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#10b981', '#f59e0b', '#e2e8f0'] });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#10b981', '#f59e0b', '#e2e8f0'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const handleDownload = async () => {
    const content = state.modules[6]?.userWork || state.modules[2]?.userWork || '# SKILL.md';
    const zip = new JSZip();
    const folder = zip.folder('meeting-action-extractor');
    folder?.file('SKILL.md', content);
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'meeting-action-extractor.zip');
  };

  const shareText = encodeURIComponent(`I just built my first Claude Skill on Untutorial! 🛠️ ${state.totalXP} XP earned. Stop watching tutorials. Start building. untutorial.in #ClaudeSkills #BuildWithAI`);

  return (
    <div className="min-h-screen bg-background noise-bg flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.3 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/20 border border-primary/30 mb-6"
        >
          <Trophy className="h-10 w-10 text-primary" />
        </motion.div>

        <h1 className="text-4xl font-display font-extrabold text-foreground mb-3">
          You built your first Claude Skill! 🎉
        </h1>
        <p className="text-muted-foreground mb-8">Congratulations, Skill Builder!</p>

        {/* Badge card */}
        <div className="rounded-xl border border-primary/30 bg-card p-6 mb-8 glow-primary">
          <p className="text-xs text-primary uppercase tracking-widest font-bold mb-2">Skill Builder</p>
          <p className="font-mono text-3xl font-bold text-primary">{state.totalXP} XP</p>
          <p className="text-sm text-muted-foreground mt-1">7 modules completed</p>
        </div>

        <div className="space-y-3 mb-8">
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            <Download className="h-4 w-4" /> Download Your Skill
          </button>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 mb-8 text-left">
          <h3 className="font-display font-bold text-foreground text-sm mb-2">How to install</h3>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal ml-4">
            <li>Go to Claude Settings → Skills</li>
            <li>Upload your Skill folder</li>
            <li>Test with real meeting notes!</li>
          </ol>
        </div>

        <div className="flex gap-3 justify-center mb-8">
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=https://untutorial.in&summary=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-muted transition-colors"
          >
            Share on LinkedIn
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-muted transition-colors"
          >
            Share on Twitter
          </a>
        </div>

        <Link to="/course" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Course Map
        </Link>
      </motion.div>
    </div>
  );
};

export default CourseComplete;
