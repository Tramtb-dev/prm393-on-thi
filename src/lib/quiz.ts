import rawData from '../data/quiz_data.json';
import type { QuizQuestion, SectionFilter } from '../types';

export const quizData = rawData as QuizQuestion[];

export function getModuleOptions(): { value: string; label: string }[] {
  const seen = new Set<string>();
  const options: { value: string; label: string }[] = [];
  for (const item of quizData) {
    if (!seen.has(item.moduleShort)) {
      seen.add(item.moduleShort);
      options.push({ value: item.moduleShort, label: item.moduleShort });
    }
  }
  return options;
}

export const sectionOptions: { value: SectionFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả dạng câu' },
  { value: 'A', label: 'Which / What (A)' },
  { value: 'B', label: 'Why (B)' },
  { value: 'C', label: 'Bổ sung (C)' },
  { value: 'sample', label: 'Đề mẫu gốc' },
];

export function filterQuestions(
  data: QuizQuestion[],
  moduleFilter: string,
  sectionFilter: SectionFilter,
): QuizQuestion[] {
  return data.filter((item) => {
    if (moduleFilter !== 'all' && item.moduleShort !== moduleFilter) return false;
    if (sectionFilter === 'all') return true;
    if (sectionFilter === 'sample') return item.section === null;
    return item.section === sectionFilter;
  });
}

export function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

