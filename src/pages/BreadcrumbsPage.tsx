import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BreadcrumbsLive, type BreadcrumbsDivider, type BreadcrumbItem } from '../components/breadcrumbs/BreadcrumbsLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';

interface BreadcrumbsPageProps {
  brand: Brand;
  lang?: Language;
}

// ─── Bilingual copy block ───────────────────────────────────────────────────
const COPY = {
  en: {
    dividerLabel: 'Divider',
    countLabel: 'Count',
    collapseLabel: 'Collapse',
    offLabel: 'Off',
    onLabel: 'On',
    title: 'Breadcrumbs',
    intro:
      "Shows the user's location within a hierarchical navigation structure. Each item is a link back to a parent level; the last item represents the current page. Supports chevron or forward-slash dividers, 2–6 crumbs, and ellipsis truncation for long trails.",
    navigation: 'Navigation',
    stable: 'Stable',
    anatomyTitle: 'Anatomy',
    anatomyLead: 'The Breadcrumbs component is composed of four parts working together as a navigation landmark.',
    anatomyParts: [
      { num: '1', name: 'Container', desc: '<nav aria-label="Breadcrumb"> landmark wrapping an ordered list. Horizontal flex, 12px gap, wraps on narrow viewports.' },
      { num: '2', name: 'Link crumb', desc: 'Ancestor page rendered as an <a>. 12px / 400 weight, color = fg-primary. Full keyboard reachable.' },
      { num: '3', name: 'Divider', desc: 'Decorative separator between crumbs — chevron or forward-slash glyph. aria-hidden, color = fg-tertiary.' },
      { num: '4', name: 'Current page', desc: 'Last crumb rendered as a <span> with aria-current="page". Color = fg-pressed, no link.' },
    ],
    variantsTitle: 'Variants',
    propertyHeader: 'Property',
    valuesHeader: 'Values',
    collapseValues: 'None · Ellipsis after N items (auto at Count = 6)',
    itemStateLabel: 'Item state',
    itemStateValues: 'Link · Current page',
    countCardLabel: 'Count',
    designTokensTitle: 'Design Tokens',
    designTokensLead:
      'Three foreground tokens drive every breadcrumb variant. Values resolve per-brand; switch Brand in the app header to see values update.',
    tokenHeader: 'Token',
    cssVariableHeader: 'CSS Variable',
    valueHeader: 'Value',
    accessibilityTitle: 'Accessibility',
    accessibilityLead: 'Guidelines for implementing Breadcrumbs in an inclusive way.',
    a11yRows: [
      {
        icon: '🧭',
        title: 'Navigation landmark',
        body: 'The component renders a <nav aria-label="Breadcrumb"> so assistive tech announces the region. Always pair with an ordered list so the hierarchical order is conveyed.',
      },
      {
        icon: '🎯',
        title: 'Current page marker',
        body: 'The last crumb is rendered as a <span> with aria-current="page" — not as a link. This signals "you are here" to screen readers and prevents a pointless self-link.',
      },
      {
        icon: '⌨️',
        title: 'Keyboard navigation',
        body: 'Every ancestor crumb is a native <a>, reachable in tab order. Enter activates the link. The current-page span is non-focusable as it does not navigate.',
      },
      {
        icon: '🎨',
        title: 'Do not rely on colour alone',
        body: 'The current page is distinguished by a deeper token color AND by not being underlined/linked. Dividers are visual-only and marked aria-hidden so they are never announced.',
      },
      {
        icon: '👁️',
        title: 'Contrast',
        body: 'Link (#4b4a4a), current (#063e56) and divider (#afaead) all meet WCAG AA 4.5:1 against the default surface across all 6 brands.',
      },
    ],
    usageTitle: 'Usage',
    usageLead: 'When and how to use the Breadcrumbs component.',
    whenToUseTitle: '✓ When to use',
    whenToUse: [
      'Deep hierarchical navigation (3+ levels)',
      'Users need to return quickly to ancestor pages',
      'Location context matters (faceted search, doc sites)',
      'Reinforce where the current page sits in the site tree',
    ],
    whenNotToUseTitle: '✗ When not to use',
    whenNotToUse: [
      'Only 1-level hierarchy — the trail adds noise',
      'Linear flows (checkout, onboarding wizards)',
      'A back-button pattern already covers the flow',
      "Don't use as the only navigation — pair with a nav menu",
    ],
    longItems: ['Home', 'Products', 'Category', 'Subcategory', 'Item', 'Detail'],
    anatomyItems: ['Home', 'Components', 'Breadcrumbs'],
  },
  zh: {
    dividerLabel: '分隔符',
    countLabel: '数量',
    collapseLabel: '折叠',
    offLabel: '关',
    onLabel: '开',
    title: '面包屑',
    intro:
      '显示用户在层级导航结构中的位置。每一项都是返回上级的链接；最后一项代表当前页面。支持 Chevron 或正斜杠分隔符、2–6 个面包屑，以及为长路径提供省略号截断。',
    navigation: '导航',
    stable: '稳定版',
    anatomyTitle: '结构剖析',
    anatomyLead: '面包屑组件由四个部分组成，共同作为导航地标使用。',
    anatomyParts: [
      { num: '1', name: '容器', desc: '<nav aria-label="Breadcrumb"> 地标包裹一个有序列表。水平 flex 布局，12px 间距，在窄视口下会换行。' },
      { num: '2', name: '链接面包屑', desc: '祖先页面以 <a> 渲染。12px / 字重 400，颜色 = fg-primary。完全可通过键盘访问。' },
      { num: '3', name: '分隔符', desc: '面包屑之间的装饰性分隔符——Chevron 或正斜杠字符。aria-hidden，颜色 = fg-tertiary。' },
      { num: '4', name: '当前页面', desc: '最后一个面包屑以带 aria-current="page" 的 <span> 渲染。颜色 = fg-pressed，无链接。' },
    ],
    variantsTitle: '变体',
    propertyHeader: '属性',
    valuesHeader: '值',
    collapseValues: '无 · N 项后省略号（Count = 6 时自动）',
    itemStateLabel: '项目状态',
    itemStateValues: '链接 · 当前页面',
    countCardLabel: '数量',
    designTokensTitle: '设计令牌',
    designTokensLead:
      '三个前景设计令牌驱动每个面包屑变体。值按品牌解析；在应用顶栏切换品牌即可看到值更新。',
    tokenHeader: '设计令牌',
    cssVariableHeader: 'CSS 变量',
    valueHeader: '值',
    accessibilityTitle: '可访问性',
    accessibilityLead: '以包容性方式实现面包屑的指南。',
    a11yRows: [
      {
        icon: '🧭',
        title: '导航地标',
        body: '组件渲染为 <nav aria-label="Breadcrumb">，辅助技术会播报该区域。始终搭配有序列表使用，以便传达层级顺序。',
      },
      {
        icon: '🎯',
        title: '当前页面标记',
        body: '最后一个面包屑以带 aria-current="page" 的 <span> 渲染——而非链接。这向屏幕阅读器表明"你在这里"，并避免无意义的自链接。',
      },
      {
        icon: '⌨️',
        title: '键盘导航',
        body: '每个祖先面包屑都是原生 <a>，按 Tab 顺序可达。Enter 键激活链接。当前页面的 span 不可获焦，因为它不进行导航。',
      },
      {
        icon: '🎨',
        title: '不要仅依赖颜色',
        body: '当前页面通过更深的令牌颜色以及不带下划线/链接来加以区分。分隔符仅为视觉用途并标记为 aria-hidden，因此从不会被播报。',
      },
      {
        icon: '👁️',
        title: '对比度',
        body: '链接（#4b4a4a）、当前（#063e56）和分隔符（#afaead）在所有 6 个品牌的默认表面上均满足 WCAG AA 4.5:1。',
      },
    ],
    usageTitle: '用法',
    usageLead: '何时以及如何使用面包屑组件。',
    whenToUseTitle: '✓ 适用场景',
    whenToUse: [
      '深层层级导航（3 层以上）',
      '用户需要快速返回祖先页面',
      '位置上下文很重要（分面搜索、文档站点）',
      '强化当前页面在网站树中的位置',
    ],
    whenNotToUseTitle: '✗ 不适用场景',
    whenNotToUse: [
      '仅 1 层层级——路径反而增加噪音',
      '线性流程（结账、新手引导向导）',
      '返回按钮模式已经覆盖该流程',
      '避免作为唯一导航使用——请搭配导航菜单',
    ],
    longItems: ['首页', '产品', '类别', '子类别', '项目', '详情'],
    anatomyItems: ['首页', '组件', '面包屑'],
  },
} as const;

