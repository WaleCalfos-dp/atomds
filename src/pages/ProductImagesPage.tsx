import { type Brand } from '../data/tokens';
import { type Language } from '../data/languages';
import { DocsTemplate, DOTTED_BG, type DocsCopy } from '../components/DocsTemplate';

interface PageProps { brand: Brand; lang?: Language }

const COPY: Record<Language, DocsCopy> = {
  en: {
    headline: 'Product Images',
    tagline: 'Image grid showing one large primary image plus thumbnails. Use on product detail pages where multiple visuals — angles, variations, screenshots — must be available at a glance.',
    badgeFeedback: 'Widget · Commerce', badgeStable: 'Stable',
    sectionAnatomy: 'Anatomy', sectionVariants: 'Variants', sectionTokens: 'Design Tokens', sectionA11y: 'Accessibility', sectionUsage: 'Usage',
    columnProperty: 'Property', columnValues: 'Values', columnUsage: 'Usage', columnCssVar: 'CSS Variable',
    valueColumnTpl: (b) => `Value (${b})`,
    anatomyIntro: 'A primary image with thumbnails alongside, plus an optional badge summarising the total count.',
    anatomyParts: [
      { num: '1', name: 'Primary image', desc: 'Large image at top. Click opens the Lightbox Image Viewer.' },
      { num: '2', name: 'Thumbnails',    desc: 'Smaller images beside or below. Click swaps the primary slot.' },
      { num: '3', name: 'Image count badge', desc: 'Optional pill in the top-right corner showing "+N more". Boolean: Image count badge (default on).' },
    ],
    variantRows: [
      { prop: 'Images',   vals: '1 · 3 (default) · 5 — controls how many image slots render' },
      { prop: 'Booleans (1)', vals: 'Image count badge (default on)' },
    ],
    tokensIntroLead: 'Inherits Card surface tokens for image frames.',
    tokenRows: [
      { label: 'Frame bg',  cssVar: '--atom-background-core-bg-muted',           tokenKey: 'atom.background.core.bg-muted',           fallback: '#0a23330a' },
      { label: 'Border',    cssVar: '--atom-border-default-border-divider',      tokenKey: 'atom.border.default.border-divider',      fallback: '#cdcbcb' },
      { label: 'Badge bg',  cssVar: '--atom-background-primary-bg-primary-default', tokenKey: 'atom.background.primary.bg-primary-default', fallback: '#0a2333' },
      { label: 'Badge fg',  cssVar: '--atom-foreground-primary-fg-brand-primary-inverse', tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse', fallback: '#ffffff' },
    ],
    a11yIntro: 'Provide alt text on every image and announce the count on click.',
    a11yRows: [
      { icon: '🖼️', title: 'Alt text', body: 'Each image must have meaningful alt text describing the asset, not "Image 1 of 3".' },
      { icon: '⌨️', title: 'Keyboard', body: 'Tab through thumbnails. Enter / Space activates a thumbnail to swap into the primary slot.' },
      { icon: '🔊', title: 'Live update', body: 'When the primary image changes, set aria-live="polite" announcing "Showing image N of M".' },
      { icon: '🚫', title: 'No autoplay', body: 'For videos, never autoplay with sound. Provide a play button.' },
    ],
    usageIntro: 'Pair with the Lightbox Image Viewer for full-size views.',
    usageCards: [
      { title: '1 image',   when: 'Single hero image — for products with one canonical view.' },
      { title: '3 images',  when: 'Most common — primary + two thumbnails.' },
      { title: '5 images',  when: 'Detailed gallery — hero + four thumbnails. Show count badge for >5 total.' },
    ],
    whenToUseTitle: '✓ When to use', whenNotToUseTitle: '✗ When not to use',
    whenToUse: [
      'Use on product detail pages with > 1 image',
      'Pair with Lightbox Image Viewer for full-resolution previews',
      'Show the count badge when total images exceed visible thumbs',
      'Always provide meaningful alt text',
    ],
    whenNotToUse: [
      "Don't use for editorial layouts — use a Carousel pattern",
      "Don't show only thumbnails without a primary image",
      "Don't autoplay videos with sound",
    ],
  },
  zh: {
    headline: '产品图集',
    tagline: '展示主图加缩略图的图像网格。用于产品详情页,需要在一处展示多个角度、变体或截图。',
    badgeFeedback: '业务组件 · 电商', badgeStable: '稳定版',
    sectionAnatomy: '结构剖析', sectionVariants: '变体', sectionTokens: '设计令牌', sectionA11y: '可访问性', sectionUsage: '用法',
    columnProperty: '属性', columnValues: '可选值', columnUsage: '用途', columnCssVar: 'CSS 变量',
    valueColumnTpl: (b) => `值 (${b})`,
    anatomyIntro: '主图配合缩略图,加可选的总数徽章。',
    anatomyParts: [
      { num: '1', name: '主图',         desc: '位于顶部的大图。点击打开灯箱图像查看器。' },
      { num: '2', name: '缩略图',       desc: '旁边或下方较小的图像。点击会切换主图。' },
      { num: '3', name: '图片数量徽章', desc: '右上角的可选标签,显示"+N 张"。布尔值:Image count badge(默认开)。' },
    ],
    variantRows: [
      { prop: '图片数量', vals: '1 · 3(默认)· 5——控制渲染的图片槽位' },
      { prop: '布尔值 (1)', vals: 'Image count badge(默认开)' },
    ],
    tokensIntroLead: '为图像边框继承卡片表面令牌。',
    tokenRows: [
      { label: '边框背景', cssVar: '--atom-background-core-bg-muted',           tokenKey: 'atom.background.core.bg-muted',           fallback: '#0a23330a' },
      { label: '边框',     cssVar: '--atom-border-default-border-divider',      tokenKey: 'atom.border.default.border-divider',      fallback: '#cdcbcb' },
      { label: '徽章背景', cssVar: '--atom-background-primary-bg-primary-default', tokenKey: 'atom.background.primary.bg-primary-default', fallback: '#0a2333' },
      { label: '徽章前景', cssVar: '--atom-foreground-primary-fg-brand-primary-inverse', tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse', fallback: '#ffffff' },
    ],
    a11yIntro: '为每张图像提供 alt 文本,并在点击时主动播报计数。',
    a11yRows: [
      { icon: '🖼️', title: 'alt 文本', body: '每张图像必须有描述资源的有意义的 alt 文本,而不是"第 1 张图,共 3 张"。' },
      { icon: '⌨️', title: '键盘',     body: '使用 Tab 浏览缩略图。Enter / 空格激活缩略图,将其切换到主图位置。' },
      { icon: '🔊', title: '实时更新', body: '主图变化时,设置 aria-live="polite" 播报"显示第 N 张,共 M 张"。' },
      { icon: '🚫', title: '无自动播放', body: '视频切勿带声音自动播放。提供播放按钮。' },
    ],
    usageIntro: '与灯箱图像查看器配合,提供全尺寸视图。',
    usageCards: [
      { title: '1 张',  when: '单一主图——产品只有一个标准视图。' },
      { title: '3 张',  when: '最常见——主图 + 两张缩略图。' },
      { title: '5 张',  when: '详细图集——主图 + 四张缩略图。当总数超过 5 张时显示数量徽章。' },
    ],
    whenToUseTitle: '✓ 推荐使用', whenNotToUseTitle: '✗ 避免使用',
    whenToUse: [
      '在多张图像的产品详情页使用',
      '与灯箱图像查看器配合提供全分辨率预览',
      '当总图像数超过可见缩略图时显示数量徽章',
      '始终提供有意义的 alt 文本',
    ],
    whenNotToUse: [
      '不要用于编辑型版式——请使用 Carousel 模式',
      '不要仅显示缩略图而无主图',
      '不要带声音自动播放视频',
    ],
  },
};

export function ProductImagesPage({ brand, lang = 'en' }: PageProps) {
  const t = COPY[lang];
  const preview = (
    <div className="flex items-center justify-center" style={{ ...DOTTED_BG, padding: 32 }}>
      <div style={{ width: 360 }}>
        <div className="relative bg-slate-200 rounded-lg overflow-hidden" style={{ height: 200 }}>
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white" style={{ backgroundColor: 'var(--atom-background-primary-bg-primary-default, #0a2333)' }}>+3 {lang === 'zh' ? '张' : 'more'}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-slate-100 rounded-md" style={{ height: 60 }} />
          ))}
        </div>
      </div>
    </div>
  );
  return <DocsTemplate brand={brand} preview={preview} t={t} />;
}
