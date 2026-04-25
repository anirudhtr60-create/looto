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
import Portal from './components/Portal';
import VehicleInspection from './components/VehicleInspection';
import ContractorEvaluation from './components/ContractorEvaluation';
import Login from './components/Login';

type View = 'decision' | 'reference' | 'history';
type Project = 'portal' | 'loto' | 'vehicle' | 'permits' | 'sop' | 'contractor';

export default function App() {
  const [project, setProject] = useState<Project>('portal');
  const [activeTab, setActiveTab] = useState<View>('decision');
  const [assessment, setAssessment] = useState<AssessmentState | null>(null);
  const [history, setHistory] = useState<AssessmentRecord[]>([]);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginFor, setShowLoginFor] = useState<Project | null>(null);

  const isDark = false;

  const mainRef = useState<HTMLElement | null>(null)[0]; // We'll use id-based selection for simplicity since it's already there

  // Tab focus management
  useEffect(() => {
    const mainElement = document.getElementById('main-content');
    if (mainElement) {
      mainElement.focus();
    }
  }, [activeTab]);

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
        language: lang,
        path: newPath
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
    setHistory([]);
    safeStorage.remove('loto_history');
  };

  const handleTabChange = (view: View) => {
    setIsLoading(true);
    setActiveTab(view);
    // Simulate data fetching delay
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const t = UI_TRANSLATIONS[lang];

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 bg-slate-50 relative overflow-hidden">
      <AnimatePresence>
        {showLoginFor && (
          <Login 
            lang={lang}
            onLogin={() => {
              setIsAuthenticated(true);
              setProject(showLoginFor);
              setShowLoginFor(null);
            }}
            onCancel={() => setShowLoginFor(null)}
          />
        )}
      </AnimatePresence>

      <a href="#main-content" className="skip-link">
        {lang === 'en' ? 'Skip to content' : 'सामग्री पर जाएँ'}
      </a>

      {project === 'portal' ? (
        <Portal lang={lang} onSelectProject={(p) => {
          const proj = p as Project;
          if (!isAuthenticated && (proj === 'loto' || proj === 'contractor')) {
            setShowLoginFor(proj);
          } else {
            setProject(proj);
          }
        }} />
      ) : (
        <>
          {/* Decorative Background Elements */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px] animate-pulse-slow" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-green-100/50 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-grid opacity-[0.03]" />
          </div>

          {/* Navigation Header */}
          <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-100 shadow-sm relative">
        <div className="max-w-7xl mx-auto px-6 h-auto md:h-24 flex flex-col md:flex-row items-center justify-between gap-6 py-4 md:py-0">
          <div className="flex items-center gap-4 self-start md:self-auto">
            <button 
              onClick={() => setProject('portal')}
              className="group flex items-center gap-2 pr-6 bg-slate-50 border border-slate-200/60 rounded-2xl hover:bg-[#0f172a] transition-all overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-900/10"
              title="Back to Portal"
            >
              <div className="w-12 h-12 bg-[#0f172a] group-hover:bg-[#1e293b] flex items-center justify-center transition-colors shadow-lg">
                <Shield size={22} className="text-white" />
              </div>
              <span className="text-[11px] font-black text-slate-500 group-hover:text-white uppercase tracking-[0.2em] transition-colors pl-1">Portal</span>
            </button>
            <div className="flex flex-col text-left">
              <h1 className="font-display font-black text-2xl md:text-3xl tracking-tighter text-[#0f172a] leading-none">{t.appTitle}</h1>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse shadow-[0_0_8px_#16a34a]" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] leading-none">{t.aboutApp}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            <div className="flex bg-slate-100/80 p-1.5 rounded-[1.5rem] flex-1 md:flex-none justify-between md:justify-start shadow-inner border border-white relative" role="tablist">
              <Tooltip content={t.navDecision}>
                <button
                  role="tab"
                  id="tab-decision"
                  aria-controls="panel-decision"
                  aria-selected={activeTab === 'decision'}
                  onClick={() => { handleTabChange('decision'); setAssessment(null); }}
                  className={`relative flex items-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all outline-none focus-visible:ring-2 focus-visible:ring-slate-900 z-10 ${
                    activeTab === 'decision' 
                    ? 'text-[#0f172a]' 
                    : 'text-slate-500 hover:text-slate-950'
                  }`}
                  aria-label={t.navDecision}
                >
                  {activeTab === 'decision' && (
                    <motion.div 
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] ring-1 ring-black/5 rounded-2xl z-[-1]"
                      transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  <ClipboardList size={16} aria-hidden="true" />
                  <span className="hidden md:inline">{t.navDecision}</span>
                </button>
              </Tooltip>
              <Tooltip content={t.navReference}>
                <button
                  role="tab"
                  id="tab-reference"
                  aria-controls="panel-reference"
                  aria-selected={activeTab === 'reference'}
                  onClick={() => handleTabChange('reference')}
                  className={`relative flex items-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all outline-none focus-visible:ring-2 focus-visible:ring-slate-900 z-10 ${
                    activeTab === 'reference' 
                    ? 'text-[#0f172a]' 
                    : 'text-slate-500 hover:text-slate-950'
                  }`}
                  aria-label={t.navReference}
                >
                  {activeTab === 'reference' && (
                    <motion.div 
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] ring-1 ring-black/5 rounded-2xl z-[-1]"
                      transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  <BookOpen size={16} aria-hidden="true" />
                  <span className="hidden lg:inline">{t.navReference}</span>
                </button>
              </Tooltip>
              <Tooltip content={t.navHistory}>
                <button
                  role="tab"
                  id="tab-history"
                  aria-controls="panel-history"
                  aria-selected={activeTab === 'history'}
                  onClick={() => handleTabChange('history')}
                  className={`relative flex items-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all outline-none focus-visible:ring-2 focus-visible:ring-slate-900 z-10 ${
                    activeTab === 'history' 
                    ? 'text-[#0f172a]' 
                    : 'text-slate-500 hover:text-slate-950'
                  }`}
                  aria-label={t.navHistory}
                >
                  {activeTab === 'history' && (
                    <motion.div 
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] ring-1 ring-black/5 rounded-2xl z-[-1]"
                      transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  <HistoryIcon size={16} aria-hidden="true" />
                  <span className="hidden lg:inline">{t.navHistory}</span>
                </button>
              </Tooltip>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl ml-2">
              <Tooltip content={t.langToggle}>
                <button
                  onClick={toggleLang}
                  className="p-2 text-slate-700 hover:text-blue-700 transition-colors rounded-lg flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  aria-label={t.langToggle}
                >
                  <Languages size={18} aria-hidden="true" />
                  <span className="text-[10px] font-black uppercase tracking-tighter" aria-hidden="true">{lang === 'en' ? 'HI' : 'EN'}</span>
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      </nav>

      <main id="main-content" className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8" role="main" tabIndex={-1}>
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
          {project === 'vehicle' ? (
            <motion.div
              key="vehicle-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <VehicleInspection lang={lang} onBack={() => setProject('portal')} />
            </motion.div>
          ) : project === 'contractor' ? (
            <motion.div
              key="contractor-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ContractorEvaluation lang={lang} onBack={() => setProject('portal')} />
            </motion.div>
          ) : activeTab === 'decision' ? (
            <motion.div
              key="decision-view"
              id="panel-decision"
              role="tabpanel"
              aria-labelledby="tab-decision"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              {!assessment ? (
                <LandingPage onStart={handleStart} lang={lang} onBack={() => setProject('portal')} />
              ) : assessment.result !== undefined ? (
                <ResultScreen 
                  assessment={assessment} 
                  onRestart={handleRestart}
                  onBack={handleBack}
                  onExit={() => setProject('portal')}
                  lang={lang}
                />
              ) : (
                <DecisionFlow 
                  assessment={assessment} 
                  onAnswer={handleAnswer}
                  onBack={handleBack}
                  onRestart={handleRestart}
                  onExit={() => setProject('portal')}
                  lang={lang}
                />
              )}
            </motion.div>
          ) : activeTab === 'reference' ? (
            <motion.div
              key="reference-view"
              id="panel-reference"
              role="tabpanel"
              aria-labelledby="tab-reference"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <ModeReference isLoading={isLoading} lang={lang} onBack={() => setProject('portal')} />
            </motion.div>
          ) : (
            <motion.div
              key="history-view"
              id="panel-history"
              role="tabpanel"
              aria-labelledby="tab-history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <HistoryView 
                isLoading={isLoading}
                history={history} 
                lang={lang} 
                onClear={handleClearHistory} 
                onBack={() => setProject('portal')}
                onViewDetails={(rec) => {
                  setActiveTab('decision');
                  setAssessment({ 
                    activity: rec.activity, 
                    currentStepId: 'Q1', 
                    path: rec.path || [], 
                    result: rec.result 
                  });
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-8 text-center text-slate-700 text-[10px] font-black uppercase tracking-widest border-t border-slate-200 bg-white/30">
        {lang === 'en' ? 'Based on Appendix A — LOTO Decision Tree' : 'Appendix A के आधार पर — लोटो निर्णय वृक्ष'} • {t.aboutApp}
      </footer>
        </>
      )}
    </div>
  );
}
