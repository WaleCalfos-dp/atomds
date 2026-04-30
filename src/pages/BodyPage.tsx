import { type Brand } from '../data/tokens';
import { type Language } from '../data/languages';
import { DocsTemplate, DOTTED_BG, type DocsCopy } from '../components/DocsTemplate';

interface PageProps { brand: Brand; lang?: Language }

const COPY: Record<Language, DocsCopy> = {
  en: {
    headline: 'Body',
    tagline: 'Defines the body-text ramp for paragraphs, captions, and supporting copy. Six sizes × three weights × two shades = 36 published variants.',
    badgeFeedback: 'Foundation', badgeStable: 'Stable',
    sectionAnatomy: 'Anatomy', sectionVariants: 'Variants', sectionTokens: 'Design Tokens', sectionA11y: 'Accessibility', sectionUsage: 'Usage',
    columnProperty: 'Property', columnValues: 'Values', columnUsage: 'Usage', columnCssVar: 'CSS Variable',
    valueColumnTpl: (b) => `Value (${b})`,
    anatomyIntro: 'A single text run with a per-size scale, a weight selector, and a Dark / Light shade selector.',
    anatomyParts: [
      { num: '1', name: 'Body text', desc: 'Renders via the brand-aware --atom-font-body family. Line-height ranges 1.4 (Micro) → 1.55 (Large).' },
    ],
    variantRows: [
      { prop: 'Size',     vals: 'Large (default · 16px) · Default (14) · Small (13) · X-small (12) · Caption (11) · Micro (10)' },
      { prop: 'weight',   vals: 'Regular (default · 400) · Semi-Bold (600) · Bold (700)' },
      { prop: 'Shade',    vals: 'Dark (default · fg-primary) · Light (white text on dark surfaces)' },
      { prop: 'Text slots (1)', vals: 'Body (default "Body Text")' },
    ],
    tokensIntroLead: 'Resolves to fg-primary on light surfaces and the inverse on dark.',
    tokenRows: [
      { label: 'Dark shade fg', cssVar: '--atom-foreground-core-fg-primary',                  tokenKey: 'atom.foreground.core.fg-primary',                   fallback: '#4b4a4a' },
      { label: 'Light shade fg',cssVar: '--atom-foreground-primary-fg-brand-primary-inverse', tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse',  fallback: '#ffffff' },
    ],
    a11yIntro: 'Body sets reading rhythm — keep it generous and respect user preferences.',
    a11yRows: [
      { icon: '📏', title: 'Minimum size', body: 'Avoid Caption (11) and Micro (10) for primary copy. Use only for legal text or dense data tables.' },
      { icon: '🎨', title: 'Contrast',     body: 'Dark fg-primary on white meets WCAG AA 7.1:1. Verify Light shade against the underlying brand surface.' },
      { icon: '🌍', title: 'Line length',  body: 'Aim for 60–80 characters per line. Constrain max-width on long-form text.' },
      { icon: '🔤', title: 'No font override', body: 'Let --atom-font-body resolve. Brand fonts include accessible weights at 400/600/700; don\'t inject custom families.' },
    ],
    usageIntro: 'Pick size, weight, and shade independently to match content rhythm.',
    usageCards: [
      { title: 'Large',   when: 'Lead paragraphs and important sub-headings.' },
      { title: 'Default', when: 'Standard paragraph copy across the product.' },
      { title: 'Small',   when: 'Helper text under inputs, secondary descriptions.' },
      { title: 'X-small', when: 'Compact UI like badges, chips, table cells.' },
      { title: 'Caption', when: 'Image captions, footnotes, legal disclaimers.' },
      { title: 'Micro',   when: 'Last-resort dense data — table cells with many columns.' },
    ],
    whenToUseTitle: '✓ When to use', whenNotToUseTitle: '✗ When not to use',
    whenToUse: [
      'Pair Default size with Regular weight for paragraphs',
      'Use Semi-Bold to emphasise without raising heading level',
      'Switch to Light shade only on solid dark or brand surfaces',
      'Keep Caption and Micro for non-essential text',
    ],
    whenNotToUse: [
      "Don't use Body for headings — use Title instead",
      "Don't use Bold weight as a substitute for headings",
      "Don't use Light shade on white",
      "Don't override line-height inline — let the ramp manage rhythm",
    ],
  },
  zh: {
    headline: '正文',
    tagline: '定义段落、说明文字和辅助文本的正文阶梯。6 种尺寸 × 3 种字重 × 2 种色调 = 36 个已发布变体。',
    badgeFeedback: '基础', badgeStable: '稳定版',
    sectionAnatomy: '结构剖析', sectionVariants: '变体', sectionTokens: '设计令牌', sectionA11y: '可访问性', sectionUsage: '用法',
    columnProperty: '属性', columnValues: '可选值', columnUsage: '用途', columnCssVar: 'CSS 变量',
    valueColumnTpl: (b) => `值 (${b})`,
    anatomyIntro: '单段文本,带按尺寸缩放、字重选择以及 Dark / Light 色调选择。',
    anatomyParts: [
      { num: '1', name: '正文文本', desc: '通过品牌感知的 --atom-font-body 字体渲染。行高从 1.4(Micro)到 1.55(Large)。' },
    ],
    variantRows: [
      { prop: '尺寸', vals: 'Large(默认 · 16px)· Default(14)· Small(13)· X-small(12)· Caption(11)· Micro(10)' },
      { prop: '字重', vals: 'Regular(默认 · 400)· Semi-Bold(600)· Bold(700)' },
      { prop: '色调', vals: 'Dark(默认 · fg-primary)· Light(深色表面上的白色文字)' },
      { prop: '文本插槽 (1)', vals: 'Body(默认 "Body Text")' },
    ],
    tokensIntroLead: '在浅色表面解析为 fg-primary,深色表面解析为反色。',
    tokenRows: [
      { label: 'Dark 色调前景', cssVar: '--atom-foreground-core-fg-primary',                  tokenKey: 'atom.foreground.core.fg-primary',                   fallback: '#4b4a4a' },
      { label: 'Light 色调前景',cssVar: '--atom-foreground-primary-fg-brand-primary-inverse', tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse',  fallback: '#ffffff' },
    ],
    a11yIntro: '正文决定阅读节奏——保持宽松,尊重用户偏好。',
    a11yRows: [
      { icon: '📏', title: '最小尺寸', body: '避免将 Caption(11)和 Micro(10)用于主要正文。仅用于法律文本或密集数据表。' },
      { icon: '🎨', title: '对比度',   body: 'Dark fg-primary 在白色背景达到 WCAG AA 7.1:1。Light 色调请按底层品牌表面验证。' },
      { icon: '🌍', title: '行长',     body: '目标为每行 60–80 字符。长内容文本约束 max-width。' },
      { icon: '🔤', title: '不覆盖字体', body: '让 --atom-font-body 自动解析。品牌字体在 400/600/700 包含可访问字重;不要注入自定义字体族。' },
    ],
    usageIntro: '独立选择尺寸、字重和色调以匹配内容节奏。',
    usageCards: [
      { title: 'Large',   when: '导语段落与重要子标题。' },
      { title: 'Default', when: '产品中的标准段落正文。' },
      { title: 'Small',   when: '输入框下的辅助文字、次要说明。' },
      { title: 'X-small', when: '徽章、Chip、表格单元等紧凑 UI。' },
      { title: 'Caption', when: '图像说明、脚注、法律声明。' },
      { title: 'Micro',   when: '万不得已的密集数据——多列表格单元。' },
    ],
    whenToUseTitle: '✓ 推荐使用', whenNotToUseTitle: '✗ 避免使用',
    whenToUse: [
      '段落使用 Default 尺寸 + Regular 字重',
      '使用 Semi-Bold 强调,无需提升标题级别',
      '仅在纯深色或品牌色表面切换至 Light 色调',
      'Caption 与 Micro 留给非关键文本',
    ],
    whenNotToUse: [
      '不要将正文用作标题——请改用 Title',
      '不要用 Bold 字重代替标题',
      '不要在白色背景上使用 Light 色调',
      '不要内联覆盖 line-height——让阶梯统一管理节奏',
    ],
  },
};

export function BodyPage({ brand, lang = 'en' }: PageProps) {
  const t = COPY[lang];
  const sizes = [16, 14, 13, 12, 11, 10];
  const labels = ['Large', 'Default', 'Small', 'X-small', 'Caption', 'Micro'];
  const preview = (
    <div className="p-8 space-y-2" style={DOTTED_BG}>
      {sizes.map((px, i) => (
        <div key={px} className="bg-white rounded-md px-4 py-2.5 flex items-center gap-4 shadow-sm border border-slate-100">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider w-16">{labels[i]}</span>
          <span style={{ fontSize: px, fontWeight: 400, color: 'var(--atom-foreground-core-fg-primary, #4b4a4a)', fontFamily: 'var(--atom-font-body, Poppins, sans-serif)' }}>{lang === 'zh' ? '当文本结构清晰、节奏一致时,阅读最为顺畅。' : 'Reading is easiest when text structure is clear and rhythm consistent.'}</span>
        </div>
      ))}
    </div>
  );
  return <DocsTemplate brand={brand} preview={preview} t={t} />;
}
