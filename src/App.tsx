import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  BookOpen,
  ClipboardList,
  History as HistoryIcon,
  Moon,
  Sun,
  Languages
} from 'lucide-react';
import { AssessmentState, AssessmentRecord, Language } from './types';
import { DECISION_TREE, UI_TRANSLATIONS } from './constants';
import { safeStorage } from './lib/storage';
import LandingPage from './components/LandingPage';
import DecisionFlow from './components/DecisionFlow';
import ResultScreen from './components/ResultScreen';
import ModeReference from './components/ModeReference';
import HistoryView from './components/HistoryView';
import Tooltip from './components/Tooltip';

type View = 'decision' | 'reference' | 'history';

export default function App() {
  const [activeTab, setActiveTab] = useState<View>('decision');
  const [assessment, setAssessment] = useState<AssessmentState | null>(null);
  const [history, setHistory] = useState<AssessmentRecord[]>([]);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>('en');

  const isDark = false;

  // Load state from local storage
  useEffect(() => {
    setHistory(safeStorage.get<AssessmentRecord[]>('loto_history', []));
    const savedLang = safeStorage.get<Language>('loto_lang', 'en');
    setLang(savedLang);
    // Always clear dark mode if it was forced before
    document.documentElement.classList.remove('dark');
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'hi' : 'en';
    setLang(newLang);
    safeStorage.set('loto_lang', newLang);
  };

  const handleStart = (activity: string) => {
    setAssessment({
      activity,
      currentStepId: 'Q1',
      path: []
    });
  };

  const handleAnswer = (answer: boolean) => {
    if (!assessment) return;

    const currentNode = DECISION_TREE[assessment.currentStepId];
    const decision = answer ? currentNode.yes : currentNode.no;

    const newPath = [...assessment.path, { questionId: assessment.currentStepId, answer }];

    if (decision.type === 'result') {
      const resultModeId = decision.modeId;
      setAssessment({
        ...assessment,
        path: newPath,
        result: resultModeId
      });

      // Save to history
      const newRecord: AssessmentRecord = {
        id: crypto.randomUUID(),
        activity: assessment.activity,
        timestamp: Date.now(),
        result: resultModeId,
        language: lang
      };
      const updatedHistory = [newRecord, ...history];
      setHistory(updatedHistory);
      const saved = safeStorage.set('loto_history', updatedHistory);
      
      if (!saved) {
        setStorageError(lang === 'en' ? 'History could not be saved (Storage Full)' : 'इतिहास सहेजा नहीं जा सका (स्टोरेज फुल)');
        setTimeout(() => setStorageError(null), 5000);
      }

    } else {
      setAssessment({
        ...assessment,
        currentStepId: decision.id,
        path: newPath
      });
    }
  };

  const handleBack = () => {
    if (!assessment || assessment.path.length === 0) {
      setAssessment(null);
      return;
    }

    const newPath = [...assessment.path];
    const lastStep = newPath.pop();
    
    setAssessment({
      ...assessment,
      currentStepId: lastStep!.questionId,
      path: newPath,
      result: undefined
    });
  };

  const handleRestart = () => {
    setAssessment(null);
  };

  const handleClearHistory = () => {
    const msg = lang === 'en' ? 'Are you sure you want to clear all history?' : 'क्या आप वाकई सारा इतिहास मिटाना चाहते हैं?';
    if (confirm(msg)) {
      setHistory([]);
      safeStorage.remove('loto_history');
    }
  };

  const t = UI_TRANSLATIONS[lang];

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 bg-slate-50">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-20 flex flex-col md:flex-row items-center justify-between gap-4 py-2 md:py-0">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#0f172a] rounded-xl flex items-center justify-center shadow-lg transition-transform hover:rotate-3">
              <Shield size={24} className="text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-xl tracking-tighter text-[#0f172a] leading-none">{t.appTitle}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">{t.aboutApp}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => { setActiveTab('decision'); setAssessment(null); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-tight transition-all ${
                  activeTab === 'decision' 
                  ? 'bg-white text-[#0f172a] shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
                aria-label={t.navDecision}
              >
                <ClipboardList size={14} />
                <span className="hidden md:inline">{t.navDecision}</span>
              </button>
              <button
                onClick={() => setActiveTab('reference')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-tight transition-all ${
                  activeTab === 'reference' 
                  ? 'bg-white text-[#0f172a] shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
                aria-label={t.navReference}
              >
                <BookOpen size={14} />
                <span className="hidden md:inline">{t.navReference}</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-tight transition-all ${
                  activeTab === 'history' 
                  ? 'bg-white text-[#0f172a] shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
                aria-label={t.navHistory}
              >
                <HistoryIcon size={14} />
                <span className="hidden md:inline">{t.navHistory}</span>
              </button>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl ml-2">
              <Tooltip content={t.langToggle}>
                <button
                  onClick={toggleLang}
                  className="p-2 text-slate-500 hover:text-blue-600 transition-colors rounded-lg flex items-center gap-2"
                  aria-label={t.langToggle}
                >
                  <Languages size={18} />
                  <span className="text-[10px] font-black uppercase tracking-tighter">{lang === 'en' ? 'HI' : 'EN'}</span>
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8" role="main">
        {/* Storage Notification Overlay */}
        <AnimatePresence>
          {storageError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-red-500 text-white px-6 py-3 rounded-xl shadow-2xl font-bold text-sm flex items-center gap-3"
            >
              <Shield size={18} />
              {storageError}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {activeTab === 'decision' ? (
            <motion.div
              key="decision-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              {!assessment ? (
                <LandingPage onStart={handleStart} lang={lang} />
              ) : assessment.result !== undefined ? (
                <ResultScreen 
                  assessment={assessment} 
                  onRestart={handleRestart}
                  onBack={handleBack}
                  lang={lang}
                />
              ) : (
                <DecisionFlow 
                  assessment={assessment} 
                  onAnswer={handleAnswer}
                  onBack={handleBack}
                  onRestart={handleRestart}
                  lang={lang}
                />
              )}
            </motion.div>
          ) : activeTab === 'reference' ? (
            <motion.div
              key="reference-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <ModeReference lang={lang} />
            </motion.div>
          ) : (
            <motion.div
              key="history-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <HistoryView 
                history={history} 
                lang={lang} 
                onClear={handleClearHistory} 
                onViewDetails={(rec) => {
                  setActiveTab('decision');
                  setAssessment({ activity: rec.activity, currentStepId: 'Q1', path: [], result: rec.result });
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest border-t border-slate-200 bg-white/30">
        {lang === 'en' ? 'Based on Appendix A — LOTO Decision Tree' : 'Appendix A के आधार पर — लोटो निर्णय वृक्ष'} • {t.aboutApp}
      </footer>
    </div>
  );
}
