import { Link } from 'react-router-dom';
import { type Brand, BRANDS, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';
import { getCustomBrandSnapshot } from '../hooks/useCustomBrand';
import { ButtonLive } from '../components/button/ButtonLive';
import { BadgeLive } from '../components/badge/BadgeLive';
import { TagsLive } from '../components/tags/TagsLive';

interface BrandFoundationsPageProps {
  brand: Brand;
  lang?: Language;
}

// ─── Bilingual copy block ─────────────────────────────────────────────────
const COPY = {
  en: {
    chip: 'Foundations · Brand',
    brandsShipToday1: '',
    brandsShipToday2: ' brands ship today',
    heroLine1: 'Every brand',
    heroLine2: 'starts here.',
    heroLead:
      "Brand Foundations are where each brand's identity enters the design system — colours, typography, and icons. Atom translates those raw ingredients into semantic tokens that every component can wear.",
    activeFoundationLabel: 'Currently active foundation',
    foundationLabel: 'Foundation',
    primaryLabel: 'Primary',
    btnBrandAction: 'Brand action',
    badgeLive: 'Live',
    tagBrandAware: 'Brand-aware',
    insideTitle: "What's inside a foundation",
    insideLead:
      'Three ingredients combine to give every brand its voice. Atom translates each one into tokens so components inherit the brand automatically.',
    coloursTitle: 'Colours',
    coloursDescription:
      'The complete colour vocabulary — primaries, surfaces, and feedback states. Every value maps to a semantic token.',
    typographyTitle: 'Typography',
    typographyDescription:
      'Font families, weights, and a type scale that creates clear visual hierarchy across every screen.',
    typographyDisplay: 'Display headline',
    typographyBody: 'Body copy at the regular reading size.',
    typographyCaption: 'Caption · 11px',
    iconSetTitle: 'Icon Set',
    iconSetDescription:
      'A curated set of brand-approved icons in outline, filled, and functional styles. Designed to work at every size in the system.',
    paletteSwatches: {
      primary: 'Primary',
      brandFg: 'Brand FG',
      success: 'Success',
      warning: 'Warning',
      error: 'Error',
      info: 'Info',
    },
    glanceTitle: 'Six foundations. One system.',
    glanceLead:
      'Every brand below ships with Atom today. Adding the next one is a configuration change, not a redesign.',
    statusActive: 'Active',
    statusSwitchToPreview: 'Switch to preview',
    fromFoundationTitle: 'From foundation to component',
    fromFoundationLead:
      'A foundation file becomes a live component in three hops. None of them ever touch the component itself.',
    stepLabel: 'Step',
    step1Title: 'Foundation file',
    step1Description: 'Brand provides palette, type, and icons.',
    step2Title: 'Semantic tokens',
    step2Description: 'Atom translates raw values into semantic roles.',
    step3Title: 'Live component',
    step3Description: 'Components consume tokens — never raw values.',
    step3ButtonLabel: 'Brand',
    usageTitle: 'How foundations are used',
    usageLead: 'From raw brand assets to a fully themed product in four moves.',
    usageSteps: [
      'The brand supplies a foundation file containing its colour palette, typography choices, and icon set.',
      'The Atom team loads these foundations into the Brand Switcher, translating raw values into semantic tokens.',
      "Every component pulls from the token layer, so the brand's identity flows through automatically — no overrides.",
      'Designers and developers assemble the final branded experience by composing existing Atom components.',
    ],
    whyTitle: 'Why foundations matter',
    whyLead:
      'The discipline of putting brand decisions inside foundations pays off across the entire product lifecycle.',
    whyItems: [
      {
        title: 'Single source of truth',
        description:
          'Every brand decision lives in one place, eliminating style drift and one-off overrides.',
      },
      {
        title: 'Shared component library',
        description:
          'Multiple brands share the same React package — no forking, no parallel bug fixes, no duplicated code.',
      },
      {
        title: 'Instant brand switching',
        description:
          'Swap the foundation file and the entire product re-themes. Demos and prototypes become trivial.',
      },
      {
        title: 'Lower long-term cost',
        description:
          'Centralising brand decisions cuts maintenance, audits, and the surface area for visual bugs over time.',
      },
      {
        title: 'Scales with the business',
        description:
          'Go from two brands to twenty without redesigning a single component or rewriting a single line of CSS.',
      },
      {
        title: 'Accessibility by default',
        description:
          'Every brand pairing is contrast-tested before it ships, so accessibility never gets bolted on later.',
      },
    ],
    finalTitle: 'See foundations in motion',
    finalLead:
      'Once foundations are loaded, the Brand Switcher takes over — and every component in the library re-themes instantly.',
    finalPrimary: 'Explore Brand Switcher',
    finalSecondary: 'Browse components',
  },
  zh: {
    chip: '基础 · 品牌',
    brandsShipToday1: '当前共发布 ',
    brandsShipToday2: ' 个品牌',
    heroLine1: '每个品牌',
    heroLine2: '从这里开始。',
    heroLead:
      '品牌基础是每个品牌的标识进入设计系统的地方——颜色、字体和图标。Atom 将这些原始要素转换为每个组件都可以使用的语义化设计令牌。',
    activeFoundationLabel: '当前激活的基础',
    foundationLabel: '基础',
    primaryLabel: '主色',
    btnBrandAction: '品牌操作',
    badgeLive: '实时',
    tagBrandAware: '品牌感知',
    insideTitle: '基础包含哪些内容',
    insideLead:
      '三种要素结合，赋予每个品牌独特的声音。Atom 将每一种都转换为设计令牌，使组件自动继承品牌特性。',
    coloursTitle: '颜色',
    coloursDescription:
      '完整的颜色词汇——主色、表面色和反馈状态色。每一个值都映射到一个语义化设计令牌。',
    typographyTitle: '字体',
    typographyDescription:
      '字体家族、字重和字号比例，在每个屏幕上建立清晰的视觉层级。',
    typographyDisplay: '展示标题',
    typographyBody: '正文文本的常规阅读大小。',
    typographyCaption: '说明文字 · 11px',
    iconSetTitle: '图标集',
    iconSetDescription:
      '一套精心策划的品牌认可图标，包括描边、填充和功能样式。专为系统中所有尺寸设计。',
    paletteSwatches: {
      primary: '主要',
      brandFg: '品牌前景',
      success: '成功',
      warning: '警告',
      error: '错误',
      info: '信息',
    },
    glanceTitle: '六个基础。一个系统。',
    glanceLead:
      '下方所有品牌目前都随 Atom 一同发布。新增下一个品牌只是配置变更，而非重新设计。',
    statusActive: '活跃',
    statusSwitchToPreview: '切换以预览',
    fromFoundationTitle: '从基础到组件',
    fromFoundationLead:
      '一个基础文件经过三步成为实时组件。其中没有任何一步会触及组件本身。',
    stepLabel: '步骤',
    step1Title: '基础文件',
    step1Description: '品牌提供调色板、字体和图标。',
    step2Title: '语义化设计令牌',
    step2Description: 'Atom 将原始值转换为语义化角色。',
    step3Title: '实时组件',
    step3Description: '组件消费设计令牌——绝不使用原始值。',
    step3ButtonLabel: '品牌',
    usageTitle: '基础如何使用',
    usageLead: '从原始品牌资产到完全主题化的产品，仅需四步。',
    usageSteps: [
      '品牌提供一个基础文件，包含其调色板、字体选择和图标集。',
      'Atom 团队将这些基础加载到 Brand Switcher 中，将原始值转换为语义化设计令牌。',
      '每个组件从设计令牌层获取数据，品牌标识自动贯穿整个系统——无需覆盖。',
      '设计师和开发者通过组合现有的 Atom 组件，构建最终的品牌体验。',
    ],
    whyTitle: '为什么基础如此重要',
    whyLead: '将品牌决策置于基础之中的实践，将在整个产品生命周期中持续受益。',
    whyItems: [
      {
        title: '单一可信来源',
        description: '每一个品牌决策都集中在一处，消除样式漂移和一次性覆盖。',
      },
      {
        title: '共享组件库',
        description:
          '多个品牌共享同一个 React 包——无需分叉、无并行的 Bug 修复、无重复代码。',
      },
      {
        title: '即时品牌切换',
        description: '替换基础文件，整个产品就会重新换肤。演示和原型变得非常简单。',
      },
      {
        title: '降低长期成本',
        description: '集中化品牌决策能降低维护、审计成本，并随时间减少视觉 Bug 的风险面。',
      },
      {
        title: '与业务一同扩展',
        description:
          '从两个品牌扩展到二十个，无需重新设计任何组件或重写任何一行 CSS。',
      },
      {
        title: '默认可访问性',
        description:
          '每个品牌组合在发布前都经过对比度测试，可访问性绝不会被事后添加。',
      },
    ],
    finalTitle: '查看基础的运行方式',
    finalLead:
      '一旦基础加载完成，Brand Switcher 就会接管——库中的每个组件都会即时重新换肤。',
    finalPrimary: '探索 Brand Switcher',
    finalSecondary: '浏览组件',
  },
} as const;

// ─── Shared dotted preview surface ────────────────────────────────────────
const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// ─── Brand initial for the placeholder logo mark ──────────────────────────
const BRAND_INITIAL: Record<Brand, string> = {
  dragonpass: 'D',
  mastercard: 'M',
  investec:   'I',
  visa:       'V',
  greyscale:  'G',
  assurant:   'A',
  custom:     'C',
};

// ─── Colour palette to surface for the current brand ─────────────────────
const PALETTE_SWATCHES = [
  { key: 'atom.background.primary.bg-primary-default' as const, labelKey: 'primary' as const },
  { key: 'atom.foreground.primary.fg-brand-primary'   as const, labelKey: 'brandFg' as const },
  { key: 'atom.foreground.feedback.fg-success'        as const, labelKey: 'success' as const },
  { key: 'atom.foreground.feedback.fg-warning'        as const, labelKey: 'warning' as const },
  { key: 'atom.foreground.feedback.fg-error'          as const, labelKey: 'error' as const },
  { key: 'atom.foreground.feedback.fg-info'           as const, labelKey: 'info' as const },
] as const;

// ─── Stroke-based icon set preview ────────────────────────────────────────
const ICON_PATHS = [
  'M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z', // search
  'M5 13l4 4L19 7',                                       // check
  'M5 12h14M12 5l7 7-7 7',                                // arrow right
  'M12 5v14M5 12h14',                                     // plus
];

export function BrandFoundationsPage({ brand, lang = 'en' }: BrandFoundationsPageProps) {
  const t = COPY[lang];
  const resolved = RESOLVED_SEMANTIC_TOKENS[brand];
  const custom = brand === 'custom' ? getCustomBrandSnapshot() : null;
  const currentBrand = custom
    ? { id: 'custom' as const, label: custom.name, primary: custom.primitives.brandPrimary }
    : (BRANDS.find((b) => b.id === brand) ?? BRANDS[0]);
  const initial = custom ? (custom.name.charAt(0).toUpperCase() || 'C') : BRAND_INITIAL[brand];

  return (
    <div className="space-y-20">
      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: 'var(--color-brand)' }}
            />
            {t.chip}
          </span>
          <span className="text-[11px] text-slate-400">
            {t.brandsShipToday1}{BRANDS.length}{t.brandsShipToday2}
          </span>
        </div>

        <h1 className="text-[40px] leading-[1.1] font-bold text-slate-900 tracking-tight mb-4">
          {t.heroLine1}
          <br />
          <span style={{ color: 'var(--color-brand)' }}>{t.heroLine2}</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
          {t.heroLead}
        </p>
      </section>

      {/* ──────────── LIVE BRAND SHOWCASE CARD ──────────── */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
          {t.activeFoundationLabel}
        </h2>
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          {/* Header strip — rendered in current brand colour */}
          <div
            className="px-6 py-5 flex items-center gap-4"
            style={{ backgroundColor: 'var(--color-brand)' }}
          >
            <div className="w-12 h-12 rounded-lg bg-white/15 flex items-center justify-center text-white text-2xl font-bold">
              {initial}
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
                {t.foundationLabel}
              </div>
              <div className="text-2xl font-bold text-white">
                {currentBrand.label}
              </div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
                {t.primaryLabel}
              </div>
              <div className="text-sm font-mono text-white/95">
                {currentBrand.primary}
              </div>
            </div>
          </div>
          {/* Live components on dotted surface */}
          <div className="p-8" style={DOTTED_BG}>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <ButtonLive
                buttonType="Full Button"
                variant="Primary"
                size="Default"
                state="Default"
                label={t.btnBrandAction}
                showLabel
                showIconLeft={false}
                showIconRight={false}
                brand={brand}
              />
              <BadgeLive
                state="Brand"
                curveRadius="Standard"
                label={t.badgeLive}
                showIconLeft={false}
                showIconRight={false}
                brand={brand}
              />
              <TagsLive
                state="Selected"
                label={t.tagBrandAware}
                showIconLeft
                showIconRight={false}
                brand={brand}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ──────────── WHAT'S INSIDE A FOUNDATION ──────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t.insideTitle}
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          {t.insideLead}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* 01 · Colours */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                01
              </span>
              <h3 className="text-base font-semibold text-slate-900">{t.coloursTitle}</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {t.coloursDescription}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {PALETTE_SWATCHES.map((s) => (
                <div key={s.key} className="flex flex-col items-center gap-1">
                  <div
                    className="w-full h-12 rounded-md border border-slate-200"
                    style={{ backgroundColor: resolved[s.key] }}
                  />
                  <span className="text-[10px] font-mono text-slate-400">
                    {t.paletteSwatches[s.labelKey]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 02 · Typography */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                02
              </span>
              <h3 className="text-base font-semibold text-slate-900">{t.typographyTitle}</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {t.typographyDescription}
            </p>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
              <div
                className="text-5xl font-bold leading-none mb-3"
                style={{ color: 'var(--color-brand)' }}
              >
                Aa
              </div>
              <div className="text-xl font-semibold text-slate-900 leading-tight mb-1">
                {t.typographyDisplay}
              </div>
              <div className="text-sm text-slate-700 mb-1">
                {t.typographyBody}
              </div>
              <div className="text-[11px] text-slate-400">{t.typographyCaption}</div>
            </div>
          </div>

          {/* 03 · Icons */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                03
              </span>
              <h3 className="text-base font-semibold text-slate-900">{t.iconSetTitle}</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {t.iconSetDescription}
            </p>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 flex items-center justify-around">
              {ICON_PATHS.map((path, i) => (
                <svg
                  key={i}
                  className="w-7 h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="var(--color-brand)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={path} />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────── ALL BRANDS AT A GLANCE ──────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t.glanceTitle}
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          {t.glanceLead}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {BRANDS.map((b) => {
            const isActive = b.id === brand;
            return (
              <div
                key={b.id}
                className={`rounded-xl border bg-white p-4 transition-all ${
                  isActive ? 'border-slate-900 shadow-md' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-base font-bold text-white shrink-0"
                    style={{ backgroundColor: b.primary }}
                  >
                    {BRAND_INITIAL[b.id]}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">
                      {b.label}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 truncate">
                      {b.primary}
                    </div>
                  </div>
                </div>
                {isActive ? (
                  <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {t.statusActive}
                  </div>
                ) : (
                  <div className="text-[10px] font-medium text-slate-400">
                    {t.statusSwitchToPreview}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ──────────── FROM FOUNDATION TO COMPONENT ──────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t.fromFoundationTitle}
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          {t.fromFoundationLead}
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Step 1 · Foundation file */}
          <div className="relative">
            <div className="rounded-xl border border-slate-200 bg-white p-5 h-full">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                {t.stepLabel} 1
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                {t.step1Title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {t.step1Description}
              </p>
              <div className="rounded-md bg-slate-900 p-3 font-mono text-[11px] text-slate-300 leading-relaxed">
                <div>
                  <span className="text-slate-500">primary:</span>{' '}
                  <span className="text-amber-300">"{currentBrand.primary}"</span>
                </div>
                <div>
                  <span className="text-slate-500">font:</span>{' '}
                  <span className="text-amber-300">"Inter"</span>
                </div>
                <div>
                  <span className="text-slate-500">radius:</span>{' '}
                  <span className="text-amber-300">8</span>
                </div>
              </div>
            </div>
            {/* Arrow connector (lg only) */}
            <div className="hidden lg:flex absolute top-1/2 -right-2 -translate-y-1/2 z-10">
              <svg
                className="w-4 h-4 text-slate-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </div>
          </div>

          {/* Step 2 · Semantic tokens */}
          <div className="relative">
            <div className="rounded-xl border border-slate-200 bg-white p-5 h-full">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                {t.stepLabel} 2
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                {t.step2Title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {t.step2Description}
              </p>
              <div className="rounded-md bg-slate-900 p-3 font-mono text-[11px] text-slate-300 leading-relaxed">
                <div>
                  <span className="text-slate-500">bg-primary-default:</span>
                </div>
                <div className="ml-2">
                  <span className="text-emerald-300">
                    "{resolved['atom.background.primary.bg-primary-default']}"
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">fg-brand-primary:</span>
                </div>
                <div className="ml-2">
                  <span className="text-emerald-300">
                    "{resolved['atom.foreground.primary.fg-brand-primary']}"
                  </span>
                </div>
              </div>
            </div>
            {/* Arrow connector (lg only) */}
            <div className="hidden lg:flex absolute top-1/2 -right-2 -translate-y-1/2 z-10">
              <svg
                className="w-4 h-4 text-slate-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </div>
          </div>

          {/* Step 3 · Live component */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              {t.stepLabel} 3
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-2">
              {t.step3Title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {t.step3Description}
            </p>
            <div
              className="rounded-md p-4 flex items-center justify-center min-h-[88px]"
              style={DOTTED_BG}
            >
              <ButtonLive
                buttonType="Full Button"
                variant="Primary"
                size="Tiny"
                state="Default"
                label={t.step3ButtonLabel}
                showLabel
                showIconLeft={false}
                showIconRight={false}
                brand={brand}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ──────────── HOW FOUNDATIONS ARE USED ──────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t.usageTitle}
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          {t.usageLead}
        </p>
        <ol className="space-y-4">
          {t.usageSteps.map((step, i) => (
            <li
              key={i}
              className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5"
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                style={{ backgroundColor: 'var(--color-brand)' }}
              >
                {i + 1}
              </span>
              <span className="text-sm text-slate-700 leading-relaxed pt-1">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* ──────────── WHY IT MATTERS ──────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t.whyTitle}
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          {t.whyLead}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {t.whyItems.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <h3 className="text-base font-semibold text-slate-900 mb-1.5">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────── FINAL CTA ──────────── */}
      <section>
        <div
          className="rounded-2xl border border-slate-200 p-8 sm:p-10 text-center"
          style={{
            backgroundImage:
              'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          }}
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {t.finalTitle}
          </h2>
          <p className="text-base text-slate-600 mb-6 max-w-xl mx-auto">
            {t.finalLead}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/foundations/brand-switcher"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-brand)' }}
            >
              {t.finalPrimary}
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
            <Link
              to="/components/button"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {t.finalSecondary}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
