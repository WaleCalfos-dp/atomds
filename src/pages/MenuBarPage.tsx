import { type Brand } from '../data/tokens';
import { type Language } from '../data/languages';
import { DocsTemplate, DOTTED_BG, type DocsCopy } from '../components/DocsTemplate';

interface PageProps { brand: Brand; lang?: Language }

const COPY: Record<Language, DocsCopy> = {
  en: {
    headline: 'Menu Bar',
    tagline: 'Desktop / tablet primary navigation. Pairs with Header to provide brand identity, search, and top-level menu items along a single horizontal bar.',
    badgeFeedback: 'Chrome', badgeStable: 'Stable',
    sectionAnatomy: 'Anatomy', sectionVariants: 'Variants', sectionTokens: 'Design Tokens', sectionA11y: 'Accessibility', sectionUsage: 'Usage',
    columnProperty: 'Property', columnValues: 'Values', columnUsage: 'Usage', columnCssVar: 'CSS Variable',
    valueColumnTpl: (b) => `Value (${b})`,
    anatomyIntro: 'Six toggleable parts arranged left → centre → right.',
    anatomyParts: [
      { num: '1', name: 'Logo',        desc: 'Brand mark, leading. Boolean: Logo (default on).' },
      { num: '2', name: 'Search input',desc: 'Inline search. Boolean: Search input (default on).' },
      { num: '3', name: 'Hamburger',   desc: 'Mobile-only fallback. Boolean: Hamburger (default on, shown on Tablet breakpoint).' },
      { num: '4', name: 'Menu items',  desc: 'Three top-level links. Booleans: Menu 1, Menu 2, Menu 3 (defaults all on).' },
    ],
    variantRows: [
      { prop: 'Breakpoint', vals: 'Tablet (default) · Desktop' },
      { prop: 'Booleans (6)', vals: 'Logo, Search input, Hamburger, Menu 1, Menu 2, Menu 3 — defaults all on' },
    ],
    tokensIntroLead: 'Inherits brand-primary tokens for the bar background.',
    tokenRows: [
      { label: 'Bar bg',  cssVar: '--atom-background-primary-bg-primary-inverse',   tokenKey: 'atom.background.primary.bg-primary-inverse',   fallback: '#ffffff' },
      { label: 'Item fg', cssVar: '--atom-foreground-primary-fg-brand-primary',     tokenKey: 'atom.foreground.primary.fg-brand-primary',     fallback: '#0a2333' },
      { label: 'Divider', cssVar: '--atom-border-default-border-divider',           tokenKey: 'atom.border.default.border-divider',           fallback: '#cdcbcb' },
    ],
    a11yIntro: 'A navigation landmark; let users skip past it.',
    a11yRows: [
      { icon: '🏷️', title: 'role="navigation"', body: 'Wrap menu items in <nav aria-label="Primary">. Provide a "Skip to content" link before the bar.' },
      { icon: '⌨️', title: 'Keyboard',           body: 'Tab through items in source order. Arrow keys navigate within the menu.' },
      { icon: '🎨', title: 'Active state',       body: 'Mark the current item with aria-current="page" plus a visible indicator (underline or weight).' },
    ],
    usageIntro: 'Pair with Header — Menu Bar is the navigation row, Header is the page-context row.',
    usageCards: [
      { title: 'Tablet', when: 'Hamburger collapses Menu 1-3 into a tray. Search stays inline.' },
      { title: 'Desktop', when: 'All menu items visible. Hamburger hidden.' },
    ],
    whenToUseTitle: '✓ When to use', whenNotToUseTitle: '✗ When not to use',
    whenToUse: [
      'Use exactly one Menu Bar per page',
      'Pair with Header (Menu Bar above, Header below) on desktop / tablet',
      'Mark the current section with aria-current="page"',
      'Provide a Skip-to-content link',
    ],
    whenNotToUse: [
      "Don't use on mobile — use Bottom Navigation instead",
      "Don't pack more than 5 menu items — use a Mega Menu pattern for bigger nav trees",
      "Don't omit the Logo — it doubles as a Home affordance",
    ],
  },
  zh: {
    headline: '菜单栏',
    tagline: '桌面 / 平板主要导航。与页头配对,在单一水平栏内提供品牌标识、搜索和顶层菜单项。',
    badgeFeedback: '页面框架', badgeStable: '稳定版',
    sectionAnatomy: '结构剖析', sectionVariants: '变体', sectionTokens: '设计令牌', sectionA11y: '可访问性', sectionUsage: '用法',
    columnProperty: '属性', columnValues: '可选值', columnUsage: '用途', columnCssVar: 'CSS 变量',
    valueColumnTpl: (b) => `值 (${b})`,
    anatomyIntro: '六个可切换部件,从左 → 中 → 右排列。',
    anatomyParts: [
      { num: '1', name: '徽标',     desc: '品牌标识,前置。布尔值:Logo(默认开)。' },
      { num: '2', name: '搜索框',   desc: '内联搜索。布尔值:Search input(默认开)。' },
      { num: '3', name: '汉堡菜单', desc: '仅移动端备用。布尔值:Hamburger(默认开,Tablet 断点显示)。' },
      { num: '4', name: '菜单项',   desc: '三个顶层链接。布尔值:Menu 1、Menu 2、Menu 3(默认全部开)。' },
    ],
    variantRows: [
      { prop: '断点', vals: 'Tablet(默认)· Desktop' },
      { prop: '布尔值 (6)', vals: 'Logo、Search input、Hamburger、Menu 1、Menu 2、Menu 3——默认全部开启' },
    ],
    tokensIntroLead: '继承品牌主色令牌用于横条背景。',
    tokenRows: [
      { label: '横条背景', cssVar: '--atom-background-primary-bg-primary-inverse',   tokenKey: 'atom.background.primary.bg-primary-inverse',   fallback: '#ffffff' },
      { label: '项目前景', cssVar: '--atom-foreground-primary-fg-brand-primary',     tokenKey: 'atom.foreground.primary.fg-brand-primary',     fallback: '#0a2333' },
      { label: '分隔线',   cssVar: '--atom-border-default-border-divider',           tokenKey: 'atom.border.default.border-divider',           fallback: '#cdcbcb' },
    ],
    a11yIntro: '导航地标;允许用户跳过它。',
    a11yRows: [
      { icon: '🏷️', title: 'role="navigation"', body: '将菜单项包裹在 <nav aria-label="Primary"> 中。在横条前提供"跳转到内容"链接。' },
      { icon: '⌨️', title: '键盘',               body: '按源顺序使用 Tab 切换。方向键在菜单内导航。' },
      { icon: '🎨', title: '激活状态',           body: '使用 aria-current="page" 标记当前项,并配以可见指示(下划线或字重)。' },
    ],
    usageIntro: '与页头配对——菜单栏是导航行,页头是页面上下文行。',
    usageCards: [
      { title: '平板', when: '汉堡菜单将 Menu 1-3 折叠到抽屉中。搜索保持内联。' },
      { title: '桌面', when: '所有菜单项可见。隐藏汉堡菜单。' },
    ],
    whenToUseTitle: '✓ 推荐使用', whenNotToUseTitle: '✗ 避免使用',
    whenToUse: [
      '每页恰好使用一个菜单栏',
      '在桌面 / 平板上与页头配对(菜单栏在上,页头在下)',
      '用 aria-current="page" 标记当前部分',
      '提供"跳转到内容"链接',
    ],
    whenNotToUse: [
      '不要在移动端使用——改用底部导航',
      '不要塞超过 5 个菜单项——更大的导航树请使用 Mega Menu',
      '不要省略徽标——它兼作 Home 入口',
    ],
  },
};

export function MenuBarPage({ brand, lang = 'en' }: PageProps) {
  const t = COPY[lang];
  const preview = (
    <div className="flex items-center justify-center" style={{ ...DOTTED_BG, height: 220 }}>
      <div className="flex items-center gap-6 px-6 py-4 bg-white rounded-lg shadow-sm border border-slate-100" style={{ width: '90%', maxWidth: 720 }}>
        <span className="text-sm font-bold tracking-tight" style={{ color: 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)' }}>BRAND</span>
        <input className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-md" placeholder={lang === 'zh' ? '搜索' : 'Search'} />
        <nav className="flex gap-4 text-xs" style={{ color: 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)' }}>
          <a className="font-semibold border-b-2 border-current pb-0.5">{lang === 'zh' ? '产品' : 'Products'}</a>
          <a>{lang === 'zh' ? '解决方案' : 'Solutions'}</a>
          <a>{lang === 'zh' ? '联系' : 'Contact'}</a>
        </nav>
      </div>
    </div>
  );
  return <DocsTemplate brand={brand} preview={preview} t={t} />;
}
