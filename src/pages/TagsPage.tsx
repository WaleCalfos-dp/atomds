import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type TagState } from '../components/tags/TagsLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';

interface TagsPageProps {
  brand: Brand;
  lang?: Language;
}

const COPY = {
  en: {
    stateLabel: 'State',
    labelLabel: 'Label',
    labelPlaceholder: 'Label text…',
    iconsLabel: 'Icons',
    iconLeft: 'Icon Left',
    iconRight: 'Icon Right',
    selectedNote: 'Selected swaps the right icon for a checkmark glyph.',
    title: 'Tags',
    intro1:
      'Compact, pill-shaped labels that categorise, filter, or mark metadata. Five states (Default, Hover, Selected, Focused, Disabled) with optional left / right icons and a single editable label. Font family updates per brand via ',
    intro2: '.',
    feedback: 'Feedback',
    stable: 'Stable',
    anatomyTitle: 'Anatomy',
    anatomyLead:
      'Default variant shown. All five states share the same anatomy; Selected swaps the right icon for a checkmark glyph.',
    anatomyParts: [
      { num: '1', name: 'Container',   desc: 'Pill-shaped wrapper. Height: 32px. Corner radius: 999px. Padding: 8px vertical / 12px horizontal. Gap between children: 4px. 1px stroke except in Selected.' },
      { num: '2', name: 'Icon Left',   desc: '14×14 SVG (rendered inside a 16×16 frame in Figma). Optional toggle \u2014 default on. Inherits the label colour.' },
      { num: '3', name: 'Label',       desc: '12px Poppins Regular (runtime font updates per brand). Line height 18px. Required \u2014 a tag without a label is not supported.' },
      { num: '4', name: 'Icon Right',  desc: '14×14 SVG. Optional toggle \u2014 default on. In the Selected state the right icon is replaced with a checkmark glyph.' },
    ],
    variantsTitle: 'Variants',
    propertyHeader: 'Property',
    valuesHeader: 'Values',
    variantRows: [
      {
        label: 'State',
        chips: [
          { text: 'Default',  note: 'default' },
          { text: 'Hover',    note: '' },
          { text: 'Selected', note: '' },
          { text: 'Focused',  note: '' },
          { text: 'Disabled', note: '' },
        ],
      },
      {
        label: 'Icon Left',
        chips: [
          { text: 'true',  note: 'default · boolean toggle' },
          { text: 'false', note: '' },
        ],
      },
      {
        label: 'Icon Right',
        chips: [
          { text: 'true',  note: 'default · checkmark when Selected' },
          { text: 'false', note: '' },
        ],
      },
      {
        label: 'Label',
        chips: [
          { text: '"Label"', note: 'default · editable string' },
        ],
      },
      {
        label: 'Concrete variants',
        chips: [
          { text: '5 total', note: 'one component per State' },
        ],
      },
      {
        label: 'Font family',
        chips: [
          { text: 'Poppins',  note: 'Dragonpass' },
          { text: 'Arial',    note: 'Mastercard' },
          { text: 'Inter',    note: 'Investec' },
          { text: 'Manrope',  note: 'Visa · Greyscale' },
          { text: 'Lato',     note: 'Assurant' },
        ],
      },
    ],
    tokensTitle: 'Design Tokens',
    tokensLead:
      'Active tokens for the selected state are highlighted. All colour values resolve against the active brand; swatches repaint with the brand switcher.',
    tokenLabels: {
      'Container bg (Default / Hover / Focused)': 'Container bg (Default / Hover / Focused)',
      'Container border (Default / Focused)': 'Container border (Default / Focused)',
      'Container border (Hover)': 'Container border (Hover)',
      'Selected bg': 'Selected bg',
      'Selected fg + icon': 'Selected fg + icon',
      'Default fg + icon': 'Default fg + icon',
      'Hover fg + icon': 'Hover fg + icon',
      'Disabled bg': 'Disabled bg',
      'Disabled fg + icon': 'Disabled fg + icon',
      'Focus ring (2px outer stroke)': 'Focus ring (2px outer stroke)',
    } as Record<string, string>,
    tokenHeader: 'Token',
    cssVarHeader: 'CSS Variable',
    fallbackHeader: 'Fallback',
    a11yTitle: 'Accessibility',
    a11yLead: 'Guidelines for building inclusive experiences with the Tags component.',
    a11yRows: [
      { icon: '🏷️', title: 'Semantic role',           body: 'Tags used as filters or toggles carry role="button" with aria-pressed reflecting the Selected state. Tags that are purely decorative (metadata labels) carry no interactive role \u2014 they are rendered as <span>.' },
      { icon: '⌨️', title: 'Keyboard interaction',    body: 'Interactive tags receive focus in the tab order and activate on Enter or Space. Disabled tags are removed from the tab order entirely.' },
      { icon: '🎯', title: 'Focus indicator',         body: 'The Focused state renders an additional 2px outer ring at 2px offset \u2014 sitting outside the 1px container border. Meets WCAG 2.4.7 (Focus Visible).' },
      { icon: '✅', title: 'Selected state',           body: 'The Selected variant flips the container to fg-brand-primary and swaps a checkmark into the right icon slot. The state change is announced via aria-pressed \u2014 never rely on colour alone.' },
      { icon: '🚫', title: 'Disabled state',           body: 'Use the aria-disabled="true" attribute on interactive tags. The Disabled visual treatment exempts the tag from WCAG 1.4.3 colour contrast under the disabled controls clause.' },
      { icon: '🔤', title: 'Label length',             body: 'Keep labels short (1\u20133 words). Long labels break the pill shape and reduce scannability. If a category name exceeds the width budget, shorten it \u2014 truncation with ellipsis loses meaning.' },
      { icon: '🧭', title: 'Grouping',                 body: 'When presenting multiple tags, wrap them in a container with role="group" and a visible or aria-labelled heading describing the category (e.g. "Filters", "Topics").' },
    ],
    usageTitle: 'Usage',
    usageLead: 'When and how to use each Tags state.',
    usageCards: [
      { title: 'Default',  color: '#0a2333', bg: '#f0f4f8', when: 'Resting state for category markers, filters, and metadata chips. Pairs well with left or right icons that indicate the tag\u2019s domain.' },
      { title: 'Hover',    color: '#0a2333', bg: '#f9fafb', when: 'Pointer-over state. Swaps the neutral border for the brand border to indicate interactivity. Only applies to tags that are actually clickable.' },
      { title: 'Selected', color: '#0f172a', bg: '#e2e8f0', when: 'Active filter or toggle state. Container fills with fg-brand-primary; right icon becomes a checkmark glyph to reinforce selection beyond colour.' },
      { title: 'Focused',  color: '#0a2333', bg: '#eef2f7', when: 'Keyboard focus state. Adds a 2px outer ring at 2px offset over the container border. Always keep focus visible \u2014 never suppress this style.' },
      { title: 'Disabled', color: '#91908f', bg: '#faf8f7', when: 'Non-interactive or unavailable tag. Cursor changes to not-allowed; aria-disabled is set. Do not use for tags that are just not yet selected \u2014 reserve for truly inert tags.' },
    ],
    doTitle: '✓ When to use',
    dontTitle: '✗ When not to use',
    doItems: [
      'Use tags to mark metadata (category, status, attributes)',
      'Use Selected as a filter-active indicator — always with the checkmark',
      'Keep labels short (1–3 words) and noun-based',
      'Group related tags with a heading or role="group"',
      'Treat interactive tags as buttons (role + aria-pressed)',
    ],
    dontItems: [
      "Don't use tags as the primary action in a view — use a Button",
      "Don't truncate long labels — shorten the content instead",
      "Don't pack a screen with tags — clutter kills scannability",
      "Don't omit aria-pressed on toggle tags — colour alone is not enough",
      "Don't use Disabled to mean \"not yet selected\" — reserve for inert tags",
    ],
  },
  zh: {
    stateLabel: '状态',
    labelLabel: '标签',
    labelPlaceholder: '标签文本…',
    iconsLabel: '图标',
    iconLeft: '左侧图标',
    iconRight: '右侧图标',
    selectedNote: '已选中状态会将右侧图标替换为对勾字符。',
    title: '标签',
    intro1:
      '紧凑的胶囊形标签,用于分类、筛选或标记元数据。五种状态(默认、悬停、已选中、聚焦、禁用),可选左/右侧图标和一个可编辑的标签。字体族通过 ',
    intro2: ' 按品牌更新。',
    feedback: '反馈',
    stable: '稳定版',
    anatomyTitle: '结构剖析',
    anatomyLead:
      '所示为默认变体。五种状态共享相同的结构;已选中状态会将右侧图标替换为对勾字符。',
    anatomyParts: [
      { num: '1', name: '容器',         desc: '胶囊形包裹元素。高度:32px。圆角半径:999px。内边距:垂直 8px / 水平 12px。子元素之间间距:4px。除已选中外都有 1px 描边。' },
      { num: '2', name: '左侧图标',     desc: '14×14 SVG(在 Figma 中渲染于 16×16 框内)。可选切换 \u2014 默认开启。继承标签颜色。' },
      { num: '3', name: '标签',         desc: '12px Poppins Regular(运行时字体按品牌更新)。行高 18px。必填 \u2014 不支持没有标签的 tag。' },
      { num: '4', name: '右侧图标',     desc: '14×14 SVG。可选切换 \u2014 默认开启。在已选中状态下,右侧图标会被替换为对勾字符。' },
    ],
    variantsTitle: '变体',
    propertyHeader: '属性',
    valuesHeader: '值',
    variantRows: [
      {
        label: '状态',
        chips: [
          { text: 'Default',  note: '默认' },
          { text: 'Hover',    note: '' },
          { text: 'Selected', note: '' },
          { text: 'Focused',  note: '' },
          { text: 'Disabled', note: '' },
        ],
      },
      {
        label: '左侧图标',
        chips: [
          { text: 'true',  note: '默认 · 布尔开关' },
          { text: 'false', note: '' },
        ],
      },
      {
        label: '右侧图标',
        chips: [
          { text: 'true',  note: '默认 · 已选中时显示对勾' },
          { text: 'false', note: '' },
        ],
      },
      {
        label: '标签',
        chips: [
          { text: '"Label"', note: '默认 · 可编辑字符串' },
        ],
      },
      {
        label: '具体变体',
        chips: [
          { text: '共 5 个', note: '每个状态一个组件' },
        ],
      },
      {
        label: '字体族',
        chips: [
          { text: 'Poppins',  note: 'Dragonpass' },
          { text: 'Arial',    note: 'Mastercard' },
          { text: 'Inter',    note: 'Investec' },
          { text: 'Manrope',  note: 'Visa · Greyscale' },
          { text: 'Lato',     note: 'Assurant' },
        ],
      },
    ],
    tokensTitle: '设计令牌',
    tokensLead:
      '当前所选状态激活的令牌已高亮显示。所有颜色值会按当前品牌解析;色板会随品牌切换器重绘。',
    tokenLabels: {
      'Container bg (Default / Hover / Focused)': '容器背景(默认 / 悬停 / 聚焦)',
      'Container border (Default / Focused)': '容器边框(默认 / 聚焦)',
      'Container border (Hover)': '容器边框(悬停)',
      'Selected bg': '已选中背景',
      'Selected fg + icon': '已选中前景 + 图标',
      'Default fg + icon': '默认前景 + 图标',
      'Hover fg + icon': '悬停前景 + 图标',
      'Disabled bg': '禁用背景',
      'Disabled fg + icon': '禁用前景 + 图标',
      'Focus ring (2px outer stroke)': '焦点环(2px 外描边)',
    } as Record<string, string>,
    tokenHeader: '令牌',
    cssVarHeader: 'CSS 变量',
    fallbackHeader: '回退值',
    a11yTitle: '可访问性',
    a11yLead: '使用 Tags 组件构建无障碍体验的指南。',
    a11yRows: [
      { icon: '🏷️', title: '语义角色',          body: '用作筛选器或开关的 tag 带有 role="button" 并通过 aria-pressed 反映已选中状态。纯装饰性的 tag(元数据标签)不带交互角色 \u2014 它们渲染为 <span>。' },
      { icon: '⌨️', title: '键盘交互',          body: '可交互的 tag 在 Tab 顺序中获得焦点,通过 Enter 或 Space 激活。禁用的 tag 完全从 Tab 顺序中移除。' },
      { icon: '🎯', title: '焦点指示器',        body: '聚焦状态在 1px 容器边框之外渲染额外的 2px 外环,偏移 2px。符合 WCAG 2.4.7(焦点可见)。' },
      { icon: '✅', title: '已选中状态',         body: '已选中变体将容器翻转为 fg-brand-primary,并将对勾字符替换到右侧图标插槽。状态变化通过 aria-pressed 通报 \u2014 切勿仅依赖颜色。' },
      { icon: '🚫', title: '禁用状态',           body: '在可交互的 tag 上使用 aria-disabled="true" 属性。禁用的视觉处理依据"禁用控件"条款豁免 WCAG 1.4.3 颜色对比度。' },
      { icon: '🔤', title: '标签长度',           body: '保持标签简短(1\u20133 个词)。长标签会破坏胶囊形状并降低易扫读性。如果类别名称超出宽度预算,请缩短它 \u2014 用省略号截断会丢失含义。' },
      { icon: '🧭', title: '分组',               body: '展示多个 tag 时,将其包裹在带有 role="group" 的容器中,并附上一个可见或 aria 标记的标题来描述类别(例如"筛选器"、"主题")。' },
    ],
    usageTitle: '用法',
    usageLead: '何时以及如何使用每种 Tags 状态。',
    usageCards: [
      { title: 'Default',  color: '#0a2333', bg: '#f0f4f8', when: '用于类别标记、筛选器和元数据 chip 的静态状态。与表示 tag 领域的左侧或右侧图标搭配良好。' },
      { title: 'Hover',    color: '#0a2333', bg: '#f9fafb', when: '指针悬停状态。将中性边框替换为品牌边框以表明可交互性。仅适用于真正可点击的 tag。' },
      { title: 'Selected', color: '#0f172a', bg: '#e2e8f0', when: '激活的筛选或切换状态。容器以 fg-brand-primary 填充;右侧图标变为对勾字符,以颜色之外的方式强化选中。' },
      { title: 'Focused',  color: '#0a2333', bg: '#eef2f7', when: '键盘焦点状态。在容器边框上方添加偏移 2px 的 2px 外环。始终保持焦点可见 \u2014 切勿抑制此样式。' },
      { title: 'Disabled', color: '#91908f', bg: '#faf8f7', when: '不可交互或不可用的 tag。光标变为 not-allowed;设置 aria-disabled。不要用于"尚未选中"的 tag \u2014 仅保留给真正惰性的 tag。' },
    ],
    doTitle: '✓ 推荐做法',
    dontTitle: '✗ 避免做法',
    doItems: [
      '使用 tag 标记元数据(类别、状态、属性)',
      '将已选中作为筛选器激活指示器 — 始终配合对勾',
      '保持标签简短(1–3 个词)并基于名词',
      '使用标题或 role="group" 对相关 tag 分组',
      '将可交互的 tag 视为按钮(role + aria-pressed)',
    ],
    dontItems: [
      '不要将 tag 用作视图中的主要操作 — 使用 Button',
      '不要截断长标签 — 改为缩短内容',
      '不要在屏幕上堆满 tag — 杂乱会破坏易扫读性',
      '不要在切换 tag 上省略 aria-pressed — 仅靠颜色不够',
      '不要用禁用表示"尚未选中" — 保留给惰性的 tag',
    ],
  },
} as const;

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const ALL_STATES: TagState[] = ['Default', 'Hover', 'Selected', 'Focused', 'Disabled'];

