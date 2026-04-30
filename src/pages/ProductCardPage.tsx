import { type Brand } from '../data/tokens';
import { type Language } from '../data/languages';
import { DocsTemplate, DOTTED_BG, type DocsCopy } from '../components/DocsTemplate';

interface PageProps { brand: Brand; lang?: Language }

const COPY: Record<Language, DocsCopy> = {
  en: {
    headline: 'Product Card',
    tagline: 'Concise overview of a product — name, subtitle, three optional detail rows, price block, and a primary action. Use in marketplace listings or category views where users need to scan options quickly.',
    badgeFeedback: 'Widget · Commerce', badgeStable: 'Stable',
    sectionAnatomy: 'Anatomy', sectionVariants: 'Variants', sectionTokens: 'Design Tokens', sectionA11y: 'Accessibility', sectionUsage: 'Usage',
    columnProperty: 'Property', columnValues: 'Values', columnUsage: 'Usage', columnCssVar: 'CSS Variable',
    valueColumnTpl: (b) => `Value (${b})`,
    anatomyIntro: 'A vertical card with title, subtitle, three feature lines, divider, price block, and CTA button.',
    anatomyParts: [
      { num: '1', name: 'Title + Subtitle', desc: 'Title (Body Large Bold) + Subtitle (Body Small fg-secondary).' },
      { num: '2', name: 'Detail rows',      desc: 'Up to 3 icon + text rows. Booleans: Detail 1, Detail 2, Detail 3 (each with own icon toggle).' },
      { num: '3', name: 'Link',             desc: 'Optional Text Link below details. Boolean: Link.' },
      { num: '4', name: 'Price block',      desc: 'Title + subtitle pair (e.g. "1 entitlement" / "or $20.50 per pass"). Booleans: Price, Price title, Price Subtitle.' },
      { num: '5', name: 'CTA',              desc: 'Primary "Buy now" button. Boolean: Button (default on).' },
    ],
    variantRows: [
      { prop: 'Product', vals: 'Fast Track (only published value, default)' },
      { prop: 'Booleans (~14)', vals: 'Detail 1/2/3 + their D1-D3 Icon, Link, Divider, Price, Price title, Price Subtitle, Button, Details, Price details' },
      { prop: 'Text slots (~6)', vals: 'Title Text, SubtitleText, D1 Text, D2 Text, D3 Text, Price Title Text, Price Subtitle Text' },
    ],
    tokensIntroLead: 'Inherits the standard Card token surface.',
    tokenRows: [
      { label: 'Surface',  cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff' },
      { label: 'Border',   cssVar: '--atom-border-default-border-divider',          tokenKey: 'atom.border.default.border-divider',          fallback: '#cdcbcb' },
      { label: 'Title',    cssVar: '--atom-foreground-primary-fg-brand-primary',    tokenKey: 'atom.foreground.primary.fg-brand-primary',    fallback: '#0a2333' },
      { label: 'Subtitle', cssVar: '--atom-foreground-core-fg-secondary',           tokenKey: 'atom.foreground.core.fg-secondary',           fallback: '#737272' },
      { label: 'Detail icon', cssVar: '--atom-foreground-core-fg-interactive-icon', tokenKey: 'atom.foreground.core.fg-interactive-icon',   fallback: '#006b99' },
    ],
    a11yIntro: 'Mark up as an article and ensure the price + CTA are reachable.',
    a11yRows: [
      { icon: '🏷️', title: 'Article semantics', body: 'Wrap each card in <article> with an aria-labelledby pointing at the Title.' },
      { icon: '⌨️', title: 'Tab order',          body: 'Tab through Title (if linked) → Detail rows (no focus, decorative) → CTA.' },
      { icon: '💰', title: 'Price clarity',      body: 'Pair currency with locale-appropriate format. Don\'t rely on icon alone (e.g. £ vs €).' },
      { icon: '🎨', title: 'Contrast',           body: 'Title + body combinations meet AA on white surface for all 6 brands.' },
    ],
    usageIntro: 'Use in grid layouts of comparable products.',
    usageCards: [
      { title: 'Marketplace',   when: 'Grid of services or tickets — keep card height consistent across the grid.' },
      { title: 'Category view', when: 'Sub-category lists with filters above. Pair with Web Search.' },
      { title: 'Wishlist',      when: 'Saved items — show Price block with reduced emphasis until checkout.' },
    ],
    whenToUseTitle: '✓ When to use', whenNotToUseTitle: '✗ When not to use',
    whenToUse: [
      'Use in grid or list layouts of comparable items',
      'Keep all cards in a row at the same height',
      'Always include a Price + CTA',
      'Limit detail rows to 3 — more becomes noise',
    ],
    whenNotToUse: [
      "Don't use for informational summaries — use Booking Details Widget",
      "Don't omit the CTA — it's the card's reason to exist",
      "Don't mix Product Card sizes within one grid",
    ],
  },
  zh: {
    headline: '产品卡片',
    tagline: '简明的产品概览——名称、副标题、最多三行细节、价格块和主操作。用于市场列表或类别视图,帮助用户快速浏览选项。',
    badgeFeedback: '业务组件 · 电商', badgeStable: '稳定版',
    sectionAnatomy: '结构剖析', sectionVariants: '变体', sectionTokens: '设计令牌', sectionA11y: '可访问性', sectionUsage: '用法',
    columnProperty: '属性', columnValues: '可选值', columnUsage: '用途', columnCssVar: 'CSS 变量',
    valueColumnTpl: (b) => `值 (${b})`,
    anatomyIntro: '垂直卡片,包含标题、副标题、三行特性、分隔线、价格块和 CTA 按钮。',
    anatomyParts: [
      { num: '1', name: '标题 + 副标题', desc: '标题(Body Large Bold)+ 副标题(Body Small fg-secondary)。' },
      { num: '2', name: '细节行',       desc: '最多 3 行图标 + 文本。布尔值:Detail 1、Detail 2、Detail 3(每行各有图标切换)。' },
      { num: '3', name: '链接',         desc: '细节下方的可选文本链接。布尔值:Link。' },
      { num: '4', name: '价格块',       desc: '标题 + 副标题对(例如 "1 entitlement" / "or $20.50 per pass")。布尔值:Price、Price title、Price Subtitle。' },
      { num: '5', name: 'CTA',          desc: '主操作"立即购买"按钮。布尔值:Button(默认开)。' },
    ],
    variantRows: [
      { prop: 'Product', vals: 'Fast Track(已发布的唯一取值,默认)' },
      { prop: '布尔值 (~14)', vals: 'Detail 1/2/3 及其 D1-D3 Icon、Link、Divider、Price、Price title、Price Subtitle、Button、Details、Price details' },
      { prop: '文本插槽 (~6)', vals: 'Title Text、SubtitleText、D1 Text、D2 Text、D3 Text、Price Title Text、Price Subtitle Text' },
    ],
    tokensIntroLead: '继承标准卡片令牌表面。',
    tokenRows: [
      { label: '表面',   cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff' },
      { label: '边框',   cssVar: '--atom-border-default-border-divider',          tokenKey: 'atom.border.default.border-divider',          fallback: '#cdcbcb' },
      { label: '标题',   cssVar: '--atom-foreground-primary-fg-brand-primary',    tokenKey: 'atom.foreground.primary.fg-brand-primary',    fallback: '#0a2333' },
      { label: '副标题', cssVar: '--atom-foreground-core-fg-secondary',           tokenKey: 'atom.foreground.core.fg-secondary',           fallback: '#737272' },
      { label: '细节图标', cssVar: '--atom-foreground-core-fg-interactive-icon', tokenKey: 'atom.foreground.core.fg-interactive-icon',   fallback: '#006b99' },
    ],
    a11yIntro: '标记为 article,并确保价格 + CTA 可达。',
    a11yRows: [
      { icon: '🏷️', title: 'Article 语义', body: '每个卡片包裹在 <article> 中,aria-labelledby 指向标题。' },
      { icon: '⌨️', title: 'Tab 顺序',     body: '依次:标题(若有链接)→ 细节行(无焦点,装饰)→ CTA。' },
      { icon: '💰', title: '价格清晰度',   body: '货币与区域格式配对。不要单凭图标(£ vs €)。' },
      { icon: '🎨', title: '对比度',       body: '标题 + 正文组合在白色表面上对所有 6 个品牌均满足 AA。' },
    ],
    usageIntro: '在可比较产品的网格布局中使用。',
    usageCards: [
      { title: '市场',     when: '服务或票务网格——网格内保持卡片高度一致。' },
      { title: '类别视图', when: '上方有筛选的子类别列表。与 Web Search 配对。' },
      { title: '心愿单',   when: '已保存的商品——结账前以减弱的方式显示价格块。' },
    ],
    whenToUseTitle: '✓ 推荐使用', whenNotToUseTitle: '✗ 避免使用',
    whenToUse: [
      '用于可比较项目的网格或列表布局',
      '同一行内的所有卡片保持相同高度',
      '始终包含价格 + CTA',
      '细节行限制为 3 行——更多会成为噪声',
    ],
    whenNotToUse: [
      '不要用于信息汇总——请使用预订详情组件',
      '不要省略 CTA——这是卡片存在的原因',
      '不要在一个网格中混用不同尺寸的产品卡片',
    ],
  },
};

export function ProductCardPage({ brand, lang = 'en' }: PageProps) {
  const t = COPY[lang];
  const preview = (
    <div className="flex items-center justify-center" style={{ ...DOTTED_BG, padding: 32 }}>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden" style={{ width: 360 }}>
        <div className="p-5">
          <h3 className="text-base font-bold mb-1" style={{ color: 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)' }}>{lang === 'zh' ? '快速通道入境 — 第 1 航站楼' : 'Fast Track Arrivals — Terminal 1'}</h3>
          <p className="text-xs text-slate-500 mb-4">{lang === 'zh' ? '国际入境' : 'International Arrivals'}</p>
          <ul className="space-y-2 text-sm text-slate-600 mb-4">
            {[
              lang === 'zh' ? '需提前 6 小时预订' : 'Requires booking 6hr in advance',
              lang === 'zh' ? '2 岁以下儿童免费' : 'Free entry for children under 2',
              lang === 'zh' ? '不可退款' : 'Non-refundable',
            ].map((d) => (
              <li key={d} className="flex gap-2"><span style={{ color: 'var(--atom-foreground-core-fg-interactive-icon, #006b99)' }}>✓</span>{d}</li>
            ))}
          </ul>
          <div className="border-t pt-3 mb-3">
            <p className="text-base font-semibold">{lang === 'zh' ? '1 项权益' : '1 entitlement'}</p>
            <p className="text-xs text-slate-500">{lang === 'zh' ? '或 £20.50 / 通行证' : 'or £20.50 per pass'}</p>
          </div>
          <button className="w-full py-3 rounded-full font-semibold text-white text-sm" style={{ backgroundColor: 'var(--atom-background-primary-bg-primary-default, #0a2333)' }}>{lang === 'zh' ? '立即购买' : 'Buy now'}</button>
        </div>
      </div>
    </div>
  );
  return <DocsTemplate brand={brand} preview={preview} t={t} />;
}
