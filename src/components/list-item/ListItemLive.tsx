import { type Brand } from '../../data/tokens';

// ─── Public types ─────────────────────────────────────────────────────────────
// Aligned with the Figma component set "List Item" (30 SVG exports):
//   Single               × Default/Hover/Selected/Focused/Disabled × Not Interactive/Interactive = 10
//   Single + Description × Default/Hover/Selected/Focused/Disabled × Not Interactive/Interactive = 10
//   Stacked              × Default/Hover/Selected/Focused/Disabled × Not Interactive only        = 5
//   Country              × Default                                  × Not Interactive/Interactive = 2
//   Region               × Default                                  × Not Interactive/Interactive = 2
//   Group                × Default                                  × Interactive only            = 1
export type ListItemType = 'Single' | 'Stacked' | 'Single + Description' | 'Country' | 'Region' | 'Group';
export type ListItemStyle = 'Not Interactive' | 'Interactive';
export type ListItemState = 'Default' | 'Hover' | 'Focused' | 'Selected' | 'Disabled';

interface ListItemLiveProps {
  type?: ListItemType;
  itemStyle?: ListItemStyle;
  state?: ListItemState;

  // Primary content
  titleText?: string;        // Single / Stacked / Single + Description title
  subtitleText?: string;     // Stacked / Single + Description subtitle
  subtitleText2?: string;    // Single + Description bottom row text
  rightTitleText?: string;   // Single contentRight title (e.g. trailing metadata)
  rightSubtitleText?: string;// Single / Stacked contentRight subtitle

  // Country / Region
  countryName?: string;
  regionName?: string;
  trailingText?: string;     // Right-aligned meta on Country / Region

  // Slot toggles
  showLeftIcon?: boolean;    // Square 20×20 leading icon
  showRightIcon?: boolean;   // Square 20×20 trailing icon
  showCheckbox?: boolean;    // Leading 20×20 checkbox (checked when state=Selected)

  brand?: Brand;
}

// ─── Icon helpers — match the "Union" picture-frame icon used across Figma ───
function UnionIcon({ color }: { color: string }) {
  // 16×16 icon inside a 20×20 container (per Figma's icon slots)
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect
        x="1.75"
        y="2.5"
        width="12.5"
        height="11"
        rx="1.25"
        stroke={color}
        strokeWidth="1.3"
      />
      <circle cx="5.75" cy="6.5" r="1.25" stroke={color} strokeWidth="1.2" />
      <path
        d="M2.5 12.5l3.5-3.5 2.5 2.5 2-2 3 3"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2.75 7.25l2.75 2.75 5.75-6"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Checkbox({
  checked,
  disabled,
  fillColor,
  borderColor,
}: {
  checked: boolean;
  disabled: boolean;
  fillColor: string;
  borderColor: string;
}) {
  if (checked) {
    return (
      <div
        aria-hidden="true"
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '2.667px',
          backgroundColor: fillColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <CheckIcon color="#ffffff" />
      </div>
    );
  }
  return (
    <div
      aria-hidden="true"
      style={{
        width: '20px',
        height: '20px',
        borderRadius: '4px',
        border: `1px solid ${borderColor}`,
        backgroundColor: 'transparent',
        flexShrink: 0,
        boxSizing: 'border-box',
        opacity: disabled ? 0.5 : 1,
      }}
    />
  );
}

function FlagPlaceholder({ disabled }: { disabled: boolean }) {
  // 22×22 rounded rectangle — Figma renders each country with a real flag;
  // in docs we show a neutral placeholder with the ISO country-code pattern.
  return (
    <div
      aria-hidden="true"
      style={{
        width: '22px',
        height: '22px',
        borderRadius: '3.438px',
        overflow: 'hidden',
        flexShrink: 0,
        position: 'relative',
        background:
          'linear-gradient(180deg,#012169 33.33%,#ffffff 33.33%,#ffffff 66.66%,#c8102e 66.66%)',
        opacity: disabled ? 0.5 : 1,
        border: '0.5px solid rgba(0,0,0,0.08)',
      }}
    />
  );
}

