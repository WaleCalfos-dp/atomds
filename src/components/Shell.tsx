import { type ReactNode } from 'react';
import { type Brand } from '../data/tokens';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface ShellProps {
  brand: Brand;
  setBrand: (brand: Brand) => void;
  children: ReactNode;
}

export function Shell({ brand, setBrand, children }: ShellProps) {
  return (
    <div
      data-brand={brand}
      className="min-h-screen bg-slate-50 font-sans"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      <Sidebar brand={brand} />
      <TopBar brand={brand} setBrand={setBrand} />

      {/* Main content area — offset for fixed sidebar + topbar */}
      <main className="pl-60 pt-14 min-h-screen">
        <div className="max-w-4xl mx-auto px-8 py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
