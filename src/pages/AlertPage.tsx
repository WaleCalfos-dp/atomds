import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertLive, type AlertType, type AlertOption } from '../components/alert/AlertLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

interface AlertPageProps {
  brand: Brand;
}

// ─── Design token rows ────────────────────────────────────────────────────────
const TOKEN_TABLE_ROWS: { label: string; key: string; cssVar: string; types: AlertType[] }[] = [
  { label: 'Info bg',        key: 'atom.background.alert.bg-info-lightest',          cssVar: '--atom-background-alert-bg-info-lightest',          types: ['Information'] },
  { label: 'Info border',    key: 'atom.border.feedback.border-info',                cssVar: '--atom-border-feedback-border-info',                types: ['Information'] },
  { label: 'Info icon',      key: 'atom.foreground.feedback.fg-info',                cssVar: '--atom-foreground-feedback-fg-info',                types: ['Information'] },
  { label: 'Success bg',     key: 'atom.background.alert.bg-success-lightest',       cssVar: '--atom-background-alert-bg-success-lightest',       types: ['Success'] },
  { label: 'Success border', key: 'atom.border.feedback.success-border-color',       cssVar: '--atom-border-feedback-success-border-color',       types: ['Success'] },
  { label: 'Success icon',   key: 'atom.foreground.feedback.fg-success',             cssVar: '--atom-foreground-feedback-fg-success',             types: ['Success'] },
  { label: 'Warning bg',     key: 'atom.background.alert.bg-warning-lightest',       cssVar: '--atom-background-alert-bg-warning-lightest',       types: ['Warning'] },
  { label: 'Warning border', key: 'atom.border.feedback.border-warning',             cssVar: '--atom-border-feedback-border-warning',             types: ['Warning'] },
  { label: 'Warning icon',   key: 'atom.foreground.feedback.fg-warning',             cssVar: '--atom-foreground-feedback-fg-warning',             types: ['Warning'] },
  { label: 'Error bg',       key: 'atom.background.alert.bg-error-lightest',         cssVar: '--atom-background-alert-bg-error-lightest',         types: ['Error'] },
  { label: 'Error border',   key: 'atom.border.feedback.border-error',               cssVar: '--atom-border-feedback-border-error',               types: ['Error'] },
  { label: 'Error icon',     key: 'atom.foreground.feedback.fg-error',               cssVar: '--atom-foreground-feedback-fg-error',               types: ['Error'] },
  { label: 'Muted bg',       key: 'atom.background.core.bg-muted',                   cssVar: '--atom-background-core-bg-muted',                   types: ['Muted'] },
  { label: 'Muted border',   key: 'atom.border.default.border-default',              cssVar: '--atom-border-default-border-default',              types: ['Muted'] },
  { label: 'Body text',      key: 'atom.foreground.core.fg-primary',                 cssVar: '--atom-foreground-core-fg-primary',                 types: ['Information', 'Success', 'Warning', 'Error', 'Muted'] },
  { label: 'Secondary text', key: 'atom.foreground.core.fg-secondary',               cssVar: '--atom-foreground-core-fg-secondary',               types: ['Information', 'Success', 'Warning', 'Error', 'Muted'] },
];

// Dotted canvas background
const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// Type indicator colors
const TYPE_COLORS: Record<AlertType, { bg: string; border: string }> = {
  Information: { bg: '#dbeafe', border: '#3b82f6' },
  Success:     { bg: '#dcfce7', border: '#22c55e' },
  Warning:     { bg: '#fef9c3', border: '#eab308' },
  Error:       { bg: '#fee2e2', border: '#ef4444' },
  Muted:       { bg: '#f1f5f9', border: '#94a3b8' },
};

// ─── Reusable SegBtn (segmented button for boolean toggles) ──────────────────
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

// Accessibility rows
const A11Y_ROWS = [
  {
    icon: '🔔',
    title: 'ARIA role="alert"',
    body: 'The Alert container carries role="alert", which triggers an immediate announcement in screen readers when the component is rendered or updated. For non-urgent messages, prefer role="status" to avoid interrupting the user.',
  },
  {
    icon: '🎨',
    title: 'Color contrast',
    body: 'Title and description text meet WCAG AA 4.5:1 against their respective lightest-tint backgrounds across all 6 brands. Icon colors are decorative reinforcement — text carries the primary meaning.',
  },
  {
    icon: '🔤',
    title: "Don't rely on color alone",
    body: 'Each alert type pairs a semantic icon with the colored border/background. A visible title is required — never communicate severity purely through background color.',
  },
  {
    icon: '⌨️',
    title: 'Keyboard interaction',
    body: 'The Dismiss button is the only interactive element and receives standard focus via Tab. It must have an accessible label (aria-label="Dismiss alert"). Pressing Escape should also trigger dismissal when the alert is focused.',
  },
  {
    icon: '📢',
    title: 'Live region timing',
    body: 'Alerts injected dynamically into the DOM are announced automatically via role="alert". Avoid mounting hidden alerts in the DOM before revealing them — inject the node only when it should be announced.',
  },
];

