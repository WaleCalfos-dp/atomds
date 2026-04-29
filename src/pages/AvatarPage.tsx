import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AvatarLive, type AvatarSize, type AvatarType, type AvatarStyle } from '../components/avatar/AvatarLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';

interface AvatarPageProps {
  brand: Brand;
  lang?: Language;
}

const COPY = {
  en: {
    typeLabel: 'Type',
    sizeLabel: 'Size',
    styleLabel: 'Style',
    photoBrandHint: 'Photo type only supports Brand style.',
    title: 'Avatar',
    intro:
      'Represents a user or entity with a photo, initials, or a profile icon. Available in five sizes (XSmall to XLarge) and two styles (Brand and Neutral). Photo type always renders in Brand style.',
    pillStable: 'Stable',
    anatomyHeading: 'Anatomy',
    anatomyIntro:
      'The Avatar is a circular container with one of three content types: Initials text, a Profile Icon, or a Photo image.',
    initialsLabel: 'Initials',
    iconLabel: 'Icon',
    photoLabel: 'Photo',
    variantsHeading: 'Variants',
    propertyHeader: 'Property',
    valuesHeader: 'Values',
    brandLabel: 'Brand',
    neutralLabel: 'Neutral',
    designTokensHeading: 'Design Tokens',
    designTokensIntro:
      'Active tokens for the selected style are highlighted. Switch Style or Brand to see values update.',
    tokenHeader: 'Token',
    cssVarHeader: 'CSS Variable',
    valueHeader: 'Value',
    a11yHeading: 'Accessibility',
    a11yIntro: 'Guidelines for implementing Avatar in an inclusive way.',
    usageHeading: 'Usage',
    usageIntro: 'When and how to use the Avatar component.',
    whenToUse: 'When to use',
    whenNotToUse: 'When not to use',
    variantRows: [
      { label: 'Type',            chips: ['Photo', 'Initials', 'Icon'] },
      { label: 'Size',            chips: ['XLarge', 'Large', 'Medium', 'Small', 'XSmall'] },
      { label: 'Style',           chips: ['Brand', 'Neutral'] },
      { label: 'Nested instance', chips: ['Profile Icon'] },
    ],
    anatomyParts: [
      { num: '1', name: 'Container',    desc: 'Circular wrapper (border-radius: 50%). Sizes: XSmall 24px, Small 32px, Medium 40px, Large 48px, XLarge 64px. No border or stroke.' },
      { num: '2', name: 'Initials',      desc: 'Up to two uppercase characters centered in the circle. Poppins SemiBold (600). Font scales with size: 10px (XS) to 26px (XL).' },
      { num: '3', name: 'Profile Icon',  desc: 'Person silhouette SVG icon. Path data is unique per size for pixel-perfect rendering. Inherits foreground colour from style token.' },
      { num: '4', name: 'Photo',         desc: 'User image clipped to circle (object-fit: cover). Always renders in Brand style. Falls back to profile icon when no image is provided.' },
    ],
    tokenRows: [
      { label: 'Accent bg (Brand)',       key: 'atom.background.core.bg-accent',                          cssVar: '--atom-background-core-bg-accent',                          styles: ['Brand'] as AvatarStyle[] },
      { label: 'Inverse fg (Brand)',      key: 'atom.foreground.primary.fg-brand-primary-inverse',        cssVar: '--atom-foreground-primary-fg-brand-primary-inverse',        styles: ['Brand'] as AvatarStyle[] },
      { label: 'Muted bg (Neutral)',      key: 'atom.background.core.bg-muted',                           cssVar: '--atom-background-core-bg-muted',                           styles: ['Neutral'] as AvatarStyle[] },
      { label: 'Primary fg (Neutral)',    key: 'atom.foreground.core.fg-primary',                          cssVar: '--atom-foreground-core-fg-primary',                          styles: ['Neutral'] as AvatarStyle[] },
    ],
    a11yRows: [
      {
        icon: '\uD83C\uDFF7\uFE0F',
        title: 'ARIA attributes',
        body: "Use role=\"img\" with a meaningful aria-label on the avatar container. For Photo type include the user's name. For Initials type include the displayed initials. For Icon type use a generic label like \"User avatar\".",
      },
      {
        icon: '\uD83C\uDFA8',
        title: 'Color contrast',
        body: 'Brand style uses white text on an accent background that meets WCAG AA 4.5:1 contrast across all six brands. Neutral style uses dark text (#4B4A4A) on a near-transparent background, relying on the page surface for contrast.',
      },
      {
        icon: '\uD83D\uDDBC\uFE0F',
        title: 'Image alt text',
        body: 'For Photo avatars, provide meaningful alt text on the <img> element describing the person. If the avatar is purely decorative (e.g., next to a name), use alt="" to avoid redundancy.',
      },
      {
        icon: '\uD83D\uDD24',
        title: 'Text sizing',
        body: 'Initials text scales proportionally with avatar size (10px at XSmall to 26px at XLarge). Ensure initials remain legible at the XSmall (24px) size; two-character initials are recommended.',
      },
      {
        icon: '\u2728',
        title: 'Decorative use',
        body: "When the avatar appears alongside the user's name, consider marking it as decorative (aria-hidden=\"true\") to avoid screen readers announcing redundant information.",
      },
    ],
    whenToUseItems: [
      'Identifying users in lists, cards, or comment threads',
      "Profile headers showing the user's photo or initials",
      'Compact user indicators in navigation bars or menus',
      'Representing entities (teams, organisations) with branded initials',
    ],
    whenNotToUseItems: [
      "Don't use avatars for decorative icons unrelated to people or entities",
      "Don't use XSmall size for primary identification -- pair with a name label",
      "Don't display more than two initials -- truncate longer names",
      "Don't rely solely on the avatar for user identification without supporting text",
    ],
  },
  zh: {
    typeLabel: '类型',
    sizeLabel: '尺寸',
    styleLabel: '样式',
    photoBrandHint: 'Photo 类型仅支持 Brand 样式。',
    title: '头像',
    intro:
      '通过照片、首字母或个人资料图标代表用户或实体。提供五种尺寸(XSmall 至 XLarge)和两种样式(Brand 和 Neutral)。Photo 类型始终以 Brand 样式呈现。',
    pillStable: '稳定',
    anatomyHeading: '结构',
    anatomyIntro:
      '头像是一个圆形容器,内含三种内容类型之一:首字母文本、个人资料图标或照片图像。',
    initialsLabel: '首字母',
    iconLabel: '图标',
    photoLabel: '照片',
    variantsHeading: '变体',
    propertyHeader: '属性',
    valuesHeader: '值',
    brandLabel: 'Brand',
    neutralLabel: 'Neutral',
    designTokensHeading: '设计令牌',
    designTokensIntro:
      '所选样式的活动令牌将高亮显示。切换"样式"或"品牌"以查看值的变化。',
    tokenHeader: '令牌',
    cssVarHeader: 'CSS 变量',
    valueHeader: '值',
    a11yHeading: '无障碍',
    a11yIntro: '以包容性方式实现头像的指南。',
    usageHeading: '用法',
    usageIntro: '何时以及如何使用头像组件。',
    whenToUse: '适用场景',
    whenNotToUse: '不适用场景',
    variantRows: [
      { label: '类型',            chips: ['Photo', 'Initials', 'Icon'] },
      { label: '尺寸',            chips: ['XLarge', 'Large', 'Medium', 'Small', 'XSmall'] },
      { label: '样式',           chips: ['Brand', 'Neutral'] },
      { label: '嵌套实例', chips: ['Profile Icon'] },
    ],
    anatomyParts: [
      { num: '1', name: '容器',    desc: '圆形包装(border-radius: 50%)。尺寸:XSmall 24px、Small 32px、Medium 40px、Large 48px、XLarge 64px。无边框或描边。' },
      { num: '2', name: '首字母',  desc: '在圆圈中居中显示最多两个大写字符。Poppins SemiBold (600)。字号随尺寸缩放:10px (XS) 至 26px (XL)。' },
      { num: '3', name: '个人资料图标',  desc: '人物剪影 SVG 图标。每种尺寸的路径数据均为像素级精确渲染而独有。继承样式令牌中的前景色。' },
      { num: '4', name: '照片',     desc: '裁剪到圆形的用户图像(object-fit: cover)。始终以 Brand 样式呈现。未提供图片时回退至个人资料图标。' },
    ],
    tokenRows: [
      { label: '强调背景 (Brand)',       key: 'atom.background.core.bg-accent',                          cssVar: '--atom-background-core-bg-accent',                          styles: ['Brand'] as AvatarStyle[] },
      { label: '反色前景 (Brand)',      key: 'atom.foreground.primary.fg-brand-primary-inverse',        cssVar: '--atom-foreground-primary-fg-brand-primary-inverse',        styles: ['Brand'] as AvatarStyle[] },
      { label: '静默背景 (Neutral)',      key: 'atom.background.core.bg-muted',                           cssVar: '--atom-background-core-bg-muted',                           styles: ['Neutral'] as AvatarStyle[] },
      { label: '主前景 (Neutral)',    key: 'atom.foreground.core.fg-primary',                          cssVar: '--atom-foreground-core-fg-primary',                          styles: ['Neutral'] as AvatarStyle[] },
    ],
    a11yRows: [
      {
        icon: '\uD83C\uDFF7\uFE0F',
        title: 'ARIA 属性',
        body: '在头像容器上使用 role="img" 和有意义的 aria-label。Photo 类型应包含用户姓名。Initials 类型应包含显示的首字母。Icon 类型应使用通用标签,如 "User avatar"。',
      },
      {
        icon: '\uD83C\uDFA8',
        title: '颜色对比度',
        body: 'Brand 样式在所有六个品牌中均使用白色文字搭配强调背景,符合 WCAG AA 4.5:1 对比度。Neutral 样式使用深色文字(#4B4A4A)搭配近乎透明的背景,依赖页面表面提供对比度。',
      },
      {
        icon: '\uD83D\uDDBC\uFE0F',
        title: '图像替代文本',
        body: '对于 Photo 头像,在 <img> 元素上提供有意义的描述人物的替代文本。如果头像纯粹是装饰性的(例如,在姓名旁边),使用 alt="" 避免冗余。',
      },
      {
        icon: '\uD83D\uDD24',
        title: '文字尺寸',
        body: '首字母文本与头像尺寸成比例缩放(XSmall 时 10px,XLarge 时 26px)。确保 XSmall (24px) 尺寸下首字母仍清晰可读;建议使用两个字符的首字母。',
      },
      {
        icon: '\u2728',
        title: '装饰性使用',
        body: '当头像与用户姓名一同出现时,考虑将其标记为装饰性(aria-hidden="true"),以避免屏幕阅读器朗读冗余信息。',
      },
    ],
    whenToUseItems: [
      '在列表、卡片或评论串中识别用户',
      '展示用户照片或首字母的资料标头',
      '导航栏或菜单中的紧凑型用户指示',
      '使用品牌化首字母代表实体(团队、组织)',
    ],
    whenNotToUseItems: [
      '不要将头像用于与人物或实体无关的装饰性图标',
      '不要使用 XSmall 尺寸进行主要识别 — 应与姓名标签搭配',
      '不要显示超过两个首字母 — 截断较长的姓名',
      '不要仅依赖头像识别用户,需附加辅助文字',
    ],
  },
} as const;

