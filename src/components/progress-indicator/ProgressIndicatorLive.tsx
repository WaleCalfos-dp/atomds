import { type Brand } from '../../data/tokens';

export type ProgressIndicatorVariant = 'Percentage Bar' | 'Multiple Bars';
export type ProgressIndicatorState = 'Active' | 'Disabled';

interface ProgressIndicatorLiveProps {
  variant?: ProgressIndicatorVariant;
  value?: number; // 0-100 (used by Percentage Bar)
  brand?: Brand;
  /** Number of segments for Multiple Bars variant (2-6, default 3) */
  segments?: number;
  /** Number of active (filled) segments for Multiple Bars variant (default 1) */
  activeSegments?: number;
  /** Overall state of the indicator — Disabled grays out the fill */
  state?: ProgressIndicatorState;
  /** Show a title label above the bar */
  showTitle?: boolean;
  /** Title label text (defaults to "Title") */
  titleText?: string;
  /** Show a body/helper label below the bar */
  showBody?: boolean;
  /** Body label text (defaults to "Body") */
  bodyText?: string;
}

export function ProgressIndicatorLive({
  variant = 'Percentage Bar',
  value = 0,
  brand: _brand = 'dragonpass',
  segments = 3,
  activeSegments = 1,
  state = 'Active',
  showTitle = false,
  titleText = 'Title',
  showBody = false,
  bodyText = 'Body',
}: ProgressIndicatorLiveProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const isDisabled = state === 'Disabled';

  /* Shared color resolution — Disabled state uses the disabled background token for the fill */
  const activeFillColor = isDisabled
    ? 'var(--atom-background-primary-bg-primary-disabled, #ebe9e8)'
    : 'var(--atom-background-primary-accent, #0a2333)';
  const segmentActiveFillColor = isDisabled
    ? 'var(--atom-background-primary-bg-primary-disabled, #ebe9e8)'
    : 'var(--atom-background-primary-bg-primary-pressed-brand, #0a2333)';

  const fontFamily = 'var(--atom-font-body, Poppins, sans-serif)';
  const titleLabel = showTitle ? (
    <span style={{
      fontSize: '13px',
      fontWeight: 600,
      color: 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)',
      fontFamily,
    }}>
      {titleText}
    </span>
  ) : null;
  const bodyLabel = showBody ? (
    <span style={{
      fontSize: '12px',
      fontWeight: 400,
      color: 'var(--atom-foreground-core-fg-secondary, #737272)',
      fontFamily,
    }}>
      {bodyText}
    </span>
  ) : null;

  if (variant === 'Multiple Bars') {
    const segCount = Math.max(2, Math.min(6, Math.round(segments)));
    const activeCount = Math.max(0, Math.min(segCount, Math.round(activeSegments)));

    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {titleLabel}
        <div
          role="progressbar"
          aria-valuenow={activeCount}
          aria-valuemin={0}
          aria-valuemax={segCount}
          aria-label={`Step ${activeCount} of ${segCount}`}
          aria-disabled={isDisabled || undefined}
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
                  ? segmentActiveFillColor
                  : 'var(--atom-background-primary-bg-primary-disabled, #ebe9e8)',
                transition: 'background-color 0.3s ease',
              }}
            />
          ))}
        </div>
        {bodyLabel}
      </div>
    );
  }

  // Percentage Bar variant
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {titleLabel}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${clamped}% complete`}
          aria-disabled={isDisabled || undefined}
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
              backgroundColor: activeFillColor,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        <span style={{
          fontSize: '16px',
          fontWeight: 500,
          color: isDisabled
            ? 'var(--atom-foreground-core-fg-secondary, #737272)'
            : 'var(--atom-foreground-core-fg-primary, #4b4a4a)',
          fontFamily,
          whiteSpace: 'nowrap',
        }}>
          {clamped}%
        </span>
      </div>
      {bodyLabel}
    </div>
  );
}
