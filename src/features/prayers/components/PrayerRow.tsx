import { Check } from 'lucide-react';
import { useState } from 'react';

interface PrayerRowProps {
  label: string;
  arabicLabel: string;
  time?: string;
  checked: boolean;
  isFardh: boolean;
  isNext?: boolean;
  onToggle: () => void;
}

export function PrayerRow({ label, arabicLabel, time, checked, isFardh, isNext, onToggle }: PrayerRowProps) {
  const [animating, setAnimating] = useState(false);

  function handleClick() {
    if (!checked) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 300);
    }
    onToggle();
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg transition-colors ${
        isNext
          ? 'ring-2 ring-gold-400 dark:ring-gold-500 bg-gold-50/50 dark:bg-gold-500/5'
          : checked
          ? 'bg-sage-50 dark:bg-sage-900/30'
          : 'hover:bg-cream-100 dark:hover:bg-surface-700'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            animating ? 'check-pop' : ''
          } ${
            checked
              ? 'border-sage-500 bg-sage-500 text-white'
              : 'border-cream-300 dark:border-surface-700'
          }`}
        >
          {checked && <Check size={14} strokeWidth={3} />}
        </div>
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${checked ? 'text-sage-700 dark:text-sage-300' : 'text-teal-900 dark:text-cream-100'}`}>
              {label}
            </span>
            <span className="text-xs text-teal-600 dark:text-cream-400 font-arabic">{arabicLabel}</span>
            {!isFardh && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gold-100 text-gold-700 dark:bg-gold-500/20 dark:text-gold-300">
                Sunnah
              </span>
            )}
          </div>
        </div>
      </div>
      {time && (
        <span className="text-xs text-teal-600 dark:text-cream-400 tabular-nums">{time}</span>
      )}
    </button>
  );
}
