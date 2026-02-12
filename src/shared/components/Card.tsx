import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded-xl border p-5 shadow-sm transition-colors bg-cream-50 dark:bg-surface-800 border-cream-200 dark:border-surface-700 ${className}`}>
      {children}
    </div>
  );
}
