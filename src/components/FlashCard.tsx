import { useEffect } from 'react';
import type { OptionKey, QuizQuestion } from '../types';

interface FlashCardProps {
  question: QuizQuestion;
  revealed: boolean;
  onReveal: () => void;
  onNext: () => void;
  onPrevious: () => void;
  hasPrevious: boolean;
  isLast: boolean;
}

export default function FlashCard({
  question,
  revealed,
  onReveal,
  onNext,
  onPrevious,
  hasPrevious,
  isLast,
}: FlashCardProps) {
  const entries = Object.entries(question.options) as [OptionKey, string][];

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!revealed && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        onReveal();
      } else if (revealed && (e.key === 'ArrowRight' || e.key === 'Enter')) {
        onNext();
      } else if (e.key === 'ArrowLeft' && hasPrevious) {
        onPrevious();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [revealed, onReveal, onNext, onPrevious, hasPrevious]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-10">
      <div
        onClick={!revealed ? onReveal : undefined}
        className={!revealed ? '-m-2 cursor-pointer rounded-lg p-2 transition hover:bg-sky-50/60' : ''}
      >
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-flutter-blue lg:text-sm xl:text-base">
          {question.moduleShort}
        </p>
        <h2 className="mb-5 font-serif text-lg leading-snug text-slate-900 sm:text-xl lg:mb-8 lg:text-3xl xl:text-4xl">
          {question.q}
        </h2>

        <div className="flex flex-col gap-2.5 lg:gap-4">
          {entries.map(([key, label]) => {
            const isCorrectOption = revealed && key === question.answer;
            const stateClasses = !revealed
              ? 'border-slate-300 bg-white'
              : isCorrectOption
                ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                : 'border-slate-200 bg-slate-50 text-slate-400';

            return (
              <div
                key={key}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm transition sm:text-base lg:gap-4 lg:px-6 lg:py-4 lg:text-lg xl:text-xl ${stateClasses}`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-xs font-semibold lg:h-8 lg:w-8 lg:text-sm xl:h-9 xl:w-9 xl:text-base">
                  {key}
                </span>
                <span>{label}</span>
              </div>
            );
          })}
        </div>

        {!revealed && (
          <p className="mt-5 text-center text-sm font-medium text-flutter-cyan lg:mt-8 lg:text-base">
            Nhấn vào thẻ để xem đáp án
          </p>
        )}
      </div>

      {revealed && question.explanation && (
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
