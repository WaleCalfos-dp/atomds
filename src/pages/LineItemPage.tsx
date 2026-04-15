import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineItemLive,
  type LineItemType,
  type LineItemMode,
  type LineItemWeight,
} from '../components/line-item/LineItemLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

interface LineItemPageProps {
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

const ALL_TYPES: LineItemType[] = ['General Text', 'Country', 'Flight', 'Country + Description'];
const ALL_MODES: LineItemMode[] = ['Light', 'Dark'];
const ALL_WEIGHTS: LineItemWeight[] = ['Regular', 'Bold'];

type TokenRow = {
  key: string;
  tokenKey: string;
  label: string;
  cssVar: string;
};

const TOKEN_ROWS: TokenRow[] = [
  { key: 'title',       tokenKey: 'atom.foreground.primary.fg-brand-primary',         label: 'Title foreground',          cssVar: '--atom-foreground-primary-fg-brand-primary' },
  { key: 'subtitle',    tokenKey: 'atom.foreground.core.fg-primary',                  label: 'Subtitle foreground',       cssVar: '--atom-foreground-core-fg-primary' },
  { key: 'secondary',   tokenKey: 'atom.foreground.core.fg-secondary',                label: 'Secondary text',            cssVar: '--atom-foreground-core-fg-secondary' },
  { key: 'inverse',     tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse',  label: 'Inverse foreground (Dark)', cssVar: '--atom-foreground-primary-fg-brand-primary-inverse' },
  { key: 'muted-bg',    tokenKey: 'atom.background.core.bg-muted',                    label: 'Icon bg (Flight)',          cssVar: '--atom-background-core-bg-muted' },
];

const A11Y_ROWS = [
  {
    icon: '\u2630',
    title: 'Semantic list markup',
    body: 'Wrap line items in a <ul> or <ol> with each item as an <li>. This gives screen readers the total count and position of each entry (e.g. "item 3 of 5").',
  },
  {
    icon: '\u2328',
    title: 'Keyboard navigable',
    body: 'Ensure interactive line items (with checkboxes or switches) are reachable via Tab and operable via Space or Enter. Use proper focus indicators.',
  },
  {
    icon: '\u2261',
    title: 'Logical reading order',
    body: 'DOM order should match visual order: icon first, then title, then subtitle. Screen readers follow source order, not visual layout.',
  },
  {
    icon: '\u25CE',
    title: 'Sufficient contrast',
    body: 'In Dark mode, ensure text on dark backgrounds meets WCAG AA 4.5:1 contrast ratio. The inverse token (#fff on brand-primary) satisfies this for all brands.',
  },
];

export function LineItemPage({ brand }: LineItemPageProps) {
  const [itemType, setItemType] = useState<LineItemType>('General Text');
  const [mode, setMode] = useState<LineItemMode>('Light');
  const [weight, setWeight] = useState<LineItemWeight>('Regular');
  const [showIcon, setShowIcon] = useState(true);
  const [titleText, setTitleText] = useState('Title');
  const [subtitleText, setSubtitleText] = useState('Subtitle text');

  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];
  const previewKey = `${itemType}-${mode}-${weight}-${showIcon}-${titleText}-${subtitleText}`;

  const isDarkPreview = mode === 'Dark';
  const canvasBg = isDarkPreview
    ? 'var(--atom-background-primary-bg-primary-default, #0a2333)'
    : undefined;

  return (
    <div className="space-y-10">

      {/* -- 1. INTERACTIVE PREVIEW ------------------------------------------------ */}
      <section>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden', background: '#fff' }}>
          <div style={{ display: 'flex', minHeight: '280px' }}>

            {/* Canvas */}
            <div style={{
              flex: 1,
              ...(isDarkPreview ? {} : DOTTED_BG),
              backgroundColor: canvasBg ?? DOTTED_BG.backgroundColor,
              backgroundImage: isDarkPreview ? 'none' : DOTTED_BG.backgroundImage,
              backgroundSize: isDarkPreview ? undefined : DOTTED_BG.backgroundSize,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px',
            }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ width: '100%', maxWidth: '400px' }}
                >
                  <LineItemLive
                    type={itemType}
                    mode={mode}
                    weight={weight}
                    showIcon={showIcon}
                    titleText={titleText}
                    subtitleText={subtitleText}
                    showTitle={true}
                    showSubtitle={true}
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
              {/* Type selector (stacked) */}
              <div>
                <p style={LABEL_STYLE}>Type</p>
                <div style={{ display: 'flex', flexDirection: 'column', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  {ALL_TYPES.map(t => (
                    <SegBtn key={t} active={itemType === t} onClick={() => setItemType(t)}>{t}</SegBtn>
                  ))}
                </div>
              </div>

              {/* Mode toggle */}
              <div>
                <p style={LABEL_STYLE}>Mode</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  {ALL_MODES.map(m => (
                    <SegBtn key={m} active={mode === m} onClick={() => setMode(m)}>{m}</SegBtn>
                  ))}
                </div>
              </div>

              {/* Weight toggle */}
              <div>
                <p style={LABEL_STYLE}>Weight</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  {ALL_WEIGHTS.map(w => (
                    <SegBtn key={w} active={weight === w} onClick={() => setWeight(w)}>{w}</SegBtn>
                  ))}
                </div>
              </div>

              {/* Icon toggle */}
              <div>
                <p style={LABEL_STYLE}>Icon</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  <SegBtn active={showIcon} onClick={() => setShowIcon(true)}>Show</SegBtn>
                  <SegBtn active={!showIcon} onClick={() => setShowIcon(false)}>Hide</SegBtn>
                </div>
              </div>

              {/* Title input */}
              <div>
                <p style={{ ...LABEL_STYLE, margin: '0 0 6px' }}>Title</p>
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

              {/* Subtitle input */}
              <div>
                <p style={{ ...LABEL_STYLE, margin: '0 0 6px' }}>Subtitle</p>
                <input
                  type="text"
                  value={subtitleText}
                  onChange={e => setSubtitleText(e.target.value)}
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

      {/* -- 2. COMPONENT INFO ----------------------------------------------------- */}
      <section>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Line Item</h1>
        <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: 1.6, margin: '0 0 16px', maxWidth: '640px' }}>
          A list row component used to display entries in lists, menus, and selection surfaces.
          Each row can contain an icon, title, and subtitle arranged horizontally. Supports
          multiple types including General Text, Country, Flight, and Country + Description.
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

      {/* -- 3. ANATOMY ------------------------------------------------------------ */}
      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Anatomy</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px' }}>Parts of the Line Item component and their roles.</p>

        <div style={{
          ...DOTTED_BG, borderRadius: '12px', padding: '64px 48px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
        }}>
          <div style={{ width: '100%', maxWidth: '480px' }}>
            <LineItemLive type="General Text" mode="Light" weight="Regular" showIcon={true} titleText="Title" subtitleText="Subtitle text" showTitle={true} showSubtitle={true} brand={brand} />
          </div>

          {/* Callout 1 -- Icon (top-left) */}
          <div style={{ position: 'absolute', top: '12px', left: '15%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalloutDot num="1" />
            <div style={LINE} />
          </div>

          {/* Callout 2 -- Title (top-center) */}
          <div style={{ position: 'absolute', top: '12px', left: '40%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalloutDot num="2" />
            <div style={LINE} />
          </div>

          {/* Callout 3 -- Subtitle (bottom-center) */}
          <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={LINE} />
            <CalloutDot num="3" />
          </div>
        </div>

        {/* Legend grid: 3-col */}
        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {[
            { num: '1', label: 'Icon', desc: '20x20px container with 16x16px icon. Optional in General Text type; flag in Country types; circular background in Flight type.' },
            { num: '2', label: 'Title', desc: '14px / Poppins Medium (weight 500). The primary label for the row. Color uses fg-brand-primary in Light mode, inverse in Dark mode.' },
            { num: '3', label: 'Subtitle', desc: '14px Regular in General Text (or 12px in Country+Desc / Flight). Secondary information beneath or beside the title.' },
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

      {/* -- 4. VARIANTS ----------------------------------------------------------- */}
      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Variants</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>Available property combinations for the Line Item component.</p>

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
                { prop: 'Type', vals: 'General Text \u00b7 Country \u00b7 Flight \u00b7 Country + Description' },
                { prop: 'Mode', vals: 'Light \u00b7 Dark' },
                { prop: 'Weight', vals: 'Regular \u00b7 Bold' },
                { prop: 'Icon', vals: 'Show \u00b7 Hide (optional toggle)' },
                { prop: 'Title', vals: 'Show \u00b7 Hide (optional toggle)' },
                { prop: 'Subtitle', vals: 'Show \u00b7 Hide (optional toggle)' },
              ].map(({ prop, vals }, i, arr) => (
                <tr key={prop} style={{ borderBottom: i < arr.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>{prop}</td>
                  <td style={{ padding: '10px 16px', color: '#6b7280' }}>{vals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual preview grid: General Text variants */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {/* Light Regular */}
          <div style={{ padding: '20px 24px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
            <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>Light / Regular</p>
            <LineItemLive type="General Text" mode="Light" weight="Regular" showIcon={true} titleText="List item title" subtitleText="Supporting text" showTitle={true} showSubtitle={true} brand={brand} />
          </div>
          {/* Light Bold */}
          <div style={{ padding: '20px 24px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
            <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>Light / Bold</p>
            <LineItemLive type="General Text" mode="Light" weight="Bold" showIcon={true} titleText="List item title" subtitleText="Supporting text" showTitle={true} showSubtitle={true} brand={brand} />
          </div>
          {/* Dark Regular */}
          <div style={{ padding: '20px 24px', borderRadius: '10px', border: '1px solid #334155', backgroundColor: 'var(--atom-background-primary-bg-primary-default, #0a2333)' }}>
            <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>Dark / Regular</p>
            <LineItemLive type="General Text" mode="Dark" weight="Regular" showIcon={true} titleText="List item title" subtitleText="Supporting text" showTitle={true} showSubtitle={true} brand={brand} />
          </div>
          {/* Dark Bold */}
          <div style={{ padding: '20px 24px', borderRadius: '10px', border: '1px solid #334155', backgroundColor: 'var(--atom-background-primary-bg-primary-default, #0a2333)' }}>
            <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>Dark / Bold</p>
            <LineItemLive type="General Text" mode="Dark" weight="Bold" showIcon={true} titleText="List item title" subtitleText="Supporting text" showTitle={true} showSubtitle={true} brand={brand} />
          </div>
        </div>
      </section>

      {/* -- 5. DESIGN TOKENS ------------------------------------------------------ */}
      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Design tokens</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          The Line Item uses foreground and background tokens that update per brand and mode.
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

      {/* -- 6. ACCESSIBILITY ------------------------------------------------------ */}
      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Accessibility</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          Guidance for building inclusive experiences with the Line Item component.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {A11Y_ROWS.map(({ icon, title: t, body }) => (
            <div key={t} style={{
              display: 'flex', gap: '14px', padding: '16px',
              borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa',
            }}>
              <span style={{ fontSize: '18px', lineHeight: 1, flexShrink: 0, marginTop: '2px' }}>{icon}</span>
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#111827' }}>{t}</p>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280', lineHeight: 1.5 }}>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -- 7. USAGE -------------------------------------------------------------- */}
      <section style={{ paddingBottom: '40px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>Usage</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>When and how to use each Line Item type.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          {[
            { t: 'General Text', when: 'Use for standard list rows with a title and optional subtitle -- settings screens, menus, selection lists, or informational entries.' },
            { t: 'Country', when: 'Use when displaying a country selection row with a flag icon and country name -- language or region pickers.' },
            { t: 'Country + Description', when: 'Use when a country row needs additional context below the name -- airport selectors, regional service info, or country detail lists.' },
            { t: 'Flight', when: 'Use for airport or flight-related list rows showing airport name, code, and location with a circular icon container.' },
          ].map(({ t, when }) => (
            <div key={t} style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
              <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#111827' }}>{t}</p>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#6b7280', lineHeight: 1.4 }}>{when}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>Do</p>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              Group line items in semantic list elements. Use consistent types within a single list. Apply Dark mode on dark surfaces and Light mode on light surfaces. Keep titles concise.
            </p>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>Don't</p>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              Don't use Line Item for pricing or shopping cart rows -- it is a list row component, not a price line. Don't mix types within the same list. Don't use Bold weight for long-form content.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
