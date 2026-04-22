import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DialogLive, type DialogPlatform, type DialogType } from '../components/dialog/DialogLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

interface DialogPageProps {
  brand: Brand;
}

// ─── Token map for the design tokens table ───────────────────────────────────
// Every row highlights when it's directly in play for the current type
// (icon colours are dialogType-specific; the rest are shared across all types).
const TOKEN_TABLE_ROWS: {
  label: string;
  key: string;
  cssVar: string;
  types: DialogType[];
}[] = [
  { label: 'Card background',   key: 'atom.background.primary.bg-primary-inverse',       cssVar: '--atom-background-primary-bg-primary-inverse',       types: ['Info', 'Success', 'Warning', 'Error'] },
  { label: 'Primary button bg', key: 'atom.background.primary.bg-primary-default',       cssVar: '--atom-background-primary-bg-primary-default',       types: ['Info', 'Success', 'Warning', 'Error'] },
  { label: 'Primary button fg', key: 'atom.foreground.primary.fg-brand-primary-inverse', cssVar: '--atom-foreground-primary-fg-brand-primary-inverse', types: ['Info', 'Success', 'Warning', 'Error'] },
  { label: 'Title / outline',   key: 'atom.foreground.primary.fg-brand-primary',         cssVar: '--atom-foreground-primary-fg-brand-primary',         types: ['Info', 'Success', 'Warning', 'Error'] },
  { label: 'Body text',         key: 'atom.foreground.core.fg-primary',                  cssVar: '--atom-foreground-core-fg-primary',                  types: ['Info', 'Success', 'Warning', 'Error'] },
  { label: 'Tertiary link',     key: 'atom.foreground.core.fg-link',                     cssVar: '--atom-foreground-core-fg-link',                     types: ['Info', 'Success', 'Warning', 'Error'] },
  { label: 'Close border',      key: 'atom.border.default.border-default',               cssVar: '--atom-border-default-border-default',               types: ['Info', 'Success', 'Warning', 'Error'] },
  { label: 'Secondary border',  key: 'atom.border.default.border-default-brand',         cssVar: '--atom-border-default-border-default-brand',         types: ['Info', 'Success', 'Warning', 'Error'] },
];

// Icon colours are raw hex — Figma uses type-specific signal colours, not
// brand-resolved tokens. Listing them here keeps the Design Tokens section
// honest about what is tokenised and what is a fixed system colour.
const TYPE_ICON_COLOR: Record<DialogType, string> = {
  Info:    '#006B99',
  Success: '#067647',
  Warning: '#D6A025',
  Error:   '#E02D3C',
};

// ─── Accessibility rows ───────────────────────────────────────────────────────
const A11Y_ROWS = [
  {
    icon: '🪟',
    title: 'Modal semantics',
    body: 'Uses role="dialog" with aria-modal="true" plus aria-labelledby / aria-describedby so assistive tech announces the title and description when the dialog opens.',
  },
  {
    icon: '🎯',
    title: 'Focus management',
    body: 'When opened, move focus to the first actionable control (usually the primary button). When closed, return focus to the trigger. Trap focus inside the dialog while it is open.',
  },
  {
    icon: '⌨️',
    title: 'Keyboard interaction',
    body: 'Esc dismisses the dialog. Tab / Shift+Tab cycles between the close button and Primary / Secondary / Tertiary actions. Enter activates the focused button.',
  },
  {
    icon: '🎨',
    title: 'Not color alone',
    body: 'Icon colour (blue / green / amber / red) communicates severity, but the Title and Description always carry the underlying message in plain language.',
  },
  {
    icon: '👁️',
    title: 'Contrast',
    body: 'Title on white (#0a2333 on #ffffff), body text (#4b4a4a on #ffffff), and button label on #0a2333 all exceed WCAG AA 4.5:1. Icon tints meet AA for non-text contrast.',
  },
];

// ─── Dotted canvas background ────────────────────────────────────────────────
const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// ─── Shared tiny primitives ──────────────────────────────────────────────────
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

