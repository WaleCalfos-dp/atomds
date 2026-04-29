import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TimePickerLive,
  type TimePickerStyle,
  type TimePickerColumn,
  SHIPPED_COUNTS,
  SHIPPED_GRID_COLUMNS,
} from '../components/time-picker/TimePickerLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';

interface TimePickerPageProps {
  brand: Brand;
  lang?: Language;
}

const COPY = {
  en: {
    styleLabel: 'Style',
    countLabel: 'Count',
    columnLabel: 'Column',
    columnsSuffix: 'Columns',
    countOnlyAuthored: (count: number, col: number) =>
      `Count ${count} is only authored for ${col} Column in Figma.`,
    buttonLabel: 'Button',
    visibleNote: 'Visible',
    hiddenNote: 'Hidden',
    buttonNote: 'Informational — SVG exports do not bake in a Confirm button.',
    booleanNote1: 'The ',
    booleanNote2: 'Primary Button',
    booleanNote3: ', ',
    booleanNote4: 'Secondary Button',
    booleanNote5: ', ',
    booleanNote6: 'Before Time',
    booleanNote7: ',',
    booleanNote8: 'Current Time',
    booleanNote9: ', and ',
    booleanNote10: 'After Time',
    booleanNote11: ' booleans are documented below.',
    title: 'Time Picker',
    intro: 'Lets users pick a specific time — either by scrolling hour / minute / AM-PM columns, choosing a preset slot from a 2- or 4-column grid, or swiping through a horizontal strip of times. Used for bookings, reminders, and any flow where time granularity matters.',
    input: 'Input',
    stable: 'Stable',
    anatomyTitle: 'Anatomy',
    anatomyLead: 'The parts that make up a Time Picker in Figma.',
    anatomyHash: '#',
    anatomyLabelHeader: 'Label',
    anatomyDescHeader: 'Description',
    anatomyParts: [
      { n: 1, label: 'Container',        body: 'Rounded card with surface fill, border and soft drop shadow.' },
      { n: 2, label: 'Column label',     body: 'Uppercase HR / MIN / AM-PM header (Vertical style only).' },
      { n: 3, label: 'Time cell',        body: 'Individual selectable unit — hour, minute, meridiem, or preset slot.' },
      { n: 4, label: 'Selected cell',    body: 'Brand-coloured pressed surface with inverse text for the current value.' },
      { n: 5, label: 'Primary Button',   body: 'Optional "Confirm" action beneath the columns. Controlled by the Button boolean.' },
      { n: 6, label: 'Secondary Button', body: 'Optional "Cancel" or similar low-emphasis action (Figma boolean).' },
    ],
    variantsTitle: 'Variants',
    propertyHeader: 'Property',
    valuesHeader: 'Values',
    variantRows: [
      {
        label: 'Style',
        chips: [
          { text: 'Vertical',    note: 'Default · 3-column scroll' },
          { text: 'Grid',        note: '2-col preset slots' },
          { text: 'Scrollable',  note: 'Horizontal strip' },
        ],
      },
      {
        label: 'Booleans (6)',
        chips: [
          { text: 'Button',           note: '' },
          { text: 'Primary Button',   note: '' },
          { text: 'Secondary Button', note: '' },
          { text: 'Before Time',      note: '' },
          { text: 'Current Time',     note: '' },
          { text: 'After Time',       note: '' },
        ],
      },
      {
        label: 'Text slots (0)',
        chips: [
          { text: 'None', note: 'Cells render numeric values directly' },
        ],
      },
      {
        label: 'Font family',
        chips: [
          { text: 'Poppins', note: 'Dragonpass' },
          { text: 'Arial',   note: 'Mastercard' },
          { text: 'Inter',   note: 'Investec' },
          { text: 'Manrope', note: 'Visa · Greyscale' },
          { text: 'Lato',    note: 'Assurant' },
        ],
      },
    ],
    countLabelData: 'Count',
    previewLabels: {
      vertical: 'Vertical · 3',
      grid: 'Grid · 8 · 4-col',
      scrollable: 'Scrollable',
    },
    tokensTitle: 'Design Tokens',
    tokensLead: 'Tokens consumed by every Time Picker style. Values update with the brand selector.',
    tokenHeader: 'Token',
    cssVarHeader: 'CSS Variable',
    valueHeader: 'Value',
    tokenLabels: {
      'Surface': 'Surface',
      'Body text': 'Body text',
      'Muted label': 'Muted label',
      'Border': 'Border',
      'Selected surface': 'Selected surface',
      'Selected text': 'Selected text',
      'Button background': 'Button background',
    } as Record<string, string>,
    a11yTitle: 'Accessibility',
    a11yLead: 'Guidelines for implementing Time Picker inclusively.',
    a11yRows: [
      { icon: '⌨️', title: 'Keyboard navigation', body: 'Each selectable time cell must be a focusable <button> (or role="option" in a listbox). Vertical style: ArrowUp / ArrowDown cycles within a column, Tab moves between columns. Grid / Scrollable: arrow keys move across rows and columns; Enter or Space selects.' },
      { icon: '🏷️', title: 'Labelling', body: 'Wrap the picker in a region with aria-label="Time picker" (or similar context). When the picker is opened from an input, associate it via aria-controls on the trigger and aria-expanded to announce open/close.' },
      { icon: '📢', title: 'Announcing the selected time', body: 'Each cell must expose aria-selected or the chosen value via visible text that updates as the user scrolls. For Scrollable style, pair it with a live region so screen readers announce the currently snapped time.' },
      { icon: '🎨', title: 'Color contrast', body: 'Selected cells use bg-primary-pressed-brand with fg-brand-primary-inverse — meets WCAG AA 4.5:1 on all brands. The muted "HR / MIN / AM/PM" labels use fg-secondary; ensure the column labels remain ≥ 4.5:1 against the white surface.' },
      { icon: '📏', title: 'Touch target', body: 'Each cell is ≥ 44×44 CSS pixels (WCAG 2.5.5). Do not collapse spacing for dense Count variants — if a layout is too cramped, switch from Grid to Scrollable instead of shrinking cells.' },
      { icon: '🔁', title: 'Before / Current / After Time states', body: 'Past and future times in Figma\'s "Before Time" and "After Time" booleans must remain visually distinct from disabled. Disabled cells need aria-disabled="true" and reduced colour; soft-past ("Before Time") cells should stay interactive if business rules allow.' },
    ],
    usageTitle: 'Usage',
    usageLead: 'How to pick between the three styles depending on the flow.',
    usageVerticalTitle: 'Vertical',
    usageVerticalBody: 'The default. Use when the user needs arbitrary-minute precision — e.g. setting a reminder to 2:37 PM. Scrollable hour / minute / AM-PM columns give the widest range without overwhelming the screen.',
    usageGridTitle: 'Grid',
    usageGridBody: 'Use for booking slots with fixed intervals (30 min, 1 hour). The 2-column layout scales up to 16 slots; the 4-column layout goes up to 32. Reach for Grid whenever the set of valid times is discrete and small.',
    usageScrollableTitle: 'Scrollable',
    usageScrollableBody: 'Compact horizontal strip. Best on narrow surfaces or when the valid range spans many hours but the user usually picks something nearby. Let users flick horizontally; highlight the current time in the middle.',
    doTitle: '✓ When to use',
    dontTitle: '✗ When not to use',
    doItems: [
      'Pair with a Date Picker when both date and time are required',
      'Highlight the user\u2019s current time with the Current Time boolean',
      'Offer a confirm Button when the picker lives inside a bottom sheet',
      'Use 24-hour or 12-hour format based on locale / account settings',
      'Disable Before Time slots that are no longer bookable',
    ],
    dontItems: [
      'Don\u2019t use Grid with more than 32 slots \u2014 switch to Scrollable',
      'Don\u2019t omit the confirm button when the selection is destructive',
      'Don\u2019t mix 12-hour and 24-hour formats in the same flow',
      'Don\u2019t shrink cells below a 44\u00d744 touch target',
      'Don\u2019t rely on colour alone to distinguish past / current / future',
    ],
  },
  zh: {
    styleLabel: '样式',
    countLabel: '数量',
    columnLabel: '列',
    columnsSuffix: '列',
    countOnlyAuthored: (count: number, col: number) =>
      `数量 ${count} 在 Figma 中仅针对 ${col} 列设计。`,
    buttonLabel: '按钮',
    visibleNote: '显示',
    hiddenNote: '隐藏',
    buttonNote: '信息提示 — SVG 导出不会内嵌确认按钮。',
    booleanNote1: '',
    booleanNote2: 'Primary Button',
    booleanNote3: '、',
    booleanNote4: 'Secondary Button',
    booleanNote5: '、',
    booleanNote6: 'Before Time',
    booleanNote7: '、',
    booleanNote8: 'Current Time',
    booleanNote9: ' 和 ',
    booleanNote10: 'After Time',
    booleanNote11: ' 布尔值的文档详见下文。',
    title: '时间选择器',
    intro: '让用户选择特定时间 — 可通过滚动时/分/上下午列、从 2 列或 4 列网格中选取预设时段,或在水平时间条上滑动来选择。用于预约、提醒以及任何需要时间精度的流程。',
    input: '输入',
    stable: '稳定',
    anatomyTitle: '结构',
    anatomyLead: 'Figma 中时间选择器的组成部件。',
    anatomyHash: '#',
    anatomyLabelHeader: '标签',
    anatomyDescHeader: '描述',
    anatomyParts: [
      { n: 1, label: '容器',        body: '带有表面填充、边框和柔和投影的圆角卡片。' },
      { n: 2, label: '列标题',     body: '大写的 HR / MIN / AM-PM 标题(仅 Vertical 样式)。' },
      { n: 3, label: '时间单元格',        body: '单个可选择单位 — 小时、分钟、上下午或预设时段。' },
      { n: 4, label: '选中单元格',    body: '当前值显示为品牌色按压表面,搭配反向文本。' },
      { n: 5, label: 'Primary Button',   body: '可选的"确认"操作,位于列下方。由 Button 布尔值控制。' },
      { n: 6, label: 'Secondary Button', body: '可选的"取消"或类似低强调操作(Figma 布尔值)。' },
    ],
    variantsTitle: '变体',
    propertyHeader: '属性',
    valuesHeader: '值',
    variantRows: [
      {
        label: '样式',
        chips: [
          { text: 'Vertical',    note: '默认 · 3 列滚动' },
          { text: 'Grid',        note: '2 列预设时段' },
          { text: 'Scrollable',  note: '水平时间条' },
        ],
      },
      {
        label: '布尔值 (6)',
        chips: [
          { text: 'Button',           note: '' },
          { text: 'Primary Button',   note: '' },
          { text: 'Secondary Button', note: '' },
          { text: 'Before Time',      note: '' },
          { text: 'Current Time',     note: '' },
          { text: 'After Time',       note: '' },
        ],
      },
      {
        label: '文本槽 (0)',
        chips: [
          { text: '无', note: '单元格直接渲染数字值' },
        ],
      },
      {
        label: '字体系列',
        chips: [
          { text: 'Poppins', note: 'Dragonpass' },
          { text: 'Arial',   note: 'Mastercard' },
          { text: 'Inter',   note: 'Investec' },
          { text: 'Manrope', note: 'Visa · Greyscale' },
          { text: 'Lato',    note: 'Assurant' },
        ],
      },
    ],
    countLabelData: '数量',
    previewLabels: {
      vertical: 'Vertical · 3',
      grid: 'Grid · 8 · 4-col',
      scrollable: 'Scrollable',
    },
    tokensTitle: '设计令牌',
    tokensLead: '每种时间选择器样式所使用的令牌。值会根据品牌选择器更新。',
    tokenHeader: '令牌',
    cssVarHeader: 'CSS 变量',
    valueHeader: '值',
    tokenLabels: {
      'Surface': '表面',
      'Body text': '正文文本',
      'Muted label': '弱化标签',
      'Border': '边框',
      'Selected surface': '选中表面',
      'Selected text': '选中文本',
      'Button background': '按钮背景',
    } as Record<string, string>,
    a11yTitle: '无障碍',
    a11yLead: '包容性实现时间选择器的指南。',
    a11yRows: [
      { icon: '⌨️', title: '键盘导航', body: '每个可选择的时间单元格必须是可获得焦点的 <button>(或 listbox 中的 role="option")。Vertical 样式:ArrowUp / ArrowDown 在列内循环,Tab 在列之间移动。Grid / Scrollable:方向键在行和列之间移动;Enter 或 Space 进行选择。' },
      { icon: '🏷️', title: '标签', body: '将选择器包裹在带有 aria-label="Time picker"(或类似上下文)的区域中。当从输入框打开选择器时,通过触发器上的 aria-controls 和 aria-expanded 关联起来,以宣告打开/关闭状态。' },
      { icon: '📢', title: '宣告所选时间', body: '每个单元格必须通过 aria-selected 或随用户滚动而更新的可见文本来暴露所选值。对于 Scrollable 样式,搭配一个实时区域,以便屏幕阅读器宣告当前对齐的时间。' },
      { icon: '🎨', title: '色彩对比度', body: '选中单元格使用 bg-primary-pressed-brand 搭配 fg-brand-primary-inverse — 在所有品牌中均符合 WCAG AA 4.5:1 标准。弱化的 "HR / MIN / AM/PM" 标签使用 fg-secondary;确保列标签在白色表面上保持 ≥ 4.5:1。' },
      { icon: '📏', title: '触控目标', body: '每个单元格 ≥ 44×44 CSS 像素 (WCAG 2.5.5)。不要为高密度数量变体压缩间距 — 如果布局过于拥挤,请从 Grid 切换到 Scrollable,而不是缩小单元格。' },
      { icon: '🔁', title: '过去 / 当前 / 之后时间状态', body: 'Figma 中"Before Time"和"After Time"布尔值的过去和未来时间必须在视觉上与禁用状态区分开。禁用单元格需要 aria-disabled="true" 和减弱的颜色;若业务规则允许,软过去("Before Time")单元格应保持可交互。' },
    ],
    usageTitle: '用法',
    usageLead: '根据流程在三种样式之间进行选择。',
    usageVerticalTitle: 'Vertical',
    usageVerticalBody: '默认样式。当用户需要任意分钟精度时使用 — 例如将提醒设置为下午 2:37。可滚动的时/分/上下午列在不让屏幕过于杂乱的情况下提供最广的范围。',
    usageGridTitle: 'Grid',
    usageGridBody: '用于固定间隔(30 分钟、1 小时)的预约时段。2 列布局最多可扩展至 16 个时段;4 列布局可达 32 个。当有效时间集合是离散且较小时,首选 Grid。',
    usageScrollableTitle: 'Scrollable',
    usageScrollableBody: '紧凑型水平时间条。最适合狭窄的表面,或当有效范围跨越多个小时但用户通常选择附近时间时。让用户水平滑动;在中间高亮当前时间。',
    doTitle: '✓ 何时使用',
    dontTitle: '✗ 何时不使用',
    doItems: [
      '当同时需要日期和时间时,搭配日期选择器使用',
      '使用 Current Time 布尔值高亮显示用户的当前时间',
      '当选择器位于底部表单中时,提供确认 Button',
      '根据区域设置 / 账户设置使用 24 小时或 12 小时格式',
      '禁用不再可预订的 Before Time 时段',
    ],
    dontItems: [
      '不要使用超过 32 个时段的 Grid — 切换到 Scrollable',
      '当选择具有破坏性时,不要省略确认按钮',
      '不要在同一流程中混用 12 小时和 24 小时格式',
      '不要将单元格缩小至 44×44 触控目标以下',
      '不要仅依靠颜色来区分过去 / 当前 / 未来',
    ],
  },
} as const;

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const ALL_STYLES: TimePickerStyle[] = ['Vertical', 'Grid', 'Scrollable'];

