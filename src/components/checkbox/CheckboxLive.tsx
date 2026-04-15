import { type Brand } from '../../data/tokens';

export type CheckboxType = 'Multi Checkbox' | 'Single Checkbox' | 'Radio Button';
export type CheckboxState = 'Default' | 'Disabled';

interface CheckboxLiveProps {
  type?: CheckboxType;
  state?: CheckboxState;
  checked?: boolean;
  label?: string;
  brand?: Brand;
}

function CheckmarkIcon() {
  return (
    <svg width="12" height="9" viewBox="0 0 12 9" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckboxLive({
  type = 'Multi Checkbox',
  state = 'Default',
  checked = false,
  label = 'Checkbox label',
  brand: _brand = 'dragonpass',
}: CheckboxLiveProps) {
  const isDisabled = state === 'Disabled';
  const isRadio = type === 'Radio Button';
  const isCircle = type === 'Single Checkbox' || type === 'Radio Button';

  // ── Control visual ────────────────────────────────────────────────────────
  let control: React.ReactNode;

  if (isRadio) {
    // Radio: outer ring + optional inner dot
    const borderColor = isDisabled
      ? 'var(--atom-border-states-border-disabled, rgb(205,203,203))'
      : checked
        ? 'var(--atom-border-default-border-default-brand, rgb(10,35,51))'
        : 'var(--atom-border-default-border-default, rgb(205,203,203))';
    const innerColor = isDisabled
      ? 'var(--atom-foreground-states-fg-disabled, rgb(145,144,143))'
      : 'var(--atom-background-primary-bg-primary-pressed, rgb(6,62,86))';

    control = (
      <div style={{
        width: 20, height: 20, borderRadius: 999, flexShrink: 0,
        border: `1.5px solid ${borderColor}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'transparent',
        transition: 'border-color 0.15s ease',
      }}>
        {checked && (
          <div style={{
            width: 10, height: 10, borderRadius: 999,
            backgroundColor: innerColor,
            transition: 'background-color 0.15s ease',
          }} />
        )}
      </div>
    );
  } else {
    // Multi Checkbox / Single Checkbox
    const radius = isCircle ? 999 : 4;
    if (checked) {
      const bg = isDisabled
        ? 'var(--atom-background-primary-bg-primary-disabled, rgb(235,233,232))'
        : 'var(--atom-background-primary-bg-primary-pressed, rgb(6,62,86))';
      control = (
        <div style={{
          width: 20, height: 20, borderRadius: isCircle ? 999 : 3, flexShrink: 0,
          backgroundColor: bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background-color 0.15s ease',
        }}>
          <CheckmarkIcon />
        </div>
      );
    } else {
      const borderColor = isDisabled
        ? 'var(--atom-border-states-border-disabled, rgb(205,203,203))'
        : 'var(--atom-border-default-border-default, rgb(205,203,203))';
      control = (
        <div style={{
          width: 20, height: 20, borderRadius: radius, flexShrink: 0,
          border: `1.5px solid ${borderColor}`,
          backgroundColor: 'transparent',
          transition: 'border-color 0.15s ease',
        }} />
      );
    }
  }

  return (
    <label style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      userSelect: 'none',
      fontFamily: 'var(--atom-font-body, system-ui, sans-serif)',
    }}>
      <input
        type={isRadio ? 'radio' : 'checkbox'}
        checked={checked}
        disabled={isDisabled}
        readOnly
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
        aria-hidden="true"
      />
      {control}
      {label && (
        <span style={{
          fontSize: '14px',
          fontWeight: 400,
          lineHeight: '20px',
          color: 'var(--atom-foreground-core-fg-primary, #111827)',
          opacity: isDisabled ? 0.4 : 1,
          transition: 'opacity 0.15s ease',
        }}>
          {label}
        </span>
      )}
    </label>
  );
}
