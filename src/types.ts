import { LucideIcon } from 'lucide-react';

export type ModeId = 0 | 1 | 2 | 3 | 4;

export interface Mode {
  id: ModeId;
  name: string;
  title: string;
  description: string;
  requirements: string[];
  examples: string[];
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
}

export interface Question {
  id: string;
  text: string;
  helperText?: string;
  icon: string;
}

export type StepAction = {
  type: 'question';
  id: string;
} | {
  type: 'result';
  modeId: ModeId;
};

export type DecisionNode = {
  id: string;
  yes: StepAction;
  no: StepAction;
};

export interface AssessmentState {
  activity: string;
  currentStepId: string;
  path: { questionId: string; answer: boolean }[];
  result?: ModeId;
}
