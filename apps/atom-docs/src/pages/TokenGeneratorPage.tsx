import { useMemo, useState } from 'react';
import { type Brand } from '@atom-core/tokens/tokens';
import { type Language } from '../data/languages';
import {
  generateBrandTokens,
  type BrandSeeds,
  type SemanticTokenKey,
} from '@atom-core/tokenGenerator/generate-brand-tokens';
import { ATOM_TOKEN_MAP } from '@atom-core/tokenGenerator/atom-token-map';
import { STOPS } from '@atom-core/tokenGenerator/reference-palette';

interface TokenGeneratorPageProps {
  brand: Brand;
  lang?: Language;
}

const DRAGONPASS_SEEDS: BrandSeeds = {
  primary: '#006b99',
  secondary: '#d53f34',
  neutral: '#737272',
  success: '#17b26a',
  warning: '#fcbc2c',
  error: '#e02d3c',
};

const SEED_META: Array<{
  key: keyof BrandSeeds;
  label: string;
  caption: string;
  anchor: string;
}> = [
  { key: 'primary',   label: 'Primary',   caption: 'Brand interactive colour', anchor: 'Primary.600' },
  { key: 'secondary', label: 'Secondary', caption: 'Brand accent',             anchor: 'Secondary.500' },
  { key: 'neutral',   label: 'Neutral',   caption: 'Mid grey for text + UI',   anchor: 'Neutral.500' },
  { key: 'success',   label: 'Success',   caption: 'Positive feedback',        anchor: 'Success.500' },
  { key: 'warning',   label: 'Warning',   caption: 'Caution feedback',         anchor: 'Warning.500' },
  { key: 'error',     label: 'Error',     caption: 'Negative feedback',        anchor: 'Error.500' },
];

const FAMILIES = ['Primary', 'Secondary', 'Neutral', 'Error', 'Success', 'Warning', 'Info', 'Tertiary'] as const;
const NEUTRAL_KEYS = [
  'colors.Neutral.50', 'colors.Neutral.100', 'colors.Neutral.200', 'colors.Neutral.300',
  'colors.Neutral.400', 'colors.Neutral.500', 'colors.Neutral.600', 'colors.Neutral.700',
  'colors.Neutral.800', 'colors.Neutral.900', 'colors.Neutral.white', 'colors.Neutral.black',
];
const OPACITY_KEYS = [
  'colors.Opacity.4%',  'colors.Opacity.8%',  'colors.Opacity.10%', 'colors.Opacity.20%',
  'colors.Opacity.40%', 'colors.Opacity.60%', 'colors.Opacity.80%', 'colors.Opacity.90%',
];

// Group atom tokens by category for the output panel.
const TOKEN_GROUPS: Array<{ heading: string; prefix: string }> = [
  { heading: 'Foreground · Core',                prefix: 'atom.foreground.core.' },
  { heading: 'Foreground · Brand',               prefix: 'atom.foreground.primary.' },
  { heading: 'Foreground · Feedback',            prefix: 'atom.foreground.feedback.' },
  { heading: 'Foreground · States',              prefix: 'atom.foreground.states.' },
  { heading: 'Background · Brand',               prefix: 'atom.background.primary.' },
  { heading: 'Background · Core',                prefix: 'atom.background.core.' },
  { heading: 'Background · Alert',               prefix: 'atom.background.alert.' },
  { heading: 'Border · Default',                 prefix: 'atom.border.default.' },
  { heading: 'Border · States',                  prefix: 'atom.border.states.' },
  { heading: 'Border · Selection & Focus',       prefix: 'atom.border.selection-and-focus.' },
  { heading: 'Border · Feedback',                prefix: 'atom.border.feedback.' },
  { heading: 'Progress',                         prefix: 'atom.progress-indicator.' },
];

