import { getModuleOptions, sectionOptions } from '../lib/quiz';
import type { SectionFilter } from '../types';

interface FiltersProps {
  moduleFilter: string;
  sectionFilter: SectionFilter;
  shuffle: boolean;
  disabled: boolean;
  onModuleChange: (value: string) => void;
  onSectionChange: (value: SectionFilter) => void;
  onShuffleChange: (value: boolean) => void;
}

export default function Filters({
  moduleFilter,
  sectionFilter,
  shuffle,
  disabled,
  onModuleChange,
  onSectionChange,
  onShuffleChange,
}: FiltersProps) {
  const moduleOptions = getModuleOptions();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <label className="flex-1 min-w-0">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Module</span>
        <select
          value={moduleFilter}
          disabled={disabled}
          onChange={(e) => onModuleChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-flutter-blue focus:outline-none focus:ring-1 focus:ring-flutter-blue disabled:opacity-50"
        >
          <option value="all">Tất cả module</option>
          {moduleOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex-1 min-w-0">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Dạng câu</span>
        <select
          value={sectionFilter}
          disabled={disabled}
          onChange={(e) => onSectionChange(e.target.value as SectionFilter)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-flutter-blue focus:outline-none focus:ring-1 focus:ring-flutter-blue disabled:opacity-50"
        >
          {sectionOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 pb-2 sm:pb-2.5">
        <input
          type="checkbox"
          checked={shuffle}
          disabled={disabled}
          onChange={(e) => onShuffleChange(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-flutter-blue focus:ring-flutter-blue disabled:opacity-50"
        />
        <span className="text-sm text-slate-700 select-none">Xáo trộn câu hỏi</span>
      </label>
    </div>
  );
}
