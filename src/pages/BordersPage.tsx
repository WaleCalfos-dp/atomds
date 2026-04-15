import { Link } from 'react-router-dom';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { TokenTable, type TokenRow } from '../components/content/TokenTable';
import { DosDonts } from '../components/content/DosDonts';
import {
  BORDER_CORE,
  BORDER_DEFAULT,
  BORDER_FEEDBACK,
  BORDER_SELECTION_FOCUS,
  BORDER_STATES,
  type BorderTokenRow,
} from '../data/borderTokens';

interface BordersPageProps {
  brand: Brand;
}

// ─── Shared dotted preview surface ────────────────────────────────────────
const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// ─── Two systems explanation ──────────────────────────────────────────────
const SYSTEMS = [
  {
    label: 'Border weight',
    sub: 'How thick',
    description:
      'A two-step scale that controls thickness. weight-1 is the workhorse for resting components; weight-2 is reserved for moments that need extra emphasis.',
    chips: ['border-weight-1', 'border-weight-2'],
  },
  {
    label: 'Border colour',
    sub: 'What it means',
    description:
      'A semantic palette that gives every border a job — default structure, interaction state, feedback meaning, or selection. Colour answers "why is this here?".',
    chips: ['border-default', 'border-hover', 'border-error', 'border-selected'],
  },
] as const;

// ─── Five border roles for the role grid ──────────────────────────────────
const BORDER_ROLES = [
  {
    title: 'Structure',
    description: 'Default and divider tokens hold the layout together — the quiet lines that organise content.',
    swatchKey: 'atom.border.default.border-default' as const,
  },
  {
    title: 'Interaction',
    description: 'Hover, pressed, and interactive tokens respond to user actions and signal clickability.',
    swatchKey: 'atom.border.states.border-hover' as const,
  },
  {
    title: 'Selection',
    description: 'Selected items, active tabs, and the elements the user has chosen — visually pinned in place.',
    swatchKey: 'atom.border.selection-and-focus.border-selected' as const,
  },
  {
    title: 'Focus',
    description: 'Keyboard focus rings — the most important accessibility border in the entire system.',
    swatchKey: 'atom.border.selection-and-focus.border-primary-focus' as const,
  },
  {
    title: 'Feedback',
    description: 'Success, warning, error, and info — borders that communicate status without needing words.',
    swatchKey: 'atom.border.feedback.border-error' as const,
  },
] as const;

// ─── Accessibility rules ──────────────────────────────────────────────────
const A11Y_RULES = [
  {
    title: 'Never rely on colour alone',
    description: 'A red border is not enough on its own — pair every feedback border with an icon or message so colour-blind users get the same information.',
  },
  {
    title: 'Focus rings are non-negotiable',
    description: 'Every interactive element must show a visible focus ring when reached by keyboard. Use border-primary-focus and never disable focus styles.',
  },
  {
    title: 'Maintain contrast on every brand',
    description: 'Border colours must remain visible against their background in every brand. Test default, dark, and brand-coloured surfaces before shipping.',
  },
  {
    title: 'Disabled means visibly disabled',
    description: 'Disabled borders should fade clearly but stay visible enough to keep the component shape readable. Never hide them entirely.',
  },
] as const;

function toBorderRows(rows: BorderTokenRow[]): TokenRow[] {
  return rows.map((row) => ({
    token: row.token,
    tokenKey: row.tokenKey,
    values: [row.use],
  }));
}

