import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DataRowLive,
  type DataRowType,
  type DataRowPosition,
  type DataRowProductModule,
} from '../components/data-row/DataRowLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';

interface DataRowPageProps {
  brand: Brand;
  lang?: Language;
}

// ─── Bilingual copy block ─────────────────────────────────────────────────
const COPY = {
  en: {
    typeLabel: 'Type',
    transportHint: 'Transport rows are always Multi-line.',
    positionLabel: 'Position',
    productModuleLabel: 'Product Module',
    booleansLabel: 'Booleans',
    booleanIcon: 'Icon',
    booleanChevronRight: 'Chevron Right',
    booleanBadge: 'Badge',
    booleanButton: 'Button',
    title: 'Data Row',
    description:
      'A label / value row for summaries, receipts, and confirmation screens. Supports three layout types (Single-line, Multi-line, Multi-line + Icon), a Position axis to control the row divider, and a dedicated Transport module with an origin → destination flight lockup.',
    pillStructural: 'Structural',
    pillStable: 'Stable',
    anatomyTitle: 'Anatomy',
    anatomyLead: 'The parts that make up a Data Row in Figma.',
    colHash: '#',
    colLabel: 'Label',
    colDescription: 'Description',
    anatomyRows: [
      { n: 1, label: 'Leading icon',  body: '36×36 rounded square shown only for Multi-line + Icon. Background uses bg-muted; glyph uses fg-secondary.' },
      { n: 2, label: 'Label',         body: 'Descriptor for the paired value. 12–13px, weight 500, colour fg-secondary. Wraps onto its own line for Multi-line types.' },
      { n: 3, label: 'Value',         body: 'The primary datum (or origin → destination for Transport). 13px, weight 600, colour fg-brand-primary.' },
      { n: 4, label: 'Trailing slot', body: 'Optional stack of Badge / Chevron Right / Button. Shrinks around the value.' },
      { n: 5, label: 'Row divider',   body: '1px hairline using border-divider. Hidden when Position = Last so groups end cleanly.' },
    ],
    variantsTitle: 'Variants',
    colProperty: 'Property',
    colValues: 'Values',
    propType: 'Type',
    propPosition: 'Position',
    propProductModule: 'Product Module',
    propBooleans: 'Booleans (10)',
    propTextSlots: 'Text slots (4)',
    propFontFamily: 'Font family',
    noteDefault: 'Default',
    tokensTitle: 'Design Tokens',
    tokensLead: 'All colour decisions are token-backed. Values update with the brand selector.',
    colToken: 'Token',
    colCssVariable: 'CSS Variable',
    colValue: 'Value',
    tokenRows: [
      { label: 'Label',          cssVar: '--atom-foreground-core-fg-secondary',      tokenKey: 'atom.foreground.core.fg-secondary',      fallback: '#737272' },
      { label: 'Value',          cssVar: '--atom-foreground-primary-fg-brand-primary', tokenKey: 'atom.foreground.primary.fg-brand-primary', fallback: '#0a2333' },
      { label: 'Body / caption', cssVar: '--atom-foreground-core-fg-primary',        tokenKey: 'atom.foreground.core.fg-primary',        fallback: '#4b4a4a' },
      { label: 'Icon / divider', cssVar: '--atom-foreground-core-fg-tertiary',       tokenKey: 'atom.foreground.core.fg-tertiary',       fallback: '#afaead' },
      { label: 'Row divider',    cssVar: '--atom-border-default-border-divider',     tokenKey: 'atom.border.default.border-divider',     fallback: '#cdcbcb' },
    ],
    a11yTitle: 'Accessibility',
    a11yLead: 'Guidelines for implementing Data Row inclusively.',
    a11yRows: [
      { icon: '📋', title: 'Label / value pairing',       body: 'Associate the label with its value using aria-describedby, or render them in a definition list (<dl><dt><dd>) so assistive tech reads the relationship aloud.' },
      { icon: '🎨', title: 'Contrast',                    body: 'Label (fg-secondary), Value (fg-brand-primary), and divider (border-divider) tokens all meet WCAG AA contrast on the surface background across every brand.' },
      { icon: '🔤', title: "Don't rely on colour alone",  body: 'Badges, icons, and typography must reinforce state — never communicate meaning through colour only. Pair every coloured badge with a visible text label.' },
      { icon: '⌨️', title: 'Keyboard affordances',        body: 'When the row ends with a Chevron Right or Button, the interactive element is the trailing control — not the whole row. It must be focusable and activate on Enter or Space.' },
      { icon: '🛬', title: 'Transport module',            body: 'Flight lockups use tabular numerals for times / codes so screen magnifiers don\'t reflow glyphs. Origin and destination are two separate spans, announced in reading order.' },
      { icon: '📏', title: 'Row divider',                 body: 'Set Position=Last on the final row of a grouping so the divider disappears. Never rely on a missing divider to imply hierarchy — always pair with visual spacing.' },
    ],
    usageTitle: 'Usage',
    usageLead:
      'When and how to use Data Row. For grouped layouts, see Data Group and Data Group (No Slot).',
    whenToUseTitle: '✓ When to use',
    whenNotToUseTitle: '✗ When not to use',
    whenToUseItems: [
      'Receipts, confirmations, and summary screens',
      'Bookings with origin → destination (Transport module)',
      'Profile / membership detail pages',
      'Any label / value list where read-scanning matters',
      'Set Position=Last on the final row so the divider disappears',
    ],
    whenNotToUseItems: [
      'Dense tabular data with many columns — use a Table',
      'Selectable list items — use List Item or Checkbox',
      'Marketing hero blocks with free-form layout',
      'Forms — labels belong above inputs, not adjacent to them',
      'Don\u2019t mix Transport and non-Transport rows in the same group',
    ],
    variantGrid: [
      { label: 'Single-line · First/Mid',        t: 'Single-line'       as DataRowType, p: 'First and Middle' as DataRowPosition, m: 'All'       as DataRowProductModule },
      { label: 'Single-line · Last',             t: 'Single-line'       as DataRowType, p: 'Last'              as DataRowPosition, m: 'All'       as DataRowProductModule },
      { label: 'Multi-line · First/Mid',         t: 'Multi-line'        as DataRowType, p: 'First and Middle' as DataRowPosition, m: 'All'       as DataRowProductModule },
      { label: 'Multi-line + Icon · First/Mid',  t: 'Multi-line + Icon' as DataRowType, p: 'First and Middle' as DataRowPosition, m: 'All'       as DataRowProductModule },
      { label: 'Transport · First/Mid',          t: 'Multi-line'        as DataRowType, p: 'First and Middle' as DataRowPosition, m: 'Transport' as DataRowProductModule },
      { label: 'Transport · Last',               t: 'Multi-line'        as DataRowType, p: 'Last'              as DataRowPosition, m: 'Transport' as DataRowProductModule },
    ],
  },
  zh: {
    typeLabel: '类型',
    transportHint: '交通行始终是 Multi-line。',
    positionLabel: '位置',
    productModuleLabel: '产品模块',
    booleansLabel: '布尔属性',
    booleanIcon: '图标',
    booleanChevronRight: '右向箭头',
    booleanBadge: '徽章',
    booleanButton: '按钮',
    title: '数据行',
    description:
      '用于摘要、收据和确认界面的标签 / 值行。支持三种布局类型（Single-line、Multi-line、Multi-line + Icon）、用于控制行分隔线的位置维度，以及具有出发地 → 目的地航班锁定布局的专用 Transport 模块。',
    pillStructural: '结构性',
    pillStable: '稳定版',
    anatomyTitle: '结构剖析',
    anatomyLead: '组成 Figma 中数据行的各个部分。',
    colHash: '#',
    colLabel: '标签',
    colDescription: '描述',
    anatomyRows: [
      { n: 1, label: '前导图标',   body: '仅在 Multi-line + Icon 中显示的 36×36 圆角方形。背景使用 bg-muted；字符使用 fg-secondary。' },
      { n: 2, label: '标签',       body: '配对值的描述符。12–13px、字重 500、颜色 fg-secondary。在 Multi-line 类型中换到自己的行。' },
      { n: 3, label: '值',         body: '主要数据（Transport 模式下为出发地 → 目的地）。13px、字重 600、颜色 fg-brand-primary。' },
      { n: 4, label: '尾部插槽',   body: '可选的徽章 / 右向箭头 / 按钮堆叠。围绕值收缩。' },
      { n: 5, label: '行分隔线',   body: '使用 border-divider 的 1px 细线。Position = Last 时隐藏，使分组干净结束。' },
    ],
    variantsTitle: '变体',
    colProperty: '属性',
    colValues: '值',
    propType: '类型',
    propPosition: '位置',
    propProductModule: '产品模块',
    propBooleans: '布尔属性 (10)',
    propTextSlots: '文本插槽 (4)',
    propFontFamily: '字体',
    noteDefault: '默认',
    tokensTitle: '设计令牌',
    tokensLead: '所有颜色决策均由设计令牌支持。值会随品牌选择器更新。',
    colToken: '令牌',
    colCssVariable: 'CSS 变量',
    colValue: '值',
    tokenRows: [
      { label: '标签',         cssVar: '--atom-foreground-core-fg-secondary',      tokenKey: 'atom.foreground.core.fg-secondary',      fallback: '#737272' },
      { label: '值',           cssVar: '--atom-foreground-primary-fg-brand-primary', tokenKey: 'atom.foreground.primary.fg-brand-primary', fallback: '#0a2333' },
      { label: '正文 / 说明',  cssVar: '--atom-foreground-core-fg-primary',        tokenKey: 'atom.foreground.core.fg-primary',        fallback: '#4b4a4a' },
      { label: '图标 / 分隔',  cssVar: '--atom-foreground-core-fg-tertiary',       tokenKey: 'atom.foreground.core.fg-tertiary',       fallback: '#afaead' },
      { label: '行分隔线',     cssVar: '--atom-border-default-border-divider',     tokenKey: 'atom.border.default.border-divider',     fallback: '#cdcbcb' },
    ],
    a11yTitle: '可访问性',
    a11yLead: '以包容性方式实现数据行的指南。',
    a11yRows: [
      { icon: '📋', title: '标签 / 值配对',         body: '使用 aria-describedby 将标签与其值关联，或在定义列表（<dl><dt><dd>）中渲染，以便辅助技术朗读其关系。' },
      { icon: '🎨', title: '对比度',               body: '标签（fg-secondary）、值（fg-brand-primary）和分隔线（border-divider）令牌在每个品牌的表面背景上均满足 WCAG AA 对比度。' },
      { icon: '🔤', title: '不要仅依赖颜色',       body: '徽章、图标和排版必须强化状态——切勿仅通过颜色传达含义。每个有色徽章都要配上可见的文本标签。' },
      { icon: '⌨️', title: '键盘提示',             body: '当行以右向箭头或按钮结尾时，交互元素是尾部控件——而不是整行。它必须可聚焦，并在 Enter 或空格键上激活。' },
      { icon: '🛬', title: '交通模块',             body: '航班锁定布局使用等宽数字呈现时间 / 代码，以免屏幕放大镜重排字符。出发地和目的地是两个独立的 span，按阅读顺序朗读。' },
      { icon: '📏', title: '行分隔线',             body: '在分组的最后一行设置 Position=Last，使分隔线消失。切勿依赖缺失分隔线来暗示层级——务必通过视觉间距加以配合。' },
    ],
    usageTitle: '用法',
    usageLead: '何时以及如何使用数据行。对于分组布局，请参见数据组和数据组（无插槽）。',
    whenToUseTitle: '✓ 何时使用',
    whenNotToUseTitle: '✗ 何时不使用',
    whenToUseItems: [
      '收据、确认和摘要界面',
      '带出发地 → 目的地的预订（Transport 模块）',
      '个人资料 / 会员详情页',
      '任何阅读扫描很重要的标签 / 值列表',
      '在最后一行设置 Position=Last 使分隔线消失',
    ],
    whenNotToUseItems: [
      '具有许多列的密集表格数据——使用表格',
      '可选择的列表项——使用列表项或复选框',
      '具有自由布局的营销英雄块',
      '表单——标签应位于输入上方，而非相邻',
      '不要在同一组中混用交通行与非交通行',
    ],
    variantGrid: [
      { label: 'Single-line · First/Mid',        t: 'Single-line'       as DataRowType, p: 'First and Middle' as DataRowPosition, m: 'All'       as DataRowProductModule },
      { label: 'Single-line · Last',             t: 'Single-line'       as DataRowType, p: 'Last'              as DataRowPosition, m: 'All'       as DataRowProductModule },
      { label: 'Multi-line · First/Mid',         t: 'Multi-line'        as DataRowType, p: 'First and Middle' as DataRowPosition, m: 'All'       as DataRowProductModule },
      { label: 'Multi-line + Icon · First/Mid',  t: 'Multi-line + Icon' as DataRowType, p: 'First and Middle' as DataRowPosition, m: 'All'       as DataRowProductModule },
      { label: 'Transport · First/Mid',          t: 'Multi-line'        as DataRowType, p: 'First and Middle' as DataRowPosition, m: 'Transport' as DataRowProductModule },
      { label: 'Transport · Last',               t: 'Multi-line'        as DataRowType, p: 'Last'              as DataRowPosition, m: 'Transport' as DataRowProductModule },
    ],
  },
} as const;

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const ALL_TYPES:     DataRowType[]          = ['Single-line', 'Multi-line', 'Multi-line + Icon'];
const ALL_POSITIONS: DataRowPosition[]      = ['First and Middle', 'Last'];
const ALL_MODULES:   DataRowProductModule[] = ['All', 'Transport'];

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

