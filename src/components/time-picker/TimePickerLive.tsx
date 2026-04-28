import { type Brand } from '../../data/tokens';

// Vertical
import vertical1Src from '../../assets/time-picker-variants/vertical-1.svg';
import vertical2Src from '../../assets/time-picker-variants/vertical-2.svg';
import vertical3Src from '../../assets/time-picker-variants/vertical-3.svg';
import vertical4Src from '../../assets/time-picker-variants/vertical-4.svg';
import vertical5Src from '../../assets/time-picker-variants/vertical-5.svg';
import vertical6Src from '../../assets/time-picker-variants/vertical-6.svg';
import vertical7Src from '../../assets/time-picker-variants/vertical-7.svg';
import vertical8Src from '../../assets/time-picker-variants/vertical-8.svg';

// Scrollable
import scrollable1Src from '../../assets/time-picker-variants/scrollable-1.svg';

// Grid — 2-column
import grid2x2ColSrc from '../../assets/time-picker-variants/grid-2-2col.svg';
import grid4x2ColSrc from '../../assets/time-picker-variants/grid-4-2col.svg';
import grid6x2ColSrc from '../../assets/time-picker-variants/grid-6-2col.svg';
import grid8x2ColSrc from '../../assets/time-picker-variants/grid-8-2col.svg';
import grid10x2ColSrc from '../../assets/time-picker-variants/grid-10-2col.svg';
import grid12x2ColSrc from '../../assets/time-picker-variants/grid-12-2col.svg';
import grid14x2ColSrc from '../../assets/time-picker-variants/grid-14-2col.svg';
import grid16x2ColSrc from '../../assets/time-picker-variants/grid-16-2col.svg';

// Grid — 4-column
import grid4x4ColSrc from '../../assets/time-picker-variants/grid-4-4col.svg';
import grid8x4ColSrc from '../../assets/time-picker-variants/grid-8-4col.svg';
import grid12x4ColSrc from '../../assets/time-picker-variants/grid-12-4col.svg';
import grid16x4ColSrc from '../../assets/time-picker-variants/grid-16-4col.svg';
import grid20x4ColSrc from '../../assets/time-picker-variants/grid-20-4col.svg';
import grid24x4ColSrc from '../../assets/time-picker-variants/grid-24-4col.svg';
import grid32x4ColSrc from '../../assets/time-picker-variants/grid-32-4col.svg';

// ─────────────────────────────────────────────────────────────────────────────
// TimePickerLive — time / slot picker
//   Figma component set: Time Picker (node 1621:26807 in Atom file)
//   Purpose: Lets users pick a time from three presentations — a vertical list,
//     a grid of slot chips, or a horizontally scrollable strip.
//
// Variants authored in Figma (24 shipped):
//   Style=Vertical   · Count=1..8                 →  392 × (76 + 60·Count)
//   Style=Scrollable · Count=1                    →  392 × 310
//   Style=Grid       · Count=2,4,6,8,10,12,14,16  →  2-col  (308 × n)
//   Style=Grid       · Count=4,8,12,16,20,24,32   →  4-col  (308 × n)
//
// Rendering approach:
//   Each variant is rendered from the Figma-exported SVG at native pixel size.
//   The display is static — chip copy, selection state, scroll caret, and any
//   typographic detail are baked into the export. Picking a non-shipped
//   combination renders a dashed "No preview" placeholder so the Interactive
//   rail remains informative.
//
// Known trade-offs:
//   - showButton / brand props are accepted for API compatibility, but the
//     SVGs are DragonPass-mode exports with no Confirm button baked in.
//     StepperPage / DatePickerPage use the same pattern — the Design Tokens
//     table in TimePickerPage remains brand-reactive for documentation.
// ─────────────────────────────────────────────────────────────────────────────

export type TimePickerStyle = 'Vertical' | 'Grid' | 'Scrollable';
export type TimePickerColumn = 2 | 4;

/** Every Count value Figma authored for each Style. */
export const SHIPPED_COUNTS: Record<TimePickerStyle, readonly number[]> = {
  Vertical: [1, 2, 3, 4, 5, 6, 7, 8],
  Scrollable: [1],
  Grid: [2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32],
};

/** Which Column choices Figma authored for a given Grid Count. */
export const SHIPPED_GRID_COLUMNS: Record<number, readonly TimePickerColumn[]> = {
  2: [2],
  4: [2, 4],
  6: [2],
  8: [2, 4],
  10: [2],
  12: [2, 4],
  14: [2],
  16: [2, 4],
  20: [4],
  24: [4],
  32: [4],
};

interface TimePickerLiveProps {
  style?: TimePickerStyle;
  /** Slot / row count. See SHIPPED_COUNTS for authored values per Style. */
  count?: number;
  /** Grid column count. Ignored outside Style=Grid. */
  column?: TimePickerColumn;
  brand?: Brand;
  /** Informational only — the SVG exports do not include a Confirm button. */
  showButton?: boolean;
}

