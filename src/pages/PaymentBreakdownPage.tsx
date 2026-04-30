import { type Brand } from '../data/tokens';
import { type Language } from '../data/languages';
import { DocsTemplate, DOTTED_BG, type DocsCopy } from '../components/DocsTemplate';

interface PageProps { brand: Brand; lang?: Language }

const COPY: Record<Language, DocsCopy> = {
  en: {
    headline: 'Payment Breakdown',
    tagline: 'Itemised charge summary — base price, fees, taxes, applied discounts, and the final total — shown above the Pay CTA at checkout. Two row counts published (3 or 5).',
    badgeFeedback: 'Widget · Payment', badgeStable: 'Stable',
    sectionAnatomy: 'Anatomy', sectionVariants: 'Variants', sectionTokens: 'Design Tokens', sectionA11y: 'Accessibility', sectionUsage: 'Usage',
    columnProperty: 'Property', columnValues: 'Values', columnUsage: 'Usage', columnCssVar: 'CSS Variable',
    valueColumnTpl: (b) => `Value (${b})`,
    anatomyIntro: 'A heading + a vertical list of label/value pairs ending in a bold Total row.',
    anatomyParts: [
      { num: '1', name: 'Title',       desc: 'Body Default Bold ("Your total"). Boolean: Title (default on).' },
      { num: '2', name: 'Item rows',   desc: 'Up to 5 charge rows: product label + price. Booleans: Item 1–5.' },
      { num: '3', name: 'Total row',   desc: 'Bold final row showing the payable amount. Boolean: Total (default on).' },
    ],
    variantRows: [
      { prop: 'Product Count', vals: '3 · 5 (default) — controls how many Item rows render' },
      { prop: 'Background Fill', vals: 'No (default) · Yes — wraps the breakdown in a muted surface' },
      { prop: 'Booleans (7)', vals: 'Title, Item 1, Item 2, Item 3, Item 4, Item 5, Total — defaults all on' },
      { prop: 'Text slots (13)', vals: 'Title Text ("Your total"), Item 1–5 Product Text + Price Text, Total Text ("Total"), Total Amount Text' },
    ],
    tokensIntroLead: 'Inherits Card surface tokens; total row uses the brand-primary foreground.',
    tokenRows: [
      { label: 'Surface',     cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff' },
      { label: 'Filled bg',   cssVar: '--atom-background-core-bg-secondary',          tokenKey: 'atom.background.core.bg-secondary',          fallback: '#faf8f7' },
      { label: 'Item label',  cssVar: '--atom-foreground-core-fg-primary',            tokenKey: 'atom.foreground.core.fg-primary',            fallback: '#4b4a4a' },
      { label: 'Total fg',    cssVar: '--atom-foreground-primary-fg-brand-primary',   tokenKey: 'atom.foreground.primary.fg-brand-primary',   fallback: '#0a2333' },
      { label: 'Divider',     cssVar: '--atom-border-default-border-divider',          tokenKey: 'atom.border.default.border-divider',          fallback: '#cdcbcb' },
    ],
    a11yIntro: 'Use a definition list so screen readers pair labels with values.',
    a11yRows: [
      { icon: '📋', title: 'Definition list', body: 'Mark up rows as <dl><dt>label</dt><dd>price</dd></dl>. Total uses bold styling and aria-live="polite" so updates announce.' },
      { icon: '🔊', title: 'Live total',      body: 'When item rows change (discount applied), aria-live on the Total announces the new amount.' },
      { icon: '🎨', title: 'Discount indicator', body: 'Format negatives as "− £10.00" with a leading minus, not just colour.' },
      { icon: '💰', title: 'Localisation',    body: 'Format currency per user locale. Don\'t hard-code "£" symbols in the data layer.' },
    ],
    usageIntro: 'Pair with the Pay CTA below; Background Fill=Yes when the breakdown sits over a busy page.',
    usageCards: [
      { title: '3 rows', when: 'Simple checkout with base + fee + total.' },
      { title: '5 rows', when: 'Detailed breakdown — product, taxes, fees, discount, plus total.' },
      { title: 'With fill', when: 'Page lacks a clear container — the muted surface separates the summary from background content.' },
    ],
    whenToUseTitle: '✓ When to use', whenNotToUseTitle: '✗ When not to use',
    whenToUse: [
      'Always show the Total in the same currency and decimals as the items',
      'Use the breakdown immediately above the Pay CTA',
      'Format negatives with a leading minus and a clear label ("Discount")',
      'Set aria-live on the Total row so updates announce',
    ],
    whenNotToUse: [
      "Don't hide line items behind a \"Show details\" toggle on critical purchases",
      "Don't omit the Total row — users need a single payable number",
      "Don't change currency mid-list — convert before display",
      "Don't use Background Fill when the page already has a card-shaped container",
    ],
  },
  zh: {
    headline: '支付明细',
    tagline: '逐项费用汇总——基础价格、服务费、税费、已应用的折扣以及最终总额——显示在结账页 Pay CTA 上方。已发布两种行数(3 或 5)。',
    badgeFeedback: '业务组件 · 支付', badgeStable: '稳定版',
    sectionAnatomy: '结构剖析', sectionVariants: '变体', sectionTokens: '设计令牌', sectionA11y: '可访问性', sectionUsage: '用法',
    columnProperty: '属性', columnValues: '可选值', columnUsage: '用途', columnCssVar: 'CSS 变量',
    valueColumnTpl: (b) => `值 (${b})`,
    anatomyIntro: '标题 + 一组标签 / 值对的垂直列表,以粗体总计行结尾。',
    anatomyParts: [
      { num: '1', name: '标题',     desc: 'Body Default Bold("您的总额")。布尔值:Title(默认开)。' },
      { num: '2', name: '项目行',   desc: '最多 5 行费用:产品标签 + 价格。布尔值:Item 1–5。' },
      { num: '3', name: '总计行',   desc: '展示应付金额的粗体最末行。布尔值:Total(默认开)。' },
    ],
    variantRows: [
      { prop: '产品数量', vals: '3 · 5(默认)——控制渲染的项目行数' },
      { prop: '背景填充', vals: 'No(默认)· Yes——将明细包裹在静音表面中' },
      { prop: '布尔值 (7)', vals: 'Title、Item 1、Item 2、Item 3、Item 4、Item 5、Total——默认全部开启' },
      { prop: '文本插槽 (13)', vals: 'Title Text("Your total")、Item 1–5 Product Text + Price Text、Total Text("Total")、Total Amount Text' },
    ],
    tokensIntroLead: '继承卡片表面令牌;总计行使用品牌主前景色。',
    tokenRows: [
      { label: '表面',     cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff' },
      { label: '填充背景', cssVar: '--atom-background-core-bg-secondary',          tokenKey: 'atom.background.core.bg-secondary',          fallback: '#faf8f7' },
      { label: '项目标签', cssVar: '--atom-foreground-core-fg-primary',            tokenKey: 'atom.foreground.core.fg-primary',            fallback: '#4b4a4a' },
      { label: '总计前景', cssVar: '--atom-foreground-primary-fg-brand-primary',   tokenKey: 'atom.foreground.primary.fg-brand-primary',   fallback: '#0a2333' },
      { label: '分隔线',   cssVar: '--atom-border-default-border-divider',          tokenKey: 'atom.border.default.border-divider',          fallback: '#cdcbcb' },
    ],
    a11yIntro: '使用定义列表,让屏幕阅读器把标签与值对应起来。',
    a11yRows: [
      { icon: '📋', title: '定义列表',   body: '将行标记为 <dl><dt>标签</dt><dd>价格</dd></dl>。总计使用粗体样式,并在 aria-live="polite" 下播报更新。' },
      { icon: '🔊', title: '实时总计',   body: '项目行变化(应用折扣)时,Total 行的 aria-live 播报新金额。' },
      { icon: '🎨', title: '折扣指示',   body: '负数格式为"− £10.00",带前置减号,不要仅靠颜色。' },
      { icon: '💰', title: '本地化',     body: '按用户区域格式化货币。不要在数据层硬编码"£"。' },
    ],
    usageIntro: '在下方与 Pay CTA 配对;当明细位于繁杂页面上时,Background Fill=Yes。',
    usageCards: [
      { title: '3 行',     when: '简单结账,基础 + 服务费 + 总计。' },
      { title: '5 行',     when: '详细明细——产品、税费、服务费、折扣、再加总计。' },
      { title: '带填充',   when: '页面缺少明确容器时——静音表面将摘要与背景内容区分开。' },
    ],
    whenToUseTitle: '✓ 推荐使用', whenNotToUseTitle: '✗ 避免使用',
    whenToUse: [
      '总计始终与项目使用相同币种和小数位数',
      '将明细放在 Pay CTA 正上方',
      '负数使用前置减号和清晰标签("折扣")',
      '在总计行设置 aria-live,使更新被播报',
    ],
    whenNotToUse: [
      '在关键购买中不要把项目行隐藏在"显示详情"切换后',
      '不要省略总计行——用户需要一个可支付的数字',
      '不要在列表中途切换货币——展示前先转换',
      '当页面已经有卡片形容器时不要使用背景填充',
    ],
  },
};

export function PaymentBreakdownPage({ brand, lang = 'en' }: PageProps) {
  const t = COPY[lang];
  const items = lang === 'zh'
    ? [['快速通道(2 人)', '£30.00'], ['1 项权益已应用', '− £10.00'], ['预订费', '£5.00'], ['服务费', '£2.00'], ['VAT', '£3.00']]
    : [['Fast Track Lane (2 passengers)', '£30.00'], ['1 × Entitlement applied', '− £10.00'], ['Booking fee', '£5.00'], ['Service fee', '£2.00'], ['VAT', '£3.00']];
  const preview = (
    <div className="flex items-center justify-center" style={{ ...DOTTED_BG, padding: 32 }}>
      <div className="bg-white rounded-xl border border-slate-200 p-5" style={{ width: 360 }}>
        <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)' }}>{lang === 'zh' ? '您的总额' : 'Your total'}</h3>
        <dl className="space-y-2 text-sm">
          {items.map(([dt, dd]) => (
            <div key={dt} className="flex justify-between">
              <dt className="text-slate-600">{dt}</dt>
              <dd className="font-mono">{dd}</dd>
            </div>
          ))}
        </dl>
        <div className="border-t mt-3 pt-3 flex justify-between font-bold" style={{ color: 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)' }}>
          <span>{lang === 'zh' ? '总计' : 'Total'}</span><span>£30.00</span>
        </div>
      </div>
    </div>
  );
  return <DocsTemplate brand={brand} preview={preview} t={t} />;
}
