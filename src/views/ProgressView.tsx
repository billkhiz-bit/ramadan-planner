import { TrendingUp, BookOpen, Moon, Heart, HandHeart } from 'lucide-react';
import { useStore } from '../store';
import { Card } from '../shared/components/Card';
import { ProgressBar } from '../shared/components/ProgressBar';
import { getRamadanDateKeys, getToday, getRamadanDay } from '../shared/utils/dates';
import { PRAYER_LIST } from '../features/prayers/prayers.constants';
import { TOTAL_PAGES } from '../features/quran/quran.constants';

export function ProgressView() {
  const settings = useStore((s) => s.settings);
  const prayers = useStore((s) => s.prayers);
  const fasting = useStore((s) => s.fasting);
  const quranPages = useStore((s) => s.quranPages);
  const juzCompleted = useStore((s) => s.juzCompleted);
  const dhikrCounts = useStore((s) => s.dhikrCounts);
  const dhikrItems = useStore((s) => s.dhikrItems);
  const journals = useStore((s) => s.journals);
  const charityEntries = useStore((s) => s.charityEntries);
  const currency = settings.currency;

  const dateKeys = getRamadanDateKeys(settings.ramadanStartDate, settings.ramadanDays);
  const today = getToday();
  const currentDay = getRamadanDay(today, settings.ramadanStartDate);
  const daysElapsed = Math.max(0, Math.min(currentDay, settings.ramadanDays));

  // Prayer stats
  let totalPrayersCompleted = 0;
  let totalFardhCompleted = 0;
  dateKeys.forEach((dk) => {
    const dp = prayers[dk];
    if (!dp) return;
    PRAYER_LIST.forEach((p) => {
      if (dp[p.key]) {
        totalPrayersCompleted++;
        if (p.isFardh) totalFardhCompleted++;
      }
    });
  });
  const totalPossibleFardh = daysElapsed * 5;

  // Fasting stats
  let daysFasted = 0;
  dateKeys.forEach((dk) => {
    if (fasting[dk]?.status === 'fasted') daysFasted++;
  });

  // Quran stats
  const totalPagesRead = Object.values(quranPages).reduce((sum, p) => sum + p, 0);
  const juzDone = juzCompleted.filter(Boolean).length;

  // Dhikr stats
  let dhikrDaysComplete = 0;
  dateKeys.forEach((dk) => {
    const dayCounts = dhikrCounts[dk];
    if (!dayCounts) return;
    const allMet = dhikrItems.every((d) => (dayCounts[d.id] ?? 0) >= d.target);
    if (allMet) dhikrDaysComplete++;
  });

  // Journal stats
  let journalDays = 0;
  dateKeys.forEach((dk) => {
    if (journals[dk]?.content && journals[dk].content.length > 0) journalDays++;
  });

  // Charity stats
  const totalCharity = charityEntries.reduce((sum, e) => sum + e.amount, 0);

  const stats = [
    {
      icon: Moon,
      label: 'Fardh Prayers',
      value: `${totalFardhCompleted}/${totalPossibleFardh}`,
      progress: totalPossibleFardh > 0 ? totalFardhCompleted / totalPossibleFardh : 0,
      color: 'sage' as const,
      sub: `${totalPrayersCompleted} total prayers (inc. Sunnah)`,
    },
    {
      icon: Moon,
      label: 'Fasting',
      value: `${daysFasted}/${daysElapsed} days`,
      progress: daysElapsed > 0 ? daysFasted / daysElapsed : 0,
      color: 'teal' as const,
      sub: null,
    },
    {
      icon: BookOpen,
      label: 'Quran Pages',
      value: `${totalPagesRead}/${TOTAL_PAGES}`,
      progress: totalPagesRead / TOTAL_PAGES,
      color: 'gold' as const,
      sub: `${juzDone}/30 Juz completed`,
    },
    {
      icon: Heart,
      label: 'Dhikr',
      value: `${dhikrDaysComplete}/${daysElapsed} days`,
      progress: daysElapsed > 0 ? dhikrDaysComplete / daysElapsed : 0,
      color: 'teal' as const,
      sub: 'Days with all targets met',
    },
    {
      icon: BookOpen,
      label: 'Journal',
      value: `${journalDays}/${daysElapsed} days`,
      progress: daysElapsed > 0 ? journalDays / daysElapsed : 0,
      color: 'gold' as const,
      sub: null,
    },
    {
      icon: HandHeart,
      label: 'Charity',
      value: `${currency} ${totalCharity.toFixed(2)}`,
      progress: 0,
      color: 'gold' as const,
      sub: `${charityEntries.length} donations`,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp size={20} className="text-teal-600 dark:text-gold-400" />
        <h1 className="text-lg font-bold text-teal-900 dark:text-cream-100">Progress</h1>
      </div>

      <p className="text-xs text-teal-600 dark:text-cream-400">
        Day {daysElapsed} of {settings.ramadanDays}
      </p>

      <ProgressBar progress={daysElapsed / settings.ramadanDays} color="teal" />

      <div className="space-y-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon size={16} className="text-teal-500 dark:text-gold-400" />
                  <span className="text-sm font-medium text-teal-900 dark:text-cream-100">{stat.label}</span>
                </div>
                <span className="text-sm font-bold text-teal-800 dark:text-cream-200">{stat.value}</span>
              </div>
              {stat.progress > 0 && (
                <ProgressBar progress={stat.progress} color={stat.color} size="sm" />
              )}
              {stat.sub && (
                <p className="text-[10px] text-teal-600 dark:text-cream-400 mt-1">{stat.sub}</p>
              )}
            </Card>
          );
        })}
      </div>

      {daysElapsed > 0 && totalFardhCompleted / totalPossibleFardh >= 0.9 && (
        <p className="text-xs text-center text-sage-600 dark:text-sage-400">
          MashaAllah! You're maintaining excellent prayer consistency!
        </p>
      )}
    </div>
  );
}
