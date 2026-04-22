import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DatePickerLive,
  type DatePickerState,
  type DatePickerMonth,
  type DatePickerStyle,
} from '../components/date-picker/DatePickerLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

interface DatePickerPageProps {
  brand: Brand;
}

// ─── Page helpers ────────────────────────────────────────────────────────────
const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const LABEL_STYLE: React.CSSProperties = {
  margin: '0 0 8px',
  fontSize: '11px',
  fontWeight: 600,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

function SegBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '5px 4px',
        borderRadius: '6px',
        border: 'none',
        backgroundColor: active ? '#fff' : 'transparent',
        color: active ? '#111827' : '#6b7280',
        fontSize: '11px',
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        boxShadow: active ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
        transition: 'all 0.15s ease',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {children}
    </button>
  );
}

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

// ─── Axis definitions ────────────────────────────────────────────────────────
const PICKER_STATES: DatePickerState[] = [
  'Default',
  'Today Selected',
  'Day Selected',
  'Date Range',
  'Selecting Range',
];
const MONTHS: DatePickerMonth[] = ['One', 'Multiple'];
const STYLES: DatePickerStyle[] = ['Filled Background', 'No Background', 'No Stroke'];

// ─── Token table rows ────────────────────────────────────────────────────────
const TOKEN_TABLE_ROWS = [
  {
    label: 'Surface',
    key: 'atom.background.primary.bg-primary-inverse',
    cssVar: '--atom-background-primary-bg-primary-inverse',
  },
  {
    label: 'Border',
    key: 'atom.border.default.border-default',
    cssVar: '--atom-border-default-border-default',
  },
  {
    label: 'Day / header text',
    key: 'atom.foreground.core.fg-primary',
    cssVar: '--atom-foreground-core-fg-primary',
  },
  {
    label: 'Selected fill',
    key: 'atom.background.primary.bg-primary-pressed-brand',
    cssVar: '--atom-background-primary-bg-primary-pressed-brand',
  },
  {
    label: 'Selected text',
    key: 'atom.foreground.primary.fg-brand-primary-inverse',
    cssVar: '--atom-foreground-primary-fg-brand-primary-inverse',
  },
  {
    label: 'Range trail',
    key: 'atom.background.core.bg-muted',
    cssVar: '--atom-background-core-bg-muted',
  },
];

// ─── Accessibility rows ──────────────────────────────────────────────────────
const A11Y_ROWS = [
  {
    icon: '📆',
    title: 'Grid semantics',
    body: 'Calendar cells are rendered as buttons inside a grid. The grid uses role="grid" and each day cell uses role="gridcell". The day-of-week header uses role="columnheader" with a two-letter label.',
  },
  {
    icon: '🎯',
    title: 'Current state announcement',
    body: 'The selected day exposes aria-selected="true". Today\'s date exposes aria-current="date". Assistive tech announces both pieces of context before the day number.',
  },
  {
    icon: '⌨️',
    title: 'Keyboard navigation',
    body: 'Arrow keys move focus between cells, Home / End jump to the start / end of a week, PageUp / PageDown move by month, and Enter / Space commit a selection.',
  },
  {
    icon: '🎨',
    title: 'Contrast',
    body: 'Selected fill meets AA 4.5:1 against its white label. The Today indicator is a 2px blue (#006B99) underline below the day number so it remains visible without relying on colour alone.',
  },
  {
    icon: '🏷️',
    title: 'Labelling',
    body: 'Wrap each calendar in an element with aria-label="Pick a date" or pair the Label text with the grid via aria-labelledby so the purpose is announced on focus.',
  },
];

// ─── Visual variants grid (10 focused permutations from the 30-SVG set) ──────
const VARIANT_GRID: { state: DatePickerState; month: DatePickerMonth; style: DatePickerStyle; label: string }[] = [
  { state: 'Default',          month: 'One', style: 'Filled Background', label: 'Default · One · Filled' },
  { state: 'Today Selected',   month: 'One', style: 'Filled Background', label: 'Today Selected · One · Filled' },
  { state: 'Day Selected',     month: 'One', style: 'Filled Background', label: 'Day Selected · One · Filled' },
  { state: 'Date Range',       month: 'One', style: 'Filled Background', label: 'Date Range · One · Filled' },
  { state: 'Selecting Range',  month: 'One', style: 'Filled Background', label: 'Selecting Range · One · Filled' },
  { state: 'Day Selected',     month: 'One', style: 'No Stroke',         label: 'Day Selected · One · No Stroke' },
  { state: 'Day Selected',     month: 'One', style: 'No Background',     label: 'Day Selected · One · No Background' },
  { state: 'Date Range',       month: 'One', style: 'No Background',     label: 'Date Range · One · No Background' },
];

