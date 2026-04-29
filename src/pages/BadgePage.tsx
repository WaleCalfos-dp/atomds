import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BadgeLive, type BadgeState, type BadgeCurveRadius } from '../components/badge/BadgeLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';

interface BadgePageProps {
  brand: Brand;
  lang?: Language;
}

// ─── Bilingual copy block ───────────────────────────────────────────────────
const COPY = {
  en: {
    stateLabel: 'State',
    curveRadiusLabel: 'Curve Radius',
    labelLabel: 'Label',
    labelPlaceholder: 'Label text…',
    iconsLabel: 'Icons',
    iconLeft: 'Icon Left',
    iconRight: 'Icon Right',
    title: 'Badge',
    intro:
      'Highlights a count, status, or small piece of metadata alongside content items. Supports six semantic states and two curve radius modes, all driven by brand tokens.',
    feedback: 'Feedback',
    stable: 'Stable',
    anatomyTitle: 'Anatomy',
    anatomyLead: 'The Badge is composed of three parts. Icon slots are optional.',
    anatomyParts: [
      { num: '1', name: 'Container', desc: 'Background color driven by state token. Border-radius: 9999px (Full) or 2px (Standard). Padding: 2px 8px or 2px 4px.' },
      { num: '2', name: 'Icon Left', desc: 'Optional 12×12px icon slot. Inherits foreground color from the active state token. Hidden by default.' },
      { num: '3', name: 'Label', desc: '12px / weight 500 text. Foreground color from state token. Required — always provide a visible text label.' },
      { num: '4', name: 'Icon Right', desc: 'Optional 12×12px icon slot. Mirrors Icon Left behaviour. Useful for close or chevron affordances.' },
    ],
    variantsTitle: 'Variants',
    propertyHeader: 'Property',
    valuesHeader: 'Values',
    tokenHeader: 'Token',
    cssVariableHeader: 'CSS Variable',
    valueHeader: 'Value',
    fullLabel: 'Full',
    standardLabel: 'Standard',
    designTokensTitle: 'Design Tokens',
    designTokensLead: 'Active tokens for the selected state are highlighted. Switch State or Brand to see values update.',
    accessibilityTitle: 'Accessibility',
    accessibilityLead: 'Guidelines for implementing Badge in an inclusive way.',
    a11yRows: [
      {
        icon: '🏷️',
        title: 'Semantic role',
        body: 'Use role="status" for dynamic count badges so screen readers announce changes. For purely decorative badges that duplicate visible text, use aria-hidden="true".',
      },
      {
        icon: '🎨',
        title: 'Color contrast',
        body: 'All feedback states (Success, Warning, Error, Information) meet WCAG AA 4.5:1 minimum contrast. Brand state uses white text on brand primary, verified across all 6 brands.',
      },
      {
        icon: '🔤',
        title: "Don't rely on color alone",
        body: 'The Label is required — never convey meaning through color alone. Always pair a color state with a visible text label so users with colour-blindness receive the same information.',
      },
      {
        icon: '⌨️',
        title: 'Keyboard interaction',
        body: 'Badge is not interactive and receives no keyboard focus. If placed inside an interactive element (e.g. a button or link), the parent element handles focus and keyboard events.',
      },
      {
        icon: '✨',
        title: 'Motion',
        body: 'The component itself contains no animation. The preview pane crossfade in this documentation respects prefers-reduced-motion — animation is disabled for users who opt out.',
      },
    ],
    usageTitle: 'Usage',
    usageLead: 'When and how to use the Badge component.',
    whenToUseTitle: '✓ When to use',
    whenToUse: [
      'Draw attention to a notification count or unread indicator',
      'Communicate status alongside a list item or heading',
      'Show a categorical label (e.g. "Beta", "New", "Required")',
      'Indicate the severity of a record (Success / Warning / Error)',
    ],
    whenNotToUseTitle: '✗ When not to use',
    whenNotToUse: [
      "Don't use Badge as a primary call-to-action — use Button",
      "Don't use Badge for long strings of text (max ~3 words)",
      "Don't rely on color alone — the label text is mandatory",
      "Don't stack multiple badges where a Tag group is appropriate",
    ],
  },
  zh: {
    stateLabel: '状态',
    curveRadiusLabel: '圆角弧度',
    labelLabel: '标签',
    labelPlaceholder: '标签文本…',
    iconsLabel: '图标',
    iconLeft: '左图标',
    iconRight: '右图标',
    title: '徽章',
    intro:
      '在内容项旁边突出显示计数、状态或小段元数据。支持六种语义状态和两种圆角弧度模式，全部由品牌设计令牌驱动。',
    feedback: '反馈',
    stable: '稳定版',
    anatomyTitle: '结构剖析',
    anatomyLead: '徽章由三个部分组成。图标插槽为可选。',
    anatomyParts: [
      { num: '1', name: '容器', desc: '背景颜色由状态令牌驱动。圆角：9999px（Full）或 2px（Standard）。内边距：2px 8px 或 2px 4px。' },
      { num: '2', name: '左图标', desc: '可选的 12×12px 图标插槽。继承当前状态令牌的前景颜色。默认隐藏。' },
      { num: '3', name: '标签', desc: '12px / 字重 500 文本。前景颜色来自状态令牌。必填——始终提供可见的文本标签。' },
      { num: '4', name: '右图标', desc: '可选的 12×12px 图标插槽。镜像左图标的行为。适用于关闭或 Chevron 提示。' },
    ],
    variantsTitle: '变体',
    propertyHeader: '属性',
    valuesHeader: '值',
    tokenHeader: '设计令牌',
    cssVariableHeader: 'CSS 变量',
    valueHeader: '值',
    fullLabel: 'Full',
    standardLabel: 'Standard',
    designTokensTitle: '设计令牌',
    designTokensLead: '所选状态的活动令牌被高亮显示。切换状态或品牌可查看值更新。',
    accessibilityTitle: '可访问性',
    accessibilityLead: '以包容性方式实现徽章的指南。',
    a11yRows: [
      {
        icon: '🏷️',
        title: '语义角色',
        body: '为动态计数徽章使用 role="status"，使屏幕阅读器能够播报变更。对于仅与可见文本重复的纯装饰性徽章，使用 aria-hidden="true"。',
      },
      {
        icon: '🎨',
        title: '颜色对比度',
        body: '所有反馈状态（成功、警告、错误、信息）均满足 WCAG AA 4.5:1 的最低对比度。品牌状态在品牌主色上使用白色文本，已在所有 6 个品牌中验证。',
      },
      {
        icon: '🔤',
        title: '不要仅依赖颜色',
        body: '标签是必填项——切勿仅通过颜色传达含义。始终将颜色状态与可见的文本标签配对，使色盲用户也能获得相同的信息。',
      },
      {
        icon: '⌨️',
        title: '键盘交互',
        body: '徽章不可交互，不接受键盘焦点。若放置在可交互元素（如按钮或链接）内，则由父元素处理焦点和键盘事件。',
      },
      {
        icon: '✨',
        title: '动效',
        body: '组件本身不包含动画。本文档中预览面板的交叉淡入淡出尊重 prefers-reduced-motion——选择减少动效的用户将禁用动画。',
      },
    ],
    usageTitle: '用法',
    usageLead: '何时以及如何使用徽章组件。',
    whenToUseTitle: '✓ 适用场景',
    whenToUse: [
      '吸引对通知计数或未读指示器的注意',
      '在列表项或标题旁传达状态',
      '显示分类标签（例如 "Beta"、"New"、"Required"）',
      '指示记录的严重程度（成功 / 警告 / 错误）',
    ],
    whenNotToUseTitle: '✗ 不适用场景',
    whenNotToUse: [
      '避免将徽章用作主要号召性操作——请使用按钮',
      '避免将徽章用于长字符串文本（最多约 3 个词）',
      '避免仅依赖颜色——标签文本是必填项',
      '避免堆叠多个徽章——更适合使用标签组',
    ],
  },
} as const;

