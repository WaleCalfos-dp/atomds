import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DialogLive, type DialogPlatform, type DialogType } from '../components/dialog/DialogLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';

interface DialogPageProps {
  brand: Brand;
  lang?: Language;
}

const COPY = {
  en: {
    typeLabel: 'Type',
    platformLabel: 'Platform',
    secondaryLabel: 'Secondary button',
    tertiaryLabel: 'Tertiary button',
    closeLabel: 'Close button',
    showLabel: 'Show',
    hideLabel: 'Hide',
    typeNames: { Info: 'Info', Success: 'Success', Warning: 'Warning', Error: 'Error' } as Record<DialogType, string>,
    platformNames: { App: 'App', Desktop: 'Desktop' } as Record<DialogPlatform, string>,
    headline: 'Dialog',
    tagline:
      'Displays focused content that requires user interaction without leaving the current page. Use for confirmations, acknowledgements, or critical messages. Ships in two platform layouts (App · Desktop) and four semantic types (Info · Success · Warning · Error).',
    feedbackPill: 'Feedback',
    stablePill: 'Stable',
    anatomyHeading: 'Anatomy',
    anatomyTagline:
      'The Dialog composes five parts. The close button is Desktop-only; Tertiary and Secondary buttons are optional.',
    anatomyParts: [
      { num: '1', name: 'Close button',  desc: 'Desktop-only. 40×40 circular button, 1px default-border, top-right corner. aria-label="Close".' },
      { num: '2', name: 'Icon',          desc: 'Type-specific colour signals severity. 20×20 (App) / 32×32 (Desktop). Decorative — aria-hidden.' },
      { num: '3', name: 'Title',         desc: 'Cabin Medium 20 / 30. Colour fg-brand-primary. Centred. Becomes aria-labelledby for the dialog.' },
      { num: '4', name: 'Description',   desc: 'Poppins Regular 14 / 20. Colour fg-primary. Centred. Becomes aria-describedby for the dialog.' },
      { num: '5', name: 'Button stack',  desc: 'Full-width vertical stack. Primary (filled), Secondary (outlined), Tertiary (blue link). Radius 999px.' },
    ],
    variantsHeading: 'Variants',
    propertyHeader: 'Property',
    valuesHeader: 'Values',
    variantRowLabels: {
      type: 'Type',
      platform: 'Platform',
      secondary: 'Secondary button',
      tertiary: 'Tertiary button',
      close: 'Close button',
    },
    showHide: 'Show · Hide',
    showHideDesktopOnly: 'Show · Hide (Desktop only)',
    tokensHeading: 'Design Tokens',
    tokensTagline:
      'The container, buttons, and text all resolve against brand tokens. Icon colours use fixed signal hexes per type (shown below the table).',
    tokenColumn: 'Token',
    cssVarColumn: 'CSS Variable',
    valueColumnTpl: (b: string) => `Value (${b})`,
    tokenLabels: {
      'Card background':   'Card background',
      'Primary button bg': 'Primary button bg',
      'Primary button fg': 'Primary button fg',
      'Title / outline':   'Title / outline',
      'Body text':         'Body text',
      'Tertiary link':     'Tertiary link',
      'Close border':      'Close border',
      'Secondary border':  'Secondary border',
    } as Record<string, string>,
    iconLabelTpl: (typeName: string) => `${typeName} icon`,
    a11yHeading: 'Accessibility',
    a11yTagline: 'Guidelines for implementing Dialog inclusively.',
    a11yRows: [
      { icon: '🪟', title: 'Modal semantics',  body: 'Uses role="dialog" with aria-modal="true" plus aria-labelledby / aria-describedby so assistive tech announces the title and description when the dialog opens.' },
      { icon: '🎯', title: 'Focus management', body: 'When opened, move focus to the first actionable control (usually the primary button). When closed, return focus to the trigger. Trap focus inside the dialog while it is open.' },
      { icon: '⌨️', title: 'Keyboard interaction', body: 'Esc dismisses the dialog. Tab / Shift+Tab cycles between the close button and Primary / Secondary / Tertiary actions. Enter activates the focused button.' },
      { icon: '🎨', title: 'Not color alone',  body: 'Icon colour (blue / green / amber / red) communicates severity, but the Title and Description always carry the underlying message in plain language.' },
      { icon: '👁️', title: 'Contrast',          body: 'Title on white (#0a2333 on #ffffff), body text (#4b4a4a on #ffffff), and button label on #0a2333 all exceed WCAG AA 4.5:1. Icon tints meet AA for non-text contrast.' },
    ],
    usageHeading: 'Usage',
    usageTagline: 'When and how to use the Dialog component.',
    whenToUseLabel: '✓ When to use',
    whenNotToUseLabel: '✗ When not to use',
    whenToUse: [
      'Confirm a destructive or irreversible action (delete, cancel booking)',
      'Surface critical information that blocks further progress',
      'Acknowledge the outcome of a user action (Success after submit)',
      'Collect small pieces of input required before continuing',
    ],
    whenNotToUse: [
      "Don't use for non-critical notifications — use Toast or Inline Banner",
      "Don't stack dialogs; resolve one before opening another",
      "Don't use for complex multi-step forms — route to a page instead",
      "Don't show a dialog automatically on page load without user intent",
    ],
  },
  zh: {
    typeLabel: '类型',
    platformLabel: '平台',
    secondaryLabel: '次要按钮',
    tertiaryLabel: '第三层按钮',
    closeLabel: '关闭按钮',
    showLabel: '显示',
    hideLabel: '隐藏',
    typeNames: { Info: '信息', Success: '成功', Warning: '警告', Error: '错误' } as Record<DialogType, string>,
    platformNames: { App: '应用', Desktop: '桌面' } as Record<DialogPlatform, string>,
    headline: '对话框',
    tagline: '在不离开当前页面的情况下显示需要用户交互的聚焦内容。用于确认、确认操作或关键消息。提供两种平台布局(应用 · 桌面)和四种语义类型(信息 · 成功 · 警告 · 错误)。',
    feedbackPill: '反馈',
    stablePill: '稳定版',
    anatomyHeading: '结构剖析',
    anatomyTagline: '对话框由五个部分组成。关闭按钮仅桌面端可用;第三层和次要按钮是可选的。',
    anatomyParts: [
      { num: '1', name: '关闭按钮',     desc: '仅桌面端可用。40×40 圆形按钮,1px 默认边框,位于右上角。aria-label="Close"。' },
      { num: '2', name: '图标',         desc: '类型相关的颜色提示严重性。20×20(应用) / 32×32(桌面)。装饰性 — aria-hidden。' },
      { num: '3', name: '标题',         desc: 'Cabin Medium 20 / 30。颜色 fg-brand-primary。居中。作为对话框的 aria-labelledby。' },
      { num: '4', name: '描述',         desc: 'Poppins Regular 14 / 20。颜色 fg-primary。居中。作为对话框的 aria-describedby。' },
      { num: '5', name: '按钮堆',       desc: '全宽垂直堆叠。主要(填充)、次要(描边)、第三层(蓝色链接)。半径 999px。' },
    ],
    variantsHeading: '变体',
    propertyHeader: '属性',
    valuesHeader: '值',
    variantRowLabels: {
      type: '类型',
      platform: '平台',
      secondary: '次要按钮',
      tertiary: '第三层按钮',
      close: '关闭按钮',
    },
    showHide: '显示 · 隐藏',
    showHideDesktopOnly: '显示 · 隐藏(仅桌面端)',
    tokensHeading: '设计令牌',
    tokensTagline: '容器、按钮和文本均基于品牌令牌解析。图标颜色按类型使用固定信号色(在表格下方显示)。',
    tokenColumn: '令牌',
    cssVarColumn: 'CSS 变量',
    valueColumnTpl: (b: string) => `数值 (${b})`,
    tokenLabels: {
      'Card background':   '卡片背景',
      'Primary button bg': '主要按钮背景',
      'Primary button fg': '主要按钮前景',
      'Title / outline':   '标题 / 描边',
      'Body text':         '正文文本',
      'Tertiary link':     '第三层链接',
      'Close border':      '关闭边框',
      'Secondary border':  '次要边框',
    } as Record<string, string>,
    iconLabelTpl: (typeName: string) => `${typeName} 图标`,
    a11yHeading: '可访问性',
    a11yTagline: '包容性实现对话框的指南。',
    a11yRows: [
      { icon: '🪟', title: '模态语义',     body: '使用 role="dialog" 和 aria-modal="true",并搭配 aria-labelledby / aria-describedby,使辅助技术在对话框打开时播报标题和描述。' },
      { icon: '🎯', title: '焦点管理',     body: '打开时,将焦点移到第一个可操作控件(通常是主按钮)。关闭时,焦点返回触发元素。打开期间将焦点限定在对话框内。' },
      { icon: '⌨️', title: '键盘交互',     body: 'Esc 关闭对话框。Tab / Shift+Tab 在关闭按钮与主要/次要/第三层操作之间循环。Enter 激活焦点按钮。' },
      { icon: '🎨', title: '不仅依赖颜色', body: '图标颜色(蓝/绿/琥珀/红)传达严重性,但标题和描述始终以清晰的语言传达底层信息。' },
      { icon: '👁️', title: '对比度',       body: '标题在白色背景上(#0a2333 on #ffffff)、正文文本(#4b4a4a on #ffffff)以及 #0a2333 上的按钮标签均超过 WCAG AA 4.5:1。图标色调满足 AA 非文本对比度。' },
    ],
    usageHeading: '用法',
    usageTagline: '何时及如何使用对话框组件。',
    whenToUseLabel: '✓ 适用场景',
    whenNotToUseLabel: '✗ 不适用场景',
    whenToUse: [
      '确认破坏性或不可逆的操作(删除、取消预订)',
      '显示阻止进一步进程的关键信息',
      '确认用户操作的结果(提交后的成功)',
      '在继续之前收集少量必要输入',
    ],
    whenNotToUse: [
      '不要用于非关键通知 — 使用提示消息或行内横幅',
      '不要堆叠对话框;解决一个再打开下一个',
      '不要用于复杂的多步表单 — 改用单独页面',
      '不要在页面加载时自动显示对话框,除非用户主动触发',
    ],
  },
} as const;

