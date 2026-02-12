import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  DateKey, ViewId, Settings, PrayerTimes, DailyPrayers,
  DailyFasting, DhikrItem, JournalEntry, CharityEntry,
  FastingStatus, CalculationMethod, DailyVerse,
} from './shared/types';
import { getToday } from './shared/utils/dates';
import { createId } from './shared/utils/id';

const DEFAULT_DHIKR_ITEMS: DhikrItem[] = [
  { id: 'dh1', name: 'SubhanAllah', arabicName: 'سبحان الله', target: 33 },
  { id: 'dh2', name: 'Alhamdulillah', arabicName: 'الحمد لله', target: 33 },
  { id: 'dh3', name: 'Allahu Akbar', arabicName: 'الله أكبر', target: 34 },
  { id: 'dh4', name: 'Astaghfirullah', arabicName: 'أستغفر الله', target: 100 },
  { id: 'dh5', name: 'La ilaha illallah', arabicName: 'لا إله إلا الله', target: 100 },
];

function createDefaultPrayers(): DailyPrayers {
  return { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false, tarawih: false, tahajjud: false };
}

function createDefaultFasting(): DailyFasting {
  return { status: 'none', suhoorTime: '', iftarTime: '' };
}

interface AppState {
  // UI
  activeView: ViewId;
  setActiveView: (view: ViewId) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  selectedDate: DateKey;
  setSelectedDate: (date: DateKey) => void;

  // Settings
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  completeOnboarding: (settings: Omit<Settings, 'onboarded'>) => void;

  // Prayer times cache
  prayerTimesCache: Record<DateKey, PrayerTimes>;
  setPrayerTimesCache: (data: Record<DateKey, PrayerTimes>) => void;
  prayerTimesFetchError: string | null;
  setPrayerTimesFetchError: (err: string | null) => void;

  // Prayers
  prayers: Record<DateKey, DailyPrayers>;
  togglePrayer: (dateKey: DateKey, prayer: keyof DailyPrayers) => void;

  // Quran
  quranPages: Record<DateKey, number>;
  setQuranPages: (dateKey: DateKey, pages: number) => void;
  juzCompleted: boolean[];
  toggleJuz: (index: number) => void;

  // Fasting
  fasting: Record<DateKey, DailyFasting>;
  setFastingStatus: (dateKey: DateKey, status: FastingStatus) => void;
  setFastingTime: (dateKey: DateKey, field: 'suhoorTime' | 'iftarTime', value: string) => void;

  // Dhikr
  dhikrItems: DhikrItem[];
  addDhikrItem: (name: string, arabicName: string, target: number) => void;
  removeDhikrItem: (id: string) => void;
  dhikrCounts: Record<DateKey, Record<string, number>>;
  incrementDhikr: (dateKey: DateKey, itemId: string) => void;
  resetDhikr: (dateKey: DateKey, itemId: string) => void;

  // Journal
  journals: Record<DateKey, JournalEntry>;
  updateJournal: (dateKey: DateKey, content: string) => void;

  // Charity
  charityEntries: CharityEntry[];
  addCharity: (amount: number, note: string, dateKey: DateKey) => void;
  removeCharity: (id: string) => void;

  // Verse cache
  verseCache: DailyVerse | null;
  setVerseCache: (verse: DailyVerse) => void;

  // Day transition
  lastDateKey: DateKey;
  checkDayTransition: () => void;

  // Data management
  exportData: () => string;
  importData: (json: string) => boolean;
  resetAll: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // UI
      activeView: 'daily',
      setActiveView: (view) => set({ activeView: view }),
      darkMode: false,
      toggleDarkMode: () =>
        set((s) => {
          const next = !s.darkMode;
          document.documentElement.classList.toggle('dark', next);
          return { darkMode: next };
        }),
      selectedDate: getToday(),
      setSelectedDate: (date) => set({ selectedDate: date }),

