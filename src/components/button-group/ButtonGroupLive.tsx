import { type Brand } from '../../data/tokens';

// ─── Public types ─────────────────────────────────────────────────────────────
// Aligned with the Figma component set: 15 permutations of Direction × Type × Background Fill.
// "Button Right" is a Sticky-Bottom-only variant where a label sits left and a single button sits right.
export type ButtonGroupDirection = 'Horizontal' | 'Vertical' | 'Button Right';
export type ButtonGroupType = 'General' | 'Sticky Bottom' | 'Sticky Bottom - eSIM' | 'Toast';
export type ButtonGroupBackground = 'Yes' | 'No';

interface ButtonGroupLiveProps {
  direction?: ButtonGroupDirection;
  groupType?: ButtonGroupType;
  background?: ButtonGroupBackground;
  /** Override the first (Primary) button label. */
  primaryLabel?: string;
  /** Override the second (Secondary) button label. */
  secondaryLabel?: string;
  /** Helper text above the buttons (Sticky Bottom - eSIM / Button Right). */
  helperText?: string;
  brand?: Brand;
}

// ─── Token-backed style values ────────────────────────────────────────────────
// Match the Figma fills: Primary #0A2333, Secondary stroke #0A2333, muted panel for bg-fill.
const COLORS = {
  primaryBg:   'var(--atom-background-primary-bg-primary-default, #0A2333)',
  primaryFg:   'var(--atom-foreground-primary-fg-brand-primary-inverse, #ffffff)',
  secondaryBg: 'var(--atom-background-primary-bg-primary-inverse, #ffffff)',
  secondaryFg: 'var(--atom-foreground-primary-fg-brand-primary, #0A2333)',
  borderBrand: 'var(--atom-border-default-border-default-brand, #0A2333)',
  surface:     'var(--atom-background-primary-bg-primary-inverse, #ffffff)',
  panelFill:   'var(--atom-background-core-bg-muted, #f5f5f4)',
  helperFg:    'var(--atom-foreground-core-fg-primary, #4B4A4A)',
};

// Pill buttons inside groups use Full Button Small dimensions per Figma (52px tall).
const BUTTON_HEIGHT = '52px';
const BUTTON_RADIUS = '999px';
const FONT_FAMILY = 'var(--atom-font-body, "Poppins", system-ui, sans-serif)';

// Container padding per Figma spec (px: top / right / bottom / left).
const CONTAINER_PADDING: Record<ButtonGroupType, string> = {
  'General':              '0',
  'Sticky Bottom':        '16px 24px 50px',   // 50px bottom accommodates iOS home-indicator safe-area
  'Sticky Bottom - eSIM': '50px 24px 24px',   // inverted: eSIM info sits above, buttons sit near bottom
  'Toast':                '9px 16px',         // compact for a toast footer
};

// Gap between buttons (Figma = 16px in every variant).
const BUTTON_GAP = '16px';

// ─── Small building block: a pill button matching Figma Full Button Small ─────
function GroupButton({
  label,
  variant,
  stretch,
}: {
  label: string;
  variant: 'Primary' | 'Secondary';
  stretch: boolean;
}) {
  const isPrimary = variant === 'Primary';
  return (
    <button
      type="button"
      style={{
        // Layout
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: stretch ? 1 : undefined,
        minWidth: 0,
        height: BUTTON_HEIGHT,
        paddingLeft: '20px',
        paddingRight: '20px',

        // Surface
        backgroundColor: isPrimary ? COLORS.primaryBg : COLORS.secondaryBg,
        color:           isPrimary ? COLORS.primaryFg : COLORS.secondaryFg,
        border:          isPrimary ? 'none' : `1px solid ${COLORS.borderBrand}`,
        borderRadius:    BUTTON_RADIUS,

        // Type
        fontFamily: FONT_FAMILY,
        fontSize: '14px',
        fontWeight: 600,
        lineHeight: '20px',

        cursor: 'pointer',
        outline: 'none',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        transition: 'filter 0.15s ease',
      }}
    >
      {label}
    </button>
  );
}

