import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TransportCardLive,
  type TransportCardType,
  type TransportCardState,
  type TransportCardBackground,
  type TransportCarModel,
} from '../components/card/TransportCardLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';

interface TransportCardPageProps {
  brand: Brand;
  lang?: Language;
}

const COPY = {
  en: {
    typeLabel: 'Type',
    stateLabel: 'State',
    bgLabel: 'Background Fill',
    carModelLabel: 'Car Model',
    booleansLabel: 'Booleans',
    typeNames: { Info: 'Info', 'Selectable with price': 'Selectable with price' } as Record<TransportCardType, string>,
    stateNames: { Default: 'Default', Selected: 'Selected' } as Record<TransportCardState, string>,
    bgNames: { Yes: 'Yes', No: 'No' } as Record<TransportCardBackground, string>,
    infoOnlyDefault: 'Info only ships Default state.',
    booleanItems: [
      { key: 'Information', label: 'Information' },
      { key: 'Prices', label: 'Prices' },
      { key: 'Radio Button', label: 'Radio Button' },
      { key: 'Car Image', label: 'Car Image' },
    ],
    headline: 'Transport Card',
    tagline:
      'A specialised card for choosing a mode of transport. Two Types (Info · Selectable with price), a Default/Selected state on Selectable, and a Background Fill axis that swaps between a filled card surface and a divider-only rule. Ships with six car illustrations (Economy → First Class).',
    domainPill: 'Domain · Transport',
    stablePill: 'Stable',
    anatomyHeading: 'Anatomy',
    anatomyTagline: 'The parts that make up a Transport Card in Figma.',
    hashHeader: '#',
    labelHeader: 'Label',
    descriptionHeader: 'Description',
    anatomyParts: [
      { n: 1, label: 'Container', body: '327px wide, 8px radius, 1px border on Fill=Yes or a bottom hairline rule on Fill=No. Height tracks content (64 / 80 / 92 / 108 px spec heights).' },
      { n: 2, label: 'Radio button', body: '20px circle on the leading edge (Selectable only). Unselected = 1.5px border, Selected = 2px filled ring. Controlled by the Radio Button boolean.' },
      { n: 3, label: 'Car image', body: '48×48 illustration from the _cars component set (six models). Controlled by the Car Image boolean; hidden for metadata-only rows.' },
      { n: 4, label: 'Car title', body: 'The Car Type text slot — 14px / weight 600, color fg-brand-primary.' },
      { n: 5, label: 'Information', body: 'Two optional icon+label chips (capacity, luggage). Bound to the Item 1 / Item 2 and Description 1 / Description 2 slots; collapsed when Information=off.' },
      { n: 6, label: 'Prices', body: 'Strike-through Price 1 + effective Price 2, right-aligned. Controlled by Prices / Price 1 / Price 2 booleans.' },
    ],
    variantsHeading: 'Variants',
    propertyHeader: 'Property',
    valuesHeader: 'Values',
    defaultNote: 'Default',
    rows: {
      type: 'Type',
      state: 'State',
      bg: 'Background Fill',
      booleans: 'Booleans (8)',
      textSlots: 'Text slots (5)',
      cars: 'Car illustrations',
      font: 'Font family',
    },
    selectableOnly: 'Selectable only',
    fontFamily: [
      { text: 'Poppins', note: 'Dragonpass' }, { text: 'Arial', note: 'Mastercard' }, { text: 'Inter', note: 'Investec' },
      { text: 'Manrope', note: 'Visa · Greyscale' }, { text: 'Lato', note: 'Assurant' },
    ],
    previewLabels: {
      'Info · Default · Fill': 'Info · Default · Fill',
      'Info · Default · No fill': 'Info · Default · No fill',
      'Selectable · Default · Fill': 'Selectable · Default · Fill',
      'Selectable · Default · No fill': 'Selectable · Default · No fill',
      'Selectable · Selected · Fill': 'Selectable · Selected · Fill',
      'Selectable · Selected · No fill': 'Selectable · Selected · No fill',
    } as Record<string, string>,
    carIllustrationsLabel: 'Car illustrations',
    tokensHeading: 'Design Tokens',
    tokensTagline: 'All colour decisions are token-backed. Values update with the brand selector.',
    tokenColumn: 'Token',
    cssVarColumn: 'CSS Variable',
    valueColumn: 'Value',
    tokenLabels: {
      'Surface (Fill=Yes)': 'Surface (Fill=Yes)',
      'Border': 'Border',
      'Divider (Fill=No)': 'Divider (Fill=No)',
      'Selected border': 'Selected border',
      'Title': 'Title',
      'Description / meta': 'Description / meta',
      'Strike-through price': 'Strike-through price',
    } as Record<string, string>,
    a11yHeading: 'Accessibility',
    a11yTagline: 'Guidelines for implementing Transport Card inclusively.',
    a11yRows: [
      { icon: '🎛️', title: 'Radio semantics', body: 'Selectable cards behave as a radio group — exactly one is selected at a time. Use <input type="radio"> (visually hidden) with a real name, or role="radio" inside role="radiogroup".' },
      { icon: '⌨️', title: 'Keyboard navigation', body: 'Arrow keys move selection within the group; Space/Enter commits it. Tab enters the group once; subsequent Tabs leave it. Never put each card in its own tab-stop.' },
      { icon: '🎨', title: 'Selection not by colour alone', body: 'The Selected state adds a 2px border in addition to any colour change. Don\'t rely on the colour shift alone — keep the border at 2px so low-vision users can see it.' },
      { icon: '🏷️', title: 'Labelling', body: 'Associate the visible car title, capacity, luggage, and price with the radio via aria-labelledby and aria-describedby so screen readers announce the full offer.' },
      { icon: '🖼️', title: 'Car image', body: 'The car illustration is decorative — it has aria-hidden on the <img> and never carries meaningful alt text. Never let it be the only indicator of the vehicle type.' },
      { icon: '📏', title: 'Touch target', body: 'The whole card (327px × ≥64px) is the hit target. Meets the 44×44 minimum with margin. Never shrink below 60px height even at cramped breakpoints.' },
    ],
    usageHeading: 'Usage',
    usageTagline: 'When and how to use Transport Card. For general-purpose scannable blocks (media + title + action), use Card.',
    whenToUseLabel: '✓ When to use',
    whenNotToUseLabel: '✗ When not to use',
    whenToUse: [
      'Chauffeur / ride-hail booking with a radio group of options',
      'Comparing transport tiers side-by-side (capacity, luggage, price)',
      'Itinerary summary row (Type = Info, State = Default)',
      'Confirmation screens showing the selected vehicle',
      'Use Background Fill = No when stacked inside another Card or Dialog',
    ],
    whenNotToUse: [
      'Non-transport selections — use Card or List Item',
      'Multi-select scenarios — use Checkbox rows',
      'Selectable with an Info type — Info is always read-only',
      'Custom car illustrations outside the six Figma models',
      'Cramped layouts (< 327px) — the card has a fixed width',
    ],
  },
  zh: {
    typeLabel: '类型',
    stateLabel: '状态',
    bgLabel: '背景填充',
    carModelLabel: '车型',
    booleansLabel: '布尔值',
    typeNames: { Info: '信息', 'Selectable with price': '可选 (带价格)' } as Record<TransportCardType, string>,
    stateNames: { Default: '默认', Selected: '已选中' } as Record<TransportCardState, string>,
    bgNames: { Yes: '是', No: '否' } as Record<TransportCardBackground, string>,
    infoOnlyDefault: '信息类型仅提供默认状态。',
    booleanItems: [
      { key: 'Information', label: '信息' },
      { key: 'Prices', label: '价格' },
      { key: 'Radio Button', label: '单选按钮' },
      { key: 'Car Image', label: '车辆图片' },
    ],
    headline: '交通卡片',
    tagline:
      '用于选择交通方式的专用卡片。提供两种类型(信息 · 可选 (带价格)),可选类型支持默认/已选中状态,背景填充轴可在填充卡片表面与仅分隔线之间切换。配有六款车辆插图(经济型 → 头等舱)。',
    domainPill: '领域 · 交通',
    stablePill: '稳定版',
    anatomyHeading: '结构剖析',
    anatomyTagline: '组成 Figma 中交通卡片的各个部分。',
    hashHeader: '#',
    labelHeader: '标签',
    descriptionHeader: '描述',
    anatomyParts: [
      { n: 1, label: '容器', body: '宽度 327px,圆角 8px。Fill=Yes 时为 1px 边框,Fill=No 时为底部细线。高度随内容变化(规格高度 64 / 80 / 92 / 108 px)。' },
      { n: 2, label: '单选按钮', body: '前缘 20px 圆形(仅限可选类型)。未选 = 1.5px 边框,已选 = 2px 实心环。由"单选按钮"布尔值控制。' },
      { n: 3, label: '车辆图片', body: '来自 _cars 组件集的 48×48 插图(六款车型)。由"车辆图片"布尔值控制;仅元数据行时隐藏。' },
      { n: 4, label: '车型标题', body: '"Car Type"文本槽 — 14px / 字重 600,颜色为 fg-brand-primary。' },
      { n: 5, label: '信息', body: '两个可选的图标+标签芯片(容量、行李)。绑定到 Item 1 / Item 2 和 Description 1 / Description 2 槽;Information=off 时折叠。' },
      { n: 6, label: '价格', body: '划线 Price 1 + 有效 Price 2,右对齐。由 Prices / Price 1 / Price 2 布尔值控制。' },
    ],
    variantsHeading: '变体',
    propertyHeader: '属性',
    valuesHeader: '值',
    defaultNote: '默认',
    rows: {
      type: '类型',
      state: '状态',
      bg: '背景填充',
      booleans: '布尔值 (8)',
      textSlots: '文本槽 (5)',
      cars: '车辆插图',
      font: '字体',
    },
    selectableOnly: '仅可选类型',
    fontFamily: [
      { text: 'Poppins', note: 'Dragonpass' }, { text: 'Arial', note: 'Mastercard' }, { text: 'Inter', note: 'Investec' },
      { text: 'Manrope', note: 'Visa · Greyscale' }, { text: 'Lato', note: 'Assurant' },
    ],
    previewLabels: {
      'Info · Default · Fill': '信息 · 默认 · 填充',
      'Info · Default · No fill': '信息 · 默认 · 无填充',
      'Selectable · Default · Fill': '可选 · 默认 · 填充',
      'Selectable · Default · No fill': '可选 · 默认 · 无填充',
      'Selectable · Selected · Fill': '可选 · 已选中 · 填充',
      'Selectable · Selected · No fill': '可选 · 已选中 · 无填充',
    } as Record<string, string>,
    carIllustrationsLabel: '车辆插图',
    tokensHeading: '设计令牌',
    tokensTagline: '所有颜色决策均由设计令牌支持。值随品牌选择器更新。',
    tokenColumn: '令牌',
    cssVarColumn: 'CSS 变量',
    valueColumn: '数值',
    tokenLabels: {
      'Surface (Fill=Yes)': '表面 (Fill=Yes)',
      'Border': '边框',
      'Divider (Fill=No)': '分隔线 (Fill=No)',
      'Selected border': '选中边框',
      'Title': '标题',
      'Description / meta': '描述 / 元信息',
      'Strike-through price': '划线价格',
    } as Record<string, string>,
    a11yHeading: '可访问性',
    a11yTagline: '包容性实现交通卡片的指南。',
    a11yRows: [
      { icon: '🎛️', title: '单选语义', body: '可选卡片表现为单选组——同一时刻仅有一个被选中。使用 <input type="radio">(视觉隐藏)配合真实的 name 属性,或在 role="radiogroup" 中使用 role="radio"。' },
      { icon: '⌨️', title: '键盘导航', body: '方向键在组内移动选择;Space/Enter 提交。Tab 进入组一次;后续 Tab 离开。绝不要让每张卡片都成为独立的 tab 停留点。' },
      { icon: '🎨', title: '不仅依赖颜色表示选择', body: '选中状态除颜色变化外还会增加 2px 边框。不要仅依赖颜色变化——保持 2px 边框以便低视力用户也能看到。' },
      { icon: '🏷️', title: '标签关联', body: '通过 aria-labelledby 和 aria-describedby 将可见的车型标题、容量、行李和价格与单选按钮关联起来,以便屏幕阅读器播报完整的报价。' },
      { icon: '🖼️', title: '车辆图片', body: '车辆插图为装饰性 — <img> 上设置 aria-hidden 且绝不携带有意义的 alt 文本。绝不让它成为车型的唯一指示。' },
      { icon: '📏', title: '触控目标', body: '整张卡片(327px × ≥64px)即为命中区域。带边距时满足 44×44 的最低要求。即使在拥挤的断点上也绝不要将高度缩小到 60px 以下。' },
    ],
    usageHeading: '用法',
    usageTagline: '何时及如何使用交通卡片。对于通用的可扫描块(媒体 + 标题 + 操作),请使用卡片。',
    whenToUseLabel: '✓ 适用场景',
    whenNotToUseLabel: '✗ 不适用场景',
    whenToUse: [
      '配备司机/网约车预订,带选项单选组',
      '并排比较交通等级(容量、行李、价格)',
      '行程摘要行(Type = Info,State = Default)',
      '显示已选车辆的确认页面',
      '当嵌入到另一个卡片或对话框中时,使用 Background Fill = No',
    ],
    whenNotToUse: [
      '非交通选择 — 请使用卡片或列表项',
      '多选场景 — 请使用复选框行',
      '在 Info 类型上启用可选 — Info 始终为只读',
      '六种 Figma 模型之外的自定义车辆插图',
      '拥挤的布局(< 327px)— 此卡片有固定宽度',
    ],
  },
} as const;

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// Figma order on the component set:
const ALL_TYPES:   TransportCardType[]        = ['Info', 'Selectable with price'];
const ALL_STATES:  TransportCardState[]       = ['Default', 'Selected'];
const ALL_BG:      TransportCardBackground[]  = ['Yes', 'No'];

