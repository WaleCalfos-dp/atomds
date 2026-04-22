import { type Brand } from '../../data/tokens';

export type QRCodeType = 'Light' | 'Dark';
export type QRCodeState = 'Success';

interface QRCodeLiveProps {
  type?: QRCodeType;
  state?: QRCodeState;
  showDescription?: boolean;
  showCounter?: boolean;
  nameText?: string;
  cardNumber?: string;
  descriptionText?: string;
  /** Seed string used to generate the faux QR pattern -- changes the pattern deterministically */
  seed?: string;
  brand?: Brand;
}

/** Deterministic 0/1 grid from a seed */
function generateGrid(seed: string, gridSize: number): boolean[][] {
  // Simple hash -> 32-bit number
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  const rng = () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return (h >>> 0) / 0xffffffff;
  };
  const grid: boolean[][] = [];
  for (let r = 0; r < gridSize; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < gridSize; c++) {
      row.push(rng() > 0.5);
    }
    grid.push(row);
  }
  // Force three corner position markers on
  const marker = (r0: number, c0: number) => {
    for (let dr = 0; dr < 7; dr++) {
      for (let dc = 0; dc < 7; dc++) {
        const r = r0 + dr;
        const c = c0 + dc;
        if (r >= gridSize || c >= gridSize) continue;
        const inner = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
        const edge = dr === 0 || dr === 6 || dc === 0 || dc === 6;
        grid[r][c] = edge || inner;
      }
    }
  };
  marker(0, 0);
  marker(0, gridSize - 7);
  marker(gridSize - 7, 0);
  return grid;
}

export function QRCodeLive({
  type = 'Light',
  state: _state = 'Success',
  showDescription = false,
  showCounter: _showCounter = false,
  nameText = 'John Smith',
  cardNumber = '4565 6374 4176 0934',
  descriptionText = 'To install your eSIM, scan this QR code using',
  seed = 'atom-design-system',
  brand: _brand = 'dragonpass',
}: QRCodeLiveProps) {
  const px = 140;
  const gridSize = 21; // Version 1 QR style
  const grid = generateGrid(seed, gridSize);
  const cell = px / gridSize;

  const fontFamily = 'var(--atom-font-body, Poppins, sans-serif)';

  const isLight = type === 'Light';
  const bgColor = isLight
    ? 'var(--atom-background-primary-bg-primary-inverse, #ffffff)'
    : 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)';
  const fgColor = isLight
    ? 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)'
    : 'var(--atom-background-primary-bg-primary-inverse, #ffffff)';
  const borderColor = isLight
    ? 'var(--atom-border-default-border-default, #cdcbcb)'
    : 'transparent';
  const textColor = isLight
    ? 'var(--atom-foreground-core-fg-primary, #4b4a4a)'
    : 'var(--atom-background-primary-bg-primary-inverse, #ffffff)';
  const secondaryTextColor = isLight
    ? 'var(--atom-foreground-core-fg-secondary, #737272)'
    : 'rgba(255,255,255,0.7)';

  const svg = (
    <svg width={px} height={px} viewBox={`0 0 ${px} ${px}`} aria-label="QR code">
      <rect x="0" y="0" width={px} height={px} fill={isLight ? '#ffffff' : fgColor} rx="4" />
      {grid.map((row, r) =>
        row.map((on, c) =>
          on ? (
            <rect
              key={`${r}-${c}`}
              x={c * cell}
              y={r * cell}
              width={cell + 0.5}
              height={cell + 0.5}
              fill={isLight ? fgColor : bgColor}
            />
          ) : null,
        ),
      )}
    </svg>
  );

  return (
    <div
      style={{
        fontFamily,
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        padding: '20px',
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(10,35,51,0.08)',
      }}
    >
      {svg}

      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: textColor }}>{nameText}</span>
        <span style={{ fontSize: '12px', fontWeight: 400, color: secondaryTextColor, letterSpacing: '0.04em' }}>{cardNumber}</span>
      </div>

      {showDescription && (
        <span style={{ fontSize: '11px', fontWeight: 400, color: secondaryTextColor, textAlign: 'center', maxWidth: '200px', lineHeight: 1.4 }}>
          {descriptionText}
        </span>
      )}
    </div>
  );
}
