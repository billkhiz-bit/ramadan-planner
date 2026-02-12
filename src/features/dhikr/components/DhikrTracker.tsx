import { Heart } from 'lucide-react';
import { useStore } from '../../../store';
import { Card } from '../../../shared/components/Card';
import { DhikrItemRow } from './DhikrItem';
import type { DateKey } from '../../../shared/types';

interface DhikrTrackerProps {
  dateKey: DateKey;
}

export function DhikrTracker({ dateKey }: DhikrTrackerProps) {
  const dhikrItems = useStore((s) => s.dhikrItems);
  const dayCounts = useStore((s) => s.dhikrCounts[dateKey]);
  const incrementDhikr = useStore((s) => s.incrementDhikr);
  const resetDhikr = useStore((s) => s.resetDhikr);

  const totalTarget = dhikrItems.reduce((sum, d) => sum + d.target, 0);
  const totalCount = dhikrItems.reduce((sum, d) => sum + Math.min(dayCounts?.[d.id] ?? 0, d.target), 0);
  const allComplete = totalCount >= totalTarget && totalTarget > 0;

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Heart size={16} className="text-teal-500" />
          <h2 className="text-sm font-semibold text-teal-900 dark:text-cream-100">Dhikr</h2>
        </div>
        <span className="text-xs text-teal-600 dark:text-cream-400">
          Tap to count
        </span>
      </div>

      <div className="space-y-2">
        {dhikrItems.map((item) => (
          <DhikrItemRow
            key={item.id}
            item={item}
            count={dayCounts?.[item.id] ?? 0}
            onIncrement={() => incrementDhikr(dateKey, item.id)}
            onReset={() => resetDhikr(dateKey, item.id)}
          />
        ))}
      </div>

      {allComplete && (
        <p className="mt-3 text-xs text-sage-600 dark:text-sage-400 text-center">
          All dhikr targets reached! SubhanAllah!
        </p>
      )}
    </Card>
  );
}
