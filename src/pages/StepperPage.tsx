import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

// ─────────────────────────────────────────────────────────────────────────────
// Figma source of truth
//   Component: Stepper (componentKey 9fea97c51ccf2a01ae708771db9a7ee7a9a1eb2c)
//   File:      Atom  (nKc4ep7mNdD5IqFRhNRNlW)
//   Purpose:   Allows users to increment or decrement numeric values.
//   Property surface (from componentPropertyDefinitions):
//     VARIANT  Stepper → Default · Large · Small · Card   (default Small)
//     VARIANT  Style   → 1 · 2                             (default 1)
//     TEXT     Label   → default "0"
//   Concrete variants (4): Small/1 · Default/1 · Large/1 · Card/2
//   Dimensions (from Figma):
//     Small/1   81 × 20   horizontal · 16px gap
//     Default/1 105 × 32  horizontal · 16px gap
//     Large/1   121 × 40  horizontal · 16px gap
//     Card/2    245 × 114.5  vertical · 24px padding · 8px radius
// ─────────────────────────────────────────────────────────────────────────────

interface StepperPageProps {
  brand: Brand;
}

type StepperSize = 'Default' | 'Large' | 'Small' | 'Card';
type StepperStyle = '1' | '2';

const ALL_SIZES: StepperSize[] = ['Default', 'Large', 'Small', 'Card'];
const ALL_STYLES: StepperStyle[] = ['1', '2'];

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// Size → measurements from Figma
const SIZE_DIMS: Record<StepperSize, {
  btn: number; labelWidth: number; gap: number; font: number; strokeW: number;
}> = {
  Small:   { btn: 20, labelWidth: 24, gap: 10, font: 12, strokeW: 1.5 },
  Default: { btn: 32, labelWidth: 28, gap: 13, font: 14, strokeW: 1.75 },
  Large:   { btn: 40, labelWidth: 32, gap: 16, font: 16, strokeW: 2 },
  Card:    { btn: 40, labelWidth: 32, gap: 16, font: 16, strokeW: 2 },
};

// ─── Glyphs ───────────────────────────────────────────────────────────────────
function MinusGlyph({ size, color, strokeW }: { size: number; color: string; strokeW: number }) {
  const half = size / 2;
  const len = size * 0.35;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <line x1={half - len} y1={half} x2={half + len} y2={half}
        stroke={color} strokeWidth={strokeW} strokeLinecap="round" />
    </svg>
  );
}

