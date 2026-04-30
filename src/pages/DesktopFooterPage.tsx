import { type Brand } from '../data/tokens';
import { type Language } from '../data/languages';
import { DocsTemplate, type DocsCopy } from '../components/DocsTemplate';

interface PageProps { brand: Brand; lang?: Language }

const COPY: Record<Language, DocsCopy> = {
  en: {
    headline: 'Desktop Footer',
    tagline: 'Page-level footer with secondary navigation, legal links, language picker, and brand mark. Sits at the bottom of every long-form page.',
    badgeFeedback: 'Chrome', badgeStable: 'Stable',
    sectionAnatomy: 'Anatomy', sectionVariants: 'Variants', sectionTokens: 'Design Tokens', sectionA11y: 'Accessibility', sectionUsage: 'Usage',
    columnProperty: 'Property', columnValues: 'Values', columnUsage: 'Usage', columnCssVar: 'CSS Variable',
    valueColumnTpl: (b) => `Value (${b})`,
    anatomyIntro: 'Three columns of links + a bottom bar with brand, copyright, and locale.',
    anatomyParts: [
      { num: '1', name: 'Column heading', desc: '12px / weight 600, fg-tertiary. Groups related links.' },
      { num: '2', name: 'Column links',   desc: '14px / weight 400, fg-primary. Hover transitions to brand-primary.' },
      { num: '3', name: 'Bottom bar',     desc: 'Holds the brand mark, copyright string, and a Language Picker.' },
    ],
    variantRows: [
      { prop: 'Breakpoint', vals: 'Desktop (default) · Tablet · Mobile — Columns reflow to a single stack on Mobile' },
    ],
    tokensIntroLead: 'Footer uses muted surface tokens to differentiate from the page body.',
    tokenRows: [
      { label: 'Surface',   cssVar: '--atom-background-core-bg-secondary', tokenKey: 'atom.background.core.bg-secondary', fallback: '#faf8f7' },
      { label: 'Heading',   cssVar: '--atom-foreground-core-fg-tertiary',  tokenKey: 'atom.foreground.core.fg-tertiary',  fallback: '#afaead' },
      { label: 'Link',      cssVar: '--atom-foreground-core-fg-primary',   tokenKey: 'atom.foreground.core.fg-primary',   fallback: '#4b4a4a' },
      { label: 'Link hover',cssVar: '--atom-foreground-states-fg-hover',   tokenKey: 'atom.foreground.states.fg-hover',   fallback: '#045477' },
      { label: 'Divider',   cssVar: '--atom-border-default-border-divider',tokenKey: 'atom.border.default.border-divider',fallback: '#cdcbcb' },
    ],
    a11yIntro: 'A contentinfo landmark — let users navigate to it directly.',
    a11yRows: [
      { icon: '🏷️', title: 'role="contentinfo"', body: 'Wrap in <footer role="contentinfo">. Limit to one per page.' },
      { icon: '⌨️', title: 'Keyboard',           body: 'Tab through columns left-to-right, then bottom bar. Bottom bar links go before the language picker.' },
      { icon: '🎨', title: 'Contrast',           body: 'Heading text uses fg-tertiary which can clip below AA on light backgrounds. Verify per brand.' },
      { icon: '🌍', title: 'Language picker',    body: 'Surface the active language with aria-current="true". Each option must announce its locale name in its native script (中文, Español).' },
    ],
    usageIntro: 'Always include a footer on long-form pages.',
    usageCards: [
      { title: 'Desktop', when: 'Three or four columns + bottom bar.' },
      { title: 'Tablet',  when: 'Two columns + bottom bar. Heading levels remain.' },
      { title: 'Mobile',  when: 'Single stack with collapsible Accordion-style sections.' },
    ],
    whenToUseTitle: '✓ When to use', whenNotToUseTitle: '✗ When not to use',
    whenToUse: [
      'Place at the very bottom of every long-form page',
      'Group links by topic (Product · Company · Legal)',
      'Pair the brand mark with a copyright line',
      'Surface the language and country picker on every brand',
    ],
    whenNotToUse: [
      "Don't add primary CTAs in the footer — keep the focus on links",
      "Don't repeat top-level menu items — use related sub-pages instead",
      "Don't bury legal links in tiny font — accessibility regulations require legible text",
      "Don't use on transient surfaces (modals, drawers)",
    ],
  },
  zh: {
    headline: '页脚',
    tagline: '页面级页脚,包含次级导航、法律链接、语言切换器和品牌标识。位于所有长内容页面的底部。',
    badgeFeedback: '页面框架', badgeStable: '稳定版',
    sectionAnatomy: '结构剖析', sectionVariants: '变体', sectionTokens: '设计令牌', sectionA11y: '可访问性', sectionUsage: '用法',
    columnProperty: '属性', columnValues: '可选值', columnUsage: '用途', columnCssVar: 'CSS 变量',
    valueColumnTpl: (b) => `值 (${b})`,
    anatomyIntro: '三列链接加上一条底部栏(含品牌、版权和语言)。',
    anatomyParts: [
      { num: '1', name: '列标题', desc: '12px / 字重 600,fg-tertiary。对相关链接进行分组。' },
      { num: '2', name: '列链接', desc: '14px / 字重 400,fg-primary。悬停过渡到 brand-primary。' },
      { num: '3', name: '底部栏', desc: '放置品牌标识、版权字符串和语言切换器。' },
    ],
    variantRows: [
      { prop: '断点', vals: 'Desktop(默认)· Tablet · Mobile——在移动端列重新排版为单列堆叠' },
    ],
    tokensIntroLead: '页脚使用静音表面令牌,与页面正文区分开来。',
    tokenRows: [
      { label: '表面',     cssVar: '--atom-background-core-bg-secondary', tokenKey: 'atom.background.core.bg-secondary', fallback: '#faf8f7' },
      { label: '标题',     cssVar: '--atom-foreground-core-fg-tertiary',  tokenKey: 'atom.foreground.core.fg-tertiary',  fallback: '#afaead' },
      { label: '链接',     cssVar: '--atom-foreground-core-fg-primary',   tokenKey: 'atom.foreground.core.fg-primary',   fallback: '#4b4a4a' },
      { label: '链接悬停', cssVar: '--atom-foreground-states-fg-hover',   tokenKey: 'atom.foreground.states.fg-hover',   fallback: '#045477' },
      { label: '分隔线',   cssVar: '--atom-border-default-border-divider',tokenKey: 'atom.border.default.border-divider',fallback: '#cdcbcb' },
    ],
    a11yIntro: 'contentinfo 地标——允许用户直接导航到它。',
    a11yRows: [
      { icon: '🏷️', title: 'role="contentinfo"', body: '包裹在 <footer role="contentinfo"> 中。每页限一个。' },
      { icon: '⌨️', title: '键盘',                body: '从左到右穿过各列,然后到底部栏。底部栏链接放在语言切换器之前。' },
      { icon: '🎨', title: '对比度',              body: '标题文本使用 fg-tertiary,在浅色背景上可能低于 AA。请按品牌逐一验证。' },
      { icon: '🌍', title: '语言切换器',          body: '使用 aria-current="true" 标记当前激活语言。每个选项的 native 名称(中文、Español)需正确播报。' },
    ],
    usageIntro: '在所有长内容页面始终包含页脚。',
    usageCards: [
      { title: '桌面', when: '三或四列加底部栏。' },
      { title: '平板', when: '两列加底部栏。保留标题层级。' },
      { title: '移动', when: '单列堆叠,使用可折叠的 Accordion 风格分组。' },
    ],
    whenToUseTitle: '✓ 推荐使用', whenNotToUseTitle: '✗ 避免使用',
    whenToUse: [
      '放在所有长内容页面的最底部',
      '按主题分组链接(产品 · 公司 · 法律)',
      '品牌标识与版权行配对',
      '在所有品牌中显式提供语言和国家选择器',
    ],
    whenNotToUse: [
      '不要在页脚中加入主 CTA——保持焦点在链接',
      '不要重复顶层菜单项——请改用相关子页面',
      '不要将法律链接埋在极小字体中——无障碍规定要求可读文字',
      '不要在临时界面(模态、抽屉)中使用',
    ],
  },
};

