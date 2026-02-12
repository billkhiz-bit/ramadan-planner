import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { ProgressBar } from '../../../shared/components/ProgressBar';
import type { DhikrItem as DhikrItemType } from '../../../shared/types';

interface DhikrItemProps {
  item: DhikrItemType;
  count: number;
  onIncrement: () => void;
  onReset: () => void;
}

export function DhikrItemRow({ item, count, onIncrement, onReset }: DhikrItemProps) {
  const [pulsing, setPulsing] = useState(false);
  const progress = Math.min(count / item.target, 1);
  const completed = count >= item.target;

  function handleTap() {
    if (!completed) {
      onIncrement();
      setPulsing(true);
      setTimeout(() => setPulsing(false), 150);
    }
  }

  return (
    <button
      onClick={handleTap}
      className={`w-full text-left p-3 rounded-lg transition-all ${pulsing ? 'tap-pulse' : ''} ${
        completed
          ? 'bg-sage-50 dark:bg-sage-900/20 border border-sage-200 dark:border-sage-800'
          : 'bg-cream-100 dark:bg-surface-700 border border-cream-200 dark:border-surface-700 active:bg-cream-200 dark:active:bg-surface-900'
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div>
          <span className="text-sm font-medium text-teal-900 dark:text-cream-100">{item.name}</span>
          <span className="text-xs text-teal-600 dark:text-cream-400 ml-2 font-arabic">{item.arabicName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold tabular-nums ${completed ? 'text-sage-600 dark:text-sage-400' : 'text-teal-900 dark:text-cream-100'}`}>
            {count}
          </span>
          <span className="text-xs text-teal-600 dark:text-cream-400">/ {item.target}</span>
          {count > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); onReset(); }}
              className="p-1 rounded hover:bg-cream-200 dark:hover:bg-surface-800 text-teal-500 dark:text-cream-400"
            >
              <RotateCcw size={12} />
            </button>
          )}
        </div>
      </div>
      <ProgressBar progress={progress} color={completed ? 'sage' : 'teal'} size="sm" />
    </button>
  );
}
