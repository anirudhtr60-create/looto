import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  BookOpen,
  ClipboardList
} from 'lucide-react';
import { AssessmentState } from './types';
import { DECISION_TREE } from './constants';
import LandingPage from './components/LandingPage';
import DecisionFlow from './components/DecisionFlow';
import ResultScreen from './components/ResultScreen';
import ModeReference from './components/ModeReference';

type View = 'decision' | 'reference';

export default function App() {
  const [activeTab, setActiveTab] = useState<View>('decision');
  const [assessment, setAssessment] = useState<AssessmentState | null>(null);

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
      setAssessment({
        ...assessment,
        path: newPath,
        result: decision.modeId
      });
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

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0f172a] rounded-lg flex items-center justify-center text-white">
              <Shield size={20} />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-[#0f172a]">LOTO GUARD</span>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('decision')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'decision' 
                ? 'bg-white text-[#0f172a] shadow-sm transition-all duration-200' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ClipboardList size={16} />
              Decision Tree
            </button>
            <button
              onClick={() => setActiveTab('reference')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'reference' 
                ? 'bg-white text-[#0f172a] shadow-sm transition-all duration-200' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <BookOpen size={16} />
              Mode Reference
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8">
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
                <LandingPage onStart={handleStart} />
              ) : assessment.result !== undefined ? (
                <ResultScreen 
                  assessment={assessment} 
                  onRestart={handleRestart}
                  onBack={handleBack}
                />
              ) : (
                <DecisionFlow 
                  assessment={assessment} 
                  onAnswer={handleAnswer}
                  onBack={handleBack}
                  onRestart={handleRestart}
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="reference-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <ModeReference />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-6 text-center text-slate-400 text-sm border-t border-slate-200 bg-white/30">
        Based on Appendix A — LOTO Decision Tree • Created for Safety Integrity
      </footer>
    </div>
  );
}
