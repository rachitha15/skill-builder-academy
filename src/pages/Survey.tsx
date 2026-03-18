import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type SurveyData = {
  q1_frequency: string;
  q2_usage: string[];
  q2_other?: string;
  q3_frustration: string;
  q3_other?: string;
  q4_learning_priority: string;
  q4_other?: string;
  q5_role: string;
  q5_other?: string;
};

const Survey = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [formData, setFormData] = useState<SurveyData>({
    q1_frequency: '',
    q2_usage: [],
    q3_frustration: '',
    q4_learning_priority: '',
    q5_role: '',
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRadioChange = (field: keyof SurveyData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCheckboxChange = (value: string) => {
    const currentUsage = formData.q2_usage;
    if (currentUsage.includes(value)) {
      setFormData({ ...formData, q2_usage: currentUsage.filter(v => v !== value) });
    } else {
      setFormData({ ...formData, q2_usage: [...currentUsage, value] });
    }
  };

  const handleTextChange = (field: keyof SurveyData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setIsError(false);

    try {
      // Prepare data for submission
      const submissionData = {
        q1_frequency: formData.q1_frequency,
        q2_usage: formData.q2_usage.map(item => {
          if (item === 'Other' && formData.q2_other) {
            return `Other: ${formData.q2_other}`;
          }
          return item;
        }),
        q3_frustration: formData.q3_frustration === 'Other' && formData.q3_other
          ? `Other: ${formData.q3_other}`
          : formData.q3_frustration,
        q4_learning_priority: formData.q4_learning_priority === 'Other' && formData.q4_other
          ? `Other: ${formData.q4_other}`
          : formData.q4_learning_priority,
        q5_role: formData.q5_role === 'Other' && formData.q5_other
          ? `Other: ${formData.q5_other}`
          : formData.q5_role,
      };

      const { error } = await supabase
        .from('survey_responses')
        .insert([submissionData]);

      if (error) throw error;

      setIsSuccess(true);
    } catch (error) {
      console.error('Survey submission error:', error);
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.q1_frequency !== '';
      case 2:
        // Check if at least one option is selected
        if (formData.q2_usage.length === 0) return false;
        // If "Other" is selected, require text input
        if (formData.q2_usage.includes('Other') && (!formData.q2_other || formData.q2_other.trim() === '')) {
          return false;
        }
        return true;
      case 3:
        // If "Other" is selected, require text input
        if (formData.q3_frustration === 'Other' && (!formData.q3_other || formData.q3_other.trim() === '')) {
          return false;
        }
        return formData.q3_frustration !== '';
      case 4:
        // If "Other" is selected, require text input
        if (formData.q4_learning_priority === 'Other' && (!formData.q4_other || formData.q4_other.trim() === '')) {
          return false;
        }
        return formData.q4_learning_priority !== '';
      case 5:
        // If "Other" is selected, require text input
        if (formData.q5_role === 'Other' && (!formData.q5_other || formData.q5_other.trim() === '')) {
          return false;
        }
        return formData.q5_role !== '';
      default:
        return false;
    }
  };

  // Success screen
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background noise-bg flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg text-center"
        >
          <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-3xl font-display font-bold text-foreground mb-4">
            Thanks!
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Your responses are anonymous and will help shape a free learning resource for this community.
            We'll share aggregated insights soon.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Untutorial
          </Link>
        </motion.div>
      </div>
    );
  }

  // Error screen
  if (isError) {
    return (
      <div className="min-h-screen bg-background noise-bg flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg text-center"
        >
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl text-destructive">✕</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-4">
            Something went wrong
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Try again?
          </p>
          <button
            onClick={() => setIsError(false)}
            className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background noise-bg">
      {/* Nav */}
      <nav className="border-b border-border/50 bg-background">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-display font-bold text-lg text-foreground">
            un<span className="text-primary">tutorial</span>
          </Link>
          <span className="text-sm text-muted-foreground">
            {currentStep} of {totalSteps}
          </span>
        </div>
      </nav>

      {/* Progress bar */}
      <div className="max-w-3xl mx-auto px-6 pt-4">
        <div className="h-1 bg-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: `${(currentStep / totalSteps) * 100}%` }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="max-w-2xl mx-auto px-6 pt-12 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-3">
          AI at Work — Where Are You Really?
        </h1>
        <p className="text-muted-foreground">
          Anonymous · 5 questions · 2 minutes
        </p>
      </div>

      {/* Question container */}
      <div className="max-w-2xl mx-auto px-6 pb-20">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Question 1 */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-6">
                How often do you use AI (Claude, ChatGPT, etc.) for actual work tasks?
              </h2>
              <div className="space-y-3">
                {[
                  'Daily',
                  'A few times a week',
                  'Occasionally',
                  "Rarely / I've tried but stopped",
                  'Never',
                ].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleRadioChange('q1_frequency', option)}
                    className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${
                      formData.q1_frequency === option
                        ? 'border-primary bg-primary/5 text-foreground'
                        : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 2 */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-6">
                What do you mostly use it for?
              </h2>
              <p className="text-sm text-muted-foreground mb-4">Select all that apply</p>
              <div className="space-y-3">
                {[
                  'Writing / editing emails and docs',
                  'Research and summarization',
                  'Brainstorming and ideation',
                  'Data analysis',
                  'Coding or technical tasks',
                  'Creating presentations or reports',
                  'Other',
                ].map((option) => (
                  <div key={option}>
                    <button
                      onClick={() => handleCheckboxChange(option)}
                      className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${
                        formData.q2_usage.includes(option)
                          ? 'border-primary bg-primary/5 text-foreground'
                          : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          formData.q2_usage.includes(option)
                            ? 'border-primary bg-primary'
                            : 'border-border'
                        }`}>
                          {formData.q2_usage.includes(option) && (
                            <span className="text-primary-foreground text-xs">✓</span>
                          )}
                        </div>
                        {option}
                      </div>
                    </button>
                    {option === 'Other' && formData.q2_usage.includes('Other') && (
                      <input
                        type="text"
                        placeholder="Please specify..."
                        value={formData.q2_other || ''}
                        onChange={(e) => handleTextChange('q2_other', e.target.value)}
                        className="mt-2 w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Question 3 */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-6">
                What&apos;s your biggest frustration with AI tools?
              </h2>
              <div className="space-y-3">
                {[
                  "I get inconsistent results and don't know why",
                  "I don't know what I can actually use it for at work",
                  "I know the basics but can't go deeper",
                  'I feel behind compared to my peers',
                  'The tools change too fast to keep up',
                  'Other',
                ].map((option) => (
                  <div key={option}>
                    <button
                      onClick={() => handleRadioChange('q3_frustration', option)}
                      className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${
                        formData.q3_frustration === option
                          ? 'border-primary bg-primary/5 text-foreground'
                          : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      {option}
                    </button>
                    {option === 'Other' && formData.q3_frustration === 'Other' && (
                      <input
                        type="text"
                        placeholder="Please specify..."
                        value={formData.q3_other || ''}
                        onChange={(e) => handleTextChange('q3_other', e.target.value)}
                        className="mt-2 w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Question 4 */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-6">
                If you could spend 1 hour learning ONE thing about AI, what would be most valuable?
              </h2>
              <div className="space-y-3">
                {[
                  'How to write prompts that actually work consistently',
                  'How to build reusable AI workflows for my specific role',
                  'How to automate repetitive tasks with AI',
                  "Understanding what AI can and can't do",
                  'How to use AI for decision-making and analysis',
                  'Other',
                ].map((option) => (
                  <div key={option}>
                    <button
                      onClick={() => handleRadioChange('q4_learning_priority', option)}
                      className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${
                        formData.q4_learning_priority === option
                          ? 'border-primary bg-primary/5 text-foreground'
                          : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      {option}
                    </button>
                    {option === 'Other' && formData.q4_learning_priority === 'Other' && (
                      <input
                        type="text"
                        placeholder="Please specify..."
                        value={formData.q4_other || ''}
                        onChange={(e) => handleTextChange('q4_other', e.target.value)}
                        className="mt-2 w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Question 5 */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-6">
                What best describes your role?
              </h2>
              <div className="space-y-3">
                {[
                  'Marketing',
                  'Operations',
                  'HR / People',
                  'Finance',
                  'Product Management',
                  'Engineering',
                  'Founder / Leadership',
                  'Other',
                ].map((option) => (
                  <div key={option}>
                    <button
                      onClick={() => handleRadioChange('q5_role', option)}
                      className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${
                        formData.q5_role === option
                          ? 'border-primary bg-primary/5 text-foreground'
                          : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      {option}
                    </button>
                    {option === 'Other' && formData.q5_role === 'Other' && (
                      <input
                        type="text"
                        placeholder="Please specify..."
                        value={formData.q5_other || ''}
                        onChange={(e) => handleTextChange('q5_other', e.target.value)}
                        className="mt-2 w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-10">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                currentStep === 1
                  ? 'text-muted-foreground cursor-not-allowed opacity-50'
                  : 'text-foreground hover:text-primary'
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`flex items-center gap-2 px-8 py-3 rounded-md font-bold transition-all ${
                  isStepValid()
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid() || isSubmitting}
                className={`px-8 py-3 rounded-md font-bold transition-all ${
                  isStepValid() && !isSubmitting
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Survey;
