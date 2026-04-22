import { useState } from 'react';
import { type Brand } from '../../data/tokens';

export type SelectType = 'Single' | 'Multiple Choice';
export type SelectState = 'Default' | 'Error' | 'Disabled';
export type SelectStatus = 'Close' | 'Open' | 'Single';

interface SelectLiveProps {
  selectType?: SelectType;
  state?: SelectState;
  status?: SelectStatus;
  showLabel?: boolean;
  labelText?: string;
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
  helperText?: string;
  brand?: Brand;
}

const DIMS = { height: '40px', padX: '12px', fontSize: '13px' };

function ChevronDown({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3.5 5L7 8.5L10.5 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SelectLive({
  selectType = 'Single',
  state = 'Default',
  status = 'Close',
  showLabel = true,
  labelText = 'Label',
  placeholder = 'Select an option',
  options = ['Option one', 'Option two', 'Option three', 'Option four'],
  defaultValue,
  helperText,
  brand: _brand = 'dragonpass',
}: SelectLiveProps) {
  const isOpen = status === 'Open';
  const [value, setValue] = useState<string | undefined>(defaultValue);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const dims = DIMS;
  const fontFamily = 'var(--atom-font-body, Poppins, sans-serif)';
  const labelColor = 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)';
  const fgColor = 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)';
  const placeholderColor = 'var(--atom-foreground-core-fg-secondary, #737272)';
  const borderColor =
    state === 'Error'
      ? 'var(--atom-border-alert-border-error, #e02d3c)'
      : 'var(--atom-border-default-border-default, #cdcbcb)';
  const bgColor =
    state === 'Disabled'
      ? 'var(--atom-background-core-bg-muted, #f5f5f4)'
      : 'var(--atom-background-primary-bg-primary-inverse, #ffffff)';
  const helperColor =
    state === 'Error'
      ? 'var(--atom-foreground-alert-fg-error, #e02d3c)'
      : 'var(--atom-foreground-core-fg-secondary, #737272)';
  const menuBg = 'var(--atom-background-primary-bg-primary-inverse, #ffffff)';
  const menuHover = 'var(--atom-background-core-bg-muted, #f5f5f4)';
  const activeBg = 'var(--atom-background-primary-bg-primary-pressed-brand, #0a2333)';
  const mutedBorder = 'var(--atom-border-default-border-default, #cdcbcb)';

  return (
    <div style={{ fontFamily, width: '260px', position: 'relative' }}>
      {showLabel && (
        <label
          style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 500,
            color: labelColor,
            marginBottom: '6px',
          }}
        >
          {labelText}
        </label>
      )}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={state === 'Disabled'}
        style={{
          width: '100%',
          height: dims.height,
          padding: `0 ${dims.padX}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          backgroundColor: bgColor,
          border: `1px solid ${borderColor}`,
          borderRadius: '8px',
          fontFamily,
          fontSize: dims.fontSize,
          color: value ? fgColor : placeholderColor,
          cursor: state === 'Disabled' ? 'not-allowed' : 'pointer',
          opacity: state === 'Disabled' ? 0.6 : 1,
          textAlign: 'left',
        }}
      >
        <span>
          {selectType === 'Multiple Choice' && selected.size > 0
            ? `${selected.size} selected`
            : value ?? placeholder}
        </span>
        <ChevronDown color={placeholderColor} />
      </button>
      {helperText && (
        <p
          style={{
            margin: '4px 0 0',
            fontSize: '11px',
            color: helperColor,
            lineHeight: 1.4,
          }}
        >
          {helperText}
        </p>
      )}
      {isOpen && state !== 'Disabled' && (
        <ul
          role="listbox"
          style={{
            position: 'absolute',
            top: `calc(${showLabel ? '24px' : '0px'} + ${dims.height} + 4px)`,
            left: 0,
            right: 0,
            margin: 0,
            padding: '4px',
            listStyle: 'none',
            backgroundColor: menuBg,
            border: `1px solid ${borderColor}`,
            borderRadius: '8px',
            boxShadow: '0 6px 20px rgba(10,35,51,0.12), 0 2px 6px rgba(10,35,51,0.08)',
            zIndex: 10,
            maxHeight: '220px',
            overflowY: 'auto',
          }}
        >
          {options.map((opt) => {
            const isSelected = selectType === 'Multiple Choice'
              ? selected.has(opt)
              : value === opt;
            return (
              <li key={opt} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    if (selectType === 'Multiple Choice') {
                      setSelected((prev) => {
                        const next = new Set(prev);
                        if (next.has(opt)) next.delete(opt); else next.add(opt);
                        return next;
                      });
                    } else {
                      setValue(opt);
                    }
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = menuHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textAlign: 'left',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    fontFamily,
                    fontSize: dims.fontSize,
                    color: fgColor,
                    fontWeight: isSelected ? 600 : 400,
                    cursor: 'pointer',
                  }}
                >
                  {selectType === 'Multiple Choice' && (
                    <span
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '3px',
                        border: `1.5px solid ${isSelected ? activeBg : mutedBorder}`,
                        backgroundColor: isSelected ? activeBg : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {isSelected && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                          <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                  )}
                  {opt}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
