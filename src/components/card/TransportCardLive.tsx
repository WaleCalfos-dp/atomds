import { type Brand } from '../../data/tokens';

// ─── Public types ─────────────────────────────────────────────────────────────
// Mapped 1:1 to the Figma component set: Transport Cards (node 4908:8724).
export type TransportCardType = 'Info' | 'Selectable with price';
export type TransportCardState = 'Default' | 'Selected';
export type TransportCardBackground = 'Yes' | 'No';

// Six car illustrations live in the `_cars` Figma component set (node 4848:31146).
// Assets are downloaded to /public/cars/*.png so they're stable after MCP URLs expire.
export type TransportCarModel =
  | 'Economy'
  | 'Comfort Sedan'
  | 'Comfort Van / MPV'
  | 'Business Sedan'
  | 'Business Van / MPV'
  | 'First Class';

const CAR_IMAGE_SRC: Record<TransportCarModel, string> = {
  'Economy':             '/cars/economy.png',
  'Comfort Sedan':       '/cars/comfort-sedan.png',
  'Comfort Van / MPV':   '/cars/comfort-van.png',
  'Business Sedan':      '/cars/business-sedan.png',
  'Business Van / MPV':  '/cars/business-van.png',
  'First Class':         '/cars/first-class.png',
};

interface TransportCardLiveProps {
  type?: TransportCardType;
  state?: TransportCardState;
  backgroundFill?: TransportCardBackground;

  carType?: string;               // e.g. "Comfort Sedan" (display label)
  carModel?: TransportCarModel;   // which car illustration to render
  description1?: string;          // e.g. "Up to 3"
  description2?: string;          // e.g. "2 bags max"
  price1Text?: string;            // strike-through price
  price2Text?: string;            // effective price

  showInformation?: boolean;
  showItem1?: boolean;
  showItem2?: boolean;
  showPrices?: boolean;
  showPrice1?: boolean;
  showPrice2?: boolean;
  showRadio?: boolean;
  showCarImage?: boolean;

  brand?: Brand;
  onSelect?: () => void;
}

// ─── Inline icons (Figma: 16px inside a 20px hit-box) ─────────────────────────
function IconUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 8a3 3 0 100-6 3 3 0 000 6zM2.5 14a5.5 5.5 0 0111 0"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBag() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 5.5h10l-.7 7.2a1.5 1.5 0 01-1.5 1.3H5.2a1.5 1.5 0 01-1.5-1.3L3 5.5zM5.5 5.5V4a2.5 2.5 0 015 0v1.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Render the Figma car illustration (exported PNG, 215×215 source, drawn at 48×48).
function CarImage({ model, label }: { model: TransportCarModel; label: string }) {
  return (
    <img
      src={CAR_IMAGE_SRC[model]}
      alt={label}
      width={48}
      height={48}
      style={{
        width: '48px',
        height: '48px',
        objectFit: 'contain',
        display: 'block',
        pointerEvents: 'none',
      }}
      draggable={false}
    />
  );
}

// ─── Radio button (matches Figma Checkbox type=Radio Button) ──────────────────
function RadioDot({ checked }: { checked: boolean }) {
  const border = 'var(--atom-border-default-border-default, #CDCBCB)';
  const brand = 'var(--atom-background-primary-bg-primary-default, #0A2333)';
  return (
    <span
      role="radio"
      aria-checked={checked}
      style={{
        width: '20px',
        height: '20px',
        borderRadius: '999px',
        border: checked ? `1px solid ${brand}` : `1px solid ${border}`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        backgroundColor: 'transparent',
        transition: 'border-color 0.15s ease',
      }}
    >
      {checked && (
        <span
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '999px',
            backgroundColor: brand,
            display: 'inline-block',
          }}
        />
      )}
    </span>
  );
}