type VariantKey = string;

const VARIANT_SRC: Record<VariantKey, string> = {
  // Vertical
  'Vertical|1|-': vertical1Src,
  'Vertical|2|-': vertical2Src,
  'Vertical|3|-': vertical3Src,
  'Vertical|4|-': vertical4Src,
  'Vertical|5|-': vertical5Src,
  'Vertical|6|-': vertical6Src,
  'Vertical|7|-': vertical7Src,
  'Vertical|8|-': vertical8Src,
  // Scrollable
  'Scrollable|1|-': scrollable1Src,
  // Grid — 2-column
  'Grid|2|2': grid2x2ColSrc,
  'Grid|4|2': grid4x2ColSrc,
  'Grid|6|2': grid6x2ColSrc,
  'Grid|8|2': grid8x2ColSrc,
  'Grid|10|2': grid10x2ColSrc,
  'Grid|12|2': grid12x2ColSrc,
  'Grid|14|2': grid14x2ColSrc,
  'Grid|16|2': grid16x2ColSrc,
  // Grid — 4-column
  'Grid|4|4': grid4x4ColSrc,
  'Grid|8|4': grid8x4ColSrc,
  'Grid|12|4': grid12x4ColSrc,
  'Grid|16|4': grid16x4ColSrc,
  'Grid|20|4': grid20x4ColSrc,
  'Grid|24|4': grid24x4ColSrc,
  'Grid|32|4': grid32x4ColSrc,
};

const VARIANT_DIMS: Record<VariantKey, { w: number; h: number }> = {
  'Vertical|1|-': { w: 392, h: 136 },
  'Vertical|2|-': { w: 392, h: 196 },
  'Vertical|3|-': { w: 392, h: 256 },
  'Vertical|4|-': { w: 392, h: 316 },
  'Vertical|5|-': { w: 392, h: 376 },
  'Vertical|6|-': { w: 392, h: 436 },
  'Vertical|7|-': { w: 392, h: 496 },
  'Vertical|8|-': { w: 392, h: 556 },
  'Scrollable|1|-': { w: 392, h: 310 },
  'Grid|2|2': { w: 308, h: 52 },
  'Grid|4|2': { w: 308, h: 112 },
  'Grid|6|2': { w: 308, h: 172 },
  'Grid|8|2': { w: 308, h: 232 },
  'Grid|10|2': { w: 308, h: 292 },
  'Grid|12|2': { w: 308, h: 352 },
  'Grid|14|2': { w: 308, h: 412 },
  'Grid|16|2': { w: 308, h: 472 },
  'Grid|4|4': { w: 308, h: 52 },
  'Grid|8|4': { w: 308, h: 112 },
  'Grid|12|4': { w: 308, h: 172 },
  'Grid|16|4': { w: 308, h: 232 },
  'Grid|20|4': { w: 308, h: 292 },
  'Grid|24|4': { w: 308, h: 352 },
  'Grid|32|4': { w: 308, h: 472 },
};

function variantKey(style: TimePickerStyle, count: number, column?: TimePickerColumn): VariantKey {
  return style === 'Grid' ? `Grid|${count}|${column ?? 2}` : `${style}|${count}|-`;
}

export function TimePickerLive({
  style = 'Vertical',
  count = style === 'Vertical' ? 3 : style === 'Scrollable' ? 1 : 4,
  column = 2,
  brand: _brand = 'dragonpass',
  showButton: _showButton = true,
}: TimePickerLiveProps) {
  const key = variantKey(style, count, column);
  const src = VARIANT_SRC[key];
  const dims = VARIANT_DIMS[key];

  if (!src || !dims) {
    const descriptor =
      style === 'Grid' ? `Grid · Count=${count} · ${column} Column` : `${style} · Count=${count}`;
    return (
      <div
        role="img"
        aria-label={`Time Picker ${descriptor} — not authored in Figma`}
        style={{
          width: style === 'Grid' ? 308 : 392,
          minHeight: 140,
          borderRadius: 12,
          border: '1px dashed var(--atom-border-default-border-default, #cdcbcb)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          fontFamily: 'var(--atom-font-body, Poppins, sans-serif)',
          fontSize: 12,
          color: 'var(--atom-foreground-core-fg-secondary, #737272)',
          textAlign: 'center',
        }}
      >
        {descriptor} is not a shipped Figma variant
      </div>
    );
  }

  return (
    <img
      src={src}
      width={dims.w}
      height={dims.h}
      alt={`Time Picker: ${key.replace(/\|/g, ', ')}`}
      style={{
        maxWidth: 'none',
        display: 'inline-block',
        width: dims.w,
        height: dims.h,
        flexShrink: 0,
      }}
      draggable={false}
    />
  );
}
