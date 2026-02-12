import { useStore } from '../../../store';
import { isToday } from '../../../shared/utils/dates';
import type { DateKey } from '../../../shared/types';

interface CalendarDayProps {
  dateKey: DateKey;
  dayNumber: number;
  onSelect: (dateKey: DateKey) => void;
  isSelected: boolean;
}

export function CalendarDay({ dateKey, dayNumber, onSelect, isSelected }: CalendarDayProps) {
  const prayers = useStore((s) => s.prayers[dateKey]);
  const fasting = useStore((s) => s.fasting[dateKey]);
  const quranPages = useStore((s) => s.quranPages[dateKey] ?? 0);
  const dhikrCounts = useStore((s) => s.dhikrCounts[dateKey]);
  const dhikrItems = useStore((s) => s.dhikrItems);
  const journal = useStore((s) => s.journals[dateKey]);

  const today = isToday(dateKey);

  // Compute completion dots
  const prayerCount = prayers ? Object.values(prayers).filter(Boolean).length : 0;
  const hasPrayers = prayerCount >= 5;
  const hasFasting = fasting?.status === 'fasted';
  const hasQuran = quranPages > 0;
  const hasDhikr = dhikrItems.some((d) => (dhikrCounts?.[d.id] ?? 0) >= d.target);
  const hasJournal = (journal?.content?.length ?? 0) > 0;

  const dots = [
    { active: hasPrayers, color: 'bg-sage-500' },
    { active: hasFasting, color: 'bg-teal-500' },
    { active: hasQuran, color: 'bg-gold-400' },
    { active: hasDhikr, color: 'bg-teal-400' },
    { active: hasJournal, color: 'bg-gold-500' },
  ];

  return (
    <button
      onClick={() => onSelect(dateKey)}
      className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition-all ${
        isSelected
          ? 'bg-teal-100 dark:bg-teal-900/40 ring-2 ring-teal-500'
          : today
          ? 'bg-gold-50 dark:bg-gold-500/10 ring-1 ring-gold-300 dark:ring-gold-500/30'
          : 'hover:bg-cream-100 dark:hover:bg-surface-700'
      }`}
    >
      <span className={`text-xs font-bold ${
        isSelected ? 'text-teal-700 dark:text-teal-300' : today ? 'text-gold-600 dark:text-gold-400' : 'text-teal-900 dark:text-cream-100'
      }`}>
        {dayNumber}
      </span>
      <div className="flex gap-0.5">
        {dots.map((dot, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${
              dot.active ? dot.color : 'bg-cream-300 dark:bg-surface-700'
            }`}
          />
        ))}
      </div>
    </button>
  );
}
