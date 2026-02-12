import { Clock } from 'lucide-react';

interface NextPrayerBannerProps {
  name: string;
  time: string;
  countdown: string;
}

export function NextPrayerBanner({ name, time, countdown }: NextPrayerBannerProps) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-gold-100/70 dark:bg-gold-500/10 border border-gold-300/50 dark:border-gold-500/20 mb-3">
      <div className="flex items-center gap-2">
        <Clock size={14} className="text-gold-600 dark:text-gold-400" />
        <span className="text-xs font-semibold text-gold-700 dark:text-gold-300">
          Next: {name} at {time}
        </span>
      </div>
      <span className="text-xs font-medium text-gold-600 dark:text-gold-400">
        {countdown}
      </span>
    </div>
  );
}