function ContinentsIcon({ color, disabled }: { color: string; disabled: boolean }) {
  // 22×22 globe / continents icon (Figma uses an 18×18 picture with world mask)
  return (
    <div
      aria-hidden="true"
      style={{
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        border: `1px solid ${color}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="5.5" stroke={color} strokeWidth="1.1" />
        <path
          d="M7 1.5c1.8 1.5 2.6 3.7 2.6 5.5S8.8 11 7 12.5M7 1.5C5.2 3 4.4 5.2 4.4 7s.8 4 2.6 5.5M1.5 7h11"
          stroke={color}
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// ─── Icon / checkbox tile (20×20 wrapper) ───────────────────────────────────
function IconTile({ color }: { color: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <UnionIcon color={color} />
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────
export function ListItemLive({
  type = 'Single',
  itemStyle = 'Not Interactive',
  state = 'Default',
  titleText = 'Title Text Link',
  subtitleText = 'Subtitle Text',
  subtitleText2 = 'Subtitle Text',
  rightTitleText = 'Title Text Link',
  rightSubtitleText = 'Subtitle Text',
  countryName = 'Country',
  regionName = 'Region',
  trailingText = 'Subtitle Text',
  showLeftIcon = false,
  showRightIcon = false,
  showCheckbox = false,
  brand: _brand = 'dragonpass',
}: ListItemLiveProps) {
  // ── Token palette (hex fallbacks map to Figma's default dragonpass values)
  const surface         = 'var(--atom-background-primary-bg-primary-inverse, #ffffff)';
  const surfaceSecondary= 'var(--atom-background-core-bg-secondary, #faf8f7)';
  const surfaceHover    = 'var(--atom-background-core-bg-secondary-hover, rgba(10,35,51,0.04))';
  const surfaceDisabled = 'var(--atom-background-primary-bg-primary-disabled-inverse, #faf8f7)';
  const borderDefault   = 'var(--atom-border-default-border-default, #cdcbcb)';
  const borderDivider   = 'var(--atom-border-default-border-divider, #cdcbcb)';
  const borderHover     = 'var(--atom-border-states-border-hover, #045477)';
  const borderSelected  = 'var(--atom-border-selection-and-focus-border-selected, #0a2333)';
  const borderDisabled  = 'var(--atom-border-states-border-disabled, #cdcbcb)';
  const fgBrandPrimary  = 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)';
  const fgPrimary       = 'var(--atom-foreground-core-fg-primary, #4b4a4a)';
  const fgDisabled      = 'var(--atom-foreground-states-fg-disabled, #91908f)';
  const bgPressed       = 'var(--atom-background-primary-bg-primary-pressed, #063e56)';
  const fontFamily      = 'var(--atom-font-body, "Poppins", system-ui, sans-serif)';

  const isInteractive = itemStyle === 'Interactive';
  const isDisabled    = state === 'Disabled';
  const isSelected    = state === 'Selected';
  const isFocused     = state === 'Focused';
  const isHover       = state === 'Hover';

  // ── Per-state colour resolution ─────────────────────────────────────────
  // Title colour: fg-brand-primary default, fg-primary on hover, fg-disabled when disabled
  const titleColor = isDisabled
    ? fgDisabled
    : isHover
      ? fgPrimary
      : fgBrandPrimary;
  const subtitleColor = isDisabled ? fgDisabled : fgPrimary;
  const iconColor     = isDisabled ? fgDisabled : fgPrimary;

  // ── Container bg / border / outline per state (for Single / Single+Desc)
  let containerBg: string;
  let containerBorder: string;

  if (type === 'Single + Description') {
    // Always secondary (Figma uses bg-secondary), disabled dims slightly
    containerBg     = isDisabled ? surfaceDisabled : surfaceSecondary;
    containerBorder = isSelected ? borderSelected : isHover ? borderHover : isDisabled ? borderDisabled : borderDefault;
  } else {
    // Single / Country / Region / Group
    if (isDisabled) {
      containerBg     = surfaceDisabled;
      containerBorder = borderDisabled;
    } else if (isSelected) {
      containerBg     = surface;
      containerBorder = borderSelected;
    } else if (isHover) {
      containerBg     = surfaceHover;
      containerBorder = borderHover;
    } else {
      containerBg     = surface;
      containerBorder = borderDefault;
    }
  }

  // ── Typography ──────────────────────────────────────────────────────────
  const titleStyle: React.CSSProperties = {
    fontFamily,
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
    color: titleColor,
    margin: 0,
  };
  const subtitleStyle: React.CSSProperties = {
    fontFamily,
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '18px',
    color: subtitleColor,
    margin: 0,
  };

  // ── Focus ring: 2px #0A2333 outer with -3px inset (rendered via absolute wrapper)
  const focusRingStyle: React.CSSProperties = isFocused
    ? {
        position: 'absolute',
        inset: '-3px',
        borderRadius: '10px',
        border: `2px solid ${fgBrandPrimary}`,
        pointerEvents: 'none',
      }
    : {};

  // ─── Type: Stacked ────────────────────────────────────────────────────
  if (type === 'Stacked') {
    // Flush row — no container fill/border. Optional focus ring renders at row level.
    const stackedRow = (
      <div
        style={{
          fontFamily,
          width: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          padding: '0 0 16px',
          borderBottom: `1px solid ${borderDivider}`,
          opacity: isDisabled ? 0.7 : 1,
          gap: '8px',
          backgroundColor: isHover ? surfaceHover : isSelected ? surface : 'transparent',
          position: 'relative',
          cursor: isInteractive && !isDisabled ? 'pointer' : 'default',
        }}
      >
        {/* contentLeft */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            paddingRight: '8px',
          }}
        >
          {showCheckbox && (
            <Checkbox
              checked={isSelected}
              disabled={isDisabled}
              fillColor={bgPressed}
              borderColor={borderDefault}
            />
          )}
          {showLeftIcon && <IconTile color={iconColor} />}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
            <span style={titleStyle}>{titleText}</span>
            <span style={subtitleStyle}>{subtitleText}</span>
          </div>
        </div>

        {/* contentRight */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
            <span style={titleStyle}>{rightTitleText}</span>
            <span style={subtitleStyle}>{rightSubtitleText}</span>
          </div>
          {showRightIcon && <IconTile color={iconColor} />}
        </div>

        {isFocused && <span style={focusRingStyle} />}
      </div>
    );
    // Wrap in a 634px max-width container so the preview canvas is consistent.
    return <div style={{ width: '100%', maxWidth: '634px', position: 'relative' }}>{stackedRow}</div>;
  }

  // ─── Type: Country / Region ───────────────────────────────────────────
  if (type === 'Country' || type === 'Region') {
    return (
      <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
        <div
          style={{
            fontFamily,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '16px',
            gap: '8px',
            backgroundColor: containerBg,
            border: `1px solid ${containerBorder}`,
            borderRadius: '8px',
            boxSizing: 'border-box',
            cursor: isInteractive && !isDisabled ? 'pointer' : 'default',
            position: 'relative',
          }}
        >
          <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '8px' }}>
            {type === 'Country'
              ? <FlagPlaceholder disabled={isDisabled} />
              : <ContinentsIcon color={iconColor} disabled={isDisabled} />}
            <span style={{ ...subtitleStyle, color: subtitleColor }}>
              {type === 'Country' ? countryName : regionName}
            </span>
          </div>
          <span style={{ ...subtitleStyle, color: subtitleColor, flexShrink: 0 }}>{trailingText}</span>
        </div>
        {isFocused && <span style={focusRingStyle} />}
      </div>
    );
  }

  // ─── Type: Group (wrapper around 4 stacked rows) ─────────────────────
  if (type === 'Group') {
    const groupRows = [
      { t: 'Title Text Link',   s: 'Subtitle Text' },
      { t: 'Title Text Link',   s: 'Subtitle Text' },
      { t: 'Title Text Link',   s: 'Subtitle Text' },
      { t: 'Title Text Link',   s: 'Subtitle Text' },
    ];
    return (
      <div
        style={{
          fontFamily,
          width: '100%',
          maxWidth: '634px',
          padding: '16px',
          backgroundColor: surface,
          border: `1px solid ${borderDefault}`,
          borderRadius: '8px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {groupRows.map((r, i) => {
          const isLast = i === groupRows.length - 1;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                padding: isLast ? 0 : '0 0 16px',
                borderBottom: isLast ? 'none' : `1px solid ${borderDivider}`,
                gap: '8px',
              }}
            >
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                <span style={titleStyle}>{r.t}</span>
                <span style={subtitleStyle}>{r.s}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', flexShrink: 0 }}>
                <span style={titleStyle}>{r.t}</span>
                <span style={subtitleStyle}>{r.s}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ─── Type: Single + Description ───────────────────────────────────────
  if (type === 'Single + Description') {
    return (
      <div style={{ position: 'relative', width: '100%', maxWidth: '606px' }}>
        <div
          style={{
            fontFamily,
            width: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            padding: '16px',
            gap: '8px',
            backgroundColor: containerBg,
            border: `1px solid ${containerBorder}`,
            borderRadius: '8px',
            boxSizing: 'border-box',
            cursor: isInteractive && !isDisabled ? 'pointer' : 'default',
            position: 'relative',
          }}
        >
          {/* leading icon (optional) */}
          {showLeftIcon && <IconTile color={iconColor} />}

          {/* vertical content area */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* content-top: title + subtitle + bottom divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                paddingBottom: '12px',
                borderBottom: `1px solid ${borderDivider}`,
                gap: '8px',
              }}
            >
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                <span style={titleStyle}>{titleText}</span>
                <span style={subtitleStyle}>{subtitleText}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', flexShrink: 0 }}>
                <span style={titleStyle}>{rightTitleText}</span>
                <span style={subtitleStyle}>{rightSubtitleText}</span>
              </div>
            </div>

            {/* content-bottom: icon + description */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconTile color={iconColor} />
              <span style={subtitleStyle}>{subtitleText2}</span>
            </div>
          </div>

          {/* trailing icon (optional) */}
          {showRightIcon && <IconTile color={iconColor} />}
        </div>
        {isFocused && <span style={focusRingStyle} />}
      </div>
    );
  }

  // ─── Type: Single (default) ───────────────────────────────────────────
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '634px' }}>
      <div
        style={{
          fontFamily,
          width: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          padding: '16px',
          gap: '8px',
          backgroundColor: containerBg,
          border: `1px solid ${containerBorder}`,
          borderRadius: '8px',
          boxSizing: 'border-box',
          cursor: isInteractive && !isDisabled ? 'pointer' : 'default',
          position: 'relative',
        }}
      >
        {/* contentLeft */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            paddingRight: '8px',
          }}
        >
          {showCheckbox && (
            <Checkbox
              checked={isSelected}
              disabled={isDisabled}
              fillColor={bgPressed}
              borderColor={borderDefault}
            />
          )}
          {showLeftIcon && <IconTile color={iconColor} />}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
            <span style={titleStyle}>{titleText}</span>
            <span style={subtitleStyle}>{subtitleText}</span>
          </div>
        </div>

        {/* contentRight */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
            <span style={titleStyle}>{rightTitleText}</span>
            <span style={subtitleStyle}>{rightSubtitleText}</span>
          </div>
          {showRightIcon && <IconTile color={iconColor} />}
        </div>
      </div>
      {isFocused && <span style={focusRingStyle} />}
    </div>
  );
}
