import { type Brand } from '../../data/tokens';

export type TileType = 'Country';

interface TilesLiveProps {
  tileType?: TileType;
  brand?: Brand;
}

export function TilesLive({
  tileType: _tileType = 'Country',
  brand: _brand = 'dragonpass',
}: TilesLiveProps) {
  const fontFamily = 'var(--atom-font-body, Poppins, sans-serif)';
  const fgColor = 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)';
  const borderColor = 'var(--atom-border-default-border-default, #cdcbcb)';
  const bg = 'var(--atom-background-primary-bg-primary-inverse, #ffffff)';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0',
        backgroundColor: bg,
        border: `1px solid ${borderColor}`,
        borderRadius: '8px',
        fontFamily,
        overflow: 'hidden',
      }}
    >
      <span
        style={{
          fontSize: '16px',
          lineHeight: 1,
          padding: '8px 8px 8px 12px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        &#x1F1E6;&#x1F1F1;
      </span>
      <span
        style={{
          fontSize: '13px',
          fontWeight: 500,
          color: fgColor,
          padding: '8px 12px 8px 4px',
          whiteSpace: 'nowrap',
        }}
      >
        Albania
      </span>
    </div>
  );
}
