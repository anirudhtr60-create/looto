import { motion } from 'framer-motion';
import { History as HistoryIcon, Clock, ChevronRight, Activity, Trash2, Download, FileJson, FileText, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { QUESTIONS } from '../constants';
import { AssessmentRecord, Language } from '../types';
import { MODES, UI_TRANSLATIONS } from '../constants';
import Tooltip from './Tooltip';

interface HistoryViewProps {
  history: AssessmentRecord[];
  lang: Language;
  onClear: () => void;
  onBack: () => void;
  onViewDetails: (record: AssessmentRecord) => void;
  isLoading?: boolean;
}

export default function HistoryView({ history, lang, onClear, onBack, onViewDetails, isLoading }: HistoryViewProps) {
  const t = UI_TRANSLATIONS[lang];

  if (isLoading) {
    return (
      <div className="py-8 px-2 md:px-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-12 h-12 bg-slate-200 rounded-2xl animate-pulse" />
            <div className="text-left space-y-3">
              <div className="h-10 w-64 bg-slate-200 rounded-lg animate-pulse" />
              <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-[6px] border-slate-200 animate-pulse">
              <div className="flex items-start md:items-center gap-6 text-left w-full">
                <div className="w-14 h-14 bg-slate-200 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-4">
                  <div className="h-6 w-3/4 bg-slate-200 rounded" />
                  <div className="flex gap-4">
                    <div className="h-4 w-32 bg-slate-100 rounded" />
                    <div className="h-4 w-32 bg-slate-100 rounded" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-20 bg-slate-50 rounded" />
                    <div className="h-6 w-24 bg-slate-50 rounded" />
                    <div className="h-6 w-16 bg-slate-50 rounded" />
                  </div>
                </div>
              </div>
              <div className="h-12 w-32 bg-slate-200 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const exportData = (format: 'json' | 'csv') => {
    if (history.length === 0) return;

    let blob: Blob;
    let filename: string;

    if (format === 'json') {
      const cleanedHistory = history.map(({ id, timestamp, ...rest }) => rest);
      const jsonString = JSON.stringify(cleanedHistory, null, 2);
      blob = new Blob([jsonString], { type: 'application/json' });
      filename = `loto_history.json`;
    } else {
      const headers = lang === 'en' 
        ? ['Activity', 'Date', 'Result Mode', 'Language', 'Decision Path']
        : ['गतिविधि', 'दिनांक', 'रिजल्ट मोड', 'भाषा', 'निर्णय पथ'];
          const rows = history.map(rec => {
            const pathStr = rec.path?.map(p => `${p.questionId}:${p.answer ? 'YES' : 'NO'}`).join(' | ') || '';
            const mode = MODES[rec.result];
            return [
              `"${rec.activity.replace(/"/g, '""')}"`,
              new Date(rec.timestamp).toISOString(),
              mode ? mode.name : `Mode ${rec.result}`,
              rec.language,
              `"${pathStr}"`
            ];
          });
      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      filename = `loto_history.csv`;
    }

    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="py-8 px-2 md:px-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <button 
            onClick={onBack}
            className="p-3 bg-white border border-slate-200 text-slate-500 rounded-2xl hover:text-slate-900 transition-all shadow-sm flex items-center justify-center w-fit"
            title={lang === 'en' ? 'Back to Portal' : 'पोर्टल पर वापस'}
          >
            <ArrowLeft size={24} />
          </button>
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] mb-3 tracking-tighter">
              {t.historyTitle}
            </h1>
            <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">
              {lang === 'en' ? `${history.length} records found` : `${history.length} रिकॉर्ड मिले`}
            </p>
          </div>
        </div>
        
        {history.length > 0 && (
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto shadow-sm">
              <Tooltip content={lang === 'en' ? 'Export as JSON' : 'JSON के रूप में निर्यात करें'}>
                <button
                  onClick={() => exportData('json')}
                  className="flex-1 md:flex-none p-3 px-4 text-slate-700 hover:text-blue-700 transition-all rounded-xl hover:bg-white focus-visible:ring-2 focus-visible:ring-blue-600 outline-none flex items-center justify-center gap-2"
                  aria-label={lang === 'en' ? 'Export assessment history as JSON' : 'आकलन इतिहास को JSON के रूप में निर्यात करें'}
                >
                  <FileJson size={20} aria-hidden="true" />
                  <span className="md:hidden font-black text-[10px] tracking-tight">JSON</span>
                </button>
              </Tooltip>
              <Tooltip content={lang === 'en' ? 'Export as CSV' : 'CSV के रूप में निर्यात करें'}>
                <button
                  onClick={() => exportData('csv')}
                  className="flex-1 md:flex-none p-3 px-4 text-slate-700 hover:text-green-700 transition-all rounded-xl hover:bg-white focus-visible:ring-2 focus-visible:ring-green-600 outline-none flex items-center justify-center gap-2"
                  aria-label={lang === 'en' ? 'Export assessment history as CSV' : 'आकलन इतिहास को CSV के रूप में निर्यात करें'}
                >
                  <FileText size={20} aria-hidden="true" />
                  <span className="md:hidden font-black text-[10px] tracking-tight">CSV</span>
                </button>
              </Tooltip>
            </div>

            <div className="hidden lg:block h-8 w-[2px] bg-slate-200 mx-2" aria-hidden="true" />

            <Tooltip content={lang === 'en' ? 'Delete all records' : 'सभी रिकॉर्ड मिटाएं'}>
              <button 
                onClick={() => {
                  const msg = lang === 'en' 
                    ? 'Are you sure you want to delete all assessment records? This action cannot be undone.'
                    : 'क्या आप वाकई सभी मूल्यांकन रिकॉर्ड हटाना चाहते हैं? इस कार्रवाई को पूर्ववत नहीं किया जा सकता।';
                  if (window.confirm(msg)) {
                    onClear();
                  }
                }}
                className="flex items-center justify-center gap-2 text-red-600 hover:text-white hover:bg-red-600 border-2 border-red-100 hover:border-red-600 font-black text-xs uppercase tracking-[0.2em] transition-all focus-visible:ring-2 focus-visible:ring-red-600 p-4 px-6 rounded-2xl outline-none w-full md:w-auto shadow-lg shadow-red-600/5 active:scale-95"
                aria-label={lang === 'en' ? 'Clear all history' : 'सारा इतिहास मिटाएं'}
              >
                <Trash2 size={18} aria-hidden="true" />
                {lang === 'en' ? 'Clear All' : 'सभी मिटाएं'}
              </button>
            </Tooltip>
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="glass-card p-16 text-center border-2 border-dashed border-slate-200 bg-white/20">
          <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-300 mx-auto mb-8 shadow-inner">
            <HistoryIcon size={48} aria-hidden="true" />
          </div>
          <p className="text-slate-600 font-black text-2xl tracking-tight mb-2">
            {t.noHistory}
          </p>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
            {lang === 'en' ? 'Your assessments will appear here' : 'आपके मूल्यांकन यहां दिखाई देंगे'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {history.map((record, index) => {
            const mode = MODES[record.result];
            if (!mode) return null;
            
            const modeT = mode.translations?.[lang] || mode.translations?.['en'];
            if (!modeT) return null;

            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card hover:bg-white transition-all p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group shadow-md hover:shadow-xl border-l-[6px]"
                style={{ borderLeftColor: mode.color }}
              >
                <div className="flex items-start md:items-center gap-6 text-left">
                  <Tooltip content={mode.name}>
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl shrink-0 group-hover:scale-110 transition-transform cursor-help"
                      style={{ backgroundColor: mode.color }}
                    >
                      <Activity size={28} aria-hidden="true" />
                    </div>
                  </Tooltip>
                  
                  <div className="flex-1">
                    <h2 className="text-2xl font-black text-[#0f172a] tracking-tighter mb-2 leading-none">
                      {record.activity}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4">
                      <span className="flex items-center gap-2">
                        <Clock size={16} className="text-blue-500" aria-hidden="true" />
                        {new Date(record.timestamp).toLocaleString(lang === 'en' ? 'en-US' : 'hi-IN')}
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-slate-100 text-[#0f172a] shadow-sm flex items-center gap-2">
                        <span className="text-blue-600 font-black">Mode {record.result}</span>
                        <span className="w-[1px] h-3 bg-slate-300" />
                        {modeT.title}
                      </span>
                    </div>

                    {/* Quick Path Summary */}
                    <div className="flex flex-wrap gap-2">
                      {(record.path || []).map((step, sIdx) => {
                        const question = QUESTIONS[step.questionId];
                        if (!question) return null;
                        
                        const qT = question.translations?.[lang] || question.translations?.['en'];
                        if (!qT) return null;

                        return (
                          <div key={sIdx} className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-100 group/path">
                            <div className={step.answer ? 'text-green-600' : 'text-red-600'}>
                              {step.answer ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                            </div>
                            <span className="text-[9px] font-bold text-slate-600 truncate max-w-[100px]">
                              {qT.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <button 
                    onClick={() => onViewDetails(record)}
                    className="btn-primary py-4 px-10 text-sm font-black w-full md:w-auto shadow-lg shadow-blue-600/10 active:scale-95"
                    aria-label={`${t.viewDetails} ${record.activity}`}
                  >
                    {t.viewDetails}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
