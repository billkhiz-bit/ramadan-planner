interface CrescentIconProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

export function CrescentIcon({ size = 32, className = '', glow = false }: CrescentIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={`${glow ? 'crescent-glow' : ''} ${className}`}
    >
      <path
        d="M40 8C28.954 8 20 16.954 20 28s8.954 20 20 20c4.374 0 8.442-1.404 11.742-3.786C47.33 50.48 40.016 54 32 54 17.64 54 6 42.36 6 28S17.64 2 32 2c8.016 0 15.33 3.52 19.742 9.786A19.913 19.913 0 0040 8z"
        fill="currentColor"
      />
      <circle cx="48" cy="12" r="2.5" fill="currentColor" opacity="0.6" />
      <circle cx="54" cy="22" r="1.5" fill="currentColor" opacity="0.4" />
      <circle cx="50" cy="30" r="2" fill="currentColor" opacity="0.5" />
    </svg>
  );
}
