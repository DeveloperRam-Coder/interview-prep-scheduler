export default function EmptyNotifications({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="80" cy="70" r="40" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
      <path d="M65 70 L75 80 L95 60" stroke="hsl(var(--muted-foreground))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.4" />
      <rect x="50" y="115" width="60" height="25" rx="6" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.8" />
      <rect x="58" y="123" width="44" height="4" rx="2" fill="hsl(var(--muted-foreground))" opacity="0.3" />
    </svg>
  );
}
