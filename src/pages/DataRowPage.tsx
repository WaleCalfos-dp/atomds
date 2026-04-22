import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DataRowLive,
  type DataRowType,
  type DataRowPosition,
  type DataRowProductModule,
} from '../components/data-row/DataRowLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

interface DataRowPageProps {
  brand: Brand;
}

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const ALL_TYPES:     DataRowType[]          = ['Single-line', 'Multi-line', 'Multi-line + Icon'];
const ALL_POSITIONS: DataRowPosition[]      = ['First and Middle', 'Last'];
const ALL_MODULES:   DataRowProductModule[] = ['All', 'Transport'];

type TokenRow = { label: string; cssVar: string; tokenKey: string; fallback: string };

const TOKEN_TABLE_ROWS: TokenRow[] = [
  { label: 'Label',          cssVar: '--atom-foreground-core-fg-secondary',      tokenKey: 'atom.foreground.core.fg-secondary',      fallback: '#737272' },
  { label: 'Value',          cssVar: '--atom-foreground-primary-fg-brand-primary', tokenKey: 'atom.foreground.primary.fg-brand-primary', fallback: '#0a2333' },
  { label: 'Body / caption', cssVar: '--atom-foreground-core-fg-primary',        tokenKey: 'atom.foreground.core.fg-primary',        fallback: '#4b4a4a' },
  { label: 'Icon / divider', cssVar: '--atom-foreground-core-fg-tertiary',       tokenKey: 'atom.foreground.core.fg-tertiary',       fallback: '#afaead' },
  { label: 'Row divider',    cssVar: '--atom-border-default-border-divider',     tokenKey: 'atom.border.default.border-divider',     fallback: '#cdcbcb' },
];

const A11Y_ROWS = [
  { icon: '📋', title: 'Label / value pairing', body: 'Associate the label with its value using aria-describedby, or render them in a definition list (<dl><dt><dd>) so assistive tech reads the relationship aloud.' },
  { icon: '🎨', title: 'Contrast',              body: 'Label (fg-secondary), Value (fg-brand-primary), and divider (border-divider) tokens all meet WCAG AA contrast on the surface background across every brand.' },
  { icon: '🔤', title: "Don't rely on colour alone", body: 'Badges, icons, and typography must reinforce state — never communicate meaning through colour only. Pair every coloured badge with a visible text label.' },
  { icon: '⌨️', title: 'Keyboard affordances',  body: 'When the row ends with a Chevron Right or Button, the interactive element is the trailing control — not the whole row. It must be focusable and activate on Enter or Space.' },
  { icon: '🛬', title: 'Transport module',      body: 'Flight lockups use tabular numerals for times / codes so screen magnifiers don\'t reflow glyphs. Origin and destination are two separate spans, announced in reading order.' },
  { icon: '📏', title: 'Row divider',           body: 'Set Position=Last on the final row of a grouping so the divider disappears. Never rely on a missing divider to imply hierarchy — always pair with visual spacing.' },
];

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

