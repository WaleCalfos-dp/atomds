import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ButtonGroupLive,
  type ButtonGroupDirection,
  type ButtonGroupType,
  type ButtonGroupBackground,
} from '../components/button-group/ButtonGroupLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

interface ButtonGroupPageProps {
  brand: Brand;
}

// ─── Design-token rows ────────────────────────────────────────────────────────
const TOKEN_TABLE_ROWS: { label: string; key: string; cssVar: string }[] = [
  { label: 'Primary bg',      key: 'atom.background.primary.bg-primary-default',    cssVar: '--atom-background-primary-bg-primary-default' },
  { label: 'Primary fg',      key: 'atom.foreground.primary.fg-brand-primary-inverse', cssVar: '--atom-foreground-primary-fg-brand-primary-inverse' },
  { label: 'Secondary stroke',key: 'atom.border.default.border-default-brand',      cssVar: '--atom-border-default-border-default-brand' },
  { label: 'Surface',         key: 'atom.background.primary.bg-primary-inverse',    cssVar: '--atom-background-primary-bg-primary-inverse' },
  { label: 'Panel (fill=Yes)',key: 'atom.background.core.bg-muted',                 cssVar: '--atom-background-core-bg-muted' },
];

// ─── A11y rows ────────────────────────────────────────────────────────────────
const A11Y_ROWS = [
  {
    icon: '👥',
    title: 'Group role',
    body: 'Wrap the cluster in role="group" with an aria-label describing the group\'s purpose (e.g. "Confirm or cancel"). Screen readers then announce the group boundaries.',
  },
  {
    icon: '⌨️',
    title: 'Keyboard order',
    body: 'Buttons are reached with Tab in reading order: Primary first in General / Sticky Bottom, Primary last (right) in Toast. Enter or Space activates the focused button.',
  },
  {
    icon: '🎯',
    title: 'Clear primary action',
    body: 'Exactly one button in the group is rendered as Primary (filled). Secondary actions use the outline style. Never render two filled buttons in the same group.',
  },
  {
    icon: '📱',
    title: 'Safe-area on Sticky Bottom',
    body: 'Sticky Bottom groups include 50px of bottom padding to clear iOS / Android home-indicator zones. Do not remove it or tap targets become unreachable on device.',
  },
  {
    icon: '🎨',
    title: 'Contrast & focus',
    body: 'Primary uses #0A2333/white (16.9:1), Secondary uses stroke + dark text on white (16.9:1). Focus outlines are handled by the underlying Button component.',
  },
];

// ─── Usage copy ───────────────────────────────────────────────────────────────
const WHEN_TO_USE = [
  'Confirm or cancel a destructive action (pair Primary + Secondary).',
  'Close a toast or modal with an optional accept + dismiss.',
  'Sticky footer for multi-step flows where the user commits / goes back.',
  'eSIM or plan-purchase screens: summary info + primary CTA.',
];
const WHEN_NOT_TO_USE = [
  'Single selection from 3+ options — use Tabs or Segmented Control instead.',
  'Navigation within a single page — use a link, not two buttons.',
  'Where only one action exists — render a standalone Full Button.',
  'Dense toolbars with 4+ actions — use an Icon Only Button Group or Menu.',
];

// ─── Visual helpers ───────────────────────────────────────────────────────────
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

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

const DIRECTIONS: ButtonGroupDirection[] = ['Horizontal', 'Vertical', 'Button Right'];
const TYPES: ButtonGroupType[] = ['General', 'Sticky Bottom', 'Sticky Bottom - eSIM', 'Toast'];
const BACKGROUNDS: ButtonGroupBackground[] = ['No', 'Yes'];

