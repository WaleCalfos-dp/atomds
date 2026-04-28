import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TimePickerLive,
  type TimePickerStyle,
  type TimePickerColumn,
  SHIPPED_COUNTS,
  SHIPPED_GRID_COLUMNS,
} from '../components/time-picker/TimePickerLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

interface TimePickerPageProps {
  brand: Brand;
}

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const ALL_STYLES: TimePickerStyle[] = ['Vertical', 'Grid', 'Scrollable'];

const COUNT_SINGLE   = ['1','2','3','4','5','6','7','8'];
const COUNT_2_COLUMN = ['2','4','6','8','10','12','14','16'].map(n => `${n} - 2 Column`);
const COUNT_4_COLUMN = ['4','8','12','16','20','24','32'].map(n => `${n} - 4 Column`);

type TokenRow = {
  label: string;
  cssVar: string;
  tokenKey?: string;
  fallback: string;
  styles?: TimePickerStyle[];
};

const TOKEN_TABLE_ROWS: TokenRow[] = [
  { label: 'Surface',             cssVar: '--atom-background-primary-bg-primary-inverse',        tokenKey: 'atom.background.primary.bg-primary-inverse',        fallback: '#ffffff' },
  { label: 'Body text',           cssVar: '--atom-foreground-primary-fg-brand-primary',          tokenKey: 'atom.foreground.primary.fg-brand-primary',          fallback: '#0a2333' },
  { label: 'Muted label',         cssVar: '--atom-foreground-core-fg-secondary',                 tokenKey: 'atom.foreground.core.fg-secondary',                 fallback: '#737272' },
  { label: 'Border',              cssVar: '--atom-border-default-border-default',                tokenKey: 'atom.border.default.border-default',                fallback: '#cdcbcb' },
  { label: 'Selected surface',    cssVar: '--atom-background-primary-bg-primary-pressed-brand',  tokenKey: 'atom.background.primary.bg-primary-pressed-brand',  fallback: '#0a2333' },
  { label: 'Selected text',       cssVar: '--atom-foreground-primary-fg-brand-primary-inverse',  tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse',  fallback: '#ffffff' },
  { label: 'Button background',   cssVar: '--atom-background-primary-bg-primary-default',        tokenKey: 'atom.background.primary.bg-primary-default',        fallback: '#0a2333' },
];

const A11Y_ROWS = [
  { icon: '⌨️', title: 'Keyboard navigation', body: 'Each selectable time cell must be a focusable <button> (or role="option" in a listbox). Vertical style: ArrowUp / ArrowDown cycles within a column, Tab moves between columns. Grid / Scrollable: arrow keys move across rows and columns; Enter or Space selects.' },
  { icon: '🏷️', title: 'Labelling', body: 'Wrap the picker in a region with aria-label="Time picker" (or similar context). When the picker is opened from an input, associate it via aria-controls on the trigger and aria-expanded to announce open/close.' },
  { icon: '📢', title: 'Announcing the selected time', body: 'Each cell must expose aria-selected or the chosen value via visible text that updates as the user scrolls. For Scrollable style, pair it with a live region so screen readers announce the currently snapped time.' },
  { icon: '🎨', title: 'Color contrast', body: 'Selected cells use bg-primary-pressed-brand with fg-brand-primary-inverse — meets WCAG AA 4.5:1 on all brands. The muted "HR / MIN / AM/PM" labels use fg-secondary; ensure the column labels remain ≥ 4.5:1 against the white surface.' },
  { icon: '📏', title: 'Touch target', body: 'Each cell is ≥ 44×44 CSS pixels (WCAG 2.5.5). Do not collapse spacing for dense Count variants — if a layout is too cramped, switch from Grid to Scrollable instead of shrinking cells.' },
  { icon: '🔁', title: 'Before / Current / After Time states', body: 'Past and future times in Figma\'s "Before Time" and "After Time" booleans must remain visually distinct from disabled. Disabled cells need aria-disabled="true" and reduced colour; soft-past ("Before Time") cells should stay interactive if business rules allow.' },
];

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

/** Sensible first-render count per Style. Mirrors TimePickerLive's prop default. */
const DEFAULT_COUNT: Record<TimePickerStyle, number> = {
  Vertical: 3,
  Scrollable: 1,
  Grid: 4,
};

export function TimePickerPage({ brand }: TimePickerPageProps) {
  const [pickerStyle, setPickerStyle] = useState<TimePickerStyle>('Vertical');
  const [count,       setCount]       = useState<number>(DEFAULT_COUNT.Vertical);
  const [column,      setColumn]      = useState<TimePickerColumn>(2);
  const [showButton,  setShowButton]  = useState(true);

  const validCounts  = SHIPPED_COUNTS[pickerStyle];
  const validColumns =
    pickerStyle === 'Grid' ? (SHIPPED_GRID_COLUMNS[count] ?? []) : [];

  // Switch Style → snap Count into the new Style's valid set.
  const handleStyleChange = (next: TimePickerStyle) => {
    setPickerStyle(next);
    const counts = SHIPPED_COUNTS[next];
    const fallback = DEFAULT_COUNT[next];
    const nextCount = counts.includes(count)
      ? count
      : counts.includes(fallback)
      ? fallback
      : counts[0];
    setCount(nextCount);

    if (next === 'Grid') {
      const cols = SHIPPED_GRID_COLUMNS[nextCount] ?? [2];
      if (!cols.includes(column)) setColumn(cols[0]);
    }
  };

  // Switch Count (within Grid) → snap Column if current value is no longer valid.
  const handleCountChange = (nextCount: number) => {
    setCount(nextCount);
    if (pickerStyle === 'Grid') {
      const cols = SHIPPED_GRID_COLUMNS[nextCount] ?? [2];
      if (!cols.includes(column)) setColumn(cols[0]);
    }
  };

  const previewKey = `${pickerStyle}-${count}-${column}-${showButton}`;
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-80">

            {/* Canvas */}
            <div className="flex-1 flex items-center justify-center p-8 min-h-52" style={DOTTED_BG}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                >
                  <TimePickerLive
                    style={pickerStyle}
                    count={count}
                    column={column}
                    showButton={showButton}
                    brand={brand}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5 overflow-y-auto">

              {/* Style */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Style</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_STYLES.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStyleChange(s)}
                      className={[
                        'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        pickerStyle === s
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Count */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Count</p>
                <div className="flex flex-wrap gap-1.5">
                  {validCounts.map((c) => (
                    <button
                      key={c}
                      onClick={() => handleCountChange(c)}
                      className={[
                        'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100 min-w-[2rem]',
                        count === c
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Column — Grid only */}
              {pickerStyle === 'Grid' && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Column</p>
                  <div className="flex flex-wrap gap-1.5">
                    {validColumns.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColumn(c)}
                        className={[
                          'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                          column === c
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                        ].join(' ')}
                      >
                        {c} Columns
                      </button>
                    ))}
                  </div>
                  {validColumns.length === 1 && (
                    <p className="mt-1.5 text-[11px] text-slate-400">
                      Count {count} is only authored for {validColumns[0]} Column in Figma.
                    </p>
                  )}
                </div>
              )}

              {/* Button */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Button</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showButton}
                    onChange={(e) => setShowButton(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 accent-slate-900"
                  />
                  <span className="text-xs text-slate-600">{showButton ? 'Visible' : 'Hidden'}</span>
                </label>
                <p className="mt-1.5 text-[11px] text-slate-400">
                  Informational — SVG exports do not bake in a Confirm button.
                </p>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                The <em>Primary Button</em>, <em>Secondary Button</em>, <em>Before Time</em>,
                <em> Current Time</em>, and <em>After Time</em> booleans are documented below.
              </p>

            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ────────────────────────────────────────────────── */}
      <section>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Time Picker</h1>
        <p className="text-[15px] text-slate-500 leading-relaxed mb-4 max-w-2xl">
          Lets users pick a specific time — either by scrolling hour / minute / AM-PM columns,
          choosing a preset slot from a 2- or 4-column grid, or swiping through a horizontal
          strip of times. Used for bookings, reminders, and any flow where time granularity matters.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-sky-200 bg-sky-50 text-xs text-sky-800">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            Input
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-emerald-200 bg-emerald-50 text-xs text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Stable
          </span>
        </div>
      </section>

      {/* ── 3. ANATOMY ───────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Anatomy</h2>
        <p className="text-sm text-slate-500 mb-4">The parts that make up a Time Picker in Figma.</p>
        <div className="grid md:grid-cols-2 gap-6 rounded-xl border border-slate-200 bg-white shadow-sm p-6">

          {/* Diagram */}
          <div className="flex items-center justify-center p-6 rounded-lg border border-slate-100 bg-slate-50">
            <TimePickerLive style="Vertical" count={3} showButton brand={brand} />
          </div>

          {/* Numbered parts */}
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
                  { n: 1, label: 'Container',        body: 'Rounded card with surface fill, border and soft drop shadow.' },
                  { n: 2, label: 'Column label',     body: 'Uppercase HR / MIN / AM-PM header (Vertical style only).' },
                  { n: 3, label: 'Time cell',        body: 'Individual selectable unit — hour, minute, meridiem, or preset slot.' },
                  { n: 4, label: 'Selected cell',    body: 'Brand-coloured pressed surface with inverse text for the current value.' },
                  { n: 5, label: 'Primary Button',   body: 'Optional "Confirm" action beneath the columns. Controlled by the Button boolean.' },
                  { n: 6, label: 'Secondary Button', body: 'Optional "Cancel" or similar low-emphasis action (Figma boolean).' },
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

      {/* ── 4. VARIANTS ──────────────────────────────────────────────────────── */}
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
                {
                  label: 'Style',
                  chips: [
                    { text: 'Vertical',    note: 'Default · 3-column scroll' },
                    { text: 'Grid',        note: '2-col preset slots' },
                    { text: 'Scrollable',  note: 'Horizontal strip' },
                  ],
                },
                {
                  label: 'Count',
                  chips: [
                    ...COUNT_SINGLE.map(c => ({ text: c, note: '' })),
                    ...COUNT_2_COLUMN.map(c => ({ text: c, note: '' })),
                    ...COUNT_4_COLUMN.map(c => ({ text: c, note: '' })),
                  ],
                },
                {
                  label: 'Booleans (6)',
                  chips: [
                    { text: 'Button',           note: '' },
                    { text: 'Primary Button',   note: '' },
                    { text: 'Secondary Button', note: '' },
                    { text: 'Before Time',      note: '' },
                    { text: 'Current Time',     note: '' },
                    { text: 'After Time',       note: '' },
                  ],
                },
                {
                  label: 'Text slots (0)',
                  chips: [
                    { text: 'None', note: 'Cells render numeric values directly' },
                  ],
                },
                {
                  label: 'Font family',
                  chips: [
                    { text: 'Poppins', note: 'Dragonpass' },
                    { text: 'Arial',   note: 'Mastercard' },
                    { text: 'Inter',   note: 'Investec' },
                    { text: 'Manrope', note: 'Visa · Greyscale' },
                    { text: 'Lato',    note: 'Assurant' },
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

        {/* Visual preview grid — one card per Style, rendering a representative shipped variant. */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { style: 'Vertical'   as TimePickerStyle, count: 3, column: 2 as TimePickerColumn, label: 'Vertical · 3'  },
            { style: 'Grid'       as TimePickerStyle, count: 8, column: 4 as TimePickerColumn, label: 'Grid · 8 · 4-col' },
            { style: 'Scrollable' as TimePickerStyle, count: 1, column: 2 as TimePickerColumn, label: 'Scrollable'    },
          ].map((v) => (
            <div key={v.label} style={{
              padding: '20px 24px', borderRadius: '10px',
              border: '1px solid #f3f4f6', backgroundColor: '#fafafa',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px',
              overflowX: 'auto',
            }}>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>{v.label}</p>
              <TimePickerLive style={v.style} count={v.count} column={v.column} showButton brand={brand} />
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Design Tokens</h2>
        <p className="text-sm text-slate-500 mb-4">
          Tokens consumed by every Time Picker style. Values update with the brand selector.
        </p>
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
                const isActive      = !row.styles || row.styles.includes(pickerStyle);
                const resolvedValue = row.tokenKey ? (tokens[row.tokenKey as keyof typeof tokens] ?? row.fallback) : row.fallback;
                const isHexColor    = resolvedValue.startsWith('#');
                const light         = isHexColor ? isLightColor(resolvedValue) : true;
                return (
                  <tr
                    key={row.cssVar}
                    className={[
                      i < TOKEN_TABLE_ROWS.length - 1 ? 'border-b border-slate-100' : '',
                      isActive ? 'bg-blue-50/60' : 'opacity-40',
                      'transition-all duration-150',
                    ].join(' ')}
                    style={isActive ? { borderLeft: '3px solid #3b82f6' } : { borderLeft: '3px solid transparent' }}
                  >
                    <td className="px-5 py-3 font-medium text-slate-700 text-xs">{row.label}</td>
                    <td className="px-5 py-3">
                      <code className="font-mono text-xs text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                        {row.cssVar}
                      </code>
                    </td>
                    <td className="px-5 py-3">
                      {isHexColor ? (
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded flex-shrink-0 border border-black/10" style={{ backgroundColor: resolvedValue }} />
                          <span className="font-mono text-xs px-1.5 py-0.5 rounded border"
                            style={{ backgroundColor: resolvedValue, color: light ? '#1e293b' : '#f8fafc', borderColor: light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)' }}>
                            {resolvedValue.toUpperCase()}
                          </span>
                        </div>
                      ) : (
                        <code className="font-mono text-xs text-slate-500">{resolvedValue}</code>
                      )}
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
        <p className="text-sm text-slate-500 mb-4">Guidelines for implementing Time Picker inclusively.</p>
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
          How to pick between the three styles depending on the flow.
        </p>

        {/* Per-style usage cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bae6fd', backgroundColor: '#f0f9ff' }}>
            <p style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: 600, color: '#075985' }}>Vertical</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#4b5563', lineHeight: 1.5 }}>
              The default. Use when the user needs arbitrary-minute precision — e.g. setting a reminder to 2:37 PM.
              Scrollable hour / minute / AM-PM columns give the widest range without overwhelming the screen.
            </p>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #c7d2fe', backgroundColor: '#eef2ff' }}>
            <p style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: 600, color: '#3730a3' }}>Grid</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#4b5563', lineHeight: 1.5 }}>
              Use for booking slots with fixed intervals (30 min, 1 hour). The 2-column layout scales up to 16 slots;
              the 4-column layout goes up to 32. Reach for Grid whenever the set of valid times is discrete and small.
            </p>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #d8b4fe', backgroundColor: '#faf5ff' }}>
            <p style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: 600, color: '#6b21a8' }}>Scrollable</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#4b5563', lineHeight: 1.5 }}>
              Compact horizontal strip. Best on narrow surfaces or when the valid range spans many hours but the user
              usually picks something nearby. Let users flick horizontally; highlight the current time in the middle.
            </p>
          </div>
        </div>

        {/* Do / Don't */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>✓ When to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>• Pair with a Date Picker when both date and time are required</li>
              <li style={{ marginBottom: '6px' }}>• Highlight the user\u2019s current time with the Current Time boolean</li>
              <li style={{ marginBottom: '6px' }}>• Offer a confirm Button when the picker lives inside a bottom sheet</li>
              <li style={{ marginBottom: '6px' }}>• Use 24-hour or 12-hour format based on locale / account settings</li>
              <li>• Disable Before Time slots that are no longer bookable</li>
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>✗ When not to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>• Don\u2019t use Grid with more than 32 slots \u2014 switch to Scrollable</li>
              <li style={{ marginBottom: '6px' }}>• Don\u2019t omit the confirm button when the selection is destructive</li>
              <li style={{ marginBottom: '6px' }}>• Don\u2019t mix 12-hour and 24-hour formats in the same flow</li>
              <li style={{ marginBottom: '6px' }}>• Don\u2019t shrink cells below a 44\u00d744 touch target</li>
              <li>• Don\u2019t rely on colour alone to distinguish past / current / future</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