// ─── Token map for the design tokens table ───────────────────────────────────
const TOKEN_TABLE_ROWS: { labelEn: string; labelZh: string; key: string; cssVar: string; states: BadgeState[] }[] = [
  { labelEn: 'Brand bg',       labelZh: '品牌背景',  key: 'atom.background.primary.bg-primary-default',   cssVar: '--atom-background-primary-bg-primary-default',   states: ['Brand'] },
  { labelEn: 'Brand fg',       labelZh: '品牌前景',  key: 'atom.foreground.primary.fg-brand-primary-inverse', cssVar: '--atom-foreground-primary-fg-brand-primary-inverse', states: ['Brand'] },
  { labelEn: 'Success bg',     labelZh: '成功背景',  key: 'atom.background.alert.bg-success-light',        cssVar: '--atom-background-alert-bg-success-light',        states: ['Success'] },
  { labelEn: 'Warning bg',     labelZh: '警告背景',  key: 'atom.background.alert.bg-warning-default',      cssVar: '--atom-background-alert-bg-warning-default',      states: ['Warning'] },
  { labelEn: 'Error bg',       labelZh: '错误背景',  key: 'atom.background.alert.bg-error-light',          cssVar: '--atom-background-alert-bg-error-light',          states: ['Error'] },
  { labelEn: 'Information bg', labelZh: '信息背景',  key: 'atom.background.alert.bg-info-default',         cssVar: '--atom-background-alert-bg-info-default',         states: ['Information'] },
  { labelEn: 'Muted bg',       labelZh: '柔和背景',  key: 'atom.background.core.bg-muted',                 cssVar: '--atom-background-core-bg-muted',                 states: ['Muted'] },
  { labelEn: 'Feedback fg',    labelZh: '反馈前景',  key: 'atom.foreground.core.fg-primary',               cssVar: '--atom-foreground-core-fg-primary',               states: ['Success', 'Warning', 'Error', 'Information', 'Muted'] },
];

