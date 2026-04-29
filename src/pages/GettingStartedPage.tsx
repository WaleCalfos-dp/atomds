import { Link } from 'react-router-dom';
import { type Brand, BRANDS } from '../data/tokens';
import { type Language } from '../data/languages';
import { ButtonLive } from '../components/button/ButtonLive';
import { BadgeLive } from '../components/badge/BadgeLive';
import { TagsLive } from '../components/tags/TagsLive';
import { SwitchLive } from '../components/switch/SwitchLive';

interface GettingStartedPageProps {
  brand: Brand;
  lang?: Language;
}

// ─── Bilingual copy block ─────────────────────────────────────────────────
const COPY = {
  en: {
    chip: 'Atom Design System · v1.0',
    updated: 'Updated April 2026',
    heroLine1: 'One design system.',
    heroLine2: 'Every brand we serve.',
    heroLead:
      'Atom is the shared language between design and engineering — a unified set of components, tokens, and guidelines that adapt to any brand without rebuilding a thing.',
    ctaPrimary: 'Start with Foundations',
    ctaSecondary: 'Browse components',
    livePreview: 'Live preview',
    currentlyShowing1: 'Currently showing ',
    currentlyShowing2:
      '. Switch brands in the top right to see every component re-theme instantly.',
    btnGetStarted: 'Get started',
    badgeNew: 'New',
    tagBrandAware: 'Brand-aware',
    switchMultiBrand: 'Multi-brand',
    livePreviewFooter1: 'One component. ',
    livePreviewFooter2: ' brands. Zero hard-coded values.',
    startHere: 'Start here',
    readMore: 'Read more',
    quickStart: [
      {
        to: '/foundations/brand-foundations',
        eyebrow: 'Foundations',
        title: 'Brand Foundations',
        description:
          'Learn how every brand plugs into the system through a single foundation file.',
        minutes: '3 min read',
      },
      {
        to: '/foundations/brand-switcher',
        eyebrow: 'Foundations',
        title: 'Brand Switcher',
        description:
          'See how semantic tokens make every component instantly multi-brand.',
        minutes: '5 min read',
      },
      {
        to: '/components/button',
        eyebrow: 'Components',
        title: 'Component Library',
        description:
          'Explore 13 production-ready components, all documented and brand-aware.',
        minutes: 'Browse',
      },
      {
        to: '/foundations/spacing',
        eyebrow: 'Foundations',
        title: 'Spacing & Borders',
        description:
          'Master the 8px scale and border weights that hold every layout together.',
        minutes: '2 min read',
      },
    ],
    principlesTitle: 'What makes Atom different',
    principlesLead:
      'Four ideas hold the system together. Together they free teams to focus on what actually makes each brand experience unique.',
    principles: [
      {
        title: 'Tokens, not values',
        description:
          'Every colour, space, and weight resolves through a semantic token. Components never know what brand they are wearing.',
      },
      {
        title: 'Multi-brand by default',
        description:
          'Six brands ship with the system today. Adding a seventh is a configuration change, not a redesign.',
      },
      {
        title: 'Accessibility built-in',
        description:
          'Every token pairing is contrast-tested. Every interactive state has a visible focus. Every component is keyboard-reachable.',
      },
      {
        title: 'Design ↔ code lockstep',
        description:
          'The Figma library and the React package share the same token names. What you see in design is what you ship.',
      },
    ],
    audiencesTitle: 'Who Atom is for',
    audiencesLead:
      'Whatever your role, there is a way into the system. Pick the entry point that matches how you work.',
    audiences: [
      {
        title: 'Designers',
        description:
          'Use the Figma library to assemble brand-ready screens with components that already match production.',
        cta: 'Start with Brand Foundations',
        to: '/foundations/brand-foundations',
      },
      {
        title: 'Developers',
        description:
          'Drop in token-driven React components that stay in sync with design intent — no translation layer.',
        cta: 'Browse the components',
        to: '/components/button',
      },
      {
        title: 'Product managers',
        description:
          'Reference a shared vocabulary when scoping features. The building blocks already exist and are battle-tested.',
        cta: 'Learn how Atom works',
        to: '/foundations/brand-switcher',
      },
      {
        title: 'QA engineers',
        description:
          'Test against documented behaviours and token values rather than screenshots that drift across brands.',
        cta: 'See component anatomy',
        to: '/components/alert',
      },
    ],
    usageTitle: 'Using Atom in your work',
    usageLead:
      'Four steps from a blank file to a brand-ready screen — whether you are in Figma or in code.',
    usageSteps: [
      'Import the Brand Switcher and Atom libraries into your Figma file or React project.',
      'Pick the brand you are designing or building for — every component will instantly re-theme.',
      'Compose screens from Atom components. Stick to the documented variants; they are the tested set.',
      "Reference each component's anatomy and accessibility notes before shipping.",
    ],
    updatesTitle: 'How updates flow',
    updatesLead:
      'Atom evolves through coordinated releases. No one ships a visual change without the other side knowing about it.',
    stepLabel: 'Step',
    updateFlow: [
      {
        title: 'Design proposes',
        description:
          'A change starts in Figma. The component or token is updated and the library is published.',
      },
      {
        title: 'Code mirrors',
        description:
          'The matching React package is updated so design intent reaches production unchanged.',
      },
      {
        title: 'Teams adopt',
        description:
          'Module teams pick up the latest version in their next release. No silent breakages.',
      },
      {
        title: 'Docs catch up',
        description:
          'This site is updated after every release so it always reflects the current truth.',
      },
    ],
    contributeTitle: 'How to contribute',
    contributeLead:
      'Atom is built by the teams that use it. Spotting a gap is the first step toward improving the system for everyone.',
    contributeSteps: [
      'Spot a gap or a recurring need — raise it in the Atom Design System channel with real examples.',
      'Draft a small, focused proposal describing the change and its expected impact across brands.',
      'Design and engineering review the proposal together to confirm feasibility and consistency.',
      'Build, test across every brand, ship, and update this documentation so the knowledge spreads.',
    ],
    statusTitle: 'Component status',
    statusLead: 'Every component below is production-ready and brand-aware.',
    componentsLabel: 'components',
    statusStable: 'Stable',
    finalTitle: 'Ready to start building?',
    finalLead:
      'Open the foundations, pick a component, and ship a brand-ready experience today. The system handles the rest.',
    finalPrimary: 'Open Brand Foundations',
    finalSecondary: 'Jump to components',
  },
  zh: {
    chip: 'Atom 设计系统 · v1.0',
    updated: '更新于 2026 年 4 月',
    heroLine1: '一套设计系统。',
    heroLine2: '服务每个品牌。',
    heroLead:
      'Atom 是设计与工程之间的共同语言——一套统一的组件、设计令牌和规范，无需重新构建即可适配任何品牌。',
    ctaPrimary: '从基础开始',
    ctaSecondary: '浏览组件',
    livePreview: '实时预览',
    currentlyShowing1: '当前显示 ',
    currentlyShowing2: '。在右上角切换品牌，即可看到每个组件即时重新换肤。',
    btnGetStarted: '开始使用',
    badgeNew: '新',
    tagBrandAware: '品牌感知',
    switchMultiBrand: '多品牌',
    livePreviewFooter1: '一个组件。',
    livePreviewFooter2: ' 个品牌。零硬编码值。',
    startHere: '从这里开始',
    readMore: '阅读更多',
    quickStart: [
      {
        to: '/foundations/brand-foundations',
        eyebrow: '基础',
        title: '品牌基础',
        description: '了解每个品牌如何通过单一基础文件接入系统。',
        minutes: '3 分钟阅读',
      },
      {
        to: '/foundations/brand-switcher',
        eyebrow: '基础',
        title: '品牌切换器',
        description: '了解语义化设计令牌如何让每个组件即时支持多品牌。',
        minutes: '5 分钟阅读',
      },
      {
        to: '/components/button',
        eyebrow: '组件',
        title: '组件库',
        description: '探索 13 个生产就绪、文档完备且支持品牌切换的组件。',
        minutes: '浏览',
      },
      {
        to: '/foundations/spacing',
        eyebrow: '基础',
        title: '间距与边框',
        description: '掌握支撑每个布局的 8px 比例与边框粗细。',
        minutes: '2 分钟阅读',
      },
    ],
    principlesTitle: 'Atom 的与众不同之处',
    principlesLead:
      '四个理念将整个系统贯穿。它们让团队能够专注于真正使每个品牌体验独特的事物。',
    principles: [
      {
        title: '令牌，而非数值',
        description:
          '每种颜色、间距和粗细都通过语义化令牌解析。组件从不知道自己穿着哪个品牌的外衣。',
      },
      {
        title: '默认多品牌',
        description: '系统目前内置六个品牌。新增第七个品牌只需配置变更，无需重新设计。',
      },
      {
        title: '内置可访问性',
        description:
          '每对令牌都经过对比度测试。每个交互状态都有可见焦点。每个组件都可通过键盘访问。',
      },
      {
        title: '设计 ↔ 代码同步',
        description:
          'Figma 库与 React 包共享相同的令牌名称。设计中所见即生产中所发。',
      },
    ],
    audiencesTitle: 'Atom 适合谁',
    audiencesLead: '无论你扮演什么角色，都有进入系统的方式。选择最适合你工作方式的入口。',
    audiences: [
      {
        title: '设计师',
        description: '使用 Figma 库，通过已与生产保持一致的组件组装品牌就绪的界面。',
        cta: '从品牌基础开始',
        to: '/foundations/brand-foundations',
      },
      {
        title: '开发者',
        description: '直接使用基于令牌的 React 组件，与设计意图保持同步——无需转换层。',
        cta: '浏览组件',
        to: '/components/button',
      },
      {
        title: '产品经理',
        description:
          '在规划功能时引用共同词汇。基础组件已就绪并经过实战检验。',
        cta: '了解 Atom 的工作原理',
        to: '/foundations/brand-switcher',
      },
      {
        title: 'QA 工程师',
        description:
          '基于文档化的行为和令牌值进行测试，而非依赖在不同品牌间漂移的截图。',
        cta: '查看组件结构剖析',
        to: '/components/alert',
      },
    ],
    usageTitle: '在工作中使用 Atom',
    usageLead: '四步从空白文件到品牌就绪的界面——无论你身处 Figma 还是代码中。',
    usageSteps: [
      '将 Brand Switcher 和 Atom 库导入到你的 Figma 文件或 React 项目中。',
      '选择你正在设计或构建的目标品牌——每个组件都会即时重新换肤。',
      '使用 Atom 组件组装界面。坚持使用已记录的变体；它们是经过测试的集合。',
      '在交付之前查阅每个组件的结构剖析和可访问性说明。',
    ],
    updatesTitle: '更新如何流转',
    updatesLead:
      'Atom 通过协调发布持续演进。任何视觉变更上线前，另一方都会知晓。',
    stepLabel: '步骤',
    updateFlow: [
      {
        title: '设计提出',
        description: '变更从 Figma 开始。组件或令牌被更新，库随后发布。',
      },
      {
        title: '代码同步',
        description: '相应的 React 包被更新，使设计意图原样到达生产环境。',
      },
      {
        title: '团队采纳',
        description: '各模块团队在下一次发布中升级到最新版本。不会有静默的破坏性变更。',
      },
      {
        title: '文档跟进',
        description: '本网站在每次发布后更新，始终反映当前的真实情况。',
      },
    ],
    contributeTitle: '如何贡献',
    contributeLead:
      'Atom 由使用它的团队共同构建。发现空白是改进系统、惠及所有人的第一步。',
    contributeSteps: [
      '发现空白或反复出现的需求——在 Atom Design System 频道用真实案例提出。',
      '起草一份小而聚焦的提案，描述变更内容及其在各品牌间的预期影响。',
      '设计与工程共同评审提案，以确认可行性与一致性。',
      '构建、跨所有品牌测试、发布并更新本文档，让知识得以传播。',
    ],
    statusTitle: '组件状态',
    statusLead: '下方列出的每个组件都已生产就绪并支持品牌切换。',
    componentsLabel: '个组件',
    statusStable: '稳定版',
    finalTitle: '准备好开始构建了吗？',
    finalLead:
      '打开基础、选择组件，今天就交付一段品牌就绪的体验。其余的交给系统处理。',
    finalPrimary: '打开品牌基础',
    finalSecondary: '跳转到组件',
  },
} as const;