function PlusGlyph({ size, color, strokeW }: { size: number; color: string; strokeW: number }) {
  const half = size / 2;
  const len = size * 0.35;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <line x1={half - len} y1={half} x2={half + len} y2={half}
        stroke={color} strokeWidth={strokeW} strokeLinecap="round" />
      <line x1={half} y1={half - len} x2={half} y2={half + len}
        stroke={color} strokeWidth={strokeW} strokeLinecap="round" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// StepperPreview — inline, Figma-accurate preview that renders every variant.
// ─────────────────────────────────────────────────────────────────────────────
interface StepperPreviewProps {
  size: StepperSize;
  style: StepperStyle;
  label: string;
  cardTitle?: string;
  cardSubtitle?: string;
}

function StepperPreview({
  size, style, label,
  cardTitle = 'Select Ticket',
  cardSubtitle = 'Adult · General Admission',
}: StepperPreviewProps) {
  const fontFamily = 'var(--atom-font-body, Poppins, sans-serif)';
  const brandColor = 'var(--atom-background-primary-bg-primary-default, #0a2333)';
  const brandFg = 'var(--atom-foreground-primary-fg-brand-primary-inverse, #ffffff)';
  const borderColor = 'var(--atom-border-default-border-default, #cdcbcb)';
  const textColor = 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)';
  const subtitleColor = 'var(--atom-foreground-core-fg-secondary, #737272)';
  const cardBg = 'var(--atom-background-primary-bg-primary-inverse, #ffffff)';

  const dims = SIZE_DIMS[size];

  // Style 1: unfilled buttons with brand-coloured stroke + glyph.
  // Style 2: solid-filled brand-coloured buttons with white glyph (Card variant).
  const filled = style === '2';
  const btnBg = filled ? brandColor : cardBg;
  const btnBorder = filled ? brandColor : borderColor;
  const glyphColor = filled ? brandFg : textColor;

  const stepperRow = (
    <div style={{
      display: 'flex', alignItems: 'center', gap: `${dims.gap}px`,
      fontFamily,
    }}>
      <button
        type="button"
        aria-label="Decrease"
        style={{
          width: dims.btn, height: dims.btn, borderRadius: '50%',
          backgroundColor: btnBg, border: `1.5px solid ${btnBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', padding: 0, flexShrink: 0,
        }}
      >
        <MinusGlyph size={dims.btn} color={glyphColor} strokeW={dims.strokeW} />
      </button>

      <span style={{
        minWidth: dims.labelWidth, textAlign: 'center',
        fontSize: dims.font, fontWeight: 500, color: textColor,
        fontVariantNumeric: 'tabular-nums',
      }}>{label}</span>

      <button
        type="button"
        aria-label="Increase"
        style={{
          width: dims.btn, height: dims.btn, borderRadius: '50%',
          backgroundColor: btnBg, border: `1.5px solid ${btnBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', padding: 0, flexShrink: 0,
        }}
      >
        <PlusGlyph size={dims.btn} color={glyphColor} strokeW={dims.strokeW} />
      </button>
    </div>
  );

  if (size === 'Card') {
    // Card/Style 2: 245×114.5 card wrapper, 24px padding, 8px radius, vertical layout.
    return (
      <div style={{
        fontFamily,
        width: '245px',
        backgroundColor: cardBg,
        border: `1px solid ${borderColor}`,
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 1px 2px rgba(10,35,51,0.06)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '16px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: textColor, lineHeight: 1.3 }}>
              {cardTitle}
            </span>
            <span style={{ fontSize: '12px', color: subtitleColor, lineHeight: 1.4 }}>
              {cardSubtitle}
            </span>
          </div>
          {stepperRow}
        </div>
      </div>
    );
  }

  return stepperRow;
}

// ─────────────────────────────────────────────────────────────────────────────
// Controls rail helpers
// ─────────────────────────────────────────────────────────────────────────────
function ControlSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{title}</p>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}

function PillSelect<T extends string>({
  options, active, onChange,
}: { options: readonly T[]; active: T; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={[
            'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
            active === opt
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
          ].join(' ')}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function TextField({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] text-slate-500">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 py-1 text-xs border border-slate-200 rounded-md text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
      />
    </label>
  );
}

// ─── Design tokens table rows ────────────────────────────────────────────────
const TOKEN_TABLE_ROWS = [
  { label: 'Button bg (Style 2)',  cssVar: '--atom-background-primary-bg-primary-default',        tokenKey: 'atom.background.primary.bg-primary-default',        fallback: '#0a2333' },
  { label: 'Button fg (Style 2)',  cssVar: '--atom-foreground-primary-fg-brand-primary-inverse',  tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse',  fallback: '#ffffff' },
  { label: 'Button stroke (Style 1)', cssVar: '--atom-foreground-primary-fg-brand-primary',       tokenKey: 'atom.foreground.primary.fg-brand-primary',          fallback: '#0a2333' },
  { label: 'Button border',        cssVar: '--atom-border-default-border-default',                tokenKey: 'atom.border.default.border-default',                fallback: '#cdcbcb' },
  { label: 'Card bg (Card only)',  cssVar: '--atom-background-primary-bg-primary-inverse',        tokenKey: 'atom.background.primary.bg-primary-inverse',        fallback: '#ffffff' },
  { label: 'Card border',          cssVar: '--atom-border-default-border-default',                tokenKey: 'atom.border.default.border-default',                fallback: '#cdcbcb' },
  { label: 'Value label fg',       cssVar: '--atom-foreground-primary-fg-brand-primary',          tokenKey: 'atom.foreground.primary.fg-brand-primary',          fallback: '#0a2333' },
  { label: 'Card title fg',        cssVar: '--atom-foreground-primary-fg-brand-primary',          tokenKey: 'atom.foreground.primary.fg-brand-primary',          fallback: '#0a2333' },
  { label: 'Card subtitle fg',     cssVar: '--atom-foreground-core-fg-secondary',                 tokenKey: 'atom.foreground.core.fg-secondary',                 fallback: '#737272' },
] as const;

const A11Y_ROWS = [
  { icon: '⌨️', title: 'Keyboard interaction', body: 'Both the minus and plus buttons receive focus individually. Use Arrow Up / Arrow Down on the numeric label (or Space / Enter on the buttons) to increment / decrement. Typing a number overwrites the value.' },
  { icon: '🏷️', title: 'Labelling', body: 'Pair the Stepper with a visible label (e.g. "Adults", "Tickets") using aria-labelledby. Give each button its own aria-label — "Decrease quantity", "Increase quantity".' },
  { icon: '🔢', title: 'Value announcements', body: 'Use role="spinbutton" on the numeric label with aria-valuenow, aria-valuemin, aria-valuemax so the current count is announced when it changes.' },
  { icon: '🚫', title: 'Bounds & disabled', body: 'Disable the minus button at min and the plus button at max — do not silently ignore clicks. Disabled buttons announce their state via aria-disabled.' },
  { icon: '📏', title: 'Target size', body: 'Small (20×20) is for compact inline contexts like list rows. Default (32×32) and Large (40×40) meet WCAG 2.5.5 44×44 target area once padding is included; Small requires a larger surrounding hit area.' },
  { icon: '🎨', title: 'Color contrast', body: 'Style 1 stroke glyph on white surface ≥ 4.5:1 via atom.foreground.primary.fg-brand-primary. Style 2 white glyph on brand-primary fill ≥ 4.5:1. Border passes 3:1 for non-text contrast.' },
];

// ─────────────────────────────────────────────────────────────────────────────
export function StepperPage({ brand }: StepperPageProps) {
  const [size, setSize] = useState<StepperSize>('Small');
  const [style, setStyle] = useState<StepperStyle>('1');
  const [label, setLabel] = useState('0');

  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  // Card variant is paired with Style=2 in Figma; keep the user's latest choice but
  // surface the authentic combination in the preview when useful.
  const previewKey = `${size}|${style}|${label}`;

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-[360px]">
            {/* Canvas */}
            <div className="flex-1 flex items-center justify-center p-12" style={DOTTED_BG}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.14 }}
                >
                  <StepperPreview size={size} style={style} label={label} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls rail */}
            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5 overflow-y-auto">
              <ControlSection title="Stepper (size)">
                <PillSelect options={ALL_SIZES} active={size} onChange={setSize} />
              </ControlSection>

              <ControlSection title="Style">
                <PillSelect options={ALL_STYLES} active={style} onChange={setStyle} />
              </ControlSection>

              <ControlSection title="Text">
                <TextField label="Label" value={label} onChange={setLabel} />
              </ControlSection>

              {size === 'Card' && style === '1' && (
                <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 leading-relaxed">
                  In Figma, Card pairs with Style 2 (solid brand-coloured buttons). Switch Style to <strong>2</strong> to match the authored variant.
                </p>
              )}
              {size !== 'Card' && style === '2' && (
                <p className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 leading-relaxed">
                  Style 2 is authored only on the Card size in Figma. Preview still renders to show the treatment applied at this size.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Stepper</h1>
            <p className="text-slate-500 text-sm max-w-xl">
              A compact numeric increment / decrement control. Three inline sizes (Small, Default, Large) in Style 1 —
              an unfilled circular button on each side of the value — and a Card presentation (Style 2) that wraps the
              same control in a product-row layout with title and subtitle.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.25" />
                <path d="M5 3v3M5 7.5v.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              </svg>
              Input
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Stable
            </span>
          </div>
        </div>
      </section>

      <hr className="border-slate-200" />

      {/* ── 3. ANATOMY ───────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Anatomy</h2>
        <p className="text-sm text-slate-500 mb-5">
          Three slots in Style 1; Card adds a wrapping surface with title and subtitle.
        </p>

        <div className="relative flex items-center justify-center py-20 px-8 rounded-xl" style={DOTTED_BG}>
          <StepperPreview size="Large" style="1" label="2" />
        </div>

        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {[
            { num: '1', name: 'Decrement button', desc: 'Circular button on the left. Fires a −1 step. Disabled at min. Style 1 = stroked glyph, Style 2 = solid brand-coloured fill with white glyph.' },
            { num: '2', name: 'Value label',      desc: 'Numeric label between the two buttons. Tabular-nums so the width stays stable as digits change. Inherits atom.foreground.primary.fg-brand-primary.' },
            { num: '3', name: 'Increment button', desc: 'Circular button on the right. Fires a +1 step. Disabled at max. Same styling rules as the decrement button.' },
            { num: '4', name: 'Card wrapper',     desc: 'Only on size=Card. 245×114.5px container, 24px padding, 8px radius, 1px subtle border. Holds a title and subtitle alongside the stepper control on the right.' },
            { num: '5', name: 'Card title',       desc: 'Used only in Card layout. 14px / weight 600. Describes what the stepper is incrementing (e.g. "Select Ticket").' },
            { num: '6', name: 'Card subtitle',    desc: 'Used only in Card layout. 12px / fg-secondary. Adds ticket tier, size, or any meta detail.' },
          ].map((row) => (
            <div key={row.num} style={{ display: 'flex', gap: '10px', padding: '12px', borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827', flexShrink: 0, marginTop: '1px', minWidth: '12px' }}>{row.num}</span>
              <div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#111827' }}>{row.name}</p>
                <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#6b7280', lineHeight: 1.4 }}>{row.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. VARIANTS ──────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-4">Variants</h2>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">Property</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Values</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  label: 'Stepper (size)',
                  chips: [
                    { text: 'Small',   note: 'default · 20px · inline' },
                    { text: 'Default', note: '32px · inline' },
                    { text: 'Large',   note: '40px · inline' },
                    { text: 'Card',    note: '245×114.5 · card layout' },
                  ],
                },
                {
                  label: 'Style',
                  chips: [
                    { text: '1', note: 'default · stroked buttons' },
                    { text: '2', note: 'solid filled buttons · paired with Card' },
                  ],
                },
                {
                  label: 'Text slots (1)',
                  chips: [
                    { text: 'Label', note: 'default "0"' },
                  ],
                },
                {
                  label: 'Font family',
                  chips: [
                    { text: 'Poppins',  note: 'Dragonpass' },
                    { text: 'Arial',    note: 'Mastercard' },
                    { text: 'Inter',    note: 'Investec' },
                    { text: 'Manrope',  note: 'Visa · Greyscale' },
                    { text: 'Lato',     note: 'Assurant' },
                  ],
                },
              ].map((row, i, arr) => (
                <tr key={row.label} className={i < arr.length - 1 ? 'border-b border-slate-100' : ''}>
                  <td className="px-5 py-3.5 font-medium text-slate-700 text-sm align-top">{row.label}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      {row.chips.map(({ text, note }) => (
                        <span key={text} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium">
                          {text}{note && <span className="text-slate-400 font-normal">· {note}</span>}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual preview of all 4 authored variants */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { title: 'Small / 1',   size: 'Small'   as StepperSize, style: '1' as StepperStyle },
            { title: 'Default / 1', size: 'Default' as StepperSize, style: '1' as StepperStyle },
            { title: 'Large / 1',   size: 'Large'   as StepperSize, style: '1' as StepperStyle },
            { title: 'Card / 2',    size: 'Card'    as StepperSize, style: '2' as StepperStyle },
          ].map((card) => (
            <div key={card.title} style={{
              padding: '20px', borderRadius: '10px',
              border: '1px solid #f3f4f6', backgroundColor: '#fafafa',
              display: 'flex', flexDirection: 'column', gap: '12px',
              alignItems: card.size === 'Card' ? 'stretch' : 'flex-start',
              minHeight: card.size === 'Card' ? '180px' : '120px',
            }}>
              <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: '#6b7280' }}>{card.title}</p>
              <StepperPreview size={card.size} style={card.style} label="0" />
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Design Tokens</h2>
        <p className="text-sm text-slate-500 mb-4">
          Tokens below resolve per active brand via the <code className="text-xs bg-slate-100 px-1 rounded">Brand Switcher → Atom</code> cascade.
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">Usage</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">CSS variable</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">Value ({brand})</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_TABLE_ROWS.map((row, i) => {
                const resolved = (tokens as Record<string, string>)[row.tokenKey] ?? row.fallback;
                const raw = resolved.replace('#', '').slice(0, 6);
                const r = parseInt(raw.slice(0, 2), 16);
                const g = parseInt(raw.slice(2, 4), 16);
                const b = parseInt(raw.slice(4, 6), 16);
                const light = (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
                return (
                  <tr key={row.label + i} className={i < TOKEN_TABLE_ROWS.length - 1 ? 'border-b border-slate-100' : ''}>
                    <td className="px-5 py-3 font-medium text-slate-700 text-xs">{row.label}</td>
                    <td className="px-5 py-3">
                      <code className="font-mono text-xs text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                        {row.cssVar}
                      </code>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded flex-shrink-0 border border-black/10" style={{ backgroundColor: resolved }} />
                        <span className="font-mono text-xs px-1.5 py-0.5 rounded border"
                          style={{
                            backgroundColor: resolved,
                            color: light ? '#1e293b' : '#f8fafc',
                            borderColor: light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)',
                          }}>
                          {resolved.toUpperCase()}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 6. ACCESSIBILITY ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Accessibility</h2>
        <p className="text-sm text-slate-500 mb-4">Guidelines for implementing Stepper inclusively across brands.</p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm divide-y divide-slate-100">
          {A11Y_ROWS.map((row, i) => (
            <div key={row.title} className={['flex items-start gap-4 px-5 py-4', i % 2 === 1 ? 'bg-slate-50/50' : ''].join(' ')}>
              <span className="text-xl flex-shrink-0 mt-0.5" aria-hidden="true">{row.icon}</span>
              <div>
                <p className="text-sm font-semibold text-slate-800">{row.title}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{row.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. USAGE ─────────────────────────────────────────────────────────── */}
      <section>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>Usage</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          When to use each size and style.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
          {[
            { title: 'Small (Style 1)',   color: '#0a2333', bg: '#f0f4f8', when: 'Inline edits inside list rows or tight form cells. The 20px footprint fits next to product thumbnails without dominating the layout.' },
            { title: 'Default (Style 1)', color: '#0a2333', bg: '#f9fafb', when: 'Standard form usage — bookings, ticket counts, quantity fields. Hits the comfortable 32px target on desktop.' },
            { title: 'Large (Style 1)',   color: '#0a2333', bg: '#f8fafc', when: 'Mobile-first flows or primary purchase screens where the stepper is the hero control on the page.' },
            { title: 'Card (Style 2)',    color: '#166534', bg: '#f0fdf4', when: 'Product rows where each line item is its own tile — ticket tiers, add-ons, passenger counts. Combines title + subtitle + stepper in one container.' },
            { title: 'Paired labelling',  color: '#4338ca', bg: '#eef2ff', when: 'Always render a visible label (or visible title in the Card variant) — the numeric glyph alone is not a label. Pair with aria-labelledby.' },
            { title: 'Bounds handling',   color: '#9a3412', bg: '#fff7ed', when: 'Disable the minus button at the minimum value and the plus button at the maximum. Never silently ignore clicks — users need feedback that they have hit a limit.' },
          ].map((card) => (
            <div key={card.title} style={{ padding: '14px 16px', borderRadius: '10px', border: `1px solid ${card.color}22`, backgroundColor: card.bg }}>
              <p style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: 600, color: card.color }}>{card.title}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#4b5563', lineHeight: 1.5 }}>{card.when}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>✓ When to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>• Bounded, integer-valued fields — quantity, passenger count</li>
              <li style={{ marginBottom: '6px' }}>• Lists where each row has its own quantity control</li>
              <li style={{ marginBottom: '6px' }}>• Ticket-tier cards where price depends on count</li>
              <li style={{ marginBottom: '6px' }}>• Accessibility requires keyboard + screen reader support</li>
              <li>• Disable minus at min, plus at max — give the user feedback</li>
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>✗ When not to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>• Don't use for decimal, currency, or date fields — use Input</li>
              <li style={{ marginBottom: '6px' }}>• Don't use for ranges larger than ~99 — use a text field</li>
              <li style={{ marginBottom: '6px' }}>• Don't pair Card size with Style 1 — Style 2 is the authored combination</li>
              <li style={{ marginBottom: '6px' }}>• Don't omit a visible label — placeholder digits ≠ a label</li>
              <li>• Don't use for selecting a process stage — use Steps instead</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