// ─── ButtonGroupLive ──────────────────────────────────────────────────────────
export function ButtonGroupLive({
  direction = 'Horizontal',
  groupType = 'General',
  background = 'No',
  primaryLabel = 'Button Label',
  secondaryLabel = 'Button Label',
  helperText = 'Helper or descriptive text',
  brand: _brand = 'dragonpass',
}: ButtonGroupLiveProps) {
  const hasBgFill = background === 'Yes';
  const isSticky  = groupType === 'Sticky Bottom' || groupType === 'Sticky Bottom - eSIM' || direction === 'Button Right';
  const isToast   = groupType === 'Toast';
  const isESIM    = groupType === 'Sticky Bottom - eSIM';
  const isButtonRight = direction === 'Button Right';

  // Container width — keep horizontal groups from collapsing when shown in a dotted preview.
  const containerWidth: string | undefined =
    groupType === 'Toast'          ? (direction === 'Vertical' ? '138px' : '242px') :
    groupType === 'General'        ? '350px' :
    isButtonRight                  ? '449px' :
    /* Sticky variants */            '419px';

  // Surface color — "Yes" uses the muted panel fill (Figma) otherwise transparent for General and white for Sticky.
  const surfaceColor =
    hasBgFill                              ? COLORS.panelFill :
    isSticky                               ? COLORS.surface   :
    /* General, No fill */                   'transparent';

  // Padding per group type
  const paddingValue = CONTAINER_PADDING[groupType];

  // Shared outer wrapper style
  const outerStyle: React.CSSProperties = {
    width: containerWidth,
    padding: paddingValue,
    backgroundColor: surfaceColor,
    borderRadius: isToast ? '12px' : '0',
    // Sticky Bottom groups show a top hairline when surface is white-on-white
    borderTop: isSticky && !hasBgFill
      ? `1px solid var(--atom-border-default-border-default, #cdcbcb)`
      : 'none',
    fontFamily: FONT_FAMILY,
    boxSizing: 'border-box',
  };

  // ── "Button Right" — helper text (left) + single Primary button (right) ─────
  if (isButtonRight) {
    return (
      <div style={outerStyle} role="group" aria-label="Button group">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: BUTTON_GAP,
          }}
        >
          <div style={{ flex: 1, minWidth: 0, color: COLORS.helperFg, fontSize: '14px', lineHeight: '20px' }}>
            <p style={{ margin: 0, fontWeight: 600, color: '#0A2333' }}>Title</p>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: COLORS.helperFg }}>{helperText}</p>
          </div>
          <GroupButton label={primaryLabel} variant="Primary" stretch={false} />
        </div>
      </div>
    );
  }

  // ── Vertical / Horizontal layout for General, Sticky Bottom, Toast, eSIM ────
  const isHorizontal = direction === 'Horizontal';

  // Toast = Secondary-then-Primary (right-aligned accept). Other types put Primary first.
  const buttons = (
    <div
      role="group"
      aria-label="Button group"
      style={{
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        alignItems: isHorizontal ? 'center' : 'stretch',
        gap: BUTTON_GAP,
        width: isHorizontal ? '100%' : undefined,
      }}
    >
      <GroupButton
        label={primaryLabel}
        variant={isToast ? 'Secondary' : 'Primary'}
        stretch={!isToast && isHorizontal}
      />
      <GroupButton
        label={secondaryLabel}
        variant={isToast ? 'Primary' : 'Secondary'}
        stretch={!isToast && isHorizontal}
      />
    </div>
  );

  return (
    <div style={outerStyle}>
      {isESIM && (
        <div style={{ marginBottom: '16px', color: COLORS.helperFg, fontSize: '12px', lineHeight: '18px' }}>
          <p style={{ margin: 0, fontWeight: 600, color: '#0A2333', fontSize: '14px' }}>eSIM plan</p>
          <p style={{ margin: '2px 0 0' }}>{helperText}</p>
        </div>
      )}
      {buttons}
    </div>
  );
}
