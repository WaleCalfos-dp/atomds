import { Link } from 'react-router-dom';
import { type Brand } from '../data/tokens';
import { type Language } from '../data/languages';
import { SpacingBar } from '../components/content/SpacingBar';
import { DosDonts } from '../components/content/DosDonts';
import { SPACING_TOKENS } from '../data/spacingTokens';

interface SpacingPageProps {
  brand: Brand;
  lang?: Language;
}

// ─── Bilingual copy block ─────────────────────────────────────────────────
const COPY = {
  en: {
    chip: 'Foundations · Spacing',
    chipSub: 'The invisible rhythm',
    heroLine1: 'Calm by default.',
    heroLine2: 'Eight pixels at a time.',
    heroLead:
      "Spacing is the most invisible and most impactful foundation in any design system. When it's consistent, layouts feel calm and intentional. When it drifts, interfaces feel cluttered and unreliable. Atom gives every gap, margin, and padding a defined token so teams never have to guess.",
    baseUnitTitle: 'One base unit, every measurement',
    baseUnitLead:
      'Every measurement in Atom derives from a single 8-pixel base. Every token in the scale is either 8, a multiple of 8, or a small subdivision used inside compact components. One decision creates the rhythm for the entire system.',
    baseUnitTrail1: '— every step is a multiple of 8, so layouts always land on the same invisible grid.',
    whyEightTitle: 'Why eight?',
    whyEightLead:
      "Eight is not arbitrary. It's the smallest base that gives you a clean pixel grid, a predictable rhythm, and a small enough decision space that designers can stop second-guessing.",
    whyEight: [
      {
        title: 'Pixel grid alignment',
        description:
          'Multiples of 8 align cleanly to physical pixel grids on every common device, eliminating sub-pixel rendering and fuzzy edges.',
      },
      {
        title: 'Predictable rhythm',
        description:
          'A single base unit means every gap, padding, and margin sits on the same invisible grid — even when the values change, they always relate.',
      },
      {
        title: 'Proportional thinking',
        description:
          'Designers and developers stop asking "is this 14 or 16?" and start asking "small, medium, or large?". The decision space gets dramatically smaller.',
      },
    ],
    fullScaleTitle: 'The full scale',
    fullScaleLead:
      'Twelve tokens, from zero to eighty. The bars below are drawn to scale so you can see how each step grows in proportion to the others.',
    referenceTitle: 'Token reference',
    referenceLead: 'The plain values for when you just need to look something up.',
    colToken: 'Token',
    colPixels: 'Pixels',
    colMultiple: 'Multiple of 8',
    multipleSub: 'Sub-step',
    multipleX8: '× 8',
    rangesTitle: 'Three ranges, three jobs',
    rangesLead:
      "Don't think in pixels — think in ranges. Each range answers a different question about how much room something needs.",
    ranges: [
      {
        label: 'Small',
        range: '0 – 8px',
        description:
          'The tight, internal gaps that hold compact elements together. These keep icons aligned with their labels, badges from feeling bloated, and form inputs from wasting space.',
        examples: [
          'Gaps between small icons and adjacent text',
          'Internal padding inside badges, chips, and tags',
          'Inline spacing within form inputs',
        ],
      },
      {
        label: 'Medium',
        range: '12 – 24px',
        description:
          'The comfortable breathing room between related elements. This is the workhorse range — most component-level spacing decisions live here.',
        examples: [
          'Gaps between avatars, icons, and their text blocks',
          'Spacing between repeated elements like list items',
          'Internal padding inside cards and panels',
        ],
      },
      {
        label: 'Large',
        range: '32 – 80px',
        description:
          'Layout-level structure: the gaps that separate major sections, push content from edges, and give pages room to breathe. Reach for these when spacing sections, not elements.',
        examples: [
          'Vertical space between page content and headers',
          'Padding inside large content modules',
          'Margins between major page sections',
        ],
      },
    ],
    practiceTitle: 'Spacing in practice',
    practiceLead:
      'The same scale doing three different jobs. Each example uses different tokens to achieve the right level of breathing room.',
    smallExampleHeader: 'Small · 4 / 6',
    smallExampleStatus: 'Active',
    smallExampleNote: 'Internal padding and the gap between dot and label use small tokens.',
    mediumExampleHeader: 'Medium · 16 / 24',
    mediumExampleTitle: 'Card title',
    mediumExampleBody: 'Cards use medium tokens for inner padding and gaps between text blocks.',
    mediumExampleAction: 'Action',
    mediumExampleNote: 'Card padding and content gaps use the medium range.',
    largeExampleHeader: 'Large · 32 / 48',
    largeExampleSectionA: 'Section A',
    largeExampleSectionB: 'Section B',
    largeExampleNote: 'Sections inside a layout are separated with large tokens.',
    a11yTitle: 'Accessibility & spacing',
    a11yLead:
      "Spacing isn't just aesthetic — it directly affects how usable your interface is for keyboard, motor, and cognitive access.",
    a11yRules: [
      {
        title: 'Tap targets need 44px minimum',
        description:
          'Combine padding tokens to ensure every interactive element clears the 44×44 minimum tap target — accessibility before density.',
      },
      {
        title: 'Honour visual hierarchy',
        description:
          'Larger gaps signal more separation. Always increase the gap when grouping elements into a different conceptual unit.',
      },
    ],
    dosDontsTitle: "Do & Don't",
    dosDontsLead: 'The shortest path to a calm, consistent layout.',
    dos: [
      'Always reach for a token from the scale — never type a raw pixel value into your stylesheet',
      'Think in ranges (small / medium / large) before you think in numbers',
      'Increase the gap when grouping elements into a new conceptual unit — let space do the talking',
      'Combine spacing tokens to clear the 44px tap-target minimum on every interactive element',
    ],
    donts: [
      "Invent values between tokens — there is no space-13 or space-20, and there shouldn't be",
      'Use spacing as a substitute for a divider when content needs an explicit visual break',
      'Apply large layout-level tokens inside compact components — they will overpower their container',
      'Mix multiple tokens at random in the same component — pick a consistent rhythm and stick to it',
    ],
    finalTitle: 'See spacing in action',
    finalLead:
      'Every component in Atom uses these tokens for padding, gaps, and margins — explore them to see the scale at work end-to-end.',
    finalPrimary: 'Browse components',
    finalSecondary: 'Back to Borders',
  },
  zh: {
    chip: '基础 · 间距',
    chipSub: '隐形的节奏',
    heroLine1: '默认从容。',
    heroLine2: '每次八像素。',
    heroLead:
      '间距是任何设计系统中最不可见但最具影响力的基础。一致时,布局感觉平静且有意图。漂移时,界面感觉杂乱且不可靠。Atom 为每一个间隔、外边距和内边距赋予明确的设计令牌,使团队无需猜测。',
    baseUnitTitle: '一个基础单位,每个度量',
    baseUnitLead:
      'Atom 中的每一个度量都源自单一的 8 像素基础。比例中的每个设计令牌要么是 8,要么是 8 的倍数,要么是紧凑组件内部使用的小细分值。一个决定为整个系统创造了节奏。',
    baseUnitTrail1: '——每一步都是 8 的倍数,因此布局始终落在同一个隐形网格上。',
    whyEightTitle: '为什么是 8?',
    whyEightLead:
      '8 并非任意选择。它是能给你干净的像素网格、可预测的节奏以及足够小的决策空间(让设计师不再反复怀疑)的最小基础。',
    whyEight: [
      {
        title: '像素网格对齐',
        description:
          '8 的倍数能在每种常见设备上整齐对齐到物理像素网格,消除子像素渲染和模糊边缘。',
      },
      {
        title: '可预测的节奏',
        description:
          '单一的基础单位意味着每个间隔、内边距和外边距都坐落在同一个隐形网格上——即使值变化,它们之间也总是相互关联。',
      },
      {
        title: '比例化思维',
        description:
          '设计师和开发者不再问"是 14 还是 16?",而是问"小、中还是大?"。决策空间显著缩小。',
      },
    ],
    fullScaleTitle: '完整比例',
    fullScaleLead:
      '十二个设计令牌,从零到八十。下方的条形按比例绘制,以便你看到每一步如何按比例增长。',
    referenceTitle: '设计令牌参考',
    referenceLead: '当你只需查找某个值时使用的简明数值。',
    colToken: '设计令牌',
    colPixels: '像素',
    colMultiple: '8 的倍数',
    multipleSub: '子步',
    multipleX8: '× 8',
    rangesTitle: '三个范围,三个职责',
    rangesLead:
      '不要用像素思考——用范围思考。每个范围回答关于某物需要多少空间的不同问题。',
    ranges: [
      {
        label: '小',
        range: '0 – 8px',
        description:
          '将紧凑元素紧密结合的内部小间隙。它们让图标与标签对齐、徽章不显得臃肿,以及表单输入框不浪费空间。',
        examples: [
          '小图标与相邻文本之间的间隔',
          '徽章、芯片和标签内的内边距',
          '表单输入框内的行内间距',
        ],
      },
      {
        label: '中',
        range: '12 – 24px',
        description:
          '相关元素之间舒适的呼吸空间。这是主力范围——大多数组件级间距决策都在这里。',
        examples: [
          '头像、图标与其文本块之间的间隔',
          '列表项等重复元素之间的间距',
          '卡片和面板内的内边距',
        ],
      },
      {
        label: '大',
        range: '32 – 80px',
        description:
          '布局级结构:分隔主要段落、将内容推离边缘并为页面留出呼吸空间的间隔。在分隔段落而非元素时使用这些值。',
        examples: [
          '页面内容与头部之间的垂直空间',
          '大型内容模块内的内边距',
          '主要页面段落之间的外边距',
        ],
      },
    ],
    practiceTitle: '实践中的间距',
    practiceLead:
      '同一比例做三种不同的工作。每个示例使用不同的设计令牌以达到正确的呼吸空间水平。',
    smallExampleHeader: '小 · 4 / 6',
    smallExampleStatus: '活跃',
    smallExampleNote: '内边距以及圆点和标签之间的间隔使用小型设计令牌。',
    mediumExampleHeader: '中 · 16 / 24',
    mediumExampleTitle: '卡片标题',
    mediumExampleBody: '卡片使用中型设计令牌作为内边距和文本块之间的间隔。',
    mediumExampleAction: '操作',
    mediumExampleNote: '卡片内边距和内容间隔使用中范围。',
    largeExampleHeader: '大 · 32 / 48',
    largeExampleSectionA: '段落 A',
    largeExampleSectionB: '段落 B',
    largeExampleNote: '布局内的段落使用大型设计令牌进行分隔。',
    a11yTitle: '可访问性与间距',
    a11yLead:
      '间距不仅是审美——它直接影响你的界面对键盘、运动和认知访问的可用性。',
    a11yRules: [
      {
        title: '点击目标至少需 44px',
        description:
          '组合内边距设计令牌以确保每个交互式元素都满足 44×44 最小点击目标——可访问性优先于密度。',
      },
      {
        title: '尊重视觉层级',
        description:
          '更大的间隔表示更大的分离。在将元素分组到不同概念单元时,始终增加间隔。',
      },
    ],
    dosDontsTitle: '推荐做法与避免做法',
    dosDontsLead: '通往平静、一致布局的最短路径。',
    dos: [
      '始终从比例中选取设计令牌——绝不在样式表中输入原始像素值',
      '在思考数字之前先思考范围(小 / 中 / 大)',
      '在将元素分组到新概念单元时增加间隔——让空间说话',
      '组合间距设计令牌以使每个交互式元素都达到 44px 点击目标的最小值',
    ],
    donts: [
      '在设计令牌之间发明值——没有 space-13 或 space-20,也不应该有',
      '在内容需要明确的视觉中断时,使用间距来代替分隔线',
      '在紧凑组件内应用大型布局级设计令牌——它们会压倒其容器',
      '在同一组件中随机混合多个设计令牌——选择一致的节奏并坚持下去',
    ],
    finalTitle: '查看间距的实际应用',
    finalLead:
      'Atom 中的每个组件都使用这些设计令牌作为内边距、间隔和外边距——探索它们,以查看比例如何端到端地工作。',
    finalPrimary: '浏览组件',
    finalSecondary: '返回边框',
  },
} as const;