// ─── Token map for the design tokens table ───────────────────────────────────
const TOKEN_TABLE_ROWS: {
  labelKey: string;
  key: string;
  cssVar: string;
  types: DialogType[];
}[] = [
  { labelKey: 'Card background',   key: 'atom.background.primary.bg-primary-inverse',       cssVar: '--atom-background-primary-bg-primary-inverse',       types: ['Info', 'Success', 'Warning', 'Error'] },
  { labelKey: 'Primary button bg', key: 'atom.background.primary.bg-primary-default',       cssVar: '--atom-background-primary-bg-primary-default',       types: ['Info', 'Success', 'Warning', 'Error'] },
  { labelKey: 'Primary button fg', key: 'atom.foreground.primary.fg-brand-primary-inverse', cssVar: '--atom-foreground-primary-fg-brand-primary-inverse', types: ['Info', 'Success', 'Warning', 'Error'] },
  { labelKey: 'Title / outline',   key: 'atom.foreground.primary.fg-brand-primary',         cssVar: '--atom-foreground-primary-fg-brand-primary',         types: ['Info', 'Success', 'Warning', 'Error'] },
  { labelKey: 'Body text',         key: 'atom.foreground.core.fg-primary',                  cssVar: '--atom-foreground-core-fg-primary',                  types: ['Info', 'Success', 'Warning', 'Error'] },
  { labelKey: 'Tertiary link',     key: 'atom.foreground.core.fg-link',                     cssVar: '--atom-foreground-core-fg-link',                     types: ['Info', 'Success', 'Warning', 'Error'] },
  { labelKey: 'Close border',      key: 'atom.border.default.border-default',               cssVar: '--atom-border-default-border-default',               types: ['Info', 'Success', 'Warning', 'Error'] },
  { labelKey: 'Secondary border',  key: 'atom.border.default.border-default-brand',         cssVar: '--atom-border-default-border-default-brand',         types: ['Info', 'Success', 'Warning', 'Error'] },
];

