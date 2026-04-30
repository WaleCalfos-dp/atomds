// Shared docs scaffolding for the 7-section "ButtonPage template" used by every
// component documentation page. Each page provides a `t` (translation) object
// plus a Section 1 `preview` ReactNode; this component renders sections 2–7
// from the COPY data.
//
// Pattern matches existing canonical pages (ButtonPage, QRCodePage). Pages that
// need richer interactive previews continue to render Section 1 inline; only
// 2–7 are templated here.
import type { ReactNode } from 'react';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

export interface DocsCopy {
  headline: string;
  tagline: string;
  badgeFeedback: string;
  badgeStable: string;
  sectionAnatomy: string;
  sectionVariants: string;
  sectionTokens: string;
  sectionA11y: string;
  sectionUsage: string;
  columnProperty: string;
  columnValues: string;
  columnUsage: string;
  columnCssVar: string;
  valueColumnTpl: (b: string) => string;
  anatomyIntro: string;
  anatomyParts: { num: string; name: string; desc: string }[];
  variantRows: { prop: string; vals: string }[];
  tokensIntroLead: string;
  tokenRows: { label: string; cssVar: string; tokenKey: string; fallback: string }[];
  a11yIntro: string;
  a11yRows: { icon: string; title: string; body: string }[];
  usageIntro: string;
  usageCards: { title: string; when: string }[];
  whenToUseTitle: string;
  whenNotToUseTitle: string;
  whenToUse: string[];
  whenNotToUse: string[];
}

interface DocsTemplateProps {
  brand: Brand;
  preview: ReactNode;
  t: DocsCopy;
}

export function DocsTemplate({ brand, preview, t }: DocsTemplateProps) {
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  return (
    <div className="space-y-10">
      {/* ── 1. INTERACTIVE PREVIEW ─────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          {preview}
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ──────────────────────────────────────── */}
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

      {/* ── 3. ANATOMY ─────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.sectionAnatomy}</h2>
        <p className="text-sm text-slate-500 mb-5">{t.anatomyIntro}</p>
        <div style={{ display: 'grid', gridTemplateColumns: t.anatomyParts.length > 1 ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)', gap: '10px' }}>
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

      {/* ── 4. VARIANTS ────────────────────────────────────────────── */}
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

      {/* ── 5. DESIGN TOKENS ───────────────────────────────────────── */}
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

      {/* ── 6. ACCESSIBILITY ───────────────────────────────────────── */}
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

      {/* ── 7. USAGE ───────────────────────────────────────────────── */}
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

export const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};
