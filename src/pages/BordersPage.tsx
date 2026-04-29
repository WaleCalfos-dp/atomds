import { Link } from 'react-router-dom';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';
import { TokenTable, type TokenRow } from '../components/content/TokenTable';
import { DosDonts } from '../components/content/DosDonts';
import {
  BORDER_CORE,
  BORDER_DEFAULT,
  BORDER_FEEDBACK,
  BORDER_SELECTION_FOCUS,
  BORDER_STATES,
  type BorderTokenRow,
} from '../data/borderTokens';

interface BordersPageProps {
  brand: Brand;
  lang?: Language;
}

// ─── Bilingual copy block ─────────────────────────────────────────────────
const COPY = {
  en: {
    chip: 'Foundations · Borders',
    chipSub: 'Weight × meaning',
    heroLine1: 'Quiet lines.',
    heroLine2: 'Loud intent.',
    heroLead:
      'Borders organise content, signal interaction, and communicate meaning. Atom controls them with two systems — weight (how thick) and colour (what it means) — so every line on the screen has a clear job.',
    twoSystemsTitle: 'Two systems, one border',
    twoSystemsLead:
      'Every border in Atom is the combination of a weight and a colour. The two systems are independent — you choose the thickness based on emphasis, then the colour based on meaning.',
    systems: [
      {
        label: 'Border weight',
        sub: 'How thick',
        description:
          'A two-step scale that controls thickness. weight-1 is the workhorse for resting components; weight-2 is reserved for moments that need extra emphasis.',
      },
      {
        label: 'Border colour',
        sub: 'What it means',
        description:
          'A semantic palette that gives every border a job — default structure, interaction state, feedback meaning, or selection. Colour answers "why is this here?".',
      },
    ],
    weightDemoTitle: 'Border weight at a glance',
    weightDemoLead:
      'Two weights, two jobs. Most components live at weight-1; weight-2 steps in only when emphasis matters — focus rings and selected states.',
    weight1Note: '1px · default',
    weight2Note: '2px · emphasis',
    rolesTitle: 'Five jobs a border can do',
    rolesLead:
      'Every border colour in Atom plays one of five roles. Picking a colour is really picking a role — the rest is automatic.',
    borderRoles: [
      { title: 'Structure',   description: 'Default and divider tokens hold the layout together — the quiet lines that organise content.' },
      { title: 'Interaction', description: 'Hover, pressed, and interactive tokens respond to user actions and signal clickability.' },
      { title: 'Selection',   description: 'Selected items, active tabs, and the elements the user has chosen — visually pinned in place.' },
      { title: 'Focus',       description: 'Keyboard focus rings — the most important accessibility border in the entire system.' },
      { title: 'Feedback',    description: 'Success, warning, error, and info — borders that communicate status without needing words.' },
    ],
    coreTitle: 'Core weights',
    coreLead:
      'The two thicknesses used across the entire system. Most components use weight-1; weight-2 is reserved for emphasis moments like focus rings and selected states.',
    defaultTitle: 'Default colours',
    defaultLead:
      'The resting palette — the colours users see most often. These form the quiet structural layer that organises content without competing for attention.',
    feedbackTitle: 'Feedback colours',
    feedbackLead:
      'When a border needs to mean something — success, warning, error, or information — these tokens replace the default palette. Use them exclusively in validation and feedback contexts so their meaning stays unambiguous.',
    selectionFocusTitle: 'Selection & focus',
    selectionFocusLead:
      "Focus rings, selected outlines, and brand-tinted hover borders. These tokens are the backbone of keyboard navigation — every interactive element must use them to show where the user's focus currently sits.",
    statesTitle: 'Interaction states',
    statesLead:
      'These tokens respond to user interaction: hover darkens, pressed deepens, disabled fades, and interactive signals that an element is ready to be clicked. Apply them to any element that changes appearance when the user engages with it.',
    columns: ['Token', 'Use'],
    combineTitle: 'Combining weight and colour',
    combineLead:
      'A simple decision tree: start with the lightest weight that does the job, then pick the colour that matches the role.',
    combineStep1Pre: 'Start with ',
    combineStep1Post: '',
    combineStep1Body:
      'This is the baseline that covers the majority of cases — most components, cards, and inputs live here.',
    combineStep2Title: 'Pick a colour by role',
    combineStep2Body:
      'Default for structure, states for interaction, feedback for meaning, selection-and-focus for accessibility moments.',
    combineStep3Pre: 'Step up to ',
    combineStep3Post: ' only when needed',
    combineStep3Body:
      'Reserve the heavier weight for focus rings and selected states — moments that genuinely need to feel pinned in place.',
    a11yTitle: 'Accessibility & contrast',
    a11yLead:
      'Borders carry more accessibility weight than most foundations — they define focus, communicate state, and shape the experience for keyboard users. Bake these in early.',
    a11yRules: [
      {
        title: 'Never rely on colour alone',
        description: 'A red border is not enough on its own — pair every feedback border with an icon or message so colour-blind users get the same information.',
      },
      {
        title: 'Focus rings are non-negotiable',
        description: 'Every interactive element must show a visible focus ring when reached by keyboard. Use border-primary-focus and never disable focus styles.',
      },
      {
        title: 'Maintain contrast on every brand',
        description: 'Border colours must remain visible against their background in every brand. Test default, dark, and brand-coloured surfaces before shipping.',
      },
      {
        title: 'Disabled means visibly disabled',
        description: 'Disabled borders should fade clearly but stay visible enough to keep the component shape readable. Never hide them entirely.',
      },
    ],
    dosDontsTitle: "Do & Don't",
    dosDontsLead: 'The shortest path to a healthy border system across every brand.',
    dos: [
      'Default to border-weight-1 — only step up to weight-2 for focus rings and selected states',
      'Match border colour to the role: structure, interaction, selection, focus, or feedback',
      'Pair feedback borders with an icon or message so meaning never depends on colour alone',
      'Test focus rings on every brand before shipping — they must remain visible against any background',
    ],
    donts: [
      'Mix weight-2 into resting components — it pulls the eye and breaks the visual hierarchy',
      'Use feedback colours decoratively — they must only signal validation or status',
      'Disable or hide focus rings under any circumstance, even if they clash with a hover state',
      'Reach for hard-coded hex values when a semantic border token already exists',
    ],
    finalTitle: 'See borders in action',
    finalLead:
      'Every component in the library wires border weight and colour through these tokens — explore them to see how the system holds together end-to-end.',
    finalPrimary: 'Browse components',
    finalSecondary: 'Next foundation: Spacing',
  },
  zh: {
    chip: '基础 · 边框',
    chipSub: '粗细 × 含义',
    heroLine1: '安静的线条。',
    heroLine2: '响亮的意图。',
    heroLead:
      '边框组织内容、传达交互并表达含义。Atom 通过两个系统来控制它们——粗细(线有多粗)和颜色(它意味着什么)——以便屏幕上的每条线都有明确的职责。',
    twoSystemsTitle: '两个系统,一条边框',
    twoSystemsLead:
      'Atom 中的每条边框都是粗细和颜色的组合。两个系统相互独立——你根据强调程度选择粗细,然后根据含义选择颜色。',
    systems: [
      {
        label: '边框粗细',
        sub: '线有多粗',
        description:
          '控制粗细的两级阶梯。weight-1 是静态组件的主力;weight-2 留给需要额外强调的时刻。',
      },
      {
        label: '边框颜色',
        sub: '它意味着什么',
        description:
          '一套语义化调色板,赋予每条边框一个职责——默认结构、交互状态、反馈含义或选中状态。颜色回答"它为什么在这里?"。',
      },
    ],
    weightDemoTitle: '边框粗细一览',
    weightDemoLead:
      '两种粗细,两种职责。大多数组件使用 weight-1;weight-2 仅在需要强调时使用——焦点环和选中状态。',
    weight1Note: '1px · 默认',
    weight2Note: '2px · 强调',
    rolesTitle: '边框可以承担的五个职责',
    rolesLead:
      'Atom 中每种边框颜色都扮演五个角色之一。挑选颜色其实就是挑选角色——其余的会自动完成。',
    borderRoles: [
      { title: '结构',  description: '默认和分隔线设计令牌支撑布局——组织内容的安静线条。' },
      { title: '交互',  description: '悬停、按下和交互式设计令牌响应用户操作并表明可点击性。' },
      { title: '选择',  description: '已选中的项目、活跃的选项卡和用户选中的元素——视觉上固定在原位。' },
      { title: '焦点',  description: '键盘焦点环——整个系统中最重要的可访问性边框。' },
      { title: '反馈',  description: '成功、警告、错误和信息——无需文字即可传达状态的边框。' },
    ],
    coreTitle: '核心粗细',
    coreLead:
      '整个系统中使用的两种粗细。大多数组件使用 weight-1;weight-2 留给焦点环和选中状态等强调时刻。',
    defaultTitle: '默认颜色',
    defaultLead:
      '静态调色板——用户最常看到的颜色。它们构成静默的结构层,在不争夺注意力的情况下组织内容。',
    feedbackTitle: '反馈颜色',
    feedbackLead:
      '当边框需要传达含义时——成功、警告、错误或信息——这些设计令牌会替换默认调色板。仅在验证和反馈场景中使用它们,以使其含义保持明确。',
    selectionFocusTitle: '选中与焦点',
    selectionFocusLead:
      '焦点环、选中轮廓和品牌色调悬停边框。这些设计令牌是键盘导航的支柱——每个交互式元素都必须使用它们来显示用户当前的焦点位置。',
    statesTitle: '交互状态',
    statesLead:
      '这些设计令牌响应用户交互:悬停加深、按下加深、禁用淡化、交互式表示元素已就绪可点击。将它们应用到任何在用户与之互动时改变外观的元素。',
    columns: ['设计令牌', '用途'],
    combineTitle: '组合粗细与颜色',
    combineLead:
      '一个简单的决策树:从能完成工作的最轻粗细开始,然后选择与角色匹配的颜色。',
    combineStep1Pre: '从 ',
    combineStep1Post: ' 开始',
    combineStep1Body:
      '这是涵盖大多数情况的基线——大多数组件、卡片和输入框都使用此值。',
    combineStep2Title: '按角色选择颜色',
    combineStep2Body:
      '默认用于结构,states 用于交互,feedback 用于含义,selection-and-focus 用于可访问性时刻。',
    combineStep3Pre: '仅在需要时升级到 ',
    combineStep3Post: '',
    combineStep3Body:
      '将更重的粗细留给焦点环和选中状态——真正需要感觉被固定在原位的时刻。',
    a11yTitle: '可访问性与对比度',
    a11yLead:
      '边框比大多数基础承担更多的可访问性职责——它们定义焦点、传达状态并塑造键盘用户的体验。尽早将这些融入系统。',
    a11yRules: [
      {
        title: '永远不要仅依赖颜色',
        description:
          '仅红色边框还不够——为每个反馈边框搭配图标或消息,以便色盲用户能获得相同的信息。',
      },
      {
        title: '焦点环不可妥协',
        description:
          '每个交互式元素在被键盘访问时都必须显示可见的焦点环。使用 border-primary-focus,绝不要禁用焦点样式。',
      },
      {
        title: '在每个品牌中保持对比度',
        description:
          '边框颜色必须在每个品牌中相对其背景保持可见。在发布前测试默认、深色和品牌色表面。',
      },
      {
        title: '禁用即可见地禁用',
        description:
          '禁用的边框应明显淡化,但保持足够可见以使组件形状仍然可读。绝不要完全隐藏它们。',
      },
    ],
    dosDontsTitle: '推荐做法与避免做法',
    dosDontsLead: '通往跨所有品牌的健康边框系统的最短路径。',
    dos: [
      '默认使用 border-weight-1——仅在焦点环和选中状态时升级到 weight-2',
      '将边框颜色与角色匹配:结构、交互、选中、焦点或反馈',
      '为反馈边框搭配图标或消息,使含义不再仅依赖颜色',
      '在发布前在每个品牌上测试焦点环——它们必须在任何背景下保持可见',
    ],
    donts: [
      '将 weight-2 混入静态组件——它会吸引视线并打破视觉层级',
      '将反馈颜色用作装饰——它们必须只表示验证或状态',
      '在任何情况下都不要禁用或隐藏焦点环,即使与悬停状态冲突',
      '当语义化边框设计令牌已存在时,不要使用硬编码的十六进制值',
    ],
    finalTitle: '查看边框的实际应用',
    finalLead:
      '库中每个组件都通过这些设计令牌接入边框粗细和颜色——探索它们,了解系统如何端到端地保持一致。',
    finalPrimary: '浏览组件',
    finalSecondary: '下一个基础:间距',
  },
} as const;

