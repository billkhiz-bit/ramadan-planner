import type { PrayerTimes, CalculationMethod, DateKey, DailyVerse } from '../types';

interface AladhanTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface AladhanDayData {
  timings: AladhanTimings;
  date: { gregorian: { date: string } };
}

interface AladhanResponse {
  code: number;
  data: AladhanDayData[];
}

function formatTime(time: string): string {
  // Aladhan returns "HH:mm (TZ)" — strip the timezone part
  return time.replace(/\s*\(.*\)/, '');
}

export async function fetchMonthPrayerTimes(
  city: string,
  country: string,
  year: number,
  month: number,
  method: CalculationMethod,
): Promise<Record<DateKey, PrayerTimes>> {
  const url = `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Aladhan API error: ${res.status}`);

  const json: AladhanResponse = await res.json();
  if (json.code !== 200) throw new Error('Aladhan API returned non-200 code');

  const result: Record<DateKey, PrayerTimes> = {};

  for (const day of json.data) {
    // Convert DD-MM-YYYY to YYYY-MM-DD
    const [dd, mm, yyyy] = day.date.gregorian.date.split('-');
    const dateKey: DateKey = `${yyyy}-${mm}-${dd}`;

    result[dateKey] = {
      Fajr: formatTime(day.timings.Fajr),
      Sunrise: formatTime(day.timings.Sunrise),
      Dhuhr: formatTime(day.timings.Dhuhr),
      Asr: formatTime(day.timings.Asr),
      Maghrib: formatTime(day.timings.Maghrib),
      Isha: formatTime(day.timings.Isha),
    };
  }

  return result;
}

export async function fetchRamadanPrayerTimes(
  city: string,
  country: string,
  method: CalculationMethod,
  startDate: string,
  days: 29 | 30,
): Promise<Record<DateKey, PrayerTimes>> {
  const start = new Date(startDate + 'T00:00:00');
  const startMonth = start.getMonth() + 1;
  const startYear = start.getFullYear();

  // Fetch the start month
  const result = await fetchMonthPrayerTimes(city, country, startYear, startMonth, method);

  // If Ramadan spans two months, fetch the next month too
  const endDate = new Date(start);
  endDate.setDate(endDate.getDate() + days - 1);
  const endMonth = endDate.getMonth() + 1;

  if (endMonth !== startMonth) {
    const endYear = endDate.getFullYear();
    const nextMonthData = await fetchMonthPrayerTimes(city, country, endYear, endMonth, method);
    Object.assign(result, nextMonthData);
  }

  return result;
}

// --- Daily Quran Verse (alquran.cloud) ---

const TOTAL_AYAHS = 6236;

export function getAyahForDay(ramadanDay: number): number {
  // Deterministic ayah number based on Ramadan day (1-30)
  // Spreads across the Quran so each day gets a different section
  return ((ramadanDay * 197) % TOTAL_AYAHS) + 1;
}

interface AlQuranAyah {
  number: number;
  text: string;
  surah: { name: string; englishName: string; number: number };
  numberInSurah: number;
}

interface AlQuranResponse {
  code: number;
  data: AlQuranAyah;
}

export async function fetchDailyVerse(ramadanDay: number, dateKey: DateKey): Promise<DailyVerse> {
  const ayahNumber = getAyahForDay(ramadanDay);

  // Fetch Arabic and English in parallel
  const [arRes, enRes] = await Promise.all([
    fetch(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/ar.alafasy`),
    fetch(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/en.sahih`),
  ]);

  if (!arRes.ok || !enRes.ok) throw new Error('AlQuran API error');

  const arJson: AlQuranResponse = await arRes.json();
  const enJson: AlQuranResponse = await enRes.json();

  if (arJson.code !== 200 || enJson.code !== 200) throw new Error('AlQuran API returned non-200');

  return {
    number: ayahNumber,
    arabic: arJson.data.text,
    english: enJson.data.text,
    surahName: arJson.data.surah.name,
    surahEnglishName: arJson.data.surah.englishName,
    ayahNumber: arJson.data.numberInSurah,
    fetchedDate: dateKey,
  };
}
