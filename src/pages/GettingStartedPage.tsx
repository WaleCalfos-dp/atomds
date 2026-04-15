import { Link } from 'react-router-dom';
import { type Brand, BRANDS } from '../data/tokens';
import { ButtonLive } from '../components/button/ButtonLive';
import { BadgeLive } from '../components/badge/BadgeLive';
import { TagsLive } from '../components/tags/TagsLive';
import { SwitchLive } from '../components/switch/SwitchLive';

interface GettingStartedPageProps {
  brand: Brand;
}

// ─── Shared dotted preview surface (matches component pages) ──────────────
const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// ─── Quick-start tile data ────────────────────────────────────────────────
const QUICK_START_TILES = [
  {
    to: '/foundations/brand-foundations',
    eyebrow: 'Foundations',
    title: 'Brand Foundations',
    description: 'Learn how every brand plugs into the system through a single foundation file.',
    minutes: '3 min read',
  },
  {
    to: '/foundations/brand-switcher',
    eyebrow: 'Foundations',
    title: 'Brand Switcher',
    description: 'See how semantic tokens make every component instantly multi-brand.',
    minutes: '5 min read',
  },
  {
    to: '/components/button',
    eyebrow: 'Components',
    title: 'Component Library',
    description: 'Explore 13 production-ready components, all documented and brand-aware.',
    minutes: 'Browse',
  },
  {
    to: '/foundations/spacing',
    eyebrow: 'Foundations',
    title: 'Spacing & Borders',
    description: 'Master the 8px scale and border weights that hold every layout together.',
    minutes: '2 min read',
  },
] as const;

// ─── Principles ───────────────────────────────────────────────────────────
const PRINCIPLES = [
  {
    title: 'Tokens, not values',
    description:
      'Every colour, space, and weight resolves through a semantic token. Components never know what brand they are wearing.',
  },
  {
    title: 'Multi-brand by default',
    description:
      'Six brands ship with the system today. Adding a seventh is a configuration change, not a redesign.',
  },
  {
    title: 'Accessibility built-in',
    description:
      'Every token pairing is contrast-tested. Every interactive state has a visible focus. Every component is keyboard-reachable.',
  },
  {
    title: 'Design ↔ code lockstep',
    description:
      'The Figma library and the React package share the same token names. What you see in design is what you ship.',
  },
] as const;

// ─── Audiences ────────────────────────────────────────────────────────────
const AUDIENCES = [
  {
    title: 'Designers',
    description:
      'Use the Figma library to assemble brand-ready screens with components that already match production.',
    cta: 'Start with Brand Foundations',
    to: '/foundations/brand-foundations',
  },
  {
    title: 'Developers',
    description:
      'Drop in token-driven React components that stay in sync with design intent — no translation layer.',
    cta: 'Browse the components',
    to: '/components/button',
  },
  {
    title: 'Product managers',
    description:
      'Reference a shared vocabulary when scoping features. The building blocks already exist and are battle-tested.',
    cta: 'Learn how Atom works',
    to: '/foundations/brand-switcher',
  },
  {
    title: 'QA engineers',
    description:
      'Test against documented behaviours and token values rather than screenshots that drift across brands.',
    cta: 'See component anatomy',
    to: '/components/alert',
  },
] as const;

// ─── Usage steps ──────────────────────────────────────────────────────────
const USAGE_STEPS = [
  'Import the Brand Switcher and Atom libraries into your Figma file or React project.',
  'Pick the brand you are designing or building for — every component will instantly re-theme.',
  'Compose screens from Atom components. Stick to the documented variants; they are the tested set.',
  'Reference each component\'s anatomy and accessibility notes before shipping.',
] as const;

// ─── Update flow ──────────────────────────────────────────────────────────
const UPDATE_FLOW = [
  {
    title: 'Design proposes',
    description: 'A change starts in Figma. The component or token is updated and the library is published.',
  },
  {
    title: 'Code mirrors',
    description: 'The matching React package is updated so design intent reaches production unchanged.',
  },
  {
    title: 'Teams adopt',
    description: 'Module teams pick up the latest version in their next release. No silent breakages.',
  },
  {
    title: 'Docs catch up',
    description: 'This site is updated after every release so it always reflects the current truth.',
  },
] as const;

