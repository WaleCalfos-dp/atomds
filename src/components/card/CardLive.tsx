import { type Brand } from '../../data/tokens';

// ─── Public types ─────────────────────────────────────────────────────────────
// Mapped to the 12 Figma variants (Image Position × Text Line).
export type CardImagePosition =
  | 'Top'
  | 'Left'
  | 'Right'
  | 'Full'
  | 'None'
  | 'None - Icon Left'
  | 'None - Icon Top'
  | 'None - Number Top';
export type CardTextLine = 'None' | 'Single' | 'Double' | 'Description';

interface CardLiveProps {
  imagePosition?: CardImagePosition;
  textLine?: CardTextLine;
  showActions?: boolean;
  titleText?: string;
  bodyText?: string;
  descriptionText?: string;
  mediaLabel?: string;
  actionLabel?: string;
  badgeLabel?: string;
  numberLabel?: string;
  brand?: Brand;
}

// Widths and heights taken directly from the Figma SVG exports.
const CARD_WIDTH: Record<CardImagePosition, number> = {
  'Top':               343,
  'Left':              343,
  'Right':             304,
  'Full':              368,
  'None':              327,
  'None - Icon Left':  343,
  'None - Icon Top':   343,
  'None - Number Top': 226,
};

export function CardLive({
  imagePosition = 'Top',
  textLine = 'Single',
  showActions = true,
  titleText = 'Card title',
  bodyText = 'Supporting text that explains what this card represents and any key details the user should know.',
  descriptionText = 'A slightly longer paragraph that can wrap onto multiple lines, useful for articles, editorial content and detail-heavy surfaces.',
  mediaLabel = 'Media',
  actionLabel = 'Learn more',
  badgeLabel = 'Tag',
  numberLabel = '01',
  brand: _brand = 'dragonpass',
}: CardLiveProps) {
  // ── Token-backed palette (tokens.ts → CSS variables with hex fallbacks) ─────
  const fontFamily     = 'var(--atom-font-body, "Poppins", system-ui, sans-serif)';
  const bgColor        = 'var(--atom-background-primary-bg-primary-inverse, #ffffff)';
  const borderColor    = 'var(--atom-border-default-border-divider, #CDCBCB)';
  const titleColor     = 'var(--atom-foreground-primary-fg-brand-primary, #0A2333)';
  const bodyColor      = 'var(--atom-foreground-core-fg-primary, #4B4A4A)';
  const tertiaryColor  = 'var(--atom-foreground-core-fg-tertiary, #AFAEAD)';
  const mutedBg        = 'var(--atom-background-core-bg-muted, #E9E8E6)';
  const brandAccent    = 'var(--atom-foreground-primary-fg-brand-primary, #0A2333)';

  const isHorizontal = imagePosition === 'Left' || imagePosition === 'Right';
  const isFullImage  = imagePosition === 'Full';
  const isIconLeft   = imagePosition === 'None - Icon Left';
  const isIconTop    = imagePosition === 'None - Icon Top';
  const isNumberTop  = imagePosition === 'None - Number Top';
  const isImagePlain = imagePosition === 'Top' || imagePosition === 'Left' || imagePosition === 'Right';
  const cardWidth = CARD_WIDTH[imagePosition];

  // ── Shared container style ────────────────────────────────────────────────
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isHorizontal ? 'row' : 'column',
    backgroundColor: bgColor,
    border: `1px solid ${borderColor}`,
    borderRadius: '8px',
    overflow: 'hidden',
    fontFamily,
    width: `${cardWidth}px`,
    boxSizing: 'border-box',
  };

  // ── Description block (title + body + optional actions) ───────────────────
  const descriptionStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '13px',
    color: bodyColor,
    lineHeight: 1.5,
    ...(textLine === 'Single'
      ? { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
      : textLine === 'Double'
      ? { overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }
      : {}),
  };

  function TextBlock() {
    const showBody = textLine !== 'None';
    const longText = textLine === 'Description' ? descriptionText : bodyText;
    return (
      <div
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flex: 1,
          minWidth: 0,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: '15px',
            fontWeight: 600,
            color: titleColor,
            lineHeight: 1.35,
          }}
        >
          {titleText}
        </h3>
        {showBody && <p style={descriptionStyle}>{longText}</p>}
        {showActions && (
          <button
            type="button"
            style={{
              marginTop: '4px',
              alignSelf: 'flex-start',
              fontFamily,
              fontSize: '13px',
              fontWeight: 600,
              color: brandAccent,
              backgroundColor: 'transparent',
              border: 'none',
              padding: '6px 0',
              cursor: 'pointer',
            }}
          >
            {actionLabel} →
          </button>
        )}
      </div>
    );
  }

  // ── Plain media rect for Top / Left / Right ────────────────────────────────
  function MediaBlock({ vertical }: { vertical: boolean }) {
    const width  = vertical ? '100%' : '120px';
    const height = vertical ? (textLine === 'Description' ? '168px' : '160px') : 'auto';
    return (
      <div
        aria-hidden="true"
        style={{
          width,
          height,
          minHeight: vertical ? undefined : '104px',
          backgroundColor: mutedBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: tertiaryColor,
          fontSize: '12px',
          fontWeight: 500,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        {mediaLabel}
      </div>
    );
  }

  // ── Full-bleed image with floating overlays (Figma "Image Position=Full") ─
  if (isFullImage) {
    return (
      <div
        style={{
          ...containerStyle,
          position: 'relative',
          height: '184px',
          backgroundColor: mutedBg,
        }}
      >
        {/* Corner pill (top-left) */}
        <span
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#ffffff',
            backgroundColor: 'rgba(10, 35, 51, 0.72)',
            borderRadius: '999px',
          }}
        >
          {badgeLabel}
        </span>
        {/* Caption lockup (bottom-left) */}
        <div
          style={{
            position: 'absolute',
            left: '16px',
            bottom: '16px',
            color: '#ffffff',
            maxWidth: cardWidth - 32,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '15px',
              fontWeight: 600,
              lineHeight: 1.35,
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            }}
          >
            {titleText}
          </p>
          {textLine !== 'None' && (
            <p
              style={{
                margin: '4px 0 0',
                fontSize: '12px',
                fontWeight: 500,
                lineHeight: 1.4,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                opacity: 0.92,
              }}
            >
              {bodyText}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── None + Number Top (compact numbered tile) ──────────────────────────────
  if (isNumberTop) {
    return (
      <div style={{ ...containerStyle, padding: '16px', gap: '12px' }}>
        <span
          style={{
            fontSize: '32px',
            fontWeight: 700,
            color: brandAccent,
            fontFamily,
            lineHeight: 1,
            letterSpacing: '-0.01em',
          }}
        >
          {numberLabel}
        </span>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: titleColor, lineHeight: 1.35 }}>
          {titleText}
        </h3>
        {textLine !== 'None' && (
          <p style={descriptionStyle}>{bodyText}</p>
        )}
      </div>
    );
  }

  // ── None + Icon Top ───────────────────────────────────────────────────────
  if (isIconTop) {
    return (
      <div style={{ ...containerStyle, padding: '16px', gap: '12px' }}>
        <div
          aria-hidden="true"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '999px',
            backgroundColor: mutedBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: brandAccent,
          }}
        >
          {/* Generic icon glyph */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12H9v-4H7V9h3v5zm-1-7a1 1 0 110-2 1 1 0 010 2z" fill="currentColor" />
          </svg>
        </div>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: titleColor, lineHeight: 1.35 }}>
          {titleText}
        </h3>
        {textLine !== 'None' && (
          <p style={descriptionStyle}>{bodyText}</p>
        )}
        {showActions && (
          <button
            type="button"
            style={{
              marginTop: '4px',
              alignSelf: 'flex-start',
              fontFamily,
              fontSize: '13px',
              fontWeight: 600,
              color: brandAccent,
              backgroundColor: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            {actionLabel} →
          </button>
        )}
      </div>
    );
  }

  // ── None + Icon Left ──────────────────────────────────────────────────────
  if (isIconLeft) {
    return (
      <div style={{ ...containerStyle, padding: '16px', flexDirection: 'row', gap: '16px', alignItems: 'flex-start' }}>
        <div
          aria-hidden="true"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: mutedBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: brandAccent,
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm3 2h8M6 11h8M6 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: titleColor, lineHeight: 1.35 }}>
            {titleText}
          </h3>
          {textLine !== 'None' && <p style={descriptionStyle}>{bodyText}</p>}
        </div>
      </div>
    );
  }

  // ── None (text-only, no image/icon) ───────────────────────────────────────
  if (imagePosition === 'None') {
    return (
      <div style={{ ...containerStyle, padding: '16px', gap: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: titleColor, lineHeight: 1.35 }}>
          {titleText}
        </h3>
        {textLine !== 'None' && (
          <p style={descriptionStyle}>
            {textLine === 'Description' ? descriptionText : bodyText}
          </p>
        )}
        {showActions && (
          <button
            type="button"
            style={{
              marginTop: '4px',
              alignSelf: 'flex-start',
              fontFamily,
              fontSize: '13px',
              fontWeight: 600,
              color: brandAccent,
              backgroundColor: 'transparent',
              border: 'none',
              padding: '6px 0',
              cursor: 'pointer',
            }}
          >
            {actionLabel} →
          </button>
        )}
      </div>
    );
  }

  // ── Top / Left / Right (plain image + text lockup) ────────────────────────
  const vertical = imagePosition === 'Top';
  const mediaFirst = imagePosition === 'Top' || imagePosition === 'Left';

  return (
    <div style={containerStyle}>
      {isImagePlain && mediaFirst && <MediaBlock vertical={vertical} />}
      <TextBlock />
      {isImagePlain && !mediaFirst && <MediaBlock vertical={vertical} />}
    </div>
  );
}
