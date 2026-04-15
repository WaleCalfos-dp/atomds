import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Brand } from '../data/tokens';
import { NAV_SECTIONS } from '../data/navigation';

interface SidebarProps {
  brand: Brand;
}

/* ── section header icons ── */
const sectionIcons: Record<string, React.ReactNode> = {
  'getting-started': (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
      <path d="M7 1.5L12 5v7.5H9V8.5H5v4H2V5L7 1.5z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  foundations: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
      <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.25" />
      <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.25" />
      <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.25" />
      <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  ),
  components: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
      <rect x="1" y="3.5" width="12" height="7" rx="2" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="4" cy="7" r="1.25" fill="currentColor" />
      <line x1="6.5" y1="7" x2="11" y2="7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  ),
};

/* ── per-item icons ── */
const itemIcons: Record<string, React.ReactNode> = {
  '/getting-started': (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
      <path d="M2.5 10.5V3a1.5 1.5 0 011.5-1.5h6.5v8H4a1.5 1.5 0 00-1.5 1.5zm0 0A1.5 1.5 0 004 12h7.5" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  '/foundations/brand-foundations': (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
      <circle cx="5" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.15" />
      <circle cx="9" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.15" />
      <circle cx="7" cy="9" r="3" stroke="currentColor" strokeWidth="1.15" />
    </svg>
  ),
  '/foundations/brand-switcher': (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
      <path d="M1.5 4h11M1.5 7h11M1.5 10h11" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
      <circle cx="4" cy="4" r="1.25" fill="currentColor" />
      <circle cx="10" cy="7" r="1.25" fill="currentColor" />
      <circle cx="6" cy="10" r="1.25" fill="currentColor" />
    </svg>
  ),
  '/foundations/borders': (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
      <rect x="2" y="2" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.25" strokeDasharray="2 2" />
    </svg>
  ),
  '/foundations/spacing': (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
      <path d="M2 3h10M2 7h7M2 11h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  ),
  '/components/alert': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="opacity-70">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <line x1="12" y1="8" x2="12" y2="13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="12" cy="16" r="0.75" fill="currentColor" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
  '/components/button': (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
      <rect x="1" y="3.5" width="12" height="7" rx="3.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M5 7h4M7.5 5.5L9 7l-1.5 1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  '/components/badge': (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
      <rect x="1" y="4" width="12" height="6" rx="3" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="4" cy="7" r="1.25" fill="currentColor" />
    </svg>
  ),
  '/components/checkbox': (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
      <rect x="1" y="1" width="12" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M4 7l2.5 2.5L10 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  '/components/divider': (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
      <line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  ),
  '/components/input': (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
      <rect x="1" y="3" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.25" />
      <line x1="3.5" y1="7" x2="3.5" y2="7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  ),
  '/components/switch': (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
      <rect x="1" y="4" width="12" height="6" rx="3" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="10" cy="7" r="2" fill="currentColor" />
    </svg>
  ),
  '/components/tags': (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
      <rect x="1" y="3.5" width="12" height="7" rx="3.5" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="4.5" cy="7" r="1" fill="currentColor" />
    </svg>
  ),
};

export function Sidebar({ brand: _brand }: SidebarProps) {
  const { pathname } = useLocation();

  /* determine which section should be open based on the current route */
  const activeSectionId = NAV_SECTIONS.find((s) =>
    pathname.startsWith(s.basePath),
  )?.id ?? 'getting-started';

  const [openSection, setOpenSection] = useState(activeSectionId);

  /* keep open section in sync when navigating */
  useEffect(() => {
    setOpenSection(activeSectionId);
  }, [activeSectionId]);

  const toggle = (id: string) =>
    setOpenSection((prev) => (prev === id ? '' : id));

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
        {NAV_SECTIONS.map((section) => {
          const isOpen = openSection === section.id;
          return (
            <div key={section.id} className="mb-1">
              {/* Section header */}
              <button
                onClick={() => toggle(section.id)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-slate-500 uppercase tracking-widest hover:text-slate-300 hover:bg-slate-800/50 transition-colors duration-150"
              >
                <span className="text-slate-400">{sectionIcons[section.id]}</span>
                <span className="flex-1 text-left">{section.label}</span>
                <motion.svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  className="text-slate-500"
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <path
                    d="M3 1.5l4 3.5-4 3.5"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </button>

              {/* Collapsible items */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="mt-0.5 mb-2">
                      {section.items.map(({ to, label }) => (
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
                                  backgroundColor:
                                    'color-mix(in srgb, var(--color-brand) 20%, transparent)',
                                  color: 'white',
                                }
                              : {}
                          }
                        >
                          {itemIcons[to] ?? (
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
                              <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.25" />
                            </svg>
                          )}
                          {label}
                        </NavLink>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-700/60">
        <p className="text-xs text-slate-600">Atom Design System</p>
      </div>
    </aside>
  );
}
