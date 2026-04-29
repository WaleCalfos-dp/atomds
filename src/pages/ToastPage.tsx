import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastLive, type ToastVariant } from '../components/toast/ToastLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';

interface ToastPageProps {
  brand: Brand;
  lang?: Language;
}

const COPY = {
  en: {
    property1Label: 'Property 1',
    iconLeftLabel: 'Icon Left',
    closeIconLabel: 'Close Icon',
    textLabel: 'Text',
    visible: 'Visible',
    hidden: 'Hidden',
    placeholder: 'Add text here',
    defaultText: 'Add text here',
    headline: 'Toast',
    tagline:
      'A brief, non-blocking notification that appears in response to a user action and disappears on its own. Use toasts for transient confirmations (Success) or soft warnings (Error) that do not require the user to take action. For content that must persist until acknowledged, use an Alert instead.',
    feedback: 'Feedback',
    stable: 'Stable',
    anatomyHeading: 'Anatomy',
    anatomyTagline: 'The parts that make up a Toast in Figma.',
    toastMessage: 'Toast message',
    numberCol: '#',
    labelCol: 'Label',
    descriptionCol: 'Description',
    parts: [
      { n: 1, label: 'Container',  body: 'The rounded white surface with a subtle border and shadow.' },
      { n: 2, label: 'Icon Left',  body: 'Variant icon — tick for Success, cross for Error. Optional.' },
      { n: 3, label: 'Text',       body: 'Single-line message describing the event. Required.' },
      { n: 4, label: 'Close Icon', body: 'Dismiss affordance on the trailing edge. Optional.' },
    ],
    variantsHeading: 'Variants',
    propertyCol: 'Property',
    valuesCol: 'Values',
    variantRows: [
      {
        label: 'Property 1',
        chips: [
          { text: 'Error',   note: 'Default' },
          { text: 'Success', note: '' },
        ],
      },
      {
        label: 'Booleans (2)',
        chips: [
          { text: 'Close Icon', note: '' },
          { text: 'Icon Left',  note: '' },
        ],
      },
      {
        label: 'Text slots (1)',
        chips: [
          { text: 'Text', note: '' },
        ],
      },
      {
        label: 'Font family',
        chips: [
          { text: 'Poppins', note: 'Dragonpass' },
          { text: 'Arial',   note: 'Mastercard' },
          { text: 'Inter',   note: 'Investec' },
          { text: 'Manrope', note: 'Visa · Greyscale' },
          { text: 'Lato',    note: 'Assurant' },
        ],
      },
    ],
    variantPreviewCards: [
      { key: 'success-full',     label: 'Success · Full' },
      { key: 'error-full',       label: 'Error · Full' },
      { key: 'success-no-close', label: 'Success · No close' },
      { key: 'error-no-icon',    label: 'Error · No icon' },
    ],
    designTokensHeading: 'Design Tokens',
    designTokensTagline:
      'Tokens active for the current variant are highlighted. Values update with the brand selector.',
    tokenCol: 'Token',
    cssVarCol: 'CSS Variable',
    valueCol: 'Value',
    tokenRows: [
      { label: 'Background',      cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff' },
      { label: 'Text colour',     cssVar: '--atom-foreground-primary-fg-brand-primary',   tokenKey: 'atom.foreground.primary.fg-brand-primary',   fallback: '#0a2333' },
      { label: 'Border',          cssVar: '--atom-border-default-border-divider',         tokenKey: 'atom.border.default.border-divider',         fallback: '#cdcbcb' },
      { label: 'Close icon',      cssVar: '--atom-foreground-core-fg-secondary',          tokenKey: 'atom.foreground.core.fg-secondary',          fallback: '#737272' },
      { label: 'Success icon',    cssVar: '--atom-foreground-feedback-fg-success',        tokenKey: 'atom.foreground.feedback.fg-success',        fallback: '#067647', variants: ['Success'] as ToastVariant[] },
      { label: 'Error icon',      cssVar: '--atom-foreground-feedback-fg-error',          tokenKey: 'atom.foreground.feedback.fg-error',          fallback: '#e02d3c', variants: ['Error']   as ToastVariant[] },
    ],
    accessibilityHeading: 'Accessibility',
    accessibilityTagline: 'Guidelines for implementing Toast inclusively.',
    a11yRows: [
      { icon: '📣', title: 'Live region announcement', body: 'Toast renders with role="status" and aria-live="polite" so screen readers announce the message without interrupting the user\'s current task. Reserve role="alert" + aria-live="assertive" for genuinely urgent interruptions only.' },
      { icon: '⌨️', title: 'Keyboard access to the close button', body: 'When Close Icon is visible, it must be a native <button> with an aria-label ("Close", "Dismiss notification"). It receives focus in DOM order and dismisses on Enter or Space.' },
      { icon: '⏱️', title: 'Auto-dismiss timing', body: 'If the toast auto-dismisses, allow at least 5 seconds per 20 words of content. Pause the timer on hover / focus-within so assistive-tech users can finish reading. Offer a persistent Close Icon as a fallback.' },
      { icon: '🎨', title: 'Color is not the only signal', body: 'Success and Error are distinguished by a leading icon (tick vs cross) in addition to color. Never rely on icon-colour alone: always include the semantic icon and a text message.' },
      { icon: '🖼️', title: 'Icon semantics', body: 'Both the variant icon and the close icon are decorative (aria-hidden="true") — the text content of the toast carries the meaning. If the toast describes an action to retry, add an accessible button, not a clickable body.' },
      { icon: '📏', title: 'Spacing & stacking', body: 'When stacking multiple toasts, keep a 12–16px gap and limit the visible queue to three at a time. Each toast\'s touch target (close button) must be ≥ 44×44 CSS pixels per WCAG 2.5.5.' },
    ],
    usageHeading: 'Usage',
    usageTagline: 'When to use each Toast variant — and when to pick a different component.',
    successHeading: 'Success',
    successBody:
      'Confirm that a user-initiated action completed — e.g. "Saved", "Copied to clipboard", "Invite sent". Auto-dismiss after a few seconds; no user action required.',
    errorHeading: 'Error',
    errorBody:
      'Soft, recoverable errors — e.g. "Couldn\'t update profile photo", "Connection lost — retrying". For critical or blocking errors that need acknowledgment, use Alert or Dialog instead.',
    whenToUse: '✓ When to use',
    whenToUseLines: [
      'Transient confirmation of a user-initiated action',
      'Background events the user should know about, but not act on',
      'Keep messages to one line / ~80 characters',
      'Always pair the variant icon with readable text',
      'Expose a Close Icon for users who want to dismiss early',
    ],
    whenNotToUse: '✗ When not to use',
    whenNotToUseLines: [
      "Don't use for content the user must acknowledge — use Alert / Dialog",
      "Don't hide critical errors inside an auto-dismissing toast",
      "Don't stack more than three toasts at once",
      "Don't use Toast for marketing / promotional messages",
      "Don't rely on color alone to distinguish Success from Error",
    ],
  },
  zh: {
    property1Label: '属性 1',
    iconLeftLabel: '左侧图标',
    closeIconLabel: '关闭图标',
    textLabel: '文本',
    visible: '显示',
    hidden: '隐藏',
    placeholder: '在此添加文本',
    defaultText: '在此添加文本',
    headline: '提示消息',
    tagline:
      '一种简短、非阻塞的通知,在响应用户操作时出现,并自行消失。提示消息用于瞬时确认(成功)或柔和警告(错误),用户无需采取行动。对于必须保留直至确认的内容,请改用警告。',
    feedback: '反馈',
    stable: '稳定版',
    anatomyHeading: '结构剖析',
    anatomyTagline: '提示消息在 Figma 中由哪些部分组成。',
    toastMessage: '提示消息',
    numberCol: '#',
    labelCol: '标签',
    descriptionCol: '描述',
    parts: [
      { n: 1, label: '容器',     body: '带有细微边框和阴影的圆角白色表面。' },
      { n: 2, label: '左侧图标', body: '变体图标——成功为对勾,错误为叉号。可选。' },
      { n: 3, label: '文本',     body: '描述事件的单行消息。必填。' },
      { n: 4, label: '关闭图标', body: '尾部边缘的关闭操作。可选。' },
    ],
    variantsHeading: '变体',
    propertyCol: '属性',
    valuesCol: '取值',
    variantRows: [
      {
        label: '属性 1',
        chips: [
          { text: 'Error',   note: '默认' },
          { text: 'Success', note: '' },
        ],
      },
      {
        label: '布尔值 (2)',
        chips: [
          { text: 'Close Icon', note: '' },
          { text: 'Icon Left',  note: '' },
        ],
      },
      {
        label: '文本插槽 (1)',
        chips: [
          { text: 'Text', note: '' },
        ],
      },
      {
        label: '字体',
        chips: [
          { text: 'Poppins', note: 'Dragonpass' },
          { text: 'Arial',   note: 'Mastercard' },
          { text: 'Inter',   note: 'Investec' },
          { text: 'Manrope', note: 'Visa · Greyscale' },
          { text: 'Lato',    note: 'Assurant' },
        ],
      },
    ],
    variantPreviewCards: [
      { key: 'success-full',     label: 'Success · 完整' },
      { key: 'error-full',       label: 'Error · 完整' },
      { key: 'success-no-close', label: 'Success · 无关闭' },
      { key: 'error-no-icon',    label: 'Error · 无图标' },
    ],
    designTokensHeading: '设计令牌',
    designTokensTagline:
      '当前变体激活的令牌已高亮显示。数值会随品牌选择器更新。',
    tokenCol: '令牌',
    cssVarCol: 'CSS 变量',
    valueCol: '值',
    tokenRows: [
      { label: '背景',     cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff' },
      { label: '文本颜色', cssVar: '--atom-foreground-primary-fg-brand-primary',   tokenKey: 'atom.foreground.primary.fg-brand-primary',   fallback: '#0a2333' },
      { label: '边框',     cssVar: '--atom-border-default-border-divider',         tokenKey: 'atom.border.default.border-divider',         fallback: '#cdcbcb' },
      { label: '关闭图标', cssVar: '--atom-foreground-core-fg-secondary',          tokenKey: 'atom.foreground.core.fg-secondary',          fallback: '#737272' },
      { label: '成功图标', cssVar: '--atom-foreground-feedback-fg-success',        tokenKey: 'atom.foreground.feedback.fg-success',        fallback: '#067647', variants: ['Success'] as ToastVariant[] },
      { label: '错误图标', cssVar: '--atom-foreground-feedback-fg-error',          tokenKey: 'atom.foreground.feedback.fg-error',          fallback: '#e02d3c', variants: ['Error']   as ToastVariant[] },
    ],
    accessibilityHeading: '可访问性',
    accessibilityTagline: '以包容方式实现提示消息的指南。',
    a11yRows: [
      { icon: '📣', title: '实时区域播报', body: '提示消息以 role="status" 和 aria-live="polite" 渲染,屏幕阅读器在不打断用户当前任务的前提下播报消息。仅对真正紧急的中断保留 role="alert" + aria-live="assertive"。' },
      { icon: '⌨️', title: '关闭按钮的键盘访问', body: '当关闭图标可见时,它必须是带有 aria-label("Close"、"Dismiss notification")的原生 <button>。它按 DOM 顺序获得焦点,并在 Enter 或 Space 时关闭。' },
      { icon: '⏱️', title: '自动关闭时间', body: '如果提示消息自动关闭,每 20 字内容至少留出 5 秒。在悬停 / focus-within 时暂停计时器,以便辅助技术用户读完。提供持久的关闭图标作为后备。' },
      { icon: '🎨', title: '颜色不是唯一信号', body: '成功和错误除了颜色之外还由前置图标(对勾对叉号)区分。切勿仅依赖图标颜色:始终包含语义图标和文本消息。' },
      { icon: '🖼️', title: '图标语义', body: '变体图标和关闭图标都是装饰性的(aria-hidden="true")——意义由提示消息的文本内容承载。如果提示消息描述需要重试的操作,请添加可访问按钮,而非可点击的主体。' },
      { icon: '📏', title: '间距与堆叠', body: '当堆叠多条提示消息时,保持 12–16px 间距,并将可见队列限制为同时三条。每条提示消息的点击目标(关闭按钮)必须按 WCAG 2.5.5 ≥ 44×44 CSS 像素。' },
    ],
    usageHeading: '用法',
    usageTagline: '何时使用每种提示消息变体——以及何时改用其他组件。',
    successHeading: '成功',
    successBody:
      '确认用户发起的操作已完成——例如"已保存"、"已复制到剪贴板"、"邀请已发送"。几秒后自动关闭;无需用户操作。',
    errorHeading: '错误',
    errorBody:
      '柔和、可恢复的错误——例如"无法更新头像"、"连接丢失——正在重试"。对于需要确认的关键或阻塞性错误,请改用警告或对话框。',
    whenToUse: '✓ 适用场景',
    whenToUseLines: [
      '用户发起操作的瞬时确认',
      '用户应当知晓但无需处理的后台事件',
      '保持消息一行 / 约 80 字符',
      '始终将变体图标与可读文本配对',
      '为想提前关闭的用户提供关闭图标',
    ],
    whenNotToUse: '✗ 不适用场景',
    whenNotToUseLines: [
      '不要用于必须确认的内容——改用警告 / 对话框',
      '不要把关键错误隐藏在自动关闭的提示消息中',
      '不要同时堆叠超过三条提示消息',
      '不要将提示消息用于营销 / 推广信息',
      '不要仅依赖颜色区分成功与错误',
    ],
  },
} as const;

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const ALL_VARIANTS: ToastVariant[] = ['Error', 'Success'];

const VARIANT_PREVIEW_CONFIG: { key: string; v: ToastVariant; il: boolean; ci: boolean }[] = [
  { key: 'success-full',     v: 'Success', il: true,  ci: true  },
  { key: 'error-full',       v: 'Error',   il: true,  ci: true  },
  { key: 'success-no-close', v: 'Success', il: true,  ci: false },
  { key: 'error-no-icon',    v: 'Error',   il: false, ci: true  },
];

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

export function ToastPage({ brand, lang = 'en' }: ToastPageProps) {
  const t = COPY[lang];
  const [variant,       setVariant]       = useState<ToastVariant>('Success');
  const [showIconLeft,  setShowIconLeft]  = useState(true);
  const [showCloseIcon, setShowCloseIcon] = useState(true);
  const [text,          setText]          = useState<string>(t.defaultText);

  const previewKey = `${variant}-${showIconLeft}-${showCloseIcon}-${text}`;
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-72">

            {/* Canvas */}
            <div className="flex-1 flex items-center justify-center p-12 min-h-52" style={DOTTED_BG}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                >
                  <ToastLive
                    variant={variant}
                    showIconLeft={showIconLeft}
                    showCloseIcon={showCloseIcon}
                    text={text}
                    brand={brand}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5 overflow-y-auto">

              {/* Property 1 (Type) */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.property1Label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_VARIANTS.map((v) => (
                    <button
                      key={v}
                      onClick={() => setVariant(v)}
                      className={[
                        'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        variant === v
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon Left */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.iconLeftLabel}</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showIconLeft}
                    onChange={(e) => setShowIconLeft(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 accent-slate-900"
                  />
                  <span className="text-xs text-slate-600">{showIconLeft ? t.visible : t.hidden}</span>
                </label>
              </div>

              {/* Close Icon */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.closeIconLabel}</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCloseIcon}
                    onChange={(e) => setShowCloseIcon(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 accent-slate-900"
                  />
                  <span className="text-xs text-slate-600">{showCloseIcon ? t.visible : t.hidden}</span>
                </label>
              </div>

              {/* Text slot */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.textLabel}</p>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
                  placeholder={t.placeholder}
                />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ────────────────────────────────────────────────── */}
      <section>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{t.headline}</h1>
        <p className="text-[15px] text-slate-500 leading-relaxed mb-4 max-w-2xl">
          {t.tagline}
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-amber-200 bg-amber-50 text-xs text-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {t.feedback}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-emerald-200 bg-emerald-50 text-xs text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {t.stable}
          </span>
        </div>
      </section>

      {/* ── 3. ANATOMY ───────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.anatomyHeading}</h2>
        <p className="text-sm text-slate-500 mb-4">{t.anatomyTagline}</p>
        <div className="grid md:grid-cols-2 gap-6 rounded-xl border border-slate-200 bg-white shadow-sm p-6">

          {/* Diagram */}
          <div className="flex items-center justify-center p-6 rounded-lg border border-slate-100 bg-slate-50">
            <div className="relative">
              <ToastLive variant="Success" showIconLeft showCloseIcon text={t.toastMessage} brand={brand} />
              {/* Annotations */}
              <span className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-semibold flex items-center justify-center shadow">1</span>
              <span className="absolute left-7 -top-3 w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-semibold flex items-center justify-center shadow">2</span>
              <span className="absolute left-1/2 -top-3 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-semibold flex items-center justify-center shadow">3</span>
              <span className="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-semibold flex items-center justify-center shadow">4</span>
            </div>
          </div>

          {/* Numbered parts */}
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-12">{t.numberCol}</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">{t.labelCol}</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.descriptionCol}</th>
                </tr>
              </thead>
              <tbody>
                {t.parts.map((row, i, arr) => (
                  <tr key={row.n} className={i < arr.length - 1 ? 'border-b border-slate-100' : ''}>
                    <td className="px-4 py-2.5 text-xs text-slate-500 font-mono">{row.n}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-700 font-medium">{row.label}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-500">{row.body}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 4. VARIANTS ──────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-4">{t.variantsHeading}</h2>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">{t.propertyCol}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.valuesCol}</th>
              </tr>
            </thead>
            <tbody>
              {t.variantRows.map((row, i, arr) => (
                <tr key={row.label} className={i < arr.length - 1 ? 'border-b border-slate-100' : ''}>
                  <td className="px-5 py-3.5 font-medium text-slate-700 text-sm align-top">{row.label}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      {row.chips.map(({ text, note }) => (
                        <span key={text} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium">
                          {text}{note && <span className="text-slate-400 font-normal">· {note}</span>}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual preview grid — 4 representative variants at rest */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {VARIANT_PREVIEW_CONFIG.map((card, i) => (
            <div key={card.key} style={{
              padding: '20px 24px', borderRadius: '10px',
              border: '1px solid #f3f4f6', backgroundColor: '#fafafa',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px',
            }}>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>{t.variantPreviewCards[i].label}</p>
              <ToastLive variant={card.v} showIconLeft={card.il} showCloseIcon={card.ci} text={t.toastMessage} brand={brand} />
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.designTokensHeading}</h2>
        <p className="text-sm text-slate-500 mb-4">
          {t.designTokensTagline}
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">{t.tokenCol}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.cssVarCol}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">{t.valueCol}</th>
              </tr>
            </thead>
            <tbody>
              {t.tokenRows.map((row, i) => {
                const variants = 'variants' in row ? row.variants : undefined;
                const isActive      = !variants || variants.includes(variant);
                const resolvedValue = (tokens[row.tokenKey as keyof typeof tokens] as string) ?? row.fallback;
                const isHexColor    = resolvedValue.startsWith('#');
                const light         = isHexColor ? isLightColor(resolvedValue) : true;
                return (
                  <tr
                    key={row.cssVar}
                    className={[
                      i < t.tokenRows.length - 1 ? 'border-b border-slate-100' : '',
                      isActive ? 'bg-blue-50/60' : 'opacity-40',
                      'transition-all duration-150',
                    ].join(' ')}
                    style={isActive ? { borderLeft: '3px solid #3b82f6' } : { borderLeft: '3px solid transparent' }}
                  >
                    <td className="px-5 py-3 font-medium text-slate-700 text-xs">{row.label}</td>
                    <td className="px-5 py-3">
                      <code className="font-mono text-xs text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                        {row.cssVar}
                      </code>
                    </td>
                    <td className="px-5 py-3">
                      {isHexColor ? (
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded flex-shrink-0 border border-black/10" style={{ backgroundColor: resolvedValue }} />
                          <span className="font-mono text-xs px-1.5 py-0.5 rounded border"
                            style={{ backgroundColor: resolvedValue, color: light ? '#1e293b' : '#f8fafc', borderColor: light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)' }}>
                            {resolvedValue.toUpperCase()}
                          </span>
                        </div>
                      ) : (
                        <code className="font-mono text-xs text-slate-500">{resolvedValue}</code>
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
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.accessibilityHeading}</h2>
        <p className="text-sm text-slate-500 mb-4">{t.accessibilityTagline}</p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm divide-y divide-slate-100">
          {t.a11yRows.map((row, i) => (
            <div key={row.title} className={['flex items-start gap-4 px-5 py-4', i % 2 === 1 ? 'bg-slate-50/50' : ''].join(' ')}>
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
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{t.usageHeading}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.usageTagline}
        </p>

        {/* Per-variant usage cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>{t.successHeading}</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#4b5563', lineHeight: 1.5 }}>
              {t.successBody}
            </p>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>{t.errorHeading}</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#4b5563', lineHeight: 1.5 }}>
              {t.errorBody}
            </p>
          </div>
        </div>

        {/* Do / Don't */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>{t.whenToUse}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              {t.whenToUseLines.map((line, i) => (
                <li key={i} style={{ marginBottom: i < t.whenToUseLines.length - 1 ? '6px' : 0 }}>• {line}</li>
              ))}
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>{t.whenNotToUse}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              {t.whenNotToUseLines.map((line, i) => (
                <li key={i} style={{ marginBottom: i < t.whenNotToUseLines.length - 1 ? '6px' : 0 }}>• {line}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
