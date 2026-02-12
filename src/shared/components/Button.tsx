import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  children: ReactNode;
}

const variants = {
  primary: 'bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 dark:bg-teal-500 dark:hover:bg-teal-400 dark:active:bg-teal-300 dark:text-teal-950',
  secondary: 'bg-cream-200 text-teal-800 hover:bg-cream-300 active:bg-cream-400 dark:bg-surface-700 dark:text-cream-200 dark:hover:bg-surface-900 dark:active:bg-surface-950',
  ghost: 'text-teal-600 hover:text-teal-800 hover:bg-cream-100 dark:text-cream-300 dark:hover:text-cream-100 dark:hover:bg-surface-700',
  danger: 'text-warm-red-500 hover:bg-warm-red-500/10',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
};

export function Button({ variant = 'primary', size = 'md', children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-lg font-medium transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
