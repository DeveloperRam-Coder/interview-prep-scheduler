export default function EmptyCalendar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="20" y="30" width="160" height="130" rx="12" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
      <rect x="20" y="30" width="160" height="35" rx="12" fill="hsl(var(--primary))" opacity="0.2" />
      <rect x="20" y="30" width="160" height="12" rx="12" fill="hsl(var(--primary))" opacity="0.4" />
      <rect x="35" y="85" width="25" height="25" rx="6" fill="hsl(var(--muted-foreground))" opacity="0.15" />
      <rect x="70" y="85" width="25" height="25" rx="6" fill="hsl(var(--muted-foreground))" opacity="0.15" />
      <rect x="105" y="85" width="25" height="25" rx="6" fill="hsl(var(--muted-foreground))" opacity="0.15" />
      <rect x="140" y="85" width="25" height="25" rx="6" fill="hsl(var(--muted-foreground))" opacity="0.15" />
      <rect x="35" y="120" width="25" height="25" rx="6" fill="hsl(var(--muted-foreground))" opacity="0.15" />
      <rect x="70" y="120" width="25" height="25" rx="6" fill="hsl(var(--muted-foreground))" opacity="0.15" />
      <path d="M100 95 L100 130 M85 112 L115 112" stroke="hsl(var(--muted-foreground))" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}