export function BordersPage({ brand }: BordersPageProps) {
  const resolved = RESOLVED_SEMANTIC_TOKENS[brand];

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
            Foundations · Borders
          </span>
          <span className="text-[11px] text-slate-400">Weight × meaning</span>
        </div>

        <h1 className="text-[40px] leading-[1.1] font-bold text-slate-900 tracking-tight mb-4">
          Quiet lines.
          <br />
          <span style={{ color: 'var(--color-brand)' }}>Loud intent.</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
          Borders organise content, signal interaction, and communicate meaning.
          Atom controls them with two systems — weight (how thick) and colour
          (what it means) — so every line on the screen has a clear job.
        </p>
      </section>

      {/* ─────────── TWO SYSTEMS ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Two systems, one border
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          Every border in Atom is the combination of a weight and a colour. The
          two systems are independent — you choose the thickness based on
          emphasis, then the colour based on meaning.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SYSTEMS.map((s, i) => (
            <div
              key={s.label}
              className="rounded-xl border border-slate-200 bg-white p-6"
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
                    {s.label}
                  </div>
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider">
                    {s.sub}
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {s.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {s.chips.map((chip) => (
                  <code
                    key={chip}
                    className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700"
                  >
                    {chip}
                  </code>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── WEIGHT VISUAL DEMO ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Border weight at a glance
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          Two weights, two jobs. Most components live at weight-1; weight-2
          steps in only when emphasis matters — focus rings and selected
          states.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* weight-1 card */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-4 pt-4 pb-2 flex items-center justify-between">
              <code className="font-mono text-[11px] text-slate-700">
                border-weight-1
              </code>
              <span className="text-[10px] text-slate-500">1px · default</span>
            </div>
            <div
              className="px-6 py-10 flex items-center justify-center"
              style={DOTTED_BG}
            >
              <div
                className="w-32 h-12 rounded-lg bg-white"
                style={{
                  border: '1px solid var(--atom-border-default-border-default)',
                }}
              />
            </div>
          </div>
          {/* weight-2 card */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-4 pt-4 pb-2 flex items-center justify-between">
              <code className="font-mono text-[11px] text-slate-700">
                border-weight-2
              </code>
              <span className="text-[10px] text-slate-500">2px · emphasis</span>
            </div>
            <div
              className="px-6 py-10 flex items-center justify-center"
              style={DOTTED_BG}
            >
              <div
                className="w-32 h-12 rounded-lg bg-white"
                style={{
                  border:
                    '2px solid var(--atom-border-selection-and-focus-border-primary-focus)',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── BORDER ROLES ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Five jobs a border can do
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          Every border colour in Atom plays one of five roles. Picking a
          colour is really picking a role — the rest is automatic.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BORDER_ROLES.map((r) => (
            <div
              key={r.title}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-lg bg-white"
                  style={{
                    border: `2px solid ${resolved[r.swatchKey]}`,
                  }}
                />
                <h3 className="text-base font-semibold text-slate-900">
                  {r.title}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {r.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── CORE ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Core weights
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          The two thicknesses used across the entire system. Most components
          use weight-1; weight-2 is reserved for emphasis moments like focus
          rings and selected states.
        </p>
        <TokenTable
          columns={['Token', 'Use']}
          rows={toBorderRows(BORDER_CORE)}
          brand={brand}
        />
      </section>

      {/* ─────────── DEFAULT ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Default colours
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          The resting palette — the colours users see most often. These form
          the quiet structural layer that organises content without competing
          for attention.
        </p>
        <TokenTable
          columns={['Token', 'Use']}
          rows={toBorderRows(BORDER_DEFAULT)}
          brand={brand}
          showSwatch
        />
      </section>

      {/* ─────────── FEEDBACK ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Feedback colours
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          When a border needs to mean something — success, warning, error, or
          information — these tokens replace the default palette. Use them
          exclusively in validation and feedback contexts so their meaning
          stays unambiguous.
        </p>
        <TokenTable
          columns={['Token', 'Use']}
          rows={toBorderRows(BORDER_FEEDBACK)}
          brand={brand}
          showSwatch
        />
      </section>

      {/* ─────────── SELECTION & FOCUS ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Selection &amp; focus
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          Focus rings, selected outlines, and brand-tinted hover borders. These
          tokens are the backbone of keyboard navigation — every interactive
          element must use them to show where the user&apos;s focus currently
          sits.
        </p>
        <TokenTable
          columns={['Token', 'Use']}
          rows={toBorderRows(BORDER_SELECTION_FOCUS)}
          brand={brand}
          showSwatch
        />
      </section>

      {/* ─────────── STATES ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Interaction states
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          These tokens respond to user interaction: hover darkens, pressed
          deepens, disabled fades, and interactive signals that an element is
          ready to be clicked. Apply them to any element that changes
          appearance when the user engages with it.
        </p>
        <TokenTable
          columns={['Token', 'Use']}
          rows={toBorderRows(BORDER_STATES)}
          brand={brand}
          showSwatch
        />
      </section>

      {/* ─────────── HOW TO COMBINE ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Combining weight and colour
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          A simple decision tree: start with the lightest weight that does the
          job, then pick the colour that matches the role.
        </p>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <ol className="space-y-5">
            <li className="flex gap-4">
              <div
                className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: 'var(--color-brand)' }}
              >
                01
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 mb-0.5">
                  Start with{' '}
                  <code className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                    border-weight-1
                  </code>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  This is the baseline that covers the majority of cases — most
                  components, cards, and inputs live here.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div
                className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: 'var(--color-brand)' }}
              >
                02
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 mb-0.5">
                  Pick a colour by role
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Default for structure, states for interaction, feedback for
                  meaning, selection-and-focus for accessibility moments.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div
                className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: 'var(--color-brand)' }}
              >
                03
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 mb-0.5">
                  Step up to{' '}
                  <code className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                    weight-2
                  </code>{' '}
                  only when needed
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Reserve the heavier weight for focus rings and selected
                  states — moments that genuinely need to feel pinned in
                  place.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* ─────────── ACCESSIBILITY ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Accessibility &amp; contrast
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          Borders carry more accessibility weight than most foundations — they
          define focus, communicate state, and shape the experience for
          keyboard users. Bake these in early.
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
          The shortest path to a healthy border system across every brand.
        </p>
        <DosDonts
          dos={[
            'Default to border-weight-1 — only step up to weight-2 for focus rings and selected states',
            'Match border colour to the role: structure, interaction, selection, focus, or feedback',
            'Pair feedback borders with an icon or message so meaning never depends on colour alone',
            'Test focus rings on every brand before shipping — they must remain visible against any background',
          ]}
          donts={[
            'Mix weight-2 into resting components — it pulls the eye and breaks the visual hierarchy',
            'Use feedback colours decoratively — they must only signal validation or status',
            'Disable or hide focus rings under any circumstance, even if they clash with a hover state',
            'Reach for hard-coded hex values when a semantic border token already exists',
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
            See borders in action
          </h2>
          <p className="text-base text-slate-600 mb-6 max-w-xl mx-auto">
            Every component in the library wires border weight and colour
            through these tokens — explore them to see how the system holds
            together end-to-end.
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
              to="/foundations/spacing"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Next foundation: Spacing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
