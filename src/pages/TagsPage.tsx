import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TagsLive, type TagState } from '../components/tags/TagsLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

interface TagsPageProps { brand: Brand; }

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

const ALL_STATES: TagState[] = ['Default', 'Selected', 'Disabled'];

const LABEL_STYLE: React.CSSProperties = {
  margin: '0 0 8px', fontSize: '11px', fontWeight: 600,
  color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em',
};

const SEG_BASE: React.CSSProperties = {
  padding: '6px 12px', fontSize: '12px', border: '1px solid #e5e7eb',
  borderRadius: '6px', cursor: 'pointer', background: 'white', color: '#374151',
  fontFamily: 'system-ui,-apple-system,sans-serif', fontWeight: 500,
};
const SEG_ACTIVE: React.CSSProperties = { ...SEG_BASE, background: '#111827', color: '#fff', borderColor: '#111827' };

type TokenRow = { key: string; tokenKey: string; label: string; cssVar: string; activeWhen: (s: TagState) => boolean };

const TOKEN_ROWS: TokenRow[] = [
  { key: 'default-bg',   tokenKey: 'atom.background.primary.bg-primary-inverse',          label: 'Default bg',     cssVar: '--atom-background-primary-bg-primary-inverse',          activeWhen: s => s === 'Default' },
  { key: 'selected-bg',  tokenKey: 'atom.background.primary.bg-primary-pressed-brand',    label: 'Selected bg',    cssVar: '--atom-background-primary-bg-primary-pressed-brand',    activeWhen: s => s === 'Selected' },
  { key: 'disabled-bg',  tokenKey: 'atom.background.primary.bg-primary-disabled-inverse', label: 'Disabled bg',    cssVar: '--atom-background-primary-bg-primary-disabled-inverse', activeWhen: s => s === 'Disabled' },
  { key: 'border',       tokenKey: 'atom.border.default.border-default',                  label: 'Default border', cssVar: '--atom-border-default-border-default',                  activeWhen: s => s === 'Default' },
  { key: 'dis-border',   tokenKey: 'atom.border.states.border-disabled',                  label: 'Disabled border',cssVar: '--atom-border-states-border-disabled',                  activeWhen: s => s === 'Disabled' },
  { key: 'default-fg',   tokenKey: 'atom.foreground.core.fg-primary',                     label: 'Default text',   cssVar: '--atom-foreground-core-fg-primary',                     activeWhen: s => s === 'Default' },
  { key: 'selected-fg',  tokenKey: 'atom.foreground.states.fg-pressed-inverse',           label: 'Selected text',  cssVar: '--atom-foreground-states-fg-pressed-inverse',           activeWhen: s => s === 'Selected' },
  { key: 'disabled-fg',  tokenKey: 'atom.foreground.states.fg-disabled',                  label: 'Disabled text',  cssVar: '--atom-foreground-states-fg-disabled',                  activeWhen: s => s === 'Disabled' },
];

const A11Y_ROWS = [
  { icon: '🏷️', title: 'Semantic markup', body: 'Tags used as filters should be rendered as <button> or <input type="checkbox"> elements. Pure display tags can be <span>. Never use divs for interactive tags.' },
  { icon: '🎯', title: 'Selected state', body: 'When a tag acts as a filter, use aria-pressed="true/false" on a <button> to communicate selected state to screen readers.' },
  { icon: '⌨️', title: 'Keyboard navigation', body: 'Interactive tags must be reachable by Tab and activatable by Enter or Space. Group related tags in a role="group" with an accessible label.' },
  { icon: '🚫', title: 'Disabled state', body: 'Disabled tags should use aria-disabled="true" to remain announced while communicating unavailability. Provide context for why a tag is disabled when possible.' },
];

