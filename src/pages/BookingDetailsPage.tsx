import { type Brand } from '../data/tokens';
import { type Language } from '../data/languages';
import { DocsTemplate, DOTTED_BG, type DocsCopy } from '../components/DocsTemplate';

interface PageProps { brand: Brand; lang?: Language }

const COPY: Record<Language, DocsCopy> = {
  en: {
    headline: 'Booking Details',
    tagline: 'Summary widget that surfaces every key field of an existing booking — date, time, party size, and price — in a compact card.',
    badgeFeedback: 'Widget', badgeStable: 'Stable',
    sectionAnatomy: 'Anatomy', sectionVariants: 'Variants', sectionTokens: 'Design Tokens', sectionA11y: 'Accessibility', sectionUsage: 'Usage',
    columnProperty: 'Property', columnValues: 'Values', columnUsage: 'Usage', columnCssVar: 'CSS Variable',
    valueColumnTpl: (b) => `Value (${b})`,
    anatomyIntro: 'A bordered card with a heading and a key/value list of booking facts.',
    anatomyParts: [
      { num: '1', name: 'Heading',     desc: 'Booking title or service name. Body Large + Bold.' },
      { num: '2', name: 'Detail rows', desc: 'Date / time / party size / price as labelled rows. Each row uses Body Default.' },
      { num: '3', name: 'Action link', desc: 'Optional inline Text Link to "Manage booking".' },
    ],
    variantRows: [
      { prop: 'Property 1', vals: 'Default (only published value)' },
    ],
    tokensIntroLead: 'Inherits Card / List Item tokens.',
    tokenRows: [
      { label: 'Surface', cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff' },
      { label: 'Border',  cssVar: '--atom-border-default-border-divider',          tokenKey: 'atom.border.default.border-divider',          fallback: '#cdcbcb' },
      { label: 'Heading', cssVar: '--atom-foreground-primary-fg-brand-primary',    tokenKey: 'atom.foreground.primary.fg-brand-primary',    fallback: '#0a2333' },
      { label: 'Body',    cssVar: '--atom-foreground-core-fg-primary',             tokenKey: 'atom.foreground.core.fg-primary',             fallback: '#4b4a4a' },
    ],
    a11yIntro: 'Read-only summary — make every value selectable and announce updates.',
    a11yRows: [
      { icon: '📋', title: 'Definition list', body: 'Mark up rows as <dl><dt>label</dt><dd>value</dd></dl> so screen readers announce label/value pairs.' },
      { icon: '🔊', title: 'Live updates',    body: 'If a row changes (e.g. price recalculation), set aria-live="polite" on that row.' },
      { icon: '🎨', title: 'Contrast',        body: 'Heading + body combinations meet AA across all 6 brands.' },
    ],
    usageIntro: 'Place at the top of confirmation, manage-booking, or print pages.',
    usageCards: [
      { title: 'Confirmation', when: 'After payment success — show every booking fact.' },
      { title: 'Manage page',  when: 'Account flow listing user\'s upcoming bookings.' },
      { title: 'Receipt',      when: 'Email or printable receipt — pair with Logo + branding.' },
    ],
    whenToUseTitle: '✓ When to use', whenNotToUseTitle: '✗ When not to use',
    whenToUse: [
      'Always at the top of a confirmation flow',
      'Use definition list semantics for label/value pairs',
      'Pair with a Manage Booking Text Link below the card',
      'Show currency and date in the user\'s locale',
    ],
    whenNotToUse: [
      "Don't use for editable form data — use Input + Data Group instead",
      "Don't show empty rows — hide a row when its value is missing",
      "Don't truncate values aggressively — wrap long lines instead",
    ],
  },
  zh: {
    headline: '预订详情',
    tagline: '汇总组件,在紧凑卡片中展示已有预订的所有关键字段——日期、时间、人数和价格。',
    badgeFeedback: '业务组件', badgeStable: '稳定版',
    sectionAnatomy: '结构剖析', sectionVariants: '变体', sectionTokens: '设计令牌', sectionA11y: '可访问性', sectionUsage: '用法',
    columnProperty: '属性', columnValues: '可选值', columnUsage: '用途', columnCssVar: 'CSS 变量',
    valueColumnTpl: (b) => `值 (${b})`,
    anatomyIntro: '带边框的卡片,包含标题和键值对的预订信息列表。',
    anatomyParts: [
      { num: '1', name: '标题',     desc: '预订标题或服务名称。Body Large + Bold。' },
      { num: '2', name: '详情行',   desc: '日期 / 时间 / 人数 / 价格作为带标签的行。每行使用 Body Default。' },
      { num: '3', name: '操作链接', desc: '可选的内联文本链接(如"管理预订")。' },
    ],
    variantRows: [
      { prop: 'Property 1', vals: 'Default(已发布的唯一取值)' },
    ],
    tokensIntroLead: '继承卡片 / 列表项令牌。',
    tokenRows: [
      { label: '表面', cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff' },
      { label: '边框', cssVar: '--atom-border-default-border-divider',          tokenKey: 'atom.border.default.border-divider',          fallback: '#cdcbcb' },
      { label: '标题', cssVar: '--atom-foreground-primary-fg-brand-primary',    tokenKey: 'atom.foreground.primary.fg-brand-primary',    fallback: '#0a2333' },
      { label: '正文', cssVar: '--atom-foreground-core-fg-primary',             tokenKey: 'atom.foreground.core.fg-primary',             fallback: '#4b4a4a' },
    ],
    a11yIntro: '只读汇总——所有值可选中,变更时主动播报。',
    a11yRows: [
      { icon: '📋', title: '定义列表', body: '将行标记为 <dl><dt>标签</dt><dd>值</dd></dl>,使屏幕阅读器播报标签 / 值对。' },
      { icon: '🔊', title: '实时更新', body: '若某行变更(例如价格重算),在该行设置 aria-live="polite"。' },
      { icon: '🎨', title: '对比度',   body: '标题 + 正文组合在 6 个品牌中均满足 AA。' },
    ],
    usageIntro: '放置于确认、管理预订或打印页面顶部。',
    usageCards: [
      { title: '确认',     when: '付款成功后——显示所有预订信息。' },
      { title: '管理页',   when: '账户流程列出用户即将到来的预订。' },
      { title: '收据',     when: '邮件或可打印收据——配合 Logo + 品牌使用。' },
    ],
    whenToUseTitle: '✓ 推荐使用', whenNotToUseTitle: '✗ 避免使用',
    whenToUse: [
      '始终放在确认流程的顶部',
      '为标签 / 值对使用定义列表语义',
      '在卡片下方配合"管理预订"文本链接',
      '按用户区域显示货币与日期',
    ],
    whenNotToUse: [
      '不要用于可编辑的表单数据——请改用 Input + Data Group',
      '不要显示空行——值缺失时隐藏该行',
      '不要过度截断值——长行请换行',
    ],
  },
};

export function BookingDetailsPage({ brand, lang = 'en' }: PageProps) {
  const t = COPY[lang];
  const preview = (
    <div className="flex items-center justify-center" style={{ ...DOTTED_BG, padding: 32 }}>
      <div className="bg-white rounded-xl border border-slate-200 p-6" style={{ width: 360 }}>
        <h3 className="text-base font-bold mb-4" style={{ color: 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)' }}>{lang === 'zh' ? '快速通道 — 第 1 航站楼' : 'Fast Track — Terminal 1'}</h3>
        <dl className="space-y-2 text-sm">
          {[
            [lang === 'zh' ? '日期' : 'Date', '14 Jan 2026'],
            [lang === 'zh' ? '时间' : 'Time', '10:30'],
            [lang === 'zh' ? '人数' : 'Party',  '2'],
            [lang === 'zh' ? '价格' : 'Price', '£30.00'],
          ].map(([dt, dd]) => (
            <div key={dt} className="flex justify-between border-b border-slate-100 pb-2 last:border-b-0">
              <dt className="text-slate-500">{dt}</dt>
              <dd className="font-medium text-slate-900">{dd}</dd>
            </div>
          ))}
        </dl>
        <a className="block mt-4 text-sm underline" style={{ color: 'var(--atom-foreground-core-fg-link, #006b99)' }}>{lang === 'zh' ? '管理预订' : 'Manage booking'}</a>
      </div>
    </div>
  );
  return <DocsTemplate brand={brand} preview={preview} t={t} />;
}
