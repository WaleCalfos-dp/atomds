import { Link } from 'react-router-dom';
import { type Brand, BRANDS, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';
import { TokenTable, type TokenRow } from '../components/content/TokenTable';
import { DosDonts } from '../components/content/DosDonts';
import { ButtonLive } from '../components/button/ButtonLive';
import {
  BG_CORE,
  BG_PRIMARY,
  BG_ALERT,
  BORDER_CORE_TOKENS,
  BORDER_STATES_TOKENS,
  BORDER_FEEDBACK_TOKENS,
  FG_CORE,
  FG_PRIMARY,
  FG_STATES,
  FG_FEEDBACK,
  PROGRESS_INDICATOR,
  type BrandSwitcherTokenRow,
} from '../data/brandSwitcherTokens';

interface BrandSwitcherPageProps {
  brand: Brand;
  lang?: Language;
}

// ─── Bilingual copy block ─────────────────────────────────────────────────
const COPY = {
  en: {
    chip: 'Foundations · Brand Switcher',
    chipSub: 'The engine behind multi-brand',
    heroLine1: 'One token system.',
    heroLine2: 'Every brand. Zero hard-codes.',
    heroLead:
      "Brand Switcher is the engine behind Atom's multi-brand capability. Every colour is a semantic token — a name that describes a role, not a value. Swap brands, the values change, the tokens stay the same.",
    oneCompTitle: 'One component. Every brand.',
    oneCompLead:
      'Same component code, six different foundations. The token layer does all the work — the React markup never sees a hex value.',
    statusActive: 'Active',
    btnLabelBrand: 'Brand',
    sameButton1: 'The exact same ',
    sameButton2: ' renders six different ways.',
    anatomyTitle: 'Anatomy of a token',
    anatomyLead:
      'Token names are dot-separated paths. Each segment narrows the meaning, so you can read intent straight from the name.',
    tokenParts: [
      { label: 'Namespace',     description: 'Always atom — marks every token as part of the system.' },
      { label: 'Category',      description: 'background, border, foreground, or progress-indicator.' },
      { label: 'Tier',          description: 'core, primary, alert — the family the token belongs to.' },
      { label: 'Role + state',  description: 'What the token does and which state it represents.' },
    ],
    resolvesTo: 'Resolves to',
    inActiveBrand: 'in the active brand',
    principlesTitle: 'Core principles',
    principlesLead:
      'Six rules hold the token system together. Together they make the difference between a colour palette and a true multi-brand engine.',
    principles: [
      {
        title: 'Semantic naming',
        description:
          'Tokens describe their purpose, not their appearance. bg-primary-default means the same thing whether it resolves to navy, orange, or black.',
      },
      {
        title: 'Multi-brand by default',
        description:
          'Add a new brand by defining its palette — every component inherits the change because the semantic layer stays constant.',
      },
      {
        title: 'Accessibility first',
        description:
          'Every token pairing is tested to meet at least WCAG AA contrast ratios. Accessibility is built into the palette, not bolted on.',
      },
      {
        title: 'Consistency across states',
        description:
          'Hover, pressed, focus, and disabled states follow the same progression for every brand, so interactions feel familiar.',
      },
      {
        title: 'Single source of truth',
        description:
          'Designers, developers, and this documentation reference the same token names — no translation layer, no ambiguity.',
      },
      {
        title: 'Scales without forks',
        description:
          'Six brands today, twenty tomorrow — the same React package powers all of them with no parallel codebases.',
      },
    ],
    bgTitle: 'Background tokens',
    bgLead:
      'Surfaces, primary fills, and alert states. Background tokens drive every coloured panel, button fill, and alert backdrop.',
    borderTitle: 'Border tokens',
    borderLead:
      'Border colours map to their job — default structure, interaction states, or feedback meaning. Pair them with border weights from the Borders foundation.',
    fgTitle: 'Foreground tokens',
    fgLead:
      'Text, icons, and interactive content. Foreground tokens are the most frequently used layer in the system — anything readable lives here.',
    progressTitle: 'Progress indicator tokens',
    progressLead:
      'A small dedicated set for the Progress Indicator component, where the active fill colour adapts per brand.',
    columns: ['Token', 'Purpose', 'Usage'],
    a11yTitle: 'Accessibility & contrast',
    a11yLead:
      'Four rules keep the token system accessible across every brand. Bake them in early — they are far cheaper than retrofitting later.',
    a11yRules: [
      {
        title: 'Maintain 4.5:1 text contrast',
        description: 'All text/background pairings meet at least WCAG AA. Test every brand before shipping a new component.',
      },
      {
        title: 'Distinguish every state',
        description: 'Hover, pressed, and focus must each show clear visual differentiation — never rely on colour alone.',
      },
      {
        title: 'Use inverse tokens deliberately',
        description: 'Inverse tokens are for text and icons over dark or brand-coloured surfaces — not a stylistic choice.',
      },
      {
        title: 'Avoid opacity for body text',
        description: 'Opacity tokens are for overlays and subtle focus indicators, never for primary or body copy.',
      },
    ],
    dosDontsTitle: "Do & Don't",
    dosDontsLead: 'The shortest path to a healthy token system. When in doubt, lean on these.',
    dos: [
      'Reference semantic tokens in every component — never use brand palette colours directly',
      'Test every interactive state (hover, pressed, focus, disabled) across all active brands before shipping',
      'Apply inverse tokens only where background contrast demands them — not as a stylistic choice',
      'Document changes by token name, not by hex value, so the change is meaningful across brands',
    ],
    donts: [
      'Hard-code palette colours (like #cf4500) in any component — always go through the token layer',
      'Combine feedback colours (error, warning, success) with brand surfaces unless a specific token exists for that pairing',
      'Invent new colour variations outside the established token set — if you need a new role, propose it as a new token',
    ],
    finalTitle: 'Ready to consume tokens?',
    finalLead:
      'See how every component in the library wires up to this token system — and ships brand-aware out of the box.',
    finalPrimary: 'Browse components',
    finalSecondary: 'Back to Brand Foundations',
  },
  zh: {
    chip: '基础 · Brand Switcher',
    chipSub: '多品牌背后的引擎',
    heroLine1: '一套设计令牌系统。',
    heroLine2: '每个品牌。零硬编码。',
    heroLead:
      'Brand Switcher 是 Atom 多品牌能力背后的引擎。每种颜色都是一个语义化设计令牌——描述角色而非值的名称。切换品牌，值会变化，但设计令牌保持不变。',
    oneCompTitle: '一个组件。每个品牌。',
    oneCompLead:
      '相同的组件代码，六种不同的基础。设计令牌层完成所有工作——React 标记从未见过任何十六进制值。',
    statusActive: '活跃',
    btnLabelBrand: '品牌',
    sameButton1: '完全相同的 ',
    sameButton2: ' 以六种不同方式呈现。',
    anatomyTitle: '设计令牌的结构剖析',
    anatomyLead:
      '设计令牌的名称是用点分隔的路径。每个段落都会缩小含义范围，因此你可以直接从名称中读出意图。',
    tokenParts: [
      { label: '命名空间', description: '始终为 atom——标记每个设计令牌都属于系统的一部分。' },
      { label: '类别',     description: 'background、border、foreground 或 progress-indicator。' },
      { label: '层级',     description: 'core、primary、alert——设计令牌所属的家族。' },
      { label: '角色 + 状态', description: '设计令牌的作用以及它代表的状态。' },
    ],
    resolvesTo: '解析为',
    inActiveBrand: '在当前激活品牌中',
    principlesTitle: '核心原则',
    principlesLead:
      '六条规则将设计令牌系统紧密结合。它们共同构成了调色板与真正多品牌引擎之间的差别。',
    principles: [
      {
        title: '语义化命名',
        description:
          '设计令牌描述其用途，而非外观。bg-primary-default 无论解析为深蓝、橘色还是黑色，都意味着相同的含义。',
      },
      {
        title: '默认多品牌',
        description:
          '通过定义调色板来添加新品牌——每个组件都会继承变更，因为语义层保持不变。',
      },
      {
        title: '可访问性优先',
        description:
          '每对设计令牌都经过测试以至少满足 WCAG AA 对比度。可访问性内建于调色板中，而非事后添加。',
      },
      {
        title: '跨状态一致性',
        description:
          '悬停、按下、焦点和禁用状态在每个品牌中都遵循相同的递进，使交互感觉熟悉。',
      },
      {
        title: '单一可信来源',
        description:
          '设计师、开发者和本文档引用相同的设计令牌名称——无转换层、无歧义。',
      },
      {
        title: '无需分叉的扩展',
        description:
          '今天六个品牌，明天二十个——同一个 React 包驱动所有品牌，不存在并行代码库。',
      },
    ],
    bgTitle: '背景设计令牌',
    bgLead:
      '表面、主要填充和警告状态。背景设计令牌驱动每个彩色面板、按钮填充和警告背景。',
    borderTitle: '边框设计令牌',
    borderLead:
      '边框颜色映射到它们的工作——默认结构、交互状态或反馈含义。将它们与边框基础中的边框粗细搭配使用。',
    fgTitle: '前景设计令牌',
    fgLead:
      '文本、图标和交互式内容。前景设计令牌是系统中最常用的层——任何可读的内容都在这里。',
    progressTitle: '进度指示器设计令牌',
    progressLead:
      '为进度指示器组件设置的一个小型专用集合，其中活动填充颜色会随品牌适配。',
    columns: ['设计令牌', '用途', '使用场景'],
    a11yTitle: '可访问性与对比度',
    a11yLead:
      '四条规则使设计令牌系统在每个品牌中都保持可访问。尽早将它们融入——这比事后改造便宜得多。',
    a11yRules: [
      {
        title: '保持 4.5:1 的文本对比度',
        description: '所有文本/背景组合至少满足 WCAG AA。在发布新组件之前测试每个品牌。',
      },
      {
        title: '区分每个状态',
        description: '悬停、按下和焦点必须各自显示清晰的视觉差异——绝不能仅依赖颜色。',
      },
      {
        title: '有意识地使用反色设计令牌',
        description:
          '反色设计令牌用于深色或品牌色表面上的文本和图标——而非样式选择。',
      },
      {
        title: '避免对正文使用透明度',
        description:
          '透明度设计令牌用于覆盖层和细微的焦点指示器,绝不用于主要或正文文本。',
      },
    ],
    dosDontsTitle: '推荐做法与避免做法',
    dosDontsLead: '通往健康设计令牌系统的最短路径。当有疑问时,依赖这些原则。',
    dos: [
      '在每个组件中引用语义化设计令牌——绝不直接使用品牌调色板颜色',
      '在发布前跨所有激活的品牌测试每个交互状态(悬停、按下、焦点、禁用)',
      '只在背景对比度需要时应用反色设计令牌——而非作为样式选择',
      '通过设计令牌名称记录变更,而非十六进制值,以便变更在各品牌间都有意义',
    ],
    donts: [
      '在任何组件中硬编码调色板颜色(如 #cf4500)——始终通过设计令牌层',
      '除非存在专门的设计令牌,否则不要将反馈颜色(错误、警告、成功)与品牌表面组合',
      '在已建立的设计令牌集之外创造新的颜色变体——如果需要新角色,请将其作为新设计令牌提出',
    ],
    finalTitle: '准备好使用设计令牌了吗?',
    finalLead:
      '查看库中的每个组件如何接入此设计令牌系统——并开箱即用地支持品牌切换。',
    finalPrimary: '浏览组件',
    finalSecondary: '返回品牌基础',
  },
} as const;

// ─── Shared dotted preview surface ────────────────────────────────────────
const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// ─── Anatomy chips (chip values are technical token segments — never translated) ─
const TOKEN_PART_CHIPS = ['atom', 'background', 'primary', 'bg-primary-default'] as const;

function toTokenRows(rows: BrandSwitcherTokenRow[]): TokenRow[] {
  return rows.map((row) => ({
    token: row.token,
    tokenKey: row.tokenKey,
    values: [row.purpose, row.usage],
  }));
}

export function BrandSwitcherPage({ brand, lang = 'en' }: BrandSwitcherPageProps) {
  const t = COPY[lang];
  const resolved = RESOLVED_SEMANTIC_TOKENS[brand];

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
          <span className="text-[11px] text-slate-400">{t.chipSub}</span>
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

      {/* ─────────── ONE COMPONENT, EVERY BRAND ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t.oneCompTitle}
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          {t.oneCompLead}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {BRANDS.map((b) => {
            const isActive = b.id === brand;
            return (
              <div
                key={b.id}
                data-brand={b.id}
                className={`rounded-xl border bg-white overflow-hidden transition-all ${
                  isActive ? 'border-slate-900 shadow-md' : 'border-slate-200'
                }`}
              >
                <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">
                    {b.label}
                  </span>
                  {isActive && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {t.statusActive}
                    </span>
                  )}
                </div>
                <div
                  className="px-4 py-5 flex items-center justify-center"
                  style={DOTTED_BG}
                >
                  <ButtonLive
                    buttonType="Full Button"
                    variant="Primary"
                    size="Tiny"
                    state="Default"
                    label={t.btnLabelBrand}
                    showLabel
                    showIconLeft={false}
                    showIconRight={false}
                    brand={b.id}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
          {t.sameButton1}<code className="font-mono text-[11px] text-slate-700">{'<ButtonLive variant="Primary" />'}</code>{t.sameButton2}
        </div>
      </section>

      {/* ─────────── ANATOMY OF A TOKEN ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t.anatomyTitle}
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          {t.anatomyLead}
        </p>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          {/* Token path with chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mb-8 font-mono text-sm">
            <span className="rounded-md bg-slate-700 px-2.5 py-1 text-white">{TOKEN_PART_CHIPS[0]}</span>
            <span className="text-slate-400">.</span>
            <span className="rounded-md bg-blue-500 px-2.5 py-1 text-white">{TOKEN_PART_CHIPS[1]}</span>
            <span className="text-slate-400">.</span>
            <span className="rounded-md bg-violet-500 px-2.5 py-1 text-white">{TOKEN_PART_CHIPS[2]}</span>
            <span className="text-slate-400">.</span>
            <span className="rounded-md bg-emerald-600 px-2.5 py-1 text-white">{TOKEN_PART_CHIPS[3]}</span>
          </div>
          {/* Labels grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {t.tokenParts.map((part, i) => {
              const colors = ['bg-slate-700', 'bg-blue-500', 'bg-violet-500', 'bg-emerald-600'];
              return (
                <div key={part.label} className="flex flex-col items-start gap-1">
                  <span className={`inline-block w-6 h-1.5 rounded-full ${colors[i]}`} />
                  <div className="text-xs font-semibold text-slate-900">{part.label}</div>
                  <div className="text-[11px] text-slate-500 leading-relaxed">{part.description}</div>
                </div>
              );
            })}
          </div>
          {/* Resolved value strip */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3 text-xs">
              <span className="font-semibold text-slate-500 uppercase tracking-wider">
                {t.resolvesTo}
              </span>
              <div
                className="w-5 h-5 rounded border border-slate-200"
                style={{ backgroundColor: resolved['atom.background.primary.bg-primary-default'] }}
              />
              <code className="font-mono text-slate-700">
                {resolved['atom.background.primary.bg-primary-default']}
              </code>
              <span className="text-slate-400">{t.inActiveBrand}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── CORE PRINCIPLES ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t.principlesTitle}
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          {t.principlesLead}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <p className="text-xs text-slate-600 leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── BACKGROUND TOKENS ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t.bgTitle}
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          {t.bgLead}
        </p>
        <div className="space-y-6">
          <TokenTable
            title="atom / background / core"
            columns={[...t.columns]}
            rows={toTokenRows(BG_CORE)}
            brand={brand}
            showSwatch
          />
          <TokenTable
            title="atom / background / primary"
            columns={[...t.columns]}
            rows={toTokenRows(BG_PRIMARY)}
            brand={brand}
            showSwatch
          />
          <TokenTable
            title="atom / background / alert"
            columns={[...t.columns]}
            rows={toTokenRows(BG_ALERT)}
            brand={brand}
            showSwatch
          />
        </div>
      </section>

      {/* ─────────── BORDER TOKENS ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t.borderTitle}
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          {t.borderLead}
        </p>
        <div className="space-y-6">
          <TokenTable
            title="atom / border / core"
            columns={[...t.columns]}
            rows={toTokenRows(BORDER_CORE_TOKENS)}
            brand={brand}
            showSwatch
          />
          <TokenTable
            title="atom / border / states"
            columns={[...t.columns]}
            rows={toTokenRows(BORDER_STATES_TOKENS)}
            brand={brand}
            showSwatch
          />
          <TokenTable
            title="atom / border / feedback"
            columns={[...t.columns]}
            rows={toTokenRows(BORDER_FEEDBACK_TOKENS)}
            brand={brand}
            showSwatch
          />
        </div>
      </section>

      {/* ─────────── FOREGROUND TOKENS ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t.fgTitle}
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          {t.fgLead}
        </p>
        <div className="space-y-6">
          <TokenTable
            title="atom / foreground / core"
            columns={[...t.columns]}
            rows={toTokenRows(FG_CORE)}
            brand={brand}
            showSwatch
          />
          <TokenTable
            title="atom / foreground / primary"
            columns={[...t.columns]}
            rows={toTokenRows(FG_PRIMARY)}
            brand={brand}
            showSwatch
          />
          <TokenTable
            title="atom / foreground / states"
            columns={[...t.columns]}
            rows={toTokenRows(FG_STATES)}
            brand={brand}
            showSwatch
          />
          <TokenTable
            title="atom / foreground / feedback"
            columns={[...t.columns]}
            rows={toTokenRows(FG_FEEDBACK)}
            brand={brand}
            showSwatch
          />
        </div>
      </section>

      {/* ─────────── PROGRESS INDICATOR TOKENS ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t.progressTitle}
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          {t.progressLead}
        </p>
        <TokenTable
          title="atom / progress-indicator"
          columns={[...t.columns]}
          rows={toTokenRows(PROGRESS_INDICATOR)}
          brand={brand}
          showSwatch
        />
      </section>

      {/* ─────────── ACCESSIBILITY & CONTRAST ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t.a11yTitle}
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          {t.a11yLead}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {t.a11yRules.map((rule) => (
            <div
              key={rule.title}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <h3 className="text-base font-semibold text-slate-900 mb-1.5">
                {rule.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {rule.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── DO & DON'T ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t.dosDontsTitle}
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          {t.dosDontsLead}
        </p>
        <DosDonts dos={[...t.dos]} donts={[...t.donts]} />
      </section>

      {/* ─────────── FINAL CTA ─────────── */}
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
              to="/components/button"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-brand)' }}
            >
              {t.finalPrimary}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              to="/foundations/brand-foundations"
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
