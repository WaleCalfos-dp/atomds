import { type Brand } from '../../data/tokens';

// ─── Public types ─────────────────────────────────────────────────────────────
// 1:1 with the Figma Dialog component set at node 3581-33620.
// Platforms   : App (275 × 314), Desktop (650 × 406)
// Types       : Info / Success / Warning / Error (icon color only)
// Layout      : items-center (App) / stacked flex-col with close row (Desktop)
// Typography  : Cabin Medium 20/30 (title) · Poppins 14/20 (body/buttons)
// Radius      : 16 (card) · 999 (buttons)
// Button stack: Primary (#0A2333 filled) · Secondary (1px outlined) · Tertiary (blue link)
export type DialogPlatform = 'App' | 'Desktop';
export type DialogType = 'Info' | 'Success' | 'Warning' | 'Error';

export interface DialogLiveProps {
  platform?: DialogPlatform;
  dialogType?: DialogType;
  titleText?: string;
  bodyText?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  tertiaryLabel?: string;
  showPrimary?: boolean;
  showSecondary?: boolean;
  showTertiary?: boolean;
  showIcon?: boolean;
  /** Desktop only — the 40×40 circular close button in the top-right corner. */
  showClose?: boolean;
  /** Optional content slots rendered between the description and the buttons. */
  slot1?: React.ReactNode;
  slot2?: React.ReactNode;
  /** Drop the dialog on a soft overlay for docs display. */
  showOverlay?: boolean;
  brand?: Brand;
}

// ─── Figma-exact icon colors (one shared shape, tinted per type) ─────────────
const TYPE_ICON_COLOR: Record<DialogType, string> = {
  Info: '#006B99',
  Success: '#067647',
  Warning: '#D6A025',
  Error: '#E02D3C',
};

// ─── Icon ─────────────────────────────────────────────────────────────────────
// Normalized from the Figma SVG exports (viewBox 0 0 25.6 25.6). Same shape for
// every type — Figma only varies the fill colour, so we do the same.
function DialogIcon({ color, size }: { color: string; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 25.6 25.6"
      fill="none"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.467 0C24.032 0 24.575 0.2249 24.975 0.625C25.375 1.025 25.6 1.568 25.6 2.1338V23.467C25.6 24.032 25.375 24.576 24.975 24.976C24.575 25.376 24.032 25.6 23.467 25.6H2.134C1.568 25.6 1.025 25.376 0.625 24.976C0.225 24.576 0 24.032 0 23.467V2.1338C0 1.568 0.225 1.025 0.625 0.625C1.025 0.2249 1.568 0 2.134 0H23.467ZM2.134 23.467H21.959L2.134 3.6416V23.467ZM3.641 2.1338L23.467 21.96V2.1338H3.641Z"
        fill={color}
      />
    </svg>
  );
}

// ─── Close icon (Desktop only) ───────────────────────────────────────────────
// Slim X glyph — same proportions as the Figma close button (≈10 × 11 inside a
// 40 × 40 white circle with a 1px default-border stroke).
function CloseIcon({ color, size = 10 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10.6 10.6" fill="none" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.354 0.2082C10.562 0 10.9 0 11.108 0.2082C11.317 0.4165 11.317 0.7549 11.108 0.9631L6.685 5.385L11.108 9.8088L11.145 9.8489C11.315 10.0583 11.304 10.3674 11.108 10.5627C10.913 10.7579 10.604 10.7703 10.395 10.5998L10.354 10.5627L5.931 6.1399L1.508 10.5627C1.3 10.7708 0.962 10.7709 0.754 10.5627C0.546 10.3545 0.546 10.0171 0.754 9.8088L5.176 5.385L0.754 0.9631C0.546 0.7548 0.546 0.4165 0.754 0.2082C0.962 0.0003 1.3 0.0003 1.508 0.2082L5.931 4.6311L10.354 0.2082Z"
        transform="translate(-0.754 0)"
        fill={color}
      />
    </svg>
  );
}

