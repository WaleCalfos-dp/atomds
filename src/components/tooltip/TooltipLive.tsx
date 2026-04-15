import { type Brand } from '../../data/tokens';

export type TooltipPosition = 'Top' | 'Bottom' | 'Left' | 'Right';

interface TooltipLiveProps {
  position?: TooltipPosition;
  titleText?: string;
  descriptionText?: string;
  showTitle?: boolean;
  showDescription?: boolean;
  showIconLeft?: boolean;
  showIconRight?: boolean;
  brand?: Brand;
}

const ARROW_SIZE = 6;

function arrowStyles(position: TooltipPosition): React.CSSProperties {
  const base: React.CSSProperties = {
    position: 'absolute',
    width: 0,
    height: 0,
  };

  switch (position) {
    case 'Top':
      return {
        ...base,
        bottom: -ARROW_SIZE,
        left: '50%',
        transform: 'translateX(-50%)',
        borderLeft: `${ARROW_SIZE}px solid transparent`,
        borderRight: `${ARROW_SIZE}px solid transparent`,
        borderTop: `${ARROW_SIZE}px solid var(--atom-background-primary-bg-primary-default, #0a2333)`,
      };
    case 'Bottom':
      return {
        ...base,
        top: -ARROW_SIZE,
        left: '50%',
        transform: 'translateX(-50%)',
        borderLeft: `${ARROW_SIZE}px solid transparent`,
        borderRight: `${ARROW_SIZE}px solid transparent`,
        borderBottom: `${ARROW_SIZE}px solid var(--atom-background-primary-bg-primary-default, #0a2333)`,
      };
    case 'Left':
      return {
        ...base,
        right: -ARROW_SIZE,
        top: '50%',
        transform: 'translateY(-50%)',
        borderTop: `${ARROW_SIZE}px solid transparent`,
        borderBottom: `${ARROW_SIZE}px solid transparent`,
        borderLeft: `${ARROW_SIZE}px solid var(--atom-background-primary-bg-primary-default, #0a2333)`,
      };
    case 'Right':
      return {
        ...base,
        left: -ARROW_SIZE,
        top: '50%',
        transform: 'translateY(-50%)',
        borderTop: `${ARROW_SIZE}px solid transparent`,
        borderBottom: `${ARROW_SIZE}px solid transparent`,
        borderRight: `${ARROW_SIZE}px solid var(--atom-background-primary-bg-primary-default, #0a2333)`,
      };
  }
}

function InfoIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 7v4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="8" cy="5" r="0.75" fill="currentColor" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ flexShrink: 0, cursor: 'pointer' }}
    >
      <path
        d="M4.5 4.5l7 7M11.5 4.5l-7 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TooltipLive({
  position = 'Top',
  titleText = 'Title',
  descriptionText = 'Description',
  showTitle = true,
  showDescription = true,
  showIconLeft = true,
  showIconRight = true,
  brand: _brand = 'dragonpass',
}: TooltipLiveProps) {
  const bg = 'var(--atom-background-primary-bg-primary-default, #0a2333)';
  const fg = 'var(--atom-foreground-primary-fg-brand-primary-inverse, #ffffff)';

  const hasTextContent = showTitle || showDescription;

  return (
    <div
      role="tooltip"
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        borderRadius: '8px',
        backgroundColor: bg,
        color: fg,
        fontFamily: 'var(--atom-font-body, Poppins, sans-serif)',
        whiteSpace: 'nowrap',
        maxWidth: '240px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      }}
    >
      {showIconLeft && <InfoIcon />}

      {hasTextContent && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
          {showTitle && (
            <span
              style={{
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: 1.4,
                color: fg,
              }}
            >
              {titleText}
            </span>
          )}
          {showDescription && (
            <span
              style={{
                fontSize: '12px',
                fontWeight: 400,
                lineHeight: 1.4,
                color: fg,
                opacity: 0.8,
              }}
            >
              {descriptionText}
            </span>
          )}
        </div>
      )}

      {showIconRight && <CloseIcon />}

      <div style={arrowStyles(position)} />
    </div>
  );
}
