// Dragonpass primitive palette — the reference data the generator uses.
//
// Verbatim copy of `resolvedPalette.Dragonpass` from
// `scripts/raw/brand-switcher-variables.json` (lines 16–107). Treated as the
// "canonical recipe": when a brand's seed equals the anchor stop in this
// palette, the generator emits this palette byte-for-byte. For other seeds,
// the generator transforms in OKLCH using these values as the reference shape.

export type Family =
  | 'Primary'
  | 'Secondary'
  | 'Neutral'
  | 'Error'
  | 'Success'
  | 'Warning'
  | 'Info'
  | 'Tertiary';

export type Stop = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type NeutralExtra = 'white' | 'black';
export type AlphaPercent = '4%' | '8%' | '10%' | '20%' | '40%' | '60%' | '80%' | '90%';

export type FamilyKey =
  | `colors.${Exclude<Family, 'Neutral'>}.${Stop}`
  | `colors.Neutral.${Stop | NeutralExtra}`
  | `colors.Opacity.${AlphaPercent}`;

export type RampOnly = Record<Stop, string>;
export type NeutralRamp = Record<Stop | NeutralExtra, string>;
export type OpacityRamp = Record<AlphaPercent, string>;

export const STOPS: Stop[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
export const ALPHA_PERCENTS: AlphaPercent[] = ['4%', '8%', '10%', '20%', '40%', '60%', '80%', '90%'];

// The seed anchor stop per family — what a brand designer's seed colour represents.
// Primary anchored at 600 because dragonpass's signature interactive blue (#006b99)
// sits there. Other families anchor at 500 (the conventional "main" stop).
export const ANCHOR_STOPS: Record<Exclude<Family, 'Info' | 'Tertiary'>, Stop> = {
  Primary: 600,
  Secondary: 500,
  Neutral: 500,
  Success: 500,
  Warning: 500,
  Error: 500,
};

export const REFERENCE_PRIMARY: RampOnly = {
  50: '#f2f8fa',
  100: '#e6f0f5',
  200: '#cce1eb',
  300: '#99c4d6',
  400: '#66a6c2',
  500: '#3389ad',
  600: '#006b99',
  700: '#045477',
  800: '#063e56',
  900: '#0a2333',
};

export const REFERENCE_SECONDARY: RampOnly = {
  50: '#ffedec',
  100: '#fed2cf',
  200: '#fda59e',
  300: '#fb776e',
  400: '#fa4a3d',
  500: '#d53f34',
  600: '#af342b',
  700: '#641e18',
  800: '#4b1612',
  900: '#320f0c',
};

export const REFERENCE_NEUTRAL: NeutralRamp = {
  50: '#faf8f7',
  100: '#ebe9e8',
  200: '#cdcbcb',
  300: '#afaead',
  400: '#91908f',
  500: '#737272',
  600: '#646363',
  700: '#4b4a4a',
  800: '#323231',
  900: '#191919',
  white: '#ffffff',
  black: '#000000',
};

export const REFERENCE_ERROR: RampOnly = {
  50: '#ffeced',
  100: '#ffdadd',
  200: '#ff979f',
  300: '#ff6c78',
  400: '#ff4151',
  500: '#e02d3c',
  600: '#be1b29',
  700: '#9c0e19',
  800: '#7a040e',
  900: '#580007',
};

export const REFERENCE_SUCCESS: RampOnly = {
  50: '#ecfdf3',
  100: '#dcfae6',
  200: '#abefc6',
  300: '#75e0a7',
  400: '#47cd89',
  500: '#17b26a',
  600: '#079455',
  700: '#067647',
  800: '#085d3a',
  900: '#074d31',
};

export const REFERENCE_WARNING: RampOnly = {
  50: '#fff8e0',
  100: '#feebc0',
  200: '#fdda8b',
  300: '#fdd06b',
  400: '#fcc64c',
  500: '#fcbc2c',
  600: '#d6a025',
  700: '#b0841f',
  800: '#8b6718',
  900: '#654b12',
};

// Map alpha percent labels → 2-char hex alpha. Hand-chosen to match dragonpass exactly.
// (4% = 0a/255 ≈ 3.9%; 90% = e5/255 ≈ 89.8%, etc.)
export const ALPHA_HEX: Record<AlphaPercent, string> = {
  '4%': '0a',
  '8%': '14',
  '10%': '1a',
  '20%': '33',
  '40%': '66',
  '60%': '99',
  '80%': 'cc',
  '90%': 'e5',
};

// Which alpha levels are layered over the brand-ink base (Primary.900) vs.
// neutral-black (#000000). Codifies the dragonpass convention.
export const OPACITY_BASE: Record<AlphaPercent, 'brand-ink' | 'neutral-black'> = {
  '4%': 'brand-ink',
  '8%': 'brand-ink',
  '10%': 'brand-ink',
  '20%': 'brand-ink',
  '40%': 'neutral-black',
  '60%': 'brand-ink',
  '80%': 'neutral-black',
  '90%': 'brand-ink',
};

export const REFERENCE_OPACITY: OpacityRamp = {
  '4%': '#0a23330a',
  '8%': '#0a233314',
  '10%': '#0a23331a',
  '20%': '#0a233333',
  '40%': '#00000066',
  '60%': '#0a233399',
  '80%': '#000000cc',
  '90%': '#0a2333e5',
};

// One-shot lookup of the reference palette structured the way the generator emits it.
// Used by the validator to compare every produced primitive against the source of truth.
export const DRAGONPASS_REFERENCE_PALETTE: Record<string, string> = {
  ...rampToFlat('Primary', REFERENCE_PRIMARY),
  ...rampToFlat('Secondary', REFERENCE_SECONDARY),
  ...neutralToFlat(REFERENCE_NEUTRAL),
  ...rampToFlat('Error', REFERENCE_ERROR),
  ...rampToFlat('Success', REFERENCE_SUCCESS),
  ...rampToFlat('Warning', REFERENCE_WARNING),
  ...rampToFlat('Info', REFERENCE_PRIMARY), // Info = Primary in dragonpass
  ...rampToFlat('Tertiary', REFERENCE_SECONDARY), // Tertiary = Secondary in dragonpass
  ...opacityToFlat(REFERENCE_OPACITY),
};

function rampToFlat(family: string, ramp: RampOnly): Record<string, string> {
  const out: Record<string, string> = {};
  for (const stop of STOPS) out[`colors.${family}.${stop}`] = ramp[stop];
  return out;
}

function neutralToFlat(ramp: NeutralRamp): Record<string, string> {
  const out: Record<string, string> = {};
  for (const stop of STOPS) out[`colors.Neutral.${stop}`] = ramp[stop];
  out['colors.Neutral.white'] = ramp.white;
  out['colors.Neutral.black'] = ramp.black;
  return out;
}

function opacityToFlat(ramp: OpacityRamp): Record<string, string> {
  const out: Record<string, string> = {};
  for (const a of ALPHA_PERCENTS) out[`colors.Opacity.${a}`] = ramp[a];
  return out;
}