const STATE_META: Record<TagState, { dotColor: string; dotBorder: string }> = {
  Default:  { dotColor: '#ffffff',                                              dotBorder: '#cdcbcb' },
  Hover:    { dotColor: '#ffffff',                                              dotBorder: 'var(--atom-border-default-border-default-brand)' },
  Selected: { dotColor: 'var(--atom-background-primary-bg-primary-default)',    dotBorder: 'var(--atom-background-primary-bg-primary-default)' },
  Focused:  { dotColor: '#ffffff',                                              dotBorder: 'var(--atom-border-selection-and-focus-border-selected)' },
  Disabled: { dotColor: 'var(--atom-background-primary-bg-primary-disabled-inverse)', dotBorder: '#cdcbcb' },
};

type TokenRow = {
  label: string;
  cssVar: string;
  tokenKey?: string;
  fallback: string;
  states: TagState[];
};

const TOKEN_TABLE_ROWS: TokenRow[] = [
  { label: 'Container bg (Default / Hover / Focused)', cssVar: '--atom-background-primary-bg-primary-inverse',           tokenKey: 'atom.background.primary.bg-primary-inverse',           fallback: '#ffffff',   states: ['Default', 'Hover', 'Focused'] },
  { label: 'Container border (Default / Focused)',     cssVar: '--atom-border-default-border-default',                   tokenKey: 'atom.border.default.border-default',                   fallback: '#cdcbcb',   states: ['Default', 'Focused', 'Disabled'] },
  { label: 'Container border (Hover)',                 cssVar: '--atom-border-default-border-default-brand',             tokenKey: 'atom.border.default.border-default-brand',             fallback: '#0a2333',   states: ['Hover'] },
  { label: 'Selected bg',                              cssVar: '--atom-background-primary-bg-primary-default',           tokenKey: 'atom.background.primary.bg-primary-default',           fallback: '#0a2333',   states: ['Selected'] },
  { label: 'Selected fg + icon',                       cssVar: '--atom-foreground-primary-fg-brand-primary-inverse',     tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse',     fallback: '#ffffff',   states: ['Selected'] },
  { label: 'Default fg + icon',                        cssVar: '--atom-foreground-core-fg-primary',                      tokenKey: 'atom.foreground.core.fg-primary',                      fallback: '#4b4a4a',   states: ['Default', 'Focused'] },
  { label: 'Hover fg + icon',                          cssVar: '--atom-foreground-primary-fg-brand-primary',             tokenKey: 'atom.foreground.primary.fg-brand-primary',             fallback: '#0a2333',   states: ['Hover'] },
  { label: 'Disabled bg',                              cssVar: '--atom-background-primary-bg-primary-disabled-inverse',  tokenKey: 'atom.background.primary.bg-primary-disabled-inverse',  fallback: '#faf8f7',   states: ['Disabled'] },
  { label: 'Disabled fg + icon',                       cssVar: '--atom-foreground-states-fg-disabled',                   tokenKey: 'atom.foreground.states.fg-disabled',                   fallback: '#91908f',   states: ['Disabled'] },
  { label: 'Focus ring (2px outer stroke)',            cssVar: '--atom-border-selection-and-focus-border-selected',      tokenKey: 'atom.border.selection-and-focus.border-selected',      fallback: '#0a2333',   states: ['Focused'] },
];

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

/** Exact placeholder icon from Figma Tags (outlined square). 16×16 wrapper, 13×13 glyph. */
function PlaceholderIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0, display: 'block' }}>
      <path
        d="M19.5 3H4.5C4.10218 3 3.72064 3.15804 3.43934 3.43934C3.15804 3.72064 3 4.10218 3 4.5V19.5C3 19.8978 3.15804 20.2794 3.43934 20.5607C3.72064 20.842 4.10218 21 4.5 21H19.5C19.8978 21 20.2794 20.842 20.5607 20.5607C20.842 20.2794 21 19.8978 21 19.5V4.5C21 4.10218 20.842 3.72064 20.5607 3.43934C20.2794 3.15804 19.8978 3 19.5 3ZM19.5 19.5H4.5V4.5H19.5V19.5Z"
        fill={color}
      />
    </svg>
  );
}

