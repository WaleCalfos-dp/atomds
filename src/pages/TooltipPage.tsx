import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TooltipLive, type TooltipPosition } from '../components/tooltip/TooltipLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';

interface TooltipPageProps {
  brand: Brand;
  lang?: Language;
}

const COPY = {
  en: {
    positionLabel: 'Position',
    titleTextLabel: 'Title Text',
    descriptionTextLabel: 'Description Text',
    titleLabel: 'Title',
    descriptionLabel: 'Description',
    iconLeftLabel: 'Icon Left',
    iconRightLabel: 'Icon Right',
    showLabel: 'Show',
    hideLabel: 'Hide',
    positions: { Top: 'Top', Bottom: 'Bottom', Left: 'Left', Right: 'Right' } as Record<TooltipPosition, string>,
    defaultTitle: 'Title',
    defaultDescription: 'Description',
    headline: 'Tooltip',
    tagline:
      'Provides brief contextual information when a user hovers over or focuses an element. Use near form labels, icons, buttons, or technical terms that need short clarification without cluttering the interface.',
    feedbackPill: 'Feedback',
    stablePill: 'Stable',
    anatomyHeading: 'Anatomy',
    anatomyTagline: 'Parts of the Tooltip component and their roles.',
    anatomyParts: [
      { num: '1', label: 'Container', desc: 'Dark rounded rectangle (8px radius). Background uses the brand primary token. Padding: 8px 12px. Max width 240px before wrapping.' },
      { num: '2', label: 'Arrow', desc: '6px CSS triangle pointing toward the trigger element. Same color as container. Position shifts to match the placement prop.' },
      { num: '3', label: 'Icon Left', desc: '16px info circle icon on the left side. Toggleable via showIconLeft prop. Uses inverse foreground color.' },
      { num: '4', label: 'Title', desc: '14px / weight 500 (Medium) text in inverse foreground color. Toggleable via showTitle prop. Font family inherits from brand.' },
      { num: '5', label: 'Description', desc: '12px / weight 400 (Regular) text in inverse foreground at 80% opacity. Toggleable via showDescription prop.' },
      { num: '6', label: 'Icon Right', desc: '16px close/dismiss icon on the right side. Toggleable via showIconRight prop. Uses inverse foreground color.' },
    ],
    variantsHeading: 'Variants',
    variantsTagline: 'Available property combinations for the Tooltip component.',
    propertyHeader: 'Property',
    valuesHeader: 'Values',
    propertyRows: [
      { prop: 'Pointer Direction', values: 'Down | Right | Up | Left' },
      { prop: 'Title', values: 'true (default) | false' },
      { prop: 'Description', values: 'true (default) | false' },
      { prop: 'Icon Left', values: 'true (default) | false' },
      { prop: 'Icon Right', values: 'true (default) | false' },
      { prop: 'Title Text', values: '"Title" (string)' },
      { prop: 'Description Text', values: '"Description" (string)' },
    ],
    tokensHeading: 'Design Tokens',
    tokensTagline: 'The Tooltip uses brand primary tokens for its container and inverse foreground for text.',
    roleHeader: 'Role',
    tokenHeader: 'Token',
    valueHeader: 'Value',
    swatchHeader: 'Swatch',
    tokenLabels: { bg: 'Background', fg: 'Text', arrow: 'Arrow' } as Record<string, string>,
    a11yHeading: 'Accessibility',
    a11yTagline: 'Guidance for building inclusive experiences with the Tooltip component.',
    a11yRows: [
      { icon: '🔖', title: 'Use role="tooltip"', body: 'The tooltip container must have role="tooltip". The trigger element needs aria-describedby pointing to the tooltip\'s id so screen readers associate the two.' },
      { icon: '⌨️', title: 'Keyboard trigger', body: 'Tooltips must appear on focus (not just hover) so keyboard-only users can access the information. Pressing Escape should dismiss the tooltip.' },
      { icon: '⏱️', title: 'Timing', body: 'Show after a short delay (300–500ms) to avoid flashing on mouse-through. Keep visible while the pointer is over the trigger or tooltip, and for at least 1.5s after focus.' },
      { icon: '🚫', title: 'No interactive content', body: 'Tooltips must contain only plain text — never links, buttons, or other interactive elements. If you need interactive content, use a Popover instead.' },
      { icon: '📐', title: 'Positioning', body: 'Tooltips should never clip outside the viewport. Implement collision detection to flip the position (e.g. Top → Bottom) when there is insufficient space.' },
    ],
    usageHeading: 'Usage',
    usageTagline: 'When and how to use Tooltips.',
    usageCards: [
      { t: 'Form fields', when: 'Place beside a label or input to explain what the field expects, or to call out formatting requirements (e.g. "Must be 8+ characters").' },
      { t: 'Icon-only actions', when: 'Any button or icon without visible text needs a tooltip to identify its purpose (e.g. a trash icon showing "Delete item").' },
      { t: 'Truncated content', when: 'When text is cut off with an ellipsis, show the full text in a tooltip on hover so users can read the complete value.' },
    ],
    doLabel: '✓ Do',
    dontLabel: "✗ Don't",
    doBody: 'Keep tooltip text concise — one or two short sentences maximum. Show on both hover and keyboard focus. Use for supplementary information only.',
    dontBody: "Don't put essential information in tooltips — it may never be seen. Don't include links, buttons, or images. Don't use tooltips on touch-only devices as the primary disclosure method.",
  },
  zh: {
    positionLabel: '位置',
    titleTextLabel: '标题文本',
    descriptionTextLabel: '描述文本',
    titleLabel: '标题',
    descriptionLabel: '描述',
    iconLeftLabel: '左侧图标',
    iconRightLabel: '右侧图标',
    showLabel: '显示',
    hideLabel: '隐藏',
    positions: { Top: '顶部', Bottom: '底部', Left: '左侧', Right: '右侧' } as Record<TooltipPosition, string>,
    defaultTitle: '标题',
    defaultDescription: '描述',
    headline: '工具提示',
    tagline: '当用户悬停或聚焦于某个元素时,提供简短的上下文信息。可放置在表单标签、图标、按钮或需要简短说明的技术术语附近,以避免界面过于拥挤。',
    feedbackPill: '反馈',
    stablePill: '稳定版',
    anatomyHeading: '结构剖析',
    anatomyTagline: '工具提示组件的各个部分及其作用。',
    anatomyParts: [
      { num: '1', label: '容器', desc: '深色圆角矩形(8px 圆角)。背景使用品牌主色令牌。内边距:8px 12px。换行前最大宽度为 240px。' },
      { num: '2', label: '箭头', desc: '指向触发元素的 6px CSS 三角形。颜色与容器一致。位置随 placement 属性变化。' },
      { num: '3', label: '左侧图标', desc: '左侧的 16px 信息圆形图标。可通过 showIconLeft 属性切换。使用反色前景颜色。' },
      { num: '4', label: '标题', desc: '14px / 字重 500(Medium)的反色前景文本。可通过 showTitle 属性切换。字体随品牌继承。' },
      { num: '5', label: '描述', desc: '12px / 字重 400(Regular)的反色前景文本,不透明度 80%。可通过 showDescription 属性切换。' },
      { num: '6', label: '右侧图标', desc: '右侧的 16px 关闭/取消图标。可通过 showIconRight 属性切换。使用反色前景颜色。' },
    ],
    variantsHeading: '变体',
    variantsTagline: '工具提示组件可用的属性组合。',
    propertyHeader: '属性',
    valuesHeader: '值',
    propertyRows: [
      { prop: '指针方向', values: 'Down | Right | Up | Left' },
      { prop: '标题', values: 'true (默认) | false' },
      { prop: '描述', values: 'true (默认) | false' },
      { prop: '左侧图标', values: 'true (默认) | false' },
      { prop: '右侧图标', values: 'true (默认) | false' },
      { prop: '标题文本', values: '"Title" (字符串)' },
      { prop: '描述文本', values: '"Description" (字符串)' },
    ],
    tokensHeading: '设计令牌',
    tokensTagline: '工具提示的容器使用品牌主色令牌,文本使用反色前景。',
    roleHeader: '角色',
    tokenHeader: '令牌',
    valueHeader: '数值',
    swatchHeader: '色板',
    tokenLabels: { bg: '背景', fg: '文本', arrow: '箭头' } as Record<string, string>,
    a11yHeading: '可访问性',
    a11yTagline: '使用工具提示组件构建包容性体验的指南。',
    a11yRows: [
      { icon: '🔖', title: '使用 role="tooltip"', body: '工具提示容器必须设置 role="tooltip"。触发元素需要 aria-describedby 指向工具提示的 id,以便屏幕阅读器将两者关联起来。' },
      { icon: '⌨️', title: '键盘触发', body: '工具提示必须在聚焦时显示(而不仅仅是悬停),以便仅使用键盘的用户能够访问信息。按下 Escape 键应能关闭工具提示。' },
      { icon: '⏱️', title: '时间控制', body: '在短暂延迟后显示(300–500ms)以避免鼠标穿过时闪现。当指针位于触发器或工具提示之上时保持可见,聚焦后至少保持 1.5 秒。' },
      { icon: '🚫', title: '不要包含交互内容', body: '工具提示必须仅包含纯文本——绝不能包含链接、按钮或其他交互元素。如果需要交互内容,请改用 Popover。' },
      { icon: '📐', title: '定位', body: '工具提示绝不应被裁剪到视口之外。在空间不足时实现碰撞检测以翻转位置(例如顶部 → 底部)。' },
    ],
    usageHeading: '用法',
    usageTagline: '何时及如何使用工具提示。',
    usageCards: [
      { t: '表单字段', when: '放置在标签或输入框旁,说明字段的预期内容,或指出格式要求(例如 "必须为 8 位以上字符")。' },
      { t: '仅图标的操作', when: '任何没有可见文本的按钮或图标都需要工具提示来标识其用途(例如垃圾桶图标显示 "删除项目")。' },
      { t: '截断内容', when: '当文本因省略号被截断时,在悬停时通过工具提示显示完整文本,让用户能读到完整值。' },
    ],
    doLabel: '✓ 推荐',
    dontLabel: '✗ 避免',
    doBody: '保持工具提示文本简洁——最多一两句简短的话。在悬停和键盘聚焦时都要显示。仅用于补充信息。',
    dontBody: '不要将关键信息放入工具提示中——它可能从未被看到。不要包含链接、按钮或图片。不要在仅触屏设备上将工具提示用作主要披露方式。',
  },
} as const;

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

