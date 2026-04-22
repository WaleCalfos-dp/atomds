import { type Brand } from '../../data/tokens';

export type LineItemType = 'General Text' | 'Country' | 'Flight' | 'Country + Description';
export type LineItemMode = 'Light' | 'Dark';
export type LineItemWeight = 'Regular' | 'Bold';

interface LineItemLiveProps {
  type?: LineItemType;
  mode?: LineItemMode;
  weight?: LineItemWeight;
  showIcon?: boolean;
  titleText?: string;
  subtitleText?: string;
  showTitle?: boolean;
  showSubtitle?: boolean;
  /** Location text shown beneath the title/subtitle in Flight type (e.g. "London, UK") */
  locationText?: string;
  /** Render a switch toggle on the right side of the row */
  showSwitch?: boolean;
  /** Initial state of the switch (visual only) */
  switchChecked?: boolean;
  /** Render a checkbox on the left side of the row (before any other content) */
  showCheckbox?: boolean;
  /** Initial state of the checkbox (visual only) */
  checkboxChecked?: boolean;
  brand?: Brand;
}

/* Simple inline Switch visual (no interaction) */
function InlineSwitch({ checked, color }: { checked: boolean; color: string }) {
  return (
    <div
      style={{
        width: '28px',
        height: '16px',
        borderRadius: '999px',
        backgroundColor: checked ? color : 'rgba(0,0,0,0.18)',
        position: 'relative',
        flexShrink: 0,
        transition: 'background-color 0.2s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '2px',
          left: checked ? '14px' : '2px',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          transition: 'left 0.2s ease',
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
        }}
      />
    </div>
  );
}