const CAR_MODELS: { model: TransportCarModel; src: string; capacity: string; bags: string }[] = [
  { model: 'Economy',            src: '/cars/economy.png',        capacity: 'Up to 3', bags: '2 bags max' },
  { model: 'Comfort Sedan',      src: '/cars/comfort-sedan.png',  capacity: 'Up to 3', bags: '2 bags max' },
  { model: 'Comfort Van / MPV',  src: '/cars/comfort-van.png',    capacity: 'Up to 6', bags: '4 bags max' },
  { model: 'Business Sedan',     src: '/cars/business-sedan.png', capacity: 'Up to 3', bags: '3 bags max' },
  { model: 'Business Van / MPV', src: '/cars/business-van.png',   capacity: 'Up to 6', bags: '5 bags max' },
  { model: 'First Class',        src: '/cars/first-class.png',    capacity: 'Up to 2', bags: '3 bags max' },
];

type TokenRow = { labelKey: string; cssVar: string; tokenKey: string; fallback: string };

const TOKEN_TABLE_ROWS: TokenRow[] = [
  { labelKey: 'Surface (Fill=Yes)',  cssVar: '--atom-background-primary-bg-primary-inverse',  tokenKey: 'atom.background.primary.bg-primary-inverse',  fallback: '#ffffff' },
  { labelKey: 'Border',              cssVar: '--atom-border-default-border-default',          tokenKey: 'atom.border.default.border-default',          fallback: '#cdcbcb' },
  { labelKey: 'Divider (Fill=No)',   cssVar: '--atom-border-default-border-divider',          tokenKey: 'atom.border.default.border-divider',          fallback: '#cdcbcb' },
  { labelKey: 'Selected border',     cssVar: '--atom-border-selection-and-focus-border-selected', tokenKey: 'atom.border.selection-and-focus.border-selected', fallback: '#0a2333' },
  { labelKey: 'Title',               cssVar: '--atom-foreground-primary-fg-brand-primary',    tokenKey: 'atom.foreground.primary.fg-brand-primary',    fallback: '#0a2333' },
  { labelKey: 'Description / meta',  cssVar: '--atom-foreground-core-fg-secondary',           tokenKey: 'atom.foreground.core.fg-secondary',           fallback: '#737272' },
  { labelKey: 'Strike-through price', cssVar: '--atom-foreground-core-fg-tertiary',           tokenKey: 'atom.foreground.core.fg-tertiary',            fallback: '#afaead' },
];

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

