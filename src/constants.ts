import { Mode, Question, DecisionNode } from './types';

export const MODES: Record<number, Mode> = {
  0: {
    id: 0,
    name: 'ZERO ACCESS',
    color: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.2)',
    icon: 'Shield',
    translations: {
      en: {
        title: 'Normal Operation (HMI)',
        description: 'Mode 0 signifies standard operating conditions where the machine is controlled via the HMI panel. It mandates ZERO ACCESS to internal hazard zones, ensuring all fixed and interlocked guards are closed and safety devices are fully functional.',
        requirements: [
          'Ensure ZERO ACCESS to hazard zones during operation',
          'Machine safeguarding must be fully functional and in good condition',
          'Tasks in normal operation without bypassing any safety devices',
          'Routine, repetitive, and integral to the use of the equipment for production',
          'No disassembly or removal of guards is permitted'
        ],
        examples: [
          'Normal production tasks using Panel (HMI)',
          'Cleaning, inspection, or lubrication (minor tasks from outside)',
          'Alignment, measurement, or bottle jam clearing without bypassing guards'
        ]
      },
      hi: {
        title: 'सामान्य संचालन (HMI)',
        description: 'मोड 0 उस मानक परिचालन स्थितियों को दर्शाता है जहाँ मशीन को HMI पैनल के माध्यम से नियंत्रित किया जाता है। यह आंतरिक खतरे वाले क्षेत्रों में शून्य पहुंच का आदेश देता है।',
        requirements: [
          'संचालन के दौरान खतरे वाले क्षेत्रों में शून्य पहुंच सुनिश्चित करें',
          'मशीन सुरक्षा कवच पूरी तरह से कार्यात्मक और अच्छी स्थिति में होने चाहिए',
          'किसी भी सुरक्षा उपकरण को बाईपास किए बिना सामान्य संचालन में कार्य',
          'उत्पादन के लिए उपकरण के उपयोग के लिए नियमित, दोहराव वाले और अभिन्न कार्य',
          'गार्डों को अलग करने या हटाने की अनुमति नहीं है'
        ],
        examples: [
          'पैनल (HMI) का उपयोग करके सामान्य उत्पादन कार्य',
          'सफाई, निरीक्षण, या स्नेहन (बाहर से मामूली कार्य)',
          'गार्डों को बाईपास किए बिना संरेखण, मापन, या बोतल जाम हटाना'
        ]
      }
    }
  },
  1: {
    id: 1,
    name: 'LOCK RESTART',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.2)',
    icon: 'Lock',
    translations: {
      en: {
        title: 'Lock to Prevent Restart',
        description: 'Mode 1 is implemented for tasks requiring physical entry into a guarded zone where a full stop is mandatory. It utilizes interlocked guarding with physical padlocks.',
        requirements: [
          'STOP THE MACHINE and apply "LOCK" to PREVENT RESTART',
          'Use Reliable and Exclusive Control: Interlocking guard (ISO PLd or PLe, Cat 3 or 4)',
          'Tag & padlock must be applied to Mechanical control on door',
          'Use Trap Key or Fortress Key System where applicable',
          'Individual control for everyone entering the danger zone is mandatory'
        ],
        examples: [
          'Full body entry into a hazard zone through an interlocked gate',
          'Cleaning or maintenance tasks inside a guarded zone'
        ]
      },
      hi: {
        title: 'पुनारंभ रोकने के लिए लॉक (LOCK)',
        description: 'मोड 1 उन कार्यों के लिए लागू किया जाता है जिनमें एक सुरक्षित क्षेत्र में शारीरिक प्रवेश की आवश्यकता होती है जहाँ पूर्ण विराम अनिवार्य है।',
        requirements: [
          'मशीन को रोकें और पुनारंभ रोकने के लिए "LOCK" लागू करें',
          'विश्वसनीय और अनन्य नियंत्रण का उपयोग करें: इंटरलॉकिंग गार्ड (ISO PLd या PLe, Cat 3 या 4)',
          'दरवाजे पर मैकेनिकल नियंत्रण पर टैग और पैडलॉक लगाया जाना चाहिए',
          'जहाँ लागू हो वहाँ ट्रैप की सिस्टम का उपयोग करें',
          'प्रत्येक व्यक्ति के लिए व्यक्तिगत नियंत्रण अनिवार्य है'
        ],
        examples: [
          'इंटरलॉक्ड गेट के माध्यम से एक खतरे वाले क्षेत्र में पूर्ण शरीर का प्रवेश',
          'एक सुरक्षित क्षेत्र के अंदर सफाई या रखरखाव का कार्य'
        ]
      }
    }
  },
  2: {
    id: 2,
    name: 'THROUGH GUARD',
    color: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.1)',
    borderColor: 'rgba(6, 182, 212, 0.2)',
    icon: 'Hand',
    translations: {
      en: {
        title: 'Work Through Guard',
        description: 'Mode 2 applies when a technician performs a task by reaching through an interlocked port or door while remaining physically outside the machine envelope.',
        requirements: [
          'STOP THE MACHINE and work THROUGH the INTERLOCKED GUARD boundary',
          'Reliable Control to prevent restart (ISO Performance Level PLd or PLe, Cat 3 or 4)',
          'Perform task risk assessment and ensure residual risk is acceptable',
          'Operator must remain physically outside the primary hazard zone'
        ],
        examples: [
          'Reaching through a port or door to clear a minor blockage',
          'Adjusting internal components while remaining outside the machine envelope',
          'Inspection tasks performed via interlocked access ports'
        ]
      },
      hi: {
        title: 'गार्ड के माध्यम से काम',
        description: 'मोड 2 तब लागू होता है जब एक तकनीशियन मशीन के घेरे से शारीरिक रूप से बाहर रहते हुए इंटरलॉक्ड पोर्ट या दरवाजे के माध्यम से पहुँचकर कार्य करता है।',
        requirements: [
          'मशीन को रोकें और इंटरलॉक्ड गार्ड सीमा के माध्यम से (THROUGH) काम करें',
          'पुनारंभ रोकने के लिए विश्वसनीय नियंत्रण (ISO PLd या PLe, Cat 3 या 4)',
          'कार्य जोखिम मूल्यांकन करें और सुनिश्चित करें कि अवशिष्ट जोखिम स्वीकार्य है',
          'ऑपरेटर को शारीरिक रूप से प्राथमिक खतरे वाले क्षेत्र के बाहर रहना चाहिए'
        ],
        examples: [
          'मामूली रुकावट को दूर करने के लिए पोर्ट या दरवाजे के माध्यम से पहुंचना',
          'मशीन के घेरे से बाहर रहते हुए आंतरिक घटकों को समायोजित करना',
          'इंटरलॉक्ड एक्सेस पोर्ट के माध्यम से किए गए निरीक्षण कार्य'
        ]
      }
    }
  },
  3: {
    id: 3,
    name: 'FULL LOTO',
    color: '#f97316',
    bgColor: 'rgba(249, 115, 22, 0.1)',
    borderColor: 'rgba(249, 115, 22, 0.2)',
    icon: 'AlertTriangle',
    translations: {
      en: {
        title: 'Full LOTO',
        description: 'Mode 3 represents the highest level of conventional energy isolation. It is mandatory for any task involving disassembly or touching energized components.',
        requirements: [
          'STOP THE MACHINE completely and apply FULL LOTO to all energy sources',
          'Mandatory for DISASSEMBLY or TOUCHING ENERGIZED PARTS',
          'Required if there is no confirmation of safety Category 3 or 4',
          'Verify ZERO ENERGY state (Try-Out) before starting work',
          'De-energize all secondary energy sources (air, pressure, gravity)'
        ],
        examples: [
          'Disassembly or installation of driving parts/motion parts',
          'Touching energized parts directly for repair or replacement',
          'Tasks not clearly defined as minor servicing by OEM or SME'
        ]
      },
      hi: {
        title: 'पूर्ण LOTO',
        description: 'मोड 3 पारंपरिक ऊर्जा अलगाव के उच्चतम स्तर का प्रतिनिधित्व करता है। यह किसी भी कार्य के लिए अनिवार्य है जिसमें पुर्जों को अलग करना, सक्रिय घटकों को छूना शामिल है।',
        requirements: [
          'मशीन को पूरी तरह से रोकें और सभी ऊर्जा स्रोतों पर पूर्ण LOTO लागू करें',
          'पुर्जों को अलग करने या सक्रिय भागों को छूने के लिए अनिवार्य',
          'यदि सुरक्षा श्रेणी 3 या 4 की कोई पुष्टि नहीं है तो आवश्यक',
          'काम शुरू करने से पहले शून्य ऊर्जा स्थिति (टाई-आउट) सत्यापित करें',
          'सभी ऊर्जा स्रोतों को डी-एनर्जाइज करें'
        ],
        examples: [
          'ड्राइविंग पार्ट्स/मोशन पार्ट्स को अलग करना या स्थापित करना',
          'मरम्मत या प्रतिस्थापन के लिए सीधे सक्रिय पुर्जों को छूना'
        ]
      }
    }
  },
  4: {
    id: 4,
    name: 'SOP CONTROL',
    color: '#eab308',
    bgColor: 'rgba(234, 179, 8, 0.1)',
    borderColor: 'rgba(234, 179, 8, 0.2)',
    icon: 'BookOpen',
    translations: {
      en: {
        title: 'Specific SOP Control',
        description: 'This mode is utilized for tasks that are frequent, well-understood, and governed by a specific, validated Standard Operating Procedure (SOP).',
        requirements: [
          'STOP THE MACHINE completely before starting work',
          'Apply FULL LOTO procedures as per context',
          'Manage the task with a SPECIFIC SOP and trained operator',
          'Operator MUST be trained and certified on this specific SOP',
          'Any changes of SOP must be re-validated by SME via risk assessment'
        ],
        examples: [
          'Routine tasks which require a jog mode with steps clearly written in SOP',
          'Tasks as stated in the user manual of the OEM',
          'Recurring maintenance tasks with an established and reviewed SOP'
        ]
      },
      hi: {
        title: 'मोड 4 विशिष्ट SOP',
        description: 'मोड 4 का उपयोग उन कार्यों के लिए किया जाता है जो बार-बार होते हैं और एक विशिष्ट, मान्य मानक संचालन प्रक्रिया (SOP) द्वारा शासित होते हैं।',
        requirements: [
          'काम शुरू करने से पहले मशीन को पूरी तरह से रोकें',
          'पूर्ण LOTO प्रक्रियाएं लागू करें',
          'विशिष्ट SOP और प्रशिक्षित ऑपरेटर के साथ कार्य का प्रबंधन करें',
          'ऑपरेटर को इस विशिष्ट SOP पर प्रशिक्षित होना चाहिए',
          'SOP के किसी भी बदलाव को पुन: सत्यापित किया जाना चाहिए'
        ],
        examples: [
          'नियमित कार्य जिनके लिए SOP में चरणों के साथ जॉग मोड की आवश्यकता होती है',
          'OEM के उपयोगकर्ता नियमावली में बताए अनुसार कार्य',
          'स्थापित SOP के साथ रखरखाव कार्य'
        ]
      }
    }
  },
  5: {
    id: 5,
    name: 'PERMIT TO WORK',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
    icon: 'ShieldAlert',
    translations: {
      en: {
        title: 'Mode 4 Permit to Work',
        description: 'This is a critical protocol for tasks where equipment must remain energized for Troubleshooting. It requires an active Permit to Work (PTW) and mandatory supervision.',
        requirements: [
          'Manage the task strictly with an active PERMIT TO WORK',
          'Task risk assessment must be performed and documented by SME',
          'Continuous monitoring by SME/Supervisor is required',
          'Only for tasks where equipment MUST remain energized for observation',
          'Establish clear safety boundaries and communication protocols'
        ],
        examples: [
          'Live voltage measurement on a main distribution panel',
          'Visual diagnostic of mechanical synchronization during full-speed operation',
          'Calibration of sensors that only function under active load and motion'
        ]
      },
      hi: {
        title: 'मोड 4 परमिट टू वर्क',
        description: 'यह उन कार्यों के लिए एक महत्वपूर्ण प्रोटोकॉल है जहाँ उपकरण को समस्या निवारण के लिए सक्रिय रहना चाहिए। इसमें सक्रिय परमिट टू वर्क (PTW) और अनिवार्य पर्यवेक्षण की आवश्यकता होती है।',
        requirements: [
          'सक्रिय PERMIT टू वर्क के साथ कार्य का सख्ती से प्रबंधन करें',
          'कार्य जोखिम मूल्यांकन SME द्वारा किया और प्रलेखित किया जाना चाहिए',
          'SME/पर्यवेक्षक द्वारा निरंतर निगरानी आवश्यक है',
          'केवल उन कार्यों के लिए जहां उपकरण को अवलोकन के लिए सक्रिय रहना चाहिए',
          'सुरक्षा सीमाएं और संचार प्रोटोकॉल स्थापित करें'
        ],
        examples: [
          'मुख्य वितरण पैनल पर लाइव वोल्टेज मापन',
          'पूर्ण गति संचालन के दौरान सिंक्रनाइज़ेशन का दृश्य निदान',
          'सेंसरों का अंशांकन जो केवल सक्रिय लोड के तहत कार्य करते हैं'
        ]
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
        text: 'Does the task require the equipment to be energized while working in or around equipment hazard zones?',
        helperText: 'Is power needed for the operation while technicians are in proximity to hazard areas?'
      },
      hi: {
        text: 'क्या खतरे के क्षेत्रों में या उसके आसपास काम करते समय उपकरण को सक्रिय (energized) रखने की आवश्यकता है?',
        helperText: 'क्या तकनीशियन खतरे वाले क्षेत्रों के निकट हैं, तब ऑपरेशन के लिए बिजली की आवश्यकता है?'
      }
    }
  },
  Q2: {
    id: 'Q2',
    icon: 'Shield',
    translations: {
      en: {
        text: 'Perform task risk assessment. Is residual risk acceptable?',
        helperText: 'Risk assessment should be performed by SME. Can the remaining risk be managed safely?'
      },
      hi: {
        text: 'कार्य जोखिम मूल्यांकन करें। क्या अवशिष्ट जोखिम स्वीकार्य है?',
        helperText: 'जोखिम मूल्यांकन SME द्वारा किया जाना चाहिए। क्या शेष जोखिम को सुरक्षित रूप से प्रबंधित किया जा सकता है?'
      }
    }
  },
  Q3: {
    id: 'Q3',
    icon: 'BookOpen',
    translations: {
      en: {
        text: 'Does a specific, validated SOP exist for this energized task?',
        helperText: 'Is there a documented procedure that identifies all hazards and controls for this exact work?'
      },
      hi: {
        text: 'क्या इस सक्रिय कार्य के लिए एक विशिष्ट, मान्य SOP मौजूद है?',
        helperText: 'क्या कोई प्रलेखित प्रक्रिया है जो इस सटीक कार्य के लिए सभी खतरों और नियंत्रणों की पहचान करती है?'
      }
    }
  },
  Q4: {
    id: 'Q4',
    icon: 'Activity',
    translations: {
      en: {
        text: 'Is this "Minor Servicing" (routine, repetitive, integral to production) that takes place during normal operation?',
        helperText: 'Standard servicing tasks that do not require tool removal or major disassembly.'
      },
      hi: {
        text: 'क्या यह "लघु सेवा" (नियमित, दोहराव वाली, उत्पादन के लिए अभिन्न) है जो सामान्य संचालन के दौरान होती है?',
        helperText: 'मानक सेवा कार्य जिनमें उपकरण हटाने या बड़े विखंडन की आवश्यकता नहीं होती है।'
      }
    }
  },
  Q5: {
    id: 'Q5',
    icon: 'UserPlus',
    translations: {
      en: {
        text: 'Does the task require full-body entry into a hazard zone?',
        helperText: 'Does the technician need to physically enter the guarded area completely?'
      },
      hi: {
        text: 'क्या कार्य के लिए खतरे वाले क्षेत्र में पूर्ण शरीर के प्रवेश की आवश्यकता है?',
        helperText: 'क्या तकनीशियन को पूरी तरह से सुरक्षित क्षेत्र में प्रवेश करने की आवश्यकता है?'
      }
    }
  },
  Q6: {
    id: 'Q6',
    icon: 'Move',
    translations: {
      en: {
        text: 'Does the operator work THROUGH an interlocked guard port or door?',
        helperText: 'Reaching into a hazard zone while physically remaining outside the boundary.'
      },
      hi: {
        text: 'क्या ऑपरेटर इंटरलॉक्ड गार्ड पोर्ट या दरवाजे के माध्यम से (THROUGH) काम करता है?',
        helperText: 'शारीरिक रूप से सीमा के बाहर रहते हुए खतरे वाले क्षेत्र में पहुंचना।'
      }
    }
  }
};

