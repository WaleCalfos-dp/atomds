import { type Brand } from '../../data/tokens';

export type InputType = 'Basic' | 'Text Area' | 'Search' | 'Password' | 'Phone Number' | 'Verification Code' | 'Payment';
export type InputState = 'Default' | 'Focus' | 'Focus - Accessibility' | 'Error' | 'Disabled';
export type LabelPosition = 'Outside' | 'Inside';

interface InputLiveProps {
  type?: InputType;
  labelPosition?: LabelPosition;
  state?: InputState;
  filled?: boolean;
  label?: string;
  placeholder?: string;
  helperText?: string;
  showHelperText?: boolean;
  brand?: Brand;
}

/* ─────────────────────────────────────────────────────────────────────────────
   SVG Icons
   ───────────────────────────────────────────────────────────────────────────── */

// Brand-aware placeholder icon — trailing slot for Basic, Text Area, Payment (Inside), Inside label types
const OUTLINE_PATH = 'M19.5 3H4.5C4.10218 3 3.72064 3.15804 3.43934 3.43934C3.15804 3.72064 3 4.10218 3 4.5V19.5C3 19.8978 3.15804 20.2794 3.43934 20.5607C3.72064 20.842 4.10218 21 4.5 21H19.5C19.8978 21 20.2794 20.842 20.5607 20.5607C20.842 20.2794 21 19.8978 21 19.5V4.5C21 4.10218 20.842 3.72064 20.5607 3.43934C20.2794 3.15804 19.8978 3 19.5 3ZM19.5 19.5H4.5V4.5H19.5V19.5Z';
const MC_SOLID_PATH = 'M19.0215 2.67676H4.02148C3.21783 2.67676 2.44694 3.00271 1.87807 3.5813C1.30921 4.15989 0.990234 4.94283 0.990234 5.75879V18.2412C0.990234 19.0572 1.30921 19.8401 1.87807 20.4187C2.44694 20.9973 3.21783 21.3232 4.02148 21.3232H19.0215C19.8251 21.3232 20.596 20.9973 21.1649 20.4187C21.7337 19.8401 22.0527 19.0572 22.0527 18.2412V5.75879C22.0527 4.94283 21.7337 4.15989 21.1649 3.5813C20.596 3.00271 19.8251 2.67676 19.0215 2.67676Z';
const BRAND_ICON_PATHS: Record<Brand, string> = {
  dragonpass: OUTLINE_PATH, investec: OUTLINE_PATH,
  mastercard: MC_SOLID_PATH, visa: OUTLINE_PATH,
  greyscale: OUTLINE_PATH, assurant: OUTLINE_PATH,
};

function PlaceholderIcon({ brand = 'dragonpass', size = 16 }: { brand?: Brand; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0, display: 'block' }}>
      <path d={BRAND_ICON_PATHS[brand]} fill="currentColor" />
    </svg>
  );
}

// Info icon — outlined teal ring with teal "i" — label and helper rows (matches Figma even-odd path)
function InfoIcon({ size = 14, color = 'var(--atom-foreground-core-fg-interactive-icon, #006b99)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0, display: 'block' }}>
      <circle cx="7" cy="7" r="6" stroke={color} strokeWidth="1" fill="none" />
      <rect x="6.25" y="6" width="1.5" height="4.5" rx="0.75" fill={color} />
      <circle cx="7" cy="4.25" r="0.9" fill={color} />
    </svg>
  );
}

function SearchIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0, display: 'block' }}>
      <circle cx="7" cy="7" r="4.5" stroke={color} strokeWidth="1.5" />
      <line x1="10.5" y1="10.5" x2="14" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0, display: 'block' }}>
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="2" fill={color} />
    </svg>
  );
}

function ChevronDownIcon({ size = 12, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0, display: 'block' }}>
      <path d="M2.5 4.5L6 8L9.5 4.5" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg width="24" height="18" viewBox="0 0 24 18" fill="none" aria-hidden="true" style={{ flexShrink: 0, display: 'block', borderRadius: '2px' }}>
      <rect width="24" height="18" fill="#012169" />
      <path d="M0 0L24 18M24 0L0 18" stroke="white" strokeWidth="3.6" />
      <path d="M0 0L24 18M24 0L0 18" stroke="#C8102E" strokeWidth="2" />
      <path d="M12 0V18M0 9H24" stroke="white" strokeWidth="6" />
      <path d="M12 0V18M0 9H24" stroke="#C8102E" strokeWidth="3.6" />
    </svg>
  );
}