/** Selected-state right icon: checkmark (Figma renders this in place of the generic right icon). */
function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true" style={{ flexShrink: 0, display: 'block' }}>
      <path d="M1.5 5.5L4 8L10.5 1.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Inline preview that mirrors Figma geometry 1:1:
 *   - 32px height · 999 radius · padding 8/12 · 4px gap
 *   - 12px Poppins Regular label · 18px line height
 *   - Per-state fills/strokes/colours from the Figma Atom Tags variants
 *   - Focused = 1px container border + 2px outer ring at 2px offset (box-shadow)
 */
function TagsPreview({
  state = 'Default',
  label = 'Label',
  showIconLeft = true,
  showIconRight = true,
}: {
  state?: TagState;
  label?: string;
  showIconLeft?: boolean;
  showIconRight?: boolean;
}) {
  const isSelected = state === 'Selected';
  const isDisabled = state === 'Disabled';
  const isHover    = state === 'Hover';
  const isFocused  = state === 'Focused';

  const bg = isSelected
    ? 'var(--atom-background-primary-bg-primary-default, #0a2333)'
    : isDisabled
    ? 'var(--atom-background-primary-bg-primary-disabled-inverse, #faf8f7)'
    : 'var(--atom-background-primary-bg-primary-inverse, #ffffff)';

  const borderColor = isSelected
    ? 'transparent'
    : isHover
    ? 'var(--atom-border-default-border-default-brand, #0a2333)'
    : 'var(--atom-border-default-border-default, #cdcbcb)';

  const fgColor = isSelected
    ? 'var(--atom-foreground-primary-fg-brand-primary-inverse, #ffffff)'
    : isDisabled
    ? 'var(--atom-foreground-states-fg-disabled, #91908f)'
    : isHover
    ? 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)'
    : 'var(--atom-foreground-core-fg-primary, #4b4a4a)';

  /* Focused = 1px container border + 2px outer ring at 2px offset (Figma: 80×36 outer frame over 76×32 inner) */
  const boxShadow = isFocused
    ? '0 0 0 2px #ffffff, 0 0 0 4px var(--atom-border-selection-and-focus-border-selected, #0a2333)'
    : 'none';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        height: '32px',
        padding: '0 12px',
        borderRadius: '999px',
        backgroundColor: bg,
        border: isSelected ? 'none' : `1px solid ${borderColor}`,
        color: fgColor,
        fontFamily: 'var(--atom-font-body, Poppins, sans-serif)',
        fontSize: '12px',
        fontWeight: 400,
        lineHeight: '18px',
        boxSizing: 'border-box',
        cursor: isDisabled ? 'not-allowed' : 'default',
        userSelect: 'none',
        boxShadow,
        transition: 'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease',
      }}
    >
      {showIconLeft && <PlaceholderIcon color={fgColor} />}
      <span style={{ whiteSpace: 'nowrap' }}>{label}</span>
      {showIconRight && (
        isSelected ? <CheckIcon color={fgColor} /> : <PlaceholderIcon color={fgColor} />
      )}
    </div>
  );
}

