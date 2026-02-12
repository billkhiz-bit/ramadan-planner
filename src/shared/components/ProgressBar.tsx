interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: 'teal' | 'gold' | 'sage';
  size?: 'sm' | 'md';
}

export function ProgressBar({ progress, color = 'teal', size = 'md' }: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const height = size === 'sm' ? 'h-1.5' : 'h-2.5';
  const colors = {
    teal: 'bg-teal-500',
    gold: 'bg-gold-400',
    sage: 'bg-sage-400',
  };

  return (
    <div className={`w-full ${height} bg-cream-200 dark:bg-surface-700 rounded-full overflow-hidden`}>
      <div
        className={`${height} ${colors[color]} rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${clamped * 100}%` }}
      />
    </div>
  );
}
