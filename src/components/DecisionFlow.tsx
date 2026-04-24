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
  HelpCircle,
  Shield,
  Repeat
} from 'lucide-react';
import { AssessmentState, Language } from '../types';
import { QUESTIONS, UI_TRANSLATIONS } from '../constants';
import Tooltip from './Tooltip';

interface DecisionFlowProps {
  assessment: AssessmentState;
  onAnswer: (answer: boolean) => void;
  onBack: () => void;
  onRestart: () => void;
  onExit: () => void;
  lang: Language;
}

const ICON_MAP: Record<string, any> = {
  Zap,
  ClipboardCheck,
  Activity,
  Wrench,
  Maximize,
  MoveRight,
  Shield,
  Repeat,
};

export default function DecisionFlow({ assessment, onAnswer, onBack, onRestart, onExit, lang }: DecisionFlowProps) {
  const currentQuestion = QUESTIONS[assessment.currentStepId];
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS['en'];

  if (!currentQuestion) {
    return (
      <div className="p-12 text-center bg-red-50 rounded-[2.5rem] border border-red-100 max-w-xl mx-auto my-12">
        <p className="text-red-600 font-extrabold text-xl mb-4">Error: Step ID not found ({assessment.currentStepId})</p>
        <button onClick={onRestart} className="btn-primary">{t.restart}</button>
      </div>
    );
  }

  const qT = currentQuestion.translations?.[lang] || currentQuestion.translations?.['en'];

  if (!qT) {
    return (
      <div className="p-12 text-center bg-red-50 rounded-[2.5rem] border border-red-100 max-w-xl mx-auto my-12">
        <p className="text-red-600 font-extrabold text-xl mb-4">Error: Question translations missing</p>
        <button onClick={onRestart} className="btn-primary">{t.restart}</button>
      </div>
    );
  }

  const QuestionIcon = ICON_MAP[currentQuestion.icon] || HelpCircle;
  const totalSteps = 6;
  const currentStepNum = assessment.path.length + 1;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 text-left">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col">
          <button 
            onClick={onExit}
            className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-900 transition-colors mb-2 w-fit transition-all hover:-translate-x-1"
          >
            <ChevronLeft size={14} />
            {lang === 'en' ? 'Back to Portal' : 'पोर्टल पर वापस'}
          </button>
          <span className="text-xs font-bold uppercase tracking-widest text-[#0f172a] mb-1">
            {lang === 'en' ? 'Assessment in Progress' : 'मूल्यांकन प्रगति पर है'}
          </span>
          <h2 className="text-sm font-bold text-slate-600 flex items-center gap-2">
            {lang === 'en' ? 'Activity' : 'गतिविधि'}: <span className="text-slate-900 font-extrabold">{assessment.activity}</span>
          </h2>
        </div>
        <Tooltip content={t.reset}>
          <button 
            onClick={onRestart}
            className="text-xs font-bold text-slate-600 hover:text-red-600 transition-colors uppercase tracking-widest flex items-center gap-2 p-2 rounded-lg focus-visible:ring-2 focus-visible:ring-red-600 outline-none"
            aria-label={t.reset}
          >
            <RotateCcw size={14} aria-hidden="true" />
            {t.reset}
          </button>
        </Tooltip>
      </div>

      <div className="mb-12" role="progressbar" aria-valuenow={currentStepNum} aria-valuemin={1} aria-valuemax={totalSteps} aria-label={lang === 'en' ? 'Assessment progress' : 'मूल्यांकन प्रगति'}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2 align-center flex-1 mr-8">
            {[...Array(totalSteps)].map((_, i) => (
              <div 
                key={i} 
                className="h-1.5 flex-1 bg-slate-200 rounded-full overflow-hidden"
              >
                <motion.div 
                  initial={false}
                  animate={{ 
                    width: i < currentStepNum ? '100%' : '0%',
                    backgroundColor: i < currentStepNum ? '#16a34a' : '#e2e8f0'
                  }}
                  transition={{ duration: 0.5, ease: "circOut" }}
                  className="h-full rounded-full"
                />
              </div>
            ))}
          </div>
          <motion.span 
            key={currentStepNum}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap"
          >
            {t.step} {currentStepNum} {t.of} {totalSteps}
          </motion.span>
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={assessment.currentStepId}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card p-10 md:p-14 mb-8 relative overflow-hidden group shadow-2xl shadow-slate-900/5 hover:shadow-slate-900/10 transition-shadow border-slate-100"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full" />
          
          <div className="flex flex-col gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <Tooltip content={qT.helperText || ''}>
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-14 h-14 bg-[#0f172a] text-white rounded-[1.2rem] flex items-center justify-center shadow-xl shadow-slate-900/20 cursor-help"
                >
                  <QuestionIcon size={28} aria-hidden="true" />
                </motion.div>
              </Tooltip>
              <div className="flex flex-col">
                <span className="badge bg-green-50 text-green-700 border border-green-100">
                  {lang === 'en' ? 'Critical Safety Check' : 'महत्वपूर्ण सुरक्षा जांच'}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <motion.h1 
                className="text-3xl md:text-5xl font-display font-black text-[#0f172a] leading-[1.1] mb-6 tracking-tighter min-h-[100px]"
              >
                {qT.text}
              </motion.h1>
              
              {qT.helperText && (
                <div className="flex items-start gap-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-100/50">
                  <HelpCircle size={18} className="text-slate-400 mt-0.5 shrink-0" />
                  <p className="text-sm md:text-base text-slate-500 font-semibold leading-relaxed">
                    {qT.helperText}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 md:gap-8">
        <motion.button
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAnswer(true)}
          className="btn-yes flex flex-col items-center justify-center gap-2 md:gap-4 p-8 md:p-12 rounded-[2.5rem] min-h-[160px] md:h-60 group outline-none ring-offset-4 shadow-xl shadow-green-500/10 hover:shadow-green-500/20"
          aria-label={`${t.yes}: ${lang === 'en' ? 'Confirm state is true' : 'पुष्टि करें कि स्थिति सत्य है'}`}
        >
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }} 
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl md:text-6xl font-black text-[#065f46] tracking-tighter"
          >
            {t.yes}
          </motion.div>
          <div className="flex items-center gap-2 text-[10px] md:text-xs font-black opacity-40 uppercase tracking-[0.25em] group-hover:opacity-100 group-hover:text-[#065f46] transition-all">
            <span>{lang === 'en' ? 'Yes' : 'हाँ'}</span>
            <MoveRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAnswer(false)}
          className="btn-no flex flex-col items-center justify-center gap-2 md:gap-4 p-8 md:p-12 rounded-[2.5rem] min-h-[160px] md:h-60 group outline-none ring-offset-4 shadow-xl shadow-red-500/10 hover:shadow-red-500/20"
          aria-label={`${t.no}: ${lang === 'en' ? 'Confirm state is false' : 'पुष्टि करें कि स्थिति असत्य है'}`}
        >
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }} 
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="text-4xl md:text-6xl font-black text-[#991b1b] tracking-tighter"
          >
            {t.no}
          </motion.div>
          <div className="flex items-center gap-2 text-[10px] md:text-xs font-black opacity-40 uppercase tracking-[0.25em] group-hover:opacity-100 group-hover:text-[#991b1b] transition-all">
            <span>{lang === 'en' ? 'No' : 'नहीं'}</span>
            <MoveRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.button>
      </div>

      <div className="mt-12 flex justify-center">
        <Tooltip content={t.back}>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-[#0f172a] font-black text-xs uppercase tracking-widest transition-all p-2 rounded-lg focus-visible:ring-2 focus-visible:ring-slate-900 outline-none"
            aria-label={t.back}
          >
            <ChevronLeft size={18} aria-hidden="true" />
            {t.back}
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
