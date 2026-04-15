import { Link } from 'react-router-dom';
import { type Brand, BRANDS, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { ButtonLive } from '../components/button/ButtonLive';
import { BadgeLive } from '../components/badge/BadgeLive';
import { TagsLive } from '../components/tags/TagsLive';

interface BrandFoundationsPageProps {
  brand: Brand;
}

// ─── Shared dotted preview surface ────────────────────────────────────────
const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// ─── Brand initial for the placeholder logo mark ──────────────────────────
const BRAND_INITIAL: Record<Brand, string> = {
  dragonpass: 'D',
  mastercard: 'M',
  investec:   'I',
  visa:       'V',
  greyscale:  'G',
  assurant:   'A',
};

// ─── Colour palette to surface for the current brand ─────────────────────
const PALETTE_SWATCHES = [
  { key: 'atom.background.primary.bg-primary-default' as const, label: 'Primary' },
  { key: 'atom.foreground.primary.fg-brand-primary'   as const, label: 'Brand FG' },
  { key: 'atom.foreground.feedback.fg-success'        as const, label: 'Success' },
  { key: 'atom.foreground.feedback.fg-warning'        as const, label: 'Warning' },
  { key: 'atom.foreground.feedback.fg-error'          as const, label: 'Error' },
  { key: 'atom.foreground.feedback.fg-info'           as const, label: 'Info' },
] as const;

// ─── Stroke-based icon set preview ────────────────────────────────────────
const ICON_PATHS = [
  'M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z', // search
  'M5 13l4 4L19 7',                                       // check
  'M5 12h14M12 5l7 7-7 7',                                // arrow right
  'M12 5v14M5 12h14',                                     // plus
];

// ─── Numbered usage steps ─────────────────────────────────────────────────
const USAGE_STEPS = [
  'The brand supplies a foundation file containing its colour palette, typography choices, and icon set.',
  'The Atom team loads these foundations into the Brand Switcher, translating raw values into semantic tokens.',
  'Every component pulls from the token layer, so the brand\'s identity flows through automatically — no overrides.',
  'Designers and developers assemble the final branded experience by composing existing Atom components.',
] as const;

// ─── Why it matters ───────────────────────────────────────────────────────
const WHY_IT_MATTERS = [
  {
    title: 'Single source of truth',
    description:
      'Every brand decision lives in one place, eliminating style drift and one-off overrides.',
  },
  {
    title: 'Shared component library',
    description:
      'Multiple brands share the same React package — no forking, no parallel bug fixes, no duplicated code.',
  },
  {
    title: 'Instant brand switching',
    description:
      'Swap the foundation file and the entire product re-themes. Demos and prototypes become trivial.',
  },
  {
    title: 'Lower long-term cost',
    description:
      'Centralising brand decisions cuts maintenance, audits, and the surface area for visual bugs over time.',
  },
  {
    title: 'Scales with the business',
    description:
      'Go from two brands to twenty without redesigning a single component or rewriting a single line of CSS.',
  },
  {
    title: 'Accessibility by default',
    description:
      'Every brand pairing is contrast-tested before it ships, so accessibility never gets bolted on later.',
  },
] as const;

export function BrandFoundationsPage({ brand }: BrandFoundationsPageProps) {
  const resolved = RESOLVED_SEMANTIC_TOKENS[brand];
  const currentBrand = BRANDS.find((b) => b.id === brand) ?? BRANDS[0];
  const initial = BRAND_INITIAL[brand];

  return (
    <div className="space-y-20">
      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: 'var(--color-brand)' }}
            />
            Foundations · Brand
          </span>
          <span className="text-[11px] text-slate-400">
            {BRANDS.length} brands ship today
          </span>
        </div>

        <h1 className="text-[40px] leading-[1.1] font-bold text-slate-900 tracking-tight mb-4">
          Every brand
          <br />
          <span style={{ color: 'var(--color-brand)' }}>starts here.</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
          Brand Foundations are where each brand's identity enters the design system —
          colours, typography, and icons. Atom translates those raw ingredients into
          semantic tokens that every component can wear.
        </p>
      </section>

      {/* ──────────── LIVE BRAND SHOWCASE CARD ──────────── */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
          Currently active foundation
        </h2>
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          {/* Header strip — rendered in current brand colour */}
          <div
            className="px-6 py-5 flex items-center gap-4"
            style={{ backgroundColor: 'var(--color-brand)' }}
          >
            <div className="w-12 h-12 rounded-lg bg-white/15 flex items-center justify-center text-white text-2xl font-bold">
              {initial}
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
                Foundation
              </div>
              <div className="text-2xl font-bold text-white">
                {currentBrand.label}
              </div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
                Primary
              </div>
              <div className="text-sm font-mono text-white/95">
                {currentBrand.primary}
              </div>
            </div>
          </div>
          {/* Live components on dotted surface */}
          <div className="p-8" style={DOTTED_BG}>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <ButtonLive
                buttonType="Full Button"
                variant="Primary"
                size="Default"
                state="Default"
                label="Brand action"
                showLabel
                showIconLeft={false}
                showIconRight={false}
                brand={brand}
              />
              <BadgeLive
                state="Brand"
                curveRadius="Standard"
                label="Live"
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
            </div>
          </div>
        </div>
      </section>

      {/* ──────────── WHAT'S INSIDE A FOUNDATION ──────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          What's inside a foundation
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          Three ingredients combine to give every brand its voice. Atom translates each
          one into tokens so components inherit the brand automatically.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* 01 · Colours */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                01
              </span>
              <h3 className="text-base font-semibold text-slate-900">Colours</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              The complete colour vocabulary — primaries, surfaces, and feedback states.
              Every value maps to a semantic token.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {PALETTE_SWATCHES.map((s) => (
                <div key={s.key} className="flex flex-col items-center gap-1">
                  <div
                    className="w-full h-12 rounded-md border border-slate-200"
                    style={{ backgroundColor: resolved[s.key] }}
                  />
                  <span className="text-[10px] font-mono text-slate-400">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 02 · Typography */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                02
              </span>
              <h3 className="text-base font-semibold text-slate-900">Typography</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Font families, weights, and a type scale that creates clear visual
              hierarchy across every screen.
            </p>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
              <div
                className="text-5xl font-bold leading-none mb-3"
                style={{ color: 'var(--color-brand)' }}
              >
                Aa
              </div>
              <div className="text-xl font-semibold text-slate-900 leading-tight mb-1">
                Display headline
              </div>
              <div className="text-sm text-slate-700 mb-1">
                Body copy at the regular reading size.
              </div>
              <div className="text-[11px] text-slate-400">Caption · 11px</div>
            </div>
          </div>

          {/* 03 · Icons */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                03
              </span>
              <h3 className="text-base font-semibold text-slate-900">Icon Set</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              A curated set of brand-approved icons in outline, filled, and functional
              styles. Designed to work at every size in the system.
            </p>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 flex items-center justify-around">
              {ICON_PATHS.map((path, i) => (
                <svg
                  key={i}
                  className="w-7 h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="var(--color-brand)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={path} />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────── ALL BRANDS AT A GLANCE ──────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Six foundations. One system.
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          Every brand below ships with Atom today. Adding the next one is a
          configuration change, not a redesign.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {BRANDS.map((b) => {
            const isActive = b.id === brand;
            return (
              <div
                key={b.id}
                className={`rounded-xl border bg-white p-4 transition-all ${
                  isActive ? 'border-slate-900 shadow-md' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-base font-bold text-white shrink-0"
                    style={{ backgroundColor: b.primary }}
                  >
                    {BRAND_INITIAL[b.id]}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">
                      {b.label}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 truncate">
                      {b.primary}
                    </div>
                  </div>
                </div>
                {isActive ? (
                  <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Active
                  </div>
                ) : (
                  <div className="text-[10px] font-medium text-slate-400">
                    Switch to preview
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ──────────── FROM FOUNDATION TO COMPONENT ──────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          From foundation to component
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          A foundation file becomes a live component in three hops. None of them ever
          touch the component itself.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Step 1 · Foundation file */}
          <div className="relative">
            <div className="rounded-xl border border-slate-200 bg-white p-5 h-full">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Step 1
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                Foundation file
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Brand provides palette, type, and icons.
              </p>
              <div className="rounded-md bg-slate-900 p-3 font-mono text-[11px] text-slate-300 leading-relaxed">
                <div>
                  <span className="text-slate-500">primary:</span>{' '}
                  <span className="text-amber-300">"{currentBrand.primary}"</span>
                </div>
                <div>
                  <span className="text-slate-500">font:</span>{' '}
                  <span className="text-amber-300">"Inter"</span>
                </div>
                <div>
                  <span className="text-slate-500">radius:</span>{' '}
                  <span className="text-amber-300">8</span>
                </div>
              </div>
            </div>
            {/* Arrow connector (lg only) */}
            <div className="hidden lg:flex absolute top-1/2 -right-2 -translate-y-1/2 z-10">
              <svg
                className="w-4 h-4 text-slate-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </div>
          </div>

          {/* Step 2 · Semantic tokens */}
          <div className="relative">
            <div className="rounded-xl border border-slate-200 bg-white p-5 h-full">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Step 2
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                Semantic tokens
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Atom translates raw values into semantic roles.
              </p>
              <div className="rounded-md bg-slate-900 p-3 font-mono text-[11px] text-slate-300 leading-relaxed">
                <div>
                  <span className="text-slate-500">bg-primary-default:</span>
                </div>
                <div className="ml-2">
                  <span className="text-emerald-300">
                    "{resolved['atom.background.primary.bg-primary-default']}"
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">fg-brand-primary:</span>
                </div>
                <div className="ml-2">
                  <span className="text-emerald-300">
                    "{resolved['atom.foreground.primary.fg-brand-primary']}"
                  </span>
                </div>
              </div>
            </div>
            {/* Arrow connector (lg only) */}
            <div className="hidden lg:flex absolute top-1/2 -right-2 -translate-y-1/2 z-10">
              <svg
                className="w-4 h-4 text-slate-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </div>
          </div>

          {/* Step 3 · Live component */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Step 3
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-2">
              Live component
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Components consume tokens — never raw values.
            </p>
            <div
              className="rounded-md p-4 flex items-center justify-center min-h-[88px]"
              style={DOTTED_BG}
            >
              <ButtonLive
                buttonType="Full Button"
                variant="Primary"
                size="Tiny"
                state="Default"
                label="Brand"
                showLabel
                showIconLeft={false}
                showIconRight={false}
                brand={brand}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ──────────── HOW FOUNDATIONS ARE USED ──────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          How foundations are used
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          From raw brand assets to a fully themed product in four moves.
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

      {/* ──────────── WHY IT MATTERS ──────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Why foundations matter
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          The discipline of putting brand decisions inside foundations pays off across
          the entire product lifecycle.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {WHY_IT_MATTERS.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <h3 className="text-base font-semibold text-slate-900 mb-1.5">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────── FINAL CTA ──────────── */}
      <section>
        <div
          className="rounded-2xl border border-slate-200 p-8 sm:p-10 text-center"
          style={{
            backgroundImage:
              'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          }}
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            See foundations in motion
          </h2>
          <p className="text-base text-slate-600 mb-6 max-w-xl mx-auto">
            Once foundations are loaded, the Brand Switcher takes over — and every
            component in the library re-themes instantly.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/foundations/brand-switcher"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-brand)' }}
            >
              Explore Brand Switcher
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
            <Link
              to="/components/button"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Browse components
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