// ─── Contribute steps ─────────────────────────────────────────────────────
const CONTRIBUTE_STEPS = [
  'Spot a gap or a recurring need — raise it in the Atom Design System channel with real examples.',
  'Draft a small, focused proposal describing the change and its expected impact across brands.',
  'Design and engineering review the proposal together to confirm feasibility and consistency.',
  'Build, test across every brand, ship, and update this documentation so the knowledge spreads.',
] as const;

// ─── Component status ─────────────────────────────────────────────────────
const COMPONENT_STATUS = [
  { name: 'Alert', to: '/components/alert', status: 'Stable' },
  { name: 'Badge', to: '/components/badge', status: 'Stable' },
  { name: 'Button', to: '/components/button', status: 'Stable' },
  { name: 'Checkbox', to: '/components/checkbox', status: 'Stable' },
  { name: 'Divider', to: '/components/divider', status: 'Stable' },
  { name: 'Input', to: '/components/input', status: 'Stable' },
  { name: 'Line Item', to: '/components/line-item', status: 'Stable' },
  { name: 'Progress Indicator', to: '/components/progress-indicator', status: 'Stable' },
  { name: 'Steps', to: '/components/steps', status: 'Stable' },
  { name: 'Switch', to: '/components/switch', status: 'Stable' },
  { name: 'Tabs', to: '/components/tabs', status: 'Stable' },
  { name: 'Tags', to: '/components/tags', status: 'Stable' },
  { name: 'Tooltip', to: '/components/tooltip', status: 'Stable' },
] as const;

