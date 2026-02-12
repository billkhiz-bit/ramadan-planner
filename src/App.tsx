import { useEffect } from 'react';
import { useStore } from './store';
import { Layout } from './shared/components/Layout';
import { Onboarding } from './shared/components/Onboarding';
import { DailyView } from './views/DailyView';
import { CalendarView } from './views/CalendarView';
import { ProgressView } from './views/ProgressView';
import { SettingsView } from './views/SettingsView';
import { useDayTransition } from './shared/hooks/useDayTransition';
import { ErrorBoundary } from './shared/components/ErrorBoundary';

function AppInner() {
  const onboarded = useStore((s) => s.settings.onboarded);
  const activeView = useStore((s) => s.activeView);
  const darkMode = useStore((s) => s.darkMode);

  useDayTransition();

  // Restore dark mode class on mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  if (!onboarded) {
    return <Onboarding />;
  }

  return (
    <Layout>
      {activeView === 'daily' && <DailyView />}
      {activeView === 'calendar' && <CalendarView />}
      {activeView === 'progress' && <ProgressView />}
      {activeView === 'settings' && <SettingsView />}
    </Layout>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppInner />
    </ErrorBoundary>
  );
}
