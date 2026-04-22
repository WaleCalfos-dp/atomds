import { type Brand } from '../../data/tokens';

// ─── Public types ─────────────────────────────────────────────────────────────
// Aligned with the Atom Figma component "image" (node 399:4121):
//   • 638 × 305 container (aspect ratio ≈ 2.092:1)
//   • cornerRadius = 0, no stroke
//   • Single IMAGE fill with scaleMode = FILL (== CSS object-fit: cover)
//
// Figma exposes no variants. The three surface "states" below are docs-only
// affordances for showing the component without an image source.
export type MediaState = 'Default' | 'Empty' | 'Loading';
export type MediaAspect = '638:305' | '16:9' | '4:3' | '1:1' | '3:4';

interface MediaLiveProps {
  state?: MediaState;
  aspect?: MediaAspect;  // docs-only convenience; Figma default is 638:305
  src?: string;           // optional image source
  alt?: string;           // required for non-decorative images
  decorative?: boolean;   // when true, aria-hidden + empty alt
  brand?: Brand;
}

// ─── Subtle checkerboard — mirrors Figma's default empty-image render ──────
const CHECKERBOARD_BG: React.CSSProperties = {
  backgroundColor: 'var(--atom-background-core-bg-muted, #f5f4f3)',
  backgroundImage:
    'linear-gradient(45deg, rgba(0,0,0,0.04) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.04) 75%),' +
    'linear-gradient(45deg, rgba(0,0,0,0.04) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.04) 75%)',
  backgroundSize: '16px 16px',
  backgroundPosition: '0 0, 8px 8px',
};

// ─── Aspect-ratio map ───────────────────────────────────────────────────────
const ASPECT_RATIO: Record<MediaAspect, string> = {
  '638:305': '638 / 305',
  '16:9':    '16 / 9',
  '4:3':     '4 / 3',
  '1:1':     '1 / 1',
  '3:4':     '3 / 4',
};

// ─── Empty-state icon ───────────────────────────────────────────────────────
function EmptyIcon({ color }: { color: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="5" y="7" width="30" height="26" rx="2" stroke={color} strokeWidth="1.6" />
      <circle cx="14" cy="16" r="2.5" stroke={color} strokeWidth="1.4" />
      <path d="M5 27l9-9 10 10 4-4 7 7" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MediaLive({
  state = 'Default',
  aspect = '638:305',
  src,
  alt = '',
  decorative = false,
  brand: _brand = 'dragonpass',
}: MediaLiveProps) {
  const fontFamily = 'var(--atom-font-body, "Poppins", system-ui, sans-serif)';
  const mutedFg    = 'var(--atom-foreground-core-fg-secondary, #737272)';

  const showImage = state === 'Default' && !!src;
  const showEmpty = state === 'Empty' || (state === 'Default' && !src);

  return (
    <div
      role={decorative ? 'presentation' : 'img'}
      aria-label={decorative ? undefined : alt || undefined}
      style={{
        fontFamily,
        position: 'relative',
        width: '100%',
        aspectRatio: ASPECT_RATIO[aspect],
        overflow: 'hidden',
        backgroundColor: 'var(--atom-background-core-bg-muted, #f5f4f3)',
      }}
    >
      {/* Actual image — matches Figma IMAGE fill with scaleMode=FILL → object-fit:cover */}
      {showImage && (
        <img
          src={src}
          alt={decorative ? '' : alt}
          aria-hidden={decorative || undefined}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Empty placeholder — matches Figma's transparent-PNG checkerboard render */}
      {showEmpty && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...CHECKERBOARD_BG,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', color: mutedFg }}>
            <EmptyIcon color={mutedFg} />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              No image
            </span>
          </div>
        </div>
      )}

      {/* Loading shimmer — animated */}
      {state === 'Loading' && (
        <>
          <style>{`
            @keyframes atom-media-shimmer {
              0%   { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }
          `}</style>
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%),' +
                'var(--atom-background-core-bg-muted, #f5f4f3)',
              backgroundSize: '200% 100%, 100% 100%',
              backgroundRepeat: 'no-repeat',
              animation: 'atom-media-shimmer 1.4s linear infinite',
            }}
          />
          <span
            className="sr-only"
            style={{
              position: 'absolute',
              width: '1px', height: '1px',
              padding: 0, margin: '-1px',
              overflow: 'hidden',
              clip: 'rect(0,0,0,0)',
              whiteSpace: 'nowrap',
              border: 0,
            }}
          >
            Loading image
          </span>
        </>
      )}
    </div>
  );
}
