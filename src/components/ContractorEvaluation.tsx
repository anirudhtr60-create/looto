import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowLeft, Save, Printer, CheckCircle2, AlertCircle, Info, Check, Download, FileText, ChevronDown, Trash2, FolderOpen, X, Clock, Frown, Meh, Smile, Star } from 'lucide-react';
import { Language } from '../types';
import { safeStorage } from '../lib/storage';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

// Initialize pdfMake fonts with robust check for different build environments
if (pdfFonts && (pdfFonts as any).pdfMake) {
  (pdfMake as any).vfs = (pdfFonts as any).pdfMake.vfs;
} else if (pdfFonts) {
  (pdfMake as any).vfs = (pdfFonts as any).vfs || (pdfFonts as any).default?.vfs;
}

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

const RATING_CONFIG: Record<number, { label: string; color: string; bgColor: string; textColor: string; icon: any }> = {
  1: { label: 'Inadequate', color: '#ef4444', bgColor: 'bg-red-50', textColor: 'text-red-500', icon: Frown },
  2: { label: 'Need Improvement', color: '#f97316', bgColor: 'bg-orange-50', textColor: 'text-orange-500', icon: Meh },
  3: { label: 'Average', color: '#eab308', bgColor: 'bg-yellow-50', textColor: 'text-yellow-500', icon: Meh },
  4: { label: 'Good', color: '#84cc16', bgColor: 'bg-lime-50', textColor: 'text-lime-500', icon: Smile },
  5: { label: 'Very Good', color: '#22c55e', bgColor: 'bg-green-50', textColor: 'text-green-500', icon: Smile }
};

interface RatingSelectorProps {
  value: number | '';
  onChange: (val: number) => void;
  size?: 'sm' | 'md';
  hasError?: boolean;
}

const RatingSelector = ({ value, onChange, size = 'sm', hasError = false }: RatingSelectorProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className={`flex items-center gap-1 p-1 rounded-lg transition-all ${hasError ? 'bg-red-50 ring-2 ring-red-200' : ''}`}>
      {[1, 2, 3, 4, 5].map((v) => {
        const isActive = (hovered !== null ? v <= hovered : (value !== '' && v <= value));
        return (
          <motion.button
            key={v}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onMouseEnter={() => setHovered(v)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onChange(v)}
            className={`transition-colors ${size === 'sm' ? 'p-1' : 'p-2'}`}
          >
            <Star
              size={size === 'sm' ? 14 : 24}
              className={isActive ? 'fill-yellow-400 text-yellow-400' : hasError ? 'text-red-200 fill-transparent' : 'text-slate-200 fill-transparent'}
            />
          </motion.button>
        );
      })}
      {value !== '' && (
        <span className={`ml-2 text-[9px] font-black uppercase tracking-widest ${RATING_CONFIG[value].textColor}`}>
          {RATING_CONFIG[value].label}
        </span>
      )}
    </div>
  );
};

