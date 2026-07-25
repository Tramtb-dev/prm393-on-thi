import type { ProgressState } from '../types';

interface ScoreSummaryProps {
  progress: ProgressState;
  onReviewMistakes: () => void;
  onReset: () => void;
  reviewDisabled: boolean;
}

export default function ScoreSummary({ progress, onReviewMistakes, onReset, reviewDisabled }: ScoreSummaryProps) {
  const accuracy =
    progress.totalAnswered > 0 ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100) : 0;
  const mistakeCount = Object.keys(progress.mistakes).length;

  function handleReset() {
    if (window.confirm('Xóa toàn bộ tiến trình học đã lưu? Hành động này không thể hoàn tác.')) {
      onReset();
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 lg:mb-0">
            Tiến trình tổng
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center lg:flex lg:gap-10">
          <div>
            <div className="text-2xl font-bold text-slate-800 lg:text-3xl">{progress.totalAnswered}</div>
            <div className="text-xs text-slate-500 lg:text-sm">Đã luyện</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-flutter-blue lg:text-3xl">{accuracy}%</div>
            <div className="text-xs text-slate-500 lg:text-sm">Độ chính xác</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-500 lg:text-3xl">{progress.currentStreak}</div>
            <div className="text-xs text-slate-500 lg:text-sm">Ngày liên tiếp</div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
          <button
            type="button"
            onClick={onReviewMistakes}
            disabled={reviewDisabled || mistakeCount === 0}
            className="flex-1 rounded-lg bg-flutter-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-40 lg:px-5 lg:py-2.5"
          >
            Ôn lại câu sai ({mistakeCount})
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 lg:px-5 lg:py-2.5"
          >
            Reset tiến trình
          </button>
        </div>
      </div>
    </div>
  );
}
