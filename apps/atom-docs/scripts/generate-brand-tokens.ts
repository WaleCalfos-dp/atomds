// The brand token generator. Takes 6 seed colours and emits the full
// primitive palette + 67 resolved atom tokens. Same recipe for every brand.
//
// Algorithm: for each family, if the seed equals the reference anchor we
// emit the dragonpass primitives byte-for-byte. Otherwise we transform in
// OKLCH — keep each stop's lightness, scale chroma proportional to the
// seed/anchor ratio, rotate hue by the seed-vs-anchor delta. This preserves
// the *shape* of each ramp while adopting the brand's hue.

import { oklch, formatHex, clampChroma, type Oklch } from 'culori';
import {
  ANCHOR_STOPS,
  ALPHA_HEX,
  ALPHA_PERCENTS,
  OPACITY_BASE,
  REFERENCE_ERROR,
  REFERENCE_NEUTRAL,
  REFERENCE_PRIMARY,
  REFERENCE_SECONDARY,
  REFERENCE_SUCCESS,
  REFERENCE_WARNING,
  STOPS,
  type AlphaPercent,
  type Family,
  type NeutralRamp,
  type RampOnly,
  type Stop,
} from './reference-palette.ts';
import { ATOM_TOKEN_MAP } from './atom-token-map.ts';
import type { SemanticTokenKey } from '../src/data/tokens.ts';

export interface BrandSeeds {
  primary: string;
  secondary: string;
  neutral: string;
  success: string;
  warning: string;
  error: string;
}

export interface GeneratedTokens {
  resolvedPalette: Record<string, string>;
  resolvedSemanticTokens: Record<SemanticTokenKey, string>;
}

const NEAR_GREY_CHROMA_THRESHOLD = 0.005;

export function generateBrandTokens(
  seeds: BrandSeeds,
  primitiveOverrides: Partial<Record<string, string>> = {},
): GeneratedTokens {
  // Step 1 — generate the six seeded ramps.
  const primary = generateRamp(seeds.primary, REFERENCE_PRIMARY, ANCHOR_STOPS.Primary);
  const secondary = generateRamp(seeds.secondary, REFERENCE_SECONDARY, ANCHOR_STOPS.Secondary);
  const neutral = generateNeutralRamp(seeds.neutral);
  const success = generateRamp(seeds.success, REFERENCE_SUCCESS, ANCHOR_STOPS.Success);
  const warning = generateRamp(seeds.warning, REFERENCE_WARNING, ANCHOR_STOPS.Warning);
  const error = generateRamp(seeds.error, REFERENCE_ERROR, ANCHOR_STOPS.Error);

  // Step 2 — derived families: Info mirrors Primary, Tertiary mirrors Secondary.
  const info = primary;
  const tertiary = secondary;

  // Flatten ramps into the primitive palette (matches the JSON's `colors.Family.Stop` shape).
  const resolvedPalette: Record<string, string> = {
    ...flattenRamp('Primary', primary),
    ...flattenRamp('Secondary', secondary),
    ...flattenNeutral(neutral),
    ...flattenRamp('Error', error),
    ...flattenRamp('Success', success),
    ...flattenRamp('Warning', warning),
    ...flattenRamp('Info', info),
    ...flattenRamp('Tertiary', tertiary),
  };

  // Step 3 — opacity overlays. Brand-ink base = Primary.900 (post-generation),
  // neutral-black base = #000000.
  const brandInkBase = primary[900];
  const neutralBlackBase = neutral.black;
  for (const alpha of ALPHA_PERCENTS) {
    const base = OPACITY_BASE[alpha] === 'brand-ink' ? brandInkBase : neutralBlackBase;
    resolvedPalette[`colors.Opacity.${alpha}`] = `${base}${ALPHA_HEX[alpha]}`;
  }

  // Step 4 — apply optional primitive overrides (escape hatch for hand-tuned brand fixes).
  for (const [key, value] of Object.entries(primitiveOverrides)) {
    if (value !== undefined) resolvedPalette[key] = normaliseHex(value);
  }

  // Step 5 — resolve the 67 atom tokens via the universal mapping table.
  const resolvedSemanticTokens = {} as Record<SemanticTokenKey, string>;
  for (const [tokenKey, primitiveKey] of Object.entries(ATOM_TOKEN_MAP) as [
    SemanticTokenKey,
    string,
  ][]) {
    const value = resolvedPalette[primitiveKey];
    if (value === undefined) {
      throw new Error(
        `Atom token "${tokenKey}" maps to primitive "${primitiveKey}" which was not produced by the generator. ` +
          `Check ATOM_TOKEN_MAP for typos.`,
      );
    }
    resolvedSemanticTokens[tokenKey] = value;
  }

  return { resolvedPalette, resolvedSemanticTokens };
}

