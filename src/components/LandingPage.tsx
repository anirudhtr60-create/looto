import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, ArrowRight, Sparkles, Search, Zap, Target, ClipboardCheck, Home, Lock } from 'lucide-react';
import { Language } from '../types';
import { UI_TRANSLATIONS } from '../constants';
import Tooltip from './Tooltip';

interface LandingPageProps {
  onStart: (activity: string) => void;
  lang: Language;
  onBack: () => void;
}

const SUGGESTIONS = {
  en: [
    'HVAC Filter Replacement',
    'Pump Seal Inspection',
    'Motor Bearing Lubrication',
    'Main Breaker Maintenance',
    'Conveyor Belt Tensioning',
    'Safety Valve Testing'
  ],
  hi: [
    'HVAC फ़िल्टर प्रतिस्थापन',
    'पंप सील निरीक्षण',
    'मोटर बेयरिंग स्नेहन',
    'मुख्य ब्रेकर रखरखाव',
    'कन्वेयर बेल्ट तनाव',
    'सुरक्षा वाल्व परीक्षण'
  ]
};

export default function LandingPage({ onStart, lang, onBack }: LandingPageProps) {
  const [activity, setActivity] = useState('');
  const t = UI_TRANSLATIONS[lang];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="max-w-5xl mx-auto py-16 px-6 text-left relative">
      {/* Background Floating Elements */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <motion.div 
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[10%] text-slate-100 opacity-20"
        >
          <Shield size={120} />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] left-[5%] text-slate-100 opacity-20"
        >
          <Shield size={80} />
        </motion.div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-16"
      >
        <header className="space-y-6">
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="px-5 py-2.5 bg-[#16a34a] text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg shadow-green-500/20 flex items-center gap-2">
                <Lock size={12} className="text-white/80" />
                {lang === 'en' ? 'Core Safety Service' : 'कोर सुरक्षा सेवा'}
              </div>
              <div className="w-px h-6 bg-slate-200 hidden md:block" />
              <button 
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 hover:border-slate-300 hover:shadow-sm transition-all group"
              >
                <Home size={14} className="group-hover:scale-110 transition-transform" />
                {lang === 'en' ? 'Home' : 'होम'}
              </button>
            </div>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-display font-black text-[#0f172a] leading-[0.85] tracking-tighter max-w-4xl">
            {lang === 'en' ? 'ASSESS THE' : 'आकलन करें'} <br/>
            <motion.span 
              animate={{ color: ['#16a34a', '#15803d', '#16a34a'] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-[#16a34a]"
            >
              {lang === 'en' ? 'RISK' : 'जोखिम'}
            </motion.span>
            <span className="text-slate-300 ml-4 font-normal">/</span>
            <span className="ml-4">{lang === 'en' ? 'SAVE LIVES' : 'जान बचाएं'}</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl leading-relaxed">
            {lang === 'en' 
              ? 'Our intelligent decision engine determines the precise lockout protocols required for your maintenance activities.' 
              : 'हमारा इंटेलिजेंट निर्णय इंजन आपकी रखरखाव गतिविधियों के लिए आवश्यक सटीक लॉकआउट प्रोटोकॉल निर्धारित करता है।'}
          </motion.p>
        </header>

        <motion.section variants={itemVariants} className="space-y-8">
          <div className="relative group">
            <motion.div 
              animate={{ scale: [1, 1.02, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 bg-green-500/5 blur-3xl group-focus-within:bg-green-500/10 transition-colors pointer-events-none rounded-full" 
            />
            <div className="relative">
              <div className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-300">
                <Search size={32} />
              </div>
              <input
                type="text"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                placeholder={lang === 'en' ? "Maintenance activity description..." : "रखरखाव गतिविधि विवरण..."}
                className="w-full h-24 md:h-28 bg-white border-2 border-slate-100 rounded-[2.5rem] pl-24 pr-12 text-2xl md:text-3xl font-display font-bold text-slate-900 placeholder:text-slate-200 transition-all focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none shadow-xl shadow-slate-900/5 group-hover:border-slate-200"
              />
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => activity.trim() && onStart(activity)}
                disabled={!activity.trim()}
                className="absolute right-4 top-1/2 -translate-y-1/2 px-10 h-16 md:h-20 bg-[#0f172a] text-white rounded-[1.8rem] font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-slate-900/40 disabled:opacity-30 disabled:pointer-events-none transition-all hover:bg-[#16a34a] hover:shadow-green-500/25"
              >
                {t.startAssessment}
                <ArrowRight size={20} />
              </motion.button>
            </div>
          </div>

          <div className="space-y-4 px-4 text-left">
            <div className="flex items-center gap-3">
              <Sparkles size={16} className="text-yellow-500" />
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{lang === 'en' ? 'Quick Suggestions' : 'त्वरित सुझाव'}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(SUGGESTIONS[lang] || []).map((suggestion, idx) => (
                <motion.button
                  key={suggestion}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + (idx * 0.05) }}
                  whileHover={{ y: -2, bg: '#0f172a', color: '#fff' }}
                  onClick={() => setActivity(suggestion)}
                  className="px-6 py-2.5 bg-slate-100/80 rounded-2xl text-xs font-bold text-slate-600 border border-white hover:border-slate-900 hover:shadow-lg transition-all"
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.footer variants={itemVariants} className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
            {[
              { icon: Zap, title: 'Real-time', desc: 'Instant safety clearance and protocols' },
              { icon: Target, title: 'Precision', desc: 'Site-specific machine intelligence' },
              { icon: ClipboardCheck, title: 'Compliant', desc: 'Fully aligned with global safety standards' },
            ].map((feature, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-[#16a34a] shrink-0">
                  <feature.icon size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-xs uppercase tracking-widest text-[#0f172a]">{feature.title}</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.footer>
      </motion.div>
    </div>
  );
}
