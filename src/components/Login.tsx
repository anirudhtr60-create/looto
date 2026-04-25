import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, User, ArrowRight, X, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  onCancel: () => void;
  lang: 'en' | 'hi';
}

export default function Login({ onLogin, onCancel, lang }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username === 'Safety' && password === 'SafetyDepartment@32312') {
      onLogin();
    } else {
      setError(lang === 'en' ? 'Invalid credentials' : 'अमान्य क्रेडेंशियल');
    }
  };

  const t = {
    title: lang === 'en' ? 'Security Access' : 'सुरक्षा पहुंच',
    subtitle: lang === 'en' ? 'Protected Safety Sector' : 'संरक्षित सुरक्षा क्षेत्र',
    userLabel: lang === 'en' ? 'Username' : 'उपयोगकर्ता नाम',
    passLabel: lang === 'en' ? 'Password' : 'पासवर्ड',
    submit: lang === 'en' ? 'Unlock Access' : 'पहुंच अनलॉक करें',
    cancel: lang === 'en' ? 'Cancel' : 'रद्द करें',
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0f172a]/90 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative"
      >
        <button 
          onClick={onCancel}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-10 md:p-12">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-20 h-20 bg-[#16a34a] rounded-3xl flex items-center justify-center text-white shadow-xl shadow-green-500/20 mb-6">
              <Lock size={32} />
            </div>
            <h2 className="text-3xl font-display font-black text-[#0f172a] tracking-tighter mb-2">
              {t.title}
            </h2>
            <p className="text-slate-500 font-medium text-sm">
              {t.subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                {t.userLabel}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 font-bold text-slate-900 outline-none focus:border-[#16a34a] transition-all"
                  placeholder="Username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                {t.passLabel}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 font-bold text-slate-900 outline-none focus:border-[#16a34a] transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl text-sm font-bold"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}

            <button 
              type="submit"
              className="w-full h-16 bg-[#0f172a] text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-[#16a34a] transition-all shadow-xl shadow-slate-900/10"
            >
              {t.submit}
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
