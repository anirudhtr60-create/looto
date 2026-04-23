import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowLeft, Save, Printer, CheckCircle2, AlertCircle, Info, Check, Download, FileText, ChevronDown, Trash2, FolderOpen, X } from 'lucide-react';
import { Language } from '../types';
import { safeStorage } from '../lib/storage';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ContractorEvaluationProps {
  lang: Language;
  onBack: () => void;
}

interface EvaluationRow {
  id: number;
  parameter: string;
  evaluated: 'YES' | 'NO' | '';
  rating: number | '';
  comments: string;
}

export default function ContractorEvaluation({ lang, onBack }: ContractorEvaluationProps) {
  const [formData, setFormData] = useState({
    contractCompany: '',
    workDescription: '',
    projectCompletion: {
      scheduled: '',
      actual: ''
    },
    overallFeedback: '',
    safetyManager: '',
    deptInCharge: ''
  });

  const [safetyMetrics, setSafetyMetrics] = useState<EvaluationRow[]>([
    { id: 1, parameter: "Effectiveness of work supervision, work maintenance, delivery/storage of material", evaluated: '', rating: '', comments: '' },
    { id: 2, parameter: "Anticipation of problems & making necessary adjustments to adapt site KORE re", evaluated: '', rating: '', comments: '' },
    { id: 3, parameter: "Coordination & Co-operation with department personnel on work matters", evaluated: '', rating: '', comments: '' },
    { id: 4, parameter: "Availability of responsible representatives for instruction & decision making", evaluated: '', rating: '', comments: '' },
    { id: 5, parameter: "Adherence to plans & specifications as related to the quality and safe work", evaluated: '', rating: '', comments: '' },
    { id: 6, parameter: "Availability of contractor equipment", evaluated: '', rating: '', comments: '' },
    { id: 7, parameter: "Condition of contractor tools/equipment", evaluated: '', rating: '', comments: '' },
    { id: 8, parameter: "Effective scheduling & completion of work as per schedule", evaluated: '', rating: '', comments: '' },
    { id: 9, parameter: "Maintenance of worker safety standards", evaluated: '', rating: '', comments: '' },
    { id: 10, parameter: "Cooperation with requests for information regarding legal & safety compliance", evaluated: '', rating: '', comments: '' },
    { id: 11, parameter: "Compliance with laws, ordinance and regulations", evaluated: '', rating: '', comments: '' },
    { id: 12, parameter: "Disposed waste in designated area", evaluated: '', rating: '', comments: '' },
    { id: 13, parameter: "Wearing other PPE's/ Safety Equipment", evaluated: '', rating: '', comments: '' },
    { id: 14, parameter: "Incident, Accident & Near Miss Reporting to plant", evaluated: '', rating: '', comments: '' },
  ]);

  const [competenceMetrics, setCompetenceMetrics] = useState<EvaluationRow[]>([
    { id: 1, parameter: "Site induction of contractor's employees (including sub-contractors).", evaluated: '', rating: '', comments: '' },
    { id: 2, parameter: "Competent workers are assigned for the work and submitted to required Documents (including for any sub-contractors)?", evaluated: '', rating: '', comments: '' },
    { id: 3, parameter: "Any task specific training needs.", evaluated: '', rating: '', comments: '' },
    { id: 4, parameter: "Contractor criteria used for the selection of contractors based on WHS Performa", evaluated: '', rating: '', comments: '' },
  ]);

  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [savedAssessments, setSavedAssessments] = useState<any[]>([]);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSavedAssessments();
  }, []);

  const loadSavedAssessments = () => {
    const allKeys = Object.keys(localStorage);
    const evaluationKeys = allKeys.filter(k => k.startsWith('contractor_eval_'));
    const assessments = evaluationKeys.map(k => {
      const data = safeStorage.get<any>(k, null);
      return data ? { key: k, ...data } : null;
    }).filter(a => a !== null).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    setSavedAssessments(assessments);
  };

  const handleSave = () => {
    const evaluationData = {
      formData,
      safetyMetrics,
      competenceMetrics,
      overallScore,
      timestamp: Date.now()
    };
    
    const companyName = formData.contractCompany.trim() || `Draft_${new Date().getTime()}`;
    const saved = safeStorage.set(`contractor_eval_${companyName.replace(/\s+/g, '_')}`, evaluationData);
    if (saved) {
      setShowSaveMessage(true);
      loadSavedAssessments();
      setTimeout(() => setShowSaveMessage(false), 3000);
    }
  };

  const loadAssessment = (assessment: any) => {
    setFormData(assessment.formData);
    setSafetyMetrics(assessment.safetyMetrics);
    setCompetenceMetrics(assessment.competenceMetrics);
    setShowHistoryModal(false);
  };

  const deleteAssessment = (e: MouseEvent, key: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Using a more reliable way to confirm in this environment or just direct delete
    safeStorage.remove(key);
    loadSavedAssessments();
  };

  const updateSafetyMetric = (id: number, field: keyof EvaluationRow, value: any) => {
    setSafetyMetrics(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const updateCompetenceMetric = (id: number, field: keyof EvaluationRow, value: any) => {
    setCompetenceMetrics(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleDownload = async (format: 'pdf' | 'doc') => {
    setShowDownloadMenu(false);
    
    const element = printRef.current;
    if (!element) return;

    if (format === 'pdf') {
      try {
        // Force rigid dimensions for high-quality capture
        const originalStyle = element.getAttribute('style') || '';
        element.setAttribute('style', `
          width: 800px !important;
          height: auto !important;
          position: fixed !important;
          left: 0 !important;
          top: 0 !important;
          z-index: 999999 !important;
          visibility: visible !important;
          opacity: 1 !important;
          background: white !important;
          padding: 40px !important;
          box-sizing: border-box !important;
        `);

        const canvas = await html2canvas(element, {
          scale: 3, // Higher scale for extreme text clarity
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: 800
        });

        element.setAttribute('style', originalStyle);

        if (!canvas) throw new Error('Canvas generation failed');

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
        pdf.save(`BAIL_S_110_FRM_01_00_00_04_${formData.contractCompany.replace(/\s+/g, '_') || 'Report'}.pdf`);
        
      } catch (error) {
        console.error('PDF Generation failed:', error);
      }
    } else {
      // Basic Word (HTML) export
      const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
            "xmlns:w='urn:schemas-microsoft-com:office:word' "+
            "xmlns='http://www.w3.org/TR/REC-html40'>"+
            "<head><meta charset='utf-8'><title>Contractor Evaluation</title></head><body>";
      const footer = "</body></html>";
      const sourceHTML = header + element.innerHTML + footer;
      
      const blob = new Blob(['\ufeff', sourceHTML], {
        type: 'application/msword'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contractor_evaluation_${formData.contractCompany.replace(/\s+/g, '_') || 'report'}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const calculateOverallRating = () => {
    const allRatings = [...safetyMetrics, ...competenceMetrics]
      .map(m => m.rating)
      .filter((r): r is number => r !== '');
    
    if (allRatings.length === 0) return 0;
    const sum = allRatings.reduce((a, b) => a + b, 0);
    return Math.round((sum / (allRatings.length * 5)) * 100);
  };

  const overallScore = calculateOverallRating();

  const getRatingLabel = (score: number) => {
    if (score >= 91) return { label: 'SUPERIOR', color: 'text-green-600' };
    if (score >= 76) return { label: 'GOOD', color: 'text-blue-600' };
    if (score >= 61) return { label: 'FAIR', color: 'text-yellow-600' };
    return { label: 'DEFICIENT', color: 'text-red-600' };
  };

  const ratingInfo = getRatingLabel(overallScore);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Header Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2.5 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
              title="Back"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <div className="flex flex-col">
              <h1 className="text-sm font-black tracking-tighter text-slate-900 uppercase leading-none">Contractor Evaluation</h1>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">BAIL-S-110-FRM-01-00-00-04</span>
              <span className="text-[8px] text-blue-500 font-bold uppercase mt-1 md:hidden lg:inline">*Open in new tab if print/save is blocked</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {savedAssessments.length > 0 && (
              <button 
                onClick={() => setShowHistoryModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                title="Load Saved Assessments"
              >
                <FolderOpen size={16} />
                Saved
              </button>
            )}
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-black text-[10px] uppercase tracking-widest hover:border-slate-900 transition-all active:scale-95"
            >
              {showSaveMessage ? (
                <>
                  <Check size={16} className="text-green-500" />
                  Saved!
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Draft
                </>
              )}
            </button>
            <div className="relative">
              <button 
                id="download-report-btn"
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#0f172a] text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all overflow-hidden"
              >
                <Download size={16} />
                Download Report
                <ChevronDown size={14} className={`transition-transform ${showDownloadMenu ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showDownloadMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[60]"
                  >
                    <button
                      onClick={() => handleDownload('pdf')}
                      className="w-full flex items-center gap-3 px-6 py-4 text-xs font-black text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors border-b border-slate-50"
                    >
                      <FileText size={16} className="text-blue-500" />
                      Download Report (PDF)
                    </button>
                    <button
                      onClick={() => handleDownload('doc')}
                      className="w-full flex items-center gap-3 px-6 py-4 text-xs font-black text-slate-600 hover:bg-slate-50 hover:text-green-600 transition-colors"
                    >
                      <Download size={16} className="text-green-500" />
                      Export Word (DOC)
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* Form Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        
        {/* Company Header Card */}
        <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/5 relative overflow-hidden text-center">
           <div className="absolute top-0 right-0 p-8">
             <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black text-slate-400 tracking-widest">REVISION NO. 01</div>
           </div>
           <h2 className="text-xl md:text-2xl font-display font-black text-slate-900 tracking-tight uppercase leading-tight">
             BRINDAVAN AGRO INDUSTRIES PVT LTD <br/>
             <span className="text-slate-400">CHHATA, MATHURA</span>
           </h2>
           <div className="h-1 w-24 bg-[#16a34a] mx-auto mt-6 rounded-full" />
           <p className="mt-6 text-sm font-black text-[#16a34a] tracking-[0.4em] uppercase">CONTRACTOR PERFORMANCE EVALUATION REPORT FORM</p>
        </div>

        {/* Section A: Contractor Details */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-sm">A</div>
            <h3 className="text-xs font-black uppercase tracking-[0.25em] text-slate-900">Contractor Details</h3>
          </div>
          
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contract Company / Business Name</label>
                <input 
                  type="text" 
                  className="w-full h-14 bg-slate-50 border-2 border-transparent rounded-2xl px-6 font-bold text-slate-900 focus:border-[#2563eb] focus:bg-white outline-none transition-all placeholder:text-slate-200"
                  placeholder="Enter company name..."
                  value={formData.contractCompany}
                  onChange={e => setFormData({...formData, contractCompany: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Brief Description of work undertaken</label>
                <textarea 
                  className="w-full h-32 bg-slate-50 border-2 border-transparent rounded-2xl p-6 font-bold text-slate-900 focus:border-[#2563eb] focus:bg-white outline-none transition-all resize-none placeholder:text-slate-200"
                  placeholder="Describe the contract scope..."
                  value={formData.workDescription}
                  onChange={e => setFormData({...formData, workDescription: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-6">
               <div className="p-6 bg-slate-50 rounded-[1.5rem] space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project Completion Schedule</h4>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-tighter text-slate-400">Scheduled Date</label>
                     <input 
                       type="date" 
                       className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-xs font-bold focus:border-[#2563eb] outline-none"
                       value={formData.projectCompletion.scheduled}
                       onChange={e => setFormData({...formData, projectCompletion: { ...formData.projectCompletion, scheduled: e.target.value }})}
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-tighter text-slate-400">Actual Date</label>
                     <input 
                       type="date" 
                       className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-xs font-bold focus:border-[#2563eb] outline-none"
                       value={formData.projectCompletion.actual}
                       onChange={e => setFormData({...formData, projectCompletion: { ...formData.projectCompletion, actual: e.target.value }})}
                     />
                   </div>
                 </div>
               </div>

               <div className="p-8 bg-[#0f172a] rounded-[2rem] text-white flex items-center justify-between shadow-xl shadow-slate-900/20">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Compliance Score</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-4xl font-display font-black leading-none">{overallScore}%</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${ratingInfo.color}`}>{ratingInfo.label}</span>
                    </div>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                    <CheckCircle2 size={24} className="text-[#16a34a]" />
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Section B: Safety Management System */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 font-black text-sm">B</div>
              <h3 className="text-xs font-black uppercase tracking-[0.25em] text-slate-900">Safety Management System</h3>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest">
              Scoring: 1 (Deficient) to 5 (Very Good)
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-lg overflow-hidden">
             <div className="overflow-x-auto">
               <table className="w-full border-collapse">
                 <thead>
                   <tr className="bg-slate-50/50 border-b border-slate-100">
                     <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 w-16">S.No</th>
                     <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Performance Parameters</th>
                     <th className="px-8 py-5 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Evaluated (Y/N)</th>
                     <th className="px-8 py-5 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Rating (1-5)</th>
                     <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Comments</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                   {safetyMetrics.map((row) => (
                     <tr key={row.id} className="hover:bg-slate-50/30 transition-colors group">
                       <td className="px-8 py-6 text-xs font-black text-slate-300">{row.id.toString().padStart(2, '0')}</td>
                       <td className="px-8 py-6 text-xs font-bold text-slate-700 leading-relaxed max-w-sm">{row.parameter}</td>
                       <td className="px-8 py-6">
                         <div className="flex items-center justify-center gap-2">
                           <button 
                             onClick={() => updateSafetyMetric(row.id, 'evaluated', 'YES')}
                             className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${row.evaluated === 'YES' ? 'bg-[#16a34a] text-white shadow-lg shadow-green-500/20' : 'bg-slate-50 text-slate-300 hover:text-slate-600'}`}
                           >YES</button>
                           <button 
                             onClick={() => updateSafetyMetric(row.id, 'evaluated', 'NO')}
                             className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${row.evaluated === 'NO' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-slate-50 text-slate-300 hover:text-slate-600'}`}
                           >NO</button>
                         </div>
                       </td>
                       <td className="px-8 py-6">
                         <div className="flex items-center justify-center gap-1">
                           {[1, 2, 3, 4, 5].map(v => (
                             <button
                               key={v}
                               onClick={() => updateSafetyMetric(row.id, 'rating', v)}
                               className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all ${row.rating === v ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-500/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 active:scale-90'}`}
                             >
                               {v}
                             </button>
                           ))}
                         </div>
                       </td>
                       <td className="px-8 py-6">
                         <input 
                           type="text" 
                           placeholder="..."
                           className="w-full h-10 bg-slate-50 border border-transparent rounded-xl px-4 text-xs font-bold text-slate-600 focus:bg-white focus:border-[#2563eb] outline-none transition-all"
                           value={row.comments}
                           onChange={e => updateSafetyMetric(row.id, 'comments', e.target.value)}
                         />
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>

        {/* Section C: Competence & Training */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-black text-sm">C</div>
            <h3 className="text-xs font-black uppercase tracking-[0.25em] text-slate-900">Contractor Competence & Training</h3>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-lg overflow-hidden">
             <div className="overflow-x-auto">
               <table className="w-full border-collapse">
                 <thead>
                   <tr className="bg-slate-50/50 border-b border-slate-100">
                     <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 w-16">S.No</th>
                     <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Performance Parameters</th>
                     <th className="px-8 py-5 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Evaluated (Y/N)</th>
                     <th className="px-8 py-5 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Rating (1-5)</th>
                     <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Comments</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                   {competenceMetrics.map((row) => (
                     <tr key={row.id} className="hover:bg-slate-50/30 transition-colors">
                       <td className="px-8 py-6 text-xs font-black text-slate-300">{row.id.toString().padStart(2, '0')}</td>
                       <td className="px-8 py-6 text-xs font-bold text-slate-700 leading-relaxed max-w-sm">{row.parameter}</td>
                       <td className="px-8 py-6">
                         <div className="flex items-center justify-center gap-2">
                           <button 
                             onClick={() => updateCompetenceMetric(row.id, 'evaluated', 'YES')}
                             className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${row.evaluated === 'YES' ? 'bg-[#16a34a] text-white' : 'bg-slate-50 text-slate-300'}`}
                           >YES</button>
                           <button 
                             onClick={() => updateCompetenceMetric(row.id, 'evaluated', 'NO')}
                             className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${row.evaluated === 'NO' ? 'bg-red-500 text-white' : 'bg-slate-50 text-slate-300'}`}
                           >NO</button>
                         </div>
                       </td>
                       <td className="px-8 py-6">
                         <div className="flex items-center justify-center gap-1">
                           {[1, 2, 3, 4, 5].map(v => (
                             <button
                               key={v}
                               onClick={() => updateCompetenceMetric(row.id, 'rating', v)}
                               className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all ${row.rating === v ? 'bg-[#2563eb] text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}
                             >
                               {v}
                             </button>
                           ))}
                         </div>
                       </td>
                       <td className="px-8 py-6">
                         <input 
                           type="text" 
                           placeholder="..."
                           className="w-full h-10 bg-slate-50 border border-transparent rounded-xl px-4 text-xs font-bold text-slate-600 focus:bg-white focus:border-[#2563eb] outline-none transition-all"
                           value={row.comments}
                           onChange={e => updateCompetenceMetric(row.id, 'comments', e.target.value)}
                         />
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>

        {/* Footer: Feedback & Signatures */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3 ml-1">
                <Info size={16} className="text-slate-400" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Overall Feedback</h4>
              </div>
              <textarea 
                className="w-full h-40 bg-white border border-slate-100 rounded-[2rem] p-8 text-sm font-medium text-slate-600 focus:border-[#2563eb] focus:shadow-xl transition-all outline-none resize-none"
                placeholder="Consolidated remarks on contractor performance..."
                value={formData.overallFeedback}
                onChange={e => setFormData({...formData, overallFeedback: e.target.value})}
              />
           </div>

           <div className="space-y-6">
              <div className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm space-y-8">
                 <div className="space-y-4">
                   <div className="h-px bg-slate-100 w-full" />
                   <input 
                     type="text"
                     placeholder="Safety Manager Name"
                     className="w-full text-center text-xs font-black uppercase tracking-widest text-slate-900 bg-transparent outline-none border-b border-transparent focus:border-slate-200 py-1"
                     value={formData.safetyManager}
                     onChange={e => setFormData({...formData, safetyManager: e.target.value})}
                   />
                   <p className="text-[9px] font-bold text-center text-slate-400 tracking-widest uppercase">Safety Manager Signature</p>
                 </div>
                 
                 <div className="space-y-4">
                   <div className="h-px bg-slate-100 w-full" />
                   <input 
                     type="text"
                     placeholder="Dept. Incharge Name"
                     className="w-full text-center text-xs font-black uppercase tracking-widest text-slate-900 bg-transparent outline-none border-b border-transparent focus:border-slate-200 py-1"
                     value={formData.deptInCharge}
                     onChange={e => setFormData({...formData, deptInCharge: e.target.value})}
                   />
                   <p className="text-[9px] font-bold text-center text-slate-400 tracking-widest uppercase">Department Incharge Signature</p>
                 </div>
              </div>
              <div className="px-6 py-4 bg-slate-900 rounded-2xl flex items-center gap-3">
                 <AlertCircle size={14} className="text-[#16a34a]" />
                 <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                   *CLASSIFIED — CONFIDENTIAL FOR INTERNAL USE ONLY*
                 </p>
              </div>
           </div>
        </div>

      </main>

      {/* Official Print Layout */}
      {/* ... keeping previous logic ... */}

      {/* History Modal */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-white overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                    <FolderOpen size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Saved Assessments</h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Select an evaluation to load</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowHistoryModal(false)}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {savedAssessments.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                      <FolderOpen size={32} className="text-slate-200" />
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No saved assessments found</p>
                  </div>
                ) : (
                  savedAssessments.map(assessment => (
                    <div 
                      key={assessment.key}
                      className="group p-5 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 rounded-[2rem] transition-all flex items-center justify-between gap-4"
                    >
                      <div className="flex-1 cursor-pointer" onClick={() => loadAssessment(assessment)}>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                          {assessment.formData.contractCompany}
                        </h4>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                            <Info size={12} />
                            {new Date(assessment.timestamp).toLocaleDateString()}
                          </span>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${getRatingLabel(assessment.overallScore).color}`}>
                            Score: {assessment.overallScore}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => loadAssessment(assessment)}
                          className="p-3 bg-white text-slate-400 hover:text-blue-600 hover:shadow-md transition-all rounded-xl"
                          title="Load"
                        >
                          <FolderOpen size={18} />
                        </button>
                        <button 
                          onClick={(e) => deleteAssessment(e, assessment.key)}
                          className="p-3 bg-white text-slate-400 hover:text-red-500 hover:shadow-md transition-all rounded-xl"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Official Print Layout (Perfect Industrial Format matching BAIL-S-110-FRM) */}
      <div 
        ref={printRef}
        className="print-root"
        style={{ 
          width: '210mm', 
          minHeight: '297mm',
          position: 'fixed', 
          left: '-10000px', 
          top: '0', 
          zIndex: -1,
          backgroundColor: 'white',
          padding: '12mm'
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @page { size: A4; margin: 0; }
          
          .print-container { 
            display: block !important; 
            width: 100% !important; 
            margin: 0 auto !important;
            padding: 0 !important;
            font-family: "Arial", "Helvetica", sans-serif !important;
            background-color: #ffffff !important;
            color: #000000 !important;
            font-size: 7.5pt !important;
            line-height: 1.2 !important;
          }
          .print-container table { 
            width: 100%; 
            border-collapse: separate; 
            border-spacing: 0;
            margin-bottom: 2pt; 
            table-layout: fixed; 
            border: 1pt solid #000000; 
            background-color: #ffffff !important; 
          }
          .print-container th, .print-container td { 
            border-right: 1pt solid #000000;
            border-bottom: 1pt solid #000000;
            padding: 4pt 5pt; 
            word-break: break-word; 
            vertical-align: top;
            color: #000000 !important; 
          }
          .print-container tr th:last-child, .print-container tr td:last-child {
            border-right: none;
          }
          .print-container tr:last-child th, .print-container tr:last-child td {
            border-bottom: none;
          }
          .print-container .section-header { 
            background-color: #f1f5f9 !important; 
            font-weight: bold; 
            text-align: left;
            -webkit-print-color-adjust: exact;
          }
          .print-container .sub-header { 
            background-color: #f8fafc !important; 
            font-weight: bold;
            text-align: center;
            -webkit-print-color-adjust: exact;
          }
          .print-container h1 { font-size: 11pt !important; margin: 0; line-height: 1.1; }
          .print-container h2 { font-size: 9pt !important; margin: 1pt 0; line-height: 1.1; }
          
          @media print {
            body > div#root > *:not(.print-root) { display: none !important; }
            #root { padding: 0 !important; margin: 0 !important; background: white !important; }
            .print-root { position: relative !important; left: 0 !important; top: 0 !important; padding: 12mm !important; opacity: 1 !important; }
          }
        `}} />
               <div className="print-container">
          {/* Header Table for absolute alignment stability */}
          <table style={{ border: 'none', marginBottom: '8pt' }}>
            <tbody>
              <tr style={{ border: 'none' }}>
                <td style={{ border: 'none', width: '20%', verticalAlign: 'top', padding: 0 }} className="font-bold">REVISION NO. 01</td>
                <td style={{ border: 'none', width: '60%', textAlign: 'center', padding: 0 }}>
                  <h1 className="font-bold uppercase tracking-tight">BRINDAVAN AGRO INDUSTRIES PVT LTD, CHHATA, MATHURA</h1>
                  <h2 className="font-bold uppercase" style={{ margin: '2pt 0' }}>CONTRACTOR PERFORMANCE EVALUATION REPORT FORM</h2>
                  <div className="font-bold" style={{ fontSize: '8pt' }}>BAIL-S-110-FRM-01-00-00-04</div>
                </td>
                <td style={{ border: 'none', width: '20%', padding: 0 }}></td>
              </tr>
            </tbody>
          </table>

          {/* Section A */}
          <table className="mb-2">
            <thead>
              <tr className="section-header">
                <th style={{ width: '5%', textAlign: 'center' }}>A</th>
                <th colSpan={5} className="font-bold py-1">CONTRACTOR DETAILS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center font-bold">1</td>
                <td className="w-[30%] font-bold">Contract Company/Business Name:</td>
                <td colSpan={4} className="uppercase font-bold text-blue-900 px-3">{formData.contractCompany}</td>
              </tr>
              <tr>
                <td className="text-center font-bold">2</td>
                <td className="font-bold">Brief Description of Contract work to be undertaken:</td>
                <td colSpan={4} className="align-top py-2 px-3">{formData.workDescription}</td>
              </tr>
              <tr>
                <td className="text-center font-bold">3</td>
                <td className="font-bold">Project Completion</td>
                <td className="sub-header w-[12%]">SCHEDULED</td>
                <td className="text-center font-bold w-[13%]">{formData.projectCompletion.scheduled}</td>
                <td className="sub-header w-[12%]">ACTUAL</td>
                <td className="text-center font-bold w-[13%]">{formData.projectCompletion.actual}</td>
              </tr>
            </tbody>
          </table>

          {/* Section B */}
          <table className="mb-2">
            <thead>
              <tr className="section-header">
                <th style={{ width: '5%', textAlign: 'center' }}>B</th>
                <th colSpan={4} className="font-bold py-1 uppercase">Contractor Safety Management System</th>
              </tr>
              <tr className="italic text-[6.5pt]">
                <th colSpan={5} className="text-left font-normal py-1 px-4" style={{ color: '#1e40af', borderTop: 'none' }}>
                  SCORING CRITERIA: Very Good:- 5, Good:- 4, Average:- 3, Need Improvement:- 2
                </th>
              </tr>
              <tr className="sub-header text-[7pt]">
                <td style={{ width: '5%' }}>S.NO.</td>
                <td style={{ width: '55%' }} className="uppercase">PERFORMANCE PARAMETERS</td>
                <td style={{ width: '13%' }}>EVALUATED?<br/>(YES/NO)</td>
                <td style={{ width: '9%' }} className="uppercase">RATING</td>
                <td style={{ width: '18%' }} className="uppercase">COMMENTS</td>
              </tr>
            </thead>
            <tbody>
              {safetyMetrics.map(row => (
                <tr key={row.id}>
                  <td className="text-center font-bold px-1">{row.id}</td>
                  <td className="px-3" style={{ fontSize: '7pt', lineHeight: '1.1' }}>{row.parameter}</td>
                  <td className="text-center font-bold">{row.evaluated}</td>
                  <td className="text-center font-bold">{row.rating}</td>
                  <td className="italic text-slate-500" style={{ fontSize: '6.5pt', lineHeight: '1.1' }}>{row.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Section C */}
          <table className="mb-2">
            <thead>
              <tr className="section-header">
                <th style={{ width: '5%', textAlign: 'center' }}>C</th>
                <th colSpan={4} className="font-bold py-1 uppercase">Contractor Competence & Training</th>
              </tr>
              <tr className="sub-header text-[7pt]">
                <td style={{ width: '5%' }}>S.NO.</td>
                <td style={{ width: '55%' }} className="uppercase">PERFORMANCE PARAMETERS</td>
                <td style={{ width: '13%' }}>EVALUATED?<br/>(YES/NO)</td>
                <td style={{ width: '9%' }} className="uppercase">RATING</td>
                <td style={{ width: '18%' }} className="uppercase">COMMENTS</td>
              </tr>
            </thead>
            <tbody>
              {competenceMetrics.map(row => (
                <tr key={row.id}>
                  <td className="text-center font-bold px-1">{row.id}</td>
                  <td className="px-3" style={{ fontSize: '7pt', lineHeight: '1.1' }}>{row.parameter}</td>
                  <td className="text-center font-bold">{row.evaluated}</td>
                  <td className="text-center font-bold">{row.rating}</td>
                  <td className="italic text-slate-500" style={{ fontSize: '6.5pt', lineHeight: '1.1' }}>{row.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Overall Rating */}
          <table className="mb-2">
            <tbody>
              <tr className="sub-header">
                <td style={{ width: '75%' }} className="font-bold uppercase text-[7pt] py-2 text-left px-4">
                  OVERALL RATING (Inadequate: 0-60, Deficient: 61-75, Good: 76-90, Superior: 91-100)
                </td>
                <td className="text-center text-[10pt] font-black" style={{ width: '25%' }}>
                  {overallScore}% — {ratingInfo.label}
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="h-14 align-top p-2" style={{ borderTop: 'none' }}>
                  <div className="font-bold mb-1 uppercase text-[6.5pt]">Overall Feedback:</div>
                  <div className="text-[7.5pt] leading-tight">{formData.overallFeedback}</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Signature Area */}
          <table className="mt-2">
            <tbody>
              <tr className="section-header">
                <td colSpan={2} className="font-bold py-1 uppercase">Evaluated by:</td>
              </tr>
              <tr>
                <td className="w-1/2 h-16 align-top p-2">
                  <div className="font-bold mb-6 uppercase text-[6.5pt]">Safety Manager (Signature & Title)</div>
                  <div className="border-b border-black w-[90%] font-black h-4 flex items-end pb-0.5 ml-1" style={{ fontSize: '8pt' }}>
                    {formData.safetyManager}
                  </div>
                </td>
                <td className="w-1/2 h-16 align-top p-2">
                  <div className="font-bold mb-6 uppercase text-[6.5pt]">Department In charge (Signature & Title)</div>
                  <div className="border-b border-black w-[90%] font-black h-4 flex items-end pb-0.5 ml-1" style={{ fontSize: '8pt' }}>
                    {formData.deptInCharge}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Industrial Footer */}
          <table style={{ border: 'none', borderTop: '1pt solid #000000', marginTop: '6pt' }}>
            <tbody>
              <tr style={{ border: 'none' }}>
                <td style={{ border: 'none', width: '50%', padding: '4pt 0 0 0' }} className="text-[8pt] font-bold uppercase">
                  <div>PREPARED BY: SAFETY MANAGER</div>
                  <div>APPROVED BY: VP TECHNICAL</div>
                  <div>REVISION DATE: 01.08.2024</div>
                </td>
                <td style={{ border: 'none', width: '50%', textAlign: 'right', padding: '4pt 0 0 0', verticalAlign: 'bottom' }} className="text-[9pt] font-black uppercase italic">
                  “CLASSIFIED – CONFIDENTIAL FOR INTERNAL USE ONLY”
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
