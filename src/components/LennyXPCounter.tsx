import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLennyCourse } from '@/context/LennyCourseContext';

export function LennyXPCounter({ className = '' }: { className?: string }) {
  const { state } = useLennyCourse();
  const [displayXP, setDisplayXP] = useState(state.totalXP);
  const [floatingXP, setFloatingXP] = useState<number | null>(null);
  const prevXP = useRef(state.totalXP);

  useEffect(() => {
    if (state.totalXP !== prevXP.current) {
      const diff = state.totalXP - prevXP.current;
      if (diff > 0) setFloatingXP(diff);

      const start = prevXP.current;
      const end = state.totalXP;
      const duration = 800;
      const startTime = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayXP(Math.round(start + (end - start) * eased));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      prevXP.current = state.totalXP;

      setTimeout(() => setFloatingXP(null), 1200);
    }
  }, [state.totalXP]);

  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`}>
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">XP</span>
      <span className="font-mono font-extrabold text-primary text-3xl" style={{ textShadow: '0 0 20px hsl(18 100% 60% / 0.4)' }}>
        {displayXP}
      </span>
      <AnimatePresence>
        {floatingXP && (
          <motion.span
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -30 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute -top-4 right-0 text-sm font-bold text-primary pointer-events-none"
          >
            +{floatingXP}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
