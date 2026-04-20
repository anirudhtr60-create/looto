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
import { AssessmentState, ModeId } from '../types';
import { MODES, QUESTIONS } from '../constants';

interface ResultScreenProps {
  assessment: AssessmentState;
  onRestart: () => void;
  onBack: () => void;
}

const ICON_MAP: Record<string, any> = {
  Shield,
  Lock,
  User,
  Hand,
  AlertTriangle,
};

export default function ResultScreen({ assessment, onRestart, onBack }: ResultScreenProps) {
  const resultMode = MODES[assessment.result as ModeId];
  const ResultIcon = ICON_MAP[resultMode.icon];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-12"
      >
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Assessment Result</span>
            <h2 className="text-2xl font-bold text-slate-900 leading-tight">
              Safety requirements for: <span className="text-blue-600 underline underline-offset-4 decoration-blue-200">{assessment.activity}</span>
            </h2>
          </div>
        </div>

        {/* Major Result Card */}
        <div className="glass-card overflow-hidden p-10 md:p-14 shadow-2xl transition-all relative">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3"
              style={{ backgroundColor: resultMode.color }}
            >
              <ResultIcon size={40} />
            </div>

            <div className="flex-1">
              <div className="flex flex-col mb-6">
                <span className="badge w-fit mb-3" style={{ backgroundColor: `${resultMode.color}20`, color: resultMode.color }}>
                  Recommended Action
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight leading-none mb-3">
                  {resultMode.name}
                </h1>
                <p className="text-xl md:text-2xl font-bold text-slate-500 tracking-tight">
                  {resultMode.title}
                </p>
              </div>
              
              <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mb-10">
                {resultMode.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <button 
                   onClick={onRestart}
                   className="btn-primary"
                >
                  <div className="flex items-center gap-2">
                    <RotateCcw size={18} />
                    New Assessment
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-12 gap-8 mb-12">
        {/* Sidebar info */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="glass-card p-8 bg-white/40">
             <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 block">Current Task</span>
             <p className="text-lg font-bold text-[#0f172a] mb-6">{assessment.activity}</p>
             <button onClick={onRestart} className="text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-widest">Reset Assessment</button>
          </div>

          <div className="glass-card p-10 bg-white/40">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest mb-6">Mode Reference</h3>
            <div className="space-y-4">
              {[4, 3, 2, 1, 0].map(id => (
                <div key={id} className="flex items-center gap-3">
                   <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: MODES[id as ModeId].color }} />
                   <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#0f172a]">Mode {id}</span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">{id === assessment.result ? 'Selected' : ''}</span>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-8">
           <div className="glass-card p-10 md:p-14">
              <span className="badge bg-[#dcfce7] text-[#166534] mb-4 inline-block">Requirements</span>
              <h2 className="text-3xl font-extrabold text-[#0f172a] mb-8 tracking-tight">How to proceed safely</h2>
              
              <div className="space-y-6">
                {resultMode.requirements.map((req, idx) => (
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
        className="glass-card-dark rounded-[2rem] p-8 text-white mb-12"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold tracking-tight">Decision Path Tracking</h3>
          <span className="text-xs font-bold px-3 py-1 bg-white/10 rounded-full uppercase tracking-widest text-white/60">Logic History</span>
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
              <div className="flex-1 pb-4">
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1 block">Question {idx + 1}</span>
                <p className="text-sm text-white/80 font-medium mb-1">{QUESTIONS[step.questionId].text}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-black uppercase tracking-widest ${
                    step.answer ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {step.answer ? '✅ YES' : '❌ NO'}
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
            <div className="flex-1">
              <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1 block">Final Result</span>
              <p className="text-lg font-bold text-white">{resultMode.name} — {resultMode.title}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