// ─── Button primitives ───────────────────────────────────────────────────────
function PrimaryButton({
  label,
  fg,
  bg,
  fontFamily,
}: {
  label: string;
  fg: string;
  bg: string;
  fontFamily: string;
}) {
  return (
    <button
      type="button"
      style={{
        width: '100%',
        padding: '16px',
        backgroundColor: bg,
        color: fg,
        border: 'none',
        borderRadius: '999px',
        fontFamily,
        fontSize: '14px',
        lineHeight: '20px',
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {label}
    </button>
  );
}

function SecondaryButton({
  label,
  fg,
  border,
  fontFamily,
}: {
  label: string;
  fg: string;
  border: string;
  fontFamily: string;
}) {
  return (
    <button
      type="button"
      style={{
        width: '100%',
        padding: '15px 16px', // 15 + 1px border = 16 visual
        backgroundColor: 'transparent',
        color: fg,
        border: `1px solid ${border}`,
        borderRadius: '999px',
        fontFamily,
        fontSize: '14px',
        lineHeight: '20px',
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {label}
    </button>
  );
}

function TertiaryButton({
  label,
  fg,
  fontFamily,
}: {
  label: string;
  fg: string;
  fontFamily: string;
}) {
  return (
    <button
      type="button"
      style={{
        width: '100%',
        padding: '4px 16px',
        backgroundColor: 'transparent',
        color: fg,
        border: 'none',
        borderRadius: '999px',
        fontFamily,
        fontSize: '14px',
        lineHeight: '20px',
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {label}
    </button>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export function DialogLive({
  platform = 'Desktop',
  dialogType = 'Info',
  titleText = 'Title',
  bodyText = 'Description',
  primaryLabel = 'Button',
  secondaryLabel = 'Button',
  tertiaryLabel = 'Button',
  showPrimary = true,
  showSecondary = true,
  showTertiary = true,
  showIcon = true,
  showClose = true,
  slot1,
  slot2,
  showOverlay = true,
  brand: _brand = 'dragonpass',
}: DialogLiveProps) {
  // ── Token palette (Atom semantic tokens with hex fallbacks) ──────────────
  const fontBody = 'var(--atom-font-body, Poppins, system-ui, sans-serif)';
  const fontTitle = 'var(--atom-font-heading, Cabin, system-ui, sans-serif)';
  const bgDialog = 'var(--atom-background-primary-bg-primary-inverse, #ffffff)';
  const primaryBg = 'var(--atom-background-primary-bg-primary-default, #0a2333)';
  const primaryFg = 'var(--atom-foreground-primary-fg-brand-primary-inverse, #ffffff)';
  const titleColor = 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)';
  const bodyColor = 'var(--atom-foreground-core-fg-primary, #4b4a4a)';
  const linkColor = 'var(--atom-foreground-core-fg-link, #006b99)';
  const borderDefault = 'var(--atom-border-default-border-default, #cdcbcb)';
  const borderBrand = 'var(--atom-border-default-border-default-brand, #0a2333)';

  const iconColor = TYPE_ICON_COLOR[dialogType];

  // ── Shared text styles ────────────────────────────────────────────────────
  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontFamily: fontTitle,
    fontSize: '20px',
    lineHeight: '30px',
    fontWeight: 500,
    color: titleColor,
    textAlign: 'center',
  };
  const descriptionStyle: React.CSSProperties = {
    margin: 0,
    fontFamily: fontBody,
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 400,
    color: bodyColor,
    textAlign: 'center',
  };

  // ─────────────────────────────────────────────────────────────────────────
  // App platform — 275 × auto, items-center, 24px padding, gap 8/16/12
  // ─────────────────────────────────────────────────────────────────────────
  const appDialog = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-body"
      style={{
        width: '275px',
        maxWidth: '100%',
        backgroundColor: bgDialog,
        borderRadius: '16px',
        padding: '24px',
        fontFamily: fontBody,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}
    >
      {showIcon && (
        <div
          style={{
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '8px',
            flexShrink: 0,
          }}
        >
          <DialogIcon color={iconColor} size={16} />
        </div>
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          width: '100%',
          marginBottom: '16px',
        }}
      >
        <h2 id="dialog-title" style={titleStyle}>
          {titleText}
        </h2>
        <p id="dialog-body" style={descriptionStyle}>
          {bodyText}
        </p>
      </div>
      {(slot1 || slot2) && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '100%',
            marginBottom: '16px',
          }}
        >
          {slot1 && <DialogSlot>{slot1}</DialogSlot>}
          {slot2 && <DialogSlot>{slot2}</DialogSlot>}
        </div>
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: '12px',
          width: '100%',
        }}
      >
        {showPrimary && (
          <PrimaryButton
            label={primaryLabel}
            fg={primaryFg}
            bg={primaryBg}
            fontFamily={fontBody}
          />
        )}
        {showSecondary && (
          <SecondaryButton
            label={secondaryLabel}
            fg={titleColor}
            border={borderBrand}
            fontFamily={fontBody}
          />
        )}
        {showTertiary && (
          <TertiaryButton
            label={tertiaryLabel}
            fg={linkColor}
            fontFamily={fontBody}
          />
        )}
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Desktop platform — 650 × auto, items-stretch, 32px outer padding, close
  // button top-right, icon centred, title/description below, full-width stack
  // ─────────────────────────────────────────────────────────────────────────
  const desktopDialog = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-body"
      style={{
        width: '650px',
        maxWidth: '100%',
        backgroundColor: bgDialog,
        borderRadius: '16px',
        fontFamily: fontBody,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          padding: '32px 32px 0 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '100%',
            minHeight: '40px',
          }}
        >
          {showClose && (
            <button
              type="button"
              aria-label="Close"
              style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: bgDialog,
                border: `1px solid ${borderDefault}`,
                borderRadius: '999px',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <CloseIcon color={titleColor} size={11} />
            </button>
          )}
        </div>
        {showIcon && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: '8px',
              paddingBottom: '8px',
              width: '100%',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <DialogIcon color={iconColor} size={26} />
            </div>
          </div>
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            paddingTop: '8px',
            paddingBottom: '8px',
            width: '100%',
          }}
        >
          <h2 id="dialog-title" style={titleStyle}>
            {titleText}
          </h2>
          <p id="dialog-body" style={descriptionStyle}>
            {bodyText}
          </p>
        </div>
        {(slot1 || slot2) && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              width: '100%',
              paddingTop: '16px',
            }}
          >
            {slot1 && <DialogSlot>{slot1}</DialogSlot>}
            {slot2 && <DialogSlot>{slot2}</DialogSlot>}
          </div>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          padding: '16px 32px 32px 32px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {showPrimary && (
          <PrimaryButton
            label={primaryLabel}
            fg={primaryFg}
            bg={primaryBg}
            fontFamily={fontBody}
          />
        )}
        {showSecondary && (
          <SecondaryButton
            label={secondaryLabel}
            fg={titleColor}
            border={borderBrand}
            fontFamily={fontBody}
          />
        )}
        {showTertiary && (
          <TertiaryButton
            label={tertiaryLabel}
            fg={linkColor}
            fontFamily={fontBody}
          />
        )}
      </div>
    </div>
  );

  const dialog = platform === 'App' ? appDialog : desktopDialog;

  if (!showOverlay) return dialog;

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        minHeight: '260px',
        width: '100%',
        backgroundColor: 'var(--atom-background-core-bg-overlay, rgba(10, 35, 51, 0.45))',
        borderRadius: '12px',
      }}
    >
      {dialog}
    </div>
  );
}

// ─── Slot container (optional content slots) ─────────────────────────────────
function DialogSlot({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: '100%',
        padding: '12px 16px',
        border: '1px solid var(--atom-border-default-border-default, #cdcbcb)',
        borderRadius: '8px',
        fontFamily: 'var(--atom-font-body, Poppins, system-ui, sans-serif)',
        fontSize: '14px',
        lineHeight: '20px',
        color: 'var(--atom-foreground-core-fg-primary, #4b4a4a)',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  );
}
