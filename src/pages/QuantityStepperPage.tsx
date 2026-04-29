import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';

// Figma-exported variant thumbnails — used in Section 4 to show the two
// concrete published variants at a glance. Section 1's preview is procedural
// so every rail toggle actually mutates it.
import stepperOnlySvg            from '../assets/stepper-variants/stepper-only.svg';
import stepperWithDescriptionSvg from '../assets/stepper-variants/stepper-with-description.svg';

interface QuantityStepperPageProps {
  brand: Brand;
  lang?: Language;
}

type Style = 'Stepper only' | 'Stepper with description';
const STYLES: Style[] = ['Stepper only', 'Stepper with description'];

const VARIANT_SRC: Record<Style, string> = {
  'Stepper only':             stepperOnlySvg,
  'Stepper with description': stepperWithDescriptionSvg,
};

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// ── Bilingual COPY map ───────────────────────────────────────────────────────
const COPY = {
  en: {
    headline: 'Quantity Stepper',
    tagline: 'Allows users to increment or decrement numeric values inline with a labelled item. Published as a data-row pattern with an optional title, description and badge on the left and a Stepper control on the right. In Stepper with description up to three rows can stack, with an optional divider, helper text and an INSTANCE_SWAP slot underneath — useful for carts, forms, or any list where each line has its own adjustable quantity.',
    pillForms: 'Forms',
    pillStable: 'Stable',
    sectionAnatomy: 'Anatomy',
    anatomyIntro: 'Per Figma spec the component is a 487-px-wide rounded-rectangle container (12 px horizontal + 16 px vertical padding, 16 px gap between children). Each data row aligns a Title / Description block on the left with a Stepper and optional Badge on the right. Optional footer slots — hairline divider, More Information and an INSTANCE_SWAP — live beneath the row stack in the Stepper with description variant only.',
    sectionFigmaProperties: 'Figma properties',
    figmaPropertiesIntro: 'Exact published surface per the Atom manifest. One VARIANT, seventeen BOOLEAN toggles and seven TEXT slots — twenty-five properties in total. Only two concrete variants ship (one per Style value); every other property is an in-variant toggle surfaced in the preview rail above.',
    colProperty: 'Property',
    colType: 'Type',
    colDefault: 'Default',
    sectionShippedVariants: 'Shipped variants (2)',
    styleLabel: 'Style',
    styleNames: {
      'Stepper only':             'Stepper only',
      'Stepper with description': 'Stepper with description',
    } as Record<Style, string>,
    styleControl: 'Style (variant)',
    styleHint: 'Rows 2/3, divider, More Information and Slot are only available in Stepper with description. Those controls are disabled below.',
    rowSection: (n: number) => `Row ${n}`,
    rowDataLabel: (n: number) => `Data ${n} (row visible)`,
    rowTitleLabel: (n: number) => `Title ${n}`,
    rowDescriptionLabel: (n: number) => `Description ${n}`,
    rowStepperLabel: (n: number) => `Stepper ${n}`,
    rowBadgeLabel: (n: number) => n === 1 ? 'Badge' : `Badge ${n}`,
    rowTitleTextLabel: (n: number) => `Title Text ${n}`,
    rowDescTextLabel: (n: number) => `Description Text ${n}`,
    footerSection: 'Footer',
    moreInfoLabel: 'More Information',
    slotLabel: 'Slot',
    moreInfoTextLabel: 'More Information Text',
    propertyCategories: {
      'Variant':         'Variant',
      'Row 1 toggles':   'Row 1 toggles',
      'Row 2 toggles':   'Row 2 toggles',
      'Row 3 toggles':   'Row 3 toggles',
      'Footer toggles':  'Footer toggles',
      'Text slots':      'Text slots',
    } as Record<string, string>,
    sectionTokens: 'Design Tokens',
    tokensIntro: 'Semantic tokens bound across the container, rows, stepper, divider, badge and footer. Values shown resolve to the active brand.',
    colToken: 'Token',
    colCss: 'CSS Variable',
    colResolved: 'Resolved',
    colScope: 'Scope',
    sectionA11y: 'Accessibility',
    a11yIntro: 'Guidelines for designers specifying quantity-stepper flows inclusively.',
    sectionUsage: 'Usage',
    usageIntro: "When each pattern is appropriate, and common do's & don'ts.",
    whenToUseTitle: '✓ When to use',
    whenNotToUseTitle: '✗ When not to use',
    swapPlaceholder: 'Swap',
    a11yRows: [
      { icon: '⌨️', title: 'Keyboard interaction', body: '+ and − buttons are reached via Tab and activated with Enter or Space. When a row is disabled at min or max, the corresponding button is excluded from the tab order.' },
      { icon: '🔤', title: 'Accessible names',     body: 'Both buttons need an aria-label that identifies both the action and the item — e.g. "Increase quantity of Premium lounge pass". Never rely on the + / − glyph alone for assistive-tech users.' },
      { icon: '🚫', title: 'Disabled boundaries',  body: 'Use the disabled attribute (not opacity alone) once the value hits min or max. Screen readers will announce the unavailable state and the button is skipped during focus traversal.' },
      { icon: '🔢', title: 'Value announcement',   body: 'Wrap the value field in aria-live="polite" or aria-atomic so count changes are announced without focus movement. Do not announce on every keystroke — announce only on value commit.' },
      { icon: '📋', title: 'List semantics',       body: 'When rows appear inside a cart, wrap them in a role="list" (or native <ul>) so the total item count is announced. Each row is a list item with its title/description grouped.' },
      { icon: '🎨', title: 'Colour contrast',      body: 'Title (fg-primary on white) and stepper glyphs (fg-brand-primary on white) meet WCAG AA 4.5:1 across all brands. Disabled state is exempt per WCAG 1.4.3.' },
    ],
    anatomyParts: [
      { num: '1', name: 'Container',       desc: 'Outer frame. White fill, 1 px border (border-default), 8 px corner radius, 487 px wide. Vertical flex, 12 × 16 px padding, 16 px gap between children.' },
      { num: '2', name: 'Title',           desc: '14 px Regular, fg-primary (#4b4a4a). Controlled by Title 1 / 2 / 3 toggles and their Title Text slots. Truncates to one line with ellipsis.' },
      { num: '3', name: 'Description',     desc: "14 px Regular, fg-secondary (#737272). Controlled by the row's Description toggle and Description Text slot. Sits directly under the title." },
      { num: '4', name: 'Stepper',         desc: '32 px tall, 105 px wide. Minus icon + numeric value + plus icon, 16 px gap. Uses the Stepper component instance (Stepper=Default, Style=1).' },
      { num: '5', name: 'Badge',           desc: '24 px tall, 2 px corner radius, bg-info-default fill, fg-brand-primary text. Icon-left + "Label" + icon-right with 4 px gap. Badge / Badge 2 / Badge 3 per row.' },
      { num: '6', name: 'Divider',         desc: '1 px hairline using border-divider. Present in the Stepper-with-description variant whenever at least one footer item (More Information / Slot) is visible.' },
      { num: '7', name: 'More Information', desc: 'Plain 14 px Regular text, fg-primary. Free-form string from More Information Text — no icon in the Figma spec (despite the name).' },
      { num: '8', name: 'Slot',            desc: 'INSTANCE_SWAP placeholder. Dashed rounded-rectangle at rest, 8 px radius. Designers swap in any component (alert, CTA button, promotion) when the stock footer is not enough.' },
    ],
    tokenLabels: {
      containerBg:    'Container bg',
      containerBorder:'Container border',
      title:          'Title',
      description:    'Description',
      stepperFg:      'Stepper fg (+/−, value)',
      divider:        'Divider',
      moreInfoText:   'More-info text',
      badgeBg:        'Badge bg',
      badgeText:      'Badge text',
      slotBorder:     'Slot border',
    },
    tokenScopes: {
      containerBg:    'Outer card fill',
      containerBorder:'1 px outline around the whole card',
      title:          'Title 1 / 2 / 3 text (14 px Regular)',
      description:    'Description 1 / 2 / 3 text (14 px Regular)',
      stepperFg:      '+ / − glyphs + numeric value',
      divider:        'Hairline between rows and footer (with-description only)',
      moreInfoText:   'Footer helper text (14 px Regular)',
      badgeBg:        'Badge pill fill',
      badgeText:      'Badge label + icons',
      slotBorder:     'INSTANCE_SWAP placeholder outline',
    },
    usageCards: [
      { title: 'Single line',            color: '#0a2333', bg: '#f0f4f8', when: 'Style="Stepper only". One title (+ optional description), compact rows where context is obvious — e.g. "Adults" in a booking form.' },
      { title: 'With description',       color: '#0a2333', bg: '#f9fafb', when: 'Style="Stepper with description". When rows need extra context, a divider, or a "More information" line below.' },
      { title: 'With badge',             color: '#0a2333', bg: '#f0f9ff', when: 'Status ("In stock"), popularity, or a short numeric tag. Keep copy ≤ 2 words to preserve the compact 24 px height.' },
      { title: 'Shopping cart',          color: '#0a2333', bg: '#f0fdf4', when: '3 rows, each with title + description + badge + stepper. Footer carries tax / totals / legal notice.' },
      { title: 'Form group',             color: '#0a2333', bg: '#fffbeb', when: 'Adults / Children / Infants patterns. Hide badges; show More Information for limits ("Infants on lap travel free").' },
      { title: 'Slot override',          color: '#0a2333', bg: '#fef2f2', when: 'Slot=true. When the built-in footer is not enough — swap in a CTA button, an alert, or a promotion.' },
    ],
    whenToUse: [
      'Small bounded integers (0–99) such as cart quantities, people counts, portions',
      'Lists of ≤ 3 adjustable items — go multi-row rather than stacking',
      'When current value must always be visible while adjusting',
      'Use Stepper with description whenever context helps the user decide',
      'Use Badge for status words or counts — keep it short enough to fit 72 px',
    ],
    whenNotToUse: [
      'Large numbers (> 99) — use a numeric text input instead',
      'Free-form values with decimals or negatives — the stepper is integer-only',
      'More than 3 rows — compose multiple list sections rather than one long stepper stack',
      'When a row has no Title — users need text context, never just a control',
      'Badges ≥ 3 words — they overflow the pill and break the 24 px row height',
    ],
  },
  zh: {
    headline: '数量步进器',
    tagline: '允许用户对带标签的项目进行内联递增或递减数值操作。作为数据行模式发布,左侧含可选的标题、说明与徽章,右侧为步进控件。在「带说明的步进器」中最多可堆叠三行,下方可选分隔线、辅助文字与 INSTANCE_SWAP 插槽——适用于购物车、表单或任何每行需独立调节数量的列表。',
    pillForms: '表单',
    pillStable: '稳定版',
    sectionAnatomy: '结构剖析',
    anatomyIntro: '根据 Figma 规范,组件为 487 px 宽的圆角矩形容器(横向 12 px + 纵向 16 px 内边距,子项间距 16 px)。每一行将左侧的「标题/说明」块与右侧的步进器及可选徽章对齐。可选的页脚插槽——细分隔线、「更多信息」与 INSTANCE_SWAP——仅在「带说明的步进器」变体中位于行堆栈下方。',
    sectionFigmaProperties: 'Figma 属性',
    figmaPropertiesIntro: '依据 Atom 清单的精确发布表面。一个 VARIANT、十七个 BOOLEAN 开关与七个 TEXT 插槽——共二十五个属性。只发布两个具体变体(每个 Style 值一个);其余属性均为变体内开关,呈现在上方预览侧栏中。',
    colProperty: '属性',
    colType: '类型',
    colDefault: '默认值',
    sectionShippedVariants: '已发布变体(2)',
    styleLabel: '样式',
    styleNames: {
      'Stepper only':             '仅步进器',
      'Stepper with description': '带说明的步进器',
    } as Record<Style, string>,
    styleControl: '样式(变体)',
    styleHint: '第 2/3 行、分隔线、「更多信息」与「插槽」仅在「带说明的步进器」中可用。下方相关控件已禁用。',
    rowSection: (n: number) => `第 ${n} 行`,
    rowDataLabel: (n: number) => `数据 ${n}(行可见)`,
    rowTitleLabel: (n: number) => `标题 ${n}`,
    rowDescriptionLabel: (n: number) => `说明 ${n}`,
    rowStepperLabel: (n: number) => `步进器 ${n}`,
    rowBadgeLabel: (n: number) => n === 1 ? '徽章' : `徽章 ${n}`,
    rowTitleTextLabel: (n: number) => `标题文本 ${n}`,
    rowDescTextLabel: (n: number) => `说明文本 ${n}`,
    footerSection: '页脚',
    moreInfoLabel: '更多信息',
    slotLabel: '插槽',
    moreInfoTextLabel: '更多信息文本',
    propertyCategories: {
      'Variant':         '变体',
      'Row 1 toggles':   '第 1 行开关',
      'Row 2 toggles':   '第 2 行开关',
      'Row 3 toggles':   '第 3 行开关',
      'Footer toggles':  '页脚开关',
      'Text slots':      '文本插槽',
    } as Record<string, string>,
    sectionTokens: '设计令牌',
    tokensIntro: '绑定在容器、行、步进器、分隔线、徽章与页脚上的语义令牌。所示数值随当前品牌解析。',
    colToken: '令牌',
    colCss: 'CSS 变量',
    colResolved: '解析值',
    colScope: '应用范围',
    sectionA11y: '可访问性',
    a11yIntro: '为设计师包容地规范数量步进器流程的指引。',
    sectionUsage: '用法',
    usageIntro: '各模式适用场景及常见的推荐与避免做法。',
    whenToUseTitle: '✓ 推荐使用',
    whenNotToUseTitle: '✗ 避免使用',
    swapPlaceholder: '替换',
    a11yRows: [
      { icon: '⌨️', title: '键盘交互',     body: '通过 Tab 抵达 + 与 − 按钮,Enter 或 Space 激活。当某一行处于最小或最大值禁用状态时,对应按钮从 Tab 顺序中排除。' },
      { icon: '🔤', title: '可访问名称',   body: '两个按钮均需 aria-label 同时标识动作与项目——例如「增加 Premium 休息室通行证数量」。切勿仅依赖辅助技术用户看不到的 + / − 字形。' },
      { icon: '🚫', title: '禁用边界',     body: '当数值达到最小或最大值时,使用 disabled 属性(而非仅靠不透明度)。屏幕阅读器会播报不可用状态,并在焦点遍历时跳过该按钮。' },
      { icon: '🔢', title: '数值播报',     body: '使用 aria-live="polite" 或 aria-atomic 包裹数值字段,使数量变化在不移动焦点的情况下被播报。请勿每次按键都播报——仅在数值确认时播报。' },
      { icon: '📋', title: '列表语义',     body: '当行出现在购物车中时,使用 role="list"(或原生 <ul>)包裹,以便播报项目总数。每一行作为列表项,其标题与说明分组在一起。' },
      { icon: '🎨', title: '颜色对比度',   body: '标题(白底上的 fg-primary)与步进器字形(白底上的 fg-brand-primary)在所有品牌下均满足 WCAG AA 4.5:1。禁用状态依据 WCAG 1.4.3 豁免。' },
    ],
    anatomyParts: [
      { num: '1', name: '容器',       desc: '外层框架。白色填充,1 px 边框(border-default),8 px 圆角,宽 487 px。垂直 flex,内边距 12 × 16 px,子项间距 16 px。' },
      { num: '2', name: '标题',       desc: '14 px Regular,fg-primary(#4b4a4a)。由「标题 1 / 2 / 3」开关及其文本插槽控制。单行截断并显示省略号。' },
      { num: '3', name: '说明',       desc: '14 px Regular,fg-secondary(#737272)。由该行的「说明」开关及说明文本插槽控制。位于标题正下方。' },
      { num: '4', name: '步进器',     desc: '高 32 px,宽 105 px。减号图标 + 数值 + 加号图标,间距 16 px。使用 Stepper 组件实例(Stepper=Default,Style=1)。' },
      { num: '5', name: '徽章',       desc: '高 24 px,2 px 圆角,bg-info-default 填充,fg-brand-primary 文字。左图标 + 「Label」+ 右图标,间距 4 px。每行可独立配置。' },
      { num: '6', name: '分隔线',     desc: '1 px 细线,使用 border-divider。在「带说明的步进器」变体中,只要至少一个页脚项(更多信息/插槽)可见即出现。' },
      { num: '7', name: '更多信息',    desc: '纯 14 px Regular 文字,fg-primary。来自「更多信息文本」的自由字符串——尽管名称如此,Figma 规范中并无图标。' },
      { num: '8', name: '插槽',       desc: 'INSTANCE_SWAP 占位符。静止时为虚线圆角矩形,8 px 圆角。当默认页脚不够时,设计师可替换为任意组件(警示、CTA 按钮、促销)。' },
    ],
    tokenLabels: {
      containerBg:    '容器背景',
      containerBorder:'容器边框',
      title:          '标题',
      description:    '说明',
      stepperFg:      '步进器前景(+/−、数值)',
      divider:        '分隔线',
      moreInfoText:   '更多信息文本',
      badgeBg:        '徽章背景',
      badgeText:      '徽章文字',
      slotBorder:     '插槽边框',
    },
    tokenScopes: {
      containerBg:    '外层卡片填充',
      containerBorder:'卡片整体的 1 px 描边',
      title:          '标题 1 / 2 / 3 文字(14 px Regular)',
      description:    '说明 1 / 2 / 3 文字(14 px Regular)',
      stepperFg:      '+ / − 字形与数值',
      divider:        '行与页脚之间的细线(仅「带说明」)',
      moreInfoText:   '页脚辅助文字(14 px Regular)',
      badgeBg:        '徽章药丸填充',
      badgeText:      '徽章标签与图标',
      slotBorder:     'INSTANCE_SWAP 占位符描边',
    },
    usageCards: [
      { title: '单行',            color: '#0a2333', bg: '#f0f4f8', when: 'Style="仅步进器"。一个标题(可选说明)、紧凑行,语境一目了然——例如订票表单中的「成人」。' },
      { title: '带说明',          color: '#0a2333', bg: '#f9fafb', when: 'Style="带说明的步进器"。当行需要额外上下文、分隔线或下方的「更多信息」行时使用。' },
      { title: '带徽章',          color: '#0a2333', bg: '#f0f9ff', when: '状态(「有库存」)、热度或简短数字标签。文案 ≤ 2 词,以保持紧凑的 24 px 高度。' },
      { title: '购物车',          color: '#0a2333', bg: '#f0fdf4', when: '3 行,每行含标题 + 说明 + 徽章 + 步进器。页脚承载税费/总计/法律说明。' },
      { title: '表单组',          color: '#0a2333', bg: '#fffbeb', when: '成人/儿童/婴儿模式。隐藏徽章;通过「更多信息」展示限制(如「婴儿可在大人腿上免费乘坐」)。' },
      { title: '插槽覆盖',        color: '#0a2333', bg: '#fef2f2', when: 'Slot=true。当内置页脚不够时——替换为 CTA 按钮、警示或促销。' },
    ],
    whenToUse: [
      '小范围有界整数(0–99),如购物车数量、人数、份量',
      '≤ 3 个可调项的列表——使用多行而非堆叠',
      '调节时当前数值必须始终可见',
      '当上下文有助于用户决策时,使用「带说明的步进器」',
      '徽章用于状态词或计数——保持简短以适应 72 px',
    ],
    whenNotToUse: [
      '大数字(> 99)——改用数字文本输入',
      '含小数或负数的自由数值——步进器仅支持整数',
      '超过 3 行——拆分为多个列表区块,而非堆叠成一个长步进器',
      '行中无标题时——用户需要文字上下文,绝不能只有控件',
      '徽章 ≥ 3 词——会溢出药丸并破坏 24 px 行高',
    ],
  },
} as const;

