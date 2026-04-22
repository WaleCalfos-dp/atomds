import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardLive, type CardImagePosition, type CardTextLine } from '../components/card/CardLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

interface CardPageProps {
  brand: Brand;
}

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// ─── Figma property surface (from manifest) ──────────────────────────────────
const IMAGE_POSITIONS: CardImagePosition[] = [
  'Top',
  'None',
  'Left',
  'None - Icon Top',
  'None - Number Top',
  'None - Icon Left',
  'Full',
  'Right',
];
const TEXT_LINES: CardTextLine[] = ['None', 'Single', 'Double', 'Description'];

// ─── Design tokens referenced by Card ─────────────────────────────────────────
type TokenRow = { label: string; tokenKey: string; cssVar: string; fallback: string };
const TOKEN_TABLE_ROWS: TokenRow[] = [
  { label: 'Surface',     cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff' },
  { label: 'Border',      cssVar: '--atom-border-default-border-divider',         tokenKey: 'atom.border.default.border-divider',         fallback: '#cdcbcb' },
  { label: 'Title',       cssVar: '--atom-foreground-primary-fg-brand-primary',   tokenKey: 'atom.foreground.primary.fg-brand-primary',   fallback: '#0a2333' },
  { label: 'Body',        cssVar: '--atom-foreground-core-fg-primary',            tokenKey: 'atom.foreground.core.fg-primary',            fallback: '#4b4a4a' },
  { label: 'Media fill',  cssVar: '--atom-background-core-bg-muted',              tokenKey: 'atom.background.core.bg-muted',              fallback: '#0a23330a' },
  { label: 'Media label', cssVar: '--atom-foreground-core-fg-tertiary',           tokenKey: 'atom.foreground.core.fg-tertiary',           fallback: '#afaead' },
];

const A11Y_ROWS = [
  { icon: '🧭', title: 'Landmark & heading',              body: 'Wrap cards in a meaningful landmark (<section> or <article>) and use a real heading element for the title so screen-reader users can jump between cards via rotor navigation.' },
  { icon: '🖼️', title: 'Images as decoration vs. content', body: 'Decorative media uses aria-hidden="true" and no alt text. Meaningful imagery requires a concise alt describing what the image communicates — never "image of…".' },
  { icon: '⌨️', title: 'Interactive targets',              body: 'Only one interactive element per card should carry the "card click" affordance. Avoid nesting links inside a link-wrapped card; separate actions into explicit buttons or links.' },
  { icon: '🎯', title: 'Touch target size',                body: 'Action buttons inside a card meet the 44×44 minimum touch target on mobile. Card-wide tap targets also honour the same minimum through padding.' },
  { icon: '🎨', title: 'Contrast',                         body: 'Title, body, and media caption all pass WCAG AA 4.5:1 against the surface across every brand. The Full variant uses a text-shadow to preserve contrast over photography.' },
];

// ─── Visual variants grid (representative permutations) ──────────────────────
const VARIANT_GRID: { position: CardImagePosition; textLine: CardTextLine; label: string }[] = [
  { position: 'Top',               textLine: 'Single',      label: 'Top · Single' },
  { position: 'Top',               textLine: 'Double',      label: 'Top · Double' },
  { position: 'Top',               textLine: 'Description', label: 'Top · Description' },
  { position: 'Left',              textLine: 'Single',      label: 'Left · Single' },
  { position: 'Left',              textLine: 'Double',      label: 'Left · Double' },
  { position: 'Right',             textLine: 'Double',      label: 'Right · Double' },
  { position: 'Full',              textLine: 'Single',      label: 'Full · Single' },
  { position: 'None',              textLine: 'None',        label: 'None · Text only' },
  { position: 'None - Icon Left',  textLine: 'Single',      label: 'Icon Left · Single' },
  { position: 'None - Icon Left',  textLine: 'Double',      label: 'Icon Left · Double' },
  { position: 'None - Icon Top',   textLine: 'Single',      label: 'Icon Top · Single' },
  { position: 'None - Number Top', textLine: 'Single',      label: 'Number Top · Single' },
];

export function CardPage({ brand }: CardPageProps) {
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  const [imagePosition, setImagePosition] = useState<CardImagePosition>('Top');
  const [textLine,      setTextLine]      = useState<CardTextLine>('Double');
  const [showActions,   setShowActions]   = useState(true);
  const previewKey = [imagePosition, textLine, showActions].join('-');

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-[420px]">
            <div className="flex-1 flex items-center justify-center p-12" style={DOTTED_BG}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                >
                  <CardLive
                    imagePosition={imagePosition}
                    textLine={textLine}
                    showActions={showActions}
                    brand={brand}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5 overflow-y-auto">

              {/* Image Position */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Image Position</p>
                <div className="flex flex-col gap-1">
                  {IMAGE_POSITIONS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setImagePosition(p)}
                      className={[
                        'text-left px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        imagePosition === p
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Line */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Text Line</p>
                <div className="flex flex-wrap gap-1.5">
                  {TEXT_LINES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTextLine(t)}
                      className={[
                        'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        textLine === t
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Action Button</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showActions}
                    onChange={(e) => setShowActions(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 accent-slate-900"
                  />
                  <span className="text-xs text-slate-600">Show action button</span>
                </label>
              </div>

              {/* Booleans note */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Booleans</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Figma exposes a large surface of optional slots — <span className="font-medium text-slate-600">Title, Badge 1, Badge 2, Icon, Flag, Checkbox, Button, Amenities, Availability Details, Location, Opening Time, Lounge Type, Bullet, Description, Image, Pin, Number</span>. Use the Figma component to toggle them individually.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ────────────────────────────────────────────── */}
      <section>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Card</h1>
        <p className="text-[15px] text-slate-500 leading-relaxed mb-4 max-w-2xl">
          A flexible container that groups related content — media, title, description, and actions — into a single, scannable unit. Eight image-placement patterns cover everything from full-bleed hero cards to lean icon-plus-text tiles. Four text-line densities adapt from minimal (None) to rich copy (Description).
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-slate-200 bg-slate-50 text-xs text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Container
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
        <p className="text-sm text-slate-500 mb-4">The parts that make up a Card in Figma.</p>
        <div className="grid md:grid-cols-2 gap-6 rounded-xl border border-slate-200 bg-white shadow-sm p-6">
          <div className="flex items-center justify-center p-6 rounded-lg border border-slate-100 bg-slate-50" style={DOTTED_BG}>
            <CardLive imagePosition="Top" textLine="Double" showActions brand={brand} />
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
                  { n: 1, label: 'Container', body: '<article> or <section> wrapper with 8px corner radius, 1px border (border-divider) and an inverse surface fill.' },
                  { n: 2, label: 'Media',     body: 'Optional image slot. Full-width when Image Position=Top, 120px column when Left/Right, full-bleed when Full, suppressed on "None" values.' },
                  { n: 3, label: 'Title',     body: 'Required heading element — 15px / weight 600, color fg-brand-primary. Truncates on small widths.' },
                  { n: 4, label: 'Body',      body: 'Optional description, 13–14px / weight 400, colour fg-primary. Rendered for Double and Description text lines.' },
                  { n: 5, label: 'Action',    body: 'Optional link or button row — 13px / weight 600 text link with trailing arrow. Controlled by the Button boolean.' },
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
                { label: 'Image Position', chips: [
                  {text: 'Top', note: 'Default'}, {text: 'None', note: ''}, {text: 'Left', note: ''},
                  {text: 'None - Icon Top', note: ''}, {text: 'None - Number Top', note: ''},
                  {text: 'None - Icon Left', note: ''}, {text: 'Full', note: ''}, {text: 'Right', note: ''},
                ]},
                { label: 'Text Line',  chips: [{text: 'None', note: ''}, {text: 'Single', note: ''}, {text: 'Double', note: 'Default'}, {text: 'Description', note: ''}] },
                { label: 'Booleans',   chips: [
                  {text: 'Title', note: ''}, {text: 'Badge 1', note: ''}, {text: 'Badge 2', note: ''}, {text: 'Icon', note: ''},
                  {text: 'Flag', note: ''}, {text: 'Checkbox', note: ''}, {text: 'Button', note: ''}, {text: 'Amenities', note: ''},
                  {text: 'Availability Details', note: ''}, {text: 'Location', note: ''}, {text: 'Opening Time', note: ''},
                  {text: 'Lounge Type', note: ''}, {text: 'Bullet', note: ''}, {text: 'Description', note: ''},
                  {text: 'Image', note: ''}, {text: 'Pin', note: ''}, {text: 'Number', note: ''},
                ]},
                { label: 'Text slots', chips: [
                  {text: 'Title Text', note: ''}, {text: 'Opening Time Text', note: ''}, {text: 'Type', note: ''},
                  {text: 'Location Text', note: ''}, {text: 'Terminal', note: ''}, {text: 'Lounge', note: ''},
                  {text: 'Number Text', note: ''}, {text: 'Description Text', note: ''},
                ]},
                { label: 'Font family', chips: [
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

        {/* Visual preview grid — 12 representative Figma permutations */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {VARIANT_GRID.map(({ position, textLine: tl, label }) => (
            <div key={label} style={{
              borderRadius: '12px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa',
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid #f3f4f6', backgroundColor: '#ffffff' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#374151' }}>{label}</p>
              </div>
              <div style={{ flex: 1, padding: '28px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', ...DOTTED_BG }}>
                <div style={{ transform: 'scale(0.78)', transformOrigin: 'center' }}>
                  <CardLive imagePosition={position} textLine={tl} showActions brand={brand} />
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
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">Token</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">CSS Variable</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">Value ({brand})</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_TABLE_ROWS.map((row, i) => {
                const rawValue = (tokens[row.tokenKey as keyof typeof tokens] as string | undefined) ?? row.fallback;
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
        <p className="text-sm text-slate-500 mb-4">Guidelines for implementing Card inclusively.</p>
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
          When and how to use Card. For transport-specific selection with a radio affordance and pricing, use Transport Card.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>✓ When to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>• Grouping media + text + action for a single idea (article, product, place)</li>
              <li style={{ marginBottom: '6px' }}>• Scannable list of equal-priority items (feed, catalog)</li>
              <li style={{ marginBottom: '6px' }}>• Featured / call-out block inside a denser surface (dashboard)</li>
              <li style={{ marginBottom: '6px' }}>• Navigating into a deeper view — each card is a clickable entry</li>
              <li>• Lounge / airport cards (use Amenities + Availability Details booleans)</li>
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>✗ When not to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>• Dense data rows — use Data Row or a table instead</li>
              <li style={{ marginBottom: '6px' }}>• A single hero promotion — use a richer banner, not a bare card</li>
              <li style={{ marginBottom: '6px' }}>• Critical alerts — use Alert, not a muted card container</li>
              <li style={{ marginBottom: '6px' }}>• Micro-actions with no supporting text — use Button or Tag</li>
              <li>• Transport selection — use Transport Card</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
