import { Moon, Sun, CloudSun, Sunrise, Sunset } from 'lucide-react';
import { useStore } from '../../../store';
import { Card } from '../../../shared/components/Card';
import type { DateKey, FastingStatus } from '../../../shared/types';

interface FastingTrackerProps {
  dateKey: DateKey;
}

const STATUS_OPTIONS: { value: FastingStatus; label: string; icon: typeof Moon; color: string }[] = [
  { value: 'fasted', label: 'Fasted', icon: Moon, color: 'sage' },
  { value: 'partial', label: 'Partial', icon: CloudSun, color: 'gold' },
  { value: 'not_fasting', label: 'Not Fasting', icon: Sun, color: 'warm-red' },
];

export function FastingTracker({ dateKey }: FastingTrackerProps) {
  const fasting = useStore((s) => s.fasting[dateKey]);
  const setFastingStatus = useStore((s) => s.setFastingStatus);
  const setFastingTime = useStore((s) => s.setFastingTime);
  const prayerTimes = useStore((s) => s.prayerTimesCache[dateKey]);

  const status = fasting?.status ?? 'none';

  function handleStatusClick(value: FastingStatus) {
    const newStatus = status === value ? 'none' : value;
    setFastingStatus(dateKey, newStatus);

    // Auto-fill times when selecting "Fasted" and times are empty
    if (newStatus === 'fasted' && prayerTimes) {
      if (!fasting?.suhoorTime) {
        setFastingTime(dateKey, 'suhoorTime', prayerTimes.Fajr);
      }
      if (!fasting?.iftarTime) {
        setFastingTime(dateKey, 'iftarTime', prayerTimes.Maghrib);
      }
    }
  }

  return (
    <Card>
      <h2 className="text-sm font-semibold text-teal-900 dark:text-cream-100 mb-3">
        Fasting
      </h2>

      {/* Always show Suhoor/Iftar times from API */}
      {prayerTimes && (
        <div className="flex gap-3 mb-3">
          <div className="flex-1 flex items-center gap-2 py-2 px-3 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/30">
            <Sunrise size={14} className="text-teal-500 dark:text-teal-400 flex-shrink-0" />
            <div>
              <span className="text-[10px] font-medium text-teal-500 dark:text-teal-400 uppercase tracking-wider block">Suhoor</span>
              <span className="text-sm font-semibold text-teal-800 dark:text-cream-200 tabular-nums">{prayerTimes.Fajr}</span>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-2 py-2 px-3 rounded-lg bg-gold-50 dark:bg-gold-500/10 border border-gold-100 dark:border-gold-500/20">
            <Sunset size={14} className="text-gold-500 dark:text-gold-400 flex-shrink-0" />
            <div>
              <span className="text-[10px] font-medium text-gold-500 dark:text-gold-400 uppercase tracking-wider block">Iftar</span>
              <span className="text-sm font-semibold text-gold-700 dark:text-gold-300 tabular-nums">{prayerTimes.Maghrib}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {STATUS_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const active = status === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => handleStatusClick(opt.value)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-lg border-2 text-xs font-medium transition-all ${
                active
                  ? opt.color === 'sage'
                    ? 'border-sage-500 bg-sage-50 text-sage-700 dark:border-sage-400 dark:bg-sage-900/30 dark:text-sage-300'
                    : opt.color === 'gold'
                    ? 'border-gold-400 bg-gold-50 text-gold-700 dark:border-gold-400 dark:bg-gold-500/10 dark:text-gold-300'
                    : 'border-warm-red-400 bg-warm-red-400/10 text-warm-red-500 dark:border-warm-red-400 dark:bg-warm-red-500/10'
                  : 'border-cream-200 dark:border-surface-700 text-teal-700 dark:text-cream-300 hover:border-cream-300'
              }`}
            >
              <Icon size={18} />
              {opt.label}
            </button>
          );
        })}
      </div>

      {status === 'fasted' && (
        <div className="mt-3 flex gap-3">
          <div className="flex-1">
            <label className="text-[10px] font-medium text-teal-600 dark:text-cream-400 uppercase tracking-wider">
              Suhoor time
            </label>
            <input
              type="time"
              value={fasting?.suhoorTime ?? ''}
              onChange={(e) => setFastingTime(dateKey, 'suhoorTime', e.target.value)}
              className="w-full mt-1 text-sm bg-white dark:bg-surface-800 border border-cream-200 dark:border-surface-700 rounded-lg px-2 py-1.5 text-teal-900 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-medium text-teal-600 dark:text-cream-400 uppercase tracking-wider">
              Iftar time
            </label>
            <input
              type="time"
              value={fasting?.iftarTime ?? ''}
              onChange={(e) => setFastingTime(dateKey, 'iftarTime', e.target.value)}
              className="w-full mt-1 text-sm bg-white dark:bg-surface-800 border border-cream-200 dark:border-surface-700 rounded-lg px-2 py-1.5 text-teal-900 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
        </div>
      )}
    </Card>
  );
}