export function AlertPage({ brand }: AlertPageProps) {
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  // Interactive preview state
  const [type, setType] = useState<AlertType>('Information');
  const [option, setOption] = useState<AlertOption>('Top Border');
  const [title, setTitle] = useState('Alert title');
  const [description, setDescription] = useState('This is a brief description that provides additional context.');
  const [showIcon, setShowIcon] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const [showDismiss, setShowDismiss] = useState(true);

  const alertKey = `${type}-${option}-${title}-${description}-${showIcon}-${showButton}-${showTitle}-${showDescription}-${showDismiss}`;
  const TYPES: AlertType[] = ['Information', 'Success', 'Warning', 'Error', 'Muted'];
  const OPTIONS: AlertOption[] = ['Top Border', 'Full Border'];

  // Active token keys for current type
  const activeTokenKeys = TOKEN_TABLE_ROWS
    .filter(r => r.types.includes(type))
    .map(r => r.key);

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ─────────────────────────────────────────────── */}
      <section>
        <div
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#fff',
          }}
        >
          {/* Canvas + Controls row */}
          <div style={{ display: 'flex', minHeight: '280px' }}>

            {/* Canvas */}
            <div
              style={{
                flex: 1,
                ...DOTTED_BG,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px 40px',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={alertKey}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  style={{ width: '100%', maxWidth: '480px' }}
                >
                  <AlertLive
                    type={type}
                    option={option}
                    title={title}
                    description={description}
                    showIcon={showIcon}
                    showButton={showButton}
                    showTitle={showTitle}
                    showDescription={showDescription}
                    showDismiss={showDismiss}
                    brand={brand}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls panel */}
            <div
              style={{
                width: '224px',
                flexShrink: 0,
                borderLeft: '1px solid #e5e7eb',
                backgroundColor: '#fff',
                padding: '20px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
              }}
            >
              {/* Type */}
              <div>
                <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Type
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {TYPES.map(t => {
                    const isActive = type === t;
                    const col = TYPE_COLORS[t];
                    return (
                      <button
                        key={t}
                        onClick={() => setType(t)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '7px',
                          padding: '5px 8px',
                          borderRadius: '6px',
                          border: isActive ? `1px solid ${col.border}` : '1px solid transparent',
                          backgroundColor: isActive ? col.bg : 'transparent',
                          color: '#374151',
                          fontSize: '12.5px',
                          fontWeight: isActive ? 600 : 400,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.1s ease',
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                        }}
                      >
                        <span style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: col.border,
                          flexShrink: 0,
                        }} />
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Option */}
              <div>
                <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Option
                </p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  {OPTIONS.map(o => (
                    <button
                      key={o}
                      onClick={() => setOption(o)}
                      style={{
                        flex: 1,
                        padding: '5px 4px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: option === o ? '#fff' : 'transparent',
                        color: option === o ? '#111827' : '#6b7280',
                        fontSize: '11px',
                        fontWeight: option === o ? 600 : 400,
                        cursor: 'pointer',
                        boxShadow: option === o ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                        transition: 'all 0.15s ease',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Text */}
              <div>
                <p style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Title Text
                </p>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    fontSize: '12.5px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    color: '#374151',
                  }}
                />
              </div>

              {/* Description Text */}
              <div>
                <p style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Description Text
                </p>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    fontSize: '12.5px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    color: '#374151',
                    resize: 'vertical',
                    lineHeight: 1.4,
                  }}
                />
              </div>

              {/* Icon */}
              <div>
                <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Icon
                </p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  <SegBtn active={showIcon} onClick={() => setShowIcon(true)}>Show</SegBtn>
                  <SegBtn active={!showIcon} onClick={() => setShowIcon(false)}>Hide</SegBtn>
                </div>
              </div>

              {/* Button */}
              <div>
                <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Button
                </p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  <SegBtn active={showButton} onClick={() => setShowButton(true)}>Show</SegBtn>
                  <SegBtn active={!showButton} onClick={() => setShowButton(false)}>Hide</SegBtn>
                </div>
              </div>

              {/* Title visibility */}
              <div>
                <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Title
                </p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  <SegBtn active={showTitle} onClick={() => setShowTitle(true)}>Show</SegBtn>
                  <SegBtn active={!showTitle} onClick={() => setShowTitle(false)}>Hide</SegBtn>
                </div>
              </div>

              {/* Description visibility */}
              <div>
                <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Description
                </p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  <SegBtn active={showDescription} onClick={() => setShowDescription(true)}>Show</SegBtn>
                  <SegBtn active={!showDescription} onClick={() => setShowDescription(false)}>Hide</SegBtn>
                </div>
              </div>

              {/* Close Icon */}
              <div>
                <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Close Icon
                </p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  <SegBtn active={showDismiss} onClick={() => setShowDismiss(true)}>Show</SegBtn>
                  <SegBtn active={!showDismiss} onClick={() => setShowDismiss(false)}>Hide</SegBtn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ─────────────────────────────────────────────────── */}
      <section>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
          Alert
        </h1>
        <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: 1.6, margin: '0 0 16px', maxWidth: '640px' }}>
          Communicates important messages to the user — feedback, warnings, errors, or neutral notices.
          Supports five semantic types and two border styles, all driven by brand tokens.
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
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
            Stable
          </span>
        </div>
      </section>

      {/* ── 3. ANATOMY ────────────────────────────────────────────────────────── */}
      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
          Anatomy
        </h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px' }}>
          Parts of the Alert component and their roles.
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
          }}
        >
          <div style={{ width: '100%', maxWidth: '480px' }}>
            <AlertLive
              type="Information"
              option="Top Border"
              title="Alert title"
              description="Brief description with additional context."
              showIcon={true}
              showDismiss={true}
              brand={brand}
            />
          </div>

          {/* Callout: 1 Container — line goes up from below alert */}
          <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '1px', height: '32px', backgroundColor: '#94a3b8' }} />
            <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#1e293b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, boxShadow: '0 1px 3px rgba(0,0,0,0.3)', flexShrink: 0 }}>1</span>
          </div>
          {/* Callout: 2 Leading icon — measured at 24% */}
          <div style={{ position: 'absolute', top: '16px', left: '24%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#1e293b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, boxShadow: '0 1px 3px rgba(0,0,0,0.3)', flexShrink: 0 }}>2</span>
            <div style={{ width: '1px', height: '32px', backgroundColor: '#94a3b8' }} />
          </div>
          {/* Callout: 3 Title — over title text start area ~35% */}
          <div style={{ position: 'absolute', top: '16px', left: '35%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#1e293b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, boxShadow: '0 1px 3px rgba(0,0,0,0.3)', flexShrink: 0 }}>3</span>
            <div style={{ width: '1px', height: '32px', backgroundColor: '#94a3b8' }} />
          </div>
          {/* Callout: 4 Description — over description area ~50% */}
          <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#1e293b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, boxShadow: '0 1px 3px rgba(0,0,0,0.3)', flexShrink: 0 }}>4</span>
            <div style={{ width: '1px', height: '32px', backgroundColor: '#94a3b8' }} />
          </div>
          {/* Callout: 5 Dismiss button — measured at 76% */}
          <div style={{ position: 'absolute', top: '16px', left: '76%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#1e293b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, boxShadow: '0 1px 3px rgba(0,0,0,0.3)', flexShrink: 0 }}>5</span>
            <div style={{ width: '1px', height: '32px', backgroundColor: '#94a3b8' }} />
          </div>
        </div>

        {/* Anatomy legend */}
        <div
          style={{
            marginTop: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
          }}
        >
          {[
            { num: '1', label: 'Container', desc: 'Carries the background tint and border (top or full) that signals the semantic type.' },
            { num: '2', label: 'Leading icon', desc: 'Semantic icon coloured with the feedback foreground token. Toggle via showIcon prop.' },
            { num: '3', label: 'Title', desc: 'Required. Bold text summarising the message. Never omit — screen readers rely on it.' },
            { num: '4', label: 'Description', desc: 'Optional supporting copy. Uses secondary foreground token for visual hierarchy.' },
            { num: '5', label: 'Dismiss button', desc: 'Optional close control. Must carry aria-label="Dismiss alert". Not focusable when hidden.' },
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
              <span style={{ fontSize: '16px', lineHeight: 1, flexShrink: 0, marginTop: '1px' }}>{num}</span>
              <div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#111827' }}>{label}</p>
                <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#6b7280', lineHeight: 1.4 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. VARIANTS ──────────────────────────────────────────────────────── */}
      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
          Variants
        </h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>Available property combinations for the Alert component.</p>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '140px' }}>Property</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Values</th>
              </tr>
            </thead>
            <tbody>
              {[
                { prop: 'Type', values: 'Information · Success · Warning · Error · Muted' },
                { prop: 'Option', values: 'Top Border · Full Border' },
                { prop: 'Icon', values: 'boolean (default true)' },
                { prop: 'Button', values: 'boolean (default false)' },
                { prop: 'Title', values: 'boolean (default true)' },
                { prop: 'Description', values: 'boolean (default true)' },
                { prop: 'Close Icon', values: 'boolean (default true)' },
              ].map(({ prop, values }, i, arr) => (
                <tr key={prop} style={{ borderBottom: i < arr.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>{prop}</td>
                  <td style={{ padding: '10px 16px', color: '#6b7280' }}>{values}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual preview of all types */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          {(['Information', 'Success', 'Warning', 'Error', 'Muted'] as AlertType[]).map(t => (
            <AlertLive key={t} type={t} option="Top Border" brand={brand} />
          ))}
        </div>

        {/* Border option comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {(['Top Border', 'Full Border'] as AlertOption[]).map(o => (
            <div key={o} style={{ padding: '20px 24px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>{o}</p>
              <AlertLive type="Information" option={o} brand={brand} />
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────────── */}
      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
          Design tokens
        </h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          Active tokens for the selected type ({type}) are highlighted. Switch the Type control above to inspect other states.
        </p>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '130px' }}>Role</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Token</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '100px' }}>Value</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '52px' }}>Swatch</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_TABLE_ROWS.map((row, i) => {
                const isActive = activeTokenKeys.includes(row.key);
                const resolvedValue = tokens[row.key as keyof typeof tokens] ?? '—';
                return (
                  <tr
                    key={row.key}
                    style={{
                      borderBottom: i < TOKEN_TABLE_ROWS.length - 1 ? '1px solid #f3f4f6' : 'none',
                      opacity: isActive ? 1 : 0.4,
                      transition: 'opacity 0.2s ease',
                      ...(isActive ? { borderLeft: '3px solid #3b82f6' } : { borderLeft: '3px solid transparent' }),
                    }}
                  >
                    <td style={{ padding: '10px 16px', color: '#374151', fontWeight: isActive ? 600 : 400 }}>{row.label}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <code style={{ fontSize: '11px', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', color: '#6b7280' }}>
                        {row.cssVar}
                      </code>
                    </td>
                    <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: '12px', color: '#6b7280' }}>
                      {typeof resolvedValue === 'string' ? resolvedValue.slice(0, 9) : '—'}
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      {typeof resolvedValue === 'string' && resolvedValue.startsWith('#') && (
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                          backgroundColor: resolvedValue,
                          border: '1px solid rgba(0,0,0,0.08)',
                        }} />
                      )}
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
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
          Accessibility
        </h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          Guidance for building inclusive experiences with the Alert component.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {A11Y_ROWS.map(({ icon, title: t, body }) => (
            <div
              key={t}
              style={{
                display: 'flex',
                gap: '14px',
                padding: '16px',
                borderRadius: '10px',
                border: '1px solid #f3f4f6',
                backgroundColor: '#fafafa',
              }}
            >
              <span style={{ fontSize: '18px', lineHeight: 1, flexShrink: 0, marginTop: '2px' }}>{icon}</span>
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#111827' }}>{t}</p>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280', lineHeight: 1.5 }}>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. USAGE ─────────────────────────────────────────────────────────── */}
      <section style={{ paddingBottom: '40px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>
          Usage
        </h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          When and how to use each alert type.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {[
            { type: 'Information' as AlertType, when: 'Neutral guidance, tips, or contextual help that doesn\'t require immediate action.' },
            { type: 'Success' as AlertType, when: 'Confirm a completed action — form submitted, data saved, payment processed.' },
            { type: 'Warning' as AlertType, when: 'The user can still proceed but should be aware of a potential issue or consequence.' },
            { type: 'Error' as AlertType, when: 'An action failed or the user must resolve a blocking problem before continuing.' },
            { type: 'Muted' as AlertType, when: 'Low-emphasis notices that don\'t require semantic colour — system announcements, info bars.' },
          ].map(({ type: t, when }) => (
            <div
              key={t}
              style={{
                padding: '14px 16px',
                borderRadius: '10px',
                border: '1px solid #f3f4f6',
                backgroundColor: '#fafafa',
              }}
            >
              <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#111827' }}>{t}</p>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#6b7280', lineHeight: 1.4 }}>{when}</p>
            </div>
          ))}
          {/* Do / Don't */}
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>✓ Do</p>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>Keep alert text concise. Use Title for the main message and Description only when extra context genuinely helps.</p>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>✗ Don't</p>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>Don't stack multiple alerts of the same type in sequence — consolidate into one message or use a list inside the description.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
