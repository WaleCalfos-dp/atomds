import { type Brand } from '../../data/tokens';

// ─── Public types ─────────────────────────────────────────────────────────────
// Aligned with the Figma component set: Data Row.
// Type × Position × Product Module per the 8 SVG exports.
export type DataRowType = 'Single-line' | 'Multi-line' | 'Multi-line + Icon';
export type DataRowPosition = 'First and Middle' | 'Last';
export type DataRowProductModule = 'All' | 'Transport';

// Content shape for flight / transport rows.
export interface DataRowFlightData {
  originCode: string;      // e.g. "LHR"
  originTime: string;      // e.g. "12:30"
  destCode: string;        // e.g. "JFK"
  destTime: string;        // e.g. "15:45"
  duration?: string;       // e.g. "8h 15m"
}

interface DataRowLiveProps {
  type?: DataRowType;
  position?: DataRowPosition;
  productModule?: DataRowProductModule;

  // Trailing slot toggles (mutually compatible)
  showChevronRight?: boolean;
  showBadge?: boolean;
  showIcon?: boolean;        // leading icon (non-"Multi-line + Icon" types)
  showButton?: boolean;

  // Primary data
  dataCount?: 1 | 2 | 3;
  labelText?: string;
  data1Text?: string;
  data2Text?: string;
  data3Text?: string;
  badgeText?: string;
  buttonLabel?: string;

  // Transport module-specific data
  flightData?: DataRowFlightData;

  brand?: Brand;
}

function ChevronIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M5 3l4 4-4 4" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlaneIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M1 6h10M8 3l3 3-3 3"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RowIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="4" stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

export function DataRowLive({
  type = 'Single-line',
  position = 'First and Middle',
  productModule = 'All',
  showChevronRight = false,
  showBadge = false,
  showIcon = false,
  showButton = false,
  dataCount = 1,
  labelText = 'Label',
  data1Text = 'Data',
  data2Text = 'Data',
  data3Text = 'Data',
  badgeText = 'Badge',
  buttonLabel = 'Button',
  flightData = {
    originCode: 'LHR',
    originTime: '12:30',
    destCode: 'JFK',
    destTime: '15:45',
    duration: '8h 15m',
  },
  brand: _brand = 'dragonpass',
}: DataRowLiveProps) {
  // ── Token palette ────────────────────────────────────────────────────────
  const fontFamily      = 'var(--atom-font-body, "Poppins", system-ui, sans-serif)';
  const labelColor      = 'var(--atom-foreground-core-fg-secondary, #737272)';
  const valueColor      = 'var(--atom-foreground-primary-fg-brand-primary, #0A2333)';
  const bodyColor       = 'var(--atom-foreground-core-fg-primary, #4B4A4A)';
  const borderColor     = 'var(--atom-border-default-border-divider, #CDCBCB)';
  const badgeBg         = 'var(--atom-background-alert-bg-success-lightest, #ECFDF3)';
  const badgeFg         = 'var(--atom-foreground-feedback-fg-success, #067647)';
  const actionColor     = 'var(--atom-foreground-primary-fg-brand-primary, #0A2333)';
  const iconColor       = 'var(--atom-foreground-core-fg-secondary, #737272)';
  const mutedBg         = 'var(--atom-background-core-bg-muted, #F5F5F4)';

  const showDivider = position === 'First and Middle';
  const isSingleLine = type === 'Single-line';
  const hasIcon = type === 'Multi-line + Icon';
  const isFlight = productModule === 'Transport';

  const dataValues = [data1Text];
  if (dataCount >= 2) dataValues.push(data2Text);
  if (dataCount >= 3) dataValues.push(data3Text);

  // ── Trailing slot stack (badge / chevron / button) ───────────────────────
  const trailingElements: React.ReactNode[] = [];
  if (showBadge) {
    trailingElements.push(
      <span
        key="badge"
        style={{
          padding: '2px 8px',
          fontSize: '11px',
          fontWeight: 600,
          color: badgeFg,
          backgroundColor: badgeBg,
          borderRadius: '999px',
          whiteSpace: 'nowrap',
        }}
      >
        {badgeText}
      </span>,
    );
  }
  if (showChevronRight) {
    trailingElements.push(<ChevronIcon key="chevron" color={iconColor} />);
  }
  if (showButton) {
    trailingElements.push(
      <button
        key="button"
        type="button"
        style={{
          fontFamily,
          fontSize: '12px',
          fontWeight: 600,
          color: actionColor,
          backgroundColor: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          textDecoration: 'underline',
          textUnderlineOffset: '2px',
          whiteSpace: 'nowrap',
        }}
      >
        {buttonLabel}
      </button>,
    );
  }

  // ── Flight module content (origin → destination lockup) ──────────────────
  function FlightLockup() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: valueColor, fontVariantNumeric: 'tabular-nums' }}>
            {flightData.originCode}
          </span>
          <span style={{ color: iconColor, display: 'inline-flex', alignItems: 'center' }}>
            <PlaneIcon color={iconColor} />
          </span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: valueColor, fontVariantNumeric: 'tabular-nums' }}>
            {flightData.destCode}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: bodyColor, fontVariantNumeric: 'tabular-nums' }}>
          <span>{flightData.originTime}</span>
          <span style={{ color: iconColor }}>–</span>
          <span>{flightData.destTime}</span>
          {flightData.duration && (
            <>
              <span style={{ color: iconColor }}>·</span>
              <span>{flightData.duration}</span>
            </>
          )}
        </div>
      </div>
    );
  }

  // Icon slot (either explicit "Multi-line + Icon" type OR showIcon on other types)
  const iconSlot = (hasIcon || showIcon) ? (
    <div
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        backgroundColor: mutedBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <RowIcon color={iconColor} />
    </div>
  ) : null;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '320px',
        padding: '12px 0',
        borderBottom: showDivider ? `1px solid ${borderColor}` : 'none',
        fontFamily,
        display: 'flex',
        alignItems: isSingleLine ? 'center' : 'flex-start',
        gap: '12px',
        boxSizing: 'border-box',
      }}
    >
      {iconSlot}

      {isSingleLine ? (
        /* Single-line: horizontal row, label left, data right */
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            minWidth: 0,
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 500, color: labelColor, whiteSpace: 'nowrap' }}>
            {labelText}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              {dataValues.map((d, i) => (
                <span key={i} style={{ fontSize: '13px', fontWeight: 600, color: valueColor, whiteSpace: 'nowrap' }}>
                  {d}
                </span>
              ))}
            </div>
            {trailingElements.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {trailingElements}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Multi-line / Multi-line + Icon: stacked label over data */
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: '12px', fontWeight: 500, color: labelColor }}>{labelText}</span>
              {isFlight ? (
                <FlightLockup />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {dataValues.map((d, i) => (
                    <span key={i} style={{ fontSize: '13px', fontWeight: 600, color: valueColor }}>
                      {d}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {trailingElements.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginTop: '2px' }}>
                {trailingElements}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
