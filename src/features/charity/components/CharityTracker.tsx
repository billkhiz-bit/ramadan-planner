import { HandHeart, Trash2 } from 'lucide-react';
import { useStore } from '../../../store';
import { Card } from '../../../shared/components/Card';
import { CharityInput } from './CharityInput';
import { formatDateShort } from '../../../shared/utils/dates';
import type { DateKey } from '../../../shared/types';

interface CharityTrackerProps {
  dateKey: DateKey;
}

export function CharityTracker({ dateKey }: CharityTrackerProps) {
  const entries = useStore((s) => s.charityEntries);
  const removeCharity = useStore((s) => s.removeCharity);
  const currency = useStore((s) => s.settings.currency);

  const todayEntries = entries.filter((e) => e.dateKey === dateKey);
  const totalAll = entries.reduce((sum, e) => sum + e.amount, 0);
  const totalToday = todayEntries.reduce((sum, e) => sum + e.amount, 0);

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <HandHeart size={16} className="text-gold-500" />
          <h2 className="text-sm font-semibold text-teal-900 dark:text-cream-100">Charity</h2>
        </div>
        <div className="text-right">
          <span className="text-xs text-teal-600 dark:text-cream-400">Total: </span>
          <span className="text-sm font-bold text-gold-600 dark:text-gold-400">{currency} {totalAll.toFixed(2)}</span>
        </div>
      </div>

      <CharityInput dateKey={dateKey} />

      {todayEntries.length > 0 && (
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-teal-700 dark:text-cream-300">Today</span>
            <span className="text-xs text-teal-600 dark:text-cream-400">{currency} {totalToday.toFixed(2)}</span>
          </div>
          {todayEntries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-cream-100 dark:bg-surface-700"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-teal-900 dark:text-cream-100">
                  {currency} {entry.amount.toFixed(2)}
                </span>
                {entry.note && (
                  <span className="text-xs text-teal-600 dark:text-cream-400">{entry.note}</span>
                )}
                <span className="text-[10px] text-cream-400 dark:text-cream-500">
                  {formatDateShort(entry.dateKey)}
                </span>
              </div>
              <button
                onClick={() => removeCharity(entry.id)}
                className="p-1 text-warm-red-400 hover:text-warm-red-500"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