type TokenRow = {
  label: string;
  cssVar: string;
  tokenKey?: string;
  fallback: string;
  styles?: TimePickerStyle[];
};

const TOKEN_TABLE_ROWS: TokenRow[] = [
  { label: 'Surface',             cssVar: '--atom-background-primary-bg-primary-inverse',        tokenKey: 'atom.background.primary.bg-primary-inverse',        fallback: '#ffffff' },
  { label: 'Body text',           cssVar: '--atom-foreground-primary-fg-brand-primary',          tokenKey: 'atom.foreground.primary.fg-brand-primary',          fallback: '#0a2333' },
  { label: 'Muted label',         cssVar: '--atom-foreground-core-fg-secondary',                 tokenKey: 'atom.foreground.core.fg-secondary',                 fallback: '#737272' },
  { label: 'Border',              cssVar: '--atom-border-default-border-default',                tokenKey: 'atom.border.default.border-default',                fallback: '#cdcbcb' },
  { label: 'Selected surface',    cssVar: '--atom-background-primary-bg-primary-pressed-brand',  tokenKey: 'atom.background.primary.bg-primary-pressed-brand',  fallback: '#0a2333' },
  { label: 'Selected text',       cssVar: '--atom-foreground-primary-fg-brand-primary-inverse',  tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse',  fallback: '#ffffff' },
  { label: 'Button background',   cssVar: '--atom-background-primary-bg-primary-default',        tokenKey: 'atom.background.primary.bg-primary-default',        fallback: '#0a2333' },
];

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

/** Sensible first-render count per Style. Mirrors TimePickerLive's prop default. */
const DEFAULT_COUNT: Record<TimePickerStyle, number> = {
  Vertical: 3,
  Scrollable: 1,
  Grid: 4,
};

export function TimePickerPage({ brand, lang = 'en' }: TimePickerPageProps) {
  const t = COPY[lang];
  const [pickerStyle, setPickerStyle] = useState<TimePickerStyle>('Vertical');
  const [count,       setCount]       = useState<number>(DEFAULT_COUNT.Vertical);
  const [column,      setColumn]      = useState<TimePickerColumn>(2);
  const [showButton,  setShowButton]  = useState(true);

  const validCounts  = SHIPPED_COUNTS[pickerStyle];
  const validColumns =
    pickerStyle === 'Grid' ? (SHIPPED_GRID_COLUMNS[count] ?? []) : [];

  // Switch Style → snap Count into the new Style's valid set.
  const handleStyleChange = (next: TimePickerStyle) => {
    setPickerStyle(next);
    const counts = SHIPPED_COUNTS[next];
    const fallback = DEFAULT_COUNT[next];
    const nextCount = counts.includes(count)
      ? count
      : counts.includes(fallback)
      ? fallback
      : counts[0];
    setCount(nextCount);

    if (next === 'Grid') {
      const cols = SHIPPED_GRID_COLUMNS[nextCount] ?? [2];
      if (!cols.includes(column)) setColumn(cols[0]);
    }
  };

  // Switch Count (within Grid) → snap Column if current value is no longer valid.
  const handleCountChange = (nextCount: number) => {
    setCount(nextCount);
    if (pickerStyle === 'Grid') {
      const cols = SHIPPED_GRID_COLUMNS[nextCount] ?? [2];
      if (!cols.includes(column)) setColumn(cols[0]);
    }
  };

  const previewKey = `${pickerStyle}-${count}-${column}-${showButton}`;
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-80">

            {/* Canvas */}
            <div className="flex-1 flex items-center justify-center p-8 min-h-52" style={DOTTED_BG}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                >
                  <TimePickerLive
                    style={pickerStyle}
                    count={count}
                    column={column}
                    showButton={showButton}
                    brand={brand}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5 overflow-y-auto">

              {/* Style */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.styleLabel}</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_STYLES.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStyleChange(s)}
                      className={[
                        'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        pickerStyle === s
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Count */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.countLabel}</p>
                <div className="flex flex-wrap gap-1.5">
                  {validCounts.map((c) => (
                    <button
                      key={c}
                      onClick={() => handleCountChange(c)}
                      className={[
                        'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100 min-w-[2rem]',
                        count === c
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Column — Grid only */}
              {pickerStyle === 'Grid' && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.columnLabel}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {validColumns.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColumn(c)}
                        className={[
                          'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                          column === c
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                        ].join(' ')}
                      >
                        {c} {t.columnsSuffix}
                      </button>
                    ))}
                  </div>
                  {validColumns.length === 1 && (
                    <p className="mt-1.5 text-[11px] text-slate-400">
                      {t.countOnlyAuthored(count, validColumns[0])}
                    </p>
                  )}
                </div>
              )}

              {/* Button */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.buttonLabel}</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showButton}
                    onChange={(e) => setShowButton(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 accent-slate-900"
                  />
                  <span className="text-xs text-slate-600">{showButton ? t.visibleNote : t.hiddenNote}</span>
                </label>
                <p className="mt-1.5 text-[11px] text-slate-400">
                  {t.buttonNote}
                </p>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {t.booleanNote1}<em>{t.booleanNote2}</em>{t.booleanNote3}<em>{t.booleanNote4}</em>{t.booleanNote5}<em>{t.booleanNote6}</em>{t.booleanNote7}
                <em>{t.booleanNote8}</em>{t.booleanNote9}<em>{t.booleanNote10}</em>{t.booleanNote11}
              </p>

            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ────────────────────────────────────────────────── */}
      <section>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{t.title}</h1>
        <p className="text-[15px] text-slate-500 leading-relaxed mb-4 max-w-2xl">
          {t.intro}
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-sky-200 bg-sky-50 text-xs text-sky-800">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            {t.input}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-emerald-200 bg-emerald-50 text-xs text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {t.stable}
          </span>
        </div>
      </section>

      {/* ── 3. ANATOMY ───────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.anatomyTitle}</h2>
        <p className="text-sm text-slate-500 mb-4">{t.anatomyLead}</p>
        <div className="grid md:grid-cols-2 gap-6 rounded-xl border border-slate-200 bg-white shadow-sm p-6">

          {/* Diagram */}
          <div className="flex items-center justify-center p-6 rounded-lg border border-slate-100 bg-slate-50">
            <TimePickerLive style="Vertical" count={3} showButton brand={brand} />
          </div>

          {/* Numbered parts */}
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-12">{t.anatomyHash}</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">{t.anatomyLabelHeader}</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.anatomyDescHeader}</th>
                </tr>
              </thead>
              <tbody>
                {t.anatomyParts.map((row, i, arr) => (
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

        {/* Visual preview grid — one card per Style, rendering a representative shipped variant. */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { style: 'Vertical'   as TimePickerStyle, count: 3, column: 2 as TimePickerColumn, label: t.previewLabels.vertical  },
            { style: 'Grid'       as TimePickerStyle, count: 8, column: 4 as TimePickerColumn, label: t.previewLabels.grid },
            { style: 'Scrollable' as TimePickerStyle, count: 1, column: 2 as TimePickerColumn, label: t.previewLabels.scrollable    },
          ].map((v) => (
            <div key={v.label} style={{
              padding: '20px 24px', borderRadius: '10px',
              border: '1px solid #f3f4f6', backgroundColor: '#fafafa',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px',
              overflowX: 'auto',
            }}>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>{v.label}</p>
              <TimePickerLive style={v.style} count={v.count} column={v.column} showButton brand={brand} />
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
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">{t.tokenHeader}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.cssVarHeader}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">{t.valueHeader}</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_TABLE_ROWS.map((row, i) => {
                const isActive      = !row.styles || row.styles.includes(pickerStyle);
                const resolvedValue = row.tokenKey ? (tokens[row.tokenKey as keyof typeof tokens] ?? row.fallback) : row.fallback;
                const isHexColor    = resolvedValue.startsWith('#');
                const light         = isHexColor ? isLightColor(resolvedValue) : true;
                const localizedLabel = t.tokenLabels[row.label] ?? row.label;
                return (
                  <tr
                    key={row.cssVar}
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

        {/* Per-style usage cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bae6fd', backgroundColor: '#f0f9ff' }}>
            <p style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: 600, color: '#075985' }}>{t.usageVerticalTitle}</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#4b5563', lineHeight: 1.5 }}>
              {t.usageVerticalBody}
            </p>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #c7d2fe', backgroundColor: '#eef2ff' }}>
            <p style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: 600, color: '#3730a3' }}>{t.usageGridTitle}</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#4b5563', lineHeight: 1.5 }}>
              {t.usageGridBody}
            </p>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #d8b4fe', backgroundColor: '#faf5ff' }}>
            <p style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: 600, color: '#6b21a8' }}>{t.usageScrollableTitle}</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#4b5563', lineHeight: 1.5 }}>
              {t.usageScrollableBody}
            </p>
          </div>
        </div>

        {/* Do / Don't */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>{t.doTitle}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              {t.doItems.map((item, idx, arr) => (
                <li key={idx} style={{ marginBottom: idx < arr.length - 1 ? '6px' : 0 }}>• {item}</li>
              ))}
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>{t.dontTitle}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              {t.dontItems.map((item, idx, arr) => (
                <li key={idx} style={{ marginBottom: idx < arr.length - 1 ? '6px' : 0 }}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