export function DatePickerPage({ brand }: DatePickerPageProps) {
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  // Interactive preview state
  const [pickerState, setPickerState] = useState<DatePickerState>('Day Selected');
  const [month, setMonth] = useState<DatePickerMonth>('One');
  const [pickerStyle, setPickerStyle] = useState<DatePickerStyle>('Filled Background');

  const previewKey = `${pickerState}-${month}-${pickerStyle}`;

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-[440px]">
            <div
              className="flex-1 flex items-center justify-center p-10"
              style={DOTTED_BG}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                >
                  <DatePickerLive
                    pickerState={pickerState}
                    month={month}
                    pickerStyle={pickerStyle}
                    brand={brand}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5">
              <div>
                <p style={LABEL_STYLE}>State</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                  {PICKER_STATES.map((s) => (
                    <SegBtn key={s} active={pickerState === s} onClick={() => setPickerState(s)}>
                      {s}
                    </SegBtn>
                  ))}
                </div>
              </div>

              <div>
                <p style={LABEL_STYLE}>Month</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  {MONTHS.map((m) => (
                    <SegBtn key={m} active={month === m} onClick={() => setMonth(m)}>
                      {m}
                    </SegBtn>
                  ))}
                </div>
              </div>

              <div>
                <p style={LABEL_STYLE}>Style</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                  {STYLES.map((s) => (
                    <SegBtn key={s} active={pickerStyle === s} onClick={() => setPickerStyle(s)}>
                      {s}
                    </SegBtn>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ────────────────────────────────────────────── */}
      <section>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Date Picker</h1>
            <p className="text-slate-500 text-sm max-w-xl">
              Lets users pick a single date, a date range, or show a current selection in a calendar grid.
              Five states cover the full selection lifecycle (Default → Today → Day → Date Range → Selecting Range),
              three styles control surface treatment, and the calendar can render a single month or a vertical stack
              of three consecutive months at mobile breakpoint. Primary and secondary actions are pinned to the
              bottom of every card with an iOS home indicator.
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

      {/* ── 3. ANATOMY ───────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Anatomy</h2>
        <p className="text-sm text-slate-500 mb-5">
          Each calendar is composed of six parts. Surface treatment (Style axis) wraps the card;
          state (State axis) drives the cell-level decoration; the button group anchors the mobile sheet.
        </p>

        <div className="relative flex items-center justify-center py-20 px-8 rounded-xl" style={DOTTED_BG}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <DatePickerLive pickerState="Date Range" month="One" pickerStyle="Filled Background" brand={brand} />

            {/* Callout 1 — Month header ("May, 2025" at the top) */}
            <div
              style={{
                position: 'absolute',
                top: '24px',
                left: '-42px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  width: '20px', height: '20px', borderRadius: '999px',
                  background: '#1e293b', color: '#fff',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 700,
                  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                }}
              >1</span>
              <div style={{ width: '18px', height: '1px', background: '#94a3b8' }} />
            </div>

            {/* Callout 2 — Days-of-week row */}
            <div
              style={{
                position: 'absolute',
                top: '72px',
                right: '-42px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                pointerEvents: 'none',
              }}
            >
              <div style={{ width: '18px', height: '1px', background: '#94a3b8' }} />
              <span
                style={{
                  width: '20px', height: '20px', borderRadius: '999px',
                  background: '#1e293b', color: '#fff',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 700,
                  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                }}
              >2</span>
            </div>

            {/* Callout 3 — Day cell (regular, row 2) */}
            <div
              style={{
                position: 'absolute',
                top: '166px',
                left: '-42px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  width: '20px', height: '20px', borderRadius: '999px',
                  background: '#1e293b', color: '#fff',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 700,
                  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                }}
              >3</span>
              <div style={{ width: '18px', height: '1px', background: '#94a3b8' }} />
            </div>

            {/* Callout 4 — Range endpoint (right side, pointing at day 26) */}
            <div
              style={{
                position: 'absolute',
                top: '308px',
                right: '-42px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                pointerEvents: 'none',
              }}
            >
              <div style={{ width: '18px', height: '1px', background: '#94a3b8' }} />
              <span
                style={{
                  width: '20px', height: '20px', borderRadius: '999px',
                  background: '#1e293b', color: '#fff',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 700,
                  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                }}
              >4</span>
            </div>

            {/* Callout 5 — Range trail (muted middle fill) */}
            <div
              style={{
                position: 'absolute',
                top: '262px',
                left: '-42px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  width: '20px', height: '20px', borderRadius: '999px',
                  background: '#1e293b', color: '#fff',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 700,
                  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                }}
              >5</span>
              <div style={{ width: '18px', height: '1px', background: '#94a3b8' }} />
            </div>

            {/* Callout 6 — Button group (bottom, pointing up at buttons) */}
            <div
              style={{
                position: 'absolute',
                bottom: '-28px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                pointerEvents: 'none',
              }}
            >
              <div style={{ width: '1px', height: '10px', background: '#94a3b8' }} />
              <span
                style={{
                  width: '20px', height: '20px', borderRadius: '999px',
                  background: '#1e293b', color: '#fff',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 700,
                  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                }}
              >6</span>
            </div>
          </div>
        </div>

        {/* Anatomy legend */}
        <div style={{ marginTop: '48px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {[
            { num: '1', name: 'Month header',    desc: '14px weight-500 "Month, Year" label. Left-aligned at the top of each month block in a Multiple-month stack.' },
            { num: '2', name: 'Day-of-week',     desc: 'Monday-first row of "Mo Tu We Th Fr Sa Su". Divider (1px #cdcbcb) below separates the header from the grid. Announced with role="columnheader".' },
            { num: '3', name: 'Day cell',        desc: '48×48 gridcell with a 40×40 inner circle target. Renders the day number in 14px fg-primary.' },
            { num: '4', name: 'Range endpoint',  desc: 'Filled 40×40 circle using bg-primary-pressed-brand + inverse text. Marks the start / end of a Date Range or the single selected day.' },
            { num: '5', name: 'Range trail',     desc: 'Muted rectangle (bg-core-bg-muted, height 40) behind the cells between endpoints. Endpoints extend 24px into the trail to merge visually.' },
            { num: '6', name: 'Button group',    desc: 'Sticky bottom section with a top shadow. Holds the Secondary + Primary actions and an iOS home indicator (144×5).' },
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
                ['State', 'Default · Today Selected · Day Selected · Date Range · Selecting Range'],
                ['Month', 'One · Multiple (three consecutive months stacked vertically on Mobile breakpoint)'],
                ['Style', 'Filled Background · No Background · No Stroke'],
                ['Breakpoint', 'Mobile (Desktop to follow)'],
                ['Today indicator', '12×2 blue (#006B99) underline below the day number; hidden when the day is selected'],
                ['Button group', 'Sticky bottom section: Secondary + Primary buttons with iOS home indicator'],
              ].map(([prop, val], i, arr) => (
                <tr key={prop} className={i < arr.length - 1 ? 'border-b border-slate-100' : ''}>
                  <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">{prop}</td>
                  <td className="px-5 py-3.5 text-slate-500 text-sm">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Focused 8-permutation visual grid — columns sized for the full 368px picker + padding. */}
        <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '16px' }}>
          {VARIANT_GRID.map(({ state, month: mo, style, label }) => (
            <div
              key={label}
              style={{
                borderRadius: '12px',
                border: '1px solid #f3f4f6',
                backgroundColor: '#fafafa',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
              }}
            >
              <div style={{ padding: '10px 14px', borderBottom: '1px solid #f3f4f6', backgroundColor: '#ffffff' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#374151' }}>{label}</p>
              </div>
              <div style={{ flex: 1, padding: '28px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto', ...DOTTED_BG }}>
                <DatePickerLive pickerState={state} month={mo} pickerStyle={style} brand={brand} />
              </div>
            </div>
          ))}
        </div>

        {/* State matrix — show all 5 states at the Filled Background style */}
        <p style={{ margin: '32px 0 12px', fontSize: '12px', fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          State matrix (Style = Filled Background)
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '12px' }}>
          {PICKER_STATES.map((s) => (
            <div
              key={s}
              style={{
                padding: '20px 16px 16px',
                borderRadius: '10px',
                border: '1px solid #f3f4f6',
                backgroundColor: '#fafafa',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                minWidth: 0,
                overflow: 'auto',
              }}
            >
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>{s}</p>
              <DatePickerLive pickerState={s} month="One" pickerStyle="Filled Background" showLabel={false} brand={brand} />
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Design Tokens</h2>
        <p className="text-sm text-slate-500 mb-4">
          The picker sources every colour from semantic tokens. Switching brands re-resolves each swatch.
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">Token</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">CSS Variable</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">Value ({brand})</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_TABLE_ROWS.map((row, i) => {
                const rawValue = (tokens[row.key as keyof typeof tokens] as string | undefined) ?? '—';
                const swatchHex = rawValue.length > 7 ? rawValue.slice(0, 7) : rawValue;
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
                        <span
                          className="w-5 h-5 rounded flex-shrink-0 border border-black/10"
                          style={{ backgroundColor: swatchHex }}
                        />
                        <span
                          className="font-mono text-xs px-1.5 py-0.5 rounded border"
                          style={{
                            backgroundColor: swatchHex,
                            color: light ? '#1e293b' : '#f8fafc',
                            borderColor: light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)',
                          }}
                        >
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
        <p className="text-sm text-slate-500 mb-4">
          Calendars are high-stakes for keyboard and screen-reader users. Follow every row below.
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm divide-y divide-slate-100">
          {A11Y_ROWS.map((row, i) => (
            <div
              key={row.title}
              className={['flex items-start gap-4 px-5 py-4', i % 2 === 1 ? 'bg-slate-50/50' : ''].join(' ')}
            >
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
          When and how to use Date Picker.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>✓ When to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>• Selecting a check-in / check-out date range</li>
              <li style={{ marginBottom: '6px' }}>• Booking flows where the month context is important</li>
              <li style={{ marginBottom: '6px' }}>• Comparing two consecutive months side-by-side</li>
              <li>• Schedules, reservations, appointments</li>
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>✗ When not to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>• Free-form text dates (e.g. historical birthdays) — use an Input</li>
              <li style={{ marginBottom: '6px' }}>• When the user already knows the exact date — use a text field</li>
              <li style={{ marginBottom: '6px' }}>• Native date-picker is sufficient (OS-provided) — don't re-invent</li>
              <li>• Single week-based selections — use a day selector instead</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
