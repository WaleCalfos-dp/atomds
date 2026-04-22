import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AvatarLive, type AvatarSize, type AvatarType, type AvatarStyle } from '../components/avatar/AvatarLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

interface AvatarPageProps {
  brand: Brand;
}

/* ── Shared canvas bg ─────────────────────────────────────────────────────── */
const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

/* ── Size-ordered arrays ──────────────────────────────────────────────────── */
const SIZES: AvatarSize[]   = ['XSmall', 'Small', 'Medium', 'Large', 'XLarge'];
const TYPES: AvatarType[]   = ['Initials', 'Icon', 'Photo'];
const STYLES: AvatarStyle[] = ['Brand', 'Neutral'];

/* ── Dot colours for the Type selector chips ──────────────────────────────── */
const TYPE_DOT_COLORS: Record<AvatarType, string> = {
  Initials: '#0a2333',
  Icon:     '#045477',
  Photo:    '#006b99',
};

/* ── Style dot colours ────────────────────────────────────────────────────── */
const STYLE_DOT_COLORS: Record<AvatarStyle, string> = {
  Brand:   '#d53f34',
  Neutral: '#91908f',
};

/* ── Variant table ────────────────────────────────────────────────────────── */
const VARIANT_ROWS: { label: string; chips: { text: string; dot?: string }[] }[] = [
  { label: 'Type',            chips: [{ text: 'Photo', dot: TYPE_DOT_COLORS.Photo }, { text: 'Initials', dot: TYPE_DOT_COLORS.Initials }, { text: 'Icon', dot: TYPE_DOT_COLORS.Icon }] },
  { label: 'Size',            chips: [{ text: 'XLarge' }, { text: 'Large' }, { text: 'Medium' }, { text: 'Small' }, { text: 'XSmall' }] },
  { label: 'Style',           chips: [{ text: 'Brand', dot: STYLE_DOT_COLORS.Brand }, { text: 'Neutral', dot: STYLE_DOT_COLORS.Neutral }] },
  { label: 'Nested instance', chips: [{ text: 'Profile Icon' }] },
];

/* ── Token table ──────────────────────────────────────────────────────────── */
const TOKEN_TABLE_ROWS: { label: string; key: string; cssVar: string; styles: AvatarStyle[] }[] = [
  { label: 'Accent bg (Brand)',       key: 'atom.background.core.bg-accent',                          cssVar: '--atom-background-core-bg-accent',                          styles: ['Brand'] },
  { label: 'Inverse fg (Brand)',      key: 'atom.foreground.primary.fg-brand-primary-inverse',        cssVar: '--atom-foreground-primary-fg-brand-primary-inverse',        styles: ['Brand'] },
  { label: 'Muted bg (Neutral)',      key: 'atom.background.core.bg-muted',                           cssVar: '--atom-background-core-bg-muted',                           styles: ['Neutral'] },
  { label: 'Primary fg (Neutral)',    key: 'atom.foreground.core.fg-primary',                          cssVar: '--atom-foreground-core-fg-primary',                          styles: ['Neutral'] },
];

/* ── Accessibility rows ───────────────────────────────────────────────────── */
const A11Y_ROWS = [
  {
    icon: '\uD83C\uDFF7\uFE0F',
    title: 'ARIA attributes',
    body: 'Use role="img" with a meaningful aria-label on the avatar container. For Photo type include the user\'s name. For Initials type include the displayed initials. For Icon type use a generic label like "User avatar".',
  },
  {
    icon: '\uD83C\uDFA8',
    title: 'Color contrast',
    body: 'Brand style uses white text on an accent background that meets WCAG AA 4.5:1 contrast across all six brands. Neutral style uses dark text (#4B4A4A) on a near-transparent background, relying on the page surface for contrast.',
  },
  {
    icon: '\uD83D\uDDBC\uFE0F',
    title: 'Image alt text',
    body: 'For Photo avatars, provide meaningful alt text on the <img> element describing the person. If the avatar is purely decorative (e.g., next to a name), use alt="" to avoid redundancy.',
  },
  {
    icon: '\uD83D\uDD24',
    title: 'Text sizing',
    body: 'Initials text scales proportionally with avatar size (10px at XSmall to 26px at XLarge). Ensure initials remain legible at the XSmall (24px) size; two-character initials are recommended.',
  },
  {
    icon: '\u2728',
    title: 'Decorative use',
    body: 'When the avatar appears alongside the user\'s name, consider marking it as decorative (aria-hidden="true") to avoid screen readers announcing redundant information.',
  },
];

