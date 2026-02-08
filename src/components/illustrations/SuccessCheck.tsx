export default function SuccessCheck({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="60" cy="60" r="50" fill="hsl(var(--status-confirmed))" opacity="0.15" />
      <circle cx="60" cy="60" r="38" fill="hsl(var(--status-confirmed))" opacity="0.25" />
      <path d="M40 60 L52 72 L80 44" stroke="hsl(var(--status-confirmed))" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
