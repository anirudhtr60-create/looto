import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Shield, Hand, User, Lock, AlertTriangle, BookOpen, ClipboardList, ShieldAlert, Check, ClipboardCheck, Info, ChevronDown, ArrowLeft } from 'lucide-react';
import { MODES } from '../constants';
import { ModeId, Language } from '../types';
import Tooltip from './Tooltip';

const ICON_MAP: Record<string, any> = {
  Shield,
  ShieldAlert,
  Hand,
  User,
  Lock,
  AlertTriangle,
  BookOpen,
  ClipboardList,
};

interface ModeReferenceProps {
  lang: Language;
  onBack: () => void;
  isLoading?: boolean;
}

export default function ModeReference({ lang, onBack, isLoading }: ModeReferenceProps) {
  const [expandedMode, setExpandedMode] = useState<ModeId | null>(null);

  if (isLoading) {
    return (
      <div className="py-8 px-4 text-left">
        <div className="mb-12 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="w-full">
            <div className="h-10 w-64 bg-slate-200 rounded-lg animate-pulse mb-3" />
            <div className="h-6 w-96 bg-slate-100 rounded-lg animate-pulse" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3, 4, 5, 0].map((i) => (
            <div key={i} className="bg-white/40 rounded-[24px] border border-white/60 p-6 flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-xl animate-pulse shrink-0" />
                  <div className="flex flex-col gap-2">
                    <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                    <div className="h-6 w-48 bg-slate-100 rounded animate-pulse" />
                  </div>
                </div>
                <div className="flex-1 max-w-xl h-4 bg-slate-100 rounded animate-pulse hidden md:block" />
                <div className="w-5 h-5 bg-slate-200 rounded-full animate-pulse shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 text-left relative">
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-6xl font-display font-black text-[#0f172a] mb-4 tracking-tighter"
          >
            {lang === 'en' ? (
              <>LOTO <span className="text-[#16a34a]">REFERENCE</span></>
            ) : (
              <>लोटो <span className="text-[#16a34a]">संदर्भ सूची</span></>
            )}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 max-w-2xl font-medium leading-relaxed"
          >
            {lang === 'en' 
              ? 'Comprehensive safety architecture outlining all operational lockout modes and compliance mandates.' 
              : 'सभी परिचालन लॉकआउट मोड और अनुपालन जनादेशों को रेखांकित करने वाली व्यापक सुरक्षा संरचना।'}
          </motion.p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center gap-3 text-[#0f172a] font-black text-xs uppercase tracking-widest bg-white border border-slate-200 px-8 py-4 rounded-2xl w-fit shadow-lg shadow-slate-900/5 hover:border-[#16a34a] transition-all"
        >
          <ArrowLeft size={18} />
          {lang === 'en' ? 'Back to Portal' : 'पोर्टल पर वापस'}
        </motion.button>
      </div>
      
      <div className="grid grid-cols-1 gap-8" role="list">
        {([5, 4, 3, 2, 1, 0] as ModeId[]).map((id, index) => {
          const mode = MODES[id];
          if (!mode) return null;
          
          const modeT = mode.translations?.[lang] || mode.translations?.['en'];
          if (!modeT) return null;
          
          const isExpanded = expandedMode === id;
          const ModeIcon = ICON_MAP[mode.icon] || Shield;
          
          return (
            <motion.article
              key={id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`glass-card overflow-hidden group transition-all relative border-slate-100/50 ${isExpanded ? 'ring-2 ring-[#0f172a]/5 shadow-2xl bg-white' : 'hover:shadow-xl hover:shadow-slate-900/5'}`}
              aria-labelledby={`mode-title-${id}`}
            >
              <div 
                className="p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 cursor-pointer relative z-10"
                onClick={() => setExpandedMode(isExpanded ? null : id)}
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-6">
                  <Tooltip content={modeT.title}>
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-2xl shrink-0 transition-transform relative overflow-hidden" 
                      style={{ backgroundColor: mode.color }}
                      aria-hidden="true"
                    >
                      <ModeIcon size={32} />
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  </Tooltip>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-black text-[#0f172a] uppercase tracking-[0.25em]">{mode.name}</span>
                      <div className="flex gap-1" role="img" aria-label={`${lang === 'en' ? 'Severity level' : 'गंभीरता स्तर'}: ${id}`}>
                        {[...Array(6)].map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i <= id ? '' : 'opacity-10'}`}
                            style={{ 
                              backgroundColor: i <= id ? mode.color : '#cbd5e1',
                              transform: i <= id ? 'scale(1)' : 'scale(0.8)'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <h2 id={`mode-title-${id}`} className="text-2xl md:text-3xl font-display font-black tracking-tighter text-[#0f172a]">
                      <span className="opacity-20">{lang === 'en' ? 'Mode' : 'मोड'} {id === 5 ? '4' : id === 4 ? '4 (SOP)' : id}:</span> {modeT.title}
                    </h2>
                  </div>
                </div>
                
                <div className="flex-1 max-w-xl text-base text-slate-400 font-bold hidden md:line-clamp-2 md:block leading-relaxed">
                  {modeT.description}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    className={`w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center transition-colors ${isExpanded ? 'bg-[#0f172a] text-white' : 'text-slate-400 group-hover:text-[#0f172a] group-hover:border-[#0f172a]/20'}`}
                  >
                    <ChevronDown size={24} />
                  </motion.div>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-10 md:px-10 md:pb-12 border-t border-slate-50">
                       <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
                          <div className="lg:col-span-7 space-y-8">
                            <div className="p-8 bg-slate-50/80 rounded-[2.5rem] border border-slate-100/50">
                               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">
                                 {lang === 'en' ? 'Protocol Definition' : 'प्रोटोकॉल परिभाषा'}
                               </h4>
                               <p className="text-lg text-slate-700 font-bold leading-relaxed">{modeT.description}</p>
                            </div>

                            <div>
                              <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-green-50 rounded-xl text-green-600">
                                  <ClipboardCheck size={20} />
                                </div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-[#0f172a]">
                                  {lang === 'en' ? 'Core Requirements' : 'मुख्य आवश्यकताएं'}
                                </h4>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {(modeT.requirements || []).map((req, i) => (
                                  <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={i} 
                                    className="flex gap-4 items-start bg-white p-5 rounded-2xl border border-slate-100 group/item hover:border-green-500/30 transition-colors shadow-sm"
                                  >
                                    <div className="w-6 h-6 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-green-600 group-hover/item:text-white transition-all">
                                      <Check size={14} strokeWidth={4} />
                                    </div>
                                    <p className="text-sm font-bold text-slate-700 leading-snug">{req}</p>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="lg:col-span-5 space-y-8">
                             <div>
                                <div className="flex items-center gap-3 mb-6">
                                  <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                                    <Info size={20} />
                                  </div>
                                  <h4 className="text-xs font-black uppercase tracking-widest text-[#0f172a]">
                                    {lang === 'en' ? 'Operation Examples' : 'संचालन उदाहरण'}
                                  </h4>
                                </div>
                                <div className="space-y-3">
                                  {(modeT.examples || []).map((ex, i) => (
                                    <motion.div 
                                      initial={{ opacity: 0, x: 20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: i * 0.05 }}
                                      key={i} 
                                      className="flex gap-4 items-center bg-blue-50/20 p-5 rounded-2xl border border-blue-100/50 hover:bg-blue-50 transition-colors"
                                    >
                                      <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)] shrink-0" />
                                      <p className="text-sm font-bold text-slate-800 leading-tight">{ex}</p>
                                    </motion.div>
                                  ))}
                                </div>
                             </div>

                             <div className="relative p-8 bg-slate-900 rounded-[2.5rem] overflow-hidden text-white shadow-2xl">
                               <Shield className="absolute top-0 right-0 w-32 h-32 opacity-10 -translate-y-1/2 translate-x-1/2" />
                               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Safety Status</h4>
                               <p className="text-sm font-bold leading-relaxed mb-6">
                                 {lang === 'en' 
                                   ? 'Compliance with this mode is mandatory for all site activities matching this criteria.' 
                                   : 'इस मानदंड से मेल खाने वाली सभी साइट गतिविधियों के लिए इस मोड का अनुपालन अनिवार्य है।'}
                               </p>
                               <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-[#16a34a]">
                                 <Shield size={16} />
                                 Certified Standard
                               </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
