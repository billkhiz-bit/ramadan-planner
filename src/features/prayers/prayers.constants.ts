import type { DailyPrayers } from '../../shared/types';

export const PRAYER_LIST: { key: keyof DailyPrayers; label: string; arabicLabel: string; isFardh: boolean }[] = [
  { key: 'fajr', label: 'Fajr', arabicLabel: 'الفجر', isFardh: true },
  { key: 'dhuhr', label: 'Dhuhr', arabicLabel: 'الظهر', isFardh: true },
  { key: 'asr', label: 'Asr', arabicLabel: 'العصر', isFardh: true },
  { key: 'maghrib', label: 'Maghrib', arabicLabel: 'المغرب', isFardh: true },
  { key: 'isha', label: 'Isha', arabicLabel: 'العشاء', isFardh: true },
  { key: 'tarawih', label: 'Tarawih', arabicLabel: 'التراويح', isFardh: false },
  { key: 'tahajjud', label: 'Tahajjud', arabicLabel: 'التهجد', isFardh: false },
];

export const ENCOURAGING_MESSAGES = [
  'MashaAllah! Keep going!',
  'Every prayer is a step closer to Allah.',
  'Your dedication is inspiring.',
  'Allah sees your effort.',
  'SubhanAllah, well done!',
  'May your prayers be accepted.',
  'The best of deeds are those done consistently.',
];

export function getEncouragingMessage(completed: number, total: number): string | null {
  if (completed === 0) return null;
  if (completed === total) return 'All prayers completed! MashaAllah!';
  if (completed >= 5) return ENCOURAGING_MESSAGES[Math.floor(Math.random() * ENCOURAGING_MESSAGES.length)];
  return null;
}
