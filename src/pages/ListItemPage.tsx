import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ListItemLive,
  type ListItemType,
  type ListItemStyle,
  type ListItemState,
} from '../components/list-item/ListItemLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';

interface ListItemPageProps {
  brand: Brand;
  lang?: Language;
}

// ─── Bilingual copy block ─────────────────────────────────────────────────
const COPY = {
  en: {
    // Controls
    ctrlType: 'Type',
    ctrlStyle: 'Style',
    ctrlState: 'State',
    ctrlSlots: 'Slots',
    slotLeading: 'Leading icon',
    slotTrailing: 'Trailing icon',
    slotCheckbox: 'Checkbox',
    // Section 2 — Component Info
    componentTitle: 'List Item',
    description:
      'A row in a structured list. Supports five states, six layout types, and optional leading / trailing slots for icons, checkboxes, flags, or trailing metadata — all driven by brand tokens.',
    pillFeedback: 'Feedback',
    pillStable: 'Stable',
    // Section 3 — Anatomy
    anatomyTitle: 'Anatomy',
    anatomyLead: 'The List Item is composed of four parts. Leading and trailing slots are optional.',
    anatomyParts: [
      { num: '1', name: 'Container',        desc: 'Rounded wrapper (8px radius) with state-driven border and background. Focused state adds a 2px ring with −3px inset and 10px outer radius.' },
      { num: '2', name: 'Leading slot',     desc: 'Optional 20×20 checkbox, icon, flag (Country) or continents glyph (Region). Leading content aligns to top-start of the row.' },
      { num: '3', name: 'Primary content',  desc: 'Title in Poppins Medium 14/20 (fg-brand-primary) above subtitle in Poppins Regular 12/18 (fg-primary). Title dims to fg-primary on hover, fg-disabled when disabled.' },
      { num: '4', name: 'Trailing slot',    desc: 'Optional right-aligned title + subtitle pair and/or a 20×20 icon tile. Mirrors leading-slot alignment and inherits the same icon color.' },
    ],
    // Section 4 — Variants
    variantsTitle: 'Variants',
    propertyHeader: 'Property',
    valuesHeader: 'Values',
    propertyType: 'Type',
    propertyStyle: 'Style',
    propertyState: 'State',
    propertyBooleans: 'Booleans (25)',
    propertyBooleansValues: 'Icon Left, Title, Subtitle, Icon Right, Checkbox Left, Checkbox right, Title Right, Subtitle Right, Content Right, Title and Sub Right, Content Left, Country Flag, Continents, List Item 1–6, List Item (Last), Icon Left 2, Subtitle 2, Content Bottom, Slot Left, Slot Right',
    propertyTextSlots: 'Text slots (7)',
    propertyTextSlotsValues: 'Title Left, Subtitle Left, Subtitle Text 2, Title Right Text, Subtitle Right Text, Region, Country',
    // Section 5 — Design Tokens
    tokensTitle: 'Design Tokens',
    tokensLead: 'Active tokens for the selected state are highlighted. Switch State or Brand to see values update.',
    tokenHeader: 'Token',
    cssVarHeader: 'CSS Variable',
    valueHeader: 'Value',
    tokenLabels: {
      'Surface (default)':       'Surface (default)',
      'Surface (hover)':         'Surface (hover)',
      'Surface (disabled)':      'Surface (disabled)',
      'Border (default)':        'Border (default)',
      'Border (hover)':          'Border (hover)',
      'Border (selected)':       'Border (selected)',
      'Border (disabled)':       'Border (disabled)',
      'Divider':                 'Divider',
      'Title (default)':         'Title (default)',
      'Title (hover) / Subtitle':'Title (hover) / Subtitle',
      'Text (disabled)':         'Text (disabled)',
      'Checkbox fill (checked)': 'Checkbox fill (checked)',
    } as Record<string, string>,
    // Section 6 — Accessibility
    a11yTitle: 'Accessibility',
    a11yLead: 'Guidelines for implementing List Item in an inclusive way.',
    a11yRows: [
      {
        icon: '📋',
        title: 'List semantics',
        body: 'Wrap List Items in a <ul> or <ol> with role="list"; each row should be a <li>. Interactive rows use role="option" inside a role="listbox" container when the list represents a selection.',
      },
      {
        icon: '☑️',
        title: 'Selection state',
        body: 'Selected rows set aria-selected="true" (listbox) or use a native checkbox with aria-checked. Never rely on the blue border alone — the built-in checkbox slot ensures the state is also conveyed by shape.',
      },
      {
        icon: '⌨️',
        title: 'Keyboard navigation',
        body: 'Interactive rows are reachable in tab order. Arrow keys move focus between rows when the list uses roving tabindex; Enter or Space toggles selection.',
      },
      {
        icon: '🎯',
        title: 'Focus indicator',
        body: 'Focused rows render a 2px inset ring in fg-brand-primary that sits 3px outside the row, so the indicator remains visible even when rows are flush against container edges.',
      },
      {
        icon: '🎨',
        title: 'Contrast',
        body: 'Title (fg-brand-primary), subtitle (fg-primary), and disabled text (fg-disabled) all meet WCAG AA 4.5:1 against every surface token (primary-inverse, secondary, disabled-inverse) across all 6 brands.',
      },
    ],
    // Section 7 — Usage
    usageTitle: 'Usage',
    usageLead: 'When and how to use the List Item component.',
    whenUseTitle: '✓ When to use',
    whenNotUseTitle: '✗ When not to use',
    whenUseItems: [
      'Display a collection of items with consistent metadata',
      'Build selectable picker lists (checkboxes, radio groups)',
      'Navigate to a detail page for each row (Interactive)',
      'Summarise grouped records with a shared section header',
    ],
    whenNotUseItems: [
      "Don't use for a dense data grid — use a Table",
      "Don't use for a single key-value pair — use a Data Row",
      "Don't mix types inside one list (e.g. Country + Stacked)",
      "Don't pack more than one Trailing slot — it crowds the row",
    ],
  },
  zh: {
    // Controls
    ctrlType: '类型',
    ctrlStyle: '样式',
    ctrlState: '状态',
    ctrlSlots: '插槽',
    slotLeading: '前置图标',
    slotTrailing: '尾部图标',
    slotCheckbox: '复选框',
    // Section 2 — Component Info
    componentTitle: '列表项',
    description:
      '结构化列表中的一行。支持五种状态、六种布局类型，以及可选的前置 / 尾部插槽，用于图标、复选框、旗帜或尾部元数据——全部由品牌令牌驱动。',
    pillFeedback: '反馈',
    pillStable: '稳定版',
    // Section 3 — Anatomy
    anatomyTitle: '结构剖析',
    anatomyLead: '列表项由四个部分组成。前置和尾部插槽是可选的。',
    anatomyParts: [
      { num: '1', name: '容器',     desc: '圆角包裹层（8px 圆角），具有由状态驱动的边框和背景。焦点状态增加 2px 内嵌 −3px 的边框环和 10px 外圆角。' },
      { num: '2', name: '前置插槽',  desc: '可选的 20×20 复选框、图标、旗帜（国家）或大陆图形（地区）。前置内容对齐到行的顶部起始位置。' },
      { num: '3', name: '主要内容',  desc: '标题为 Poppins Medium 14/20（fg-brand-primary），副标题为 Poppins Regular 12/18（fg-primary）。标题在悬停时变为 fg-primary，禁用时变为 fg-disabled。' },
      { num: '4', name: '尾部插槽',  desc: '可选的右对齐标题+副标题对和/或 20×20 图标块。与前置插槽对齐方式一致，继承相同的图标颜色。' },
    ],
    // Section 4 — Variants
    variantsTitle: '变体',
    propertyHeader: '属性',
    valuesHeader: '值',
    propertyType: '类型',
    propertyStyle: '样式',
    propertyState: '状态',
    propertyBooleans: '布尔值 (25)',
    propertyBooleansValues: 'Icon Left、Title、Subtitle、Icon Right、Checkbox Left、Checkbox right、Title Right、Subtitle Right、Content Right、Title and Sub Right、Content Left、Country Flag、Continents、List Item 1–6、List Item (Last)、Icon Left 2、Subtitle 2、Content Bottom、Slot Left、Slot Right',
    propertyTextSlots: '文本插槽 (7)',
    propertyTextSlotsValues: 'Title Left、Subtitle Left、Subtitle Text 2、Title Right Text、Subtitle Right Text、Region、Country',
    // Section 5 — Design Tokens
    tokensTitle: '设计令牌',
    tokensLead: '所选状态下的活动令牌已高亮显示。切换状态或品牌可查看值的更新。',
    tokenHeader: '设计令牌',
    cssVarHeader: 'CSS 变量',
    valueHeader: '值',
    tokenLabels: {
      'Surface (default)':       '表面（默认）',
      'Surface (hover)':         '表面（悬停）',
      'Surface (disabled)':      '表面（禁用）',
      'Border (default)':        '边框（默认）',
      'Border (hover)':          '边框（悬停）',
      'Border (selected)':       '边框（已选中）',
      'Border (disabled)':       '边框（禁用）',
      'Divider':                 '分割线',
      'Title (default)':         '标题（默认）',
      'Title (hover) / Subtitle':'标题（悬停） / 副标题',
      'Text (disabled)':         '文本（禁用）',
      'Checkbox fill (checked)': '复选框填充（选中）',
    } as Record<string, string>,
    // Section 6 — Accessibility
    a11yTitle: '可访问性',
    a11yLead: '以包容性方式实现列表项的指引。',
    a11yRows: [
      {
        icon: '📋',
        title: '列表语义',
        body: '将列表项包裹在带有 role="list" 的 <ul> 或 <ol> 中；每一行应为 <li>。当列表表示选择时，交互式行在 role="listbox" 容器中使用 role="option"。',
      },
      {
        icon: '☑️',
        title: '选中状态',
        body: '已选中的行应设置 aria-selected="true"（listbox），或使用带 aria-checked 的原生复选框。切勿仅依赖蓝色边框——内置的复选框插槽可确保通过形状也能传达该状态。',
      },
      {
        icon: '⌨️',
        title: '键盘导航',
        body: '交互式行可通过 Tab 键到达。当列表使用 roving tabindex 时，方向键在行间移动焦点；回车或空格键切换选择。',
      },
      {
        icon: '🎯',
        title: '焦点指示器',
        body: '获焦行渲染 2px 的 fg-brand-primary 内嵌环，位于行外 3px 处，因此即使行紧贴容器边缘，指示器依然可见。',
      },
      {
        icon: '🎨',
        title: '对比度',
        body: '标题（fg-brand-primary）、副标题（fg-primary）和禁用文本（fg-disabled）在所有 6 个品牌的每个表面令牌（primary-inverse、secondary、disabled-inverse）上均满足 WCAG AA 4.5:1 对比度。',
      },
    ],
    // Section 7 — Usage
    usageTitle: '用法',
    usageLead: '何时以及如何使用列表项组件。',
    whenUseTitle: '✓ 何时使用',
    whenNotUseTitle: '✗ 何时不使用',
    whenUseItems: [
      '展示具有一致元数据的项目集合',
      '构建可选择的选择器列表（复选框、单选组）',
      '为每一行导航到详情页面（Interactive）',
      '使用共享的分组标题汇总分组记录',
    ],
    whenNotUseItems: [
      '不要用于密集的数据网格——请使用 Table',
      '不要用于单一键值对——请使用 Data Row',
      '不要在同一列表中混合类型（例如 Country + Stacked）',
      '不要在尾部插槽中堆放多于一个元素——会让该行过于拥挤',
    ],
  },
} as const;

