import { Minus, Plus } from 'lucide-react';
import { useStore } from '../../../store';
import type { DateKey } from '../../../shared/types';

interface PagesInputProps {
  dateKey: DateKey;
}

export function PagesInput({ dateKey }: PagesInputProps) {
  const pages = useStore((s) => s.quranPages[dateKey] ?? 0);
  const setQuranPages = useStore((s) => s.setQuranPages);

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setQuranPages(dateKey, pages - 1)}
        disabled={pages <= 0}
        className="w-8 h-8 rounded-full border border-cream-300 dark:border-surface-700 flex items-center justify-center text-teal-700 dark:text-cream-300 hover:bg-cream-100 dark:hover:bg-surface-700 disabled:opacity-30 transition-colors"
      >
        <Minus size={14} />
      </button>
      <div className="text-center min-w-[60px]">
        <span className="text-2xl font-bold text-teal-900 dark:text-cream-100 tabular-nums">{pages}</span>
        <span className="text-xs text-teal-600 dark:text-cream-400 block">pages</span>
      </div>
      <button
        onClick={() => setQuranPages(dateKey, pages + 1)}
        className="w-8 h-8 rounded-full border border-cream-300 dark:border-surface-700 flex items-center justify-center text-teal-700 dark:text-cream-300 hover:bg-cream-100 dark:hover:bg-surface-700 transition-colors"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