// ── Figma property catalogue — cached manifest: QuantityStepper (36ee573b…) ───
// 1 VARIANT (Style, default "Stepper only") · 17 BOOLEANs · 7 TEXT slots · 2 variants.
const FIGMA_PROPERTIES: Array<{
  category: string;
  rows: Array<{ label: string; type: string; default: string }>;
}> = [
  {
    category: 'Variant',
    rows: [
      { label: 'Style',                 type: 'VARIANT', default: 'Stepper only' },
    ],
  },
  {
    category: 'Row 1 toggles',
    rows: [
      { label: 'Data 1',                type: 'BOOLEAN', default: 'true'  },
      { label: 'Title 1',               type: 'BOOLEAN', default: 'true'  },
      { label: 'Description 1',         type: 'BOOLEAN', default: 'true'  },
      { label: 'Stepper 1',             type: 'BOOLEAN', default: 'true'  },
      { label: 'Badge',                 type: 'BOOLEAN', default: 'false' },
    ],
  },
  {
    category: 'Row 2 toggles',
    rows: [
      { label: 'Data 2',                type: 'BOOLEAN', default: 'false' },
      { label: 'Title 2',               type: 'BOOLEAN', default: 'true'  },
      { label: 'Description 2',         type: 'BOOLEAN', default: 'true'  },
      { label: 'Stepper 2',             type: 'BOOLEAN', default: 'true'  },
      { label: 'Badge 2',               type: 'BOOLEAN', default: 'true'  },
    ],
  },
  {
    category: 'Row 3 toggles',
    rows: [
      { label: 'Data 3',                type: 'BOOLEAN', default: 'false' },
      { label: 'Title 3',               type: 'BOOLEAN', default: 'true'  },
      { label: 'Description 3',         type: 'BOOLEAN', default: 'true'  },
      { label: 'Stepper 3',             type: 'BOOLEAN', default: 'true'  },
      { label: 'Badge 3',               type: 'BOOLEAN', default: 'true'  },
    ],
  },
  {
    category: 'Footer toggles',
    rows: [
      { label: 'More Information',      type: 'BOOLEAN', default: 'true'  },
      { label: 'Slot',                  type: 'BOOLEAN', default: 'false' },
    ],
  },
  {
    category: 'Text slots',
    rows: [
      { label: 'Title Text 1',          type: 'TEXT',    default: '"Title 1"' },
      { label: 'Description Text 1',    type: 'TEXT',    default: '"Description 1"' },
      { label: 'Title Text 2',          type: 'TEXT',    default: '"Title 2"' },
      { label: 'Description Text 2',    type: 'TEXT',    default: '"Description 2"' },
      { label: 'Title Text 3',          type: 'TEXT',    default: '"Title 3"' },
      { label: 'Description Text 3',    type: 'TEXT',    default: '"Description 3"' },
      { label: 'More Information Text', type: 'TEXT',    default: '"Info text here"' },
    ],
  },
];

