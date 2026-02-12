import { BookOpen } from 'lucide-react';
import { Card } from '../../../shared/components/Card';
import { ProgressBar } from '../../../shared/components/ProgressBar';
import { PagesInput } from './PagesInput';
import { JuzGrid } from './JuzGrid';
import { useStore } from '../../../store';
import { TOTAL_PAGES } from '../quran.constants';
import type { DateKey } from '../../../shared/types';

interface QuranTrackerProps {
  dateKey: DateKey;
}

export function QuranTracker({ dateKey }: QuranTrackerProps) {
  const allPages = useStore((s) => s.quranPages);
  const totalRead = Object.values(allPages).reduce((sum, p) => sum + p, 0);

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-gold-500" />
          <h2 className="text-sm font-semibold text-teal-900 dark:text-cream-100">Quran</h2>
        </div>
        <span className="text-xs text-teal-600 dark:text-cream-400">{totalRead}/{TOTAL_PAGES} pages total</span>
      </div>

      <ProgressBar progress={totalRead / TOTAL_PAGES} color="gold" size="sm" />

      <div className="mt-4 flex justify-center">
        <PagesInput dateKey={dateKey} />
      </div>

      <div className="mt-4">
        <JuzGrid />
      </div>
    </Card>
  );
}
