import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SwitchLive, type SwitchState } from '../components/switch/SwitchLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

interface SwitchPageProps { brand: Brand; }

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

const ALL_STATES: SwitchState[] = ['Default', 'Focused', 'Disabled'];

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
      }}
    >
      {children}
    </button>
  );
}

type TokenRow = { key: string; tokenKey: string; label: string; cssVar: string; activeWhen: (s: SwitchState, on: boolean) => boolean };

const TOKEN_ROWS: TokenRow[] = [
  { key: 'off-track',   tokenKey: 'atom.background.core.bg-muted',                        label: 'Off track',        cssVar: '--atom-background-core-bg-muted',                       activeWhen: (s, on) => (s === 'Default' || s === 'Focused') && !on },
  { key: 'on-track',    tokenKey: 'atom.background.primary.bg-primary-pressed',            label: 'On track',         cssVar: '--atom-background-primary-bg-primary-pressed',           activeWhen: (s, on) => (s === 'Default' || s === 'Focused') && on },
  { key: 'dis-track',   tokenKey: 'atom.background.primary.bg-primary-disabled',           label: 'Disabled track',   cssVar: '--atom-background-primary-bg-primary-disabled',          activeWhen: (s) => s === 'Disabled' },
  { key: 'off-thumb',   tokenKey: 'atom.foreground.primary.fg-brand-primary',              label: 'Off thumb',        cssVar: '--atom-foreground-primary-fg-brand-primary',             activeWhen: (s, on) => (s === 'Default' || s === 'Focused') && !on },
  { key: 'on-thumb',    tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse',      label: 'On thumb',         cssVar: '--atom-foreground-primary-fg-brand-primary-inverse',     activeWhen: (s, on) => (s === 'Default' || s === 'Focused') && on },
  { key: 'dis-thumb',   tokenKey: 'atom.foreground.states.fg-disabled-inverse',            label: 'Disabled thumb',   cssVar: '--atom-foreground-states-fg-disabled-inverse',           activeWhen: (s) => s === 'Disabled' },
  { key: 'off-label',   tokenKey: 'atom.foreground.core.fg-primary',                       label: 'Off label',        cssVar: '--atom-foreground-core-fg-primary',                      activeWhen: (s, on) => (s === 'Default' || s === 'Focused') && !on },
  { key: 'on-label',    tokenKey: 'atom.foreground.primary.fg-brand-primary',              label: 'On label',         cssVar: '--atom-foreground-primary-fg-brand-primary',             activeWhen: (s, on) => (s === 'Default' || s === 'Focused') && on },
  { key: 'dis-label',   tokenKey: 'atom.foreground.states.fg-disabled',                    label: 'Disabled label',   cssVar: '--atom-foreground-states-fg-disabled',                   activeWhen: (s) => s === 'Disabled' },
];

const A11Y_ROWS = [
  { icon: '🔀', title: 'Use role="switch"', body: 'The toggle element must have role="switch" and aria-checked="true/false". Native <input type="checkbox"> with a custom visual is a common accessible pattern.' },
  { icon: '🏷️', title: 'Always label', body: 'Pair every switch with a visible label describing the setting being toggled. The label must be programmatically associated via aria-labelledby or wrapping <label>.' },
  { icon: '⌨️', title: 'Keyboard support', body: 'Space toggles the switch. Do not prevent focus. The focus ring must be visible — use the brand focus token for the ring color.' },
  { icon: '🚫', title: 'Disabled state', body: 'Use aria-disabled="true" (not the HTML disabled attribute) if you want to keep it in Tab order while communicating unavailability. Otherwise use disabled.' },
];

export function SwitchPage({ brand }: SwitchPageProps) {
  const [state, setState] = useState<SwitchState>('Default');
  const [on, setOn] = useState(false);

  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];
  const previewKey = `${state}-${on}`;

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ─────────────────────────────────────────── */}
      <section>
        <div style={{ borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', background: 'white' }}>
          <div style={{ display: 'flex', flexDirection: 'row', minHeight: '288px' }}>
            {/* Canvas */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px', ...DOTTED_BG }}>
              <AnimatePresence mode="wait">
                <motion.div key={previewKey} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
                  <SwitchLive state={state} on={on} onChange={setOn} brand={brand} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div style={{ width: '224px', borderLeft: '1px solid #e5e7eb', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#fafafa', flexShrink: 0 }}>
              <div>
                <p style={LABEL_STYLE}>State</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  {ALL_STATES.map(s => (
                    <SegBtn key={s} active={state === s} onClick={() => setState(s)}>{s}</SegBtn>
                  ))}
                </div>
              </div>
              <div>
                <p style={LABEL_STYLE}>On</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  {([true, false] as const).map(v => (
                    <SegBtn key={String(v)} active={on === v} onClick={() => setOn(v)}>{v ? 'True' : 'False'}</SegBtn>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ──────────────────────────────────────────────── */}
      <section>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Switch</h1>
        <p style={{ fontSize: '15px', color: '#6b7280', margin: '0 0 16px', lineHeight: 1.6 }}>
          Enables users to toggle between two opposing states — on and off. Used for settings, mode changes, and preference controls.
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
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px' }}>Parts of the Switch component and their roles.</p>
        <div style={{ ...DOTTED_BG, borderRadius: '12px', padding: '64px 48px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: '180px' }}>
          <SwitchLive state="Default" on={true} brand={brand} />

          {/* #1 Track */}
          <div style={{ position: 'absolute', bottom: '16px', left: '48%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={LINE} />
            <CalloutDot num="1" />
          </div>
          {/* #2 Thumb */}
          <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalloutDot num="2" />
            <div style={LINE} />
          </div>
          {/* #3 Label */}
          <div style={{ position: 'absolute', top: '16px', left: '53%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalloutDot num="3" />
            <div style={LINE} />
          </div>
        </div>
        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {[
            { num: '1', label: 'Track', desc: '48×24px pill. Background color changes between off (muted) and on (brand pressed) states.' },
            { num: '2', label: 'Thumb', desc: '20×20px circle inside the track. Slides left (off) or right (on). Color inverts to maintain contrast.' },
            { num: '3', label: 'Label', desc: '"On" or "Off" text beside the track. Color matches the brand foreground for the current state.' },
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
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Variants</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>Available property combinations for the Switch component.</p>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Property</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Values</th>
              </tr>
            </thead>
            <tbody>
              {[
                { prop: 'State', values: 'Default · Focused · Disabled' },
                { prop: 'On', values: 'True · False' },
              ].map(({ prop, values }, i) => (
                <tr key={prop} style={{ borderBottom: i < 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>{prop}</td>
                  <td style={{ padding: '10px 16px', color: '#6b7280' }}>{values}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual preview of all variant combinations */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          {ALL_STATES.map(s =>
            [false, true].map(isOn => (
              <div key={`${s}-${isOn}`} style={{ padding: '20px 24px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>
                  {s} · {isOn ? 'On' : 'Off'}
                </p>
                <SwitchLive state={s} on={isOn} brand={brand} />
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ───────────────────────────────────────────────── */}
      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Design tokens</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          Active tokens for the selected state ({state}, {on ? 'On' : 'Off'}) are highlighted.
        </p>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '140px' }}>Role</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Token</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '100px' }}>Value</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '52px' }}>Swatch</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_ROWS.map((row, i) => {
                const isActive = row.activeWhen(state, on);
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
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>Guidance for building inclusive toggle switches.</p>
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
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>When to use a Switch vs other selection controls.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>✓ Do</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.5 }}>
              <li style={{ marginBottom: '6px' }}>• Use for on/off settings that take effect immediately</li>
              <li style={{ marginBottom: '6px' }}>• Label the switch with the setting name (e.g. "Notifications")</li>
              <li>• Reflect state change instantly — no Save button needed</li>
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>✗ Don't</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.5 }}>
              <li style={{ marginBottom: '6px' }}>• Don't use for choices that require a submit action</li>
              <li style={{ marginBottom: '6px' }}>• Don't use instead of radio buttons for mutually exclusive options</li>
              <li>• Don't label with the state itself ("On"/"Off") as the primary label</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