const TOKEN_TABLE_ROWS: {
  labelKey: keyof typeof COPY.en.tokenLabels;
  cssVar: string; fallback: string; tokenKey?: string;
}[] = [
  { labelKey: 'containerBg',     cssVar: '--atom-background-primary-bg-primary-inverse',  tokenKey: 'atom.background.primary.bg-primary-inverse',  fallback: '#ffffff' },
  { labelKey: 'containerBorder', cssVar: '--atom-border-default-border-default',          tokenKey: 'atom.border.default.border-default',          fallback: '#cdcbcb' },
  { labelKey: 'title',           cssVar: '--atom-foreground-core-fg-primary',             tokenKey: 'atom.foreground.core.fg-primary',             fallback: '#4b4a4a' },
  { labelKey: 'description',     cssVar: '--atom-foreground-core-fg-secondary',           tokenKey: 'atom.foreground.core.fg-secondary',           fallback: '#737272' },
  { labelKey: 'stepperFg',       cssVar: '--atom-foreground-primary-fg-brand-primary',    tokenKey: 'atom.foreground.primary.fg-brand-primary',    fallback: '#0a2333' },
  { labelKey: 'divider',         cssVar: '--atom-border-default-border-divider',          tokenKey: 'atom.border.default.border-divider',          fallback: '#cdcbcb' },
  { labelKey: 'moreInfoText',    cssVar: '--atom-foreground-core-fg-primary',             tokenKey: 'atom.foreground.core.fg-primary',             fallback: '#4b4a4a' },
  { labelKey: 'badgeBg',         cssVar: '--atom-background-alert-bg-info-default',       tokenKey: 'atom.background.alert.bg-info-default',       fallback: '#e6f0f5' },
  { labelKey: 'badgeText',       cssVar: '--atom-foreground-primary-fg-brand-primary',    tokenKey: 'atom.foreground.primary.fg-brand-primary',    fallback: '#0a2333' },
  { labelKey: 'slotBorder',      cssVar: '--atom-border-default-border-default',          tokenKey: 'atom.border.default.border-default',          fallback: '#cdcbcb' },
];

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