export function DesktopFooterPage({ brand, lang = 'en' }: PageProps) {
  const t = COPY[lang];
  const cols = lang === 'zh'
    ? [{ h: '产品', l: ['功能', '价格', 'API'] }, { h: '公司', l: ['关于', '招聘', '联系'] }, { h: '法律', l: ['条款', '隐私', 'Cookie'] }]
    : [{ h: 'Product', l: ['Features', 'Pricing', 'API'] }, { h: 'Company', l: ['About', 'Careers', 'Contact'] }, { h: 'Legal', l: ['Terms', 'Privacy', 'Cookies'] }];
  const preview = (
    <div className="px-8 py-8" style={{ backgroundColor: 'var(--atom-background-core-bg-secondary, #faf8f7)' }}>
      <div className="grid grid-cols-3 gap-8 mb-6">
        {cols.map((c) => (
          <div key={c.h}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--atom-foreground-core-fg-tertiary, #afaead)' }}>{c.h}</p>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--atom-foreground-core-fg-primary, #4b4a4a)' }}>
              {c.l.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t pt-4 flex items-center justify-between text-xs" style={{ borderColor: 'var(--atom-border-default-border-divider, #cdcbcb)', color: 'var(--atom-foreground-core-fg-secondary, #737272)' }}>
        <span>BRAND © 2026</span>
        <span>{lang === 'zh' ? 'EN · 中文' : 'EN · 中文'}</span>
      </div>
    </div>
  );
  return <DocsTemplate brand={brand} preview={preview} t={t} />;
}
