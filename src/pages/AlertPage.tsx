import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertLive, type AlertType, type AlertOption } from '../components/alert/AlertLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';

interface AlertPageProps {
  brand: Brand;
  lang?: Language;
}

const COPY = {
  en: {
    typeLabel: 'Type',
    optionLabel: 'Option',
    titleTextLabel: 'Title Text',
    descriptionTextLabel: 'Description Text',
    iconLabel: 'Icon',
    buttonLabel: 'Button',
    titleVisLabel: 'Title',
    descriptionVisLabel: 'Description',
    closeIconLabel: 'Close Icon',
    show: 'Show',
    hide: 'Hide',
    defaultTitle: 'Alert title',
    defaultDescription: 'This is a brief description that provides additional context.',
    title: 'Alert',
    intro:
      'Communicates important messages to the user — feedback, warnings, errors, or neutral notices. Supports five semantic types and two border styles, all driven by brand tokens.',
    pillFeedback: 'Feedback',
    pillStable: 'Stable',
    anatomyHeading: 'Anatomy',
    anatomyIntro: 'Parts of the Alert component and their roles.',
    variantsHeading: 'Variants',
    variantsIntro: 'Available property combinations for the Alert component.',
    propertyHeader: 'Property',
    valuesHeader: 'Values',
    designTokensHeading: 'Design Tokens',
    designTokensIntroPrefix: 'Active tokens for the selected type (',
    designTokensIntroSuffix: ') are highlighted. Switch the Type control above to inspect other states.',
    roleHeader: 'Role',
    tokenHeader: 'Token',
    valueHeader: 'Value',
    swatchHeader: 'Swatch',
    a11yHeading: 'Accessibility',
    a11yIntro: 'Guidance for building inclusive experiences with the Alert component.',
    usageHeading: 'Usage',
    usageIntro: 'When and how to use each alert type.',
    doLabel: 'Do',
    dontLabel: "Don't",
    doBody: 'Keep alert text concise. Use Title for the main message and Description only when extra context genuinely helps.',
    dontBody: "Don't stack multiple alerts of the same type in sequence — consolidate into one message or use a list inside the description.",
    anatomyParts: [
      { num: '1', label: 'Container', desc: 'Carries the background tint and border (top or full) that signals the semantic type.' },
      { num: '2', label: 'Leading icon', desc: 'Semantic icon coloured with the feedback foreground token. Toggle via showIcon prop.' },
      { num: '3', label: 'Title', desc: 'Required. Bold text summarising the message. Never omit — screen readers rely on it.' },
      { num: '4', label: 'Description', desc: 'Optional supporting copy. Uses secondary foreground token for visual hierarchy.' },
      { num: '5', label: 'Dismiss button', desc: 'Optional close control. Must carry aria-label="Dismiss alert". Not focusable when hidden.' },
    ],
    propertyRows: [
      { prop: 'Type', values: 'Information · Success · Warning · Error · Muted' },
      { prop: 'Option', values: 'Top Border · Full Border' },
      { prop: 'Icon', values: 'boolean (default true)' },
      { prop: 'Button', values: 'boolean (default false)' },
      { prop: 'Title', values: 'boolean (default true)' },
      { prop: 'Description', values: 'boolean (default true)' },
      { prop: 'Close Icon', values: 'boolean (default true)' },
    ],
    tokenRows: [
      { label: 'Info bg',        key: 'atom.background.alert.bg-info-lightest',          cssVar: '--atom-background-alert-bg-info-lightest',          types: ['Information'] as AlertType[] },
      { label: 'Info border',    key: 'atom.border.feedback.border-info',                cssVar: '--atom-border-feedback-border-info',                types: ['Information'] as AlertType[] },
      { label: 'Info icon',      key: 'atom.foreground.feedback.fg-info',                cssVar: '--atom-foreground-feedback-fg-info',                types: ['Information'] as AlertType[] },
      { label: 'Success bg',     key: 'atom.background.alert.bg-success-lightest',       cssVar: '--atom-background-alert-bg-success-lightest',       types: ['Success'] as AlertType[] },
      { label: 'Success border', key: 'atom.border.feedback.success-border-color',       cssVar: '--atom-border-feedback-success-border-color',       types: ['Success'] as AlertType[] },
      { label: 'Success icon',   key: 'atom.foreground.feedback.fg-success',             cssVar: '--atom-foreground-feedback-fg-success',             types: ['Success'] as AlertType[] },
      { label: 'Warning bg',     key: 'atom.background.alert.bg-warning-lightest',       cssVar: '--atom-background-alert-bg-warning-lightest',       types: ['Warning'] as AlertType[] },
      { label: 'Warning border', key: 'atom.border.feedback.border-warning',             cssVar: '--atom-border-feedback-border-warning',             types: ['Warning'] as AlertType[] },
      { label: 'Warning icon',   key: 'atom.foreground.feedback.fg-warning',             cssVar: '--atom-foreground-feedback-fg-warning',             types: ['Warning'] as AlertType[] },
      { label: 'Error bg',       key: 'atom.background.alert.bg-error-lightest',         cssVar: '--atom-background-alert-bg-error-lightest',         types: ['Error'] as AlertType[] },
      { label: 'Error border',   key: 'atom.border.feedback.border-error',               cssVar: '--atom-border-feedback-border-error',               types: ['Error'] as AlertType[] },
      { label: 'Error icon',     key: 'atom.foreground.feedback.fg-error',               cssVar: '--atom-foreground-feedback-fg-error',               types: ['Error'] as AlertType[] },
      { label: 'Muted bg',       key: 'atom.background.core.bg-muted',                   cssVar: '--atom-background-core-bg-muted',                   types: ['Muted'] as AlertType[] },
      { label: 'Muted border',   key: 'atom.border.default.border-default',              cssVar: '--atom-border-default-border-default',              types: ['Muted'] as AlertType[] },
      { label: 'Body text',      key: 'atom.foreground.core.fg-primary',                 cssVar: '--atom-foreground-core-fg-primary',                 types: ['Information', 'Success', 'Warning', 'Error', 'Muted'] as AlertType[] },
      { label: 'Secondary text', key: 'atom.foreground.core.fg-secondary',               cssVar: '--atom-foreground-core-fg-secondary',               types: ['Information', 'Success', 'Warning', 'Error', 'Muted'] as AlertType[] },
    ],
    a11yRows: [
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
    ],
    usageCards: [
      { type: 'Information' as AlertType, when: "Neutral guidance, tips, or contextual help that doesn't require immediate action." },
      { type: 'Success' as AlertType, when: 'Confirm a completed action — form submitted, data saved, payment processed.' },
      { type: 'Warning' as AlertType, when: 'The user can still proceed but should be aware of a potential issue or consequence.' },
      { type: 'Error' as AlertType, when: 'An action failed or the user must resolve a blocking problem before continuing.' },
      { type: 'Muted' as AlertType, when: "Low-emphasis notices that don't require semantic colour — system announcements, info bars." },
    ],
  },
  zh: {
    typeLabel: '类型',
    optionLabel: '选项',
    titleTextLabel: '标题文本',
    descriptionTextLabel: '描述文本',
    iconLabel: '图标',
    buttonLabel: '按钮',
    titleVisLabel: '标题',
    descriptionVisLabel: '描述',
    closeIconLabel: '关闭图标',
    show: '显示',
    hide: '隐藏',
    defaultTitle: '警示标题',
    defaultDescription: '这是一段简短描述,提供附加的上下文信息。',
    title: '警示',
    intro:
      '向用户传达重要消息 — 反馈、警告、错误或中性通知。支持五种语义类型和两种边框样式,全部由品牌令牌驱动。',
    pillFeedback: '反馈',
    pillStable: '稳定',
    anatomyHeading: '结构',
    anatomyIntro: '警示组件的各部分及其作用。',
    variantsHeading: '变体',
    variantsIntro: '警示组件可用的属性组合。',
    propertyHeader: '属性',
    valuesHeader: '值',
    designTokensHeading: '设计令牌',
    designTokensIntroPrefix: '所选类型(',
    designTokensIntroSuffix: ')的活动令牌将高亮显示。切换上方的"类型"控件以查看其他状态。',
    roleHeader: '角色',
    tokenHeader: '令牌',
    valueHeader: '值',
    swatchHeader: '色样',
    a11yHeading: '无障碍',
    a11yIntro: '使用警示组件构建包容性体验的指南。',
    usageHeading: '用法',
    usageIntro: '何时以及如何使用每种警示类型。',
    doLabel: '应当',
    dontLabel: '不应',
    doBody: '保持警示文本简洁。将主要消息放在标题中,仅在附加上下文确实有帮助时使用描述。',
    dontBody: '不要连续堆叠同一类型的多个警示 — 整合为一条消息或在描述中使用列表。',
    anatomyParts: [
      { num: '1', label: '容器', desc: '承载背景色调和边框(顶部或完整),用于传达语义类型。' },
      { num: '2', label: '前置图标', desc: '使用反馈前景令牌着色的语义图标。通过 showIcon 属性切换。' },
      { num: '3', label: '标题', desc: '必填。概括消息的粗体文本。切勿省略 — 屏幕阅读器依赖于此。' },
      { num: '4', label: '描述', desc: '可选的辅助文案。使用次级前景令牌建立视觉层级。' },
      { num: '5', label: '关闭按钮', desc: '可选的关闭控件。必须包含 aria-label="Dismiss alert"。隐藏时不可获得焦点。' },
    ],
    propertyRows: [
      { prop: '类型', values: 'Information · Success · Warning · Error · Muted' },
      { prop: '选项', values: 'Top Border · Full Border' },
      { prop: '图标', values: '布尔值(默认 true)' },
      { prop: '按钮', values: '布尔值(默认 false)' },
      { prop: '标题', values: '布尔值(默认 true)' },
      { prop: '描述', values: '布尔值(默认 true)' },
      { prop: '关闭图标', values: '布尔值(默认 true)' },
    ],
    tokenRows: [
      { label: '信息背景',     key: 'atom.background.alert.bg-info-lightest',          cssVar: '--atom-background-alert-bg-info-lightest',          types: ['Information'] as AlertType[] },
      { label: '信息边框',     key: 'atom.border.feedback.border-info',                cssVar: '--atom-border-feedback-border-info',                types: ['Information'] as AlertType[] },
      { label: '信息图标',     key: 'atom.foreground.feedback.fg-info',                cssVar: '--atom-foreground-feedback-fg-info',                types: ['Information'] as AlertType[] },
      { label: '成功背景',     key: 'atom.background.alert.bg-success-lightest',       cssVar: '--atom-background-alert-bg-success-lightest',       types: ['Success'] as AlertType[] },
      { label: '成功边框',     key: 'atom.border.feedback.success-border-color',       cssVar: '--atom-border-feedback-success-border-color',       types: ['Success'] as AlertType[] },
      { label: '成功图标',     key: 'atom.foreground.feedback.fg-success',             cssVar: '--atom-foreground-feedback-fg-success',             types: ['Success'] as AlertType[] },
      { label: '警告背景',     key: 'atom.background.alert.bg-warning-lightest',       cssVar: '--atom-background-alert-bg-warning-lightest',       types: ['Warning'] as AlertType[] },
      { label: '警告边框',     key: 'atom.border.feedback.border-warning',             cssVar: '--atom-border-feedback-border-warning',             types: ['Warning'] as AlertType[] },
      { label: '警告图标',     key: 'atom.foreground.feedback.fg-warning',             cssVar: '--atom-foreground-feedback-fg-warning',             types: ['Warning'] as AlertType[] },
      { label: '错误背景',     key: 'atom.background.alert.bg-error-lightest',         cssVar: '--atom-background-alert-bg-error-lightest',         types: ['Error'] as AlertType[] },
      { label: '错误边框',     key: 'atom.border.feedback.border-error',               cssVar: '--atom-border-feedback-border-error',               types: ['Error'] as AlertType[] },
      { label: '错误图标',     key: 'atom.foreground.feedback.fg-error',               cssVar: '--atom-foreground-feedback-fg-error',               types: ['Error'] as AlertType[] },
      { label: '静默背景',     key: 'atom.background.core.bg-muted',                   cssVar: '--atom-background-core-bg-muted',                   types: ['Muted'] as AlertType[] },
      { label: '静默边框',     key: 'atom.border.default.border-default',              cssVar: '--atom-border-default-border-default',              types: ['Muted'] as AlertType[] },
      { label: '正文文本',     key: 'atom.foreground.core.fg-primary',                 cssVar: '--atom-foreground-core-fg-primary',                 types: ['Information', 'Success', 'Warning', 'Error', 'Muted'] as AlertType[] },
      { label: '次要文本',     key: 'atom.foreground.core.fg-secondary',               cssVar: '--atom-foreground-core-fg-secondary',               types: ['Information', 'Success', 'Warning', 'Error', 'Muted'] as AlertType[] },
    ],
    a11yRows: [
      {
        icon: '🔔',
        title: 'ARIA role="alert"',
        body: '警示容器携带 role="alert",当组件被渲染或更新时,会立即触发屏幕阅读器朗读。对于非紧急消息,优先使用 role="status",以避免打断用户。',
      },
      {
        icon: '🎨',
        title: '颜色对比度',
        body: '标题和描述文本在所有 6 个品牌中均符合 WCAG AA 4.5:1 对比度,衬托其各自的最浅色调背景。图标颜色为装饰性强化 — 文本承载主要含义。',
      },
      {
        icon: '🔤',
        title: '不要仅依赖颜色',
        body: '每种警示类型都将语义图标与彩色边框/背景配对。必须有可见的标题 — 切勿仅通过背景颜色传达严重程度。',
      },
      {
        icon: '⌨️',
        title: '键盘交互',
        body: '关闭按钮是唯一的可交互元素,通过 Tab 接收标准焦点。它必须具有可访问的标签(aria-label="Dismiss alert")。当警示获得焦点时,按 Escape 也应触发关闭。',
      },
      {
        icon: '📢',
        title: '实时区域时机',
        body: '动态注入到 DOM 的警示通过 role="alert" 自动朗读。避免在显示之前在 DOM 中挂载隐藏的警示 — 仅在应朗读时才注入节点。',
      },
    ],
    usageCards: [
      { type: 'Information' as AlertType, when: '中性指引、提示或上下文帮助,不需要立即采取行动。' },
      { type: 'Success' as AlertType, when: '确认已完成的操作 — 表单提交、数据保存、支付处理。' },
      { type: 'Warning' as AlertType, when: '用户仍可继续,但应了解潜在的问题或后果。' },
      { type: 'Error' as AlertType, when: '操作失败或用户必须先解决阻塞问题才能继续。' },
      { type: 'Muted' as AlertType, when: '不需要语义颜色的低强调通知 — 系统公告、信息栏。' },
    ],
  },
} as const;

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

