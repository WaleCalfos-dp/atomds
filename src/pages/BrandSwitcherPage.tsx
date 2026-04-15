import { type Brand } from '../data/tokens';
import { TokenTable, type TokenRow } from '../components/content/TokenTable';
import { DosDonts } from '../components/content/DosDonts';
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

function toTokenRows(rows: BrandSwitcherTokenRow[]): TokenRow[] {
  return rows.map((row) => ({
    token: row.token,
    tokenKey: row.tokenKey,
    values: [row.purpose, row.usage],
  }));
}

export function BrandSwitcherPage({ brand }: BrandSwitcherPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      {/* ── Header ── */}
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
        Brand Switcher
      </h1>
      <p className="text-base text-slate-500 mb-10">
        One token system. Every brand. Zero hard-coded colours.
      </p>

      {/* ── Overview ── */}
      <h2 className="text-xl font-semibold text-slate-800 mt-12 mb-4">
        Overview
      </h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Brand Switcher is the engine behind Atom's multi-brand capability.
        Every colour in the system is expressed as a semantic token — a name
        that describes a role, not a value. When you swap brands, the values
        change but the tokens stay the same. The result is a colour system
        that scales to any number of brands without touching a single
        component.
      </p>

      <hr className="border-slate-200 my-10" />

      {/* ── Core Principles ── */}
      <h2 className="text-xl font-semibold text-slate-800 mt-12 mb-4">
        Core Principles
      </h2>
      <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-600 mb-6">
        <li>
          <span className="font-semibold text-slate-700">Semantic naming</span>
          : Tokens describe their purpose, not their appearance.{' '}
          <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
            bg-primary-default
          </code>{' '}
          means the same thing whether it resolves to navy, orange, or black.
        </li>
        <li>
          <span className="font-semibold text-slate-700">
            Scalable multi-brand logic
          </span>
          : Add a new brand by defining its palette — every component inherits
          the change automatically because the semantic layer stays constant.
        </li>
        <li>
          <span className="font-semibold text-slate-700">
            Accessibility first
          </span>
          : Every token pairing is tested to meet at least WCAG AA contrast
          ratios. Accessibility is built into the palette, not bolted on
          afterward.
        </li>
        <li>
          <span className="font-semibold text-slate-700">
            Consistency across states
          </span>
          : Hover, pressed, focus, and disabled states follow the same
          progression for every brand, so interactions feel familiar regardless
          of theme.
        </li>
        <li>
          <span className="font-semibold text-slate-700">Interoperable</span>
          : Designers, developers, and this documentation all reference the
          same token names — no translation layer, no ambiguity.
        </li>
      </ul>

      <hr className="border-slate-200 my-10" />

      {/* ── Token Categories ── */}
      <h2 className="text-xl font-semibold text-slate-800 mt-12 mb-4">
        Background Tokens
      </h2>
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

      <h2 className="text-xl font-semibold text-slate-800 mt-12 mb-4">
        Border Tokens
      </h2>
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

      <h2 className="text-xl font-semibold text-slate-800 mt-12 mb-4">
        Foreground Tokens
      </h2>
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

      <h2 className="text-xl font-semibold text-slate-800 mt-12 mb-4">
        Progress Indicator Tokens
      </h2>
      <TokenTable
        title="atom / progress-indicator"
        columns={['Token', 'Purpose', 'Usage']}
        rows={toTokenRows(PROGRESS_INDICATOR)}
        brand={brand}
        showSwatch
      />

      <hr className="border-slate-200 my-10" />

      {/* ── Accessibility & Contrast Guidance ── */}
      <h2 className="text-xl font-semibold text-slate-800 mt-12 mb-4">
        Accessibility &amp; Contrast Guidance
      </h2>
      <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-600 mb-6">
        <li>
          Maintain minimum 4.5:1 contrast between text and its background
        </li>
        <li>
          Hover, pressed, and focus states must show clear visual
          differentiation
        </li>
        <li>
          Use inverse tokens only when text or icons appear over dark or
          brand-coloured backgrounds
        </li>
        <li>
          Never use opacity tokens for body text — only for overlays or subtle
          focus indicators
        </li>
      </ul>

      <hr className="border-slate-200 my-10" />

      {/* ── Do & Don't ── */}
      <h2 className="text-xl font-semibold text-slate-800 mt-12 mb-4">
        Do &amp; Don't
      </h2>
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

      <hr className="border-slate-200 my-10" />

      {/* ── Summary ── */}
      <h2 className="text-xl font-semibold text-slate-800 mt-12 mb-4">
        Summary
      </h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Brand Switcher exists so that adding a brand is a configuration
        change, not a redesign. By keeping every colour decision in the
        semantic token layer, the system stays scalable, consistent,
        accessible, and easy to maintain. If you are ever tempted to
        hard-code a colour, that is a signal the token set needs a new
        entry — not a one-off override.
      </p>
    </div>
  );
}
