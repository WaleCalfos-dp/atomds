import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineItemLive,
  type LineItemType,
  type LineItemMode,
  type LineItemWeight,
} from '../components/line-item/LineItemLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';

interface LineItemPageProps {
  brand: Brand;
  lang?: Language;
}

// ─── Bilingual copy block ─────────────────────────────────────────────────
const COPY = {
  en: {
    // Controls
    ctrlType: 'Type',
    ctrlMode: 'Mode',
    ctrlWeight: 'Weight',
    ctrlIcon: 'Icon',
    ctrlTitle: 'Title',
    ctrlSubtitle: 'Subtitle',
    ctrlLocation: 'Location',
    ctrlCheckbox: 'Checkbox',
    ctrlSwitch: 'Switch',
    optShow: 'Show',
    optHide: 'Hide',
    optChecked: 'Checked',
    optUnchecked: 'Unchecked',
    optOn: 'On',
    optOff: 'Off',
    // Defaults
    defaultTitleText: 'Title',
    defaultSubtitleText: 'Subtitle text',
    defaultLocationText: 'London, UK',
    // Section 2 — Component Info
    componentTitle: 'Line Item',
    description:
      'A list row component used to display entries in lists, menus, and selection surfaces. Each row can contain an icon, title, and subtitle arranged horizontally. Supports multiple types including General Text, Country, Flight, and Country + Description.',
    pillFeedback: 'Feedback',
    pillStable: 'Stable',
    // Section 3 — Anatomy
    anatomyTitle: 'Anatomy',
    anatomyLead: 'Parts of the Line Item component and their roles.',
    anatomyParts: [
      { num: '1', label: 'Icon', desc: '20x20px container with 16x16px icon. Optional in General Text type; flag in Country types; circular background in Flight type.' },
      { num: '2', label: 'Title', desc: '14px / Poppins Medium (weight 500). The primary label for the row. Color uses fg-brand-primary in Light mode, inverse in Dark mode.' },
      { num: '3', label: 'Subtitle', desc: '14px Regular in General Text (or 12px in Country+Desc / Flight). Secondary information beneath or beside the title.' },
    ],
    // Section 4 — Variants
    variantsTitle: 'Variants',
    variantsLead: 'Available property combinations for the Line Item component.',
    propertyHeader: 'Property',
    valuesHeader: 'Values',
    propertyRows: [
      { prop: 'Type', vals: 'General Text \u00b7 Country \u00b7 Flight \u00b7 Country + Description' },
      { prop: 'Mode', vals: 'Light \u00b7 Dark' },
      { prop: 'Weight', vals: 'Regular \u00b7 Bold' },
      { prop: 'Icon', vals: 'Show \u00b7 Hide (optional toggle)' },
      { prop: 'Title', vals: 'Show \u00b7 Hide (optional toggle)' },
      { prop: 'Subtitle', vals: 'Show \u00b7 Hide (optional toggle)' },
      { prop: 'Checkbox', vals: 'Show \u00b7 Hide \u2014 renders a leading checkbox (checked / unchecked)' },
      { prop: 'Switch', vals: 'Show \u00b7 Hide \u2014 renders a trailing switch toggle (on / off)' },
      { prop: 'Checkbox and Switch', vals: 'On \u00b7 Off \u2014 master toggle for the trailing Checkbox/Switch cluster' },
      { prop: 'Booleans (Airport)', vals: 'Airport2, Airport Code \u2014 visible only when Type=Flight' },
      { prop: 'Text slots', vals: 'Title Text, Subtitle Text, Country, Airport, Code, Location, Description (default values vary by Type)' },
    ],
    previewLabels: {
      lightRegular: 'Light / Regular',
      lightBold: 'Light / Bold',
      darkRegular: 'Dark / Regular',
      darkBold: 'Dark / Bold',
    },
    previewTitle: 'List item title',
    previewSubtitle: 'Supporting text',
    // Section 5 — Design Tokens
    tokensTitle: 'Design Tokens',
    tokensLead: 'The Line Item uses foreground and background tokens that update per brand and mode.',
    roleHeader: 'Role',
    tokenHeader: 'Token',
    valueHeader: 'Value',
    swatchHeader: 'Swatch',
    tokenLabels: {
      title: 'Title foreground',
      subtitle: 'Subtitle foreground',
      secondary: 'Secondary text',
      inverse: 'Inverse foreground (Dark)',
      'muted-bg': 'Icon bg (Flight)',
    } as Record<string, string>,
    // Section 6 — Accessibility
    a11yTitle: 'Accessibility',
    a11yLead: 'Guidance for building inclusive experiences with the Line Item component.',
    a11yRows: [
      {
        icon: '\u2630',
        title: 'Semantic list markup',
        body: 'Wrap line items in a <ul> or <ol> with each item as an <li>. This gives screen readers the total count and position of each entry (e.g. "item 3 of 5").',
      },
      {
        icon: '\u2328',
        title: 'Keyboard navigable',
        body: 'Ensure interactive line items (with checkboxes or switches) are reachable via Tab and operable via Space or Enter. Use proper focus indicators.',
      },
      {
        icon: '\u2261',
        title: 'Logical reading order',
        body: 'DOM order should match visual order: icon first, then title, then subtitle. Screen readers follow source order, not visual layout.',
      },
      {
        icon: '\u25CE',
        title: 'Sufficient contrast',
        body: 'In Dark mode, ensure text on dark backgrounds meets WCAG AA 4.5:1 contrast ratio. The inverse token (#fff on brand-primary) satisfies this for all brands.',
      },
    ],
    // Section 7 — Usage
    usageTitle: 'Usage',
    usageLead: 'When and how to use each Line Item type.',
    typeUsage: [
      { t: 'General Text', when: 'Use for standard list rows with a title and optional subtitle -- settings screens, menus, selection lists, or informational entries.' },
      { t: 'Country', when: 'Use when displaying a country selection row with a flag icon and country name -- language or region pickers.' },
      { t: 'Country + Description', when: 'Use when a country row needs additional context below the name -- airport selectors, regional service info, or country detail lists.' },
      { t: 'Flight', when: 'Use for airport or flight-related list rows showing airport name, code, and location with a circular icon container.' },
    ],
    doTitle: 'Do',
    dontTitle: "Don't",
    doBody:
      'Group line items in semantic list elements. Use consistent types within a single list. Apply Dark mode on dark surfaces and Light mode on light surfaces. Keep titles concise.',
    dontBody:
      "Don't use Line Item for pricing or shopping cart rows -- it is a list row component, not a price line. Don't mix types within the same list. Don't use Bold weight for long-form content.",
  },
  zh: {
    // Controls
    ctrlType: '类型',
    ctrlMode: '模式',
    ctrlWeight: '字重',
    ctrlIcon: '图标',
    ctrlTitle: '标题',
    ctrlSubtitle: '副标题',
    ctrlLocation: '位置',
    ctrlCheckbox: '复选框',
    ctrlSwitch: '开关',
    optShow: '显示',
    optHide: '隐藏',
    optChecked: '已选',
    optUnchecked: '未选',
    optOn: '开启',
    optOff: '关闭',
    // Defaults
    defaultTitleText: '标题',
    defaultSubtitleText: '副标题文本',
    defaultLocationText: '英国伦敦',
    // Section 2 — Component Info
    componentTitle: '行项目',
    description:
      '一种列表行组件，用于在列表、菜单和选择界面中显示条目。每行可以水平排列图标、标题和副标题。支持多种类型，包括 General Text（一般文本）、Country（国家）、Flight（航班）以及 Country + Description（国家+描述）。',
    pillFeedback: '反馈',
    pillStable: '稳定版',
    // Section 3 — Anatomy
    anatomyTitle: '结构剖析',
    anatomyLead: '行项目组件的各个组成部分及其作用。',
    anatomyParts: [
      { num: '1', label: '图标', desc: '20x20px 容器内嵌 16x16px 图标。在 General Text 类型中可选；在 Country 类型中为旗帜；在 Flight 类型中带有圆形背景。' },
      { num: '2', label: '标题', desc: '14px / Poppins Medium（字重 500）。该行的主标签。在浅色模式下使用 fg-brand-primary，在深色模式下使用反色。' },
      { num: '3', label: '副标题', desc: 'General Text 中为 14px Regular（在 Country+Desc / Flight 中为 12px）。位于标题下方或旁边的次要信息。' },
    ],
    // Section 4 — Variants
    variantsTitle: '变体',
    variantsLead: '行项目组件可用的属性组合。',
    propertyHeader: '属性',
    valuesHeader: '值',
    propertyRows: [
      { prop: '类型', vals: 'General Text \u00b7 Country \u00b7 Flight \u00b7 Country + Description' },
      { prop: '模式', vals: 'Light \u00b7 Dark' },
      { prop: '字重', vals: 'Regular \u00b7 Bold' },
      { prop: '图标', vals: '显示 \u00b7 隐藏（可选切换）' },
      { prop: '标题', vals: '显示 \u00b7 隐藏（可选切换）' },
      { prop: '副标题', vals: '显示 \u00b7 隐藏（可选切换）' },
      { prop: '复选框', vals: '显示 \u00b7 隐藏 \u2014 渲染一个前置复选框（已选 / 未选）' },
      { prop: '开关', vals: '显示 \u00b7 隐藏 \u2014 渲染一个尾部开关（开 / 关）' },
      { prop: '位置', vals: '自由格式字符串（仅限 Flight 类型）\u2014 例如 "英国伦敦"' },
      { prop: 'Checkbox and Switch', vals: 'On · Off — 控制尾部复选框/开关组合的总开关' },
      { prop: '布尔值（Airport）', vals: 'Airport2、Airport Code — 仅当 Type=Flight 时显示' },
      { prop: '文本插槽', vals: 'Title Text、Subtitle Text、Country、Airport、Code、Location、Description（默认值因 Type 而异）' },
    ],
    previewLabels: {
      lightRegular: 'Light / Regular',
      lightBold: 'Light / Bold',
      darkRegular: 'Dark / Regular',
      darkBold: 'Dark / Bold',
    },
    previewTitle: '列表项标题',
    previewSubtitle: '辅助文本',
    // Section 5 — Design Tokens
    tokensTitle: '设计令牌',
    tokensLead: '行项目使用的前景和背景令牌会按品牌和模式进行更新。',
    roleHeader: '角色',
    tokenHeader: '设计令牌',
    valueHeader: '值',
    swatchHeader: '色样',
    tokenLabels: {
      title: '标题前景',
      subtitle: '副标题前景',
      secondary: '次要文本',
      inverse: '反色前景（深色）',
      'muted-bg': '图标背景（Flight）',
    } as Record<string, string>,
    // Section 6 — Accessibility
    a11yTitle: '可访问性',
    a11yLead: '使用行项目组件构建包容性体验的指引。',
    a11yRows: [
      {
        icon: '\u2630',
        title: '语义化列表标记',
        body: '将行项目包裹在 <ul> 或 <ol> 中，每一项作为 <li>。这能让屏幕阅读器获得每个条目的总数和位置（例如"第 3 项，共 5 项"）。',
      },
      {
        icon: '\u2328',
        title: '可键盘导航',
        body: '确保交互式行项目（带有复选框或开关）可通过 Tab 键到达，并可通过空格或回车键操作。使用清晰的焦点指示器。',
      },
      {
        icon: '\u2261',
        title: '合理的阅读顺序',
        body: 'DOM 顺序应与视觉顺序匹配：先图标、再标题、再副标题。屏幕阅读器跟随源顺序而非视觉布局。',
      },
      {
        icon: '\u25CE',
        title: '足够的对比度',
        body: '在深色模式下，确保深色背景上的文本满足 WCAG AA 4.5:1 对比度。反色令牌（#fff 应用于 brand-primary）在所有品牌中均能满足此要求。',
      },
    ],
    // Section 7 — Usage
    usageTitle: '用法',
    usageLead: '何时以及如何使用每种行项目类型。',
    typeUsage: [
      { t: 'General Text', when: '用于带标题和可选副标题的标准列表行——设置屏幕、菜单、选择列表或信息条目。' },
      { t: 'Country', when: '用于显示带旗帜图标和国家名称的国家选择行——语言或地区选择器。' },
      { t: 'Country + Description', when: '当国家行需要在名称下方提供额外上下文时使用——机场选择器、区域服务信息或国家详情列表。' },
      { t: 'Flight', when: '用于机场或航班相关的列表行，显示带有圆形图标容器的机场名称、代码和位置。' },
    ],
    doTitle: '推荐做法',
    dontTitle: '避免做法',
    doBody:
      '将行项目分组到语义化的列表元素中。在单一列表中使用一致的类型。在深色表面上应用深色模式，在浅色表面上应用浅色模式。保持标题简洁。',
    dontBody:
      '不要将行项目用于价格或购物车行——它是列表行组件，而非价格行。不要在同一列表中混用不同类型。不要将 Bold 字重用于长篇内容。',
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

const ALL_TYPES: LineItemType[] = ['General Text', 'Country', 'Flight', 'Country + Description'];
const ALL_MODES: LineItemMode[] = ['Light', 'Dark'];
const ALL_WEIGHTS: LineItemWeight[] = ['Regular', 'Bold'];

type TokenRow = {
  key: string;
  tokenKey: string;
  cssVar: string;
};

const TOKEN_ROWS: TokenRow[] = [
  { key: 'title',       tokenKey: 'atom.foreground.primary.fg-brand-primary',         cssVar: '--atom-foreground-primary-fg-brand-primary' },
  { key: 'subtitle',    tokenKey: 'atom.foreground.core.fg-primary',                  cssVar: '--atom-foreground-core-fg-primary' },
  { key: 'secondary',   tokenKey: 'atom.foreground.core.fg-secondary',                cssVar: '--atom-foreground-core-fg-secondary' },
  { key: 'inverse',     tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse',  cssVar: '--atom-foreground-primary-fg-brand-primary-inverse' },
  { key: 'muted-bg',    tokenKey: 'atom.background.core.bg-muted',                    cssVar: '--atom-background-core-bg-muted' },
];

export function LineItemPage({ brand, lang = 'en' }: LineItemPageProps) {
  const t = COPY[lang];
  const [itemType, setItemType] = useState<LineItemType>('General Text');
  const [mode, setMode] = useState<LineItemMode>('Light');
  const [weight, setWeight] = useState<LineItemWeight>('Regular');
  const [showIcon, setShowIcon] = useState(true);
  const [titleText, setTitleText] = useState<string>(t.defaultTitleText);
  const [subtitleText, setSubtitleText] = useState<string>(t.defaultSubtitleText);
  const [locationText, setLocationText] = useState<string>(t.defaultLocationText);
  const [showSwitch, setShowSwitch] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];
  const previewKey = `${itemType}-${mode}-${weight}-${showIcon}-${titleText}-${subtitleText}-${locationText}-${showSwitch}-${switchChecked}-${showCheckbox}-${checkboxChecked}`;

  const isDarkPreview = mode === 'Dark';
  const canvasBg = isDarkPreview
    ? 'var(--atom-background-primary-bg-primary-default, #0a2333)'
    : undefined;

  return (
    <div className="space-y-10">

      {/* -- 1. INTERACTIVE PREVIEW ------------------------------------------------ */}
      <section>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden', background: '#fff' }}>
          <div style={{ display: 'flex', minHeight: '280px' }}>

            {/* Canvas */}
            <div style={{
              flex: 1,
              ...(isDarkPreview ? {} : DOTTED_BG),
              backgroundColor: canvasBg ?? DOTTED_BG.backgroundColor,
              backgroundImage: isDarkPreview ? 'none' : DOTTED_BG.backgroundImage,
              backgroundSize: isDarkPreview ? undefined : DOTTED_BG.backgroundSize,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px',
            }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ width: '100%', maxWidth: '400px' }}
                >
                  <LineItemLive
                    type={itemType}
                    mode={mode}
                    weight={weight}
                    showIcon={showIcon}
                    titleText={titleText}
                    subtitleText={subtitleText}
                    showTitle={true}
                    showSubtitle={true}
                    locationText={locationText}
                    showSwitch={showSwitch}
                    switchChecked={switchChecked}
                    showCheckbox={showCheckbox}
                    checkboxChecked={checkboxChecked}
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
              {/* Type selector (stacked) */}
              <div>
                <p style={LABEL_STYLE}>{t.ctrlType}</p>
                <div style={{ display: 'flex', flexDirection: 'column', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  {ALL_TYPES.map(ty => (
                    <SegBtn key={ty} active={itemType === ty} onClick={() => setItemType(ty)}>{ty}</SegBtn>
                  ))}
                </div>
              </div>

              {/* Mode toggle */}
              <div>
                <p style={LABEL_STYLE}>{t.ctrlMode}</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  {ALL_MODES.map(m => (
                    <SegBtn key={m} active={mode === m} onClick={() => setMode(m)}>{m}</SegBtn>
                  ))}
                </div>
              </div>

              {/* Weight toggle */}
              <div>
                <p style={LABEL_STYLE}>{t.ctrlWeight}</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  {ALL_WEIGHTS.map(w => (
                    <SegBtn key={w} active={weight === w} onClick={() => setWeight(w)}>{w}</SegBtn>
                  ))}
                </div>
              </div>

              {/* Icon toggle */}
              <div>
                <p style={LABEL_STYLE}>{t.ctrlIcon}</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  <SegBtn active={showIcon} onClick={() => setShowIcon(true)}>{t.optShow}</SegBtn>
                  <SegBtn active={!showIcon} onClick={() => setShowIcon(false)}>{t.optHide}</SegBtn>
                </div>
              </div>

              {/* Title input */}
              <div>
                <p style={{ ...LABEL_STYLE, margin: '0 0 6px' }}>{t.ctrlTitle}</p>
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

              {/* Subtitle input */}
              <div>
                <p style={{ ...LABEL_STYLE, margin: '0 0 6px' }}>{t.ctrlSubtitle}</p>
                <input
                  type="text"
                  value={subtitleText}
                  onChange={e => setSubtitleText(e.target.value)}
                  style={{
                    width: '100%', padding: '6px 8px', fontSize: '12.5px',
                    border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none',
                    boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif',
                    color: '#374151',
                  }}
                />
              </div>

              {/* Location input (Flight type only) */}
              {itemType === 'Flight' && (
                <div>
                  <p style={{ ...LABEL_STYLE, margin: '0 0 6px' }}>{t.ctrlLocation}</p>
                  <input
                    type="text"
                    value={locationText}
                    onChange={e => setLocationText(e.target.value)}
                    style={{
                      width: '100%', padding: '6px 8px', fontSize: '12.5px',
                      border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none',
                      boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif',
                      color: '#374151',
                    }}
                  />
                </div>
              )}

              {/* Checkbox toggle */}
              <div>
                <p style={LABEL_STYLE}>{t.ctrlCheckbox}</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  <SegBtn active={showCheckbox} onClick={() => setShowCheckbox(true)}>{t.optShow}</SegBtn>
                  <SegBtn active={!showCheckbox} onClick={() => setShowCheckbox(false)}>{t.optHide}</SegBtn>
                </div>
                {showCheckbox && (
                  <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px', marginTop: '6px' }}>
                    <SegBtn active={checkboxChecked} onClick={() => setCheckboxChecked(true)}>{t.optChecked}</SegBtn>
                    <SegBtn active={!checkboxChecked} onClick={() => setCheckboxChecked(false)}>{t.optUnchecked}</SegBtn>
                  </div>
                )}
              </div>

              {/* Switch toggle */}
              <div>
                <p style={LABEL_STYLE}>{t.ctrlSwitch}</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  <SegBtn active={showSwitch} onClick={() => setShowSwitch(true)}>{t.optShow}</SegBtn>
                  <SegBtn active={!showSwitch} onClick={() => setShowSwitch(false)}>{t.optHide}</SegBtn>
                </div>
                {showSwitch && (
                  <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px', marginTop: '6px' }}>
                    <SegBtn active={switchChecked} onClick={() => setSwitchChecked(true)}>{t.optOn}</SegBtn>
                    <SegBtn active={!switchChecked} onClick={() => setSwitchChecked(false)}>{t.optOff}</SegBtn>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -- 2. COMPONENT INFO ----------------------------------------------------- */}
      <section>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>{t.componentTitle}</h1>
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
            {t.pillFeedback}
          </a>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: '6px',
            border: '1px solid #bbf7d0', fontSize: '13px', color: '#166534',
            backgroundColor: '#f0fdf4', fontFamily: 'system-ui, -apple-system, sans-serif',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
            {t.pillStable}
          </span>
        </div>
      </section>

      {/* -- 3. ANATOMY ------------------------------------------------------------ */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.anatomyTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px' }}>{t.anatomyLead}</p>

        <div style={{
          ...DOTTED_BG, borderRadius: '12px', padding: '64px 48px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
        }}>
          <div style={{ width: '100%', maxWidth: '480px' }}>
            <LineItemLive type="General Text" mode="Light" weight="Regular" showIcon={true} titleText={t.defaultTitleText} subtitleText={t.defaultSubtitleText} showTitle={true} showSubtitle={true} brand={brand} />
          </div>

          {/* Callout 1 -- Icon (top-left) */}
          <div style={{ position: 'absolute', top: '12px', left: '15%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalloutDot num="1" />
            <div style={LINE} />
          </div>

          {/* Callout 2 -- Title (top-center) */}
          <div style={{ position: 'absolute', top: '12px', left: '40%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalloutDot num="2" />
            <div style={LINE} />
          </div>

          {/* Callout 3 -- Subtitle (bottom-center) */}
          <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={LINE} />
            <CalloutDot num="3" />
          </div>
        </div>

        {/* Legend grid: 3-col */}
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

      {/* -- 4. VARIANTS ----------------------------------------------------------- */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.variantsTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>{t.variantsLead}</p>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '140px' }}>{t.propertyHeader}</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>{t.valuesHeader}</th>
              </tr>
            </thead>
            <tbody>
              {t.propertyRows.map(({ prop, vals }, i, arr) => (
                <tr key={prop} style={{ borderBottom: i < arr.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>{prop}</td>
                  <td style={{ padding: '10px 16px', color: '#6b7280' }}>{vals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual preview grid: General Text variants */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {/* Light Regular */}
          <div style={{ padding: '20px 24px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
            <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>{t.previewLabels.lightRegular}</p>
            <LineItemLive type="General Text" mode="Light" weight="Regular" showIcon={true} titleText={t.previewTitle} subtitleText={t.previewSubtitle} showTitle={true} showSubtitle={true} brand={brand} />
          </div>
          {/* Light Bold */}
          <div style={{ padding: '20px 24px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
            <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>{t.previewLabels.lightBold}</p>
            <LineItemLive type="General Text" mode="Light" weight="Bold" showIcon={true} titleText={t.previewTitle} subtitleText={t.previewSubtitle} showTitle={true} showSubtitle={true} brand={brand} />
          </div>
          {/* Dark Regular */}
          <div style={{ padding: '20px 24px', borderRadius: '10px', border: '1px solid #334155', backgroundColor: 'var(--atom-background-primary-bg-primary-default, #0a2333)' }}>
            <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>{t.previewLabels.darkRegular}</p>
            <LineItemLive type="General Text" mode="Dark" weight="Regular" showIcon={true} titleText={t.previewTitle} subtitleText={t.previewSubtitle} showTitle={true} showSubtitle={true} brand={brand} />
          </div>
          {/* Dark Bold */}
          <div style={{ padding: '20px 24px', borderRadius: '10px', border: '1px solid #334155', backgroundColor: 'var(--atom-background-primary-bg-primary-default, #0a2333)' }}>
            <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>{t.previewLabels.darkBold}</p>
            <LineItemLive type="General Text" mode="Dark" weight="Bold" showIcon={true} titleText={t.previewTitle} subtitleText={t.previewSubtitle} showTitle={true} showSubtitle={true} brand={brand} />
          </div>
        </div>
      </section>

      {/* -- 5. DESIGN TOKENS ------------------------------------------------------ */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.tokensTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.tokensLead}
        </p>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '160px' }}>{t.roleHeader}</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>{t.tokenHeader}</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '140px' }}>{t.valueHeader}</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '52px' }}>{t.swatchHeader}</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_ROWS.map((row, i) => {
                const resolvedValue = tokens[row.tokenKey as keyof typeof tokens] ?? '\u2014';
                return (
                  <tr key={row.key} style={{
                    borderBottom: i < TOKEN_ROWS.length - 1 ? '1px solid #f3f4f6' : 'none',
                    borderLeft: '3px solid #3b82f6',
                  }}>
                    <td style={{ padding: '10px 16px', color: '#374151', fontWeight: 600 }}>{t.tokenLabels[row.key] ?? row.key}</td>
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

      {/* -- 6. ACCESSIBILITY ------------------------------------------------------ */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.a11yTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.a11yLead}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {t.a11yRows.map(({ icon, title: ti, body }) => (
            <div key={ti} style={{
              display: 'flex', gap: '14px', padding: '16px',
              borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa',
            }}>
              <span style={{ fontSize: '18px', lineHeight: 1, flexShrink: 0, marginTop: '2px' }}>{icon}</span>
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#111827' }}>{ti}</p>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280', lineHeight: 1.5 }}>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -- 7. USAGE -------------------------------------------------------------- */}
      <section style={{ paddingBottom: '40px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{t.usageTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>{t.usageLead}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          {t.typeUsage.map(({ t: typeName, when }) => (
            <div key={typeName} style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
              <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#111827' }}>{typeName}</p>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#6b7280', lineHeight: 1.4 }}>{when}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>{t.doTitle}</p>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              {t.doBody}
            </p>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>{t.dontTitle}</p>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              {t.dontBody}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
