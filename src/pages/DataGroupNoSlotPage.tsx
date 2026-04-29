import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DataGroupNoSlotLive,
  type DataGroupNoSlotType,
  type DataGroupNoSlotProductModule,
  type DataGroupNoSlotBorder,
} from '../components/data-row/DataGroupNoSlotLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';

interface DataGroupNoSlotPageProps {
  brand: Brand;
  lang?: Language;
}

// ─── Bilingual copy block ─────────────────────────────────────────────────
const COPY = {
  en: {
    typeLabel: 'Type',
    productModuleLabel: 'Product Module',
    borderLabel: 'Border',
    singleHint: 'Single rows are always flush — Border has no effect.',
    booleansLabel: 'Booleans',
    booleansNote1: 'Eight booleans toggle individual row visibility in Figma — ',
    booleansList1: 'Data Row 1–6',
    booleansNote2: ', ',
    booleansList2: 'Data Row (Last)',
    booleansNote3: ', and ',
    booleansList3: 'Icon Left',
    booleansNote4: '. The preview composes the full preset for each Type; use Figma to toggle individual rows.',
    title: 'Data Group (No Slot)',
    description:
      'The icon-less sibling of Data Group. Groups 1–6 Data Rows without a leading icon column, and adds a Border axis for borderless listings that sit inside other surfaces. Four Types (Single, Multiple, Group 1, Group 2), two Product Modules (Default, Flight), and two Border states (On, Off).',
    pillStructural: 'Structural',
    pillStable: 'Stable',
    anatomyTitle: 'Anatomy',
    anatomyLead: 'The parts that make up a Data Group (No Slot) in Figma.',
    colHash: '#',
    colLabel: 'Label',
    colDescription: 'Description',
    anatomyRows: [
      { n: 1, label: 'Container',    body: '8px rounded rectangle with 1px border using border-default on bg-primary-inverse. Appears only when Border=On. When Border=Off, rows render flush against the parent surface.' },
      { n: 2, label: 'Data Row(s)',  body: 'Each row is an instance of Data Row with its leading icon suppressed. Position is automatically First and Middle on non-terminal rows, Last on the final row.' },
      { n: 3, label: 'Row divider',  body: '1px hairline using border-divider rendered between adjacent rows. Hidden on the last row. Present in both Border=On and Border=Off states.' },
      { n: 4, label: 'Row content',  body: 'Label + value pair, optional trailing Chevron / Badge / Button. The "No Slot" rule never shows a leading icon — not even in Flight module.' },
    ],
    variantsTitle: 'Variants',
    colProperty: 'Property',
    colValues: 'Values',
    propType: 'Type',
    propProductModule: 'Product Module',
    propBorder: 'Border',
    propBooleans: 'Booleans (8)',
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
    a11yLead: 'Guidelines for implementing Data Group (No Slot) inclusively.',
    a11yRows: [
      { icon: '📋', title: 'List semantics',     body: 'A Data Group (No Slot) is still a list of related rows — render as <ul>/<li> or <dl>/<dt>/<dd> so assistive tech announces the count and reading order.' },
      { icon: '🚫', title: 'No leading icon',    body: 'The "No Slot" variant permanently hides the leading icon on every row. If you need an icon column, switch to the regular Data Group.' },
      { icon: '🧠', title: 'Border=Off context', body: 'With Border=Off the group has no visible container — only use inside another bordered surface (Card, Dialog, Modal) so the grouping is still obvious. Never use Border=Off at the page root.' },
      { icon: '🎨', title: 'Contrast',           body: 'Row divider, label, and value tokens meet WCAG AA contrast on both bg-primary-inverse (Border=On) and common parent surfaces (bg-secondary, Card surface) used with Border=Off.' },
      { icon: '⌨️', title: 'Keyboard order',     body: 'If rows contain interactive trailing controls (Chevron, Button) tab order follows DOM order — top row first, bottom row last.' },
      { icon: '📏', title: 'Last-row divider',   body: 'The Data Row (Last) boolean controls which row is terminal, and the component hides the divider there. Don\'t rely on a missing divider to imply hierarchy — always reinforce with spacing.' },
    ],
    usageTitle: 'Usage',
    usageLead:
      'When and how to use Data Group (No Slot). Reach for this variant when leading icons would add noise, or when the group lives inside another bordered surface.',
    whenToUseTitle: '✓ When to use',
    whenNotToUseTitle: '✗ When not to use',
    whenToUseItems: [
      'Dense receipt / summary blocks where icons would clutter',
      'Inside a Card or Dialog (use Border=Off)',
      'Flight itineraries when the outer surface already signals context',
      'Standalone on a page (use Border=On)',
      'Set Type=Single for a one-row, flush list item',
    ],
    whenNotToUseItems: [
      'The design needs leading icons — use Data Group instead',
      'Border=Off at the page root (rows lose visual grouping)',
      'Selectable or actionable lists — use List Item',
      'More than 6 rows — split into multiple groups',
      'Mixing Transport rows with non-Transport rows in the same group',
    ],
    variantGrid: [
      { label: 'Group 1 · Default · On',  t: 'Group 1'  as DataGroupNoSlotType, m: 'Default' as DataGroupNoSlotProductModule, b: 'On'  as DataGroupNoSlotBorder },
      { label: 'Group 1 · Default · Off', t: 'Group 1'  as DataGroupNoSlotType, m: 'Default' as DataGroupNoSlotProductModule, b: 'Off' as DataGroupNoSlotBorder },
      { label: 'Group 2 · Default · On',  t: 'Group 2'  as DataGroupNoSlotType, m: 'Default' as DataGroupNoSlotProductModule, b: 'On'  as DataGroupNoSlotBorder },
      { label: 'Group 2 · Default · Off', t: 'Group 2'  as DataGroupNoSlotType, m: 'Default' as DataGroupNoSlotProductModule, b: 'Off' as DataGroupNoSlotBorder },
      { label: 'Multiple · Flight · On',  t: 'Multiple' as DataGroupNoSlotType, m: 'Flight'  as DataGroupNoSlotProductModule, b: 'On'  as DataGroupNoSlotBorder },
      { label: 'Single · Flight',         t: 'Single'   as DataGroupNoSlotType, m: 'Flight'  as DataGroupNoSlotProductModule, b: 'On'  as DataGroupNoSlotBorder },
    ],
  },
  zh: {
    typeLabel: '类型',
    productModuleLabel: '产品模块',
    borderLabel: '边框',
    singleHint: '单行始终是齐平的——边框没有效果。',
    booleansLabel: '布尔属性',
    booleansNote1: 'Figma 中有八个布尔值用于切换各行的可见性——',
    booleansList1: 'Data Row 1–6',
    booleansNote2: '、',
    booleansList2: 'Data Row (Last)',
    booleansNote3: '，以及 ',
    booleansList3: 'Icon Left',
    booleansNote4: '。预览会为每种类型组合完整的预设；使用 Figma 切换单个行。',
    title: '数据组（无插槽）',
    description:
      '数据组的无图标版本。将 1–6 个数据行组合在一起，没有前导图标列，并新增一个 Border 维度，用于位于其他表面内的无边框列表。四种类型（Single、Multiple、Group 1、Group 2），两种产品模块（Default、Flight），两种边框状态（On、Off）。',
    pillStructural: '结构性',
    pillStable: '稳定版',
    anatomyTitle: '结构剖析',
    anatomyLead: '组成 Figma 中数据组（无插槽）的各个部分。',
    colHash: '#',
    colLabel: '标签',
    colDescription: '描述',
    anatomyRows: [
      { n: 1, label: '容器',     body: '8px 圆角矩形，1px 边框使用 border-default，背景为 bg-primary-inverse。仅在 Border=On 时出现。当 Border=Off 时，行会齐平地贴在父级表面上。' },
      { n: 2, label: '数据行',   body: '每行都是数据行的一个实例，其前导图标被抑制。在非端点行上位置自动设置为 First 和 Middle，最后一行设置为 Last。' },
      { n: 3, label: '行分隔线', body: '相邻行之间渲染 1px 细线，使用 border-divider。最后一行隐藏。Border=On 和 Border=Off 状态下都存在。' },
      { n: 4, label: '行内容',   body: '标签 + 值对，可选的尾部 Chevron / 徽章 / 按钮。"无插槽"规则从不显示前导图标——即使在 Flight 模块中也不显示。' },
    ],
    variantsTitle: '变体',
    colProperty: '属性',
    colValues: '值',
    propType: '类型',
    propProductModule: '产品模块',
    propBorder: '边框',
    propBooleans: '布尔属性 (8)',
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
    a11yLead: '以包容性方式实现数据组（无插槽）的指南。',
    a11yRows: [
      { icon: '📋', title: '列表语义',         body: '数据组（无插槽）仍然是相关行的列表——渲染为 <ul>/<li> 或 <dl>/<dt>/<dd>，以便辅助技术朗读数量与阅读顺序。' },
      { icon: '🚫', title: '无前导图标',       body: '"无插槽"变体永久隐藏每一行的前导图标。如果需要图标列，请切换到常规数据组。' },
      { icon: '🧠', title: 'Border=Off 上下文', body: '当 Border=Off 时，组没有可见容器——只在另一个带边框的表面（卡片、对话框、模态框）内使用，以便分组仍然明显。切勿在页面根级使用 Border=Off。' },
      { icon: '🎨', title: '对比度',           body: '行分隔线、标签和值令牌在 bg-primary-inverse（Border=On）以及与 Border=Off 配合使用的常见父级表面（bg-secondary、卡片表面）上均满足 WCAG AA 对比度。' },
      { icon: '⌨️', title: '键盘顺序',         body: '如果行包含交互式尾部控件（Chevron、按钮），Tab 顺序遵循 DOM 顺序——顶部行优先，底部行最后。' },
      { icon: '📏', title: '末行分隔线',       body: 'Data Row (Last) 布尔值控制哪一行是末行，组件在那里隐藏分隔线。不要依靠缺失分隔线来暗示层级——务必通过间距加以强化。' },
    ],
    usageTitle: '用法',
    usageLead:
      '何时以及如何使用数据组（无插槽）。当前导图标会增加噪声，或当组位于另一个带边框的表面内时使用此变体。',
    whenToUseTitle: '✓ 何时使用',
    whenNotToUseTitle: '✗ 何时不使用',
    whenToUseItems: [
      '密集的收据 / 摘要块，图标会造成杂乱',
      '在卡片或对话框内（使用 Border=Off）',
      '当外部表面已经传达上下文时的航班行程',
      '在页面上独立使用（使用 Border=On）',
      '将 Type 设置为 Single 用于单行齐平列表项',
    ],
    whenNotToUseItems: [
      '设计需要前导图标——改用数据组',
      '页面根级使用 Border=Off（行会失去视觉分组）',
      '可选或可操作列表——使用 List Item',
      '超过 6 行——拆分为多个分组',
      '在同一组中混用交通行与非交通行',
    ],
    variantGrid: [
      { label: 'Group 1 · Default · On',  t: 'Group 1'  as DataGroupNoSlotType, m: 'Default' as DataGroupNoSlotProductModule, b: 'On'  as DataGroupNoSlotBorder },
      { label: 'Group 1 · Default · Off', t: 'Group 1'  as DataGroupNoSlotType, m: 'Default' as DataGroupNoSlotProductModule, b: 'Off' as DataGroupNoSlotBorder },
      { label: 'Group 2 · Default · On',  t: 'Group 2'  as DataGroupNoSlotType, m: 'Default' as DataGroupNoSlotProductModule, b: 'On'  as DataGroupNoSlotBorder },
      { label: 'Group 2 · Default · Off', t: 'Group 2'  as DataGroupNoSlotType, m: 'Default' as DataGroupNoSlotProductModule, b: 'Off' as DataGroupNoSlotBorder },
      { label: 'Multiple · Flight · On',  t: 'Multiple' as DataGroupNoSlotType, m: 'Flight'  as DataGroupNoSlotProductModule, b: 'On'  as DataGroupNoSlotBorder },
      { label: 'Single · Flight',         t: 'Single'   as DataGroupNoSlotType, m: 'Flight'  as DataGroupNoSlotProductModule, b: 'On'  as DataGroupNoSlotBorder },
    ],
  },
} as const;

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// Figma order on the component set:
const ALL_TYPES:    DataGroupNoSlotType[]          = ['Group 1', 'Single', 'Group 2', 'Multiple'];
const ALL_MODULES:  DataGroupNoSlotProductModule[] = ['Default', 'Flight'];
const ALL_BORDERS:  DataGroupNoSlotBorder[]        = ['On', 'Off'];

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

