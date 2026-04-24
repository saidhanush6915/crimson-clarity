export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative grid h-9 w-9 place-items-center rounded-xl gradient-primary shadow-elegant">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary-foreground" fill="currentColor">
          <path d="M12 2.5c1.8 2.6 6.5 8.4 6.5 12.5a6.5 6.5 0 1 1-13 0C5.5 10.9 10.2 5.1 12 2.5z" />
        </svg>
      </div>
      <div className="leading-tight">
        <div className="font-display text-[15px] font-extrabold tracking-tight">Hemo<span className="text-primary">AI</span></div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Blood Group Detection</div>
      </div>
    </div>
  );
}
