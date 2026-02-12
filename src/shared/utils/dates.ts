import { format, addDays, differenceInCalendarDays, isToday as isTodayFns } from 'date-fns';
import type { DateKey } from '../types';

export function getToday(): DateKey {
  return format(new Date(), 'yyyy-MM-dd');
}

export function isToday(dateKey: DateKey): boolean {
  return isTodayFns(new Date(dateKey + 'T00:00:00'));
}

export function formatDateDisplay(dateKey: DateKey): string {
  return format(new Date(dateKey + 'T00:00:00'), 'EEEE, MMMM d');
}

export function formatDateShort(dateKey: DateKey): string {
  return format(new Date(dateKey + 'T00:00:00'), 'MMM d');
}

export function getRamadanDay(dateKey: DateKey, startDate: string): number {
  const start = new Date(startDate + 'T00:00:00');
  const current = new Date(dateKey + 'T00:00:00');
  return differenceInCalendarDays(current, start) + 1;
}

export function getRamadanDateKeys(startDate: string, days: 29 | 30): DateKey[] {
  const start = new Date(startDate + 'T00:00:00');
  return Array.from({ length: days }, (_, i) =>
    format(addDays(start, i), 'yyyy-MM-dd')
  );
}

export function isWithinRamadan(dateKey: DateKey, startDate: string, days: 29 | 30): boolean {
  const day = getRamadanDay(dateKey, startDate);
  return day >= 1 && day <= days;
}
