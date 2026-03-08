import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Play, CheckCircle2, Clock, ArrowLeft } from 'lucide-react';
import { useCourse } from '@/context/CourseContext';
import { MODULE_DATA } from '@/data/courseData';
import { XPCounter } from '@/components/XPCounter';

const CourseMap = () => {
  const { state } = useCourse();
  const navigate = useNavigate();

  const totalTime = MODULE_DATA.reduce((acc, m) => {
    const mod = state.modules.find(sm => sm.id === m.id);
    if (mod?.status === 'completed') return acc;
    return acc + m.estimatedMinutes;
  }, 0);

  return (
    <div className="min-h-screen bg-background noise-bg">
      <nav className="border-b border-border/50 sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <XPCounter />
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold tracking-tight text-foreground mb-3">
            Build Your First Claude Skill
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> ~{totalTime} min remaining</span>
            <span>{state.modules.filter(m => m.status === 'completed').length}/7 modules complete</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-muted mb-10 overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full progress-fill"
            style={{ width: `${(state.modules.filter(m => m.status === 'completed').length / 7) * 100}%` }}
          />
        </div>

        <div className="space-y-4">
          {MODULE_DATA.map((mod, i) => {
            const modState = state.modules[i];
            const isLocked = modState.status === 'locked';
            const isCompleted = modState.status === 'completed';
            const isInProgress = modState.status === 'in_progress';

            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  if (isLocked) return;
                  navigate(`/course/module/${mod.id}`);
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

        {state.modules.every(m => m.status === 'completed') && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-center">
            <Link
              to="/course/complete"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-md bg-primary text-primary-foreground font-bold glow-primary hover:opacity-90 transition-all"
            >
              View Your Certificate 🎉
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CourseMap;