/* ── Helpers ───────────────────────────────────────────────────────────────── */
function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

/* ── Placeholder photo (tiny data-uri circle) ─────────────────────────────── */
const PHOTO_PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="128" height="128" rx="64" fill="%23c8d6e5"/><text x="64" y="72" text-anchor="middle" font-size="48" font-family="sans-serif" fill="%23576574">JD</text></svg>',
  );

/* ═════════════════════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═════════════════════════════════════════════════════════════════════════════ */
export function AvatarPage({ brand }: AvatarPageProps) {
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  /* interactive preview state */
  const [size, setSize]               = useState<AvatarSize>('Large');
  const [type, setType]               = useState<AvatarType>('Initials');
  const [avatarStyle, setAvatarStyle] = useState<AvatarStyle>('Brand');

  const previewKey = `${size}-${type}-${avatarStyle}`;

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ─────────────────────────────────────────── */}
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
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <AvatarLive
                    size={size}
                    type={type}
                    avatarStyle={avatarStyle}
                    initials="WC"
                    imageSrc={type === 'Photo' ? PHOTO_PLACEHOLDER : undefined}
                    brand={brand}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: controls */}
            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5 overflow-y-auto">

              {/* Type */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Type</p>
                <div className="flex flex-wrap gap-1.5">
                  {TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={[
                        'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        type === t
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: TYPE_DOT_COLORS[t] }} />
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Size</p>
                <div className="flex flex-wrap gap-1.5">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={[
                        'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        size === s
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Style</p>
                <div className="flex flex-wrap gap-1.5">
                  {STYLES.map((s) => {
                    /* Photo type is always Brand */
                    const disabled = type === 'Photo' && s === 'Neutral';
                    return (
                      <button
                        key={s}
                        onClick={() => !disabled && setAvatarStyle(s)}
                        className={[
                          'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                          avatarStyle === s && !disabled
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : disabled
                              ? 'text-slate-300 border-slate-100 cursor-not-allowed'
                              : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                        ].join(' ')}
                      >
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: STYLE_DOT_COLORS[s], opacity: disabled ? 0.3 : 1 }} />
                        {s}
                      </button>
                    );
                  })}
                </div>
                {type === 'Photo' && (
                  <p className="text-[10px] text-slate-400 mt-1.5">Photo type only supports Brand style.</p>
                )}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ──────────────────────────────────────────────── */}
      <section>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Avatar</h1>
            <p className="text-slate-500 text-sm max-w-xl">
              Represents a user or entity with a photo, initials, or a profile icon.
              Available in five sizes (XSmall to XLarge) and two styles (Brand and Neutral). Photo type always renders in Brand style.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Stable
            </span>
          </div>
        </div>
      </section>

      <hr className="border-slate-200" />

      {/* ── 3. ANATOMY ─────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Anatomy</h2>
        <p className="text-sm text-slate-500 mb-5">
          The Avatar is a circular container with one of three content types: Initials text, a Profile Icon, or a Photo image.
        </p>

        {/* Anatomy visual: show all three types side by side at Large size */}
        <div className="flex items-center justify-center rounded-xl" style={{ ...DOTTED_BG, padding: '60px 32px' }}>
          <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-end' }}>
            {/* Initials */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ position: 'relative' }}>
                {/* Callout: 2 */}
                <div
                  className="pointer-events-none"
                  style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '4px' }}
                >
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">2</span>
                  <div className="w-px bg-slate-400" style={{ height: '20px' }} />
                </div>
                <AvatarLive size="Large" type="Initials" avatarStyle="Brand" initials="WC" brand={brand} />
                {/* Callout: 1 */}
                <div
                  className="pointer-events-none"
                  style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4px' }}
                >
                  <div className="w-px bg-slate-400" style={{ height: '20px' }} />
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">1</span>
                </div>
              </div>
              <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 500, marginTop: '24px' }}>Initials</span>
            </div>

            {/* Icon */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ position: 'relative' }}>
                <div
                  className="pointer-events-none"
                  style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '4px' }}
                >
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">3</span>
                  <div className="w-px bg-slate-400" style={{ height: '20px' }} />
                </div>
                <AvatarLive size="Large" type="Icon" avatarStyle="Brand" brand={brand} />
              </div>
              <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 500, marginTop: '24px' }}>Icon</span>
            </div>

            {/* Photo */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ position: 'relative' }}>
                <div
                  className="pointer-events-none"
                  style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '4px' }}
                >
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">4</span>
                  <div className="w-px bg-slate-400" style={{ height: '20px' }} />
                </div>
                <AvatarLive size="Large" type="Photo" avatarStyle="Brand" imageSrc={PHOTO_PLACEHOLDER} brand={brand} />
              </div>
              <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 500, marginTop: '24px' }}>Photo</span>
            </div>
          </div>
        </div>

        {/* Anatomy legend */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {[
            { num: '1', name: 'Container',    desc: 'Circular wrapper (border-radius: 50%). Sizes: XSmall 24px, Small 32px, Medium 40px, Large 48px, XLarge 64px. No border or stroke.' },
            { num: '2', name: 'Initials',      desc: 'Up to two uppercase characters centered in the circle. Poppins SemiBold (600). Font scales with size: 10px (XS) to 26px (XL).' },
            { num: '3', name: 'Profile Icon',  desc: 'Person silhouette SVG icon. Path data is unique per size for pixel-perfect rendering. Inherits foreground colour from style token.' },
            { num: '4', name: 'Photo',         desc: 'User image clipped to circle (object-fit: cover). Always renders in Brand style. Falls back to profile icon when no image is provided.' },
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

      {/* ── 4. VARIANTS ────────────────────────────────────────────────────── */}
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

        {/* Visual preview grid: sizes across, types down, both styles */}
        <div style={{ marginTop: '16px' }}>
          {/* Brand row */}
          <div style={{ padding: '20px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa', marginBottom: '12px' }}>
            <p style={{ margin: '0 0 16px', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>Brand</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {TYPES.map((t) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ width: '52px', fontSize: '11px', fontWeight: 500, color: '#9ca3af', flexShrink: 0 }}>{t}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {SIZES.map((s) => (
                      <AvatarLive
                        key={`${t}-${s}-brand`}
                        size={s}
                        type={t}
                        avatarStyle="Brand"
                        initials="WC"
                        imageSrc={t === 'Photo' ? PHOTO_PLACEHOLDER : undefined}
                        brand={brand}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Neutral row (Icon + Initials only) */}
          <div style={{ padding: '20px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
            <p style={{ margin: '0 0 16px', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>Neutral</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {(['Initials', 'Icon'] as AvatarType[]).map((t) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ width: '52px', fontSize: '11px', fontWeight: 500, color: '#9ca3af', flexShrink: 0 }}>{t}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {SIZES.map((s) => (
                      <AvatarLive
                        key={`${t}-${s}-neutral`}
                        size={s}
                        type={t}
                        avatarStyle="Neutral"
                        initials="WC"
                        brand={brand}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ───────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Design Tokens</h2>
        <p className="text-sm text-slate-500 mb-4">
          Active tokens for the selected style are highlighted. Switch Style or Brand to see values update.
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
                const isActive = row.styles.includes(avatarStyle);
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

      {/* ── 6. ACCESSIBILITY ───────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Accessibility</h2>
        <p className="text-sm text-slate-500 mb-4">
          Guidelines for implementing Avatar in an inclusive way.
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

      {/* ── 7. USAGE ───────────────────────────────────────────────────────── */}
      <section>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>Usage</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          When and how to use the Avatar component.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>When to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>Identifying users in lists, cards, or comment threads</li>
              <li style={{ marginBottom: '6px' }}>Profile headers showing the user's photo or initials</li>
              <li style={{ marginBottom: '6px' }}>Compact user indicators in navigation bars or menus</li>
              <li>Representing entities (teams, organisations) with branded initials</li>
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>When not to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>Don't use avatars for decorative icons unrelated to people or entities</li>
              <li style={{ marginBottom: '6px' }}>Don't use XSmall size for primary identification -- pair with a name label</li>
              <li style={{ marginBottom: '6px' }}>Don't display more than two initials -- truncate longer names</li>
              <li>Don't rely solely on the avatar for user identification without supporting text</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