export function DataRowPage({ brand }: DataRowPageProps) {
  const [type,          setType]          = useState<DataRowType>('Single-line');
  const [position,      setPosition]      = useState<DataRowPosition>('First and Middle');
  const [productModule, setProductModule] = useState<DataRowProductModule>('All');
  const [showChevron,   setShowChevron]   = useState(false);
  const [showBadge,     setShowBadge]     = useState(false);
  const [showButton,    setShowButton]    = useState(false);
  const [showIcon,      setShowIcon]      = useState(false);

  // Transport locks Type to Multi-line (no Single-line Transport in Figma).
  const effectiveType: DataRowType = productModule === 'Transport' ? 'Multi-line' : type;

  const previewKey = [effectiveType, position, productModule, showChevron, showBadge, showButton, showIcon].join('-');
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-72">
            <div className="flex-1 flex items-center justify-center p-12 min-h-52" style={DOTTED_BG}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                  style={{ width: '100%', maxWidth: '360px' }}
                >
                  <DataRowLive
                    type={effectiveType}
                    position={position}
                    productModule={productModule}
                    showChevronRight={showChevron}
                    showBadge={showBadge}
                    showButton={showButton}
                    showIcon={showIcon}
                    brand={brand}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5 overflow-y-auto">

              {/* Type */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Type</p>
                <div className={['flex flex-wrap gap-1.5', productModule === 'Transport' ? 'opacity-50' : ''].join(' ')}>
                  {ALL_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => productModule !== 'Transport' && setType(t)}
                      disabled={productModule === 'Transport'}
                      className={[
                        'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        effectiveType === t
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {productModule === 'Transport' && (
                  <p className="text-[11px] text-slate-400 mt-1">Transport rows are always Multi-line.</p>
                )}
              </div>

              {/* Position */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Position</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_POSITIONS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPosition(p)}
                      className={[
                        'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        position === p
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Module */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Product Module</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_MODULES.map((m) => (
                    <button
                      key={m}
                      onClick={() => setProductModule(m)}
                      className={[
                        'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        productModule === m
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Booleans */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Booleans</p>
                <div className="flex flex-col gap-1.5">
                  {[
                    { label: 'Icon',          value: showIcon,    set: setShowIcon },
                    { label: 'Chevron Right', value: showChevron, set: setShowChevron },
                    { label: 'Badge',         value: showBadge,   set: setShowBadge },
                    { label: 'Button',        value: showButton,  set: setShowButton },
                  ].map(({ label, value, set }) => (
                    <label key={label} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => set(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 accent-slate-900"
                      />
                      <span className="text-xs text-slate-600">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ────────────────────────────────────────────── */}
      <section>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Data Row</h1>
        <p className="text-[15px] text-slate-500 leading-relaxed mb-4 max-w-2xl">
          A label / value row for summaries, receipts, and confirmation screens. Supports three layout
          types (Single-line, Multi-line, Multi-line + Icon), a Position axis to control the row divider,
          and a dedicated Transport module with an origin → destination flight lockup.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-slate-200 bg-slate-50 text-xs text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Structural
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-emerald-200 bg-emerald-50 text-xs text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Stable
          </span>
        </div>
      </section>

      {/* ── 3. ANATOMY ───────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Anatomy</h2>
        <p className="text-sm text-slate-500 mb-4">The parts that make up a Data Row in Figma.</p>
        <div className="grid md:grid-cols-2 gap-6 rounded-xl border border-slate-200 bg-white shadow-sm p-6">
          <div className="flex items-center justify-center p-6 rounded-lg border border-slate-100 bg-slate-50">
            <div style={{ width: '320px' }}>
              <DataRowLive type="Multi-line + Icon" position="First and Middle" showChevronRight showBadge showIcon brand={brand} />
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-12">#</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">Label</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { n: 1, label: 'Leading icon',  body: '36×36 rounded square shown only for Multi-line + Icon. Background uses bg-muted; glyph uses fg-secondary.' },
                  { n: 2, label: 'Label',         body: 'Descriptor for the paired value. 12–13px, weight 500, colour fg-secondary. Wraps onto its own line for Multi-line types.' },
                  { n: 3, label: 'Value',         body: 'The primary datum (or origin → destination for Transport). 13px, weight 600, colour fg-brand-primary.' },
                  { n: 4, label: 'Trailing slot', body: 'Optional stack of Badge / Chevron Right / Button. Shrinks around the value.' },
                  { n: 5, label: 'Row divider',   body: '1px hairline using border-divider. Hidden when Position = Last so groups end cleanly.' },
                ].map((row, i, arr) => (
                  <tr key={row.n} className={i < arr.length - 1 ? 'border-b border-slate-100' : ''}>
                    <td className="px-4 py-2.5 text-xs text-slate-500 font-mono">{row.n}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-700 font-medium">{row.label}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-500">{row.body}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 4. VARIANTS ──────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-4">Variants</h2>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">Property</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Values</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Type',            chips: [{text: 'Single-line', note: 'Default'}, {text: 'Multi-line', note: ''}, {text: 'Multi-line + Icon', note: ''}] },
                { label: 'Position',        chips: [{text: 'First and Middle', note: 'Default'}, {text: 'Last', note: ''}] },
                { label: 'Product Module',  chips: [{text: 'All', note: 'Default'}, {text: 'Transport', note: ''}] },
                { label: 'Booleans (10)',   chips: [
                  {text: 'Chevron Right', note: ''}, {text: 'Badge', note: ''}, {text: 'Icon', note: ''},
                  {text: 'Content Right', note: ''}, {text: 'Country Flags', note: ''}, {text: 'Icon Right', note: ''},
                  {text: 'Data 1', note: ''}, {text: 'Data 2', note: ''}, {text: 'Data 3', note: ''}, {text: 'Button', note: ''},
                ]},
                { label: 'Text slots (4)',  chips: [{text: 'Label', note: ''}, {text: 'Data 1 Text', note: ''}, {text: 'Data 2 Text', note: ''}, {text: 'Data 3 Text', note: ''}] },
                { label: 'Font family',     chips: [
                  {text: 'Poppins', note: 'Dragonpass'}, {text: 'Arial', note: 'Mastercard'}, {text: 'Inter', note: 'Investec'},
                  {text: 'Manrope', note: 'Visa · Greyscale'}, {text: 'Lato', note: 'Assurant'},
                ]},
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

        {/* Visual preview grid — representative variants */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {[
            { label: 'Single-line · First/Mid',        t: 'Single-line'       as DataRowType, p: 'First and Middle' as DataRowPosition, m: 'All'       as DataRowProductModule },
            { label: 'Single-line · Last',             t: 'Single-line'       as DataRowType, p: 'Last'              as DataRowPosition, m: 'All'       as DataRowProductModule },
            { label: 'Multi-line · First/Mid',         t: 'Multi-line'        as DataRowType, p: 'First and Middle' as DataRowPosition, m: 'All'       as DataRowProductModule },
            { label: 'Multi-line + Icon · First/Mid',  t: 'Multi-line + Icon' as DataRowType, p: 'First and Middle' as DataRowPosition, m: 'All'       as DataRowProductModule },
            { label: 'Transport · First/Mid',          t: 'Multi-line'        as DataRowType, p: 'First and Middle' as DataRowPosition, m: 'Transport' as DataRowProductModule },
            { label: 'Transport · Last',               t: 'Multi-line'        as DataRowType, p: 'Last'              as DataRowPosition, m: 'Transport' as DataRowProductModule },
          ].map(({ label, t, p, m }) => (
            <div key={label} style={{
              borderRadius: '12px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa',
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid #f3f4f6', backgroundColor: '#ffffff' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#374151' }}>{label}</p>
              </div>
              <div style={{ flex: 1, padding: '24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', ...DOTTED_BG }}>
                <div style={{ width: '320px' }}>
                  <DataRowLive type={t} position={p} productModule={m} brand={brand} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Design Tokens</h2>
        <p className="text-sm text-slate-500 mb-4">All colour decisions are token-backed. Values update with the brand selector.</p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">Token</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">CSS Variable</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">Value</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_TABLE_ROWS.map((row, i) => {
                const resolvedValue = (tokens[row.tokenKey as keyof typeof tokens] as string | undefined) ?? row.fallback;
                const swatchHex = resolvedValue.length > 7 ? resolvedValue.slice(0, 7) : resolvedValue;
                const light = isLightColor(swatchHex);
                return (
                  <tr key={row.cssVar} className={i < TOKEN_TABLE_ROWS.length - 1 ? 'border-b border-slate-100' : ''}>
                    <td className="px-5 py-3 font-medium text-slate-700 text-xs">{row.label}</td>
                    <td className="px-5 py-3">
                      <code className="font-mono text-xs text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                        {row.cssVar}
                      </code>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded flex-shrink-0 border border-black/10" style={{ backgroundColor: swatchHex }} />
                        <span className="font-mono text-xs px-1.5 py-0.5 rounded border"
                          style={{ backgroundColor: swatchHex, color: light ? '#1e293b' : '#f8fafc', borderColor: light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)' }}>
                          {swatchHex.toUpperCase()}
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

      {/* ── 6. ACCESSIBILITY ─────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Accessibility</h2>
        <p className="text-sm text-slate-500 mb-4">Guidelines for implementing Data Row inclusively.</p>
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

      {/* ── 7. USAGE ─────────────────────────────────────────────────────── */}
      <section>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>Usage</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          When and how to use Data Row. For grouped layouts, see Data Group and Data Group (No Slot).
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>✓ When to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>• Receipts, confirmations, and summary screens</li>
              <li style={{ marginBottom: '6px' }}>• Bookings with origin → destination (Transport module)</li>
              <li style={{ marginBottom: '6px' }}>• Profile / membership detail pages</li>
              <li style={{ marginBottom: '6px' }}>• Any label / value list where read-scanning matters</li>
              <li>• Set Position=Last on the final row so the divider disappears</li>
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>✗ When not to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>• Dense tabular data with many columns — use a Table</li>
              <li style={{ marginBottom: '6px' }}>• Selectable list items — use List Item or Checkbox</li>
              <li style={{ marginBottom: '6px' }}>• Marketing hero blocks with free-form layout</li>
              <li style={{ marginBottom: '6px' }}>• Forms — labels belong above inputs, not adjacent to them</li>
              <li>• Don\u2019t mix Transport and non-Transport rows in the same group</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
