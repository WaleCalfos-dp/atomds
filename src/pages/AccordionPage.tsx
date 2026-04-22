import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AccordionLive, type AccordionStyle, type AccordionState } from '../components/accordion/AccordionLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

interface AccordionPageProps {
  brand: Brand;
}

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// ─── Style dot colors for variant chips ──────────────────────────────────────
const STYLE_DOT_COLORS: Record<AccordionStyle, string> = {
  'Full Border':   '#0a2333',
  'Bottom Border': '#045477',
  'GPay':       '#006b99',
  'ApplePay':  '#000000',
  'PayPal':    '#253B80',
};

// ─── State dot colors ────────────────────────────────────────────────────────
const STATE_DOT_COLORS: Record<AccordionState, string> = {
  Default:  '#0a2333',
  Hover:    '#045477',
  Focus:    '#0a2333',
  Disabled: '#91908f',
};

const STATE_DOT_BORDER: Record<AccordionState, string> = {
  Default:  '#0a2333',
  Hover:    '#045477',
  Focus:    '#0a2333',
  Disabled: '#cdcbcb',
};

// ─── Token table rows with state-based highlighting ─────────────────────────
const TOKEN_TABLE_ROWS: { label: string; key: string; cssVar: string; states: AccordionState[] }[] = [
  { label: 'Border divider',   key: 'atom.border.default.border-divider',                       cssVar: '--atom-border-default-border-divider',                       states: ['Default'] },
  { label: 'Border hover',     key: 'atom.border.states.border-hover',                          cssVar: '--atom-border-states-border-hover',                          states: ['Hover'] },
  { label: 'Focus border',     key: 'atom.border.selection-and-focus.border-primary-focus',     cssVar: '--atom-border-selection-and-focus-border-primary-focus',     states: ['Focus'] },
  { label: 'Border disabled',  key: 'atom.border.states.border-disabled',                       cssVar: '--atom-border-states-border-disabled',                       states: ['Disabled'] },
  { label: 'Brand primary fg', key: 'atom.foreground.primary.fg-brand-primary',                 cssVar: '--atom-foreground-primary-fg-brand-primary',                 states: ['Default'] },
  { label: 'Hover fg',         key: 'atom.foreground.states.fg-hover',                          cssVar: '--atom-foreground-states-fg-hover',                          states: ['Hover'] },
  { label: 'Disabled fg',      key: 'atom.foreground.states.fg-disabled',                       cssVar: '--atom-foreground-states-fg-disabled',                       states: ['Disabled'] },
  { label: 'Body text fg',     key: 'atom.foreground.core.fg-primary',                          cssVar: '--atom-foreground-core-fg-primary',                          states: ['Default'] },
  { label: 'Background fill',  key: 'atom.background.primary.bg-primary-inverse',               cssVar: '--atom-background-primary-bg-primary-inverse',               states: ['Default'] },
];

// ─── Variant table rows ─────────────────────────────────────────────────────
const VARIANT_ROWS: { label: string; chips: { text: string; dot?: string }[] }[] = [
  { label: 'State',           chips: [{ text: 'Default' }, { text: 'Hover' }, { text: 'Focus' }, { text: 'Disabled' }] },
  { label: 'Style',           chips: [{ text: 'Full Border', dot: STYLE_DOT_COLORS['Full Border'] }, { text: 'Bottom Border', dot: STYLE_DOT_COLORS['Bottom Border'] }, { text: 'GPay', dot: STYLE_DOT_COLORS['GPay'] }, { text: 'ApplePay', dot: STYLE_DOT_COLORS['ApplePay'] }, { text: 'PayPal', dot: STYLE_DOT_COLORS['PayPal'] }] },
  { label: 'Opened',          chips: [{ text: 'Yes' }, { text: 'No' }] },
  { label: 'Background Fill', chips: [{ text: 'Yes' }, { text: 'No' }] },
  { label: 'Icon Left',       chips: [{ text: 'True' }, { text: 'False' }] },
  { label: 'Country Flag',    chips: [{ text: 'True' }, { text: 'False' }] },
  { label: 'Title Text',      chips: [{ text: 'Editable text' }] },
  { label: 'Subtitle',        chips: [{ text: 'True' }, { text: 'False' }] },
  { label: 'Subtitle Text',   chips: [{ text: 'Editable text' }] },
  { label: 'Badge',           chips: [{ text: 'True' }, { text: 'False' }] },
  { label: 'Content',         chips: [{ text: 'True' }, { text: 'False' }] },
  { label: 'Content Text',    chips: [{ text: 'Editable text' }] },
  { label: 'Slot 1',          chips: [{ text: 'True' }, { text: 'False' }] },
  { label: 'Slot 2',          chips: [{ text: 'True' }, { text: 'False' }] },
];

