import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TooltipLive, type TooltipPosition } from '../components/tooltip/TooltipLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

interface TooltipPageProps {
  brand: Brand;
}

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const LINE: React.CSSProperties = { width: '1px', height: '32px', backgroundColor: '#94a3b8' };

const LABEL_STYLE: React.CSSProperties = {
  margin: '0 0 8px', fontSize: '11px', fontWeight: 600,
  color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em',
};

function CalloutDot({ num }: { num: string }) {
  return (
    <span style={{
      width: '20px', height: '20px', borderRadius: '50%',
      backgroundColor: '#1e293b', color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '11px', fontWeight: 700,
      boxShadow: '0 1px 3px rgba(0,0,0,0.3)', flexShrink: 0,
    }}>
      {num}
    </span>
  );
}

function SegBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '5px 4px', borderRadius: '6px', border: 'none',
        backgroundColor: active ? '#fff' : 'transparent',
        color: active ? '#111827' : '#6b7280',
        fontSize: '11px', fontWeight: active ? 600 : 400,
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

const ALL_POSITIONS: TooltipPosition[] = ['Top', 'Bottom', 'Left', 'Right'];

type TokenRow = {
  key: string;
  tokenKey: string;
  label: string;
  cssVar: string;
};

const TOKEN_ROWS: TokenRow[] = [
  { key: 'bg',    tokenKey: 'atom.background.primary.bg-primary-default',          label: 'Background',  cssVar: '--atom-background-primary-bg-primary-default' },
  { key: 'fg',    tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse',    label: 'Text',        cssVar: '--atom-foreground-primary-fg-brand-primary-inverse' },
  { key: 'arrow', tokenKey: 'atom.background.primary.bg-primary-default',          label: 'Arrow',       cssVar: '--atom-background-primary-bg-primary-default' },
];

const A11Y_ROWS = [
  {
    icon: '🔖',
    title: 'Use role="tooltip"',
    body: 'The tooltip container must have role="tooltip". The trigger element needs aria-describedby pointing to the tooltip\'s id so screen readers associate the two.',
  },
  {
    icon: '⌨️',
    title: 'Keyboard trigger',
    body: 'Tooltips must appear on focus (not just hover) so keyboard-only users can access the information. Pressing Escape should dismiss the tooltip.',
  },
  {
    icon: '⏱️',
    title: 'Timing',
    body: 'Show after a short delay (300–500ms) to avoid flashing on mouse-through. Keep visible while the pointer is over the trigger or tooltip, and for at least 1.5s after focus.',
  },
  {
    icon: '🚫',
    title: 'No interactive content',
    body: 'Tooltips must contain only plain text — never links, buttons, or other interactive elements. If you need interactive content, use a Popover instead.',
  },
  {
    icon: '📐',
    title: 'Positioning',
    body: 'Tooltips should never clip outside the viewport. Implement collision detection to flip the position (e.g. Top → Bottom) when there is insufficient space.',
  },
];

export function TooltipPage({ brand }: TooltipPageProps) {
  const [position, setPosition] = useState<TooltipPosition>('Top');
  const [titleText, setTitleText] = useState('Title');
  const [descriptionText, setDescriptionText] = useState('Description');
  const [showTitle, setShowTitle] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const [showIconLeft, setShowIconLeft] = useState(true);
  const [showIconRight, setShowIconRight] = useState(true);

  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];
  const previewKey = `${position}-${titleText}-${descriptionText}-${showTitle}-${showDescription}-${showIconLeft}-${showIconRight}`;

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ─────────────────────────────────────────── */}
      <section>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden', background: '#fff' }}>
          <div style={{ display: 'flex', minHeight: '280px' }}>

            {/* Canvas */}
            <div style={{ flex: 1, ...DOTTED_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <TooltipLive
                    position={position}
                    titleText={titleText}
                    descriptionText={descriptionText}
                    showTitle={showTitle}
                    showDescription={showDescription}
                    showIconLeft={showIconLeft}
                    showIconRight={showIconRight}
                    brand={brand}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div style={{
              width: '224px', flexShrink: 0,
              borderLeft: '1px solid #e5e7eb', backgroundColor: '#fff',
              padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '18px',
            }}>
              {/* Position */}
              <div>
                <p style={LABEL_STYLE}>Position</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  {ALL_POSITIONS.map(p => (
                    <SegBtn key={p} active={position === p} onClick={() => setPosition(p)}>{p}</SegBtn>
                  ))}
                </div>
              </div>

              {/* Title text input */}
              <div>
                <p style={{ ...LABEL_STYLE, margin: '0 0 6px' }}>Title Text</p>
                <input
                  type="text"
                  value={titleText}
                  onChange={e => setTitleText(e.target.value)}
                  style={{
                    width: '100%', padding: '6px 8px', fontSize: '12.5px',
                    border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none',
                    boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif',
                    color: '#374151',
                  }}
                />
              </div>

              {/* Description text input */}
              <div>
                <p style={{ ...LABEL_STYLE, margin: '0 0 6px' }}>Description Text</p>
                <input
                  type="text"
                  value={descriptionText}
                  onChange={e => setDescriptionText(e.target.value)}
                  style={{
                    width: '100%', padding: '6px 8px', fontSize: '12.5px',
                    border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none',
                    boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif',
                    color: '#374151',
                  }}
                />
              </div>

              {/* Show Title toggle */}
              <div>
                <p style={LABEL_STYLE}>Title</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  <SegBtn active={showTitle} onClick={() => setShowTitle(true)}>Show</SegBtn>
                  <SegBtn active={!showTitle} onClick={() => setShowTitle(false)}>Hide</SegBtn>
                </div>
              </div>

              {/* Show Description toggle */}
              <div>
                <p style={LABEL_STYLE}>Description</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  <SegBtn active={showDescription} onClick={() => setShowDescription(true)}>Show</SegBtn>
                  <SegBtn active={!showDescription} onClick={() => setShowDescription(false)}>Hide</SegBtn>
                </div>
              </div>

              {/* Icon Left toggle */}
              <div>
                <p style={LABEL_STYLE}>Icon Left</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  <SegBtn active={showIconLeft} onClick={() => setShowIconLeft(true)}>Show</SegBtn>
                  <SegBtn active={!showIconLeft} onClick={() => setShowIconLeft(false)}>Hide</SegBtn>
                </div>
              </div>

              {/* Icon Right toggle */}
              <div>
                <p style={LABEL_STYLE}>Icon Right</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  <SegBtn active={showIconRight} onClick={() => setShowIconRight(true)}>Show</SegBtn>
                  <SegBtn active={!showIconRight} onClick={() => setShowIconRight(false)}>Hide</SegBtn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ──────────────────────────────────────────────── */}
      <section>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Tooltip</h1>
        <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: 1.6, margin: '0 0 16px', maxWidth: '640px' }}>
          Provides brief contextual information when a user hovers over or focuses an element. Use near
          form labels, icons, buttons, or technical terms that need short clarification without cluttering
          the interface.
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <a href="#" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: '6px', border: '1px solid #e5e7eb',
            fontSize: '13px', color: '#374151', textDecoration: 'none',
            fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#fff',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Feedback
          </a>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: '6px',
            border: '1px solid #bbf7d0', fontSize: '13px', color: '#166534',
            backgroundColor: '#f0fdf4', fontFamily: 'system-ui, -apple-system, sans-serif',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
            Stable
          </span>
        </div>
      </section>

      {/* ── 3. ANATOMY ─────────────────────────────────────────────────────── */}
      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Anatomy</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px' }}>Parts of the Tooltip component and their roles.</p>

        <div style={{
          ...DOTTED_BG, borderRadius: '12px', padding: '64px 48px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
        }}>
          <TooltipLive position="Top" titleText="Title" descriptionText="Description" brand={brand} />

          {/* Callout 1 — Container (bottom center) */}
          <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={LINE} />
            <CalloutDot num="1" />
          </div>

          {/* Callout 2 — Arrow (bottom center, slightly offset) */}
          <div style={{ position: 'absolute', bottom: '12px', left: '53%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={LINE} />
            <CalloutDot num="2" />
          </div>

          {/* Callout 3 — Icon Left (top left) */}
          <div style={{ position: 'absolute', top: '12px', left: '42%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalloutDot num="3" />
            <div style={LINE} />
          </div>

          {/* Callout 4 — Title (top center-left) */}
          <div style={{ position: 'absolute', top: '12px', left: '47%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalloutDot num="4" />
            <div style={LINE} />
          </div>

          {/* Callout 5 — Description (top center-right) */}
          <div style={{ position: 'absolute', top: '12px', left: '53%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalloutDot num="5" />
            <div style={LINE} />
          </div>

          {/* Callout 6 — Icon Right (top right) */}
          <div style={{ position: 'absolute', top: '12px', left: '58%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalloutDot num="6" />
            <div style={LINE} />
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {[
            { num: '1', label: 'Container', desc: 'Dark rounded rectangle (8px radius). Background uses the brand primary token. Padding: 8px 12px. Max width 240px before wrapping.' },
            { num: '2', label: 'Arrow', desc: '6px CSS triangle pointing toward the trigger element. Same color as container. Position shifts to match the placement prop.' },
            { num: '3', label: 'Icon Left', desc: '16px info circle icon on the left side. Toggleable via showIconLeft prop. Uses inverse foreground color.' },
            { num: '4', label: 'Title', desc: '14px / weight 500 (Medium) text in inverse foreground color. Toggleable via showTitle prop. Font family inherits from brand.' },
            { num: '5', label: 'Description', desc: '12px / weight 400 (Regular) text in inverse foreground at 80% opacity. Toggleable via showDescription prop.' },
            { num: '6', label: 'Icon Right', desc: '16px close/dismiss icon on the right side. Toggleable via showIconRight prop. Uses inverse foreground color.' },
          ].map(({ num, label: l, desc }) => (
            <div key={num} style={{
              display: 'flex', gap: '10px', padding: '12px',
              borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #f3f4f6',
            }}>
              <span style={{ fontSize: '16px', lineHeight: 1, flexShrink: 0, marginTop: '1px' }}>{num}</span>
              <div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#111827' }}>{l}</p>
                <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#6b7280', lineHeight: 1.4 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. VARIANTS ────────────────────────────────────────────────────── */}
      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Variants</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>Available property combinations for the Tooltip component.</p>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '160px' }}>Property</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Values</th>
              </tr>
            </thead>
            <tbody>
              {[
                { prop: 'Pointer Direction', values: 'Down | Right | Up | Left' },
                { prop: 'Title', values: 'true (default) | false' },
                { prop: 'Description', values: 'true (default) | false' },
                { prop: 'Icon Left', values: 'true (default) | false' },
                { prop: 'Icon Right', values: 'true (default) | false' },
                { prop: 'Title Text', values: '"Title" (string)' },
                { prop: 'Description Text', values: '"Description" (string)' },
              ].map(({ prop, values }, i, arr) => (
                <tr key={prop} style={{ borderBottom: i < arr.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>{prop}</td>
                  <td style={{ padding: '10px 16px', color: '#6b7280' }}>{values}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual preview of all positions */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {ALL_POSITIONS.map(p => (
            <div key={p} style={{ padding: '32px 24px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>{p}</p>
              <TooltipLive position={p} titleText="Title" descriptionText="Description" brand={brand} />
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ───────────────────────────────────────────────── */}
      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Design tokens</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          The Tooltip uses brand primary tokens for its container and inverse foreground for text.
        </p>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '140px' }}>Role</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Token</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '140px' }}>Value</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '52px' }}>Swatch</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_ROWS.map((row, i) => {
                const resolvedValue = tokens[row.tokenKey as keyof typeof tokens] ?? '—';
                return (
                  <tr key={row.key} style={{
                    borderBottom: i < TOKEN_ROWS.length - 1 ? '1px solid #f3f4f6' : 'none',
                    borderLeft: '3px solid #3b82f6',
                  }}>
                    <td style={{ padding: '10px 16px', color: '#374151', fontWeight: 600 }}>{row.label}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <code style={{ fontSize: '11px', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', color: '#6b7280' }}>
                        {row.cssVar}
                      </code>
                    </td>
                    <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: '12px', color: '#6b7280' }}>
                      {resolvedValue}
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      {(resolvedValue.startsWith('#') || resolvedValue.startsWith('rgb')) && (
                        <div style={{ width: '24px', height: '24px', borderRadius: '4px', backgroundColor: resolvedValue, border: '1px solid rgba(0,0,0,0.08)' }} />
                      )}
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
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Accessibility</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          Guidance for building inclusive experiences with the Tooltip component.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {A11Y_ROWS.map(({ icon, title, body }) => (
            <div key={title} style={{
              display: 'flex', gap: '14px', padding: '16px',
              borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa',
            }}>
              <span style={{ fontSize: '18px', lineHeight: 1, flexShrink: 0, marginTop: '2px' }}>{icon}</span>
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#111827' }}>{title}</p>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280', lineHeight: 1.5 }}>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. USAGE ───────────────────────────────────────────────────────── */}
      <section style={{ paddingBottom: '40px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>Usage</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>When and how to use Tooltips.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          {[
            { t: 'Form fields', when: 'Place beside a label or input to explain what the field expects, or to call out formatting requirements (e.g. "Must be 8+ characters").' },
            { t: 'Icon-only actions', when: 'Any button or icon without visible text needs a tooltip to identify its purpose (e.g. a trash icon showing "Delete item").' },
            { t: 'Truncated content', when: 'When text is cut off with an ellipsis, show the full text in a tooltip on hover so users can read the complete value.' },
          ].map(({ t, when }) => (
            <div key={t} style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
              <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#111827' }}>{t}</p>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#6b7280', lineHeight: 1.4 }}>{when}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>✓ Do</p>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              Keep tooltip text concise — one or two short sentences maximum. Show on both hover and keyboard focus. Use for supplementary information only.
            </p>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>✗ Don't</p>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              Don't put essential information in tooltips — it may never be seen. Don't include links, buttons, or images. Don't use tooltips on touch-only devices as the primary disclosure method.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
