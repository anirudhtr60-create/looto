import { motion } from 'framer-motion';
import { 
  Shield, 
  RotateCcw, 
  ChevronLeft, 
  CheckCircle2, 
  XCircle,
  ClipboardList,
  AlertTriangle,
  Lock,
  User,
  Hand,
  Check,
  ChevronRight
} from 'lucide-react';
import { AssessmentState, ModeId, Language } from '../types';
import { MODES, QUESTIONS, UI_TRANSLATIONS } from '../constants';
import Tooltip from './Tooltip';

interface ResultScreenProps {
  assessment: AssessmentState;
  onRestart: () => void;
  onBack: () => void;
  lang: Language;
}

const ICON_MAP: Record<string, any> = {
  Shield,
  Lock,
  User,
  Hand,
  AlertTriangle,
};

export default function ResultScreen({ assessment, onRestart, onBack, lang }: ResultScreenProps) {
  const resultMode = MODES[assessment.result as ModeId];
  const ResultIcon = ICON_MAP[resultMode.icon] || Shield;
  const t = UI_TRANSLATIONS[lang];
  const modeT = resultMode.translations[lang];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-12"
      >
        <div className="flex items-center gap-4 mb-4">
          <Tooltip content={t.back}>
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
              aria-label={t.back}
            >
              <ChevronLeft size={20} />
            </button>
          </Tooltip>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">{t.results}</span>
            <h2 className="text-2xl font-bold text-slate-900 leading-tight">
              {t.resultsFor}: <span className="text-blue-600 underline underline-offset-4 decoration-blue-200">{assessment.activity}</span>
            </h2>
          </div>
        </div>

        {/* Major Result Card */}
        <div className="glass-card overflow-hidden p-10 md:p-14 shadow-2xl transition-all relative">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3 shrink-0"
              style={{ backgroundColor: resultMode.color }}
            >
              <ResultIcon size={40} />
            </div>

            <div className="flex-1">
              <div className="flex flex-col mb-6 text-left">
                <span className="badge w-fit mb-3" style={{ backgroundColor: `${resultMode.color}20`, color: resultMode.color }}>
                  {lang === 'en' ? 'Recommended Action' : 'अनुशंसित कार्रवाई'}
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight leading-none mb-3">
                  {resultMode.name}
                </h1>
                <p className="text-xl md:text-2xl font-bold text-slate-500 tracking-tight">
                  {modeT.title}
                </p>
              </div>
              
              <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mb-10 text-left">
                {modeT.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <Tooltip content={t.restart}>
                  <button 
                    onClick={onRestart}
                    className="btn-primary"
                    aria-label={t.restart}
                  >
                    <div className="flex items-center gap-2">
                      <RotateCcw size={18} />
                      {t.restart}
                    </div>
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-12 gap-8 mb-12">
        {/* Sidebar info */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="glass-card p-8 bg-white/40 text-left">
             <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 block">
               {lang === 'en' ? 'Current Activity' : 'वर्तमान कार्य'}
             </span>
             <p className="text-lg font-bold text-[#0f172a] mb-6">{assessment.activity}</p>
             <button onClick={onRestart} className="text-xs font-bold text-red-500 hover:text-red-400 uppercase tracking-widest">{t.reset}</button>
          </div>

          <div className="glass-card p-10 bg-white/40 text-left">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest mb-6">{t.navReference}</h3>
            <div className="space-y-4">
              {[4, 3, 2, 1, 0].map(id => (
                <div key={id} className="flex items-center gap-3">
                   <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: MODES[id as ModeId].color }} />
                   <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#0f172a]">
                        {lang === 'en' ? `Mode ${id}` : `मोड ${id}`}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">
                        {id === assessment.result ? (lang === 'en' ? 'Selected' : 'चयनित') : ''}
                      </span>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-8">
           <div className="glass-card p-10 md:p-14 text-left">
              <span className="badge bg-[#dcfce7] text-[#166534] mb-4 inline-block">{t.requirements}</span>
              <h2 className="text-3xl font-extrabold text-[#0f172a] mb-8 tracking-tight">{t.howToProceed}</h2>
              
              <div className="space-y-6">
                {modeT.requirements.map((req, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-1">
                      <Check size={14} className="text-green-600" strokeWidth={3} />
                    </div>
                    <p className="text-lg text-slate-600 font-medium leading-relaxed">{req}</p>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>

      {/* Decision Path */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card bg-slate-900 rounded-[2rem] p-8 text-white mb-12 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold tracking-tight">
            {lang === 'en' ? 'Decision Path Tracking' : 'निर्णय पथ ट्रैकिंग'}
          </h3>
          <span className="text-xs font-bold px-3 py-1 bg-white/10 rounded-full uppercase tracking-widest text-white/60">
            {lang === 'en' ? 'Logic History' : 'तर्क इतिहास'}
          </span>
        </div>
        
        <div className="space-y-6">
          {assessment.path.map((step, idx) => (
            <div key={idx} className="flex gap-4 relative">
              {idx !== assessment.path.length - 1 && (
                <div className="absolute left-3.5 top-8 bottom-[-24px] w-0.5 bg-white/10" />
              )}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 z-10 ${
                step.answer ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {step.answer ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              </div>
              <div className="flex-1 pb-4 text-left">
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1 block">{t.step} {idx + 1}</span>
                <p className="text-sm text-white/80 font-medium mb-1">{QUESTIONS[step.questionId].translations[lang].text}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-black uppercase tracking-widest ${
                    step.answer ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {step.answer ? t.yes : t.no}
                  </span>
                  <ChevronRight size={12} className="text-white/20" />
                </div>
              </div>
            </div>
          ))}
          <div className="flex gap-4 pt-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/40">
              <ResultIcon size={16} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1 block">
                {lang === 'en' ? 'Final Result' : 'अंतिम परिणाम'}
              </span>
              <p className="text-lg font-bold text-white">{resultMode.name} — {modeT.title}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
