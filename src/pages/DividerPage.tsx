import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DividerLive, type DividerStyle } from '../components/divider/DividerLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

interface DividerPageProps {
  brand: Brand;
}

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const LABEL_STYLE: React.CSSProperties = {
  margin: '0 0 8px', fontSize: '11px', fontWeight: 600,
  color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em',
};

const LINE: React.CSSProperties = { width: '1px', height: '32px', backgroundColor: '#94a3b8' };

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

const STYLES: DividerStyle[] = ['Solid', 'Dashed'];

const A11Y_ROWS = [
  {
    icon: '🔖',
    title: 'Semantic role',
    body: 'Use role="separator" so screen readers announce the divider as a thematic break. Purely decorative dividers that add no meaning should use aria-hidden="true" to remove them from the accessibility tree.',
  },
  {
    icon: '📐',
    title: 'Don\'t overuse',
    body: 'Dividers add visual noise when overused. Prefer spacing and padding to group related content — only add a divider when visual separation remains unclear after adjusting layout.',
  },
  {
    icon: '↕️',
    title: 'Orientation',
    body: 'This component renders a horizontal divider. For vertical separators (e.g. between inline items), add aria-orientation="vertical" and render via border-left instead of border-top.',
  },
];

export function DividerPage({ brand }: DividerPageProps) {
  const [style, setStyle] = useState<DividerStyle>('Solid');
  const previewKey = style;
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

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
                  style={{ width: '100%', maxWidth: '480px' }}
                >
                  <DividerLive style={style} brand={brand} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div style={{
              width: '224px', flexShrink: 0,
              borderLeft: '1px solid #e5e7eb', backgroundColor: '#fff',
              padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '18px',
            }}>
              <div>
                <p style={LABEL_STYLE}>Style</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  {STYLES.map(s => (
                    <SegBtn key={s} active={style === s} onClick={() => setStyle(s)}>{s}</SegBtn>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ──────────────────────────────────────────────── */}
      <section>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Divider</h1>
        <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: 1.6, margin: '0 0 16px', maxWidth: '640px' }}>
          Visually separates content or sections within a layout. Available in solid and dashed styles,
          both driven by the same border token.
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
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px' }}>Parts of the Divider component and their roles.</p>

        <div style={{
          ...DOTTED_BG, borderRadius: '12px', padding: '64px 48px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
        }}>
          <div style={{ width: '100%', maxWidth: '480px' }}>
            <DividerLive style="Solid" brand={brand} />
          </div>

          {/* Callout 1 — Line (left side, below) */}
          <div style={{ position: 'absolute', bottom: '16px', left: '30%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={LINE} />
            <CalloutDot num="1" />
          </div>

          {/* Callout 2 — Color token (right side, below) */}
          <div style={{ position: 'absolute', bottom: '16px', left: '68%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={LINE} />
            <CalloutDot num="2" />
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {[
            { num: '1', label: 'Line', desc: '1px horizontal rule. Spans full container width. Style switches between solid and dashed via the style prop.' },
            { num: '2', label: 'Color', desc: 'Driven by --atom-border-default-border-divider token. Automatically updates per brand.' },
          ].map(({ num, label, desc }) => (
            <div key={num} style={{
              display: 'flex', gap: '10px', padding: '12px',
              borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #f3f4f6',
            }}>
              <span style={{ fontSize: '16px', lineHeight: 1, flexShrink: 0, marginTop: '1px' }}>{num}</span>
              <div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#111827' }}>{label}</p>
                <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#6b7280', lineHeight: 1.4 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. VARIANTS TABLE ──────────────────────────────────────────────── */}
      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>Variants</h2>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '140px' }}>Property</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Values</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>Style</td>
                <td style={{ padding: '10px 16px', color: '#6b7280' }}>Solid · Dashed</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Visual preview of both styles */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {STYLES.map(s => (
            <div key={s} style={{ padding: '20px 24px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
              <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>{s}</p>
              <DividerLive style={s} brand={brand} />
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ───────────────────────────────────────────────── */}
      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Design tokens</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          The Divider uses a single token for both styles.
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
              <tr style={{ borderLeft: '3px solid #3b82f6' }}>
                <td style={{ padding: '10px 16px', color: '#374151', fontWeight: 600 }}>Line color</td>
                <td style={{ padding: '10px 16px' }}>
                  <code style={{ fontSize: '11px', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', color: '#6b7280' }}>
                    --atom-border-default-border-divider
                  </code>
                </td>
                <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: '12px', color: '#6b7280' }}>
                  {tokens['atom.border.default.border-divider']}
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '4px', backgroundColor: tokens['atom.border.default.border-divider'], border: '1px solid rgba(0,0,0,0.08)' }} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 6. ACCESSIBILITY ───────────────────────────────────────────────── */}
      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Accessibility</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          Guidance for building inclusive experiences with the Divider component.
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
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>When and how to use each Divider style.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          {[
            { t: 'Solid', when: 'Use for clear, prominent section breaks — between list items, form groups, or major content sections. The default choice in most contexts.' },
            { t: 'Dashed', when: 'Use for softer or secondary separation — optional groupings, collapsed sections, or areas where a solid line would feel too heavy.' },
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
              Use dividers sparingly to separate genuinely unrelated content. Rely on spacing first — only add a divider when the visual grouping is still unclear.
            </p>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>✗ Don't</p>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              Don't place dividers between every item in a list or form — it creates visual clutter. Don't use dividers to replace proper heading hierarchy.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
