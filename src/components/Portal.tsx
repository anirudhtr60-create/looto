import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Shield, Truck, ClipboardList, HardHat, LogOut, LayoutGrid, ChevronRight, Activity, Users, ShieldCheck, Home } from 'lucide-react';
import { Language } from '../types';

interface ProjectCardProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  colorClass: string;
  stats?: string;
  status?: 'active' | 'certified' | 'high-risk';
  onClick: () => void;
  index: number;
}

function ProjectCard({ title, subtitle, icon, colorClass, stats, status, onClick, index }: ProjectCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      whileHover={{ y: -10, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col items-start text-left gap-8 transition-all hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] h-full w-full overflow-hidden"
    >
      {/* Decorative gradient corner */}
      <div className={`absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-10 transition-opacity blur-2xl -mr-10 -mt-10 ${colorClass}`} />
      
      <div className="flex justify-between w-full items-start">
        <div className={`w-20 h-20 rounded-3xl ${colorClass} flex items-center justify-center text-white shadow-[0_15px_30px_-10px] ${colorClass.replace('bg-', 'shadow-')}/40 group-hover:rotate-6 transition-transform duration-500`}>
          {icon}
        </div>
        {status && (
          <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border ${
            status === 'certified' ? 'bg-green-50 border-green-200 text-green-700' : 
            status === 'high-risk' ? 'bg-red-50 border-red-200 text-red-700' : 
            'bg-blue-50 border-blue-200 text-blue-700'
          }`}>
            {status}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 w-full">
        <h3 className="text-3xl font-display font-black tracking-tighter leading-none transition-colors group-hover:text-slate-900" style={{ color: '#0f172a' }}>
          {title}
        </h3>
        {subtitle && (
          <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-[90%]">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-auto w-full pt-8 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-[#0f172a] group-hover:text-white transition-all transform group-hover:translate-x-1">
          <ChevronRight size={18} />
        </div>
      </div>
    </motion.button>
  );
}

interface PortalProps {
  onSelectProject: (projectId: string) => void;
  lang: Language;
}

export default function Portal({ onSelectProject, lang }: PortalProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-x-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="fixed top-0 right-0 w-[50vw] h-[50vw] bg-green-100/30 blur-[120px] rounded-full -mr-40 -mt-40 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[40vw] h-[40vw] bg-blue-100/20 blur-[120px] rounded-full -ml-40 -mb-40 pointer-events-none" />

      {/* Primary Portal Header */}
      <header className="border-b border-white/10 px-8 h-20 flex items-center justify-start bg-white/60 backdrop-blur-xl sticky top-0 z-50 gap-8">
        <button 
          onClick={() => window.location.reload()}
          className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] hover:text-[#16a34a] transition-colors"
        >
          HOME
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-16 flex flex-col items-center relative z-10">
        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 w-full max-w-5xl">
          <ProjectCard 
            index={0}
            title="LOTO Decision Tool"
            subtitle="Automated safety assessment system for critical lockout/tagout operations."
            icon={<Shield size={40} strokeWidth={2.5} />}
            colorClass="bg-[#16a34a]"
            onClick={() => onSelectProject('loto')}
          />
          
          <ProjectCard 
            index={1}
            title="CONTRACTOR EVALUATION"
            subtitle="Industrial performance assessment and safety compliance monitoring for third-party contractors."
            icon={<ClipboardList size={40} strokeWidth={2.5} />}
            colorClass="bg-[#2563eb]"
            onClick={() => onSelectProject('contractor')}
          />
        </div>
      </main>
    </div>
  );
}

const BookOpen = ({ size, strokeWidth }: { size: number, strokeWidth: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);