// ─── Shared dotted preview surface ────────────────────────────────────────
const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// ─── System chip lists (chip values are technical token names — never translated) ─
const SYSTEM_CHIPS: ReadonlyArray<readonly string[]> = [
  ['border-weight-1', 'border-weight-2'],
  ['border-default', 'border-hover', 'border-error', 'border-selected'],
];

// ─── Five border roles for the role grid ──────────────────────────────────
const BORDER_ROLE_KEYS = [
  { swatchKey: 'atom.border.default.border-default' as const },
  { swatchKey: 'atom.border.states.border-hover' as const },
  { swatchKey: 'atom.border.selection-and-focus.border-selected' as const },
  { swatchKey: 'atom.border.selection-and-focus.border-primary-focus' as const },
  { swatchKey: 'atom.border.feedback.border-error' as const },
] as const;

function toBorderRows(rows: BorderTokenRow[]): TokenRow[] {
  return rows.map((row) => ({
    token: row.token,
    tokenKey: row.tokenKey,
    values: [row.use],
  }));
}

export function BordersPage({ brand, lang = 'en' }: BordersPageProps) {
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

      {/* ─────────── TWO SYSTEMS ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t.twoSystemsTitle}
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          {t.twoSystemsLead}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {t.systems.map((s, i) => (
            <div
              key={s.label}
              className="rounded-xl border border-slate-200 bg-white p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: 'var(--color-brand)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <div className="text-base font-semibold text-slate-900 leading-tight">
                    {s.label}
                  </div>
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider">
                    {s.sub}
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {s.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SYSTEM_CHIPS[i].map((chip) => (
                  <code
                    key={chip}
                    className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700"
                  >
                    {chip}
                  </code>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── WEIGHT VISUAL DEMO ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t.weightDemoTitle}
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          {t.weightDemoLead}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* weight-1 card */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-4 pt-4 pb-2 flex items-center justify-between">
              <code className="font-mono text-[11px] text-slate-700">
                border-weight-1
              </code>
              <span className="text-[10px] text-slate-500">{t.weight1Note}</span>
            </div>
            <div
              className="px-6 py-10 flex items-center justify-center"
              style={DOTTED_BG}
            >
              <div
                className="w-32 h-12 rounded-lg bg-white"
                style={{
                  border: '1px solid var(--atom-border-default-border-default)',
                }}
              />
            </div>
          </div>
          {/* weight-2 card */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-4 pt-4 pb-2 flex items-center justify-between">
              <code className="font-mono text-[11px] text-slate-700">
                border-weight-2
              </code>
              <span className="text-[10px] text-slate-500">{t.weight2Note}</span>
            </div>
            <div
              className="px-6 py-10 flex items-center justify-center"
              style={DOTTED_BG}
            >
              <div
                className="w-32 h-12 rounded-lg bg-white"
                style={{
                  border:
                    '2px solid var(--atom-border-selection-and-focus-border-primary-focus)',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── BORDER ROLES ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t.rolesTitle}
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          {t.rolesLead}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {t.borderRoles.map((r, i) => (
            <div
              key={r.title}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-lg bg-white"
                  style={{
                    border: `2px solid ${resolved[BORDER_ROLE_KEYS[i].swatchKey]}`,
                  }}
                />
                <h3 className="text-base font-semibold text-slate-900">
                  {r.title}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {r.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── CORE ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t.coreTitle}
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          {t.coreLead}
        </p>
        <TokenTable
          columns={[...t.columns]}
          rows={toBorderRows(BORDER_CORE)}
          brand={brand}
        />
      </section>

      {/* ─────────── DEFAULT ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t.defaultTitle}
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          {t.defaultLead}
        </p>
        <TokenTable
          columns={[...t.columns]}
          rows={toBorderRows(BORDER_DEFAULT)}
          brand={brand}
          showSwatch
        />
      </section>

      {/* ─────────── FEEDBACK ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t.feedbackTitle}
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          {t.feedbackLead}
        </p>
        <TokenTable
          columns={[...t.columns]}
          rows={toBorderRows(BORDER_FEEDBACK)}
          brand={brand}
          showSwatch
        />
      </section>

      {/* ─────────── SELECTION & FOCUS ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t.selectionFocusTitle}
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          {t.selectionFocusLead}
        </p>
        <TokenTable
          columns={[...t.columns]}
          rows={toBorderRows(BORDER_SELECTION_FOCUS)}
          brand={brand}
          showSwatch
        />
      </section>

      {/* ─────────── STATES ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t.statesTitle}
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          {t.statesLead}
        </p>
        <TokenTable
          columns={[...t.columns]}
          rows={toBorderRows(BORDER_STATES)}
          brand={brand}
          showSwatch
        />
      </section>

      {/* ─────────── HOW TO COMBINE ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t.combineTitle}
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          {t.combineLead}
        </p>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <ol className="space-y-5">
            <li className="flex gap-4">
              <div
                className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: 'var(--color-brand)' }}
              >
                01
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 mb-0.5">
                  {t.combineStep1Pre}
                  <code className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                    border-weight-1
                  </code>
                  {t.combineStep1Post}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t.combineStep1Body}
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div
                className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: 'var(--color-brand)' }}
              >
                02
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 mb-0.5">
                  {t.combineStep2Title}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t.combineStep2Body}
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div
                className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: 'var(--color-brand)' }}
              >
                03
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 mb-0.5">
                  {t.combineStep3Pre}
                  <code className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                    weight-2
                  </code>
                  {t.combineStep3Post}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t.combineStep3Body}
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* ─────────── ACCESSIBILITY ─────────── */}
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
              to="/foundations/spacing"
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