/* Simple inline Checkbox visual (no interaction) */
function InlineCheckbox({ checked, color, borderColor }: { checked: boolean; color: string; borderColor: string }) {
  return (
    <div
      style={{
        width: '16px',
        height: '16px',
        borderRadius: '4px',
        border: `1.5px solid ${checked ? color : borderColor}`,
        backgroundColor: checked ? color : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {checked && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1.5 5L4 7.5L8.5 3" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

/* Simple placeholder icon (filled circle with inner detail) */
function PlaceholderIcon({ size = 16, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="7" stroke={color} strokeWidth="1.5" />
      <circle cx="8" cy="8" r="3" fill={color} />
    </svg>
  );
}

/* Flag placeholder for Country types */
function FlagPlaceholder({ color }: { color: string }) {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="19" height="15" rx="2" stroke={color} strokeWidth="1" />
      <line x1="0" y1="5.5" x2="20" y2="5.5" stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1="0" y1="10.5" x2="20" y2="10.5" stroke={color} strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

/* Circular icon container for Flight type */
function FlightIcon({ color }: { color: string }) {
  return (
    <div
      style={{
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        backgroundColor: 'var(--atom-background-core-bg-muted, #0a23330a)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        padding: '8px',
        boxSizing: 'border-box',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M15 9.75L9.75 14.25V16.5L8.25 15.75V14.25L3 9.75V8.25L8.25 10.5V4.5L6 3V1.5L9 3L12 1.5V3L9.75 4.5V10.5L15 8.25V9.75Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

export function LineItemLive({
  type = 'General Text',
  mode = 'Light',
  weight = 'Regular',
  showIcon = false,
  titleText = 'Title',
  subtitleText = 'Subtitle text',
  showTitle = true,
  showSubtitle = true,
  locationText = 'London, UK',
  showSwitch = false,
  switchChecked = false,
  showCheckbox = false,
  checkboxChecked = false,
  brand: _brand = 'dragonpass',
}: LineItemLiveProps) {
  const isDark = mode === 'Dark';
  const isBold = weight === 'Bold';

  const fontFamily = 'var(--atom-font-body, Poppins, sans-serif)';

  /* Switch + checkbox accent color based on brand surface */
  const accentColor = isDark
    ? 'var(--atom-foreground-primary-fg-brand-primary-inverse, #ffffff)'
    : 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)';
  const controlBorderColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(10,35,51,0.4)';

  /* Optional leading checkbox (before any other content) */
  const leadingCheckbox = showCheckbox ? (
    <InlineCheckbox checked={checkboxChecked} color={accentColor} borderColor={controlBorderColor} />
  ) : null;

  /* Optional trailing switch (after all other content) */
  const trailingSwitch = showSwitch ? (
    <div style={{ marginLeft: 'auto', paddingLeft: '12px', display: 'flex', alignItems: 'center' }}>
      <InlineSwitch checked={switchChecked} color={accentColor} />
    </div>
  ) : null;

  /* Color resolution based on mode */
  const titleColor = isDark
    ? 'var(--atom-foreground-primary-fg-brand-primary-inverse, #ffffff)'
    : 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)';

  const subtitleColor = isDark
    ? 'var(--atom-foreground-primary-fg-brand-primary-inverse, #ffffff)'
    : isBold
      ? 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)'
      : 'var(--atom-foreground-core-fg-primary, #4b4a4a)';

  const countryTextColor = isDark
    ? 'var(--atom-foreground-primary-fg-brand-primary-inverse, #ffffff)'
    : 'var(--atom-foreground-core-fg-primary, #4b4a4a)';

  const secondaryColor = isDark
    ? 'var(--atom-foreground-primary-fg-brand-primary-inverse, #ffffff)'
    : 'var(--atom-foreground-core-fg-secondary, #737272)';

  const brandPrimaryColor = isDark
    ? 'var(--atom-foreground-primary-fg-brand-primary-inverse, #ffffff)'
    : 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)';

  const iconColor = isDark ? '#ffffff' : '#4b4a4a';

  /* ---- General Text ---- */
  if (type === 'General Text') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '8px',
          fontFamily,
          boxSizing: 'border-box',
        }}
      >
        {leadingCheckbox}
        {showIcon && (
          <div
            style={{
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <PlaceholderIcon size={16} color={iconColor} />
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {showTitle && (
            <span
              style={{
                fontSize: '14px',
                fontWeight: 500,
                color: titleColor,
                lineHeight: 1.4,
              }}
            >
              {titleText}
            </span>
          )}
          {showSubtitle && (
            <span
              style={{
                fontSize: '14px',
                fontWeight: isBold ? 500 : 400,
                color: subtitleColor,
                lineHeight: 1.4,
              }}
            >
              {subtitleText}
            </span>
          )}
        </div>
        {trailingSwitch}
      </div>
    );
  }

  /* ---- Country ---- */
  if (type === 'Country') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '8px',
          fontFamily,
          boxSizing: 'border-box',
        }}
      >
        {leadingCheckbox}
        <FlagPlaceholder color={iconColor} />
        <span
          style={{
            fontSize: '14px',
            fontWeight: 400,
            color: countryTextColor,
            lineHeight: 1.4,
          }}
        >
          {titleText}
        </span>
        {trailingSwitch}
      </div>
    );
  }

  /* ---- Country + Description ---- */
  if (type === 'Country + Description') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '8px',
          fontFamily,
          boxSizing: 'border-box',
        }}
      >
        {leadingCheckbox}
        <FlagPlaceholder color={iconColor} />
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '175px' }}>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 400,
              color: countryTextColor,
              lineHeight: 1.4,
            }}
          >
            {titleText}
          </span>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 400,
              color: secondaryColor,
              lineHeight: 1.4,
            }}
          >
            {subtitleText}
          </span>
        </div>
        {trailingSwitch}
      </div>
    );
  }

  /* ---- Flight ---- */
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '8px',
        fontFamily,
        boxSizing: 'border-box',
      }}
    >
      {leadingCheckbox}
      <FlightIcon color={isDark ? '#ffffff' : '#0a2333'} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', gap: '6px' }}>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 400,
              color: brandPrimaryColor,
              lineHeight: 1.4,
            }}
          >
            {titleText}
          </span>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 400,
              color: secondaryColor,
              lineHeight: 1.4,
            }}
          >
            {subtitleText}
          </span>
        </div>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 400,
            color: secondaryColor,
            lineHeight: 1.4,
          }}
        >
          {locationText}
        </span>
      </div>
      {trailingSwitch}
    </div>
  );
}
