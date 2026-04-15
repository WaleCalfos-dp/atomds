import { type Brand } from '../../data/tokens';

export type BadgeState = 'Brand' | 'Success' | 'Warning' | 'Error' | 'Information' | 'Muted';
export type BadgeCurveRadius = 'Full' | 'Standard';

interface BadgeLiveProps {
  state?: BadgeState;
  curveRadius?: BadgeCurveRadius;
  label?: string;
  showIconLeft?: boolean;
  showIconRight?: boolean;
  brand?: Brand;
}

// ─── Token map: state → CSS custom properties ─────────────────────────────
const STATE_TOKENS: Record<BadgeState, { bg: string; fg: string }> = {
  Brand:       { bg: 'var(--atom-background-primary-bg-primary-default)',   fg: 'var(--atom-foreground-primary-fg-brand-primary-inverse)' },
  Success:     { bg: 'var(--atom-background-alert-bg-success-light)',        fg: 'var(--atom-foreground-core-fg-primary)' },
  Warning:     { bg: 'var(--atom-background-alert-bg-warning-default)',      fg: 'var(--atom-foreground-core-fg-primary)' },
  Error:       { bg: 'var(--atom-background-alert-bg-error-light)',          fg: 'var(--atom-foreground-core-fg-primary)' },
  Information: { bg: 'var(--atom-background-alert-bg-info-default)',         fg: 'var(--atom-foreground-core-fg-primary)' },
  Muted:       { bg: 'var(--atom-background-core-bg-muted)',                 fg: 'var(--atom-foreground-core-fg-primary)' },
};

// ─── Real Figma Placeholder icon paths (page 4:2, set 4537:115635) ────────
// Outline: dragonpass (4537:117242), investec (4537:117244),
//          mastercard-outline (4537:117246), assurant (7454:49396)
//          + fallbacks for visa / greyscale (no brand variant exists)
const OUTLINE_PATH =
  'M19.5 3H4.5C4.10218 3 3.72064 3.15804 3.43934 3.43934C3.15804 3.72064 3 4.10218 3 ' +
  '4.5V19.5C3 19.8978 3.15804 20.2794 3.43934 20.5607C3.72064 20.842 4.10218 21 4.5 21H19.5C19.8978 ' +
  '21 20.2794 20.842 20.5607 20.5607C20.842 20.2794 21 19.8978 21 19.5V4.5C21 4.10218 20.842 3.72064 ' +
  '20.5607 3.43934C20.2794 3.15804 19.8978 3 19.5 3ZM4.5 19.5V5.56031L18.4397 19.5H4.5ZM5.56031 ' +
  '4.5H19.5V18.4406L5.56031 4.5Z';

// Solid: mastercard (4537:117248) — distinct diagonal-line path
const MC_SOLID_PATH =
  'M19.0215 2.67676H4.02148C3.62366 2.67676 3.24213 2.83479 2.96082 3.1161C2.67952 3.3974 2.52148 ' +
  '3.77893 2.52148 4.17676V19.1768C2.52148 19.5746 2.67952 19.9561 2.96082 20.2374C3.24213 20.5187 ' +
  '3.62366 20.6768 4.02148 20.6768H19.0215C19.4193 20.6768 19.8008 20.5187 20.0821 20.2374C20.3634 ' +
  '19.9561 20.5215 19.5746 20.5215 19.1768V4.17676C20.5215 3.77893 20.3634 3.3974 20.0821 3.1161C19.8008 ' +
  '2.83479 19.4193 2.67676 19.0215 2.67676ZM17.0818 17.2371C16.9412 17.3776 16.7505 17.4566 16.5516 ' +
  '17.4566C16.3528 17.4566 16.1621 17.3776 16.0215 17.2371L5.96117 7.17676C5.82646 7.03496 5.75246 ' +
  '6.84615 5.75497 6.65058C5.75747 6.45501 5.83627 6.26815 5.97458 6.12985C6.11288 5.99155 6.29973 ' +
  '5.91274 6.4953 5.91024C6.69088 5.90774 6.87969 5.98173 7.02148 6.11645L17.0818 16.1768C17.2223 ' +
  '16.3174 17.3013 16.5081 17.3013 16.7069C17.3013 16.9057 17.2223 17.0964 17.0818 17.2371Z';

// Brand → icon path. Visa and greyscale fall back to dragonpass outline.
const BRAND_ICON_PATHS: Record<Brand, string> = {
  dragonpass: OUTLINE_PATH,
  investec:   OUTLINE_PATH,
  mastercard: MC_SOLID_PATH,
  visa:       OUTLINE_PATH, // fallback → dragonpass outline
  greyscale:  OUTLINE_PATH, // fallback → dragonpass outline
  assurant:   OUTLINE_PATH,
};

// ─── Placeholder icon — uses the real Figma SVG path ──────────────────────
function PlaceholderIcon({ brand = 'dragonpass' }: { brand?: Brand }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path d={BRAND_ICON_PATHS[brand]} fill="currentColor" />
    </svg>
  );
}

// ─── BadgeLive ─────────────────────────────────────────────────────────────
export function BadgeLive({
  state = 'Brand',
  curveRadius = 'Full',
  label = 'Label',
  showIconLeft = false,
  showIconRight = false,
  brand = 'dragonpass',
}: BadgeLiveProps) {
  const tokens = STATE_TOKENS[state];
  const borderRadius = curveRadius === 'Full' ? '9999px' : '2px';
  const paddingX = curveRadius === 'Full' ? '8px' : '4px';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: tokens.bg,
        color: tokens.fg,
        borderRadius,
        padding: `2px ${paddingX}`,
        fontSize: '12px',
        fontWeight: 500,
        lineHeight: 1.5,
        fontFamily: 'var(--atom-font-body, system-ui, sans-serif)',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        transition: 'background-color 0.15s ease, color 0.15s ease, border-radius 0.15s ease, padding 0.15s ease',
      }}
    >
      {showIconLeft && <PlaceholderIcon brand={brand} />}
      <span>{label || 'Label'}</span>
      {showIconRight && <PlaceholderIcon brand={brand} />}
    </div>
  );
}
