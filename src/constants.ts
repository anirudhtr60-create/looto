import { Mode, Question, DecisionNode, Language } from './types';

export const MODES: Record<number, Mode> = {
  0: {
    id: 0,
    name: 'MODE 0',
    color: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.2)',
    icon: 'Shield',
    translations: {
      en: {
        title: 'Normal Operation',
        description: 'The task can be performed during normal operation with standard safety protocols.',
        requirements: ['Ensure ZERO ACCESS to hazard zones', 'Safeguarding must be in place', 'Follow standard SOP'],
        examples: ['Visual inspection', 'Operating via HMI', 'Process monitoring']
      },
      hi: {
        title: 'सामान्य संचालन',
        description: 'मानक सुरक्षा प्रोटोकॉल के साथ सामान्य संचालन के दौरान कार्य किया जा सकता है।',
        requirements: ['खतरे वाले क्षेत्रों में शून्य पहुंच सुनिश्चित करें', 'सुरक्षा घेरा लगा होना चाहिए', 'मानक SOP का पालन करें'],
        examples: ['दृश्य निरीक्षण', 'HMI के माध्यम से संचालन', 'प्रक्रिया की निगरानी']
      }
    }
  },
  1: {
    id: 1,
    name: 'MODE 1',
    color: '#84cc16',
    bgColor: 'rgba(132, 204, 22, 0.1)',
    borderColor: 'rgba(132, 204, 22, 0.2)',
    icon: 'Hand',
    translations: {
      en: {
        title: 'Work Through Guard',
        description: 'Work is performed through an interlocked guard. Machine must be stopped.',
        requirements: ['Stop the machine', 'Work THROUGH interlocked guard', 'Prevent restart via interlock'],
        examples: ['Minor jam clearing', 'Tool adjustments', 'Measurements']
      },
      hi: {
        title: 'गार्ड के माध्यम से काम',
        description: 'काम इंटरलॉक्ड गार्ड के माध्यम से किया जाता है। मशीन को रोकना होगा।',
        requirements: ['मशीन रोकें', 'इंटरलॉक्ड गार्ड के माध्यम से काम करें', 'इंटरलॉक द्वारा पुनरारंभ को रोकें'],
        examples: ['मामूली जाम हटाना', 'उपकरण समायोजन', 'मापन']
      }
    }
  },
  2: {
    id: 2,
    name: 'MODE 2',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.2)',
    icon: 'User',
    translations: {
      en: {
        title: 'Full Body Access',
        description: 'Requires entry into hazard zone. Equipment must be stopped and locked.',
        requirements: ['Apply "LOCK" to interlocked door', 'Exclusive control via padlock', 'Stop the machine'],
        examples: ['Cleaning inside guards', 'Internal lubrication', 'Replacing components']
      },
      hi: {
        title: 'पूर्ण शरीर पहुंच',
        description: 'खतरे के क्षेत्र में प्रवेश की आवश्यकता है। उपकरण को रोकना और लॉक करना होगा।',
        requirements: ['इंटरलॉक्ड दरवाजे पर "लॉक" लगाएं', 'ताले के माध्यम से विशेष नियंत्रण', 'मशीन रोकें'],
        examples: ['गार्ड के अंदर सफाई', 'आंतरिक स्नेहन', 'घटकों को बदलना']
      }
    }
  },
  3: {
    id: 3,
    name: 'MODE 3',
    color: '#f97316',
    bgColor: 'rgba(249, 115, 22, 0.1)',
    borderColor: 'rgba(249, 115, 22, 0.2)',
    icon: 'Lock',
    translations: {
      en: {
        title: 'Full LOTO',
        description: 'Stop the machine and apply FULL Lockout-Tagout to all energy sources.',
        requirements: ['STOP THE MACHINE', 'Isolate ALL energy sources', 'Verify zero energy state'],
        examples: ['Major repair', 'Disassembly', 'Electrical maintenance']
      },
      hi: {
        title: 'पूर्ण LOTO',
        description: 'मशीन को रोकें और सभी ऊर्जा स्रोतों पर पूर्ण लॉकआउट-टैगआउट लागू करें।',
        requirements: ['मशीन रोकें', 'सभी ऊर्जा स्रोतों को अलग करें', 'शून्य ऊर्जा स्थिति सत्यापित करें'],
        examples: ['बड़ी मरम्मत', 'पुर्जों को अलग करना', 'विद्युत रखरखाव']
      }
    }
  },
  4: {
    id: 4,
    name: 'MODE 4',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
    icon: 'AlertTriangle',
    translations: {
      en: {
        title: 'Permit to Work',
        description: 'Required for energized troubleshooting where residual risk exists.',
        requirements: ['SME Risk Assessment', 'Approved Permit to Work', 'Continuous monitoring'],
        examples: ['Diagnosing while running', 'Energized observation', 'SME troubleshooting']
      },
      hi: {
        title: 'काम की अनुमति (Permit)',
        description: 'ऊर्जावान समस्या निवारण के लिए आवश्यक जहां अवशिष्ट जोखिम मौजूद है।',
        requirements: ['SME जोखिम मूल्यांकन', 'स्वीकृत काम की अनुमति', 'निरंतर निगरानी'],
        examples: ['चलते समय निदान', 'लाइव निरीक्षण', 'SME समस्या निवारण']
      }
    }
  }
};

