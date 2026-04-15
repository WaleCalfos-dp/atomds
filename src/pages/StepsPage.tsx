import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepsLive, type StepsOrientation } from '../components/steps/StepsLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

interface StepsPageProps {
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

const ORIENTATIONS: StepsOrientation[] = ['Horizontal', 'Vertical'];
const TOTAL_OPTIONS = [2, 3, 4, 5, 6, 7, 8];

const A11Y_ROWS = [
  {
    icon: '📍',
    title: 'Use aria-current="step"',
    body: 'Mark the active step with aria-current="step" so assistive technologies can announce which step the user is currently on.',
  },
  {
    icon: '📋',
    title: 'Ordered list semantics',
    body: 'Wrap steps in an ordered list (role="list" with role="listitem" children) to convey sequential order to screen readers.',
  },
  {
    icon: '🏷️',
    title: 'Provide text alternatives',
    body: 'Each step circle must have a text alternative — either a visible label or an aria-label — so visual progress indicators are accessible to non-sighted users.',
  },
  {
    icon: '📢',
    title: 'Announce step changes',
    body: 'When the current step changes, use a live region (aria-live="polite") to announce the transition so screen reader users are aware of progress updates.',
  },
];

type TokenRow = {
  key: string;
  tokenKey: string;
  label: string;
  cssVar: string;
};

const TOKEN_ROWS: TokenRow[] = [
  { key: 'circle-bg',       tokenKey: 'atom.background.primary.bg-primary-pressed-brand',      label: 'Active/done circle bg',       cssVar: '--atom-background-primary-bg-primary-pressed-brand' },
  { key: 'circle-disabled',  tokenKey: 'atom.background.primary.bg-primary-disabled',           label: 'Upcoming circle bg',          cssVar: '--atom-background-primary-bg-primary-disabled' },
  { key: 'number-text',     tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse',       label: 'Number text (active/done)',    cssVar: '--atom-foreground-primary-fg-brand-primary-inverse' },
  { key: 'number-disabled', tokenKey: 'atom.foreground.states.fg-disabled-inverse',             label: 'Number text (upcoming)',       cssVar: '--atom-foreground-states-fg-disabled-inverse' },
  { key: 'connector',       tokenKey: 'atom.border.default.border-divider',                     label: 'Connector divider',            cssVar: '--atom-border-default-border-divider' },
  { key: 'label-text',      tokenKey: 'atom.foreground.core.fg-primary',                        label: 'Label text',                   cssVar: '--atom-foreground-core-fg-primary' },
];

export function StepsPage({ brand }: StepsPageProps) {
  const [orientation, setOrientation] = useState<StepsOrientation>('Horizontal');
  const [totalSteps, setTotalSteps] = useState(3);
  const [currentStep, setCurrentStep] = useState(2);

  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];
  const previewKey = `${orientation}-${totalSteps}-${currentStep}`;

  const stepButtons = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="space-y-10">

      {/* -- 1. INTERACTIVE PREVIEW ----------------------------------------- */}
      <section>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden', background: '#fff' }}>
          <div style={{ display: 'flex', minHeight: '320px' }}>

            {/* Canvas */}
            <div style={{ flex: 1, ...DOTTED_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ width: orientation === 'Horizontal' ? '100%' : 'auto', maxWidth: '520px' }}
                >
                  <StepsLive
                    totalSteps={totalSteps}
                    currentStep={currentStep}
                    orientation={orientation}
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
              <div>
                <p style={LABEL_STYLE}>Orientation</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  {ORIENTATIONS.map(o => (
                    <SegBtn key={o} active={orientation === o} onClick={() => setOrientation(o)}>{o}</SegBtn>
                  ))}
                </div>
              </div>
              <div>
                <p style={LABEL_STYLE}>Total Steps</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px', flexWrap: 'wrap' }}>
                  {TOTAL_OPTIONS.map(n => (
                    <SegBtn key={n} active={totalSteps === n} onClick={() => { setTotalSteps(n); setCurrentStep(prev => Math.min(prev, n)); }}>{n}</SegBtn>
                  ))}
                </div>
              </div>
              <div>
                <p style={LABEL_STYLE}>Current Step</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px', flexWrap: 'wrap' }}>
                  {stepButtons.map(n => (
                    <SegBtn key={n} active={currentStep === n} onClick={() => setCurrentStep(n)}>{n}</SegBtn>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -- 2. COMPONENT INFO ---------------------------------------------- */}
      <section>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Steps</h1>
        <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: 1.6, margin: '0 0 16px', maxWidth: '640px' }}>
          Represents a series of sequential stages in a process. Use for onboarding, checkout, or setup
          workflows where progress tracking is useful.
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
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px' }}>Parts of the Steps component and their roles.</p>

        <div style={{
          ...DOTTED_BG, borderRadius: '12px', padding: '64px 48px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
          minHeight: '200px',
        }}>
          <div style={{ width: '240px' }}>
            <StepsLive totalSteps={3} currentStep={2} orientation="Horizontal" brand={brand} />
          </div>

          {/* Callout 1 - Step circle */}
          <div style={{ position: 'absolute', top: '16px', left: '38%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalloutDot num="1" />
            <div style={LINE} />
          </div>

          {/* Callout 2 - Connector */}
          <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalloutDot num="2" />
            <div style={LINE} />
          </div>

          {/* Callout 3 - Label */}
          <div style={{ position: 'absolute', bottom: '16px', left: '62%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={LINE} />
            <CalloutDot num="3" />
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {[
            { num: '1', label: 'Step circle', desc: '18px diameter circle with 999px radius. Active/done steps use brand pressed background; upcoming steps use disabled background. Done steps show a 12px checkmark icon; active/upcoming show a 10px number.' },
            { num: '2', label: 'Connector', desc: '1px dashed line between circles using the divider border token. 4px gap between circle and connector on each side.' },
            { num: '3', label: 'Label', desc: '14px Medium title and optional 12px Regular body text below (horizontal) or beside (vertical) each circle, using primary foreground color.' },
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

      {/* -- 4. VARIANTS ---------------------------------------------------- */}
      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Variants</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>Available property combinations for the Steps component.</p>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '140px' }}>Property</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Values</th>
              </tr>
            </thead>
            <tbody>
              {[
                { prop: 'Direction', values: 'Horizontal \u00b7 Vertical' },
                { prop: 'Count', values: '2 \u00b7 3 \u00b7 4 \u00b7 5 \u00b7 6 \u00b7 7 \u00b7 8' },
                { prop: 'Background Fill', values: 'On \u00b7 Off' },
                { prop: 'Type', values: 'Number \u00b7 Icon (checkmark)' },
              ].map(({ prop, values }, i) => (
                <tr key={prop} style={{ borderBottom: i < 3 ? '1px solid #f3f4f6' : 'none' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>{prop}</td>
                  <td style={{ padding: '10px 16px', color: '#6b7280' }}>{values}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual preview of orientations */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {ORIENTATIONS.map(o => (
            <div key={o} style={{ padding: '24px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
              <p style={{ margin: '0 0 16px', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>{o}</p>
              <StepsLive totalSteps={3} currentStep={2} orientation={o} brand={brand} />
            </div>
          ))}
        </div>
      </section>

      {/* -- 5. DESIGN TOKENS ----------------------------------------------- */}
      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Design tokens</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          Tokens used by the Steps component across active, done, and upcoming states.
        </p>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '180px' }}>Role</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Token</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '100px' }}>Value</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '52px' }}>Swatch</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_ROWS.map((row, i) => {
                const resolvedValue = tokens[row.tokenKey as keyof typeof tokens] ?? '\u2014';
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
                      {resolvedValue.slice(0, 9)}
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

      {/* -- 6. ACCESSIBILITY ----------------------------------------------- */}
      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Accessibility</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          Guidance for building inclusive step-based progress indicators.
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
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>When and how to use each Steps orientation.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          {[
            { t: 'Horizontal', when: 'Use for top-of-page progress bars in multi-step forms, checkout flows, and onboarding wizards. Works best when there are few steps (2-5) and enough horizontal space.' },
            { t: 'Vertical', when: 'Use for sidebar or narrow-layout progress tracking. Ideal for longer processes (up to 8 steps), timeline-style displays, or when labels need more room to breathe.' },
          ].map(({ t, when }) => (
            <div key={t} style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
              <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#111827' }}>{t}</p>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#6b7280', lineHeight: 1.4 }}>{when}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>Do</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.5 }}>
              <li style={{ marginBottom: '6px' }}>Use steps to show clear progress through a defined workflow</li>
              <li style={{ marginBottom: '6px' }}>Keep labels short and descriptive (e.g. "Payment", "Review")</li>
              <li>Allow users to navigate back to completed steps when possible</li>
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>Don't</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.5 }}>
              <li style={{ marginBottom: '6px' }}>Don't use steps for non-sequential navigation or tab-like interfaces</li>
              <li style={{ marginBottom: '6px' }}>Don't exceed 8 steps -- break longer processes into grouped stages</li>
              <li>Don't hide step labels on small screens -- switch to vertical orientation instead</li>
            </ul>
          </div>
        </div>
      </section>

    </div>
  );
}
