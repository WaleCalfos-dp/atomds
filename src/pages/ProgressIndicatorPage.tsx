import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressIndicatorLive, type ProgressIndicatorVariant } from '../components/progress-indicator/ProgressIndicatorLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';

interface ProgressIndicatorPageProps {
  brand: Brand;
  lang?: Language;
}

// ─── Bilingual copy block ─────────────────────────────────────────────────
const COPY = {
  en: {
    variantLabel: 'Variant',
    valueLabel: (v: number) => `Value (${v}%)`,
    segmentsLabel: (n: number) => `Segments (${n})`,
    activeLabel: (n: number) => `Active (${n})`,
    title: 'Progress Indicator',
    description:
      'Shows the progress of a task or process over time. Use for uploads, downloads, or multi-step processes to provide real-time feedback.',
    feedback: 'Feedback',
    stable: 'Stable',
    anatomyTitle: 'Anatomy',
    anatomyLead: 'Parts of the Progress Indicator component and their roles.',
    anatomyParts: [
      { num: '1', label: 'Track', desc: 'Full-width background bar. Uses bg-primary-disabled token to provide a subtle container for the fill.' },
      { num: '2', label: 'Fill', desc: 'Progress fill bar. Width maps to the current value (0-100%). Colored with the primary accent token.' },
      { num: '3', label: 'Label', desc: 'Percentage text displayed right-aligned next to the bar. Uses 16px Medium weight and the fg-primary token.' },
    ],
    variantsTitle: 'Variants',
    propertyHeader: 'Property',
    valuesHeader: 'Values',
    variantRows: [
      { prop: 'Style', vals: 'Percentage Bar \u00B7 Multiple Bars (default Percentage Bar)' },
      { prop: 'Count', vals: '2 \u00B7 3 \u00B7 4 \u00B7 5 \u00B7 6 \u00B7 10% \u00B7 20% \u00B7 30% \u00B7 40% \u00B7 50% \u00B7 60% \u00B7 70% \u00B7 80% \u00B7 90% \u00B7 100% (default 10%)' },
      { prop: 'Booleans (4)', vals: 'Progress Name (default on), Progress Description (default on), Content Bottom (default on), Percentage (default on)' },
      { prop: 'Text slots (2)', vals: 'Progress Name Text (default "Step 1:"), Progress description Text (default "Text block")' },
    ],
    tokensTitle: 'Design Tokens',
    tokensLead: 'Tokens used by the Progress Indicator across both variants.',
    roleHeader: 'Role',
    tokenHeader: 'Token',
    valueHeader: 'Value',
    swatchHeader: 'Swatch',
    tokenRoleTrack: 'Track',
    tokenRoleFillBar: 'Fill (Bar)',
    tokenRoleFillSegments: 'Fill (Segments)',
    tokenRoleLabel: 'Label',
    a11yTitle: 'Accessibility',
    a11yLead: 'Guidance for building inclusive experiences with the Progress Indicator component.',
    a11yRows: [
      {
        icon: '\u2699\uFE0F',
        title: 'Progressbar role',
        body: 'Use role="progressbar" with aria-valuenow, aria-valuemin, and aria-valuemax so assistive technologies can announce current progress.',
      },
      {
        icon: '\uD83C\uDFA8',
        title: "Don't rely on color alone",
        body: 'Always display a visible percentage label alongside the progress fill. This ensures users who cannot perceive color differences still understand the current value.',
      },
      {
        icon: '\uD83D\uDD14',
        title: 'Live region',
        body: 'Wrap dynamic progress updates with aria-live="polite" so screen readers announce value changes without interrupting the user\'s current task.',
      },
      {
        icon: '\u26A1',
        title: 'Reduced motion',
        body: 'When prefers-reduced-motion is active, disable animated fills and transitions. Show the final state immediately so motion-sensitive users are not affected.',
      },
    ],
    usageTitle: 'Usage',
    usageLead: 'When and how to use each Progress Indicator variant.',
    usageRows: [
      { t: 'Percentage Bar', when: 'Use for linear workflows such as file uploads, form completion, or step-by-step wizards. The horizontal bar with percentage text fits naturally into page and card layouts.' },
      { t: 'Multiple Bars', when: 'Use for multi-step processes where each step is discrete. The segmented bars clearly communicate how many steps exist and how far the user has progressed.' },
    ],
    doLabel: 'Do',
    dontLabel: "Don't",
    doBody:
      'Always pair the progress fill with a visible percentage label. Use determinate progress (0-100%) when the total is known, and keep the indicator visible until the task completes.',
    dontBody:
      "Don't use a progress indicator for indeterminate loading — use a spinner instead. Avoid stacking multiple progress bars in the same view without clear labels distinguishing each task.",
  },
  zh: {
    variantLabel: '变体',
    valueLabel: (v: number) => `数值 (${v}%)`,
    segmentsLabel: (n: number) => `分段数 (${n})`,
    activeLabel: (n: number) => `已激活 (${n})`,
    title: '进度指示器',
    description:
      '显示任务或流程随时间推进的进度。用于上传、下载或多步骤流程以提供实时反馈。',
    feedback: '反馈',
    stable: '稳定版',
    anatomyTitle: '结构剖析',
    anatomyLead: '进度指示器组件的各个部分及其作用。',
    anatomyParts: [
      { num: '1', label: '轨道', desc: '通栏背景条。使用 bg-primary-disabled 令牌为填充提供低调的容器。' },
      { num: '2', label: '填充', desc: '进度填充条。宽度映射到当前数值（0-100%）。使用主要强调色令牌着色。' },
      { num: '3', label: '标签', desc: '显示在条形右侧的百分比文字。使用 16px Medium 字重和 fg-primary 令牌。' },
    ],
    variantsTitle: '变体',
    propertyHeader: '属性',
    valuesHeader: '取值',
    variantRows: [
      { prop: '\u6837\u5F0F', vals: 'Percentage Bar \u00B7 Multiple Bars\uFF08\u9ED8\u8BA4 Percentage Bar\uFF09' },
      { prop: '\u6570\u91CF', vals: '2 \u00B7 3 \u00B7 4 \u00B7 5 \u00B7 6 \u00B7 10% \u00B7 20% \u00B7 30% \u00B7 40% \u00B7 50% \u00B7 60% \u00B7 70% \u00B7 80% \u00B7 90% \u00B7 100%\uFF08\u9ED8\u8BA4 10%\uFF09' },
      { prop: '\u5E03\u5C14\u503C (4)', vals: 'Progress Name\uFF08\u9ED8\u8BA4\u5F00\uFF09\u3001Progress Description\uFF08\u9ED8\u8BA4\u5F00\uFF09\u3001Content Bottom\uFF08\u9ED8\u8BA4\u5F00\uFF09\u3001Percentage\uFF08\u9ED8\u8BA4\u5F00\uFF09' },
      { prop: '\u6587\u672C\u63D2\u69FD (2)', vals: 'Progress Name Text\uFF08\u9ED8\u8BA4 "Step 1:"\uFF09\u3001Progress description Text\uFF08\u9ED8\u8BA4 "Text block"\uFF09' },
    ],
    tokensTitle: '设计令牌',
    tokensLead: '进度指示器在两种变体中使用的令牌。',
    roleHeader: '角色',
    tokenHeader: '令牌',
    valueHeader: '值',
    swatchHeader: '色样',
    tokenRoleTrack: '轨道',
    tokenRoleFillBar: '填充（条形）',
    tokenRoleFillSegments: '填充（分段）',
    tokenRoleLabel: '标签',
    a11yTitle: '可访问性',
    a11yLead: '使用进度指示器组件构建包容性体验的指导原则。',
    a11yRows: [
      {
        icon: '\u2699\uFE0F',
        title: 'Progressbar 角色',
        body: '使用 role="progressbar" 配合 aria-valuenow、aria-valuemin 和 aria-valuemax，以便辅助技术能够播报当前进度。',
      },
      {
        icon: '\uD83C\uDFA8',
        title: '不要仅依赖颜色',
        body: '始终在进度填充旁显示可见的百分比标签。这能确保无法感知颜色差异的用户仍能理解当前数值。',
      },
      {
        icon: '\uD83D\uDD14',
        title: '实时区域',
        body: '使用 aria-live="polite" 包裹动态进度更新，让屏幕阅读器在不打断用户当前任务的情况下播报数值变化。',
      },
      {
        icon: '\u26A1',
        title: '减少动效',
        body: '当 prefers-reduced-motion 处于激活状态时，禁用动画填充与过渡效果。立即显示最终状态，以免影响对动效敏感的用户。',
      },
    ],
    usageTitle: '用法',
    usageLead: '何时以及如何使用每种进度指示器变体。',
    usageRows: [
      { t: 'Percentage Bar', when: '用于线性工作流，例如文件上传、表单填写或逐步向导。带百分比文字的水平条能自然融入页面和卡片布局。' },
      { t: 'Multiple Bars', when: '用于每个步骤都独立的多步骤流程。分段条清晰传达共有多少步骤以及用户已进展多远。' },
    ],
    doLabel: '推荐做法',
    dontLabel: '避免做法',
    doBody:
      '始终为进度填充配上可见的百分比标签。当总量已知时使用确定性进度（0-100%），并在任务完成前保持指示器可见。',
    dontBody:
      '不要将进度指示器用于不确定的加载——改用加载图标。避免在同一视图中堆叠多个进度条而没有明确的标签区分每项任务。',
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

const VARIANTS: ProgressIndicatorVariant[] = ['Percentage Bar', 'Multiple Bars'];

export function ProgressIndicatorPage({ brand, lang = 'en' }: ProgressIndicatorPageProps) {
  const t = COPY[lang];
  const [variant, setVariant] = useState<ProgressIndicatorVariant>('Percentage Bar');
  const [value, setValue] = useState(65);
  const [segments, setSegments] = useState(4);
  const [activeSegments, setActiveSegments] = useState(2);
  const previewKey = `${variant}-${value}-${segments}-${activeSegments}`;
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  return (
    <div className="space-y-10">

      {/* -- 1. INTERACTIVE PREVIEW ----------------------------------------- */}
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
                  style={{ width: '100%', maxWidth: '480px', display: 'flex', justifyContent: 'center' }}
                >
                  <ProgressIndicatorLive
                    variant={variant}
                    value={value}
                    brand={brand}
                    segments={segments}
                    activeSegments={activeSegments}
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
              <div>
                <p style={LABEL_STYLE}>{t.variantLabel}</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  {VARIANTS.map(v => (
                    <SegBtn key={v} active={variant === v} onClick={() => setVariant(v)}>{v}</SegBtn>
                  ))}
                </div>
              </div>

              {variant === 'Percentage Bar' && (
                <div>
                  <p style={LABEL_STYLE}>{t.valueLabel(value)}</p>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={value}
                    onChange={e => setValue(Number(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer' }}
                  />
                </div>
              )}

              {variant === 'Multiple Bars' && (
                <>
                  <div>
                    <p style={LABEL_STYLE}>{t.segmentsLabel(segments)}</p>
                    <input
                      type="range"
                      min={2}
                      max={6}
                      value={segments}
                      onChange={e => {
                        const s = Number(e.target.value);
                        setSegments(s);
                        if (activeSegments > s) setActiveSegments(s);
                      }}
                      style={{ width: '100%', cursor: 'pointer' }}
                    />
                  </div>
                  <div>
                    <p style={LABEL_STYLE}>{t.activeLabel(activeSegments)}</p>
                    <input
                      type="range"
                      min={0}
                      max={segments}
                      value={activeSegments}
                      onChange={e => setActiveSegments(Number(e.target.value))}
                      style={{ width: '100%', cursor: 'pointer' }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* -- 2. COMPONENT INFO ---------------------------------------------- */}
      <section>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>{t.title}</h1>
        <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: 1.6, margin: '0 0 16px', maxWidth: '640px' }}>
          {t.description}
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

      {/* -- 3. ANATOMY ----------------------------------------------------- */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.anatomyTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px' }}>{t.anatomyLead}</p>

        <div style={{
          ...DOTTED_BG, borderRadius: '12px', padding: '64px 48px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
        }}>
          <div style={{ width: '100%', maxWidth: '480px' }}>
            <ProgressIndicatorLive variant="Percentage Bar" value={65} brand={brand} />
          </div>

          {/* Callout 1 - Track (left side, below) */}
          <div style={{ position: 'absolute', bottom: '16px', left: '25%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={LINE} />
            <CalloutDot num="1" />
          </div>

          {/* Callout 2 - Fill (center, below) */}
          <div style={{ position: 'absolute', bottom: '16px', left: '45%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={LINE} />
            <CalloutDot num="2" />
          </div>

          {/* Callout 3 - Label (right side, below) */}
          <div style={{ position: 'absolute', bottom: '16px', left: '72%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={LINE} />
            <CalloutDot num="3" />
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {t.anatomyParts.map(({ num, label, desc }) => (
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

      {/* -- 4. VARIANTS TABLE ---------------------------------------------- */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-4">{t.variantsTitle}</h2>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '140px' }}>{t.propertyHeader}</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>{t.valuesHeader}</th>
              </tr>
            </thead>
            <tbody>
              {t.variantRows.map((row, i) => (
                <tr key={row.prop} style={{ borderBottom: i < t.variantRows.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 600, color: '#374151', verticalAlign: 'top' }}>{row.prop}</td>
                  <td style={{ padding: '10px 16px', color: '#6b7280' }}>{row.vals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual preview of both variants */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {VARIANTS.map(v => (
            <div key={v} style={{ padding: '20px 24px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
              <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>{v}</p>
              <ProgressIndicatorLive
                variant={v}
                value={65}
                brand={brand}
                segments={4}
                activeSegments={2}
              />
            </div>
          ))}
        </div>
      </section>

      {/* -- 5. DESIGN TOKENS ----------------------------------------------- */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.tokensTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.tokensLead}
        </p>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '140px' }}>{t.roleHeader}</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>{t.tokenHeader}</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '140px' }}>{t.valueHeader}</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '52px' }}>{t.swatchHeader}</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderLeft: '3px solid #3b82f6' }}>
                <td style={{ padding: '10px 16px', color: '#374151', fontWeight: 600 }}>{t.tokenRoleTrack}</td>
                <td style={{ padding: '10px 16px' }}>
                  <code style={{ fontSize: '11px', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', color: '#6b7280' }}>
                    --atom-background-primary-bg-primary-disabled
                  </code>
                </td>
                <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: '12px', color: '#6b7280' }}>
                  {tokens['atom.background.primary.bg-primary-disabled']}
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '4px', backgroundColor: tokens['atom.background.primary.bg-primary-disabled'], border: '1px solid rgba(0,0,0,0.08)' }} />
                </td>
              </tr>
              <tr style={{ borderLeft: '3px solid #3b82f6', borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '10px 16px', color: '#374151', fontWeight: 600 }}>{t.tokenRoleFillBar}</td>
                <td style={{ padding: '10px 16px' }}>
                  <code style={{ fontSize: '11px', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', color: '#6b7280' }}>
                    --atom-background-primary-accent
                  </code>
                </td>
                <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: '12px', color: '#6b7280' }}>
                  {tokens['atom.background.primary.accent']}
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '4px', backgroundColor: tokens['atom.background.primary.accent'], border: '1px solid rgba(0,0,0,0.08)' }} />
                </td>
              </tr>
              <tr style={{ borderLeft: '3px solid #3b82f6', borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '10px 16px', color: '#374151', fontWeight: 600 }}>{t.tokenRoleFillSegments}</td>
                <td style={{ padding: '10px 16px' }}>
                  <code style={{ fontSize: '11px', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', color: '#6b7280' }}>
                    --atom-background-primary-bg-primary-pressed-brand
                  </code>
                </td>
                <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: '12px', color: '#6b7280' }}>
                  {tokens['atom.background.primary.bg-primary-pressed-brand']}
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '4px', backgroundColor: tokens['atom.background.primary.bg-primary-pressed-brand'], border: '1px solid rgba(0,0,0,0.08)' }} />
                </td>
              </tr>
              <tr style={{ borderLeft: '3px solid #3b82f6', borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '10px 16px', color: '#374151', fontWeight: 600 }}>{t.tokenRoleLabel}</td>
                <td style={{ padding: '10px 16px' }}>
                  <code style={{ fontSize: '11px', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', color: '#6b7280' }}>
                    --atom-foreground-core-fg-primary
                  </code>
                </td>
                <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: '12px', color: '#6b7280' }}>
                  {tokens['atom.foreground.core.fg-primary']}
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '4px', backgroundColor: tokens['atom.foreground.core.fg-primary'], border: '1px solid rgba(0,0,0,0.08)' }} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* -- 6. ACCESSIBILITY ----------------------------------------------- */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.a11yTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.a11yLead}
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

      {/* -- 7. USAGE ------------------------------------------------------- */}
      <section style={{ paddingBottom: '40px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{t.usageTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>{t.usageLead}</p>

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
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>&#x2713; {t.doLabel}</p>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              {t.doBody}
            </p>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>&#x2717; {t.dontLabel}</p>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              {t.dontBody}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