// ─── Figma-accurate preview primitives ──────────────────────────────────────

const FONT = "var(--atom-font-body, 'Poppins', sans-serif)";

function RowStepper() {
  const fg = 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)';
  const iconSize = 25.6;
  return (
    <div
      aria-hidden="true"
      style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        width: '105px', flexShrink: 0,
      }}
    >
      <span style={{ width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14" stroke={fg} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <span style={{
        width: 12, minWidth: 12, textAlign: 'center',
        fontFamily: FONT, fontWeight: 500, fontSize: '14px', lineHeight: '20px',
        color: fg,
      }}>0</span>
      <span style={{ width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke={fg} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  );
}

function RowBadge() {
  const bg   = 'var(--atom-background-alert-bg-info-default, #e6f0f5)';
  const fg   = 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)';
  const iconSize = 9.6;
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: '4px', height: '24px', minWidth: '24px', padding: '0 4px',
        backgroundColor: bg, color: fg,
        borderRadius: '2px',
        fontFamily: FONT, fontSize: '12px', lineHeight: '18px', fontWeight: 400,
        whiteSpace: 'nowrap', flexShrink: 0,
      }}
    >
      <svg width={iconSize} height={iconSize} viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <circle cx="5" cy="5" r="4" stroke={fg} strokeWidth="1" />
        <circle cx="5" cy="5" r="1.3" fill={fg} />
      </svg>
      Label
      <svg width={iconSize} height={iconSize} viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <circle cx="5" cy="5" r="4" stroke={fg} strokeWidth="1" />
        <circle cx="5" cy="5" r="1.3" fill={fg} />
      </svg>
    </span>
  );
}

