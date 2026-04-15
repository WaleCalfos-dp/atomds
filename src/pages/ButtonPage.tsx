import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ButtonLive,
  type ButtonType,
  type ButtonVariant,
  type ButtonSize,
  type ButtonState,
} from '../components/button/ButtonLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

interface ButtonPageProps {
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

const ALL_TYPES: ButtonType[] = [
  'Full Button', 'Icon Only', 'Social Login', 'GooglePay', 'ApplePay', 'PayPal',
];

const FULL_BUTTON_VARIANTS: ButtonVariant[] = [
  'Primary', 'Secondary', 'Tertiary', 'White', 'Destructive', 'Destructive-Text',
];

const ICON_ONLY_VARIANTS: ButtonVariant[] = ['Primary', 'Secondary'];
const SOCIAL_LOGIN_VARIANTS: ButtonVariant[] = ['Primary', 'Secondary'];

const ALL_SIZES: ButtonSize[] = ['Default', 'Small', 'Tiny'];
const ALL_STATES: ButtonState[] = ['Default', 'Hover', 'Focus', 'Active', 'Disabled', 'Loading'];

// Variants available per type
function variantsForType(type: ButtonType): ButtonVariant[] | null {
  if (type === 'Full Button') return FULL_BUTTON_VARIANTS;
  if (type === 'Icon Only')   return ICON_ONLY_VARIANTS;
  if (type === 'Social Login') return SOCIAL_LOGIN_VARIANTS;
  return null; // payment buttons have no variant selector
}

const VARIANT_META: Record<ButtonVariant, { dotColor: string; dotBorder: string }> = {
  Primary:            { dotColor: 'var(--atom-background-primary-bg-primary-default)', dotBorder: 'var(--atom-background-primary-bg-primary-default)' },
  Secondary:          { dotColor: 'transparent', dotBorder: 'var(--atom-border-default-border-default-brand)' },
  Tertiary:           { dotColor: 'transparent', dotBorder: 'var(--atom-foreground-core-fg-link)' },
  White:              { dotColor: '#e2e8f0', dotBorder: '#94a3b8' },
  Destructive:        { dotColor: 'var(--atom-background-alert-bg-error-full)', dotBorder: 'var(--atom-background-alert-bg-error-full)' },
  'Destructive-Text': { dotColor: 'transparent', dotBorder: 'var(--atom-foreground-feedback-fg-error)' },
};

const TOKEN_TABLE_ROWS: {
  label: string; cssVar: string; fallback: string; tokenKey?: string; types: ButtonType[]; variants?: ButtonVariant[];
}[] = [
  { label: 'Primary bg',           cssVar: '--atom-background-primary-bg-primary-default',           tokenKey: 'atom.background.primary.bg-primary-default',              fallback: '#0a2333', types: ['Full Button', 'Icon Only'], variants: ['Primary'] },
  { label: 'Primary fg',           cssVar: '--atom-foreground-primary-fg-brand-primary-inverse',     tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse',         fallback: '#ffffff', types: ['Full Button', 'Icon Only'], variants: ['Primary', 'Destructive'] },
  { label: 'Secondary / White bg', cssVar: '--atom-background-primary-bg-primary-inverse',           tokenKey: 'atom.background.primary.bg-primary-inverse',              fallback: '#ffffff', types: ['Full Button', 'Icon Only', 'Social Login'], variants: ['Secondary', 'White'] },
  { label: 'Brand fg',             cssVar: '--atom-foreground-primary-fg-brand-primary',             tokenKey: 'atom.foreground.primary.fg-brand-primary',                fallback: '#0a2333', types: ['Full Button', 'Icon Only', 'Social Login'], variants: ['Secondary', 'White'] },
  { label: 'Brand border',         cssVar: '--atom-border-default-border-default-brand',             tokenKey: 'atom.border.default.border-default-brand',                fallback: '#0a2333', types: ['Full Button', 'Icon Only', 'Social Login'], variants: ['Secondary'] },
  { label: 'Tertiary / link fg',   cssVar: '--atom-foreground-core-fg-link',                        tokenKey: 'atom.foreground.core.fg-link',                            fallback: '#006b99', types: ['Full Button'], variants: ['Tertiary'] },
  { label: 'Destructive bg',       cssVar: '--atom-background-alert-bg-error-full',                 tokenKey: 'atom.background.alert.bg-error-full',                     fallback: '#e02d3c', types: ['Full Button'], variants: ['Destructive'] },
  { label: 'Destructive-Text fg',  cssVar: '--atom-foreground-feedback-fg-error',                   tokenKey: 'atom.foreground.feedback.fg-error',                       fallback: '#e02d3c', types: ['Full Button'], variants: ['Destructive-Text'] },
  { label: 'Border radius',        cssVar: '--atom-buttons-radius',                                                                                                      fallback: '999px',  types: ['Full Button', 'Icon Only', 'Social Login'], variants: FULL_BUTTON_VARIANTS },
  { label: 'Focus ring',           cssVar: '--atom-border-selection-and-focus-border-primary-focus', tokenKey: 'atom.border.selection-and-focus.border-primary-focus',    fallback: '#3b82f6', types: ALL_TYPES, variants: FULL_BUTTON_VARIANTS },
];

const A11Y_ROWS = [
  { icon: '⌨️', title: 'Keyboard interaction', body: 'All button types receive focus and activate on Enter or Space. Never implement buttons as <div> or <a> without role="button" and keyboard handlers.' },
  { icon: '🚫', title: 'Disabled state', body: 'Use the disabled attribute — not visual styling alone. Screen readers announce disabled state; keyboard focus is removed automatically.' },
  { icon: '⏳', title: 'Loading state', body: 'Add aria-busy="true" when loading. If label changes to "Loading…", that is announced. The spinner SVG should be aria-hidden="true".' },
  { icon: '🖼️', title: 'Icon Only buttons', body: 'Icon Only buttons have no visible label — always provide aria-label describing the action (e.g. aria-label="Add to cart"). The icon is aria-hidden="true".' },
  { icon: '🔐', title: 'Social Login buttons', body: 'Label must identify the provider: "Continue with Google". Do not rely on the provider logo alone — always include visible text.' },
  { icon: '💳', title: 'Payment buttons', body: 'GooglePay, ApplePay, and PayPal buttons should follow each provider\'s branding guidelines. Always test with real provider SDKs in production.' },
  { icon: '🎨', title: 'Color contrast', body: 'Primary and Destructive (white on filled bg) meet WCAG AA 4.5:1. Secondary/Tertiary/White/Destructive-Text meet AA. Disabled is exempt per WCAG 1.4.3.' },
];

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

function canvasBg(buttonType: ButtonType, variant: ButtonVariant): React.CSSProperties {
  // White variant and payment buttons look best on dark background
  if (variant === 'White' || buttonType === 'GooglePay' || buttonType === 'ApplePay') return DARK_BG;
  return DOTTED_BG;
}

export function ButtonPage({ brand }: ButtonPageProps) {
  const [buttonType, setButtonType] = useState<ButtonType>('Full Button');
  const [variant, setVariant]       = useState<ButtonVariant>('Primary');
  const [size, setSize]             = useState<ButtonSize>('Default');
  const [state, setState]           = useState<ButtonState>('Default');
  const [label, setLabel]           = useState('Button Label');
  const [showIconLeft,  setShowIconLeft]  = useState(false);
  const [showIconRight, setShowIconRight] = useState(false);

  const availableVariants = variantsForType(buttonType);
  // Reset variant when type changes and current variant isn't valid
  const effectiveVariant: ButtonVariant =
    availableVariants && !availableVariants.includes(variant) ? availableVariants[0] : variant;

  const buttonKey = `${buttonType}-${effectiveVariant}-${size}-${state}-${label}-${showIconLeft}-${showIconRight}`;
  const isPayment = buttonType === 'GooglePay' || buttonType === 'ApplePay' || buttonType === 'PayPal';
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-72">

            {/* Canvas */}
            <div
              className="flex-1 flex items-center justify-center p-12 min-h-52"
              style={canvasBg(buttonType, effectiveVariant)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={buttonKey}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                >
                  <ButtonLive
                    buttonType={buttonType}
                    variant={effectiveVariant}
                    size={size}
                    state={state}
                    label={label}
                    showIconLeft={showIconLeft}
                    showIconRight={showIconRight}
                    brand={brand}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5 overflow-y-auto">

              {/* Type */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Type</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setButtonType(t)}
                      className={[
                        'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        buttonType === t
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Variant — only for non-payment types */}
              {availableVariants && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Variant</p>
                  <div className="flex flex-wrap gap-1.5">
                    {availableVariants.map((v) => {
                      const meta = VARIANT_META[v];
                      return (
                        <button
                          key={v}
                          onClick={() => setVariant(v)}
                          className={[
                            'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                            effectiveVariant === v
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                          ].join(' ')}
                        >
                          <span className="w-2 h-2 rounded-full flex-shrink-0 border"
                            style={{ backgroundColor: meta.dotColor, borderColor: meta.dotBorder }} />
                          {v}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Size</p>
                <div className="flex rounded-lg border border-slate-200 overflow-hidden w-fit">
                  {ALL_SIZES.map((s) => (
                    <button key={s} onClick={() => setSize(s)}
                      className={['px-3 py-1.5 text-xs font-medium transition-all duration-100',
                        size === s ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'].join(' ')}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* State */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">State</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_STATES.map((s) => (
                    <button key={s} onClick={() => setState(s)}
                      className={['px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        state === s
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'].join(' ')}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Label — not for Icon Only or payment */}
              {buttonType !== 'Icon Only' && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Label</p>
                  <input
                    type="text" value={label} maxLength={30}
                    onChange={(e) => setLabel(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-md text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition"
                    placeholder="Label text…"
                  />
                </div>
              )}

              {/* Icons — Full Button only */}
              {buttonType === 'Full Button' && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Icons</p>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: 'Icon Left',  value: showIconLeft,  set: setShowIconLeft },
                      { label: 'Icon Right', value: showIconRight, set: setShowIconRight },
                    ].map(({ label: lbl, value, set }) => (
                      <label key={lbl} className="flex items-center gap-2.5 cursor-pointer select-none group">
                        <button role="checkbox" aria-checked={value} onClick={() => set(!value)}
                          className={['w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-100 flex-shrink-0',
                            value ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-300 group-hover:border-slate-400'].join(' ')}>
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
              )}

              {/* Payment note */}
              {isPayment && (
                <p className="text-xs text-slate-400 leading-relaxed">
                  Payment buttons use fixed provider branding. In production, integrate via the official provider SDK — do not replicate these styles manually.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Button</h1>
            <p className="text-slate-500 text-sm max-w-xl">
              The primary action element. Supports six Full Button variants, Icon Only, Social Login, and payment buttons (GooglePay, ApplePay, PayPal).
              All sized across Default / Small / Tiny. Font family updates per brand via <code className="text-xs bg-slate-100 px-1 rounded">--atom-font-body</code>.
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
        <p className="text-sm text-slate-500 mb-5">Full Button anatomy. Icon Only has a single icon slot; Social Login adds a provider icon left-slot with justified layout.</p>

        <div className="relative flex items-center justify-center py-20 px-8 rounded-xl" style={DOTTED_BG}>
          <div style={{ transform: 'scale(1.8)', transformOrigin: 'center' }}>
            <ButtonLive buttonType="Full Button" variant="Primary" size="Default" state="Default"
              label="Button Label" showIconLeft={true} showIconRight={true} brand={brand} />
          </div>
          {/* 1 — Container (bottom) */}
          <div className="absolute bottom-4 flex flex-col items-center pointer-events-none" style={{ left: '50%', transform: 'translateX(-50%)' }}>
            <div className="w-px bg-slate-400" style={{ height: '32px' }} />
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">1</span>
          </div>
          {/* 2 — Icon Left (top) */}
          <div className="absolute top-4 flex flex-col items-center pointer-events-none" style={{ left: '37%', transform: 'translateX(-50%)' }}>
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">2</span>
            <div className="w-px bg-slate-400" style={{ height: '32px' }} />
          </div>
          {/* 3 — Label (top) */}
          <div className="absolute top-4 flex flex-col items-center pointer-events-none" style={{ left: '50%', transform: 'translateX(-50%)' }}>
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">3</span>
            <div className="w-px bg-slate-400" style={{ height: '32px' }} />
          </div>
          {/* 4 — Icon Right (top) */}
          <div className="absolute top-4 flex flex-col items-center pointer-events-none" style={{ left: '63%', transform: 'translateX(-50%)' }}>
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">4</span>
            <div className="w-px bg-slate-400" style={{ height: '32px' }} />
          </div>
        </div>

        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {[
            { num: '1', name: 'Container',  desc: 'Pill-shaped wrapper (border-radius: 999px). Background and border driven by variant token. Height: 64/52/42px. Icon Only: 60/52/40px square.' },
            { num: '2', name: 'Icon Left',  desc: 'Optional 16×16px icon slot (Full Button). 24×24px centered icon (Icon Only). Provider logo slot (Social Login). All inherit currentColor.' },
            { num: '3', name: 'Label',      desc: '14px / weight 600. Font family from --atom-font-body — changes per brand. Required for Full Button and Social Login. Absent in Icon Only.' },
            { num: '4', name: 'Icon Right', desc: 'Optional 16×16px icon slot (Full Button only). Social Login has an empty right slot to center the label. Payment buttons show provider logos here.' },
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
                  label: 'Type',
                  chips: [
                    { text: 'Full Button', note: 'Primary · Secondary · Tertiary · White · Destructive · Destructive-Text' },
                    { text: 'Icon Only',   note: 'Primary · Secondary' },
                    { text: 'Social Login', note: 'Primary · Secondary' },
                    { text: 'GooglePay',   note: 'Fixed branding' },
                    { text: 'ApplePay',    note: 'Fixed branding' },
                    { text: 'PayPal',      note: 'Fixed branding' },
                  ],
                },
                {
                  label: 'Size',
                  chips: [
                    { text: 'Default', note: '64px (Icon Only: 60px)' },
                    { text: 'Small',   note: '52px' },
                    { text: 'Tiny',    note: '42px (Icon Only: 40px)' },
                  ],
                },
                {
                  label: 'State',
                  chips: ALL_STATES.map(s => ({ text: s, note: '' })),
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
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Design Tokens</h2>
        <p className="text-sm text-slate-500 mb-4">
          Active tokens for the selected type + variant are highlighted. Payment buttons use fixed provider brand colors, not design system tokens.
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">Token</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">CSS Variable</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">Fallback</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_TABLE_ROWS.map((row, i) => {
                const typeActive    = row.types.includes(buttonType);
                const variantActive = !row.variants || row.variants.includes(effectiveVariant);
                const isActive      = typeActive && variantActive;
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
        {/* Payment note */}
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-xs text-amber-800">
            <strong>Payment buttons</strong> (GooglePay, ApplePay, PayPal) use fixed provider brand colors — <code className="bg-amber-100 px-1 rounded">#000000</code> for Google/Apple Pay and <code className="bg-amber-100 px-1 rounded">#ffc439</code> for PayPal — not design system tokens. Follow each provider's official branding guidelines.
          </p>
        </div>
      </section>

      {/* ── 6. ACCESSIBILITY ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Accessibility</h2>
        <p className="text-sm text-slate-500 mb-4">Guidelines for implementing all Button types inclusively.</p>
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
          When and how to use each Button type and variant.
        </p>

        {/* Per-type/variant usage cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
          {[
            { title: 'Primary',          color: '#0a2333', bg: '#f0f4f8', when: 'The dominant action per view. Use once. E.g. "Submit", "Save", "Continue".' },
            { title: 'Secondary',        color: '#0a2333', bg: '#f9fafb', when: 'Supporting actions alongside Primary. Multiple allowed. E.g. "Cancel" + "Save Draft".' },
            { title: 'Tertiary',         color: '#006b99', bg: '#f0f9ff', when: 'Low-emphasis inline actions. No fill or border. Best inside content or alongside elements.' },
            { title: 'White',            color: '#1e293b', bg: '#e2e8f0', when: 'On dark or brand-colored surfaces where Primary fill would be invisible. Inverts the fill.' },
            { title: 'Destructive',      color: '#991b1b', bg: '#fef2f2', when: 'Permanent or high-risk actions: delete, remove, revoke. Always confirm before execution.' },
            { title: 'Destructive-Text', color: '#b91c1c', bg: '#fff5f5', when: 'Low-emphasis destructive actions where a full red fill would be too aggressive. E.g. inline "Remove".' },
            { title: 'Icon Only',        color: '#374151', bg: '#f8fafc', when: 'When space is constrained and the action is universally understood. Always add aria-label.' },
            { title: 'Social Login',     color: '#374151', bg: '#f8fafc', when: 'Authentication flows. Always show provider name in the label alongside the provider logo.' },
            { title: 'Payment buttons',  color: '#374151', bg: '#fffbeb', when: 'Checkout flows. Use provider SDKs in production — never replicate payment button styles manually.' },
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
              <li style={{ marginBottom: '6px' }}>• Use Primary for the single critical action per view</li>
              <li style={{ marginBottom: '6px' }}>• Use Icon Only when space is constrained and intent is clear</li>
              <li style={{ marginBottom: '6px' }}>• Use Social Login with provider name visible in label</li>
              <li style={{ marginBottom: '6px' }}>• Use Destructive for delete / revoke actions</li>
              <li>• Use White on dark or brand-colored surfaces</li>
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>✗ When not to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>• Don't use multiple Primary buttons in the same view</li>
              <li style={{ marginBottom: '6px' }}>• Don't use Icon Only without an aria-label</li>
              <li style={{ marginBottom: '6px' }}>• Don't replicate GooglePay/ApplePay/PayPal styles manually</li>
              <li style={{ marginBottom: '6px' }}>• Don't use Destructive for non-destructive actions</li>
              <li>• Don't disable without showing why — use inline validation</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