// ─── Design-token table rows (states column drives active-row highlighting) ──
const TOKEN_TABLE_ROWS: { label: string; key: string; cssVar: string; states: ListItemState[] }[] = [
  { label: 'Surface (default)',      key: 'atom.background.primary.bg-primary-inverse',        cssVar: '--atom-background-primary-bg-primary-inverse',        states: ['Default', 'Selected', 'Focused'] },
  { label: 'Surface (hover)',        key: 'atom.background.core.bg-secondary-hover',           cssVar: '--atom-background-core-bg-secondary-hover',           states: ['Hover'] },
  { label: 'Surface (disabled)',     key: 'atom.background.primary.bg-primary-disabled-inverse', cssVar: '--atom-background-primary-bg-primary-disabled-inverse', states: ['Disabled'] },
  { label: 'Border (default)',       key: 'atom.border.default.border-default',                cssVar: '--atom-border-default-border-default',                states: ['Default'] },
  { label: 'Border (hover)',         key: 'atom.border.states.border-hover',                   cssVar: '--atom-border-states-border-hover',                   states: ['Hover'] },
  { label: 'Border (selected)',      key: 'atom.border.selection-and-focus.border-selected',   cssVar: '--atom-border-selection-and-focus-border-selected',   states: ['Selected', 'Focused'] },
  { label: 'Border (disabled)',      key: 'atom.border.states.border-disabled',                cssVar: '--atom-border-states-border-disabled',                states: ['Disabled'] },
  { label: 'Divider',                key: 'atom.border.default.border-divider',                cssVar: '--atom-border-default-border-divider',                states: ['Default', 'Hover', 'Selected', 'Focused', 'Disabled'] },
  { label: 'Title (default)',        key: 'atom.foreground.primary.fg-brand-primary',          cssVar: '--atom-foreground-primary-fg-brand-primary',          states: ['Default', 'Selected', 'Focused'] },
  { label: 'Title (hover) / Subtitle', key: 'atom.foreground.core.fg-primary',                 cssVar: '--atom-foreground-core-fg-primary',                   states: ['Default', 'Hover', 'Selected', 'Focused'] },
  { label: 'Text (disabled)',        key: 'atom.foreground.states.fg-disabled',                cssVar: '--atom-foreground-states-fg-disabled',                states: ['Disabled'] },
  { label: 'Checkbox fill (checked)',key: 'atom.background.primary.bg-primary-pressed',        cssVar: '--atom-background-primary-bg-primary-pressed',        states: ['Selected'] },
];

