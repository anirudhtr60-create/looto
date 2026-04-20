import { motion } from 'framer-motion';
import { ChevronRight, Shield, Hand, User, Lock, AlertTriangle } from 'lucide-react';
import { MODES } from '../constants';
import { ModeId, Language } from '../types';

const ICON_MAP: Record<string, any> = {
  Shield,
  Hand,
  User,
  Lock,
  AlertTriangle,
};

interface ModeReferenceProps {
  lang: Language;
}

export default function ModeReference({ lang }: ModeReferenceProps) {
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
        <p className="text-lg text-slate-600 max-w-2xl">
          {lang === 'en' 
            ? 'Detailed breakdown of all safety lockout modes and their specific requirements.' 
            : 'सभी सुरक्षा लॉकआउट मोड और उनकी विशिष्ट आवश्यकताओं का विस्तृत विवरण।'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {([4, 3, 2, 1, 0] as ModeId[]).map((id, index) => {
          const mode = MODES[id];
          const modeT = mode.translations[lang];
          
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/40 backdrop-blur-sm rounded-[24px] overflow-hidden border border-white/60 p-6 flex flex-col md:flex-row md:items-center justify-between group hover:bg-white/60 transition-all cursor-pointer shadow-sm gap-6"
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0" 
                  style={{ backgroundColor: mode.color }}
                >
                  <Hand size={24} />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-extrabold text-[#0f172a] uppercase tracking-tight">{mode.name}</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-1.5 h-1.5 rounded-full ${i <= (id) ? '' : 'opacity-20'}`}
                          style={{ backgroundColor: i <= (id) ? mode.color : '#cbd5e1' }}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-lg text-slate-800 font-bold tracking-tight">{modeT.title}</span>
                </div>
              </div>
              
              <div className="flex-1 max-w-xl text-sm text-slate-500 line-clamp-2">
                {modeT.description}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="flex gap-1">
                  {modeT.examples.slice(0, 1).map((ex, i) => (
                    <span key={i} className="px-3 py-1.5 bg-[#0f172a]/5 text-[#0f172a] rounded-lg text-[10px] font-bold uppercase tracking-tight whitespace-nowrap">
                      {ex}
                    </span>
                  ))}
                </div>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
