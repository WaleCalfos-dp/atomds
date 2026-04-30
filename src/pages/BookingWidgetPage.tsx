import { type Brand } from '../data/tokens';
import { type Language } from '../data/languages';
import { DocsTemplate, DOTTED_BG, type DocsCopy } from '../components/DocsTemplate';

interface PageProps { brand: Brand; lang?: Language }

const COPY: Record<Language, DocsCopy> = {
  en: {
    headline: 'Booking Widget',
    tagline: 'Allows users to select a service package and complete payment without scheduling. Use on pricing pages, service landing pages, or checkout sections where users only need to choose a package tier and proceed.',
    badgeFeedback: 'Widget · Payment', badgeStable: 'Stable',
    sectionAnatomy: 'Anatomy', sectionVariants: 'Variants', sectionTokens: 'Design Tokens', sectionA11y: 'Accessibility', sectionUsage: 'Usage',
    columnProperty: 'Property', columnValues: 'Values', columnUsage: 'Usage', columnCssVar: 'CSS Variable',
    valueColumnTpl: (b) => `Value (${b})`,
    anatomyIntro: 'A surface containing a price block, optional booking options list, payment description, and a primary action button.',
    anatomyParts: [
      { num: '1', name: 'Price block',       desc: 'Currency + amount + payment description (e.g. "£16 per person"). Boolean: Price (default on).' },
      { num: '2', name: 'Booking options',   desc: 'Single or multiple selectable options as List Items with checkboxes. Boolean: Options List.' },
      { num: '3', name: 'Payment description', desc: 'Inline copy under price (e.g. "1 Entitlement"). Boolean: Optional Payment Option.' },
      { num: '4', name: 'CTA Button',        desc: 'Primary action — typically "Book now" or "Pay with X". Boolean: Button (default on).' },
    ],
    variantRows: [
      { prop: 'Style', vals: 'Single (default · 1 booking option) · Multiple (selectable list)' },
      { prop: 'State', vals: 'Default (default) · Selected' },
      { prop: 'Booleans (~22)', vals: 'Title, Optional Payment Option, Additional Payment Option 1/2, Button, Payment Description, Price, Icon Left, Info Icon, Option 1/2 + their Title/Subtitle/Subtitle 2/Icon/Checkbox, Options List' },
      { prop: 'Text slots (~10)', vals: 'Payment Description Text, Price Text ("£16"), Optional Payment Text ("1 Entitlement"), Booking Options Text ("Booking options"), Option 1/2 Title/Subtitle Text, Option 1 Subtitle Text 2' },
    ],
    tokensIntroLead: 'Brand-aware surface tokens; payment colours follow Button rules.',
    tokenRows: [
      { label: 'Surface',     cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff' },
      { label: 'Border',      cssVar: '--atom-border-default-border-default',         tokenKey: 'atom.border.default.border-default',         fallback: '#cdcbcb' },
      { label: 'Selected border', cssVar: '--atom-border-selection-and-focus-border-selected', tokenKey: 'atom.border.selection-and-focus.border-selected', fallback: '#0a2333' },
      { label: 'Title',       cssVar: '--atom-foreground-primary-fg-brand-primary',   tokenKey: 'atom.foreground.primary.fg-brand-primary',   fallback: '#0a2333' },
      { label: 'Body',        cssVar: '--atom-foreground-core-fg-primary',            tokenKey: 'atom.foreground.core.fg-primary',            fallback: '#4b4a4a' },
    ],
    a11yIntro: 'Group selectable options under a fieldset; announce price changes.',
    a11yRows: [
      { icon: '🏷️', title: 'Group options', body: 'Wrap the options list in a <fieldset> with a visible <legend> ("Booking options"). Each option is a labelled <input type="checkbox">.' },
      { icon: '⌨️', title: 'Keyboard',       body: 'Tab through options in DOM order. Space toggles selection. Don\'t use Enter on checkboxes.' },
      { icon: '🔊', title: 'Live price',     body: 'When the total updates after a selection change, set aria-live="polite" on the price node so it\'s announced.' },
      { icon: '💳', title: 'Payment CTA',    body: 'CTA must clearly identify the action — "Pay £16" not just "Continue". For provider buttons follow the official branding rules.' },
    ],
    usageIntro: 'Pair with the Payment Method or Payment Breakdown components on checkout pages.',
    usageCards: [
      { title: 'Single',   when: 'Fixed-price products with one tier — coupon or token redemption.' },
      { title: 'Multiple', when: 'Tiered offers (Basic / Standard / Premium). User picks one before paying.' },
      { title: 'With entitlement', when: 'Members redeeming a benefit. Show the entitlement count + currency split.' },
    ],
    whenToUseTitle: '✓ When to use', whenNotToUseTitle: '✗ When not to use',
    whenToUse: [
      'Use on pricing or service-tier pages',
      'Group multiple-choice options inside a fieldset',
      'Announce live total updates with aria-live="polite"',
      'Use a single Primary CTA at the bottom',
    ],
    whenNotToUse: [
      "Don't use for date-driven flows — use Booking Details Widget",
      "Don't allow zero-selected state — pre-select a sensible default",
      "Don't bury the CTA below the fold",
      "Don't mix entitlement and currency in one Price label — split them",
    ],
  },
  zh: {
    headline: '预订组件',
    tagline: '允许用户选择服务套餐并直接付款,无需调度。用于定价页面、服务落地页或结账区,只需选择套餐层级即可继续。',
    badgeFeedback: '业务组件 · 支付', badgeStable: '稳定版',
    sectionAnatomy: '结构剖析', sectionVariants: '变体', sectionTokens: '设计令牌', sectionA11y: '可访问性', sectionUsage: '用法',
    columnProperty: '属性', columnValues: '可选值', columnUsage: '用途', columnCssVar: 'CSS 变量',
    valueColumnTpl: (b) => `值 (${b})`,
    anatomyIntro: '一个表面,包含价格块、可选的预订选项列表、支付说明以及主操作按钮。',
    anatomyParts: [
      { num: '1', name: '价格块',     desc: '货币 + 金额 + 支付说明(例如 "£16 每人")。布尔值:Price(默认开)。' },
      { num: '2', name: '预订选项',   desc: '单选或多选选项,以带复选框的列表项呈现。布尔值:Options List。' },
      { num: '3', name: '支付说明',   desc: '价格下方的内联文案(例如 "1 Entitlement")。布尔值:Optional Payment Option。' },
      { num: '4', name: 'CTA 按钮',   desc: '主操作——通常为"立即预订"或"用 X 支付"。布尔值:Button(默认开)。' },
    ],
    variantRows: [
      { prop: '风格', vals: 'Single(默认 · 单一预订选项)· Multiple(可选列表)' },
      { prop: '状态', vals: 'Default(默认)· Selected' },
      { prop: '布尔值 (~22)', vals: 'Title、Optional Payment Option、Additional Payment Option 1/2、Button、Payment Description、Price、Icon Left、Info Icon、Option 1/2 及其 Title/Subtitle/Subtitle 2/Icon/Checkbox、Options List' },
      { prop: '文本插槽 (~10)', vals: 'Payment Description Text、Price Text("£16")、Optional Payment Text("1 Entitlement")、Booking Options Text("Booking options")、Option 1/2 Title/Subtitle Text、Option 1 Subtitle Text 2' },
    ],
    tokensIntroLead: '使用品牌感知表面令牌;支付按钮颜色遵循 Button 规则。',
    tokenRows: [
      { label: '表面',         cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff' },
      { label: '边框',         cssVar: '--atom-border-default-border-default',         tokenKey: 'atom.border.default.border-default',         fallback: '#cdcbcb' },
      { label: '已选边框',     cssVar: '--atom-border-selection-and-focus-border-selected', tokenKey: 'atom.border.selection-and-focus.border-selected', fallback: '#0a2333' },
      { label: '标题',         cssVar: '--atom-foreground-primary-fg-brand-primary',   tokenKey: 'atom.foreground.primary.fg-brand-primary',   fallback: '#0a2333' },
      { label: '正文',         cssVar: '--atom-foreground-core-fg-primary',            tokenKey: 'atom.foreground.core.fg-primary',            fallback: '#4b4a4a' },
    ],
    a11yIntro: '将可选项分组到 fieldset 中;价格变动需主动播报。',
    a11yRows: [
      { icon: '🏷️', title: '分组选项', body: '将选项列表包裹在 <fieldset> 中,并显示 <legend>(如"预订选项")。每个选项是带标签的 <input type="checkbox">。' },
      { icon: '⌨️', title: '键盘',     body: '按 DOM 顺序穿越选项。空格切换选择。不要在复选框上使用 Enter。' },
      { icon: '🔊', title: '实时价格', body: '当选择变化导致总价更新时,在价格节点设置 aria-live="polite",使其被播报。' },
      { icon: '💳', title: '支付 CTA', body: 'CTA 应明确标识操作——使用"支付 £16"而非"继续"。提供商按钮遵循官方品牌规则。' },
    ],
    usageIntro: '在结账页面与 Payment Method 或 Payment Breakdown 组件配合使用。',
    usageCards: [
      { title: 'Single',     when: '只有一个层级的固定价格产品——优惠券或代币兑换。' },
      { title: 'Multiple',   when: '层级化报价(基础 / 标准 / 高级)。用户付款前选择一项。' },
      { title: '配权益',     when: '会员兑换权益。显示权益数量 + 货币拆分。' },
    ],
    whenToUseTitle: '✓ 推荐使用', whenNotToUseTitle: '✗ 避免使用',
    whenToUse: [
      '用于定价或服务层级页面',
      '在 fieldset 内分组多选选项',
      '使用 aria-live="polite" 播报实时总价更新',
      '底部使用单一主 CTA',
    ],
    whenNotToUse: [
      '不要用于日期驱动的流程——请使用预订详情组件',
      '不要允许零选中状态——预选一个合理默认值',
      '不要把 CTA 埋在折叠线之下',
      '不要在一个价格标签中混合权益与货币——请拆分',
    ],
  },
};

export function BookingWidgetPage({ brand, lang = 'en' }: PageProps) {
  const t = COPY[lang];
  const preview = (
    <div className="flex items-center justify-center" style={{ ...DOTTED_BG, padding: 32 }}>
      <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6" style={{ width: 360 }}>
        <p className="text-xs uppercase tracking-wider text-slate-400 mb-2">{lang === 'zh' ? '预订选项' : 'Booking options'}</p>
        <div className="space-y-2 mb-4">
          {[lang === 'zh' ? '基础 · 含 1 件入场券' : 'Basic · 1 entitlement', lang === 'zh' ? '高级 · 含 2 件 + 优先' : 'Premium · 2 + priority'].map((opt, i) => (
            <div key={opt} className={`flex items-center gap-3 p-3 rounded-lg border ${i === 0 ? 'border-slate-900' : 'border-slate-200'}`}>
              <span className={`w-4 h-4 rounded-full border-2 ${i === 0 ? 'border-slate-900 bg-slate-900' : 'border-slate-300'}`} />
              <span className="text-sm flex-1">{opt}</span>
              <span className="text-sm font-semibold">£{i === 0 ? 16 : 26}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-3 mb-3">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-sm text-slate-500">{lang === 'zh' ? '总计' : 'Total'}</span>
            <span className="text-2xl font-bold" style={{ color: 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)' }}>£16</span>
          </div>
          <p className="text-xs text-slate-500">{lang === 'zh' ? '每人或 1 项权益' : 'per person or 1 entitlement'}</p>
        </div>
        <button className="w-full py-3 rounded-full font-semibold text-white text-sm" style={{ backgroundColor: 'var(--atom-background-primary-bg-primary-default, #0a2333)' }}>{lang === 'zh' ? '立即预订' : 'Book now'}</button>
      </div>
    </div>
  );
  return <DocsTemplate brand={brand} preview={preview} t={t} />;
}