function PaymentBadge({ disabled = false }: { disabled?: boolean }) {
  return (
    <div style={{
      width: '35px', height: '24px', borderRadius: '4px',
      backgroundColor: disabled ? '#ebe9e8' : '#ffffff',
      border: '1px solid #cdcbcb',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <svg width="24" height="15" viewBox="0 0 24 15" fill="none">
        <circle cx="9" cy="7.5" r="6" fill={disabled ? '#c8c5c3' : '#EB001B'} />
        <circle cx="15" cy="7.5" r="6" fill={disabled ? '#c8c5c3' : '#F79E1B'} fillOpacity={disabled ? 1 : 0.9} />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Password Criteria
   ───────────────────────────────────────────────────────────────────────────── */
type CriteriaStatus = 'neutral' | 'success' | 'error';

function PasswordCriteriaRow({ label, status, font }: { label: string; status: CriteriaStatus; font: string }) {
  const col = status === 'success' ? '#16a34a' : status === 'error' ? '#e02d3c' : '#9ca3af';
  const Icon = () => {
    if (status === 'success') return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="7" cy="7" r="6.5" stroke={col} strokeWidth="1.2" />
        <path d="M4.5 7l2 2 3-3" stroke={col} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="7" cy="7" r="6.5" stroke={col} strokeWidth="1.2" />
        <path d="M5 5l4 4M9 5l-4 4" stroke={col} strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    );
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <Icon />
      <span style={{ fontSize: '13px', color: col, fontFamily: font, lineHeight: '18px' }}>{label}</span>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═════════════════════════════════════════════════════════════════════════════ */
export function InputLive({
  type = 'Basic',
  labelPosition = 'Outside',
  state = 'Default',
  filled = false,
  label = 'Label',
  placeholder = 'Placeholder',
  helperText = 'Helper Text',
  showHelperText = true,
  brand = 'dragonpass',
}: InputLiveProps) {
  const isDisabled     = state === 'Disabled';
  const isError        = state === 'Error';
  const isFocus        = state === 'Focus';
  const isFocusA11y    = state === 'Focus - Accessibility';
  const isInside       = labelPosition === 'Inside';
  const isTextArea     = type === 'Text Area';
  const isSearch       = type === 'Search';
  const isPassword     = type === 'Password';
  const isPhone        = type === 'Phone Number';
  const isVerification = type === 'Verification Code';
  const isPayment      = type === 'Payment';

  const font = 'var(--atom-font-body, Poppins, sans-serif)';

  // ── Colour tokens ──────────────────────────────────────────────────────────
  const fgPrimary   = 'var(--atom-foreground-core-fg-primary, #4b4a4a)';
  const fgSecondary = 'var(--atom-foreground-core-fg-secondary, #737272)';
  const fgDisabled  = 'var(--atom-foreground-states-fg-disabled, #91908f)';
  const fgError     = 'var(--atom-foreground-feedback-fg-error, #e02d3c)';
  const fgIcon      = 'var(--atom-foreground-core-fg-interactive-icon, #006b99)';

  const bgDefault   = 'var(--atom-background-primary-bg-primary-inverse, #ffffff)';
  const bgDisabled  = 'var(--atom-background-primary-bg-primary-disabled, #ebe9e8)';

  const borderDefault  = 'var(--atom-border-default-border-default, #cdcbcb)';
  const borderFocus    = 'var(--atom-border-selection-and-focus-border-primary-focus, #0a2333)';
  const borderError    = 'var(--atom-border-feedback-border-error, #e02d3c)';
  const borderDisabled = 'var(--atom-border-states-border-disabled, #cdcbcb)';

  // ── Derived per-state ──────────────────────────────────────────────────────
  const labelColor  = isError ? fgError : isDisabled ? fgDisabled : fgPrimary;
  const textColor   = isDisabled ? fgDisabled : fgPrimary;
  const iconColor   = isDisabled ? fgDisabled : fgIcon;
  const helperColor = isError ? fgError : isDisabled ? fgDisabled : fgSecondary;
  // SVG exports confirm: label info icon stays teal (#006B99) in ALL states
  const labelInfoColor = fgIcon;

  const fieldBg     = isDisabled ? bgDisabled : bgDefault;
  const fieldBorder = isError
    ? `1px solid ${borderError}`
    : isFocus
    ? `1px solid ${borderFocus}`
    : isDisabled
    ? `1px solid ${borderDisabled}`
    : `1px solid ${borderDefault}`;
  // Figma focus ring = #0A2333 at 20% opacity (from SVG exports)
  // Focus-Accessibility = solid #0A2333 ring with 2px offset, border reverts to default
  const fieldShadow = isFocus
    ? '0 0 0 2px rgba(10, 35, 51, 0.2)'
    : 'none';
  const fieldOutline = isFocusA11y ? '2px solid #0A2333' : 'none';
  const fieldOutlineOffset = isFocusA11y ? '2px' : undefined;

  // ── Shared field box (52px, 8px radius) ────────────────────────────────────
  const fieldBox = (overrides: React.CSSProperties = {}): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: fieldBg,
    border: fieldBorder,
    borderRadius: '8px',
    padding: '0 12px',
    height: '52px',
    boxShadow: fieldShadow,
    outline: fieldOutline,
    outlineOffset: fieldOutlineOffset,
    cursor: isDisabled ? 'not-allowed' : 'text',
    boxSizing: 'border-box',
    transition: 'border 0.15s ease, box-shadow 0.15s ease',
    fontFamily: font,
    ...overrides,
  });

  // ── Label row (Outside) ────────────────────────────────────────────────────
  const LabelRow = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span style={{ fontSize: '14px', lineHeight: '20px', color: labelColor, fontFamily: font }}>{label}</span>
      <InfoIcon size={14} color={labelInfoColor} />
    </div>
  );

  // ── Helper row ─────────────────────────────────────────────────────────────
  const HelperRow = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <InfoIcon size={14} color={helperColor} />
      <span style={{ fontSize: '12px', lineHeight: '16px', color: helperColor, fontFamily: font }}>
        {helperText}
      </span>
    </div>
  );

  // ── Floating inside label ──────────────────────────────────────────────────
  const InsideLabel = ({ trailing }: { trailing: React.ReactNode }) => (
    <div style={fieldBox()}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1px', minWidth: 0, alignSelf: 'stretch' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{
            fontSize: filled ? '11px' : '14px',
            lineHeight: filled ? '14px' : '20px',
            color: filled ? (isError ? fgError : fgSecondary) : labelColor,
            fontFamily: font,
          }}>{label}</span>
          <InfoIcon size={filled ? 11 : 14} color={labelInfoColor} />
        </div>
        {filled && (
          <span style={{ fontSize: '14px', lineHeight: '20px', color: textColor, fontFamily: font }}>Data</span>
        )}
      </div>
      <span style={{ color: iconColor, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {trailing}
      </span>
    </div>
  );

  // ── Wrapper ────────────────────────────────────────────────────────────────
  const wrapStyle: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', gap: '4px',
    width: isVerification ? 'fit-content' : '350px',
    fontFamily: font,
  };

  // ── Password criteria section ──────────────────────────────────────────────
  const PasswordCriteria = () => (
    !isDisabled ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
        <span style={{ fontSize: '14px', lineHeight: '20px', color: fgPrimary, fontFamily: font }}>
          Your password must contain
        </span>
        <PasswordCriteriaRow label="Password condition" status="neutral" font={font} />
        <PasswordCriteriaRow label="Password condition" status="success" font={font} />
        <PasswordCriteriaRow label="Password condition" status="error" font={font} />
      </div>
    ) : null
  );

  /* ═══════════════════════════════════════════════════════════════════════════
     INSIDE LABEL POSITION
     ═══════════════════════════════════════════════════════════════════════════ */
  if (isInside) {
    // ── Search Inside: pill-shaped field (borderRadius: 999px from Figma SVG) ─
    if (isSearch) {
      return (
        <div style={wrapStyle}>
          <div style={fieldBox({ borderRadius: '999px' })}>
            <span style={{ color: iconColor, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <SearchIcon size={16} color={iconColor} />
            </span>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1px', minWidth: 0, alignSelf: 'stretch' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{
                  fontSize: filled ? '11px' : '14px',
                  lineHeight: filled ? '14px' : '20px',
                  color: filled ? (isError ? fgError : fgSecondary) : labelColor,
                  fontFamily: font,
                }}>{label}</span>
                <InfoIcon size={filled ? 11 : 14} color={labelInfoColor} />
              </div>
              {filled && (
                <span style={{ fontSize: '14px', lineHeight: '20px', color: textColor, fontFamily: font }}>Lounge access London</span>
              )}
            </div>
          </div>
          {showHelperText && <HelperRow />}
        </div>
      );
    }

    // ── Phone Number Inside: two boxes, label floats inside right box ─────────
    if (isPhone) {
      return (
        <div style={wrapStyle}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={fieldBox({ width: '103px', flexShrink: 0, gap: '6px', padding: '0 10px' })}>
              <FlagIcon />
              <span style={{ fontSize: '12px', color: textColor, fontFamily: font, flex: 1, whiteSpace: 'nowrap' }}>+44</span>
              <ChevronDownIcon size={12} color={isDisabled ? '#91908f' : '#4b4a4a'} />
            </div>
            <div style={fieldBox({ flex: 1 })}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1px', minWidth: 0, alignSelf: 'stretch' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{
                    fontSize: filled ? '11px' : '14px',
                    lineHeight: filled ? '14px' : '20px',
                    color: filled ? (isError ? fgError : fgSecondary) : labelColor,
                    fontFamily: font,
                  }}>{label}</span>
                  <InfoIcon size={filled ? 11 : 14} color={labelInfoColor} />
                </div>
                {filled && (
                  <span style={{ fontSize: '14px', lineHeight: '20px', color: textColor, fontFamily: font }}>07700 900000</span>
                )}
              </div>
            </div>
          </div>
          {showHelperText && <HelperRow />}
        </div>
      );
    }

    // ── Verification Code Inside: 6 boxes, same structure as Outside ──────────
    if (isVerification) {
      return (
        <div style={wrapStyle}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{
                width: '52px', height: '52px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: fieldBg, border: fieldBorder, borderRadius: '8px',
                boxShadow: isFocus && i === 0 ? fieldShadow : 'none',
                outline: isFocusA11y && i === 0 ? fieldOutline : 'none',
                outlineOffset: isFocusA11y && i === 0 ? fieldOutlineOffset : undefined,
                fontSize: '18px', lineHeight: 1, fontFamily: font,
                color: filled ? textColor : fgSecondary,
                cursor: isDisabled ? 'not-allowed' : 'text',
                boxSizing: 'border-box',
                transition: 'border 0.15s ease, box-shadow 0.15s ease',
              }}>
                {filled ? i + 1 : '0'}
              </div>
            ))}
          </div>
          {showHelperText && <HelperRow />}
        </div>
      );
    }

    // ── Payment Inside: floating label + badge ─────────────────────────────────
    if (isPayment) {
      return (
        <div style={wrapStyle}>
          <InsideLabel trailing={<PaymentBadge disabled={isDisabled} />} />
          {showHelperText && <HelperRow />}
        </div>
      );
    }

    // ── Password Inside: floating label + eye icon + criteria ─────────────────
    if (isPassword) {
      return (
        <div style={wrapStyle}>
          <div style={fieldBox()}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1px', minWidth: 0, alignSelf: 'stretch' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{
                  fontSize: filled ? '11px' : '14px',
                  lineHeight: filled ? '14px' : '20px',
                  color: filled ? (isError ? fgError : fgSecondary) : labelColor,
                  fontFamily: font,
                }}>{label}</span>
                <InfoIcon size={filled ? 11 : 14} color={labelInfoColor} />
              </div>
              {filled && (
                <span style={{ fontSize: '14px', lineHeight: '20px', color: textColor, fontFamily: font }}>{'••••••••••'}</span>
              )}
            </div>
            <span style={{ color: iconColor, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <EyeIcon size={16} color={iconColor} />
            </span>
          </div>
          {showHelperText && <HelperRow />}
          <PasswordCriteria />
        </div>
      );
    }

    // ── Text Area Inside: 128px tall field, floating label ────────────────────
    if (isTextArea) {
      return (
        <div style={wrapStyle}>
          <div style={fieldBox({ height: 'auto', minHeight: '128px', alignItems: 'flex-start', padding: '16px 12px' })}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1px', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{
                  fontSize: filled ? '11px' : '14px',
                  lineHeight: filled ? '14px' : '20px',
                  color: filled ? (isError ? fgError : fgSecondary) : labelColor,
                  fontFamily: font,
                }}>{label}</span>
                <InfoIcon size={filled ? 11 : 14} color={labelInfoColor} />
              </div>
              {filled && (
                <span style={{ fontSize: '14px', lineHeight: '20px', color: textColor, fontFamily: font }}>Data</span>
              )}
            </div>
            <span style={{ color: iconColor, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <PlaceholderIcon brand={brand} size={16} />
            </span>
          </div>
          {showHelperText && <HelperRow />}
        </div>
      );
    }

    // ── Basic Inside: floating label + placeholder icon ───────────────────────
    return (
      <div style={wrapStyle}>
        <InsideLabel trailing={<PlaceholderIcon brand={brand} size={16} />} />
        {showHelperText && <HelperRow />}
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     OUTSIDE LABEL POSITION
     ═══════════════════════════════════════════════════════════════════════════ */

  // ── Verification Code: 6 individual digit boxes ────────────────────────────
  if (isVerification) {
    return (
      <div style={wrapStyle}>
        <LabelRow />
        <div style={{ display: 'flex', gap: '8px' }}>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{
              width: '52px', height: '52px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: fieldBg, border: fieldBorder, borderRadius: '8px',
              boxShadow: isFocus && i === 0 ? fieldShadow : 'none',
              fontSize: '18px', lineHeight: 1, fontFamily: font,
              color: filled ? textColor : fgSecondary,
              cursor: isDisabled ? 'not-allowed' : 'text',
              boxSizing: 'border-box',
              transition: 'border 0.15s ease, box-shadow 0.15s ease',
            }}>
              {filled ? i + 1 : '0'}
            </div>
          ))}
        </div>
        {showHelperText && <HelperRow />}
      </div>
    );
  }

  // ── Phone Number: two separate bordered boxes ──────────────────────────────
  if (isPhone) {
    return (
      <div style={wrapStyle}>
        <LabelRow />
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={fieldBox({ width: '103px', flexShrink: 0, gap: '6px', padding: '0 10px' })}>
            <FlagIcon />
            <span style={{ fontSize: '12px', color: textColor, fontFamily: font, flex: 1, whiteSpace: 'nowrap' }}>+44</span>
            <ChevronDownIcon size={12} color={isDisabled ? '#91908f' : '#4b4a4a'} />
          </div>
          <div style={fieldBox({ flex: 1 })}>
            <span style={{ fontSize: '14px', color: filled ? textColor : fgSecondary, fontFamily: font }}>
              {filled ? '07700 900000' : placeholder}
            </span>
          </div>
        </div>
        {showHelperText && <HelperRow />}
      </div>
    );
  }

  // ── Payment: single field + badge ───────────────────────────────────────────
  if (isPayment) {
    return (
      <div style={wrapStyle}>
        <LabelRow />
        <div style={fieldBox()}>
          <span style={{ flex: 1, fontSize: '14px', lineHeight: '20px', color: filled ? textColor : fgSecondary, fontFamily: font }}>
            {filled ? '•••• •••• •••• 4242' : placeholder}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <PaymentBadge disabled={isDisabled} />
          </span>
        </div>
        {showHelperText && <HelperRow />}
      </div>
    );
  }

  // ── Password: eye icon + criteria section ──────────────────────────────────
  if (isPassword) {
    return (
      <div style={wrapStyle}>
        <LabelRow />
        <div style={fieldBox()}>
          <span style={{ flex: 1, fontSize: '14px', lineHeight: '20px', color: filled ? textColor : fgSecondary, fontFamily: font }}>
            {filled ? '••••••••••' : placeholder}
          </span>
          <span style={{ color: iconColor, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <EyeIcon size={16} color={iconColor} />
          </span>
        </div>
        {showHelperText && <HelperRow />}
        <PasswordCriteria />
      </div>
    );
  }

  // ── Search: leading magnifier icon, no trailing, 8px radius Outside ────────
  if (isSearch) {
    return (
      <div style={wrapStyle}>
        <LabelRow />
        <div style={fieldBox()}>
          <span style={{ color: iconColor, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <SearchIcon size={16} color={iconColor} />
          </span>
          <span style={{ flex: 1, fontSize: '14px', lineHeight: '20px', color: filled ? textColor : fgSecondary, fontFamily: font }}>
            {filled ? 'Lounge access London' : placeholder}
          </span>
        </div>
        {showHelperText && <HelperRow />}
      </div>
    );
  }

  // ── Basic + Text Area (default) ────────────────────────────────────────────
  return (
    <div style={wrapStyle}>
      <LabelRow />
      <div style={isTextArea
        ? fieldBox({ height: 'auto', minHeight: '128px', alignItems: 'flex-start', padding: '16px 12px' })
        : fieldBox()
      }>
        <span style={{
          flex: 1, fontSize: '14px', lineHeight: '20px',
          color: filled ? textColor : fgSecondary,
          fontFamily: font,
          alignSelf: isTextArea ? 'flex-start' : 'center',
        }}>
          {filled ? 'Data' : placeholder}
        </span>
        <span style={{
          color: iconColor, display: 'flex', alignItems: 'center', flexShrink: 0,
          alignSelf: isTextArea ? 'flex-start' : 'center',
          marginTop: isTextArea ? '2px' : 0,
        }}>
          <PlaceholderIcon brand={brand} size={16} />
        </span>
      </div>
      {showHelperText && <HelperRow />}
    </div>
  );
}
