import { type Brand } from '../data/tokens';

interface GettingStartedPageProps {
  brand: Brand;
}

export function GettingStartedPage({ brand }: GettingStartedPageProps) {
  void brand;

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      {/* ── Header ── */}
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
        Getting Started
      </h1>
      <p className="text-base text-slate-500 mb-10">
        Build consistent, brand-ready experiences from day one — without
        starting from scratch.
      </p>

      {/* ── 1. What Atom Is ── */}
      <h2 className="text-xl font-semibold text-slate-800 mt-12 mb-4">
        What Atom Is
      </h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Atom is the shared language between design and development. It
        provides a unified set of components, tokens, and guidelines that
        adapt seamlessly to every brand we serve. Rather than rebuilding UI
        for each product or partner, teams build once with Atom — and the
        system handles the rest. Think of it as the floor, not the ceiling:
        a solid foundation that frees you to focus on what makes each
        experience unique.
      </p>

      <hr className="border-slate-200 my-10" />

      {/* ── 2. Who It Is For ── */}
      <h2 className="text-xl font-semibold text-slate-800 mt-12 mb-4">
        Who It Is For
      </h2>
      <ul className="space-y-3 text-sm text-slate-600 mb-6">
        <li className="flex items-start gap-2">
          <span className="text-slate-400 mt-1">•</span>
          <span>
            <span className="font-semibold text-slate-700">Designers</span> — Use
            the Figma libraries to assemble screens with brand-ready components,
            not one-off mockups
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-slate-400 mt-1">•</span>
          <span>
            <span className="font-semibold text-slate-700">Developers</span> —
            Consume token-driven components that stay in sync with design intent,
            reducing translation errors
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-slate-400 mt-1">•</span>
          <span>
            <span className="font-semibold text-slate-700">Product managers</span>{' '}
            — Reference a common vocabulary when scoping features, knowing the
            building blocks already exist
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-slate-400 mt-1">•</span>
          <span>
            <span className="font-semibold text-slate-700">QA engineers</span> —
            Test against documented behaviours and token values, not screenshots
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-slate-400 mt-1">•</span>
          <span>
            <span className="font-semibold text-slate-700">Everyone else</span> —
            Anyone shipping UI across the organisation benefits from a shared,
            predictable system
          </span>
        </li>
      </ul>

      <hr className="border-slate-200 my-10" />

      {/* ── 3. How to Use Atom in Your Design File ── */}
      <h2 className="text-xl font-semibold text-slate-800 mt-12 mb-4">
        How to Use Atom in Your Design File
      </h2>
      <ol className="space-y-4 mb-6">
        {[
          'Create a new design file in Figma',
          'Import the Brand Switcher library to unlock multi-brand theming',
          'Import the Atom Design System library for components and tokens',
          'Set up your page structure: a main frame with Header, Body, and Footer, plus a content frame inside the body',
          'Select the correct brand theme so tokens resolve to the right palette',
          'Pull in components from the Atom library — drag, drop, and configure',
          'Stick to the variants defined in Atom; they exist because they have been tested across brands',
          'Follow each component\'s documentation for behaviour, states, and accessibility requirements',
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

      {/* ── 4. How Updates Work ── */}
      <h2 className="text-xl font-semibold text-slate-800 mt-12 mb-4">
        How Updates Work
      </h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Atom evolves through coordinated releases so that design and code
        stay in lockstep. No one ships a visual change without the other
        side knowing about it.
      </p>
      <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-600 mb-6">
        <li>Designers update components or tokens in the Figma library and publish a new version</li>
        <li>Developers update the matching code packages to reflect the Figma changes</li>
        <li>Module teams adopt the latest Atom version in their next sprint or release cycle</li>
        <li>This documentation is updated after each release so it always reflects the current truth</li>
      </ul>

      <hr className="border-slate-200 my-10" />

      {/* ── 5. How to Contribute ── */}
      <h2 className="text-xl font-semibold text-slate-800 mt-12 mb-4">
        How to Contribute
      </h2>
      <ol className="space-y-4 mb-6">
        {[
          'Identify a gap, a recurring problem, or an unmet need and raise it in the Atom Design System channel',
          'Share real examples — screenshots, user flows, or data that illustrate the problem',
          'Draft a small, focused proposal describing the change and its expected impact',
          'Design and development review the proposal together to ensure feasibility and consistency',
          'Once approved, build the solution, test it across brands, and release',
          'Update this documentation so the knowledge is shared with every team',
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
    </div>
  );
}
