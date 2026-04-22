import { useState } from 'react';
import { type Brand } from '../../data/tokens';

export type QuantityStepperSize = 'Small' | 'Default' | 'Large';
export type QuantityStepperStyle = '1' | '2';

interface QuantityStepperLiveProps {
  size?: QuantityStepperSize;
  stepperStyle?: QuantityStepperStyle;
  defaultValue?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  showLabel?: boolean;
  labelText?: string;
  brand?: Brand;
}

const SIZE_MAP: Record<QuantityStepperSize, { h: string; btn: string; fontSize: string; gap: string }> = {
  Small: { h: '28px', btn: '28px', fontSize: '12px', gap: '4px' },
  Default: { h: '36px', btn: '36px', fontSize: '14px', gap: '6px' },
  Large: { h: '44px', btn: '44px', fontSize: '15px', gap: '8px' },
};

export function QuantityStepperLive({
  size = 'Default',
  stepperStyle = '1',
  defaultValue = 1,
  min = 0,
  max = 99,
  disabled = false,
  showLabel = false,
  labelText = 'Quantity',
  brand: _brand = 'dragonpass',
}: QuantityStepperLiveProps) {
  const [value, setValue] = useState(defaultValue);
  const dims = SIZE_MAP[size];

  const fontFamily = 'var(--atom-font-body, Poppins, sans-serif)';
  const fgColor = 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)';
  const labelColor = 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)';
  const borderColor = 'var(--atom-border-default-border-default, #cdcbcb)';
  const bg = 'var(--atom-background-primary-bg-primary-inverse, #ffffff)';
  const btnBgAttached = 'var(--atom-background-core-bg-muted, #f5f5f4)';

  const canDec = !disabled && value > min;
  const canInc = !disabled && value < max;

  const button = (label: string, onClick: () => void, canClick: boolean, ariaLabel: string) => (
    <button
      type="button"
      onClick={canClick ? onClick : undefined}
      aria-label={ariaLabel}
      disabled={!canClick}
      style={{
        width: dims.btn,
        height: dims.h,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: stepperStyle === '1' ? btnBgAttached : bg,
        color: fgColor,
        fontFamily,
        fontSize: dims.fontSize,
        fontWeight: 600,
        border: `1px solid ${borderColor}`,
        borderRadius: stepperStyle === '1' ? 0 : '8px',
        cursor: canClick ? 'pointer' : 'not-allowed',
        opacity: canClick ? 1 : 0.4,
        padding: 0,
      }}
    >
      {label}
    </button>
  );

  const decBtn = button('−', () => setValue((v) => Math.max(min, v - 1)), canDec, 'Decrease');
  const incBtn = button('+', () => setValue((v) => Math.min(max, v + 1)), canInc, 'Increase');

  if (stepperStyle === '1') {
    return (
      <div style={{ fontFamily, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {showLabel && (
          <label style={{ fontSize: '12px', fontWeight: 500, color: labelColor }}>{labelText}</label>
        )}
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          <div
            style={{
              borderTopLeftRadius: '8px',
              borderBottomLeftRadius: '8px',
              overflow: 'hidden',
            }}
          >
            {decBtn}
          </div>
          <div
            style={{
              minWidth: '40px',
              height: dims.h,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: bg,
              color: fgColor,
              fontFamily,
              fontSize: dims.fontSize,
              fontWeight: 600,
              borderTop: `1px solid ${borderColor}`,
              borderBottom: `1px solid ${borderColor}`,
              marginLeft: '-1px',
            }}
          >
            {value}
          </div>
          <div
            style={{
              borderTopRightRadius: '8px',
              borderBottomRightRadius: '8px',
              overflow: 'hidden',
              marginLeft: '-1px',
            }}
          >
            {incBtn}
          </div>
        </div>
      </div>
    );
  }

  // Split variant
  return (
    <div style={{ fontFamily, display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {showLabel && (
        <label style={{ fontSize: '12px', fontWeight: 500, color: labelColor }}>{labelText}</label>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: dims.gap }}>
        {decBtn}
        <div
          style={{
            minWidth: '40px',
            height: dims.h,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bg,
            color: fgColor,
            fontFamily,
            fontSize: dims.fontSize,
            fontWeight: 600,
            border: `1px solid ${borderColor}`,
            borderRadius: '8px',
            padding: '0 10px',
          }}
        >
          {value}
        </div>
        {incBtn}
      </div>
    </div>
  );
}
