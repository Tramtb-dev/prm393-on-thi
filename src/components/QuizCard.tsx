import { useEffect } from 'react';
import type { OptionKey, QuizQuestion } from '../types';

interface QuizCardProps {
  question: QuizQuestion;
  selected: OptionKey | null;
  onSelect: (key: OptionKey) => void;
  onNext: () => void;
  onPrevious: () => void;
  hasPrevious: boolean;
  isLast: boolean;
}

const KEY_MAP: Record<string, OptionKey> = {
  '1': 'A',
  '2': 'B',
  '3': 'C',
  '4': 'D',
  a: 'A',
  b: 'B',
  c: 'C',
  d: 'D',
};

export default function QuizCard({
  question,
  selected,
  onSelect,
  onNext,
  onPrevious,
  hasPrevious,
  isLast,
}: QuizCardProps) {
  const entries = Object.entries(question.options) as [OptionKey, string][];

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (selected === null) {
        const mapped = KEY_MAP[e.key.toLowerCase()];
        if (mapped && question.options[mapped]) {
          onSelect(mapped);
          return;
        }
      }
      if (e.key === 'ArrowRight' || e.key === 'Enter') onNext();
      else if (e.key === 'ArrowLeft' && hasPrevious) onPrevious();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selected, question, onSelect, onNext, onPrevious, hasPrevious]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-10">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-flutter-blue lg:text-sm xl:text-base">
        {question.moduleShort}
      </p>
      <h2 className="mb-5 font-serif text-lg leading-snug text-slate-900 sm:text-xl lg:mb-8 lg:text-3xl xl:text-4xl">
        {question.q}
      </h2>

      <div className="flex flex-col gap-2.5 lg:gap-4">
        {entries.map(([key, label]) => {
          const isCorrectOption = key === question.answer;
          const isSelectedOption = key === selected;
          let stateClasses = 'border-slate-300 bg-white hover:border-flutter-blue hover:bg-sky-50';

          if (selected !== null) {
            if (isCorrectOption) {
              stateClasses = 'border-emerald-500 bg-emerald-50 text-emerald-900';
            } else if (isSelectedOption) {
              stateClasses = 'border-rose-500 bg-rose-50 text-rose-900';
            } else {
              stateClasses = 'border-slate-200 bg-slate-50 text-slate-400';
            }
          }

          return (
            <button
              key={key}
              type="button"
              aria-label={`Đáp án ${key}`}
              onClick={() => onSelect(key)}
              disabled={selected !== null}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition disabled:cursor-default sm:text-base lg:gap-4 lg:px-6 lg:py-4 lg:text-lg xl:text-xl ${stateClasses}`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-xs font-semibold lg:h-8 lg:w-8 lg:text-sm xl:h-9 xl:w-9 xl:text-base">
                {key}
              </span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {selected !== null && question.explanation && (
        <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600 lg:mt-6 lg:p-5 lg:text-base">
          <span className="font-semibold text-slate-700">Giải thích: </span>
          {question.explanation}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between gap-3 lg:mt-8">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 lg:px-6 lg:py-3 lg:text-base"
        >
          ← Câu trước
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-lg bg-flutter-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 sm:px-6 lg:px-8 lg:py-3 lg:text-base"
        >
          {isLast ? 'Hoàn thành phiên học' : 'Câu sau →'}
        </button>
      </div>
    </div>
  );
}
