import { type Brand } from '../../data/tokens';

export type AlertType = 'Information' | 'Success' | 'Warning' | 'Error' | 'Muted';
export type AlertOption = 'Top Border' | 'Full Border';

interface AlertLiveProps {
  type?: AlertType;
  option?: AlertOption;
  title?: string;
  description?: string;
  showIcon?: boolean;
  showDismiss?: boolean;
  brand?: Brand;
}

// ─── Token map: type → CSS custom properties ─────────────────────────────────
// bg is used for Full Border only — Top Border always uses bg-primary-inverse (white)
const TYPE_TOKENS: Record<AlertType, {
  bg: string;           // Full Border background (tinted)
  border: string;       // border color (CSS var resolved at runtime)
  iconColor: string;
  textColor: string;
}> = {
  Information: {
    bg: 'var(--atom-background-alert-bg-info-lightest)',
    border: 'var(--atom-border-feedback-border-info)',
    iconColor: 'var(--atom-foreground-feedback-fg-info)',
    textColor: 'var(--atom-foreground-core-fg-primary)',
  },
  Success: {
    bg: 'var(--atom-background-alert-bg-success-lightest)',
    border: 'var(--atom-border-feedback-success-border-color)',
    iconColor: 'var(--atom-foreground-feedback-fg-success)',
    textColor: 'var(--atom-foreground-core-fg-primary)',
  },
  Warning: {
    bg: 'var(--atom-background-alert-bg-warning-lightest)',
    border: 'var(--atom-border-feedback-border-warning)',
    iconColor: 'var(--atom-foreground-feedback-fg-warning)',
    textColor: 'var(--atom-foreground-core-fg-primary)',
  },
  Error: {
    bg: 'var(--atom-background-alert-bg-error-lightest)',
    border: 'var(--atom-border-feedback-border-error)',
    iconColor: 'var(--atom-foreground-feedback-fg-error)',
    textColor: 'var(--atom-foreground-core-fg-primary)',
  },
  Muted: {
    bg: 'var(--atom-background-core-bg-muted)',
    border: 'var(--atom-border-default-border-muted)',
    iconColor: 'var(--atom-foreground-core-fg-secondary)',
    textColor: 'var(--atom-foreground-core-fg-primary)',
  },
};

// ─── Placeholder icon — real Figma paths from node set 4537:115635 ────────────
const OUTLINE_PATH =
  'M19.5 3H4.5C4.10218 3 3.72064 3.15804 3.43934 3.43934C3.15804 3.72064 3 4.10218 3 ' +
  '4.5V19.5C3 19.8978 3.15804 20.2794 3.43934 20.5607C3.72064 20.842 4.10218 21 4.5 21H19.5C19.8978 ' +
  '21 20.2794 20.842 20.5607 20.5607C20.842 20.2794 21 19.8978 21 19.5V4.5C21 4.10218 20.842 3.72064 ' +
  '20.5607 3.43934C20.2794 3.15804 19.8978 3 19.5 3ZM4.5 19.5V5.56031L18.4397 19.5H4.5ZM5.56031 ' +
  '4.5H19.5V18.4406L5.56031 4.5Z';
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
const BRAND_ICON_PATHS: Record<Brand, string> = {
  dragonpass: OUTLINE_PATH, investec: OUTLINE_PATH,
  mastercard: MC_SOLID_PATH, visa: OUTLINE_PATH,
  greyscale: OUTLINE_PATH, assurant: OUTLINE_PATH,
};

function PlaceholderIcon({ brand = 'dragonpass' }: { brand?: Brand }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d={BRAND_ICON_PATHS[brand]} fill="currentColor" />
    </svg>
  );
}

// ─── Close (×) icon — Atom design system (4328:50465) ────────────────────────
function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18.2197 4.71967C18.5126 4.42678 18.9873 4.42678 19.2802 4.71967C19.5731 5.01256 19.5731 5.48732 19.2802 5.78022L5.78022 19.2802C5.48732 19.5731 5.01256 19.5731 4.71967 19.2802C4.42678 18.9873 4.42678 18.5126 4.71967 18.2197L18.2197 4.71967Z" fill="currentColor" />
      <path d="M4.71967 4.71967C5.01256 4.42678 5.48732 4.42678 5.78022 4.71967L19.2802 18.2197L19.332 18.2763C19.5723 18.5709 19.5548 19.0056 19.2802 19.2802C19.0056 19.5548 18.5709 19.5723 18.2763 19.332L18.2197 19.2802L4.71967 5.78022C4.42678 5.48732 4.42678 5.01256 4.71967 4.71967Z" fill="currentColor" />
    </svg>
  );
}

// ─── AlertLive ─────────────────────────────────────────────────────────────────
export function AlertLive({
  type = 'Information',
  option = 'Top Border',
  title = 'Title',
  description = 'Content goes here',
  showIcon = true,
  showDismiss = true,
  brand = 'dragonpass',
}: AlertLiveProps) {
  const t = TYPE_TOKENS[type];
  const isTopBorder = option === 'Top Border';

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',                        // Figma: --atom/space/tight = 8px
    color: t.textColor,
    padding: '16px',                   // Figma: --atom/space/comfortable = 16px
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'var(--atom-font-body, system-ui, sans-serif)',
    transition: 'background-color 0.15s ease, border-color 0.15s ease',
    // Top Border: white bg, 1px top only, square top corners, rounded bottom corners
    // Full Border: tinted bg, 1px all sides, all corners rounded
    ...(isTopBorder
      ? {
          backgroundColor: 'var(--atom-background-primary-bg-primary-inverse)',
          borderTop: `1px solid ${t.border}`,
          borderLeft: 'none',
          borderRight: 'none',
          borderBottom: 'none',
          borderRadius: '0 0 8px 8px',
        }
      : {
          backgroundColor: t.bg,
          border: `1px solid ${t.border}`,
          borderRadius: '8px',
        }),
  };

  return (
    <div style={containerStyle} role="alert">
      {/* Leading icon — 20×20 container, 16×16 icon */}
      {showIcon && (
        <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: t.iconColor }}>
          <PlaceholderIcon brand={brand} />
        </div>
      )}

      {/* Text content */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {title && (
          <p style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: '20px',
            color: t.textColor,
            fontFamily: 'var(--atom-font-body, system-ui, sans-serif)',
          }}>
            {title}
          </p>
        )}
        {description && (
          <p style={{
            margin: 0,
            fontSize: '12px',
            fontWeight: 400,
            lineHeight: '18px',
            color: 'var(--atom-foreground-core-fg-secondary)',
            fontFamily: 'var(--atom-font-body, system-ui, sans-serif)',
          }}>
            {description}
          </p>
        )}
      </div>

      {/* Dismiss button — 12×12 icon per Figma */}
      {showDismiss && (
        <button
          aria-label="Dismiss alert"
          style={{
            background: 'none',
            border: 'none',
            padding: '2px',
            cursor: 'pointer',
            color: 'var(--atom-foreground-core-fg-secondary)',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            transition: 'color 0.1s ease, background-color 0.1s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.color = t.textColor;
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(0,0,0,0.06)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--atom-foreground-core-fg-secondary)';
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
          }}
          onClick={e => e.preventDefault()}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
}