// ─── Shared dotted preview surface (matches component pages) ──────────────
const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// ─── Component status (component names left untranslated; they're proper nouns
//     and link targets — sidebar already provides translated names) ────────
const COMPONENT_STATUS = [
  { name: 'Alert', to: '/components/alert' },
  { name: 'Badge', to: '/components/badge' },
  { name: 'Button', to: '/components/button' },
  { name: 'Checkbox', to: '/components/checkbox' },
  { name: 'Divider', to: '/components/divider' },
  { name: 'Input', to: '/components/input' },
  { name: 'Line Item', to: '/components/line-item' },
  { name: 'Progress Indicator', to: '/components/progress-indicator' },
  { name: 'Steps', to: '/components/steps' },
  { name: 'Switch', to: '/components/switch' },
  { name: 'Tabs', to: '/components/tabs' },
  { name: 'Tags', to: '/components/tags' },
  { name: 'Tooltip', to: '/components/tooltip' },
] as const;

const COMPONENT_NAME_ZH: Record<string, string> = {
  Alert: '警告',
  Badge: '徽章',
  Button: '按钮',
  Checkbox: '复选框',
  Divider: '分割线',
  Input: '输入框',
  'Line Item': '行项目',
  'Progress Indicator': '进度指示器',
  Steps: '步骤',
  Switch: '开关',
  Tabs: '选项卡',
  Tags: '标签',
  Tooltip: '工具提示',
};

