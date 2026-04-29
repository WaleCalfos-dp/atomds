import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';
import { StepperLive, type StepperSize, type StepperStyle } from '../components/stepper/StepperLive';

// ─────────────────────────────────────────────────────────────────────────────
// Figma source of truth
//   Component: Stepper (componentSet 1702:72060 in Atom file nKc4ep7mNdD5IqFRhNRNlW)
//   Purpose:   Allows users to increment or decrement numeric values.
//   Property surface:
//     VARIANT  Stepper → Small · Default · Large · Card   (default Small)
//     VARIANT  Style   → 1 · 2                             (default 1)
//     TEXT     Label   → default "0"
//   Concrete variants (4 shipped): Small/1 · Default/1 · Large/1 · Card/2
//   Dimensions (from Figma):
//     Small/1   81 × 20   inline · 16px gap · 20px icons
//     Default/1 105 × 32  inline · 16px gap · 32px icons
//     Large/1   121 × 40  inline · 16px gap · 40px icons
//     Card/2    245 × 114.5  card · 24px padding · 8px radius · 24px icons
//                 · 90×66.5 framed value display (28px heading/h1, top+bottom rule)
// ─────────────────────────────────────────────────────────────────────────────

interface StepperPageProps {
  brand: Brand;
  lang?: Language;
}

const ALL_SIZES: StepperSize[] = ['Small', 'Default', 'Large', 'Card'];
const ALL_STYLES: StepperStyle[] = ['1', '2'];

// ─────────────────────────────────────────────────────────────────────────────
// Localised copy
// ─────────────────────────────────────────────────────────────────────────────

