import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { LessonStep } from '@/data/courseData';

interface LessonStepperProps {
  steps: LessonStep[];
  moduleId: number;
  onAllStepsViewed: () => void;
  allViewed: boolean;
}

export function LessonStepper({ steps, moduleId, onAllStepsViewed, allViewed }: LessonStepperProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [expandedPrevious, setExpandedPrevious] = useState<number[]>([]);

  // Reset when module changes OR when allViewed changes to false
  useEffect(() => {
    if (!allViewed) {
      setCurrentStep(0);
      setExpandedPrevious([]);
    }
  }, [moduleId, allViewed]);

  // If already viewed (e.g. returning to completed module), show all
  useEffect(() => {
    if (allViewed && steps && steps.length > 0) {
      setCurrentStep(steps.length - 1);
    }
  }, [allViewed]);

  const handleContinue = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onAllStepsViewed();
    }
  };

  const togglePrevious = (idx: number) => {
    setExpandedPrevious(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  // Safety checks after hooks
  if (!steps || steps.length === 0) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
        <p className="text-sm text-destructive">No lesson steps found for this module.</p>
      </div>
    );
  }

  const isLastStep = currentStep === steps.length - 1;
  const currentStepData = steps[currentStep];

  if (!currentStepData) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
        <p className="text-sm text-destructive">Error loading step {currentStep + 1}.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Previous (collapsed) steps */}
      {steps.slice(0, currentStep).map((step, idx) => (
        <div key={idx} className="rounded-md border border-border bg-card/50">
          <button
            onClick={() => togglePrevious(idx)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors"
          >
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <Check className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground flex-1">{step.title}</span>
            {expandedPrevious.includes(idx) ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          <AnimatePresence>
            {expandedPrevious.includes(idx) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 lesson-content border-t border-border/50 pt-3">
                  <ReactMarkdown>{step.content}</ReactMarkdown>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* Current step */}
      <motion.div
        key={`step-${currentStep}-${moduleId}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-md border border-primary/30 bg-card"
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">{currentStep + 1}</span>
          </div>
          <span className="text-sm font-display font-semibold text-foreground">{currentStepData.title}</span>
          <span className="ml-auto text-xs text-muted-foreground">{currentStep + 1}/{steps.length}</span>
        </div>
        <div className="px-4 py-4 lesson-content">
          <ReactMarkdown>{currentStepData.content}</ReactMarkdown>
        </div>
        {!allViewed && (
          <div className="px-4 pb-4">
            <button
              onClick={handleContinue}
              className="w-full py-2.5 rounded-md bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
            >
              {isLastStep ? 'Start Challenge →' : 'Continue →'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