// ─── Accessibility rows ─────────────────────────────────────────────────────
const A11Y_ROWS = [
  {
    icon: '\u2328\uFE0F',
    title: 'Keyboard interaction',
    body: 'Each accordion header is a <button> and receives focus in tab order. Press Enter or Space to toggle the expanded/collapsed state. Arrow keys are optional but may be added for enhanced navigation between headers.',
  },
  {
    icon: '\uD83C\uDFF7\uFE0F',
    title: 'ARIA attributes',
    body: 'Each header button uses aria-expanded="true|false" and aria-controls pointing to its content region ID. The content panel uses role="region" and aria-hidden to match the expanded state.',
  },
  {
    icon: '\uD83C\uDFA8',
    title: 'Color contrast',
    body: 'Title text (brand primary fg on white bg) meets WCAG AA 4.5:1 minimum contrast across all 6 brands. Body text and subtitle also meet AA requirements.',
  },
  {
    icon: '\uD83D\uDD24',
    title: 'Content structure',
    body: 'Don\'t rely solely on the expanded/collapsed visual state to convey hierarchy. Use descriptive titles so users understand each section\'s content before expanding.',
  },
  {
    icon: '\u2728',
    title: 'Motion',
    body: 'The expand/collapse animation uses max-height and opacity transitions (0.25s). For users who prefer reduced motion, consider disabling animation and toggling content visibility instantly.',
  },
];

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

