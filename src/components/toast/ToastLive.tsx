import { type Brand } from '../../data/tokens';

export type ToastVariant = 'Error' | 'Success';

interface ToastLiveProps {
  variant?: ToastVariant;
  showIconLeft?: boolean;
  showCloseIcon?: boolean;
  text?: string;
  brand?: Brand;
}

function SuccessIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="7.5" stroke={color} strokeWidth="1.5" />
      <path d="M5.5 9.2l2.3 2.3L12.6 6.7" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ErrorIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="7.5" stroke={color} strokeWidth="1.5" />
      <path d="M6.2 6.2l5.6 5.6M11.8 6.2l-5.6 5.6" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ToastLive({
  variant = 'Success',
  showIconLeft = true,
  showCloseIcon = true,
  text = 'Add text here',
  brand: _brand = 'dragonpass',
}: ToastLiveProps) {
  const fontFamily = 'var(--atom-font-body, Poppins, sans-serif)';
  const bg = 'var(--atom-background-primary-bg-primary-inverse, #ffffff)';
  const textColor = 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)';
  const borderColor = 'var(--atom-border-default-border-divider, #cdcbcb)';
  const closeColor = 'var(--atom-foreground-core-fg-secondary, #737272)';

  const iconColor =
    variant === 'Success'
      ? 'var(--atom-foreground-feedback-fg-success, #067647)'
      : 'var(--atom-foreground-feedback-fg-error, #e02d3c)';

  const IconEl = variant === 'Success' ? SuccessIcon : ErrorIcon;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        fontFamily,
        width: '360px',
        display: 'flex',
        gap: '10px',
        padding: '12px 14px',
        backgroundColor: bg,
        border: `1px solid ${borderColor}`,
        borderRadius: '10px',
        boxShadow: '0 8px 24px rgba(10,35,51,0.12), 0 2px 6px rgba(10,35,51,0.08)',
        alignItems: 'center',
      }}
    >
      {showIconLeft && (
        <div style={{ flexShrink: 0 }}>
          <IconEl color={iconColor} />
        </div>
      )}
      <p
        style={{
          margin: 0,
          flex: 1,
          fontSize: '13px',
          fontWeight: 500,
          color: textColor,
          lineHeight: 1.4,
        }}
      >
        {text}
      </p>
      {showCloseIcon && (
        <button
          type="button"
          aria-label="Close"
          style={{
            flexShrink: 0,
            width: '22px',
            height: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          <CloseIcon color={closeColor} />
        </button>
      )}
    </div>
  );
}
