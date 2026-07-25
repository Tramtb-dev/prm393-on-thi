interface ProgressBarProps {
  current: number;
  total: number;
  correct: number;
  wrong: number;
}

export default function ProgressBar({ current, total, correct, wrong }: ProgressBarProps) {
  const pct = total > 0 ? Math.round(((current - 1) / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-500">
        <span>
          Câu {Math.min(current, total)}/{total}
        </span>
        <span className="flex gap-3">
          <span className="text-emerald-600">Đúng {correct}</span>
          <span className="text-rose-500">Sai {wrong}</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-flutter-blue transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
