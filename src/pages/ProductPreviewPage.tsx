import { type Brand } from '../data/tokens';
import { type Language } from '../data/languages';
import { DocsTemplate, DOTTED_BG, type DocsCopy } from '../components/DocsTemplate';

interface PageProps { brand: Brand; lang?: Language }

const COPY: Record<Language, DocsCopy> = {
  en: {
    headline: 'Product Preview',
    tagline: 'Compact summary of a product instance — name, location, time/date, optional tag, and trailing affordance. Use in dashboards, booking history, or search results.',
    badgeFeedback: 'Widget · Commerce', badgeStable: 'Stable',
    sectionAnatomy: 'Anatomy', sectionVariants: 'Variants', sectionTokens: 'Design Tokens', sectionA11y: 'Accessibility', sectionUsage: 'Usage',
    columnProperty: 'Property', columnValues: 'Values', columnUsage: 'Usage', columnCssVar: 'CSS Variable',
    valueColumnTpl: (b) => `Value (${b})`,
    anatomyIntro: 'Image + textual content + trailing chevron in a single tappable row.',
    anatomyParts: [
      { num: '1', name: 'Product image', desc: '60×60 thumbnail. Boolean: Product Image (default on).' },
      { num: '2', name: 'Product name',  desc: 'Body Default Bold. Boolean: Product name (default on).' },
      { num: '3', name: 'Description / Location', desc: 'Body Small fg-secondary. Boolean: Description/Location (default on).' },
      { num: '4', name: 'Time and date', desc: 'Body Small fg-secondary, often on a separate line. Boolean: Time and date (default on).' },
      { num: '5', name: 'Tag',           desc: 'Optional Badge in the top-right (e.g. "Confirmed"). Boolean: Tag (default off).' },
      { num: '6', name: 'Icon right',    desc: 'Trailing chevron / arrow. Boolean: Icon right (default on).' },
    ],
    variantRows: [
      { prop: 'Module', vals: 'Fast Track (only published value, default)' },
      { prop: 'Booleans (5)', vals: 'Product name, Description/Location, Tag (default off), Time and date, Icon right, Product Image' },
      { prop: 'Text slots (3)', vals: 'Product name text, Description/Location Text, Time/DateText' },
    ],
    tokensIntroLead: 'Inherits Card / List Item tokens.',
    tokenRows: [
      { label: 'Surface', cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff' },
      { label: 'Border',  cssVar: '--atom-border-default-border-divider',          tokenKey: 'atom.border.default.border-divider',          fallback: '#cdcbcb' },
      { label: 'Title',   cssVar: '--atom-foreground-primary-fg-brand-primary',    tokenKey: 'atom.foreground.primary.fg-brand-primary',    fallback: '#0a2333' },
      { label: 'Caption', cssVar: '--atom-foreground-core-fg-secondary',           tokenKey: 'atom.foreground.core.fg-secondary',           fallback: '#737272' },
    ],
    a11yIntro: 'Treat each preview as a focusable navigation item.',
    a11yRows: [
      { icon: '🔗', title: 'Link semantics', body: 'Wrap the row in <a> if it navigates. Use <button> only if it triggers an in-place action.' },
      { icon: '⌨️', title: 'Keyboard', body: 'Each preview is one tab stop. Avoid making image, title, and chevron separately focusable — that\'s noisy.' },
      { icon: '🎨', title: 'Contrast', body: 'fg-secondary text on white meets AA across all 6 brands.' },
    ],
    usageIntro: 'List multiple in a stack with consistent spacing.',
    usageCards: [
      { title: 'Bookings list', when: 'Account flow listing upcoming and past bookings.' },
      { title: 'Search results', when: 'Time-driven results — flights, lounges, etc.' },
      { title: 'Dashboard',     when: 'Recent activity sections.' },
    ],
    whenToUseTitle: '✓ When to use', whenNotToUseTitle: '✗ When not to use',
    whenToUse: [
      'Use for time-or-location-tagged items',
      'Show one row per item, never wrap to two',
      'Always include a trailing affordance (Icon right) to signal navigability',
      'Keep image, title, and metadata in a single tappable row',
    ],
    whenNotToUse: [
      "Don't use for full product details — use Product Card",
      "Don't omit Time and date when the item is time-based",
      "Don't make individual chips focusable — keep one tab stop per row",
    ],
  },
  zh: {
    headline: '产品预览',
    tagline: '产品实例的紧凑摘要——名称、地点、时间 / 日期、可选标签和尾部入口。用于仪表盘、预订历史或搜索结果。',
    badgeFeedback: '业务组件 · 电商', badgeStable: '稳定版',
    sectionAnatomy: '结构剖析', sectionVariants: '变体', sectionTokens: '设计令牌', sectionA11y: '可访问性', sectionUsage: '用法',
    columnProperty: '属性', columnValues: '可选值', columnUsage: '用途', columnCssVar: 'CSS 变量',
    valueColumnTpl: (b) => `值 (${b})`,
    anatomyIntro: '图像 + 文本内容 + 尾部箭头,组成单个可点击的行。',
    anatomyParts: [
      { num: '1', name: '产品图像', desc: '60×60 缩略图。布尔值:Product Image(默认开)。' },
      { num: '2', name: '产品名称', desc: 'Body Default Bold。布尔值:Product name(默认开)。' },
      { num: '3', name: '说明 / 位置', desc: 'Body Small fg-secondary。布尔值:Description/Location(默认开)。' },
      { num: '4', name: '时间和日期', desc: 'Body Small fg-secondary,通常另起一行。布尔值:Time and date(默认开)。' },
      { num: '5', name: '标签',     desc: '右上角的可选徽章(例如"已确认")。布尔值:Tag(默认关)。' },
      { num: '6', name: '右侧图标', desc: '尾部箭头。布尔值:Icon right(默认开)。' },
    ],
    variantRows: [
      { prop: 'Module', vals: 'Fast Track(已发布的唯一取值,默认)' },
      { prop: '布尔值 (5)', vals: 'Product name、Description/Location、Tag(默认关)、Time and date、Icon right、Product Image' },
      { prop: '文本插槽 (3)', vals: 'Product name text、Description/Location Text、Time/DateText' },
    ],
    tokensIntroLead: '继承卡片 / 列表项令牌。',
    tokenRows: [
      { label: '表面',     cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff' },
      { label: '边框',     cssVar: '--atom-border-default-border-divider',          tokenKey: 'atom.border.default.border-divider',          fallback: '#cdcbcb' },
      { label: '标题',     cssVar: '--atom-foreground-primary-fg-brand-primary',    tokenKey: 'atom.foreground.primary.fg-brand-primary',    fallback: '#0a2333' },
      { label: '说明文字', cssVar: '--atom-foreground-core-fg-secondary',           tokenKey: 'atom.foreground.core.fg-secondary',           fallback: '#737272' },
    ],
    a11yIntro: '将每个预览视为可聚焦的导航项。',
    a11yRows: [
      { icon: '🔗', title: '链接语义', body: '若行需导航,包裹在 <a> 中。仅在触发就地操作时使用 <button>。' },
      { icon: '⌨️', title: '键盘',     body: '每个预览为一个 Tab 停留点。避免让图像、标题和箭头分别可聚焦——会过于嘈杂。' },
      { icon: '🎨', title: '对比度',   body: 'fg-secondary 文字在白色背景上对所有 6 个品牌均满足 AA。' },
    ],
    usageIntro: '在堆叠中以一致间距列出多项。',
    usageCards: [
      { title: '预订列表', when: '账户流程列出即将到来与过去的预订。' },
      { title: '搜索结果', when: '时间驱动的结果——航班、休息室等。' },
      { title: '仪表盘',   when: '最近活动区块。' },
    ],
    whenToUseTitle: '✓ 推荐使用', whenNotToUseTitle: '✗ 避免使用',
    whenToUse: [
      '用于带时间或地点标签的项目',
      '每项一行,不要换至两行',
      '始终包含尾部入口(Icon right)以标识可导航',
      '在单个可点击的行内放置图像、标题和元数据',
    ],
    whenNotToUse: [
      '不要用于完整产品详情——请使用产品卡片',
      '当项目带时间属性时不要省略时间和日期',
      '不要让单独的 Chip 可聚焦——每行保持一个 Tab 停留点',
    ],
  },
};

export function ProductPreviewPage({ brand, lang = 'en' }: PageProps) {
  const t = COPY[lang];
  const preview = (
    <div className="flex items-center justify-center" style={{ ...DOTTED_BG, padding: 32 }}>
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4" style={{ width: 420 }}>
        <div className="w-14 h-14 bg-slate-100 rounded-lg flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)' }}>{lang === 'zh' ? '快速通道 — 第 1 航站楼' : 'Fast Track — Terminal 1'}</p>
          <p className="text-xs text-slate-500 truncate">{lang === 'zh' ? '曼彻斯特机场 · 第 1 航站楼' : 'Manchester Airport · Terminal 1'}</p>
          <p className="text-xs text-slate-500 truncate">{lang === 'zh' ? '2024 年 3 月 30 日 · 10:00–10:30' : 'Wed 30 Mar 2024 · 10:00–10:30'}</p>
        </div>
        <span className="text-slate-400">›</span>
      </div>
    </div>
  );
  return <DocsTemplate brand={brand} preview={preview} t={t} />;
}
