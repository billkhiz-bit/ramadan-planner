import { useStore } from '../../store';
import { PRAYER_LIST } from '../../features/prayers/prayers.constants';
import type { DateKey } from '../../shared/types';

interface SummaryPillsProps {
  dateKey: DateKey;
}

export function SummaryPills({ dateKey }: SummaryPillsProps) {
  const prayers = useStore((s) => s.prayers[dateKey]);
  const fasting = useStore((s) => s.fasting[dateKey]);
  const quranPages = useStore((s) => s.quranPages[dateKey] ?? 0);
  const dhikrItems = useStore((s) => s.dhikrItems);
  const dhikrCounts = useStore((s) => s.dhikrCounts[dateKey]);

  const prayerCount = prayers
    ? Object.values(prayers).filter(Boolean).length
    : 0;

  const fastingLabel =
    fasting?.status === 'fasted' ? 'Fasted' :
    fasting?.status === 'partial' ? 'Partial' :
    fasting?.status === 'not_fasting' ? 'Not Fasting' :
    '—';

  const dhikrComplete = dhikrItems.filter(
    (d) => (dhikrCounts?.[d.id] ?? 0) >= d.target
  ).length;

  const pills = [
    { label: `${prayerCount}/${PRAYER_LIST.length} prayers`, active: prayerCount > 0 },
    { label: fastingLabel, active: fasting?.status === 'fasted' },
    { label: `${quranPages} pages`, active: quranPages > 0 },
    { label: `${dhikrComplete}/${dhikrItems.length} dhikr`, active: dhikrComplete > 0 },
  ];

  return (
    <div className="flex flex-wrap gap-1.5">
      {pills.map((pill) => (
        <span
          key={pill.label}
          className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-colors ${
            pill.active
              ? 'bg-sage-100 text-sage-700 dark:bg-sage-900/30 dark:text-sage-300'
              : 'bg-cream-100 text-cream-400 dark:bg-surface-700 dark:text-cream-500'
          }`}
        >
          {pill.label}
        </span>
      ))}
    </div>
  );
}