export function TagsPage({ brand }: TagsPageProps) {
  const [state, setState] = useState<TagState>('Default');
  const [tagLabel, setTagLabel] = useState('Label');
  const [showIcon, setShowIcon] = useState(true);

  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];
  const previewKey = `${state}-${showIcon}`;

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
                  <div style={{ transform: 'scale(2.5)', transformOrigin: 'center' }}>
                    <TagsLive state={state} label={tagLabel} showIconLeft={showIcon} brand={brand} />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div style={{ width: '224px', borderLeft: '1px solid #e5e7eb', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#fafafa', flexShrink: 0 }}>
              <div>
                <p style={LABEL_STYLE}>State</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {ALL_STATES.map(s => (
                    <button key={s} onClick={() => setState(s)} style={state === s ? SEG_ACTIVE : SEG_BASE}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <p style={LABEL_STYLE}>Label</p>
                <input value={tagLabel} onChange={e => setTagLabel(e.target.value)} style={{ width: '100%', padding: '6px 8px', fontSize: '12px', border: '1px solid #e5e7eb', borderRadius: '6px', boxSizing: 'border-box', fontFamily: 'system-ui,-apple-system,sans-serif' }} />
              </div>
              <div>
                <p style={LABEL_STYLE}>Icon Left</p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => setShowIcon(true)} style={showIcon ? SEG_ACTIVE : SEG_BASE}>Show</button>
                  <button onClick={() => setShowIcon(false)} style={!showIcon ? SEG_ACTIVE : SEG_BASE}>Hide</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ──────────────────────────────────────────────── */}
      <section>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Tags</h1>
        <p style={{ fontSize: '15px', color: '#6b7280', margin: '0 0 16px', lineHeight: 1.6 }}>
          Displays compact labels that categorise, filter, or identify content attributes. Can be interactive (filter) or purely decorative (label).
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
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px' }}>Parts of the Tags component and their roles.</p>
        <div style={{ ...DOTTED_BG, borderRadius: '12px', padding: '64px 48px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: '180px' }}>
          <div style={{ transform: 'scale(3.5)', transformOrigin: 'center' }}>
            <TagsLive state="Selected" label="Label" showIconLeft={true} brand={brand} />
          </div>

          {/* #1 Container */}
          <div style={{ position: 'absolute', bottom: '16px', left: '38%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={LINE} />
            <CalloutDot num="1" />
          </div>
          {/* #2 Icon */}
          <div style={{ position: 'absolute', top: '16px', left: '44%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalloutDot num="2" />
            <div style={LINE} />
          </div>
          {/* #3 Label */}
          <div style={{ position: 'absolute', top: '16px', left: '54%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalloutDot num="3" />
            <div style={LINE} />
          </div>
        </div>
        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {[
            { num: '1', label: 'Container', desc: '32px tall pill (999px radius). Background and border driven by state tokens. Selected state has no border.' },
            { num: '2', label: 'Icon', desc: 'Optional 14×14px leading icon. Inherits the same color as the label text. Hidden via the Icon Left control.' },
            { num: '3', label: 'Label', desc: '12px text inside the container. Selected state shows a trailing checkmark icon alongside the label.' },
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
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>Available states and visual combinations.</p>

        {/* Visual variant grid */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', padding: '24px', ...DOTTED_BG, borderRadius: '12px', marginBottom: '16px', alignItems: 'center' }}>
          {ALL_STATES.map(s => (
            <TagsLive key={s} state={s} label={s} showIconLeft={true} brand={brand} />
          ))}
        </div>

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
                { prop: 'State', values: 'Default · Hover · Selected · Focused · Disabled' },
                { prop: 'Icon Left', values: 'Show · Hide' },
                { prop: 'Icon Right', values: 'Show (Selected only) · Hide' },
              ].map(({ prop, values }, i) => (
                <tr key={prop} style={{ borderBottom: i < 2 ? '1px solid #f3f4f6' : 'none' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>{prop}</td>
                  <td style={{ padding: '10px 16px', color: '#6b7280' }}>{values}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '140px' }}>Role</th>
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
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>Guidance for building inclusive tag components.</p>
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
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>When and how to use Tags.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>✓ Do</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.5 }}>
              <li style={{ marginBottom: '6px' }}>• Use for category labels, filters, or attribute indicators</li>
              <li style={{ marginBottom: '6px' }}>• Keep labels short — 1–3 words maximum</li>
              <li>• Use Selected state to show active filters with the checkmark</li>
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>✗ Don't</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.5 }}>
              <li style={{ marginBottom: '6px' }}>• Don't overload a single view with too many tags</li>
              <li style={{ marginBottom: '6px' }}>• Don't use Tags as navigation — use Tabs or Links instead</li>
              <li>• Don't use long sentences as tag labels</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
