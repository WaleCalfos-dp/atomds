import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { SwitchLive } from '../components/switch/SwitchLive';

interface SwitchPageProps {
  brand: Brand;
}

/* -------------------------------------------------------------------------- */
/*  Figma property surface                                                    */
/* -------------------------------------------------------------------------- */

type SwitchState = 'Default' | 'Focused' | 'Disabled';
const STATES: SwitchState[] = ['Default', 'Focused', 'Disabled'];

/* -------------------------------------------------------------------------- */
/*  Shared styles / helpers                                                   */
/* -------------------------------------------------------------------------- */

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const LABEL_STYLE: React.CSSProperties = {
  margin: '0 0 8px',
  fontSize: '11px',
  fontWeight: 600,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

const LINE: React.CSSProperties = { width: '1px', height: '32px', backgroundColor: '#94a3b8' };

function CalloutDot({ num }: { num: string }) {
  return (
    <span
      style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: '#1e293b',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontWeight: 700,
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        flexShrink: 0,
      }}
    >
      {num}
    </span>
  );
}

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

/* -------------------------------------------------------------------------- */
/*  Preview renderer                                                          */
/*                                                                            */
/*  Every preview in this page — interactive rail, anatomy illustration, and  */
/*  the Variants matrix — is driven by <SwitchLive>, which renders one of the */
/*  six Figma-exported SVGs for the current State × On combination. Track     */
/*  geometry, thumb position, focus ring, and the inline "On" / "Off" glyphs  */
/*  are baked into the SVG, so the documentation stays on Figma truth.        */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*  Reference data                                                            */
/* -------------------------------------------------------------------------- */

