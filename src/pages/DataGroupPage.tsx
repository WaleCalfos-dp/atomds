import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DataGroupLive,
  type DataGroupType,
  type DataGroupProductModule,
} from '../components/data-row/DataGroupLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

interface DataGroupPageProps {
  brand: Brand;
}

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// Figma order on the component set:
const ALL_TYPES:   DataGroupType[]          = ['Group 2', 'Group 1', 'Single', 'Multiple'];
const ALL_MODULES: DataGroupProductModule[] = ['Default', 'Flight'];

type TokenRow = { label: string; cssVar: string; tokenKey: string; fallback: string };

const TOKEN_TABLE_ROWS: TokenRow[] = [
  { label: 'Container surface', cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff' },
  { label: 'Container border',  cssVar: '--atom-border-default-border-default',         tokenKey: 'atom.border.default.border-default',         fallback: '#cdcbcb' },
  { label: 'Row divider',       cssVar: '--atom-border-default-border-divider',         tokenKey: 'atom.border.default.border-divider',         fallback: '#cdcbcb' },
  { label: 'Row label',         cssVar: '--atom-foreground-core-fg-secondary',          tokenKey: 'atom.foreground.core.fg-secondary',          fallback: '#737272' },
  { label: 'Row value',         cssVar: '--atom-foreground-primary-fg-brand-primary',   tokenKey: 'atom.foreground.primary.fg-brand-primary',   fallback: '#0a2333' },
];

const A11Y_ROWS = [
  { icon: '📋', title: 'List semantics', body: 'A Data Group is a list of related rows — render as <ul>/<li> or <dl>/<dt>/<dd> so assistive tech announces the count and reading order.' },
  { icon: '🧠', title: 'Grouping signal', body: 'The rounded container + 1px border communicates "one logical block". Don\'t nest Data Groups inside Data Groups — flatten instead.' },
  { icon: '🎨', title: 'Contrast',        body: 'Container border, row divider, label, and value tokens all meet WCAG AA contrast on the inverse surface across every brand.' },
  { icon: '⌨️', title: 'Keyboard order',  body: 'If rows contain interactive trailing controls (Chevron, Button) tab order follows DOM order — top row first, bottom row last. Never reorder visually without matching DOM.' },
  { icon: '🛬', title: 'Flight module',   body: 'Flight-mode groups stack outbound above return. Read origin → destination times as separate spans so magnifiers don\'t reflow glyphs.' },
  { icon: '📏', title: 'Last-row divider', body: 'The Data Group component auto-hides the divider on the final row (Position=Last). Don\'t add manual spacing below the container — let the group\'s own border close the block.' },
];

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

export function DataGroupPage({ brand }: DataGroupPageProps) {
  const [type,          setType]          = useState<DataGroupType>('Group 1');
  const [productModule, setProductModule] = useState<DataGroupProductModule>('Default');

  const previewKey = [type, productModule].join('-');
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-80">
            <div className="flex-1 flex items-center justify-center p-10 min-h-60" style={DOTTED_BG}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                >
                  <DataGroupLive type={type} productModule={productModule} brand={brand} />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5 overflow-y-auto">

              {/* Type */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Type</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={[
                        'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        type === t
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {t}
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

              {/* Booleans note */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Booleans</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Nine booleans toggle individual row visibility in Figma — <span className="font-medium text-slate-600">Data Row 1–6</span>, <span className="font-medium text-slate-600">Data Row (Last)</span>, <span className="font-medium text-slate-600">Slot</span>, and <span className="font-medium text-slate-600">Icon Left</span>. The preview composes the full preset for each Type; use Figma to toggle individual rows.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ────────────────────────────────────────────── */}
      <section>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Data Group</h1>
        <p className="text-[15px] text-slate-500 leading-relaxed mb-4 max-w-2xl">
          A rounded container that groups two or more Data Rows into a single visual block, with a built-in divider between rows and a clean edge on the last row. Ships in four Types (Single, Multiple, Group 1, Group 2) and two Product Modules (Default, Flight).
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
        <p className="text-sm text-slate-500 mb-4">The parts that make up a Data Group in Figma.</p>
        <div className="grid md:grid-cols-2 gap-6 rounded-xl border border-slate-200 bg-white shadow-sm p-6">
          <div className="flex items-center justify-center p-6 rounded-lg border border-slate-100 bg-slate-50">
            <DataGroupLive type="Group 1" productModule="Default" brand={brand} />
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
                  { n: 1, label: 'Container',       body: '8px rounded rectangle with 1px border using border-default on bg-primary-inverse. Pads 16px horizontal; rows provide their own vertical padding.' },
                  { n: 2, label: 'Data Row(s)',     body: 'Each row is an instance of the Data Row component. Position is automatically set to First and Middle on non-terminal rows, Last on the final row.' },
                  { n: 3, label: 'Row divider',     body: '1px hairline using border-divider rendered between adjacent rows. Hidden on the last row so the container border closes the group cleanly.' },
                  { n: 4, label: 'Slot (optional)', body: 'Figma\'s Slot boolean exposes a flexible region inside the container — typically a button row, image, or inline form. Disabled by default.' },
                  { n: 5, label: 'Leading icon',    body: 'Icon Left boolean shows a 36×36 icon on the first row only (Flight module uses it for the outbound plane glyph).' },
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
                { label: 'Type',           chips: [{text: 'Group 2', note: ''}, {text: 'Group 1', note: 'Default'}, {text: 'Single', note: ''}, {text: 'Multiple', note: ''}] },
                { label: 'Product Module', chips: [{text: 'Default', note: 'Default'}, {text: 'Flight', note: ''}] },
                { label: 'Booleans (9)',   chips: [
                  {text: 'Data Row 1', note: ''}, {text: 'Data Row 2', note: ''}, {text: 'Data Row 3', note: ''},
                  {text: 'Data Row 4', note: ''}, {text: 'Data Row 5', note: ''}, {text: 'Data Row 6', note: ''},
                  {text: 'Data Row (Last)', note: ''}, {text: 'Slot', note: ''}, {text: 'Icon Left', note: ''},
                ]},
                { label: 'Text slots',     chips: [{text: 'None — content is supplied by child Data Rows', note: ''}] },
                { label: 'Font family',    chips: [
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
            { label: 'Single · Default',   t: 'Single'   as DataGroupType, m: 'Default' as DataGroupProductModule },
            { label: 'Single · Flight',    t: 'Single'   as DataGroupType, m: 'Flight'  as DataGroupProductModule },
            { label: 'Multiple · Default', t: 'Multiple' as DataGroupType, m: 'Default' as DataGroupProductModule },
            { label: 'Multiple · Flight',  t: 'Multiple' as DataGroupType, m: 'Flight'  as DataGroupProductModule },
            { label: 'Group 1 · Default',  t: 'Group 1'  as DataGroupType, m: 'Default' as DataGroupProductModule },
            { label: 'Group 2 · Default',  t: 'Group 2'  as DataGroupType, m: 'Default' as DataGroupProductModule },
          ].map(({ label, t, m }) => (
            <div key={label} style={{
              borderRadius: '12px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa',
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid #f3f4f6', backgroundColor: '#ffffff' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#374151' }}>{label}</p>
              </div>
              <div style={{ flex: 1, padding: '24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', ...DOTTED_BG }}>
                <DataGroupLive type={t} productModule={m} brand={brand} />
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
        <p className="text-sm text-slate-500 mb-4">Guidelines for implementing Data Group inclusively.</p>
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
          When and how to use Data Group. For flush, borderless listings (e.g. inside another card), use Data Group (No Slot) with Border=Off.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>✓ When to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>• Grouped label/value detail blocks (profile, receipt)</li>
              <li style={{ marginBottom: '6px' }}>• Flight itineraries (Product Module = Flight)</li>
              <li style={{ marginBottom: '6px' }}>• Summary sections inside confirmation flows</li>
              <li style={{ marginBottom: '6px' }}>• 2–6 related rows that belong together visually</li>
              <li>• Set Type=Single for a one-row group (no rounded container)</li>
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>✗ When not to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>• More than 6 rows — split into multiple groups</li>
              <li style={{ marginBottom: '6px' }}>• Nesting another Data Group inside a Data Group</li>
              <li style={{ marginBottom: '6px' }}>• Selectable/actionable lists — use List Item instead</li>
              <li style={{ marginBottom: '6px' }}>• Inside another bordered card — use No Slot, Border=Off</li>
              <li>• Mixing Transport rows with non-Transport rows in the same group</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