      // Settings
      settings: {
        name: '',
        city: '',
        country: '',
        calculationMethod: 15 as CalculationMethod,
        ramadanStartDate: '2026-02-17',
        ramadanDays: 30,
        currency: 'USD',
        onboarded: false,
      },
      updateSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),
      completeOnboarding: (settings) =>
        set({ settings: { ...settings, onboarded: true } }),

      // Prayer times cache
      prayerTimesCache: {},
      setPrayerTimesCache: (data) =>
        set((s) => ({ prayerTimesCache: { ...s.prayerTimesCache, ...data } })),
      prayerTimesFetchError: null,
      setPrayerTimesFetchError: (err) => set({ prayerTimesFetchError: err }),

      // Prayers
      prayers: {},
      togglePrayer: (dateKey, prayer) =>
        set((s) => {
          const day = s.prayers[dateKey] ?? createDefaultPrayers();
          return {
            prayers: {
              ...s.prayers,
              [dateKey]: { ...day, [prayer]: !day[prayer] },
            },
          };
        }),

      // Quran
      quranPages: {},
      setQuranPages: (dateKey, pages) =>
        set((s) => ({
          quranPages: { ...s.quranPages, [dateKey]: Math.max(0, pages) },
        })),
      juzCompleted: Array(30).fill(false) as boolean[],
      toggleJuz: (index) =>
        set((s) => {
          const next = [...s.juzCompleted];
          next[index] = !next[index];
          return { juzCompleted: next };
        }),

      // Fasting
      fasting: {},
      setFastingStatus: (dateKey, status) =>
        set((s) => {
          const day = s.fasting[dateKey] ?? createDefaultFasting();
          return {
            fasting: { ...s.fasting, [dateKey]: { ...day, status } },
          };
        }),
      setFastingTime: (dateKey, field, value) =>
        set((s) => {
          const day = s.fasting[dateKey] ?? createDefaultFasting();
          return {
            fasting: { ...s.fasting, [dateKey]: { ...day, [field]: value } },
          };
        }),

      // Dhikr
      dhikrItems: DEFAULT_DHIKR_ITEMS,
      addDhikrItem: (name, arabicName, target) =>
        set((s) => ({
          dhikrItems: [...s.dhikrItems, { id: createId(), name, arabicName, target }],
        })),
      removeDhikrItem: (id) =>
        set((s) => ({
          dhikrItems: s.dhikrItems.filter((d) => d.id !== id),
        })),
      dhikrCounts: {},
      incrementDhikr: (dateKey, itemId) =>
        set((s) => {
          const dayCounts = s.dhikrCounts[dateKey] ?? {};
          return {
            dhikrCounts: {
              ...s.dhikrCounts,
              [dateKey]: { ...dayCounts, [itemId]: (dayCounts[itemId] ?? 0) + 1 },
            },
          };
        }),
      resetDhikr: (dateKey, itemId) =>
        set((s) => {
          const dayCounts = s.dhikrCounts[dateKey] ?? {};
          return {
            dhikrCounts: {
              ...s.dhikrCounts,
              [dateKey]: { ...dayCounts, [itemId]: 0 },
            },
          };
        }),

      // Journal
      journals: {},
      updateJournal: (dateKey, content) =>
        set((s) => ({
          journals: {
            ...s.journals,
            [dateKey]: { content, updatedAt: new Date().toISOString() },
          },
        })),

      // Charity
      charityEntries: [],
      addCharity: (amount, note, dateKey) =>
        set((s) => ({
          charityEntries: [
            ...s.charityEntries,
            { id: createId(), amount, note, dateKey, createdAt: new Date().toISOString() },
          ],
        })),
      removeCharity: (id) =>
        set((s) => ({
          charityEntries: s.charityEntries.filter((c) => c.id !== id),
        })),

      // Verse cache
      verseCache: null,
      setVerseCache: (verse) => set({ verseCache: verse }),

      // Day transition
      lastDateKey: getToday(),
      checkDayTransition: () => {
        const today = getToday();
        const state = get();
        if (state.lastDateKey === today) return;
        set({ lastDateKey: today, selectedDate: today });
      },

      // Data management
      exportData: () => {
        const state = get();
        return JSON.stringify({
          settings: state.settings,
          prayerTimesCache: state.prayerTimesCache,
          prayers: state.prayers,
          quranPages: state.quranPages,
          juzCompleted: state.juzCompleted,
          fasting: state.fasting,
          dhikrItems: state.dhikrItems,
          dhikrCounts: state.dhikrCounts,
          journals: state.journals,
          charityEntries: state.charityEntries,
          verseCache: state.verseCache,
          darkMode: state.darkMode,
        }, null, 2);
      },
      importData: (json: string) => {
        try {
          const data = JSON.parse(json);
          if (!data.settings?.onboarded) return false;
          set({
            settings: data.settings,
            prayerTimesCache: data.prayerTimesCache ?? {},
            prayers: data.prayers ?? {},
            quranPages: data.quranPages ?? {},
            juzCompleted: data.juzCompleted ?? Array(30).fill(false),
            fasting: data.fasting ?? {},
            dhikrItems: data.dhikrItems ?? DEFAULT_DHIKR_ITEMS,
            dhikrCounts: data.dhikrCounts ?? {},
            journals: data.journals ?? {},
            charityEntries: data.charityEntries ?? [],
            verseCache: data.verseCache ?? null,
            darkMode: data.darkMode ?? false,
          });
          return true;
        } catch {
          return false;
        }
      },
      resetAll: () => {
        localStorage.removeItem('ramadan-planner-storage');
        window.location.reload();
      },
    }),
    {
      name: 'ramadan-planner-storage',
      partialize: (state) => ({
        settings: state.settings,
        prayerTimesCache: state.prayerTimesCache,
        prayers: state.prayers,
        quranPages: state.quranPages,
        juzCompleted: state.juzCompleted,
        fasting: state.fasting,
        dhikrItems: state.dhikrItems,
        dhikrCounts: state.dhikrCounts,
        journals: state.journals,
        charityEntries: state.charityEntries,
        verseCache: state.verseCache,
        darkMode: state.darkMode,
        activeView: state.activeView,
        selectedDate: state.selectedDate,
        lastDateKey: state.lastDateKey,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (!state.juzCompleted) state.juzCompleted = Array(30).fill(false) as boolean[];
        if (!state.dhikrItems) state.dhikrItems = DEFAULT_DHIKR_ITEMS;
      },
    }
  )
);
