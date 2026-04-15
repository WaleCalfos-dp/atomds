import { type Brand } from '../../data/tokens';

export type TagState = 'Default' | 'Selected' | 'Disabled';

interface TagsLiveProps {
  state?: TagState;
  label?: string;
  showIconLeft?: boolean;
  brand?: Brand;
  onClick?: () => void;
}

const OUTLINE_PATH = 'M19.5 3H4.5C4.10218 3 3.72064 3.15804 3.43934 3.43934C3.15804 3.72064 3 4.10218 3 4.5V19.5C3 19.8978 3.15804 20.2794 3.43934 20.5607C3.72064 20.842 4.10218 21 4.5 21H19.5C19.8978 21 20.2794 20.842 20.5607 20.5607C20.842 20.2794 21 19.8978 21 19.5V4.5C21 4.10218 20.842 3.72064 20.5607 3.43934C20.2794 3.15804 19.8978 3 19.5 3ZM19.5 19.5H4.5V4.5H19.5V19.5Z';
const MC_SOLID_PATH = 'M19.0215 2.67676H4.02148C3.21783 2.67676 2.44694 3.00271 1.87807 3.5813C1.30921 4.15989 0.990234 4.94283 0.990234 5.75879V18.2412C0.990234 19.0572 1.30921 19.8401 1.87807 20.4187C2.44694 20.9973 3.21783 21.3232 4.02148 21.3232H19.0215C19.8251 21.3232 20.596 20.9973 21.1649 20.4187C21.7337 19.8401 22.0527 19.0572 22.0527 18.2412V5.75879C22.0527 4.94283 21.7337 4.15989 21.1649 3.5813C20.596 3.00271 19.8251 2.67676 19.0215 2.67676Z';
const BRAND_ICON_PATHS: Record<Brand, string> = {
  dragonpass: OUTLINE_PATH, investec: OUTLINE_PATH,
  mastercard: MC_SOLID_PATH, visa: OUTLINE_PATH,
  greyscale: OUTLINE_PATH, assurant: OUTLINE_PATH,
};

function PlaceholderIcon({ brand = 'dragonpass', size = 14 }: { brand?: Brand; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0, display: 'block' }}>
      <path d={BRAND_ICON_PATHS[brand]} fill="currentColor" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0, display: 'block' }}>
      <path d="M2 6L4.5 8.5L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TagsLive({
  state = 'Default',
  label = 'Label',
  showIconLeft = true,
  brand = 'dragonpass',
  onClick,
}: TagsLiveProps) {
  const isSelected = state === 'Selected';
  const isDisabled = state === 'Disabled';

  const containerBg = isSelected
    ? 'var(--atom-background-primary-bg-primary-pressed-brand, #0a2333)'
    : isDisabled
    ? 'var(--atom-background-primary-bg-primary-disabled-inverse, #faf8f7)'
    : 'var(--atom-background-primary-bg-primary-inverse, #ffffff)';

  const containerBorder = isSelected
    ? 'none'
    : isDisabled
    ? '1px solid var(--atom-border-states-border-disabled, #cdcbcb)'
    : '1px solid var(--atom-border-default-border-default, #cdcbcb)';

  const color = isSelected
    ? 'var(--atom-foreground-states-fg-pressed-inverse, #ffffff)'
    : isDisabled
    ? 'var(--atom-foreground-states-fg-disabled, #91908f)'
    : 'var(--atom-foreground-core-fg-primary, #4b4a4a)';

  return (
    <div
      role={onClick ? 'button' : undefined}
      onClick={() => !isDisabled && onClick?.()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        height: '32px',
        padding: '0 12px',
        borderRadius: '999px',
        backgroundColor: containerBg,
        border: containerBorder,
        cursor: isDisabled ? 'not-allowed' : onClick ? 'pointer' : 'default',
        transition: 'background-color 0.15s ease',
        boxSizing: 'border-box',
        userSelect: 'none',
        fontFamily: 'var(--atom-font-body, Poppins, sans-serif)',
        color,
      }}
    >
      {showIconLeft && <PlaceholderIcon brand={brand} size={14} />}
      <span style={{ fontSize: '12px', lineHeight: '18px', whiteSpace: 'nowrap' }}>
        {label}
      </span>
      {isSelected && <CheckIcon />}
    </div>
  );
}
