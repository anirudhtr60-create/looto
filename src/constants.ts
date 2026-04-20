import { Mode, Question, DecisionNode } from './types';

export const MODES: Record<number, Mode> = {
  0: {
    id: 0,
    name: 'MODE 0',
    title: 'Normal Operation',
    description: 'The task can be performed during normal operation with standard safety protocols. Ensure machine safeguarding is in place and in good condition.',
    requirements: [
      'Machine in operation using panel (HMI)',
      'Ensure ZERO ACCESS to hazard zones',
      'Machine safeguarding must be in place and functional',
      'Follow standard operating procedures (SOP)'
    ],
    examples: [
      'Visual inspection from outside guards',
      'Operating machine via controls',
      'Monitoring process parameters'
    ],
    color: '#22c55e', // green-500
    bgColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.2)',
    icon: 'Shield'
  },
  1: {
    id: 1,
    name: 'MODE 1',
    title: 'Work Through Guard',
    description: 'Work is performed through an interlocked guard. The machine must be stopped and restart prevented via the interlock system.',
    requirements: [
      'Stop the machine',
      'Work performed THROUGH the interlocked guard',
      'Reliable control to prevent restart (Interlocking guard PLd or PLe)',
      'Residual risk must be acceptable'
    ],
    examples: [
      'Minor clearing of jams',
      'Tool adjustments through guard openings',
      'In-process measurements'
    ],
    color: '#84cc16', // lime-500
    bgColor: 'rgba(132, 204, 22, 0.1)',
    borderColor: 'rgba(132, 204, 22, 0.2)',
    icon: 'Hand'
  },
  2: {
    id: 2,
    name: 'MODE 2',
    title: 'Full Body Access',
    description: 'Task requires entry into the hazard zone (Full Body Access). Equipment must be stopped and mechanical isolation (Lock) applied to the interlocked door.',
    requirements: [
      'Stop the machine',
      'Apply "LOCK" to prevent restart',
      'Reliable and exclusive control (Interlock + Padlock on door)',
      'Risk assessment must be acceptable'
    ],
    examples: [
      'Cleaning inside the machine guard',
      'Lubrication of internal parts',
      'Replacing small non-critical components'
    ],
    color: '#3b82f6', // blue-500
    bgColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.2)',
    icon: 'User'
  },
  3: {
    id: 3,
    name: 'MODE 3',
    title: 'Full LOTO',
    description: 'Stop the machine and apply FULL Lockout-Tagout. Required for maintenance, disassembly, or when touching energized-capable parts.',
    requirements: [
      'STOP THE MACHINE',
      'Identify and isolate all energy sources',
      'Apply personal locks and tags to each isolation point',
      'Verify zero energy state before starting work'
    ],
    examples: [
      'Disassembly of driving parts',
      'Installation of motion parts',
      'Electrical panel maintenance',
      'Major mechanical overhauls'
    ],
    color: '#f97316', // orange-500
    bgColor: 'rgba(249, 115, 22, 0.1)',
    borderColor: 'rgba(249, 115, 22, 0.2)',
    icon: 'Lock'
  },
  4: {
    id: 4,
    name: 'MODE 4',
    title: 'Permit to Work',
    description: 'This task requires a formal PERMIT TO WORK. Used when equipment must remain energized and residual risk is acceptable for a non-routine task.',
    requirements: [
      'Perform task risk assessment (SME conducted)',
      'Risk assessment must be documented and signed off',
      'PERMIT TO WORK must be issued and active',
      ' residual risk must be accepted through PTW process'
    ],
    examples: [
      'Troubleshooting with machine energized',
      'Observation inside safety guard while running',
      'Diagnosing abnormal conditions that require motion'
    ],
    color: '#ef4444', // red-500
    bgColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
    icon: 'AlertTriangle'
  }
};

export const QUESTIONS: Record<string, Question> = {
  Q1: {
    id: 'Q1',
    text: 'Does the task require the equipment to be energized while working in or around equipment hazard zones?',
    helperText: 'i.e. Does any part of the work require the machine to be powered/running while you are in the vicinity of hazard zones?',
    icon: 'Zap'
  },
  Q2: {
    id: 'Q2',
    text: 'Perform task risk assessment. Risk assessment should be performed by SME. Is residual risk acceptable?',
    helperText: 'A Subject Matter Expert (SME) must evaluate whether the remaining risk after controls is acceptable.',
    icon: 'ClipboardCheck'
  },
  Q3: {
    id: 'Q3',
    text: 'Is it a routine task?',
    helperText: 'Routine tasks are repetitive tasks with clearly documented steps in an SOP. Non-routine tasks are uncommon or first-time tasks.',
    icon: 'Activity'
  },
  Q4: {
    id: 'Q4',
    text: 'Does the task include DISASSEMBLY or TOUCHING THE ENERGIZED PART?',
    helperText: 'e.g. Disassembling driving parts, installation of motion parts, or parts containing hazardous energy.',
    icon: 'Wrench'
  },
  Q5: {
    id: 'Q5',
    text: 'Does the task require FULL BODY ACCESS (work inside INTERLOCKED GUARD)?',
    helperText: 'Does the operator need to enter completely into the guarded area?',
    icon: 'Maximize'
  },
  Q6: {
    id: 'Q6',
    text: 'Does the operator work THROUGH the INTERLOCKED GUARD?',
    helperText: 'e.g. reaching through a guard opening or port while standing outside.',
    icon: 'MoveRight'
  }
};

export const DECISION_TREE: Record<string, DecisionNode> = {
  Q1: {
    id: 'Q1',
    yes: { type: 'question', id: 'Q2' },
    no: { type: 'question', id: 'Q4' }
  },
  Q2: {
    id: 'Q2',
    yes: { type: 'question', id: 'Q3' },
    no: { type: 'result', modeId: 3 }
  },
  Q3: {
    id: 'Q3',
    yes: { type: 'result', modeId: 0 }, // Specific SOP path in image 1
    no: { type: 'result', modeId: 4 }
  },
  Q4: {
    id: 'Q4',
    yes: { type: 'result', modeId: 3 },
    no: { type: 'question', id: 'Q5' }
  },
  Q5: {
    id: 'Q5',
    yes: { type: 'result', modeId: 2 },
    no: { type: 'question', id: 'Q6' }
  },
  Q6: {
    id: 'Q6',
    yes: { type: 'result', modeId: 1 },
    no: { type: 'result', modeId: 0 }
  }
};