const TYPE_ICON_COLOR: Record<DialogType, string> = {
  Info:    '#006B99',
  Success: '#067647',
  Warning: '#D6A025',
  Error:   '#E02D3C',
};

// ─── Dotted canvas background ────────────────────────────────────────────────
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

function SegBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '5px 4px',
        borderRadius: '6px',
        border: 'none',
        backgroundColor: active ? '#fff' : 'transparent',
        color: active ? '#111827' : '#6b7280',
        fontSize: '11px',
        fontWeight: active ? 600 : 400,
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

const PLATFORMS: DialogPlatform[] = ['App', 'Desktop'];
const DIALOG_TYPES: DialogType[] = ['Info', 'Success', 'Warning', 'Error'];

export function DialogPage({ brand, lang = 'en' }: DialogPageProps) {
  const t = COPY[lang];
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  const [platform, setPlatform] = useState<DialogPlatform>('Desktop');
  const [dialogType, setDialogType] = useState<DialogType>('Info');
  const [showSecondary, setShowSecondary] = useState(true);
  const [showTertiary, setShowTertiary] = useState(true);
  const [showClose, setShowClose] = useState(true);

  const previewKey = `${platform}-${dialogType}-${showSecondary}-${showTertiary}-${showClose}`;

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────── */}
      <section>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden', background: '#fff' }}>
          <div style={{ display: 'flex', minHeight: '520px' }}>
            <div style={{ flex: 1, ...DOTTED_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', minWidth: 0, overflow: 'auto' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <DialogLive
                    platform={platform}
                    dialogType={dialogType}
                    showSecondary={showSecondary}
                    showTertiary={showTertiary}
                    showClose={showClose}
                    showOverlay={false}
                    brand={brand}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div style={{ width: '240px', flexShrink: 0, borderLeft: '1px solid #e5e7eb', backgroundColor: '#fff', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <p style={LABEL_STYLE}>{t.typeLabel}</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  {DIALOG_TYPES.map((dt) => (
                    <SegBtn key={dt} active={dialogType === dt} onClick={() => setDialogType(dt)}>
                      {t.typeNames[dt]}
                    </SegBtn>
                  ))}
                </div>
              </div>
              <div>
                <p style={LABEL_STYLE}>{t.platformLabel}</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  {PLATFORMS.map((p) => (
                    <SegBtn key={p} active={platform === p} onClick={() => setPlatform(p)}>
                      {t.platformNames[p]}
                    </SegBtn>
                  ))}
                </div>
              </div>
              <div>
                <p style={LABEL_STYLE}>{t.secondaryLabel}</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  <SegBtn active={showSecondary} onClick={() => setShowSecondary(true)}>{t.showLabel}</SegBtn>
                  <SegBtn active={!showSecondary} onClick={() => setShowSecondary(false)}>{t.hideLabel}</SegBtn>
                </div>
              </div>
              <div>
                <p style={LABEL_STYLE}>{t.tertiaryLabel}</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  <SegBtn active={showTertiary} onClick={() => setShowTertiary(true)}>{t.showLabel}</SegBtn>
                  <SegBtn active={!showTertiary} onClick={() => setShowTertiary(false)}>{t.hideLabel}</SegBtn>
                </div>
              </div>
              {platform === 'Desktop' && (
                <div>
                  <p style={LABEL_STYLE}>{t.closeLabel}</p>
                  <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                    <SegBtn active={showClose} onClick={() => setShowClose(true)}>{t.showLabel}</SegBtn>
                    <SegBtn active={!showClose} onClick={() => setShowClose(false)}>{t.hideLabel}</SegBtn>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ────────────────────────────────────────────── */}
      <section>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">{t.headline}</h1>
            <p className="text-slate-500 text-sm max-w-xl">
              {t.tagline}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.25" />
                <path d="M5 3v3M5 7.5v.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              </svg>
              {t.feedbackPill}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {t.stablePill}
            </span>
          </div>
        </div>
      </section>

      <hr className="border-slate-200" />

      {/* ── 3. ANATOMY ───────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.anatomyHeading}</h2>
        <p className="text-sm text-slate-500 mb-5">
          {t.anatomyTagline}
        </p>

        <div className="relative flex items-center justify-center py-20 px-8 rounded-xl" style={DOTTED_BG}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <DialogLive
              platform="Desktop"
              dialogType="Info"
              showSecondary
              showTertiary
              showClose
              showOverlay={false}
              brand={brand}
            />

            <Callout num="1" style={{ top: '10px', right: '-44px' }} connector="left" />
            <Callout num="2" style={{ top: '56px', left: '-44px' }} connector="right" />
            <Callout num="3" style={{ top: '132px', right: '-44px' }} connector="left" />
            <Callout num="4" style={{ top: '170px', left: '-44px' }} connector="right" />
            <Callout num="5" style={{ bottom: '-40px', left: '50%', transform: 'translateX(-50%)' }} connector="up" />
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {t.anatomyParts.map((row) => (
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

      {/* ── 4. VARIANTS ──────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-4">{t.variantsHeading}</h2>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">{t.propertyHeader}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.valuesHeader}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">{t.variantRowLabels.type}</td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1.5">
                    {DIALOG_TYPES.map((dt) => (
                      <span
                        key={dt}
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium"
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: TYPE_ICON_COLOR[dt], border: `1px solid ${TYPE_ICON_COLOR[dt]}` }}
                        />
                        {t.typeNames[dt]}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">{t.variantRowLabels.platform}</td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1.5">
                    {PLATFORMS.map((p) => (
                      <span
                        key={p}
                        className="inline-flex items-center px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium"
                      >
                        {t.platformNames[p]}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">{t.variantRowLabels.secondary}</td>
                <td className="px-5 py-3.5 text-slate-500 text-sm">{t.showHide}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">{t.variantRowLabels.tertiary}</td>
                <td className="px-5 py-3.5 text-slate-500 text-sm">{t.showHide}</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">{t.variantRowLabels.close}</td>
                <td className="px-5 py-3.5 text-slate-500 text-sm">{t.showHideDesktopOnly}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Visual preview — all 8 permutations (4 types × 2 platforms) */}
        <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '16px' }}>
          {DIALOG_TYPES.flatMap((dt) =>
            PLATFORMS.map((plat) => (
              <div
                key={`${dt}-${plat}`}
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #f3f4f6',
                  backgroundColor: '#fafafa',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  minWidth: 0,
                  overflow: 'auto',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#374151' }}>
                    {t.typeNames[dt]} · {t.platformNames[plat]}
                  </p>
                  <span style={{ fontSize: '10px', color: '#6b7280', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
                    {plat === 'App' ? '275×auto' : '650×auto'}
                  </span>
                </div>
                <div style={{ ...DOTTED_BG, borderRadius: '8px', padding: '24px 16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <DialogLive platform={plat} dialogType={dt} showOverlay={false} brand={brand} />
                </div>
              </div>
            )),
          )}
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.tokensHeading}</h2>
        <p className="text-sm text-slate-500 mb-4">
          {t.tokensTagline}
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">{t.tokenColumn}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.cssVarColumn}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">
                  {t.valueColumnTpl(brand)}
                </th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_TABLE_ROWS.map((row, i) => {
                const isActive = row.types.includes(dialogType);
                const rawValue = tokens[row.key as keyof typeof tokens] ?? '—';
                const swatchHex = rawValue.length > 7 ? rawValue.slice(0, 7) : rawValue;
                const light = isLightColor(swatchHex);
                return (
                  <tr
                    key={row.cssVar}
                    className={[
                      i < TOKEN_TABLE_ROWS.length - 1 ? 'border-b border-slate-100' : '',
                      isActive ? 'bg-blue-50/60' : 'opacity-50',
                      'transition-all duration-150',
                    ].join(' ')}
                    style={
                      isActive
                        ? { borderLeft: '3px solid #3b82f6' }
                        : { borderLeft: '3px solid transparent' }
                    }
                  >
                    <td className="px-5 py-3 font-medium text-slate-700 text-xs">{t.tokenLabels[row.labelKey] ?? row.labelKey}</td>
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

        {/* Icon signal colours */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
          {DIALOG_TYPES.map((dt) => {
            const hex = TYPE_ICON_COLOR[dt];
            const active = dt === dialogType;
            return (
              <div
                key={dt}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: `1px solid ${active ? '#3b82f6' : '#f3f4f6'}`,
                  backgroundColor: active ? '#eff6ff' : '#fafafa',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  opacity: active ? 1 : 0.75,
                }}
              >
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    backgroundColor: hex,
                    flexShrink: 0,
                    border: '1px solid rgba(0,0,0,0.08)',
                  }}
                />
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#111827' }}>{t.iconLabelTpl(t.typeNames[dt])}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#6b7280', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
                    {hex}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 6. ACCESSIBILITY ─────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.a11yHeading}</h2>
        <p className="text-sm text-slate-500 mb-4">
          {t.a11yTagline}
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm divide-y divide-slate-100">
          {t.a11yRows.map((row, i) => (
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

      {/* ── 7. USAGE ─────────────────────────────────────────────────────── */}
      <section>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{t.usageHeading}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.usageTagline}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>{t.whenToUseLabel}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              {t.whenToUse.map((line, i, arr) => (
                <li key={i} style={{ marginBottom: i < arr.length - 1 ? '6px' : 0 }}>• {line}</li>
              ))}
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>{t.whenNotToUseLabel}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              {t.whenNotToUse.map((line, i, arr) => (
                <li key={i} style={{ marginBottom: i < arr.length - 1 ? '6px' : 0 }}>• {line}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}

// ─── Anatomy callout primitive ───────────────────────────────────────────────
function Callout({
  num,
  style,
  connector = 'left',
}: {
  num: string;
  style: React.CSSProperties;
  connector?: 'left' | 'right' | 'up' | 'down';
}) {
  const badge = (
    <span
      style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: '#1e293b',
        color: '#ffffff',
        fontSize: '11px',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        flexShrink: 0,
      }}
    >
      {num}
    </span>
  );
  const line = (
    <span
      style={{
        backgroundColor: '#94a3b8',
        flexShrink: 0,
        ...(connector === 'up' || connector === 'down'
          ? { width: '1px', height: '32px' }
          : { width: '32px', height: '1px' }),
      }}
    />
  );

  let content: React.ReactNode;
  if (connector === 'left') {
    content = (
      <>
        {line}
        {badge}
      </>
    );
  } else if (connector === 'right') {
    content = (
      <>
        {badge}
        {line}
      </>
    );
  } else if (connector === 'up') {
    content = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {line}
        {badge}
      </div>
    );
  } else {
    content = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {badge}
        {line}
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none',
        ...style,
      }}
    >
      {content}
    </div>
  );
}
