import { Link } from 'react-router-dom';
import { type Brand, BRANDS, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { TokenTable, type TokenRow } from '../components/content/TokenTable';
import { DosDonts } from '../components/content/DosDonts';
import { ButtonLive } from '../components/button/ButtonLive';
import {
  BG_CORE,
  BG_PRIMARY,
  BG_ALERT,
  BORDER_CORE_TOKENS,
  BORDER_STATES_TOKENS,
  BORDER_FEEDBACK_TOKENS,
  FG_CORE,
  FG_PRIMARY,
  FG_STATES,
  FG_FEEDBACK,
  PROGRESS_INDICATOR,
  type BrandSwitcherTokenRow,
} from '../data/brandSwitcherTokens';

interface BrandSwitcherPageProps {
  brand: Brand;
}

// ─── Shared dotted preview surface ────────────────────────────────────────
const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// ─── Anatomy chips ────────────────────────────────────────────────────────
const TOKEN_PARTS = [
  { chip: 'atom',               label: 'Namespace',  description: 'Always atom — marks every token as part of the system.' },
  { chip: 'background',         label: 'Category',   description: 'background, border, foreground, or progress-indicator.' },
  { chip: 'primary',            label: 'Tier',       description: 'core, primary, alert — the family the token belongs to.' },
  { chip: 'bg-primary-default', label: 'Role + state', description: 'What the token does and which state it represents.' },
] as const;

// ─── Six core principles ──────────────────────────────────────────────────
const PRINCIPLES = [
  {
    title: 'Semantic naming',
    description:
      'Tokens describe their purpose, not their appearance. bg-primary-default means the same thing whether it resolves to navy, orange, or black.',
  },
  {
    title: 'Multi-brand by default',
    description:
      'Add a new brand by defining its palette — every component inherits the change because the semantic layer stays constant.',
  },
  {
    title: 'Accessibility first',
    description:
      'Every token pairing is tested to meet at least WCAG AA contrast ratios. Accessibility is built into the palette, not bolted on.',
  },
  {
    title: 'Consistency across states',
    description:
      'Hover, pressed, focus, and disabled states follow the same progression for every brand, so interactions feel familiar.',
  },
  {
    title: 'Single source of truth',
    description:
      'Designers, developers, and this documentation reference the same token names — no translation layer, no ambiguity.',
  },
  {
    title: 'Scales without forks',
    description:
      'Six brands today, twenty tomorrow — the same React package powers all of them with no parallel codebases.',
  },
] as const;

// ─── Accessibility guidance cards ─────────────────────────────────────────
const A11Y_RULES = [
  {
    title: 'Maintain 4.5:1 text contrast',
    description: 'All text/background pairings meet at least WCAG AA. Test every brand before shipping a new component.',
  },
  {
    title: 'Distinguish every state',
    description: 'Hover, pressed, and focus must each show clear visual differentiation — never rely on colour alone.',
  },
  {
    title: 'Use inverse tokens deliberately',
    description: 'Inverse tokens are for text and icons over dark or brand-coloured surfaces — not a stylistic choice.',
  },
  {
    title: 'Avoid opacity for body text',
    description: 'Opacity tokens are for overlays and subtle focus indicators, never for primary or body copy.',
  },
] as const;

function toTokenRows(rows: BrandSwitcherTokenRow[]): TokenRow[] {
  return rows.map((row) => ({
    token: row.token,
    tokenKey: row.tokenKey,
    values: [row.purpose, row.usage],
  }));
}

export function BrandSwitcherPage({ brand }: BrandSwitcherPageProps) {
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
            Foundations · Brand Switcher
          </span>
          <span className="text-[11px] text-slate-400">The engine behind multi-brand</span>
        </div>

        <h1 className="text-[40px] leading-[1.1] font-bold text-slate-900 tracking-tight mb-4">
          One token system.
          <br />
          <span style={{ color: 'var(--color-brand)' }}>Every brand. Zero hard-codes.</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
          Brand Switcher is the engine behind Atom's multi-brand capability. Every
          colour is a semantic token — a name that describes a role, not a value.
          Swap brands, the values change, the tokens stay the same.
        </p>
      </section>

      {/* ─────────── ONE COMPONENT, EVERY BRAND ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          One component. Every brand.
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          Same component code, six different foundations. The token layer does all the
          work — the React markup never sees a hex value.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {BRANDS.map((b) => {
            const isActive = b.id === brand;
            return (
              <div
                key={b.id}
                data-brand={b.id}
                className={`rounded-xl border bg-white overflow-hidden transition-all ${
                  isActive ? 'border-slate-900 shadow-md' : 'border-slate-200'
                }`}
              >
                <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">
                    {b.label}
                  </span>
                  {isActive && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  )}
                </div>
                <div
                  className="px-4 py-5 flex items-center justify-center"
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
                    brand={b.id}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
          The exact same <code className="font-mono text-[11px] text-slate-700">{'<ButtonLive variant="Primary" />'}</code>{' '}
          renders six different ways.
        </div>
      </section>

      {/* ─────────── ANATOMY OF A TOKEN ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Anatomy of a token
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          Token names are dot-separated paths. Each segment narrows the meaning, so
          you can read intent straight from the name.
        </p>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          {/* Token path with chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mb-8 font-mono text-sm">
            <span className="rounded-md bg-slate-700 px-2.5 py-1 text-white">atom</span>
            <span className="text-slate-400">.</span>
            <span className="rounded-md bg-blue-500 px-2.5 py-1 text-white">background</span>
            <span className="text-slate-400">.</span>
            <span className="rounded-md bg-violet-500 px-2.5 py-1 text-white">primary</span>
            <span className="text-slate-400">.</span>
            <span className="rounded-md bg-emerald-600 px-2.5 py-1 text-white">bg-primary-default</span>
          </div>
          {/* Labels grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TOKEN_PARTS.map((part, i) => {
              const colors = ['bg-slate-700', 'bg-blue-500', 'bg-violet-500', 'bg-emerald-600'];
              return (
                <div key={part.label} className="flex flex-col items-start gap-1">
                  <span className={`inline-block w-6 h-1.5 rounded-full ${colors[i]}`} />
                  <div className="text-xs font-semibold text-slate-900">{part.label}</div>
                  <div className="text-[11px] text-slate-500 leading-relaxed">{part.description}</div>
                </div>
              );
            })}
          </div>
          {/* Resolved value strip */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3 text-xs">
              <span className="font-semibold text-slate-500 uppercase tracking-wider">
                Resolves to
              </span>
              <div
                className="w-5 h-5 rounded border border-slate-200"
                style={{ backgroundColor: resolved['atom.background.primary.bg-primary-default'] }}
              />
              <code className="font-mono text-slate-700">
                {resolved['atom.background.primary.bg-primary-default']}
              </code>
              <span className="text-slate-400">in the active brand</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── CORE PRINCIPLES ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Core principles
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          Six rules hold the token system together. Together they make the difference
          between a colour palette and a true multi-brand engine.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <p className="text-xs text-slate-600 leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── BACKGROUND TOKENS ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Background tokens
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          Surfaces, primary fills, and alert states. Background tokens drive every
          coloured panel, button fill, and alert backdrop.
        </p>
        <div className="space-y-6">
          <TokenTable
            title="atom / background / core"
            columns={['Token', 'Purpose', 'Usage']}
            rows={toTokenRows(BG_CORE)}
            brand={brand}
            showSwatch
          />
          <TokenTable
            title="atom / background / primary"
            columns={['Token', 'Purpose', 'Usage']}
            rows={toTokenRows(BG_PRIMARY)}
            brand={brand}
            showSwatch
          />
          <TokenTable
            title="atom / background / alert"
            columns={['Token', 'Purpose', 'Usage']}
            rows={toTokenRows(BG_ALERT)}
            brand={brand}
            showSwatch
          />
        </div>
      </section>

      {/* ─────────── BORDER TOKENS ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Border tokens
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          Border colours map to their job — default structure, interaction states, or
          feedback meaning. Pair them with border weights from the Borders foundation.
        </p>
        <div className="space-y-6">
          <TokenTable
            title="atom / border / core"
            columns={['Token', 'Purpose', 'Usage']}
            rows={toTokenRows(BORDER_CORE_TOKENS)}
            brand={brand}
            showSwatch
          />
          <TokenTable
            title="atom / border / states"
            columns={['Token', 'Purpose', 'Usage']}
            rows={toTokenRows(BORDER_STATES_TOKENS)}
            brand={brand}
            showSwatch
          />
          <TokenTable
            title="atom / border / feedback"
            columns={['Token', 'Purpose', 'Usage']}
            rows={toTokenRows(BORDER_FEEDBACK_TOKENS)}
            brand={brand}
            showSwatch
          />
        </div>
      </section>

      {/* ─────────── FOREGROUND TOKENS ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Foreground tokens
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          Text, icons, and interactive content. Foreground tokens are the most
          frequently used layer in the system — anything readable lives here.
        </p>
        <div className="space-y-6">
          <TokenTable
            title="atom / foreground / core"
            columns={['Token', 'Purpose', 'Usage']}
            rows={toTokenRows(FG_CORE)}
            brand={brand}
            showSwatch
          />
          <TokenTable
            title="atom / foreground / primary"
            columns={['Token', 'Purpose', 'Usage']}
            rows={toTokenRows(FG_PRIMARY)}
            brand={brand}
            showSwatch
          />
          <TokenTable
            title="atom / foreground / states"
            columns={['Token', 'Purpose', 'Usage']}
            rows={toTokenRows(FG_STATES)}
            brand={brand}
            showSwatch
          />
          <TokenTable
            title="atom / foreground / feedback"
            columns={['Token', 'Purpose', 'Usage']}
            rows={toTokenRows(FG_FEEDBACK)}
            brand={brand}
            showSwatch
          />
        </div>
      </section>

      {/* ─────────── PROGRESS INDICATOR TOKENS ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Progress indicator tokens
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          A small dedicated set for the Progress Indicator component, where the
          active fill colour adapts per brand.
        </p>
        <TokenTable
          title="atom / progress-indicator"
          columns={['Token', 'Purpose', 'Usage']}
          rows={toTokenRows(PROGRESS_INDICATOR)}
          brand={brand}
          showSwatch
        />
      </section>

      {/* ─────────── ACCESSIBILITY & CONTRAST ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Accessibility &amp; contrast
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          Four rules keep the token system accessible across every brand. Bake them
          in early — they are far cheaper than retrofitting later.
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
          Do &amp; Don't
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-2xl">
          The shortest path to a healthy token system. When in doubt, lean on these.
        </p>
        <DosDonts
          dos={[
            'Reference semantic tokens in every component — never use brand palette colours directly',
            'Test every interactive state (hover, pressed, focus, disabled) across all active brands before shipping',
            'Apply inverse tokens only where background contrast demands them — not as a stylistic choice',
            'Document changes by token name, not by hex value, so the change is meaningful across brands',
          ]}
          donts={[
            'Hard-code palette colours (like #cf4500) in any component — always go through the token layer',
            'Combine feedback colours (error, warning, success) with brand surfaces unless a specific token exists for that pairing',
            'Invent new colour variations outside the established token set — if you need a new role, propose it as a new token',
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
            Ready to consume tokens?
          </h2>
          <p className="text-base text-slate-600 mb-6 max-w-xl mx-auto">
            See how every component in the library wires up to this token system —
            and ships brand-aware out of the box.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/components/button"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-brand)' }}
            >
              Browse components
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              to="/foundations/brand-foundations"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to Brand Foundations
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
