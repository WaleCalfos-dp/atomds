import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DividerLive, type DividerStyle } from '../components/divider/DividerLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';

interface DividerPageProps {
  brand: Brand;
  lang?: Language;
}

const COPY = {
  en: {
    styleLabel: 'Style',
    headline: 'Divider',
    tagline:
      'Visually separates content or sections within a layout. Available in solid and dashed styles, both driven by the same border token.',
    feedback: 'Feedback',
    stable: 'Stable',
    anatomyHeading: 'Anatomy',
    anatomyTagline: 'Parts of the Divider component and their roles.',
    parts: [
      {
        num: '1',
        label: 'Line',
        desc: '1px horizontal rule. Spans full container width. Style switches between solid and dashed via the style prop.',
      },
      {
        num: '2',
        label: 'Color',
        desc: 'Driven by --atom-border-default-border-divider token. Automatically updates per brand.',
      },
    ],
    variantsHeading: 'Variants',
    propertyCol: 'Property',
    valuesCol: 'Values',
    styleProp: 'Style',
    styleValues: 'Solid · Dashed',
    designTokensHeading: 'Design Tokens',
    designTokensTagline: 'The Divider uses a single token for both styles.',
    roleCol: 'Role',
    tokenCol: 'Token',
    valueCol: 'Value',
    swatchCol: 'Swatch',
    lineColor: 'Line color',
    accessibilityHeading: 'Accessibility',
    accessibilityTagline:
      'Guidance for building inclusive experiences with the Divider component.',
    a11yRows: [
      {
        icon: '🔖',
        title: 'Semantic role',
        body: 'Use role="separator" so screen readers announce the divider as a thematic break. Purely decorative dividers that add no meaning should use aria-hidden="true" to remove them from the accessibility tree.',
      },
      {
        icon: '📐',
        title: "Don't overuse",
        body: 'Dividers add visual noise when overused. Prefer spacing and padding to group related content — only add a divider when visual separation remains unclear after adjusting layout.',
      },
      {
        icon: '↕️',
        title: 'Orientation',
        body: 'This component renders a horizontal divider. For vertical separators (e.g. between inline items), add aria-orientation="vertical" and render via border-left instead of border-top.',
      },
    ],
    usageHeading: 'Usage',
    usageTagline: 'When and how to use each Divider style.',
    usageRows: [
      {
        t: 'Solid',
        when: 'Use for clear, prominent section breaks — between list items, form groups, or major content sections. The default choice in most contexts.',
      },
      {
        t: 'Dashed',
        when: 'Use for softer or secondary separation — optional groupings, collapsed sections, or areas where a solid line would feel too heavy.',
      },
    ],
    do: '✓ Do',
    dont: "✗ Don't",
    doText:
      'Use dividers sparingly to separate genuinely unrelated content. Rely on spacing first — only add a divider when the visual grouping is still unclear.',
    dontText:
      "Don't place dividers between every item in a list or form — it creates visual clutter. Don't use dividers to replace proper heading hierarchy.",
  },
  zh: {
    styleLabel: '样式',
    headline: '分割线',
    tagline:
      '在布局中视觉地分隔内容或区块。提供实线和虚线两种样式,均由同一个边框令牌驱动。',
    feedback: '反馈',
    stable: '稳定版',
    anatomyHeading: '结构剖析',
    anatomyTagline: '分割线组件的各部分及其作用。',
    parts: [
      {
        num: '1',
        label: '线条',
        desc: '1px 水平线。横跨容器全宽。可通过 style 属性在实线与虚线之间切换。',
      },
      {
        num: '2',
        label: '颜色',
        desc: '由 --atom-border-default-border-divider 令牌驱动。会自动随品牌更新。',
      },
    ],
    variantsHeading: '变体',
    propertyCol: '属性',
    valuesCol: '取值',
    styleProp: '样式',
    styleValues: 'Solid · Dashed',
    designTokensHeading: '设计令牌',
    designTokensTagline: '分割线两种样式共用一个令牌。',
    roleCol: '角色',
    tokenCol: '令牌',
    valueCol: '值',
    swatchCol: '色样',
    lineColor: '线条颜色',
    accessibilityHeading: '可访问性',
    accessibilityTagline: '使用分割线组件构建包容性体验的指导。',
    a11yRows: [
      {
        icon: '🔖',
        title: '语义角色',
        body: '使用 role="separator" 让屏幕阅读器将分割线作为主题间断进行播报。纯装饰、不含意义的分割线应使用 aria-hidden="true" 将其从可访问性树中移除。',
      },
      {
        icon: '📐',
        title: '避免过度使用',
        body: '过度使用分割线会增加视觉噪声。优先使用间距和内边距来组织相关内容——只有在调整布局后视觉分隔仍不清晰时才添加分割线。',
      },
      {
        icon: '↕️',
        title: '方向',
        body: '本组件渲染水平分割线。对于垂直分隔(如行内项目之间),添加 aria-orientation="vertical" 并通过 border-left 而非 border-top 渲染。',
      },
    ],
    usageHeading: '用法',
    usageTagline: '何时以及如何使用每种分割线样式。',
    usageRows: [
      {
        t: 'Solid',
        when: '用于清晰、显著的区块分隔——列表项、表单分组或主要内容区块之间。在多数情况下为默认选择。',
      },
      {
        t: 'Dashed',
        when: '用于柔和或次级的分隔——可选分组、折叠区块,或实线显得过重的区域。',
      },
    ],
    do: '✓ 推荐做法',
    dont: '✗ 避免做法',
    doText:
      '谨慎使用分割线,只用于真正不相关的内容之间。优先使用间距——只有在视觉分组依然不清晰时才添加分割线。',
    dontText:
      '不要在列表或表单的每个项目之间都放置分割线——这会造成视觉杂乱。不要用分割线替代正确的标题层级。',
  },
} as const;

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