export function AccordionPage({ brand }: AccordionPageProps) {
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  // Interactive preview state
  const [state, setState]               = useState<AccordionState>('Default');
  const [style, setStyle]               = useState<AccordionStyle>('Full Border');
  const [opened, setOpened]             = useState(false);
  const [backgroundFill, setBackgroundFill] = useState(true);
  const [showIconLeft, setShowIconLeft] = useState(true);
  const [showCountryFlag, setShowCountryFlag] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showBadge, setShowBadge]       = useState(false);
  const [showContent, setShowContent]   = useState(true);

  const previewKey = `${state}-${style}-${opened}-${backgroundFill}-${showIconLeft}-${showCountryFlag}-${showSubtitle}-${showBadge}-${showContent}`;

  return (
    <div className="space-y-10">

      {/* -- 1. INTERACTIVE PREVIEW ------------------------------------------------ */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-72">

            {/* Left: canvas */}
            <div
              className="flex-1 flex items-center justify-center p-10 min-h-52"
              style={DOTTED_BG}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                  style={{ width: '100%', maxWidth: '460px' }}
                >
                  <AccordionLive
                    style={style}
                    state={state}
                    opened={opened}
                    backgroundFill={backgroundFill}
                    showIconLeft={showIconLeft}
                    showCountryFlag={showCountryFlag}
                    showSubtitle={showSubtitle}
                    showBadge={showBadge}
                    showContent={showContent}
                    brand={brand}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: controls */}
            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5 overflow-y-auto">

              {/* State */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">State</p>
                <div className="flex flex-wrap gap-1.5">
                  {(['Default', 'Hover', 'Focus', 'Disabled'] as AccordionState[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setState(s)}
                      className={[
                        'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        state === s
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0 border"
                        style={{
                          backgroundColor: STATE_DOT_COLORS[s],
                          borderColor: STATE_DOT_BORDER[s],
                        }}
                      />
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Style</p>
                <div className="flex flex-wrap gap-1.5">
                  {(['Full Border', 'Bottom Border', 'GPay', 'ApplePay', 'PayPal'] as AccordionStyle[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStyle(s)}
                      className={[
                        'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        style === s
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0 border"
                        style={{
                          backgroundColor: STYLE_DOT_COLORS[s],
                          borderColor: STYLE_DOT_COLORS[s],
                        }}
                      />
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Opened */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Opened</p>
                <div className="flex rounded-lg border border-slate-200 overflow-hidden w-fit">
                  {(['Yes', 'No'] as const).map((opt) => {
                    const isActive = opt === 'Yes' ? opened : !opened;
                    return (
                      <button
                        key={opt}
                        onClick={() => setOpened(opt === 'Yes')}
                        className={[
                          'px-3 py-1.5 text-xs font-medium transition-all duration-100',
                          isActive
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600 hover:bg-slate-50',
                        ].join(' ')}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Background Fill */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Background Fill</p>
                <div className="flex rounded-lg border border-slate-200 overflow-hidden w-fit">
                  {(['Yes', 'No'] as const).map((opt) => {
                    const isActive = opt === 'Yes' ? backgroundFill : !backgroundFill;
                    return (
                      <button
                        key={opt}
                        onClick={() => setBackgroundFill(opt === 'Yes')}
                        className={[
                          'px-3 py-1.5 text-xs font-medium transition-all duration-100',
                          isActive
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600 hover:bg-slate-50',
                        ].join(' ')}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Options */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Options</p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: 'Icon Left',    value: showIconLeft,    set: setShowIconLeft },
                    { label: 'Country Flag', value: showCountryFlag, set: setShowCountryFlag },
                    { label: 'Subtitle',     value: showSubtitle,    set: setShowSubtitle },
                    { label: 'Badge',        value: showBadge,       set: setShowBadge },
                    { label: 'Content',      value: showContent,     set: setShowContent },
                  ].map(({ label: lbl, value, set }) => (
                    <label key={lbl} className="flex items-center gap-2.5 cursor-pointer select-none group">
                      <button
                        role="checkbox"
                        aria-checked={value}
                        onClick={() => set(!value)}
                        className={[
                          'w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-100 flex-shrink-0',
                          value
                            ? 'bg-slate-900 border-slate-900'
                            : 'bg-white border-slate-300 group-hover:border-slate-400',
                        ].join(' ')}
                      >
                        {value && (
                          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                            <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                      <span className="text-xs text-slate-600">{lbl}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* -- 2. COMPONENT INFO ----------------------------------------------------- */}
      <section>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Accordion</h1>
            <p className="text-slate-500 text-sm max-w-xl">
              Allows users to expand and collapse sections of related content for progressive disclosure.
              Supports five styles (Full Border, Bottom Border, GPay, ApplePay, PayPal) with optional icon, subtitle, and badge slots.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.25" />
                <path d="M5 3v3M5 7.5v.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              </svg>
              Feedback
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Stable
            </span>
          </div>
        </div>
      </section>

      <hr className="border-slate-200" />

      {/* -- 3. ANATOMY ------------------------------------------------------------ */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Anatomy</h2>
        <p className="text-sm text-slate-500 mb-5">
          The Accordion is composed of five main parts. Icon Left, Subtitle, and Badge slots are optional.
        </p>

        <div className="flex items-center justify-center rounded-xl" style={{ ...DOTTED_BG, padding: '80px 32px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '460px' }}>

            {/* ── Top callouts (above accordion → header elements) ── */}

            {/* Callout: 2 Icon Left */}
            <div
              className="pointer-events-none"
              style={{ position: 'absolute', bottom: '100%', left: '5.4%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '4px' }}
            >
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">2</span>
              <div className="w-px bg-slate-400" style={{ height: '28px' }} />
            </div>

            {/* Callout: 3 Title */}
            <div
              className="pointer-events-none"
              style={{ position: 'absolute', bottom: '100%', left: '25%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '4px' }}
            >
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">3</span>
              <div className="w-px bg-slate-400" style={{ height: '28px' }} />
            </div>

            {/* Callout: 4 Chevron */}
            <div
              className="pointer-events-none"
              style={{ position: 'absolute', bottom: '100%', left: '95%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '4px' }}
            >
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">4</span>
              <div className="w-px bg-slate-400" style={{ height: '28px' }} />
            </div>

            {/* ── The accordion ── */}
            <AccordionLive
              style="Full Border"
              state="Default"
              opened={true}
              showIconLeft={true}
              showSubtitle={true}
              showBadge={true}
              showContent={true}
              backgroundFill={true}
              brand={brand}
            />

            {/* ── Bottom callouts (below accordion) ── */}

            {/* Callout: 1 Container */}
            <div
              className="pointer-events-none"
              style={{ position: 'absolute', top: '100%', left: '30%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4px' }}
            >
              <div className="w-px bg-slate-400" style={{ height: '28px' }} />
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">1</span>
            </div>

            {/* Callout: 5 Content */}
            <div
              className="pointer-events-none"
              style={{ position: 'absolute', top: '100%', left: '70%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4px' }}
            >
              <div className="w-px bg-slate-400" style={{ height: '28px' }} />
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">5</span>
            </div>

          </div>
        </div>

        {/* Anatomy legend */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {[
            { num: '1', name: 'Container',  desc: 'Outer wrapper with 8px radius. Full Border: 1px border all sides (2px on Hover/Focus). Bottom Border: divider line under header only. GPay/ApplePay/PayPal: taller header (72px) with payment logo.' },
            { num: '2', name: 'Icon Left',   desc: 'Optional 20×20px icon slot. Displays a leading icon or country flag emoji. Inherits brand primary foreground color. Hidden when disabled.' },
            { num: '3', name: 'Title',       desc: '14px / weight 500 text with 20px line-height. Foreground color from brand primary token. Required. Changes color on Hover, Focus, and Disabled states.' },
            { num: '4', name: 'Chevron',     desc: '20×20px expand/collapse indicator. Rotates 180 degrees when opened. Inherits the same foreground color as the title for each state.' },
            { num: '5', name: 'Content',     desc: 'Body region visible when Opened=Yes. 14px / weight 400 text with 20px line-height. Uses primary foreground color. Hidden entirely when Opened=No.' },
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

      {/* -- 4. VARIANTS ----------------------------------------------------------- */}
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
              {VARIANT_ROWS.map((row, i) => (
                <tr key={row.label} className={i < VARIANT_ROWS.length - 1 ? 'border-b border-slate-100' : ''}>
                  <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">{row.label}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      {row.chips.map((chip) => (
                        <span key={chip.text} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium">
                          {chip.dot && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: chip.dot }} />}
                          {chip.text}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual preview: 5 styles x 2 opened states = 10 cards */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {(['Full Border', 'Bottom Border', 'GPay', 'ApplePay', 'PayPal'] as AccordionStyle[]).map((s) =>
            ([false, true] as const).map((isOpen) => (
              <div key={`${s}-${isOpen}`} style={{ padding: '20px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>
                  {s} {isOpen ? '(Open)' : '(Closed)'}
                </p>
                <AccordionLive style={s} state="Default" opened={isOpen} showIconLeft={true} backgroundFill={true} showContent={true} brand={brand} />
              </div>
            ))
          )}
        </div>
      </section>

      {/* -- 5. DESIGN TOKENS ------------------------------------------------------ */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Design Tokens</h2>
        <p className="text-sm text-slate-500 mb-4">
          Active tokens for the selected state are highlighted. Switch State or Brand to see values update.
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">Token</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">CSS Variable</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">Value ({brand})</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_TABLE_ROWS.map((row, i) => {
                const isActive = row.states.includes(state);
                const rawValue = tokens[row.key as keyof typeof tokens] ?? '\u2014';
                const swatchHex = rawValue.length > 7 ? rawValue.slice(0, 7) : rawValue;
                const light = isLightColor(swatchHex);
                return (
                  <tr
                    key={row.cssVar}
                    className={[
                      i < TOKEN_TABLE_ROWS.length - 1 ? 'border-b border-slate-100' : '',
                      isActive ? 'bg-blue-50/60' : 'opacity-50',
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

      {/* -- 6. ACCESSIBILITY ------------------------------------------------------ */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Accessibility</h2>
        <p className="text-sm text-slate-500 mb-4">
          Guidelines for implementing Accordion in an inclusive way.
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

      {/* -- 7. USAGE -------------------------------------------------------------- */}
      <section>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>Usage</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          When and how to use the Accordion component.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>When to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>Progressive disclosure of related content (FAQ, terms, settings)</li>
              <li style={{ marginBottom: '6px' }}>Reducing cognitive load on long pages with many sections</li>
              <li style={{ marginBottom: '6px' }}>Payment flows where each step is a collapsible section</li>
              <li>Grouping secondary details that users may not always need</li>
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>When not to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>Don't hide critical content that users must see -- show it inline</li>
              <li style={{ marginBottom: '6px' }}>Don't use a single accordion for primary navigation -- use tabs instead</li>
              <li style={{ marginBottom: '6px' }}>Don't nest accordions inside accordions -- flatten the hierarchy</li>
              <li>Don't use for very short content that adds no value when collapsed</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
