import { useStore } from '../../../store';
import { Card } from '../../../shared/components/Card';
import { ProgressBar } from '../../../shared/components/ProgressBar';
import { PrayerRow } from './PrayerRow';
import { NextPrayerBanner } from './NextPrayerBanner';
import { useNextPrayer, usePassedPrayerKeys } from '../hooks/useNextPrayer';
import { PRAYER_LIST, getEncouragingMessage } from '../prayers.constants';
import type { DailyPrayers, DateKey } from '../../../shared/types';

interface PrayerTrackerProps {
  dateKey: DateKey;
}

export function PrayerTracker({ dateKey }: PrayerTrackerProps) {
  const prayers = useStore((s) => s.prayers[dateKey]);
  const togglePrayer = useStore((s) => s.togglePrayer);
  const prayerTimes = useStore((s) => s.prayerTimesCache[dateKey]);
  const nextPrayer = useNextPrayer(dateKey);
  const passedKeys = usePassedPrayerKeys(dateKey);

  const dayPrayers = prayers ?? {
    fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false, tarawih: false, tahajjud: false,
  };

  const completed = Object.values(dayPrayers).filter(Boolean).length;
  const total = PRAYER_LIST.length;
  const message = getEncouragingMessage(completed, total);

  const timeMap: Record<string, string | undefined> = {
    fajr: prayerTimes?.Fajr,
    dhuhr: prayerTimes?.Dhuhr,
    asr: prayerTimes?.Asr,
    maghrib: prayerTimes?.Maghrib,
    isha: prayerTimes?.Isha,
  };

  // Find where to insert the "current time" divider line
  // It goes between the last passed timed prayer and the next upcoming one
  const timedPrayerKeys = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  let dividerAfterKey: string | null = null;
  if (nextPrayer && passedKeys.size > 0) {
    // Find the last passed timed prayer in the list order
    for (let i = timedPrayerKeys.length - 1; i >= 0; i--) {
      if (passedKeys.has(timedPrayerKeys[i])) {
        dividerAfterKey = timedPrayerKeys[i];
        break;
      }
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-teal-900 dark:text-cream-100">
          Prayers
        </h2>
        <span className="text-xs text-teal-600 dark:text-cream-400">{completed}/{total}</span>
      </div>

      <ProgressBar progress={completed / total} color="sage" size="sm" />

      {nextPrayer && (
        <div className="mt-3">
          <NextPrayerBanner
            name={nextPrayer.name}
            time={nextPrayer.time}
            countdown={nextPrayer.countdown}
          />
        </div>
      )}

      <div className={`${nextPrayer ? '' : 'mt-3 '}space-y-0.5`}>
        {PRAYER_LIST.map((prayer) => (
          <div key={prayer.key}>
            <PrayerRow
              label={prayer.label}
              arabicLabel={prayer.arabicLabel}
              time={timeMap[prayer.key]}
              checked={dayPrayers[prayer.key]}
              isFardh={prayer.isFardh}
              isNext={nextPrayer?.key === prayer.key}
              onToggle={() => togglePrayer(dateKey, prayer.key as keyof DailyPrayers)}
            />
            {dividerAfterKey === prayer.key && (
              <div className="flex items-center gap-2 my-1 px-3">
                <div className="h-px flex-1 bg-gold-300 dark:bg-gold-500/40" />
                <span className="text-[9px] font-medium text-gold-500 dark:text-gold-400 uppercase tracking-wider">
                  now
                </span>
                <div className="h-px flex-1 bg-gold-300 dark:bg-gold-500/40" />
              </div>
            )}
          </div>
        ))}
      </div>

      {message && (
        <p className="mt-3 text-xs text-sage-600 dark:text-sage-400 text-center gentle-float" key={completed}>
          {message}
        </p>
      )}
    </Card>
  );
}
