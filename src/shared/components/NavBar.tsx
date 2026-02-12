import { BookOpen, CalendarDays, TrendingUp, Settings } from 'lucide-react';
import { useStore } from '../../store';
import type { ViewId } from '../types';

const tabs: { id: ViewId; label: string; icon: typeof BookOpen }[] = [
  { id: 'daily', label: 'Today', icon: BookOpen },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function NavBar() {
  const activeView = useStore((s) => s.activeView);
  const setActiveView = useStore((s) => s.setActiveView);

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t z-40 transition-colors bg-cream-50 dark:bg-surface-800 border-cream-200 dark:border-surface-700">
      <div className="max-w-lg mx-auto flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                active
                  ? 'text-teal-600 dark:text-gold-400'
                  : 'text-cream-500 hover:text-teal-600 dark:text-cream-400 dark:hover:text-cream-200'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