const TOKEN_TABLE_ROWS = [
  { role: 'Track — Off (Default / Focused)', tokenKey: 'atom.background.core.bg-muted', cssVar: '--atom-background-core-bg-muted' },
  { role: 'Track — On (Default / Focused)', tokenKey: 'atom.background.primary.bg-primary-pressed', cssVar: '--atom-background-primary-bg-primary-pressed' },
  { role: 'Track — Disabled', tokenKey: 'atom.background.primary.bg-primary-disabled', cssVar: '--atom-background-primary-bg-primary-disabled' },
  { role: 'Thumb — Off', tokenKey: 'atom.foreground.primary.fg-brand-primary', cssVar: '--atom-foreground-primary-fg-brand-primary' },
  { role: 'Thumb — On', tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse', cssVar: '--atom-foreground-primary-fg-brand-primary-inverse' },
  { role: 'Thumb — Disabled', tokenKey: 'atom.foreground.states.fg-disabled-inverse', cssVar: '--atom-foreground-states-fg-disabled-inverse' },
  { role: 'Action text — Off', tokenKey: 'atom.foreground.core.fg-primary', cssVar: '--atom-foreground-core-fg-primary' },
  { role: 'Action text — On', tokenKey: 'atom.foreground.primary.fg-brand-primary', cssVar: '--atom-foreground-primary-fg-brand-primary' },
  { role: 'Action text — Disabled', tokenKey: 'atom.foreground.states.fg-disabled', cssVar: '--atom-foreground-states-fg-disabled' },
  { role: 'Focus ring', tokenKey: 'atom.border.selection-and-focus.border-selected', cssVar: '--atom-border-selection-and-focus-border-selected' },
] as const;

const A11Y_ROWS = [
  {
    icon: '🔀',
    title: 'Use role="switch"',
    body: 'The toggle element must have role="switch" together with aria-checked="true" or "false". A native input type="checkbox" visually styled as a switch is also acceptable.',
  },
  {
    icon: '🏷️',
    title: 'Always provide a setting label',
    body: 'Pair every switch with a visible label that names the setting being controlled (e.g. "Email notifications"). Associate it via aria-labelledby or a wrapping <label>.',
  },
  {
    icon: '⌨️',
    title: 'Keyboard: Space toggles',
    body: 'Space must toggle the switch when focused. Tab moves focus to it. Do not suppress focus; the Focused state renders the brand focus ring which meets the 3:1 non-text contrast rule.',
  },
  {
    icon: '🚫',
    title: 'Disabled semantics',
    body: 'Prefer aria-disabled="true" when the switch should stay in tab order for contextual help, or the native disabled attribute when it should be removed from focus entirely.',
  },
  {
    icon: '🎨',
    title: 'State independent of colour',
    body: 'Thumb position — not just colour — carries the on/off meaning. When Action Text is off, ensure the label nearby already describes the currently active option.',
  },
  {
    icon: '📢',
    title: 'Announce changes',
    body: 'If flipping the switch triggers a visible change elsewhere, consider a polite aria-live region so screen reader users hear the result.',
  },
];

const USAGE_ROWS = [
  {
    title: 'Default',
    body: 'Resting state. Flip toggles immediately without a confirm step. Use for settings that apply as soon as they change.',
  },
  {
    title: 'Focused',
    body: 'Keyboard focus or tap focus. A 2px ring in border-selected wraps the track so users always know where focus sits.',
  },
  {
    title: 'Disabled',
    body: 'Use when the setting is temporarily unavailable (e.g. requires a higher plan or depends on another toggle being on).',
  },
  {
    title: 'Action Text',
    body: 'When true, renders the inline "On" / "Off" label beside the track. Turn off when the surrounding row already communicates state, or when horizontal space is tight.',
  },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export function SwitchPage({ brand }: SwitchPageProps) {
  const [state, setState] = useState<SwitchState>('Default');
  const [on, setOn] = useState(false);
  const [actionText, setActionText] = useState(true);

  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];
  const previewKey = `${state}|${on}|${actionText}`;

  return (
    <div className="space-y-10">

      {/* -- 1. INTERACTIVE PREVIEW -------------------------------------- */}
      <section>
        <div
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#fff',
          }}
        >
          <div style={{ display: 'flex', minHeight: '300px' }}>
            <div
              style={{
                flex: 1,
                ...DOTTED_BG,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                >
                  <SwitchLive state={state} on={on} actionText={actionText} />
                </motion.div>
              </AnimatePresence>
            </div>

            <div
              style={{
                width: '224px',
                borderLeft: '1px solid #e5e7eb',
                padding: '20px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
                backgroundColor: '#fafafa',
                flexShrink: 0,
              }}
            >
              <div>
                <p style={LABEL_STYLE}>State</p>
                <div
                  style={{
                    display: 'flex',
                    padding: '2px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    gap: '2px',
                  }}
                >
                  {STATES.map((s) => (
                    <SegBtn key={s} active={state === s} onClick={() => setState(s)}>
                      {s}
                    </SegBtn>
                  ))}
                </div>
              </div>

              <div>
                <p style={LABEL_STYLE}>On</p>
                <div
                  style={{
                    display: 'flex',
                    padding: '2px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    gap: '2px',
                  }}
                >
                  {([true, false] as const).map((v) => (
                    <SegBtn key={String(v)} active={on === v} onClick={() => setOn(v)}>
                      {v ? 'True' : 'False'}
                    </SegBtn>
                  ))}
                </div>
              </div>

              <div>
                <p style={LABEL_STYLE}>Action Text</p>
                <div
                  style={{
                    display: 'flex',
                    padding: '2px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    gap: '2px',
                  }}
                >
                  {([true, false] as const).map((v) => (
                    <SegBtn
                      key={String(v)}
                      active={actionText === v}
                      onClick={() => setActionText(v)}
                    >
                      {v ? 'True' : 'False'}
                    </SegBtn>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -- 2. COMPONENT INFO ------------------------------------------- */}
      <section>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
          Switch
        </h1>
        <p
          style={{
            fontSize: '15px',
            color: '#6b7280',
            lineHeight: 1.6,
            margin: '0 0 16px',
            maxWidth: '640px',
          }}
        >
          Enables users to switch between two opposing states. Use for on/off settings,
          mode changes, or preference controls.
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <a
            href="#"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              fontSize: '13px',
              color: '#374151',
              textDecoration: 'none',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              backgroundColor: '#fff',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Feedback
          </a>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #bbf7d0',
              fontSize: '13px',
              color: '#166534',
              backgroundColor: '#f0fdf4',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                display: 'inline-block',
              }}
            />
            Stable
          </span>
        </div>
      </section>

      {/* -- 3. ANATOMY -------------------------------------------------- */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Anatomy</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px' }}>
          Three visual parts: the track, the thumb, and the optional action text.
        </p>

        <div
          style={{
            ...DOTTED_BG,
            borderRadius: '12px',
            padding: '64px 48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            minHeight: '200px',
          }}
        >
          <SwitchLive state="Default" on={true} actionText={true} />

          {/* 1 — Track (bottom) */}
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: 'calc(50% - 28px)',
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={LINE} />
            <CalloutDot num="1" />
          </div>
          {/* 2 — Thumb (top) */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: 'calc(50% - 6px)',
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <CalloutDot num="2" />
            <div style={LINE} />
          </div>
          {/* 3 — Action text (right) */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: 'calc(50% + 44px)',
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <CalloutDot num="3" />
            <div style={LINE} />
          </div>
        </div>

        <div
          style={{
            marginTop: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
          }}
        >
          {[
            {
              num: '1',
              label: 'Track',
              desc: '48 × 24 pill (999 radius). Off uses bg-muted; On uses bg-primary-pressed; Disabled uses bg-primary-disabled.',
            },
            {
              num: '2',
              label: 'Thumb',
              desc: '20 × 20 circle inside the track, offset 2px from each edge. Slides between left (Off) and right (On) positions.',
            },
            {
              num: '3',
              label: 'Action text',
              desc: '12px Medium inline label that reads "On" or "Off". Shown when the Action Text boolean is true; colour follows the state-specific foreground token.',
            },
          ].map(({ num, label, desc }) => (
            <div
              key={num}
              style={{
                display: 'flex',
                gap: '10px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#f9fafb',
                border: '1px solid #f3f4f6',
              }}
            >
              <span style={{ fontSize: '16px', lineHeight: 1, flexShrink: 0, marginTop: '1px' }}>
                {num}
              </span>
              <div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                  {label}
                </p>
                <p
                  style={{
                    margin: '3px 0 0',
                    fontSize: '12px',
                    color: '#6b7280',
                    lineHeight: 1.4,
                  }}
                >
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -- 4. VARIANTS ------------------------------------------------- */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Variants</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          Two variant properties combine to 6 concrete variants; an Action Text boolean
          adds an orthogonal toggle.
        </p>

        <div
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '10px',
            overflow: 'hidden',
            marginBottom: '16px',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '13px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#374151',
                    width: '160px',
                  }}
                >
                  Property
                </th>
                <th
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#374151',
                  }}
                >
                  Values
                </th>
                <th
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#374151',
                    width: '120px',
                  }}
                >
                  Default
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { prop: 'state', values: 'Default · Focused · Disabled', def: 'Default' },
                { prop: 'On', values: 'True · False', def: 'False' },
                { prop: 'Action Text', values: 'True · False', def: 'True' },
              ].map(({ prop, values, def }, i) => (
                <tr key={prop} style={{ borderBottom: i < 2 ? '1px solid #f3f4f6' : 'none' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>
                    {prop}
                  </td>
                  <td style={{ padding: '10px 16px', color: '#6b7280' }}>{values}</td>
                  <td style={{ padding: '10px 16px', color: '#374151' }}>
                    <code
                      style={{
                        fontSize: '11px',
                        backgroundColor: '#f3f4f6',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        color: '#6b7280',
                      }}
                    >
                      {def}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual grid — all 6 state × On combinations, action text on */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
          }}
        >
          {STATES.flatMap((s) =>
            [false, true].map((isOn) => (
              <div
                key={`${s}-${isOn}`}
                style={{
                  padding: '20px 24px',
                  borderRadius: '10px',
                  border: '1px solid #f3f4f6',
                  backgroundColor: '#fafafa',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  minHeight: '120px',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#6b7280',
                    letterSpacing: '0.02em',
                  }}
                >
                  {s} · On={isOn ? 'True' : 'False'}
                </p>
                <SwitchLive state={s} on={isOn} actionText={true} />
              </div>
            )),
          )}
        </div>
      </section>

      {/* -- 5. DESIGN TOKENS -------------------------------------------- */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Design Tokens</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          Tokens used across every Switch variant. Swatches repaint to match the active brand.
        </p>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '13px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#374151',
                    width: '240px',
                  }}
                >
                  Role
                </th>
                <th
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#374151',
                  }}
                >
                  Token
                </th>
                <th
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#374151',
                    width: '100px',
                  }}
                >
                  Value
                </th>
                <th
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#374151',
                    width: '52px',
                  }}
                >
                  Swatch
                </th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_TABLE_ROWS.map((row, i) => {
                const resolvedValue =
                  tokens[row.tokenKey as keyof typeof tokens] ?? '\u2014';
                return (
                  <tr
                    key={row.role}
                    style={{
                      borderBottom:
                        i < TOKEN_TABLE_ROWS.length - 1 ? '1px solid #f3f4f6' : 'none',
                      borderLeft: '3px solid #3b82f6',
                    }}
                  >
                    <td style={{ padding: '10px 16px', color: '#374151', fontWeight: 600 }}>
                      {row.role}
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <code
                        style={{
                          fontSize: '11px',
                          backgroundColor: '#f3f4f6',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          color: '#6b7280',
                        }}
                      >
                        {row.cssVar}
                      </code>
                    </td>
                    <td
                      style={{
                        padding: '10px 16px',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        color: '#6b7280',
                      }}
                    >
                      {resolvedValue.slice(0, 9)}
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      {(resolvedValue.startsWith('#') || resolvedValue.startsWith('rgb')) && (
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '4px',
                            backgroundColor: resolvedValue,
                            border: '1px solid rgba(0,0,0,0.08)',
                          }}
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* -- 6. ACCESSIBILITY ------------------------------------------- */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Accessibility</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          Guidance for implementing inclusive toggles.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {A11Y_ROWS.map(({ icon, title, body }) => (
            <div
              key={title}
              style={{
                display: 'flex',
                gap: '14px',
                padding: '16px',
                borderRadius: '10px',
                border: '1px solid #f3f4f6',
                backgroundColor: '#fafafa',
              }}
            >
              <span
                style={{ fontSize: '18px', lineHeight: 1, flexShrink: 0, marginTop: '2px' }}
              >
                {icon}
              </span>
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                  {title}
                </p>
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: '13px',
                    color: '#6b7280',
                    lineHeight: 1.5,
                  }}
                >
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -- 7. USAGE ---------------------------------------------------- */}
      <section style={{ paddingBottom: '40px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>Usage</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          When to reach for each state and when to enable Action Text.
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '16px',
          }}
        >
          {USAGE_ROWS.map(({ title, body }) => (
            <div
              key={title}
              style={{
                padding: '14px 16px',
                borderRadius: '10px',
                border: '1px solid #f3f4f6',
                backgroundColor: '#fafafa',
              }}
            >
              <p
                style={{
                  margin: '0 0 4px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#111827',
                }}
              >
                {title}
              </p>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#6b7280', lineHeight: 1.5 }}>
                {body}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              border: '1px solid #bbf7d0',
              backgroundColor: '#f0fdf4',
            }}
          >
            <p
              style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}
            >
              Do
            </p>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: 'none',
                fontSize: '12.5px',
                color: '#15803d',
                lineHeight: 1.5,
              }}
            >
              <li style={{ marginBottom: '6px' }}>
                Use Switch for on/off settings that apply immediately
              </li>
              <li style={{ marginBottom: '6px' }}>
                Name the setting in the row label ("Email notifications"), not just "On/Off"
              </li>
              <li>Reflect the state change instantly — no separate Save step</li>
            </ul>
          </div>
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              border: '1px solid #fecaca',
              backgroundColor: '#fef2f2',
            }}
          >
            <p
              style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}
            >
              Don't
            </p>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: 'none',
                fontSize: '12.5px',
                color: '#b91c1c',
                lineHeight: 1.5,
              }}
            >
              <li style={{ marginBottom: '6px' }}>
                Don't use Switch for choices that require a submit action — use Checkbox instead
              </li>
              <li style={{ marginBottom: '6px' }}>
                Don't use Switch for mutually exclusive options — use Radio Group
              </li>
              <li>
                Don't rely on the thumb position alone — ensure the label describes what is toggled
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
