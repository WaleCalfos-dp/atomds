import { type Brand } from '../data/tokens';
import { type Language } from '../data/languages';
import { DocsTemplate, DOTTED_BG, type DocsCopy } from '../components/DocsTemplate';

interface PageProps { brand: Brand; lang?: Language }

const COPY: Record<Language, DocsCopy> = {
  en: {
    headline: 'Web Search',
    tagline: 'A title-plus-input search composition. Use on landing or content pages where users need a prominent way to enter keywords and submit.',
    badgeFeedback: 'Chrome', badgeStable: 'Stable',
    sectionAnatomy: 'Anatomy', sectionVariants: 'Variants', sectionTokens: 'Design Tokens', sectionA11y: 'Accessibility', sectionUsage: 'Usage',
    columnProperty: 'Property', columnValues: 'Values', columnUsage: 'Usage', columnCssVar: 'CSS Variable',
    valueColumnTpl: (b) => `Value (${b})`,
    anatomyIntro: 'Three optional pieces: a heading, an Input field, and a submit Button.',
    anatomyParts: [
      { num: '1', name: 'Title', desc: 'Optional H2-level heading above the field. Boolean: Title (default on). Text: Title Text (default "Search").' },
      { num: '2', name: 'Input', desc: 'A standard search-type Input. Always rendered.' },
      { num: '3', name: 'Button',desc: 'Submit button beside the input. Boolean: Button (default on).' },
    ],
    variantRows: [
      { prop: 'Type',         vals: 'Default (only published value)' },
      { prop: 'Booleans (2)', vals: 'Title (default on), Button (default on)' },
      { prop: 'Text slots (1)', vals: 'Title Text (default "Search")' },
    ],
    tokensIntroLead: 'Inherits the Input + Button token surfaces.',
    tokenRows: [
      { label: 'Title fg',  cssVar: '--atom-foreground-primary-fg-brand-primary',         tokenKey: 'atom.foreground.primary.fg-brand-primary',         fallback: '#0a2333' },
      { label: 'Input bg',  cssVar: '--atom-background-primary-bg-primary-inverse',       tokenKey: 'atom.background.primary.bg-primary-inverse',       fallback: '#ffffff' },
      { label: 'Border',    cssVar: '--atom-border-default-border-default',               tokenKey: 'atom.border.default.border-default',               fallback: '#cdcbcb' },
      { label: 'Button bg', cssVar: '--atom-background-primary-bg-primary-default',       tokenKey: 'atom.background.primary.bg-primary-default',       fallback: '#0a2333' },
      { label: 'Button fg', cssVar: '--atom-foreground-primary-fg-brand-primary-inverse', tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse', fallback: '#ffffff' },
    ],
    a11yIntro: 'Treat as a form. Submit on Enter or Button click.',
    a11yRows: [
      { icon: '🏷️', title: 'role="search"', body: 'Wrap in <search role="search"> (or <form role="search">). Provides a landmark.' },
      { icon: '⌨️', title: 'Submit',         body: 'Pressing Enter inside the input must submit the search. Don\'t require a Button click.' },
      { icon: '🔎', title: 'Input label',    body: 'Even with the visible Title, give the input an aria-label="Search" so users with the Title hidden still hear context.' },
      { icon: '🎨', title: 'Focus ring',     body: 'Input shows a 3px focus ring on Tab. Don\'t suppress it.' },
    ],
    usageIntro: 'A header-level affordance — pair with content lists below.',
    usageCards: [
      { title: 'Landing page', when: 'Hero region with a prominent search field.' },
      { title: 'Catalogue',    when: 'Sticky search above filterable lists.' },
      { title: 'Help centre',  when: 'Docs sites where keyword search is the primary way users find pages.' },
    ],
    whenToUseTitle: '✓ When to use', whenNotToUseTitle: '✗ When not to use',
    whenToUse: [
      'Use when keyword search is the primary navigation',
      'Always allow Enter to submit',
      'Pair with predictive results below the field',
      'Surface a clear "Clear" button when input has text',
    ],
    whenNotToUse: [
      "Don't use for in-page filtering — use a Filter pattern instead",
      "Don't omit submit Button on touch surfaces",
      "Don't auto-search on every keystroke without debounce",
      "Don't hide on scroll — keep the search anchored",
    ],
  },
  zh: {
    headline: '网页搜索',
    tagline: '由标题加输入框组成的搜索组合。用于落地页或内容页面,需要为用户提供显眼的关键词输入与提交入口。',
    badgeFeedback: '页面框架', badgeStable: '稳定版',
    sectionAnatomy: '结构剖析', sectionVariants: '变体', sectionTokens: '设计令牌', sectionA11y: '可访问性', sectionUsage: '用法',
    columnProperty: '属性', columnValues: '可选值', columnUsage: '用途', columnCssVar: 'CSS 变量',
    valueColumnTpl: (b) => `值 (${b})`,
    anatomyIntro: '三个可选部件:标题、输入框和提交按钮。',
    anatomyParts: [
      { num: '1', name: '标题',   desc: '可选的 H2 级标题,位于字段上方。布尔值:Title(默认开)。文本:Title Text(默认 "Search")。' },
      { num: '2', name: '输入框', desc: '标准的搜索类型输入框。始终渲染。' },
      { num: '3', name: '按钮',   desc: '位于输入框旁的提交按钮。布尔值:Button(默认开)。' },
    ],
    variantRows: [
      { prop: 'Type',         vals: 'Default(已发布的唯一取值)' },
      { prop: '布尔值 (2)',   vals: 'Title(默认开)、Button(默认开)' },
      { prop: '文本插槽 (1)', vals: 'Title Text(默认 "Search")' },
    ],
    tokensIntroLead: '继承输入框 + 按钮的令牌表面。',
    tokenRows: [
      { label: '标题前景',  cssVar: '--atom-foreground-primary-fg-brand-primary',         tokenKey: 'atom.foreground.primary.fg-brand-primary',         fallback: '#0a2333' },
      { label: '输入背景',  cssVar: '--atom-background-primary-bg-primary-inverse',       tokenKey: 'atom.background.primary.bg-primary-inverse',       fallback: '#ffffff' },
      { label: '边框',      cssVar: '--atom-border-default-border-default',               tokenKey: 'atom.border.default.border-default',               fallback: '#cdcbcb' },
      { label: '按钮背景',  cssVar: '--atom-background-primary-bg-primary-default',       tokenKey: 'atom.background.primary.bg-primary-default',       fallback: '#0a2333' },
      { label: '按钮前景',  cssVar: '--atom-foreground-primary-fg-brand-primary-inverse', tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse', fallback: '#ffffff' },
    ],
    a11yIntro: '当作表单处理。按 Enter 或点击按钮即可提交。',
    a11yRows: [
      { icon: '🏷️', title: 'role="search"', body: '包裹在 <search role="search">(或 <form role="search">)中。提供地标。' },
      { icon: '⌨️', title: '提交',          body: '在输入框内按 Enter 必须提交搜索。不要强制点击按钮。' },
      { icon: '🔎', title: '输入框标签',    body: '即便可见标题存在,也为输入框设置 aria-label="搜索",当标题被隐藏时用户仍能听到上下文。' },
      { icon: '🎨', title: '焦点环',        body: '输入框聚焦时显示 3px 焦点环。不要将其去除。' },
    ],
    usageIntro: '页头级别的入口——配合下方的内容列表使用。',
    usageCards: [
      { title: '落地页',     when: '英雄区放置显眼的搜索字段。' },
      { title: '目录',       when: '可筛选列表上方的粘性搜索。' },
      { title: '帮助中心',   when: '关键词搜索是用户寻找页面主要方式的文档站。' },
    ],
    whenToUseTitle: '✓ 推荐使用', whenNotToUseTitle: '✗ 避免使用',
    whenToUse: [
      '当关键词搜索是主要导航方式时使用',
      '始终允许按 Enter 提交',
      '在字段下方显示预测性结果',
      '当输入框有文本时显示"清除"按钮',
    ],
    whenNotToUse: [
      '不要用于页面内筛选——请改用 Filter 模式',
      '在触屏界面不要省略提交按钮',
      '不要在每次按键时自动搜索而无防抖',
      '不要在滚动时隐藏——让搜索保持锚定',
    ],
  },
};

export function WebSearchPage({ brand, lang = 'en' }: PageProps) {
  const t = COPY[lang];
  const preview = (
    <div className="flex items-center justify-center" style={{ ...DOTTED_BG, height: 320 }}>
      <div style={{ width: 480 }}>
        <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)' }}>{lang === 'zh' ? '搜索' : 'Search'}</h2>
        <div className="flex gap-2">
          <input className="flex-1 px-3 py-2.5 text-sm border rounded-md" style={{ borderColor: 'var(--atom-border-default-border-default, #cdcbcb)', backgroundColor: 'var(--atom-background-primary-bg-primary-inverse, #ffffff)' }} placeholder={lang === 'zh' ? '输入关键词…' : 'Enter keywords…'} />
          <button className="px-4 py-2 rounded-md text-sm font-semibold text-white" style={{ backgroundColor: 'var(--atom-background-primary-bg-primary-default, #0a2333)' }}>{lang === 'zh' ? '搜索' : 'Search'}</button>
        </div>
      </div>
    </div>
  );
  return <DocsTemplate brand={brand} preview={preview} t={t} />;
}
