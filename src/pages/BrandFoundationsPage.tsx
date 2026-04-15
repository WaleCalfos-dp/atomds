import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

interface BrandFoundationsPageProps {
  brand: Brand;
}

const FOUNDATION_ITEMS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
      </svg>
    ),
    title: 'Colours',
    description:
      'The complete colour vocabulary for the brand — primaries, secondaries, neutrals, accents, and state-specific values. Every colour is mapped to a semantic token so components never reference raw hex values.',
    showSwatches: true,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    title: 'Typography',
    description:
      'The typographic personality of the brand: font families, weights, and a type scale that creates clear visual hierarchy. Mapped to tokens like font.family.heading, font.size.body, and font.weight.medium so type styling stays consistent everywhere.',
    showSwatches: false,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
      </svg>
    ),
    title: 'Logos',
    description:
      'The official mark of the brand, supplied in the formats and lockups needed for navigation headers, splash screens, and branded touchpoints. Treat these as immutable — they come directly from the brand.',
    showSwatches: false,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Icon Set',
    description:
      'A curated set of brand-approved icons in outline, filled, and functional styles. Designed to work at every size in the system and align with the brand\'s visual tone.',
    showSwatches: false,
  },
] as const;

const SWATCH_KEYS = [
  { key: 'atom.background.primary.bg-primary-default' as const, label: 'bg-primary-default' },
  { key: 'atom.foreground.primary.fg-brand-primary' as const, label: 'fg-brand-primary' },
  { key: 'atom.foreground.core.fg-interactive-icon' as const, label: 'fg-interactive-icon' },
];

export function BrandFoundationsPage({ brand }: BrandFoundationsPageProps) {
  const resolved = RESOLVED_SEMANTIC_TOKENS[brand];

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      {/* ── Header ── */}
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
        Brand Foundations
      </h1>
      <p className="text-base text-slate-500 mb-10">
        Every brand tells a different story. Foundations make sure the system
        listens.
      </p>

      {/* ── Intro ── */}
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Brand Foundations are where each brand's identity enters the design
        system. They capture the colours, typography, logos, and icons that
        make a brand recognisable — then translate those raw ingredients into
        tokens that every component can consume. The result: one component
        library that speaks the visual language of any brand you point it at.
      </p>

      <hr className="border-slate-200 my-10" />

      {/* ── What Brand Foundations Include ── */}
      <h2 className="text-xl font-semibold text-slate-800 mt-12 mb-4">
        What Brand Foundations Include
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {FOUNDATION_ITEMS.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2 text-slate-700">
              {item.icon}
              <h3 className="text-lg font-semibold text-slate-700">
                {item.title}
              </h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              {item.description}
            </p>
            {item.showSwatches && (
              <div className="flex items-center gap-3">
                {SWATCH_KEYS.map((s) => (
                  <div key={s.key} className="flex flex-col items-center gap-1">
                    <div
                      className="w-8 h-8 rounded-md border border-slate-200"
                      style={{ backgroundColor: resolved[s.key] }}
                    />
                    <span className="text-[10px] font-mono text-slate-400">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <hr className="border-slate-200 my-10" />

      {/* ── How Brand Foundations Are Used ── */}
      <h2 className="text-xl font-semibold text-slate-800 mt-12 mb-4">
        How Brand Foundations Are Used
      </h2>
      <ol className="space-y-4 mb-6">
        {[
          'The brand supplies a foundation file containing its colour palette, typography choices, and logo assets',
          'The Atom team loads these foundations into the Brand Switcher, translating raw values into semantic tokens',
          'Every component in the system pulls from the token layer, so the brand\'s identity flows through automatically',
          'Screens and flows assemble the final branded experience — no manual overrides needed',
        ].map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
              style={{ backgroundColor: 'var(--color-brand)' }}
            >
              {i + 1}
            </span>
            <span className="text-sm text-slate-600 leading-relaxed">
              {step}
            </span>
          </li>
        ))}
      </ol>

      <hr className="border-slate-200 my-10" />

      {/* ── Why Brand Foundations Matter ── */}
      <h2 className="text-xl font-semibold text-slate-800 mt-12 mb-4">
        Why Brand Foundations Matter
      </h2>
      <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-600 mb-6">
        <li>They create a single source of truth for each brand's identity, eliminating style drift and one-off overrides</li>
        <li>They let multiple brands share one component library without forking or duplicating code</li>
        <li>They make brand switching instant and predictable — swap the foundation, and the entire product updates</li>
        <li>They cut long-term maintenance by centralising every brand decision in one place</li>
        <li>They scale gracefully: go from two brands to twenty without redesigning a single component</li>
      </ul>
    </div>
  );
}