function Row({
  titleVisible, titleText,
  descriptionVisible, descriptionText,
  stepperVisible, badgeVisible,
}: {
  titleVisible: boolean; titleText: string;
  descriptionVisible: boolean; descriptionText: string;
  stepperVisible: boolean; badgeVisible: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex', flexDirection: 'column',
          flex: '1 1 0', minWidth: 0,
          paddingRight: '8px',
          fontFamily: FONT, fontSize: '14px', lineHeight: '20px',
        }}
      >
        {titleVisible && (
          <span
            style={{
              color: 'var(--atom-foreground-core-fg-primary, #4b4a4a)',
              fontWeight: 400,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}
          >
            {titleText || '\u00A0'}
          </span>
        )}
        {descriptionVisible && (
          <span
            style={{
              color: 'var(--atom-foreground-core-fg-secondary, #737272)',
              fontWeight: 400,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}
          >
            {descriptionText || '\u00A0'}
          </span>
        )}
        {!titleVisible && !descriptionVisible && (
          <span style={{ visibility: 'hidden' }}>&nbsp;</span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {stepperVisible && <RowStepper />}
        {badgeVisible && <RowBadge />}
      </div>
    </div>
  );
}

function HairlineDivider() {
  return (
    <div
      role="separator"
      aria-hidden="true"
      style={{
        height: '1px',
        width: '100%',
        backgroundColor: 'var(--atom-border-default-border-divider, #cdcbcb)',
        flexShrink: 0,
      }}
    />
  );
}

function FooterSlot({ label }: { label: string }) {
  return (
    <div
      style={{
        width: '100%',
        borderRadius: '8px',
        border: '1px dashed var(--atom-border-default-border-default, #cdcbcb)',
        padding: '14px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--atom-foreground-core-fg-secondary, #737272)',
        fontFamily: FONT,
        fontSize: '12px',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </div>
  );
}

function StepperContainer({
  children,
}: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: '487px', maxWidth: '100%',
        backgroundColor: 'var(--atom-background-primary-bg-primary-inverse, #ffffff)',
        border: '1px solid var(--atom-border-default-border-default, #cdcbcb)',
        borderRadius: '8px',
        padding: '16px 12px',
        display: 'flex', flexDirection: 'column', alignItems: 'stretch',
        gap: '16px',
        fontFamily: FONT,
      }}
    >
      {children}
    </div>
  );
}

// ─── Small UI helpers for the controls rail ──────────────────────────────────

function Checkbox({ label, value, onToggle, disabled }: {
  label: string; value: boolean; onToggle: () => void; disabled?: boolean;
}) {
  return (
    <label
      className={[
        'flex items-center gap-2.5 select-none group',
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      <button
        role="checkbox"
        aria-checked={value}
        disabled={disabled}
        onClick={() => !disabled && onToggle()}
        className={[
          'w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-100 flex-shrink-0',
          value
            ? 'bg-slate-900 border-slate-900'
            : 'bg-white border-slate-300 group-hover:border-slate-400',
        ].join(' ')}
      >
        {value && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <span className="text-xs text-slate-600">{label}</span>
    </label>
  );
}

function TextInput({ label, value, onChange, placeholder, disabled }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; disabled?: boolean;
}) {
  return (
    <div className={disabled ? 'opacity-40 pointer-events-none' : ''}>
      <p className="text-[10px] font-medium text-slate-500 mb-1">{label}</p>
      <input
        type="text" value={value} maxLength={60}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-2 py-1 text-[11px] border border-slate-200 rounded-md text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition"
      />
    </div>
  );
}

function ControlSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-slate-200 pt-4 first:pt-0 first:border-0">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{title}</p>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function QuantityStepperPage({ brand, lang = 'en' }: QuantityStepperPageProps) {
  const t = COPY[lang];

  // Variant — Figma default is "Stepper only".
  const [style, setStyle] = useState<Style>('Stepper only');

  // Row 1 — Data 1 on, all sub-toggles on, Badge off
  const [data1,        setData1]        = useState(true);
  const [title1,       setTitle1]       = useState(true);
  const [description1, setDescription1] = useState(true);
  const [stepper1,     setStepper1]     = useState(true);
  const [badge1,       setBadge1]       = useState(false);
  const [titleText1,   setTitleText1]   = useState<string>('Title 1');
  const [descText1,    setDescText1]    = useState<string>('Description 1');

  // Row 2 — Data 2 off by default
  const [data2,        setData2]        = useState(false);
  const [title2,       setTitle2]       = useState(true);
  const [description2, setDescription2] = useState(true);
  const [stepper2,     setStepper2]     = useState(true);
  const [badge2,       setBadge2]       = useState(true);
  const [titleText2,   setTitleText2]   = useState<string>('Title 2');
  const [descText2,    setDescText2]    = useState<string>('Description 2');

  // Row 3 — Data 3 off by default
  const [data3,        setData3]        = useState(false);
  const [title3,       setTitle3]       = useState(true);
  const [description3, setDescription3] = useState(true);
  const [stepper3,     setStepper3]     = useState(true);
  const [badge3,       setBadge3]       = useState(true);
  const [titleText3,   setTitleText3]   = useState<string>('Title 3');
  const [descText3,    setDescText3]    = useState<string>('Description 3');

  // Footer — only meaningful in "Stepper with description"
  const [moreInfo,     setMoreInfo]     = useState(true);
  const [moreInfoText, setMoreInfoText] = useState<string>('Info text here');
  const [slot,         setSlot]         = useState(false);

  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  const isFull = style === 'Stepper with description';

  const previewKey = [
    style,
    data1, title1, description1, stepper1, badge1, titleText1, descText1,
    data2, title2, description2, stepper2, badge2, titleText2, descText2,
    data3, title3, description3, stepper3, badge3, titleText3, descText3,
    moreInfo, moreInfoText, slot,
  ].join('|');

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-96">

            {/* Canvas */}
            <div
              className="flex-1 flex items-center justify-center p-10 min-h-72"
              style={DOTTED_BG}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                >
                  <StepperContainer>
                    {data1 && (
                      <Row
                        titleVisible={title1} titleText={titleText1}
                        descriptionVisible={description1} descriptionText={descText1}
                        stepperVisible={stepper1} badgeVisible={badge1}
                      />
                    )}

                    {isFull && data2 && (
                      <Row
                        titleVisible={title2} titleText={titleText2}
                        descriptionVisible={description2} descriptionText={descText2}
                        stepperVisible={stepper2} badgeVisible={badge2}
                      />
                    )}
                    {isFull && data3 && (
                      <Row
                        titleVisible={title3} titleText={titleText3}
                        descriptionVisible={description3} descriptionText={descText3}
                        stepperVisible={stepper3} badgeVisible={badge3}
                      />
                    )}

                    {isFull && (moreInfo || slot) && <HairlineDivider />}

                    {isFull && moreInfo && (
                      <div
                        style={{
                          color: 'var(--atom-foreground-core-fg-primary, #4b4a4a)',
                          fontFamily: FONT,
                          fontSize: '14px', lineHeight: '20px', fontWeight: 400,
                        }}
                      >
                        {moreInfoText || '\u00A0'}
                      </div>
                    )}

                    {isFull && slot && <FooterSlot label={t.swapPlaceholder} />}
                  </StepperContainer>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-4 overflow-y-auto max-h-[640px]">

              {/* Style */}
              <ControlSection title={t.styleControl}>
                <div className="flex rounded-lg border border-slate-200 overflow-hidden w-full">
                  {STYLES.map((s) => (
                    <button key={s} onClick={() => setStyle(s)}
                      className={[
                        'flex-1 px-2 py-1.5 text-[11px] font-medium transition-all duration-100',
                        style === s ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50',
                      ].join(' ')}>
                      {t.styleNames[s]}
                    </button>
                  ))}
                </div>
                {!isFull && (
                  <p className="text-[10px] text-slate-400 mt-2 leading-snug">
                    {t.styleHint}
                  </p>
                )}
              </ControlSection>

              {/* Row 1 */}
              <ControlSection title={t.rowSection(1)}>
                <Checkbox label={t.rowDataLabel(1)}        value={data1}        onToggle={() => setData1(!data1)} />
                <Checkbox label={t.rowTitleLabel(1)}       value={title1}       onToggle={() => setTitle1(!title1)}       disabled={!data1} />
                <Checkbox label={t.rowDescriptionLabel(1)} value={description1} onToggle={() => setDescription1(!description1)} disabled={!data1} />
                <Checkbox label={t.rowStepperLabel(1)}     value={stepper1}     onToggle={() => setStepper1(!stepper1)}     disabled={!data1} />
                <Checkbox label={t.rowBadgeLabel(1)}       value={badge1}       onToggle={() => setBadge1(!badge1)}         disabled={!data1} />
                <TextInput label={t.rowTitleTextLabel(1)} value={titleText1} onChange={setTitleText1} disabled={!data1 || !title1} />
                <TextInput label={t.rowDescTextLabel(1)}  value={descText1}  onChange={setDescText1}  disabled={!data1 || !description1} />
              </ControlSection>

              {/* Row 2 */}
              <ControlSection title={t.rowSection(2)}>
                <Checkbox label={t.rowDataLabel(2)}        value={data2}        onToggle={() => setData2(!data2)} disabled={!isFull} />
                <Checkbox label={t.rowTitleLabel(2)}       value={title2}       onToggle={() => setTitle2(!title2)}       disabled={!isFull || !data2} />
                <Checkbox label={t.rowDescriptionLabel(2)} value={description2} onToggle={() => setDescription2(!description2)} disabled={!isFull || !data2} />
                <Checkbox label={t.rowStepperLabel(2)}     value={stepper2}     onToggle={() => setStepper2(!stepper2)}     disabled={!isFull || !data2} />
                <Checkbox label={t.rowBadgeLabel(2)}       value={badge2}       onToggle={() => setBadge2(!badge2)}         disabled={!isFull || !data2} />
                <TextInput label={t.rowTitleTextLabel(2)} value={titleText2} onChange={setTitleText2} disabled={!isFull || !data2 || !title2} />
                <TextInput label={t.rowDescTextLabel(2)}  value={descText2}  onChange={setDescText2}  disabled={!isFull || !data2 || !description2} />
              </ControlSection>

              {/* Row 3 */}
              <ControlSection title={t.rowSection(3)}>
                <Checkbox label={t.rowDataLabel(3)}        value={data3}        onToggle={() => setData3(!data3)} disabled={!isFull} />
                <Checkbox label={t.rowTitleLabel(3)}       value={title3}       onToggle={() => setTitle3(!title3)}       disabled={!isFull || !data3} />
                <Checkbox label={t.rowDescriptionLabel(3)} value={description3} onToggle={() => setDescription3(!description3)} disabled={!isFull || !data3} />
                <Checkbox label={t.rowStepperLabel(3)}     value={stepper3}     onToggle={() => setStepper3(!stepper3)}     disabled={!isFull || !data3} />
                <Checkbox label={t.rowBadgeLabel(3)}       value={badge3}       onToggle={() => setBadge3(!badge3)}         disabled={!isFull || !data3} />
                <TextInput label={t.rowTitleTextLabel(3)} value={titleText3} onChange={setTitleText3} disabled={!isFull || !data3 || !title3} />
                <TextInput label={t.rowDescTextLabel(3)}  value={descText3}  onChange={setDescText3}  disabled={!isFull || !data3 || !description3} />
              </ControlSection>

              {/* Footer */}
              <ControlSection title={t.footerSection}>
                <Checkbox label={t.moreInfoLabel} value={moreInfo} onToggle={() => setMoreInfo(!moreInfo)} disabled={!isFull} />
                <Checkbox label={t.slotLabel}     value={slot}     onToggle={() => setSlot(!slot)}         disabled={!isFull} />
                <TextInput label={t.moreInfoTextLabel} value={moreInfoText} onChange={setMoreInfoText} disabled={!isFull || !moreInfo} />
              </ControlSection>

            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">{t.headline}</h1>
            <p className="text-slate-500 text-sm max-w-xl">{t.tagline}</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.25" />
                <path d="M5 3v3M5 7.5v.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              </svg>
              {t.pillForms}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {t.pillStable}
            </span>
          </div>
        </div>
      </section>

      <hr className="border-slate-200" />

      {/* ── 3. ANATOMY ───────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.sectionAnatomy}</h2>
        <p className="text-sm text-slate-500 mb-5">{t.anatomyIntro}</p>

        <div className="rounded-xl p-8 border border-slate-200" style={{ ...DOTTED_BG }}>
          <div style={{ width: '520px', maxWidth: '100%', margin: '0 auto' }}>
            <img
              src={stepperWithDescriptionSvg}
              alt={`${t.headline} — ${t.styleNames['Stepper with description']}`}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              draggable={false}
            />
          </div>
        </div>

        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
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

      {/* ── 4. VARIANTS ──────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.sectionFigmaProperties}</h2>
        <p className="text-sm text-slate-500 mb-4">{t.figmaPropertiesIntro}</p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-48">{t.colProperty}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-28">{t.colType}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.colDefault}</th>
              </tr>
            </thead>
            <tbody>
              {FIGMA_PROPERTIES.flatMap((group, gi) => ([
                <tr key={`h-${group.category}`} className="bg-slate-50/70">
                  <td colSpan={3} className="px-5 py-2 text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                    {t.propertyCategories[group.category] ?? group.category}
                  </td>
                </tr>,
                ...group.rows.map((row, ri) => (
                  <tr
                    key={`${group.category}-${row.label}`}
                    className={(gi + ri) > 0 ? 'border-t border-slate-100' : ''}
                  >
                    <td className="px-5 py-2.5 font-medium text-slate-700 text-sm">{row.label}</td>
                    <td className="px-5 py-2.5">
                      <span className={[
                        'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border',
                        row.type === 'VARIANT' ? 'bg-violet-50 text-violet-700 border-violet-200'
                        : row.type === 'BOOLEAN' ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200',
                      ].join(' ')}>
                        {row.type}
                      </span>
                    </td>
                    <td className="px-5 py-2.5 text-xs text-slate-500 font-mono">{row.default}</td>
                  </tr>
                )),
              ]))}
            </tbody>
          </table>
        </div>

        {/* Visual preview grid — both shipped variants at a glance */}
        <div className="mt-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t.sectionShippedVariants}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {STYLES.map((s) => (
              <div
                key={s}
                className="rounded-xl border border-slate-200 p-5 flex flex-col gap-3"
                style={{ ...DOTTED_BG, backgroundColor: '#f8fafc' }}
              >
                <div className="rounded-lg bg-white border border-slate-100 p-4 flex items-center justify-center">
                  <img
                    src={VARIANT_SRC[s]}
                    alt={`Style=${s}`}
                    style={{ width: '100%', maxWidth: '440px', height: 'auto', display: 'block' }}
                    draggable={false}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{t.styleLabel}</span>
                  <span className="text-xs font-medium text-slate-800">{t.styleNames[s]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.sectionTokens}</h2>
        <p className="text-sm text-slate-500 mb-4">{t.tokensIntro}</p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-48">{t.colToken}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.colCss}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">{t.colResolved}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-64">{t.colScope}</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_TABLE_ROWS.map((row, i) => {
                const resolvedValue = row.tokenKey ? (tokens[row.tokenKey as keyof typeof tokens] ?? row.fallback) : row.fallback;
                const isHexColor    = resolvedValue.startsWith('#');
                const light         = isHexColor ? isLightColor(resolvedValue) : true;
                return (
                  <tr
                    key={row.cssVar + '-' + i}
                    className={i < TOKEN_TABLE_ROWS.length - 1 ? 'border-b border-slate-100' : ''}
                  >
                    <td className="px-5 py-3 font-medium text-slate-700 text-xs">{t.tokenLabels[row.labelKey]}</td>
                    <td className="px-5 py-3">
                      <code className="font-mono text-[11px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">
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
                    <td className="px-5 py-3 text-xs text-slate-500">{t.tokenScopes[row.labelKey]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 6. ACCESSIBILITY ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.sectionA11y}</h2>
        <p className="text-sm text-slate-500 mb-4">{t.a11yIntro}</p>
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
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{t.sectionUsage}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>{t.usageIntro}</p>

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
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>{t.whenToUseTitle}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              {t.whenToUse.map((line, i) => (
                <li key={i} style={{ marginBottom: i === t.whenToUse.length - 1 ? 0 : '6px' }}>• {line}</li>
              ))}
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>{t.whenNotToUseTitle}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              {t.whenNotToUse.map((line, i) => (
                <li key={i} style={{ marginBottom: i === t.whenNotToUse.length - 1 ? 0 : '6px' }}>• {line}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