export function GettingStartedPage({ brand }: GettingStartedPageProps) {
  const currentBrand = BRANDS.find((b) => b.id === brand) ?? BRANDS[0];

  return (
    <div className="space-y-20">
      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600"
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: 'var(--color-brand)' }}
            />
            Atom Design System · v1.0
          </span>
          <span className="text-[11px] text-slate-400">Updated April 2026</span>
        </div>

        <h1 className="text-[40px] leading-[1.1] font-bold text-slate-900 tracking-tight mb-4">
          One design system.
          <br />
          <span style={{ color: 'var(--color-brand)' }}>Every brand we serve.</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mb-8">
          Atom is the shared language between design and engineering — a unified set of
          components, tokens, and guidelines that adapt to any brand without
          rebuilding a thing.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/foundations/brand-foundations"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-brand)' }}
          >
            Start with Foundations
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <Link
            to="/components/button"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Browse components
          </Link>
        </div>
      </section>

      {/* ──────────────── LIVE BRAND DEMO STRIP ──────────────── */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Live preview
            </h2>
            <p className="text-base text-slate-700">
              Currently showing{' '}
              <span className="font-semibold" style={{ color: 'var(--color-brand)' }}>
                {currentBrand.label}
              </span>
              . Switch brands in the top right to see every component re-theme instantly.
            </p>
          </div>
        </div>

        <div
          className="rounded-2xl border border-slate-200 p-10"
          style={DOTTED_BG}
        >
          <div className="flex flex-wrap items-center justify-center gap-8">
            <ButtonLive
              buttonType="Full Button"
              variant="Primary"
              size="Default"
              state="Default"
              label="Get started"
              showLabel
              showIconLeft={false}
              showIconRight={false}
              brand={brand}
            />
            <BadgeLive
              state="Brand"
              curveRadius="Standard"
              label="New"
              showIconLeft={false}
              showIconRight={false}
              brand={brand}
            />
            <TagsLive
              state="Selected"
              label="Brand-aware"
              showIconLeft
              showIconRight={false}
              brand={brand}
            />
            <SwitchLive on label="Multi-brand" brand={brand} />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
          One component. {BRANDS.length} brands. Zero hard-coded values.
        </div>
      </section>

      {/* ─────────────────── QUICK START TILES ─────────────────── */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
          Start here
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {QUICK_START_TILES.map((tile) => (
            <Link
              key={tile.to}
              to={tile.to}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {tile.eyebrow}
                </span>
                <span className="text-[11px] text-slate-400">{tile.minutes}</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1.5 group-hover:text-slate-700">
                {tile.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                {tile.description}
              </p>
              <span
                className="inline-flex items-center gap-1 text-xs font-semibold"
                style={{ color: 'var(--color-brand)' }}
              >
                Read more
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─────────────────── PRINCIPLES ─────────────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">What makes Atom different</h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          Four ideas hold the system together. Together they free teams to focus on what
          actually makes each brand experience unique.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {PRINCIPLES.map((p, i) => (
            <div
              key={p.title}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white mb-3"
                style={{ backgroundColor: 'var(--color-brand)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-1.5">
                {p.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────── AUDIENCES ─────────────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Who Atom is for</h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          Whatever your role, there is a way into the system. Pick the entry point that
          matches how you work.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AUDIENCES.map((a) => (
            <div
              key={a.title}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-5"
            >
              <h3 className="text-base font-semibold text-slate-900 mb-1.5">
                {a.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
                {a.description}
              </p>
              <Link
                to={a.to}
                className="inline-flex items-center gap-1 text-xs font-semibold"
                style={{ color: 'var(--color-brand)' }}
              >
                {a.cta}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────── HOW TO USE ─────────────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Using Atom in your work</h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          Four steps from a blank file to a brand-ready screen — whether you are in Figma
          or in code.
        </p>
        <ol className="space-y-4">
          {USAGE_STEPS.map((step, i) => (
            <li
              key={i}
              className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5"
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                style={{ backgroundColor: 'var(--color-brand)' }}
              >
                {i + 1}
              </span>
              <span className="text-sm text-slate-700 leading-relaxed pt-1">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* ─────────────────── HOW UPDATES WORK ─────────────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">How updates flow</h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          Atom evolves through coordinated releases. No one ships a visual change without
          the other side knowing about it.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {UPDATE_FLOW.map((stage, i) => (
            <div key={stage.title} className="relative">
              <div className="rounded-xl border border-slate-200 bg-white p-5 h-full">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Step {i + 1}
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-1.5">
                  {stage.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {stage.description}
                </p>
              </div>
              {i < UPDATE_FLOW.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-2 -translate-y-1/2 z-10">
                  <svg
                    className="w-4 h-4 text-slate-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────── HOW TO CONTRIBUTE ─────────────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">How to contribute</h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          Atom is built by the teams that use it. Spotting a gap is the first step toward
          improving the system for everyone.
        </p>
        <ol className="space-y-4">
          {CONTRIBUTE_STEPS.map((step, i) => (
            <li
              key={i}
              className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5"
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                style={{ backgroundColor: 'var(--color-brand)' }}
              >
                {i + 1}
              </span>
              <span className="text-sm text-slate-700 leading-relaxed pt-1">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* ─────────────────── COMPONENT STATUS ─────────────────── */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Component status</h2>
            <p className="text-base text-slate-600">
              Every component below is production-ready and brand-aware.
            </p>
          </div>
          <span className="text-xs text-slate-500">
            {COMPONENT_STATUS.length} components
          </span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 divide-slate-100">
            {COMPONENT_STATUS.map((c, i) => (
              <Link
                key={c.name}
                to={c.to}
                className={`group flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 ${
                  i % 3 !== 2 ? 'lg:border-r lg:border-slate-100' : ''
                } ${i % 2 !== 1 ? 'sm:border-r sm:border-slate-100' : ''} ${
                  i >= 3 ? 'sm:border-t sm:border-slate-100' : ''
                }`}
              >
                <span className="text-sm font-medium text-slate-800 group-hover:text-slate-900">
                  {c.name}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {c.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── FINAL CTA ─────────────────── */}
      <section>
        <div
          className="rounded-2xl border border-slate-200 p-8 sm:p-10 text-center"
          style={{
            backgroundImage:
              'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          }}
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Ready to start building?
          </h2>
          <p className="text-base text-slate-600 mb-6 max-w-xl mx-auto">
            Open the foundations, pick a component, and ship a brand-ready experience
            today. The system handles the rest.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/foundations/brand-foundations"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-brand)' }}
            >
              Open Brand Foundations
            </Link>
            <Link
              to="/components/button"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Jump to components
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
