import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DataGroupLive,
  type DataGroupType,
  type DataGroupProductModule,
} from '../components/data-row/DataGroupLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';

interface DataGroupPageProps {
  brand: Brand;
  lang?: Language;
}

// ─── Bilingual copy block ─────────────────────────────────────────────────
const COPY = {
  en: {
    typeLabel: 'Type',
    productModuleLabel: 'Product Module',
    booleansLabel: 'Booleans',
    booleansNote1: 'Nine booleans toggle individual row visibility in Figma — ',
    booleansList1: 'Data Row 1–6',
    booleansNote2: ', ',
    booleansList2: 'Data Row (Last)',
    booleansNote3: ', ',
    booleansList3: 'Slot',
    booleansNote4: ', and ',
    booleansList4: 'Icon Left',
    booleansNote5:
      '. The preview composes the full preset for each Type; use Figma to toggle individual rows.',
    title: 'Data Group',
    description:
      'A rounded container that groups two or more Data Rows into a single visual block, with a built-in divider between rows and a clean edge on the last row. Ships in four Types (Single, Multiple, Group 1, Group 2) and two Product Modules (Default, Flight).',
    pillStructural: 'Structural',
    pillStable: 'Stable',
    anatomyTitle: 'Anatomy',
    anatomyLead: 'The parts that make up a Data Group in Figma.',
    colHash: '#',
    colLabel: 'Label',
    colDescription: 'Description',
    anatomyRows: [
      { n: 1, label: 'Container',       body: '8px rounded rectangle with 1px border using border-default on bg-primary-inverse. Pads 16px horizontal; rows provide their own vertical padding.' },
      { n: 2, label: 'Data Row(s)',     body: 'Each row is an instance of the Data Row component. Position is automatically set to First and Middle on non-terminal rows, Last on the final row.' },
      { n: 3, label: 'Row divider',     body: '1px hairline using border-divider rendered between adjacent rows. Hidden on the last row so the container border closes the group cleanly.' },
      { n: 4, label: 'Slot (optional)', body: 'Figma\'s Slot boolean exposes a flexible region inside the container — typically a button row, image, or inline form. Disabled by default.' },
      { n: 5, label: 'Leading icon',    body: 'Icon Left boolean shows a 36×36 icon on the first row only (Flight module uses it for the outbound plane glyph).' },
    ],
    variantsTitle: 'Variants',
    colProperty: 'Property',
    colValues: 'Values',
    propType: 'Type',
    propProductModule: 'Product Module',
    propBooleans: 'Booleans (9)',
    propTextSlots: 'Text slots',
    propFontFamily: 'Font family',
    noteDefault: 'Default',
    textSlotsNone: 'None — content is supplied by child Data Rows',
    tokensTitle: 'Design Tokens',
    tokensLead: 'All colour decisions are token-backed. Values update with the brand selector.',
    colToken: 'Token',
    colCssVariable: 'CSS Variable',
    colValue: 'Value',
    tokenRows: [
      { label: 'Container surface', cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff' },
      { label: 'Container border',  cssVar: '--atom-border-default-border-default',         tokenKey: 'atom.border.default.border-default',         fallback: '#cdcbcb' },
      { label: 'Row divider',       cssVar: '--atom-border-default-border-divider',         tokenKey: 'atom.border.default.border-divider',         fallback: '#cdcbcb' },
      { label: 'Row label',         cssVar: '--atom-foreground-core-fg-secondary',          tokenKey: 'atom.foreground.core.fg-secondary',          fallback: '#737272' },
      { label: 'Row value',         cssVar: '--atom-foreground-primary-fg-brand-primary',   tokenKey: 'atom.foreground.primary.fg-brand-primary',   fallback: '#0a2333' },
    ],
    a11yTitle: 'Accessibility',
    a11yLead: 'Guidelines for implementing Data Group inclusively.',
    a11yRows: [
      { icon: '📋', title: 'List semantics',  body: 'A Data Group is a list of related rows — render as <ul>/<li> or <dl>/<dt>/<dd> so assistive tech announces the count and reading order.' },
      { icon: '🧠', title: 'Grouping signal', body: 'The rounded container + 1px border communicates "one logical block". Don\'t nest Data Groups inside Data Groups — flatten instead.' },
      { icon: '🎨', title: 'Contrast',         body: 'Container border, row divider, label, and value tokens all meet WCAG AA contrast on the inverse surface across every brand.' },
      { icon: '⌨️', title: 'Keyboard order',   body: 'If rows contain interactive trailing controls (Chevron, Button) tab order follows DOM order — top row first, bottom row last. Never reorder visually without matching DOM.' },
      { icon: '🛬', title: 'Flight module',    body: 'Flight-mode groups stack outbound above return. Read origin → destination times as separate spans so magnifiers don\'t reflow glyphs.' },
      { icon: '📏', title: 'Last-row divider', body: 'The Data Group component auto-hides the divider on the final row (Position=Last). Don\'t add manual spacing below the container — let the group\'s own border close the block.' },
    ],
    usageTitle: 'Usage',
    usageLead:
      'When and how to use Data Group. For flush, borderless listings (e.g. inside another card), use Data Group (No Slot) with Border=Off.',
    whenToUseTitle: '✓ When to use',
    whenNotToUseTitle: '✗ When not to use',
    whenToUseItems: [
      'Grouped label/value detail blocks (profile, receipt)',
      'Flight itineraries (Product Module = Flight)',
      'Summary sections inside confirmation flows',
      '2–6 related rows that belong together visually',
      'Set Type=Single for a one-row group (no rounded container)',
    ],
    whenNotToUseItems: [
      'More than 6 rows — split into multiple groups',
      'Nesting another Data Group inside a Data Group',
      'Selectable/actionable lists — use List Item instead',
      'Inside another bordered card — use No Slot, Border=Off',
      'Mixing Transport rows with non-Transport rows in the same group',
    ],
    variantGrid: [
      { label: 'Single · Default',   t: 'Single'   as DataGroupType, m: 'Default' as DataGroupProductModule },
      { label: 'Single · Flight',    t: 'Single'   as DataGroupType, m: 'Flight'  as DataGroupProductModule },
      { label: 'Multiple · Default', t: 'Multiple' as DataGroupType, m: 'Default' as DataGroupProductModule },
      { label: 'Multiple · Flight',  t: 'Multiple' as DataGroupType, m: 'Flight'  as DataGroupProductModule },
      { label: 'Group 1 · Default',  t: 'Group 1'  as DataGroupType, m: 'Default' as DataGroupProductModule },
      { label: 'Group 2 · Default',  t: 'Group 2'  as DataGroupType, m: 'Default' as DataGroupProductModule },
    ],
  },
  zh: {
    typeLabel: '类型',
    productModuleLabel: '产品模块',
    booleansLabel: '布尔属性',
    booleansNote1: 'Figma 中有九个布尔值用于切换各行的可见性——',
    booleansList1: 'Data Row 1–6',
    booleansNote2: '、',
    booleansList2: 'Data Row (Last)',
    booleansNote3: '、',
    booleansList3: 'Slot',
    booleansNote4: '，以及 ',
    booleansList4: 'Icon Left',
    booleansNote5: '。预览会为每种类型组合完整的预设；使用 Figma 切换单个行。',
    title: '数据组',
    description:
      '一个圆角容器，将两个或更多数据行组合成一个视觉块，行之间内置分隔线，最后一行边缘干净。提供四种类型（Single、Multiple、Group 1、Group 2）和两种产品模块（Default、Flight）。',
    pillStructural: '结构性',
    pillStable: '稳定版',
    anatomyTitle: '结构剖析',
    anatomyLead: '组成 Figma 中数据组的各个部分。',
    colHash: '#',
    colLabel: '标签',
    colDescription: '描述',
    anatomyRows: [
      { n: 1, label: '容器',       body: '8px 圆角矩形，1px 边框使用 border-default，背景为 bg-primary-inverse。水平内边距 16px；行自身提供垂直内边距。' },
      { n: 2, label: '数据行',     body: '每行都是数据行组件的一个实例。在非端点行上位置自动设置为 First 和 Middle，最后一行设置为 Last。' },
      { n: 3, label: '行分隔线',   body: '相邻行之间渲染 1px 细线，使用 border-divider。最后一行隐藏，使容器边框干净地闭合分组。' },
      { n: 4, label: '插槽（可选）', body: 'Figma 的 Slot 布尔值在容器内开放一个灵活区域——通常是按钮行、图片或内联表单。默认禁用。' },
      { n: 5, label: '前导图标',   body: 'Icon Left 布尔值仅在第一行显示 36×36 图标（Flight 模块用它来显示出发航班图标）。' },
    ],
    variantsTitle: '变体',
    colProperty: '属性',
    colValues: '值',
    propType: '类型',
    propProductModule: '产品模块',
    propBooleans: '布尔属性 (9)',
    propTextSlots: '文本插槽',
    propFontFamily: '字体',
    noteDefault: '默认',
    textSlotsNone: '无——内容由子数据行提供',
    tokensTitle: '设计令牌',
    tokensLead: '所有颜色决策均由设计令牌支持。值会随品牌选择器更新。',
    colToken: '令牌',
    colCssVariable: 'CSS 变量',
    colValue: '值',
    tokenRows: [
      { label: '容器表面', cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff' },
      { label: '容器边框', cssVar: '--atom-border-default-border-default',         tokenKey: 'atom.border.default.border-default',         fallback: '#cdcbcb' },
      { label: '行分隔线', cssVar: '--atom-border-default-border-divider',         tokenKey: 'atom.border.default.border-divider',         fallback: '#cdcbcb' },
      { label: '行标签',   cssVar: '--atom-foreground-core-fg-secondary',          tokenKey: 'atom.foreground.core.fg-secondary',          fallback: '#737272' },
      { label: '行值',     cssVar: '--atom-foreground-primary-fg-brand-primary',   tokenKey: 'atom.foreground.primary.fg-brand-primary',   fallback: '#0a2333' },
    ],
    a11yTitle: '可访问性',
    a11yLead: '以包容性方式实现数据组的指南。',
    a11yRows: [
      { icon: '📋', title: '列表语义',     body: '数据组是相关行的列表——渲染为 <ul>/<li> 或 <dl>/<dt>/<dd>，以便辅助技术朗读数量与阅读顺序。' },
      { icon: '🧠', title: '分组信号',     body: '圆角容器 + 1px 边框传达"一个逻辑块"。不要将数据组嵌套在数据组内——改为扁平化。' },
      { icon: '🎨', title: '对比度',       body: '容器边框、行分隔线、标签和值令牌在每个品牌的反色表面上均满足 WCAG AA 对比度。' },
      { icon: '⌨️', title: '键盘顺序',     body: '如果行包含交互式尾部控件（Chevron、按钮），Tab 顺序遵循 DOM 顺序——顶部行优先，底部行最后。切勿在不匹配 DOM 的情况下视觉重排。' },
      { icon: '🛬', title: '航班模块',     body: 'Flight 模式的分组堆叠出发在上、返程在下。将出发地 → 目的地时间作为独立 span 朗读，以免放大镜重排字符。' },
      { icon: '📏', title: '末行分隔线',   body: '数据组组件在最后一行（Position=Last）自动隐藏分隔线。不要在容器下方添加手动间距——让分组自身的边框闭合该块。' },
    ],
    usageTitle: '用法',
    usageLead:
      '何时以及如何使用数据组。对于齐平、无边框的列表（例如在另一张卡片内），使用 Data Group (No Slot) 并设置 Border=Off。',
    whenToUseTitle: '✓ 何时使用',
    whenNotToUseTitle: '✗ 何时不使用',
    whenToUseItems: [
      '分组的标签/值详情块（个人资料、收据）',
      '航班行程（Product Module = Flight）',
      '确认流程内的摘要部分',
      '2–6 个视觉上属于一组的相关行',
      '将 Type 设置为 Single 用于单行分组（无圆角容器）',
    ],
    whenNotToUseItems: [
      '超过 6 行——拆分为多个分组',
      '在数据组内嵌套另一个数据组',
      '可选/可操作列表——改用 List Item',
      '在另一个带边框卡片内——使用 No Slot，Border=Off',
      '在同一组中混用交通行与非交通行',
    ],
    variantGrid: [
      { label: 'Single · Default',   t: 'Single'   as DataGroupType, m: 'Default' as DataGroupProductModule },
      { label: 'Single · Flight',    t: 'Single'   as DataGroupType, m: 'Flight'  as DataGroupProductModule },
      { label: 'Multiple · Default', t: 'Multiple' as DataGroupType, m: 'Default' as DataGroupProductModule },
      { label: 'Multiple · Flight',  t: 'Multiple' as DataGroupType, m: 'Flight'  as DataGroupProductModule },
      { label: 'Group 1 · Default',  t: 'Group 1'  as DataGroupType, m: 'Default' as DataGroupProductModule },
      { label: 'Group 2 · Default',  t: 'Group 2'  as DataGroupType, m: 'Default' as DataGroupProductModule },
    ],
  },
} as const;

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// Figma order on the component set:
const ALL_TYPES:   DataGroupType[]          = ['Group 2', 'Group 1', 'Single', 'Multiple'];
const ALL_MODULES: DataGroupProductModule[] = ['Default', 'Flight'];

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

export function DataGroupPage({ brand, lang = 'en' }: DataGroupPageProps) {
  const t = COPY[lang];
  const [type,          setType]          = useState<DataGroupType>('Group 1');
  const [productModule, setProductModule] = useState<DataGroupProductModule>('Default');

  const previewKey = [type, productModule].join('-');
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-80">
            <div className="flex-1 flex items-center justify-center p-10 min-h-60" style={DOTTED_BG}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                >
                  <DataGroupLive type={type} productModule={productModule} brand={brand} />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5 overflow-y-auto">

              {/* Type */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.typeLabel}</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_TYPES.map((tp) => (
                    <button
                      key={tp}
                      onClick={() => setType(tp)}
                      className={[
                        'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        type === tp
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {tp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Module */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.productModuleLabel}</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_MODULES.map((m) => (
                    <button
                      key={m}
                      onClick={() => setProductModule(m)}
                      className={[
                        'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        productModule === m
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Booleans note */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.booleansLabel}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {t.booleansNote1}<span className="font-medium text-slate-600">{t.booleansList1}</span>{t.booleansNote2}<span className="font-medium text-slate-600">{t.booleansList2}</span>{t.booleansNote3}<span className="font-medium text-slate-600">{t.booleansList3}</span>{t.booleansNote4}<span className="font-medium text-slate-600">{t.booleansList4}</span>{t.booleansNote5}
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ────────────────────────────────────────────── */}
      <section>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{t.title}</h1>
        <p className="text-[15px] text-slate-500 leading-relaxed mb-4 max-w-2xl">
          {t.description}
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-slate-200 bg-slate-50 text-xs text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            {t.pillStructural}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-emerald-200 bg-emerald-50 text-xs text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {t.pillStable}
          </span>
        </div>
      </section>

      {/* ── 3. ANATOMY ───────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.anatomyTitle}</h2>
        <p className="text-sm text-slate-500 mb-4">{t.anatomyLead}</p>
        <div className="grid md:grid-cols-2 gap-6 rounded-xl border border-slate-200 bg-white shadow-sm p-6">
          <div className="flex items-center justify-center p-6 rounded-lg border border-slate-100 bg-slate-50">
            <DataGroupLive type="Group 1" productModule="Default" brand={brand} />
          </div>
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-12">{t.colHash}</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">{t.colLabel}</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.colDescription}</th>
                </tr>
              </thead>
              <tbody>
                {t.anatomyRows.map((row, i, arr) => (
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

      {/* ── 4. VARIANTS ──────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-4">{t.variantsTitle}</h2>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">{t.colProperty}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.colValues}</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: t.propType,           chips: [{text: 'Group 2', note: ''}, {text: 'Group 1', note: t.noteDefault}, {text: 'Single', note: ''}, {text: 'Multiple', note: ''}] },
                { label: t.propProductModule, chips: [{text: 'Default', note: t.noteDefault}, {text: 'Flight', note: ''}] },
                { label: t.propBooleans,   chips: [
                  {text: 'Data Row 1', note: ''}, {text: 'Data Row 2', note: ''}, {text: 'Data Row 3', note: ''},
                  {text: 'Data Row 4', note: ''}, {text: 'Data Row 5', note: ''}, {text: 'Data Row 6', note: ''},
                  {text: 'Data Row (Last)', note: ''}, {text: 'Slot', note: ''}, {text: 'Icon Left', note: ''},
                ]},
                { label: t.propTextSlots,     chips: [{text: t.textSlotsNone, note: ''}] },
                { label: t.propFontFamily,    chips: [
                  {text: 'Poppins', note: 'Dragonpass'}, {text: 'Arial', note: 'Mastercard'}, {text: 'Inter', note: 'Investec'},
                  {text: 'Manrope', note: 'Visa · Greyscale'}, {text: 'Lato', note: 'Assurant'},
                ]},
              ].map((row, i, arr) => (
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

        {/* Visual preview grid — representative variants */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {t.variantGrid.map(({ label, t: tp, m }) => (
            <div key={label} style={{
              borderRadius: '12px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa',
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid #f3f4f6', backgroundColor: '#ffffff' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#374151' }}>{label}</p>
              </div>
              <div style={{ flex: 1, padding: '24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', ...DOTTED_BG }}>
                <DataGroupLive type={tp} productModule={m} brand={brand} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.tokensTitle}</h2>
        <p className="text-sm text-slate-500 mb-4">{t.tokensLead}</p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">{t.colToken}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.colCssVariable}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">{t.colValue}</th>
              </tr>
            </thead>
            <tbody>
              {t.tokenRows.map((row, i) => {
                const resolvedValue = (tokens[row.tokenKey as keyof typeof tokens] as string | undefined) ?? row.fallback;
                const swatchHex = resolvedValue.length > 7 ? resolvedValue.slice(0, 7) : resolvedValue;
                const light = isLightColor(swatchHex);
                return (
                  <tr key={row.cssVar} className={i < t.tokenRows.length - 1 ? 'border-b border-slate-100' : ''}>
                    <td className="px-5 py-3 font-medium text-slate-700 text-xs">{row.label}</td>
                    <td className="px-5 py-3">
                      <code className="font-mono text-xs text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                        {row.cssVar}
                      </code>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded flex-shrink-0 border border-black/10" style={{ backgroundColor: swatchHex }} />
                        <span className="font-mono text-xs px-1.5 py-0.5 rounded border"
                          style={{ backgroundColor: swatchHex, color: light ? '#1e293b' : '#f8fafc', borderColor: light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)' }}>
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

      {/* ── 7. USAGE ─────────────────────────────────────────────────────── */}
      <section>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{t.usageTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.usageLead}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>{t.whenToUseTitle}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              {t.whenToUseItems.map((item, i, arr) => (
                <li key={i} style={{ marginBottom: i < arr.length - 1 ? '6px' : 0 }}>• {item}</li>
              ))}
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>{t.whenNotToUseTitle}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              {t.whenNotToUseItems.map((item, i, arr) => (
                <li key={i} style={{ marginBottom: i < arr.length - 1 ? '6px' : 0 }}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
