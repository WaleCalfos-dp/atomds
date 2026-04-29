import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InputLive, type InputType, type InputState, type LabelPosition } from '../components/input/InputLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';

interface InputPageProps { brand: Brand; lang?: Language; }

// ─── Bilingual copy block ─────────────────────────────────────────────────
const COPY = {
  en: {
    // Controls
    ctrlType: 'Type',
    ctrlLabelPosition: 'Label Position',
    ctrlState: 'State',
    ctrlFilled: 'Filled',
    ctrlHelperText: 'Helper Text',
    ctrlLabel: 'Label',
    ctrlPlaceholder: 'Placeholder',
    ctrlHelperTextValue: 'Helper Text Value',
    optNo: 'No',
    optYes: 'Yes',
    optOff: 'Off',
    optOn: 'On',
    // Defaults for inputs
    defaultLabel: 'Label',
    defaultPlaceholder: 'Placeholder',
    defaultHelperText: 'Helper text',
    // Section 2 — Component Info
    title: 'Input',
    description:
      'Captures user-entered text or data. Supports multiple types (Basic, Text Area, Search, Password, Phone Number, Verification Code, Payment) and two label positions (Outside, Inside).',
    pillFeedback: 'Feedback',
    pillStable: 'Stable',
    // Section 3 — Anatomy
    anatomyTitle: 'Anatomy',
    anatomyLead: 'Parts of the Input component and their roles.',
    anatomyParts: [
      { num: '1', label: 'Label', desc: '14px text above the field. Color changes to error red in Error state. Required — never omit.' },
      { num: '2', label: 'Input field', desc: '52px height, 8px corner radius. Background and border driven by state tokens. Text Area uses 96px+ height.' },
      { num: '3', label: 'Trailing icon', desc: 'Optional 16×16px icon slot. Used to indicate type (eye for password, search, calendar) or status.' },
      { num: '4', label: 'Helper text', desc: 'Supplemental guidance below the field. Replaced by the error message (red) in Error state.' },
    ],
    // Section 4 — Variants
    variantsTitle: 'Variants',
    variantsLead: 'All 140 variants across 7 types, 2 label positions, 5 states, and 2 fill states.',
    propertyHeader: 'Property',
    valuesHeader: 'Values',
    propertyRows: [
      { prop: 'Type', values: 'Basic · Text Area · Search · Password · Phone Number · Verification Code · Payment' },
      { prop: 'Label Position', values: 'Outside · Inside' },
      { prop: 'State', values: 'Default · Focus · Focus - Accessibility · Error · Disabled' },
      { prop: 'Filled', values: 'No · Yes' },
    ],
    labelPositionPrefix: 'Label Position: ',
    // Section 5 — Design Tokens
    tokensTitle: 'Design Tokens',
    tokensLead1: 'Active tokens for the selected state (',
    tokensLead2: ') are highlighted.',
    roleHeader: 'Role',
    tokenHeader: 'Token',
    valueHeader: 'Value',
    swatchHeader: 'Swatch',
    tokenLabels: {
      'input-bg': 'Input bg',
      'disabled-bg': 'Disabled bg',
      'border-default': 'Default border',
      'border-focus': 'Focus border',
      'focus-ring': 'Focus ring',
      'border-error': 'Error border',
      'border-disabled': 'Disabled border',
      'fg-primary': 'Label / text',
      'fg-secondary': 'Helper text',
      'fg-error': 'Error label / msg',
      'fg-disabled': 'Disabled text',
      'icon-color': 'Icon',
    } as Record<string, string>,
    // Section 6 — Accessibility
    a11yTitle: 'Accessibility',
    a11yLead: 'Guidance for building inclusive form inputs.',
    a11yRows: [
      { icon: '🏷️', title: 'Always use a label', body: 'Every input must have a visible label associated via htmlFor/id or wrapping. Never rely on placeholder text as the only label — it disappears on input.' },
      { icon: '⚠️', title: 'Error messages', body: "Link the error message to the input with aria-describedby. Use aria-invalid=\"true\" on the input when in Error state. Don't rely on color alone." },
      { icon: '⌨️', title: 'Keyboard access', body: 'Inputs are natively focusable. Ensure Tab order is logical. Avoid removing the focus ring without providing an equivalent custom style.' },
      { icon: '🚫', title: 'Disabled state', body: 'Use the disabled HTML attribute. Disabled inputs are excluded from Tab order and announced as unavailable. Provide a visible hint explaining why.' },
      { icon: '📝', title: 'Text Area', body: "For Text Area, set a meaningful rows attribute and allow resize where appropriate. Provide a character count when there's a limit." },
    ],
    // Section 7 — Usage
    usageTitle: 'Usage',
    usageLead: 'When and how to use each Input type.',
    doTitle: '✓ Do',
    dontTitle: "✗ Don't",
    doItems: [
      'Always provide a visible label (Outside or Inside floated)',
      'Use helper text to explain format (e.g. "DD/MM/YYYY")',
      'Use Error state with a specific message, not just color',
      'Use Text Area when users need multi-line input',
    ],
    dontItems: [
      "Don't use placeholder text as the only label",
      "Don't disable without explaining why in nearby text",
      "Don't use Basic for multi-line content — use Text Area",
      "Don't rely on color alone to communicate errors",
    ],
  },
  zh: {
    // Controls
    ctrlType: '类型',
    ctrlLabelPosition: '标签位置',
    ctrlState: '状态',
    ctrlFilled: '是否填充',
    ctrlHelperText: '辅助文本',
    ctrlLabel: '标签',
    ctrlPlaceholder: '占位符',
    ctrlHelperTextValue: '辅助文本内容',
    optNo: '否',
    optYes: '是',
    optOff: '关闭',
    optOn: '开启',
    // Defaults for inputs
    defaultLabel: '标签',
    defaultPlaceholder: '占位符',
    defaultHelperText: '辅助文本',
    // Section 2 — Component Info
    title: '输入框',
    description:
      '用于捕获用户输入的文本或数据。支持多种类型（基础、文本区域、搜索、密码、电话号码、验证码、支付）和两种标签位置（外部、内部）。',
    pillFeedback: '反馈',
    pillStable: '稳定版',
    // Section 3 — Anatomy
    anatomyTitle: '结构剖析',
    anatomyLead: '输入框组件的各个组成部分及其作用。',
    anatomyParts: [
      { num: '1', label: '标签', desc: '位于字段上方的 14px 文本。在错误状态下变为错误红色。必填——切勿省略。' },
      { num: '2', label: '输入字段', desc: '52px 高度，8px 圆角。背景和边框由状态令牌驱动。文本区域高度为 96px 或以上。' },
      { num: '3', label: '尾部图标', desc: '可选的 16×16px 图标槽。用于指示类型（密码的眼睛图标、搜索、日历）或状态。' },
      { num: '4', label: '辅助文本', desc: '位于字段下方的补充指引。在错误状态下被错误消息（红色）替换。' },
    ],
    // Section 4 — Variants
    variantsTitle: '变体',
    variantsLead: '7 种类型、2 种标签位置、5 种状态和 2 种填充状态共 140 个变体。',
    propertyHeader: '属性',
    valuesHeader: '值',
    propertyRows: [
      { prop: '类型', values: '基础 · 文本区域 · 搜索 · 密码 · 电话号码 · 验证码 · 支付' },
      { prop: '标签位置', values: '外部 · 内部' },
      { prop: '状态', values: '默认 · 焦点 · 焦点 - 无障碍 · 错误 · 禁用' },
      { prop: '是否填充', values: '否 · 是' },
    ],
    labelPositionPrefix: '标签位置：',
    // Section 5 — Design Tokens
    tokensTitle: '设计令牌',
    tokensLead1: '所选状态（',
    tokensLead2: '）下的活动令牌已高亮显示。',
    roleHeader: '角色',
    tokenHeader: '设计令牌',
    valueHeader: '值',
    swatchHeader: '色样',
    tokenLabels: {
      'input-bg': '输入框背景',
      'disabled-bg': '禁用背景',
      'border-default': '默认边框',
      'border-focus': '焦点边框',
      'focus-ring': '焦点环',
      'border-error': '错误边框',
      'border-disabled': '禁用边框',
      'fg-primary': '标签 / 文本',
      'fg-secondary': '辅助文本',
      'fg-error': '错误标签 / 消息',
      'fg-disabled': '禁用文本',
      'icon-color': '图标',
    } as Record<string, string>,
    // Section 6 — Accessibility
    a11yTitle: '可访问性',
    a11yLead: '构建包容性表单输入的指引。',
    a11yRows: [
      { icon: '🏷️', title: '始终使用标签', body: '每个输入框都必须有通过 htmlFor/id 或包裹方式关联的可见标签。切勿仅依赖占位符文本作为唯一标签——它会在输入时消失。' },
      { icon: '⚠️', title: '错误消息', body: '通过 aria-describedby 将错误消息与输入框关联。处于错误状态时，在输入框上使用 aria-invalid="true"。不要仅依赖颜色。' },
      { icon: '⌨️', title: '键盘访问', body: '输入框本身可获得焦点。确保 Tab 顺序合乎逻辑。如果移除焦点环，请提供等效的自定义样式。' },
      { icon: '🚫', title: '禁用状态', body: '使用 disabled HTML 属性。禁用的输入框会被排除在 Tab 顺序之外，并被宣告为不可用。请提供可见的提示说明原因。' },
      { icon: '📝', title: '文本区域', body: '对于文本区域，请设置有意义的 rows 属性，并在适当时允许调整大小。当存在字数限制时，提供字符计数。' },
    ],
    // Section 7 — Usage
    usageTitle: '用法',
    usageLead: '何时以及如何使用每种输入框类型。',
    doTitle: '✓ 推荐做法',
    dontTitle: '✗ 避免做法',
    doItems: [
      '始终提供可见的标签（外部或内部浮动）',
      '使用辅助文本说明格式（例如 "DD/MM/YYYY"）',
      '在错误状态中使用具体消息，而不仅是颜色',
      '当用户需要多行输入时，使用文本区域',
    ],
    dontItems: [
      '不要将占位符文本作为唯一标签',
      '禁用输入框时若不在附近文本中说明原因',
      '不要将基础类型用于多行内容——请使用文本区域',
      '不要仅依赖颜色来传达错误信息',
    ],
  },
} as const;

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

