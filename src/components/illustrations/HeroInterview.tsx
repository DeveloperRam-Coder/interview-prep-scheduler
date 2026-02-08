export default function HeroInterview({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="heroGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="heroGrad2" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Background shapes */}
      <ellipse cx="300" cy="320" rx="220" ry="60" fill="url(#heroGrad2)" />
      <circle cx="480" cy="80" r="120" fill="url(#heroGrad1)" />
      <circle cx="120" cy="120" r="80" fill="url(#heroGrad1)" />

      {/* Calendar */}
      <g transform="translate(180, 80)" className="animate-float">
        <rect x="0" y="0" width="140" height="120" rx="12" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
        <rect x="0" y="0" width="140" height="28" rx="12" fill="hsl(var(--primary))" />
        <rect x="0" y="0" width="140" height="12" rx="12" fill="hsl(var(--primary))" opacity="0.8" />
        <rect x="20" y="50" width="20" height="20" rx="4" fill="hsl(var(--muted-foreground))" opacity="0.3" />
        <rect x="50" y="50" width="20" height="20" rx="4" fill="hsl(var(--primary))" opacity="0.6" />
        <rect x="80" y="50" width="20" height="20" rx="4" fill="hsl(var(--muted-foreground))" opacity="0.3" />
        <rect x="110" y="50" width="20" height="20" rx="4" fill="hsl(var(--muted-foreground))" opacity="0.3" />
        <rect x="20" y="80" width="20" height="20" rx="4" fill="hsl(var(--muted-foreground))" opacity="0.3" />
        <rect x="50" y="80" width="20" height="20" rx="4" fill="hsl(var(--muted-foreground))" opacity="0.3" />
      </g>

      {/* Video call / person */}
      <g transform="translate(320, 160)" className="animate-[float_5s_ease-in-out_infinite_0.5s]">
        <rect x="0" y="0" width="180" height="120" rx="16" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
        <circle cx="90" cy="50" r="25" fill="hsl(var(--primary))" opacity="0.2" />
        <circle cx="90" cy="50" r="18" fill="hsl(var(--primary))" opacity="0.4" />
        <circle cx="90" cy="50" r="10" fill="hsl(var(--primary))" />
        <rect x="30" y="95" width="120" height="6" rx="3" fill="hsl(var(--muted))" />
        <rect x="60" y="105" width="60" height="4" rx="2" fill="hsl(var(--muted-foreground))" opacity="0.4" />
        <circle cx="155" cy="25" r="8" fill="hsl(var(--status-confirmed))" opacity="0.8" />
      </g>

      {/* Checkmark badge */}
      <g transform="translate(80, 200)" className="animate-float [animation-delay:1s]">
        <circle cx="40" cy="40" r="36" fill="hsl(var(--status-confirmed))" opacity="0.15" />
        <circle cx="40" cy="40" r="28" fill="hsl(var(--status-confirmed))" opacity="0.3" />
        <path d="M28 40 L36 48 L52 32" stroke="hsl(var(--status-confirmed))" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      {/* Connecting line */}
      <path d="M280 200 Q320 180 360 200" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="8 4" fill="none" opacity="0.5" className="animate-pulse" />
    </svg>
  );
}
