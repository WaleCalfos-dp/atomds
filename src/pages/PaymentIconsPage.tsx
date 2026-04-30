import { type Brand } from '../data/tokens';
import { type Language } from '../data/languages';
import { DocsTemplate, DOTTED_BG, type DocsCopy } from '../components/DocsTemplate';

interface PageProps { brand: Brand; lang?: Language }

const COPY: Record<Language, DocsCopy> = {
  en: {
    headline: 'Payment Icons',
    tagline: 'Logos for the supported card brands and digital wallets. Render near payment fields or checkout summaries to reassure users which methods are accepted.',
    badgeFeedback: 'Widget · Payment', badgeStable: 'Stable',
    sectionAnatomy: 'Anatomy', sectionVariants: 'Variants', sectionTokens: 'Design Tokens', sectionA11y: 'Accessibility', sectionUsage: 'Usage',
    columnProperty: 'Property', columnValues: 'Values', columnUsage: 'Usage', columnCssVar: 'CSS Variable',
    valueColumnTpl: (b) => `Value (${b})`,
    anatomyIntro: '32×20 pill-shaped icons rendered with the official provider colours and proportions.',
    anatomyParts: [
      { num: '1', name: 'Logo',  desc: 'Provider mark inside the pill. Filled with the brand\'s official colour palette — never alter the artwork.' },
      { num: '2', name: 'Container', desc: 'Pill with 1px border (border-divider) so logos remain legible on all surfaces.' },
    ],
    variantRows: [
      { prop: 'Brand', vals: 'American Express · AliPay · AmazonPay · ApplePay · GooglePay · Maestro · Mastercard · Paypal · UnionPay · Visa · Placeholder (default)' },
    ],
    tokensIntroLead: 'Icons themselves use fixed provider artwork; only the surrounding border uses tokens.',
    tokenRows: [
      { label: 'Container border', cssVar: '--atom-border-default-border-divider', tokenKey: 'atom.border.default.border-divider', fallback: '#cdcbcb' },
      { label: 'Container bg',     cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff' },
    ],
    a11yIntro: 'Always pair the icon with a text label — never rely on the logo alone.',
    a11yRows: [
      { icon: '🏷️', title: 'Provide aria-label', body: 'Each icon must have an aria-label naming the provider (e.g. "Visa", "ApplePay"). Decorative-only usage requires aria-hidden.' },
      { icon: '🔁', title: 'Don\'t recolor',     body: 'Provider branding rules forbid alteration. Use the artwork as-is, even on dark surfaces.' },
      { icon: '📏', title: 'Spacing',           body: 'Group icons in a horizontal row with 8px gap. Truncate at the screen edge — don\'t shrink below 32×20.' },
      { icon: '🌍', title: 'Locale',            body: 'Show only providers actually accepted in the user\'s country. Hiding unsupported brands prevents user error.' },
    ],
    usageIntro: 'A trust signal — typically below the Pay button.',
    usageCards: [
      { title: 'Below Pay CTA', when: 'Default placement — show the supported methods immediately under the primary button.' },
      { title: 'In the footer', when: 'Marketing pages reassuring visitors before they reach checkout.' },
      { title: 'On a Receipt',  when: 'Highlight the specific brand used (e.g. "Paid with Visa").' },
    ],
    whenToUseTitle: '✓ When to use', whenNotToUseTitle: '✗ When not to use',
    whenToUse: [
      'Use the official provider artwork — never recolour',
      'Pair every icon with a screen-reader label',
      'Show only methods accepted in the user\'s region',
      'Maintain 32×20 pill size for clarity',
    ],
    whenNotToUse: [
      "Don't replicate provider button styles for the actual Pay button — use the official SDKs",
      "Don't use Placeholder in production — it indicates a missing provider",
      "Don't shrink below 32×20 — logos become illegible",
      "Don't display all 11 brands when only 3 are supported",
    ],
  },
  zh: {
    headline: '支付图标',
    tagline: '受支持的卡品牌和数字钱包徽标。在支付字段或结账摘要附近显示,让用户确认接受哪些方式。',
    badgeFeedback: '业务组件 · 支付', badgeStable: '稳定版',
    sectionAnatomy: '结构剖析', sectionVariants: '变体', sectionTokens: '设计令牌', sectionA11y: '可访问性', sectionUsage: '用法',
    columnProperty: '属性', columnValues: '可选值', columnUsage: '用途', columnCssVar: 'CSS 变量',
    valueColumnTpl: (b) => `值 (${b})`,
    anatomyIntro: '32×20 胶囊形图标,使用官方提供商颜色和比例渲染。',
    anatomyParts: [
      { num: '1', name: '徽标', desc: '胶囊内的提供商标识。使用品牌官方调色板填充——切勿更改图形。' },
      { num: '2', name: '容器', desc: '带 1px 边框(border-divider)的胶囊,使徽标在所有表面上保持清晰。' },
    ],
    variantRows: [
      { prop: '品牌', vals: 'American Express · AliPay · AmazonPay · ApplePay · GooglePay · Maestro · Mastercard · Paypal · UnionPay · Visa · Placeholder(默认)' },
    ],
    tokensIntroLead: '图标本身使用固定的提供商图形;仅外围边框使用令牌。',
    tokenRows: [
      { label: '容器边框', cssVar: '--atom-border-default-border-divider', tokenKey: 'atom.border.default.border-divider', fallback: '#cdcbcb' },
      { label: '容器背景', cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff' },
    ],
    a11yIntro: '始终为图标配上文字标签——切勿仅依赖徽标。',
    a11yRows: [
      { icon: '🏷️', title: '提供 aria-label', body: '每个图标必须有 aria-label 标识提供商(例如"Visa"、"ApplePay")。仅装饰用途需 aria-hidden。' },
      { icon: '🔁', title: '不要重新着色',     body: '提供商品牌规则禁止修改。即便在深色表面上也按原样使用图形。' },
      { icon: '📏', title: '间距',             body: '将图标在水平行中以 8px 间距分组。在屏幕边缘截断——不要缩小到 32×20 以下。' },
      { icon: '🌍', title: '区域',             body: '仅显示用户所在国家实际接受的提供商。隐藏不支持的品牌可避免用户出错。' },
    ],
    usageIntro: '信任信号——通常位于支付按钮下方。',
    usageCards: [
      { title: 'Pay CTA 下方', when: '默认位置——在主按钮正下方显示受支持的方式。' },
      { title: '页脚',         when: '营销页面让访问者在结账前安心。' },
      { title: '收据',         when: '突出显示实际使用的品牌(例如"使用 Visa 支付")。' },
    ],
    whenToUseTitle: '✓ 推荐使用', whenNotToUseTitle: '✗ 避免使用',
    whenToUse: [
      '使用官方提供商图形——切勿重新着色',
      '每个图标配上屏幕阅读器标签',
      '仅显示用户所在区域接受的方式',
      '保持 32×20 胶囊尺寸以确保清晰',
    ],
    whenNotToUse: [
      '不要为实际支付按钮复制提供商按钮样式——请使用官方 SDK',
      '生产环境不要使用 Placeholder——它表示缺失的提供商',
      '不要缩小到 32×20 以下——徽标会变得不清晰',
      '当只有 3 种方式被支持时不要显示全部 11 种品牌',
    ],
  },
};

const BRANDS = ['Visa', 'Mastercard', 'Amex', 'Maestro', 'ApplePay', 'GooglePay', 'PayPal', 'AliPay', 'AmazonPay', 'UnionPay'];

export function PaymentIconsPage({ brand, lang = 'en' }: PageProps) {
  const t = COPY[lang];
  const preview = (
    <div className="flex items-center justify-center" style={{ ...DOTTED_BG, padding: 32 }}>
      <div className="flex flex-wrap gap-2" style={{ width: 480 }}>
        {BRANDS.map((b) => (
          <span key={b} className="inline-flex items-center justify-center px-2 py-1 text-[10px] font-mono font-semibold rounded border bg-white" style={{ borderColor: 'var(--atom-border-default-border-divider, #cdcbcb)', minWidth: 56, color: '#374151' }}>
            {b}
          </span>
        ))}
      </div>
    </div>
  );
  return <DocsTemplate brand={brand} preview={preview} t={t} />;
}
