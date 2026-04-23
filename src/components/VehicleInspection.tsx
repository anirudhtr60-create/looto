import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, CheckCircle2, ChevronLeft, Save, ShieldCheck, ClipboardCheck, ArrowRight, Activity, Gauge } from 'lucide-react';
import { Language } from '../types';

interface VehicleInspectionProps {
  onBack: () => void;
  lang: Language;
}

export default function VehicleInspection({ onBack, lang }: VehicleInspectionProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    vehicleNo: '',
    driverName: '',
    inspectionType: 'Own',
    checks: {
      brakes: false,
      lights: false,
      tires: false,
      engine: false,
      cleanliness: false,
    }
  });

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  return (
    <div className="max-w-5xl mx-auto py-16 px-6 min-h-screen text-left">
      <header className="mb-16 flex flex-col md:flex-row items-center justify-between gap-8 py-6 border-b border-slate-100">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="p-3 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:text-slate-900 transition-all shadow-sm flex items-center justify-center group"
          >
            <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <Truck size={18} className="text-[#2563eb]" />
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Fleet Management</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-black text-slate-900 tracking-tighter uppercase leading-none">Vehicle Inspection</h2>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-100/80 p-2 rounded-2xl border border-white shadow-inner">
          {[1, 2, 3].map((s) => (
            <div 
              key={s}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                step === s ? 'bg-[#2563eb] text-white shadow-lg' : 
                step > s ? 'bg-green-500 text-white' : 'bg-white text-slate-300'
              }`}
            >
              {step > s ? <CheckCircle2 size={16} /> : s}
            </div>
          ))}
        </div>
      </header>

      <main className="relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">
                    <Gauge size={14} />
                    Vehicle Registration Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Vehicle No (e.g., MH 12 AB 1234)"
                    className="w-full h-20 bg-white border-2 border-slate-100 rounded-[2rem] px-8 text-xl md:text-2xl font-bold text-slate-900 placeholder:text-slate-200 outline-none focus:border-[#2563eb] transition-all shadow-xl shadow-slate-900/5 focus:ring-4 focus:ring-blue-500/10"
                    value={formData.vehicleNo}
                    onChange={(e) => setFormData({...formData, vehicleNo: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">
                     <Activity size={14} />
                     Driver Information
                  </label>
                  <input
                    type="text"
                    placeholder="Full Name of the Driver"
                    className="w-full h-20 bg-white border-2 border-slate-100 rounded-[2rem] px-8 text-xl md:text-2xl font-bold text-slate-900 placeholder:text-slate-200 outline-none focus:border-[#2563eb] transition-all shadow-xl shadow-slate-900/5 focus:ring-4 focus:ring-blue-500/10"
                    value={formData.driverName}
                    onChange={(e) => setFormData({...formData, driverName: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Source Selection</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['Own', 'Hired'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormData({...formData, inspectionType: type})}
                      className={`h-24 rounded-[2rem] border-2 transition-all flex items-center px-10 gap-6 ${
                        formData.inspectionType === type 
                        ? 'border-[#2563eb] bg-blue-50/50 shadow-xl shadow-blue-500/5' 
                        : 'border-slate-100 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        formData.inspectionType === type ? 'border-[#2563eb] bg-[#2563eb]' : 'border-slate-200'
                      }`}>
                        {formData.inspectionType === type && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <span className={`text-xl font-black uppercase tracking-tight ${
                        formData.inspectionType === type ? 'text-[#2563eb]' : 'text-slate-400'
                      }`}>
                        {type} Vehicle
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[#2563eb]/10 rounded-2xl flex items-center justify-center text-[#2563eb]">
                  <ShieldCheck size={28} />
                </div>
                <div>
                   <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">Technical Safety Checks</h3>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Verify all mechanical components</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(formData.checks).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setFormData({
                      ...formData,
                      checks: { ...formData.checks, [key]: !val }
                    })}
                    className={`p-8 rounded-[2rem] border-2 flex items-center justify-between transition-all group ${
                      val 
                      ? 'bg-green-50 border-green-500 shadow-lg shadow-green-500/5' 
                      : 'bg-white border-slate-100 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <span className={`text-xl font-bold uppercase tracking-tight transition-colors ${
                      val ? 'text-green-700' : 'text-slate-600'
                    }`}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      val ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-300'
                    }`}>
                      <CheckCircle2 size={24} />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 px-8 bg-white border-2 border-slate-100 rounded-[4rem] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-2 bg-green-500" />
              <div className="w-24 h-24 bg-green-500 text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-green-500/40">
                <ClipboardCheck size={48} />
              </div>
              <h3 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tight mb-6 uppercase">Ready to Submit</h3>
              <p className="text-xl text-slate-500 font-medium max-w-lg mx-auto mb-16">
                All safety parameters have been cross-verified. Securely log this inspection to the fleet database.
              </p>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                 <button className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#0f172a] text-white px-12 py-6 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-slate-900/40 hover:bg-slate-800 transition-all active:scale-95 group">
                    <Save size={20} className="group-hover:rotate-12 transition-transform" />
                    Finalize Entry
                 </button>
                 <button 
                   onClick={() => setStep(1)}
                   className="w-full md:w-auto text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-colors p-6"
                 >
                   Discard & Restart
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {step < 3 && (
          <div className="mt-16 flex items-center justify-between pt-12 border-t border-slate-100">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className="flex items-center gap-3 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-900 disabled:opacity-0 transition-all px-6 py-4 rounded-2xl hover:bg-white"
            >
              <ChevronLeft size={20} />
              Previous Phase
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-3 bg-[#2563eb] text-white px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-500/30 hover:bg-blue-600 transition-all active:scale-95 group"
            >
              Next Phase
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
