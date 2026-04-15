import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InputLive, type InputType, type InputState, type LabelPosition } from '../components/input/InputLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

interface InputPageProps { brand: Brand; }

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const LINE: React.CSSProperties = { width: '1px', height: '32px', backgroundColor: '#94a3b8' };

function CalloutDot({ num }: { num: string }) {
  return (
    <span style={{
      width: '20px', height: '20px', borderRadius: '50%',
      backgroundColor: '#1e293b', color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '11px', fontWeight: 700, boxShadow: '0 1px 3px rgba(0,0,0,0.3)', flexShrink: 0,
    }}>{num}</span>
  );
}

const ALL_TYPES: InputType[] = ['Basic', 'Text Area', 'Search', 'Password', 'Phone Number', 'Verification Code', 'Payment'];
const ALL_LABEL_POSITIONS: LabelPosition[] = ['Outside', 'Inside'];
const ALL_STATES: InputState[] = ['Default', 'Focus', 'Focus - Accessibility', 'Error', 'Disabled'];

const LABEL_STYLE: React.CSSProperties = {
  margin: '0 0 8px', fontSize: '11px', fontWeight: 600,
  color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em',
};

const SEG_BASE: React.CSSProperties = {
  padding: '6px 12px', fontSize: '12px', border: '1px solid #e5e7eb',
  borderRadius: '6px', cursor: 'pointer', background: 'white', color: '#374151',
  fontFamily: 'system-ui,-apple-system,sans-serif', fontWeight: 500, textAlign: 'left',
};
const SEG_ACTIVE: React.CSSProperties = { ...SEG_BASE, background: '#111827', color: '#fff', borderColor: '#111827' };

type TokenRow = { key: string; tokenKey: string; label: string; cssVar: string; activeWhen: (s: InputState) => boolean };

const TOKEN_ROWS: TokenRow[] = [
  { key: 'input-bg',        tokenKey: 'atom.background.primary.bg-primary-inverse',                   label: 'Input bg',          cssVar: '--atom-background-primary-bg-primary-inverse',                   activeWhen: s => s === 'Default' || s === 'Focus' || s === 'Focus - Accessibility' },
  { key: 'disabled-bg',     tokenKey: 'atom.background.primary.bg-primary-disabled',                  label: 'Disabled bg',       cssVar: '--atom-background-primary-bg-primary-disabled',                  activeWhen: s => s === 'Disabled' },
  { key: 'border-default',  tokenKey: 'atom.border.default.border-default',                           label: 'Default border',    cssVar: '--atom-border-default-border-default',                           activeWhen: s => s === 'Default' || s === 'Focus - Accessibility' },
  { key: 'border-focus',    tokenKey: 'atom.border.selection-and-focus.border-primary-focus',         label: 'Focus border',      cssVar: '--atom-border-selection-and-focus-border-primary-focus',         activeWhen: s => s === 'Focus' },
  { key: 'focus-ring',      tokenKey: 'atom.border.selection-and-focus.border-secondary-focus',       label: 'Focus ring',        cssVar: '--atom-border-selection-and-focus-border-secondary-focus',       activeWhen: s => s === 'Focus' || s === 'Focus - Accessibility' },
  { key: 'border-error',    tokenKey: 'atom.border.feedback.border-error',                            label: 'Error border',      cssVar: '--atom-border-feedback-border-error',                            activeWhen: s => s === 'Error' },
  { key: 'border-disabled', tokenKey: 'atom.border.states.border-disabled',                          label: 'Disabled border',   cssVar: '--atom-border-states-border-disabled',                          activeWhen: s => s === 'Disabled' },
  { key: 'fg-primary',      tokenKey: 'atom.foreground.core.fg-primary',                             label: 'Label / text',      cssVar: '--atom-foreground-core-fg-primary',                             activeWhen: s => s === 'Default' || s === 'Focus' || s === 'Focus - Accessibility' },
  { key: 'fg-secondary',    tokenKey: 'atom.foreground.core.fg-secondary',                           label: 'Helper text',       cssVar: '--atom-foreground-core-fg-secondary',                           activeWhen: s => s === 'Default' || s === 'Focus' || s === 'Focus - Accessibility' },
  { key: 'fg-error',        tokenKey: 'atom.foreground.feedback.fg-error',                           label: 'Error label / msg', cssVar: '--atom-foreground-feedback-fg-error',                           activeWhen: s => s === 'Error' },
  { key: 'fg-disabled',     tokenKey: 'atom.foreground.states.fg-disabled',                          label: 'Disabled text',     cssVar: '--atom-foreground-states-fg-disabled',                          activeWhen: s => s === 'Disabled' },
  { key: 'icon-color',      tokenKey: 'atom.foreground.core.fg-interactive-icon',                    label: 'Icon',              cssVar: '--atom-foreground-core-fg-interactive-icon',                    activeWhen: s => s === 'Default' || s === 'Focus' || s === 'Focus - Accessibility' },
];

