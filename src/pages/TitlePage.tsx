import { type Brand } from '../data/tokens';
import { type Language } from '../data/languages';
import { DocsTemplate, DOTTED_BG, type DocsCopy } from '../components/DocsTemplate';

interface PageProps { brand: Brand; lang?: Language }

const COPY: Record<Language, DocsCopy> = {
  en: {
    headline: 'Title',
    tagline: 'Defines text hierarchy and ensures readability and brand consistency. Apply heading sizes (Hero / H1–H5) according to content importance and layout needs. Six sizes × two shades = 12 variants.',
    badgeFeedback: 'Foundation', badgeStable: 'Stable',
    sectionAnatomy: 'Anatomy', sectionVariants: 'Variants', sectionTokens: 'Design Tokens', sectionA11y: 'Accessibility', sectionUsage: 'Usage',
    columnProperty: 'Property', columnValues: 'Values', columnUsage: 'Usage', columnCssVar: 'CSS Variable',
    valueColumnTpl: (b) => `Value (${b})`,
    anatomyIntro: 'A single text run with a per-size scale and a Dark / Light shade selector.',
    anatomyParts: [
      { num: '1', name: 'Title text', desc: 'Renders the Title text via the brand-aware --atom-font-heading family. Letter-spacing tightens at larger sizes.' },
    ],
    variantRows: [
      { prop: 'Size',  vals: 'Hero (default · 56px) · H1 (40) · H2 (32) · H3 (24) · H4 (20) · H5 (16)' },
      { prop: 'Shade', vals: 'Dark (default · fg-brand-primary) · Light (white text for use on dark surfaces)' },
      { prop: 'Text slots (1)', vals: 'Title (default "Title Text")' },
    ],
    tokensIntroLead: 'Title resolves to brand foreground tokens; size and weight come from the type ramp.',
    tokenRows: [
      { label: 'Dark shade fg', cssVar: '--atom-foreground-primary-fg-brand-primary',         tokenKey: 'atom.foreground.primary.fg-brand-primary',         fallback: '#0a2333' },
      { label: 'Light shade fg',cssVar: '--atom-foreground-primary-fg-brand-primary-inverse', tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse', fallback: '#ffffff' },
    ],
    a11yIntro: 'Use the right HTML heading level — semantics matter as much as size.',
    a11yRows: [
      { icon: '🏷️', title: 'HTML element', body: 'Map Hero/H1 → <h1>, H2 → <h2>, etc. Don\'t skip levels just because the visual size matches.' },
      { icon: '🎨', title: 'Contrast',     body: 'Dark shade meets AAA on light surfaces; Light shade meets AA on dark/branded backgrounds.' },
      { icon: '📏', title: 'Line length',  body: 'Keep titles under 60 characters per line. Long Heros wrap into 2 lines max.' },
      { icon: '🌍', title: 'Language',     body: '中文 titles use the same scale; the heading family resolves per active brand and language.' },
    ],
    usageIntro: 'Pick the size based on hierarchy, not aesthetics.',
    usageCards: [
      { title: 'Hero',  when: 'Above-the-fold marketing pages, single Hero per page.' },
      { title: 'H1',    when: 'Section openers in long-form content; one per route.' },
      { title: 'H2',    when: 'Sub-section headings within content.' },
      { title: 'H3',    when: 'Component or card-level titles.' },
      { title: 'H4',    when: 'Form group labels, list-item titles.' },
      { title: 'H5',    when: 'Smallest heading; reserve for very dense layouts.' },
    ],
    whenToUseTitle: '✓ When to use', whenNotToUseTitle: '✗ When not to use',
    whenToUse: [
      'Match HTML heading level to the visual size',
      'Use Light shade only on solid dark or brand surfaces',
      'Keep one Hero or H1 per page',
      'Pair with Body component for paragraph copy',
    ],
    whenNotToUse: [
      "Don't use Title for body or caption text — use Body instead",
      "Don't apply Light shade on white backgrounds",
      "Don't skip heading levels for visual reasons",
      "Don't override font-family inline — let --atom-font-heading resolve",
    ],
  },
  zh: {
    headline: '标题',
    tagline: '定义文本层级,确保可读性与品牌一致性。根据内容重要性和布局需要应用标题尺寸(Hero / H1–H5)。6 种尺寸 × 2 种色调 = 12 种变体。',
    badgeFeedback: '基础', badgeStable: '稳定版',
    sectionAnatomy: '结构剖析', sectionVariants: '变体', sectionTokens: '设计令牌', sectionA11y: '可访问性', sectionUsage: '用法',
    columnProperty: '属性', columnValues: '可选值', columnUsage: '用途', columnCssVar: 'CSS 变量',
    valueColumnTpl: (b) => `值 (${b})`,
    anatomyIntro: '单段文本,带按尺寸缩放和 Dark / Light 色调选择。',
    anatomyParts: [
      { num: '1', name: '标题文本', desc: '通过品牌感知的 --atom-font-heading 字体渲染标题。在较大尺寸下字距收紧。' },
    ],
    variantRows: [
      { prop: '尺寸', vals: 'Hero(默认 · 56px)· H1(40)· H2(32)· H3(24)· H4(20)· H5(16)' },
      { prop: '色调', vals: 'Dark(默认 · fg-brand-primary)· Light(白色文字,用于深色表面)' },
      { prop: '文本插槽 (1)', vals: 'Title(默认 "Title Text")' },
    ],
    tokensIntroLead: '标题解析为品牌前景令牌;尺寸和字重来自字体阶梯。',
    tokenRows: [
      { label: 'Dark 色调前景', cssVar: '--atom-foreground-primary-fg-brand-primary',         tokenKey: 'atom.foreground.primary.fg-brand-primary',         fallback: '#0a2333' },
      { label: 'Light 色调前景',cssVar: '--atom-foreground-primary-fg-brand-primary-inverse', tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse', fallback: '#ffffff' },
    ],
    a11yIntro: '使用正确的 HTML 标题级别——语义和尺寸同样重要。',
    a11yRows: [
      { icon: '🏷️', title: 'HTML 元素', body: '将 Hero/H1 映射到 <h1>,H2 映射到 <h2>,以此类推。不要因为视觉尺寸匹配就跳级。' },
      { icon: '🎨', title: '对比度',    body: 'Dark 色调在浅色表面达到 AAA;Light 色调在深色 / 品牌背景达到 AA。' },
      { icon: '📏', title: '行长',      body: '标题保持每行 60 字符以内。长 Hero 最多换行至 2 行。' },
      { icon: '🌍', title: '语言',      body: '中文标题使用相同阶梯;标题字体随当前品牌和语言解析。' },
    ],
    usageIntro: '根据层级选择尺寸,而非美学。',
    usageCards: [
      { title: 'Hero', when: '首屏营销页面,每页一个 Hero。' },
      { title: 'H1',   when: '长内容的章节起始;每个路由一个。' },
      { title: 'H2',   when: '内容内的子章节标题。' },
      { title: 'H3',   when: '组件或卡片级标题。' },
      { title: 'H4',   when: '表单分组标签、列表项标题。' },
      { title: 'H5',   when: '最小标题;保留给非常密集的布局。' },
    ],
    whenToUseTitle: '✓ 推荐使用', whenNotToUseTitle: '✗ 避免使用',
    whenToUse: [
      'HTML 标题级别与视觉尺寸匹配',
      '仅在纯深色或品牌色表面使用 Light 色调',
      '每页保留一个 Hero 或 H1',
      '段落正文与 Body 组件配对',
    ],
    whenNotToUse: [
      '不要将标题用于正文或说明文字——请使用 Body',
      '不要在白色背景上使用 Light 色调',
      '不要因视觉原因跳过标题级别',
      '不要内联覆盖 font-family——让 --atom-font-heading 自动解析',
    ],
  },
};

export function TitlePage({ brand, lang = 'en' }: PageProps) {
  const t = COPY[lang];
  const sizes: { name: string; px: number; weight: number }[] = [
    { name: 'Hero', px: 56, weight: 700 }, { name: 'H1', px: 40, weight: 700 }, { name: 'H2', px: 32, weight: 600 },
    { name: 'H3', px: 24, weight: 600 }, { name: 'H4', px: 20, weight: 600 }, { name: 'H5', px: 16, weight: 600 },
  ];
  const preview = (
    <div className="p-8 space-y-3" style={DOTTED_BG}>
      {sizes.map((s) => (
        <div key={s.name} className="bg-white rounded-md px-4 py-3 flex items-baseline gap-4 shadow-sm border border-slate-100">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider w-12">{s.name}</span>
          <span style={{ fontSize: s.px, fontWeight: s.weight, color: 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)', fontFamily: 'var(--atom-font-heading, Poppins, sans-serif)', lineHeight: 1.1 }}>
            {lang === 'zh' ? '标题文本' : 'Title Text'}
          </span>
        </div>
      ))}
    </div>
  );
  return <DocsTemplate brand={brand} preview={preview} t={t} />;
}
