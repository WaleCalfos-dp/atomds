import { type ReactNode } from 'react';
import { type Brand } from '../data/tokens';
import { type CustomBrand, generateCss, resolveCustomBrandTokens } from '../data/deriveTokens';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface ShellProps {
  brand: Brand;
  setBrand: (brand: Brand) => void;
  customBrand: CustomBrand | null;
  children: ReactNode;
}

export function Shell({ brand, setBrand, customBrand, children }: ShellProps) {
  const customCss =
    customBrand && brand === 'custom'
      ? generateCss(
          resolveCustomBrandTokens(customBrand),
          '[data-brand="custom"]',
          customBrand.primitives,
        )
      : null;

  return (
    <div
      data-brand={brand}
      className="min-h-screen bg-slate-50 font-sans"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {customCss && <style>{customCss}</style>}
      <Sidebar brand={brand} customBrand={customBrand} />
      <TopBar brand={brand} setBrand={setBrand} customBrand={customBrand} />

      {/* Main content area — offset for fixed sidebar + topbar */}
      <main className="pl-60 pt-14 min-h-screen">
        <div className="max-w-4xl mx-auto px-8 py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
