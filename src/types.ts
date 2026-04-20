import { LucideIcon } from 'lucide-react';

export type ModeId = 0 | 1 | 2 | 3 | 4;
export type Language = 'en' | 'hi';

export interface Translation {
  title: string;
  description: string;
  requirements: string[];
  examples: string[];
}

export interface Mode {
  id: ModeId;
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  translations: Record<Language, Translation>;
}

export interface Question {
  id: string;
  translations: Record<Language, {
    text: string;
    helperText?: string;
  }>;
  icon: string;
}

export interface AssessmentRecord {
  id: string;
  activity: string;
  timestamp: number;
  result: ModeId;
  language: Language;
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
