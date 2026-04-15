import { type Brand } from '../data/tokens';
import { TokenTable, type TokenRow } from '../components/content/TokenTable';
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

function toBorderRows(rows: BorderTokenRow[]): TokenRow[] {
  return rows.map((row) => ({
    token: row.token,
    tokenKey: row.tokenKey,
    values: [row.use],
  }));
}

export function BordersPage({ brand }: BordersPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      {/* ── Header ── */}
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
        Borders
      </h1>
      <p className="text-base text-slate-500 mb-10">
        The quiet lines that organise content, signal interaction, and
        communicate meaning.
      </p>

      {/* ── Intro ── */}
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Borders do more than draw lines — they create visual hierarchy,
        signal interactive affordance, and communicate feedback. Atom
        controls borders through two complementary systems: border weight
        (how thick) and border colour (what it means). Together, they give
        every border a clear job.
      </p>

      <hr className="border-slate-200 my-10" />

      {/* ── Core ── */}
      <TokenTable
        title="Core"
        description="These weights establish the two thicknesses used across the entire system. Most components use weight-1; weight-2 is reserved for moments that need extra emphasis, like focus rings and selected states."
        columns={['Token', 'Use']}
        rows={toBorderRows(BORDER_CORE)}
        brand={brand}
      />

      <hr className="border-slate-200 my-10" />

      {/* ── Default ── */}
      <TokenTable
        title="Default"
        description="The default palette for borders in their resting state. These are the colours users see most often, forming the quiet structural layer that organises content without competing for attention."
        columns={['Token', 'Use']}
        rows={toBorderRows(BORDER_DEFAULT)}
        brand={brand}
        showSwatch
      />

      <hr className="border-slate-200 my-10" />

      {/* ── Feedback ── */}
      <TokenTable
        title="Feedback"
        description="When a border needs to mean something — success, warning, error, or information — these tokens replace the default palette. Use them exclusively in validation and feedback contexts so their meaning stays unambiguous."
        columns={['Token', 'Use']}
        rows={toBorderRows(BORDER_FEEDBACK)}
        brand={brand}
        showSwatch
      />

      <hr className="border-slate-200 my-10" />

      {/* ── Selection and Focus ── */}
      <TokenTable
        title="Selection and Focus"
        description="Focus rings, selected outlines, and brand-tinted hover borders live here. These tokens are the backbone of keyboard navigation and accessibility — every interactive element must use them to show where the user's focus currently sits."
        columns={['Token', 'Use']}
        rows={toBorderRows(BORDER_SELECTION_FOCUS)}
        brand={brand}
        showSwatch
      />

      <hr className="border-slate-200 my-10" />

      {/* ── States ── */}
      <TokenTable
        title="States"
        description="These tokens respond to user interaction: hover darkens, pressed deepens, disabled fades, and interactive signals that an element is ready to be clicked. Apply them to any element that changes appearance when the user engages with it."
        columns={['Token', 'Use']}
        rows={toBorderRows(BORDER_STATES)}
        brand={brand}
        showSwatch
      />

      <hr className="border-slate-200 my-10" />

      {/* ── How to Use Border Weight and Colour ── */}
      <h2 className="text-xl font-semibold text-slate-800 mt-12 mb-4">
        How to Use Border Weight and Colour
      </h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Start with{' '}
        <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
          border-weight-1
        </code>{' '}
        and a default colour for most components — this is the baseline that
        covers the majority of cases. Increase to{' '}
        <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
          weight-2
        </code>{' '}
        only when you need to visually elevate an element, such as for focus
        rings or selected states. When a border needs to carry meaning,
        switch to a feedback colour. For interaction states, apply the
        matching state token so the border responds predictably to hover,
        press, and disable events.
      </p>
    </div>
  );
}