// ─── TransportCardLive ────────────────────────────────────────────────────────
export function TransportCardLive({
  type = 'Info',
  state = 'Default',
  backgroundFill = 'No',
  carType = 'Comfort Sedan',
  carModel = 'Comfort Sedan',
  description1 = 'Up to 3',
  description2 = '2 bags max',
  price1Text = '$60.00',
  price2Text = '$40.00',
  showInformation = true,
  showItem1 = true,
  showItem2 = true,
  showPrices = true,
  showPrice1 = true,
  showPrice2 = true,
  showRadio = true,
  showCarImage = true,
  brand: _brand = 'dragonpass',
  onSelect,
}: TransportCardLiveProps) {
  // ── Token palette ────────────────────────────────────────────────────────
  const fontFamily   = 'var(--atom-font-body, "Poppins", system-ui, sans-serif)';
  const surface      = 'var(--atom-background-primary-bg-primary-inverse, #ffffff)';
  const borderDef    = 'var(--atom-border-default-border-default, #CDCBCB)';
  const borderBrand  = 'var(--atom-border-default-border-default-brand, #0A2333)';
  const titleColor   = 'var(--atom-foreground-primary-fg-brand-primary, #0A2333)';
  const bodyColor    = 'var(--atom-foreground-core-fg-primary, #4B4A4A)';
  const errorColor   = 'var(--atom-foreground-feedback-fg-error, #E02D3C)';

  const isSelectable = type === 'Selectable with price';
  const isSelected = isSelectable && state === 'Selected';
  const hasFill = backgroundFill === 'Yes';
  const activeBorder = isSelected ? borderBrand : borderDef;

  // Heights measured directly from the Figma SVG exports:
  //   Info / No fill      → 64px (bottom rule only)
  //   Info / Yes fill     → 80px (full card, 8px radius, 16px padding)
  //   Select / No fill    → 92px
  //   Select / Yes fill   → 108px (same card, taller because price row is present)
  // We let content drive height; the padding + border recipe matches Figma math.

  const outerStyle: React.CSSProperties = hasFill
    ? {
        width: '327px',
        padding: '16px',
        backgroundColor: surface,
        border: `1px solid ${activeBorder}`,
        borderRadius: '8px',
        boxSizing: 'border-box',
        fontFamily,
        cursor: isSelectable ? 'pointer' : undefined,
        transition: 'border-color 0.15s ease',
      }
    : {
        width: '327px',
        paddingBottom: '16px',
        borderBottom: `1px solid ${activeBorder}`,
        backgroundColor: 'transparent',
        boxSizing: 'border-box',
        fontFamily,
        cursor: isSelectable ? 'pointer' : undefined,
        transition: 'border-color 0.15s ease',
      };

  // ── Information chips (user icon + text, bag icon + text) ───────────────
  function InformationRow() {
    if (!showInformation) return null;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        {showItem1 && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
            <span style={{ width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: titleColor, flexShrink: 0 }}>
              <IconUser />
            </span>
            <span style={{ fontSize: '12px', lineHeight: '18px', color: bodyColor, fontWeight: 400, whiteSpace: 'nowrap' }}>
              {description1}
            </span>
          </span>
        )}
        {showItem2 && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
            <span style={{ width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: titleColor, flexShrink: 0 }}>
              <IconBag />
            </span>
            <span style={{ fontSize: '12px', lineHeight: '18px', color: bodyColor, fontWeight: 400, whiteSpace: 'nowrap' }}>
              {description2}
            </span>
          </span>
        )}
      </div>
    );
  }

  // ── Price row (strike + effective) ────────────────────────────────────────
  function PriceRow() {
    if (!showPrices) return null;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {showPrice1 && (
          <span
            style={{
              fontSize: '14px',
              lineHeight: '20px',
              fontWeight: 500,
              color: errorColor,
              textDecoration: 'line-through',
            }}
          >
            {price1Text}
          </span>
        )}
        {showPrice2 && (
          <span
            style={{
              fontSize: '14px',
              lineHeight: '20px',
              fontWeight: 500,
              color: bodyColor,
            }}
          >
            {price2Text}
          </span>
        )}
      </div>
    );
  }

  // ── Title ────────────────────────────────────────────────────────────────
  const titleNode = (
    <span
      style={{
        fontSize: '14px',
        lineHeight: '20px',
        fontWeight: 500,
        color: titleColor,
        whiteSpace: 'nowrap',
      }}
    >
      {carType}
    </span>
  );

  // ── Left column ──────────────────────────────────────────────────────────
  // Figma (node 4908:8724): the "Left" wrapper is 247px wide, items-start, 8px gap,
  // pr-8. For Info it flex-col (title stacked above Information row); for
  // Selectable with price it's row (radio + inner column of title/info/prices).
  const leftColumn =
    type === 'Info' ? (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '8px',
          paddingRight: '8px',
          width: '247px',
          flexShrink: 0,
        }}
      >
        {titleNode}
        <InformationRow />
      </div>
    ) : (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: '8px',
          paddingRight: '8px',
          width: '247px',
          flexShrink: 0,
        }}
      >
        {showRadio && <RadioDot checked={isSelected} />}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 }}>
          {titleNode}
          <InformationRow />
          <PriceRow />
        </div>
      </div>
    );

  // ── Car image (48×48) ────────────────────────────────────────────────────
  const carNode = showCarImage ? (
    <div
      style={{
        width: '48px',
        height: '48px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CarImage model={carModel} label={carType} />
    </div>
  ) : null;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      role={isSelectable ? 'radio' : undefined}
      aria-checked={isSelectable ? isSelected : undefined}
      tabIndex={isSelectable ? 0 : undefined}
      onClick={isSelectable ? onSelect : undefined}
      onKeyDown={
        isSelectable
          ? (e) => {
              if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onSelect();
              }
            }
          : undefined
      }
      style={outerStyle}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          width: '100%',
        }}
      >
        {leftColumn}
        {carNode}
      </div>
    </div>
  );
}