const STATE_DOT_COLORS: Record<BadgeState, string> = {
  Brand:       '#0a2333',
  Success:     '#dcfae6',
  Warning:     '#feebc0',
  Error:       '#ffdadd',
  Information: '#e6f0f5',
  Muted:       '#e5e7eb',
};

const STATE_DOT_BORDER: Record<BadgeState, string> = {
  Brand:       '#0a2333',
  Success:     '#17b26a',
  Warning:     '#d6a025',
  Error:       '#e02d3c',
  Information: '#006b99',
  Muted:       '#9ca3af',
};

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

// Dotted canvas background matching the uploaded reference
const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

export function BadgePage({ brand, lang = 'en' }: BadgePageProps) {
  const t = COPY[lang];
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  // Interactive preview state
  const [state, setState] = useState<BadgeState>('Brand');
  const [curveRadius, setCurveRadius] = useState<BadgeCurveRadius>('Full');
  const [label, setLabel] = useState('Label');
  const [showIconLeft, setShowIconLeft] = useState(false);
  const [showIconRight, setShowIconRight] = useState(false);

  const badgeKey = `${state}-${curveRadius}-${label}-${showIconLeft}-${showIconRight}`;

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-72">

            {/* Left: canvas */}
            <div
              className="flex-1 flex items-center justify-center p-12 min-h-52"
              style={DOTTED_BG}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={badgeKey}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                >
                  <BadgeLive
                    state={state}
                    curveRadius={curveRadius}
                    label={label}
                    showIconLeft={showIconLeft}
                    showIconRight={showIconRight}
                    brand={brand}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: controls */}
            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5">

              {/* State */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.stateLabel}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(['Brand', 'Success', 'Warning', 'Error', 'Information', 'Muted'] as BadgeState[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setState(s)}
                      className={[
                        'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        state === s
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0 border"
                        style={{
                          backgroundColor: STATE_DOT_COLORS[s],
                          borderColor: STATE_DOT_BORDER[s],
                        }}
                      />
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Curve Radius */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.curveRadiusLabel}</p>
                <div className="flex rounded-lg border border-slate-200 overflow-hidden w-fit">
                  {(['Full', 'Standard'] as BadgeCurveRadius[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => setCurveRadius(r)}
                      className={[
                        'px-3 py-1.5 text-xs font-medium transition-all duration-100',
                        curveRadius === r
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Label */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.labelLabel}</p>
                <input
                  type="text"
                  value={label}
                  maxLength={20}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-md text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition"
                  placeholder={t.labelPlaceholder}
                />
              </div>

              {/* Icons */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.iconsLabel}</p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: t.iconLeft, value: showIconLeft, set: setShowIconLeft },
                    { label: t.iconRight, value: showIconRight, set: setShowIconRight },
                  ].map(({ label: lbl, value, set }) => (
                    <label key={lbl} className="flex items-center gap-2.5 cursor-pointer select-none group">
                      <button
                        role="checkbox"
                        aria-checked={value}
                        onClick={() => set(!value)}
                        className={[
                          'w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-100 flex-shrink-0',
                          value
                            ? 'bg-slate-900 border-slate-900'
                            : 'bg-white border-slate-300 group-hover:border-slate-400',
                        ].join(' ')}
                      >
                        {value && (
                          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                            <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                      <span className="text-xs text-slate-600">{lbl}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">{t.title}</h1>
            <p className="text-slate-500 text-sm max-w-xl">
              {t.intro}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.25" />
                <path d="M5 3v3M5 7.5v.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              </svg>
              {t.feedback}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {t.stable}
            </span>
          </div>
        </div>
      </section>

      <hr className="border-slate-200" />

      {/* ── 3. ANATOMY ───────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.anatomyTitle}</h2>
        <p className="text-sm text-slate-500 mb-5">{t.anatomyLead}</p>

        {/* Diagram area */}
        <div className="relative flex items-center justify-center py-16 px-8 rounded-xl" style={DOTTED_BG}>
          {/* Render the live badge at 1:1 for anatomy */}
          <BadgeLive state={state} curveRadius={curveRadius} label={label} showIconLeft={true} showIconRight={true} brand={brand} />

          {/* Callout: 1 Container (bottom) — line goes up to badge */}
          <div className="absolute bottom-4 flex flex-col items-center pointer-events-none" style={{ left: '50%', transform: 'translateX(-50%)' }}>
            <div className="w-px bg-slate-400" style={{ height: '32px' }} />
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">1</span>
          </div>

          {/* Callout: 2 Icon Left — line goes down to badge */}
          <div className="absolute top-4 flex flex-col items-center pointer-events-none" style={{ left: '47%', transform: 'translateX(-50%)' }}>
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">2</span>
            <div className="w-px bg-slate-400" style={{ height: '32px' }} />
          </div>

          {/* Callout: 3 Label — line goes down to badge */}
          <div className="absolute top-4 flex flex-col items-center pointer-events-none" style={{ left: '50%', transform: 'translateX(-50%)' }}>
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">3</span>
            <div className="w-px bg-slate-400" style={{ height: '32px' }} />
          </div>

          {/* Callout: 4 Icon Right — line goes down to badge */}
          <div className="absolute top-4 flex flex-col items-center pointer-events-none" style={{ left: '53%', transform: 'translateX(-50%)' }}>
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">4</span>
            <div className="w-px bg-slate-400" style={{ height: '32px' }} />
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

      {/* ── 4. VARIANTS ──────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-4">{t.variantsTitle}</h2>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">{t.propertyHeader}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.valuesHeader}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">{t.stateLabel}</td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1.5">
                    {(['Brand', 'Success', 'Warning', 'Error', 'Information', 'Muted'] as BadgeState[]).map((s) => (
                      <span key={s} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATE_DOT_COLORS[s], border: `1px solid ${STATE_DOT_BORDER[s]}` }} />
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">{t.curveRadiusLabel}</td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1.5">
                    {(['Full', 'Standard'] as BadgeCurveRadius[]).map((r) => (
                      <span key={r} className="inline-flex items-center px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium">{r}</span>
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Visual preview of all state × curve radius combinations */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {(['Brand', 'Success', 'Warning', 'Error', 'Information', 'Muted'] as BadgeState[]).map(s => (
            <div key={s} style={{ padding: '20px 24px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>{s}</p>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <BadgeLive state={s} curveRadius="Full" label={t.fullLabel} brand={brand} />
                <BadgeLive state={s} curveRadius="Standard" label={t.standardLabel} brand={brand} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.designTokensTitle}</h2>
        <p className="text-sm text-slate-500 mb-4">
          {t.designTokensLead}
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">{t.tokenHeader}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.cssVariableHeader}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">{t.valueHeader} ({brand})</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_TABLE_ROWS.map((row, i) => {
                const isActive = row.states.includes(state);
                const rawValue = tokens[row.key as keyof typeof tokens] ?? '—';
                // strip alpha for display swatch
                const swatchHex = rawValue.length > 7 ? rawValue.slice(0, 7) : rawValue;
                const light = isLightColor(swatchHex);
                return (
                  <tr
                    key={row.cssVar}
                    className={[
                      i < TOKEN_TABLE_ROWS.length - 1 ? 'border-b border-slate-100' : '',
                      isActive ? 'bg-blue-50/60' : 'opacity-50',
                      'transition-all duration-150',
                    ].join(' ')}
                    style={isActive ? { borderLeft: '3px solid #3b82f6' } : { borderLeft: '3px solid transparent' }}
                  >
                    <td className="px-5 py-3 font-medium text-slate-700 text-xs">{lang === 'zh' ? row.labelZh : row.labelEn}</td>
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

      {/* ── 6. ACCESSIBILITY ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.accessibilityTitle}</h2>
        <p className="text-sm text-slate-500 mb-4">
          {t.accessibilityLead}
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

      {/* ── 7. USAGE ─────────────────────────────────────────────────────────── */}
      <section>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{t.usageTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.usageLead}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>{t.whenToUseTitle}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              {t.whenToUse.map((line, i) => (
                <li key={i} style={{ marginBottom: i < t.whenToUse.length - 1 ? '6px' : 0 }}>• {line}</li>
              ))}
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>{t.whenNotToUseTitle}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              {t.whenNotToUse.map((line, i) => (
                <li key={i} style={{ marginBottom: i < t.whenNotToUse.length - 1 ? '6px' : 0 }}>• {line}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
