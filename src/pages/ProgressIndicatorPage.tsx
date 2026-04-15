import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressIndicatorLive, type ProgressIndicatorVariant } from '../components/progress-indicator/ProgressIndicatorLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

interface ProgressIndicatorPageProps {
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

const VARIANTS: ProgressIndicatorVariant[] = ['Percentage Bar', 'Multiple Bars'];

const A11Y_ROWS = [
  {
    icon: '\u2699\uFE0F',
    title: 'Progressbar role',
    body: 'Use role="progressbar" with aria-valuenow, aria-valuemin, and aria-valuemax so assistive technologies can announce current progress.',
  },
  {
    icon: '\uD83C\uDFA8',
    title: 'Don\'t rely on color alone',
    body: 'Always display a visible percentage label alongside the progress fill. This ensures users who cannot perceive color differences still understand the current value.',
  },
  {
    icon: '\uD83D\uDD14',
    title: 'Live region',
    body: 'Wrap dynamic progress updates with aria-live="polite" so screen readers announce value changes without interrupting the user\'s current task.',
  },
  {
    icon: '\u26A1',
    title: 'Reduced motion',
    body: 'When prefers-reduced-motion is active, disable animated fills and transitions. Show the final state immediately so motion-sensitive users are not affected.',
  },
];

export function ProgressIndicatorPage({ brand }: ProgressIndicatorPageProps) {
  const [variant, setVariant] = useState<ProgressIndicatorVariant>('Percentage Bar');
  const [value, setValue] = useState(65);
  const [segments, setSegments] = useState(4);
  const [activeSegments, setActiveSegments] = useState(2);
  const previewKey = `${variant}-${value}-${segments}-${activeSegments}`;
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  return (
    <div className="space-y-10">

      {/* -- 1. INTERACTIVE PREVIEW ----------------------------------------- */}
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
                  style={{ width: '100%', maxWidth: '480px', display: 'flex', justifyContent: 'center' }}
                >
                  <ProgressIndicatorLive
                    variant={variant}
                    value={value}
                    brand={brand}
                    segments={segments}
                    activeSegments={activeSegments}
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
              <div>
                <p style={LABEL_STYLE}>Variant</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  {VARIANTS.map(v => (
                    <SegBtn key={v} active={variant === v} onClick={() => setVariant(v)}>{v}</SegBtn>
                  ))}
                </div>
              </div>

              {variant === 'Percentage Bar' && (
                <div>
                  <p style={LABEL_STYLE}>Value ({value}%)</p>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={value}
                    onChange={e => setValue(Number(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer' }}
                  />
                </div>
              )}

              {variant === 'Multiple Bars' && (
                <>
                  <div>
                    <p style={LABEL_STYLE}>Segments ({segments})</p>
                    <input
                      type="range"
                      min={2}
                      max={6}
                      value={segments}
                      onChange={e => {
                        const s = Number(e.target.value);
                        setSegments(s);
                        if (activeSegments > s) setActiveSegments(s);
                      }}
                      style={{ width: '100%', cursor: 'pointer' }}
                    />
                  </div>
                  <div>
                    <p style={LABEL_STYLE}>Active ({activeSegments})</p>
                    <input
                      type="range"
                      min={0}
                      max={segments}
                      value={activeSegments}
                      onChange={e => setActiveSegments(Number(e.target.value))}
                      style={{ width: '100%', cursor: 'pointer' }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* -- 2. COMPONENT INFO ---------------------------------------------- */}
      <section>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Progress Indicator</h1>
        <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: 1.6, margin: '0 0 16px', maxWidth: '640px' }}>
          Shows the progress of a task or process over time. Use for uploads, downloads, or multi-step
          processes to provide real-time feedback.
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

      {/* -- 3. ANATOMY ----------------------------------------------------- */}
      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Anatomy</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px' }}>Parts of the Progress Indicator component and their roles.</p>

        <div style={{
          ...DOTTED_BG, borderRadius: '12px', padding: '64px 48px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
        }}>
          <div style={{ width: '100%', maxWidth: '480px' }}>
            <ProgressIndicatorLive variant="Percentage Bar" value={65} brand={brand} />
          </div>

          {/* Callout 1 - Track (left side, below) */}
          <div style={{ position: 'absolute', bottom: '16px', left: '25%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={LINE} />
            <CalloutDot num="1" />
          </div>

          {/* Callout 2 - Fill (center, below) */}
          <div style={{ position: 'absolute', bottom: '16px', left: '45%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={LINE} />
            <CalloutDot num="2" />
          </div>

          {/* Callout 3 - Label (right side, below) */}
          <div style={{ position: 'absolute', bottom: '16px', left: '72%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={LINE} />
            <CalloutDot num="3" />
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {[
            { num: '1', label: 'Track', desc: 'Full-width background bar. Uses bg-primary-disabled token to provide a subtle container for the fill.' },
            { num: '2', label: 'Fill', desc: 'Progress fill bar. Width maps to the current value (0-100%). Colored with the primary accent token.' },
            { num: '3', label: 'Label', desc: 'Percentage text displayed right-aligned next to the bar. Uses 16px Medium weight and the fg-primary token.' },
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

      {/* -- 4. VARIANTS TABLE ---------------------------------------------- */}
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
                <td style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>Variant</td>
                <td style={{ padding: '10px 16px', color: '#6b7280' }}>Percentage Bar &middot; Multiple Bars</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Visual preview of both variants */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {VARIANTS.map(v => (
            <div key={v} style={{ padding: '20px 24px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
              <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>{v}</p>
              <ProgressIndicatorLive
                variant={v}
                value={65}
                brand={brand}
                segments={4}
                activeSegments={2}
              />
            </div>
          ))}
        </div>
      </section>

      {/* -- 5. DESIGN TOKENS ----------------------------------------------- */}
      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Design tokens</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          Tokens used by the Progress Indicator across both variants.
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
                <td style={{ padding: '10px 16px', color: '#374151', fontWeight: 600 }}>Track</td>
                <td style={{ padding: '10px 16px' }}>
                  <code style={{ fontSize: '11px', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', color: '#6b7280' }}>
                    --atom-background-primary-bg-primary-disabled
                  </code>
                </td>
                <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: '12px', color: '#6b7280' }}>
                  {tokens['atom.background.primary.bg-primary-disabled']}
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '4px', backgroundColor: tokens['atom.background.primary.bg-primary-disabled'], border: '1px solid rgba(0,0,0,0.08)' }} />
                </td>
              </tr>
              <tr style={{ borderLeft: '3px solid #3b82f6', borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '10px 16px', color: '#374151', fontWeight: 600 }}>Fill (Bar)</td>
                <td style={{ padding: '10px 16px' }}>
                  <code style={{ fontSize: '11px', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', color: '#6b7280' }}>
                    --atom-background-primary-accent
                  </code>
                </td>
                <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: '12px', color: '#6b7280' }}>
                  {tokens['atom.background.primary.accent']}
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '4px', backgroundColor: tokens['atom.background.primary.accent'], border: '1px solid rgba(0,0,0,0.08)' }} />
                </td>
              </tr>
              <tr style={{ borderLeft: '3px solid #3b82f6', borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '10px 16px', color: '#374151', fontWeight: 600 }}>Fill (Segments)</td>
                <td style={{ padding: '10px 16px' }}>
                  <code style={{ fontSize: '11px', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', color: '#6b7280' }}>
                    --atom-background-primary-bg-primary-pressed-brand
                  </code>
                </td>
                <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: '12px', color: '#6b7280' }}>
                  {tokens['atom.background.primary.bg-primary-pressed-brand']}
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '4px', backgroundColor: tokens['atom.background.primary.bg-primary-pressed-brand'], border: '1px solid rgba(0,0,0,0.08)' }} />
                </td>
              </tr>
              <tr style={{ borderLeft: '3px solid #3b82f6', borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '10px 16px', color: '#374151', fontWeight: 600 }}>Label</td>
                <td style={{ padding: '10px 16px' }}>
                  <code style={{ fontSize: '11px', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', color: '#6b7280' }}>
                    --atom-foreground-core-fg-primary
                  </code>
                </td>
                <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: '12px', color: '#6b7280' }}>
                  {tokens['atom.foreground.core.fg-primary']}
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '4px', backgroundColor: tokens['atom.foreground.core.fg-primary'], border: '1px solid rgba(0,0,0,0.08)' }} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* -- 6. ACCESSIBILITY ----------------------------------------------- */}
      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Accessibility</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          Guidance for building inclusive experiences with the Progress Indicator component.
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

      {/* -- 7. USAGE ------------------------------------------------------- */}
      <section style={{ paddingBottom: '40px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>Usage</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>When and how to use each Progress Indicator variant.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          {[
            { t: 'Percentage Bar', when: 'Use for linear workflows such as file uploads, form completion, or step-by-step wizards. The horizontal bar with percentage text fits naturally into page and card layouts.' },
            { t: 'Multiple Bars', when: 'Use for multi-step processes where each step is discrete. The segmented bars clearly communicate how many steps exist and how far the user has progressed.' },
          ].map(({ t, when }) => (
            <div key={t} style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
              <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#111827' }}>{t}</p>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#6b7280', lineHeight: 1.4 }}>{when}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>&#x2713; Do</p>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              Always pair the progress fill with a visible percentage label. Use determinate progress (0-100%) when the total is known, and keep the indicator visible until the task completes.
            </p>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>&#x2717; Don't</p>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              Don't use a progress indicator for indeterminate loading — use a spinner instead. Avoid stacking multiple progress bars in the same view without clear labels distinguishing each task.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