const STATE_DOT: Record<ListItemState, { bg: string; border: string }> = {
  Default:  { bg: '#ffffff', border: '#cdcbcb' },
  Hover:    { bg: 'rgba(10,35,51,0.08)', border: '#045477' },
  Focused:  { bg: '#ffffff', border: '#0a2333' },
  Selected: { bg: '#ffffff', border: '#0a2333' },
  Disabled: { bg: '#faf8f7', border: '#cdcbcb' },
};

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

// Dotted canvas background
const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// ─── Segmented button ────────────────────────────────────────────────────────
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
      className={[
        'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
        active
          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

const ALL_TYPES: ListItemType[] = ['Single', 'Stacked', 'Single + Description', 'Country', 'Region', 'Group'];
const ALL_STYLES: ListItemStyle[] = ['Not Interactive', 'Interactive'];
const ALL_STATES: ListItemState[] = ['Default', 'Hover', 'Focused', 'Selected', 'Disabled'];

// Types that don't support the full 5-state matrix (Country, Region, Group only render Default)
const FULL_STATE_TYPES: ListItemType[] = ['Single', 'Stacked', 'Single + Description'];

export function ListItemPage({ brand, lang = 'en' }: ListItemPageProps) {
  const t = COPY[lang];
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  const [type, setType] = useState<ListItemType>('Single');
  const [itemStyle, setItemStyle] = useState<ListItemStyle>('Interactive');
  const [state, setState] = useState<ListItemState>('Default');
  const [showLeftIcon, setShowLeftIcon] = useState(false);
  const [showRightIcon, setShowRightIcon] = useState(false);
  const [showCheckbox, setShowCheckbox] = useState(false);

  const effectiveState: ListItemState = FULL_STATE_TYPES.includes(type) ? state : 'Default';
  const previewKey = `${type}-${itemStyle}-${effectiveState}-${showLeftIcon}-${showRightIcon}-${showCheckbox}`;

  // Stacked only exports Not Interactive style; auto-correct if user flips.
  const effectiveStyle: ListItemStyle =
    type === 'Stacked' ? 'Not Interactive'
      : type === 'Group' ? 'Interactive'
      : itemStyle;

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────── */}
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
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                  style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                >
                  <ListItemLive
                    type={type}
                    itemStyle={effectiveStyle}
                    state={effectiveState}
                    showLeftIcon={showLeftIcon}
                    showRightIcon={showRightIcon}
                    showCheckbox={showCheckbox}
                    brand={brand}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5">

              {/* Type */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.ctrlType}</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_TYPES.map((ty) => (
                    <SegBtn key={ty} active={type === ty} onClick={() => setType(ty)}>
                      {ty}
                    </SegBtn>
                  ))}
                </div>
              </div>

              {/* Style (hidden / disabled when type forces a single style) */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.ctrlStyle}</p>
                <div className="flex rounded-lg border border-slate-200 overflow-hidden w-fit">
                  {ALL_STYLES.map((s) => {
                    const disabled = (type === 'Stacked' && s === 'Interactive') || (type === 'Group' && s === 'Not Interactive');
                    return (
                      <button
                        key={s}
                        disabled={disabled}
                        onClick={() => !disabled && setItemStyle(s)}
                        className={[
                          'px-3 py-1.5 text-xs font-medium transition-all duration-100',
                          itemStyle === s && !disabled
                            ? 'bg-slate-900 text-white'
                            : disabled
                              ? 'text-slate-300 cursor-not-allowed'
                              : 'text-slate-600 hover:bg-slate-50',
                        ].join(' ')}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* State */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.ctrlState}</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_STATES.map((s) => {
                    const disabled = !FULL_STATE_TYPES.includes(type) && s !== 'Default';
                    return (
                      <button
                        key={s}
                        disabled={disabled}
                        onClick={() => !disabled && setState(s)}
                        className={[
                          'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                          state === s && !disabled
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : disabled
                              ? 'text-slate-300 border-slate-100 bg-slate-50 cursor-not-allowed'
                              : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                        ].join(' ')}
                      >
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0 border"
                          style={{ backgroundColor: STATE_DOT[s].bg, borderColor: STATE_DOT[s].border }}
                        />
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slot toggles */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.ctrlSlots}</p>
                <div className="flex flex-col gap-2">
                  {[
                    { lbl: t.slotLeading,  val: showLeftIcon,  set: setShowLeftIcon,  disabled: type === 'Country' || type === 'Region' || type === 'Group' },
                    { lbl: t.slotTrailing, val: showRightIcon, set: setShowRightIcon, disabled: type === 'Country' || type === 'Region' || type === 'Group' },
                    { lbl: t.slotCheckbox, val: showCheckbox,  set: setShowCheckbox,  disabled: type === 'Country' || type === 'Region' || type === 'Group' || type === 'Single + Description' },
                  ].map(({ lbl, val, set, disabled }) => (
                    <label key={lbl} className={['flex items-center gap-2.5 select-none group', disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'].join(' ')}>
                      <button
                        role="checkbox"
                        aria-checked={val}
                        disabled={disabled}
                        onClick={() => !disabled && set(!val)}
                        className={[
                          'w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-100 flex-shrink-0',
                          val
                            ? 'bg-slate-900 border-slate-900'
                            : 'bg-white border-slate-300 group-hover:border-slate-400',
                        ].join(' ')}
                      >
                        {val && (
                          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                            <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                      <span className="text-xs text-slate-600">{lbl}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ────────────────────────────────────────────── */}
      <section>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">{t.componentTitle}</h1>
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
              {t.pillFeedback}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {t.pillStable}
            </span>
          </div>
        </div>
      </section>

      <hr className="border-slate-200" />

      {/* ── 3. ANATOMY ───────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.anatomyTitle}</h2>
        <p className="text-sm text-slate-500 mb-5">{t.anatomyLead}</p>

        <div className="relative flex items-center justify-center py-20 px-8 rounded-xl" style={DOTTED_BG}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '520px' }}>
            <ListItemLive
              type="Single"
              itemStyle="Interactive"
              state="Default"
              showLeftIcon
              showRightIcon
              brand={brand}
            />

            {/* Callout 1: Container (bottom-center) */}
            <div
              className="absolute flex flex-col items-center pointer-events-none"
              style={{ left: '50%', bottom: '-56px', transform: 'translateX(-50%)' }}
            >
              <div className="w-px bg-slate-400" style={{ height: '32px' }} />
              <span
                className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold"
                style={{ boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' }}
              >
                1
              </span>
            </div>

            {/* Callout 2: Leading slot (top-left) */}
            <div
              className="absolute flex flex-col items-center pointer-events-none"
              style={{ left: '24px', top: '-56px' }}
            >
              <span
                className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold"
                style={{ boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' }}
              >
                2
              </span>
              <div className="w-px bg-slate-400" style={{ height: '32px' }} />
            </div>

            {/* Callout 3: Primary content (top-center) */}
            <div
              className="absolute flex flex-col items-center pointer-events-none"
              style={{ left: '30%', top: '-56px' }}
            >
              <span
                className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold"
                style={{ boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' }}
              >
                3
              </span>
              <div className="w-px bg-slate-400" style={{ height: '32px' }} />
            </div>

            {/* Callout 4: Trailing slot (top-right) */}
            <div
              className="absolute flex flex-col items-center pointer-events-none"
              style={{ right: '24px', top: '-56px' }}
            >
              <span
                className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold"
                style={{ boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' }}
              >
                4
              </span>
              <div className="w-px bg-slate-400" style={{ height: '32px' }} />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {t.anatomyParts.map((row) => (
            <div
              key={row.num}
              style={{
                display: 'flex',
                gap: '10px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#f9fafb',
                border: '1px solid #f3f4f6',
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827', flexShrink: 0, marginTop: '1px', minWidth: '12px' }}>
                {row.num}
              </span>
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
              <tr className="border-b border-slate-100">
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">{t.propertyType}</td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_TYPES.map((ty) => (
                      <span key={ty} className="inline-flex items-center px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium">
                        {ty}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">{t.propertyStyle}</td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1.5">
                    {ALL_STYLES.map((s) => (
                      <span key={s} className="inline-flex items-center px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">{t.propertyState}</td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_STATES.map((s) => (
                      <span key={s} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATE_DOT[s].bg, border: `1px solid ${STATE_DOT[s].border}` }} />
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm align-top">{t.propertyBooleans}</td>
                <td className="px-5 py-3.5 text-slate-600 text-xs leading-relaxed">{t.propertyBooleansValues}</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm align-top">{t.propertyTextSlots}</td>
                <td className="px-5 py-3.5 text-slate-600 text-xs leading-relaxed">{t.propertyTextSlotsValues}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Visual preview of all types */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '12px' }}>
          {ALL_TYPES.map((ty) => (
            <div
              key={ty}
              style={{
                padding: '20px 24px',
                borderRadius: '10px',
                border: '1px solid #f3f4f6',
                backgroundColor: '#fafafa',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>{ty}</p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ListItemLive
                  type={ty}
                  itemStyle={ty === 'Stacked' ? 'Not Interactive' : 'Interactive'}
                  state="Default"
                  showLeftIcon={ty === 'Single' || ty === 'Stacked' || ty === 'Single + Description'}
                  showRightIcon={ty === 'Single' || ty === 'Stacked'}
                  brand={brand}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.tokensTitle}</h2>
        <p className="text-sm text-slate-500 mb-4">
          {t.tokensLead}
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">{t.tokenHeader}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.cssVarHeader}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">{t.valueHeader} ({brand})</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_TABLE_ROWS.map((row, i) => {
                const isActive = row.states.includes(effectiveState);
                const rawValue = (tokens[row.key as keyof typeof tokens] as string | undefined) ?? '—';
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
                    style={isActive ? { borderLeft: '3px solid #3b82f6' } : { borderLeft: '3px solid transparent' }}
                  >
                    <td className="px-5 py-3 font-medium text-slate-700 text-xs">{t.tokenLabels[row.label] ?? row.label}</td>
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
      </section>

      {/* ── 6. ACCESSIBILITY ─────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.a11yTitle}</h2>
        <p className="text-sm text-slate-500 mb-4">
          {t.a11yLead}
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
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{t.usageTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.usageLead}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>{t.whenUseTitle}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              {t.whenUseItems.map((item, i) => (
                <li key={i} style={{ marginBottom: i < t.whenUseItems.length - 1 ? '6px' : 0 }}>• {item}</li>
              ))}
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>{t.whenNotUseTitle}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              {t.whenNotUseItems.map((item, i) => (
                <li key={i} style={{ marginBottom: i < t.whenNotUseItems.length - 1 ? '6px' : 0 }}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