export default function ContractorEvaluation({ lang, onBack }: ContractorEvaluationProps) {
  const [formData, setFormData] = useState({
    contractCompany: '',
    workDescription: '',
    lotoMode: '1' as '1' | '2' | '3' | '4' | '5' | '',
    decisionPath: '',
    ptwNumber: '',
    ptwSme: '',
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
    { id: 12, parameter: "Disposed waste in designated area", evaluated: '', shadow: false, rating: '', comments: '' } as any,
    { id: 13, parameter: "Wearing other PPE's/ Safety Equipment", evaluated: '', rating: '', comments: '' },
    { id: 14, parameter: "Incident, Accident & Near Miss Reporting to plant", evaluated: '', rating: '', comments: '' },
  ]);

  // Effect to add Mode 5 (PTW) specific metrics
  useEffect(() => {
    if (formData.lotoMode === '5') {
      const ptwMetrics: EvaluationRow[] = [
        { id: 101, parameter: "Mandatory PTW Training validation for all involved personnel", evaluated: '', rating: '', comments: '' },
        { id: 102, parameter: "Continuous SME Supervision during live/energized work", evaluated: '', rating: '', comments: '' },
        { id: 103, parameter: "Active Permit documentation present and valid at work front", evaluated: '', rating: '', comments: '' }
      ];
      setSafetyMetrics(prev => {
        const filtered = prev.filter(m => m.id < 100);
        return [...filtered, ...ptwMetrics];
      });
    } else {
      setSafetyMetrics(prev => prev.filter(m => m.id < 100));
    }
  }, [formData.lotoMode]);

  const [competenceMetrics, setCompetenceMetrics] = useState<EvaluationRow[]>([
    { id: 1, parameter: "Site induction of contractor's employees (including sub-contractors).", evaluated: '', rating: '', comments: '' },
    { id: 2, parameter: "Competent workers are assigned for the work and submitted to required Documents (including for any sub-contractors)?", evaluated: '', rating: '', comments: '' },
    { id: 3, parameter: "Any task specific training needs.", evaluated: '', rating: '', comments: '' },
    { id: 4, parameter: "Contractor criteria used for the selection of contractors based on WHS Performa", evaluated: '', rating: '', comments: '' },
  ]);

  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'timestamp' | 'company' | 'score'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [savedAssessments, setSavedAssessments] = useState<any[]>([]);
  const printRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSavedAssessments();
  }, []);

  const loadSavedAssessments = () => {
    const allKeys = Object.keys(localStorage);
    const evaluationKeys = allKeys.filter(k => k.startsWith('contractor_eval_'));
    const assessments = evaluationKeys.map(k => {
      const data = safeStorage.get<any>(k, null);
      return data ? { key: k, ...data } : null;
    }).filter(a => a !== null);
    setSavedAssessments(assessments);
  };

  const filteredAndSortedAssessments = savedAssessments
    .filter(a => 
      a.formData.contractCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.formData.overallFeedback.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'timestamp') {
        comparison = (a.timestamp || 0) - (b.timestamp || 0);
      } else if (sortBy === 'company') {
        comparison = a.formData.contractCompany.localeCompare(b.formData.contractCompany);
      } else if (sortBy === 'score') {
        comparison = (a.overallScore || 0) - (b.overallScore || 0);
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.contractCompany.trim()) {
      errors.contractCompany = 'Company name is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      setSaveError('Please provide at least the Contractor Company Name to save');
      setTimeout(() => setSaveError(null), 5000);
      return;
    }

    const evaluationData = {
      formData,
      safetyMetrics,
      competenceMetrics,
      overallScore,
      timestamp: Date.now()
    };
    
    const companyName = formData.contractCompany.trim();
    const saved = safeStorage.set(`contractor_eval_${companyName.replace(/\s+/g, '_')}`, evaluationData);
    if (saved) {
      setSaveError(null);
      setValidationErrors({});
      setShowSaveMessage(true);
      loadSavedAssessments();
      setTimeout(() => setShowSaveMessage(false), 3000);
    } else {
      setSaveError('Failed to save assessment. Please try again or check storage.');
      setTimeout(() => setSaveError(null), 5000);
    }
  };

  const loadAssessment = (assessment: any) => {
    setFormData(prev => ({
      ...prev,
      ...assessment.formData,
      projectCompletion: {
        ...prev.projectCompletion,
        ...(assessment.formData?.projectCompletion || {})
      }
    }));
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
    if (field === 'rating') {
      setValidationErrors(prev => {
        const next = { ...prev };
        delete next[`safety_${id}`];
        return next;
      });
    }
    setSafetyMetrics(prev => prev.map(m => {
      if (m.id === id) {
        const update = { ...m, [field]: value };
        if (field === 'rating' && value && RATING_CONFIG[value as number]) {
          // Special case: Rating 2 (Need Improvement) automatically assigns "Dissatisfied"
          update.comments = value === 2 ? 'Dissatisfied' : RATING_CONFIG[value as number].label;
        }
        return update;
      }
      return m;
    }));
  };

  const updateCompetenceMetric = (id: number, field: keyof EvaluationRow, value: any) => {
    if (field === 'rating') {
      setValidationErrors(prev => {
        const next = { ...prev };
        delete next[`competence_${id}`];
        return next;
      });
    }
    setCompetenceMetrics(prev => prev.map(m => {
      if (m.id === id) {
        const update = { ...m, [field]: value };
        if (field === 'rating' && value && RATING_CONFIG[value as number]) {
          // Special case: Rating 2 (Need Improvement) automatically assigns "Dissatisfied"
          update.comments = value === 2 ? 'Dissatisfied' : RATING_CONFIG[value as number].label;
        }
        return update;
      }
      return m;
    }));
  };

  const handleDownload = async (format: 'pdf' | 'doc') => {
    setShowDownloadMenu(false);
    
    if (!validateForm()) {
      setSaveError('Please provide a Contractor Company Name before downloading');
      setTimeout(() => setSaveError(null), 5000);
      return;
    }

    if (format === 'pdf') {
      try {
        const docDefinition: any = {
          pageSize: 'A4',
          pageMargins: [20, 15, 20, 15],
          defaultStyle: {
            font: 'Roboto',
            fontSize: 9
          },
          content: [
            {
              columns: [
                { text: 'REVISION NO. 01', bold: true, fontSize: 8, width: '25%' },
                {
                  stack: [
                    { text: 'BRINDAVAN AGRO INDUSTRIES PVT LTD, CHHATA, MATHURA', alignment: 'center', bold: true, fontSize: 9 },
                    { text: 'CONTRACTOR PERFORMANCE EVALUATION REPORT FORM', alignment: 'center', bold: true, fontSize: 8.5, margin: [0, 1] },
                    { text: 'BAIL-S-110-FRM-01-00-00-04', alignment: 'center', bold: true, fontSize: 8 }
                  ],
                  width: '50%'
                },
                { text: '', width: '25%' }
              ],
              margin: [0, 0, 0, 10]
            },
            {
              table: {
                widths: [20, '*'],
                body: [
                  [{ text: 'A', bold: true, fillColor: '#f1f5f9' }, { text: 'CONTRACTOR DETAILS', bold: true, fillColor: '#f1f5f9' }],
                  ['1', {
                    columns: [
                      { text: 'Contract Company/Business Name:', bold: true, width: '40%' },
                      { text: formData.contractCompany || '-', bold: true, color: '#1e3a8a' }
                    ]
                  }],
                  ['2', {
                    columns: [
                      { text: 'Brief Description of work undertaken:', bold: true, width: '40%' },
                      { text: formData.workDescription || '-' }
                    ]
                  }],
                  ...(formData.lotoMode === '5' ? [
                    ['3', {
                      columns: [
                        { text: 'PTW Control Number:', bold: true, width: '40%' },
                        { text: formData.ptwNumber || '', bold: true }
                      ]
                    }],
                    ['4', {
                      columns: [
                        { text: 'SME Supervisor (Live Work):', bold: true, width: '40%' },
                        { text: formData.ptwSme || '', bold: true }
                      ]
                    }]
                  ] : []),
                  [formData.lotoMode === '5' ? '5' : '3', {
                    columns: [
                      { text: 'Project Completion', bold: true, width: '40%' },
                      { text: 'SCHEDULED:', margin: [0, 0, 5, 0], bold: true },
                      { text: formData.projectCompletion.scheduled || '-', width: '15%' },
                      { text: 'ACTUAL:', margin: [10, 0, 5, 0], bold: true },
                      { text: formData.projectCompletion.actual || '-', width: '15%' }
                    ]
                  }]
                ]
              },
              margin: [0, 0, 0, 10]
            },
            {
              table: {
                widths: [20, '*'],
                body: [
                  [{ text: 'B', bold: true, fillColor: '#f1f5f9' }, { text: 'CONTRACTOR SAFETY MANAGEMENT SYSTEM', bold: true, fillColor: '#f1f5f9' }]
                ]
              },
              margin: [0, 0, 0, 0]
            },
            {
              text: 'SCORING CRITERIA: Very Good:- 5, Good:- 4, Average:- 3, Need Improvement:- 2, Inadequate:- 1',
              fontSize: 9,
              italic: true,
              margin: [0, 4, 0, 4]
            },
            {
              table: {
                headerRows: 1,
                widths: [25, '*', 65, 45, 85],
                body: [
                  [
                    { text: 'S.NO.', bold: true, alignment: 'center', fillColor: '#f8fafc' },
                    { text: 'PERFORMANCE PARAMETERS', bold: true, alignment: 'center', fillColor: '#f8fafc' },
                    { text: 'EVALUATED? (YES/NO)', bold: true, alignment: 'center', fillColor: '#f8fafc' },
                    { text: 'RATING', bold: true, alignment: 'center', fillColor: '#f8fafc' },
                    { text: 'COMMENTS', bold: true, alignment: 'center', fillColor: '#f8fafc' }
                  ],
                  ...safetyMetrics.map(m => [
                    { text: m.id.toString(), alignment: 'center' },
                    { text: m.parameter, fontSize: 9 },
                    { text: m.evaluated || '-', alignment: 'center' },
                    { text: (m.rating || '-').toString(), alignment: 'center', bold: true },
                    { text: m.comments || '-', fontSize: 9 }
                  ])
                ]
              },
              margin: [0, 0, 0, 8]
            },
            {
              table: {
                widths: [20, '*'],
                body: [
                  [{ text: 'C', bold: true, fillColor: '#f1f5f9' }, { text: 'CONTRACTOR COMPETENCE & TRAINING', bold: true, fillColor: '#f1f5f9' }]
                ]
              },
              margin: [0, 0, 0, 5]
            },
            {
              table: {
                headerRows: 1,
                widths: [25, '*', 60, 40, 80],
                body: [
                  [
                    { text: 'S.NO.', bold: true, alignment: 'center', fillColor: '#f8fafc' },
                    { text: 'PERFORMANCE PARAMETERS', bold: true, alignment: 'center', fillColor: '#f8fafc' },
                    { text: 'EVALUATED? (Y/N)', bold: true, alignment: 'center', fillColor: '#f8fafc' },
                    { text: 'RATING', bold: true, alignment: 'center', fillColor: '#f8fafc' },
                    { text: 'COMMENTS', bold: true, alignment: 'center', fillColor: '#f8fafc' }
                  ],
                  ...competenceMetrics.map(m => [
                    { text: m.id.toString(), alignment: 'center' },
                    { text: m.parameter, fontSize: 9 },
                    { text: m.evaluated || '-', alignment: 'center' },
                    { text: (m.rating || '-').toString(), alignment: 'center', bold: true },
                    { text: m.comments || '-', fontSize: 9 }
                  ])
                ]
              },
              margin: [0, 0, 0, 10]
            },
            {
              table: {
                widths: ['*', 120],
                body: [
                  [
                    { text: 'OVERALL RATING (Inadequate: 0-60, Deficient: 61-75, Good: 76-90, Superior: 91-100)', bold: true, alignment: 'left', fillColor: '#f8fafc', fontSize: 8 },
                    { text: `${overallScore}% — ${ratingInfo.label}`, bold: true, alignment: 'center', color: '#1e3a8a', fontSize: 9 }
                  ]
                ]
              },
              margin: [0, 0, 0, 8]
            },
            {
              table: {
                widths: ['*'],
                body: [
                  [{ text: 'Overall Feedback:', bold: true, border: [true, true, true, false] }],
                  [{ text: formData.overallFeedback || 'No feedback provided.', margin: [5, 4, 0, 8], fontSize: 9, border: [true, false, true, true] }]
                ]
              },
              margin: [0, 0, 0, 12]
            },
            {
              table: {
                widths: ['*', '*'],
                body: [
                  [{ text: 'EVALUATED BY:', bold: true, fillColor: '#f1f5f9', colSpan: 2 }, {}],
                  [
                    {
                      stack: [
                        { text: 'Safety Manager (Signature & Title)', bold: true, fontSize: 8 },
                        { text: formData.safetyManager || '____________________', margin: [0, 8, 0, 0], bold: true, fontSize: 8.5 }
                      ],
                      padding: [5, 6, 5, 6]
                    },
                    {
                      stack: [
                        { text: 'Department In charge (Signature & Title)', bold: true, fontSize: 8 },
                        { text: formData.deptInCharge || '____________________', margin: [0, 8, 0, 0], bold: true, fontSize: 8.5 }
                      ],
                      padding: [5, 6, 5, 6]
                    }
                  ]
                ]
              },
              margin: [0, 0, 0, 15]
            },
            {
              canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1.5 }]
            },
            {
              columns: [
                {
                  stack: [
                    'PREPARED BY: SAFETY MANAGER',
                    'APPROVED BY: VP TECHNICAL',
                    'REVISION DATE: 01.08.2024'
                  ],
                  bold: true,
                  fontSize: 8,
                  margin: [0, 5, 0, 0]
                },
                {
                  text: '“CLASSIFIED – CONFIDENTIAL FOR INTERNAL USE ONLY”',
                  alignment: 'right',
                  bold: true,
                  italic: true,
                  fontSize: 8,
                  margin: [0, 10, 0, 0]
                }
              ]
            }
          ],
          styles: {
            header: {
              fontSize: 18,
              bold: true
            }
          }
        };

        const fileName = `BAIL_S_110_FRM_01_00_00_04_${formData.contractCompany.replace(/\s+/g, '_') || 'Report'}.pdf`;
        pdfMake.createPdf(docDefinition).download(fileName);
        
      } catch (error) {
        console.error('PDF Generation failed with pdfMake:', error);
      }
    } else {
      // Improved Word export with MSO metadata for better compatibility
      const style = `
        <style>
          @page { margin: 0.5in; }
          body { font-family: 'Arial', sans-serif; font-size: 9pt; line-height: 1.2; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 12px; table-layout: fixed; }
          th, td { border: 2pt solid black; padding: 5pt; font-size: 9pt; text-align: left; word-wrap: break-word; }
          .header-table td { border: none; }
          .section-header { background-color: #f1f5f9; font-weight: bold; }
          .sub-header { background-color: #f8fafc; font-weight: bold; }
          .title { text-align: center; font-weight: bold; }
          .footer { margin-top: 30px; font-size: 8pt; font-weight: bold; border-top: 2pt solid black; padding-top: 10px; }
          .score-box { font-size: 9pt; color: #1e3a8a; text-align: center; font-weight: bold; }
        </style>
      `;
      
      const header = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>Contractor Evaluation Record</title>${style}</head><body>
      `;
      
      const content = `
        <table class="header-table">
          <tr>
            <td width="20%"><b>REVISION NO. 01</b></td>
            <td width="60%" class="title">
              <div style="font-size: 8.5pt;">BRINDAVAN AGRO INDUSTRIES PVT LTD, CHHATA, MATHURA</div>
              <div>CONTRACTOR PERFORMANCE EVALUATION REPORT FORM</div>
              <div style="font-size: 8pt;">BAIL-S-110-FRM-01-00-00-04</div>
            </td>
            <td width="20%"></td>
          </tr>
        </table>

        <table>
          <tr class="section-header">
            <td width="30">A</td>
            <td>CONTRACTOR DETAILS</td>
          </tr>
          <tr>
            <td width="30">1</td>
            <td><b>Contract Company/Business Name:</b> ${formData.contractCompany || '-'}</td>
          </tr>
          <tr>
            <td width="30">2</td>
            <td><b>Brief Description of work undertaken:</b><br/>${formData.workDescription || '-'}</td>
          </tr>
          ${formData.lotoMode === '5' ? `
          <tr>
            <td width="30">3</td>
            <td><b>PTW Control Number:</b> ${formData.ptwNumber || ''}</td>
          </tr>
          <tr>
            <td width="30">4</td>
            <td><b>SME Supervisor (Live Work):</b> ${formData.ptwSme || ''}</td>
          </tr>
          <tr>
            <td width="30">5</td>
            <td>
              <table style="border: none; margin: 0;">
                <tr style="border: none;">
                  <td style="border: none;"><b>Project Completion</b></td>
                  <td style="border: none;"><b>SCHEDULED:</b> ${formData.projectCompletion.scheduled || ''}</td>
                  <td style="border: none;"><b>ACTUAL:</b> ${formData.projectCompletion.actual || ''}</td>
                </tr>
              </table>
            </td>
          </tr>
          ` : `
          <tr>
            <td width="30">3</td>
            <td>
              <table style="border: none; margin: 0;">
                <tr style="border: none;">
                  <td style="border: none;"><b>Project Completion</b></td>
                  <td style="border: none;"><b>SCHEDULED:</b> ${formData.projectCompletion.scheduled || ''}</td>
                  <td style="border: none;"><b>ACTUAL:</b> ${formData.projectCompletion.actual || ''}</td>
                </tr>
              </table>
            </td>
          </tr>
          `}
        </table>

        <table>
          <tr class="section-header">
            <td width="30">B</td>
            <td>CONTRACTOR SAFETY MANAGEMENT SYSTEM</td>
          </tr>
          <tr>
            <td colspan="2"><i>SCORING CRITERIA: Very Good:- 5, Good:- 4, Average:- 3, Need Improvement:- 2, Inadequate:- 1</i></td>
          </tr>
        </table>

        <table>
          <tr class="sub-header">
            <th width="40" style="text-align: center">S.NO</th>
            <th>PERFORMANCE PARAMETERS</th>
            <th width="80" style="text-align: center">EVALUATED?</th>
            <th width="60" style="text-align: center">RATING</th>
            <th width="100">COMMENTS</th>
          </tr>
          ${safetyMetrics.map(m => `
            <tr>
              <td style="text-align: center">${m.id}</td>
              <td>${m.parameter}</td>
              <td style="text-align: center">${m.evaluated || '-'}</td>
              <td style="text-align: center"><b>${m.rating || '-'}</b></td>
              <td>${m.comments || '-'}</td>
            </tr>
          `).join('')}
        </table>

        <table>
          <tr class="section-header">
            <td width="30">C</td>
            <td>CONTRACTOR COMPETENCE & TRAINING</td>
          </tr>
        </table>

        <table>
          <tr class="sub-header">
            <th width="40" style="text-align: center">S.NO</th>
            <th>PERFORMANCE PARAMETERS</th>
            <th width="80" style="text-align: center">EVALUATED?</th>
            <th width="60" style="text-align: center">RATING</th>
            <th width="100">COMMENTS</th>
          </tr>
          ${competenceMetrics.map(m => `
            <tr>
              <td style="text-align: center">${m.id}</td>
              <td>${m.parameter}</td>
              <td style="text-align: center">${m.evaluated || '-'}</td>
              <td style="text-align: center"><b>${m.rating || '-'}</b></td>
              <td>${m.comments || '-'}</td>
            </tr>
          `).join('')}
        </table>

        <table style="margin-top: 10px;">
          <tr>
            <td class="sub-header" width="70%">OVERALL RATING (Inadequate: 0-60, Deficient: 61-75, Good: 76-90, Superior: 91-100)</td>
            <td class="score-box" width="30%">${overallScore}% — ${ratingInfo.label}</td>
          </tr>
          <tr>
            <td colspan="2"><b>Overall Feedback:</b><br/><br/>${formData.overallFeedback || 'No feedback provided.'}</td>
          </tr>
        </table>

        <table>
          <tr class="section-header">
            <td colspan="2">EVALUATED BY:</td>
          </tr>
          <tr>
            <td height="80"><b>Safety Manager (Signature & Title)</b><br/><br/>${formData.safetyManager || '____________________'}</td>
            <td height="80"><b>Department In charge (Signature & Title)</b><br/><br/>${formData.deptInCharge || '____________________'}</td>
          </tr>
        </table>

        <div class="footer">
          <table class="header-table" style="margin: 0;">
            <tr>
              <td>
                PREPARED BY: SAFETY MANAGER<br/>
                APPROVED BY: VP TECHNICAL<br/>
                REVISION DATE: 01.08.2024
              </td>
              <td style="text-align: right; vertical-align: bottom;">
                <i>“CLASSIFIED – CONFIDENTIAL FOR INTERNAL USE ONLY”</i>
              </td>
            </tr>
          </table>
        </div>
      `;
      
      const footer = "</body></html>";
      const blob = new Blob(['\ufeff', header + content + footer], { type: 'application/msword' });
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
    if (score >= 61) return { label: 'DEFICIENT', color: 'text-yellow-600' };
    return { label: 'INADEQUATE', color: 'text-red-600' };
  };

  const ratingInfo = getRatingLabel(overallScore);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Header Navigation */}
      <nav className="sticky top-0 z-50 bg-white/60 backdrop-blur-2xl border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
              title="Back"
            >
              <ArrowLeft size={20} />
            </motion.button>
            <div className="h-8 w-px bg-slate-200/50 mx-2" />
            <div className="flex flex-col">
              <h1 className="text-[9px] font-black tracking-tighter text-slate-900 uppercase leading-none">Contractor Evaluation</h1>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">BAIL-S-110-FRM-01-00-00-04</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {savedAssessments.length > 0 && (
              <motion.button 
                whileHover={{ y: -2 }}
                onClick={() => setShowHistoryModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-[10px] uppercase tracking-widest hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
                title="Load Saved Assessments"
              >
                <FolderOpen size={16} />
                <span className="hidden md:inline">Saved reports</span>
              </motion.button>
            )}
            <motion.button 
              whileHover={{ y: -2 }}
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-black text-[10px] uppercase tracking-widest hover:border-green-500 hover:text-green-600 transition-all active:scale-95 shadow-sm"
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
            </motion.button>
            <div className="relative">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                id="download-report-btn"
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:bg-[#16a34a] transition-all overflow-hidden relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <Download size={16} />
                Download
                <ChevronDown size={14} className={`transition-transform duration-300 ${showDownloadMenu ? 'rotate-180' : ''}`} />
              </motion.button>
              
              <AnimatePresence>
                {showDownloadMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[60]"
                  >
                    <button
                      onClick={() => setShowPreviewModal(true)}
                      className="w-full flex items-center gap-3 px-6 py-4 text-xs font-black text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors border-b border-slate-50"
                    >
                      <FolderOpen size={16} className="text-blue-500" />
                      Preview Report
                    </button>
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
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-5xl mx-auto px-6 py-12 space-y-12"
      >
        
        {/* Main Document Body - Single Border Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white border-4 border-slate-900 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col"
        >
          {/* Form Header Area (Inside Border) */}
          <div className="p-10 border-b-4 border-slate-900 relative overflow-hidden group">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-red-400/10 rounded-full blur-3xl group-hover:bg-red-400/20 transition-colors animate-pulse" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl group-hover:bg-blue-400/20 transition-colors animate-pulse" style={{ animationDelay: '1s' }} />
            
            <div className="flex flex-col items-center justify-center relative z-10">
              <div className="w-full flex justify-between items-start mb-6">
                <div className="px-5 py-2 bg-slate-900 text-white rounded-full text-[9px] font-black tracking-widest uppercase">REVISION NO. 01</div>
                <div className="text-[10px] font-black tracking-widest text-[#16a34a] uppercase">BAIL-S-110-FRM-01-00-00-04</div>
              </div>

              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-display font-black text-slate-900 tracking-tight uppercase leading-tight">
                  BRINDAVAN AGRO INDUSTRIES PVT LTD <br/>
                  <span className="text-slate-400">CHHATA, MATHURA</span>
                </h2>
                <div className="h-1.5 w-32 bg-[#16a34a] mx-auto mt-6 rounded-full shadow-lg shadow-green-200" />
                <p className="mt-6 text-xs font-black text-[#16a34a] tracking-[0.4em] uppercase">CONTRACTOR PERFORMANCE EVALUATION REPORT FORM</p>
              </div>
            </div>
          </div>

          <div className="divide-y-4 divide-slate-900">
            {/* Section A: Contractor Details (Row) */}
            <div className="bg-white">
              <div className="flex border-b-4 border-slate-900">
                <div className="w-12 border-r-4 border-slate-900 flex items-center justify-center bg-slate-50 font-black text-sm">A</div>
                <div className="flex-1 px-4 py-2 bg-slate-50 text-[10px] font-black uppercase tracking-widest flex items-center">Contractor Details</div>
              </div>

              <div className="divide-y-2 divide-slate-100">
                {/* Row 1: Company Name */}
                <div className="flex group">
                  <div className="w-12 border-r-2 border-slate-100 flex items-center justify-center font-black text-[10px] text-slate-300 group-hover:text-blue-500 transition-colors">1</div>
                  <div className="w-1/3 px-4 py-3 border-r-2 border-slate-100 flex items-center">
                    <span className="text-[10px] font-black uppercase tracking-tight text-slate-900">Contract Company / Business Name:</span>
                  </div>
                  <div className="flex-1 px-4 py-2">
                    <input 
                      type="text" 
                      className={`w-full bg-slate-50/50 border ${validationErrors.contractCompany ? 'border-red-500 bg-red-50/30' : 'border-slate-100'} rounded-lg px-3 py-1.5 text-[11px] font-bold focus:border-blue-500 focus:bg-white outline-none transition-all`}
                      placeholder="Enter company name... *"
                      value={formData.contractCompany}
                      onChange={e => {
                        setFormData({...formData, contractCompany: e.target.value});
                        if (validationErrors.contractCompany) setValidationErrors(prev => ({ ...prev, contractCompany: '' }));
                      }}
                    />
                    {validationErrors.contractCompany && <span className="text-[9px] text-red-500 font-bold ml-1">{validationErrors.contractCompany}</span>}
                  </div>
                </div>

                {/* Row 2: Work Description */}
                <div className="flex group">
                  <div className="w-12 border-r-2 border-slate-100 flex items-center justify-center font-black text-[10px] text-slate-300 group-hover:text-blue-500 transition-colors">2</div>
                  <div className="w-1/3 px-4 py-3 border-r-2 border-slate-100 flex items-center">
                    <span className="text-[10px] font-black uppercase tracking-tight text-slate-900">Brief Description of work undertaken:</span>
                  </div>
                  <div className="flex-1 px-4 py-2">
                    <textarea 
                      className={`w-full h-20 bg-slate-50/50 border ${validationErrors.workDescription ? 'border-red-500 bg-red-50/30' : 'border-slate-100'} rounded-lg px-3 py-1.5 text-[11px] font-bold focus:border-blue-500 focus:bg-white outline-none transition-all resize-none`}
                      placeholder="Enter description..."
                      value={formData.workDescription}
                      onChange={e => {
                        setFormData({...formData, workDescription: e.target.value});
                        if (validationErrors.workDescription) setValidationErrors(prev => ({ ...prev, workDescription: '' }));
                      }}
                    />
                    {validationErrors.workDescription && <span className="text-[9px] text-red-500 font-bold ml-1">{validationErrors.workDescription}</span>}
                  </div>
                </div>

                {/* Row 3: Project Completion */}
                <div className="flex group">
                  <div className="w-12 border-r-2 border-slate-100 flex items-center justify-center font-black text-[10px] text-slate-300 group-hover:text-blue-500 transition-colors">3</div>
                  <div className="w-1/3 px-4 py-3 border-r-2 border-slate-100 flex items-center">
                    <span className="text-[10px] font-black uppercase tracking-tight text-slate-900">Project Completion:</span>
                  </div>
                  <div className="flex-1 px-4 py-2 flex items-center gap-6">
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400">Scheduled:</span>
                       <input 
                         type="date" 
                         className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-bold focus:border-blue-500 outline-none"
                         value={formData.projectCompletion?.scheduled}
                         onChange={e => setFormData({...formData, projectCompletion: { ...formData.projectCompletion, scheduled: e.target.value }})}
                       />
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400">Actual:</span>
                       <input 
                         type="date" 
                         className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-bold focus:border-blue-500 outline-none"
                         value={formData.projectCompletion?.actual}
                         onChange={e => setFormData({...formData, projectCompletion: { ...formData.projectCompletion, actual: e.target.value }})}
                       />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section B: Safety Management System (Row) */}
            <div className="p-10 space-y-8 bg-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#16a34a] text-white shadow-lg flex items-center justify-center font-black text-sm">B</div>
                  <h3 className="text-xs font-black uppercase tracking-[0.25em] text-slate-900">Safety Management System</h3>
                </div>
                <div className="flex items-center gap-3 px-4 py-2.5 bg-green-50 rounded-xl border border-green-100 text-[9px] font-black text-green-700 uppercase tracking-widest">
                  <Info size={14} />
                  Scoring Criteria: Very Good (5) to Inadequate (1)
                </div>
              </div>

              <div className="border-4 border-slate-900 rounded-[2rem] overflow-hidden bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white">
                        <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest w-16">S.No</th>
                        <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest">Performance Parameters</th>
                        <th className="px-6 py-4 text-center text-[9px] font-black uppercase tracking-widest w-40">Evaluated?</th>
                        <th className="px-6 py-4 text-center text-[9px] font-black uppercase tracking-widest w-48">Rating</th>
                        <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest">Comments</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-slate-100">
                      {safetyMetrics.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-5 text-xs font-black text-slate-900 center-text border-r-2 border-slate-100">{row.id}</td>
                          <td className="px-6 py-5 text-xs font-bold text-slate-700 leading-relaxed border-r-2 border-slate-100">{row.parameter}</td>
                          <td className="px-6 py-5 border-r-2 border-slate-100">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => updateSafetyMetric(row.id, 'evaluated', 'YES')}
                                className={`w-12 py-1.5 rounded-lg text-[9px] font-black transition-all ${row.evaluated === 'YES' ? 'bg-[#16a34a] text-white shadow-md' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                              >YES</button>
                              <button 
                                onClick={() => updateSafetyMetric(row.id, 'evaluated', 'NO')}
                                className={`w-12 py-1.5 rounded-lg text-[9px] font-black transition-all ${row.evaluated === 'NO' ? 'bg-red-500 text-white shadow-md' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                              >NO</button>
                            </div>
                          </td>
                          <td className="px-6 py-5 border-r-2 border-slate-100">
                            <RatingSelector 
                              value={row.rating}
                              onChange={(v) => updateSafetyMetric(row.id, 'rating', v)}
                              hasError={!!validationErrors[`safety_${row.id}`]}
                            />
                          </td>
                          <td className="px-6 py-5">
                            <input 
                              type="text" 
                              className="w-full h-9 bg-slate-50/50 border border-transparent rounded-lg px-3 text-[11px] font-bold text-slate-600 focus:bg-white focus:border-blue-300 outline-none transition-all"
                              value={row.comments || ''}
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

            {/* Section C: Competence & Training (Row) */}
            <div className="p-10 space-y-8 bg-white">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white shadow-lg flex items-center justify-center font-black text-sm">C</div>
                <h3 className="text-xs font-black uppercase tracking-[0.25em] text-slate-900">Contractor Competence & Training</h3>
              </div>

              <div className="border-4 border-slate-900 rounded-[2rem] overflow-hidden bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white">
                        <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest w-16">S.No</th>
                        <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest">Performance Parameters</th>
                        <th className="px-6 py-4 text-center text-[9px] font-black uppercase tracking-widest w-40">Evaluated?</th>
                        <th className="px-6 py-4 text-center text-[9px] font-black uppercase tracking-widest w-48">Rating</th>
                        <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest">Comments</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-slate-100">
                      {competenceMetrics.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-5 text-xs font-black text-slate-900 center-text border-r-2 border-slate-100">{row.id}</td>
                          <td className="px-6 py-5 text-xs font-bold text-slate-700 leading-relaxed border-r-2 border-slate-100">{row.parameter}</td>
                          <td className="px-6 py-5 border-r-2 border-slate-100">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => updateCompetenceMetric(row.id, 'evaluated', 'YES')}
                                className={`w-12 py-1.5 rounded-lg text-[9px] font-black transition-all ${row.evaluated === 'YES' ? 'bg-[#16a34a] text-white shadow-md' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                              >YES</button>
                              <button 
                                onClick={() => updateCompetenceMetric(row.id, 'evaluated', 'NO')}
                                className={`w-12 py-1.5 rounded-lg text-[9px] font-black transition-all ${row.evaluated === 'NO' ? 'bg-red-500 text-white shadow-md' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                              >NO</button>
                            </div>
                          </td>
                          <td className="px-6 py-5 border-r-2 border-slate-100">
                            <RatingSelector 
                              value={row.rating}
                              onChange={(v) => updateCompetenceMetric(row.id, 'rating', v)}
                              hasError={!!validationErrors[`competence_${row.id}`]}
                            />
                          </td>
                          <td className="px-6 py-5">
                            <input 
                              type="text" 
                              className="w-full h-9 bg-slate-50/50 border border-transparent rounded-lg px-3 text-[11px] font-bold text-slate-600 focus:bg-white focus:border-blue-300 outline-none transition-all"
                              value={row.comments || ''}
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

            {/* Overall Rating & Feedback (Inside Border) */}
            <div className="p-10 bg-slate-50 space-y-10">
               <div className="flex flex-col md:flex-row items-stretch justify-between gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3 ml-2">
                       <Info size={16} className="text-slate-400" />
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Overall Feedback</h4>
                    </div>
                    <textarea 
                      className="w-full h-44 bg-white border-4 border-slate-900 rounded-[2rem] p-8 text-sm font-bold text-slate-900 focus:bg-blue-50/10 transition-all outline-none resize-none shadow-md"
                      placeholder="Enter consolidated remarks..."
                      value={formData.overallFeedback || ''}
                      onChange={e => setFormData({...formData, overallFeedback: e.target.value})}
                    />
                  </div>

                  <div className="w-full md:w-80 flex flex-col items-center justify-center p-8 bg-white border-4 border-slate-900 rounded-[2rem] shadow-xl relative overflow-hidden group">
                     <div className="absolute inset-0 bg-blue-500/5 group-hover:scale-110 transition-transform duration-700" />
                     <div className="relative z-10 text-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-4">Overall Score</span>
                        <div className="text-6xl font-black text-slate-900 tracking-tighter mb-2">{overallScore}%</div>
                        <div className={`text-[12px] font-black px-5 py-2 rounded-full border-2 uppercase tracking-widest ${ratingInfo.color} bg-white shadow-sm`}>
                          {ratingInfo.label}
                        </div>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t-4 border-slate-900 pt-10">
                  <div className="space-y-6">
                    <div className="h-px bg-slate-200 w-full" />
                    <input 
                      type="text"
                      placeholder="Safety Manager Name"
                      className={`w-full text-center text-sm font-black uppercase tracking-widest text-slate-900 bg-transparent outline-none border-b-2 ${validationErrors.safetyManager ? 'border-red-500' : 'border-transparent focus:border-blue-500'} py-2 transition-all`}
                      value={formData.safetyManager || ''}
                      onChange={e => {
                        setFormData({...formData, safetyManager: e.target.value});
                        if (validationErrors.safetyManager) setValidationErrors(prev => ({ ...prev, safetyManager: '' }));
                      }}
                    />
                    <p className="text-[10px] font-black text-center text-slate-400 tracking-widest uppercase">Safety Manager Signature & Title</p>
                  </div>
                  <div className="space-y-6">
                    <div className="h-px bg-slate-200 w-full" />
                    <input 
                      type="text"
                      placeholder="Dept. Incharge Name"
                      className={`w-full text-center text-sm font-black uppercase tracking-widest text-slate-900 bg-transparent outline-none border-b-2 ${validationErrors.deptInCharge ? 'border-red-500' : 'border-transparent focus:border-blue-500'} py-2 transition-all`}
                      value={formData.deptInCharge || ''}
                      onChange={e => {
                        setFormData({...formData, deptInCharge: e.target.value});
                        if (validationErrors.deptInCharge) setValidationErrors(prev => ({ ...prev, deptInCharge: '' }));
                      }}
                    />
                    <p className="text-[10px] font-black text-center text-slate-400 tracking-widest uppercase">Department Incharge Signature & Title</p>
                  </div>
               </div>
            </div>

            {/* Document Footer (Inside Border) */}
            <div className="px-10 py-8 border-t-4 border-slate-900 bg-[#f8fafc] flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col gap-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-900">PREPARED BY: SAFETY MANAGER</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">APPROVED BY: VP TECHNICAL</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">REVISION DATE: 01.08.2024</div>
              </div>
              <div className="flex items-center gap-4 bg-white border-2 border-slate-200 px-6 py-3 rounded-full shadow-sm">
                <Shield size={16} className="text-blue-500" />
                <span className="text-[10px] font-black text-slate-900 uppercase italic tracking-widest">
                  Confidential Property of BAIL
                </span>
              </div>
            </div>
          </div>
        </motion.div>

      </motion.main>

      {/* Official Print Layout */}
      {/* ... keeping previous logic ... */}      {/* History Modal */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl border border-white overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                      <FolderOpen size={24} />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Saved Assessments</h2>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{savedAssessments.length} Reports Stored</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowHistoryModal(false)}
                    className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      placeholder="Search assessments..."
                      className="w-full h-12 bg-white border border-slate-200 rounded-xl px-12 text-sm font-bold focus:border-blue-500 outline-none transition-all shadow-sm"
                      value={searchQuery || ''}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                    <Info size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  </div>
                  <div className="flex gap-2">
                    <select 
                      className="h-12 bg-white border border-slate-200 rounded-xl px-4 text-xs font-black uppercase tracking-widest text-slate-600 outline-none focus:border-blue-500 shadow-sm"
                      value={sortBy || 'timestamp'}
                      onChange={e => setSortBy(e.target.value as any)}
                    >
                      <option value="timestamp">Sort by Date</option>
                      <option value="company">Sort by Name</option>
                      <option value="score">Sort by Score</option>
                    </select>
                    <button 
                      onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                      className="px-4 h-12 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                    >
                      <ChevronDown className={`transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredAndSortedAssessments.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                      <FolderOpen size={32} className="text-slate-200" />
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                      {searchQuery ? 'No matching assessments found' : 'No saved assessments found'}
                    </p>
                  </div>
                ) : (
                  filteredAndSortedAssessments.map(assessment => (
                    <div 
                      key={assessment.key}
                      className="group p-5 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 rounded-[2rem] transition-all flex items-center justify-between gap-4 shadow-sm hover:shadow-md"
                    >
                      <div className="flex-1 cursor-pointer" onClick={() => loadAssessment(assessment)}>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                          {assessment.formData.contractCompany}
                        </h4>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(assessment.timestamp).toLocaleDateString()}
                          </span>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-white border border-slate-100 ${getRatingLabel(assessment.overallScore).color}`}>
                            Score: {assessment.overallScore}% — {getRatingLabel(assessment.overallScore).label}
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

      {/* Report Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 md:p-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-slate-100 w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-full border border-white/20"
            >
              <div className="p-8 bg-white border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 text-green-600 rounded-2xl">
                    <Printer size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Report Preview</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Verify content before exporting</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDownload('pdf')}
                    className="flex items-center gap-2 px-6 py-3 bg-[#0f172a] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Download size={18} />
                    Download PDF
                  </button>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="p-3 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 md:p-12 flex justify-center bg-slate-200/50">
                <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] origin-top scale-[0.6] md:scale-[0.85] lg:scale-100 mb-20">
                   {/* Create a static clone for preview to avoid ref issues during download */}
                   <div className="print-container" style={{ padding: '20mm' }}>
                      {/* Reuse the logic from print layout but here it's visible */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8pt' }}>
                        <div className="bold-900" style={{ width: '25%', fontSize: '10.5pt' }}>REVISION NO. 01</div>
                        <div style={{ width: '50%' }}>
                          <div className="header-title uppercase">BRINDAVAN AGRO INDUSTRIES PVT LTD, CHHATA, MATHURA</div>
                          <div className="header-subtitle uppercase">CONTRACTOR PERFORMANCE EVALUATION REPORT FORM</div>
                          <div className="header-code">BAIL-S-110-FRM-01-00-00-04</div>
                        </div>
                        <div style={{ width: '20%' }}></div>
                      </div>

                      <div className="grid-table">
                        <div className="grid-row section-header">
                          <div className="grid-cell col-index">A</div>
                          <div className="grid-cell flex-1 bold-900">CONTRACTOR DETAILS</div>
                        </div>
                        <div className="grid-row">
                          <div className="grid-cell col-index">1</div>
                          <div className="grid-cell flex-none w-[35%] bold-900 uppercase">Contract Company/Business Name:</div>
                          <div className="grid-cell flex-1 flex-grow bold-900 text-[11pt] uppercase" style={{ color: '#1e3a8a' }}>{formData.contractCompany}</div>
                        </div>
                        <div className="grid-row">
                          <div className="grid-cell col-index">2</div>
                          <div className="grid-cell flex-none w-[35%] bold-900 uppercase leading-[1.1]">Brief Description of work undertaken:</div>
                          <div className="grid-cell flex-1 flex-grow py-1.0 leading-snug">{formData.workDescription}</div>
                        </div>
                      </div>

                      <div className="grid-table mt-4">
                         <div className="grid-row section-header">
                            <div className="grid-cell col-index">B</div>
                            <div className="grid-cell flex-1 font-black">SAFETY MANAGEMENT SYSTEM</div>
                         </div>
                         <div className="grid-row py-1 italic text-[9.5pt] font-black" style={{ backgroundColor: '#fff', borderBottom: '1.5pt solid #000' }}>
                           <div className="w-full px-4" style={{ color: '#1e40af' }}>SCORING CRITERIA: Very Good:- 5, Good:- 4, Average:- 3, Need Improvement:- 2, Inadequate:- 1</div>
                         </div>
                         <div className="grid-row sub-header bold-900 text-[9.5pt]">
                            <div className="grid-cell col-index center-text">S.NO.</div>
                            <div className="grid-cell col-param uppercase center-text">PERFORMANCE PARAMETERS</div>
                            <div className="grid-cell col-eval uppercase leading-[1.1] center-text">EVALUATED? (Y/N)</div>
                            <div className="grid-cell col-rating uppercase center-text">RATING</div>
                         </div>
                         {safetyMetrics.slice(0, 5).map(row => (
                            <div className="grid-row" key={row.id}>
                              <div className="grid-cell col-index center-text font-black">{row.id}</div>
                              <div className="grid-cell col-param font-medium" style={{ fontSize: '10pt' }}>{row.parameter}</div>
                              <div className="grid-cell col-eval center-text font-black">{row.evaluated || '-'}</div>
                              <div className="grid-cell col-rating center-text bold-900">{row.rating || '-'}</div>
                            </div>
                         ))}
                         <div className="grid-row p-4 justify-center bg-slate-50 italic text-[10px] text-slate-400">... Preview only showing partial list ...</div>
                      </div>

                      <div className="mt-10 p-6 border-2 border-black">
                        <div className="flex justify-between items-center mb-4">
                           <span className="font-black uppercase tracking-widest text-xs">Total Compliance Score</span>
                           <span className="text-2xl font-black">{overallScore}%</span>
                        </div>
                        <p className="text-xs font-bold leading-relaxed">{formData.overallFeedback}</p>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
          padding: '10mm'
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @page { size: A4; margin: 0; }
          
          .print-container { 
            display: flex !important;
            flex-direction: column !important;
            width: 100% !important; 
            font-family: "Arial", sans-serif !important;
            background-color: #ffffff !important;
            color: #000000 !important;
            font-size: 9pt !important;
            line-height: 1.1 !important;
          }

          .grid-table { 
            border: 2pt solid #000 !important;
            margin-bottom: 6pt !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }

          .grid-row { 
            display: flex !important;
            flex-direction: row !important;
            border-bottom: 2pt solid #000 !important;
            width: 100% !important;
            min-height: 18pt !important;
            box-sizing: border-box !important;
          }

          .grid-row:last-child {
            border-bottom: none !important;
          }

          .grid-cell { 
            border-right: 2pt solid #000 !important;
            padding: 4pt 6pt !important; 
            display: flex !important;
            align-items: center !important;
            word-break: break-word !important; 
            box-sizing: border-box !important;
            font-size: 9pt !important;
          }

          .grid-cell:last-child {
            border-right: none !important;
          }

          .section-header { 
            background-color: #f1f5f9 !important; 
            font-weight: 900 !important; 
            text-transform: uppercase !important; 
            min-height: 20pt !important;
            font-size: 9pt !important;
          }
          .sub-header { 
            background-color: #f8fafc !important; 
            font-weight: bold !important; 
            justify-content: center !important; 
            text-align: center !important; 
            font-size: 9pt !important; 
          }
          
          .col-index { flex: 0 0 5% !important; max-width: 5% !important; justify-content: center !important; font-weight: 900 !important; }
          .col-param { flex: 0 0 55% !important; max-width: 55% !important; }
          .col-eval  { flex: 0 0 13% !important; max-width: 13% !important; justify-content: center !important; text-align: center !important; }
          .col-rating { flex: 0 0 9% !important; max-width: 9% !important; justify-content: center !important; font-weight: 900 !important; }
          .col-comments { flex: 0 0 18% !important; max-width: 18% !important; font-style: italic !important; color: #1e293b !important; }
          
          .header-title { font-size: 10pt !important; font-weight: 900 !important; text-align: center !important; width: 100% !important; line-height: 1.1 !important; }
          .header-subtitle { font-size: 9pt !important; font-weight: 900 !important; margin: 2pt 0 !important; text-align: center !important; width: 100% !important; }
          .header-code { font-size: 9pt !important; font-weight: 900 !important; text-align: center !important; width: 100% !important; }
          
          .center-text { justify-content: center !important; text-align: center !important; }
          .bold-900 { font-weight: 900 !important; }
          
          @media print {
            body > div#root > *:not(.print-root) { display: none !important; }
            #root { padding: 0 !important; margin: 0 !important; background: white !important; }
            .print-root { position: relative !important; left: 0 !important; top: 0 !important; padding: 12mm 10mm !important; opacity: 1 !important; }
          }
        `}} />
        
        <div className="print-container">
          {/* Top Header Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8pt' }}>
            <div className="bold-900" style={{ width: '25%', fontSize: '9pt' }}>REVISION NO. 01</div>
            <div style={{ width: '50%' }}>
              <div className="header-title uppercase">BRINDAVAN AGRO INDUSTRIES PVT LTD, CHHATA, MATHURA</div>
              <div className="header-subtitle uppercase">CONTRACTOR PERFORMANCE EVALUATION REPORT FORM</div>
              <div className="header-code">BAIL-S-110-FRM-01-00-00-04</div>
            </div>
            <div style={{ width: '20%' }}></div>
          </div>

          {/* Section A: Contractor Details */}
          <div className="grid-table">
            <div className="grid-row section-header">
              <div className="grid-cell col-index">A</div>
              <div className="grid-cell flex-1 bold-900">CONTRACTOR DETAILS</div>
            </div>
            <div className="grid-row">
              <div className="grid-cell col-index">1</div>
              <div className="grid-cell flex-none w-[35%] bold-900 uppercase">Contract Company/Business Name:</div>
              <div className="grid-cell flex-1 flex-grow bold-900 uppercase" style={{ color: '#1e3a8a' }}>{formData.contractCompany}</div>
            </div>
            <div className="grid-row">
              <div className="grid-cell col-index">2</div>
              <div className="grid-cell flex-none w-[35%] bold-900 uppercase leading-[1.1]">Brief Description of work undertaken:</div>
              <div className="grid-cell flex-1 flex-grow py-1.0 leading-snug">{formData.workDescription}</div>
            </div>
            {formData.lotoMode === '5' && (
              <>
                <div className="grid-row">
                  <div className="grid-cell col-index">3</div>
                  <div className="grid-cell flex-none w-[35%] bold-900 uppercase">PTW Control Number:</div>
                  <div className="grid-cell flex-1 flex-grow font-black">{formData.ptwNumber}</div>
                </div>
                <div className="grid-row">
                  <div className="grid-cell col-index">4</div>
                  <div className="grid-cell flex-none w-[35%] bold-900 uppercase">SME Supervisor:</div>
                  <div className="grid-cell flex-1 flex-grow font-black">{formData.ptwSme}</div>
                </div>
              </>
            )}
            <div className="grid-row">
              <div className="grid-cell col-index">{formData.lotoMode === '5' ? '5' : '3'}</div>
              <div className="grid-cell flex-none w-[35%] bold-900 uppercase">Project Completion</div>
              <div className="grid-cell sub-header w-[12%] center-text" style={{ flex: '0 0 12%' }}>SCHEDULED</div>
              <div className="grid-cell w-[13%] center-text bold-900" style={{ flex: '0 0 13%' }}>{formData.projectCompletion.scheduled}</div>
              <div className="grid-cell sub-header w-[12%] center-text" style={{ flex: '0 0 12%' }}>ACTUAL</div>
              <div className="grid-cell w-[13%] center-text bold-900" style={{ flex: '0 0 13%' }}>{formData.projectCompletion.actual}</div>
            </div>
          </div>

          {/* Section B: Safety Management System */}
          <div className="grid-table">
            <div className="grid-row section-header">
              <div className="grid-cell col-index">B</div>
              <div className="grid-cell flex-1 font-black">CONTRACTOR SAFETY MANAGEMENT SYSTEM</div>
            </div>
            <div className="grid-row py-1 italic font-black" style={{ backgroundColor: '#fff', borderBottom: '2pt solid #000' }}>
              <div className="w-full px-4" style={{ color: '#1e40af' }}>SCORING CRITERIA: Very Good:- 5, Good:- 4, Average:- 3, Need Improvement:- 2, Inadequate:- 1</div>
            </div>
            <div className="grid-row sub-header bold-900">
              <div className="grid-cell col-index center-text">S.NO.</div>
              <div className="grid-cell col-param uppercase center-text">PERFORMANCE PARAMETERS</div>
              <div className="grid-cell col-eval uppercase leading-[1.1] center-text">EVALUATED?<br/>(YES/NO)</div>
              <div className="grid-cell col-rating uppercase center-text">RATING</div>
              <div className="grid-cell col-comments uppercase center-text">COMMENTS</div>
            </div>
            {safetyMetrics.map(row => (
              <div className="grid-row" key={row.id}>
                <div className="grid-cell col-index center-text font-black">{row.id}</div>
                <div className="grid-cell col-param leading-[1.1] py-1.5 px-4 font-medium">{row.parameter}</div>
                <div className="grid-cell col-eval px-0 bold-900 center-text">{row.evaluated}</div>
                <div className="grid-cell col-rating center-text bold-900">{row.rating}</div>
                <div className="grid-cell col-comments leading-[1.1] py-1.5 px-2">{row.comments}</div>
              </div>
            ))}
          </div>

          {/* Section C: Competence & Training */}
          <div className="grid-table">
            <div className="grid-row section-header">
              <div className="grid-cell col-index">C</div>
              <div className="grid-cell flex-1 bold-900">CONTRACTOR COMPETENCE & TRAINING</div>
            </div>
            <div className="grid-row sub-header bold-900">
              <div className="grid-cell col-index center-text">S.NO.</div>
              <div className="grid-cell col-param uppercase center-text">PERFORMANCE PARAMETERS</div>
              <div className="grid-cell col-eval uppercase leading-[1.1] center-text">EVALUATED?<br/>(YES/NO)</div>
              <div className="grid-cell col-rating uppercase center-text">RATING</div>
              <div className="grid-cell col-comments uppercase center-text">COMMENTS</div>
            </div>
            {competenceMetrics.map(row => (
              <div className="grid-row" key={row.id}>
                <div className="grid-cell col-index center-text font-black">{row.id}</div>
                <div className="grid-cell col-param leading-[1.1] py-1.5 px-4 font-medium">{row.parameter}</div>
                <div className="grid-cell col-eval px-0 bold-900 center-text">{row.evaluated}</div>
                <div className="grid-cell col-rating center-text bold-900">{row.rating}</div>
                <div className="grid-cell col-comments leading-[1.1] py-1.5 px-2">{row.comments}</div>
              </div>
            ))}
          </div>

          {/* Rating Summary Area */}
          <div className="grid-table">
            <div className="grid-row sub-header">
              <div className="grid-cell flex-[0.7] !flex-[0 _0_70%] justify-start px-6 bold-900 uppercase">
                OVERALL RATING (Inadequate: 0-60, Deficient: 61-75, Good: 76-90, Superior: 91-100)
              </div>
              <div className="grid-cell flex-[0.3] !flex-[0_0_30%] center-text bold-900 text-[9pt]" style={{ borderLeft: '2pt solid #000' }}>
                {overallScore}% — {ratingInfo.label}
              </div>
            </div>
            <div className="grid-row min-h-[45pt] flex-col items-start p-3" style={{ borderTop: 'none' }}>
              <div className="bold-900 mb-1.5 uppercase text-[9pt]">Overall Feedback:</div>
              <div className="text-[9.5pt] leading-normal w-full px-2 font-medium">{formData.overallFeedback}</div>
            </div>
          </div>

          {/* Evaluated By Section */}
          <div className="grid-table mt-1.5">
            <div className="grid-row section-header" style={{ minHeight: '18pt' }}>
              <div className="grid-cell flex-1 font-black">EVALUATED BY:</div>
            </div>
            <div className="grid-row h-[80pt]">
              <div className="grid-cell w-1/2 !flex-[0_0_50%] flex-col items-start p-3">
                <div className="font-black mb-auto uppercase">Safety Manager (Signature & Title)</div>
                <div className="border-b-[2pt] w-[95%] font-black h-6 mb-1 flex items-end pb-1 ml-1 text-[9pt]" style={{ borderColor: '#000' }}>
                  {formData.safetyManager}
                </div>
              </div>
              <div className="grid-cell w-1/2 !flex-[0_0_50%] flex-col items-start p-3">
                <div className="font-black mb-auto uppercase">Department In charge (Signature & Title)</div>
                <div className="border-b-[2pt] w-[95%] font-black h-6 mb-1 flex items-end pb-1 ml-1 text-[9pt]" style={{ borderColor: '#000' }}>
                  {formData.deptInCharge}
                </div>
              </div>
            </div>
          </div>

          {/* Professional Footer */}
          <div className="mt-6 pt-3 flex justify-between items-end" style={{ borderTop: '1.5pt solid #000' }}>
            <div className="text-[9pt] font-black uppercase leading-normal">
              <div>PREPARED BY: SAFETY MANAGER</div>
              <div>APPROVED BY: VP TECHNICAL</div>
              <div>REVISION DATE: 01.08.2024</div>
            </div>
            <div className="text-[9pt] font-black uppercase italic tracking-tighter">
              “CLASSIFIED – CONFIDENTIAL FOR INTERNAL USE ONLY”
            </div>
          </div>
        </div>
      </div>
      {/* Error Notification */}
      <AnimatePresence>
        {saveError && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-[100] px-6 py-4 bg-red-600 text-white rounded-2xl shadow-2xl flex items-center gap-3 min-w-[320px]"
          >
            <AlertCircle size={20} className="shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-80 leading-none mb-1">Save Failed</span>
              <p className="text-xs font-bold">{saveError}</p>
            </div>
            <button 
              onClick={() => setSaveError(null)}
              className="ml-auto p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
