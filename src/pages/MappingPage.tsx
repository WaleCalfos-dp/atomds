import { useMemo } from 'react';
import { type Brand, type SemanticTokenKey, RESOLVED_SEMANTIC_TOKENS, BRANDS } from '../data/tokens';
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
      'atom.border.default.border-default-brand',
      'atom.border.selection-and-focus.border-primary-focus',
      'atom.border.selection-and-focus.border-selected',
      'atom.border.selection-and-focus.border-brand-hover',
    ],
    safeInAll: false,
    note:
      'In Assurant, fg-brand-primary (#01194d) differs from bg-primary-default (#103265) — the darker shade is used for text, the mid shade for surfaces. The portal compresses both to brandPrimary. Assurant’s distinction is lost; re-introduce by editing the exported CSS for the two tokens.',
  },
  accent: {
    tokens: ['atom.background.core.bg-accent'],
    safeInAll: false,
    note:
      'Promoted to its own primitive in v2 — DragonPass uses #d53f34 (red), Investec #c1803d (gold), and Assurant #fcc166 (gold) as decorative accents that are deliberately distinct from brandPrimary. Earlier the portal collapsed bg-accent into brandPrimary, which gave the worst fidelity gap (avg RGB error ~212 across the 6 brands).',
  },
};

// ─── Fixed values ────────────────────────────────────────────────────────────
// TOKEN_DERIVATION flags 9 tokens as { kind: 'fixed' }, but a Brand Switcher
// audit (April 2026) confirmed only 5 actually resolve to the same hex in
// every built-in brand. The other 4 ship per-mode overrides in Figma — the
// portal still uses a single sensible default, but we surface the per-brand
// overrides below so the trade-off is explicit.
type FixedNote = { token: SemanticTokenKey; value: string; note: string };

const FIXED_VALUES: FixedNote[] = (Object.keys(TOKEN_DERIVATION) as SemanticTokenKey[])
  .filter((k) => TOKEN_DERIVATION[k].kind === 'fixed')
  .map((token) => {
    const rule = TOKEN_DERIVATION[token] as Extract<TokenRule, { kind: 'fixed' }>;
    return { token, value: rule.value, note: rule.note };
  });

// Tokens that genuinely resolve to the same hex in every built-in brand.
const UNIVERSAL_FIXED: SemanticTokenKey[] = [
  'atom.foreground.primary.fg-brand-primary-inverse',
  'atom.foreground.states.fg-disabled-inverse',
  'atom.foreground.states.fg-pressed-inverse',
  'atom.background.primary.bg-primary-inverse',
  'atom.progress-indicator.active-color',
];

// Tokens the portal treats as fixed, but Brand Switcher actually varies per mode.
const VARIES_PER_BRAND: SemanticTokenKey[] = [
  'atom.background.primary.bg-primary-hover-inverse',
  'atom.background.core.bg-overlay',
  'atom.border.default.border-muted',
  'atom.border.states.no-interaction',
];

const UNIVERSAL_FIXED_VALUES = FIXED_VALUES.filter((f) => UNIVERSAL_FIXED.includes(f.token));
const VARIES_PER_BRAND_VALUES = FIXED_VALUES.filter((f) => VARIES_PER_BRAND.includes(f.token));

