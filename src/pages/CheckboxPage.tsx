import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckboxLive, type CheckboxType, type CheckboxState } from '../components/checkbox/CheckboxLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

interface CheckboxPageProps {
  brand: Brand;
}

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const LINE: React.CSSProperties = {
  width: '1px', height: '32px', backgroundColor: '#94a3b8',
};

// ─── Token rows ───────────────────────────────────────────────────────────────
type TokenRow = {
  key: string;
  tokenKey: string;
  label: string;
  cssVar: string;
  activeWhen: (t: CheckboxType, s: CheckboxState, c: boolean) => boolean;
};

const TOKEN_ROWS: TokenRow[] = [
  {
    key: 'unchecked-border',
    tokenKey: 'atom.border.default.border-default',
    label: 'Unchecked border',
    cssVar: '--atom-border-default-border-default',
    activeWhen: (_t, s, c) => !c && s === 'Default',
  },
  {
    key: 'checked-bg',
    tokenKey: 'atom.background.primary.bg-primary-pressed',
    label: 'Checked bg',
    cssVar: '--atom-background-primary-bg-primary-pressed',
    activeWhen: (t, s, c) => c && s === 'Default' && t !== 'Radio Button',
  },
  {
    key: 'checked-icon',
    tokenKey: 'atom.foreground.states.fg-pressed-inverse',
    label: 'Checked icon',
    cssVar: '--atom-foreground-states-fg-pressed-inverse',
    activeWhen: (t, s, c) => c && s === 'Default' && t !== 'Radio Button',
  },
  {
    key: 'radio-border',
    tokenKey: 'atom.border.default.border-default-brand',
    label: 'Radio checked border',
    cssVar: '--atom-border-default-border-default-brand',
    activeWhen: (t, s, c) => c && s === 'Default' && t === 'Radio Button',
  },
  {
    key: 'radio-inner',
    tokenKey: 'atom.background.primary.bg-primary-pressed',
    label: 'Radio inner dot',
    cssVar: '--atom-background-primary-bg-primary-pressed',
    activeWhen: (t, s, c) => c && s === 'Default' && t === 'Radio Button',
  },
  {
    key: 'disabled-border',
    tokenKey: 'atom.border.states.border-disabled',
    label: 'Disabled border',
    cssVar: '--atom-border-states-border-disabled',
    activeWhen: (_t, s) => s === 'Disabled',
  },
  {
    key: 'disabled-bg',
    tokenKey: 'atom.background.primary.bg-primary-disabled',
    label: 'Disabled checked bg',
    cssVar: '--atom-background-primary-bg-primary-disabled',
    activeWhen: (t, s, c) => c && s === 'Disabled' && t !== 'Radio Button',
  },
  {
    key: 'disabled-inner',
    tokenKey: 'atom.foreground.states.fg-disabled',
    label: 'Disabled radio inner',
    cssVar: '--atom-foreground-states-fg-disabled',
    activeWhen: (t, s, c) => c && s === 'Disabled' && t === 'Radio Button',
  },
];

const A11Y_ROWS = [
  {
    icon: '⌨️',
    title: 'Keyboard interaction',
    body: 'Space toggles a checkbox. Tab moves focus between controls. Arrow keys cycle between radio buttons in a group — do not use Tab for radio group navigation.',
  },
  {
    icon: '🔖',
    title: 'ARIA roles',
    body: 'Use native <input type="checkbox"> and <input type="radio"> elements. Never replicate these with <div role="checkbox"> unless you fully implement keyboard, focus, and ARIA state management.',
  },
  {
    icon: '🏷️',
    title: 'Labels',
    body: 'Every control must have a visible label via <label> wrapping or aria-labelledby. Screen readers announce the label and checked state together — unlabelled checkboxes are unusable.',
  },
  {
    icon: '🚫',
    title: 'Disabled state',
    body: 'Use the disabled attribute on the input element — not just opacity. Disabled inputs are announced as "dimmed" or "unavailable" by screen readers and are correctly skipped in Tab order.',
  },
  {
    icon: '📦',
    title: 'Radio groups',
    body: 'Wrap related radio buttons in a <fieldset> with a <legend> describing the group question. This gives screen reader users context about what each option is answering.',
  },
];

