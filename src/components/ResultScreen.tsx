import { motion } from 'framer-motion';
import { 
  Shield, 
  RotateCcw, 
  ChevronLeft, 
  CheckCircle2, 
  XCircle,
  ClipboardList,
  ShieldAlert,
  AlertTriangle,
  Lock,
  User,
  Hand,
  Check,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { AssessmentState, ModeId, Language } from '../types';
import { MODES, QUESTIONS, UI_TRANSLATIONS } from '../constants';
import Tooltip from './Tooltip';

interface ResultScreenProps {
  assessment: AssessmentState;
  onRestart: () => void;
  onBack: () => void;
  onExit: () => void;
  lang: Language;
}

const ICON_MAP: Record<string, any> = {
  Shield,
  ShieldAlert,
  Lock,
  User,
  Hand,
  AlertTriangle,
  BookOpen,
  ClipboardList,
};

export default function ResultScreen({ assessment, onRestart, onBack, onExit, lang }: ResultScreenProps) {
  const resultMode = MODES[assessment.result as ModeId];
  
  if (!resultMode) {
    return (
      <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-200">
        <p className="text-red-600 font-bold">Error: Invalid mode encountered ({assessment.result})</p>
        <button onClick={onRestart} className="mt-4 btn-primary">{UI_TRANSLATIONS[lang]?.restart || 'Restart'}</button>
      </div>
    );
  }

  const ResultIcon = ICON_MAP[resultMode.icon] || Shield;
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS['en'];
  const modeT = resultMode.translations?.[lang] || resultMode.translations?.['en'];

  if (!modeT) {
    return (
      <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-200">
        <p className="text-red-600 font-bold">Error: Translation missing for mode {resultMode.id}</p>
        <button onClick={onRestart} className="mt-4 btn-primary">{t.restart}</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-start mb-6">
        <button 
          onClick={onExit}
          className="flex items-center gap-1 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-slate-900 transition-colors w-fit transition-all hover:-translate-x-1"
        >
          <ChevronLeft size={16} />
          {lang === 'en' ? 'Back to Portal' : 'पोर्टल पर वापस'}
        </button>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-12"
      >
        <div className="flex items-center gap-4 mb-4">
          <Tooltip content={t.back}>
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600 focus-visible:ring-2 focus-visible:ring-blue-600 outline-none"
              aria-label={t.back}
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
          </Tooltip>
          <div>
            <h2 className="text-xs font-bold text-slate-600 uppercase tracking-widest block">{t.results}</h2>
            <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">
              {t.resultsFor}: <span className="text-blue-600 underline underline-offset-4 decoration-blue-200">{assessment.activity}</span>
            </h1>
          </div>
        </div>

        {/* Major Result Card */}
        <section className="glass-card overflow-hidden p-10 md:p-14 shadow-2xl transition-all relative" aria-labelledby="result-title">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <Tooltip content={modeT.title}>
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3 shrink-0 cursor-help"
                style={{ backgroundColor: resultMode.color }}
                aria-hidden="true"
              >
                <ResultIcon size={40} />
              </div>
            </Tooltip>

            <div className="flex-1">
              <div className="flex flex-col mb-6 text-left">
                <span className="badge w-fit mb-3" style={{ backgroundColor: `${resultMode.color}20`, color: resultMode.color }}>
                  {lang === 'en' ? 'Recommended Action' : 'अनुशंसित कार्रवाई'}
                </span>
                <h2 id="result-title" className="text-4xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight leading-none mb-3 flex items-center gap-4">
                  <span className="text-blue-600">Mode {resultMode.id}:</span> {resultMode.name}
                </h2>
                <p className="text-xl md:text-2xl font-black text-slate-600 tracking-tight">
                  {modeT.title}
                </p>
              </div>
              
              <p className="text-lg text-slate-700 font-medium leading-relaxed max-w-2xl mb-10 text-left">
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
                      <RotateCcw size={18} aria-hidden="true" />
                      {t.restart}
                    </div>
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        </section>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Sidebar info */}
        <div className="lg:col-span-4 flex flex-col gap-6 order-2 lg:order-1">
          <aside className="glass-card p-6 md:p-8 bg-white/40 text-left border-l-4 border-blue-500 shadow-lg" aria-label={lang === 'en' ? 'Assessment summary' : 'मूल्यांकन सारांश'}>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">
               {lang === 'en' ? 'Current Activity' : 'वर्तमान कार्य'}
             </span>
             <p className="text-xl font-black text-[#0f172a] mb-6 leading-tight">{assessment.activity}</p>
             <button onClick={onRestart} className="text-xs font-black text-red-600 hover:text-red-700 uppercase tracking-widest p-2 bg-red-50 rounded-lg focus-visible:ring-2 focus-visible:ring-red-600 outline-none w-full md:w-auto transition-colors">{t.reset}</button>
          </aside>

          <aside className="glass-card p-8 bg-white/40 text-left" aria-label={lang === 'en' ? 'Mode legend' : 'मोड लेजेंड'}>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-8">{t.navReference}</h3>
            <div className="space-y-6">
              {[5, 4, 3, 2, 1, 0].map(id => {
                const mode = MODES[id as ModeId];
                if (!mode) return null;
                return (
                  <div key={id} className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: mode.color }} aria-hidden="true" />
                    <div className="flex flex-col">
                        <span className="text-xs font-black text-[#0f172a] uppercase tracking-wider">
                          {lang === 'en' ? `Mode ${id}` : `मोड ${id}`}
                        </span>
                        {id === assessment.result && (
                          <span className="text-[9px] text-blue-600 font-black uppercase tracking-tighter mt-0.5">
                            {lang === 'en' ? 'ACTIVE SELECTION' : 'सक्रिय चयन'}
                          </span>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-8 order-1 lg:order-2">
            <article className="glass-card p-8 md:p-14 text-left shadow-2xl bg-white/60 relative mb-8">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <CheckCircle2 size={120} />
              </div>
              <span className="badge bg-[#dcfce7] text-[#166534] mb-6 inline-block font-black text-[10px] tracking-widest uppercase">{t.requirements}</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] mb-10 tracking-tighter leading-none">{t.howToProceed}</h2>
              
              <div className="space-y-8">
                {(modeT.requirements || []).map((req, idx) => (
                  <div key={idx} className="flex gap-5 items-start group">
                    <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center shrink-0 mt-1 shadow-sm transition-transform group-hover:scale-110" aria-hidden="true">
                      <Check size={16} className="text-green-700" strokeWidth={4} />
                    </div>
                    <div className="flex-1">
                       {modeT.requirementTooltips && modeT.requirementTooltips[idx] ? (
                         <Tooltip content={modeT.requirementTooltips[idx]}>
                           <p className="text-lg md:text-xl text-slate-800 font-bold leading-relaxed cursor-help border-b border-dotted border-slate-300 inline-block decoration-green-500/30">
                             {req}
                           </p>
                         </Tooltip>
                       ) : (
                         <p className="text-lg md:text-xl text-slate-800 font-bold leading-relaxed">{req}</p>
                       )}
                    </div>
                  </div>
                ))}
              </div>
           </article>

           {assessment.result === 5 && (
             <article className="glass-card p-8 md:p-14 text-left shadow-2xl bg-gradient-to-br from-red-50 to-white relative mb-8 border-red-200">
               <div className="absolute top-0 right-0 p-8 opacity-10 text-red-600">
                 <Shield size={120} />
               </div>
               <span className="badge bg-red-600 text-white mb-6 inline-block font-black text-[10px] tracking-widest uppercase">
                 {lang === 'en' ? 'Critical Control' : 'गंभीर नियंत्रण'}
               </span>
               <h3 className="text-3xl md:text-4xl font-extrabold text-red-900 mb-10 tracking-tighter leading-none">
                 {lang === 'en' ? 'Permit Management Protocol' : 'परमिट प्रबंधन प्रोटोकॉल'}
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                   <h4 className="text-sm font-black text-red-800 uppercase tracking-widest flex items-center gap-2">
                     <User size={18} />
                     {lang === 'en' ? 'Authorized Personnel' : 'अधिकृत कर्मचारी'}
                   </h4>
                   <ul className="space-y-2 text-slate-700 font-bold">
                     <li>• {lang === 'en' ? 'Mandatory PTW Training' : 'अनिवार्य PTW प्रशिक्षण'}</li>
                     <li>• {lang === 'en' ? 'Certified SME Supervision' : 'प्रमाणित SME पर्यवेक्षण'}</li>
                     <li>• {lang === 'en' ? 'Clear role assignment' : 'स्पष्ट भूमिका असाइनमेंट'}</li>
                   </ul>
                 </div>
                 <div className="space-y-4">
                   <h4 className="text-sm font-black text-red-800 uppercase tracking-widest flex items-center gap-2">
                     <ClipboardList size={18} />
                     {lang === 'en' ? 'Safety Documentation' : 'सुरक्षा दस्तावेज़ीकरण'}
                   </h4>
                   <ul className="space-y-2 text-slate-700 font-bold">
                     <li>• {lang === 'en' ? 'Approved JHA/Risk Assessment' : 'अनुमोदित JHA/जोखिम मूल्यांकन'}</li>
                     <li>• {lang === 'en' ? 'Active Permit Document' : 'सक्रिय परमिट दस्तावेज़'}</li>
                     <li>• {lang === 'en' ? 'Rescue Plan verification' : 'बचाव योजना सत्यापन'}</li>
                   </ul>
                 </div>
               </div>

               <div className="mt-10 flex flex-wrap gap-4 pt-8 border-t border-red-100">
                 <button 
                   onClick={() => window.print()}
                   className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 transition-colors"
                 >
                   <ClipboardList size={18} />
                   {lang === 'en' ? 'Print Work Permit' : 'कार्य परमिट प्रिंट करें'}
                 </button>
                 <div className="flex items-center gap-3 px-6 py-3 bg-white border border-red-100 rounded-xl text-red-900 font-bold text-xs uppercase tracking-widest">
                   <Shield size={18} className="text-red-600" />
                   {lang === 'en' ? 'Strict Compliance Required' : 'सख्त अनुपालन आवश्यक'}
                 </div>
               </div>
             </article>
           )}

           <article className="glass-card p-8 md:p-14 text-left shadow-2xl bg-white/60 relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <BookOpen size={120} />
              </div>
              <span className="badge bg-blue-100 text-blue-800 mb-6 inline-block font-black text-[10px] tracking-widest uppercase">
                {lang === 'en' ? 'Task Examples' : 'कार्य के उदाहरण'}
              </span>
              <h3 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] mb-10 tracking-tighter leading-none">
                {lang === 'en' ? 'When to use this mode' : 'इस मोड का उपयोग कब करें'}
              </h3>
              
              <div className="space-y-6">
                {(modeT.examples || []).map((ex, idx) => (
                  <div key={idx} className="flex gap-5 items-center p-5 bg-white/40 rounded-[1.5rem] border border-white/60 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] shrink-0" aria-hidden="true" />
                    <p className="text-lg text-slate-800 font-bold leading-tight">{ex}</p>
                  </div>
                ))}
              </div>
           </article>
        </div>
      </div>

      {/* Decision Path */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card bg-slate-900 rounded-[2rem] p-10 text-white mb-12 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-2xl font-extrabold tracking-tight">
            {lang === 'en' ? 'Decision Path Tracking' : 'निर्णय पथ ट्रैकिंग'}
          </h3>
          <span className="text-[10px] font-black px-4 py-1.5 bg-white/10 rounded-lg uppercase tracking-[0.2em] text-white/70">
            {lang === 'en' ? 'Logic History' : 'तर्क इतिहास'}
          </span>
        </div>
        
        <div className="space-y-8">
          {(assessment.path || []).map((step, idx) => (
            <div key={idx} className="flex gap-6 relative">
              {idx !== assessment.path.length - 1 && (
                <div className="absolute left-[15px] top-10 bottom-[-32px] w-0.5 bg-white/10" aria-hidden="true" />
              )}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 z-10 shadow-lg ${
                step.answer ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`} aria-hidden="true">
                {step.answer ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
              </div>
              <div className="flex-1 pb-4 text-left">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.1em] mb-2 block">{t.step} {idx + 1}</span>
                {QUESTIONS[step.questionId] ? (
                  <Tooltip content={QUESTIONS[step.questionId].translations?.[lang]?.helperText || QUESTIONS[step.questionId].translations?.['en']?.helperText}>
                    <p className="text-lg text-white font-bold mb-2 leading-snug cursor-help border-b border-dotted border-white/20 inline-block">
                      {QUESTIONS[step.questionId].translations?.[lang]?.text || QUESTIONS[step.questionId].translations?.['en']?.text}
                    </p>
                  </Tooltip>
                ) : (
                  <p className="text-lg text-white/60 italic mb-2 leading-snug">Question data unavailable</p>
                )}
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-black uppercase tracking-widest ${
                    step.answer ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {step.answer ? t.yes : t.no}
                  </span>
                  <ChevronRight size={14} className="text-white/20" aria-hidden="true" />
                </div>
              </div>
            </div>
          ))}
          <div className="flex gap-6 pt-4 items-center">
            <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/40" aria-hidden="true">
              <ResultIcon size={20} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1 block">
                {lang === 'en' ? 'Final Result' : 'अंतिम परिणाम'}
              </span>
              <p className="text-xl font-black text-white leading-none">{resultMode.name} — <span className="text-blue-100/70">{modeT.title}</span></p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