// Only built-in brands — 'custom' shadows DragonPass, so skip it.
const BUILTIN_BRANDS = BRANDS.filter((b) => b.id !== 'custom');

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
      brandPrimary: [], brandHover: [], brandPressed: [], accent: [],
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
    'brandPrimary', 'brandHover', 'brandPressed', 'accent',
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
          From 67 tokens to 14 primitives
        </h1>
        <p className="text-slate-600 leading-relaxed max-w-3xl">
          Brand Switcher's "Brands" variable collection publishes <strong>67 semantic
          tokens</strong> (<code className="text-xs font-mono">atom/foreground/*</code>,{' '}
          <code className="text-xs font-mono">atom/background/*</code>,{' '}
          <code className="text-xs font-mono">atom/border/*</code>,{' '}
          <code className="text-xs font-mono">atom/progress-indicator/*</code>). For the
          White-label Portal we compressed that surface to 14 inputs by applying three rules,
          in order: (1) keep one primitive where Brand Switcher already assigns the same hex
          to a group of variables, (2) derive lightened/darkened variants algorithmically,
          (3) hard-code the handful of values that are universally white, black, or
          alpha-black across every Foundations library.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3 max-w-xl">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-2xl font-bold text-slate-900">14</div>
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="bg-white rounded-md p-3 border border-slate-200">
            <code className="font-mono text-slate-700 font-semibold">= primitive</code>
            <p className="text-slate-500 mt-1">Direct use — token value equals the primitive.</p>
          </div>
          <div className="bg-white rounded-md p-3 border border-slate-200">
            <code className="font-mono text-slate-700 font-semibold">p @ OKLCH L=N</code>
            <p className="text-slate-500 mt-1">Set perceptual lightness to N (0..1) preserving hue + chroma. Used for alert tints so all 4 feedback families look balanced.</p>
          </div>
          <div className="bg-white rounded-md p-3 border border-slate-200">
            <code className="font-mono text-slate-700 font-semibold">lighten(p, X%) / darken(p, X%)</code>
            <p className="text-slate-500 mt-1">HSL mix toward white / black. Used for hover &amp; pressed states.</p>
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

      {/* Rules of application — when component authors should reach for which token */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Rules of application
        </h2>
        <p className="text-sm text-slate-600 max-w-3xl">
          Most "weird-looking" custom-brand renders trace back to a token used in
          the wrong tier — e.g. a Badge built on <code className="text-xs font-mono">bg-success-lightest</code>{' '}
          instead of <code className="text-xs font-mono">bg-success-light</code> reads as a faint blob
          on white surfaces. These rules document where each token belongs.
        </p>

        {/* Tier guidance */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">Tier guidance — when to use which background</h3>
            <p className="text-xs text-slate-500 mt-0.5">The 4 feedback families each ship 3 tiers. Pick by visual weight, not by hue.</p>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 w-[20%]">Tier</th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 w-[40%]">Use for</th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 w-[40%]">Don't use for</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="px-4 py-3"><code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded">bg-*-full</code></td>
                <td className="px-4 py-3 text-slate-700">Solid feedback fills — Toast solid bg, success Badge with white text, Destructive button.</td>
                <td className="px-4 py-3 text-slate-500">Body text — contrast varies across brands; pair with white only.</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-4 py-3"><code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded">bg-*-light / bg-*-default</code></td>
                <td className="px-4 py-3 text-slate-700">Alert containers with title + body text. Calibrated to OKLCH L=0.92 — always readable for body copy.</td>
                <td className="px-4 py-3 text-slate-500">Compact UI like Badge — too prominent at small sizes.</td>
              </tr>
              <tr>
                <td className="px-4 py-3"><code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded">bg-*-lightest</code></td>
                <td className="px-4 py-3 text-slate-700">Subtle row tinting, callout backgrounds, hover overlays on coloured rows. OKLCH L=0.96 — very subtle wash.</td>
                <td className="px-4 py-3 text-slate-500">Standalone Badge backgrounds — too faint to read as a chip.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Surface pairings */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">Surface pairings — which fg goes with which bg</h3>
            <p className="text-xs text-slate-500 mt-0.5">Mismatched fg/bg pairs are the #1 cause of low-contrast rendering. Use these defaults.</p>
          </div>
          <ul className="divide-y divide-slate-100 text-sm">
            <li className="px-5 py-2.5 flex items-baseline gap-3">
              <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">bg-primary-default</code>
              <span className="text-slate-400">⇄</span>
              <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">fg-brand-primary-inverse</code>
              <span className="text-slate-500 text-xs">white text on solid brand surface</span>
            </li>
            <li className="px-5 py-2.5 flex items-baseline gap-3">
              <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">bg-primary-inverse</code>
              <span className="text-slate-400">⇄</span>
              <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">fg-primary</code>
              <span className="text-slate-500 text-xs">body text — or fg-brand-primary for emphasis</span>
            </li>
            <li className="px-5 py-2.5 flex items-baseline gap-3 flex-wrap">
              <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">bg-{'{success,warning,error,info}'}-{'{light,lightest}'}</code>
              <span className="text-slate-400">⇄</span>
              <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">fg-primary</code>
              <span className="text-slate-500 text-xs">body copy — pair with fg-{'{success/warning/...}'} only for icons + accents</span>
            </li>
            <li className="px-5 py-2.5 flex items-baseline gap-3">
              <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">bg-muted</code>
              <span className="text-slate-400">⇄</span>
              <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">fg-primary</code>
              <span className="text-slate-500 text-xs">subtle hover/pressed wash — only over white surfaces</span>
            </li>
            <li className="px-5 py-2.5 flex items-baseline gap-3">
              <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">bg-overlay</code>
              <span className="text-slate-400">⇄</span>
              <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">fg-brand-primary-inverse</code>
              <span className="text-slate-500 text-xs">modal scrim only — never put body copy on the overlay itself</span>
            </li>
          </ul>
        </div>

        {/* Fidelity warning */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 leading-relaxed">
          <strong className="block text-sm mb-1">⚠ Fidelity warning</strong>
          Simple-mode derivation approximates Brand Switcher's hand-curated tints. For brand
          primaries with very high chroma (vibrant pinks, purples, oranges &gt; ~70% saturation),
          the OKLCH-derived <code className="font-mono">bg-*-lightest</code> tints stay perceptually balanced
          but may not exactly match the values a designer would pick. <strong>Switch to Full mode
          and override per-token</strong> if you need exact alignment with a real Foundations library
          (e.g. matching Mastercard's specific shade of warning yellow). Full mode bypasses
          derivation entirely — what you type is what ships.
        </div>
      </section>

      {/* The 13 primitives, each with their driven tokens */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          The 14 primitives
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
      <section className="space-y-6">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">
            Fixed values — not user-editable
          </h2>
          <p className="text-sm text-slate-600 mb-4 max-w-3xl">
            9 tokens aren't driven by any primitive. <strong>5</strong> are genuinely
            universal — every brand resolves them to the same hex. The other{' '}
            <strong>4</strong> are "mostly fixed": the portal uses a single sensible
            default, but Brand Switcher ships per-mode overrides you'll see in the live
            Atom library. If the defaults don't match a custom brand, override them in
            the exported CSS.
          </p>
        </div>

        {/* Universally fixed */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
            Universal across all 6 brands ({UNIVERSAL_FIXED_VALUES.length})
          </h3>
          <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
            {UNIVERSAL_FIXED_VALUES.map((f) => (
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
        </div>

        {/* Mostly fixed — varies per brand */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
            Mostly fixed — varies per brand ({VARIES_PER_BRAND_VALUES.length})
          </h3>
          <p className="text-xs text-slate-500 mb-3 max-w-3xl">
            The portal ships the default hex shown on the left. The 6 swatches below
            each row show what Brand Switcher actually resolves the token to for each
            built-in brand — swatches with a dashed amber border are brand-specific
            overrides that differ from the portal default.
          </p>
          <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
            {VARIES_PER_BRAND_VALUES.map((f) => (
              <div key={f.token} className="px-5 py-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
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
                  <span className="text-xs text-slate-600 flex-1 min-w-0">Portal default</span>
                </div>
                <div className="pl-8 grid grid-cols-6 gap-2">
                  {BUILTIN_BRANDS.map((b) => {
                    const resolved = RESOLVED_SEMANTIC_TOKENS[b.id][f.token];
                    const differs = resolved.toLowerCase() !== f.value.toLowerCase();
                    return (
                      <div key={b.id} className="flex flex-col gap-1">
                        <div
                          className={[
                            'h-8 rounded flex-shrink-0',
                            differs
                              ? 'border-2 border-dashed border-amber-400'
                              : 'border border-slate-200',
                          ].join(' ')}
                          style={{ backgroundColor: resolved }}
                          title={`${b.label}: ${resolved}`}
                        />
                        <div className="text-[10px] text-slate-500 truncate">{b.label}</div>
                        <code className="text-[10px] font-mono text-slate-400 truncate">
                          {resolved}
                        </code>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