// Generate a 10-stop ramp by transforming the reference ramp in OKLCH space.
// Hue is rotated by (seed.h − refAnchor.h); chroma is scaled by (seed.c / refAnchor.c);
// lightness per-stop is preserved from the reference (so light stops stay light, dark stays dark).
function generateRamp(seedHex: string, reference: RampOnly, anchorStop: Stop): RampOnly {
  const seed = normaliseHex(seedHex);
  const refAnchor = reference[anchorStop];

  // Fast path — seed equals dragonpass anchor for this family. Emit reference verbatim.
  if (seed === refAnchor) return { ...reference };

  const refAnchorOklch = oklch(refAnchor);
  const seedOklch = oklch(seed);
  if (!refAnchorOklch || !seedOklch) {
    throw new Error(`Could not parse colour: refAnchor="${refAnchor}", seed="${seed}"`);
  }

  const seedC = seedOklch.c ?? 0;
  const refAnchorC = refAnchorOklch.c ?? 0;
  const seedH = seedOklch.h ?? 0;
  const refAnchorH = refAnchorOklch.h ?? 0;

  // Guard against near-grey reference anchors (Neutral is handled separately,
  // but other families could in theory be seeded with a near-grey).
  const cScale = refAnchorC < NEAR_GREY_CHROMA_THRESHOLD
    ? 1
    : seedC / refAnchorC;
  const dH = seedH - refAnchorH;

  const out = {} as RampOnly;
  for (const stop of STOPS) {
    const refStopOklch = oklch(reference[stop]);
    if (!refStopOklch) {
      throw new Error(`Could not parse reference colour at stop ${stop}: ${reference[stop]}`);
    }
    const refStopC = refStopOklch.c ?? 0;
    const refStopH = refStopOklch.h ?? 0;

    const target: Oklch = {
      mode: 'oklch',
      l: refStopOklch.l,
      c: refStopC * cScale,
      h: normaliseHue(refStopH + dH),
    };
    const inGamut = clampChroma(target, 'oklch');
    out[stop] = lower(formatHex(inGamut));
  }
  return out;
}

// Neutral has the same shape as a regular ramp plus white + black constants.
// White and black are NEVER seeded — they're universal anchors.
function generateNeutralRamp(seedHex: string): NeutralRamp {
  const seed = normaliseHex(seedHex);
  const refAnchor = REFERENCE_NEUTRAL[ANCHOR_STOPS.Neutral];

  if (seed === refAnchor) {
    return { ...REFERENCE_NEUTRAL };
  }

  const refAnchorOklch = oklch(refAnchor);
  const seedOklch = oklch(seed);
  if (!refAnchorOklch || !seedOklch) {
    throw new Error(`Could not parse Neutral colour: refAnchor="${refAnchor}", seed="${seed}"`);
  }

  const seedC = seedOklch.c ?? 0;
  const refAnchorC = refAnchorOklch.c ?? 0;
  const seedH = seedOklch.h ?? 0;
  const refAnchorH = refAnchorOklch.h ?? 0;

  // Reference Neutral.500 is essentially achromatic. If both seed and reference
  // are near-grey, keep the reference chroma; otherwise treat the seed's chroma
  // as an additive tint applied uniformly across the ramp.
  const seedIsGrey = seedC < NEAR_GREY_CHROMA_THRESHOLD;
  const refIsGrey = refAnchorC < NEAR_GREY_CHROMA_THRESHOLD;

  const out = { ...REFERENCE_NEUTRAL };
  for (const stop of STOPS) {
    const refStopOklch = oklch(REFERENCE_NEUTRAL[stop]);
    if (!refStopOklch) continue;
    const refStopC = refStopOklch.c ?? 0;
    const refStopH = refStopOklch.h ?? 0;

    let l = refStopOklch.l;
    let c: number;
    let h: number;

    if (seedIsGrey) {
      // Seed is grey too — keep ramp pure-grey verbatim.
      c = refStopC;
      h = refStopH;
    } else if (refIsGrey) {
      // Tint a grey reference with the seed's hue at modest chroma (10% of seed C).
      c = seedC * 0.1;
      h = seedH;
    } else {
      const cScale = seedC / refAnchorC;
      c = refStopC * cScale;
      h = normaliseHue(refStopH + (seedH - refAnchorH));
    }

    const target: Oklch = { mode: 'oklch', l, c, h };
    out[stop] = lower(formatHex(clampChroma(target, 'oklch')));
  }
  // White and black stay constant — they're not part of the ramp.
  out.white = '#ffffff';
  out.black = '#000000';
  return out;
}

function flattenRamp(family: Exclude<Family, 'Neutral'>, ramp: RampOnly): Record<string, string> {
  const out: Record<string, string> = {};
  for (const stop of STOPS) out[`colors.${family}.${stop}`] = ramp[stop];
  return out;
}

function flattenNeutral(ramp: NeutralRamp): Record<string, string> {
  const out: Record<string, string> = {};
  for (const stop of STOPS) out[`colors.Neutral.${stop}`] = ramp[stop];
  out['colors.Neutral.white'] = ramp.white;
  out['colors.Neutral.black'] = ramp.black;
  return out;
}

function normaliseHex(hex: string): string {
  return lower(hex.trim());
}

function normaliseHue(h: number): number {
  const m = h % 360;
  return m < 0 ? m + 360 : m;
}

function lower(s: string): string {
  return s.toLowerCase();
}

// Re-export so the validator and demos don't need to import from culori directly.
export { ATOM_TOKEN_MAP } from './atom-token-map.ts';
export type { SemanticTokenKey } from '../src/data/tokens.ts';
