import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AccordionLive, type AccordionStyle, type AccordionState } from '../components/accordion/AccordionLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';

interface AccordionPageProps {
  brand: Brand;
  lang?: Language;
}

const COPY = {
  en: {
    stateLabel: 'State',
    styleLabel: 'Style',
    openedLabel: 'Opened',
    backgroundFillLabel: 'Background Fill',
    optionsLabel: 'Options',
    yes: 'Yes',
    no: 'No',
    optIconLeft: 'Icon Left',
    optCountryFlag: 'Country Flag',
    optSubtitle: 'Subtitle',
    optBadge: 'Badge',
    optContent: 'Content',
    title: 'Accordion',
    description:
      'Allows users to expand and collapse sections of related content for progressive disclosure. Supports five styles (Full Border, Bottom Border, GPay, ApplePay, PayPal) with optional icon, subtitle, and badge slots.',
    pillFeedback: 'Feedback',
    pillStable: 'Stable',
    anatomyHeading: 'Anatomy',
    anatomyIntro:
      'The Accordion is composed of five main parts. Icon Left, Subtitle, and Badge slots are optional.',
    variantsHeading: 'Variants',
    propertyHeader: 'Property',
    valuesHeader: 'Values',
    designTokensHeading: 'Design Tokens',
    designTokensIntro:
      'Active tokens for the selected state are highlighted. Switch State or Brand to see values update.',
    tokenHeader: 'Token',
    cssVarHeader: 'CSS Variable',
    valueHeader: 'Value',
    a11yHeading: 'Accessibility',
    a11yIntro: 'Guidelines for implementing Accordion in an inclusive way.',
    usageHeading: 'Usage',
    usageIntro: 'When and how to use the Accordion component.',
    whenToUse: 'When to use',
    whenNotToUse: 'When not to use',
    open: '(Open)',
    closed: '(Closed)',
    variantRows: [
      { label: 'State',           chips: ['Default', 'Hover', 'Focus', 'Disabled'] },
      { label: 'Style',           chips: ['Full Border', 'Bottom Border', 'GPay', 'ApplePay', 'PayPal'] },
      { label: 'Opened',          chips: ['Yes', 'No'] },
      { label: 'Background Fill', chips: ['Yes', 'No'] },
      { label: 'Icon Left',       chips: ['True', 'False'] },
      { label: 'Country Flag',    chips: ['True', 'False'] },
      { label: 'Title Text',      chips: ['Editable text'] },
      { label: 'Subtitle',        chips: ['True', 'False'] },
      { label: 'Subtitle Text',   chips: ['Editable text'] },
      { label: 'Badge',           chips: ['True', 'False'] },
      { label: 'Title',           chips: ['True', 'False'] },
      { label: 'Brand Icon',      chips: ['True', 'False'] },
      { label: 'Content',         chips: ['True', 'False'] },
      { label: 'Content Text',    chips: ['Editable text'] },
      { label: 'Slot 1',          chips: ['True', 'False'] },
      { label: 'Slot 2',          chips: ['True', 'False'] },
    ],
    anatomyParts: [
      { num: '1', name: 'Container',  desc: 'Outer wrapper with 8px radius. Full Border: 1px border all sides (2px on Hover/Focus). Bottom Border: divider line under header only. GPay/ApplePay/PayPal: taller header (72px) with payment logo.' },
      { num: '2', name: 'Icon Left',   desc: 'Optional 20x20px icon slot. Displays a leading icon or country flag emoji. Inherits brand primary foreground color. Hidden when disabled.' },
      { num: '3', name: 'Title',       desc: '14px / weight 500 text with 20px line-height. Foreground color from brand primary token. Required. Changes color on Hover, Focus, and Disabled states.' },
      { num: '4', name: 'Chevron',     desc: '20x20px expand/collapse indicator. Rotates 180 degrees when opened. Inherits the same foreground color as the title for each state.' },
      { num: '5', name: 'Content',     desc: 'Body region visible when Opened=Yes. 14px / weight 400 text with 20px line-height. Uses primary foreground color. Hidden entirely when Opened=No.' },
    ],
    tokenRows: [
      { label: 'Border divider',   key: 'atom.border.default.border-divider',                       cssVar: '--atom-border-default-border-divider',                       states: ['Default'] as AccordionState[] },
      { label: 'Border hover',     key: 'atom.border.states.border-hover',                          cssVar: '--atom-border-states-border-hover',                          states: ['Hover'] as AccordionState[] },
      { label: 'Focus border',     key: 'atom.border.selection-and-focus.border-primary-focus',     cssVar: '--atom-border-selection-and-focus-border-primary-focus',     states: ['Focus'] as AccordionState[] },
      { label: 'Border disabled',  key: 'atom.border.states.border-disabled',                       cssVar: '--atom-border-states-border-disabled',                       states: ['Disabled'] as AccordionState[] },
      { label: 'Brand primary fg', key: 'atom.foreground.primary.fg-brand-primary',                 cssVar: '--atom-foreground-primary-fg-brand-primary',                 states: ['Default'] as AccordionState[] },
      { label: 'Hover fg',         key: 'atom.foreground.states.fg-hover',                          cssVar: '--atom-foreground-states-fg-hover',                          states: ['Hover'] as AccordionState[] },
      { label: 'Disabled fg',      key: 'atom.foreground.states.fg-disabled',                       cssVar: '--atom-foreground-states-fg-disabled',                       states: ['Disabled'] as AccordionState[] },
      { label: 'Body text fg',     key: 'atom.foreground.core.fg-primary',                          cssVar: '--atom-foreground-core-fg-primary',                          states: ['Default'] as AccordionState[] },
      { label: 'Background fill',  key: 'atom.background.primary.bg-primary-inverse',               cssVar: '--atom-background-primary-bg-primary-inverse',               states: ['Default'] as AccordionState[] },
    ],
    a11yRows: [
      {
        icon: '\u2328\uFE0F',
        title: 'Keyboard interaction',
        body: 'Each accordion header is a <button> and receives focus in tab order. Press Enter or Space to toggle the expanded/collapsed state. Arrow keys are optional but may be added for enhanced navigation between headers.',
      },
      {
        icon: '\uD83C\uDFF7\uFE0F',
        title: 'ARIA attributes',
        body: 'Each header button uses aria-expanded="true|false" and aria-controls pointing to its content region ID. The content panel uses role="region" and aria-hidden to match the expanded state.',
      },
      {
        icon: '\uD83C\uDFA8',
        title: 'Color contrast',
        body: 'Title text (brand primary fg on white bg) meets WCAG AA 4.5:1 minimum contrast across all 6 brands. Body text and subtitle also meet AA requirements.',
      },
      {
        icon: '\uD83D\uDD24',
        title: 'Content structure',
        body: "Don't rely solely on the expanded/collapsed visual state to convey hierarchy. Use descriptive titles so users understand each section's content before expanding.",
      },
      {
        icon: '\u2728',
        title: 'Motion',
        body: 'The expand/collapse animation uses max-height and opacity transitions (0.25s). For users who prefer reduced motion, consider disabling animation and toggling content visibility instantly.',
      },
    ],
    whenToUseItems: [
      'Progressive disclosure of related content (FAQ, terms, settings)',
      'Reducing cognitive load on long pages with many sections',
      'Payment flows where each step is a collapsible section',
      'Grouping secondary details that users may not always need',
    ],
    whenNotToUseItems: [
      "Don't hide critical content that users must see -- show it inline",
      "Don't use a single accordion for primary navigation -- use tabs instead",
      "Don't nest accordions inside accordions -- flatten the hierarchy",
      "Don't use for very short content that adds no value when collapsed",
    ],
  },
  zh: {
    stateLabel: '状态',
    styleLabel: '样式',
    openedLabel: '展开',
    backgroundFillLabel: '背景填充',
    optionsLabel: '选项',
    yes: '是',
    no: '否',
    optIconLeft: '左侧图标',
    optCountryFlag: '国家旗帜',
    optSubtitle: '副标题',
    optBadge: '徽章',
    optContent: '内容',
    title: '手风琴',
    description:
      '允许用户展开和折叠相关内容的部分,以渐进显示信息。支持五种样式(Full Border、Bottom Border、GPay、ApplePay、PayPal),可选图标、副标题和徽章插槽。',
    pillFeedback: '反馈',
    pillStable: '稳定',
    anatomyHeading: '结构',
    anatomyIntro:
      '手风琴由五个主要部分组成。左侧图标、副标题和徽章插槽是可选的。',
    variantsHeading: '变体',
    propertyHeader: '属性',
    valuesHeader: '值',
    designTokensHeading: '设计令牌',
    designTokensIntro:
      '所选状态的活动令牌将高亮显示。切换状态或品牌以查看值的变化。',
    tokenHeader: '令牌',
    cssVarHeader: 'CSS 变量',
    valueHeader: '值',
    a11yHeading: '无障碍',
    a11yIntro: '以包容性方式实现手风琴的指南。',
    usageHeading: '用法',
    usageIntro: '何时以及如何使用手风琴组件。',
    whenToUse: '适用场景',
    whenNotToUse: '不适用场景',
    open: '(展开)',
    closed: '(折叠)',
    variantRows: [
      { label: '状态',         chips: ['Default', 'Hover', 'Focus', 'Disabled'] },
      { label: '样式',         chips: ['Full Border', 'Bottom Border', 'GPay', 'ApplePay', 'PayPal'] },
      { label: '展开',         chips: ['是', '否'] },
      { label: '背景填充',     chips: ['是', '否'] },
      { label: '左侧图标',     chips: ['真', '假'] },
      { label: '国家旗帜',     chips: ['真', '假'] },
      { label: '标题文本',     chips: ['可编辑文本'] },
      { label: '副标题',       chips: ['真', '假'] },
      { label: '副标题文本',   chips: ['可编辑文本'] },
      { label: '徽章',         chips: ['真', '假'] },
      { label: '标题',         chips: ['真', '假'] },
      { label: '品牌图标',     chips: ['真', '假'] },
      { label: '内容',         chips: ['真', '假'] },
      { label: '内容文本',     chips: ['可编辑文本'] },
      { label: '插槽 1',       chips: ['真', '假'] },
      { label: '插槽 2',       chips: ['真', '假'] },
    ],
    anatomyParts: [
      { num: '1', name: '容器',     desc: '8px 圆角的外层包装。Full Border:四边各有 1px 边框(Hover/Focus 时为 2px)。Bottom Border:仅在标头下方有分隔线。GPay/ApplePay/PayPal:更高的标头(72px),带支付徽标。' },
      { num: '2', name: '左侧图标',  desc: '可选 20×20px 图标插槽。显示前置图标或国家旗帜表情。继承品牌主前景色。禁用时隐藏。' },
      { num: '3', name: '标题',     desc: '14px / 字重 500 文本,行高 20px。前景色取自品牌主要令牌。必填。Hover、Focus 和 Disabled 状态下颜色会变化。' },
      { num: '4', name: '雪佛龙',    desc: '20×20px 展开/折叠指示器。展开时旋转 180 度。继承每种状态下与标题相同的前景色。' },
      { num: '5', name: '内容',     desc: '展开=是时可见的主体区域。14px / 字重 400 文本,行高 20px。使用主前景色。展开=否时完全隐藏。' },
    ],
    tokenRows: [
      { label: '边框分隔线',   key: 'atom.border.default.border-divider',                       cssVar: '--atom-border-default-border-divider',                       states: ['Default'] as AccordionState[] },
      { label: '悬停边框',     key: 'atom.border.states.border-hover',                          cssVar: '--atom-border-states-border-hover',                          states: ['Hover'] as AccordionState[] },
      { label: '焦点边框',     key: 'atom.border.selection-and-focus.border-primary-focus',     cssVar: '--atom-border-selection-and-focus-border-primary-focus',     states: ['Focus'] as AccordionState[] },
      { label: '禁用边框',     key: 'atom.border.states.border-disabled',                       cssVar: '--atom-border-states-border-disabled',                       states: ['Disabled'] as AccordionState[] },
      { label: '品牌主前景',   key: 'atom.foreground.primary.fg-brand-primary',                 cssVar: '--atom-foreground-primary-fg-brand-primary',                 states: ['Default'] as AccordionState[] },
      { label: '悬停前景',     key: 'atom.foreground.states.fg-hover',                          cssVar: '--atom-foreground-states-fg-hover',                          states: ['Hover'] as AccordionState[] },
      { label: '禁用前景',     key: 'atom.foreground.states.fg-disabled',                       cssVar: '--atom-foreground-states-fg-disabled',                       states: ['Disabled'] as AccordionState[] },
      { label: '正文文本前景', key: 'atom.foreground.core.fg-primary',                          cssVar: '--atom-foreground-core-fg-primary',                          states: ['Default'] as AccordionState[] },
      { label: '背景填充',     key: 'atom.background.primary.bg-primary-inverse',               cssVar: '--atom-background-primary-bg-primary-inverse',               states: ['Default'] as AccordionState[] },
    ],
    a11yRows: [
      {
        icon: '\u2328\uFE0F',
        title: '键盘交互',
        body: '每个手风琴标头都是一个 <button>,按 Tab 顺序获得焦点。按 Enter 或 Space 切换展开/折叠状态。方向键是可选的,但可以添加以增强标头之间的导航。',
      },
      {
        icon: '\uD83C\uDFF7\uFE0F',
        title: 'ARIA 属性',
        body: '每个标头按钮使用 aria-expanded="true|false" 和指向其内容区域 ID 的 aria-controls。内容面板使用 role="region" 和 aria-hidden 来匹配展开状态。',
      },
      {
        icon: '\uD83C\uDFA8',
        title: '颜色对比度',
        body: '标题文本(白色背景上的品牌主前景色)在所有 6 个品牌中均符合 WCAG AA 4.5:1 最低对比度。正文文本和副标题也符合 AA 要求。',
      },
      {
        icon: '\uD83D\uDD24',
        title: '内容结构',
        body: '不要仅依赖展开/折叠的视觉状态来传达层级结构。使用描述性标题,以便用户在展开之前了解每个部分的内容。',
      },
      {
        icon: '\u2728',
        title: '动效',
        body: '展开/折叠动画使用 max-height 和 opacity 过渡(0.25 秒)。对于偏好减少动效的用户,可考虑禁用动画并立即切换内容可见性。',
      },
    ],
    whenToUseItems: [
      '相关内容的渐进显示(FAQ、条款、设置)',
      '减少长页面中多个部分的认知负荷',
      '每一步都是可折叠部分的支付流程',
      '对用户可能不需要的次要详情进行分组',
    ],
    whenNotToUseItems: [
      '不要隐藏用户必须看到的关键内容 — 在线显示',
      '不要将单个手风琴用于主要导航 — 改用标签页',
      '不要在手风琴内嵌套手风琴 — 扁平化层级',
      '不要用于内容很短、折叠后无附加价值的情况',
    ],
  },
} as const;

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// ─── Style dot colors for variant chips ──────────────────────────────────────
const STYLE_DOT_COLORS: Record<AccordionStyle, string> = {
  'Full Border':   '#0a2333',
  'Bottom Border': '#045477',
  'GPay':       '#006b99',
  'ApplePay':  '#000000',
  'PayPal':    '#253B80',
};

