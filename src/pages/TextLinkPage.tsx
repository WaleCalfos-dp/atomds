import { type Brand } from '../data/tokens';
import { type Language } from '../data/languages';
import { DocsTemplate, DOTTED_BG, type DocsCopy } from '../components/DocsTemplate';

interface PageProps { brand: Brand; lang?: Language }

const COPY: Record<Language, DocsCopy> = {
  en: {
    headline: 'Text Link',
    tagline: 'Inline navigation surface for jumping to another page or surface. Four sizes × three weights = 12 variants. Always carries an underline so it remains identifiable next to plain Body text.',
    badgeFeedback: 'Foundation', badgeStable: 'Stable',
    sectionAnatomy: 'Anatomy', sectionVariants: 'Variants', sectionTokens: 'Design Tokens', sectionA11y: 'Accessibility', sectionUsage: 'Usage',
    columnProperty: 'Property', columnValues: 'Values', columnUsage: 'Usage', columnCssVar: 'CSS Variable',
    valueColumnTpl: (b) => `Value (${b})`,
    anatomyIntro: 'A single text run with a underline-style indicator.',
    anatomyParts: [
      { num: '1', name: 'Link text', desc: 'Inherits Body sizing. Colour resolves to atom.foreground.core.fg-link by default; transitions to fg-hover on hover, fg-pressed on active.' },
      { num: '2', name: 'Underline', desc: '1px underline under the text. Always visible — never use color alone to signal interactivity.' },
    ],
    variantRows: [
      { prop: 'Size',   vals: 'Large (default · 16px) · Regular (14) · Small (13) · X-small (12)' },
      { prop: 'weight', vals: 'Regular (default · 400) · Semi-Bold (600) · Bold (700)' },
      { prop: 'Text slots (1)', vals: 'Link (default "Link Text")' },
    ],
    tokensIntroLead: 'Three foreground states drive the link colour ramp.',
    tokenRows: [
      { label: 'Default fg', cssVar: '--atom-foreground-core-fg-link',     tokenKey: 'atom.foreground.core.fg-link',     fallback: '#006b99' },
      { label: 'Hover fg',   cssVar: '--atom-foreground-states-fg-hover',  tokenKey: 'atom.foreground.states.fg-hover',  fallback: '#045477' },
      { label: 'Pressed fg', cssVar: '--atom-foreground-states-fg-pressed',tokenKey: 'atom.foreground.states.fg-pressed',fallback: '#063e56' },
    ],
    a11yIntro: 'A link is a navigation control — keep semantics, focus, and contrast consistent.',
    a11yRows: [
      { icon: '🔗', title: 'Use <a>',     body: 'Always render as an anchor with href. Don\'t use <button> for navigation; that breaks browser back / open-in-new-tab.' },
      { icon: '⌨️', title: 'Focus ring',  body: 'Show a 3px focus ring on Tab. Don\'t suppress :focus-visible.' },
      { icon: '👁️', title: 'Underline',   body: 'Keep the underline at all sizes. Removing it relies on colour alone, which fails for colour-blind users.' },
      { icon: '🔁', title: 'External',    body: 'External links must include rel="noopener noreferrer" and a visual indicator (e.g. external icon) when target="_blank".' },
    ],
    usageIntro: 'Match the size to the surrounding text — never larger.',
    usageCards: [
      { title: 'Large',   when: 'Inside Hero sections or large hero text.' },
      { title: 'Regular', when: 'Default in long-form Body copy.' },
      { title: 'Small',   when: 'Helper text, footer rows.' },
      { title: 'X-small', when: 'Compact UI like tables and chips.' },
    ],
    whenToUseTitle: '✓ When to use', whenNotToUseTitle: '✗ When not to use',
    whenToUse: [
      'Use for navigation between pages or surfaces',
      'Match Size to the surrounding Body text',
      'Always preserve the underline',
      'Open external links in a new tab with a clear indicator',
    ],
    whenNotToUse: [
      "Don't use for actions — use Button or Tertiary Button",
      "Don't strip the underline",
      "Don't use Bold weight as a substitute for emphasis — use Semi-Bold",
      "Don't change link color inline — let the token ramp resolve",
    ],
  },
  zh: {
    headline: '文本链接',
    tagline: '用于跳转到另一页面或界面的内联导航。4 种尺寸 × 3 种字重 = 12 种变体。始终携带下划线,使其在普通正文旁仍可识别。',
    badgeFeedback: '基础', badgeStable: '稳定版',
    sectionAnatomy: '结构剖析', sectionVariants: '变体', sectionTokens: '设计令牌', sectionA11y: '可访问性', sectionUsage: '用法',
    columnProperty: '属性', columnValues: '可选值', columnUsage: '用途', columnCssVar: 'CSS 变量',
    valueColumnTpl: (b) => `值 (${b})`,
    anatomyIntro: '单段文本,带下划线样式指示器。',
    anatomyParts: [
      { num: '1', name: '链接文本', desc: '继承正文尺寸。默认颜色解析为 atom.foreground.core.fg-link;悬停过渡到 fg-hover,激活过渡到 fg-pressed。' },
      { num: '2', name: '下划线',   desc: '文本下方的 1px 下划线。始终可见——切勿单凭颜色表明可交互性。' },
    ],
    variantRows: [
      { prop: '尺寸', vals: 'Large(默认 · 16px)· Regular(14)· Small(13)· X-small(12)' },
      { prop: '字重', vals: 'Regular(默认 · 400)· Semi-Bold(600)· Bold(700)' },
      { prop: '文本插槽 (1)', vals: 'Link(默认 "Link Text")' },
    ],
    tokensIntroLead: '三个前景状态驱动链接的色调阶梯。',
    tokenRows: [
      { label: '默认前景', cssVar: '--atom-foreground-core-fg-link',     tokenKey: 'atom.foreground.core.fg-link',     fallback: '#006b99' },
      { label: '悬停前景', cssVar: '--atom-foreground-states-fg-hover',  tokenKey: 'atom.foreground.states.fg-hover',  fallback: '#045477' },
      { label: '按下前景', cssVar: '--atom-foreground-states-fg-pressed',tokenKey: 'atom.foreground.states.fg-pressed',fallback: '#063e56' },
    ],
    a11yIntro: '链接是导航控件——保持语义、焦点和对比度的一致性。',
    a11yRows: [
      { icon: '🔗', title: '使用 <a>',  body: '始终渲染为带 href 的锚点。不要用 <button> 代替导航;这会破坏浏览器的返回 / 在新标签打开行为。' },
      { icon: '⌨️', title: '焦点环',    body: '按 Tab 时显示 3px 焦点环。不要抑制 :focus-visible。' },
      { icon: '👁️', title: '下划线',    body: '在所有尺寸保留下划线。去除则只能依赖颜色,色盲用户会失效。' },
      { icon: '🔁', title: '外链',      body: '外部链接必须包含 rel="noopener noreferrer",且 target="_blank" 时配以可见标识(如外链图标)。' },
    ],
    usageIntro: '尺寸与周围文本匹配——切勿更大。',
    usageCards: [
      { title: 'Large',   when: '英雄区或大字号文本中。' },
      { title: 'Regular', when: '长内容正文的默认。' },
      { title: 'Small',   when: '辅助文字、页脚行。' },
      { title: 'X-small', when: '表格、Chip 等紧凑 UI。' },
    ],
    whenToUseTitle: '✓ 推荐使用', whenNotToUseTitle: '✗ 避免使用',
    whenToUse: [
      '用于页面或界面之间的导航',
      '尺寸与周围正文匹配',
      '始终保留下划线',
      '外链在新标签打开,并配以清晰标识',
    ],
    whenNotToUse: [
      '不要用于操作——请使用按钮或 Tertiary 按钮',
      '不要去除下划线',
      '不要用 Bold 字重代替强调——请改用 Semi-Bold',
      '不要内联修改链接颜色——让令牌阶梯解析',
    ],
  },
};

export function TextLinkPage({ brand, lang = 'en' }: PageProps) {
  const t = COPY[lang];
  const sizes = [16, 14, 13, 12];
  const labels = ['Large', 'Regular', 'Small', 'X-small'];
  const preview = (
    <div className="p-8 space-y-3" style={DOTTED_BG}>
      {sizes.map((px, i) => (
        <div key={px} className="bg-white rounded-md px-4 py-3 flex items-baseline gap-4 shadow-sm border border-slate-100">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider w-16">{labels[i]}</span>
          <span style={{ fontSize: px, fontWeight: 400, color: 'var(--atom-foreground-core-fg-primary, #4b4a4a)', fontFamily: 'var(--atom-font-body, Poppins, sans-serif)' }}>
            {lang === 'zh' ? '阅读' : 'Read'}{' '}
            <a style={{ color: 'var(--atom-foreground-core-fg-link, #006b99)', textDecoration: 'underline' }}>{lang === 'zh' ? '了解更多' : 'Learn more'}</a>
            {' '}{lang === 'zh' ? '关于设计令牌的内容。' : 'about design tokens.'}
          </span>
        </div>
      ))}
    </div>
  );
  return <DocsTemplate brand={brand} preview={preview} t={t} />;
}
