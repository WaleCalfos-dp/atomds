import { type Brand } from '../../data/tokens';

export type SwitchState = 'Default' | 'Focused' | 'Disabled';

interface SwitchLiveProps {
  on?: boolean;
  state?: SwitchState;
  label?: string;
  brand?: Brand;
  onChange?: (on: boolean) => void;
}

export function SwitchLive({
  on = false,
  state = 'Default',
  label,
  brand: _brand = 'dragonpass',
  onChange,
}: SwitchLiveProps) {
  const isDisabled = state === 'Disabled';
  const isFocused = state === 'Focused';

  const trackBg = isDisabled
    ? 'var(--atom-background-primary-bg-primary-disabled, #ebe9e8)'
    : on
    ? 'var(--atom-background-primary-bg-primary-pressed, #063e56)'
    : 'var(--atom-background-core-bg-muted, rgba(10,35,51,0.06))';

  const thumbBg = isDisabled
    ? 'var(--atom-foreground-states-fg-disabled-inverse, #ffffff)'
    : on
    ? 'var(--atom-foreground-primary-fg-brand-primary-inverse, #ffffff)'
    : 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)';

  const textColor = isDisabled
    ? 'var(--atom-foreground-states-fg-disabled, #91908f)'
    : on
    ? 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)'
    : 'var(--atom-foreground-core-fg-primary, #4b4a4a)';

  const focusRing = isFocused
    ? '0 0 0 2px var(--atom-border-selection-and-focus-border-selected, #0a2333)'
    : 'none';

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--atom-font-body, Poppins, sans-serif)' }}>
      <button
        role="switch"
        aria-checked={on}
        disabled={isDisabled}
        onClick={() => !isDisabled && onChange?.(!on)}
        aria-label={label || (on ? 'On' : 'Off')}
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          width: '48px',
          height: '24px',
          borderRadius: '999px',
          padding: '2px',
          backgroundColor: trackBg,
          border: 'none',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
          flexShrink: 0,
          outline: 'none',
          boxShadow: focusRing,
        }}
      >
        <div style={{
          position: 'absolute',
          top: '2px',
          left: on ? '26px' : '2px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: thumbBg,
          transition: 'left 0.2s ease, background-color 0.2s ease',
          flexShrink: 0,
        }} />
      </button>

      <span style={{ fontSize: '12px', color: textColor, userSelect: 'none', minWidth: '18px' }}>
        {on ? 'On' : 'Off'}
      </span>

      {label && (
        <span style={{ fontSize: '14px', color: textColor, userSelect: 'none' }}>
          {label}
        </span>
      )}
    </div>
  );
}