// ─── State dot colors ────────────────────────────────────────────────────────
const STATE_DOT_COLORS: Record<AccordionState, string> = {
  Default:  '#0a2333',
  Hover:    '#045477',
  Focus:    '#0a2333',
  Disabled: '#91908f',
};

const STATE_DOT_BORDER: Record<AccordionState, string> = {
  Default:  '#0a2333',
  Hover:    '#045477',
  Focus:    '#0a2333',
  Disabled: '#cdcbcb',
};

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

export function AccordionPage({ brand, lang = 'en' }: AccordionPageProps) {
  const t = COPY[lang];
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  // Interactive preview state
  const [state, setState]               = useState<AccordionState>('Default');
  const [style, setStyle]               = useState<AccordionStyle>('Full Border');
  const [opened, setOpened]             = useState(false);
  const [backgroundFill, setBackgroundFill] = useState(true);
  const [showIconLeft, setShowIconLeft] = useState(true);
  const [showCountryFlag, setShowCountryFlag] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showBadge, setShowBadge]       = useState(false);
  const [showContent, setShowContent]   = useState(true);

  const previewKey = `${state}-${style}-${opened}-${backgroundFill}-${showIconLeft}-${showCountryFlag}-${showSubtitle}-${showBadge}-${showContent}`;

  return (
    <div className="space-y-10">

      {/* -- 1. INTERACTIVE PREVIEW ------------------------------------------------ */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-72">

            {/* Left: canvas */}
            <div
              className="flex-1 flex items-center justify-center p-10 min-h-52"
              style={DOTTED_BG}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                  style={{ width: '100%', maxWidth: '460px' }}
                >
                  <AccordionLive
                    style={style}
                    state={state}
                    opened={opened}
                    backgroundFill={backgroundFill}
                    showIconLeft={showIconLeft}
                    showCountryFlag={showCountryFlag}
                    showSubtitle={showSubtitle}
                    showBadge={showBadge}
                    showContent={showContent}
                    brand={brand}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: controls */}
            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5 overflow-y-auto">

              {/* State */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.stateLabel}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(['Default', 'Hover', 'Focus', 'Disabled'] as AccordionState[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setState(s)}
                      className={[
                        'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        state === s
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0 border"
                        style={{
                          backgroundColor: STATE_DOT_COLORS[s],
                          borderColor: STATE_DOT_BORDER[s],
                        }}
                      />
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.styleLabel}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(['Full Border', 'Bottom Border', 'GPay', 'ApplePay', 'PayPal'] as AccordionStyle[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStyle(s)}
                      className={[
                        'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        style === s
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0 border"
                        style={{
                          backgroundColor: STYLE_DOT_COLORS[s],
                          borderColor: STYLE_DOT_COLORS[s],
                        }}
                      />
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Opened */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.openedLabel}</p>
                <div className="flex rounded-lg border border-slate-200 overflow-hidden w-fit">
                  {([{ key: 'Yes', label: t.yes }, { key: 'No', label: t.no }] as const).map((opt) => {
                    const isActive = opt.key === 'Yes' ? opened : !opened;
                    return (
                      <button
                        key={opt.key}
                        onClick={() => setOpened(opt.key === 'Yes')}
                        className={[
                          'px-3 py-1.5 text-xs font-medium transition-all duration-100',
                          isActive
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600 hover:bg-slate-50',
                        ].join(' ')}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Background Fill */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.backgroundFillLabel}</p>
                <div className="flex rounded-lg border border-slate-200 overflow-hidden w-fit">
                  {([{ key: 'Yes', label: t.yes }, { key: 'No', label: t.no }] as const).map((opt) => {
                    const isActive = opt.key === 'Yes' ? backgroundFill : !backgroundFill;
                    return (
                      <button
                        key={opt.key}
                        onClick={() => setBackgroundFill(opt.key === 'Yes')}
                        className={[
                          'px-3 py-1.5 text-xs font-medium transition-all duration-100',
                          isActive
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600 hover:bg-slate-50',
                        ].join(' ')}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Options */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.optionsLabel}</p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: t.optIconLeft,    value: showIconLeft,    set: setShowIconLeft },
                    { label: t.optCountryFlag, value: showCountryFlag, set: setShowCountryFlag },
                    { label: t.optSubtitle,    value: showSubtitle,    set: setShowSubtitle },
                    { label: t.optBadge,       value: showBadge,       set: setShowBadge },
                    { label: t.optContent,     value: showContent,     set: setShowContent },
                  ].map(({ label: lbl, value, set }) => (
                    <label key={lbl} className="flex items-center gap-2.5 cursor-pointer select-none group">
                      <button
                        role="checkbox"
                        aria-checked={value}
                        onClick={() => set(!value)}
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
                      <span className="text-xs text-slate-600">{lbl}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* -- 2. COMPONENT INFO ----------------------------------------------------- */}
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

      {/* -- 3. ANATOMY ------------------------------------------------------------ */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.anatomyHeading}</h2>
        <p className="text-sm text-slate-500 mb-5">
          {t.anatomyIntro}
        </p>

        <div className="flex items-center justify-center rounded-xl" style={{ ...DOTTED_BG, padding: '80px 32px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '460px' }}>

            {/* ── Top callouts (above accordion → header elements) ── */}

            {/* Callout: 2 Icon Left */}
            <div
              className="pointer-events-none"
              style={{ position: 'absolute', bottom: '100%', left: '5.4%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '4px' }}
            >
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">2</span>
              <div className="w-px bg-slate-400" style={{ height: '28px' }} />
            </div>

            {/* Callout: 3 Title */}
            <div
              className="pointer-events-none"
              style={{ position: 'absolute', bottom: '100%', left: '25%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '4px' }}
            >
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">3</span>
              <div className="w-px bg-slate-400" style={{ height: '28px' }} />
            </div>

            {/* Callout: 4 Chevron */}
            <div
              className="pointer-events-none"
              style={{ position: 'absolute', bottom: '100%', left: '95%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '4px' }}
            >
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">4</span>
              <div className="w-px bg-slate-400" style={{ height: '28px' }} />
            </div>

            {/* ── The accordion ── */}
            <AccordionLive
              style="Full Border"
              state="Default"
              opened={true}
              showIconLeft={true}
              showSubtitle={true}
              showBadge={true}
              showContent={true}
              backgroundFill={true}
              brand={brand}
            />

            {/* ── Bottom callouts (below accordion) ── */}

            {/* Callout: 1 Container */}
            <div
              className="pointer-events-none"
              style={{ position: 'absolute', top: '100%', left: '30%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4px' }}
            >
              <div className="w-px bg-slate-400" style={{ height: '28px' }} />
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">1</span>
            </div>

            {/* Callout: 5 Content */}
            <div
              className="pointer-events-none"
              style={{ position: 'absolute', top: '100%', left: '70%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4px' }}
            >
              <div className="w-px bg-slate-400" style={{ height: '28px' }} />
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">5</span>
            </div>

          </div>
        </div>

        {/* Anatomy legend */}
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

      {/* -- 4. VARIANTS ----------------------------------------------------------- */}
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
              {t.variantRows.map((row, i) => {
                // Get dot colors for Style row
                const isStyleRow = i === 1;
                return (
                  <tr key={row.label} className={i < t.variantRows.length - 1 ? 'border-b border-slate-100' : ''}>
                    <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">{row.label}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {row.chips.map((chipText, cidx) => {
                          let dot: string | undefined;
                          if (isStyleRow) {
                            const styleKeys: AccordionStyle[] = ['Full Border', 'Bottom Border', 'GPay', 'ApplePay', 'PayPal'];
                            dot = STYLE_DOT_COLORS[styleKeys[cidx]];
                          }
                          return (
                            <span key={chipText} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium">
                              {dot && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dot }} />}
                              {chipText}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Visual preview: 5 styles x 2 opened states = 10 cards */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {(['Full Border', 'Bottom Border', 'GPay', 'ApplePay', 'PayPal'] as AccordionStyle[]).map((s) =>
            ([false, true] as const).map((isOpen) => (
              <div key={`${s}-${isOpen}`} style={{ padding: '20px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>
                  {s} {isOpen ? t.open : t.closed}
                </p>
                <AccordionLive style={s} state="Default" opened={isOpen} showIconLeft={true} backgroundFill={true} showContent={true} brand={brand} />
              </div>
            ))
          )}
        </div>
      </section>

      {/* -- 5. DESIGN TOKENS ------------------------------------------------------ */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.designTokensHeading}</h2>
        <p className="text-sm text-slate-500 mb-4">
          {t.designTokensIntro}
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">{t.tokenHeader}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.cssVarHeader}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">{t.valueHeader} ({brand})</th>
              </tr>
            </thead>
            <tbody>
              {t.tokenRows.map((row, i) => {
                const isActive = row.states.includes(state);
                const rawValue = tokens[row.key as keyof typeof tokens] ?? '\u2014';
                const swatchHex = rawValue.length > 7 ? rawValue.slice(0, 7) : rawValue;
                const light = isLightColor(swatchHex);
                return (
                  <tr
                    key={row.cssVar}
                    className={[
                      i < t.tokenRows.length - 1 ? 'border-b border-slate-100' : '',
                      isActive ? 'bg-blue-50/60' : 'opacity-50',
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

      {/* -- 6. ACCESSIBILITY ------------------------------------------------------ */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.a11yHeading}</h2>
        <p className="text-sm text-slate-500 mb-4">
          {t.a11yIntro}
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

      {/* -- 7. USAGE -------------------------------------------------------------- */}
      <section>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{t.usageHeading}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.usageIntro}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>{t.whenToUse}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              {t.whenToUseItems.map((item, i) => (
                <li key={i} style={{ marginBottom: i < t.whenToUseItems.length - 1 ? '6px' : 0 }}>{item}</li>
              ))}
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>{t.whenNotToUse}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              {t.whenNotToUseItems.map((item, i) => (
                <li key={i} style={{ marginBottom: i < t.whenNotToUseItems.length - 1 ? '6px' : 0 }}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