const A11Y_ROWS = [
  { icon: '🏷️', title: 'Always use a label', body: 'Every input must have a visible label associated via htmlFor/id or wrapping. Never rely on placeholder text as the only label — it disappears on input.' },
  { icon: '⚠️', title: 'Error messages', body: "Link the error message to the input with aria-describedby. Use aria-invalid=\"true\" on the input when in Error state. Don't rely on color alone." },
  { icon: '⌨️', title: 'Keyboard access', body: 'Inputs are natively focusable. Ensure Tab order is logical. Avoid removing the focus ring without providing an equivalent custom style.' },
  { icon: '🚫', title: 'Disabled state', body: 'Use the disabled HTML attribute. Disabled inputs are excluded from Tab order and announced as unavailable. Provide a visible hint explaining why.' },
  { icon: '📝', title: 'Text Area', body: "For Text Area, set a meaningful rows attribute and allow resize where appropriate. Provide a character count when there's a limit." },
];

export function InputPage({ brand }: InputPageProps) {
  const [type, setType] = useState<InputType>('Basic');
  const [labelPosition, setLabelPosition] = useState<LabelPosition>('Outside');
  const [state, setState] = useState<InputState>('Default');
  const [filled, setFilled] = useState(false);
  const [label, setLabel] = useState('Label');
  const [placeholder, setPlaceholder] = useState('Placeholder');
  const [helperText, setHelperText] = useState('Helper text');
  const [showHelperText, setShowHelperText] = useState(true);

  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];
  const previewKey = `${type}-${labelPosition}-${state}-${filled}-${showHelperText}`;

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ─────────────────────────────────────────── */}
      <section>
        <div style={{ borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', background: 'white' }}>
          <div style={{ display: 'flex', flexDirection: 'row', minHeight: '320px' }}>

            {/* Canvas */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px', ...DOTTED_BG }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                >
                  <InputLive
                    type={type}
                    labelPosition={labelPosition}
                    state={state}
                    filled={filled}
                    label={label}
                    placeholder={placeholder}
                    helperText={helperText}
                    showHelperText={showHelperText}
                    brand={brand}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div style={{ width: '196px', borderLeft: '1px solid #e5e7eb', padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px', backgroundColor: '#fafafa', flexShrink: 0, overflowY: 'auto' }}>
              <div>
                <p style={LABEL_STYLE}>Type</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {ALL_TYPES.map(t => (
                    <button key={t} onClick={() => setType(t)} style={type === t ? SEG_ACTIVE : SEG_BASE}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <p style={LABEL_STYLE}>Label Position</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {ALL_LABEL_POSITIONS.map(lp => (
                    <button key={lp} onClick={() => setLabelPosition(lp)} style={labelPosition === lp ? SEG_ACTIVE : SEG_BASE}>{lp}</button>
                  ))}
                </div>
              </div>
              <div>
                <p style={LABEL_STYLE}>State</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {ALL_STATES.map(s => (
                    <button key={s} onClick={() => setState(s)} style={state === s ? SEG_ACTIVE : SEG_BASE}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <p style={LABEL_STYLE}>Filled</p>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button onClick={() => setFilled(false)} style={!filled ? SEG_ACTIVE : SEG_BASE}>No</button>
                  <button onClick={() => setFilled(true)} style={filled ? SEG_ACTIVE : SEG_BASE}>Yes</button>
                </div>
              </div>
              <div>
                <p style={LABEL_STYLE}>Helper Text</p>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button onClick={() => setShowHelperText(false)} style={!showHelperText ? SEG_ACTIVE : SEG_BASE}>Off</button>
                  <button onClick={() => setShowHelperText(true)} style={showHelperText ? SEG_ACTIVE : SEG_BASE}>On</button>
                </div>
              </div>
              <div>
                <p style={LABEL_STYLE}>Label</p>
                <input value={label} onChange={e => setLabel(e.target.value)} style={{ width: '100%', padding: '6px 8px', fontSize: '12px', border: '1px solid #e5e7eb', borderRadius: '6px', boxSizing: 'border-box', fontFamily: 'system-ui,-apple-system,sans-serif' }} />
              </div>
              <div>
                <p style={LABEL_STYLE}>Placeholder</p>
                <input value={placeholder} onChange={e => setPlaceholder(e.target.value)} style={{ width: '100%', padding: '6px 8px', fontSize: '12px', border: '1px solid #e5e7eb', borderRadius: '6px', boxSizing: 'border-box', fontFamily: 'system-ui,-apple-system,sans-serif' }} />
              </div>
              <div>
                <p style={LABEL_STYLE}>Helper Text Value</p>
                <input value={helperText} onChange={e => setHelperText(e.target.value)} style={{ width: '100%', padding: '6px 8px', fontSize: '12px', border: '1px solid #e5e7eb', borderRadius: '6px', boxSizing: 'border-box', fontFamily: 'system-ui,-apple-system,sans-serif' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ──────────────────────────────────────────────── */}
      <section>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Input</h1>
        <p style={{ fontSize: '15px', color: '#6b7280', margin: '0 0 16px', lineHeight: 1.6 }}>
          Captures user-entered text or data. Supports multiple types (Basic, Text Area, Search, Password, Phone Number, Verification Code, Payment) and two label positions (Outside, Inside).
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', border: '1px solid #e5e7eb', backgroundColor: 'white', fontFamily: 'system-ui,-apple-system,sans-serif' }}>Feedback</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', border: '1px solid #dcfce7', backgroundColor: '#f0fdf4', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} /> Stable
          </span>
        </div>
      </section>

      {/* ── 3. ANATOMY ─────────────────────────────────────────────────────── */}
      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Anatomy</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px' }}>Parts of the Input component and their roles.</p>
        <div style={{ ...DOTTED_BG, borderRadius: '12px', padding: '72px 48px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: '240px' }}>
          <div style={{ transform: 'scale(1.4)', transformOrigin: 'center' }}>
            <InputLive state="Default" label="Label" placeholder="Placeholder" helperText="Helper text" brand={brand} />
          </div>
          {/* #1 Label — above left */}
          <div style={{ position: 'absolute', top: '16px', left: '32%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalloutDot num="1" />
            <div style={LINE} />
          </div>
          {/* #2 Input field — below center */}
          <div style={{ position: 'absolute', bottom: '48px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={LINE} />
            <CalloutDot num="2" />
          </div>
          {/* #3 Trailing icon — above right */}
          <div style={{ position: 'absolute', top: '16px', left: '70%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalloutDot num="3" />
            <div style={LINE} />
          </div>
          {/* #4 Helper text — bottom left */}
          <div style={{ position: 'absolute', bottom: '16px', left: '32%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={LINE} />
            <CalloutDot num="4" />
          </div>
        </div>
        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {[
            { num: '1', label: 'Label', desc: '14px text above the field. Color changes to error red in Error state. Required — never omit.' },
            { num: '2', label: 'Input field', desc: '52px height, 8px corner radius. Background and border driven by state tokens. Text Area uses 96px+ height.' },
            { num: '3', label: 'Trailing icon', desc: 'Optional 16×16px icon slot. Used to indicate type (eye for password, search, calendar) or status.' },
            { num: '4', label: 'Helper text', desc: 'Supplemental guidance below the field. Replaced by the error message (red) in Error state.' },
          ].map(({ num, label: l, desc }) => (
            <div key={num} style={{ display: 'flex', gap: '10px', padding: '12px', borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
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
        <h2 id="variants" style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Variants</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>All 140 variants across 7 types, 2 label positions, 5 states, and 2 fill states.</p>

        {/* Properties table */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden', marginBottom: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Property</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Values</th>
              </tr>
            </thead>
            <tbody>
              {[
                { prop: 'Type', values: 'Basic · Text Area · Search · Password · Phone Number · Verification Code · Payment' },
                { prop: 'Label Position', values: 'Outside · Inside' },
                { prop: 'State', values: 'Default · Focus · Focus - Accessibility · Error · Disabled' },
                { prop: 'Filled', values: 'No · Yes' },
              ].map(({ prop, values }, i) => (
                <tr key={prop} style={{ borderBottom: i < 3 ? '1px solid #f3f4f6' : 'none' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>{prop}</td>
                  <td style={{ padding: '10px 16px', color: '#6b7280' }}>{values}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Full variant grid — one section per Type */}
        {ALL_TYPES.map(t => (
          <div key={t} style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 12px', fontFamily: 'system-ui,-apple-system,sans-serif' }}>{t}</h3>

            {ALL_LABEL_POSITIONS.map(lp => (
              <div key={lp} style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
                  Label Position: {lp}
                </p>
                <div style={{ ...DOTTED_BG, borderRadius: '12px', padding: '24px', overflow: 'auto' }}>
                  {/* State headers */}
                  <div style={{ display: 'grid', gridTemplateColumns: `80px repeat(${ALL_STATES.length}, 1fr)`, gap: '12px', marginBottom: '12px' }}>
                    <div />
                    {ALL_STATES.map(s => (
                      <span key={s} style={{ fontSize: '10px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'system-ui,-apple-system,sans-serif', textAlign: 'center' }}>{s}</span>
                    ))}
                  </div>
                  {/* Unfilled row */}
                  <div style={{ display: 'grid', gridTemplateColumns: `80px repeat(${ALL_STATES.length}, 1fr)`, gap: '12px', marginBottom: '16px', alignItems: 'start' }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'system-ui,-apple-system,sans-serif', paddingTop: '16px' }}>Unfilled</span>
                    {ALL_STATES.map(s => (
                      <div key={s} style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ transform: 'scale(0.72)', transformOrigin: 'top center' }}>
                          <InputLive type={t} labelPosition={lp} state={s} filled={false} brand={brand} />
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Filled row */}
                  <div style={{ display: 'grid', gridTemplateColumns: `80px repeat(${ALL_STATES.length}, 1fr)`, gap: '12px', alignItems: 'start' }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'system-ui,-apple-system,sans-serif', paddingTop: '16px' }}>Filled</span>
                    {ALL_STATES.map(s => (
                      <div key={s} style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ transform: 'scale(0.72)', transformOrigin: 'top center' }}>
                          <InputLive type={t} labelPosition={lp} state={s} filled={true} brand={brand} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>

      {/* ── 5. DESIGN TOKENS ───────────────────────────────────────────────── */}
      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Design tokens</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          Active tokens for the selected state ({state}) are highlighted.
        </p>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '150px' }}>Role</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Token</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '100px' }}>Value</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '52px' }}>Swatch</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_ROWS.map((row, i) => {
                const isActive = row.activeWhen(state);
                const resolvedValue = tokens[row.tokenKey as keyof typeof tokens] ?? '—';
                return (
                  <tr key={row.key} style={{
                    borderBottom: i < TOKEN_ROWS.length - 1 ? '1px solid #f3f4f6' : 'none',
                    opacity: isActive ? 1 : 0.35,
                    transition: 'opacity 0.2s ease',
                    borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                  }}>
                    <td style={{ padding: '10px 16px', color: '#374151', fontWeight: isActive ? 600 : 400 }}>{row.label}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <code style={{ fontSize: '11px', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', color: '#6b7280' }}>{row.cssVar}</code>
                    </td>
                    <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: '12px', color: '#6b7280' }}>{resolvedValue.slice(0, 9)}</td>
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
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>Guidance for building inclusive form inputs.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {A11Y_ROWS.map(({ icon, title, body }) => (
            <div key={title} style={{ display: 'flex', gap: '14px', padding: '16px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
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
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>When and how to use each Input type.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>✓ Do</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.5 }}>
              <li style={{ marginBottom: '6px' }}>• Always provide a visible label (Outside or Inside floated)</li>
              <li style={{ marginBottom: '6px' }}>• Use helper text to explain format (e.g. "DD/MM/YYYY")</li>
              <li style={{ marginBottom: '6px' }}>• Use Error state with a specific message, not just color</li>
              <li>• Use Text Area when users need multi-line input</li>
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>✗ Don't</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.5 }}>
              <li style={{ marginBottom: '6px' }}>• Don't use placeholder text as the only label</li>
              <li style={{ marginBottom: '6px' }}>• Don't disable without explaining why in nearby text</li>
              <li style={{ marginBottom: '6px' }}>• Don't use Basic for multi-line content — use Text Area</li>
              <li>• Don't rely on color alone to communicate errors</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
