import { motion } from 'framer-motion';
import { History as HistoryIcon, Clock, ChevronRight, Activity, Trash2, Download, FileJson, FileText } from 'lucide-react';
import { AssessmentRecord, Language } from '../types';
import { MODES, UI_TRANSLATIONS } from '../constants';
import Tooltip from './Tooltip';

interface HistoryViewProps {
  history: AssessmentRecord[];
  lang: Language;
  onClear: () => void;
  onViewDetails: (record: AssessmentRecord) => void;
}

export default function HistoryView({ history, lang, onClear, onViewDetails }: HistoryViewProps) {
  const t = UI_TRANSLATIONS[lang];

  const exportData = (format: 'json' | 'csv') => {
    if (history.length === 0) return;

    let blob: Blob;
    let filename: string;

    if (format === 'json') {
      const jsonString = JSON.stringify(history, null, 2);
      blob = new Blob([jsonString], { type: 'application/json' });
      filename = `loto_history_${Date.now()}.json`;
    } else {
      const headers = lang === 'en' 
        ? ['ID', 'Activity', 'Timestamp', 'Date', 'Result Mode', 'Language']
        : ['आईडी', 'गतिविधि', 'टाइमस्टैम्प', 'दिनांक', 'रिजल्ट मोड', 'भाषा'];
      const rows = history.map(rec => [
        rec.id,
        `"${rec.activity.replace(/"/g, '""')}"`,
        rec.timestamp,
        new Date(rec.timestamp).toISOString(),
        MODES[rec.result].name,
        rec.language
      ]);
      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      filename = `loto_history_${Date.now()}.csv`;
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
    <div className="py-8 px-4">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0f172a] mb-2 tracking-tight">
            {t.historyTitle}
          </h1>
          <p className="text-slate-500 text-left">
            {lang === 'en' ? `${history.length} records found` : `${history.length} रिकॉर्ड मिले`}
          </p>
        </div>
        
        {history.length > 0 && (
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <Tooltip content={lang === 'en' ? 'Export as JSON' : 'JSON के रूप में निर्यात करें'}>
                <button
                  onClick={() => exportData('json')}
                  className="p-2 text-slate-500 hover:text-blue-500 transition-colors rounded-lg hover:bg-white"
                  aria-label="Export JSON"
                >
                  <FileJson size={18} />
                </button>
              </Tooltip>
              <Tooltip content={lang === 'en' ? 'Export as CSV' : 'CSV के रूप में निर्यात करें'}>
                <button
                  onClick={() => exportData('csv')}
                  className="p-2 text-slate-500 hover:text-green-500 transition-colors rounded-lg hover:bg-white"
                  aria-label="Export CSV"
                >
                  <FileText size={18} />
                </button>
              </Tooltip>
            </div>

            <div className="h-6 w-[1px] bg-slate-200" />

            <button 
              onClick={onClear}
              className="flex items-center gap-2 text-red-500 hover:text-red-600 font-bold text-xs uppercase tracking-widest transition-all"
            >
              <Trash2 size={16} />
              {lang === 'en' ? 'Clear All' : 'सभी मिटाएं'}
            </button>
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-6">
            <HistoryIcon size={32} />
          </div>
          <p className="text-slate-500 font-medium">
            {t.noHistory}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((record, index) => {
            const mode = MODES[record.result];
            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card hover:bg-white/90 transition-all p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group"
              >
                <div className="flex items-center gap-6">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0"
                    style={{ backgroundColor: mode.color }}
                  >
                    <Activity size={24} />
                  </div>
                  
                  <div className="text-left">
                    <h3 className="text-xl font-extrabold text-[#0f172a] tracking-tight mb-1">
                      {record.activity}
                    </h3>
                    <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {new Date(record.timestamp).toLocaleString(lang === 'en' ? 'en-US' : 'hi-IN')}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px]">
                        {mode.translations[lang].title}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => onViewDetails(record)}
                    className="btn-primary py-2 px-6 text-sm"
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
