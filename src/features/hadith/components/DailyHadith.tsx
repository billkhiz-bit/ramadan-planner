import { Scroll } from 'lucide-react';
import { Card } from '../../../shared/components/Card';
import { RAMADAN_HADITHS } from '../hadith.constants';
import { getRamadanDay, isWithinRamadan } from '../../../shared/utils/dates';
import { useStore } from '../../../store';
import type { DateKey } from '../../../shared/types';

interface DailyHadithProps {
  dateKey: DateKey;
}

export function DailyHadith({ dateKey }: DailyHadithProps) {
  const settings = useStore((s) => s.settings);
  const withinRamadan = isWithinRamadan(dateKey, settings.ramadanStartDate, settings.ramadanDays);

  if (!withinRamadan) return null;

  const ramadanDay = getRamadanDay(dateKey, settings.ramadanStartDate);
  const hadith = RAMADAN_HADITHS[(ramadanDay - 1) % RAMADAN_HADITHS.length];

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <Scroll size={16} className="text-gold-500" />
        <h2 className="text-sm font-semibold text-teal-900 dark:text-cream-100">Hadith of the Day</h2>
      </div>

      <p className="text-sm text-teal-700 dark:text-cream-300 leading-relaxed italic">
        &ldquo;{hadith.text}&rdquo;
      </p>

      <p className="mt-2 text-xs text-teal-500 dark:text-cream-400 text-right">
        — {hadith.narrator} | {hadith.source}
      </p>
    </Card>
  );
}