/* ── Shared canvas bg ─────────────────────────────────────────────────────── */
const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

/* ── Size-ordered arrays ──────────────────────────────────────────────────── */
const SIZES: AvatarSize[]   = ['XSmall', 'Small', 'Medium', 'Large', 'XLarge'];
const TYPES: AvatarType[]   = ['Initials', 'Icon', 'Photo'];
const STYLES: AvatarStyle[] = ['Brand', 'Neutral'];

/* ── Dot colours for the Type selector chips ──────────────────────────────── */
const TYPE_DOT_COLORS: Record<AvatarType, string> = {
  Initials: '#0a2333',
  Icon:     '#045477',
  Photo:    '#006b99',
};

/* ── Style dot colours ────────────────────────────────────────────────────── */
const STYLE_DOT_COLORS: Record<AvatarStyle, string> = {
  Brand:   '#d53f34',
  Neutral: '#91908f',
};

/* ── Helpers ───────────────────────────────────────────────────────────────── */
function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

/* ── Placeholder photo (tiny data-uri circle) ─────────────────────────────── */
const PHOTO_PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="128" height="128" rx="64" fill="%23c8d6e5"/><text x="64" y="72" text-anchor="middle" font-size="48" font-family="sans-serif" fill="%23576574">JD</text></svg>',
  );

