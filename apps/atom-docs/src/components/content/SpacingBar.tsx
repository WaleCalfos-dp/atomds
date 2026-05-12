interface SpacingBarProps {
  token: string;
  px: number;
  maxPx?: number;
}

export function SpacingBar({ token, px, maxPx = 80 }: SpacingBarProps) {
  const widthPct = maxPx > 0 ? (px / maxPx) * 100 : 0;

  return (
    <div className="flex items-center gap-4 py-1.5">
      <code className="text-xs font-mono text-slate-600 w-20 shrink-0">
        {token}
      </code>
      <div className="flex-1 h-6 bg-slate-100 rounded relative overflow-hidden">
        {px > 0 && (
          <div
            className="h-full rounded transition-all duration-300"
            style={{
              width: `${Math.max(widthPct, 2)}%`,
              backgroundColor: 'var(--color-brand)',
              opacity: 0.75,
            }}
          />
        )}
      </div>
      <span className="text-xs text-slate-500 w-10 text-right shrink-0">
        {px}px
      </span>
    </div>
  );
}