export function DataRowPage({ brand, lang = 'en' }: DataRowPageProps) {
  const t = COPY[lang];
  const [type,          setType]          = useState<DataRowType>('Single-line');
  const [position,      setPosition]      = useState<DataRowPosition>('First and Middle');
  const [productModule, setProductModule] = useState<DataRowProductModule>('All');
  const [showChevron,   setShowChevron]   = useState(false);
  const [showBadge,     setShowBadge]     = useState(false);
  const [showButton,    setShowButton]    = useState(false);
  const [showIcon,      setShowIcon]      = useState(false);

  // Transport locks Type to Multi-line (no Single-line Transport in Figma).
  const effectiveType: DataRowType = productModule === 'Transport' ? 'Multi-line' : type;

  const previewKey = [effectiveType, position, productModule, showChevron, showBadge, showButton, showIcon].join('-');
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-72">
            <div className="flex-1 flex items-center justify-center p-12 min-h-52" style={DOTTED_BG}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                  style={{ width: '100%', maxWidth: '360px' }}
                >
                  <DataRowLive
                    type={effectiveType}
                    position={position}
                    productModule={productModule}
                    showChevronRight={showChevron}
                    showBadge={showBadge}
                    showButton={showButton}
                    showIcon={showIcon}
                    brand={brand}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5 overflow-y-auto">

              {/* Type */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.typeLabel}</p>
                <div className={['flex flex-wrap gap-1.5', productModule === 'Transport' ? 'opacity-50' : ''].join(' ')}>
                  {ALL_TYPES.map((tp) => (
                    <button
                      key={tp}
                      onClick={() => productModule !== 'Transport' && setType(tp)}
                      disabled={productModule === 'Transport'}
                      className={[
                        'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        effectiveType === tp
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {tp}
                    </button>
                  ))}
                </div>
                {productModule === 'Transport' && (
                  <p className="text-[11px] text-slate-400 mt-1">{t.transportHint}</p>
                )}
              </div>

              {/* Position */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.positionLabel}</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_POSITIONS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPosition(p)}
                      className={[
                        'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        position === p
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {p}
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

              {/* Booleans */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.booleansLabel}</p>
                <div className="flex flex-col gap-1.5">
                  {[
                    { label: t.booleanIcon,         value: showIcon,    set: setShowIcon },
                    { label: t.booleanChevronRight, value: showChevron, set: setShowChevron },
                    { label: t.booleanBadge,        value: showBadge,   set: setShowBadge },
                    { label: t.booleanButton,       value: showButton,  set: setShowButton },
                  ].map(({ label, value, set }) => (
                    <label key={label} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => set(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 accent-slate-900"
                      />
                      <span className="text-xs text-slate-600">{label}</span>
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
            <div style={{ width: '320px' }}>
              <DataRowLive type="Multi-line + Icon" position="First and Middle" showChevronRight showBadge showIcon brand={brand} />
            </div>
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
                { label: t.propType,            chips: [{text: 'Single-line', note: t.noteDefault}, {text: 'Multi-line', note: ''}, {text: 'Multi-line + Icon', note: ''}] },
                { label: t.propPosition,        chips: [{text: 'First and Middle', note: t.noteDefault}, {text: 'Last', note: ''}] },
                { label: t.propProductModule,   chips: [{text: 'All', note: t.noteDefault}, {text: 'Transport', note: ''}] },
                { label: t.propBooleans,   chips: [
                  {text: 'Chevron Right', note: ''}, {text: 'Badge', note: ''}, {text: 'Icon', note: ''},
                  {text: 'Content Right', note: ''}, {text: 'Country Flags', note: ''}, {text: 'Icon Right', note: ''},
                  {text: 'Data 1', note: ''}, {text: 'Data 2', note: ''}, {text: 'Data 3', note: ''}, {text: 'Button', note: ''},
                ]},
                { label: t.propTextSlots,  chips: [{text: 'Label', note: ''}, {text: 'Data 1 Text', note: ''}, {text: 'Data 2 Text', note: ''}, {text: 'Data 3 Text', note: ''}] },
                { label: t.propFontFamily,     chips: [
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
          {t.variantGrid.map(({ label, t: tp, p, m }) => (
            <div key={label} style={{
              borderRadius: '12px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa',
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid #f3f4f6', backgroundColor: '#ffffff' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#374151' }}>{label}</p>
              </div>
              <div style={{ flex: 1, padding: '24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', ...DOTTED_BG }}>
                <div style={{ width: '320px' }}>
                  <DataRowLive type={tp} position={p} productModule={m} brand={brand} />
                </div>
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