const PLATFORMS: DialogPlatform[] = ['App', 'Desktop'];
const DIALOG_TYPES: DialogType[] = ['Info', 'Success', 'Warning', 'Error'];

// ─── Component ───────────────────────────────────────────────────────────────
export function DialogPage({ brand }: DialogPageProps) {
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  // Interactive preview state
  const [platform, setPlatform] = useState<DialogPlatform>('Desktop');
  const [dialogType, setDialogType] = useState<DialogType>('Info');
  const [showSecondary, setShowSecondary] = useState(true);
  const [showTertiary, setShowTertiary] = useState(true);
  const [showClose, setShowClose] = useState(true);

  const previewKey = `${platform}-${dialogType}-${showSecondary}-${showTertiary}-${showClose}`;

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────── */}
      <section>
        <div
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#fff',
          }}
        >
          <div style={{ display: 'flex', minHeight: '520px' }}>
            <div
              style={{
                flex: 1,
                ...DOTTED_BG,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 24px',
                minWidth: 0,
                overflow: 'auto',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <DialogLive
                    platform={platform}
                    dialogType={dialogType}
                    showSecondary={showSecondary}
                    showTertiary={showTertiary}
                    showClose={showClose}
                    showOverlay={false}
                    brand={brand}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div
              style={{
                width: '240px',
                flexShrink: 0,
                borderLeft: '1px solid #e5e7eb',
                backgroundColor: '#fff',
                padding: '20px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div>
                <p style={LABEL_STYLE}>Type</p>
                <div
                  style={{
                    display: 'flex',
                    padding: '2px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    gap: '2px',
                  }}
                >
                  {DIALOG_TYPES.map((t) => (
                    <SegBtn
                      key={t}
                      active={dialogType === t}
                      onClick={() => setDialogType(t)}
                    >
                      {t}
                    </SegBtn>
                  ))}
                </div>
              </div>
              <div>
                <p style={LABEL_STYLE}>Platform</p>
                <div
                  style={{
                    display: 'flex',
                    padding: '2px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    gap: '2px',
                  }}
                >
                  {PLATFORMS.map((p) => (
                    <SegBtn
                      key={p}
                      active={platform === p}
                      onClick={() => setPlatform(p)}
                    >
                      {p}
                    </SegBtn>
                  ))}
                </div>
              </div>
              <div>
                <p style={LABEL_STYLE}>Secondary button</p>
                <div
                  style={{
                    display: 'flex',
                    padding: '2px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    gap: '2px',
                  }}
                >
                  <SegBtn active={showSecondary} onClick={() => setShowSecondary(true)}>Show</SegBtn>
                  <SegBtn active={!showSecondary} onClick={() => setShowSecondary(false)}>Hide</SegBtn>
                </div>
              </div>
              <div>
                <p style={LABEL_STYLE}>Tertiary button</p>
                <div
                  style={{
                    display: 'flex',
                    padding: '2px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    gap: '2px',
                  }}
                >
                  <SegBtn active={showTertiary} onClick={() => setShowTertiary(true)}>Show</SegBtn>
                  <SegBtn active={!showTertiary} onClick={() => setShowTertiary(false)}>Hide</SegBtn>
                </div>
              </div>
              {platform === 'Desktop' && (
                <div>
                  <p style={LABEL_STYLE}>Close button</p>
                  <div
                    style={{
                      display: 'flex',
                      padding: '2px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '8px',
                      gap: '2px',
                    }}
                  >
                    <SegBtn active={showClose} onClick={() => setShowClose(true)}>Show</SegBtn>
                    <SegBtn active={!showClose} onClick={() => setShowClose(false)}>Hide</SegBtn>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ────────────────────────────────────────────── */}
      <section>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Dialog</h1>
            <p className="text-slate-500 text-sm max-w-xl">
              Displays focused content that requires user interaction without leaving the
              current page. Use for confirmations, acknowledgements, or critical messages.
              Ships in two platform layouts (App · Desktop) and four semantic types (Info
              · Success · Warning · Error).
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
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

      {/* ── 3. ANATOMY ───────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Anatomy</h2>
        <p className="text-sm text-slate-500 mb-5">
          The Dialog composes five parts. The close button is Desktop-only; Tertiary
          and Secondary buttons are optional.
        </p>

        {/* Diagram area — Desktop layout annotated */}
        <div
          className="relative flex items-center justify-center py-20 px-8 rounded-xl"
          style={DOTTED_BG}
        >
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <DialogLive
              platform="Desktop"
              dialogType="Info"
              showSecondary
              showTertiary
              showClose
              showOverlay={false}
              brand={brand}
            />

            {/* 1 — Close button (top-right corner) */}
            <Callout num="1" style={{ top: '10px', right: '-44px' }} connector="left" />

            {/* 2 — Icon (centred, ~94px from top) */}
            <Callout num="2" style={{ top: '56px', left: '-44px' }} connector="right" />

            {/* 3 — Title (centred, ~150px from top) */}
            <Callout num="3" style={{ top: '132px', right: '-44px' }} connector="left" />

            {/* 4 — Description (centred, ~172px from top) */}
            <Callout num="4" style={{ top: '170px', left: '-44px' }} connector="right" />

            {/* 5 — Button stack (bottom area) */}
            <Callout num="5" style={{ bottom: '-40px', left: '50%', transform: 'translateX(-50%)' }} connector="up" />
          </div>
        </div>

        {/* Anatomy legend */}
        <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {[
            { num: '1', name: 'Close button',       desc: 'Desktop-only. 40×40 circular button, 1px default-border, top-right corner. aria-label="Close".' },
            { num: '2', name: 'Icon',               desc: 'Type-specific colour signals severity. 20×20 (App) / 32×32 (Desktop). Decorative — aria-hidden.' },
            { num: '3', name: 'Title',              desc: 'Cabin Medium 20 / 30. Colour fg-brand-primary. Centred. Becomes aria-labelledby for the dialog.' },
            { num: '4', name: 'Description',        desc: 'Poppins Regular 14 / 20. Colour fg-primary. Centred. Becomes aria-describedby for the dialog.' },
            { num: '5', name: 'Button stack',       desc: 'Full-width vertical stack. Primary (filled), Secondary (outlined), Tertiary (blue link). Radius 999px.' },
          ].map((row) => (
            <div
              key={row.num}
              style={{
                display: 'flex',
                gap: '10px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#f9fafb',
                border: '1px solid #f3f4f6',
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#111827',
                  flexShrink: 0,
                  marginTop: '1px',
                  minWidth: '12px',
                }}
              >
                {row.num}
              </span>
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
              <tr className="border-b border-slate-100">
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">Type</td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1.5">
                    {DIALOG_TYPES.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium"
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: TYPE_ICON_COLOR[t], border: `1px solid ${TYPE_ICON_COLOR[t]}` }}
                        />
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">Platform</td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1.5">
                    {PLATFORMS.map((p) => (
                      <span
                        key={p}
                        className="inline-flex items-center px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">Secondary button</td>
                <td className="px-5 py-3.5 text-slate-500 text-sm">Show · Hide</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">Tertiary button</td>
                <td className="px-5 py-3.5 text-slate-500 text-sm">Show · Hide</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">Close button</td>
                <td className="px-5 py-3.5 text-slate-500 text-sm">Show · Hide (Desktop only)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Visual preview — all 8 permutations (4 types × 2 platforms) */}
        <div
          style={{
            marginTop: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '16px',
          }}
        >
          {DIALOG_TYPES.flatMap((type) =>
            PLATFORMS.map((plat) => (
              <div
                key={`${type}-${plat}`}
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #f3f4f6',
                  backgroundColor: '#fafafa',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  minWidth: 0,
                  overflow: 'auto',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#374151' }}>
                    {type} · {plat}
                  </p>
                  <span
                    style={{
                      fontSize: '10px',
                      color: '#6b7280',
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    }}
                  >
                    {plat === 'App' ? '275×auto' : '650×auto'}
                  </span>
                </div>
                <div
                  style={{
                    ...DOTTED_BG,
                    borderRadius: '8px',
                    padding: '24px 16px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <DialogLive
                    platform={plat}
                    dialogType={type}
                    showOverlay={false}
                    brand={brand}
                  />
                </div>
              </div>
            )),
          )}
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Design Tokens</h2>
        <p className="text-sm text-slate-500 mb-4">
          The container, buttons, and text all resolve against brand tokens. Icon colours
          use fixed signal hexes per type (shown below the table).
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">Token</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">CSS Variable</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">
                  Value ({brand})
                </th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_TABLE_ROWS.map((row, i) => {
                const isActive = row.types.includes(dialogType);
                const rawValue = tokens[row.key as keyof typeof tokens] ?? '—';
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
                    style={
                      isActive
                        ? { borderLeft: '3px solid #3b82f6' }
                        : { borderLeft: '3px solid transparent' }
                    }
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

        {/* Icon signal colours — not tokenized */}
        <div
          style={{
            marginTop: '16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '10px',
          }}
        >
          {DIALOG_TYPES.map((t) => {
            const hex = TYPE_ICON_COLOR[t];
            const active = t === dialogType;
            return (
              <div
                key={t}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: `1px solid ${active ? '#3b82f6' : '#f3f4f6'}`,
                  backgroundColor: active ? '#eff6ff' : '#fafafa',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  opacity: active ? 1 : 0.75,
                }}
              >
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    backgroundColor: hex,
                    flexShrink: 0,
                    border: '1px solid rgba(0,0,0,0.08)',
                  }}
                />
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#111827' }}>{t} icon</p>
                  <p
                    style={{
                      margin: '2px 0 0',
                      fontSize: '11px',
                      color: '#6b7280',
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    }}
                  >
                    {hex}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 6. ACCESSIBILITY ─────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Accessibility</h2>
        <p className="text-sm text-slate-500 mb-4">
          Guidelines for implementing Dialog inclusively.
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
          When and how to use the Dialog component.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>✓ When to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>• Confirm a destructive or irreversible action (delete, cancel booking)</li>
              <li style={{ marginBottom: '6px' }}>• Surface critical information that blocks further progress</li>
              <li style={{ marginBottom: '6px' }}>• Acknowledge the outcome of a user action (Success after submit)</li>
              <li>• Collect small pieces of input required before continuing</li>
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>✗ When not to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>• Don't use for non-critical notifications — use Toast or Inline Banner</li>
              <li style={{ marginBottom: '6px' }}>• Don't stack dialogs; resolve one before opening another</li>
              <li style={{ marginBottom: '6px' }}>• Don't use for complex multi-step forms — route to a page instead</li>
              <li>• Don't show a dialog automatically on page load without user intent</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}

// ─── Anatomy callout primitive ───────────────────────────────────────────────
function Callout({
  num,
  style,
  connector = 'left',
}: {
  num: string;
  style: React.CSSProperties;
  connector?: 'left' | 'right' | 'up' | 'down';
}) {
  const badge = (
    <span
      style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: '#1e293b',
        color: '#ffffff',
        fontSize: '11px',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        flexShrink: 0,
      }}
    >
      {num}
    </span>
  );
  const line = (
    <span
      style={{
        backgroundColor: '#94a3b8',
        flexShrink: 0,
        ...(connector === 'up' || connector === 'down'
          ? { width: '1px', height: '32px' }
          : { width: '32px', height: '1px' }),
      }}
    />
  );

  let content: React.ReactNode;
  if (connector === 'left') {
    content = (
      <>
        {line}
        {badge}
      </>
    );
  } else if (connector === 'right') {
    content = (
      <>
        {badge}
        {line}
      </>
    );
  } else if (connector === 'up') {
    content = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {line}
        {badge}
      </div>
    );
  } else {
    content = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {badge}
        {line}
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none',
        ...style,
      }}
    >
      {content}
    </div>
  );
}
