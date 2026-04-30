import { type Brand } from '../data/tokens';
import { type Language } from '../data/languages';
import { DocsTemplate, DOTTED_BG, type DocsCopy } from '../components/DocsTemplate';

interface PageProps { brand: Brand; lang?: Language }

const COPY: Record<Language, DocsCopy> = {
  en: {
    headline: 'Payment Method',
    tagline: 'Allows users to select, add, or manage their preferred payment method during checkout. Lists saved cards, alternative wallets, and an "Add new" affordance.',
    badgeFeedback: 'Widget · Payment', badgeStable: 'Stable',
    sectionAnatomy: 'Anatomy', sectionVariants: 'Variants', sectionTokens: 'Design Tokens', sectionA11y: 'Accessibility', sectionUsage: 'Usage',
    columnProperty: 'Property', columnValues: 'Values', columnUsage: 'Usage', columnCssVar: 'CSS Variable',
    valueColumnTpl: (b) => `Value (${b})`,
    anatomyIntro: 'A list of selectable rows, each with a payment-method icon, name, and radio indicator.',
    anatomyParts: [
      { num: '1', name: 'Saved card row', desc: 'Pre-filled with the user\'s default card. Boolean: Card (default on).' },
      { num: '2', name: 'Provider rows',  desc: 'Up to six alternative methods (ApplePay, GooglePay, PayPal, AmazonPay, AliPay, …). Booleans: Option 1–6.' },
      { num: '3', name: 'Selection',      desc: 'A single radio circle per row. Active method gets the brand fill.' },
    ],
    variantRows: [
      { prop: 'Option',        vals: '1 (only published value, default)' },
      { prop: 'Booleans (7)',  vals: 'Card, Option 1, Option 2, Option 3, Option 4, Option 5, Option 6 (Last) — defaults all on' },
    ],
    tokensIntroLead: 'Inherits List Item tokens for surface and selected border.',
    tokenRows: [
      { label: 'Surface',         cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff' },
      { label: 'Border',          cssVar: '--atom-border-default-border-default',         tokenKey: 'atom.border.default.border-default',         fallback: '#cdcbcb' },
      { label: 'Selected border', cssVar: '--atom-border-selection-and-focus-border-selected', tokenKey: 'atom.border.selection-and-focus.border-selected', fallback: '#0a2333' },
      { label: 'Radio fill',      cssVar: '--atom-background-primary-bg-primary-default', tokenKey: 'atom.background.primary.bg-primary-default', fallback: '#0a2333' },
    ],
    a11yIntro: 'Treat as a single radio group with one selected option at a time.',
    a11yRows: [
      { icon: '🏷️', title: 'role="radiogroup"', body: 'Wrap rows in role="radiogroup" with aria-label="Payment method". Each row is role="radio".' },
      { icon: '⌨️', title: 'Keyboard',          body: 'Arrow keys move selection within the group. Tab leaves the group entirely (single tab stop).' },
      { icon: '💳', title: 'Sensitive data',    body: 'Show only the last 4 digits of saved cards. Never reveal the full PAN.' },
      { icon: '🔐', title: 'Add new',           body: 'Adding a new method opens a secure provider sheet — never inline. Mark the row as a Button, not a radio.' },
    ],
    usageIntro: 'Always pair with a Pay CTA below the method list.',
    usageCards: [
      { title: 'Saved card', when: 'User has a primary card on file. Show the brand icon + last 4 digits.' },
      { title: 'Wallet',     when: 'ApplePay / GooglePay / PayPal — follow each provider\'s branding rules.' },
      { title: 'Add new',    when: 'Final row reading "Add a new payment method" with a leading + icon.' },
    ],
    whenToUseTitle: '✓ When to use', whenNotToUseTitle: '✗ When not to use',
    whenToUse: [
      'Use on checkout flows with multiple methods',
      'Surface saved card as the default selected row',
      'Show last 4 digits and expiry on each saved card',
      'Pair the list with a Pay CTA below',
    ],
    whenNotToUse: [
      "Don't reveal the full card number, CVV, or expiry on display",
      "Don't allow an empty selection — pre-pick a sensible default",
      "Don't replicate provider button styles inside rows — use icons only",
      "Don't bury the Add new affordance — keep it last in the list",
    ],
  },
  zh: {
    headline: '支付方式',
    tagline: '允许用户在结账时选择、添加或管理他们偏好的支付方式。列出已保存的卡、其他钱包以及"添加新方式"入口。',
    badgeFeedback: '业务组件 · 支付', badgeStable: '稳定版',
    sectionAnatomy: '结构剖析', sectionVariants: '变体', sectionTokens: '设计令牌', sectionA11y: '可访问性', sectionUsage: '用法',
    columnProperty: '属性', columnValues: '可选值', columnUsage: '用途', columnCssVar: 'CSS 变量',
    valueColumnTpl: (b) => `值 (${b})`,
    anatomyIntro: '一个可选行的列表,每行包含支付方式图标、名称和单选指示器。',
    anatomyParts: [
      { num: '1', name: '已保存卡片行', desc: '预填用户默认卡。布尔值:Card(默认开)。' },
      { num: '2', name: '提供商行',     desc: '最多六种其他方式(ApplePay、GooglePay、PayPal、AmazonPay、AliPay 等)。布尔值:Option 1–6。' },
      { num: '3', name: '选择',         desc: '每行一个单选圆圈。激活方式使用品牌填充。' },
    ],
    variantRows: [
      { prop: 'Option',       vals: '1(已发布的唯一取值,默认)' },
      { prop: '布尔值 (7)',   vals: 'Card、Option 1、Option 2、Option 3、Option 4、Option 5、Option 6 (Last)——默认全部开启' },
    ],
    tokensIntroLead: '为表面和已选边框继承列表项令牌。',
    tokenRows: [
      { label: '表面',     cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff' },
      { label: '边框',     cssVar: '--atom-border-default-border-default',         tokenKey: 'atom.border.default.border-default',         fallback: '#cdcbcb' },
      { label: '已选边框', cssVar: '--atom-border-selection-and-focus-border-selected', tokenKey: 'atom.border.selection-and-focus.border-selected', fallback: '#0a2333' },
      { label: '单选填充', cssVar: '--atom-background-primary-bg-primary-default', tokenKey: 'atom.background.primary.bg-primary-default', fallback: '#0a2333' },
    ],
    a11yIntro: '视作单一单选组,同一时间仅一项被选中。',
    a11yRows: [
      { icon: '🏷️', title: 'role="radiogroup"', body: '将行包裹在 role="radiogroup" 中,并设置 aria-label="支付方式"。每行 role="radio"。' },
      { icon: '⌨️', title: '键盘',               body: '方向键在组内切换选择。Tab 会跳出整个组(单一 Tab 停留点)。' },
      { icon: '💳', title: '敏感数据',           body: '已保存卡只显示后 4 位。切勿展示完整 PAN。' },
      { icon: '🔐', title: '添加新方式',         body: '添加新方式应打开安全的提供商弹窗——切勿内联。将该行标记为按钮,而非单选项。' },
    ],
    usageIntro: '始终在方式列表下方配以"立即支付"CTA。',
    usageCards: [
      { title: '已保存卡片', when: '用户有主用卡在档。显示品牌图标 + 后 4 位。' },
      { title: '钱包',       when: 'ApplePay / GooglePay / PayPal——遵循各提供商的品牌规则。' },
      { title: '添加新方式', when: '最末一行写"添加新支付方式",带有前置 + 图标。' },
    ],
    whenToUseTitle: '✓ 推荐使用', whenNotToUseTitle: '✗ 避免使用',
    whenToUse: [
      '在多支付方式的结账流程中使用',
      '将已保存卡作为默认选中的行',
      '在每张已保存卡上显示后 4 位与有效期',
      '在列表下方配上支付 CTA',
    ],
    whenNotToUse: [
      '不要展示完整卡号、CVV 或有效期',
      '不要允许空选择——预选一个合理默认值',
      '不要在行内复制提供商按钮样式——仅使用图标',
      '不要把添加新方式埋藏——保持在列表末尾',
    ],
  },
};

export function PaymentMethodPage({ brand, lang = 'en' }: PageProps) {
  const t = COPY[lang];
  const rows = lang === 'zh'
    ? [['Visa · 4242', '已保存', true], ['ApplePay', '', false], ['PayPal', '', false], ['+ 添加新方式', '', false]]
    : [['Visa · 4242', 'Default', true], ['ApplePay', '', false], ['PayPal', '', false], ['+ Add new', '', false]];
  const preview = (
    <div className="flex items-center justify-center" style={{ ...DOTTED_BG, padding: 32 }}>
      <div className="space-y-2" style={{ width: 360 }}>
        {rows.map(([name, badge, sel], i) => (
          <div key={i} className={`flex items-center gap-3 p-4 rounded-lg border bg-white ${sel ? 'border-slate-900' : 'border-slate-200'}`}>
            <span className={`w-4 h-4 rounded-full border-2 ${sel ? 'border-slate-900 bg-slate-900' : 'border-slate-300'}`} />
            <span className="flex-1 text-sm">{name}</span>
            {badge ? <span className="text-[10px] uppercase tracking-wider text-slate-400">{badge}</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
  return <DocsTemplate brand={brand} preview={preview} t={t} />;
}
