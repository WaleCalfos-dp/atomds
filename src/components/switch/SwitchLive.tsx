import { type Brand } from '../../data/tokens';
import defaultOnSrc from '../../assets/switch-variants/default-on.svg';
import defaultOffSrc from '../../assets/switch-variants/default-off.svg';
import focusedOnSrc from '../../assets/switch-variants/focused-on.svg';
import focusedOffSrc from '../../assets/switch-variants/focused-off.svg';
import disabledOnSrc from '../../assets/switch-variants/disabled-on.svg';
import disabledOffSrc from '../../assets/switch-variants/disabled-off.svg';

// ─────────────────────────────────────────────────────────────────────────────
// SwitchLive — two-state on/off toggle
//   Figma component: Switch (6 shipped variants: State × On)
//   Purpose: Enables users to flip between two opposing states. Use for on/off
//     settings, mode changes, or preference controls.
//
// Variants authored in Figma:
//     - state=Default,  On=True|False   →  70 × 24   (track 48 × 24 + inline "On"/"Off" text)
//     - state=Focused,  On=True|False   →  73 × 30   (track 48 × 24 + 3px focus ring + text)
//     - state=Disabled, On=True|False   →  70 × 24   (disabled track + muted text)
//
// Rendering approach:
//   The preview is rendered from the Figma-exported SVG for the given
//   State × On combination. Track geometry, thumb position, focus ring,
//   and the inline "On"/"Off" glyphs are all baked into the SVG, so the
//   component never drifts from Figma truth. The Action Text toggle
//   clips the rightmost label by constraining the wrapper's width to
//   the track (+focus ring) region.
//
// Known trade-offs:
//   - onChange is accepted to preserve the prop API but is not wired —
//     the image is static. Consumers who need an interactive toggle
//     should build on top of the semantic role="switch" pattern
//     described in the Accessibility section of SwitchPage.
//   - Brand repaint does not recolour the SVG (DragonPass-mode export).
//     The Design Tokens table in SwitchPage remains brand-reactive.
// ─────────────────────────────────────────────────────────────────────────────

export type SwitchState = 'Default' | 'Focused' | 'Disabled';

interface SwitchLiveProps {
  on?: boolean;
  state?: SwitchState;
  /** When true, shows the inline "On" / "Off" label baked into the SVG export. */
  actionText?: boolean;
  /** Optional external label rendered as a sibling to the switch track. */
  label?: string;
  brand?: Brand;
  /** Accepted for API compatibility — static SVG preview is not interactive. */
  onChange?: (on: boolean) => void;
}

type VariantKey = `${SwitchState}|${'on' | 'off'}`;

const VARIANT_SRC: Record<VariantKey, string> = {
  'Default|on': defaultOnSrc,
  'Default|off': defaultOffSrc,
  'Focused|on': focusedOnSrc,
  'Focused|off': focusedOffSrc,
  'Disabled|on': disabledOnSrc,
  'Disabled|off': disabledOffSrc,
};

// Native SVG dimensions (width × height).
const VARIANT_DIMS: Record<VariantKey, { w: number; h: number }> = {
  'Default|on': { w: 70, h: 24 },
  'Default|off': { w: 70, h: 24 },
  'Focused|on': { w: 73, h: 30 },
  'Focused|off': { w: 73, h: 30 },
  'Disabled|on': { w: 70, h: 24 },
  'Disabled|off': { w: 70, h: 24 },
};

// Track-only region (hides the inline "On"/"Off" glyphs by clipping).
// Default / Disabled: track sits at x=0..48, so showing 48 hides the text.
// Focused: track sits at x=3..51 with a 3px focus ring, so showing 54 (3+48+3) covers just the ring.
const TRACK_ONLY_WIDTH: Record<SwitchState, number> = {
  Default: 48,
  Disabled: 48,
  Focused: 54,
};

export function SwitchLive({
  on = false,
  state = 'Default',
  actionText = true,
  label,
  brand: _brand = 'dragonpass',
  onChange: _onChange,
}: SwitchLiveProps) {
  const key: VariantKey = `${state}|${on ? 'on' : 'off'}`;
  const src = VARIANT_SRC[key];
  const dims = VARIANT_DIMS[key];
  const visibleWidth = actionText ? dims.w : TRACK_ONLY_WIDTH[state];

  const labelColor =
    state === 'Disabled'
      ? 'var(--atom-foreground-states-fg-disabled, #91908f)'
      : on
      ? 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)'
      : 'var(--atom-foreground-core-fg-primary, #4b4a4a)';

  return (
    <div
      role="group"
      aria-label={label || `Switch ${state}, ${on ? 'On' : 'Off'}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontFamily: 'var(--atom-font-body, Poppins, sans-serif)',
      }}
    >
      <div
        role="switch"
        aria-checked={on}
        aria-disabled={state === 'Disabled' || undefined}
        style={{
          position: 'relative',
          width: visibleWidth,
          height: dims.h,
          overflow: 'hidden',
          display: 'inline-block',
          flexShrink: 0,
          transition: 'width 160ms ease',
        }}
      >
        <img
          src={src}
          width={dims.w}
          height={dims.h}
          alt={`Switch variant: ${state}, ${on ? 'On' : 'Off'}`}
          style={{
            // Override the global `img { max-width: 100% }` reset —
            // the wrapper clips to `visibleWidth`, but the image itself
            // must always render at its native pixel width so the "On" /
            // "Off" glyphs sit where Figma placed them.
            maxWidth: 'none',
            display: 'block',
            width: dims.w,
            height: dims.h,
            flexShrink: 0,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
          draggable={false}
        />
      </div>

      {label && (
        <span
          style={{
            fontSize: '14px',
            color: labelColor,
            userSelect: 'none',
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
