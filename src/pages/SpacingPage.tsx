import { type Brand } from '../data/tokens';
import { SpacingBar } from '../components/content/SpacingBar';
import { SPACING_TOKENS } from '../data/spacingTokens';

interface SpacingPageProps {
  brand: Brand;
}

export function SpacingPage({ brand }: SpacingPageProps) {
  void brand;

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      {/* ── Header ── */}
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
        Spacing
      </h1>
      <p className="text-base text-slate-500 mb-10">
        The invisible structure that makes interfaces feel calm, organised,
        and intentional.
      </p>

      {/* ── Intro ── */}
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Spacing is the most invisible and most impactful foundation in any
        design system. When spacing is consistent, layouts feel calm and
        intentional. When it drifts, interfaces feel cluttered and
        unreliable. Atom's spacing scale gives every gap, margin, and
        padding a defined token so teams never have to guess.
      </p>

      <hr className="border-slate-200 my-10" />

      {/* ── 8px Base Unit ── */}
      <h2 className="text-xl font-semibold text-slate-800 mt-12 mb-4">
        8px Base Unit
      </h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Every measurement in Atom derives from an 8-pixel base unit. This
        single decision creates a predictable vertical and horizontal rhythm
        across all components and layouts. Multiples of 8 align cleanly to
        pixel grids, prevent sub-pixel rendering issues, and make
        proportional relationships between elements immediately apparent.
      </p>

      <hr className="border-slate-200 my-10" />

      {/* ── Scale ── */}
      <h2 className="text-xl font-semibold text-slate-800 mt-12 mb-4">
        Scale
      </h2>

      {/* Token table */}
      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Token
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Pixels
              </th>
            </tr>
          </thead>
          <tbody>
            {SPACING_TOKENS.map((t) => (
              <tr
                key={t.token}
                className="border-b border-slate-100 last:border-0"
              >
                <td className="px-4 py-3">
                  <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                    {t.token}
                  </code>
                </td>
                <td className="px-4 py-3 text-slate-600">{t.px}px</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Visual bars */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm mb-8">
        {SPACING_TOKENS.map((t) => (
          <SpacingBar key={t.token} token={t.token} px={t.px} />
        ))}
      </div>

      <hr className="border-slate-200 my-10" />

      {/* ── Spacing Guidelines ── */}
      <h2 className="text-xl font-semibold text-slate-800 mt-12 mb-4">
        Spacing Guidelines
      </h2>

      {/* Small Values */}
      <h3 className="text-lg font-semibold text-slate-700 mt-8 mb-3">
        Small Values — 0px to 8px
      </h3>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Use{' '}
        <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
          space-0
        </code>{' '}
        through{' '}
        <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
          space-8
        </code>{' '}
        for the tight, internal gaps that hold compact elements together.
        These are the tokens that keep icons aligned with their labels,
        badges from feeling bloated, and form inputs from wasting space.
      </p>
      <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-600 mb-6">
        <li>Gaps between small icons and their adjacent text labels</li>
        <li>Internal padding inside compact components like badges, chips, and tags</li>
        <li>Inline spacing within form inputs and micro-layouts</li>
      </ul>

      {/* Medium Values */}
      <h3 className="text-lg font-semibold text-slate-700 mt-8 mb-3">
        Medium Values — 12px to 24px
      </h3>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Use{' '}
        <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
          space-12
        </code>{' '}
        through{' '}
        <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
          space-24
        </code>{' '}
        for the comfortable breathing room between related elements. This is
        the workhorse range — most component-level spacing decisions live
        here.
      </p>
      <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-600 mb-6">
        <li>Gaps between avatars, icons, and their associated text blocks</li>
        <li>Spacing between repeated elements like button groups, list items, and form fields</li>
        <li>Internal padding inside cards, panels, and container components</li>
      </ul>

      {/* Large Values */}
      <h3 className="text-lg font-semibold text-slate-700 mt-8 mb-3">
        Large Values — 32px to 80px
      </h3>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Use{' '}
        <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
          space-32
        </code>{' '}
        through{' '}
        <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
          space-80
        </code>{' '}
        for layout-level structure: the gaps that separate major sections,
        push content away from edges, and give pages room to breathe. Reach
        for these when you are spacing sections, not elements.
      </p>
      <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-600 mb-6">
        <li>Vertical space between page content and persistent headers or footers</li>
        <li>Padding and alignment within large content areas and full-width modules</li>
        <li>Margins between major page sections to create clear visual breaks</li>
      </ul>
    </div>
  );
}
