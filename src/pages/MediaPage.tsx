import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MediaLive, type MediaState, type MediaAspect } from '../components/media/MediaLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

interface MediaPageProps {
  brand: Brand;
}

// ─── Design-token table rows ────────────────────────────────────────────────
const TOKEN_TABLE_ROWS: { label: string; key: string; cssVar: string; states: MediaState[] }[] = [
  { label: 'Surface (muted)',   key: 'atom.background.core.bg-muted',              cssVar: '--atom-background-core-bg-muted',              states: ['Default', 'Empty', 'Loading'] },
  { label: 'Foreground (muted)', key: 'atom.foreground.core.fg-secondary',         cssVar: '--atom-foreground-core-fg-secondary',          states: ['Empty'] },
];

// Dotted canvas background
const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// ─── Accessibility rows ─────────────────────────────────────────────────────
const A11Y_ROWS = [
  {
    icon: '🖼️',
    title: 'Alt text is mandatory',
    body: 'Every non-decorative image must pass a meaningful alt string. Describe what the image conveys, not the fact that it is an image — avoid prefixes like "Image of…" or "Photo of…".',
  },
  {
    icon: '🎭',
    title: 'Decorative images',
    body: 'When an image is purely ornamental (e.g. a background pattern that sits next to descriptive text), set `decorative` so the component renders aria-hidden with an empty alt attribute. Screen readers will skip it entirely.',
  },
  {
    icon: '⏳',
    title: 'Loading state',
    body: 'The Loading shimmer is paired with a visually hidden "Loading image" label. Assistive tech announces the state so low-bandwidth users know the image is pending, not missing.',
  },
  {
    icon: '🚫',
    title: 'Empty fallback',
    body: 'When no src is provided, Media renders an Empty placeholder with an icon + "No image" label. The icon is aria-hidden; the visible text communicates the state to all users without needing a separate error string.',
  },
  {
    icon: '🎨',
    title: 'Contrast',
    body: 'Placeholder chrome (icon, label) uses fg-secondary against bg-muted. Both resolve to WCAG AA 4.5:1 across all 6 brands, so the Empty state remains legible regardless of theme.',
  },
];

// ─── Anatomy callouts ───────────────────────────────────────────────────────
const ANATOMY_PARTS = [
  { num: '1', name: 'Container',     desc: '638 × 305 in Figma (aspect ratio ≈ 2.09:1). No corner radius, no stroke. Width is fluid — the component fills its parent.' },
  { num: '2', name: 'Image fill',    desc: 'Single IMAGE fill with scaleMode=FILL in Figma, which maps 1:1 to CSS object-fit: cover. Source is provided at the call-site via the src prop.' },
  { num: '3', name: 'Empty state',   desc: 'Rendered when src is omitted. Checkerboard over bg-muted with a 40 × 40 picture-frame icon above a "No image" caption — mirrors Figma\'s default placeholder render.' },
  { num: '4', name: 'Loading state', desc: 'A left-to-right shimmer sweep over bg-muted plus a visually hidden "Loading image" label for screen readers.' },
];

// ─── Sample images (Unsplash-hosted, CC-licensed) ───────────────────────────
const SAMPLE_SRC = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&q=80&auto=format&fit=crop';

