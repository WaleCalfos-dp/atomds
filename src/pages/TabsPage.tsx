import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TabsLive, type TabsStyle, type TabCount } from '../components/tabs/TabsLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';

interface TabsPageProps {
  brand: Brand;
  lang?: Language;
}

const COPY = {
  en: {
    styleLabel: 'Style',
    numberOfTabs: 'Number of Tabs',
    activeTab: 'Active tab',
    figmaCountNote1: 'Figma only publishes ',
    figmaCountNote2: ' at 2–',
    figmaCountNote3: ' tabs. Shown here is a runtime extension.',
    title: 'Tabs',
    intro1: 'Organises related content into switchable views within the same context. Four styles (',
    intro2: 'Underlined, Plain, Circular on Light, Circular on Dark',
    intro3: ') across 2–7 tabs. Font family updates per brand via ',
    intro4: '.',
    feedback: 'Feedback',
    stable: 'Stable',
    anatomyTitle: 'Anatomy',
    anatomyLead:
      'Underlined anatomy below. Plain shares the same structure without the container divider; Circular styles swap the underline indicator for a filled pill.',
    anatomyParts: [
      { num: '1', name: 'Container',           desc: 'Horizontal row that wraps all tabs. Height: 48px. 16px gap between tabs. Carries the tablist role.' },
      { num: '2', name: 'Tab label',           desc: '14px text, weight 400 inactive / 500 active. Font family from --atom-font-body. Uses --atom-foreground-primary-fg-brand-primary when active; --atom-foreground-core-fg-primary when not.' },
      { num: '3', name: 'Active indicator',    desc: 'Underlined: 1px solid bottom border on the active tab only. Plain: same 1px indicator, no container border. Circular: fully filled pill swaps for the underline.' },
      { num: '4', name: 'Container divider',   desc: '1px bottom border across the full row. Present in Underlined only. Absent in Plain, Circular on Light, and Circular on Dark.' },
    ],
    variantsTitle: 'Variants',
    propertyHeader: 'Property',
    valuesHeader: 'Values',
    variantRows: [
      {
        label: 'Style',
        chips: [
          { text: 'Underlined',          note: 'default' },
          { text: 'Plain',               note: '' },
          { text: 'Circular on Light',   note: '' },
          { text: 'Circular on Dark',    note: '' },
        ],
      },
      {
        label: 'Number of Tabs',
        chips: [
          { text: '2', note: 'default' },
          { text: '3', note: '' },
          { text: '4', note: '' },
          { text: '5', note: 'Underlined / Plain only' },
          { text: '6', note: 'Underlined / Plain only' },
          { text: '7', note: 'Underlined / Plain only' },
        ],
      },
      {
        label: 'Concrete variants',
        chips: [
          { text: '18 total', note: 'Underlined ×6 · Plain ×6 · Circular on Light ×3 · Circular on Dark ×3' },
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
      'Active tokens for the selected style are highlighted. Dark-pill container and inactive label are literal RGBA / hex (not tokenised).',
    tokenLabels: {
      'Active label': 'Active label',
      'Inactive label': 'Inactive label',
      'Container bottom border': 'Container bottom border',
      'Active underline indicator': 'Active underline indicator',
      'Light pill container bg': 'Light pill container bg',
      'Light pill active bg': 'Light pill active bg',
      'Light pill active label': 'Light pill active label',
      'Dark pill container bg': 'Dark pill container bg',
      'Dark pill active bg': 'Dark pill active bg',
      'Dark pill active label': 'Dark pill active label',
      'Dark pill inactive label': 'Dark pill inactive label',
    } as Record<string, string>,
    tokenHeader: 'Token',
    cssVarHeader: 'CSS Variable',
    fallbackHeader: 'Fallback',
    a11yTitle: 'Accessibility',
    a11yLead: 'Guidelines for building inclusive experiences with the Tabs component.',
    a11yRows: [
      { icon: '🔖', title: 'Tablist semantics',      body: 'The tab container must carry role="tablist". Each tab must carry role="tab", and the content area controlled by the active tab must use role="tabpanel" with aria-labelledby pointing to its tab.' },
      { icon: '✅', title: 'aria-selected',          body: 'The currently active tab must set aria-selected="true"; all inactive tabs must set aria-selected="false". This tells assistive technologies which tab\u2019s panel is currently displayed.' },
      { icon: '⌨️', title: 'Keyboard navigation',    body: 'Arrow Left / Arrow Right move focus between tabs. Home jumps focus to the first tab, End to the last. Enter or Space activates the focused tab.' },
      { icon: '🎯', title: 'Focus management',       body: 'Only the active tab sits in the tab order (tabindex="0"). Inactive tabs use tabindex="-1" so keyboard users tab past the tablist as a single stop, then use arrow keys within.' },
      { icon: '🚫', title: 'Don\u2019t disable tabs', body: 'Avoid disabling tabs \u2014 users cannot discover what content they hide. Instead, show the tab panel with a message explaining why the content is unavailable.' },
      { icon: '🎨', title: 'Colour contrast',        body: 'All active/inactive label pairings meet WCAG AA 4.5:1 across the six brands. The underline indicator is not the only cue \u2014 weight and colour also change, satisfying WCAG 1.4.1 (Use of Color).' },
      { icon: '🌓', title: 'Dark surface usage',     body: 'Use Circular on Dark only when the surrounding surface is dark. Placing it on a light background breaks both the visual metaphor and the contrast of the white-on-white inactive label.' },
    ],
    usageTitle: 'Usage',
    usageLead: 'When and how to use each Tabs style.',
    usageCards: [
      { title: 'Underlined',         color: '#0a2333', bg: '#f0f4f8', when: 'The default style for page-level navigation between related sections. The container divider visually separates the tab row from the panel below.' },
      { title: 'Plain',              color: '#374151', bg: '#f9fafb', when: 'Use when the surrounding layout already provides visual separation. Drops the container divider so the tablist blends into richer surrounding content.' },
      { title: 'Circular on Light',  color: '#0a2333', bg: '#eef1f3', when: 'For compact toggles or filters inside cards and toolbars on light backgrounds. The filled pill is more emphatic than an underline — use sparingly.' },
      { title: 'Circular on Dark',   color: '#0f172a', bg: '#e2e8f0', when: 'Same toggle pattern as Circular on Light, but for dark hero banners, inverted sections, or dark cards. Never place on a light background.' },
    ],
    doTitle: '✓ When to use',
    dontTitle: '✗ When not to use',
    doItems: [
      'Keep tab labels short, noun-based, and scannable (1–3 words)',
      'Use 2–7 tabs — beyond 7 the row becomes unreadable on small screens',
      'Pair every tab with a meaningful tabpanel of content',
      'Match the style to the surrounding surface (Circular on Dark only on dark backgrounds)',
      'Keep the tab order stable — never reorder tabs based on activity or popularity',
    ],
    dontItems: [
      "Don't use tabs for sequential steps — use the Stepper / Steps components",
      "Don't nest tabs inside tabs — flatten the hierarchy instead",
      "Don't disable tabs — show the panel with an explanation",
      "Don't use tabs for unrelated content — pages or sections are clearer",
      "Don't place Circular on Dark against a light surface",
    ],
  },
  zh: {
    styleLabel: '样式',
    numberOfTabs: '选项卡数量',
    activeTab: '激活选项卡',
    figmaCountNote1: 'Figma 仅发布了 ',
    figmaCountNote2: ' 在 2–',
    figmaCountNote3: ' 个选项卡范围内。此处显示的是运行时扩展。',
    title: '选项卡',
    intro1: '在同一上下文中将相关内容组织为可切换的视图。四种样式(',
    intro2: 'Underlined、Plain、Circular on Light、Circular on Dark',
    intro3: ')涵盖 2–7 个选项卡。字体族通过 ',
    intro4: ' 按品牌更新。',
    feedback: '反馈',
    stable: '稳定版',
    anatomyTitle: '结构剖析',
    anatomyLead:
      '下方为 Underlined 的结构。Plain 共享相同结构但没有容器分割线；Circular 样式将下划线指示器换成填充胶囊。',
    anatomyParts: [
      { num: '1', name: '容器',         desc: '包裹所有选项卡的横向行。高度:48px。选项卡之间间距 16px。承载 tablist 角色。' },
      { num: '2', name: '选项卡标签',    desc: '14px 文本,未激活 400 字重 / 激活 500 字重。字体族来自 --atom-font-body。激活时使用 --atom-foreground-primary-fg-brand-primary;未激活时使用 --atom-foreground-core-fg-primary。' },
      { num: '3', name: '激活指示器',    desc: 'Underlined:仅在激活选项卡上有 1px 实心底部边框。Plain:相同的 1px 指示器,无容器边框。Circular:用完全填充的胶囊代替下划线。' },
      { num: '4', name: '容器分割线',    desc: '横跨整行的 1px 底部边框。仅 Underlined 有。Plain、Circular on Light 和 Circular on Dark 没有。' },
    ],
    variantsTitle: '变体',
    propertyHeader: '属性',
    valuesHeader: '值',
    variantRows: [
      {
        label: '样式',
        chips: [
          { text: 'Underlined',          note: '默认' },
          { text: 'Plain',               note: '' },
          { text: 'Circular on Light',   note: '' },
          { text: 'Circular on Dark',    note: '' },
        ],
      },
      {
        label: '选项卡数量',
        chips: [
          { text: '2', note: '默认' },
          { text: '3', note: '' },
          { text: '4', note: '' },
          { text: '5', note: '仅 Underlined / Plain' },
          { text: '6', note: '仅 Underlined / Plain' },
          { text: '7', note: '仅 Underlined / Plain' },
        ],
      },
      {
        label: '具体变体',
        chips: [
          { text: '共 18 个', note: 'Underlined ×6 · Plain ×6 · Circular on Light ×3 · Circular on Dark ×3' },
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
      '当前所选样式激活的令牌已高亮显示。深色胶囊容器和未激活标签为字面 RGBA / 十六进制(未令牌化)。',
    tokenLabels: {
      'Active label': '激活标签',
      'Inactive label': '未激活标签',
      'Container bottom border': '容器底部边框',
      'Active underline indicator': '激活下划线指示器',
      'Light pill container bg': '浅色胶囊容器背景',
      'Light pill active bg': '浅色胶囊激活背景',
      'Light pill active label': '浅色胶囊激活标签',
      'Dark pill container bg': '深色胶囊容器背景',
      'Dark pill active bg': '深色胶囊激活背景',
      'Dark pill active label': '深色胶囊激活标签',
      'Dark pill inactive label': '深色胶囊未激活标签',
    } as Record<string, string>,
    tokenHeader: '令牌',
    cssVarHeader: 'CSS 变量',
    fallbackHeader: '回退值',
    a11yTitle: '可访问性',
    a11yLead: '使用 Tabs 组件构建无障碍体验的指南。',
    a11yRows: [
      { icon: '🔖', title: 'Tablist 语义',          body: '选项卡容器必须带有 role="tablist"。每个选项卡必须带有 role="tab",由激活选项卡控制的内容区域必须使用 role="tabpanel" 并通过 aria-labelledby 指向其选项卡。' },
      { icon: '✅', title: 'aria-selected',          body: '当前激活的选项卡必须设置 aria-selected="true";所有未激活的选项卡必须设置 aria-selected="false"。这告知辅助技术当前显示的是哪个选项卡的面板。' },
      { icon: '⌨️', title: '键盘导航',               body: '左方向键 / 右方向键在选项卡之间移动焦点。Home 跳转到第一个选项卡,End 跳转到最后一个。Enter 或 Space 激活当前焦点选项卡。' },
      { icon: '🎯', title: '焦点管理',               body: '只有激活的选项卡位于 Tab 顺序中(tabindex="0")。未激活的选项卡使用 tabindex="-1",这样键盘用户作为单一停留点跳过 tablist,然后在内部使用方向键。' },
      { icon: '🚫', title: '不要禁用选项卡',         body: '避免禁用选项卡 \u2014 用户无法发现它们隐藏的内容。相反,显示选项卡面板并附上说明为何内容不可用的消息。' },
      { icon: '🎨', title: '颜色对比度',             body: '在六个品牌中,所有激活/未激活标签配对均符合 WCAG AA 4.5:1。下划线指示器并非唯一线索 \u2014 字重和颜色也会变化,符合 WCAG 1.4.1(颜色使用)。' },
      { icon: '🌓', title: '深色表面使用',           body: '仅当周围表面为深色时才使用 Circular on Dark。将其放在浅色背景上会破坏视觉隐喻以及白底白字未激活标签的对比度。' },
    ],
    usageTitle: '用法',
    usageLead: '何时以及如何使用每种 Tabs 样式。',
    usageCards: [
      { title: 'Underlined',         color: '#0a2333', bg: '#f0f4f8', when: '相关章节之间页面级导航的默认样式。容器分割线在视觉上将选项卡行与下方面板分离。' },
      { title: 'Plain',              color: '#374151', bg: '#f9fafb', when: '当周围布局已提供视觉分隔时使用。去掉容器分割线,让 tablist 融入更丰富的周围内容。' },
      { title: 'Circular on Light',  color: '#0a2333', bg: '#eef1f3', when: '用于浅色背景上的卡片和工具栏内的紧凑切换或筛选。填充胶囊比下划线更强调 — 谨慎使用。' },
      { title: 'Circular on Dark',   color: '#0f172a', bg: '#e2e8f0', when: '与 Circular on Light 相同的切换模式,但用于深色英雄横幅、反色章节或深色卡片。绝不放在浅色背景上。' },
    ],
    doTitle: '✓ 推荐做法',
    dontTitle: '✗ 避免做法',
    doItems: [
      '保持选项卡标签简短、名词化、易扫读(1–3 个词)',
      '使用 2–7 个选项卡 — 超过 7 个在小屏幕上无法阅读',
      '为每个选项卡配上有意义的 tabpanel 内容',
      '使样式与周围表面匹配(Circular on Dark 仅用于深色背景)',
      '保持选项卡顺序稳定 — 切勿根据活动或受欢迎程度重新排序选项卡',
    ],
    dontItems: [
      '不要将选项卡用于顺序步骤 — 使用 Stepper / Steps 组件',
      '不要在选项卡内嵌套选项卡 — 改为扁平化层级',
      '不要禁用选项卡 — 显示带说明的面板',
      '不要将选项卡用于不相关的内容 — 页面或章节更清晰',
      '不要将 Circular on Dark 放在浅色表面上',
    ],
  },
} as const;

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const DARK_BG: React.CSSProperties = {
  backgroundColor: '#1e293b',
  backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const ALL_STYLES: TabsStyle[] = ['Underlined', 'Plain', 'Circular on Light', 'Circular on Dark'];
const ALL_COUNTS: TabCount[] = [2, 3, 4, 5, 6, 7];
const FIGMA_COUNTS_BY_STYLE: Record<TabsStyle, TabCount[]> = {
  Underlined:           [2, 3, 4, 5, 6, 7],
  Plain:                [2, 3, 4, 5, 6, 7],
  'Circular on Light':  [2, 3, 4],
  'Circular on Dark':   [2, 3, 4],
};

const STYLE_META: Record<TabsStyle, { dotColor: string; dotBorder: string }> = {
  Underlined:           { dotColor: 'transparent',                                           dotBorder: 'var(--atom-border-selection-and-focus-border-selected)' },
  Plain:                { dotColor: 'transparent',                                           dotBorder: 'var(--atom-foreground-core-fg-primary)' },
  'Circular on Light':  { dotColor: 'var(--atom-background-primary-bg-primary-default)',    dotBorder: 'var(--atom-background-primary-bg-primary-default)' },
  'Circular on Dark':   { dotColor: '#ffffff',                                               dotBorder: '#ffffff' },
};

type TokenRow = {
  label: string;
  cssVar: string;
  tokenKey?: string;
  fallback: string;
  styles: TabsStyle[];
};

const TOKEN_TABLE_ROWS: TokenRow[] = [
  { label: 'Active label',                cssVar: '--atom-foreground-primary-fg-brand-primary',         tokenKey: 'atom.foreground.primary.fg-brand-primary',         fallback: '#0a2333',    styles: ['Underlined', 'Plain', 'Circular on Light'] },
  { label: 'Inactive label',              cssVar: '--atom-foreground-core-fg-primary',                  tokenKey: 'atom.foreground.core.fg-primary',                  fallback: '#4b4a4a',    styles: ['Underlined', 'Plain', 'Circular on Light'] },
  { label: 'Container bottom border',     cssVar: '--atom-border-default-border-default',               tokenKey: 'atom.border.default.border-default',               fallback: '#cdcbcb',    styles: ['Underlined'] },
  { label: 'Active underline indicator',  cssVar: '--atom-border-selection-and-focus-border-selected',  tokenKey: 'atom.border.selection-and-focus.border-selected',  fallback: '#0a2333',    styles: ['Underlined', 'Plain'] },
  { label: 'Light pill container bg',     cssVar: '--atom-background-core-bg-muted',                    tokenKey: 'atom.background.core.bg-muted',                    fallback: '#0a23330a',  styles: ['Circular on Light'] },
  { label: 'Light pill active bg',        cssVar: '--atom-background-primary-bg-primary-default',       tokenKey: 'atom.background.primary.bg-primary-default',       fallback: '#0a2333',    styles: ['Circular on Light'] },
  { label: 'Light pill active label',     cssVar: '--atom-foreground-primary-fg-brand-primary-inverse', tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse', fallback: '#ffffff',    styles: ['Circular on Light'] },
  { label: 'Dark pill container bg',      cssVar: '— (rgba(255,255,255,0.2))',                                                                                       fallback: '#ffffff33',  styles: ['Circular on Dark'] },
  { label: 'Dark pill active bg',         cssVar: '--atom-background-primary-bg-primary-inverse',       tokenKey: 'atom.background.primary.bg-primary-inverse',       fallback: '#ffffff',    styles: ['Circular on Dark'] },
  { label: 'Dark pill active label',      cssVar: '--atom-foreground-primary-fg-brand-primary',         tokenKey: 'atom.foreground.primary.fg-brand-primary',         fallback: '#0a2333',    styles: ['Circular on Dark'] },
  { label: 'Dark pill inactive label',    cssVar: '— (literal #ffffff)',                                                                                             fallback: '#ffffff',    styles: ['Circular on Dark'] },
];

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

function canvasBg(style: TabsStyle): React.CSSProperties {
  return style === 'Circular on Dark' ? DARK_BG : DOTTED_BG;
}

export function TabsPage({ brand, lang = 'en' }: TabsPageProps) {
  const t = COPY[lang];
  const [tabStyle, setTabStyle]   = useState<TabsStyle>('Underlined');
  const [count, setCount]         = useState<TabCount>(3);
  const [activeIndex, setActive]  = useState(0);

  const clampedActive = Math.min(activeIndex, count - 1);
  const previewKey = `${tabStyle}-${count}-${clampedActive}`;
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];
  const figmaCountsForStyle = FIGMA_COUNTS_BY_STYLE[tabStyle];
  const countExistsInFigma  = figmaCountsForStyle.includes(count);

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-72">

            {/* Canvas */}
            <div
              className="flex-1 flex items-center justify-center p-12 min-h-52"
              style={canvasBg(tabStyle)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                  style={{ width: '100%', maxWidth: '520px' }}
                >
                  <TabsLive tabStyle={tabStyle} count={count} activeIndex={clampedActive} brand={brand} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5 overflow-y-auto">

              {/* Style */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.styleLabel}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {ALL_STYLES.map((s) => {
                    const meta = STYLE_META[s];
                    return (
                      <button
                        key={s}
                        onClick={() => setTabStyle(s)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          padding: '4px 10px', borderRadius: '6px',
                          fontSize: '12px', fontWeight: 500, border: '1px solid',
                          cursor: 'pointer', textAlign: 'left', width: '100%',
                          transition: 'all 0.1s ease',
                          ...(tabStyle === s
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

              {/* Number of Tabs */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.numberOfTabs}</p>
                <div className="flex rounded-lg border border-slate-200 overflow-hidden w-fit">
                  {ALL_COUNTS.map((c) => (
                    <button key={c}
                      onClick={() => { setCount(c); setActive(prev => Math.min(prev, c - 1)); }}
                      className={['px-3 py-1.5 text-xs font-medium transition-all duration-100',
                        count === c ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'].join(' ')}>
                      {c}
                    </button>
                  ))}
                </div>
                {!countExistsInFigma && (
                  <p style={{ marginTop: '6px', fontSize: '11px', color: '#9a3412' }}>
                    {t.figmaCountNote1}{tabStyle}{t.figmaCountNote2}{figmaCountsForStyle[figmaCountsForStyle.length - 1]}{t.figmaCountNote3}
                  </p>
                )}
              </div>

              {/* Active tab */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.activeTab}</p>
                <div className="flex rounded-lg border border-slate-200 overflow-hidden w-fit">
                  {Array.from({ length: count }, (_, i) => (
                    <button key={i}
                      onClick={() => setActive(i)}
                      className={['px-3 py-1.5 text-xs font-medium transition-all duration-100',
                        clampedActive === i ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'].join(' ')}>
                      {i + 1}
                    </button>
                  ))}
                </div>
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
              {t.intro1}{t.intro2}{t.intro3}<code className="text-xs bg-slate-100 px-1 rounded">--atom-font-body</code>{t.intro4}
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
          <div style={{ width: '100%', maxWidth: '380px' }}>
            <TabsLive tabStyle="Underlined" count={3} activeIndex={0} brand={brand} />
          </div>
          {/* 1 — Container (top) */}
          <div className="absolute top-4 flex flex-col items-center pointer-events-none" style={{ left: '20%', transform: 'translateX(-50%)' }}>
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">1</span>
            <div className="w-px bg-slate-400" style={{ height: '28px' }} />
          </div>
          {/* 2 — Tab label (top) */}
          <div className="absolute top-4 flex flex-col items-center pointer-events-none" style={{ left: '42%', transform: 'translateX(-50%)' }}>
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">2</span>
            <div className="w-px bg-slate-400" style={{ height: '28px' }} />
          </div>
          {/* 3 — Active indicator (bottom) */}
          <div className="absolute bottom-4 flex flex-col items-center pointer-events-none" style={{ left: '24%', transform: 'translateX(-50%)' }}>
            <div className="w-px bg-slate-400" style={{ height: '28px' }} />
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">3</span>
          </div>
          {/* 4 — Container divider (bottom) */}
          <div className="absolute bottom-4 flex flex-col items-center pointer-events-none" style={{ left: '72%', transform: 'translateX(-50%)' }}>
            <div className="w-px bg-slate-400" style={{ height: '28px' }} />
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">4</span>
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

        {/* Visual preview of all 4 styles */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {ALL_STYLES.map(s => {
            const isDark = s === 'Circular on Dark';
            return (
              <div key={s} style={{
                padding: '24px 28px', borderRadius: '10px',
                border: '1px solid #f3f4f6',
                backgroundColor: isDark ? '#1e293b' : '#fafafa',
                display: 'flex', flexDirection: 'column', gap: '14px',
              }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: isDark ? '#94a3b8' : '#6b7280' }}>{s}</p>
                <TabsLive tabStyle={s} count={3} activeIndex={0} brand={brand} />
              </div>
            );
          })}
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
                const isActive       = row.styles.includes(tabStyle);
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
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
