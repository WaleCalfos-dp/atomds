import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';

interface OverlayPageProps {
  brand: Brand;
  lang?: Language;
}

const COPY = {
  en: {
    headline: 'Overlay',
    tagline:
      'Dimly covers the interface to focus user attention on a modal or active state. Use behind dialogs, menus, or loaders to prevent background interaction.',
    badgeFeedback: 'Surface',
    badgeStable: 'Stable',
    sectionAnatomy: 'Anatomy',
    sectionVariants: 'Variants',
    sectionTokens: 'Design Tokens',
    sectionA11y: 'Accessibility',
    sectionUsage: 'Usage',
    columnProperty: 'Property',
    columnValues: 'Values',
    columnUsage: 'Usage',
    columnCssVar: 'CSS Variable',
    valueColumnTpl: (b: string) => `Value (${b})`,
    anatomyIntro:
      'A single full-bleed surface with a fixed alpha. The Overlay sits between the page and an above-page surface (Dialog, Modal, Lightbox).',
    anatomyParts: [
      { num: '1', name: 'Scrim', desc: 'Full-viewport <div> covering the page. Background atom.background.core.bg-overlay (≈ 80% opacity black). Pointer events captured to prevent background interaction.' },
    ],
    variantRows: [
      { prop: 'Opacity', vals: '80% (only published value, default)' },
    ],
    tokensIntroLead: 'A single token drives the scrim across all six brands.',
    tokenRows: [
      { label: 'Scrim', cssVar: '--atom-background-core-bg-overlay', tokenKey: 'atom.background.core.bg-overlay', fallback: '#000000cc' },
    ],
    a11yIntro: 'Make the overlay invisible to assistive tech and trap focus inside the surface above it.',
    a11yRows: [
      { icon: '👁️', title: 'Hide from AT', body: 'The scrim is decorative — set aria-hidden="true" so screen readers skip it. The dialog/modal above the scrim handles role and focus.' },
      { icon: '⌨️', title: 'Focus trap', body: 'Trap Tab focus inside the surface above the overlay until it closes. Restore focus to the trigger element after dismissal.' },
      { icon: '🚫', title: 'Click to dismiss', body: 'Clicking the overlay should usually dismiss the surface. Always provide a visible Close button as well — overlay-click alone is not discoverable.' },
      { icon: '🎨', title: 'Contrast', body: 'The 80% scrim guarantees ≥ 7:1 contrast for any text rendered above it on the foreground surface.' },
    ],
    usageIntro: 'The Overlay is a primitive — it never appears alone.',
    usageCards: [
      { title: 'With Dialog', when: 'Modal confirmations and warnings. Pair with the Dialog component, which handles focus and role.' },
      { title: 'With Lightbox', when: 'Image viewer surfaces. Pair with Lightbox Image Viewer to focus user attention on a single asset.' },
      { title: 'With Loader', when: 'Block interaction during long-running flows. Pair with the Loader component plus a visible status message.' },
    ],
    whenToUseTitle: '✓ When to use',
    whenNotToUseTitle: "✗ When not to use",
    whenToUse: [
      'Pair with any blocking surface (Dialog, Modal, Lightbox)',
      'Capture pointer + keyboard events to prevent background interaction',
      'Use the standard 80% opacity — do not invent custom alpha values',
      'Animate in/out (150–200ms fade) to soften the transition',
    ],
    whenNotToUse: [
      "Don't use as a passive backdrop — overlays imply blocking",
      "Don't render multiple overlapping overlays — surface them in a stack instead",
      "Don't add content directly to the overlay — content lives on the surface above",
      "Don't rely on overlay-click alone for dismissal without a visible Close",
    ],
  },
  zh: {
    headline: '遮罩',
    tagline:
      '通过半透明覆盖层将界面变暗,从而将用户注意力聚焦到模态或活动状态。用于对话框、菜单或加载状态背后,以阻止用户与背景交互。',
    badgeFeedback: '表面',
    badgeStable: '稳定版',
    sectionAnatomy: '结构剖析',
    sectionVariants: '变体',
    sectionTokens: '设计令牌',
    sectionA11y: '可访问性',
    sectionUsage: '用法',
    columnProperty: '属性',
    columnValues: '可选值',
    columnUsage: '用途',
    columnCssVar: 'CSS 变量',
    valueColumnTpl: (b: string) => `值 (${b})`,
    anatomyIntro:
      '一个固定 alpha 的全屏表面。遮罩位于页面与上层界面(对话框、模态、灯箱)之间。',
    anatomyParts: [
      { num: '1', name: '遮罩层', desc: '覆盖整个视口的 <div>。背景使用 atom.background.core.bg-overlay(约 80% 不透明度的黑色)。捕获指针事件以阻止背景交互。' },
    ],
    variantRows: [
      { prop: '不透明度', vals: '80%(已发布的唯一取值,默认)' },
    ],
    tokensIntroLead: '所有六个品牌共用一个令牌驱动遮罩。',
    tokenRows: [
      { label: '遮罩层', cssVar: '--atom-background-core-bg-overlay', tokenKey: 'atom.background.core.bg-overlay', fallback: '#000000cc' },
    ],
    a11yIntro: '让遮罩对辅助技术不可见,并在上层界面中捕获焦点。',
    a11yRows: [
      { icon: '👁️', title: '对辅助技术隐藏', body: '遮罩仅用于装饰——设置 aria-hidden="true" 使屏幕阅读器跳过。对话框 / 模态由其自身处理 role 与焦点。' },
      { icon: '⌨️', title: '焦点陷阱', body: '在上层界面打开期间将 Tab 焦点限定其中。关闭后将焦点恢复到触发元素。' },
      { icon: '🚫', title: '点击关闭', body: '点击遮罩通常应关闭上层界面,但务必同时提供明显的关闭按钮——仅靠遮罩点击不易被发现。' },
      { icon: '🎨', title: '对比度', body: '80% 遮罩可确保上方表面任意文本与背景的对比度 ≥ 7:1。' },
    ],
    usageIntro: '遮罩是基础元素——不会单独出现。',
    usageCards: [
      { title: '与对话框配合', when: '模态确认与警告。与对话框组件配合,由对话框处理焦点和 role。' },
      { title: '与灯箱配合', when: '图像查看器界面。与灯箱图像查看器配合,聚焦用户对单个资源的关注。' },
      { title: '与加载状态配合', when: '在长时间流程中阻止交互。与 Loader 组件和可见状态信息搭配使用。' },
    ],
    whenToUseTitle: '✓ 推荐使用',
    whenNotToUseTitle: '✗ 避免使用',
    whenToUse: [
      '与任何阻塞性界面(对话框、模态、灯箱)配对',
      '捕获指针和键盘事件以阻止背景交互',
      '使用标准 80% 不透明度——不要自创 alpha 值',
      '使用 150–200ms 的淡入淡出动画使过渡更柔和',
    ],
    whenNotToUse: [
      '不要将其作为被动背景——遮罩意味着阻塞',
      '不要让多个遮罩叠加——请在堆栈中处理',
      '不要直接在遮罩上添加内容——内容应位于上层界面',
      '不要仅依赖遮罩点击关闭,需同时提供可见的关闭按钮',
    ],
  },
};

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

