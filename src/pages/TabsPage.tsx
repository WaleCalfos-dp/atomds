import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TabsLive, type TabsStyle, type TabCount } from '../components/tabs/TabsLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

interface TabsPageProps {
  brand: Brand;
}

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const DARK_DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#1a1a2e',
  backgroundImage: 'radial-gradient(circle, #333355 1px, transparent 1px)',
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

const STYLES: TabsStyle[] = ['Underlined', 'Plain', 'Circular on Light', 'Circular on Dark'];
const COUNTS: TabCount[] = [2, 3, 4, 5, 6, 7];

type TokenRow = {
  key: string;
  tokenKey: string;
  label: string;
  cssVar: string;
};

const TOKEN_ROWS: TokenRow[] = [
  { key: 'active-text',       tokenKey: 'atom.foreground.primary.fg-brand-primary',         label: 'Selected text',               cssVar: '--atom-foreground-primary-fg-brand-primary' },
  { key: 'default-text',      tokenKey: 'atom.foreground.core.fg-primary',                  label: 'Default text',                cssVar: '--atom-foreground-core-fg-primary' },
  { key: 'container-border',  tokenKey: 'atom.border.default.border-default',               label: 'Container border',            cssVar: '--atom-border-default-border-default' },
  { key: 'selected-border',   tokenKey: 'atom.border.selection-and-focus.border-selected',  label: 'Selected indicator border',   cssVar: '--atom-border-selection-and-focus-border-selected' },
  { key: 'circular-bg',       tokenKey: 'atom.background.core.bg-muted',                   label: 'Circular container bg',       cssVar: '--atom-background-core-bg-muted' },
  { key: 'selected-pill-bg',  tokenKey: 'atom.background.primary.bg-primary-default',       label: 'Selected pill bg',            cssVar: '--atom-background-primary-bg-primary-default' },
  { key: 'pill-text',         tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse', label: 'Selected pill text (light)',   cssVar: '--atom-foreground-primary-fg-brand-primary-inverse' },
  { key: 'inverse-pill-bg',   tokenKey: 'atom.background.primary.bg-primary-inverse',       label: 'Selected pill bg (dark)',     cssVar: '--atom-background-primary-bg-primary-inverse' },
];

const A11Y_ROWS = [
  {
    icon: '🔖',
    title: 'Use role="tablist", role="tab", and role="tabpanel"',
    body: 'The tab container must have role="tablist". Each tab must have role="tab". The content area controlled by each tab must have role="tabpanel" with aria-labelledby pointing to its tab.',
  },
  {
    icon: '✅',
    title: 'aria-selected',
    body: 'The currently active tab must have aria-selected="true". All inactive tabs must have aria-selected="false". This tells assistive technologies which tab is currently displayed.',
  },
  {
    icon: '⌨️',
    title: 'Keyboard navigation',
    body: 'Arrow Left / Arrow Right move focus between tabs. Home moves focus to the first tab, End moves to the last tab. Enter or Space activates the focused tab.',
  },
  {
    icon: '🎯',
    title: 'Focus management',
    body: 'Only the active tab should be in the tab order (tabindex="0"). Inactive tabs use tabindex="-1" so users tab past the group in a single stop, then use arrow keys within.',
  },
  {
    icon: '🚫',
    title: 'Don\'t disable tabs',
    body: 'Avoid disabling tabs — users cannot discover what content they hide. Instead, show the tab panel with a message explaining why the content is unavailable.',
  },
];

export function TabsPage({ brand }: TabsPageProps) {
  const [tabStyle, setTabStyle] = useState<TabsStyle>('Underlined');
  const [count, setCount] = useState<TabCount>(3);
  const [activeIndex, setActiveIndex] = useState(0);

  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];
  const previewKey = `${tabStyle}-${count}-${activeIndex}`;

  const clampedActive = Math.min(activeIndex, count - 1);

  const isDarkVariant = tabStyle === 'Circular on Dark';

  return (
    <div className="space-y-10">

      {/* -- 1. INTERACTIVE PREVIEW ------------------------------------------------ */}
      <section>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden', background: '#fff' }}>
          <div style={{ display: 'flex', minHeight: '280px' }}>

            {/* Canvas */}
            <div style={{ flex: 1, ...(isDarkVariant ? DARK_DOTTED_BG : DOTTED_BG), display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ width: '100%', maxWidth: '520px' }}
                >
                  <TabsLive tabStyle={tabStyle} count={count} activeIndex={clampedActive} brand={brand} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div style={{
              width: '224px', flexShrink: 0,
              borderLeft: '1px solid #e5e7eb', backgroundColor: '#fff',
              padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '18px',
            }}>
              {/* Style toggle */}
              <div>
                <p style={LABEL_STYLE}>Style</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {STYLES.map(s => (
                    <SegBtn key={s} active={tabStyle === s} onClick={() => setTabStyle(s)}>{s}</SegBtn>
                  ))}
                </div>
              </div>

              {/* Count toggle */}
              <div>
                <p style={LABEL_STYLE}>Count</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  {COUNTS.map(c => (
                    <SegBtn key={c} active={count === c} onClick={() => { setCount(c); setActiveIndex(prev => Math.min(prev, c - 1)); }}>{c}</SegBtn>
                  ))}
                </div>
              </div>

              {/* Active index buttons */}
              <div>
                <p style={LABEL_STYLE}>Active tab</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  {Array.from({ length: count }, (_, i) => (
                    <SegBtn key={i} active={clampedActive === i} onClick={() => setActiveIndex(i)}>{i + 1}</SegBtn>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -- 2. COMPONENT INFO ----------------------------------------------------- */}
      <section>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Tabs</h1>
        <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: 1.6, margin: '0 0 16px', maxWidth: '640px' }}>
          Organises related content into multiple views within the same context.
          Use when users need to switch between related sections without leaving a page.
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
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px' }}>Parts of the Tabs component and their roles.</p>

        <div style={{
          ...DOTTED_BG, borderRadius: '12px', padding: '64px 48px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
        }}>
          <div style={{ width: '100%', maxWidth: '480px' }}>
            <TabsLive tabStyle="Underlined" count={3} activeIndex={0} brand={brand} />
          </div>

          {/* Callout 1 -- Container */}
          <div style={{ position: 'absolute', top: '16px', left: '22%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalloutDot num="1" />
            <div style={LINE} />
          </div>

          {/* Callout 2 -- Tab label */}
          <div style={{ position: 'absolute', top: '16px', left: '38%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalloutDot num="2" />
            <div style={LINE} />
          </div>

          {/* Callout 3 -- Active indicator */}
          <div style={{ position: 'absolute', bottom: '16px', left: '24%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={LINE} />
            <CalloutDot num="3" />
          </div>

          {/* Callout 4 -- Divider */}
          <div style={{ position: 'absolute', bottom: '16px', left: '68%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={LINE} />
            <CalloutDot num="4" />
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {[
            { num: '1', label: 'Container', desc: 'Wraps all tabs in a horizontal row. Provides the tablist semantics and layout bounds.' },
            { num: '2', label: 'Tab label', desc: 'Text label for each tab. Indicates the content section the tab will reveal when activated.' },
            { num: '3', label: 'Active indicator', desc: 'Underlined: bottom border. Circular: pill background. Plain: text weight only. Marks the currently active tab.' },
            { num: '4', label: 'Divider', desc: 'Full-width bottom border in Underlined style. Separates the tab row from the content area below.' },
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

      {/* -- 4. VARIANTS ----------------------------------------------------------- */}
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
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>Style</td>
                <td style={{ padding: '10px 16px', color: '#6b7280' }}>Underlined · Plain · Circular on Light · Circular on Dark</td>
              </tr>
              <tr>
                <td style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>Count</td>
                <td style={{ padding: '10px 16px', color: '#6b7280' }}>2 · 3 · 4 · 5 · 6 · 7</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Visual preview of all styles */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {STYLES.map(s => {
            const isDark = s === 'Circular on Dark';
            return (
              <div key={s} style={{
                padding: '20px 24px', borderRadius: '10px',
                border: isDark ? '1px solid #334155' : '1px solid #f3f4f6',
                backgroundColor: isDark ? '#0f172a' : '#fafafa',
              }}>
                <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 600, color: isDark ? '#94a3b8' : '#6b7280' }}>{s}</p>
                <TabsLive tabStyle={s} count={3} activeIndex={0} brand={brand} />
              </div>
            );
          })}
        </div>
      </section>

      {/* -- 5. DESIGN TOKENS ------------------------------------------------------ */}
      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Design tokens</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          Tokens used by the Tabs component across all styles.
        </p>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '180px' }}>Role</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Token</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '140px' }}>Value</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '52px' }}>Swatch</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_ROWS.map(({ key, tokenKey, label, cssVar }, i) => (
                <tr key={key} style={{ borderLeft: '3px solid #3b82f6', borderBottom: i < TOKEN_ROWS.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <td style={{ padding: '10px 16px', color: '#374151', fontWeight: 600 }}>{label}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <code style={{ fontSize: '11px', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', color: '#6b7280' }}>
                      {cssVar}
                    </code>
                  </td>
                  <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: '12px', color: '#6b7280' }}>
                    {tokens[tokenKey as keyof typeof tokens]}
                  </td>
                  <td style={{ padding: '10px 16px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '4px', backgroundColor: tokens[tokenKey as keyof typeof tokens], border: '1px solid rgba(0,0,0,0.08)' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* -- 6. ACCESSIBILITY ------------------------------------------------------ */}
      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Accessibility</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          Guidance for building inclusive experiences with the Tabs component.
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

      {/* -- 7. USAGE -------------------------------------------------------------- */}
      <section style={{ paddingBottom: '40px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>Usage</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>When and how to use each Tabs style.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          {[
            { t: 'Underlined', when: 'Use for primary navigation between content sections. The underline indicator is familiar and works well within page-level layouts, forms, and settings screens.' },
            { t: 'Plain', when: 'Use when you need text-only tab switching with no visual chrome. Ideal for minimal layouts where the surrounding context already provides visual separation.' },
            { t: 'Circular on Light', when: 'Use for toggling between closely related views or filters on light backgrounds. The pill style is compact and works well inside cards or toolbars.' },
            { t: 'Circular on Dark', when: 'Use for the same toggle patterns as Circular on Light, but on dark surfaces such as hero banners, dark cards, or inverted sections.' },
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
              Keep tab labels short and descriptive. Use 2-7 tabs to cover the content needed. Ensure every tab has a corresponding panel with meaningful content.
            </p>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>Don't</p>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              Don't use tabs for sequential steps — use a stepper instead. Don't nest tabs within tabs. Don't use tabs when the content sections are unrelated to each other.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
