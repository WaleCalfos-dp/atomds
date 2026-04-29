import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TilesLive } from '../components/tiles/TilesLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';

interface TilesPageProps {
  brand: Brand;
  lang?: Language;
}

const COPY = {
  en: {
    typeLabel: 'Type',
    typeCountry: 'Country',
    onlyVariantNote: 'Only variant value in Figma.',
    textLabel: 'Text',
    textPlaceholder: 'Country name…',
    textNote: 'Figma exposes one text slot. (Runtime preview shows the default label.)',
    title: 'Tiles',
    intro1: 'A compact tile pairing a flag glyph with a country name. Used in list/grid pickers, eSIM country selection, and lounge locale filters. Font family updates per brand via',
    selection: 'Selection',
    stable: 'Stable',
    anatomyTitle: 'Anatomy',
    anatomyLead: 'Two visual parts inside a rounded outlined container.',
    anatomyParts: [
      { num: '1', name: 'Flag', desc: 'Decorative emoji flag glyph (16px). Rendered from the OS emoji font. aria-hidden="true".' },
      { num: '2', name: 'Country text', desc: '13px / weight 500. Font family from --atom-font-body — updates per brand. Carries the semantic label.' },
      { num: '3', name: 'Container', desc: 'Pill with rounded 8px corners, 1px default border, white (inverse) background. Sits on any dotted or solid surface.' },
    ],
    variantsTitle: 'Variants',
    propertyHeader: 'Property',
    valuesHeader: 'Values',
    variantRows: [
      { label: 'Type', chips: [{ text: 'Country', note: 'default' }] },
      { label: 'Booleans (0)', chips: [{ text: '—', note: 'no optional slots' }] },
      { label: 'Text slots (1)', chips: [{ text: 'Text', note: 'country name' }] },
      { label: 'Font family', chips: [
        { text: 'Poppins', note: 'Dragonpass' },
        { text: 'Arial', note: 'Mastercard' },
        { text: 'Inter', note: 'Investec' },
        { text: 'Manrope', note: 'Visa · Greyscale' },
        { text: 'Lato', note: 'Assurant' },
      ] },
    ],
    typeCountryPreview: 'Type = Country',
    tokensTitle: 'Design Tokens',
    tokensLead: 'Tokens used by every Tile. Swatches repaint to match the active brand.',
    tokenHeader: 'Token',
    cssVarHeader: 'CSS Variable',
    valueHeader: 'Value',
    tokenLabels: {
      'Background': 'Background',
      'Text colour': 'Text colour',
      'Border': 'Border',
    } as Record<string, string>,
    a11yTitle: 'Accessibility',
    a11yLead: 'Guidelines for using Tiles inclusively.',
    a11yRows: [
      { icon: '🏷️', title: 'Labelling', body: 'Each tile must combine the country flag with the country name as visible text — never use the flag alone. The flag is decorative (aria-hidden="true") and the country name carries the semantic meaning.' },
      { icon: '⌨️', title: 'Keyboard interaction', body: 'Selectable tiles must be focusable (role="button" or native <button>), and must activate on Enter and Space. Focus order follows the DOM order of the list.' },
      { icon: '🎨', title: 'Color contrast', body: 'Text colour (fg-brand-primary) on the white inverse surface meets WCAG AA 4.5:1 for all brands.' },
      { icon: '🖼️', title: 'Emoji flags', body: 'Flag glyphs are emoji — they rely on the OS font. Always render them alongside the country name so the component still communicates intent on platforms that fall back to a box glyph.' },
      { icon: '📏', title: 'Touch target', body: 'When used as a selectable chip, ensure the tile is ≥ 44×44 CSS pixels per WCAG 2.5.5 — wrap the padding generously.' },
    ],
    usageTitle: 'Usage',
    usageLead: 'When to reach for Tiles.',
    usageCards: [
      { title: 'Country', color: '#0a2333', bg: '#f0f4f8', when: 'Country / locale selectors where a flag + name pairing speeds recognition. Used in eSIM country lists, lounge locale filters, and phone-number country pickers.' },
    ],
    doTitle: '✓ When to use',
    dontTitle: '✗ When not to use',
    doItems: [
      'Use for country selectors that benefit from visual recognition',
      'Always pair the flag with the country name as visible text',
      'Use inside a grid/list of selectable options',
    ],
    dontItems: [
      "Don't use the flag as the only label — screen readers need text",
      "Don't use for non-country data (use Tags, Badge, or Chip instead)",
      "Don't stretch the tile to full-width — keep it compact",
    ],
  },
  zh: {
    typeLabel: '类型',
    typeCountry: 'Country',
    onlyVariantNote: 'Figma 中唯一的变体值。',
    textLabel: '文本',
    textPlaceholder: '国家名称…',
    textNote: 'Figma 提供一个文本槽。(运行时预览显示默认标签。)',
    title: '磁贴',
    intro1: '一个紧凑型磁贴,将国旗符号与国家名称配对使用。用于列表/网格选择器、eSIM 国家选择和休息室区域筛选。字体系列通过以下方式按品牌更新',
    selection: '选择',
    stable: '稳定',
    anatomyTitle: '结构',
    anatomyLead: '圆角描边容器内含两个视觉部件。',
    anatomyParts: [
      { num: '1', name: '国旗', desc: '装饰性 Emoji 国旗符号(16px)。由系统 Emoji 字体呈现。aria-hidden="true"。' },
      { num: '2', name: '国家文本', desc: '13px / 字重 500。字体系列来自 --atom-font-body — 按品牌更新。承载语义标签。' },
      { num: '3', name: '容器', desc: '8px 圆角药丸形,1px 默认边框,白色(反向)背景。可置于任何点状或实色表面上。' },
    ],
    variantsTitle: '变体',
    propertyHeader: '属性',
    valuesHeader: '值',
    variantRows: [
      { label: '类型', chips: [{ text: 'Country', note: '默认' }] },
      { label: '布尔值 (0)', chips: [{ text: '—', note: '无可选槽' }] },
      { label: '文本槽 (1)', chips: [{ text: 'Text', note: '国家名称' }] },
      { label: '字体系列', chips: [
        { text: 'Poppins', note: 'Dragonpass' },
        { text: 'Arial', note: 'Mastercard' },
        { text: 'Inter', note: 'Investec' },
        { text: 'Manrope', note: 'Visa · Greyscale' },
        { text: 'Lato', note: 'Assurant' },
      ] },
    ],
    typeCountryPreview: 'Type = Country',
    tokensTitle: '设计令牌',
    tokensLead: '每个磁贴使用的令牌。色块会根据当前激活的品牌重新渲染。',
    tokenHeader: '令牌',
    cssVarHeader: 'CSS 变量',
    valueHeader: '值',
    tokenLabels: {
      'Background': '背景',
      'Text colour': '文本颜色',
      'Border': '边框',
    } as Record<string, string>,
    a11yTitle: '无障碍',
    a11yLead: '包容性使用磁贴的指南。',
    a11yRows: [
      { icon: '🏷️', title: '标签', body: '每个磁贴必须将国旗与国家名称作为可见文本搭配使用 — 切勿单独使用国旗。国旗是装饰性的 (aria-hidden="true"),国家名称承载语义含义。' },
      { icon: '⌨️', title: '键盘交互', body: '可选择的磁贴必须可获得焦点(role="button" 或原生 <button>),并且必须能通过 Enter 和 Space 激活。焦点顺序遵循列表的 DOM 顺序。' },
      { icon: '🎨', title: '色彩对比度', body: '白色反向表面上的文本颜色(fg-brand-primary)在所有品牌中都符合 WCAG AA 4.5:1 标准。' },
      { icon: '🖼️', title: 'Emoji 国旗', body: '国旗符号是 Emoji — 依赖于操作系统字体。始终与国家名称一起渲染,以便在回退为方块符号的平台上,组件仍能传达意图。' },
      { icon: '📏', title: '触控目标', body: '当用作可选择的芯片时,确保磁贴 ≥ 44×44 CSS 像素(符合 WCAG 2.5.5)— 内边距应宽松。' },
    ],
    usageTitle: '用法',
    usageLead: '何时使用磁贴。',
    usageCards: [
      { title: '国家', color: '#0a2333', bg: '#f0f4f8', when: '国家 / 区域选择器,其中国旗 + 名称的搭配可加快识别速度。用于 eSIM 国家列表、休息室区域筛选和电话号码国家选择器。' },
    ],
    doTitle: '✓ 何时使用',
    dontTitle: '✗ 何时不使用',
    doItems: [
      '用于受益于视觉识别的国家选择器',
      '始终将国旗与国家名称作为可见文本配对',
      '在可选择项的网格/列表中使用',
    ],
    dontItems: [
      '不要将国旗作为唯一标签 — 屏幕阅读器需要文本',
      '不要用于非国家数据(改用标签、徽章或芯片)',
      '不要将磁贴拉伸至全宽 — 保持紧凑',
    ],
  },
} as const;

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const TOKEN_TABLE_ROWS: {
  label: string; cssVar: string; tokenKey: string; fallback: string;
}[] = [
  { label: 'Background',         cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse',    fallback: '#ffffff' },
  { label: 'Text colour',        cssVar: '--atom-foreground-primary-fg-brand-primary',   tokenKey: 'atom.foreground.primary.fg-brand-primary',      fallback: '#0a2333' },
  { label: 'Border',             cssVar: '--atom-border-default-border-default',         tokenKey: 'atom.border.default.border-default',             fallback: '#cdcbcb' },
];

export function TilesPage({ brand, lang = 'en' }: TilesPageProps) {
  const t = COPY[lang];
  const [tileText, setTileText] = useState('Albania');
  const previewKey = `Country-${tileText}`;
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-72">

            {/* Canvas */}
            <div className="flex-1 flex items-center justify-center p-12 min-h-52" style={DOTTED_BG}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                >
                  <TilesLive brand={brand} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5 overflow-y-auto">

              {/* Type (only one value — shown for discoverability) */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.typeLabel}</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    className="px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100 bg-slate-900 text-white border-slate-900 shadow-sm"
                    disabled
                  >
                    {t.typeCountry}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{t.onlyVariantNote}</p>
              </div>

              {/* Text */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.textLabel}</p>
                <input
                  type="text"
                  value={tileText}
                  maxLength={24}
                  onChange={(e) => setTileText(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-md text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition"
                  placeholder={t.textPlaceholder}
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  {t.textNote}
                </p>
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
              {t.intro1}{' '}
              <code className="text-xs bg-slate-100 px-1 rounded">--atom-font-body</code>.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.25" />
                <path d="M5 3v3M5 7.5v.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              </svg>
              {t.selection}
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

        <div className="relative flex items-center justify-center py-20 px-8 rounded-xl" style={DOTTED_BG}>
          <div>
            <TilesLive brand={brand} />
          </div>
          {/* 1 — Flag */}
          <div className="absolute top-4 flex flex-col items-center pointer-events-none" style={{ left: '45%', transform: 'translateX(-50%)' }}>
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">1</span>
            <div className="w-px bg-slate-400" style={{ height: '32px' }} />
          </div>
          {/* 2 — Country text */}
          <div className="absolute top-4 flex flex-col items-center pointer-events-none" style={{ left: '55%', transform: 'translateX(-50%)' }}>
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">2</span>
            <div className="w-px bg-slate-400" style={{ height: '32px' }} />
          </div>
          {/* 3 — Container */}
          <div className="absolute bottom-4 flex flex-col items-center pointer-events-none" style={{ left: '50%', transform: 'translateX(-50%)' }}>
            <div className="w-px bg-slate-400" style={{ height: '32px' }} />
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">3</span>
          </div>
        </div>

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
              {t.variantRows.map((row, i, arr) => (
                <tr key={row.label} className={i < arr.length - 1 ? 'border-b border-slate-100' : ''}>
                  <td className="px-5 py-3.5 font-medium text-slate-700 text-sm align-top">{row.label}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      {row.chips.map(({ text, note }) => (
                        <span key={text} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium">
                          {text}{note && <span className="text-slate-400 font-normal">· {note}</span>}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual preview of the one variant */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div style={{ padding: '20px 24px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
            <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>{t.typeCountryPreview}</p>
            <TilesLive brand={brand} />
          </div>
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.tokensTitle}</h2>
        <p className="text-sm text-slate-500 mb-4">
          {t.tokensLead}
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">{t.tokenHeader}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.cssVarHeader}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">{t.valueHeader}</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_TABLE_ROWS.map((row, i) => {
                const resolved = tokens[row.tokenKey as keyof typeof tokens] ?? row.fallback;
                const localizedLabel = t.tokenLabels[row.label] ?? row.label;
                return (
                  <tr key={row.cssVar} className={i < TOKEN_TABLE_ROWS.length - 1 ? 'border-b border-slate-100' : ''}>
                    <td className="px-5 py-3 font-medium text-slate-700 text-xs">{localizedLabel}</td>
                    <td className="px-5 py-3">
                      <code className="font-mono text-xs text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                        {row.cssVar}
                      </code>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded flex-shrink-0 border border-black/10" style={{ backgroundColor: resolved }} />
                        <span className="font-mono text-xs px-1.5 py-0.5 rounded border border-slate-200 bg-white text-slate-700">
                          {resolved.toUpperCase()}
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
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.a11yTitle}</h2>
        <p className="text-sm text-slate-500 mb-4">{t.a11yLead}</p>
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

      {/* ── 7. USAGE ─────────────────────────────────────────────────────────── */}
      <section style={{ paddingBottom: '40px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{t.usageTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.usageLead}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
          {t.usageCards.map((card) => (
            <div key={card.title} style={{ padding: '14px 16px', borderRadius: '10px', border: `1px solid ${card.color}22`, backgroundColor: card.bg }}>
              <p style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: 600, color: card.color }}>{card.title}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#4b5563', lineHeight: 1.5 }}>{card.when}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>{t.doTitle}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              {t.doItems.map((item, idx, arr) => (
                <li key={idx} style={{ marginBottom: idx < arr.length - 1 ? '6px' : 0 }}>• {item}</li>
              ))}
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>{t.dontTitle}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              {t.dontItems.map((item, idx, arr) => (
                <li key={idx} style={{ marginBottom: idx < arr.length - 1 ? '6px' : 0 }}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
