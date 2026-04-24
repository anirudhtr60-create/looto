import { Mode, Question, DecisionNode, Language } from './types';

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
        description: 'Mode 0 signifies standard operating conditions where the machine is controlled via the HMI panel. It mandates ZERO ACCESS to internal hazard zones, ensuring all fixed and interlocked guards are closed and safety devices are fully functional. This mode is for routine tasks that do not require bypassing safety protocols.',
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
        description: 'मोड 0 उस मानक परिचालन स्थितियों को दर्शाता है जहाँ मशीन को HMI पैनल के माध्यम से नियंत्रित किया जाता है। यह आंतरिक खतरे वाले क्षेत्रों में शून्य पहुंच का आदेश देता है, यह सुनिश्चित करता है कि सभी फिक्स्ड और इंटरलॉक्ड गार्ड बंद हैं और सुरक्षा उपकरण पूरी तरह कार्यात्मक हैं। यह मोड उन नियमित कार्यों के लिए है जिनमें सुरक्षा प्रोटोकॉल को बायपास करने की आवश्यकता नहीं होती है।',
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
        description: 'Mode 1 is implemented for tasks requiring physical entry into a guarded zone where a full stop is mandatory. It utilizes interlocked guarding with physical padlocks to ensure the machine cannot be restarted while personnel are inside. This provides robust protection against unexpected machine motion during full-body access tasks.',
        requirements: [
          'STOP THE MACHINE and apply "LOCK" to PREVENT RESTART',
          'Use Reliable and Exclusive Control: Interlocking guard (ISO PLd or PLe, ANSI Cat 3 or 4)',
          'Tag & padlock must be applied to Mechanical control on door (physical guard locking)',
          'Use Trap Key or Fortress Key System where applicable',
          'Individual control for everyone entering the danger zone is mandatory'
        ],
        examples: [
          'Full body entry into a hazard zone through an interlocked gate',
          'Cleaning or maintenance inside a palletizer or robot cell',
          'Tasks requiring physical presence inside the machine envelope'
        ]
      },
      hi: {
        title: 'पुनारंभ रोकने के लिए लॉक',
        description: 'मोड 1 उन कार्यों के लिए लागू किया जाता है जिनमें संरक्षित क्षेत्र में शारीरिक प्रवेश की आवश्यकता होती है जहाँ पूर्ण विराम अनिवार्य है। यह सुनिश्चित करने के लिए कि कर्मियों के अंदर रहने के दौरान मशीन को फिर से शुरू नहीं किया जा सकता है, यह भौतिक तालों के साथ इंटरलॉक्ड गार्डिंग नियंत्रण का उपयोग करता है। यह पूर्ण-शरीर पहुंच कार्यों के दौरान अप्रत्याशित मशीन गति के विरुद्ध मजबूत सुरक्षा प्रदान करता है।',
        requirements: [
          'मशीन को रोकें और पुनारंभ रोकने के लिए "LOCK" लागू करें',
          'विश्वसनीय और विशेष नियंत्रण का उपयोग करें: इंटरलॉक्ड गार्ड (ISO PLd या PLe, ANSI Cat 3 या 4)',
          'दरवाजे पर यांत्रिक नियंत्रण (फिजिकल गार्ड लॉकिंग) पर टैग और पैडलॉक लगाया जाना चाहिए',
          'जहां लागू हो, ट्रैप की (Trap Key) या फोर्ट्रेस की (Fortress Key) सिस्टम का उपयोग करें',
          'खतरे वाले क्षेत्र में प्रवेश करने वाले सभी के लिए व्यक्तिगत नियंत्रण अनिवार्य है'
        ],
        examples: [
          'इंटरलॉक्ड गेट के माध्यम से खतरे वाले क्षेत्र में पूर्ण शरीर प्रवेश',
          'पैलेटाइज़र या रोबोट सेल के अंदर सफाई या रखरखाव',
          'मशीन के घेरे के अंदर शारीरिक उपस्थिति की आवश्यकता वाले कार्य'
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
        description: 'Mode 2 applies when a technician performs a task by reaching through an interlocked port or door while remaining physically outside the machine envelope. The interlocking system must provide a reliable stop, and a specific risk assessment by an SME must confirm that residual hazards at the point of operation are manageable.',
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
        description: 'मोड 2 तब लागू होता है जब एक तकनीशियन मशीन के घेरे से शारीरिक रूप से बाहर रहते हुए इंटरलॉक्ड पोर्ट या दरवाजे के माध्यम से पहुँचकर कार्य करता है। इंटरलॉकिंग सिस्टम को एक विश्वसनीय स्टॉप प्रदान करना चाहिए, और SME द्वारा एक विशिष्ट जोखिम मूल्यांकन यह पुष्टि करना चाहिए कि ऑपरेशन के बिंदु पर अवशिष्ट खतरे प्रबंधनीय हैं।',
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
        description: 'Mode 3 represents the highest level of conventional energy isolation. It is mandatory for any task involving disassembly, touching energized components, or when safety categories 3/4 cannot be verified. All energy sources (electrical, pneumatic, hydraulic, kinetic) must be locked in a zero-energy state with individual padlocks and verified through a try-out procedure.',
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
        description: 'मोड 3 पारंपरिक ऊर्जा अलगाव के उच्चतम स्तर का प्रतिनिधित्व करता है। यह किसी भी कार्य के लिए अनिवार्य है जिसमें पुर्जों को अलग करना, सक्रिय घटकों को छूना शामिल है, या जब सुरक्षा श्रेणी 3/4 को सत्यापित नहीं किया जा सकता है। सभी ऊर्जा स्रोतों (विद्युत, वायवीय, हाइड्रोलिक, गतिज) को व्यक्तिगत तालों के साथ शून्य-ऊर्जा स्थिति में लॉक किया जाना चाहिए और ट्राई-आउट प्रक्रिया के माध्यम से सत्यापित किया जाना चाहिए।',
        requirements: [
          'मशीन को पूरी तरह से रोकें और सभी ऊर्जा स्रोतों पर पूर्ण LOTO लागू करें',
          'पुर्जों को अलग करने या सक्रिय भागों को छूने के लिए अनिवार्य',
          'यदि सुरक्षा श्रेणी 3 या 4 की कोई पुष्टि नहीं है तो आवश्यक',
          'काम शुरू करने से पहले शून्य ऊर्जा स्थिति (टाई-आउट) सत्यापित करें',
          'सभी द्वितीयक ऊर्जा स्रोतों (वाइल्ड, दबाव, गुरुत्वाकर्षण) को डी-एनर्जाइज करें'
        ],
        examples: [
          'ड्राइविंग पार्ट्स/मोशन पार्ट्स को अलग करना या स्थापित करना',
          'मरम्मत या प्रतिस्थापन के लिए सीधे सक्रिय पुर्जों को छूना',
          'ऐसे कार्य जिन्हें OEM या SME द्वारा मामूली सर्विसिंग के रूप में स्पष्ट रूप से परिभाषित नहीं किया गया है'
        ]
      }
    }
  },
  4: {
    id: 4,
    name: 'SPECIFIC SOP',
    color: '#eab308',
    bgColor: 'rgba(234, 179, 8, 0.1)',
    borderColor: 'rgba(234, 179, 8, 0.2)',
    icon: 'BookOpen',
    translations: {
      en: {
        title: 'Specific SOP',
        description: 'Mode 4 is utilized for tasks that are frequent, well-understood, and governed by a specific, validated Standard Operating Procedure (SOP). This mode often involves specialized safety controls (like jog enabled via safety PLC) that are verified by the machine manufacturer or an Internal SME. Operators must be specifically certified to perform tasks under this protocol.',
        requirements: [
          'STOP THE MACHINE completely before starting work',
          'Apply FULL LOTO (Lockout/Tagout) procedures as per context',
          'Manage the task with a SPECIFIC SOP and trained operator',
          'Operator MUST be trained and certified on this specific SOP',
          'Any changes of SOP must be re-validated by SME via risk assessment',
          'Routine tasks which require a jog mode with steps in user manual of OEM'
        ],
        examples: [
          'Routine tasks which require a jog mode with steps clearly written in SOP',
          'Tasks as stated in the user manual of the OEM',
          'Recurring maintenance tasks with an established and reviewed SOP'
        ]
      },
      hi: {
        title: 'विशिष्ट SOP',
        description: 'मोड 4 का उपयोग उन कार्यों के लिए किया जाता है जो बार-बार होते हैं, अच्छी तरह से समझे जाते हैं, और एक विशिष्ट, मान्य मानक संचालन प्रक्रिया (SOP) द्वारा शासित होते हैं। इस मोड में अक्सर विशेष सुरक्षा नियंत्रण (जैसे सुरक्षा PLC के माध्यम से जॉग सक्षम) शामिल होते हैं जिन्हें मशीन निर्माता या आंतरिक SME द्वारा सत्यापित किया जाता है। ऑपरेटरों को इस प्रोटोकॉल के तहत कार्य करने के लिए विशेष रूप से प्रमाणित होना चाहिए।',
        requirements: [
          'काम शुरू करने से पहले मशीन को पूरी तरह से रोकें',
          'संदर्भ के अनुसार पूर्ण LOTO (लॉकआउट/टैगआउट) प्रक्रियाएं लागू करें',
          'विशिष्ट SOP और प्रशिक्षित ऑपरेटर के साथ कार्य का प्रबंधन करें',
          'ऑपरेटर को इस विशिष्ट SOP पर प्रशिक्षित और प्रमाणित होना चाहिए',
          'SOP के किसी भी बदलाव को जोखिम मूल्यांकन के माध्यम से SME द्वारा पुन: सत्यापित किया जाना चाहिए',
          'नियमित कार्य जिनके लिए OEM के मैनुअल में चरणों के साथ जॉग मोड की आवश्यकता होती है'
        ],
        examples: [
          'नियमित कार्य जिनके लिए SOP में स्पष्ट रूप से लिखे चरणों के साथ जॉग मोड की आवश्यकता होती है',
          'OEM के उपयोगकर्ता नियमावली में बताए अनुसार कार्य',
          'एक स्थापित और समीक्षा किए गए SOP के साथ आवर्ती रखरखाव कार्य'
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
        title: 'Mode 5 Permit to Work',
        description: 'Mode 5 is a critical, high-risk protocol utilized strictly for tasks where equipment must remain energized for direct casualty analysis or live troubleshooting. It demands the highest level of governance, including an active Permit to Work (PTW) and mandatory, continuous on-site supervision by a certified SME. Authorized personnel must be specifically trained for live-work scenarios, as standard LOTO is bypassed.',
        requirements: [
          'Manage the task strictly with an active PERMIT TO WORK',
          'Task risk assessment must be performed and documented by SME',
          'Continuous monitoring by SME/Supervisor is required',
          'Only for tasks where equipment MUST remain energized for observation',
          'Establish clear safety boundaries and communication protocols'
        ],
        requirementTooltips: [
          'A formal, signed document authorizing high-risk work that bypasses standard safety locks.',
          'A detailed safe method statement identifying every potential hazard during live troubleshooting.',
          'A supervisor or SME must be physically present throughout the entire duration of the task.',
          'Used only when diagnostic power is technically impossible to achieve with zero-energy.',
          'Establishing physical exclusion zones and dedicated radio channels for immediate emergency stop.'
        ],
        examples: [
          'Live voltage measurement on a main distribution panel to identify phase imbalance',
          'Visual diagnostic of mechanical synchronization during full-speed operation where guards must be opened',
          'Calibration of sensors that only function under active load and motion'
        ]
      },
      hi: {
        title: 'मोड 5 परमिट टू वर्क',
        description: 'मोड 5 एक महत्वपूर्ण, उच्च-जोखिम वाला प्रोटोकॉल है जिसका उपयोग विशेष रूप से उन कार्यों के लिए किया जाता है जहाँ उपकरण को प्रत्यक्ष विश्लेषण या लाइव समस्या निवारण के लिए सक्रिय रहना अनिवार्य होता है। यह शासन के उच्चतम स्तर की मांग करता है, जिसमें एक सक्रिय परमिट टू वर्क (PTW) और एक प्रमाणित SME द्वारा अनिवार्य, निरंतर ऑन-साइट पर्यवेक्षण शामिल है। अधिकृत कर्मियों को लाइव-वर्क परिदृश्यों के लिए विशेष रूप से प्रशिक्षित किया जाना चाहिए, क्योंकि मानक LOTO को बायपास किया जाता है।',
        requirements: [
          'सक्रिय PERMIT टू वर्क के साथ कार्य का सख्ती से प्रबंधन करें',
          'कार्य जोखिम मूल्यांकन SME द्वारा किया और प्रलेखित किया जाना चाहिए',
          'SME/पर्यवेक्षक द्वारा निरंतर निगरानी आवश्यक है',
          'केवल उन कार्यों के लिए जहां उपकरण को अवलोकन के लिए सक्रिय रहना चाहिए',
          'स्पष्ट सुरक्षा सीमाएं और संचार प्रोटोकॉल स्थापित करें'
        ],
        requirementTooltips: [
          'एक औपचारिक, हस्ताष्ारित दस्तावेज़ जो मानक सुरक्षा तालों को बायपास करने वाले उच्च-जोखिम वाले कार्य को अधिकृत करता है।',
          'लाइव समस्या निवारण के दौरान हर संभावित खतरे की पहचान करने वाला विस्तृत सुरक्षित विधि विवरण।',
          'कार्य की पूरी अवधि के दौरान एक पर्यवेक्षक या SME का शारीरिक रूप से उपस्थित होना अनिवार्य है।',
          'केवल तभी उपयोग किया जाता है जब शून्य-ऊर्जा के साथ निदान शक्ति प्राप्त करना तकनीकी रूप से असंभव हो।',
          'भौतिक बहिष्करण क्षेत्र और तत्काल आपातकालीन स्टॉप के लिए समर्पित रेडियो चैनल स्थापित करना।'
        ],
        examples: [
          'चरण असंतुलन की पहचान करने के लिए मुख्य वितरण पैनल पर लाइव वोल्टेज मापन',
          'पूर्ण गति संचालन के दौरान यांत्रिक सिंक्रनाइज़ेशन का दृश्य निदान जहाँ गार्ड खोलना अनिवार्य है',
          'उन सेंसरों का अंशांकन जो केवल सक्रिय लोड और गति के तहत कार्य करते हैं'
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
    icon: 'Repeat',
    translations: {
      en: {
        text: 'Is it a routine task?',
        helperText: 'Standard recurring tasks clearly defined in operational procedures.'
      },
      hi: {
        text: 'क्या यह एक नियमित कार्य है?',
        helperText: 'परिचालन प्रक्रियाओं में स्पष्ट रूप से परिभाषित मानक आवर्ती कार्य।'
      }
    }
  },
  Q4: {
    id: 'Q4',
    icon: 'Wrench',
    translations: {
      en: {
        text: 'Does the task include DISASSEMBLY or TOUCHING THE ENERGIZED PART?',
        helperText: 'e.g. Disassembling and installation of driving parts/motion parts or parts containing hazardous energy.'
      },
      hi: {
        text: 'क्या कार्य में पुर्जों को अलग करना (DISASSEMBLY) या सक्रिय भागों को छूना शामिल है?',
        helperText: 'जैसे: ड्राइविंग पार्ट्स/मोशन पार्ट्स या खतरनाक ऊर्जा वाले पुर्जों को अलग करना और स्थापित करना।'
      }
    }
  },
  Q5: {
    id: 'Q5',
    icon: 'Maximize',
    translations: {
      en: {
        text: 'Does the task require FULL BODY ACCESS (work inside interlocked guard)?',
        helperText: 'Does the operator need to fully enter the guarded zone?'
      },
      hi: {
        text: 'क्या कार्य के लिए पूर्ण शरीर की पहुंच (FULL BODY ACCESS) आवश्यक है (इंटरलॉक्ड गार्ड के अंदर काम करना)?',
        helperText: 'क्या ऑपरेटर को पूरी तरह से सुरक्षा घेरे के अंदर जाने की आवश्यकता है?'
      }
    }
  },
  Q6: {
    id: 'Q6',
    icon: 'MoveRight',
    translations: {
      en: {
        text: 'Does the operator work THROUGH the interlocked guard?',
        helperText: 'Reaching into the hazard zone while remaining physically outside the boundary.'
      },
      hi: {
        text: 'क्या ऑपरेटर इंटरलॉक्ड गार्ड के माध्यम से (THROUGH) काम करता है?',
        helperText: 'शारीरिक रूप से सीमा के बाहर रहते हुए खतरे वाले क्षेत्र में पहुंचना।'
      }
    }
  }
};

export const DECISION_TREE: Record<string, DecisionNode> = {
  Q1: { id: 'Q1', yes: { type: 'question', id: 'Q2' }, no: { type: 'question', id: 'Q4' } },
  Q2: { id: 'Q2', yes: { type: 'question', id: 'Q3' }, no: { type: 'result', modeId: 3 } },
  Q3: { id: 'Q3', yes: { type: 'result', modeId: 4 }, no: { type: 'result', modeId: 5 } },
  Q4: { id: 'Q4', yes: { type: 'result', modeId: 3 }, no: { type: 'question', id: 'Q5' } },
  Q5: { id: 'Q5', yes: { type: 'result', modeId: 1 }, no: { type: 'question', id: 'Q6' } },
  Q6: { id: 'Q6', yes: { type: 'result', modeId: 2 }, no: { type: 'result', modeId: 0 } }
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
