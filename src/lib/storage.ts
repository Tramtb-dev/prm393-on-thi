import type { OptionKey, ProgressState, QuestionId, SectionFilter, StudyMode } from '../types';

const STORAGE_KEY = 'prm393-quiz-progress-v1';
const SESSION_STORAGE_KEY = 'prm393-quiz-session-v1';

export interface SessionState {
  moduleFilter: string;
  sectionFilter: SectionFilter;
  shuffle: boolean;
  reviewMode: boolean;
  mode: StudyMode;
  questionKeys: string[];
  currentIndex: number;
  sessionCorrect: number;
  sessionWrong: number;
  sessionAnswers: Record<string, OptionKey>;
  sessionRevealed: Record<string, boolean>;
}

export function loadSession(): SessionState | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionState;
  } catch {
    return null;
  }
}

export function saveSession(session: SessionState): void {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — fail silently
  }
}

export function questionKey(item: QuestionId): string {
  return `${item.moduleShort}::${item.q}`;
}

function defaultProgress(): ProgressState {
  return {
    totalAnswered: 0,
    totalCorrect: 0,
    mistakes: {},
    lastStudyDate: null,
    currentStreak: 0,
  };
}

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw);
    return { ...defaultProgress(), ...parsed };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(progress: ProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — fail silently
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function withStreakUpdate(progress: ProgressState): Pick<ProgressState, 'lastStudyDate' | 'currentStreak'> {
  const today = todayISO();
  if (progress.lastStudyDate === today) {
    return { lastStudyDate: progress.lastStudyDate, currentStreak: progress.currentStreak };
  }
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const nextStreak = progress.lastStudyDate === yesterday ? progress.currentStreak + 1 : 1;
  return { lastStudyDate: today, currentStreak: nextStreak };
}

export { defaultProgress };