export function AlertPage({ brand, lang = 'en' }: AlertPageProps) {
  const t = COPY[lang];
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  // Interactive preview state
  const [type, setType] = useState<AlertType>('Information');
  const [option, setOption] = useState<AlertOption>('Top Border');
  const [title, setTitle] = useState<string>(t.defaultTitle);
  const [description, setDescription] = useState<string>(t.defaultDescription);
  const [showIcon, setShowIcon] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const [showDismiss, setShowDismiss] = useState(true);

  const alertKey = `${type}-${option}-${title}-${description}-${showIcon}-${showButton}-${showTitle}-${showDescription}-${showDismiss}`;
  const TYPES: AlertType[] = ['Information', 'Success', 'Warning', 'Error', 'Muted'];
  const OPTIONS: AlertOption[] = ['Top Border', 'Full Border'];

  // Active token keys for current type
  const activeTokenKeys = t.tokenRows
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
                  {t.typeLabel}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {TYPES.map(ty => {
                    const isActive = type === ty;
                    const col = TYPE_COLORS[ty];
                    return (
                      <button
                        key={ty}
                        onClick={() => setType(ty)}
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
                        {ty}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Option */}
              <div>
                <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {t.optionLabel}
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
                  {t.titleTextLabel}
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
                  {t.descriptionTextLabel}
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
                  {t.iconLabel}
                </p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  <SegBtn active={showIcon} onClick={() => setShowIcon(true)}>{t.show}</SegBtn>
                  <SegBtn active={!showIcon} onClick={() => setShowIcon(false)}>{t.hide}</SegBtn>
                </div>
              </div>

              {/* Button */}
              <div>
                <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {t.buttonLabel}
                </p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  <SegBtn active={showButton} onClick={() => setShowButton(true)}>{t.show}</SegBtn>
                  <SegBtn active={!showButton} onClick={() => setShowButton(false)}>{t.hide}</SegBtn>
                </div>
              </div>

              {/* Title visibility */}
              <div>
                <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {t.titleVisLabel}
                </p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  <SegBtn active={showTitle} onClick={() => setShowTitle(true)}>{t.show}</SegBtn>
                  <SegBtn active={!showTitle} onClick={() => setShowTitle(false)}>{t.hide}</SegBtn>
                </div>
              </div>

              {/* Description visibility */}
              <div>
                <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {t.descriptionVisLabel}
                </p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  <SegBtn active={showDescription} onClick={() => setShowDescription(true)}>{t.show}</SegBtn>
                  <SegBtn active={!showDescription} onClick={() => setShowDescription(false)}>{t.hide}</SegBtn>
                </div>
              </div>

              {/* Close Icon */}
              <div>
                <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {t.closeIconLabel}
                </p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  <SegBtn active={showDismiss} onClick={() => setShowDismiss(true)}>{t.show}</SegBtn>
                  <SegBtn active={!showDismiss} onClick={() => setShowDismiss(false)}>{t.hide}</SegBtn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ─────────────────────────────────────────────────── */}
      <section>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
          {t.title}
        </h1>
        <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: 1.6, margin: '0 0 16px', maxWidth: '640px' }}>
          {t.intro}
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
            {t.pillFeedback}
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
            {t.pillStable}
          </span>
        </div>
      </section>

      {/* ── 3. ANATOMY ────────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.anatomyHeading}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px' }}>
          {t.anatomyIntro}
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
          <div style={{ width: '100%', maxWidth: '408px', position: 'relative' }}>
            <AlertLive
              type="Information"
              option="Top Border"
              title={t.defaultTitle}
              description={lang === 'zh' ? '简短描述,带附加上下文。' : 'Brief description with additional context.'}
              showIcon={true}
              showDismiss={true}
              brand={brand}
            />

            {/* Callout: 1 Container — line goes up from below alert */}
            <div style={{ position: 'absolute', bottom: '-48px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '1px', height: '32px', backgroundColor: '#94a3b8' }} />
              <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#1e293b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', flexShrink: 0 }}>1</span>
            </div>
            {/* Callout: 2 Leading icon — Figma SVG x≈26/408 = 6.4% */}
            <div style={{ position: 'absolute', top: '-48px', left: '6.4%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#1e293b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', flexShrink: 0 }}>2</span>
              <div style={{ width: '1px', height: '32px', backgroundColor: '#94a3b8' }} />
            </div>
            {/* Callout: 3 Title — Figma SVG x≈60/408 = 14.7% */}
            <div style={{ position: 'absolute', top: '-48px', left: '14.7%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#1e293b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', flexShrink: 0 }}>3</span>
              <div style={{ width: '1px', height: '32px', backgroundColor: '#94a3b8' }} />
            </div>
            {/* Callout: 4 Description — Figma SVG x≈100/408 = 24.5% */}
            <div style={{ position: 'absolute', top: '-48px', left: '24.5%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#1e293b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', flexShrink: 0 }}>4</span>
              <div style={{ width: '1px', height: '32px', backgroundColor: '#94a3b8' }} />
            </div>
            {/* Callout: 5 Dismiss button — Figma SVG x≈386/408 = 94.6% */}
            <div style={{ position: 'absolute', top: '-48px', left: '94.6%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#1e293b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', flexShrink: 0 }}>5</span>
              <div style={{ width: '1px', height: '32px', backgroundColor: '#94a3b8' }} />
            </div>
          </div>
        </div>

        {/* Anatomy legend */}
        <div
          style={{
            marginTop: '16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
          }}
        >
          {t.anatomyParts.map(({ num, label, desc }) => (
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
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827', flexShrink: 0, marginTop: '1px', minWidth: '12px' }}>{num}</span>
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
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.variantsHeading}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>{t.variantsIntro}</p>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '140px' }}>{t.propertyHeader}</th>
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

        {/* Visual preview of all types */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          {(['Information', 'Success', 'Warning', 'Error', 'Muted'] as AlertType[]).map(ty => (
            <AlertLive key={ty} type={ty} option="Top Border" brand={brand} />
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
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.designTokensHeading}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.designTokensIntroPrefix}{type}{t.designTokensIntroSuffix}
        </p>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '130px' }}>{t.roleHeader}</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>{t.tokenHeader}</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '100px' }}>{t.valueHeader}</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '52px' }}>{t.swatchHeader}</th>
              </tr>
            </thead>
            <tbody>
              {t.tokenRows.map((row, i) => {
                const isActive = activeTokenKeys.includes(row.key);
                const resolvedValue = tokens[row.key as keyof typeof tokens] ?? '—';
                return (
                  <tr
                    key={row.key}
                    style={{
                      borderBottom: i < t.tokenRows.length - 1 ? '1px solid #f3f4f6' : 'none',
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
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.a11yHeading}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.a11yIntro}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {t.a11yRows.map(({ icon, title: tt, body }) => (
            <div
              key={tt}
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
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#111827' }}>{tt}</p>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280', lineHeight: 1.5 }}>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. USAGE ─────────────────────────────────────────────────────────── */}
      <section style={{ paddingBottom: '40px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>
          {t.usageHeading}
        </h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.usageIntro}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {t.usageCards.map(({ type: ty, when }) => (
            <div
              key={ty}
              style={{
                padding: '14px 16px',
                borderRadius: '10px',
                border: '1px solid #f3f4f6',
                backgroundColor: '#fafafa',
              }}
            >
              <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#111827' }}>{ty}</p>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#6b7280', lineHeight: 1.4 }}>{when}</p>
            </div>
          ))}
          {/* Do / Don't */}
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>✓ {t.doLabel}</p>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>{t.doBody}</p>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>✗ {t.dontLabel}</p>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>{t.dontBody}</p>
          </div>
        </div>
      </section>

    </div>
  );
}
