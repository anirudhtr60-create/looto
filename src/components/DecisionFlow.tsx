import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  X, 
  ChevronLeft, 
  Zap, 
  ClipboardCheck, 
  Activity, 
  Wrench, 
  Maximize, 
  MoveRight,
  HelpCircle
} from 'lucide-react';
import { AssessmentState } from '../types';
import { QUESTIONS } from '../constants';

interface DecisionFlowProps {
  assessment: AssessmentState;
  onAnswer: (answer: boolean) => void;
  onBack: () => void;
  onRestart: () => void;
}

const ICON_MAP: Record<string, any> = {
  Zap,
  ClipboardCheck,
  Activity,
  Wrench,
  Maximize,
  MoveRight,
};

export default function DecisionFlow({ assessment, onAnswer, onBack, onRestart }: DecisionFlowProps) {
  const currentQuestion = QUESTIONS[assessment.currentStepId];
  const progress = (assessment.path.length / 6) * 100; // Estimated total steps
  const QuestionIcon = ICON_MAP[currentQuestion.icon] || HelpCircle;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">Assessment In Progress</span>
          <h2 className="text-sm font-medium text-slate-500 flex items-center gap-2">
            Activity: <span className="text-slate-900 font-semibold">{assessment.activity}</span>
          </h2>
        </div>
        <button 
          onClick={onRestart}
          className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-wider"
        >
          Reset
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-3">
          <div className="flex gap-1.5 align-center">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className={`w-10 h-1 bg-[#0f172a] rounded-full transition-all duration-300 ${i < assessment.path.length + 1 ? 'opacity-100' : 'opacity-10'}`}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Step {assessment.path.length + 1} of ~6</span>
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={assessment.currentStepId}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-10 md:p-14 mb-8"
        >
          <div className="flex flex-col gap-4">
            <span className="badge w-fit bg-[#dcfce7] text-[#166534] mb-2">Assessment</span>
            
            <div className="flex flex-col">
              <h3 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] leading-tight mb-4 tracking-tight">
                {currentQuestion.text}
              </h3>
              
              {currentQuestion.helperText && (
                <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
                  {currentQuestion.helperText}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-5">
        <button
          onClick={() => onAnswer(true)}
          className="btn-choice btn-yes flex flex-col items-center justify-center gap-3 p-8 rounded-2xl"
        >
          <div className="text-3xl mb-1">✅</div>
          <span className="text-xl font-bold">Yes, it's acceptable</span>
        </button>

        <button
          onClick={() => onAnswer(false)}
          className="btn-choice btn-no flex flex-col items-center justify-center gap-3 p-8 rounded-2xl"
        >
          <div className="text-3xl mb-1">❌</div>
          <span className="text-xl font-bold">No, risk is too high</span>
        </button>
      </div>

      {/* Back Button */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 underline-offset-4 hover:underline font-medium transition-all"
        >
          <ChevronLeft size={18} />
          Previous Question
        </button>
      </div>
    </div>
  );
}
