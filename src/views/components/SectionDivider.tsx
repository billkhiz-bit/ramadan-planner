interface SectionDividerProps {
  label: string;
}

export function SectionDivider({ label }: SectionDividerProps) {
  return (
    <div className="flex items-center gap-3 pt-2 pb-1">
      <div className="h-px flex-1 bg-cream-200 dark:bg-surface-700" />
      <span className="text-[10px] font-semibold uppercase tracking-widest text-cream-400 dark:text-cream-500">
        {label}
      </span>
      <div className="h-px flex-1 bg-cream-200 dark:bg-surface-700" />
    </div>
  );
}
