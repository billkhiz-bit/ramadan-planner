import { useEffect, useState } from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import { useStore } from '../../../store';
import { Card } from '../../../shared/components/Card';
import { fetchDailyVerse } from '../../../shared/utils/api';
import { getRamadanDay, isWithinRamadan } from '../../../shared/utils/dates';
import type { DateKey, DailyVerse as DailyVerseType } from '../../../shared/types';

interface DailyVerseProps {
  dateKey: DateKey;
}

export function DailyVerse({ dateKey }: DailyVerseProps) {
  const settings = useStore((s) => s.settings);
  const verseCache = useStore((s) => s.verseCache);
  const setVerseCache = useStore((s) => s.setVerseCache);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verse, setVerse] = useState<DailyVerseType | null>(null);

  const withinRamadan = isWithinRamadan(dateKey, settings.ramadanStartDate, settings.ramadanDays);
  const ramadanDay = getRamadanDay(dateKey, settings.ramadanStartDate);

  useEffect(() => {
    if (!withinRamadan) return;

    // Use cache if it's for the same date
    if (verseCache && verseCache.fetchedDate === dateKey) {
      setVerse(verseCache);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchDailyVerse(ramadanDay, dateKey)
      .then((v) => {
        if (cancelled) return;
        setVerse(v);
        setVerseCache(v);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to fetch verse');
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [dateKey, ramadanDay, withinRamadan, verseCache, setVerseCache]);

  if (!withinRamadan) return null;

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <BookOpen size={16} className="text-teal-500" />
        <h2 className="text-sm font-semibold text-teal-900 dark:text-cream-100">Verse of the Day</h2>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 size={20} className="animate-spin text-teal-400" />
        </div>
      )}

      {error && (
        <p className="text-xs text-warm-red-500 dark:text-warm-red-400 text-center py-2">{error}</p>
      )}

      {verse && !loading && (
        <div className="space-y-3">
          <p className="text-right text-lg leading-loose text-teal-900 dark:text-cream-100 font-arabic" dir="rtl">
            {verse.arabic}
          </p>
          <p className="text-sm text-teal-700 dark:text-cream-300 leading-relaxed italic">
            &ldquo;{verse.english}&rdquo;
          </p>
          <p className="text-xs text-teal-500 dark:text-cream-400 text-right">
            — {verse.surahEnglishName} ({verse.surahName}), Ayah {verse.ayahNumber}
          </p>
        </div>
      )}
    </Card>
  );
}