// ─── Design token rows (3 tokens used by the breadcrumb component) ───────────
const TOKEN_TABLE_ROWS: { labelEn: string; labelZh: string; key: string; cssVar: string }[] = [
  { labelEn: 'Link (default)', labelZh: '链接（默认）', key: 'atom.foreground.core.fg-primary',   cssVar: '--atom-foreground-core-fg-primary' },
  { labelEn: 'Current page',   labelZh: '当前页面',     key: 'atom.foreground.states.fg-pressed', cssVar: '--atom-foreground-states-fg-pressed' },
  { labelEn: 'Divider / dots', labelZh: '分隔符 / 点',  key: 'atom.foreground.core.fg-tertiary',  cssVar: '--atom-foreground-core-fg-tertiary' },
];

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const LABEL_STYLE: React.CSSProperties = {
  margin: '0 0 8px', fontSize: '11px', fontWeight: 600,
  color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em',
};

// ─── Interactive preview segmented-button ───────────────────────────────────
function SegBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '5px 4px', borderRadius: '6px', border: 'none',
        backgroundColor: active ? '#fff' : 'transparent',
        color: active ? '#111827' : '#6b7280',
        fontSize: '11px', fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        boxShadow: active ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
        transition: 'all 0.15s ease',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {children}
    </button>
  );
}