const COPY = {
  en: {
    sizeLabel: 'Stepper (size)',
    styleLabel: 'Style',
    textLabel: 'Text',
    labelLabel: 'Label',
    cardStyle1NotePre: 'In Figma, ',
    cardStyle1NoteBold1: 'Card',
    cardStyle1NoteMid: ' pairs with ',
    cardStyle1NoteBold2: 'Style 2',
    cardStyle1NotePost: '. Style 1 is authored only on Small / Default / Large.',
    inlineStyle2Note:
      'Style 2 is authored only on the Card size. The preview falls back to the Card treatment so you can see it.',
    title: 'Stepper',
    description:
      'A compact numeric increment / decrement control. Three inline sizes (Small, Default, Large) in Style\u00a01 — an unfilled circular button on each side of the value — and a Card presentation (Style\u00a02) that frames a larger value between top + bottom rules inside a 245\u00a0×\u00a0114.5 surface.',
    inputBadge: 'Input',
    stableBadge: 'Stable',
    anatomyTitle: 'Anatomy',
    anatomyLead:
      'Three slots in Style\u00a01. Style\u00a02 adds two more: the outer card surface and a framed value display between top + bottom rules.',
    parts: [
      {
        num: '1',
        name: 'Decrement button',
        desc: 'Circular stroked button on the left. Fires a −1 step. Disabled at min. 20 / 32 / 40px for Small / Default / Large; 24px inside Card.',
      },
      {
        num: '2',
        name: 'Value label',
        desc: 'Numeric label between the two buttons. Tabular-nums so the width stays stable as digits change. 14px Medium body token; 28px heading/h1 inside Card.',
      },
      {
        num: '3',
        name: 'Increment button',
        desc: 'Circular stroked button on the right. Fires a +1 step. Disabled at max. Mirrors the decrement button for size and stroke weight.',
      },
      {
        num: '4',
        name: 'Card surface',
        desc: 'Style 2 only. 245 × 114.5 container, 24px padding all around, 8px radius, 1px border-default outline. Wraps the stepper row.',
      },
      {
        num: '5',
        name: 'Value frame',
        desc: 'Style 2 only. 90 × 66.5 frame between the two buttons with 1px top + bottom rules (no left / right borders). Hosts the 28px heading-weight digit.',
      },
    ],
    variantsTitle: 'Variants',
    variantsHeaderProperty: 'Property',
    variantsHeaderValues: 'Values',
    variantRows: [
      {
        label: 'Stepper (size)',
        chips: [
          { text: 'Small', note: 'default · 20px · inline' },
          { text: 'Default', note: '32px · inline' },
          { text: 'Large', note: '40px · inline' },
          { text: 'Card', note: '245×114.5 · card layout' },
        ],
      },
      {
        label: 'Style',
        chips: [
          { text: '1', note: 'default · stroked buttons' },
          { text: '2', note: 'solid filled buttons · paired with Card' },
        ],
      },
      {
        label: 'Text slots (1)',
        chips: [{ text: 'Label', note: 'default "0"' }],
      },
      {
        label: 'Font family',
        chips: [
          { text: 'Poppins', note: 'Dragonpass' },
          { text: 'Arial', note: 'Mastercard' },
          { text: 'Inter', note: 'Investec' },
          { text: 'Manrope', note: 'Visa · Greyscale' },
          { text: 'Lato', note: 'Assurant' },
        ],
      },
    ],
    tokensTitle: 'Design Tokens',
    tokensLeadPrefix: 'Tokens below resolve per active brand via the ',
    tokensLeadCode: 'Brand Switcher → Atom',
    tokensLeadSuffix: ' cascade.',
    tokensHeaderUsage: 'Usage',
    tokensHeaderCssVar: 'CSS variable',
    tokensHeaderValue: (brand: string) => `Value (${brand})`,
    tokenLabels: {
      'Button border': 'Button border',
      'Button surface': 'Button surface',
      'Button glyph (± fill)': 'Button glyph (± fill)',
      'Value label': 'Value label',
      'Card surface (Style 2)': 'Card surface (Style 2)',
      'Card border (Style 2)': 'Card border (Style 2)',
      'Value frame rule (Card)': 'Value frame rule (Card)',
      'Inline gap (16px)': 'Inline gap (16px)',
    } as Record<string, string>,
    a11yTitle: 'Accessibility',
    a11yLead: 'Guidelines for implementing Stepper inclusively across brands.',
    a11yRows: [
      {
        icon: '⌨️',
        title: 'Keyboard interaction',
        body: 'Both the minus and plus buttons receive focus individually. Use Arrow Up / Arrow Down on the numeric label (or Space / Enter on the buttons) to increment / decrement. Typing a number overwrites the value.',
      },
      {
        icon: '🏷️',
        title: 'Labelling',
        body: 'Pair the Stepper with a visible label (e.g. "Adults", "Tickets") using aria-labelledby. Give each button its own aria-label — "Decrease quantity", "Increase quantity".',
      },
      {
        icon: '🔢',
        title: 'Value announcements',
        body: 'Use role="spinbutton" on the numeric label with aria-valuenow, aria-valuemin, aria-valuemax so the current count is announced when it changes.',
      },
      {
        icon: '🚫',
        title: 'Bounds & disabled',
        body: 'Disable the minus button at min and the plus button at max — do not silently ignore clicks. Disabled buttons announce their state via aria-disabled.',
      },
      {
        icon: '📏',
        title: 'Target size',
        body: 'Small (20×20) is for compact inline contexts like list rows. Default (32×32) and Large (40×40) meet WCAG 2.5.5 44×44 target area once padding is included; Small requires a larger surrounding hit area.',
      },
      {
        icon: '🎨',
        title: 'Color contrast',
        body: 'Style 1 stroke glyph on white surface ≥ 4.5:1 via atom.foreground.primary.fg-brand-primary. Style 2 white glyph on brand-primary fill ≥ 4.5:1. Border passes 3:1 for non-text contrast.',
      },
    ],
    usageTitle: 'Usage',
    usageLead: 'When to use each size and style.',
    usageCards: [
      {
        title: 'Small (Style 1)',
        color: '#0a2333',
        bg: '#f0f4f8',
        when: 'Inline edits inside list rows or tight form cells. The 20px footprint fits next to product thumbnails without dominating the layout.',
      },
      {
        title: 'Default (Style 1)',
        color: '#0a2333',
        bg: '#f9fafb',
        when: 'Standard form usage — bookings, ticket counts, quantity fields. Hits the comfortable 32px target on desktop.',
      },
      {
        title: 'Large (Style 1)',
        color: '#0a2333',
        bg: '#f8fafc',
        when: 'Mobile-first flows or primary purchase screens where the stepper is the hero control on the page.',
      },
      {
        title: 'Card (Style 2)',
        color: '#166534',
        bg: '#f0fdf4',
        when: 'Product rows where each line item is its own tile — ticket tiers, add-ons, passenger counts. Combines title + subtitle + stepper in one container.',
      },
      {
        title: 'Paired labelling',
        color: '#4338ca',
        bg: '#eef2ff',
        when: 'Always render a visible label (or visible title in the Card variant) — the numeric glyph alone is not a label. Pair with aria-labelledby.',
      },
      {
        title: 'Bounds handling',
        color: '#9a3412',
        bg: '#fff7ed',
        when: 'Disable the minus button at the minimum value and the plus button at the maximum. Never silently ignore clicks — users need feedback that they have hit a limit.',
      },
    ],
    doLabel: '✓ When to use',
    dontLabel: '✗ When not to use',
    doItems: [
      '• Bounded, integer-valued fields — quantity, passenger count',
      '• Lists where each row has its own quantity control',
      '• Ticket-tier cards where price depends on count',
      '• Accessibility requires keyboard + screen reader support',
      '• Disable minus at min, plus at max — give the user feedback',
    ],
    dontItems: [
      "• Don't use for decimal, currency, or date fields — use Input",
      "• Don't use for ranges larger than ~99 — use a text field",
      "• Don't pair Card size with Style 1 — Style 2 is the authored combination",
      "• Don't omit a visible label — placeholder digits ≠ a label",
      "• Don't use for selecting a process stage — use Steps instead",
    ],
  },
  zh: {
    sizeLabel: '步进器(尺寸)',
    styleLabel: '样式',
    textLabel: '文本',
    labelLabel: '标签',
    cardStyle1NotePre: '在 Figma 中,',
    cardStyle1NoteBold1: 'Card',
    cardStyle1NoteMid: ' 与 ',
    cardStyle1NoteBold2: 'Style 2',
    cardStyle1NotePost: ' 配对。Style 1 仅在 Small / Default / Large 中编写。',
    inlineStyle2Note:
      'Style 2 仅在 Card 尺寸中编写。预览会回退到 Card 处理方式以便您查看。',
    title: '步进器',
    description:
      '紧凑的数字递增/递减控件。三种内嵌尺寸 (Small、Default、Large) 采用 Style\u00a01 — 在数值两侧各有一个未填充的圆形按钮 — 以及一种卡片呈现 (Style\u00a02),在 245\u00a0×\u00a0114.5 表面内,通过顶部和底部分隔线框住一个较大的数值。',
    inputBadge: '输入',
    stableBadge: '稳定',
    anatomyTitle: '组成结构',
    anatomyLead:
      'Style\u00a01 中有三个槽位。Style\u00a02 增加了两个:外部卡片表面和顶部+底部分隔线之间的框选数值显示。',
    parts: [
      {
        num: '1',
        name: '递减按钮',
        desc: '左侧的圆形描边按钮。触发 −1 步进。在最小值时禁用。Small / Default / Large 分别为 20 / 32 / 40px;Card 内为 24px。',
      },
      {
        num: '2',
        name: '数值标签',
        desc: '两个按钮之间的数字标签。使用等宽数字,使数字变化时宽度保持稳定。14px Medium 正文令牌;Card 内为 28px 标题/h1。',
      },
      {
        num: '3',
        name: '递增按钮',
        desc: '右侧的圆形描边按钮。触发 +1 步进。在最大值时禁用。在尺寸和描边粗细上与递减按钮镜像。',
      },
      {
        num: '4',
        name: '卡片表面',
        desc: '仅 Style 2。245 × 114.5 容器,四周 24px 内边距,8px 圆角,1px border-default 边框。包裹步进器行。',
      },
      {
        num: '5',
        name: '数值框',
        desc: '仅 Style 2。两个按钮之间的 90 × 66.5 框,带有 1px 顶部和底部分隔线(无左/右边框)。承载 28px 标题级粗细的数字。',
      },
    ],
    variantsTitle: '变体',
    variantsHeaderProperty: '属性',
    variantsHeaderValues: '值',
    variantRows: [
      {
        label: '步进器(尺寸)',
        chips: [
          { text: 'Small', note: '默认 · 20px · 内嵌' },
          { text: 'Default', note: '32px · 内嵌' },
          { text: 'Large', note: '40px · 内嵌' },
          { text: 'Card', note: '245×114.5 · 卡片布局' },
        ],
      },
      {
        label: '样式',
        chips: [
          { text: '1', note: '默认 · 描边按钮' },
          { text: '2', note: '实心填充按钮 · 与 Card 配对' },
        ],
      },
      {
        label: '文本槽位 (1)',
        chips: [{ text: 'Label', note: '默认 "0"' }],
      },
      {
        label: '字体',
        chips: [
          { text: 'Poppins', note: 'Dragonpass' },
          { text: 'Arial', note: 'Mastercard' },
          { text: 'Inter', note: 'Investec' },
          { text: 'Manrope', note: 'Visa · Greyscale' },
          { text: 'Lato', note: 'Assurant' },
        ],
      },
    ],
    tokensTitle: '设计令牌',
    tokensLeadPrefix: '以下令牌通过 ',
    tokensLeadCode: 'Brand Switcher → Atom',
    tokensLeadSuffix: ' 级联根据当前品牌解析。',
    tokensHeaderUsage: '用途',
    tokensHeaderCssVar: 'CSS 变量',
    tokensHeaderValue: (brand: string) => `值 (${brand})`,
    tokenLabels: {
      'Button border': '按钮边框',
      'Button surface': '按钮表面',
      'Button glyph (± fill)': '按钮符号 (± 填充)',
      'Value label': '数值标签',
      'Card surface (Style 2)': '卡片表面 (Style 2)',
      'Card border (Style 2)': '卡片边框 (Style 2)',
      'Value frame rule (Card)': '数值框分隔线 (Card)',
      'Inline gap (16px)': '内嵌间距 (16px)',
    } as Record<string, string>,
    a11yTitle: '无障碍',
    a11yLead: '在所有品牌中以包容方式实现步进器的指南。',
    a11yRows: [
      {
        icon: '⌨️',
        title: '键盘交互',
        body: '减号和加号按钮可分别接收焦点。在数字标签上使用上/下箭头(或在按钮上使用空格/回车)进行递增/递减。输入数字会覆盖该值。',
      },
      {
        icon: '🏷️',
        title: '标签',
        body: '使用 aria-labelledby 为步进器搭配可见标签(例如 "成人"、"门票")。为每个按钮提供独立的 aria-label —— "减少数量"、"增加数量"。',
      },
      {
        icon: '🔢',
        title: '数值通报',
        body: '在数字标签上使用 role="spinbutton" 并配合 aria-valuenow、aria-valuemin、aria-valuemax,以便在更改时通报当前计数。',
      },
      {
        icon: '🚫',
        title: '边界与禁用',
        body: '在最小值时禁用减号按钮,在最大值时禁用加号按钮 —— 不要默默忽略点击。禁用按钮通过 aria-disabled 通报其状态。',
      },
      {
        icon: '📏',
        title: '目标尺寸',
        body: 'Small (20×20) 适用于列表行等紧凑的内嵌场景。Default (32×32) 和 Large (40×40) 加上内边距后符合 WCAG 2.5.5 的 44×44 目标区域;Small 需要更大的周围点击区域。',
      },
      {
        icon: '🎨',
        title: '颜色对比度',
        body: 'Style 1 通过 atom.foreground.primary.fg-brand-primary 在白色表面上的描边符号 ≥ 4.5:1。Style 2 在品牌主色填充上的白色符号 ≥ 4.5:1。边框对非文本对比度通过 3:1。',
      },
    ],
    usageTitle: '使用',
    usageLead: '何时使用每种尺寸和样式。',
    usageCards: [
      {
        title: 'Small (Style 1)',
        color: '#0a2333',
        bg: '#f0f4f8',
        when: '列表行或紧凑表单单元格内的内嵌编辑。20px 占用空间适合产品缩略图旁边,不会占主导地位。',
      },
      {
        title: 'Default (Style 1)',
        color: '#0a2333',
        bg: '#f9fafb',
        when: '标准表单使用 —— 预订、门票数量、数量字段。在桌面端达到舒适的 32px 目标。',
      },
      {
        title: 'Large (Style 1)',
        color: '#0a2333',
        bg: '#f8fafc',
        when: '移动优先流程或主要购买屏幕,步进器是页面上的核心控件。',
      },
      {
        title: 'Card (Style 2)',
        color: '#166534',
        bg: '#f0fdf4',
        when: '每个行项目都是独立瓷砖的产品行 —— 票档、附加项、乘客数。在一个容器中组合标题 + 副标题 + 步进器。',
      },
      {
        title: '配对标签',
        color: '#4338ca',
        bg: '#eef2ff',
        when: '始终渲染可见标签(或 Card 变体中的可见标题)—— 数字符号本身不是标签。配合 aria-labelledby 使用。',
      },
      {
        title: '边界处理',
        color: '#9a3412',
        bg: '#fff7ed',
        when: '在最小值时禁用减号按钮,在最大值时禁用加号按钮。永远不要默默忽略点击 —— 用户需要反馈才知道已达到限制。',
      },
    ],
    doLabel: '✓ 何时使用',
    dontLabel: '✗ 何时不使用',
    doItems: [
      '• 有边界的整数值字段 —— 数量、乘客数',
      '• 每行都有自己数量控件的列表',
      '• 价格取决于数量的票档卡片',
      '• 无障碍要求支持键盘 + 屏幕阅读器',
      '• 在最小值禁用减号,在最大值禁用加号 —— 给用户反馈',
    ],
    dontItems: [
      '• 不要用于小数、货币或日期字段 —— 使用 Input',
      '• 不要用于大于 ~99 的范围 —— 使用文本字段',
      '• 不要将 Card 尺寸与 Style 1 配对 —— Style 2 是已编写的组合',
      '• 不要省略可见标签 —— 占位符数字 ≠ 标签',
      '• 不要用于选择流程阶段 —— 改用 Steps',
    ],
  },
} as const;

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// ─────────────────────────────────────────────────────────────────────────────
// Controls rail helpers
// ─────────────────────────────────────────────────────────────────────────────
function ControlSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{title}</p>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}