export const DECISION_TREE: Record<string, DecisionNode> = {
  Q1: { id: 'Q1', yes: { type: 'question', id: 'Q2' }, no: { type: 'question', id: 'Q4' } },
  Q2: { id: 'Q2', yes: { type: 'question', id: 'Q3' }, no: { type: 'result', modeId: 3 } },
  Q3: { id: 'Q3', yes: { type: 'result', modeId: 4 }, no: { type: 'result', modeId: 5 } },
  Q4: { id: 'Q4', yes: { type: 'question', id: 'Q5' }, no: { type: 'result', modeId: 3 } },
  Q5: { id: 'Q5', yes: { type: 'result', modeId: 1 }, no: { type: 'question', id: 'Q6' } },
  Q6: { id: 'Q6', yes: { type: 'result', modeId: 2 }, no: { type: 'result', modeId: 0 } }
};

export const UI_TRANSLATIONS = {
  en: {
    startAssessment: 'Start Assessment',
    restart: 'Restart',
    reset: 'Reset',
    back: 'Back',
    results: 'Results',
    resultsFor: 'Results for',
    assessmentHistory: 'Assessment History',
    noHistory: 'No history available',
    clearHistory: 'Clear History',
    safetyReference: 'Safety Reference',
    viewDetails: 'View Details',
    close: 'Close',
    backToPortal: 'Back to Portal',
    step: 'Step',
    of: 'of',
    yes: 'Yes',
    no: 'No',
    historyTitle: 'Recent Assessments',
    navReference: 'Safety Protocol Reference',
    requirements: 'Mandatory Safety Requirements',
    howToProceed: 'How to Proceed'
  },
  hi: {
    startAssessment: 'आकलन शुरू करें',
    restart: 'पुनारंभ करें',
    reset: 'रीसेट',
    back: 'पीछे',
    results: 'परिणाम',
    resultsFor: 'के लिए परिणाम',
    assessmentHistory: 'आकलन इतिहास',
    noHistory: 'कोई इतिहास उपलब्ध नहीं है',
    clearHistory: 'इतिहास साफ करें',
    safetyReference: 'सुरक्षा संदर्भ',
    viewDetails: 'विवरण देखें',
    close: 'बंद करें',
    backToPortal: 'पोर्टल पर वापस',
    step: 'कदम',
    of: 'का',
    yes: 'हाँ',
    no: 'नहीं',
    historyTitle: 'हाल के आकलन',
    navReference: 'सुरक्षा प्रोटोकॉल संदर्भ',
    requirements: 'अनिवार्य सुरक्षा आवश्यकताएं',
    howToProceed: 'आगे कैसे बढ़ें'
  }
};
