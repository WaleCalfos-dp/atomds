import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TilesLive } from '../components/tiles/TilesLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

interface TilesPageProps {
  brand: Brand;
}

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const TOKEN_TABLE_ROWS: {
  label: string; cssVar: string; tokenKey: string; fallback: string;
}[] = [
  { label: 'Background',         cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse',    fallback: '#ffffff' },
  { label: 'Text colour',        cssVar: '--atom-foreground-primary-fg-brand-primary',   tokenKey: 'atom.foreground.primary.fg-brand-primary',      fallback: '#0a2333' },
  { label: 'Border',             cssVar: '--atom-border-default-border-default',         tokenKey: 'atom.border.default.border-default',             fallback: '#cdcbcb' },
];

const A11Y_ROWS = [
  { icon: '🏷️', title: 'Labelling', body: 'Each tile must combine the country flag with the country name as visible text — never use the flag alone. The flag is decorative (aria-hidden="true") and the country name carries the semantic meaning.' },
  { icon: '⌨️', title: 'Keyboard interaction', body: 'Selectable tiles must be focusable (role="button" or native <button>), and must activate on Enter and Space. Focus order follows the DOM order of the list.' },
  { icon: '🎨', title: 'Color contrast', body: 'Text colour (fg-brand-primary) on the white inverse surface meets WCAG AA 4.5:1 for all brands.' },
  { icon: '🖼️', title: 'Emoji flags', body: 'Flag glyphs are emoji — they rely on the OS font. Always render them alongside the country name so the component still communicates intent on platforms that fall back to a box glyph.' },
  { icon: '📏', title: 'Touch target', body: 'When used as a selectable chip, ensure the tile is ≥ 44×44 CSS pixels per WCAG 2.5.5 — wrap the padding generously.' },
];

export function TilesPage({ brand }: TilesPageProps) {
  const [tileText, setTileText] = useState('Albania');
  const previewKey = `Country-${tileText}`;
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-72">

            {/* Canvas */}
            <div className="flex-1 flex items-center justify-center p-12 min-h-52" style={DOTTED_BG}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                >
                  <TilesLive brand={brand} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5 overflow-y-auto">

              {/* Type (only one value — shown for discoverability) */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Type</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    className="px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100 bg-slate-900 text-white border-slate-900 shadow-sm"
                    disabled
                  >
                    Country
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Only variant value in Figma.</p>
              </div>

              {/* Text */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Text</p>
                <input
                  type="text"
                  value={tileText}
                  maxLength={24}
                  onChange={(e) => setTileText(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-md text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition"
                  placeholder="Country name…"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Figma exposes one text slot. (Runtime preview shows the default label.)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Tiles</h1>
            <p className="text-slate-500 text-sm max-w-xl">
              A compact tile pairing a flag glyph with a country name. Used in list/grid pickers, eSIM country
              selection, and lounge locale filters. Font family updates per brand via{' '}
              <code className="text-xs bg-slate-100 px-1 rounded">--atom-font-body</code>.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.25" />
                <path d="M5 3v3M5 7.5v.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              </svg>
              Selection
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
        <p className="text-sm text-slate-500 mb-5">Two visual parts inside a rounded outlined container.</p>

        <div className="relative flex items-center justify-center py-20 px-8 rounded-xl" style={DOTTED_BG}>
          <div>
            <TilesLive brand={brand} />
          </div>
          {/* 1 — Flag */}
          <div className="absolute top-4 flex flex-col items-center pointer-events-none" style={{ left: '45%', transform: 'translateX(-50%)' }}>
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">1</span>
            <div className="w-px bg-slate-400" style={{ height: '32px' }} />
          </div>
          {/* 2 — Country text */}
          <div className="absolute top-4 flex flex-col items-center pointer-events-none" style={{ left: '55%', transform: 'translateX(-50%)' }}>
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">2</span>
            <div className="w-px bg-slate-400" style={{ height: '32px' }} />
          </div>
          {/* 3 — Container */}
          <div className="absolute bottom-4 flex flex-col items-center pointer-events-none" style={{ left: '50%', transform: 'translateX(-50%)' }}>
            <div className="w-px bg-slate-400" style={{ height: '32px' }} />
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">3</span>
          </div>
        </div>

        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {[
            { num: '1', name: 'Flag',       desc: 'Decorative emoji flag glyph (16px). Rendered from the OS emoji font. aria-hidden="true".' },
            { num: '2', name: 'Country text', desc: '13px / weight 500. Font family from --atom-font-body — updates per brand. Carries the semantic label.' },
            { num: '3', name: 'Container',  desc: 'Pill with rounded 8px corners, 1px default border, white (inverse) background. Sits on any dotted or solid surface.' },
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
                { label: 'Type',          chips: [{ text: 'Country', note: 'default' }] },
                { label: 'Booleans (0)',  chips: [{ text: '—', note: 'no optional slots' }] },
                { label: 'Text slots (1)',chips: [{ text: 'Text', note: 'country name' }] },
                { label: 'Font family',   chips: [
                  { text: 'Poppins',  note: 'Dragonpass' },
                  { text: 'Arial',    note: 'Mastercard' },
                  { text: 'Inter',    note: 'Investec' },
                  { text: 'Manrope',  note: 'Visa · Greyscale' },
                  { text: 'Lato',     note: 'Assurant' },
                ] },
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

        {/* Visual preview of the one variant */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div style={{ padding: '20px 24px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
            <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>Type = Country</p>
            <TilesLive brand={brand} />
          </div>
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Design Tokens</h2>
        <p className="text-sm text-slate-500 mb-4">
          Tokens used by every Tile. Swatches repaint to match the active brand.
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
                const resolved = tokens[row.tokenKey as keyof typeof tokens] ?? row.fallback;
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
                        <span className="w-5 h-5 rounded flex-shrink-0 border border-black/10" style={{ backgroundColor: resolved }} />
                        <span className="font-mono text-xs px-1.5 py-0.5 rounded border border-slate-200 bg-white text-slate-700">
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
        <p className="text-sm text-slate-500 mb-4">Guidelines for using Tiles inclusively.</p>
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
      <section style={{ paddingBottom: '40px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>Usage</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          When to reach for Tiles.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
          {[
            { title: 'Country',  color: '#0a2333', bg: '#f0f4f8', when: 'Country / locale selectors where a flag + name pairing speeds recognition. Used in eSIM country lists, lounge locale filters, and phone-number country pickers.' },
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
              <li style={{ marginBottom: '6px' }}>• Use for country selectors that benefit from visual recognition</li>
              <li style={{ marginBottom: '6px' }}>• Always pair the flag with the country name as visible text</li>
              <li>• Use inside a grid/list of selectable options</li>
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>✗ When not to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>• Don't use the flag as the only label — screen readers need text</li>
              <li style={{ marginBottom: '6px' }}>• Don't use for non-country data (use Tags, Badge, or Chip instead)</li>
              <li>• Don't stretch the tile to full-width — keep it compact</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
