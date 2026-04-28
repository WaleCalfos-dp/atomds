import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { StepperLive, type StepperSize, type StepperStyle } from '../components/stepper/StepperLive';

// ─────────────────────────────────────────────────────────────────────────────
// Figma source of truth
//   Component: Stepper (componentSet 1702:72060 in Atom file nKc4ep7mNdD5IqFRhNRNlW)
//   Purpose:   Allows users to increment or decrement numeric values.
//   Property surface:
//     VARIANT  Stepper → Small · Default · Large · Card   (default Small)
//     VARIANT  Style   → 1 · 2                             (default 1)
//     TEXT     Label   → default "0"
//   Concrete variants (4 shipped): Small/1 · Default/1 · Large/1 · Card/2
//   Dimensions (from Figma):
//     Small/1   81 × 20   inline · 16px gap · 20px icons
//     Default/1 105 × 32  inline · 16px gap · 32px icons
//     Large/1   121 × 40  inline · 16px gap · 40px icons
//     Card/2    245 × 114.5  card · 24px padding · 8px radius · 24px icons
//                 · 90×66.5 framed value display (28px heading/h1, top+bottom rule)
// ─────────────────────────────────────────────────────────────────────────────

interface StepperPageProps {
  brand: Brand;
}

const ALL_SIZES: StepperSize[] = ['Small', 'Default', 'Large', 'Card'];
const ALL_STYLES: StepperStyle[] = ['1', '2'];

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

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
  { label: 'Button border',            cssVar: '--atom-border-default-border-default',          tokenKey: 'atom.border.default.border-default',           fallback: '#cdcbcb' },
  { label: 'Button surface',           cssVar: '--atom-background-primary-bg-primary-inverse',  tokenKey: 'atom.background.primary.bg-primary-inverse',   fallback: '#ffffff' },
  { label: 'Button glyph (± fill)',    cssVar: '--atom-foreground-primary-fg-brand-primary',    tokenKey: 'atom.foreground.primary.fg-brand-primary',     fallback: '#0a2333' },
  { label: 'Value label',              cssVar: '--atom-foreground-primary-fg-brand-primary',    tokenKey: 'atom.foreground.primary.fg-brand-primary',     fallback: '#0a2333' },
  { label: 'Card surface (Style 2)',   cssVar: '--atom-background-primary-bg-primary-inverse',  tokenKey: 'atom.background.primary.bg-primary-inverse',   fallback: '#ffffff' },
  { label: 'Card border (Style 2)',    cssVar: '--atom-border-default-border-default',          tokenKey: 'atom.border.default.border-default',           fallback: '#cdcbcb' },
  { label: 'Value frame rule (Card)',  cssVar: '--atom-border-default-border-default',          tokenKey: 'atom.border.default.border-default',           fallback: '#cdcbcb' },
  { label: 'Inline gap (16px)',        cssVar: '--atom-space-tight',                            tokenKey: 'atom.border.default.border-default',           fallback: '16px' },
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
                  <StepperLive size={size} stepperStyle={style} label={label} />
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
                  In Figma, <strong>Card</strong> pairs with <strong>Style 2</strong>. Style 1 is authored only on Small / Default / Large.
                </p>
              )}
              {size !== 'Card' && style === '2' && (
                <p className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 leading-relaxed">
                  Style 2 is authored only on the Card size. The preview falls back to the Card treatment so you can see it.
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
              A compact numeric increment / decrement control. Three inline sizes (Small, Default, Large) in
              Style&nbsp;1 — an unfilled circular button on each side of the value — and a Card presentation
              (Style&nbsp;2) that frames a larger value between top + bottom rules inside a 245&nbsp;×&nbsp;114.5
              surface.
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
          Three slots in Style&nbsp;1. Style&nbsp;2 adds two more: the outer card surface and a framed value
          display between top + bottom rules.
        </p>

        <div className="relative flex items-center justify-center py-20 px-8 rounded-xl" style={DOTTED_BG}>
          <StepperLive size="Large" stepperStyle="1" label="2" />
        </div>

        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {[
            { num: '1', name: 'Decrement button', desc: 'Circular stroked button on the left. Fires a −1 step. Disabled at min. 20 / 32 / 40px for Small / Default / Large; 24px inside Card.' },
            { num: '2', name: 'Value label',      desc: 'Numeric label between the two buttons. Tabular-nums so the width stays stable as digits change. 14px Medium body token; 28px heading/h1 inside Card.' },
            { num: '3', name: 'Increment button', desc: 'Circular stroked button on the right. Fires a +1 step. Disabled at max. Mirrors the decrement button for size and stroke weight.' },
            { num: '4', name: 'Card surface',     desc: 'Style 2 only. 245 × 114.5 container, 24px padding all around, 8px radius, 1px border-default outline. Wraps the stepper row.' },
            { num: '5', name: 'Value frame',      desc: 'Style 2 only. 90 × 66.5 frame between the two buttons with 1px top + bottom rules (no left / right borders). Hosts the 28px heading-weight digit.' },
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
              <StepperLive size={card.size} stepperStyle={card.style} label="0" />
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