const ALL_TYPES: InputType[] = ['Basic', 'Text Area', 'Search', 'Password', 'Phone Number', 'Verification Code', 'Payment'];
const ALL_LABEL_POSITIONS: LabelPosition[] = ['Outside', 'Inside'];
const ALL_STATES: InputState[] = ['Default', 'Focus', 'Focus - Accessibility', 'Error', 'Disabled'];

const LABEL_STYLE: React.CSSProperties = {
  margin: '0 0 8px', fontSize: '11px', fontWeight: 600,
  color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em',
};

const SEG_BASE: React.CSSProperties = {
  padding: '6px 12px', fontSize: '12px', border: '1px solid #e5e7eb',
  borderRadius: '6px', cursor: 'pointer', background: 'white', color: '#374151',
  fontFamily: 'system-ui,-apple-system,sans-serif', fontWeight: 500, textAlign: 'left',
};
const SEG_ACTIVE: React.CSSProperties = { ...SEG_BASE, background: '#111827', color: '#fff', borderColor: '#111827' };

type TokenRow = { key: string; tokenKey: string; cssVar: string; activeWhen: (s: InputState) => boolean };

const TOKEN_ROWS: TokenRow[] = [
  { key: 'input-bg',        tokenKey: 'atom.background.primary.bg-primary-inverse',                   cssVar: '--atom-background-primary-bg-primary-inverse',                   activeWhen: s => s === 'Default' || s === 'Focus' || s === 'Focus - Accessibility' },
  { key: 'disabled-bg',     tokenKey: 'atom.background.primary.bg-primary-disabled',                  cssVar: '--atom-background-primary-bg-primary-disabled',                  activeWhen: s => s === 'Disabled' },
  { key: 'border-default',  tokenKey: 'atom.border.default.border-default',                           cssVar: '--atom-border-default-border-default',                           activeWhen: s => s === 'Default' || s === 'Focus - Accessibility' },
  { key: 'border-focus',    tokenKey: 'atom.border.selection-and-focus.border-primary-focus',         cssVar: '--atom-border-selection-and-focus-border-primary-focus',         activeWhen: s => s === 'Focus' },
  { key: 'focus-ring',      tokenKey: 'atom.border.selection-and-focus.border-secondary-focus',       cssVar: '--atom-border-selection-and-focus-border-secondary-focus',       activeWhen: s => s === 'Focus' || s === 'Focus - Accessibility' },
  { key: 'border-error',    tokenKey: 'atom.border.feedback.border-error',                            cssVar: '--atom-border-feedback-border-error',                            activeWhen: s => s === 'Error' },
  { key: 'border-disabled', tokenKey: 'atom.border.states.border-disabled',                          cssVar: '--atom-border-states-border-disabled',                          activeWhen: s => s === 'Disabled' },
  { key: 'fg-primary',      tokenKey: 'atom.foreground.core.fg-primary',                             cssVar: '--atom-foreground-core-fg-primary',                             activeWhen: s => s === 'Default' || s === 'Focus' || s === 'Focus - Accessibility' },
  { key: 'fg-secondary',    tokenKey: 'atom.foreground.core.fg-secondary',                           cssVar: '--atom-foreground-core-fg-secondary',                           activeWhen: s => s === 'Default' || s === 'Focus' || s === 'Focus - Accessibility' },
  { key: 'fg-error',        tokenKey: 'atom.foreground.feedback.fg-error',                           cssVar: '--atom-foreground-feedback-fg-error',                           activeWhen: s => s === 'Error' },
  { key: 'fg-disabled',     tokenKey: 'atom.foreground.states.fg-disabled',                          cssVar: '--atom-foreground-states-fg-disabled',                          activeWhen: s => s === 'Disabled' },
  { key: 'icon-color',      tokenKey: 'atom.foreground.core.fg-interactive-icon',                    cssVar: '--atom-foreground-core-fg-interactive-icon',                    activeWhen: s => s === 'Default' || s === 'Focus' || s === 'Focus - Accessibility' },
];

