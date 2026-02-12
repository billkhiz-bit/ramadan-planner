import { useEffect } from 'react';
import { useStore } from '../../store';

export function useDayTransition() {
  const checkDayTransition = useStore((s) => s.checkDayTransition);

  useEffect(() => {
    checkDayTransition();
    const interval = setInterval(checkDayTransition, 60_000);
    return () => clearInterval(interval);
  }, [checkDayTransition]);
}
