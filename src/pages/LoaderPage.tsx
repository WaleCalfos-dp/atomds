import { type Brand } from '../data/tokens';
import { type Language } from '../data/languages';
import { DocsTemplate, DOTTED_BG, type DocsCopy } from '../components/DocsTemplate';

interface PageProps { brand: Brand; lang?: Language }

const COPY: Record<Language, DocsCopy> = {
  en: {
    headline: 'Loader',
    tagline: 'Indicates that work is in progress. Two Figma sets cover the same concept at different granularities — Loading Spinner (a single brand-aware glyph) and Loading animation (eight per-frame variants used by exporters).',
    badgeFeedback: 'Feedback', badgeStable: 'Stable',
    sectionAnatomy: 'Anatomy', sectionVariants: 'Variants', sectionTokens: 'Design Tokens', sectionA11y: 'Accessibility', sectionUsage: 'Usage',
    columnProperty: 'Property', columnValues: 'Values', columnUsage: 'Usage', columnCssVar: 'CSS Variable',
    valueColumnTpl: (b) => `Value (${b})`,
    anatomyIntro: 'A 56×56 brand-aware glyph that rotates 360° in a 1.4s ease-in-out loop.',
    anatomyParts: [
      { num: '1', name: 'Spinner glyph', desc: '56×56 SVG rotating clockwise at 1.4s per cycle. Stroke colour resolves per brand from atom.foreground.primary.fg-brand-primary.' },
      { num: '2', name: 'Optional label', desc: 'Visually hidden by default ("Loading…"). Set role="status" so screen readers announce.' },
    ],
    variantRows: [
      { prop: 'brand',  vals: 'dragonpass (only published value, default — but the actual paint resolves per active brand at runtime)' },
      { prop: 'type',   vals: 'solid (only published value, default)' },
      { prop: 'Frames', vals: 'Loading animation set publishes 8 keyframes for export pipelines. Runtime React uses CSS rotation, not frame-by-frame.' },
    ],
    tokensIntroLead: 'A single foreground token drives the spinner stroke.',
    tokenRows: [
      { label: 'Spinner stroke', cssVar: '--atom-foreground-primary-fg-brand-primary', tokenKey: 'atom.foreground.primary.fg-brand-primary', fallback: '#0a2333' },
    ],
    a11yIntro: 'Announce status, never trap focus.',
    a11yRows: [
      { icon: '🔊', title: 'role="status"', body: 'Wrap the loader in role="status" so screen readers announce. Pair with a visually hidden "Loading…" label.' },
      { icon: '🚫', title: 'No focus trap', body: 'Loader is not interactive. If it accompanies a blocking flow, the surrounding container handles focus.' },
      { icon: '⌛', title: 'Timeouts', body: 'For >10-second loads add a "Still working…" message after 5s, and an Abort affordance after 10s.' },
      { icon: '🎨', title: 'Reduced motion', body: 'Honour prefers-reduced-motion: replace the rotation with a fade pulse for users who request reduced motion.' },
    ],
    usageIntro: 'A primitive — pair with surfaces that need a "thinking" indicator.',
    usageCards: [
      { title: 'Inline',  when: 'Inside a button while submitting. Replace the label or trail it with the spinner.' },
      { title: 'Page-level', when: 'Centred on the canvas while loading data. Pair with skeleton placeholders below.' },
      { title: 'In a Dialog',when: 'Show inside a Dialog while a destructive action runs. Pair with the Overlay primitive.' },
    ],
    whenToUseTitle: '✓ When to use', whenNotToUseTitle: '✗ When not to use',
    whenToUse: [
      'Use for any wait > 250ms',
      'Pair with a status message after 5s',
      'Replace with skeletons for content-shaped loads',
      'Honour prefers-reduced-motion',
    ],
    whenNotToUse: [
      "Don't use for very short waits (<250ms) — let the UI flash",
      "Don't block the page without an Overlay",
      "Don't show multiple spinners on one screen — pick one canonical location",
      "Don't omit role=\"status\" — silent loaders confuse screen-reader users",
    ],
  },
  zh: {
    headline: '加载中',
    tagline: '提示用户正在进行处理。两个 Figma 集合涵盖同一概念的不同粒度——Loading Spinner(单一的品牌感知图形)与 Loading animation(导出工具用的 8 个逐帧变体)。',
    badgeFeedback: '反馈', badgeStable: '稳定版',
    sectionAnatomy: '结构剖析', sectionVariants: '变体', sectionTokens: '设计令牌', sectionA11y: '可访问性', sectionUsage: '用法',
    columnProperty: '属性', columnValues: '可选值', columnUsage: '用途', columnCssVar: 'CSS 变量',
    valueColumnTpl: (b) => `值 (${b})`,
    anatomyIntro: '一个 56×56 的品牌感知图形,以 1.4 秒 ease-in-out 循环旋转 360°。',
    anatomyParts: [
      { num: '1', name: '加载图形', desc: '56×56 SVG,顺时针 1.4 秒每周期旋转。描边颜色随品牌从 atom.foreground.primary.fg-brand-primary 解析。' },
      { num: '2', name: '可选标签', desc: '默认对视觉隐藏("加载中…")。设置 role="status" 让屏幕阅读器播报。' },
    ],
    variantRows: [
      { prop: 'brand',  vals: 'dragonpass(已发布的唯一取值,默认——实际涂色在运行时随当前品牌解析)' },
      { prop: 'type',   vals: 'solid(已发布的唯一取值,默认)' },
      { prop: '帧数据', vals: 'Loading animation 集合为导出管线发布了 8 个关键帧。运行时 React 使用 CSS 旋转,而非逐帧。' },
    ],
    tokensIntroLead: '单一前景令牌驱动加载图形的描边颜色。',
    tokenRows: [
      { label: '图形描边', cssVar: '--atom-foreground-primary-fg-brand-primary', tokenKey: 'atom.foreground.primary.fg-brand-primary', fallback: '#0a2333' },
    ],
    a11yIntro: '播报状态,永不捕获焦点。',
    a11yRows: [
      { icon: '🔊', title: 'role="status"', body: '将加载图形包裹在 role="status" 中以便屏幕阅读器播报。配以视觉隐藏的"加载中…"标签。' },
      { icon: '🚫', title: '不捕获焦点', body: '加载组件不可交互。若伴随阻塞流程,焦点由外层容器处理。' },
      { icon: '⌛', title: '超时处理', body: '对于 >10 秒的加载,5 秒后添加"仍在处理…"消息,10 秒后提供取消选项。' },
      { icon: '🎨', title: '减少动效', body: '尊重 prefers-reduced-motion:为请求减少动效的用户将旋转替换为淡入淡出脉冲。' },
    ],
    usageIntro: '基础元素——与需要"思考中"指示的界面配合使用。',
    usageCards: [
      { title: '内联',     when: '提交时显示在按钮内。可替换标签或附加在标签后。' },
      { title: '页面级',   when: '加载数据时居中显示在画布。配合下方的骨架占位符。' },
      { title: '对话框中', when: '执行破坏性操作时显示在对话框内。配合 Overlay 基础元素使用。' },
    ],
    whenToUseTitle: '✓ 推荐使用', whenNotToUseTitle: '✗ 避免使用',
    whenToUse: [
      '用于任何 > 250ms 的等待',
      '5 秒后配上状态消息',
      '面向内容形状的加载请改用骨架屏',
      '尊重 prefers-reduced-motion',
    ],
    whenNotToUse: [
      '不要用于极短的等待(< 250ms)——让 UI 直接闪现',
      '不要在没有 Overlay 的情况下阻塞页面',
      '不要在一个屏幕上显示多个加载图形——选择一个规范位置',
      '不要省略 role="status"——无声的加载会让屏幕阅读器用户困惑',
    ],
  },
};

export function LoaderPage({ brand, lang = 'en' }: PageProps) {
  const t = COPY[lang];
  const preview = (
    <div className="flex items-center justify-center" style={{ ...DOTTED_BG, height: 360 }}>
      <svg width="56" height="56" viewBox="0 0 56 56" style={{ animation: 'atom-loader-rotate 1.4s linear infinite' }}>
        <circle cx="28" cy="28" r="22" fill="none" stroke="var(--atom-foreground-primary-fg-brand-primary, #0a2333)" strokeOpacity="0.15" strokeWidth="4" />
        <circle cx="28" cy="28" r="22" fill="none" stroke="var(--atom-foreground-primary-fg-brand-primary, #0a2333)" strokeWidth="4" strokeLinecap="round" strokeDasharray="40 200" />
      </svg>
      <style>{`@keyframes atom-loader-rotate { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  return <DocsTemplate brand={brand} preview={preview} t={t} />;
}