const DIVIDERS: BreadcrumbsDivider[] = ['Chevron', 'Forward Slash'];

export function BreadcrumbsPage({ brand, lang = 'en' }: BreadcrumbsPageProps) {
  const t = COPY[lang];
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  const longItems: BreadcrumbItem[] = [
    { label: t.longItems[0], href: '#' },
    { label: t.longItems[1], href: '#' },
    { label: t.longItems[2], href: '#' },
    { label: t.longItems[3], href: '#' },
    { label: t.longItems[4], href: '#' },
    { label: t.longItems[5] },
  ];
  const anatomyItems: BreadcrumbItem[] = [
    { label: t.anatomyItems[0], href: '#' },
    { label: t.anatomyItems[1], href: '#' },
    { label: t.anatomyItems[2] },
  ];

  const [divider, setDivider] = useState<BreadcrumbsDivider>('Chevron');
  const [count, setCount] = useState(3);
  const [collapsed, setCollapsed] = useState(false);
  const previewKey = `${divider}-${count}-${collapsed}`;

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
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                >
                  <BreadcrumbsLive
                    divider={divider}
                    count={count}
                    items={collapsed ? longItems : undefined}
                    maxItems={collapsed ? 3 : 0}
                    brand={brand}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: controls */}
            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5">
              <div>
                <p style={LABEL_STYLE}>{t.dividerLabel}</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  {DIVIDERS.map(d => <SegBtn key={d} active={divider === d} onClick={() => setDivider(d)}>{d}</SegBtn>)}
                </div>
              </div>
              <div>
                <p style={LABEL_STYLE}>{t.countLabel}</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  {[2, 3, 4, 5, 6].map(n => <SegBtn key={n} active={count === n} onClick={() => setCount(n)}>{n}</SegBtn>)}
                </div>
              </div>
              <div>
                <p style={LABEL_STYLE}>{t.collapseLabel}</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  <SegBtn active={!collapsed} onClick={() => setCollapsed(false)}>{t.offLabel}</SegBtn>
                  <SegBtn active={collapsed} onClick={() => setCollapsed(true)}>{t.onLabel}</SegBtn>
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
              {t.navigation}
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
        <div className="flex items-center justify-center py-20 px-8 rounded-xl" style={DOTTED_BG}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <BreadcrumbsLive items={anatomyItems} divider="Chevron" brand={brand} />

            {/* 1 Container — line goes up from below the breadcrumb to the center */}
            <div style={{ position: 'absolute', bottom: '-48px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
              <div style={{ width: '1px', height: '32px', backgroundColor: '#94a3b8' }} />
              <span
                style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  backgroundColor: '#1e293b', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 700,
                  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                  flexShrink: 0, marginTop: '4px',
                }}
              >1</span>
            </div>

            {/* 2 Link crumb — above-left (≈ "Home") */}
            <div style={{ position: 'absolute', top: '-48px', left: '10%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
              <span
                style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  backgroundColor: '#1e293b', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 700,
                  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                  flexShrink: 0, marginBottom: '4px',
                }}
              >2</span>
              <div style={{ width: '1px', height: '32px', backgroundColor: '#94a3b8' }} />
            </div>

            {/* 3 Divider — above-center (≈ first chevron between "Home" and "Components") */}
            <div style={{ position: 'absolute', top: '-48px', left: '22%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
              <span
                style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  backgroundColor: '#1e293b', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 700,
                  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                  flexShrink: 0, marginBottom: '4px',
                }}
              >3</span>
              <div style={{ width: '1px', height: '32px', backgroundColor: '#94a3b8' }} />
            </div>

            {/* 4 Current page — above-right (≈ "Breadcrumbs") */}
            <div style={{ position: 'absolute', top: '-48px', left: '82%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
              <span
                style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  backgroundColor: '#1e293b', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 700,
                  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                  flexShrink: 0, marginBottom: '4px',
                }}
              >4</span>
              <div style={{ width: '1px', height: '32px', backgroundColor: '#94a3b8' }} />
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
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">{t.dividerLabel}</td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1.5">
                    {DIVIDERS.map(d => (
                      <span key={d} className="inline-flex items-center px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium">{d}</span>
                    ))}
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">{t.countLabel}</td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1.5">
                    {[2, 3, 4, 5, 6].map(n => (
                      <span key={n} className="inline-flex items-center px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium">{n}</span>
                    ))}
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">{t.collapseLabel}</td>
                <td className="px-5 py-3.5 text-slate-600 text-sm">{t.collapseValues}</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">{t.itemStateLabel}</td>
                <td className="px-5 py-3.5 text-slate-600 text-sm">{t.itemStateValues}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Visual preview of all Count × Divider combinations */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {DIVIDERS.flatMap(d =>
            [2, 3, 4, 5, 6].map(n => (
              <div key={`${d}-${n}`} style={{ padding: '20px 24px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>{t.countCardLabel} {n} · {d}</p>
                <div style={{ display: 'flex', alignItems: 'center', ...DOTTED_BG, padding: '16px', borderRadius: '6px', width: '100%', overflowX: 'auto' }}>
                  <BreadcrumbsLive
                    divider={d}
                    count={n}
                    items={n === 6 ? longItems : undefined}
                    brand={brand}
                  />
                </div>
              </div>
            ))
          )}
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
                const rawValue = tokens[row.key as keyof typeof tokens] ?? '—';
                const swatchHex = rawValue.length > 7 ? rawValue.slice(0, 7) : rawValue;
                const light = isLightColor(swatchHex);
                return (
                  <tr
                    key={row.cssVar}
                    className={[
                      i < TOKEN_TABLE_ROWS.length - 1 ? 'border-b border-slate-100' : '',
                      'transition-all duration-150',
                    ].join(' ')}
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