export function TokenGeneratorPage(_props: TokenGeneratorPageProps) {
  const [seeds, setSeeds] = useState<BrandSeeds>(DRAGONPASS_SEEDS);
  const [error, setError] = useState<string | null>(null);
  const [openPrimitives, setOpenPrimitives] = useState(true);
  const [openMapping, setOpenMapping] = useState(false);
  const [openLogic, setOpenLogic] = useState(true);

  const result = useMemo(() => {
    try {
      setError(null);
      return generateBrandTokens(seeds);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      return null;
    }
  }, [seeds]);

  const updateSeed = (key: keyof BrandSeeds, value: string) => {
    const v = value.trim().toLowerCase();
    if (v.length === 0) {
      setSeeds((s) => ({ ...s, [key]: '#000000' }));
      return;
    }
    const normalised = v.startsWith('#') ? v : `#${v}`;
    setSeeds((s) => ({ ...s, [key]: normalised }));
  };

  const reset = () => setSeeds(DRAGONPASS_SEEDS);

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium tracking-wide uppercase mb-4">
          Tools · Token Generator
        </div>
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight mb-3">
          Generate the Atom palette from 6 seed colours
        </h1>
        <p className="text-slate-600 text-base leading-relaxed max-w-3xl">
          Provide 6 hex codes — one per colour family — and watch the generator produce all
          90 primitives (8 ramps × 10 stops + opacities) and the 67 atom semantic tokens
          consumed by Atom components. Defaults to the dragonpass anchors, which the
          generator reproduces byte-for-byte against the source-of-truth JSON.
        </p>
      </div>

      {/* Inputs */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Seed colours</h2>
          <button
            onClick={reset}
            className="text-xs px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Reset to dragonpass
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SEED_META.map((m) => (
            <SeedInput
              key={m.key}
              label={m.label}
              caption={m.caption}
              anchor={m.anchor}
              value={seeds[m.key]}
              onChange={(v) => updateSeed(m.key, v)}
            />
          ))}
        </div>
        {error && (
          <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
            <strong>Could not generate:</strong> {error}. Use a valid 6-character hex like <code>#0a2333</code>.
          </div>
        )}
      </section>

      {/* Atom tokens output */}
      {result && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Generated atom tokens
              <span className="ml-2 text-sm font-normal text-slate-500">67 tokens</span>
            </h2>
          </div>
          <div className="space-y-6">
            {TOKEN_GROUPS.map((g) => {
              const tokens = (Object.keys(ATOM_TOKEN_MAP) as SemanticTokenKey[]).filter((k) =>
                k.startsWith(g.prefix),
              );
              if (tokens.length === 0) return null;
              return (
                <div key={g.prefix}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    {g.heading}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
                    {tokens.map((tk) => (
                      <TokenRow
                        key={tk}
                        tokenKey={tk}
                        primitiveKey={ATOM_TOKEN_MAP[tk]}
                        hex={result.resolvedSemanticTokens[tk]}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Primitives output */}
      {result && (
        <section className="mb-10">
          <button
            onClick={() => setOpenPrimitives((v) => !v)}
            className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-4 hover:text-slate-700 transition-colors"
          >
            <Caret open={openPrimitives} />
            Generated primitives
            <span className="text-sm font-normal text-slate-500">90 colours</span>
          </button>
          {openPrimitives && (
            <div className="space-y-6">
              {FAMILIES.filter((f) => f !== 'Neutral').map((f) => (
                <FamilyRamp key={f} family={f} palette={result.resolvedPalette} />
              ))}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Neutral (10 stops + white + black)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {NEUTRAL_KEYS.map((k) => (
                    <Swatch
                      key={k}
                      hex={result.resolvedPalette[k]}
                      label={k.replace('colors.Neutral.', '')}
                    />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Opacity overlays (8 alpha levels)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {OPACITY_KEYS.map((k) => (
                    <OpacitySwatch
                      key={k}
                      hex={result.resolvedPalette[k]}
                      label={k.replace('colors.Opacity.', '')}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Logic explainer */}
      <section className="mb-10">
        <button
          onClick={() => setOpenLogic((v) => !v)}
          className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-4 hover:text-slate-700 transition-colors"
        >
          <Caret open={openLogic} />
          How the logic works
        </button>
        {openLogic && (
          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
            <p>
              The system has <strong>4 steps</strong>. Walk through them in plain English:
            </p>
            <div className="space-y-3">
              <Step
                num={1}
                title="Generate 10 shades per seed"
                body={
                  <>
                    Imagine a painter mixing paint for ten labelled cans. Can <code>500</code>{' '}
                    (or <code>600</code> for Primary) is the brand's pure colour, exactly as you
                    provided it. Lighter cans add white; darker cans add black. The recipe says how
                    much lightening or darkening to apply at each step. The recipe is{' '}
                    <em>fixed</em> — every brand uses the same one — so a Primary <code>100</code>{' '}
                    always feels equally light, whether it's dragonpass blue or Mastercard orange.
                    The maths uses OKLCH (a perceptual colour space — like HSL but better).
                  </>
                }
              />
              <Step
                num={2}
                title="Reuse two ramps as derived families"
                body={
                  <>
                    <code>Info</code> is identical to <code>Primary</code>. <code>Tertiary</code>{' '}
                    is identical to <code>Secondary</code>. No transformation, no extra seed —
                    just direct reuse.
                  </>
                }
              />
              <Step
                num={3}
                title="Build the opacity overlays"
                body={
                  <>
                    Eight semi-transparent shades from two base colours: <em>brand-ink</em>{' '}
                    (Primary.900) for soft hover/focus tints (4% to 90%), and{' '}
                    <em>neutral-black</em> for modal scrims and muted borders (40%, 80%).
                  </>
                }
              />
              <Step
                num={4}
                title="Resolve 67 atom tokens via the universal mapping"
                body={
                  <>
                    Every atom token points to one position in one family — and the mapping is the
                    same for every brand. <code>fg-primary</code> is always <code>Neutral.700</code>;{' '}
                    <code>bg-primary-default</code> is always <code>Primary.900</code>;{' '}
                    <code>fg-success</code> is always <code>Success.700</code>. See the table below
                    for all 67.
                  </>
                }
              />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-md p-4 mt-6">
              <p className="text-sm">
                <strong>Why 6 seeds, not fewer?</strong> Neutral can't be auto-derived from Primary
                because dragonpass Neutral is a hue-free pure grey; auto-desaturating Primary would
                produce a cool grey, drifting from intent. Error and Secondary are visually similar
                reds but used in distinct semantic contexts (danger vs. accent), so they stay
                separate.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-md p-4">
              <p className="text-sm">
                <strong>Why 6 seeds, not more?</strong> In dragonpass{' '}
                <code>Info ramp = Primary ramp</code> and <code>Tertiary ramp = Secondary ramp</code>{' '}
                — verified line-by-line in the source JSON. The universal recipe enforces this for
                every brand going forward.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Atom token mapping table */}
      <section className="mb-12">
        <button
          onClick={() => setOpenMapping((v) => !v)}
          className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-4 hover:text-slate-700 transition-colors"
        >
          <Caret open={openMapping} />
          Atom token mapping
          <span className="text-sm font-normal text-slate-500">
            {Object.keys(ATOM_TOKEN_MAP).length} rows
          </span>
        </button>
        {openMapping && (
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Atom token</th>
                  <th className="text-left px-4 py-2 font-medium">Primitive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(Object.keys(ATOM_TOKEN_MAP) as SemanticTokenKey[]).map((k) => (
                  <tr key={k} className="hover:bg-slate-50">
                    <td className="px-4 py-2 font-mono text-xs text-slate-700">{k}</td>
                    <td className="px-4 py-2 font-mono text-xs text-slate-500">{ATOM_TOKEN_MAP[k]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function SeedInput({
  label,
  caption,
  anchor,
  value,
  onChange,
}: {
  label: string;
  caption: string;
  anchor: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-medium text-slate-900">{label}</span>
        <span className="text-xs text-slate-400 font-mono">{anchor}</span>
      </div>
      <div className="flex items-stretch gap-2 border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-400 transition-colors bg-white">
        <input
          type="color"
          value={isHex(value) ? value : '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 cursor-pointer border-0 p-0 m-0 bg-transparent"
          aria-label={`${label} colour picker`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-2 text-sm font-mono outline-none bg-transparent"
          spellCheck={false}
          maxLength={9}
        />
      </div>
      <p className="text-xs text-slate-500 mt-1">{caption}</p>
    </label>
  );
}

function TokenRow({
  tokenKey,
  primitiveKey,
  hex,
}: {
  tokenKey: SemanticTokenKey;
  primitiveKey: string;
  hex: string;
}) {
  return (
    <button
      onClick={() => navigator.clipboard?.writeText(hex)}
      className="flex items-center gap-3 py-1 text-left group"
      title={`Click to copy ${hex}`}
    >
      <span
        className="block w-5 h-5 rounded-sm border border-slate-200 flex-shrink-0"
        style={{ backgroundColor: hex }}
      />
      <span className="flex-1 min-w-0">
        <span className="block text-xs text-slate-700 font-mono truncate group-hover:text-slate-900">
          {tokenKey.replace('atom.', '')}
        </span>
        <span className="block text-[10px] text-slate-400 font-mono truncate">
          {primitiveKey} · {hex}
        </span>
      </span>
    </button>
  );
}

function FamilyRamp({
  family,
  palette,
}: {
  family: string;
  palette: Record<string, string>;
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
        {family}
      </h3>
      <div className="flex flex-wrap gap-2">
        {STOPS.map((s) => {
          const key = `colors.${family}.${s}`;
          const hex = palette[key];
          if (!hex) return null;
          return <Swatch key={key} hex={hex} label={String(s)} />;
        })}
      </div>
    </div>
  );
}

function Swatch({ hex, label }: { hex: string; label: string }) {
  return (
    <button
      onClick={() => navigator.clipboard?.writeText(hex)}
      className="flex flex-col items-stretch w-20 group"
      title={`Click to copy ${hex}`}
    >
      <span
        className="h-12 rounded-t-md border border-slate-200 transition-transform group-hover:scale-[1.02]"
        style={{ backgroundColor: hex }}
      />
      <span className="block px-2 py-1 bg-slate-50 rounded-b-md border border-t-0 border-slate-200 text-[10px] text-slate-600 font-mono truncate text-left">
        <span className="block font-semibold text-slate-700">{label}</span>
        <span className="block text-slate-400">{hex}</span>
      </span>
    </button>
  );
}

function OpacitySwatch({ hex, label }: { hex: string; label: string }) {
  return (
    <button
      onClick={() => navigator.clipboard?.writeText(hex)}
      className="flex flex-col items-stretch w-24 group"
      title={`Click to copy ${hex}`}
    >
      <span
        className="h-12 rounded-t-md border border-slate-200 transition-transform group-hover:scale-[1.02] bg-checker"
        style={{
          backgroundImage:
            `linear-gradient(${hex}, ${hex}), repeating-conic-gradient(#cbd5e1 0% 25%, #fff 0% 50%) 50% / 12px 12px`,
        }}
      />
      <span className="block px-2 py-1 bg-slate-50 rounded-b-md border border-t-0 border-slate-200 text-[10px] text-slate-600 font-mono truncate text-left">
        <span className="block font-semibold text-slate-700">{label}</span>
        <span className="block text-slate-400">{hex}</span>
      </span>
    </button>
  );
}

function Caret({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}
    >
      <path
        d="M3 1.5l4 3.5-4 3.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Step({ num, title, body }: { num: number; title: string; body: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-semibold flex items-center justify-center">
        {num}
      </span>
      <div>
        <h4 className="text-base font-semibold text-slate-900 mb-1">{title}</h4>
        <p className="text-sm">{body}</p>
      </div>
    </div>
  );
}

function isHex(s: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(s);
}
