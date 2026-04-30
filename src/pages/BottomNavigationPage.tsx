import { type Brand } from '../data/tokens';
import { type Language } from '../data/languages';
import { DocsTemplate, DOTTED_BG, type DocsCopy } from '../components/DocsTemplate';

interface PageProps { brand: Brand; lang?: Language }

const COPY: Record<Language, DocsCopy> = {
  en: {
    headline: 'Bottom Navigation',
    tagline: 'Persistent mobile-app bar at the bottom of the screen offering quick access to 3–5 main sections. Each option is a top-level destination — never use for transient actions or deep links.',
    badgeFeedback: 'Chrome', badgeStable: 'Stable',
    sectionAnatomy: 'Anatomy', sectionVariants: 'Variants', sectionTokens: 'Design Tokens', sectionA11y: 'Accessibility', sectionUsage: 'Usage',
    columnProperty: 'Property', columnValues: 'Values', columnUsage: 'Usage', columnCssVar: 'CSS Variable',
    valueColumnTpl: (b) => `Value (${b})`,
    anatomyIntro: 'A row of evenly-spaced icon + label tabs anchored to the viewport bottom.',
    anatomyParts: [
      { num: '1', name: 'Tab',         desc: 'Each tab is a 24×24 icon with a 12px label below. Active state uses brand foreground; inactive uses fg-secondary.' },
      { num: '2', name: 'Active dot',  desc: '4px circular indicator above the active tab\'s icon.' },
      { num: '3', name: 'Safe area',   desc: '34px iOS home-indicator gap below the tab row. Tab row sits 60px tall above it.' },
    ],
    variantRows: [
      { prop: 'Options', vals: '5 (default) · 4 · 3 — controls how many tabs render' },
    ],
    tokensIntroLead: 'Brand-aware foregrounds for active vs. inactive tabs.',
    tokenRows: [
      { label: 'Bar bg',         cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff' },
      { label: 'Active tab fg',  cssVar: '--atom-foreground-primary-fg-brand-primary',   tokenKey: 'atom.foreground.primary.fg-brand-primary',   fallback: '#0a2333' },
      { label: 'Inactive tab fg',cssVar: '--atom-foreground-core-fg-secondary',          tokenKey: 'atom.foreground.core.fg-secondary',          fallback: '#737272' },
      { label: 'Top divider',    cssVar: '--atom-border-default-border-divider',         tokenKey: 'atom.border.default.border-divider',         fallback: '#cdcbcb' },
    ],
    a11yIntro: 'Mark up as a navigation landmark with explicit current state.',
    a11yRows: [
      { icon: '🏷️', title: 'role="navigation"', body: 'Wrap in <nav aria-label="Bottom navigation">. Each tab is a <button> or <a>.' },
      { icon: '⌨️', title: 'Keyboard',           body: 'Tab order matches DOM order. Hardware Tab key still works for non-touch users.' },
      { icon: '📏', title: 'Target size',        body: 'Each tab must be at least 44×44px to meet WCAG 2.5.5.' },
      { icon: '🎨', title: 'Active state',       body: 'Use aria-current="page" plus a visible dot — colour alone is insufficient for colour-blind users.' },
    ],
    usageIntro: 'Mobile-only chrome. Pair with a top-level Header on every screen.',
    usageCards: [
      { title: '3 options', when: 'Minimal apps — Home, Search, Profile.' },
      { title: '4 options', when: 'Standard apps — adds Cart or Notifications.' },
      { title: '5 options', when: 'Maximum recommended — beyond 5 the labels truncate uncomfortably.' },
    ],
    whenToUseTitle: '✓ When to use', whenNotToUseTitle: '✗ When not to use',
    whenToUse: [
      'Use 3–5 destinations of equal importance',
      'Show one Active tab at all times',
      'Keep labels under 12 characters',
      'Pair with a top Header for page context',
    ],
    whenNotToUse: [
      "Don't use for transient actions (Save, Cancel) — use Button Group instead",
      "Don't exceed 5 tabs — labels truncate and target size shrinks",
      "Don't hide on scroll — bottom nav must remain anchored",
      "Don't use on desktop — pair Menu Bar + Header instead",
    ],
  },
  zh: {
    headline: '底部导航',
    tagline: '常驻于移动应用底部的横条,可快速访问 3–5 个主要区域。每个选项都是顶层目的地——切勿用于临时操作或深层链接。',
    badgeFeedback: '页面框架', badgeStable: '稳定版',
    sectionAnatomy: '结构剖析', sectionVariants: '变体', sectionTokens: '设计令牌', sectionA11y: '可访问性', sectionUsage: '用法',
    columnProperty: '属性', columnValues: '可选值', columnUsage: '用途', columnCssVar: 'CSS 变量',
    valueColumnTpl: (b) => `值 (${b})`,
    anatomyIntro: '一行均匀分布的图标 + 标签标签页,锚定在视口底部。',
    anatomyParts: [
      { num: '1', name: '标签页', desc: '每个标签页是 24×24 图标加下方 12px 标签。激活态使用品牌前景色;非激活使用 fg-secondary。' },
      { num: '2', name: '激活圆点', desc: '激活标签图标上方的 4px 圆形指示器。' },
      { num: '3', name: '安全区域', desc: '标签行下方 34px 的 iOS Home 指示条间距。标签行高 60px,位于其上。' },
    ],
    variantRows: [
      { prop: '选项数', vals: '5(默认)· 4 · 3——控制渲染的标签页数量' },
    ],
    tokensIntroLead: '激活与非激活标签页使用品牌感知前景。',
    tokenRows: [
      { label: '横条背景',     cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff' },
      { label: '激活标签前景', cssVar: '--atom-foreground-primary-fg-brand-primary',   tokenKey: 'atom.foreground.primary.fg-brand-primary',   fallback: '#0a2333' },
      { label: '非激活前景',   cssVar: '--atom-foreground-core-fg-secondary',          tokenKey: 'atom.foreground.core.fg-secondary',          fallback: '#737272' },
      { label: '顶部分隔线',   cssVar: '--atom-border-default-border-divider',         tokenKey: 'atom.border.default.border-divider',         fallback: '#cdcbcb' },
    ],
    a11yIntro: '标记为导航地标,并明确显示当前状态。',
    a11yRows: [
      { icon: '🏷️', title: 'role="navigation"', body: '包裹在 <nav aria-label="底部导航"> 中。每个标签页为 <button> 或 <a>。' },
      { icon: '⌨️', title: '键盘',               body: 'Tab 顺序与 DOM 顺序一致。硬件 Tab 键对非触屏用户仍然有效。' },
      { icon: '📏', title: '目标尺寸',           body: '每个标签页至少 44×44px,以满足 WCAG 2.5.5。' },
      { icon: '🎨', title: '激活状态',           body: '使用 aria-current="page" 加可见圆点——单凭颜色对色盲用户不够。' },
    ],
    usageIntro: '仅用于移动端的页面框架。每个屏幕都应配合顶部页头。',
    usageCards: [
      { title: '3 个选项', when: '极简应用——首页、搜索、个人中心。' },
      { title: '4 个选项', when: '标准应用——增加购物车或通知。' },
      { title: '5 个选项', when: '建议上限——超过 5 个标签会被尴尬截断。' },
    ],
    whenToUseTitle: '✓ 推荐使用', whenNotToUseTitle: '✗ 避免使用',
    whenToUse: [
      '使用 3–5 个同等重要的目的地',
      '始终显示一个激活标签页',
      '标签长度保持在 12 字符以内',
      '与顶部页头配合提供页面上下文',
    ],
    whenNotToUse: [
      '不要用于临时操作(保存、取消)——请改用按钮组',
      '不要超过 5 个标签——会出现截断并缩小目标尺寸',
      '不要在滚动时隐藏——底部导航必须保持锚定',
      '不要在桌面端使用——请改用菜单栏 + 页头',
    ],
  },
};

export function BottomNavigationPage({ brand, lang = 'en' }: PageProps) {
  const t = COPY[lang];
  const labels = lang === 'zh' ? ['首页', '搜索', '行程', '个人'] : ['Home', 'Search', 'Trips', 'Profile'];
  const preview = (
    <div className="flex items-end justify-center" style={{ ...DOTTED_BG, height: 280 }}>
      <div className="flex items-center justify-around bg-white rounded-t-xl border-t border-slate-100 shadow-sm py-2 px-4" style={{ width: 360 }}>
        {labels.map((lbl, i) => (
          <div key={lbl} className="flex flex-col items-center gap-1 px-3 py-1" style={{ color: i === 0 ? 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)' : 'var(--atom-foreground-core-fg-secondary, #737272)' }}>
            <div className="w-6 h-6 rounded bg-current opacity-30" />
            <span className="text-[10px] font-medium">{lbl}</span>
          </div>
        ))}
      </div>
    </div>
  );
  return <DocsTemplate brand={brand} preview={preview} t={t} />;
}
