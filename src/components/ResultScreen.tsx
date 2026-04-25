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
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">{t.results}</h2>
            <h1 className="text-2xl md:text-3xl font-display font-black text-[#0f172a] leading-tight flex items-center gap-3">
              <span className="opacity-50 font-normal">{t.resultsFor}</span> 
              <span className="text-[#16a34a] tracking-tight">{assessment.activity}</span>
            </h1>
          </div>
        </div>

        {/* Major Result Card */}
        <motion.section 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card overflow-hidden p-10 md:p-14 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.06)] relative bg-white border-slate-100/50" 
          aria-labelledby="result-title"
        >
          {/* Decorative background glow based on result color */}
          <div 
            className="absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-10 -translate-y-1/2 translate-x-1/2 rounded-full"
            style={{ backgroundColor: resultMode.color }}
          />
          
          <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
            <motion.div 
              initial={{ rotate: -15, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 3, scale: 1, opacity: 1 }}
              transition={{ type: 'spring', bounce: 0.4, duration: 0.8, delay: 0.3 }}
              className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shrink-0 cursor-help relative group"
              style={{ backgroundColor: resultMode.color }}
              aria-hidden="true"
            >
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ duration: 3, repeat: Infinity }}
              >
                <ResultIcon size={56} className="md:w-14 md:h-14" />
              </motion.div>
              <div className="absolute inset-0 bg-white/20 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity blur-[2px]" />
            </motion.div>

            <div className="flex-1">
              <div className="flex flex-col mb-8 text-left">
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="badge w-fit mb-4" 
                  style={{ backgroundColor: `${resultMode.color}20`, color: resultMode.color }}
                >
                  {lang === 'en' ? 'Protocol Issued' : 'प्रोटोकॉल जारी'}
                </motion.span>
                <h2 id="result-title" className="text-4xl md:text-6xl font-display font-black text-[#0f172a] tracking-tighter leading-none mb-4">
                  <span className="opacity-20">{lang === 'en' ? 'Mode' : 'मोड'} {resultMode.id === 5 ? '4' : resultMode.id === 4 ? '4 (SOP)' : resultMode.id}:</span> {resultMode.name}
                </h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-xl md:text-3xl font-black text-[#16a34a] tracking-tight"
                >
                  {modeT.title}
                </motion.p>
              </div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-lg md:text-xl text-slate-500 font-bold leading-relaxed max-w-2xl mb-12 text-left"
              >
                {modeT.description}
              </motion.p>

              <div className="flex flex-wrap gap-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onRestart}
                  className="px-8 py-4 bg-[#0f172a] text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-slate-900/30 hover:bg-[#16a34a] transition-all"
                  aria-label={t.restart}
                >
                  <RotateCcw size={20} aria-hidden="true" />
                  {t.restart}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Sidebar info */}
        <div className="lg:col-span-4 flex flex-col gap-8 order-2 lg:order-1">
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-card p-8 bg-white/40 text-left border-l-4 border-[#16a34a] shadow-xl overflow-hidden relative" 
            aria-label={lang === 'en' ? 'Assessment summary' : 'मूल्यांकन सारांश'}
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#16a34a]/5 blur-2xl -translate-y-1/2 translate-x-1/2 rounded-full" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
               {lang === 'en' ? 'Current Activity' : 'वर्तमान कार्य'}
             </span>
             <p className="text-2xl font-display font-black text-[#0f172a] mb-8 leading-tight relative z-10">{assessment.activity}</p>
             <button onClick={onRestart} className="text-[10px] font-black text-[#065f46] hover:text-white uppercase tracking-widest px-6 py-2 bg-green-50 hover:bg-[#16a34a] rounded-full focus-visible:ring-2 focus-visible:ring-[#16a34a] outline-none transition-all relative z-10">{t.reset}</button>
          </motion.aside>

          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="glass-card p-10 bg-white/40 text-left relative overflow-hidden" 
            aria-label={lang === 'en' ? 'Mode legend' : 'मोड लेजेंड'}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-100 blur-2xl -translate-y-1/2 translate-x-1/2 rounded-full" />
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-10">{t.navReference}</h3>
            <div className="space-y-8">
              {[5, 4, 3, 2, 1, 0].map((id, i) => {
                const mode = MODES[id as ModeId];
                if (!mode) return null;
                const isActive = id === assessment.result;
                return (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + (i * 0.1) }}
                    key={id} 
                    className={`flex items-center gap-5 transition-all ${isActive ? 'scale-110 origin-left translate-x-2' : 'opacity-40 grayscale hover:opacity-100 hover:grayscale-0'}`}
                  >
                    <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: mode.color }} aria-hidden="true" />
                    <div className="flex flex-col">
                        <span className={`text-xs font-black tracking-widest uppercase ${isActive ? 'text-[#0f172a]' : 'text-slate-500'}`}>
                          {lang === 'en' ? `Mode ${id === 5 ? '4' : id === 4 ? '4 (SOP)' : id}` : `मोड ${id === 5 ? '4' : id === 4 ? '4 (SOP)' : id}`}
                        </span>
                        {isActive && (
                          <span className="text-[9px] text-[#16a34a] font-black uppercase tracking-tighter mt-1">
                            {lang === 'en' ? 'ACTIVE SELECTION' : 'सक्रिय चयन'}
                          </span>
                        )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.aside>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-8 order-1 lg:order-2 space-y-8">
            <motion.article 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card p-10 md:p-14 text-left shadow-2xl bg-white/70 relative border-slate-100"
            >
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-[#16a34a]">
                <CheckCircle2 size={240} />
              </div>
              <div className="relative z-10">
                <span className="badge bg-green-50 text-green-700 border border-green-100 mb-6 inline-block font-black text-[10px] tracking-widest uppercase">{t.requirements}</span>
                <h2 className="text-4xl md:text-5xl font-display font-black text-[#0f172a] mb-12 tracking-tighter leading-none">{t.howToProceed}</h2>
                
                <div className="space-y-10">
                  {(modeT.requirements || []).map((req, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + (idx * 0.1) }}
                      key={idx} 
                      className="flex gap-6 items-start group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-green-50 text-green-700 flex items-center justify-center shrink-0 mt-1 shadow-sm transition-all group-hover:bg-[#16a34a] group-hover:text-white group-hover:scale-110 border border-green-100" aria-hidden="true">
                        <Check size={20} strokeWidth={4} />
                      </div>
                      <div className="flex-1">
                         {modeT.requirementTooltips && modeT.requirementTooltips[idx] ? (
                           <Tooltip content={modeT.requirementTooltips[idx]}>
                             <p className="text-xl md:text-2xl text-slate-800 font-bold leading-tight cursor-help border-b border-dotted border-slate-300 inline-block decoration-green-500/30">
                               {req}
                             </p>
                           </Tooltip>
                         ) : (
                           <p className="text-xl md:text-2xl text-slate-800 font-bold leading-tight">{req}</p>
                         )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
           </motion.article>

           {assessment.result === 5 && (
             <motion.article 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="glass-card p-10 md:p-14 text-left shadow-2xl bg-gradient-to-br from-red-50 to-white relative overflow-hidden border-red-100"
             >
               <div className="absolute top-0 right-0 p-12 opacity-[0.05] text-red-600">
                 <ShieldAlert size={200} />
               </div>
               <div className="relative z-10">
                 <span className="badge bg-red-600 text-white mb-6 inline-block font-black text-[10px] tracking-widest uppercase shadow-lg shadow-red-200">
                   {lang === 'en' ? 'Critical Control' : 'गंभीर नियंत्रण'}
                 </span>
                 <h3 className="text-4xl font-display font-black text-[#0f172a] mb-12 tracking-tighter leading-none">
                   {lang === 'en' ? 'Permit Management Protocol' : 'परमिट प्रबंधन प्रोटोकॉल'}
                 </h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-6">
                     <h4 className="text-xs font-black text-red-600 uppercase tracking-widest flex items-center gap-3">
                       <User size={20} className="p-1 bg-red-50 rounded-lg" />
                       {lang === 'en' ? 'Authorized Personnel' : 'अधिकृत कर्मचारी'}
                     </h4>
                     <ul className="space-y-4">
                       {[
                         lang === 'en' ? 'Mandatory PTW Training' : 'अनिवार्य PTW प्रशिक्षण',
                         lang === 'en' ? 'Certified SME Supervision' : 'प्रमाणित SME पर्यवेक्षण',
                         lang === 'en' ? 'Clear role assignment' : 'स्पष्ट भूमिका असाइनमेंट'
                       ].map((item, i) => (
                         <li key={i} className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                           <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                           {item}
                         </li>
                       ))}
                     </ul>
                   </div>
                   <div className="space-y-6">
                     <h4 className="text-xs font-black text-red-600 uppercase tracking-widest flex items-center gap-3">
                       <ClipboardList size={20} className="p-1 bg-red-50 rounded-lg" />
                       {lang === 'en' ? 'Safety Documentation' : 'सुरक्षा दस्तावेज़ीकरण'}
                     </h4>
                     <ul className="space-y-4">
                       {[
                         lang === 'en' ? 'Approved JHA/Risk Assessment' : 'अनुमोदित JHA/जोखिम मूल्यांकन',
                         lang === 'en' ? 'Active Permit Document' : 'सक्रिय परमिट दस्तावेज़',
                         lang === 'en' ? 'Rescue Plan verification' : 'बचाव योजना सत्यापन'
                       ].map((item, i) => (
                         <li key={i} className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                           <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                           {item}
                         </li>
                       ))}
                     </ul>
                   </div>
                 </div>

                 <div className="mt-12 flex flex-wrap gap-4 pt-10 border-t border-red-100">
                   <motion.button 
                     whileHover={{ scale: 1.05, bg: '#991b1b' }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => window.print()}
                     className="flex items-center gap-3 px-8 py-4 bg-red-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-red-200 transition-all"
                   >
                     <ClipboardList size={20} />
                     {lang === 'en' ? 'Print Work Permit' : 'कार्य परमिट प्रिंट करें'}
                   </motion.button>
                   <div className="flex items-center gap-4 px-8 py-4 bg-white border-2 border-red-50 rounded-[1.5rem] text-red-900 font-black text-[10px] uppercase tracking-[0.2em] shadow-sm">
                     <ShieldAlert size={20} className="text-red-600 animate-pulse" />
                     {lang === 'en' ? 'Strict Compliance Required' : 'सख्त अनुपालन आवश्यक'}
                   </div>
                 </div>
               </div>
             </motion.article>
           )}

           <motion.article 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-10 md:p-14 text-left shadow-2xl bg-white/70 relative border-slate-100"
            >
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-blue-600">
                <BookOpen size={240} />
              </div>
              <div className="relative z-10">
                <span className="badge bg-blue-50 text-blue-700 border border-blue-100 mb-6 inline-block font-black text-[10px] tracking-widest uppercase">
                  {lang === 'en' ? 'Field Context' : 'क्षेत्र संदर्भ'}
                </span>
                <h3 className="text-4xl font-display font-black text-[#0f172a] mb-12 tracking-tighter leading-none">
                  {lang === 'en' ? 'Application Scenarios' : 'अनुप्रयोग परिदृश्य'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(modeT.examples || []).map((ex, idx) => (
                    <motion.div 
                      key={idx} 
                      whileHover={{ y: -5, borderColor: '#3b82f6' }}
                      className="flex gap-5 items-center p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all group"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors" aria-hidden="true">
                        <Hand size={20} />
                      </div>
                      <p className="text-base md:text-lg text-slate-800 font-bold leading-tight">{ex}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
           </motion.article>
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