const ALL_POSITIONS: TooltipPosition[] = ['Top', 'Bottom', 'Left', 'Right'];

type TokenRow = {
  key: 'bg' | 'fg' | 'arrow';
  tokenKey: string;
  cssVar: string;
};

const TOKEN_ROWS: TokenRow[] = [
  { key: 'bg',    tokenKey: 'atom.background.primary.bg-primary-default',          cssVar: '--atom-background-primary-bg-primary-default' },
  { key: 'fg',    tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse',    cssVar: '--atom-foreground-primary-fg-brand-primary-inverse' },
  { key: 'arrow', tokenKey: 'atom.background.primary.bg-primary-default',          cssVar: '--atom-background-primary-bg-primary-default' },
];

export function TooltipPage({ brand, lang = 'en' }: TooltipPageProps) {
  const t = COPY[lang];
  const [position, setPosition] = useState<TooltipPosition>('Top');
  const [titleText, setTitleText] = useState<string>(t.defaultTitle);
  const [descriptionText, setDescriptionText] = useState<string>(t.defaultDescription);
  const [showTitle, setShowTitle] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const [showIconLeft, setShowIconLeft] = useState(true);
  const [showIconRight, setShowIconRight] = useState(true);

  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];
  const previewKey = `${position}-${titleText}-${descriptionText}-${showTitle}-${showDescription}-${showIconLeft}-${showIconRight}`;

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
                >
                  <TooltipLive
                    position={position}
                    titleText={titleText}
                    descriptionText={descriptionText}
                    showTitle={showTitle}
                    showDescription={showDescription}
                    showIconLeft={showIconLeft}
                    showIconRight={showIconRight}
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
              {/* Position */}
              <div>
                <p style={LABEL_STYLE}>{t.positionLabel}</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  {ALL_POSITIONS.map(p => (
                    <SegBtn key={p} active={position === p} onClick={() => setPosition(p)}>{t.positions[p]}</SegBtn>
                  ))}
                </div>
              </div>

              {/* Title text input */}
              <div>
                <p style={{ ...LABEL_STYLE, margin: '0 0 6px' }}>{t.titleTextLabel}</p>
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

              {/* Description text input */}
              <div>
                <p style={{ ...LABEL_STYLE, margin: '0 0 6px' }}>{t.descriptionTextLabel}</p>
                <input
                  type="text"
                  value={descriptionText}
                  onChange={e => setDescriptionText(e.target.value)}
                  style={{
                    width: '100%', padding: '6px 8px', fontSize: '12.5px',
                    border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none',
                    boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif',
                    color: '#374151',
                  }}
                />
              </div>

              {/* Show Title toggle */}
              <div>
                <p style={LABEL_STYLE}>{t.titleLabel}</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  <SegBtn active={showTitle} onClick={() => setShowTitle(true)}>{t.showLabel}</SegBtn>
                  <SegBtn active={!showTitle} onClick={() => setShowTitle(false)}>{t.hideLabel}</SegBtn>
                </div>
              </div>

              {/* Show Description toggle */}
              <div>
                <p style={LABEL_STYLE}>{t.descriptionLabel}</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  <SegBtn active={showDescription} onClick={() => setShowDescription(true)}>{t.showLabel}</SegBtn>
                  <SegBtn active={!showDescription} onClick={() => setShowDescription(false)}>{t.hideLabel}</SegBtn>
                </div>
              </div>

              {/* Icon Left toggle */}
              <div>
                <p style={LABEL_STYLE}>{t.iconLeftLabel}</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  <SegBtn active={showIconLeft} onClick={() => setShowIconLeft(true)}>{t.showLabel}</SegBtn>
                  <SegBtn active={!showIconLeft} onClick={() => setShowIconLeft(false)}>{t.hideLabel}</SegBtn>
                </div>
              </div>

              {/* Icon Right toggle */}
              <div>
                <p style={LABEL_STYLE}>{t.iconRightLabel}</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  <SegBtn active={showIconRight} onClick={() => setShowIconRight(true)}>{t.showLabel}</SegBtn>
                  <SegBtn active={!showIconRight} onClick={() => setShowIconRight(false)}>{t.hideLabel}</SegBtn>
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
            {t.feedbackPill}
          </a>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: '6px',
            border: '1px solid #bbf7d0', fontSize: '13px', color: '#166534',
            backgroundColor: '#f0fdf4', fontFamily: 'system-ui, -apple-system, sans-serif',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
            {t.stablePill}
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
          <TooltipLive position="Top" titleText={t.defaultTitle} descriptionText={t.defaultDescription} brand={brand} />

          {/* Callout 1 — Container (bottom center) */}
          <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={LINE} />
            <CalloutDot num="1" />
          </div>

          {/* Callout 2 — Arrow (bottom center, slightly offset) */}
          <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={LINE} />
            <CalloutDot num="2" />
          </div>

          {/* Callout 3 — Icon Left (top left) */}
          <div style={{ position: 'absolute', top: '12px', left: '40%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalloutDot num="3" />
            <div style={LINE} />
          </div>

          {/* Callout 4 — Title (top center-left) */}
          <div style={{ position: 'absolute', top: '12px', left: '46%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalloutDot num="4" />
            <div style={LINE} />
          </div>

          {/* Callout 5 — Description (top center-right) */}
          <div style={{ position: 'absolute', top: '12px', left: '52%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalloutDot num="5" />
            <div style={LINE} />
          </div>

          {/* Callout 6 — Icon Right (top right) */}
          <div style={{ position: 'absolute', top: '12px', left: '60%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalloutDot num="6" />
            <div style={LINE} />
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {t.anatomyParts.map(({ num, label: l, desc }) => (
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

      {/* ── 4. VARIANTS ────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.variantsHeading}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>{t.variantsTagline}</p>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '160px' }}>{t.propertyHeader}</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>{t.valuesHeader}</th>
              </tr>
            </thead>
            <tbody>
              {t.propertyRows.map(({ prop, values }, i, arr) => (
                <tr key={prop} style={{ borderBottom: i < arr.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>{prop}</td>
                  <td style={{ padding: '10px 16px', color: '#6b7280' }}>{values}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual preview of all positions */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {ALL_POSITIONS.map(p => (
            <div key={p} style={{ padding: '32px 24px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>{t.positions[p]}</p>
              <TooltipLive position={p} titleText={t.defaultTitle} descriptionText={t.defaultDescription} brand={brand} />
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ───────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.tokensHeading}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.tokensTagline}
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
              {TOKEN_ROWS.map((row, i) => {
                const resolvedValue = tokens[row.tokenKey as keyof typeof tokens] ?? '—';
                return (
                  <tr key={row.key} style={{
                    borderBottom: i < TOKEN_ROWS.length - 1 ? '1px solid #f3f4f6' : 'none',
                    borderLeft: '3px solid #3b82f6',
                  }}>
                    <td style={{ padding: '10px 16px', color: '#374151', fontWeight: 600 }}>{t.tokenLabels[row.key]}</td>
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

      {/* ── 6. ACCESSIBILITY ───────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.a11yHeading}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.a11yTagline}
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
          {t.usageCards.map(({ t: title, when }) => (
            <div key={title} style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
              <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#111827' }}>{title}</p>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#6b7280', lineHeight: 1.4 }}>{when}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>{t.doLabel}</p>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              {t.doBody}
            </p>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>{t.dontLabel}</p>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              {t.dontBody}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