export function GettingStartedPage({ brand, lang = 'en' }: GettingStartedPageProps) {
  const t = COPY[lang];
  const currentBrand = BRANDS.find((b) => b.id === brand) ?? BRANDS[0];

  return (
    <div className="space-y-20">
      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600"
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: 'var(--color-brand)' }}
            />
            {t.chip}
          </span>
          <span className="text-[11px] text-slate-400">{t.updated}</span>
        </div>

        <h1 className="text-[40px] leading-[1.1] font-bold text-slate-900 tracking-tight mb-4">
          {t.heroLine1}
          <br />
          <span style={{ color: 'var(--color-brand)' }}>{t.heroLine2}</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mb-8">
          {t.heroLead}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/foundations/brand-foundations"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-brand)' }}
          >
            {t.ctaPrimary}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <Link
            to="/components/button"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t.ctaSecondary}
          </Link>
        </div>
      </section>

      {/* ──────────────── LIVE BRAND DEMO STRIP ──────────────── */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              {t.livePreview}
            </h2>
            <p className="text-base text-slate-700">
              {t.currentlyShowing1}
              <span className="font-semibold" style={{ color: 'var(--color-brand)' }}>
                {currentBrand.label}
              </span>
              {t.currentlyShowing2}
            </p>
          </div>
        </div>

        <div
          className="rounded-2xl border border-slate-200 p-10"
          style={DOTTED_BG}
        >
          <div className="flex flex-wrap items-center justify-center gap-8">
            <ButtonLive
              buttonType="Full Button"
              variant="Primary"
              size="Default"
              state="Default"
              label={t.btnGetStarted}
              showLabel
              showIconLeft={false}
              showIconRight={false}
              brand={brand}
            />
            <BadgeLive
              state="Brand"
              curveRadius="Standard"
              label={t.badgeNew}
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
            <SwitchLive on label={t.switchMultiBrand} brand={brand} />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
          {t.livePreviewFooter1}{BRANDS.length}{t.livePreviewFooter2}
        </div>
      </section>

      {/* ─────────────────── QUICK START TILES ─────────────────── */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
          {t.startHere}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {t.quickStart.map((tile) => (
            <Link
              key={tile.to}
              to={tile.to}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {tile.eyebrow}
                </span>
                <span className="text-[11px] text-slate-400">{tile.minutes}</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1.5 group-hover:text-slate-700">
                {tile.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                {tile.description}
              </p>
              <span
                className="inline-flex items-center gap-1 text-xs font-semibold"
                style={{ color: 'var(--color-brand)' }}
              >
                {t.readMore}
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─────────────────── PRINCIPLES ─────────────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{t.principlesTitle}</h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">{t.principlesLead}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {t.principles.map((p, i) => (
            <div
              key={p.title}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white mb-3"
                style={{ backgroundColor: 'var(--color-brand)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-1.5">
                {p.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────── AUDIENCES ─────────────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{t.audiencesTitle}</h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">{t.audiencesLead}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {t.audiences.map((a) => (
            <div
              key={a.title}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-5"
            >
              <h3 className="text-base font-semibold text-slate-900 mb-1.5">
                {a.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
                {a.description}
              </p>
              <Link
                to={a.to}
                className="inline-flex items-center gap-1 text-xs font-semibold"
                style={{ color: 'var(--color-brand)' }}
              >
                {a.cta}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────── HOW TO USE ─────────────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{t.usageTitle}</h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">{t.usageLead}</p>
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

      {/* ─────────────────── HOW UPDATES WORK ─────────────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{t.updatesTitle}</h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">{t.updatesLead}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {t.updateFlow.map((stage, i) => (
            <div key={stage.title} className="relative">
              <div className="rounded-xl border border-slate-200 bg-white p-5 h-full">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  {t.stepLabel} {i + 1}
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-1.5">
                  {stage.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {stage.description}
                </p>
              </div>
              {i < t.updateFlow.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-2 -translate-y-1/2 z-10">
                  <svg
                    className="w-4 h-4 text-slate-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────── HOW TO CONTRIBUTE ─────────────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{t.contributeTitle}</h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">{t.contributeLead}</p>
        <ol className="space-y-4">
          {t.contributeSteps.map((step, i) => (
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

      {/* ─────────────────── COMPONENT STATUS ─────────────────── */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">{t.statusTitle}</h2>
            <p className="text-base text-slate-600">{t.statusLead}</p>
          </div>
          <span className="text-xs text-slate-500">
            {COMPONENT_STATUS.length} {t.componentsLabel}
          </span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 divide-slate-100">
            {COMPONENT_STATUS.map((c, i) => (
              <Link
                key={c.name}
                to={c.to}
                className={`group flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 ${
                  i % 3 !== 2 ? 'lg:border-r lg:border-slate-100' : ''
                } ${i % 2 !== 1 ? 'sm:border-r sm:border-slate-100' : ''} ${
                  i >= 3 ? 'sm:border-t sm:border-slate-100' : ''
                }`}
              >
                <span className="text-sm font-medium text-slate-800 group-hover:text-slate-900">
                  {lang === 'zh' ? COMPONENT_NAME_ZH[c.name] ?? c.name : c.name}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {t.statusStable}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── FINAL CTA ─────────────────── */}
      <section>
        <div
          className="rounded-2xl border border-slate-200 p-8 sm:p-10 text-center"
          style={{
            backgroundImage:
              'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          }}
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{t.finalTitle}</h2>
          <p className="text-base text-slate-600 mb-6 max-w-xl mx-auto">{t.finalLead}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/foundations/brand-foundations"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-brand)' }}
            >
              {t.finalPrimary}
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
