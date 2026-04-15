import { useLocation } from 'react-router-dom';
import { type Brand, BRANDS } from '../data/tokens';

interface TopBarProps {
  brand: Brand;
  setBrand: (brand: Brand) => void;
}

function routeMeta(pathname: string): { parent: string; label: string } {
  const segments = pathname.split('/').filter(Boolean);

  if (segments[0] === 'getting-started') {
    return { parent: 'Docs', label: 'Getting Started' };
  }
  if (segments[0] === 'foundations' && segments[1]) {
    const label = segments[1]
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return { parent: 'Foundations', label };
  }
  if (segments[0] === 'components' && segments[1]) {
    const label = segments[1].charAt(0).toUpperCase() + segments[1].slice(1);
    return { parent: 'Components', label };
  }
  return { parent: 'Docs', label: '' };
}

export function TopBar({ brand, setBrand }: TopBarProps) {
  const { pathname } = useLocation();
  const { parent, label } = routeMeta(pathname);

  return (
    <header className="fixed top-0 left-60 right-0 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm">
        <span className="text-slate-400">{parent}</span>
        {label && (
          <>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="text-slate-300"
            >
              <path
                d="M5 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-slate-800 font-medium">{label}</span>
          </>
        )}
      </nav>

      {/* Brand Switcher */}
      <div className="flex items-center gap-0.5">
        {BRANDS.map((b) => {
          const isActive = brand === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setBrand(b.id)}
              title={b.label}
              className={[
                'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150',
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100',
              ].join(' ')}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: b.primary }}
              />
              {b.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