export const QUESTIONS: Record<string, Question> = {
  Q1: {
    id: 'Q1',
    icon: 'Zap',
    translations: {
      en: {
        text: 'Does the task require the equipment to be energized while working in hazard zones?',
        helperText: 'e.g. Machine must be running for diagnostic or observation.'
      },
      hi: {
        text: 'क्या खतरे के क्षेत्रों में काम करते समय उपकरण को ऊर्जावान रखने की आवश्यकता है?',
        helperText: 'जैसे: नैदानिक या अवलोकन के लिए मशीन चलनी चाहिए।'
      }
    }
  },
  Q2: {
    id: 'Q2',
    icon: 'ClipboardCheck',
    translations: {
      en: {
        text: 'Perform task risk assessment. Is residual risk acceptable?',
        helperText: 'SME must evaluate if safety controls reduce risk enough.'
      },
      hi: {
        text: 'जोखिम मूल्यांकन करें। क्या अवशिष्ट जोखिम स्वीकार्य है?',
        helperText: 'SME को मूल्यांकन करना चाहिए कि सुरक्षा नियंत्रण जोखिम को पर्याप्त कम करते हैं या नहीं।'
      }
    }
  },
  Q3: {
    id: 'Q3',
    icon: 'Activity',
    translations: {
      en: {
        text: 'Is it a routine task?',
        helperText: 'Repetitive tasks with clearly documented SOPs.'
      },
      hi: {
        text: 'क्या यह एक नियमित (routine) कार्य है?',
        helperText: 'स्पष्ट रूप से प्रलेखित SOP के साथ दोहराए जाने वाले कार्य।'
      }
    }
  },
  Q4: {
    id: 'Q4',
    icon: 'Wrench',
    translations: {
      en: {
        text: 'Does the task include DISASSEMBLY or TOUCHING ENERGIZED PARTS?',
        helperText: 'Significant mechanical or electrical interaction.'
      },
      hi: {
        text: 'क्या कार्य में पुर्जों को अलग करना या सक्रिय भागों को छूना शामिल है?',
        helperText: 'महत्वपूर्ण यांत्रिक या विद्युत संपर्क।'
      }
    }
  },
  Q5: {
    id: 'Q5',
    icon: 'Maximize',
    translations: {
      en: {
        text: 'Does the task require FULL BODY ACCESS inside guards?',
        helperText: 'Complete entry into the machine workspace.'
      },
      hi: {
        text: 'क्या कार्य के लिए गार्ड के अंदर पूरे शरीर की पहुंच आवश्यक है?',
        helperText: 'मशीन कार्यक्षेत्र में पूर्ण प्रवेश।'
      }
    }
  },
  Q6: {
    id: 'Q6',
    icon: 'MoveRight',
    translations: {
      en: {
        text: 'Does the operator work THROUGH the interlocked guard?',
        helperText: 'Reaching into a zone without fully entering.'
      },
      hi: {
        text: 'क्या ऑपरेटर इंटरलॉक्ड गार्ड के माध्यम से काम करता है?',
        helperText: 'पूरी तरह से प्रवेश किए बिना एक क्षेत्र में पहुँचना।'
      }
    }
  }
};

export const DECISION_TREE: Record<string, DecisionNode> = {
  Q1: { id: 'Q1', yes: { type: 'question', id: 'Q2' }, no: { type: 'question', id: 'Q4' } },
  Q2: { id: 'Q2', yes: { type: 'question', id: 'Q3' }, no: { type: 'result', modeId: 3 } },
  Q3: { id: 'Q3', yes: { type: 'result', modeId: 0 }, no: { type: 'result', modeId: 4 } },
  Q4: { id: 'Q4', yes: { type: 'result', modeId: 3 }, no: { type: 'question', id: 'Q5' } },
  Q5: { id: 'Q5', yes: { type: 'result', modeId: 2 }, no: { type: 'question', id: 'Q6' } },
  Q6: { id: 'Q6', yes: { type: 'result', modeId: 1 }, no: { type: 'result', modeId: 0 } }
};

export const UI_TRANSLATIONS: Record<Language, any> = {
  en: {
    appTitle: 'LOTO Guard',
    navDecision: 'Decision Tree',
    navReference: 'Mode Reference',
    navHistory: 'History',
    startAssessment: 'Start Assessment',
    activityPlaceholder: 'e.g. Belt replacement...',
    yes: 'Yes',
    no: 'No',
    back: 'Back',
    reset: 'Reset',
    restart: 'Restart Assessment',
    results: 'Assessment Results',
    requirements: 'Requirements',
    examples: 'Examples',
    historyTitle: 'Assessment History',
    noHistory: 'No assessments recorded yet.',
    themeToggle: 'Toggle Theme',
    langToggle: 'Change Language',
    step: 'Step',
    of: 'of',
    aboutApp: 'Enterprise Safety System',
    resultsFor: 'Results for',
    howToProceed: 'How to proceed safely',
    viewDetails: 'View Details'
  },
  hi: {
    appTitle: 'लोटो गार्ड',
    navDecision: 'निर्णय वृक्ष',
    navReference: 'मोड संदर्भ',
    navHistory: 'इतिहास',
    startAssessment: 'मूल्यांकन शुरू करें',
    activityPlaceholder: 'जैसे: बेल्ट बदलना...',
    yes: 'हाँ',
    no: 'नहीं',
    back: 'पीछे',
    reset: 'रीसेट',
    restart: 'मूल्यांकन फिर से शुरू करें',
    results: 'मूल्यांकन के परिणाम',
    requirements: 'आवश्यकताएं',
    examples: 'उदाहरण',
    historyTitle: 'मूल्यांकन इतिहास',
    noHistory: 'अभी तक कोई मूल्यांकन दर्ज नहीं किया गया है।',
    themeToggle: 'थीम बदलें',
    langToggle: 'भाषा बदलें',
    step: 'चरण',
    of: 'का',
    aboutApp: 'एंटरप्राइज सेफ्टी सिस्टम',
    resultsFor: 'परिणाम के लिए',
    howToProceed: 'सुरक्षित रूप से कैसे आगे बढ़ें',
    viewDetails: 'विवरण देखें'
  }
};
