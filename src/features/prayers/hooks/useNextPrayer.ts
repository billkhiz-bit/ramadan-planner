import { useState, useEffect } from 'react';
import { useStore } from '../../../store';
import { isToday } from '../../../shared/utils/dates';
import type { DateKey, PrayerTimes } from '../../../shared/types';

interface NextPrayerInfo {
  name: string;
  time: string;
  countdown: string;
  key: string;
}

const TIMED_PRAYERS: { key: string; name: string; field: keyof PrayerTimes }[] = [
  { key: 'fajr', name: 'Fajr', field: 'Fajr' },
  { key: 'dhuhr', name: 'Dhuhr', field: 'Dhuhr' },
  { key: 'asr', name: 'Asr', field: 'Asr' },
  { key: 'maghrib', name: 'Maghrib', field: 'Maghrib' },
  { key: 'isha', name: 'Isha', field: 'Isha' },
];

function parseTime(timeStr: string): { hours: number; minutes: number } | null {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return { hours: parseInt(match[1], 10), minutes: parseInt(match[2], 10) };
}

function formatCountdown(diffMinutes: number): string {
  const h = Math.floor(diffMinutes / 60);
  const m = diffMinutes % 60;
  if (h === 0) return `in ${m}m`;
  if (m === 0) return `in ${h}h`;
  return `in ${h}h ${m}m`;
}

export function useNextPrayer(dateKey: DateKey): NextPrayerInfo | null {
  const prayerTimes = useStore((s) => s.prayerTimesCache[dateKey]);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!isToday(dateKey)) return;
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, [dateKey]);

  if (!prayerTimes || !isToday(dateKey)) return null;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const prayer of TIMED_PRAYERS) {
    const parsed = parseTime(prayerTimes[prayer.field]);
    if (!parsed) continue;
    const prayerMinutes = parsed.hours * 60 + parsed.minutes;
    if (prayerMinutes > currentMinutes) {
      return {
        name: prayer.name,
        time: prayerTimes[prayer.field],
        countdown: formatCountdown(prayerMinutes - currentMinutes),
        key: prayer.key,
      };
    }
  }

  return null;
}

export function usePassedPrayerKeys(dateKey: DateKey): Set<string> {
  const prayerTimes = useStore((s) => s.prayerTimesCache[dateKey]);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!isToday(dateKey)) return;
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, [dateKey]);

  const passed = new Set<string>();
  if (!prayerTimes || !isToday(dateKey)) return passed;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const prayer of TIMED_PRAYERS) {
    const parsed = parseTime(prayerTimes[prayer.field]);
    if (!parsed) continue;
    if (parsed.hours * 60 + parsed.minutes <= currentMinutes) {
      passed.add(prayer.key);
    }
  }

  return passed;
}
