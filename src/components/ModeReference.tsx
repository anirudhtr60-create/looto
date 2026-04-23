import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Shield, Hand, User, Lock, AlertTriangle, BookOpen, ClipboardList, ShieldAlert, Check, ClipboardCheck, Info, ChevronDown } from 'lucide-react';
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
}

export default function ModeReference({ lang }: ModeReferenceProps) {
  const [expandedMode, setExpandedMode] = useState<ModeId | null>(null);

  return (
    <div className="py-8 px-4 text-left">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-[#0f172a] mb-2 tracking-tight">
          {lang === 'en' ? (
            <>LOTO <span className="text-blue-600">Operation Reference</span></>
          ) : (
            <>लोटो <span className="text-blue-600">संचालन संदर्भ</span></>
          )}
        </h1>
        <p className="text-lg text-slate-700 max-w-2xl font-medium">
          {lang === 'en' 
            ? 'Detailed breakdown of all safety lockout modes and their specific requirements.' 
            : 'सभी सुरक्षा लॉकआउट मोड और उनकी विशिष्ट आवश्यकताओं का विस्तृत विवरण।'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6" role="list">
        {([5, 4, 3, 2, 1, 0] as ModeId[]).map((id, index) => {
          const mode = MODES[id];
          const modeT = mode.translations[lang];
          
          const isExpanded = expandedMode === id;
          const ModeIcon = ICON_MAP[mode.icon] || Shield;
          
          return (
            <motion.article
              key={id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white/40 backdrop-blur-sm rounded-[24px] overflow-hidden border border-white/60 p-6 flex flex-col group transition-all shadow-sm gap-6 ${isExpanded ? 'bg-white/70 shadow-lg' : 'hover:bg-white/60'}`}
              aria-labelledby={`mode-title-${id}`}
            >
              <div 
                className="flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
                onClick={() => setExpandedMode(isExpanded ? null : id)}
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-4">
                  <Tooltip content={modeT.title}>
                    <div 
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0 transition-transform ${isExpanded ? 'scale-110' : 'group-hover:scale-110'}`} 
                      style={{ backgroundColor: mode.color }}
                      aria-hidden="true"
                    >
                      <ModeIcon size={24} />
                    </div>
                  </Tooltip>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-extrabold text-[#0f172a] uppercase tracking-tight">{mode.name}</span>
                      <Tooltip content={`${lang === 'en' ? 'Severity Level' : 'गंभीरता स्तर'}: ${id}/4`}>
                        <div className="flex gap-0.5 cursor-help" role="img" aria-label={`${lang === 'en' ? 'Severity level' : 'गंभीरता स्तर'}: ${id}`}>
                          {[...Array(5)].map((_, i) => (
                            <div 
                              key={i} 
                              className={`w-1.5 h-1.5 rounded-full ${i <= (id) ? '' : 'opacity-20'}`}
                              style={{ backgroundColor: i <= (id) ? mode.color : '#cbd5e1' }}
                            />
                          ))}
                        </div>
                      </Tooltip>
                    </div>
                    <span id={`mode-title-${id}`} className="text-lg text-slate-900 font-black tracking-tight">
                      <span className="text-blue-600">Mode {id}:</span> {modeT.title}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 max-w-xl text-sm text-slate-700 font-bold hidden md:line-clamp-2 md:block">
                  {modeT.description}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    className="text-slate-400 group-hover:text-slate-600"
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 border-t border-slate-200 mt-2">
                       {/* Full Description */}
                       <div className="mb-8 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-slate-700 font-bold leading-relaxed shadow-inner">
                         {modeT.description}
                       </div>
                       
                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div>
                            <div className="flex items-center gap-2 mb-4">
                              <ClipboardCheck className="text-green-600" size={18} />
                              <h4 className="text-xs font-black uppercase tracking-widest text-[#0f172a]">
                                {lang === 'en' ? 'Requirements' : 'आवश्यकताएं'}
                              </h4>
                            </div>
                            <div className="space-y-2">
                              {modeT.requirements.map((req, i) => (
                                <div key={i} className="flex gap-3 items-start bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                                  <Check className="text-green-600 shrink-0 mt-0.5" size={14} strokeWidth={4} />
                                  <p className="text-sm font-bold text-slate-700 leading-tight">{req}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-4">
                              <Info className="text-blue-600" size={18} />
                              <h4 className="text-xs font-black uppercase tracking-widest text-[#0f172a]">
                                {lang === 'en' ? 'Examples' : 'उदाहरण'}
                              </h4>
                            </div>
                            <div className="space-y-2">
                              {modeT.examples.map((ex, i) => (
                                <div key={i} className="flex gap-3 items-center bg-blue-50/30 p-3 rounded-xl border border-blue-100/50">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                  <p className="text-sm font-bold text-slate-700 leading-tight">{ex}</p>
                                </div>
                              ))}
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
