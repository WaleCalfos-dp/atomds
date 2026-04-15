import { type Brand } from '../../data/tokens';

export type ProgressIndicatorVariant = 'Percentage Bar' | 'Multiple Bars';

interface ProgressIndicatorLiveProps {
  variant?: ProgressIndicatorVariant;
  value?: number; // 0-100 (used by Percentage Bar)
  brand?: Brand;
  /** Number of segments for Multiple Bars variant (2-6, default 3) */
  segments?: number;
  /** Number of active (filled) segments for Multiple Bars variant (default 1) */
  activeSegments?: number;
}

export function ProgressIndicatorLive({
  variant = 'Percentage Bar',
  value = 0,
  brand: _brand = 'dragonpass',
  segments = 3,
  activeSegments = 1,
}: ProgressIndicatorLiveProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));

  if (variant === 'Multiple Bars') {
    const segCount = Math.max(2, Math.min(6, Math.round(segments)));
    const activeCount = Math.max(0, Math.min(segCount, Math.round(activeSegments)));

    return (
      <div
        role="progressbar"
        aria-valuenow={activeCount}
        aria-valuemin={0}
        aria-valuemax={segCount}
        aria-label={`Step ${activeCount} of ${segCount}`}
        style={{ width: '100%', display: 'flex', gap: '8px' }}
      >
        {Array.from({ length: segCount }, (_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: '8px',
              borderRadius: '999px',
              backgroundColor: i < activeCount
                ? 'var(--atom-background-primary-bg-primary-pressed-brand, #0a2333)'
                : 'var(--atom-background-primary-bg-primary-disabled, #ebe9e8)',
              transition: 'background-color 0.3s ease',
            }}
          />
        ))}
      </div>
    );
  }

  // Percentage Bar variant
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${clamped}% complete`}
          style={{
            flex: 1,
            height: '8px',
            borderRadius: '999px',
            backgroundColor: 'var(--atom-background-primary-bg-primary-disabled, #ebe9e8)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${clamped}%`,
              height: '100%',
              borderRadius: '999px',
              backgroundColor: 'var(--atom-background-primary-accent, #0a2333)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        <span style={{
          fontSize: '16px',
          fontWeight: 500,
          color: 'var(--atom-foreground-core-fg-primary, #4b4a4a)',
          fontFamily: 'var(--atom-font-body, Poppins, sans-serif)',
          whiteSpace: 'nowrap',
        }}>
          {clamped}%
        </span>
      </div>
    </div>
  );
}