/* ═════════════════════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═════════════════════════════════════════════════════════════════════════════ */
export function AvatarPage({ brand, lang = 'en' }: AvatarPageProps) {
  const t = COPY[lang];
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  /* interactive preview state */
  const [size, setSize]               = useState<AvatarSize>('Large');
  const [type, setType]               = useState<AvatarType>('Initials');
  const [avatarStyle, setAvatarStyle] = useState<AvatarStyle>('Brand');

  const previewKey = `${size}-${type}-${avatarStyle}`;

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ─────────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-72">

            {/* Left: canvas */}
            <div
              className="flex-1 flex items-center justify-center p-10 min-h-52"
              style={DOTTED_BG}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <AvatarLive
                    size={size}
                    type={type}
                    avatarStyle={avatarStyle}
                    initials="WC"
                    imageSrc={type === 'Photo' ? PHOTO_PLACEHOLDER : undefined}
                    brand={brand}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: controls */}
            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5 overflow-y-auto">

              {/* Type */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.typeLabel}</p>
                <div className="flex flex-wrap gap-1.5">
                  {TYPES.map((ty) => (
                    <button
                      key={ty}
                      onClick={() => setType(ty)}
                      className={[
                        'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        type === ty
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: TYPE_DOT_COLORS[ty] }} />
                      {ty}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.sizeLabel}</p>
                <div className="flex flex-wrap gap-1.5">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={[
                        'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        size === s
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.styleLabel}</p>
                <div className="flex flex-wrap gap-1.5">
                  {STYLES.map((s) => {
                    /* Photo type is always Brand */
                    const disabled = type === 'Photo' && s === 'Neutral';
                    return (
                      <button
                        key={s}
                        onClick={() => !disabled && setAvatarStyle(s)}
                        className={[
                          'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                          avatarStyle === s && !disabled
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : disabled
                              ? 'text-slate-300 border-slate-100 cursor-not-allowed'
                              : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                        ].join(' ')}
                      >
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: STYLE_DOT_COLORS[s], opacity: disabled ? 0.3 : 1 }} />
                        {s}
                      </button>
                    );
                  })}
                </div>
                {type === 'Photo' && (
                  <p className="text-[10px] text-slate-400 mt-1.5">{t.photoBrandHint}</p>
                )}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ──────────────────────────────────────────────── */}
      <section>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">{t.title}</h1>
            <p className="text-slate-500 text-sm max-w-xl">
              {t.intro}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {t.pillStable}
            </span>
          </div>
        </div>
      </section>

      <hr className="border-slate-200" />

      {/* ── 3. ANATOMY ─────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.anatomyHeading}</h2>
        <p className="text-sm text-slate-500 mb-5">
          {t.anatomyIntro}
        </p>

        {/* Anatomy visual: show all three types side by side at Large size */}
        <div className="flex items-center justify-center rounded-xl" style={{ ...DOTTED_BG, padding: '60px 32px' }}>
          <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-end' }}>
            {/* Initials */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ position: 'relative' }}>
                {/* Callout: 2 */}
                <div
                  className="pointer-events-none"
                  style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '4px' }}
                >
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">2</span>
                  <div className="w-px bg-slate-400" style={{ height: '20px' }} />
                </div>
                <AvatarLive size="Large" type="Initials" avatarStyle="Brand" initials="WC" brand={brand} />
                {/* Callout: 1 */}
                <div
                  className="pointer-events-none"
                  style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4px' }}
                >
                  <div className="w-px bg-slate-400" style={{ height: '20px' }} />
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">1</span>
                </div>
              </div>
              <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 500, marginTop: '24px' }}>{t.initialsLabel}</span>
            </div>

            {/* Icon */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ position: 'relative' }}>
                <div
                  className="pointer-events-none"
                  style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '4px' }}
                >
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">3</span>
                  <div className="w-px bg-slate-400" style={{ height: '20px' }} />
                </div>
                <AvatarLive size="Large" type="Icon" avatarStyle="Brand" brand={brand} />
              </div>
              <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 500, marginTop: '24px' }}>{t.iconLabel}</span>
            </div>

            {/* Photo */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ position: 'relative' }}>
                <div
                  className="pointer-events-none"
                  style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '4px' }}
                >
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">4</span>
                  <div className="w-px bg-slate-400" style={{ height: '20px' }} />
                </div>
                <AvatarLive size="Large" type="Photo" avatarStyle="Brand" imageSrc={PHOTO_PLACEHOLDER} brand={brand} />
              </div>
              <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 500, marginTop: '24px' }}>{t.photoLabel}</span>
            </div>
          </div>
        </div>

        {/* Anatomy legend */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {t.anatomyParts.map((row) => (
            <div key={row.num} style={{ display: 'flex', gap: '10px', padding: '12px', borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827', flexShrink: 0, marginTop: '1px', minWidth: '12px' }}>{row.num}</span>
              <div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#111827' }}>{row.name}</p>
                <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#6b7280', lineHeight: 1.4 }}>{row.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. VARIANTS ────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-4">{t.variantsHeading}</h2>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">{t.propertyHeader}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.valuesHeader}</th>
              </tr>
            </thead>
            <tbody>
              {t.variantRows.map((row, i) => {
                const isTypeRow = i === 0;
                const isStyleRow = i === 2;
                return (
                  <tr key={row.label} className={i < t.variantRows.length - 1 ? 'border-b border-slate-100' : ''}>
                    <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">{row.label}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {row.chips.map((chipText) => {
                          let dot: string | undefined;
                          if (isTypeRow) {
                            dot = TYPE_DOT_COLORS[chipText as AvatarType];
                          } else if (isStyleRow) {
                            dot = STYLE_DOT_COLORS[chipText as AvatarStyle];
                          }
                          return (
                            <span key={chipText} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium">
                              {dot && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dot }} />}
                              {chipText}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Visual preview grid: sizes across, types down, both styles */}
        <div style={{ marginTop: '16px' }}>
          {/* Brand row */}
          <div style={{ padding: '20px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa', marginBottom: '12px' }}>
            <p style={{ margin: '0 0 16px', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>{t.brandLabel}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {TYPES.map((ty) => (
                <div key={ty} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ width: '52px', fontSize: '11px', fontWeight: 500, color: '#9ca3af', flexShrink: 0 }}>{ty}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {SIZES.map((s) => (
                      <AvatarLive
                        key={`${ty}-${s}-brand`}
                        size={s}
                        type={ty}
                        avatarStyle="Brand"
                        initials="WC"
                        imageSrc={ty === 'Photo' ? PHOTO_PLACEHOLDER : undefined}
                        brand={brand}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Neutral row (Icon + Initials only) */}
          <div style={{ padding: '20px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
            <p style={{ margin: '0 0 16px', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>{t.neutralLabel}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {(['Initials', 'Icon'] as AvatarType[]).map((ty) => (
                <div key={ty} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ width: '52px', fontSize: '11px', fontWeight: 500, color: '#9ca3af', flexShrink: 0 }}>{ty}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {SIZES.map((s) => (
                      <AvatarLive
                        key={`${ty}-${s}-neutral`}
                        size={s}
                        type={ty}
                        avatarStyle="Neutral"
                        initials="WC"
                        brand={brand}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ───────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.designTokensHeading}</h2>
        <p className="text-sm text-slate-500 mb-4">
          {t.designTokensIntro}
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">{t.tokenHeader}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.cssVarHeader}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">{t.valueHeader} ({brand})</th>
              </tr>
            </thead>
            <tbody>
              {t.tokenRows.map((row, i) => {
                const isActive = row.styles.includes(avatarStyle);
                const rawValue = tokens[row.key as keyof typeof tokens] ?? '\u2014';
                const swatchHex = rawValue.length > 7 ? rawValue.slice(0, 7) : rawValue;
                const light = isLightColor(swatchHex);
                return (
                  <tr
                    key={row.cssVar}
                    className={[
                      i < t.tokenRows.length - 1 ? 'border-b border-slate-100' : '',
                      isActive ? 'bg-blue-50/60' : 'opacity-50',
                      'transition-all duration-150',
                    ].join(' ')}
                    style={isActive ? { borderLeft: '3px solid #3b82f6' } : { borderLeft: '3px solid transparent' }}
                  >
                    <td className="px-5 py-3 font-medium text-slate-700 text-xs">{row.label}</td>
                    <td className="px-5 py-3">
                      <code className="font-mono text-xs text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                        {row.cssVar}
                      </code>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-5 h-5 rounded flex-shrink-0 border border-black/10"
                          style={{ backgroundColor: swatchHex }}
                        />
                        <span
                          className="font-mono text-xs px-1.5 py-0.5 rounded border"
                          style={{
                            backgroundColor: swatchHex,
                            color: light ? '#1e293b' : '#f8fafc',
                            borderColor: light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)',
                          }}
                        >
                          {swatchHex.toUpperCase()}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 6. ACCESSIBILITY ───────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.a11yHeading}</h2>
        <p className="text-sm text-slate-500 mb-4">
          {t.a11yIntro}
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm divide-y divide-slate-100">
          {t.a11yRows.map((row, i) => (
            <div
              key={row.title}
              className={['flex items-start gap-4 px-5 py-4', i % 2 === 1 ? 'bg-slate-50/50' : ''].join(' ')}
            >
              <span className="text-xl flex-shrink-0 mt-0.5" aria-hidden="true">{row.icon}</span>
              <div>
                <p className="text-sm font-semibold text-slate-800">{row.title}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{row.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. USAGE ───────────────────────────────────────────────────────── */}
      <section>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{t.usageHeading}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.usageIntro}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>{t.whenToUse}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              {t.whenToUseItems.map((item, i) => (
                <li key={i} style={{ marginBottom: i < t.whenToUseItems.length - 1 ? '6px' : 0 }}>{item}</li>
              ))}
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>{t.whenNotToUse}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              {t.whenNotToUseItems.map((item, i) => (
                <li key={i} style={{ marginBottom: i < t.whenNotToUseItems.length - 1 ? '6px' : 0 }}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