function PillSelect<T extends string>({
  options, active, onChange,
}: { options: readonly T[]; active: T; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={[
            'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
            active === opt
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
          ].join(' ')}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function TextField({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] text-slate-500">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 py-1 text-xs border border-slate-200 rounded-md text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
      />
    </label>
  );
}

// ─── Design tokens table rows ────────────────────────────────────────────────
const TOKEN_TABLE_ROWS = [
  { label: 'Button border',            cssVar: '--atom-border-default-border-default',          tokenKey: 'atom.border.default.border-default',           fallback: '#cdcbcb' },
  { label: 'Button surface',           cssVar: '--atom-background-primary-bg-primary-inverse',  tokenKey: 'atom.background.primary.bg-primary-inverse',   fallback: '#ffffff' },
  { label: 'Button glyph (± fill)',    cssVar: '--atom-foreground-primary-fg-brand-primary',    tokenKey: 'atom.foreground.primary.fg-brand-primary',     fallback: '#0a2333' },
  { label: 'Value label',              cssVar: '--atom-foreground-primary-fg-brand-primary',    tokenKey: 'atom.foreground.primary.fg-brand-primary',     fallback: '#0a2333' },
  { label: 'Card surface (Style 2)',   cssVar: '--atom-background-primary-bg-primary-inverse',  tokenKey: 'atom.background.primary.bg-primary-inverse',   fallback: '#ffffff' },
  { label: 'Card border (Style 2)',    cssVar: '--atom-border-default-border-default',          tokenKey: 'atom.border.default.border-default',           fallback: '#cdcbcb' },
  { label: 'Value frame rule (Card)',  cssVar: '--atom-border-default-border-default',          tokenKey: 'atom.border.default.border-default',           fallback: '#cdcbcb' },
  { label: 'Inline gap (16px)',        cssVar: '--atom-space-tight',                            tokenKey: 'atom.border.default.border-default',           fallback: '16px' },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
export function StepperPage({ brand, lang = 'en' }: StepperPageProps) {
  const t = COPY[lang];
  const [size, setSize] = useState<StepperSize>('Small');
  const [style, setStyle] = useState<StepperStyle>('1');
  const [label, setLabel] = useState('0');

  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  // Card variant is paired with Style=2 in Figma; keep the user's latest choice but
  // surface the authentic combination in the preview when useful.
  const previewKey = `${size}|${style}|${label}`;

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-[360px]">
            {/* Canvas */}
            <div className="flex-1 flex items-center justify-center p-12" style={DOTTED_BG}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.14 }}
                >
                  <StepperLive size={size} stepperStyle={style} label={label} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls rail */}
            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5 overflow-y-auto">
              <ControlSection title={t.sizeLabel}>
                <PillSelect options={ALL_SIZES} active={size} onChange={setSize} />
              </ControlSection>

              <ControlSection title={t.styleLabel}>
                <PillSelect options={ALL_STYLES} active={style} onChange={setStyle} />
              </ControlSection>

              <ControlSection title={t.textLabel}>
                <TextField label={t.labelLabel} value={label} onChange={setLabel} />
              </ControlSection>

              {size === 'Card' && style === '1' && (
                <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 leading-relaxed">
                  {t.cardStyle1NotePre}<strong>{t.cardStyle1NoteBold1}</strong>{t.cardStyle1NoteMid}<strong>{t.cardStyle1NoteBold2}</strong>{t.cardStyle1NotePost}
                </p>
              )}
              {size !== 'Card' && style === '2' && (
                <p className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 leading-relaxed">
                  {t.inlineStyle2Note}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">{t.title}</h1>
            <p className="text-slate-500 text-sm max-w-xl">
              {t.description}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.25" />
                <path d="M5 3v3M5 7.5v.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              </svg>
              {t.inputBadge}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {t.stableBadge}
            </span>
          </div>
        </div>
      </section>

      <hr className="border-slate-200" />

      {/* ── 3. ANATOMY ───────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.anatomyTitle}</h2>
        <p className="text-sm text-slate-500 mb-5">
          {t.anatomyLead}
        </p>

        <div className="relative flex items-center justify-center py-20 px-8 rounded-xl" style={DOTTED_BG}>
          <StepperLive size="Large" stepperStyle="1" label="2" />
        </div>

        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {t.parts.map((row) => (
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

      {/* ── 4. VARIANTS ──────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-4">{t.variantsTitle}</h2>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">{t.variantsHeaderProperty}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.variantsHeaderValues}</th>
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

        {/* Visual preview of all 4 authored variants */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { title: 'Small / 1',   size: 'Small'   as StepperSize, style: '1' as StepperStyle },
            { title: 'Default / 1', size: 'Default' as StepperSize, style: '1' as StepperStyle },
            { title: 'Large / 1',   size: 'Large'   as StepperSize, style: '1' as StepperStyle },
            { title: 'Card / 2',    size: 'Card'    as StepperSize, style: '2' as StepperStyle },
          ].map((card) => (
            <div key={card.title} style={{
              padding: '20px', borderRadius: '10px',
              border: '1px solid #f3f4f6', backgroundColor: '#fafafa',
              display: 'flex', flexDirection: 'column', gap: '12px',
              alignItems: card.size === 'Card' ? 'stretch' : 'flex-start',
              minHeight: card.size === 'Card' ? '180px' : '120px',
            }}>
              <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: '#6b7280' }}>{card.title}</p>
              <StepperLive size={card.size} stepperStyle={card.style} label="0" />
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.tokensTitle}</h2>
        <p className="text-sm text-slate-500 mb-4">
          {t.tokensLeadPrefix}<code className="text-xs bg-slate-100 px-1 rounded">{t.tokensLeadCode}</code>{t.tokensLeadSuffix}
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">{t.tokensHeaderUsage}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.tokensHeaderCssVar}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">{t.tokensHeaderValue(brand)}</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_TABLE_ROWS.map((row, i) => {
                const resolved = (tokens as Record<string, string>)[row.tokenKey] ?? row.fallback;
                const raw = resolved.replace('#', '').slice(0, 6);
                const r = parseInt(raw.slice(0, 2), 16);
                const g = parseInt(raw.slice(2, 4), 16);
                const b = parseInt(raw.slice(4, 6), 16);
                const light = (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
                return (
                  <tr key={row.label + i} className={i < TOKEN_TABLE_ROWS.length - 1 ? 'border-b border-slate-100' : ''}>
                    <td className="px-5 py-3 font-medium text-slate-700 text-xs">{t.tokenLabels[row.label] ?? row.label}</td>
                    <td className="px-5 py-3">
                      <code className="font-mono text-xs text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                        {row.cssVar}
                      </code>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded flex-shrink-0 border border-black/10" style={{ backgroundColor: resolved }} />
                        <span className="font-mono text-xs px-1.5 py-0.5 rounded border"
                          style={{
                            backgroundColor: resolved,
                            color: light ? '#1e293b' : '#f8fafc',
                            borderColor: light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)',
                          }}>
                          {resolved.toUpperCase()}
                        </span>
                      </div>
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
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.a11yTitle}</h2>
        <p className="text-sm text-slate-500 mb-4">{t.a11yLead}</p>
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
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{t.usageTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.usageLead}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
          {t.usageCards.map((card) => (
            <div key={card.title} style={{ padding: '14px 16px', borderRadius: '10px', border: `1px solid ${card.color}22`, backgroundColor: card.bg }}>
              <p style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: 600, color: card.color }}>{card.title}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#4b5563', lineHeight: 1.5 }}>{card.when}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>{t.doLabel}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              {t.doItems.map((item, i) => (
                <li key={i} style={{ marginBottom: i < t.doItems.length - 1 ? '6px' : 0 }}>{item}</li>
              ))}
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>{t.dontLabel}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              {t.dontItems.map((item, i) => (
                <li key={i} style={{ marginBottom: i < t.dontItems.length - 1 ? '6px' : 0 }}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