// Variants grid — every combination that exists in the Figma set.
const VARIANT_GRID: { direction: ButtonGroupDirection; type: ButtonGroupType; background: ButtonGroupBackground }[] = [
  { direction: 'Horizontal',    type: 'General',              background: 'No'  },
  { direction: 'Vertical',      type: 'General',              background: 'No'  },
  { direction: 'Horizontal',    type: 'Sticky Bottom',        background: 'No'  },
  { direction: 'Horizontal',    type: 'Sticky Bottom',        background: 'Yes' },
  { direction: 'Vertical',      type: 'Sticky Bottom',        background: 'No'  },
  { direction: 'Vertical',      type: 'Sticky Bottom',        background: 'Yes' },
  { direction: 'Horizontal',    type: 'Sticky Bottom - eSIM', background: 'No'  },
  { direction: 'Horizontal',    type: 'Sticky Bottom - eSIM', background: 'Yes' },
  { direction: 'Vertical',      type: 'Sticky Bottom - eSIM', background: 'No'  },
  { direction: 'Vertical',      type: 'Sticky Bottom - eSIM', background: 'Yes' },
  { direction: 'Horizontal',    type: 'Toast',                background: 'No'  },
  { direction: 'Horizontal',    type: 'Toast',                background: 'Yes' },
  { direction: 'Vertical',      type: 'Toast',                background: 'No'  },
  { direction: 'Vertical',      type: 'Toast',                background: 'Yes' },
  { direction: 'Button Right',  type: 'Sticky Bottom',        background: 'Yes' },
];

