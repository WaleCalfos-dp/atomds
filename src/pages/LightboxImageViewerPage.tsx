import { type Brand } from '../data/tokens';
import { type Language } from '../data/languages';
import { DocsTemplate, DOTTED_BG, type DocsCopy } from '../components/DocsTemplate';

interface PageProps { brand: Brand; lang?: Language }

const COPY: Record<Language, DocsCopy> = {
  en: {
    headline: 'Lightbox Image Viewer',
    tagline: 'Allows users to view an image in full size within an overlay without leaving the current page. Use in galleries, product pages, and portfolios where users may want a closer look.',
    badgeFeedback: 'Surface', badgeStable: 'Stable',
    sectionAnatomy: 'Anatomy', sectionVariants: 'Variants', sectionTokens: 'Design Tokens', sectionA11y: 'Accessibility', sectionUsage: 'Usage',
    columnProperty: 'Property', columnValues: 'Values', columnUsage: 'Usage', columnCssVar: 'CSS Variable',
    valueColumnTpl: (b) => `Value (${b})`,
    anatomyIntro: 'A scrim, a centred image, and four chrome controls (Previous, Next, Counter, Close).',
    anatomyParts: [
      { num: '1', name: 'Scrim',         desc: 'Full-bleed overlay using atom.background.core.bg-overlay. Click to dismiss.' },
      { num: '2', name: 'Image',         desc: 'Centred at natural aspect ratio, max 90% viewport width / 80% viewport height.' },
      { num: '3', name: 'Previous',      desc: 'Optional left-edge button to navigate back. Boolean: Previous Button (default on).' },
      { num: '4', name: 'Next',          desc: 'Optional right-edge button. Boolean: Next Button (default on).' },
      { num: '5', name: 'Counter',       desc: 'Bottom-centre "n / N" indicator. Boolean: Counter (default on).' },
      { num: '6', name: 'Close',         desc: 'Top-right close affordance. Boolean: Close Button (default on).' },
    ],
    variantRows: [
      { prop: 'Breakpoint', vals: 'Desktop (default) · Tablet' },
      { prop: 'Booleans (4)', vals: 'Previous Button (default on), Next Button (default on), Counter (default on), Close Button (default on)' },
    ],
    tokensIntroLead: 'Inherits the Overlay token for its scrim plus button surface tokens for chrome.',
    tokenRows: [
      { label: 'Scrim',          cssVar: '--atom-background-core-bg-overlay',           tokenKey: 'atom.background.core.bg-overlay',           fallback: '#000000cc' },
      { label: 'Chrome bg',      cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff' },
      { label: 'Chrome fg',      cssVar: '--atom-foreground-primary-fg-brand-primary',   tokenKey: 'atom.foreground.primary.fg-brand-primary',   fallback: '#0a2333' },
    ],
    a11yIntro: 'Trap focus, support keyboard navigation, and provide alt text on the image.',
    a11yRows: [
      { icon: '⌨️', title: 'Keyboard',       body: 'Arrow Left / Right navigate through images. Esc closes. Tab cycles between Previous, Image, Next, and Close.' },
      { icon: '🏷️', title: 'Announce',       body: 'Set role="dialog" with aria-modal="true". Provide aria-label="Image viewer" or pull from the gallery title.' },
      { icon: '🖼️', title: 'Alt text',        body: 'Each image must have meaningful alt text. The Counter ("3 of 7") is read after the image label.' },
      { icon: '🚫', title: 'Focus trap',     body: 'Restrict Tab to the dialog while open. Restore focus to the originating thumbnail on close.' },
    ],
    usageIntro: 'Pair with a thumbnail trigger; never use as a primary surface.',
    usageCards: [
      { title: 'Product galleries',  when: 'Click a thumbnail to expand. Pair with Previous/Next + Counter for multi-image sets.' },
      { title: 'Portfolio',          when: 'Showcase work at full resolution. Hide Counter when only one image is shown.' },
      { title: 'Document preview',   when: 'Quick preview of attachments without leaving the page. Pair with Close + a "Download" link.' },
    ],
    whenToUseTitle: '✓ When to use', whenNotToUseTitle: '✗ When not to use',
    whenToUse: [
      'Click a thumbnail to expand into the lightbox',
      'Show Previous/Next when there are multiple images',
      'Provide a visible Close button — clicking the scrim alone is insufficient',
      'Trap keyboard focus inside the lightbox while open',
    ],
    whenNotToUse: [
      "Don't use for editable images — Lightbox is read-only",
      "Don't auto-open without a user gesture",
      "Don't omit alt text on the source image",
      "Don't hide Previous/Next when navigation is possible",
    ],
  },
  zh: {
    headline: '灯箱图片查看器',
    tagline: '允许用户在遮罩层内查看完整尺寸的图像,而不离开当前页面。用于画廊、产品页面和作品集等需要近距离查看的场景。',
    badgeFeedback: '表面', badgeStable: '稳定版',
    sectionAnatomy: '结构剖析', sectionVariants: '变体', sectionTokens: '设计令牌', sectionA11y: '可访问性', sectionUsage: '用法',
    columnProperty: '属性', columnValues: '可选值', columnUsage: '用途', columnCssVar: 'CSS 变量',
    valueColumnTpl: (b) => `值 (${b})`,
    anatomyIntro: '由遮罩、居中图像和四个控件(上一张、下一张、计数器、关闭)组成。',
    anatomyParts: [
      { num: '1', name: '遮罩',     desc: '使用 atom.background.core.bg-overlay 的全屏遮罩。点击可关闭。' },
      { num: '2', name: '图像',     desc: '居中显示原始宽高比,最大占视口宽度 90% / 高度 80%。' },
      { num: '3', name: '上一张',   desc: '可选的左侧按钮,用于返回。布尔值:Previous Button(默认开)。' },
      { num: '4', name: '下一张',   desc: '可选的右侧按钮。布尔值:Next Button(默认开)。' },
      { num: '5', name: '计数器',   desc: '底部居中的 "n / N" 指示器。布尔值:Counter(默认开)。' },
      { num: '6', name: '关闭',     desc: '右上角的关闭控件。布尔值:Close Button(默认开)。' },
    ],
    variantRows: [
      { prop: '断点', vals: 'Desktop(默认)· Tablet' },
      { prop: '布尔值 (4)', vals: 'Previous Button(默认开)、Next Button(默认开)、Counter(默认开)、Close Button(默认开)' },
    ],
    tokensIntroLead: '继承 Overlay 的遮罩令牌,以及控件表面所用的按钮令牌。',
    tokenRows: [
      { label: '遮罩',     cssVar: '--atom-background-core-bg-overlay',           tokenKey: 'atom.background.core.bg-overlay',           fallback: '#000000cc' },
      { label: '控件背景', cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff' },
      { label: '控件前景', cssVar: '--atom-foreground-primary-fg-brand-primary',   tokenKey: 'atom.foreground.primary.fg-brand-primary',   fallback: '#0a2333' },
    ],
    a11yIntro: '捕获焦点,支持键盘导航,并为图像提供 alt 文本。',
    a11yRows: [
      { icon: '⌨️', title: '键盘',     body: '左 / 右方向键切换图像。Esc 关闭。Tab 在上一张、图像、下一张、关闭之间循环。' },
      { icon: '🏷️', title: '播报',     body: '设置 role="dialog" 与 aria-modal="true"。提供 aria-label="图像查看器" 或使用画廊标题。' },
      { icon: '🖼️', title: 'alt 文本', body: '每张图像都必须有有意义的 alt 文本。计数器("3 / 7")在图像标签之后被读出。' },
      { icon: '🚫', title: '焦点陷阱', body: '打开期间将 Tab 限制在对话框内。关闭后将焦点恢复到来源缩略图。' },
    ],
    usageIntro: '与缩略图触发器配对,不要作为主要界面使用。',
    usageCards: [
      { title: '产品画廊',   when: '点击缩略图展开。多图时搭配上一张 / 下一张和计数器。' },
      { title: '作品集',     when: '以全分辨率展示作品。仅一张图时隐藏计数器。' },
      { title: '文档预览',   when: '快速预览附件,无需离开页面。搭配关闭按钮和"下载"链接。' },
    ],
    whenToUseTitle: '✓ 推荐使用', whenNotToUseTitle: '✗ 避免使用',
    whenToUse: [
      '点击缩略图展开为灯箱',
      '存在多张图像时显示上一张 / 下一张',
      '提供可见的关闭按钮——仅点击遮罩还不够',
      '打开期间将键盘焦点限制在灯箱内',
    ],
    whenNotToUse: [
      '不要用于可编辑的图像——灯箱仅供查看',
      '不要在没有用户操作的情况下自动打开',
      '不要省略源图像的 alt 文本',
      '不要在可以导航时隐藏上一张 / 下一张',
    ],
  },
};

export function LightboxImageViewerPage({ brand, lang = 'en' }: PageProps) {
  const t = COPY[lang];
  const preview = (
    <div className="relative" style={{ ...DOTTED_BG, height: 480 }}>
      <div className="absolute inset-0" style={{ backgroundColor: 'var(--atom-background-core-bg-overlay, #000000cc)' }} />
      <button className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white" aria-label="Close" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>✕</button>
      <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white" aria-label="Previous" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>‹</button>
      <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white" aria-label="Next" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>›</button>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl flex items-center justify-center" style={{ width: 380, height: 260 }}>
        <span className="text-slate-400 text-sm">{lang === 'zh' ? '图像 3 / 7' : 'Image 3 / 7'}</span>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-white text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>3 / 7</div>
    </div>
  );
  return <DocsTemplate brand={brand} preview={preview} t={t} />;
}
