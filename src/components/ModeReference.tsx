import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  User, 
  Hand, 
  AlertTriangle,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { MODES } from '../constants';
import { ModeId } from '../types';

const ICON_MAP: Record<string, any> = {
  Shield,
  Lock,
  User,
  Hand,
  AlertTriangle,
};

export default function ModeReference() {
  return (
    <div className="py-8 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          LOTO <span className="text-blue-600">Operations Reference</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          A comprehensive guide to the five operational modes of safety assessment. Understand each mode's requirements and application scenarios.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {([4, 3, 2, 1, 0] as ModeId[]).map((id, index) => {
          const mode = MODES[id];
          const ModeIcon = ICON_MAP[mode.icon];
          
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/40 backdrop-blur-sm rounded-[24px] overflow-hidden border border-white/60 p-6 flex items-center justify-between group hover:bg-white/60 transition-all cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-3 h-3 rounded-full shrink-0" 
                  style={{ backgroundColor: mode.color }}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-extrabold text-[#0f172a] uppercase tracking-tight">{mode.name}</span>
                  <span className="text-xs text-slate-400 font-semibold">{mode.title}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {mode.examples.slice(0, 1).map((ex, i) => (
                    <span key={i} className="px-2.5 py-1 bg-[#0f172a]/5 text-[#0f172a] rounded-lg text-[10px] font-bold uppercase tracking-tight">
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
