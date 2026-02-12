import { CalendarDays } from 'lucide-react';
import { useStore } from '../store';
import { Card } from '../shared/components/Card';
import { CalendarGrid } from '../features/calendar/components/CalendarGrid';
import { formatDateDisplay, getRamadanDay } from '../shared/utils/dates';

export function CalendarView() {
  const selectedDate = useStore((s) => s.selectedDate);
  const setSelectedDate = useStore((s) => s.setSelectedDate);
  const setActiveView = useStore((s) => s.setActiveView);
  const settings = useStore((s) => s.settings);

  function handleSelectDate(dateKey: string) {
    setSelectedDate(dateKey);
    setActiveView('daily');
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CalendarDays size={20} className="text-teal-600 dark:text-gold-400" />
        <h1 className="text-lg font-bold text-teal-900 dark:text-cream-100">Ramadan Calendar</h1>
      </div>

      <p className="text-xs text-teal-600 dark:text-cream-400">
        {settings.ramadanDays} days starting {formatDateDisplay(settings.ramadanStartDate)}
      </p>

      <Card>
        <CalendarGrid
          onSelectDate={handleSelectDate}
          selectedDate={selectedDate}
        />
      </Card>

      <p className="text-xs text-center text-teal-600 dark:text-cream-400">
        Currently viewing: Day {getRamadanDay(selectedDate, settings.ramadanStartDate)} — {formatDateDisplay(selectedDate)}
      </p>
      <p className="text-xs text-center text-teal-500 dark:text-cream-500">
        Tap any day to view its details
      </p>
    </div>
  );
}