const TYPES: CheckboxType[] = ['Multi Checkbox', 'Single Checkbox', 'Radio Button'];
const STATES: CheckboxState[] = ['Default', 'Disabled'];

const LABEL_STYLE: React.CSSProperties = {
  margin: '0 0 8px', fontSize: '11px', fontWeight: 600,
  color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em',
};

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
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}

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

export function CheckboxPage({ brand }: CheckboxPageProps) {
  const [type, setType] = useState<CheckboxType>('Multi Checkbox');
  const [state, setState] = useState<CheckboxState>('Default');
  const [checked, setChecked] = useState(false);
  const [label, setLabel] = useState('Checkbox label');
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  const previewKey = `${type}-${state}-${checked}-${label}`;

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
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  <CheckboxLive type={type} state={state} checked={checked} label={label} brand={brand} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div style={{
              width: '224px', flexShrink: 0,
              borderLeft: '1px solid #e5e7eb',
              backgroundColor: '#fff',
              padding: '20px 16px',
              display: 'flex', flexDirection: 'column', gap: '18px',
            }}>
              {/* Type */}
              <div>
                <p style={LABEL_STYLE}>Type</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {TYPES.map(t => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      style={{
                        padding: '5px 8px', borderRadius: '6px', textAlign: 'left',
                        border: type === t ? '1px solid #cbd5e1' : '1px solid transparent',
                        backgroundColor: type === t ? '#f8fafc' : 'transparent',
                        color: type === t ? '#111827' : '#6b7280',
                        fontSize: '12.5px', fontWeight: type === t ? 600 : 400,
                        cursor: 'pointer', transition: 'all 0.1s ease',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* State */}
              <div>
                <p style={LABEL_STYLE}>State</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  {STATES.map(s => (
                    <SegBtn key={s} active={state === s} onClick={() => setState(s)}>{s}</SegBtn>
                  ))}
                </div>
              </div>

              {/* Checked */}
              <div>
                <p style={LABEL_STYLE}>Checked</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  <SegBtn active={checked} onClick={() => setChecked(true)}>True</SegBtn>
                  <SegBtn active={!checked} onClick={() => setChecked(false)}>False</SegBtn>
                </div>
              </div>

              {/* Label */}
              <div>
                <p style={{ ...LABEL_STYLE, margin: '0 0 6px' }}>Label</p>
                <input
                  type="text"
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                  style={{
                    width: '100%', padding: '6px 8px', fontSize: '12.5px',
                    border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none',
                    boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif',
                    color: '#374151',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ──────────────────────────────────────────────── */}
      <section>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
          Checkbox
        </h1>
        <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: 1.6, margin: '0 0 16px', maxWidth: '640px' }}>
          Allows users to make one or multiple selections from a list of options. Three variants — multi-select
          checkbox, single-select checkbox, and radio button — share the same token set.
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
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px' }}>Parts of the Checkbox component and their roles.</p>

        <div style={{
          ...DOTTED_BG, borderRadius: '12px', padding: '64px 48px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
        }}>
          <div>
            <CheckboxLive type="Multi Checkbox" state="Default" checked={true} label="Label" brand={brand} />
          </div>

          {/* Callout 1 — Container (bottom, slightly left of checkbox center) */}
          <div style={{ position: 'absolute', bottom: '16px', left: '45%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={LINE} />
            <CalloutDot num="1" />
          </div>

          {/* Callout 2 — Check indicator (top, slightly right of checkbox center) */}
          <div style={{ position: 'absolute', top: '16px', left: '46%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalloutDot num="2" />
            <div style={LINE} />
          </div>

          {/* Callout 3 — Label (top, centered on label text) */}
          <div style={{ position: 'absolute', top: '16px', left: '53%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalloutDot num="3" />
            <div style={LINE} />
          </div>
        </div>

        {/* Legend */}
        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {[
            { num: '1', label: 'Container', desc: '20×20px hit area. Shape changes per type: rounded square (multi), circle (single/radio).' },
            { num: '2', label: 'Check indicator', desc: 'White checkmark (checkbox) or filled inner dot (radio) appears when checked.' },
            { num: '3', label: 'Label', desc: 'Visible text associated with the control via <label>. Required for accessibility.' },
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
              {[
                { prop: 'Type', values: 'Multi Checkbox · Single Checkbox · Radio Button' },
                { prop: 'State', values: 'Default · Disabled' },
                { prop: 'Checked', values: 'True · False' },
              ].map(({ prop, values }, i) => (
                <tr key={prop} style={{ borderBottom: i < 2 ? '1px solid #f3f4f6' : 'none' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>{prop}</td>
                  <td style={{ padding: '10px 16px', color: '#6b7280' }}>{values}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual preview of all type × state × checked combinations */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {TYPES.map(t =>
            STATES.map(s =>
              [false, true].map(c => (
                <div key={`${t}-${s}-${c}`} style={{ padding: '16px 20px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                  <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: '#6b7280' }}>
                    {t} · {s} · {c ? 'Checked' : 'Unchecked'}
                  </p>
                  <CheckboxLive type={t} state={s} checked={c} label="Label" brand={brand} />
                </div>
              ))
            )
          )}
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ───────────────────────────────────────────────── */}
      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Design tokens</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          Active tokens for the current selection are highlighted. Use the controls above to inspect other states.
        </p>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '160px' }}>Role</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Token</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '140px' }}>Value</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '52px' }}>Swatch</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_ROWS.map((row, i) => {
                const isActive = row.activeWhen(type, state, checked);
                const resolvedValue = tokens[row.tokenKey as keyof typeof tokens] ?? '—';
                return (
                  <tr
                    key={row.key}
                    style={{
                      borderBottom: i < TOKEN_ROWS.length - 1 ? '1px solid #f3f4f6' : 'none',
                      opacity: isActive ? 1 : 0.35,
                      transition: 'opacity 0.2s ease',
                      borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                    }}
                  >
                    <td style={{ padding: '10px 16px', color: '#374151', fontWeight: isActive ? 600 : 400 }}>{row.label}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <code style={{ fontSize: '11px', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', color: '#6b7280' }}>
                        {row.cssVar}
                      </code>
                    </td>
                    <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: '12px', color: '#6b7280' }}>
                      {resolvedValue}
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      {(resolvedValue.startsWith('rgb') || resolvedValue.startsWith('#')) && (
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
          Guidance for building inclusive experiences with Checkbox and Radio components.
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
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>When and how to use each Checkbox variant.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          {[
            { t: 'Multi Checkbox', when: 'Use when the user can select any number of options independently. Each checkbox is fully independent — selecting one does not affect others.' },
            { t: 'Single Checkbox', when: 'Use for a single binary choice, such as accepting terms or enabling a setting. The circular shape visually distinguishes it as a one-off toggle.' },
            { t: 'Radio Button', when: 'Use when only one option can be selected from a group. Always offer at least two options and pre-select the most common or safe default.' },
          ].map(({ t, when }) => (
            <div key={t} style={{
              padding: '14px 16px', borderRadius: '10px',
              border: '1px solid #f3f4f6', backgroundColor: '#fafafa',
            }}>
              <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#111827' }}>{t}</p>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#6b7280', lineHeight: 1.4 }}>{when}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>✓ Do</p>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              Always pair a visible label with each control. Group related radio buttons in a fieldset with a legend describing the question.
            </p>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>✗ Don't</p>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              Don't use radio buttons when multiple selections are valid — use checkboxes instead. Don't use a single radio button; that implies an uncheckable selection.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