export function TagsPage({ brand, lang = 'en' }: TagsPageProps) {
  const t = COPY[lang];
  const [state, setState]               = useState<TagState>('Default');
  const [label, setLabel]               = useState('Label');
  const [showIconLeft, setShowIconLeft] = useState(true);
  const [showIconRight, setShowIconRight] = useState(true);

  const previewKey = `${state}-${label}-${showIconLeft}-${showIconRight}`;
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-72">

            {/* Canvas */}
            <div
              className="flex-1 flex items-center justify-center p-12 min-h-52"
              style={DOTTED_BG}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                >
                  <TagsPreview
                    state={state}
                    label={label}
                    showIconLeft={showIconLeft}
                    showIconRight={showIconRight}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5 overflow-y-auto">

              {/* State */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.stateLabel}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {ALL_STATES.map((s) => {
                    const meta = STATE_META[s];
                    return (
                      <button
                        key={s}
                        onClick={() => setState(s)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          padding: '4px 10px', borderRadius: '6px',
                          fontSize: '12px', fontWeight: 500, border: '1px solid',
                          cursor: 'pointer', textAlign: 'left', width: '100%',
                          transition: 'all 0.1s ease',
                          ...(state === s
                            ? { backgroundColor: '#0f172a', color: '#ffffff', borderColor: '#0f172a', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }
                            : { backgroundColor: 'transparent', color: '#475569', borderColor: '#e2e8f0' }),
                        }}
                      >
                        <span style={{
                          width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                          border: '1.5px solid', backgroundColor: meta.dotColor, borderColor: meta.dotBorder,
                        }} />
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Label text */}
              <div>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>{t.labelLabel}</p>
                <input
                  type="text" value={label} maxLength={30}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-md text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition"
                  placeholder={t.labelPlaceholder}
                />
              </div>

              {/* Icons */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.iconsLabel}</p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: t.iconLeft,  value: showIconLeft,  set: setShowIconLeft },
                    { label: t.iconRight, value: showIconRight, set: setShowIconRight },
                  ].map(({ label: lbl, value, set }) => (
                    <label key={lbl} className="flex items-center gap-2.5 cursor-pointer select-none group">
                      <button role="checkbox" aria-checked={value} onClick={() => set(!value)}
                        className={['w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-100 flex-shrink-0',
                          value ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-300 group-hover:border-slate-400'].join(' ')}>
                        {value && (
                          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                            <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                      <span className="text-xs text-slate-600">{lbl}</span>
                    </label>
                  ))}
                </div>
                {state === 'Selected' && showIconRight && (
                  <p style={{ marginTop: '6px', fontSize: '11px', color: '#64748b', lineHeight: 1.4 }}>
                    {t.selectedNote}
                  </p>
                )}
              </div>

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
              {t.intro1}<code className="text-xs bg-slate-100 px-1 rounded">--atom-font-body</code>{t.intro2}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.25" />
                <path d="M5 3v3M5 7.5v.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              </svg>
              {t.feedback}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {t.stable}
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
          <TagsPreview state="Default" label="Label" showIconLeft showIconRight />
          {/* 1 — Container (bottom) */}
          <div className="absolute bottom-4 flex flex-col items-center pointer-events-none" style={{ left: '50%', transform: 'translateX(-50%)' }}>
            <div className="w-px bg-slate-400" style={{ height: '32px' }} />
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">1</span>
          </div>
          {/* 2 — Icon Left (top) */}
          <div className="absolute top-4 flex flex-col items-center pointer-events-none" style={{ left: '42%', transform: 'translateX(-50%)' }}>
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">2</span>
            <div className="w-px bg-slate-400" style={{ height: '28px' }} />
          </div>
          {/* 3 — Label (top) */}
          <div className="absolute top-4 flex flex-col items-center pointer-events-none" style={{ left: '50%', transform: 'translateX(-50%)' }}>
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">3</span>
            <div className="w-px bg-slate-400" style={{ height: '28px' }} />
          </div>
          {/* 4 — Icon Right (top) */}
          <div className="absolute top-4 flex flex-col items-center pointer-events-none" style={{ left: '58%', transform: 'translateX(-50%)' }}>
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">4</span>
            <div className="w-px bg-slate-400" style={{ height: '28px' }} />
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
        <h2 className="text-base font-semibold text-slate-900 mb-4">{t.variantsTitle}</h2>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">{t.propertyHeader}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.valuesHeader}</th>
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

        {/* Visual preview of all 5 states */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {ALL_STATES.map(s => (
            <div key={s} style={{
              padding: '24px 28px', borderRadius: '10px',
              border: '1px solid #f3f4f6',
              backgroundColor: '#fafafa',
              display: 'flex', flexDirection: 'column', gap: '10px',
            }}>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>{s}</p>
              <TagsPreview state={s} label="Label" showIconLeft showIconRight />
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.tokensTitle}</h2>
        <p className="text-sm text-slate-500 mb-4">
          {t.tokensLead}
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-56">{t.tokenHeader}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.cssVarHeader}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">{t.fallbackHeader}</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_TABLE_ROWS.map((row, i) => {
                const isActive       = row.states.includes(state);
                const resolvedValue  = row.tokenKey ? (tokens[row.tokenKey as keyof typeof tokens] ?? row.fallback) : row.fallback;
                const isHexColor     = resolvedValue.startsWith('#');
                const light          = isHexColor ? isLightColor(resolvedValue) : true;
                const localizedLabel = t.tokenLabels[row.label] ?? row.label;
                return (
                  <tr
                    key={row.label}
                    className={[
                      i < TOKEN_TABLE_ROWS.length - 1 ? 'border-b border-slate-100' : '',
                      isActive ? 'bg-blue-50/60' : 'opacity-40',
                      'transition-all duration-150',
                    ].join(' ')}
                    style={isActive ? { borderLeft: '3px solid #3b82f6' } : { borderLeft: '3px solid transparent' }}
                  >
                    <td className="px-5 py-3 font-medium text-slate-700 text-xs">{localizedLabel}</td>
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

        {/* Do / Don't */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>{t.doTitle}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              {t.doItems.map((item, idx) => (
                <li key={idx} style={{ marginBottom: idx < t.doItems.length - 1 ? '6px' : 0 }}>• {item}</li>
              ))}
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>{t.dontTitle}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              {t.dontItems.map((item, idx) => (
                <li key={idx} style={{ marginBottom: idx < t.dontItems.length - 1 ? '6px' : 0 }}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
