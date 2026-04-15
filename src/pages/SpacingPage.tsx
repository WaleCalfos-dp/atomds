import { Link } from 'react-router-dom';
import { type Brand } from '../data/tokens';
import { SpacingBar } from '../components/content/SpacingBar';
import { DosDonts } from '../components/content/DosDonts';
import { SPACING_TOKENS } from '../data/spacingTokens';

interface SpacingPageProps {
  brand: Brand;
}

// ─── Shared dotted preview surface ────────────────────────────────────────
const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// ─── Three ranges of the scale ────────────────────────────────────────────
const RANGES = [
  {
    label: 'Small',
    range: '0 – 8px',
    tokens: ['space-0', 'space-2', 'space-4', 'space-6', 'space-8'],
    description:
      'The tight, internal gaps that hold compact elements together. These keep icons aligned with their labels, badges from feeling bloated, and form inputs from wasting space.',
    examples: [
      'Gaps between small icons and adjacent text',
      'Internal padding inside badges, chips, and tags',
      'Inline spacing within form inputs',
    ],
  },
  {
    label: 'Medium',
    range: '12 – 24px',
    tokens: ['space-12', 'space-16', 'space-24'],
    description:
      'The comfortable breathing room between related elements. This is the workhorse range — most component-level spacing decisions live here.',
    examples: [
      'Gaps between avatars, icons, and their text blocks',
      'Spacing between repeated elements like list items',
      'Internal padding inside cards and panels',
    ],
  },
  {
    label: 'Large',
    range: '32 – 80px',
    tokens: ['space-32', 'space-48', 'space-64', 'space-80'],
    description:
      'Layout-level structure: the gaps that separate major sections, push content from edges, and give pages room to breathe. Reach for these when spacing sections, not elements.',
    examples: [
      'Vertical space between page content and headers',
      'Padding inside large content modules',
      'Margins between major page sections',
    ],
  },
] as const;

// ─── Why eight reasoning ──────────────────────────────────────────────────
const WHY_EIGHT = [
  {
    title: 'Pixel grid alignment',
    description:
      'Multiples of 8 align cleanly to physical pixel grids on every common device, eliminating sub-pixel rendering and fuzzy edges.',
  },
  {
    title: 'Predictable rhythm',
    description:
      'A single base unit means every gap, padding, and margin sits on the same invisible grid — even when the values change, they always relate.',
  },
  {
    title: 'Proportional thinking',
    description:
      'Designers and developers stop asking "is this 14 or 16?" and start asking "small, medium, or large?". The decision space gets dramatically smaller.',
  },
] as const;

// ─── Accessibility & spacing rules ────────────────────────────────────────
const A11Y_RULES = [
  {
    title: 'Tap targets need 44px minimum',
    description:
      'Combine padding tokens to ensure every interactive element clears the 44×44 minimum tap target — accessibility before density.',
  },
  {
    title: 'Honour visual hierarchy',
    description:
      'Larger gaps signal more separation. Always increase the gap when grouping elements into a different conceptual unit.',
  },
] as const;