export function TransportCardPage({ brand, lang = 'en' }: TransportCardPageProps) {
  const t = COPY[lang];
  const [type,   setType]   = useState<TransportCardType>('Selectable with price');
  const [state,  setState]  = useState<TransportCardState>('Default');
  const [bg,     setBg]     = useState<TransportCardBackground>('Yes');
  const [car,    setCar]    = useState<TransportCarModel>('Comfort Sedan');
  const [showInformation, setShowInformation] = useState(true);
  const [showPrices,      setShowPrices]      = useState(true);
  const [showRadio,       setShowRadio]       = useState(true);
  const [showCarImage,    setShowCarImage]    = useState(true);

  // Figma lock: Info only ships Default state.
  const effectiveState: TransportCardState = type === 'Info' ? 'Default' : state;
  const activeCar = CAR_MODELS.find(c => c.model === car) ?? CAR_MODELS[1];

  const previewKey = [type, effectiveState, bg, car, showInformation, showPrices, showRadio, showCarImage].join('-');
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  const booleanRefs = [
    { key: 'Information', value: showInformation, set: setShowInformation },
    { key: 'Prices', value: showPrices, set: setShowPrices },
    { key: 'Radio Button', value: showRadio, set: setShowRadio },
    { key: 'Car Image', value: showCarImage, set: setShowCarImage },
  ];

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-80">
            <div className="flex-1 flex items-center justify-center p-12 min-h-60" style={DOTTED_BG}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                >
                  <TransportCardLive
                    type={type}
                    state={effectiveState}
                    backgroundFill={bg}
                    carModel={activeCar.model}
                    carType={activeCar.model}
                    description1={activeCar.capacity}
                    description2={activeCar.bags}
                    showInformation={showInformation}
                    showPrices={showPrices}
                    showRadio={showRadio}
                    showCarImage={showCarImage}
                    brand={brand}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5 overflow-y-auto">

              {/* Type */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.typeLabel}</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_TYPES.map((typeOpt) => (
                    <button
                      key={typeOpt}
                      onClick={() => setType(typeOpt)}
                      className={[
                        'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        type === typeOpt
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {t.typeNames[typeOpt]}
                    </button>
                  ))}
                </div>
              </div>

              {/* State */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.stateLabel}</p>
                <div className={['flex flex-wrap gap-1.5', type === 'Info' ? 'opacity-50' : ''].join(' ')}>
                  {ALL_STATES.map((s) => (
                    <button
                      key={s}
                      onClick={() => type !== 'Info' && setState(s)}
                      disabled={type === 'Info'}
                      className={[
                        'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        effectiveState === s
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {t.stateNames[s]}
                    </button>
                  ))}
                </div>
                {type === 'Info' && (
                  <p className="text-[11px] text-slate-400 mt-1">{t.infoOnlyDefault}</p>
                )}
              </div>

              {/* Background Fill */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.bgLabel}</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_BG.map((b) => (
                    <button
                      key={b}
                      onClick={() => setBg(b)}
                      className={[
                        'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        bg === b
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {t.bgNames[b]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Car Model */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.carModelLabel}</p>
                <div className="flex flex-col gap-1">
                  {CAR_MODELS.map(({ model }) => (
                    <button
                      key={model}
                      onClick={() => setCar(model)}
                      className={[
                        'text-left px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        car === model
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>

              {/* Booleans */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.booleansLabel}</p>
                <div className="flex flex-col gap-1.5">
                  {booleanRefs.map(({ key, value, set }) => {
                    const labelText = t.booleanItems.find(b => b.key === key)?.label ?? key;
                    return (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => set(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 accent-slate-900"
                        />
                        <span className="text-xs text-slate-600">{labelText}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ────────────────────────────────────────────── */}
      <section>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{t.headline}</h1>
        <p className="text-[15px] text-slate-500 leading-relaxed mb-4 max-w-2xl">
          {t.tagline}
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-slate-200 bg-slate-50 text-xs text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            {t.domainPill}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-emerald-200 bg-emerald-50 text-xs text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {t.stablePill}
          </span>
        </div>
      </section>

      {/* ── 3. ANATOMY ───────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.anatomyHeading}</h2>
        <p className="text-sm text-slate-500 mb-4">{t.anatomyTagline}</p>
        <div className="grid md:grid-cols-2 gap-6 rounded-xl border border-slate-200 bg-white shadow-sm p-6">
          <div className="flex items-center justify-center p-6 rounded-lg border border-slate-100 bg-slate-50" style={DOTTED_BG}>
            <TransportCardLive
              type="Selectable with price"
              state="Default"
              backgroundFill="Yes"
              carModel="Comfort Sedan"
              carType="Comfort Sedan"
              description1="Up to 3"
              description2="2 bags max"
              brand={brand}
            />
          </div>
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-12">{t.hashHeader}</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">{t.labelHeader}</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.descriptionHeader}</th>
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

      {/* ── 4. VARIANTS ──────────────────────────────────────────────────── */}
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
              {[
                { label: t.rows.type,             chips: [{ text: t.typeNames.Info, note: t.defaultNote }, { text: t.typeNames['Selectable with price'], note: '' }] },
                { label: t.rows.state,            chips: [{ text: t.stateNames.Default, note: t.defaultNote }, { text: t.stateNames.Selected, note: t.selectableOnly }] },
                { label: t.rows.bg,               chips: [{ text: t.bgNames.Yes, note: t.defaultNote }, { text: t.bgNames.No, note: '' }] },
                { label: t.rows.booleans,         chips: [
                  { text: 'Item 1', note: '' }, { text: 'Item 2', note: '' }, { text: 'Car Image', note: '' },
                  { text: 'Price 1', note: '' }, { text: 'Price 2', note: '' }, { text: 'Prices', note: '' },
                  { text: 'Information', note: '' }, { text: 'Radio Button', note: '' },
                ] },
                { label: t.rows.textSlots,        chips: [
                  { text: 'Car Type', note: '' }, { text: 'Description 1', note: '' }, { text: 'Description 2', note: '' },
                  { text: 'Price 1 Text', note: '' }, { text: 'Price 2 Text', note: '' },
                ] },
                { label: t.rows.cars,             chips: CAR_MODELS.map(c => ({ text: c.model, note: '' })) },
                { label: t.rows.font,             chips: [...t.fontFamily] },
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

        {/* Visual preview grid — 6 concrete Figma permutations */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {[
            { label: 'Info · Default · Fill',             ty: 'Info'                    as TransportCardType, s: 'Default'  as TransportCardState, b: 'Yes' as TransportCardBackground },
            { label: 'Info · Default · No fill',          ty: 'Info'                    as TransportCardType, s: 'Default'  as TransportCardState, b: 'No'  as TransportCardBackground },
            { label: 'Selectable · Default · Fill',       ty: 'Selectable with price'   as TransportCardType, s: 'Default'  as TransportCardState, b: 'Yes' as TransportCardBackground },
            { label: 'Selectable · Default · No fill',    ty: 'Selectable with price'   as TransportCardType, s: 'Default'  as TransportCardState, b: 'No'  as TransportCardBackground },
            { label: 'Selectable · Selected · Fill',      ty: 'Selectable with price'   as TransportCardType, s: 'Selected' as TransportCardState, b: 'Yes' as TransportCardBackground },
            { label: 'Selectable · Selected · No fill',   ty: 'Selectable with price'   as TransportCardType, s: 'Selected' as TransportCardState, b: 'No'  as TransportCardBackground },
          ].map(({ label, ty, s, b }) => (
            <div key={label} style={{
              borderRadius: '12px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa',
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid #f3f4f6', backgroundColor: '#ffffff' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#374151' }}>{t.previewLabels[label] ?? label}</p>
              </div>
              <div style={{ flex: 1, padding: '28px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', ...DOTTED_BG }}>
                <TransportCardLive type={ty} state={s} backgroundFill={b} brand={brand} />
              </div>
            </div>
          ))}
        </div>

        {/* Car model reference strip */}
        <div style={{ marginTop: '24px' }}>
          <p style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {t.carIllustrationsLabel}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {CAR_MODELS.map(({ model, src, capacity, bags }) => (
              <div key={model} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 16px', borderRadius: '10px',
                backgroundColor: '#ffffff', border: '1px solid #e5e7eb',
              }}>
                <img src={src} alt="" aria-hidden="true" width={56} height={56}
                  style={{ width: '56px', height: '56px', objectFit: 'contain', flexShrink: 0 }}
                  draggable={false} />
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#0A2333', lineHeight: 1.3 }}>{model}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#6b7280' }}>{capacity} · {bags}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.tokensHeading}</h2>
        <p className="text-sm text-slate-500 mb-4">{t.tokensTagline}</p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">{t.tokenColumn}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.cssVarColumn}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">{t.valueColumn}</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_TABLE_ROWS.map((row, i) => {
                const resolvedValue = (tokens[row.tokenKey as keyof typeof tokens] as string | undefined) ?? row.fallback;
                const swatchHex = resolvedValue.length > 7 ? resolvedValue.slice(0, 7) : resolvedValue;
                const light = isLightColor(swatchHex);
                return (
                  <tr key={row.cssVar} className={i < TOKEN_TABLE_ROWS.length - 1 ? 'border-b border-slate-100' : ''}>
                    <td className="px-5 py-3 font-medium text-slate-700 text-xs">{t.tokenLabels[row.labelKey] ?? row.labelKey}</td>
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
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.a11yHeading}</h2>
        <p className="text-sm text-slate-500 mb-4">{t.a11yTagline}</p>
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
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{t.usageHeading}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.usageTagline}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>{t.whenToUseLabel}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              {t.whenToUse.map((line, i, arr) => (
                <li key={i} style={{ marginBottom: i < arr.length - 1 ? '6px' : 0 }}>• {line}</li>
              ))}
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>{t.whenNotToUseLabel}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              {t.whenNotToUse.map((line, i, arr) => (
                <li key={i} style={{ marginBottom: i < arr.length - 1 ? '6px' : 0 }}>• {line}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
