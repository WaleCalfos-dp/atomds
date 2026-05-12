import { type ReactNode } from 'react';
import { type Brand } from '@atom-core/tokens/tokens';
import { type Language } from '../data/languages';
import { type CustomBrand, generateCss, resolveCustomBrandTokens } from '../data/deriveTokens';
import { type StudioBrand } from '@atom-core/theming/types';
import { buildStudioCss } from '@atom-core/theming/cssBuilder';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface ShellProps {
  brand: Brand;
  setBrand: (brand: Brand) => void;
  customBrand: CustomBrand | null;
  studioBrand: StudioBrand | null;
  lang: Language;
  setLang: (lang: Language) => void;
  children: ReactNode;
}

export function Shell({
  brand,
  setBrand,
  customBrand,
  studioBrand,
  lang,
  setLang,
  children,
}: ShellProps) {
  const customCss =
    customBrand && brand === 'custom'
      ? generateCss(
          resolveCustomBrandTokens(customBrand),
          '[data-brand="custom"]',
          customBrand.primitives,
          customBrand.font,
        )
      : null;

  const studioCss = (() => {
    if (!studioBrand || brand !== 'studio') return null;
    try {
      return buildStudioCss(studioBrand);
    } catch {
      // Mid-edit invalid hex — fall through to dragonpass cascade defaults.
      return null;
    }
  })();

  return (
    <div
      data-brand={brand}
      lang={lang === 'zh' ? 'zh-CN' : 'en'}
      className="min-h-screen bg-slate-50 font-sans"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {customCss && <style>{customCss}</style>}
      {studioCss && <style>{studioCss}</style>}
      <Sidebar brand={brand} customBrand={customBrand} lang={lang} />
      <TopBar
        brand={brand}
        setBrand={setBrand}
        customBrand={customBrand}
        studioBrand={studioBrand}
        lang={lang}
        setLang={setLang}
      />

      {/* Main content area — offset for fixed sidebar + topbar */}
      <main className="pl-60 pt-14 min-h-screen">
        <div className="max-w-4xl mx-auto px-8 py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
