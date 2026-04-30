import { type Brand } from '../data/tokens';
import { type Language } from '../data/languages';
import { DocsTemplate, DOTTED_BG, type DocsCopy } from '../components/DocsTemplate';

interface PageProps { brand: Brand; lang?: Language }

const COPY: Record<Language, DocsCopy> = {
  en: {
    headline: 'Header',
    tagline: 'Provides a top-level navigation, search, or page-title area. Sits at the top of every page and anchors brand identity, primary navigation, and contextual actions.',
    badgeFeedback: 'Chrome', badgeStable: 'Stable',
    sectionAnatomy: 'Anatomy', sectionVariants: 'Variants', sectionTokens: 'Design Tokens', sectionA11y: 'Accessibility', sectionUsage: 'Usage',
    columnProperty: 'Property', columnValues: 'Values', columnUsage: 'Usage', columnCssVar: 'CSS Variable',
    valueColumnTpl: (b) => `Value (${b})`,
    anatomyIntro: 'Eight Type variants change the layout dramatically. Common parts: status bar, back button, title block, optional search/tabs/filters.',
    anatomyParts: [
      { num: '1', name: 'App Status Bar', desc: 'Mobile-only system row at the very top. Toggle via the App Status Bar boolean.' },
      { num: '2', name: 'Back Button',    desc: 'Optional leading affordance for nested screens.' },
      { num: '3', name: 'Title block',    desc: 'Page Title (TEXT) + optional Subtitle. Boolean: Title and Subtitle.' },
      { num: '4', name: 'Search Bar',     desc: 'Inline search input. Variant Type=Search renders this prominently.' },
      { num: '5', name: 'Filters / Tabs', desc: 'Secondary navigation row. Booleans: Filters, Tabs, Date Filter, Counter Badge.' },
      { num: '6', name: 'Trailing icon',  desc: 'Optional right-aligned action (cart, profile). Boolean: Icon Right.' },
    ],
    variantRows: [
      { prop: 'Type', vals: 'Image (default) · Default · Search · Background · Bottom Sheet · Brand Logo · Calendar · Co-brand' },
      { prop: 'Product Module', vals: 'All (default) · Lounge · Transport' },
      { prop: 'Booleans (12)', vals: 'Icon Right, Back Button, Filters, Search Bar, Navigation + Details, Title and Subtitle, Tabs, App Status Bar, Counter Badge, Dates, Date Filter — defaults all on' },
      { prop: 'Text slots (5)', vals: 'Page Title, Header Title, Header description (Subtitle), Airport Text ("Choose airport"), Destination Text ("Choose destination")' },
    ],
    tokensIntroLead: 'Header inherits brand-primary surface tokens and uses inverse foreground for content on the brand bar.',
    tokenRows: [
      { label: 'Bar bg',     cssVar: '--atom-background-primary-bg-primary-default',         tokenKey: 'atom.background.primary.bg-primary-default',         fallback: '#0a2333' },
      { label: 'Bar fg',     cssVar: '--atom-foreground-primary-fg-brand-primary-inverse',   tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse',   fallback: '#ffffff' },
      { label: 'Search bg',  cssVar: '--atom-background-primary-bg-primary-inverse',         tokenKey: 'atom.background.primary.bg-primary-inverse',         fallback: '#ffffff' },
      { label: 'Divider',    cssVar: '--atom-border-default-border-divider',                 tokenKey: 'atom.border.default.border-divider',                 fallback: '#cdcbcb' },
    ],
    a11yIntro: 'The Header is a landmark — let assistive tech navigate to it directly.',
    a11yRows: [
      { icon: '🏷️', title: 'role="banner"',    body: 'Wrap the Header in <header role="banner">. Limit to one banner landmark per page.' },
      { icon: '⌨️', title: 'Keyboard',         body: 'All controls in the header must be keyboard reachable in DOM order: Back → Title → Search → Trailing actions.' },
      { icon: '🔎', title: 'Search labelling', body: 'When Type=Search, the input must have aria-label="Search" or a visible Label. Submit on Enter; never auto-search on focus.' },
      { icon: '🎨', title: 'Contrast',          body: 'White-on-brand combinations meet AA across all 6 brands. Verify each new brand before shipping.' },
    ],
    usageIntro: 'Pick a Type that matches the page job-to-be-done.',
    usageCards: [
      { title: 'Image',     when: 'Marketing or hero pages — large brand image with title overlay.' },
      { title: 'Default',   when: 'Standard pages with title + breadcrumbs.' },
      { title: 'Search',    when: 'Search-first surfaces (catalogue, marketplace).' },
      { title: 'Calendar',  when: 'Date-driven flows. Expose Date Filter and Dates booleans.' },
      { title: 'Bottom Sheet', when: 'Mobile sub-views opened over a base page.' },
      { title: 'Co-brand',  when: 'Partnership flows. Pair brand logo with a co-brand mark.' },
    ],
    whenToUseTitle: '✓ When to use', whenNotToUseTitle: '✗ When not to use',
    whenToUse: [
      'Use exactly one Header per page',
      'Pair the Type with the page job (Search → Search type, Date flow → Calendar)',
      'Show Back Button on every nested page',
      'Use Title and Subtitle for context-rich screens',
    ],
    whenNotToUse: [
      "Don't stack multiple banner-role headers",
      "Don't omit App Status Bar on mobile — it stops content from being clipped by the system",
      "Don't put primary CTAs in the trailing icon slot — keep them in the page body",
      "Don't change Type mid-flow — header stability anchors orientation",
    ],
  },
  zh: {
    headline: '页头',
    tagline: '提供顶部导航、搜索或页面标题区域。位于每个页面的顶部,锚定品牌标识、主要导航和上下文操作。',
    badgeFeedback: '页面框架', badgeStable: '稳定版',
    sectionAnatomy: '结构剖析', sectionVariants: '变体', sectionTokens: '设计令牌', sectionA11y: '可访问性', sectionUsage: '用法',
    columnProperty: '属性', columnValues: '可选值', columnUsage: '用途', columnCssVar: 'CSS 变量',
    valueColumnTpl: (b) => `值 (${b})`,
    anatomyIntro: '8 种 Type 变体大幅改变布局。通用部件:状态栏、返回按钮、标题块、可选的搜索 / 标签 / 筛选。',
    anatomyParts: [
      { num: '1', name: '应用状态栏',   desc: '仅移动端的系统行,位于最顶部。通过 App Status Bar 布尔值切换。' },
      { num: '2', name: '返回按钮',     desc: '嵌套屏幕的可选前置操作。' },
      { num: '3', name: '标题块',       desc: 'Page Title(文本)+ 可选副标题。布尔值:Title and Subtitle。' },
      { num: '4', name: '搜索栏',       desc: '内联搜索输入框。Type=Search 突出显示。' },
      { num: '5', name: '筛选 / 标签',   desc: '次级导航行。布尔值:Filters、Tabs、Date Filter、Counter Badge。' },
      { num: '6', name: '尾部图标',     desc: '可选右对齐操作(购物车、个人中心)。布尔值:Icon Right。' },
    ],
    variantRows: [
      { prop: 'Type', vals: 'Image(默认)· Default · Search · Background · Bottom Sheet · Brand Logo · Calendar · Co-brand' },
      { prop: 'Product Module', vals: 'All(默认)· Lounge · Transport' },
      { prop: '布尔值 (12)', vals: 'Icon Right、Back Button、Filters、Search Bar、Navigation + Details、Title and Subtitle、Tabs、App Status Bar、Counter Badge、Dates、Date Filter——默认全部开启' },
      { prop: '文本插槽 (5)', vals: 'Page Title、Header Title、Header description(副标题)、Airport Text("Choose airport")、Destination Text("Choose destination")' },
    ],
    tokensIntroLead: '页头继承品牌主色表面令牌,在品牌色横条上使用反色前景。',
    tokenRows: [
      { label: '横条背景',  cssVar: '--atom-background-primary-bg-primary-default',         tokenKey: 'atom.background.primary.bg-primary-default',         fallback: '#0a2333' },
      { label: '横条前景',  cssVar: '--atom-foreground-primary-fg-brand-primary-inverse',   tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse',   fallback: '#ffffff' },
      { label: '搜索背景',  cssVar: '--atom-background-primary-bg-primary-inverse',         tokenKey: 'atom.background.primary.bg-primary-inverse',         fallback: '#ffffff' },
      { label: '分隔线',    cssVar: '--atom-border-default-border-divider',                 tokenKey: 'atom.border.default.border-divider',                 fallback: '#cdcbcb' },
    ],
    a11yIntro: '页头是一个地标——让辅助技术可以直接导航到它。',
    a11yRows: [
      { icon: '🏷️', title: 'role="banner"', body: '将页头包裹在 <header role="banner"> 中。每页限一个 banner 地标。' },
      { icon: '⌨️', title: '键盘',          body: '页头中所有控件必须按 DOM 顺序键盘可达:返回 → 标题 → 搜索 → 尾部操作。' },
      { icon: '🔎', title: '搜索标注',      body: '当 Type=Search 时,输入框必须有 aria-label="搜索" 或可见标签。按 Enter 提交;切勿在聚焦时自动搜索。' },
      { icon: '🎨', title: '对比度',        body: '白色 / 品牌色组合在 6 个品牌中均满足 AA 标准。新增品牌时务必逐一验证。' },
    ],
    usageIntro: '根据页面要完成的任务选择 Type。',
    usageCards: [
      { title: 'Image',        when: '营销或英雄页面——大幅品牌图加标题叠加。' },
      { title: 'Default',      when: '带标题 + 面包屑的标准页面。' },
      { title: 'Search',       when: '以搜索为先的界面(目录、市场)。' },
      { title: 'Calendar',     when: '日期驱动的流程。开启 Date Filter 与 Dates 布尔值。' },
      { title: 'Bottom Sheet', when: '在基础页面之上打开的移动端子视图。' },
      { title: 'Co-brand',     when: '合作流程。品牌徽标与联合品牌标识配对。' },
    ],
    whenToUseTitle: '✓ 推荐使用', whenNotToUseTitle: '✗ 避免使用',
    whenToUse: [
      '每页恰好使用一个页头',
      '将 Type 与页面任务匹配(搜索 → Search 类型,日期流程 → Calendar)',
      '在每个嵌套页面显示返回按钮',
      '上下文丰富的屏幕使用 Title 和 Subtitle',
    ],
    whenNotToUse: [
      '不要堆叠多个 banner 角色的页头',
      '不要在移动端省略应用状态栏——它防止内容被系统遮挡',
      '不要把主 CTA 放进尾部图标插槽——保留在页面正文中',
      '不要在流程中途切换 Type——页头稳定性锚定方向感',
    ],
  },
};

export function HeaderPage({ brand, lang = 'en' }: PageProps) {
  const t = COPY[lang];
  const preview = (
    <div className="flex items-start justify-center" style={{ ...DOTTED_BG, padding: 32 }}>
      <div style={{ width: 360, borderRadius: 16, overflow: 'hidden', boxShadow: '0 10px 24px rgba(10,35,51,0.08)' }}>
        <div style={{ height: 24, backgroundColor: 'var(--atom-background-primary-bg-primary-default, #0a2333)' }} />
        <div style={{ padding: '12px 16px', backgroundColor: 'var(--atom-background-primary-bg-primary-default, #0a2333)', color: 'var(--atom-foreground-primary-fg-brand-primary-inverse, #ffffff)' }}>
          <div className="flex items-center gap-3">
            <span aria-hidden>‹</span>
            <div className="flex-1">
              <p className="text-sm font-semibold m-0">{lang === 'zh' ? '我的预订' : 'My Bookings'}</p>
              <p className="text-[11px] opacity-80 m-0">{lang === 'zh' ? '3 项即将到来' : '3 upcoming'}</p>
            </div>
            <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">★</span>
          </div>
        </div>
        <div className="bg-white p-3 flex gap-2 border-b border-slate-100">
          <input className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-md" placeholder={lang === 'zh' ? '搜索行程' : 'Search trips'} />
          <button className="text-xs px-3 rounded-md bg-slate-900 text-white">{lang === 'zh' ? '筛选' : 'Filters'}</button>
        </div>
        <div className="bg-white p-4 flex justify-center gap-3 text-xs text-slate-500">
          <span className="font-semibold text-slate-900">{lang === 'zh' ? '即将到来' : 'Upcoming'}</span>
          <span>{lang === 'zh' ? '过往' : 'Past'}</span>
          <span>{lang === 'zh' ? '取消' : 'Cancelled'}</span>
        </div>
      </div>
    </div>
  );
  return <DocsTemplate brand={brand} preview={preview} t={t} />;
}