// ─── Segmented button ───────────────────────────────────────────────────────
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
      className={[
        'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
        active
          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

const ALL_STATES: MediaState[] = ['Default', 'Empty', 'Loading'];
const ALL_ASPECTS: MediaAspect[] = ['638:305', '16:9', '4:3', '1:1', '3:4'];

export function MediaPage({ brand }: MediaPageProps) {
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  const [state, setState] = useState<MediaState>('Default');
  const [aspect, setAspect] = useState<MediaAspect>('638:305');
  const [useSampleImage, setUseSampleImage] = useState(true);

  const previewKey = `${state}-${aspect}-${useSampleImage}`;
  const previewSrc = state === 'Default' && useSampleImage ? SAMPLE_SRC : undefined;

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
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                  style={{ width: '100%', maxWidth: aspect === '1:1' || aspect === '3:4' ? '280px' : '500px' }}
                >
                  <MediaLive
                    state={state}
                    aspect={aspect}
                    src={previewSrc}
                    alt="Sunlit mountain lake at dawn"
                    brand={brand}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5">

              {/* State */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">State</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_STATES.map((s) => (
                    <SegBtn key={s} active={state === s} onClick={() => setState(s)}>
                      {s}
                    </SegBtn>
                  ))}
                </div>
              </div>

              {/* Aspect ratio */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Aspect ratio</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_ASPECTS.map((a) => (
                    <SegBtn key={a} active={aspect === a} onClick={() => setAspect(a)}>
                      {a}
                      {a === '638:305' && <span className="text-[9px] ml-1 text-slate-400">Figma</span>}
                    </SegBtn>
                  ))}
                </div>
              </div>

              {/* Sample image toggle */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Source</p>
                <label className={['flex items-center gap-2.5 select-none group', state !== 'Default' ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'].join(' ')}>
                  <button
                    role="checkbox"
                    aria-checked={useSampleImage}
                    disabled={state !== 'Default'}
                    onClick={() => state === 'Default' && setUseSampleImage(!useSampleImage)}
                    className={[
                      'w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-100 flex-shrink-0',
                      useSampleImage ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-300 group-hover:border-slate-400',
                    ].join(' ')}
                  >
                    {useSampleImage && (
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                        <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                  <span className="text-xs text-slate-600">Use sample image</span>
                </label>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  Uncheck to render the Default state without a source — Media falls back to the Empty placeholder.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ────────────────────────────────────────────── */}
      <section>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Media</h1>
            <p className="text-slate-500 text-sm max-w-xl">
              Displays imagery, video, or audio assets. Use it to enrich visual storytelling or provide contextual media alongside text — embed it inside a card, list item, or hero layout. The component is a flexible fill surface: it adapts to the parent's width and preserves the chosen aspect ratio.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.25" />
                <path d="M5 3v3M5 7.5v.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              </svg>
              Content
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
          Media is a container + fill. The Empty and Loading states are built-in fallbacks when no source is available.
        </p>

        <div className="relative flex items-center justify-center py-20 px-8 rounded-xl" style={DOTTED_BG}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
            <MediaLive state="Default" aspect="638:305" src={SAMPLE_SRC} alt="Anatomy reference" brand={brand} />

            {/* Callout 1: Container (bottom-center) */}
            <div className="absolute flex flex-col items-center pointer-events-none" style={{ left: '50%', bottom: '-56px', transform: 'translateX(-50%)' }}>
              <div className="w-px bg-slate-400" style={{ height: '32px' }} />
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold" style={{ boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' }}>1</span>
            </div>

            {/* Callout 2: Image fill (top-center) */}
            <div className="absolute flex flex-col items-center pointer-events-none" style={{ left: '50%', top: '-56px', transform: 'translateX(-50%)' }}>
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold" style={{ boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' }}>2</span>
              <div className="w-px bg-slate-400" style={{ height: '32px' }} />
            </div>
          </div>
        </div>

        {/* Inline mini-previews for Empty / Loading */}
        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '12px', backgroundColor: '#fff' }}>
            <p style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>3 · Empty</p>
            <MediaLive state="Empty" aspect="16:9" brand={brand} />
          </div>
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '12px', backgroundColor: '#fff' }}>
            <p style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>4 · Loading</p>
            <MediaLive state="Loading" aspect="16:9" brand={brand} />
          </div>
        </div>

        {/* Legend */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {ANATOMY_PARTS.map((row) => (
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
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">Property</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Values</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">State</td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_STATES.map((s) => (
                      <span key={s} className="inline-flex items-center px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium">{s}</span>
                    ))}
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">Aspect ratio</td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_ASPECTS.map((a) => (
                      <span key={a} className="inline-flex items-center px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium">
                        {a}{a === '638:305' ? ' · Figma default' : ''}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">Object fit</td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium">
                    cover <span className="text-slate-400 ml-1">(scaleMode=FILL in Figma)</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-400 mt-4 italic">
          The underlying Figma component ("image", node 399:4121) exposes no variants. The State and Aspect ratio options above are container-level affordances provided by the React wrapper.
        </p>

        {/* Visual preview grid */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {(['Default', 'Empty', 'Loading'] as MediaState[]).map((s) => (
            <div key={s} style={{ padding: '16px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>{s}</p>
              <MediaLive
                state={s}
                aspect="16:9"
                src={s === 'Default' ? SAMPLE_SRC : undefined}
                alt="Preview"
                brand={brand}
              />
            </div>
          ))}
        </div>

        {/* Aspect-ratio row */}
        <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
          {ALL_ASPECTS.map((a) => (
            <div key={a} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: '#6b7280' }}>{a}</p>
              <MediaLive state="Default" aspect={a} src={SAMPLE_SRC} alt="Aspect preview" brand={brand} />
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Design Tokens</h2>
        <p className="text-sm text-slate-500 mb-4">
          Media has no coloured chrome of its own — it is a transparent frame. The only tokens in play render the Empty and Loading fallbacks.
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-48">Token</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">CSS Variable</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">Value ({brand})</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_TABLE_ROWS.map((row, i) => {
                const isActive = row.states.includes(state);
                const rawValue = (tokens[row.key as keyof typeof tokens] as string | undefined) ?? '—';
                // Preserve alpha channel (8-digit hex) for the swatch so alpha-based tokens like
                // bg-muted render faithfully. Derive luminance from the RGB portion only.
                const swatchFull = rawValue;
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
                          style={{
                            backgroundColor: swatchFull,
                            backgroundImage:
                              swatchFull.length > 7
                                ? 'linear-gradient(45deg, rgba(0,0,0,0.06) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.06) 75%), linear-gradient(45deg, rgba(0,0,0,0.06) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.06) 75%)'
                                : 'none',
                            backgroundSize: '6px 6px',
                            backgroundPosition: '0 0, 3px 3px',
                          }}
                        />
                        <span
                          className="font-mono text-xs px-1.5 py-0.5 rounded border"
                          style={{
                            backgroundColor: '#ffffff',
                            color: '#1e293b',
                            borderColor: 'rgba(0,0,0,0.08)',
                          }}
                        >
                          {swatchFull.toUpperCase()}
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
          Guidelines for implementing Media in an inclusive way.
        </p>
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
          When and how to use the Media component.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>✓ When to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>• Product, lounge, or destination photography inside cards</li>
              <li style={{ marginBottom: '6px' }}>• Hero imagery at the top of a detail page</li>
              <li style={{ marginBottom: '6px' }}>• Thumbnail tiles in galleries, carousels, or photo grids</li>
              <li>• Video poster frames or loading placeholders for remote assets</li>
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>✗ When not to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>• Don't use for icons or glyphs — use the Icon library instead</li>
              <li style={{ marginBottom: '6px' }}>• Don't use for brand logos — use the Brand Logo component</li>
              <li style={{ marginBottom: '6px' }}>• Don't use for country flags — use the Flag component in List Item</li>
              <li>• Don't use as a static colour block — style the parent surface with a background token</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
