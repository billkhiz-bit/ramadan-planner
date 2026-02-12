import { useStore } from '../store';
import { CrescentIcon } from '../shared/components/CrescentIcon';
import { PrayerTracker } from '../features/prayers/components/PrayerTracker';
import { FastingTracker } from '../features/fasting/components/FastingTracker';
import { QuranTracker } from '../features/quran/components/QuranTracker';
import { DhikrTracker } from '../features/dhikr/components/DhikrTracker';
import { JournalCard } from '../features/journal/components/JournalCard';
import { CharityTracker } from '../features/charity/components/CharityTracker';
import { DailyVerse } from '../features/quran/components/DailyVerse';
import { DailyHadith } from '../features/hadith/components/DailyHadith';
import { SummaryPills } from './components/SummaryPills';
import { SectionDivider } from './components/SectionDivider';
import { getRamadanDay, formatDateDisplay, isWithinRamadan } from '../shared/utils/dates';
import { AlertTriangle } from 'lucide-react';

export function DailyView() {
  const selectedDate = useStore((s) => s.selectedDate);
  const settings = useStore((s) => s.settings);
  const prayerTimesFetchError = useStore((s) => s.prayerTimesFetchError);

  const ramadanDay = getRamadanDay(selectedDate, settings.ramadanStartDate);
  const withinRamadan = isWithinRamadan(selectedDate, settings.ramadanStartDate, settings.ramadanDays);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <CrescentIcon size={20} className="text-gold-400" />
          <h1 className="text-lg font-bold text-teal-900 dark:text-cream-100">
            {withinRamadan ? `Day ${ramadanDay}` : 'Ramadan Planner'}
          </h1>
        </div>
        <p className="text-xs text-teal-600 dark:text-cream-400">
          {formatDateDisplay(selectedDate)}
        </p>
        {settings.name && (
          <p className="text-sm text-teal-700 dark:text-cream-300 mt-1">
            Assalamu Alaikum, {settings.name}
          </p>
        )}
      </div>

      {/* Summary Pills */}
      <SummaryPills dateKey={selectedDate} />

      {/* Prayer times error banner */}
      {prayerTimesFetchError && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-gold-100 dark:bg-gold-500/10 border border-gold-300 dark:border-gold-500/30">
          <AlertTriangle size={16} className="text-gold-600 dark:text-gold-400 flex-shrink-0" />
          <p className="text-xs text-gold-700 dark:text-gold-300">{prayerTimesFetchError}</p>
        </div>
      )}

      {/* Worship Section */}
      <SectionDivider label="Worship" />
      <PrayerTracker dateKey={selectedDate} />
      <FastingTracker dateKey={selectedDate} />

      {/* Growth Section */}
      <SectionDivider label="Growth" />
      <QuranTracker dateKey={selectedDate} />
      <DailyVerse dateKey={selectedDate} />
      <DhikrTracker dateKey={selectedDate} />

      {/* Reflection Section */}
      <SectionDivider label="Reflection" />
      <DailyHadith dateKey={selectedDate} />
      <JournalCard dateKey={selectedDate} />
      <CharityTracker dateKey={selectedDate} />
    </div>
  );
}
