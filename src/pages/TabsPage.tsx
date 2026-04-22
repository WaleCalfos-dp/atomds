import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TabsLive, type TabsStyle, type TabCount } from '../components/tabs/TabsLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

interface TabsPageProps {
  brand: Brand;
}

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const DARK_BG: React.CSSProperties = {
  backgroundColor: '#1e293b',
  backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const ALL_STYLES: TabsStyle[] = ['Underlined', 'Plain', 'Circular on Light', 'Circular on Dark'];
const ALL_COUNTS: TabCount[] = [2, 3, 4, 5, 6, 7];
const FIGMA_COUNTS_BY_STYLE: Record<TabsStyle, TabCount[]> = {
  Underlined:           [2, 3, 4, 5, 6, 7],
  Plain:                [2, 3, 4, 5, 6, 7],
  'Circular on Light':  [2, 3, 4],
  'Circular on Dark':   [2, 3, 4],
};

const STYLE_META: Record<TabsStyle, { dotColor: string; dotBorder: string }> = {
  Underlined:           { dotColor: 'transparent',                                           dotBorder: 'var(--atom-border-selection-and-focus-border-selected)' },
  Plain:                { dotColor: 'transparent',                                           dotBorder: 'var(--atom-foreground-core-fg-primary)' },
  'Circular on Light':  { dotColor: 'var(--atom-background-primary-bg-primary-default)',    dotBorder: 'var(--atom-background-primary-bg-primary-default)' },
  'Circular on Dark':   { dotColor: '#ffffff',                                               dotBorder: '#ffffff' },
};

type TokenRow = {
  label: string;
  cssVar: string;
  tokenKey?: string;
  fallback: string;
  styles: TabsStyle[];
};

const TOKEN_TABLE_ROWS: TokenRow[] = [
  { label: 'Active label',                cssVar: '--atom-foreground-primary-fg-brand-primary',         tokenKey: 'atom.foreground.primary.fg-brand-primary',         fallback: '#0a2333',    styles: ['Underlined', 'Plain', 'Circular on Light'] },
  { label: 'Inactive label',              cssVar: '--atom-foreground-core-fg-primary',                  tokenKey: 'atom.foreground.core.fg-primary',                  fallback: '#4b4a4a',    styles: ['Underlined', 'Plain', 'Circular on Light'] },
  { label: 'Container bottom border',     cssVar: '--atom-border-default-border-default',               tokenKey: 'atom.border.default.border-default',               fallback: '#cdcbcb',    styles: ['Underlined'] },
  { label: 'Active underline indicator',  cssVar: '--atom-border-selection-and-focus-border-selected',  tokenKey: 'atom.border.selection-and-focus.border-selected',  fallback: '#0a2333',    styles: ['Underlined', 'Plain'] },
  { label: 'Light pill container bg',     cssVar: '--atom-background-core-bg-muted',                    tokenKey: 'atom.background.core.bg-muted',                    fallback: '#0a23330a',  styles: ['Circular on Light'] },
  { label: 'Light pill active bg',        cssVar: '--atom-background-primary-bg-primary-default',       tokenKey: 'atom.background.primary.bg-primary-default',       fallback: '#0a2333',    styles: ['Circular on Light'] },
  { label: 'Light pill active label',     cssVar: '--atom-foreground-primary-fg-brand-primary-inverse', tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse', fallback: '#ffffff',    styles: ['Circular on Light'] },
  { label: 'Dark pill container bg',      cssVar: '— (rgba(255,255,255,0.2))',                                                                                       fallback: '#ffffff33',  styles: ['Circular on Dark'] },
  { label: 'Dark pill active bg',         cssVar: '--atom-background-primary-bg-primary-inverse',       tokenKey: 'atom.background.primary.bg-primary-inverse',       fallback: '#ffffff',    styles: ['Circular on Dark'] },
  { label: 'Dark pill active label',      cssVar: '--atom-foreground-primary-fg-brand-primary',         tokenKey: 'atom.foreground.primary.fg-brand-primary',         fallback: '#0a2333',    styles: ['Circular on Dark'] },
  { label: 'Dark pill inactive label',    cssVar: '— (literal #ffffff)',                                                                                             fallback: '#ffffff',    styles: ['Circular on Dark'] },
];

const A11Y_ROWS = [
  { icon: '🔖', title: 'Tablist semantics',      body: 'The tab container must carry role="tablist". Each tab must carry role="tab", and the content area controlled by the active tab must use role="tabpanel" with aria-labelledby pointing to its tab.' },
  { icon: '✅', title: 'aria-selected',          body: 'The currently active tab must set aria-selected="true"; all inactive tabs must set aria-selected="false". This tells assistive technologies which tab\u2019s panel is currently displayed.' },
  { icon: '⌨️', title: 'Keyboard navigation',    body: 'Arrow Left / Arrow Right move focus between tabs. Home jumps focus to the first tab, End to the last. Enter or Space activates the focused tab.' },
  { icon: '🎯', title: 'Focus management',       body: 'Only the active tab sits in the tab order (tabindex="0"). Inactive tabs use tabindex="-1" so keyboard users tab past the tablist as a single stop, then use arrow keys within.' },
  { icon: '🚫', title: 'Don\u2019t disable tabs', body: 'Avoid disabling tabs \u2014 users cannot discover what content they hide. Instead, show the tab panel with a message explaining why the content is unavailable.' },
  { icon: '🎨', title: 'Colour contrast',        body: 'All active/inactive label pairings meet WCAG AA 4.5:1 across the six brands. The underline indicator is not the only cue \u2014 weight and colour also change, satisfying WCAG 1.4.1 (Use of Color).' },
  { icon: '🌓', title: 'Dark surface usage',     body: 'Use Circular on Dark only when the surrounding surface is dark. Placing it on a light background breaks both the visual metaphor and the contrast of the white-on-white inactive label.' },
];

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

function canvasBg(style: TabsStyle): React.CSSProperties {
  return style === 'Circular on Dark' ? DARK_BG : DOTTED_BG;
}

export function TabsPage({ brand }: TabsPageProps) {
  const [tabStyle, setTabStyle]   = useState<TabsStyle>('Underlined');
  const [count, setCount]         = useState<TabCount>(3);
  const [activeIndex, setActive]  = useState(0);

  const clampedActive = Math.min(activeIndex, count - 1);
  const previewKey = `${tabStyle}-${count}-${clampedActive}`;
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];
  const figmaCountsForStyle = FIGMA_COUNTS_BY_STYLE[tabStyle];
  const countExistsInFigma  = figmaCountsForStyle.includes(count);

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-72">

            {/* Canvas */}
            <div
              className="flex-1 flex items-center justify-center p-12 min-h-52"
              style={canvasBg(tabStyle)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                  style={{ width: '100%', maxWidth: '520px' }}
                >
                  <TabsLive tabStyle={tabStyle} count={count} activeIndex={clampedActive} brand={brand} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5 overflow-y-auto">

              {/* Style */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Style</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {ALL_STYLES.map((s) => {
                    const meta = STYLE_META[s];
                    return (
                      <button
                        key={s}
                        onClick={() => setTabStyle(s)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          padding: '4px 10px', borderRadius: '6px',
                          fontSize: '12px', fontWeight: 500, border: '1px solid',
                          cursor: 'pointer', textAlign: 'left', width: '100%',
                          transition: 'all 0.1s ease',
                          ...(tabStyle === s
                            ? { backgroundColor: '#0f172a', color: '#ffffff', borderColor: '#0f172a', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }
                            : { backgroundColor: 'transparent', color: '#475569', borderColor: '#e2e8f0' }),
                        }}
                      >
                        <span style={{
                          width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                          border: '1.5px solid', backgroundColor: meta.dotColor, borderColor: meta.dotBorder,
                        }} />
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Number of Tabs */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Number of Tabs</p>
                <div className="flex rounded-lg border border-slate-200 overflow-hidden w-fit">
                  {ALL_COUNTS.map((c) => (
                    <button key={c}
                      onClick={() => { setCount(c); setActive(prev => Math.min(prev, c - 1)); }}
                      className={['px-3 py-1.5 text-xs font-medium transition-all duration-100',
                        count === c ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'].join(' ')}>
                      {c}
                    </button>
                  ))}
                </div>
                {!countExistsInFigma && (
                  <p style={{ marginTop: '6px', fontSize: '11px', color: '#9a3412' }}>
                    Figma only publishes {tabStyle} at 2–{figmaCountsForStyle[figmaCountsForStyle.length - 1]} tabs. Shown here is a runtime extension.
                  </p>
                )}
              </div>

              {/* Active tab */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Active tab</p>
                <div className="flex rounded-lg border border-slate-200 overflow-hidden w-fit">
                  {Array.from({ length: count }, (_, i) => (
                    <button key={i}
                      onClick={() => setActive(i)}
                      className={['px-3 py-1.5 text-xs font-medium transition-all duration-100',
                        clampedActive === i ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'].join(' ')}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Tabs</h1>
            <p className="text-slate-500 text-sm max-w-xl">
              Organises related content into switchable views within the same context.
              Four styles (Underlined, Plain, Circular on Light, Circular on Dark) across 2–7 tabs.
              Font family updates per brand via <code className="text-xs bg-slate-100 px-1 rounded">--atom-font-body</code>.
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

      {/* ── 3. ANATOMY ───────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Anatomy</h2>
        <p className="text-sm text-slate-500 mb-5">
          Underlined anatomy below. Plain shares the same structure without the container divider;
          Circular styles swap the underline indicator for a filled pill.
        </p>

        <div className="relative flex items-center justify-center py-20 px-8 rounded-xl" style={DOTTED_BG}>
          <div style={{ width: '100%', maxWidth: '380px' }}>
            <TabsLive tabStyle="Underlined" count={3} activeIndex={0} brand={brand} />
          </div>
          {/* 1 — Container (top) */}
          <div className="absolute top-4 flex flex-col items-center pointer-events-none" style={{ left: '20%', transform: 'translateX(-50%)' }}>
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">1</span>
            <div className="w-px bg-slate-400" style={{ height: '28px' }} />
          </div>
          {/* 2 — Tab label (top) */}
          <div className="absolute top-4 flex flex-col items-center pointer-events-none" style={{ left: '42%', transform: 'translateX(-50%)' }}>
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">2</span>
            <div className="w-px bg-slate-400" style={{ height: '28px' }} />
          </div>
          {/* 3 — Active indicator (bottom) */}
          <div className="absolute bottom-4 flex flex-col items-center pointer-events-none" style={{ left: '24%', transform: 'translateX(-50%)' }}>
            <div className="w-px bg-slate-400" style={{ height: '28px' }} />
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">3</span>
          </div>
          {/* 4 — Container divider (bottom) */}
          <div className="absolute bottom-4 flex flex-col items-center pointer-events-none" style={{ left: '72%', transform: 'translateX(-50%)' }}>
            <div className="w-px bg-slate-400" style={{ height: '28px' }} />
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">4</span>
          </div>
        </div>

        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {[
            { num: '1', name: 'Container',           desc: 'Horizontal row that wraps all tabs. Height: 48px. 16px gap between tabs. Carries the tablist role.' },
            { num: '2', name: 'Tab label',           desc: '14px text, weight 400 inactive / 500 active. Font family from --atom-font-body. Uses --atom-foreground-primary-fg-brand-primary when active; --atom-foreground-core-fg-primary when not.' },
            { num: '3', name: 'Active indicator',    desc: 'Underlined: 1px solid bottom border on the active tab only. Plain: same 1px indicator, no container border. Circular: fully filled pill swaps for the underline.' },
            { num: '4', name: 'Container divider',   desc: '1px bottom border across the full row. Present in Underlined only. Absent in Plain, Circular on Light, and Circular on Dark.' },
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
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">Property</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Values</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  label: 'Style',
                  chips: [
                    { text: 'Underlined',          note: 'default' },
                    { text: 'Plain',               note: '' },
                    { text: 'Circular on Light',   note: '' },
                    { text: 'Circular on Dark',    note: '' },
                  ],
                },
                {
                  label: 'Number of Tabs',
                  chips: [
                    { text: '2', note: 'default' },
                    { text: '3', note: '' },
                    { text: '4', note: '' },
                    { text: '5', note: 'Underlined / Plain only' },
                    { text: '6', note: 'Underlined / Plain only' },
                    { text: '7', note: 'Underlined / Plain only' },
                  ],
                },
                {
                  label: 'Concrete variants',
                  chips: [
                    { text: '18 total', note: 'Underlined ×6 · Plain ×6 · Circular on Light ×3 · Circular on Dark ×3' },
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

        {/* Visual preview of all 4 styles */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {ALL_STYLES.map(s => {
            const isDark = s === 'Circular on Dark';
            return (
              <div key={s} style={{
                padding: '24px 28px', borderRadius: '10px',
                border: '1px solid #f3f4f6',
                backgroundColor: isDark ? '#1e293b' : '#fafafa',
                display: 'flex', flexDirection: 'column', gap: '14px',
              }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: isDark ? '#94a3b8' : '#6b7280' }}>{s}</p>
                <TabsLive tabStyle={s} count={3} activeIndex={0} brand={brand} />
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Design Tokens</h2>
        <p className="text-sm text-slate-500 mb-4">
          Active tokens for the selected style are highlighted. Dark-pill container and inactive label are literal RGBA / hex (not tokenised).
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-56">Token</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">CSS Variable</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">Fallback</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_TABLE_ROWS.map((row, i) => {
                const isActive       = row.styles.includes(tabStyle);
                const resolvedValue  = row.tokenKey ? (tokens[row.tokenKey as keyof typeof tokens] ?? row.fallback) : row.fallback;
                const isHexColor     = resolvedValue.startsWith('#');
                const light          = isHexColor ? isLightColor(resolvedValue) : true;
                return (
                  <tr
                    key={row.label}
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
        <p className="text-sm text-slate-500 mb-4">Guidelines for building inclusive experiences with the Tabs component.</p>
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
          When and how to use each Tabs style.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
          {[
            { title: 'Underlined',         color: '#0a2333', bg: '#f0f4f8', when: 'The default style for page-level navigation between related sections. The container divider visually separates the tab row from the panel below.' },
            { title: 'Plain',              color: '#374151', bg: '#f9fafb', when: 'Use when the surrounding layout already provides visual separation. Drops the container divider so the tablist blends into richer surrounding content.' },
            { title: 'Circular on Light',  color: '#0a2333', bg: '#eef1f3', when: 'For compact toggles or filters inside cards and toolbars on light backgrounds. The filled pill is more emphatic than an underline — use sparingly.' },
            { title: 'Circular on Dark',   color: '#0f172a', bg: '#e2e8f0', when: 'Same toggle pattern as Circular on Light, but for dark hero banners, inverted sections, or dark cards. Never place on a light background.' },
          ].map((card) => (
            <div key={card.title} style={{ padding: '14px 16px', borderRadius: '10px', border: `1px solid ${card.color}22`, backgroundColor: card.bg }}>
              <p style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: 600, color: card.color }}>{card.title}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#4b5563', lineHeight: 1.5 }}>{card.when}</p>
            </div>
          ))}
        </div>

        {/* Do / Don't */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>✓ When to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>• Keep tab labels short, noun-based, and scannable (1–3 words)</li>
              <li style={{ marginBottom: '6px' }}>• Use 2–7 tabs — beyond 7 the row becomes unreadable on small screens</li>
              <li style={{ marginBottom: '6px' }}>• Pair every tab with a meaningful tabpanel of content</li>
              <li style={{ marginBottom: '6px' }}>• Match the style to the surrounding surface (Circular on Dark only on dark backgrounds)</li>
              <li>• Keep the tab order stable — never reorder tabs based on activity or popularity</li>
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>✗ When not to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>• Don't use tabs for sequential steps — use the Stepper / Steps components</li>
              <li style={{ marginBottom: '6px' }}>• Don't nest tabs inside tabs — flatten the hierarchy instead</li>
              <li style={{ marginBottom: '6px' }}>• Don't disable tabs — show the panel with an explanation</li>
              <li style={{ marginBottom: '6px' }}>• Don't use tabs for unrelated content — pages or sections are clearer</li>
              <li>• Don't place Circular on Dark against a light surface</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