export function SpacingPage({ brand }: SpacingPageProps) {
  void brand;

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
            Foundations · Spacing
          </span>
          <span className="text-[11px] text-slate-400">The invisible rhythm</span>
        </div>

        <h1 className="text-[40px] leading-[1.1] font-bold text-slate-900 tracking-tight mb-4">
          Calm by default.
          <br />
          <span style={{ color: 'var(--color-brand)' }}>Eight pixels at a time.</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
          Spacing is the most invisible and most impactful foundation in any
          design system. When it&apos;s consistent, layouts feel calm and
          intentional. When it drifts, interfaces feel cluttered and
          unreliable. Atom gives every gap, margin, and padding a defined
          token so teams never have to guess.
        </p>
      </section>

      {/* ─────────── THE 8PX BASE UNIT ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          One base unit, every measurement
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          Every measurement in Atom derives from a single 8-pixel base. Every
          token in the scale is either 8, a multiple of 8, or a small
          subdivision used inside compact components. One decision creates the
          rhythm for the entire system.
        </p>
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          {/* Stacked 8s visualisation */}
          <div
            className="rounded-xl px-6 py-10 mb-6"
            style={DOTTED_BG}
          >
            <div className="flex items-end justify-center gap-3">
              {[1, 2, 3, 4, 6, 8, 10].map((mult) => (
                <div key={mult} className="flex flex-col items-center gap-2">
                  <div
                    className="rounded-md"
                    style={{
                      width: '36px',
                      height: `${mult * 8}px`,
                      backgroundColor: 'var(--color-brand)',
                      opacity: 0.85,
                    }}
                  />
                  <span className="text-[10px] font-mono text-slate-500">
                    {mult * 8}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
              <span className="font-semibold text-slate-900">8 · 16 · 24 · 32 · 48 · 64 · 80</span>
              {' '}— every step is a multiple of 8, so layouts always land on the
              same invisible grid.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────── WHY EIGHT ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Why eight?
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          Eight is not arbitrary. It&apos;s the smallest base that gives you a
          clean pixel grid, a predictable rhythm, and a small enough decision
          space that designers can stop second-guessing.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {WHY_EIGHT.map((reason, i) => (
            <div
              key={reason.title}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white mb-3"
                style={{ backgroundColor: 'var(--color-brand)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-1.5">
                {reason.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── THE FULL SCALE ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          The full scale
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          Twelve tokens, from zero to eighty. The bars below are drawn to
          scale so you can see how each step grows in proportion to the
          others.
        </p>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          {SPACING_TOKENS.map((t) => (
            <SpacingBar key={t.token} token={t.token} px={t.px} />
          ))}
        </div>
      </section>

      {/* ─────────── TOKEN TABLE ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Token reference
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          The plain values for when you just need to look something up.
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Token
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Pixels
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Multiple of 8
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
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {t.px === 0
                      ? '—'
                      : t.px % 8 === 0
                      ? `${t.px / 8} × 8`
                      : 'Sub-step'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─────────── THREE RANGES ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Three ranges, three jobs
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          Don&apos;t think in pixels — think in ranges. Each range answers a
          different question about how much room something needs.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {RANGES.map((r, i) => (
            <div
              key={r.label}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: 'var(--color-brand)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <div className="text-base font-semibold text-slate-900 leading-tight">
                    {r.label}
                  </div>
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider">
                    {r.range}
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {r.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {r.tokens.map((tok) => (
                  <code
                    key={tok}
                    className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700"
                  >
                    {tok}
                  </code>
                ))}
              </div>
              <ul className="space-y-1">
                {r.examples.map((ex) => (
                  <li
                    key={ex}
                    className="text-[11px] text-slate-500 leading-relaxed flex items-start gap-1.5"
                  >
                    <span className="text-slate-300 mt-0.5">•</span>
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── SPACING IN PRACTICE ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Spacing in practice
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          The same scale doing three different jobs. Each example uses
          different tokens to achieve the right level of breathing room.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Small example: badge */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-4 pt-4 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Small · 4 / 6
            </div>
            <div className="p-6 flex items-center justify-center" style={DOTTED_BG}>
              <div
                className="inline-flex items-center bg-white rounded-full border border-slate-300"
                style={{ padding: '4px 12px', gap: '6px' }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: 'var(--color-brand)' }}
                />
                <span className="text-xs font-medium text-slate-700">Active</span>
              </div>
            </div>
            <div className="px-4 py-3 text-[11px] text-slate-500 leading-relaxed border-t border-slate-100">
              Internal padding and the gap between dot and label use small
              tokens.
            </div>
          </div>

          {/* Medium example: card */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-4 pt-4 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Medium · 16 / 24
            </div>
            <div className="p-6 flex items-center justify-center" style={DOTTED_BG}>
              <div
                className="bg-white rounded-lg border border-slate-200 shadow-sm w-full max-w-[180px]"
                style={{ padding: '16px' }}
              >
                <div className="text-xs font-semibold text-slate-900 mb-1">
                  Card title
                </div>
                <div
                  className="text-[10px] text-slate-500 leading-relaxed"
                  style={{ marginBottom: '16px' }}
                >
                  Cards use medium tokens for inner padding and gaps between
                  text blocks.
                </div>
                <div
                  className="inline-block rounded-md text-[10px] font-semibold text-white"
                  style={{
                    padding: '6px 12px',
                    backgroundColor: 'var(--color-brand)',
                  }}
                >
                  Action
                </div>
              </div>
            </div>
            <div className="px-4 py-3 text-[11px] text-slate-500 leading-relaxed border-t border-slate-100">
              Card padding and content gaps use the medium range.
            </div>
          </div>

          {/* Large example: section */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-4 pt-4 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Large · 32 / 48
            </div>
            <div className="p-6 flex items-center justify-center" style={DOTTED_BG}>
              <div
                className="bg-white rounded-lg border border-slate-200 w-full max-w-[180px] flex flex-col"
                style={{ gap: '32px', padding: '24px' }}
              >
                <div className="text-[10px] font-semibold text-slate-700">
                  Section A
                </div>
                <div
                  className="border-t border-dashed border-slate-200"
                  style={{ marginTop: '-16px', marginBottom: '-16px' }}
                />
                <div className="text-[10px] font-semibold text-slate-700">
                  Section B
                </div>
              </div>
            </div>
            <div className="px-4 py-3 text-[11px] text-slate-500 leading-relaxed border-t border-slate-100">
              Sections inside a layout are separated with large tokens.
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── ACCESSIBILITY ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Accessibility &amp; spacing
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          Spacing isn&apos;t just aesthetic — it directly affects how usable
          your interface is for keyboard, motor, and cognitive access.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {A11Y_RULES.map((rule) => (
            <div
              key={rule.title}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <h3 className="text-base font-semibold text-slate-900 mb-1.5">
                {rule.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {rule.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── DO & DON'T ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Do &amp; Don&apos;t
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          The shortest path to a calm, consistent layout.
        </p>
        <DosDonts
          dos={[
            'Always reach for a token from the scale — never type a raw pixel value into your stylesheet',
            'Think in ranges (small / medium / large) before you think in numbers',
            'Increase the gap when grouping elements into a new conceptual unit — let space do the talking',
            'Combine spacing tokens to clear the 44px tap-target minimum on every interactive element',
          ]}
          donts={[
            'Invent values between tokens — there is no space-13 or space-20, and there shouldn\'t be',
            'Use spacing as a substitute for a divider when content needs an explicit visual break',
            'Apply large layout-level tokens inside compact components — they will overpower their container',
            'Mix multiple tokens at random in the same component — pick a consistent rhythm and stick to it',
          ]}
        />
      </section>

      {/* ─────────── FINAL CTA ─────────── */}
      <section>
        <div
          className="rounded-2xl border border-slate-200 p-8 sm:p-10 text-center"
          style={{
            backgroundImage:
              'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          }}
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            See spacing in action
          </h2>
          <p className="text-base text-slate-600 mb-6 max-w-xl mx-auto">
            Every component in Atom uses these tokens for padding, gaps, and
            margins — explore them to see the scale at work end-to-end.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/components/button"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-brand)' }}
            >
              Browse components
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
              to="/foundations/borders"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to Borders
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