// ─── Shared dotted preview surface ────────────────────────────────────────
const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// ─── Range token chips (technical names — never translated) ────────────────
const RANGE_TOKENS: ReadonlyArray<readonly string[]> = [
  ['space-0', 'space-2', 'space-4', 'space-6', 'space-8'],
  ['space-12', 'space-16', 'space-24'],
  ['space-32', 'space-48', 'space-64', 'space-80'],
];

export function SpacingPage({ brand, lang = 'en' }: SpacingPageProps) {
  const t = COPY[lang];
  void brand;

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

      {/* ─────────── THE 8PX BASE UNIT ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t.baseUnitTitle}
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          {t.baseUnitLead}
        </p>
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          {/* Stacked 8s visualisation */}
          <div
            className="rounded-xl px-6 py-10 mb-6"
            style={DOTTED_BG}
          >
            <div className="flex items-end justify-center gap-3">
              {[1, 2, 3, 4, 6, 8, 10].map((mult) => (
                <div key={mult} className="flex flex-col items-center gap-2">
                  <div
                    className="rounded-md"
                    style={{
                      width: '36px',
                      height: `${mult * 8}px`,
                      backgroundColor: 'var(--color-brand)',
                      opacity: 0.85,
                    }}
                  />
                  <span className="text-[10px] font-mono text-slate-500">
                    {mult * 8}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
              <span className="font-semibold text-slate-900">8 · 16 · 24 · 32 · 48 · 64 · 80</span>
              {' '}{t.baseUnitTrail1}
            </p>
          </div>
        </div>
      </section>

      {/* ─────────── WHY EIGHT ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t.whyEightTitle}
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          {t.whyEightLead}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {t.whyEight.map((reason, i) => (
            <div
              key={reason.title}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white mb-3"
                style={{ backgroundColor: 'var(--color-brand)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-1.5">
                {reason.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── THE FULL SCALE ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t.fullScaleTitle}
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          {t.fullScaleLead}
        </p>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          {SPACING_TOKENS.map((tok) => (
            <SpacingBar key={tok.token} token={tok.token} px={tok.px} />
          ))}
        </div>
      </section>

      {/* ─────────── TOKEN TABLE ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t.referenceTitle}
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          {t.referenceLead}
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t.colToken}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t.colPixels}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t.colMultiple}
                </th>
              </tr>
            </thead>
            <tbody>
              {SPACING_TOKENS.map((tok) => (
                <tr
                  key={tok.token}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-4 py-3">
                    <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                      {tok.token}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{tok.px}px</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {tok.px === 0
                      ? '—'
                      : tok.px % 8 === 0
                      ? `${tok.px / 8} ${t.multipleX8}`
                      : t.multipleSub}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─────────── THREE RANGES ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t.rangesTitle}
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          {t.rangesLead}
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {t.ranges.map((r, i) => (
            <div
              key={r.label}
              className="rounded-xl border border-slate-200 bg-white p-5"
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
                    {r.label}
                  </div>
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider">
                    {r.range}
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {r.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {RANGE_TOKENS[i].map((tok) => (
                  <code
                    key={tok}
                    className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700"
                  >
                    {tok}
                  </code>
                ))}
              </div>
              <ul className="space-y-1">
                {r.examples.map((ex) => (
                  <li
                    key={ex}
                    className="text-[11px] text-slate-500 leading-relaxed flex items-start gap-1.5"
                  >
                    <span className="text-slate-300 mt-0.5">•</span>
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── SPACING IN PRACTICE ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t.practiceTitle}
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          {t.practiceLead}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Small example: badge */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-4 pt-4 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {t.smallExampleHeader}
            </div>
            <div className="p-6 flex items-center justify-center" style={DOTTED_BG}>
              <div
                className="inline-flex items-center bg-white rounded-full border border-slate-300"
                style={{ padding: '4px 12px', gap: '6px' }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: 'var(--color-brand)' }}
                />
                <span className="text-xs font-medium text-slate-700">{t.smallExampleStatus}</span>
              </div>
            </div>
            <div className="px-4 py-3 text-[11px] text-slate-500 leading-relaxed border-t border-slate-100">
              {t.smallExampleNote}
            </div>
          </div>

          {/* Medium example: card */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-4 pt-4 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {t.mediumExampleHeader}
            </div>
            <div className="p-6 flex items-center justify-center" style={DOTTED_BG}>
              <div
                className="bg-white rounded-lg border border-slate-200 shadow-sm w-full max-w-[180px]"
                style={{ padding: '16px' }}
              >
                <div className="text-xs font-semibold text-slate-900 mb-1">
                  {t.mediumExampleTitle}
                </div>
                <div
                  className="text-[10px] text-slate-500 leading-relaxed"
                  style={{ marginBottom: '16px' }}
                >
                  {t.mediumExampleBody}
                </div>
                <div
                  className="inline-block rounded-md text-[10px] font-semibold text-white"
                  style={{
                    padding: '6px 12px',
                    backgroundColor: 'var(--color-brand)',
                  }}
                >
                  {t.mediumExampleAction}
                </div>
              </div>
            </div>
            <div className="px-4 py-3 text-[11px] text-slate-500 leading-relaxed border-t border-slate-100">
              {t.mediumExampleNote}
            </div>
          </div>

          {/* Large example: section */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-4 pt-4 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {t.largeExampleHeader}
            </div>
            <div className="p-6 flex items-center justify-center" style={DOTTED_BG}>
              <div
                className="bg-white rounded-lg border border-slate-200 w-full max-w-[180px] flex flex-col"
                style={{ gap: '32px', padding: '24px' }}
              >
                <div className="text-[10px] font-semibold text-slate-700">
                  {t.largeExampleSectionA}
                </div>
                <div
                  className="border-t border-dashed border-slate-200"
                  style={{ marginTop: '-16px', marginBottom: '-16px' }}
                />
                <div className="text-[10px] font-semibold text-slate-700">
                  {t.largeExampleSectionB}
                </div>
              </div>
            </div>
            <div className="px-4 py-3 text-[11px] text-slate-500 leading-relaxed border-t border-slate-100">
              {t.largeExampleNote}
            </div>
          </div>
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
              to="/foundations/borders"
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
