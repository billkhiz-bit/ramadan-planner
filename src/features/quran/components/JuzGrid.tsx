import { useStore } from '../../../store';

export function JuzGrid() {
  const juzCompleted = useStore((s) => s.juzCompleted);
  const toggleJuz = useStore((s) => s.toggleJuz);
  const completed = juzCompleted.filter(Boolean).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-teal-700 dark:text-cream-300">Juz Completion</span>
        <span className="text-xs text-teal-600 dark:text-cream-400">{completed}/30</span>
      </div>
      <div className="grid grid-cols-10 gap-1.5">
        {juzCompleted.map((done, i) => (
          <button
            key={i}
            onClick={() => toggleJuz(i)}
            className={`aspect-square rounded-md text-[10px] font-medium flex items-center justify-center transition-all ${
              done
                ? 'bg-sage-500 text-white dark:bg-sage-600'
                : 'bg-cream-200 text-teal-600 dark:bg-surface-700 dark:text-cream-400 hover:bg-cream-300 dark:hover:bg-surface-900'
            }`}
            title={`Juz ${i + 1}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
