import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { Language } from '../types';
import { UI_TRANSLATIONS } from '../constants';
import Tooltip from './Tooltip';

interface LandingPageProps {
  onStart: (activity: string) => void;
  lang: Language;
}

const SUGGESTIONS = {
  en: [
    'Machine Maintenance',
    'Belt Replacement',
    'Electrical Work',
    'HVAC Filter Replacement',
    'Pump Seal Inspection',
    'Conveyor Deep Cleaning',
    'Blade Change'
  ],
  hi: [
    'मशीन रखरखाव',
    'बेल्ट बदलना',
    'विद्युत कार्य',
    'HVAC फ़िल्टर प्रतिस्थापन',
    'पंप सील निरीक्षण',
    'कन्वेयर गहरी सफाई',
    'ब्लेड बदलना'
  ]
};

export default function LandingPage({ onStart, lang }: LandingPageProps) {
  const [activity, setActivity] = useState('');
  const t = UI_TRANSLATIONS[lang];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] py-8 md:py-12 px-2 md:px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl"
      >
        <div className="flex items-center gap-4 mb-8 px-2">
          <div className="w-12 h-12 bg-[#0f172a] rounded-2xl flex items-center justify-center shadow-xl">
            <Shield size={28} className="text-white" />
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-black text-[#0f172a] tracking-tighter m-0 uppercase leading-none">{t.appTitle}</h2>
            <p className="text-xs text-slate-600 font-black tracking-[0.2em] uppercase m-0 mt-1">{t.aboutApp}</p>
          </div>
        </div>

        <div className="glass-card p-8 md:p-14 shadow-2xl relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-slate-900/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="mb-10 text-left relative z-10">
            <span className="badge bg-[#dcfce7] text-[#166534] mb-5 inline-block font-black tracking-widest text-[10px]">
              {lang === 'en' ? 'SAFETY FIRST' : 'सुरक्षा पहले'}
            </span>
            <h3 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] leading-[1.1] mb-6 tracking-tighter">
              {lang === 'en' ? 'Start a New Safety Assessment.' : 'एक नया सुरक्षा मूल्यांकन शुरू करें।'}
            </h3>
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed mb-10 font-medium">
              {lang === 'en' 
                ? 'Define the activity you are assessing to determine the appropriate safety lockout mode.' 
                : 'उचित सुरक्षा लॉकआउट मोड निर्धारित करने के लिए उस कार्य को परिभाषित करें जिसका आप मूल्यांकन कर रहे हैं।'}
            </p>
            
            <label htmlFor="activity" className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] mb-4">
              {lang === 'en' ? 'What activity will you perform?' : 'आप कौन सी गतिविधि करेंगे?'}
            </label>
            <textarea
              id="activity"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder={t.activityPlaceholder}
              aria-required="true"
              className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-[#0f172a] focus:bg-white transition-all outline-none text-xl min-h-[160px] resize-none shadow-inner placeholder-slate-400 font-bold"
            />
          </div>

          <div className="flex flex-col gap-8 pt-8 border-t border-slate-100 relative z-10">
            <div className="flex flex-wrap gap-2 justify-center md:justify-start" role="group" aria-label={lang === 'en' ? 'Activity suggestions' : 'गतिविधि सुझाव'}>
              {SUGGESTIONS[lang].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setActivity(suggestion)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 rounded-xl text-[11px] font-black uppercase tracking-tight transition-all focus-visible:ring-2 focus-visible:ring-slate-900 outline-none transform hover:-translate-y-0.5"
                  aria-label={`${lang === 'en' ? 'Use suggestion' : 'सुझाव का उपयोग करें'}: ${suggestion}`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
            
            <div className="flex justify-center md:justify-end">
              <Tooltip content={t.startAssessment}>
                <button
                  onClick={() => activity.trim() && onStart(activity)}
                  disabled={!activity.trim()}
                  className="btn-primary flex items-center gap-3 group w-full md:w-auto justify-center py-4 px-10 text-lg shadow-xl shadow-blue-600/20 disabled:shadow-none"
                  aria-label={t.startAssessment}
                >
                  {t.startAssessment}
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