export function InputPage({ brand, lang = 'en' }: InputPageProps) {
  const t = COPY[lang];
  const [type, setType] = useState<InputType>('Basic');
  const [labelPosition, setLabelPosition] = useState<LabelPosition>('Outside');
  const [state, setState] = useState<InputState>('Default');
  const [filled, setFilled] = useState(false);
  const [label, setLabel] = useState<string>(t.defaultLabel);
  const [placeholder, setPlaceholder] = useState<string>(t.defaultPlaceholder);
  const [helperText, setHelperText] = useState<string>(t.defaultHelperText);
  const [showHelperText, setShowHelperText] = useState(true);

  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];
  const previewKey = `${type}-${labelPosition}-${state}-${filled}-${showHelperText}`;

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ─────────────────────────────────────────── */}
      <section>
        <div style={{ borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', background: 'white' }}>
          <div style={{ display: 'flex', flexDirection: 'row', minHeight: '320px' }}>

            {/* Canvas */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px', ...DOTTED_BG }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                >
                  <InputLive
                    type={type}
                    labelPosition={labelPosition}
                    state={state}
                    filled={filled}
                    label={label}
                    placeholder={placeholder}
                    helperText={helperText}
                    showHelperText={showHelperText}
                    brand={brand}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div style={{ width: '196px', borderLeft: '1px solid #e5e7eb', padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px', backgroundColor: '#fafafa', flexShrink: 0, overflowY: 'auto' }}>
              <div>
                <p style={LABEL_STYLE}>{t.ctrlType}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {ALL_TYPES.map(ty => (
                    <button key={ty} onClick={() => setType(ty)} style={type === ty ? SEG_ACTIVE : SEG_BASE}>{ty}</button>
                  ))}
                </div>
              </div>
              <div>
                <p style={LABEL_STYLE}>{t.ctrlLabelPosition}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {ALL_LABEL_POSITIONS.map(lp => (
                    <button key={lp} onClick={() => setLabelPosition(lp)} style={labelPosition === lp ? SEG_ACTIVE : SEG_BASE}>{lp}</button>
                  ))}
                </div>
              </div>
              <div>
                <p style={LABEL_STYLE}>{t.ctrlState}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {ALL_STATES.map(s => (
                    <button key={s} onClick={() => setState(s)} style={state === s ? SEG_ACTIVE : SEG_BASE}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <p style={LABEL_STYLE}>{t.ctrlFilled}</p>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button onClick={() => setFilled(false)} style={!filled ? SEG_ACTIVE : SEG_BASE}>{t.optNo}</button>
                  <button onClick={() => setFilled(true)} style={filled ? SEG_ACTIVE : SEG_BASE}>{t.optYes}</button>
                </div>
              </div>
              <div>
                <p style={LABEL_STYLE}>{t.ctrlHelperText}</p>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button onClick={() => setShowHelperText(false)} style={!showHelperText ? SEG_ACTIVE : SEG_BASE}>{t.optOff}</button>
                  <button onClick={() => setShowHelperText(true)} style={showHelperText ? SEG_ACTIVE : SEG_BASE}>{t.optOn}</button>
                </div>
              </div>
              <div>
                <p style={LABEL_STYLE}>{t.ctrlLabel}</p>
                <input value={label} onChange={e => setLabel(e.target.value)} style={{ width: '100%', padding: '6px 8px', fontSize: '12px', border: '1px solid #e5e7eb', borderRadius: '6px', boxSizing: 'border-box', fontFamily: 'system-ui,-apple-system,sans-serif' }} />
              </div>
              <div>
                <p style={LABEL_STYLE}>{t.ctrlPlaceholder}</p>
                <input value={placeholder} onChange={e => setPlaceholder(e.target.value)} style={{ width: '100%', padding: '6px 8px', fontSize: '12px', border: '1px solid #e5e7eb', borderRadius: '6px', boxSizing: 'border-box', fontFamily: 'system-ui,-apple-system,sans-serif' }} />
              </div>
              <div>
                <p style={LABEL_STYLE}>{t.ctrlHelperTextValue}</p>
                <input value={helperText} onChange={e => setHelperText(e.target.value)} style={{ width: '100%', padding: '6px 8px', fontSize: '12px', border: '1px solid #e5e7eb', borderRadius: '6px', boxSizing: 'border-box', fontFamily: 'system-ui,-apple-system,sans-serif' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ──────────────────────────────────────────────── */}
      <section>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>{t.title}</h1>
        <p style={{ fontSize: '15px', color: '#6b7280', margin: '0 0 16px', lineHeight: 1.6 }}>
          {t.description}
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', border: '1px solid #e5e7eb', backgroundColor: 'white', fontFamily: 'system-ui,-apple-system,sans-serif' }}>{t.pillFeedback}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', border: '1px solid #dcfce7', backgroundColor: '#f0fdf4', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} /> {t.pillStable}
          </span>
        </div>
      </section>

      {/* ── 3. ANATOMY ─────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.anatomyTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px' }}>{t.anatomyLead}</p>
        <div style={{ ...DOTTED_BG, borderRadius: '12px', padding: '72px 48px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: '240px' }}>
          <div>
            <InputLive state="Default" label={t.defaultLabel} placeholder={t.defaultPlaceholder} helperText={t.defaultHelperText} brand={brand} />
          </div>
          {/* #1 Label — above left */}
          <div style={{ position: 'absolute', top: '16px', left: '32%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalloutDot num="1" />
            <div style={LINE} />
          </div>
          {/* #2 Input field — below center */}
          <div style={{ position: 'absolute', bottom: '48px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={LINE} />
            <CalloutDot num="2" />
          </div>
          {/* #3 Trailing icon — above right */}
          <div style={{ position: 'absolute', top: '16px', left: '68%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalloutDot num="3" />
            <div style={LINE} />
          </div>
          {/* #4 Helper text — bottom left */}
          <div style={{ position: 'absolute', bottom: '16px', left: '32%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={LINE} />
            <CalloutDot num="4" />
          </div>
        </div>
        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {t.anatomyParts.map(({ num, label: l, desc }) => (
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
        <h2 id="variants" className="text-base font-semibold text-slate-900 mb-1">{t.variantsTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>{t.variantsLead}</p>

        {/* Properties table */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden', marginBottom: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>{t.propertyHeader}</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>{t.valuesHeader}</th>
              </tr>
            </thead>
            <tbody>
              {t.propertyRows.map(({ prop, values }, i) => (
                <tr key={prop} style={{ borderBottom: i < 3 ? '1px solid #f3f4f6' : 'none' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>{prop}</td>
                  <td style={{ padding: '10px 16px', color: '#6b7280' }}>{values}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Full variant grid — one section per Type */}
        {ALL_TYPES.map(ty => (
          <div key={ty} style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 12px', fontFamily: 'system-ui,-apple-system,sans-serif' }}>{ty}</h3>

            {ALL_LABEL_POSITIONS.map(lp => (
              <div key={lp} style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
                  {t.labelPositionPrefix}{lp}
                </p>
                <div style={{ ...DOTTED_BG, borderRadius: '12px', padding: '24px', overflow: 'auto' }}>
                  {/* Unfilled row */}
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${ALL_STATES.length}, 1fr)`, gap: '12px', marginBottom: '16px', alignItems: 'start' }}>
                    {ALL_STATES.map(s => (
                      <div key={s} style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ transform: 'scale(0.72)', transformOrigin: 'top center' }}>
                          <InputLive type={ty} labelPosition={lp} state={s} filled={false} brand={brand} />
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Filled row */}
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${ALL_STATES.length}, 1fr)`, gap: '12px', alignItems: 'start' }}>
                    {ALL_STATES.map(s => (
                      <div key={s} style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ transform: 'scale(0.72)', transformOrigin: 'top center' }}>
                          <InputLive type={ty} labelPosition={lp} state={s} filled={true} brand={brand} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>

      {/* ── 5. DESIGN TOKENS ───────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.tokensTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.tokensLead1}{state}{t.tokensLead2}
        </p>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '150px' }}>{t.roleHeader}</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>{t.tokenHeader}</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '100px' }}>{t.valueHeader}</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '52px' }}>{t.swatchHeader}</th>
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
                    <td style={{ padding: '10px 16px', color: '#374151', fontWeight: isActive ? 600 : 400 }}>{t.tokenLabels[row.key] ?? row.key}</td>
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
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.a11yTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>{t.a11yLead}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {t.a11yRows.map(({ icon, title, body }) => (
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
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{t.usageTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>{t.usageLead}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>{t.doTitle}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.5 }}>
              {t.doItems.map((item, i) => (
                <li key={i} style={{ marginBottom: i < t.doItems.length - 1 ? '6px' : 0 }}>• {item}</li>
              ))}
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>{t.dontTitle}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.5 }}>
              {t.dontItems.map((item, i) => (
                <li key={i} style={{ marginBottom: i < t.dontItems.length - 1 ? '6px' : 0 }}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
