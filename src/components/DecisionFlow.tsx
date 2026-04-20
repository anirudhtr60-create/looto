import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  RotateCcw,
  Zap, 
  ClipboardCheck, 
  Activity, 
  Wrench, 
  Maximize, 
  MoveRight,
  HelpCircle
} from 'lucide-react';
import { AssessmentState, Language } from '../types';
import { QUESTIONS, UI_TRANSLATIONS } from '../constants';
import Tooltip from './Tooltip';

interface DecisionFlowProps {
  assessment: AssessmentState;
  onAnswer: (answer: boolean) => void;
  onBack: () => void;
  onRestart: () => void;
  lang: Language;
}

const ICON_MAP: Record<string, any> = {
  Zap,
  ClipboardCheck,
  Activity,
  Wrench,
  Maximize,
  MoveRight,
};

export default function DecisionFlow({ assessment, onAnswer, onBack, onRestart, lang }: DecisionFlowProps) {
  const currentQuestion = QUESTIONS[assessment.currentStepId];
  const qT = currentQuestion.translations[lang];
  const t = UI_TRANSLATIONS[lang];
  const QuestionIcon = ICON_MAP[currentQuestion.icon] || HelpCircle;
  const totalSteps = 6;
  const currentStepNum = assessment.path.length + 1;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 text-left">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0f172a] mb-1">
            {lang === 'en' ? 'Assessment in Progress' : 'मूल्यांकन प्रगति पर है'}
          </span>
          <h2 className="text-sm font-medium text-slate-500 flex items-center gap-2">
            {lang === 'en' ? 'Activity' : 'गतिविधि'}: <span className="text-slate-900 font-semibold">{assessment.activity}</span>
          </h2>
        </div>
        <Tooltip content={t.reset}>
          <button 
            onClick={onRestart}
            className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-wider flex items-center gap-2"
          >
            <RotateCcw size={14} />
            {t.reset}
          </button>
        </Tooltip>
      </div>

      <div className="mb-12">
        <div className="flex justify-between items-center mb-3">
          <div className="flex gap-1.5 align-center">
            {[...Array(totalSteps)].map((_, i) => (
              <div 
                key={i} 
                className={`w-10 h-1.5 bg-[#0f172a] rounded-full transition-all duration-300 ${i < currentStepNum ? 'opacity-100' : 'opacity-10'}`}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{t.step} {currentStepNum} {t.of} {totalSteps}</span>
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
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-[#0f172a] shadow-sm">
                <QuestionIcon size={24} />
              </div>
              <span className="badge bg-[#dcfce7] text-[#166534]">
                {lang === 'en' ? 'Assessment' : 'मूल्यांकन'}
              </span>
            </div>
            
            <div className="flex flex-col">
              <h3 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] leading-tight mb-4 tracking-tight min-h-[80px]">
                {qT.text}
              </h3>
              
              {qT.helperText && (
                <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
                  {qT.helperText}
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
          className="btn-yes flex flex-col items-center justify-center gap-3 p-8 rounded-2xl h-40 group"
          aria-label={t.yes}
        >
          <span className="text-2xl font-black">{t.yes}</span>
          <span className="text-xs font-bold opacity-60 uppercase tracking-widest group-hover:opacity-100 transition-opacity">
            {lang === 'en' ? 'Select Yes' : 'हाँ चुनें'}
          </span>
        </button>

        <button
          onClick={() => onAnswer(false)}
          className="btn-no flex flex-col items-center justify-center gap-3 p-8 rounded-2xl h-40 group"
          aria-label={t.no}
        >
          <span className="text-2xl font-black">{t.no}</span>
          <span className="text-xs font-bold opacity-60 uppercase tracking-widest group-hover:opacity-100 transition-opacity">
            {lang === 'en' ? 'Select No' : 'नहीं चुनें'}
          </span>
        </button>
      </div>

      <div className="mt-12 flex justify-center">
        <Tooltip content={t.back}>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest transition-all"
            aria-label={t.back}
          >
            <ChevronLeft size={18} />
            {t.back}
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
