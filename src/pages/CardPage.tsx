import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardLive, type CardImagePosition, type CardTextLine } from '../components/card/CardLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';

interface CardPageProps {
  brand: Brand;
  lang?: Language;
}

// ─── Bilingual copy block ─────────────────────────────────────────────────
const COPY = {
  en: {
    imagePositionLabel: 'Image Position',
    textLineLabel: 'Text Line',
    actionButtonLabel: 'Action Button',
    showActionButton: 'Show action button',
    booleansLabel: 'Booleans',
    booleansNote1: 'Figma exposes a large surface of optional slots — ',
    booleansList: 'Title, Badge 1, Badge 2, Icon, Flag, Checkbox, Button, Amenities, Availability Details, Location, Opening Time, Lounge Type, Bullet, Description, Image, Pin, Number',
    booleansNote2: '. Use the Figma component to toggle them individually.',
    title: 'Card',
    description:
      'A flexible container that groups related content — media, title, description, and actions — into a single, scannable unit. Eight image-placement patterns cover everything from full-bleed hero cards to lean icon-plus-text tiles. Four text-line densities adapt from minimal (None) to rich copy (Description).',
    pillContainer: 'Container',
    pillStable: 'Stable',
    anatomyTitle: 'Anatomy',
    anatomyLead: 'The parts that make up a Card in Figma.',
    colHash: '#',
    colLabel: 'Label',
    colDescription: 'Description',
    anatomyRows: [
      { n: 1, label: 'Container', body: '<article> or <section> wrapper with 8px corner radius, 1px border (border-divider) and an inverse surface fill.' },
      { n: 2, label: 'Media',     body: 'Optional image slot. Full-width when Image Position=Top, 120px column when Left/Right, full-bleed when Full, suppressed on "None" values.' },
      { n: 3, label: 'Title',     body: 'Required heading element — 15px / weight 600, color fg-brand-primary. Truncates on small widths.' },
      { n: 4, label: 'Body',      body: 'Optional description, 13–14px / weight 400, colour fg-primary. Rendered for Double and Description text lines.' },
      { n: 5, label: 'Action',    body: 'Optional link or button row — 13px / weight 600 text link with trailing arrow. Controlled by the Button boolean.' },
    ],
    variantsTitle: 'Variants',
    colProperty: 'Property',
    colValues: 'Values',
    propImagePosition: 'Image Position',
    propTextLine: 'Text Line',
    propBooleans: 'Booleans',
    propTextSlots: 'Text slots',
    propFontFamily: 'Font family',
    noteDefault: 'Default',
    tokensTitle: 'Design Tokens',
    tokensLead: 'All colour decisions are token-backed. Values update with the brand selector.',
    colToken: 'Token',
    colCssVariable: 'CSS Variable',
    colValue: 'Value',
    tokenRows: [
      { label: 'Surface',     cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff' },
      { label: 'Border',      cssVar: '--atom-border-default-border-divider',         tokenKey: 'atom.border.default.border-divider',         fallback: '#cdcbcb' },
      { label: 'Title',       cssVar: '--atom-foreground-primary-fg-brand-primary',   tokenKey: 'atom.foreground.primary.fg-brand-primary',   fallback: '#0a2333' },
      { label: 'Body',        cssVar: '--atom-foreground-core-fg-primary',            tokenKey: 'atom.foreground.core.fg-primary',            fallback: '#4b4a4a' },
      { label: 'Media fill',  cssVar: '--atom-background-core-bg-muted',              tokenKey: 'atom.background.core.bg-muted',              fallback: '#0a23330a' },
      { label: 'Media label', cssVar: '--atom-foreground-core-fg-tertiary',           tokenKey: 'atom.foreground.core.fg-tertiary',           fallback: '#afaead' },
    ],
    a11yTitle: 'Accessibility',
    a11yLead: 'Guidelines for implementing Card inclusively.',
    a11yRows: [
      { icon: '🧭', title: 'Landmark & heading',              body: 'Wrap cards in a meaningful landmark (<section> or <article>) and use a real heading element for the title so screen-reader users can jump between cards via rotor navigation.' },
      { icon: '🖼️', title: 'Images as decoration vs. content', body: 'Decorative media uses aria-hidden="true" and no alt text. Meaningful imagery requires a concise alt describing what the image communicates — never "image of…".' },
      { icon: '⌨️', title: 'Interactive targets',              body: 'Only one interactive element per card should carry the "card click" affordance. Avoid nesting links inside a link-wrapped card; separate actions into explicit buttons or links.' },
      { icon: '🎯', title: 'Touch target size',                body: 'Action buttons inside a card meet the 44×44 minimum touch target on mobile. Card-wide tap targets also honour the same minimum through padding.' },
      { icon: '🎨', title: 'Contrast',                         body: 'Title, body, and media caption all pass WCAG AA 4.5:1 against the surface across every brand. The Full variant uses a text-shadow to preserve contrast over photography.' },
    ],
    usageTitle: 'Usage',
    usageLead: 'When and how to use Card. For transport-specific selection with a radio affordance and pricing, use Transport Card.',
    whenToUseTitle: '✓ When to use',
    whenNotToUseTitle: '✗ When not to use',
    whenToUseItems: [
      'Grouping media + text + action for a single idea (article, product, place)',
      'Scannable list of equal-priority items (feed, catalog)',
      'Featured / call-out block inside a denser surface (dashboard)',
      'Navigating into a deeper view — each card is a clickable entry',
      'Lounge / airport cards (use Amenities + Availability Details booleans)',
    ],
    whenNotToUseItems: [
      'Dense data rows — use Data Row or a table instead',
      'A single hero promotion — use a richer banner, not a bare card',
      'Critical alerts — use Alert, not a muted card container',
      'Micro-actions with no supporting text — use Button or Tag',
      'Transport selection — use Transport Card',
    ],
    variantGrid: [
      { position: 'Top' as CardImagePosition,               textLine: 'Single' as CardTextLine,      label: 'Top · Single' },
      { position: 'Top' as CardImagePosition,               textLine: 'Double' as CardTextLine,      label: 'Top · Double' },
      { position: 'Top' as CardImagePosition,               textLine: 'Description' as CardTextLine, label: 'Top · Description' },
      { position: 'Left' as CardImagePosition,              textLine: 'Single' as CardTextLine,      label: 'Left · Single' },
      { position: 'Left' as CardImagePosition,              textLine: 'Double' as CardTextLine,      label: 'Left · Double' },
      { position: 'Right' as CardImagePosition,             textLine: 'Double' as CardTextLine,      label: 'Right · Double' },
      { position: 'Full' as CardImagePosition,              textLine: 'Single' as CardTextLine,      label: 'Full · Single' },
      { position: 'None' as CardImagePosition,              textLine: 'None' as CardTextLine,        label: 'None · Text only' },
      { position: 'None - Icon Left' as CardImagePosition,  textLine: 'Single' as CardTextLine,      label: 'Icon Left · Single' },
      { position: 'None - Icon Left' as CardImagePosition,  textLine: 'Double' as CardTextLine,      label: 'Icon Left · Double' },
      { position: 'None - Icon Top' as CardImagePosition,   textLine: 'Single' as CardTextLine,      label: 'Icon Top · Single' },
      { position: 'None - Number Top' as CardImagePosition, textLine: 'Single' as CardTextLine,      label: 'Number Top · Single' },
    ],
  },
  zh: {
    imagePositionLabel: '图片位置',
    textLineLabel: '文本行',
    actionButtonLabel: '操作按钮',
    showActionButton: '显示操作按钮',
    booleansLabel: '布尔属性',
    booleansNote1: 'Figma 暴露了大量可选插槽——',
    booleansList: '标题、徽章 1、徽章 2、图标、旗标、复选框、按钮、设施、可用性详情、位置、营业时间、休息室类型、项目符号、描述、图片、图钉、编号',
    booleansNote2: '。使用 Figma 组件可以单独切换它们。',
    title: '卡片',
    description:
      '一个灵活的容器，将相关内容——媒体、标题、描述和操作——组合成一个易于扫描的单元。八种图片放置模式覆盖了从全屏英雄卡片到精简图标加文本图块的所有场景。四种文本行密度可从最简（无）适配到丰富文案（描述）。',
    pillContainer: '容器',
    pillStable: '稳定版',
    anatomyTitle: '结构剖析',
    anatomyLead: '组成 Figma 中卡片的各个部分。',
    colHash: '#',
    colLabel: '标签',
    colDescription: '描述',
    anatomyRows: [
      { n: 1, label: '容器', body: '<article> 或 <section> 包装器，8px 圆角，1px 边框（border-divider），并使用反色表面填充。' },
      { n: 2, label: '媒体', body: '可选图片插槽。当图片位置=顶部时为全宽，当左/右时为 120px 列宽，当全屏时全屏铺满，"无"值时被抑制。' },
      { n: 3, label: '标题', body: '必填标题元素——15px / 字重 600，颜色为 fg-brand-primary。在小宽度下会截断。' },
      { n: 4, label: '正文', body: '可选描述，13–14px / 字重 400，颜色为 fg-primary。为 Double 和 Description 文本行渲染。' },
      { n: 5, label: '操作', body: '可选的链接或按钮行——13px / 字重 600 的文本链接，附带尾随箭头。由按钮布尔值控制。' },
    ],
    variantsTitle: '变体',
    colProperty: '属性',
    colValues: '值',
    propImagePosition: '图片位置',
    propTextLine: '文本行',
    propBooleans: '布尔属性',
    propTextSlots: '文本插槽',
    propFontFamily: '字体',
    noteDefault: '默认',
    tokensTitle: '设计令牌',
    tokensLead: '所有颜色决策均由设计令牌支持。值会随品牌选择器更新。',
    colToken: '令牌',
    colCssVariable: 'CSS 变量',
    colValue: '值',
    tokenRows: [
      { label: '表面',       cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff' },
      { label: '边框',       cssVar: '--atom-border-default-border-divider',         tokenKey: 'atom.border.default.border-divider',         fallback: '#cdcbcb' },
      { label: '标题',       cssVar: '--atom-foreground-primary-fg-brand-primary',   tokenKey: 'atom.foreground.primary.fg-brand-primary',   fallback: '#0a2333' },
      { label: '正文',       cssVar: '--atom-foreground-core-fg-primary',            tokenKey: 'atom.foreground.core.fg-primary',            fallback: '#4b4a4a' },
      { label: '媒体填充',   cssVar: '--atom-background-core-bg-muted',              tokenKey: 'atom.background.core.bg-muted',              fallback: '#0a23330a' },
      { label: '媒体标签',   cssVar: '--atom-foreground-core-fg-tertiary',           tokenKey: 'atom.foreground.core.fg-tertiary',           fallback: '#afaead' },
    ],
    a11yTitle: '可访问性',
    a11yLead: '以包容性方式实现卡片的指南。',
    a11yRows: [
      { icon: '🧭', title: '地标与标题',         body: '使用有意义的地标（<section> 或 <article>）包裹卡片，并为标题使用真正的标题元素，以便屏幕阅读器用户可以通过转子导航在卡片之间跳转。' },
      { icon: '🖼️', title: '图片：装饰 vs. 内容', body: '装饰性媒体使用 aria-hidden="true" 且无替代文本。有意义的图片需要简洁的 alt 描述图片传达的内容——切勿使用"……的图片"。' },
      { icon: '⌨️', title: '交互目标',           body: '每张卡片应只有一个交互元素承担"卡片点击"功能。避免在链接包裹的卡片内嵌套链接；将操作分离为明确的按钮或链接。' },
      { icon: '🎯', title: '触摸目标尺寸',       body: '卡片内的操作按钮在移动端满足 44×44 最小触摸目标。卡片范围的点击目标也通过内边距遵守相同的最小值。' },
      { icon: '🎨', title: '对比度',             body: '标题、正文和媒体说明文字在每个品牌中均通过 WCAG AA 4.5:1 与表面的对比。Full 变体使用文本阴影以在摄影图像上保持对比度。' },
    ],
    usageTitle: '用法',
    usageLead: '何时以及如何使用卡片。对于带单选功能和定价的交通选择，请使用交通卡片。',
    whenToUseTitle: '✓ 何时使用',
    whenNotToUseTitle: '✗ 何时不使用',
    whenToUseItems: [
      '为单一概念组合媒体 + 文本 + 操作（文章、产品、地点）',
      '可扫描的同等优先级项目列表（信息流、目录）',
      '在更密集的表面（仪表盘）中作为特色 / 强调区块',
      '导航到更深视图——每张卡片都是可点击的入口',
      '休息室 / 机场卡片（使用设施 + 可用性详情布尔值）',
    ],
    whenNotToUseItems: [
      '密集的数据行——改用数据行或表格',
      '单一英雄推广——使用更丰富的横幅，而非单纯的卡片',
      '关键警告——使用 Alert，而非低调的卡片容器',
      '没有支持文本的微操作——使用按钮或标签',
      '交通选择——使用交通卡片',
    ],
    variantGrid: [
      { position: 'Top' as CardImagePosition,               textLine: 'Single' as CardTextLine,      label: '顶部 · 单行' },
      { position: 'Top' as CardImagePosition,               textLine: 'Double' as CardTextLine,      label: '顶部 · 双行' },
      { position: 'Top' as CardImagePosition,               textLine: 'Description' as CardTextLine, label: '顶部 · 描述' },
      { position: 'Left' as CardImagePosition,              textLine: 'Single' as CardTextLine,      label: '左侧 · 单行' },
      { position: 'Left' as CardImagePosition,              textLine: 'Double' as CardTextLine,      label: '左侧 · 双行' },
      { position: 'Right' as CardImagePosition,             textLine: 'Double' as CardTextLine,      label: '右侧 · 双行' },
      { position: 'Full' as CardImagePosition,              textLine: 'Single' as CardTextLine,      label: '全屏 · 单行' },
      { position: 'None' as CardImagePosition,              textLine: 'None' as CardTextLine,        label: '无 · 仅文本' },
      { position: 'None - Icon Left' as CardImagePosition,  textLine: 'Single' as CardTextLine,      label: '图标左侧 · 单行' },
      { position: 'None - Icon Left' as CardImagePosition,  textLine: 'Double' as CardTextLine,      label: '图标左侧 · 双行' },
      { position: 'None - Icon Top' as CardImagePosition,   textLine: 'Single' as CardTextLine,      label: '图标顶部 · 单行' },
      { position: 'None - Number Top' as CardImagePosition, textLine: 'Single' as CardTextLine,      label: '编号顶部 · 单行' },
    ],
  },
} as const;

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// ─── Figma property surface (from manifest) ──────────────────────────────────
const IMAGE_POSITIONS: CardImagePosition[] = [
  'Top',
  'None',
  'Left',
  'None - Icon Top',
  'None - Number Top',
  'None - Icon Left',
  'Full',
  'Right',
];
const TEXT_LINES: CardTextLine[] = ['None', 'Single', 'Double', 'Description'];

export function CardPage({ brand, lang = 'en' }: CardPageProps) {
  const t = COPY[lang];
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  const [imagePosition, setImagePosition] = useState<CardImagePosition>('Top');
  const [textLine,      setTextLine]      = useState<CardTextLine>('Double');
  const [showActions,   setShowActions]   = useState(true);
  const previewKey = [imagePosition, textLine, showActions].join('-');

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-[420px]">
            <div className="flex-1 flex items-center justify-center p-12" style={DOTTED_BG}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                >
                  <CardLive
                    imagePosition={imagePosition}
                    textLine={textLine}
                    showActions={showActions}
                    brand={brand}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5 overflow-y-auto">

              {/* Image Position */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.imagePositionLabel}</p>
                <div className="flex flex-col gap-1">
                  {IMAGE_POSITIONS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setImagePosition(p)}
                      className={[
                        'text-left px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        imagePosition === p
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Line */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.textLineLabel}</p>
                <div className="flex flex-wrap gap-1.5">
                  {TEXT_LINES.map((tl) => (
                    <button
                      key={tl}
                      onClick={() => setTextLine(tl)}
                      className={[
                        'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        textLine === tl
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {tl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.actionButtonLabel}</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showActions}
                    onChange={(e) => setShowActions(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 accent-slate-900"
                  />
                  <span className="text-xs text-slate-600">{t.showActionButton}</span>
                </label>
              </div>

              {/* Booleans note */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.booleansLabel}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {t.booleansNote1}<span className="font-medium text-slate-600">{t.booleansList}</span>{t.booleansNote2}
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
            {t.pillContainer}
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
          <div className="flex items-center justify-center p-6 rounded-lg border border-slate-100 bg-slate-50" style={DOTTED_BG}>
            <CardLive imagePosition="Top" textLine="Double" showActions brand={brand} />
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
                { label: t.propImagePosition, chips: [
                  {text: 'Top', note: t.noteDefault}, {text: 'None', note: ''}, {text: 'Left', note: ''},
                  {text: 'None - Icon Top', note: ''}, {text: 'None - Number Top', note: ''},
                  {text: 'None - Icon Left', note: ''}, {text: 'Full', note: ''}, {text: 'Right', note: ''},
                ]},
                { label: t.propTextLine,  chips: [{text: 'None', note: ''}, {text: 'Single', note: ''}, {text: 'Double', note: t.noteDefault}, {text: 'Description', note: ''}] },
                { label: t.propBooleans,  chips: [
                  {text: 'Title', note: ''}, {text: 'Badge 1', note: ''}, {text: 'Badge 2', note: ''}, {text: 'Icon', note: ''},
                  {text: 'Flag', note: ''}, {text: 'Checkbox', note: ''}, {text: 'Button', note: ''}, {text: 'Amenities', note: ''},
                  {text: 'Availability Details', note: ''}, {text: 'Location', note: ''}, {text: 'Opening Time', note: ''},
                  {text: 'Lounge Type', note: ''}, {text: 'Bullet', note: ''}, {text: 'Description', note: ''},
                  {text: 'Image', note: ''}, {text: 'Pin', note: ''}, {text: 'Number', note: ''},
                ]},
                { label: t.propTextSlots, chips: [
                  {text: 'Title Text', note: ''}, {text: 'Opening Time Text', note: ''}, {text: 'Type', note: ''},
                  {text: 'Location Text', note: ''}, {text: 'Terminal', note: ''}, {text: 'Lounge', note: ''},
                  {text: 'Number Text', note: ''}, {text: 'Description Text', note: ''},
                ]},
                { label: t.propFontFamily, chips: [
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

        {/* Visual preview grid — 12 representative Figma permutations */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {t.variantGrid.map(({ position, textLine: tl, label }) => (
            <div key={label} style={{
              borderRadius: '12px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa',
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid #f3f4f6', backgroundColor: '#ffffff' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#374151' }}>{label}</p>
              </div>
              <div style={{ flex: 1, padding: '28px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', ...DOTTED_BG }}>
                <div style={{ transform: 'scale(0.78)', transformOrigin: 'center' }}>
                  <CardLive imagePosition={position} textLine={tl} showActions brand={brand} />
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
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">{t.colToken}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.colCssVariable}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">{t.colValue} ({brand})</th>
              </tr>
            </thead>
            <tbody>
              {t.tokenRows.map((row, i) => {
                const rawValue = (tokens[row.tokenKey as keyof typeof tokens] as string | undefined) ?? row.fallback;
                const swatchHex = rawValue.length > 7 ? rawValue.slice(0, 7) : rawValue;
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
