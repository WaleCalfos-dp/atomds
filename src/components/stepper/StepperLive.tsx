import { type Brand } from '../../data/tokens';
import smallStyle1Src from '../../assets/stepper-variants/small-style1.svg';
import defaultStyle1Src from '../../assets/stepper-variants/default-style1.svg';
import largeStyle1Src from '../../assets/stepper-variants/large-style1.svg';
import cardStyle2Src from '../../assets/stepper-variants/card-style2.svg';

// ─────────────────────────────────────────────────────────────────────────────
// StepperLive — numeric increment/decrement control
//   Figma component: Stepper  (componentSet 1702:72060 in Atom file)
//   Purpose:  Allows users to increment or decrement numeric values.
//   Variants authored in Figma (4 shipped):
//     - Stepper=Small,   Style=1  →  84 × 20   (inline)
//     - Stepper=Default, Style=1  →  108 × 32  (inline)
//     - Stepper=Large,   Style=1  →  124 × 40  (inline)
//     - Stepper=Card,    Style=2  →  245 × 115 (framed card)
//
// Rendering approach:
//   Each variant is a static SVG exported directly from Figma — the ±
//   glyphs and the numeric label are all outlined as paths inside the
//   export. We render the file as an <img> at its native size rather
//   than rebuilding the layout from atomic primitives. This keeps the
//   preview exactly on Figma truth (glyph geometry, stroke weights,
//   value typography, rule placement) and removes every opportunity
//   for the code copy to drift from the design.
//
// Known trade-offs:
//   - label / defaultValue / min / max / disabled props are accepted
//     so the documentation rail can advertise the full Figma property
//     surface, but they do NOT mutate the static preview image. The
//     displayed digit is whatever Figma exported (matches the
//     component's authored default).
//   - Brand repaint does not recolour the SVG — these are DragonPass-
//     mode exports. The Design Tokens section in StepperPage keeps
//     swatches brand-reactive.
// ─────────────────────────────────────────────────────────────────────────────

export type StepperSize = 'Small' | 'Default' | 'Large' | 'Card';
export type StepperStyle = '1' | '2';

interface StepperLiveProps {
  size?: StepperSize;
  stepperStyle?: StepperStyle;
  /** Informational only — static SVG exports cannot be relabelled at runtime. */
  label?: string;
  /** Informational only (see note above). */
  defaultValue?: number;
  /** Informational only (see note above). */
  min?: number;
  /** Informational only (see note above). */
  max?: number;
  /** Informational only (see note above). */
  disabled?: boolean;
  brand?: Brand;
}

type VariantKey = `${StepperSize}|${StepperStyle}`;

const VARIANT_SRC: Partial<Record<VariantKey, string>> = {
  'Small|1': smallStyle1Src,
  'Default|1': defaultStyle1Src,
  'Large|1': largeStyle1Src,
  'Card|2': cardStyle2Src,
};

const VARIANT_DIMS: Partial<Record<VariantKey, { w: number; h: number }>> = {
  'Small|1': { w: 84, h: 20 },
  'Default|1': { w: 108, h: 32 },
  'Large|1': { w: 124, h: 40 },
  'Card|2': { w: 245, h: 115 },
};

function variantKey(size: StepperSize, stepperStyle: StepperStyle): VariantKey {
  return `${size}|${stepperStyle}` as VariantKey;
}

export function StepperLive({
  size = 'Small',
  stepperStyle = '1',
  label: _label,
  defaultValue: _defaultValue,
  min: _min,
  max: _max,
  disabled: _disabled,
  brand: _brand = 'dragonpass',
}: StepperLiveProps) {
  // Card variant always rides with Style 2; inline sizes always ride with Style 1.
  // If a caller passes a non-shipped combination, snap to the closest authored
  // variant rather than rendering nothing.
  const resolvedStyle: StepperStyle = size === 'Card' ? '2' : '1';
  const key = variantKey(size, resolvedStyle);
  const src = VARIANT_SRC[key];
  const dims = VARIANT_DIMS[key];

  if (!src || !dims) {
    return (
      <div
        role="img"
        aria-label={`Stepper ${size} Style ${stepperStyle} — preview unavailable`}
        style={{
          width: 124,
          height: 40,
          borderRadius: 8,
          border: '1px dashed #cdcbcb',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--atom-font-body, Poppins, sans-serif)',
          fontSize: 11,
          color: '#737272',
        }}
      >
        No preview
      </div>
    );
  }

  return (
    <img
      src={src}
      width={dims.w}
      height={dims.h}
      alt={`Stepper variant: ${size}, Style ${resolvedStyle}`}
      style={{
        display: 'inline-block',
        width: dims.w,
        height: dims.h,
        flexShrink: 0,
      }}
      draggable={false}
    />
  );
}