const STYLES: DividerStyle[] = ['Solid', 'Dashed'];

export function DividerPage({ brand, lang = 'en' }: DividerPageProps) {
  const t = COPY[lang];
  const [style, setStyle] = useState<DividerStyle>('Solid');
  const previewKey = style;
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ width: '100%', maxWidth: '480px' }}
                >
                  <DividerLive style={style} brand={brand} />
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
                <p style={LABEL_STYLE}>{t.styleLabel}</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  {STYLES.map(s => (
                    <SegBtn key={s} active={style === s} onClick={() => setStyle(s)}>{s}</SegBtn>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ──────────────────────────────────────────────── */}
      <section>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>{t.headline}</h1>
        <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: 1.6, margin: '0 0 16px', maxWidth: '640px' }}>
          {t.tagline}
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
            {t.feedback}
          </a>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: '6px',
            border: '1px solid #bbf7d0', fontSize: '13px', color: '#166534',
            backgroundColor: '#f0fdf4', fontFamily: 'system-ui, -apple-system, sans-serif',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
            {t.stable}
          </span>
        </div>
      </section>

      {/* ── 3. ANATOMY ─────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.anatomyHeading}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px' }}>{t.anatomyTagline}</p>

        <div style={{
          ...DOTTED_BG, borderRadius: '12px', padding: '64px 48px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
        }}>
          <div style={{ width: '100%', maxWidth: '480px' }}>
            <DividerLive style="Solid" brand={brand} />
          </div>

          {/* Callout 1 — Line (left side, below) */}
          <div style={{ position: 'absolute', bottom: '16px', left: '30%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={LINE} />
            <CalloutDot num="1" />
          </div>

          {/* Callout 2 — Color token (right side, below) */}
          <div style={{ position: 'absolute', bottom: '16px', left: '68%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={LINE} />
            <CalloutDot num="2" />
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {t.parts.map(({ num, label, desc }) => (
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

      {/* ── 4. VARIANTS TABLE ──────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-4">{t.variantsHeading}</h2>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '140px' }}>{t.propertyCol}</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>{t.valuesCol}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>{t.styleProp}</td>
                <td style={{ padding: '10px 16px', color: '#6b7280' }}>{t.styleValues}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Visual preview of both styles */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {STYLES.map(s => (
            <div key={s} style={{ padding: '20px 24px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
              <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>{s}</p>
              <DividerLive style={s} brand={brand} />
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ───────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.designTokensHeading}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.designTokensTagline}
        </p>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '140px' }}>{t.roleCol}</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>{t.tokenCol}</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '140px' }}>{t.valueCol}</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '52px' }}>{t.swatchCol}</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderLeft: '3px solid #3b82f6' }}>
                <td style={{ padding: '10px 16px', color: '#374151', fontWeight: 600 }}>{t.lineColor}</td>
                <td style={{ padding: '10px 16px' }}>
                  <code style={{ fontSize: '11px', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', color: '#6b7280' }}>
                    --atom-border-default-border-divider
                  </code>
                </td>
                <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: '12px', color: '#6b7280' }}>
                  {tokens['atom.border.default.border-divider']}
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '4px', backgroundColor: tokens['atom.border.default.border-divider'], border: '1px solid rgba(0,0,0,0.08)' }} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 6. ACCESSIBILITY ───────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.accessibilityHeading}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.accessibilityTagline}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {t.a11yRows.map(({ icon, title, body }) => (
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
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{t.usageHeading}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>{t.usageTagline}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          {t.usageRows.map(({ t: title, when }) => (
            <div key={title} style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
              <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#111827' }}>{title}</p>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#6b7280', lineHeight: 1.4 }}>{when}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>{t.do}</p>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              {t.doText}
            </p>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>{t.dont}</p>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              {t.dontText}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
