export type OptionKey = 'A' | 'B' | 'C' | 'D';

export type Section = 'A' | 'B' | 'C' | null;

export interface QuizQuestion {
  module: string;
  moduleShort: string;
  section: Section;
  q: string;
  options: Partial<Record<OptionKey, string>>;
  answer: OptionKey;
  explanation: string;
}

export interface QuestionId {
  moduleShort: string;
  q: string;
}

export interface ProgressState {
  totalAnswered: number;
  totalCorrect: number;
  mistakes: Record<string, true>;
  lastStudyDate: string | null;
  currentStreak: number;
}

export type StudyMode = 'quiz' | 'flashcard';
export type SectionFilter = 'all' | 'A' | 'B' | 'C' | 'sample';
