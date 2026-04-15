import { NavLink } from 'react-router-dom';
import { type Brand } from '../data/tokens';

interface SidebarProps {
  brand: Brand;
}

export function Sidebar({ brand: _brand }: SidebarProps) {
  return (
    <aside className="fixed top-0 left-0 h-full w-60 bg-slate-900 flex flex-col z-10">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-brand)' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5" fill="white" fillOpacity="0.9" />
            </svg>
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">
            Atom Docs
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="mb-1">
          <p className="px-3 mb-2 text-xs font-medium text-slate-500 uppercase tracking-widest">
            Components
          </p>
          {[
            {
              to: '/components/alert',
              label: 'Alert',
              icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="opacity-70">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
                  <line x1="12" y1="8" x2="12" y2="13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  <circle cx="12" cy="16" r="0.75" fill="currentColor" stroke="currentColor" strokeWidth="1" />
                </svg>
              ),
            },
            {
              to: '/components/button',
              label: 'Button',
              icon: (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
                  <rect x="1" y="3.5" width="12" height="7" rx="3.5" stroke="currentColor" strokeWidth="1.25" />
                  <path d="M5 7h4M7.5 5.5L9 7l-1.5 1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
            },
            {
              to: '/components/badge',
              label: 'Badge',
              icon: (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
                  <rect x="1" y="4" width="12" height="6" rx="3" stroke="currentColor" strokeWidth="1.25" />
                  <circle cx="4" cy="7" r="1.25" fill="currentColor" />
                </svg>
              ),
            },
            {
              to: '/components/checkbox',
              label: 'Checkbox',
              icon: (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
                  <rect x="1" y="1" width="12" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.25" />
                  <path d="M4 7l2.5 2.5L10 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
            },
            {
              to: '/components/divider',
              label: 'Divider',
              icon: (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
                  <line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                </svg>
              ),
            },
            {
              to: '/components/input',
              label: 'Input',
              icon: (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
                  <rect x="1" y="3" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.25" />
                  <line x1="3.5" y1="7" x2="3.5" y2="7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                </svg>
              ),
            },
            {
              to: '/components/switch',
              label: 'Switch',
              icon: (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
                  <rect x="1" y="4" width="12" height="6" rx="3" stroke="currentColor" strokeWidth="1.25" />
                  <circle cx="10" cy="7" r="2" fill="currentColor" />
                </svg>
              ),
            },
            {
              to: '/components/tags',
              label: 'Tags',
              icon: (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
                  <rect x="1" y="3.5" width="12" height="7" rx="3.5" stroke="currentColor" strokeWidth="1.25" />
                  <circle cx="4.5" cy="7" r="1" fill="currentColor" />
                </svg>
              ),
            },
          ].map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors duration-150',
                  isActive
                    ? 'text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800',
                ].join(' ')
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      backgroundColor: 'color-mix(in srgb, var(--color-brand) 20%, transparent)',
                      color: 'white',
                    }
                  : {}
              }
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-700/60">
        <p className="text-xs text-slate-600">
          Atom Design System
        </p>
      </div>
    </aside>
  );
}
