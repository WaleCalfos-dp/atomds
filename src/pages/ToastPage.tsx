import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastLive, type ToastVariant } from '../components/toast/ToastLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

interface ToastPageProps {
  brand: Brand;
}

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const ALL_VARIANTS: ToastVariant[] = ['Error', 'Success'];

type TokenRow = {
  label: string;
  cssVar: string;
  tokenKey?: string;
  fallback: string;
  variants?: ToastVariant[];
};

const TOKEN_TABLE_ROWS: TokenRow[] = [
  { label: 'Background',      cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff' },
  { label: 'Text colour',     cssVar: '--atom-foreground-primary-fg-brand-primary',   tokenKey: 'atom.foreground.primary.fg-brand-primary',   fallback: '#0a2333' },
  { label: 'Border',          cssVar: '--atom-border-default-border-divider',         tokenKey: 'atom.border.default.border-divider',         fallback: '#cdcbcb' },
  { label: 'Close icon',      cssVar: '--atom-foreground-core-fg-secondary',          tokenKey: 'atom.foreground.core.fg-secondary',          fallback: '#737272' },
  { label: 'Success icon',    cssVar: '--atom-foreground-feedback-fg-success',        tokenKey: 'atom.foreground.feedback.fg-success',        fallback: '#067647', variants: ['Success'] },
  { label: 'Error icon',      cssVar: '--atom-foreground-feedback-fg-error',          tokenKey: 'atom.foreground.feedback.fg-error',          fallback: '#e02d3c', variants: ['Error'] },
];

const A11Y_ROWS = [
  { icon: '📣', title: 'Live region announcement', body: 'Toast renders with role="status" and aria-live="polite" so screen readers announce the message without interrupting the user\'s current task. Reserve role="alert" + aria-live="assertive" for genuinely urgent interruptions only.' },
  { icon: '⌨️', title: 'Keyboard access to the close button', body: 'When Close Icon is visible, it must be a native <button> with an aria-label ("Close", "Dismiss notification"). It receives focus in DOM order and dismisses on Enter or Space.' },
  { icon: '⏱️', title: 'Auto-dismiss timing', body: 'If the toast auto-dismisses, allow at least 5 seconds per 20 words of content. Pause the timer on hover / focus-within so assistive-tech users can finish reading. Offer a persistent Close Icon as a fallback.' },
  { icon: '🎨', title: 'Color is not the only signal', body: 'Success and Error are distinguished by a leading icon (tick vs cross) in addition to color. Never rely on icon-colour alone: always include the semantic icon and a text message.' },
  { icon: '🖼️', title: 'Icon semantics', body: 'Both the variant icon and the close icon are decorative (aria-hidden="true") — the text content of the toast carries the meaning. If the toast describes an action to retry, add an accessible button, not a clickable body.' },
  { icon: '📏', title: 'Spacing & stacking', body: 'When stacking multiple toasts, keep a 12–16px gap and limit the visible queue to three at a time. Each toast\'s touch target (close button) must be ≥ 44×44 CSS pixels per WCAG 2.5.5.' },
];

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

export function ToastPage({ brand }: ToastPageProps) {
  const [variant,       setVariant]       = useState<ToastVariant>('Success');
  const [showIconLeft,  setShowIconLeft]  = useState(true);
  const [showCloseIcon, setShowCloseIcon] = useState(true);
  const [text,          setText]          = useState('Add text here');

  const previewKey = `${variant}-${showIconLeft}-${showCloseIcon}-${text}`;
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
                  <ToastLive
                    variant={variant}
                    showIconLeft={showIconLeft}
                    showCloseIcon={showCloseIcon}
                    text={text}
                    brand={brand}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5 overflow-y-auto">

              {/* Property 1 (Type) */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Property 1</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_VARIANTS.map((v) => (
                    <button
                      key={v}
                      onClick={() => setVariant(v)}
                      className={[
                        'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        variant === v
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon Left */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Icon Left</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showIconLeft}
                    onChange={(e) => setShowIconLeft(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 accent-slate-900"
                  />
                  <span className="text-xs text-slate-600">{showIconLeft ? 'Visible' : 'Hidden'}</span>
                </label>
              </div>

              {/* Close Icon */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Close Icon</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCloseIcon}
                    onChange={(e) => setShowCloseIcon(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 accent-slate-900"
                  />
                  <span className="text-xs text-slate-600">{showCloseIcon ? 'Visible' : 'Hidden'}</span>
                </label>
              </div>

              {/* Text slot */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Text</p>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
                  placeholder="Add text here"
                />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ────────────────────────────────────────────────── */}
      <section>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Toast</h1>
        <p className="text-[15px] text-slate-500 leading-relaxed mb-4 max-w-2xl">
          A brief, non-blocking notification that appears in response to a user action and disappears on its own.
          Use toasts for transient confirmations (Success) or soft warnings (Error) that do not require the user to
          take action. For content that must persist until acknowledged, use an Alert instead.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-amber-200 bg-amber-50 text-xs text-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Feedback
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
        <p className="text-sm text-slate-500 mb-4">The parts that make up a Toast in Figma.</p>
        <div className="grid md:grid-cols-2 gap-6 rounded-xl border border-slate-200 bg-white shadow-sm p-6">

          {/* Diagram */}
          <div className="flex items-center justify-center p-6 rounded-lg border border-slate-100 bg-slate-50">
            <div className="relative">
              <ToastLive variant="Success" showIconLeft showCloseIcon text="Toast message" brand={brand} />
              {/* Annotations */}
              <span className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-semibold flex items-center justify-center shadow">1</span>
              <span className="absolute left-7 -top-3 w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-semibold flex items-center justify-center shadow">2</span>
              <span className="absolute left-1/2 -top-3 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-semibold flex items-center justify-center shadow">3</span>
              <span className="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-semibold flex items-center justify-center shadow">4</span>
            </div>
          </div>

          {/* Numbered parts */}
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-12">#</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">Label</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { n: 1, label: 'Container',  body: 'The rounded white surface with a subtle border and shadow.' },
                  { n: 2, label: 'Icon Left',  body: 'Variant icon — tick for Success, cross for Error. Optional.' },
                  { n: 3, label: 'Text',       body: 'Single-line message describing the event. Required.' },
                  { n: 4, label: 'Close Icon', body: 'Dismiss affordance on the trailing edge. Optional.' },
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
                  label: 'Property 1',
                  chips: [
                    { text: 'Error',   note: 'Default' },
                    { text: 'Success', note: '' },
                  ],
                },
                {
                  label: 'Booleans (2)',
                  chips: [
                    { text: 'Close Icon', note: '' },
                    { text: 'Icon Left',  note: '' },
                  ],
                },
                {
                  label: 'Text slots (1)',
                  chips: [
                    { text: 'Text', note: '' },
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

        {/* Visual preview grid — 4 representative variants at rest */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { key: 'success-full',   v: 'Success' as ToastVariant, il: true,  ci: true,  label: 'Success · Full' },
            { key: 'error-full',     v: 'Error'   as ToastVariant, il: true,  ci: true,  label: 'Error · Full' },
            { key: 'success-no-close', v: 'Success' as ToastVariant, il: true,  ci: false, label: 'Success · No close' },
            { key: 'error-no-icon',  v: 'Error'   as ToastVariant, il: false, ci: true,  label: 'Error · No icon' },
          ].map((card) => (
            <div key={card.key} style={{
              padding: '20px 24px', borderRadius: '10px',
              border: '1px solid #f3f4f6', backgroundColor: '#fafafa',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px',
            }}>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>{card.label}</p>
              <ToastLive variant={card.v} showIconLeft={card.il} showCloseIcon={card.ci} text="Toast message" brand={brand} />
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Design Tokens</h2>
        <p className="text-sm text-slate-500 mb-4">
          Tokens active for the current variant are highlighted. Values update with the brand selector.
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
                const isActive      = !row.variants || row.variants.includes(variant);
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
        <p className="text-sm text-slate-500 mb-4">Guidelines for implementing Toast inclusively.</p>
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
          When to use each Toast variant — and when to pick a different component.
        </p>

        {/* Per-variant usage cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>Success</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#4b5563', lineHeight: 1.5 }}>
              Confirm that a user-initiated action completed — e.g. "Saved", "Copied to clipboard", "Invite sent".
              Auto-dismiss after a few seconds; no user action required.
            </p>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>Error</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#4b5563', lineHeight: 1.5 }}>
              Soft, recoverable errors — e.g. "Couldn't update profile photo", "Connection lost — retrying". For
              critical or blocking errors that need acknowledgment, use Alert or Dialog instead.
            </p>
          </div>
        </div>

        {/* Do / Don't */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>✓ When to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>• Transient confirmation of a user-initiated action</li>
              <li style={{ marginBottom: '6px' }}>• Background events the user should know about, but not act on</li>
              <li style={{ marginBottom: '6px' }}>• Keep messages to one line / ~80 characters</li>
              <li style={{ marginBottom: '6px' }}>• Always pair the variant icon with readable text</li>
              <li>• Expose a Close Icon for users who want to dismiss early</li>
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>✗ When not to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>• Don't use for content the user must acknowledge — use Alert / Dialog</li>
              <li style={{ marginBottom: '6px' }}>• Don't hide critical errors inside an auto-dismissing toast</li>
              <li style={{ marginBottom: '6px' }}>• Don't stack more than three toasts at once</li>
              <li style={{ marginBottom: '6px' }}>• Don't use Toast for marketing / promotional messages</li>
              <li>• Don't rely on color alone to distinguish Success from Error</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