export function DataGroupNoSlotPage({ brand, lang = 'en' }: DataGroupNoSlotPageProps) {
  const t = COPY[lang];
  const [type,          setType]          = useState<DataGroupNoSlotType>('Group 1');
  const [productModule, setProductModule] = useState<DataGroupNoSlotProductModule>('Default');
  const [border,        setBorder]        = useState<DataGroupNoSlotBorder>('On');

  // Figma locks: Single ignores Border (always flush).
  const effectiveBorder: DataGroupNoSlotBorder = type === 'Single' ? 'On' : border;

  const previewKey = [type, productModule, effectiveBorder].join('-');
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
                  <DataGroupNoSlotLive type={type} productModule={productModule} border={effectiveBorder} brand={brand} />
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

              {/* Border */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.borderLabel}</p>
                <div className={['flex flex-wrap gap-1.5', type === 'Single' ? 'opacity-50' : ''].join(' ')}>
                  {ALL_BORDERS.map((b) => (
                    <button
                      key={b}
                      onClick={() => type !== 'Single' && setBorder(b)}
                      disabled={type === 'Single'}
                      className={[
                        'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        effectiveBorder === b
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {b}
                    </button>
                  ))}
                </div>
                {type === 'Single' && (
                  <p className="text-[11px] text-slate-400 mt-1">{t.singleHint}</p>
                )}
              </div>

              {/* Booleans note */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.booleansLabel}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {t.booleansNote1}<span className="font-medium text-slate-600">{t.booleansList1}</span>{t.booleansNote2}<span className="font-medium text-slate-600">{t.booleansList2}</span>{t.booleansNote3}<span className="font-medium text-slate-600">{t.booleansList3}</span>{t.booleansNote4}
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
            <DataGroupNoSlotLive type="Group 1" productModule="Default" border="On" brand={brand} />
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
                { label: t.propType,           chips: [{text: 'Group 1', note: t.noteDefault}, {text: 'Single', note: ''}, {text: 'Group 2', note: ''}, {text: 'Multiple', note: ''}] },
                { label: t.propProductModule, chips: [{text: 'Default', note: t.noteDefault}, {text: 'Flight', note: ''}] },
                { label: t.propBorder,         chips: [{text: 'On', note: t.noteDefault}, {text: 'Off', note: ''}] },
                { label: t.propBooleans,   chips: [
                  {text: 'Data Row 1', note: ''}, {text: 'Data Row 2', note: ''}, {text: 'Data Row 3', note: ''},
                  {text: 'Data Row 4', note: ''}, {text: 'Data Row 5', note: ''}, {text: 'Data Row 6', note: ''},
                  {text: 'Data Row (Last)', note: ''}, {text: 'Icon Left', note: ''},
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

        {/* Visual preview grid — representative variants (6 Figma concrete variants) */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {t.variantGrid.map(({ label, t: tp, m, b }) => (
            <div key={label} style={{
              borderRadius: '12px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa',
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid #f3f4f6', backgroundColor: '#ffffff' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#374151' }}>{label}</p>
              </div>
              <div style={{ flex: 1, padding: '24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', ...DOTTED_BG }}>
                <DataGroupNoSlotLive type={tp} productModule={m} border={b} brand={brand} />
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