export function OverlayPage({ brand, lang = 'en' }: OverlayPageProps) {
  const t = COPY[lang];
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  return (
    <div className="space-y-10">
      {/* ── 1. INTERACTIVE PREVIEW ──────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="relative" style={{ ...DOTTED_BG, height: 360 }}>
            {/* Mock page underneath */}
            <div className="absolute inset-6 bg-white rounded-lg shadow-sm border border-slate-100 p-6 flex flex-col gap-3">
              <div className="h-3 w-1/3 bg-slate-200 rounded" />
              <div className="h-2 w-2/3 bg-slate-100 rounded" />
              <div className="h-2 w-1/2 bg-slate-100 rounded" />
              <div className="h-2 w-3/4 bg-slate-100 rounded" />
              <div className="h-12 w-32 bg-slate-200 rounded mt-4" />
            </div>
            {/* The overlay */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute', inset: 0,
                backgroundColor: 'var(--atom-background-core-bg-overlay, #000000cc)',
              }}
            />
            {/* Surface above overlay */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl px-8 py-6 min-w-[260px] text-center">
              <p className="text-sm font-semibold text-slate-900 mb-1">Surface above</p>
              <p className="text-xs text-slate-500">{lang === 'zh' ? '遮罩位于此卡片下方。' : 'The overlay sits beneath this card.'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ───────────────────────────────────────── */}
      <section>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">{t.headline}</h1>
            <p className="text-slate-500 text-sm max-w-xl">{t.tagline}</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">{t.badgeFeedback}</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{t.badgeStable}
            </span>
          </div>
        </div>
      </section>

      <hr className="border-slate-200" />

      {/* ── 3. ANATOMY ──────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.sectionAnatomy}</h2>
        <p className="text-sm text-slate-500 mb-5">{t.anatomyIntro}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '10px' }}>
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

      {/* ── 4. VARIANTS ─────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-4">{t.sectionVariants}</h2>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">{t.columnProperty}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.columnValues}</th>
              </tr>
            </thead>
            <tbody>
              {t.variantRows.map((row, i) => (
                <tr key={row.prop} className={i < t.variantRows.length - 1 ? 'border-b border-slate-100' : ''}>
                  <td className="px-5 py-3.5 font-medium text-slate-700 text-sm align-top">{row.prop}</td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs leading-relaxed">{row.vals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.sectionTokens}</h2>
        <p className="text-sm text-slate-500 mb-4">{t.tokensIntroLead}</p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">{t.columnUsage}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.columnCssVar}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">{t.valueColumnTpl(brand)}</th>
              </tr>
            </thead>
            <tbody>
              {t.tokenRows.map((row, i) => {
                const resolved = (tokens as Record<string, string>)[row.tokenKey] ?? row.fallback;
                const raw = resolved.replace('#', '').slice(0, 6);
                const r = parseInt(raw.slice(0, 2), 16);
                const g = parseInt(raw.slice(2, 4), 16);
                const b = parseInt(raw.slice(4, 6), 16);
                const light = (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
                return (
                  <tr key={row.label + i} className={i < t.tokenRows.length - 1 ? 'border-b border-slate-100' : ''}>
                    <td className="px-5 py-3 font-medium text-slate-700 text-xs">{row.label}</td>
                    <td className="px-5 py-3">
                      <code className="font-mono text-xs text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">{row.cssVar}</code>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded flex-shrink-0 border border-black/10" style={{ backgroundColor: resolved }} />
                        <span className="font-mono text-xs px-1.5 py-0.5 rounded border" style={{ backgroundColor: resolved, color: light ? '#1e293b' : '#f8fafc', borderColor: light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)' }}>{resolved.toUpperCase()}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 6. ACCESSIBILITY ────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.sectionA11y}</h2>
        <p className="text-sm text-slate-500 mb-4">{t.a11yIntro}</p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm divide-y divide-slate-100">
          {t.a11yRows.map((row, i) => (
            <div key={row.title} className={['flex items-start gap-4 px-5 py-4', i % 2 === 1 ? 'bg-slate-50/50' : ''].join(' ')}>
              <span className="text-xl flex-shrink-0 mt-0.5" aria-hidden="true">{row.icon}</span>
              <div>
                <p className="text-sm font-semibold text-slate-800">{row.title}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{row.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. USAGE ────────────────────────────────────────────────── */}
      <section>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{t.sectionUsage}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>{t.usageIntro}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
          {t.usageCards.map((card) => (
            <div key={card.title} style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #0a233322', backgroundColor: '#f9fafb' }}>
              <p style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: 600, color: '#0a2333' }}>{card.title}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#4b5563', lineHeight: 1.5 }}>{card.when}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>{t.whenToUseTitle}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              {t.whenToUse.map((item, idx) => (
                <li key={idx} style={{ marginBottom: idx < t.whenToUse.length - 1 ? '6px' : 0 }}>• {item}</li>
              ))}
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>{t.whenNotToUseTitle}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              {t.whenNotToUse.map((item, idx) => (
                <li key={idx} style={{ marginBottom: idx < t.whenNotToUse.length - 1 ? '6px' : 0 }}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
