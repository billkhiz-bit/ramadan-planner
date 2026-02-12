export type DateKey = string; // YYYY-MM-DD
export type ViewId = 'daily' | 'calendar' | 'progress' | 'settings';
export type FastingStatus = 'fasted' | 'partial' | 'not_fasting' | 'none';
export type CalculationMethod = 1 | 2 | 3 | 4 | 5 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export interface Settings {
  name: string;
  city: string;
  country: string;
  calculationMethod: CalculationMethod;
  ramadanStartDate: string; // YYYY-MM-DD
  ramadanDays: 29 | 30;
  currency: string;
  onboarded: boolean;
}

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface DailyPrayers {
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  tarawih: boolean;
  tahajjud: boolean;
}

export interface DailyFasting {
  status: FastingStatus;
  suhoorTime: string;
  iftarTime: string;
}

export interface DhikrItem {
  id: string;
  name: string;
  arabicName: string;
  target: number;
}

export interface JournalEntry {
  content: string;
  updatedAt: string;
}

export interface CharityEntry {
  id: string;
  amount: number;
  note: string;
  dateKey: DateKey;
  createdAt: string;
}

export interface DailyVerse {
  number: number;
  arabic: string;
  english: string;
  surahName: string;
  surahEnglishName: string;
  ayahNumber: number;
  fetchedDate: DateKey;
}
