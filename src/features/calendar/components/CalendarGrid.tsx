import { useStore } from '../../../store';
import { getRamadanDateKeys } from '../../../shared/utils/dates';
import { CalendarDay } from './CalendarDay';
import type { DateKey } from '../../../shared/types';

interface CalendarGridProps {
  onSelectDate: (dateKey: DateKey) => void;
  selectedDate: DateKey;
}

export function CalendarGrid({ onSelectDate, selectedDate }: CalendarGridProps) {
  const settings = useStore((s) => s.settings);
  const dateKeys = getRamadanDateKeys(settings.ramadanStartDate, settings.ramadanDays);

  return (
    <div>
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-sage-500" />
          <span className="text-[10px] text-teal-600 dark:text-cream-400">Prayers</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-teal-500" />
          <span className="text-[10px] text-teal-600 dark:text-cream-400">Fasting</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-gold-400" />
          <span className="text-[10px] text-teal-600 dark:text-cream-400">Quran</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-teal-400" />
          <span className="text-[10px] text-teal-600 dark:text-cream-400">Dhikr</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-gold-500" />
          <span className="text-[10px] text-teal-600 dark:text-cream-400">Journal</span>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-1.5">
        {dateKeys.map((dk, i) => (
          <CalendarDay
            key={dk}
            dateKey={dk}
            dayNumber={i + 1}
            onSelect={onSelectDate}
            isSelected={selectedDate === dk}
          />
        ))}
      </div>
    </div>
  );
}
