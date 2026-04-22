import { useMemo } from 'react';
import { type Brand, type SemanticTokenKey, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import {
  type CorePrimitives,
  type TokenRule,
  DEFAULT_PRIMITIVES,
  PRIMITIVE_DESCRIPTORS,
  TOKEN_DERIVATION,
  deriveTokens,
  describeRule,
} from '../data/deriveTokens';
import { getCustomBrandSnapshot } from '../hooks/useCustomBrand';

interface MappingPageProps {
  brand: Brand;
}

type PrimitiveKey = keyof CorePrimitives;

// ─── Brand Switcher reconciliation notes ─────────────────────────────────────
// For each primitive, which Brand Switcher variables it subsumes, and whether
// those variables ship identical values across every Foundations library (the
// "safe" case) or diverge (the "lossy" case, flagged so the user knows what
// nuance is given up for the 13-primitive simplification).

type CompressionNote = {
  tokens: SemanticTokenKey[];       // Brand Switcher variables consolidated
  safeInAll: boolean;                // true = identical hex in every foundations lib
  note?: string;                     // explanation when !safeInAll
};

const COMPRESSION_NOTES: Partial<Record<PrimitiveKey, CompressionNote>> = {
  link: {
    tokens: [
      'atom.foreground.core.fg-link',
      'atom.foreground.core.fg-interactive-icon',
      'atom.border.states.border-interactive',
    ],
    safeInAll: false,
    note:
      'In DragonPass / Mastercard / Assurant these three share the same hex. In Visa and Greyscale fg-link collapses to #000 while fg-interactive-icon keeps brand primary. The portal treats them as one; edit the generated CSS by hand for per-token nuance.',
  },
  borderDefault: {
    tokens: [
      'atom.border.default.border-default',
      'atom.border.default.border-divider',
      'atom.border.states.border-disabled',
    ],
    safeInAll: false,
    note:
      'DragonPass/Greyscale/Assurant keep all three identical. Investec differs border-divider (#e6e5e1) from border-default (#dbdad4) by ~2%. The portal uses the single borderDefault primitive; divider will look slightly heavier than Investec.',
  },
  textTertiary: {
    tokens: [
      'atom.foreground.core.fg-tertiary',
      'atom.foreground.states.fg-disabled',
    ],
    safeInAll: false,
    note:
      'In DragonPass, fg-tertiary (#afaead) is lighter than fg-disabled (#91908f). The portal uses textTertiary for both. If you need disabled text to read darker than placeholders, override in the exported CSS block.',
  },
  backgroundSecondary: {
    tokens: [
      'atom.background.core.bg-secondary',
      'atom.background.primary.bg-primary-pressed-inverse',
      'atom.background.primary.bg-primary-disabled-inverse',
    ],
    safeInAll: true,
  },
  brandPrimary: {
    tokens: [
      'atom.foreground.primary.fg-brand-primary',
      'atom.foreground.primary.fg-brand-hover',
      'atom.background.primary.bg-primary-default',
      'atom.background.primary.bg-primary-focus',
      'atom.background.primary.bg-primary-pressed-brand',
      'atom.background.primary.accent',
      'atom.background.core.bg-accent',
      'atom.border.default.border-default-brand',
      'atom.border.selection-and-focus.border-primary-focus',
      'atom.border.selection-and-focus.border-selected',
      'atom.border.selection-and-focus.border-brand-hover',
    ],
    safeInAll: false,
    note:
      'In Assurant, fg-brand-primary (#01194d) differs from bg-primary-default (#103265) — the darker shade is used for text, the mid shade for surfaces. The portal compresses both to brandPrimary. Assurant’s distinction is lost; re-introduce by editing the exported CSS for the two tokens.',
  },
};

// ─── Fixed values (the 7 tokens that aren't driven by any primitive) ────────
type FixedNote = { token: SemanticTokenKey; value: string; note: string };
const FIXED_VALUES: FixedNote[] = (Object.keys(TOKEN_DERIVATION) as SemanticTokenKey[])
  .filter((k) => TOKEN_DERIVATION[k].kind === 'fixed')
  .map((token) => {
    const rule = TOKEN_DERIVATION[token] as Extract<TokenRule, { kind: 'fixed' }>;
    return { token, value: rule.value, note: rule.note };
  });

// ─── MappingPage ─────────────────────────────────────────────────────────────
export function MappingPage({ brand }: MappingPageProps) {
  // Use current brand's effective tokens for the "computed value" column — so
  // designers on different brand pills see what tokens actually resolve to for
  // that brand. For the 'custom' brand, pull the user's primitives; otherwise
  // reverse-engineer them from the resolved dragonpass-style table.
  const { primitives, computed } = useMemo(() => {
    if (brand === 'custom') {
      const snap = getCustomBrandSnapshot();
      const p = snap?.primitives ?? DEFAULT_PRIMITIVES;
      return { primitives: p, computed: deriveTokens(p) };
    }
    // For built-in brands, show RESOLVED_SEMANTIC_TOKENS values but label the
    // mapping using the DEFAULT_PRIMITIVES (since the portal's rules are
    // authored against DragonPass). This keeps the mapping page illustrative
    // rather than requiring a reverse-lookup.
    return {
      primitives: DEFAULT_PRIMITIVES,
      computed: RESOLVED_SEMANTIC_TOKENS[brand],
    };
  }, [brand]);

  // Build inverted index: primitive → list of tokens that depend on it
  const tokensByPrimitive = useMemo(() => {
    const map: Record<PrimitiveKey, SemanticTokenKey[]> = {
      brandPrimary: [], brandHover: [], brandPressed: [],
      textPrimary: [], textSecondary: [], textTertiary: [],
      link: [], backgroundSecondary: [], borderDefault: [],
      feedbackSuccess: [], feedbackWarning: [], feedbackError: [], feedbackInfo: [],
    };
    (Object.keys(TOKEN_DERIVATION) as SemanticTokenKey[]).forEach((key) => {
      const rule = TOKEN_DERIVATION[key];
      if (rule.kind !== 'fixed') {
        map[rule.from].push(key);
      }
    });
    return map;
  }, []);

  const primitiveOrder: PrimitiveKey[] = [
    'brandPrimary', 'brandHover', 'brandPressed',
    'textPrimary', 'textSecondary', 'textTertiary',
    'link', 'backgroundSecondary', 'borderDefault',
    'feedbackSuccess', 'feedbackWarning', 'feedbackError', 'feedbackInfo',
  ];

  // Summary stats
  const totalTokens = Object.keys(TOKEN_DERIVATION).length;
  const fixedCount = FIXED_VALUES.length;
  const derivedCount = totalTokens - fixedCount;

  return (
    <div className="pb-16 space-y-10">
      {/* Header */}
      <header>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Tools · Token Mapping
        </div>
        <h1 className="text-[32px] leading-[1.15] font-bold text-slate-900 tracking-tight mb-3">
          From 67 tokens to 13 primitives
        </h1>
        <p className="text-slate-600 leading-relaxed max-w-3xl">
          Brand Switcher's "Brands" variable collection publishes <strong>67 semantic
          tokens</strong> (<code className="text-xs font-mono">atom/foreground/*</code>,{' '}
          <code className="text-xs font-mono">atom/background/*</code>,{' '}
          <code className="text-xs font-mono">atom/border/*</code>,{' '}
          <code className="text-xs font-mono">atom/progress-indicator/*</code>). For the
          White-label Portal we compressed that surface to 13 inputs by applying three rules,
          in order: (1) keep one primitive where Brand Switcher already assigns the same hex
          to a group of variables, (2) derive lightened/darkened variants algorithmically,
          (3) hard-code the handful of values that are universally white, black, or
          alpha-black across every Foundations library.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3 max-w-xl">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-2xl font-bold text-slate-900">13</div>
            <div className="text-xs text-slate-500 mt-1">primitive inputs</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-2xl font-bold text-slate-900">{derivedCount}</div>
            <div className="text-xs text-slate-500 mt-1">derived tokens</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-2xl font-bold text-slate-900">{fixedCount}</div>
            <div className="text-xs text-slate-500 mt-1">fixed values</div>
          </div>
        </div>
      </header>

      {/* Legend */}
      <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">Derivation rules</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="bg-white rounded-md p-3 border border-slate-200">
            <code className="font-mono text-slate-700 font-semibold">= primitive</code>
            <p className="text-slate-500 mt-1">Direct use — token value equals the primitive.</p>
          </div>
          <div className="bg-white rounded-md p-3 border border-slate-200">
            <code className="font-mono text-slate-700 font-semibold">lighten(p, X%)</code>
            <p className="text-slate-500 mt-1">Mix with white by X%. Used for alert surfaces.</p>
          </div>
          <div className="bg-white rounded-md p-3 border border-slate-200">
            <code className="font-mono text-slate-700 font-semibold">darken(p, X%)</code>
            <p className="text-slate-500 mt-1">Mix with black by X%. Used for error hover/pressed.</p>
          </div>
          <div className="bg-white rounded-md p-3 border border-slate-200">
            <code className="font-mono text-slate-700 font-semibold">p @ X%</code>
            <p className="text-slate-500 mt-1">Apply alpha at X%. Used for focus rings + muted surfaces.</p>
          </div>
          <div className="bg-white rounded-md p-3 border border-slate-200">
            <code className="font-mono text-slate-700 font-semibold">fixed</code>
            <p className="text-slate-500 mt-1">Hard-coded (white / black-alpha). Not user-editable.</p>
          </div>
        </div>
      </section>

      {/* The 13 primitives, each with their driven tokens */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          The 13 primitives
        </h2>
        {primitiveOrder.map((pk) => {
          const descriptor = PRIMITIVE_DESCRIPTORS[pk];
          const tokens = tokensByPrimitive[pk];
          const compression = COMPRESSION_NOTES[pk];
          const primitiveHex = primitives[pk];

          return (
            <div key={pk} className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              {/* Primitive header */}
              <div className="p-5 border-b border-slate-100 flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-lg border border-slate-200 flex-shrink-0"
                  style={{ backgroundColor: primitiveHex }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-900">{descriptor.label}</h3>
                    <code className="text-xs font-mono text-slate-500">{pk}</code>
                    <code className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {primitiveHex}
                    </code>
                    <span className="text-xs text-slate-500">
                      drives <strong>{tokens.length}</strong> token{tokens.length === 1 ? '' : 's'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">
                    <span className="font-medium text-slate-700">Seen on: </span>
                    {descriptor.seenOn}
                  </p>
                </div>
              </div>

              {/* Compression note */}
              {compression && (
                <div
                  className={[
                    'px-5 py-3 border-b border-slate-100 text-xs flex gap-2',
                    compression.safeInAll
                      ? 'bg-green-50 text-green-800 border-green-100'
                      : 'bg-amber-50 text-amber-900 border-amber-100',
                  ].join(' ')}
                >
                  <span className="flex-shrink-0 mt-0.5">
                    {compression.safeInAll ? '✓' : '⚠'}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium mb-0.5">
                      Brand Switcher compresses {compression.tokens.length} distinct variables
                      {compression.safeInAll ? ' (identical in every brand — safe)' : ' (values diverge in some brands — lossy)'}
                    </div>
                    <div className="font-mono text-[11px] leading-relaxed opacity-90 mb-1">
                      {compression.tokens.join(' · ')}
                    </div>
                    {compression.note && <div className="leading-relaxed">{compression.note}</div>}
                  </div>
                </div>
              )}

              {/* Tokens driven */}
              <div className="divide-y divide-slate-100">
                {tokens.map((tk) => {
                  const rule = TOKEN_DERIVATION[tk];
                  const computedHex = computed[tk];
                  return (
                    <div key={tk} className="px-5 py-2.5 flex items-center gap-3 text-sm hover:bg-slate-50">
                      <div
                        className="w-5 h-5 rounded border border-slate-200 flex-shrink-0"
                        style={{ backgroundColor: computedHex }}
                      />
                      <code className="text-xs font-mono text-slate-800 flex-shrink-0 w-[260px] truncate" title={tk}>
                        {tk.replace('atom.', '')}
                      </code>
                      <code className="text-[11px] font-mono text-indigo-600 flex-shrink-0 w-[180px] truncate">
                        {describeRule(rule)}
                      </code>
                      <code className="text-[11px] font-mono text-slate-500 flex-shrink-0">
                        {computedHex}
                      </code>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* Fixed values */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">
          Fixed values — not user-editable
        </h2>
        <p className="text-sm text-slate-600 mb-4 max-w-3xl">
          These 7 tokens resolve to the same hex in every Brand Switcher mode (all whites, or
          black with fixed alpha for overlays). They're not exposed in the portal because there's
          nothing to customise.
        </p>
        <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
          {FIXED_VALUES.map((f) => (
            <div key={f.token} className="px-5 py-3 flex items-center gap-3 text-sm">
              <div
                className="w-5 h-5 rounded border border-slate-200 flex-shrink-0"
                style={{ backgroundColor: f.value }}
              />
              <code className="text-xs font-mono text-slate-800 flex-shrink-0 w-[320px] truncate">
                {f.token.replace('atom.', '')}
              </code>
              <code className="text-[11px] font-mono text-slate-500 flex-shrink-0 w-[84px]">
                {f.value}
              </code>
              <span className="text-xs text-slate-600 flex-1 min-w-0">{f.note}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
