import { type Brand } from '../../data/tokens';

export type DividerStyle = 'Solid' | 'Dashed';

interface DividerLiveProps {
  style?: DividerStyle;
  brand?: Brand;
}

export function DividerLive({ style = 'Solid', brand: _brand = 'dragonpass' }: DividerLiveProps) {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      style={{
        width: '100%',
        height: 0,
        borderTop: style === 'Dashed'
          ? '1px dashed var(--atom-border-default-border-divider, rgb(205,203,203))'
          : '1px solid var(--atom-border-default-border-divider, rgb(205,203,203))',
        transition: 'border-style 0.15s ease',
      }}
    />
  );
}