export function ButtonGroupPage({ brand }: ButtonGroupPageProps) {
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  const [direction, setDirection] = useState<ButtonGroupDirection>('Horizontal');
  const [groupType, setGroupType] = useState<ButtonGroupType>('General');
  const [background, setBackground] = useState<ButtonGroupBackground>('No');

  const previewKey = `${direction}-${groupType}-${background}`;

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-72">
            {/* Left canvas */}
            <div
              className="flex-1 flex items-center justify-center p-12 min-h-52"
              style={DOTTED_BG}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                >
                  <ButtonGroupLive
                    direction={direction}
                    groupType={groupType}
                    background={background}
                    brand={brand}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right controls */}
            <div
              style={{
                width: '224px',
                flexShrink: 0,
                borderLeft: '1px solid #e5e7eb',
                backgroundColor: '#fff',
                padding: '20px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div>
                <p style={LABEL_STYLE}>Direction</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  {DIRECTIONS.map((d) => (
                    <SegBtn key={d} active={direction === d} onClick={() => setDirection(d)}>{d}</SegBtn>
                  ))}
                </div>
              </div>
              <div>
                <p style={LABEL_STYLE}>Type</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                  {TYPES.map((t) => (
                    <SegBtn key={t} active={groupType === t} onClick={() => setGroupType(t)}>{t}</SegBtn>
                  ))}
                </div>
              </div>
              <div>
                <p style={LABEL_STYLE}>Background Fill</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  {BACKGROUNDS.map((b) => (
                    <SegBtn key={b} active={background === b} onClick={() => setBackground(b)}>{b}</SegBtn>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ────────────────────────────────────────────────── */}
      <section>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Button Group</h1>
        <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: 1.6, margin: '0 0 16px', maxWidth: '640px' }}>
          Two related actions rendered as a tightly-coupled pair: one Primary + one Secondary. Use for confirm/cancel patterns, toast footers, and sticky-bottom CTA zones on mobile screens.
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: '6px',
            border: '1px solid #bfdbfe', fontSize: '13px', color: '#1d4ed8',
            backgroundColor: '#eff6ff', fontFamily: 'system-ui, -apple-system, sans-serif',
          }}>
            Feedback
          </span>
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

      <hr className="border-slate-200" />

      {/* ── 3. ANATOMY ───────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Anatomy</h2>
        <p className="text-sm text-slate-500 mb-5">A Button Group is a container plus exactly two actions. Layout, padding, and surface colour are driven by Type + Direction.</p>

        <div className="relative flex items-center justify-center py-16 px-8 rounded-xl" style={DOTTED_BG}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <ButtonGroupLive direction="Horizontal" groupType="Sticky Bottom" background="Yes" brand={brand} />

            {/* 1 Container — pointer from below, centered */}
            <div className="absolute pointer-events-none" style={{ bottom: '-42px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="w-px bg-slate-400" style={{ height: '32px' }} />
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">1</span>
            </div>
            {/* 2 Primary button — pointer from above, left third */}
            <div className="absolute pointer-events-none" style={{ top: '-42px', left: '28%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">2</span>
              <div className="w-px bg-slate-400" style={{ height: '32px' }} />
            </div>
            {/* 3 Gap — pointer from above, center */}
            <div className="absolute pointer-events-none" style={{ top: '-42px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">3</span>
              <div className="w-px bg-slate-400" style={{ height: '32px' }} />
            </div>
            {/* 4 Secondary button — pointer from above, right third */}
            <div className="absolute pointer-events-none" style={{ top: '-42px', left: '72%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">4</span>
              <div className="w-px bg-slate-400" style={{ height: '32px' }} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {[
            { num: '1', name: 'Container',         desc: 'Surface + padding. Background fill = Yes applies the muted panel token; Sticky-Bottom types add a top hairline and 50px bottom safe-area.' },
            { num: '2', name: 'Primary action',    desc: 'Filled pill (Full Button Small, 52px). One per group — this is the commit action.' },
            { num: '3', name: 'Gap',               desc: '16px fixed gap between buttons — never touches, never stretches.' },
            { num: '4', name: 'Secondary action',  desc: 'Outline pill (stroke = border-default-brand, 52px). Cancel or alternative action.' },
          ].map((row) => (
            <div key={row.num} style={{ display: 'flex', gap: '10px', padding: '12px', borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827', flexShrink: 0, marginTop: '1px', minWidth: '12px' }}>{row.num}</span>
              <div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#111827' }}>{row.name}</p>
                <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#6b7280', lineHeight: 1.4 }}>{row.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. VARIANTS ──────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-4">Variants</h2>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">Property</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Values</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">Direction</td>
                <td className="px-5 py-3.5 text-slate-500 text-sm">Horizontal · Vertical · Button Right</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">Type</td>
                <td className="px-5 py-3.5 text-slate-500 text-sm">General · Sticky Bottom · Sticky Bottom - eSIM · Toast</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">Background Fill</td>
                <td className="px-5 py-3.5 text-slate-500 text-sm">Yes · No</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Visual variants grid — every Figma permutation */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {VARIANT_GRID.map((v) => {
            const title = `${v.direction} · ${v.type} · fill=${v.background}`;
            return (
              <div key={title} style={{ padding: '16px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
                <p style={{ margin: '0 0 10px', fontSize: '11px', fontWeight: 600, color: '#6b7280' }}>{title}</p>
                <div style={{ ...DOTTED_BG, padding: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '120px', overflow: 'hidden' }}>
                  <div style={{ transform: 'scale(0.7)', transformOrigin: 'center' }}>
                    <ButtonGroupLive direction={v.direction} groupType={v.type} background={v.background} brand={brand} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Design Tokens</h2>
        <p className="text-sm text-slate-500 mb-4">
          Button Group itself owns container-level tokens. The Primary and Secondary pills inherit their state tokens from the Button component.
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">Token</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">CSS Variable</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">Value ({brand})</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_TABLE_ROWS.map((row, i) => {
                const rawValue = (tokens[row.key as keyof typeof tokens] as string) ?? '—';
                const swatchHex = rawValue.length > 7 ? rawValue.slice(0, 7) : rawValue;
                const light = isLightColor(swatchHex);
                return (
                  <tr key={row.cssVar} className={i < TOKEN_TABLE_ROWS.length - 1 ? 'border-b border-slate-100' : ''}>
                    <td className="px-5 py-3 font-medium text-slate-700 text-xs">{row.label}</td>
                    <td className="px-5 py-3">
                      <code className="font-mono text-xs text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                        {row.cssVar}
                      </code>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-5 h-5 rounded flex-shrink-0 border border-black/10"
                          style={{ backgroundColor: swatchHex }}
                        />
                        <span
                          className="font-mono text-xs px-1.5 py-0.5 rounded border"
                          style={{
                            backgroundColor: swatchHex,
                            color: light ? '#1e293b' : '#f8fafc',
                            borderColor: light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)',
                          }}
                        >
                          {swatchHex.toUpperCase()}
                        </span>
                      </div>
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
        <p className="text-sm text-slate-500 mb-4">
          Guidelines for implementing Button Group in an inclusive way.
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm divide-y divide-slate-100">
          {A11Y_ROWS.map((row, i) => (
            <div
              key={row.title}
              className={['flex items-start gap-4 px-5 py-4', i % 2 === 1 ? 'bg-slate-50/50' : ''].join(' ')}
            >
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
          When and how to use the Button Group component.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>✓ When to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              {WHEN_TO_USE.map((line) => <li key={line} style={{ marginBottom: '6px' }}>• {line}</li>)}
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>✗ When not to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              {WHEN_NOT_TO_USE.map((line) => <li key={line} style={{ marginBottom: '6px' }}>• {line}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
