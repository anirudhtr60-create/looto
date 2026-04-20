import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, Shield } from 'lucide-react';

interface LandingPageProps {
  onStart: (activity: string) => void;
}

const SUGGESTIONS = [
  'Machine maintenance',
  'Belt replacement',
  'Electrical work',
  'Deep cleaning',
  'Blade replacement'
];

export default function LandingPage({ onStart }: LandingPageProps) {
  const [activity, setActivity] = useState('');

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-left w-full max-w-2xl mb-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#0f172a] rounded-xl flex items-center justify-center">
            <Shield size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#0f172a] tracking-tight m-0 uppercase">LOTO DECISION TOOL</h1>
            <p className="text-xs text-slate-400 font-bold tracking-widest uppercase m-0 opacity-60">Enterprise Safety Systems</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-2xl glass-card p-10 md:p-14"
      >
        <div className="mb-8">
          <span className="badge bg-[#dcfce7] text-[#166534] mb-4 inline-block">Safety First</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] leading-tight mb-4 tracking-tight">
            Start a new safety assessment.
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed mb-10">
            Define the task you are evaluating to determine the appropriate safety lockout mode.
          </p>
          
          <label htmlFor="activity" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            What activity will you be performing?
          </label>
          <textarea
            id="activity"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            placeholder="e.g. Replacing conveyor belt, cleaning machine parts..."
            className="w-full px-5 py-4 rounded-xl bg-white border border-slate-200 focus:border-[#0f172a] focus:ring-4 focus:ring-slate-900/5 transition-all outline-none text-lg min-h-[120px] resize-none shadow-sm"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setActivity(suggestion)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-tight transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => activity.trim() && onStart(activity)}
            disabled={!activity.trim()}
            className="btn-primary flex items-center gap-2 group w-full md:w-auto justify-center"
          >
            Start Assessment
          </button>
        </div>
      </motion.div>
    </div>
  );
}
