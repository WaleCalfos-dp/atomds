// Validation harness — runs the generator with the dragonpass anchors and
// asserts byte-for-byte equality against the source-of-truth JSON. Exits 0
// on full match, 1 with a per-key diff otherwise.

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateBrandTokens, type BrandSeeds } from './generate-brand-tokens.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const JSON_PATH = resolve(__dirname, 'raw/brand-switcher-variables.json');

interface BrandSwitcherJson {
  resolvedPalette: Record<string, Record<string, string>>;
  resolvedSemanticTokens: Record<string, Record<string, string>>;
}

const DRAGONPASS_SEEDS: BrandSeeds = {
  primary: '#006b99',
  secondary: '#d53f34',
  neutral: '#737272',
  success: '#17b26a',
  warning: '#fcbc2c',
  error: '#e02d3c',
};

function main(): number {
  const raw = readFileSync(JSON_PATH, 'utf-8');
  const data = JSON.parse(raw) as BrandSwitcherJson;
  const expectedPalette = data.resolvedPalette.Dragonpass;
  const expectedSemantic = data.resolvedSemanticTokens.Dragonpass;

  if (!expectedPalette || !expectedSemantic) {
    console.error('FAIL: dragonpass entries missing from JSON');
    return 1;
  }

  const { resolvedPalette, resolvedSemanticTokens } = generateBrandTokens(DRAGONPASS_SEEDS);

  const paletteDiffs = diffMaps(expectedPalette, resolvedPalette);
  const semanticDiffs = diffMaps(expectedSemantic, resolvedSemanticTokens);

  const paletteCount = Object.keys(resolvedPalette).length;
  const semanticCount = Object.keys(resolvedSemanticTokens).length;

  console.log(`Generator emitted ${paletteCount} primitives + ${semanticCount} atom tokens.`);

  if (paletteDiffs.length === 0 && semanticDiffs.length === 0) {
    console.log(`✓ PASS: all ${paletteCount} primitives + ${semanticCount} atom tokens match dragonpass byte-for-byte.`);
    return 0;
  }

  console.error('✗ FAIL: byte-for-byte match broken.\n');
  if (paletteDiffs.length > 0) {
    console.error(`Primitive diffs (${paletteDiffs.length}):`);
    for (const d of paletteDiffs) console.error(`  ${d.key.padEnd(40)}  expected ${d.expected}  got ${d.actual}`);
  }
  if (semanticDiffs.length > 0) {
    console.error(`\nAtom token diffs (${semanticDiffs.length}):`);
    for (const d of semanticDiffs) console.error(`  ${d.key.padEnd(60)}  expected ${d.expected}  got ${d.actual}`);
  }
  return 1;
}

interface Diff {
  key: string;
  expected: string;
  actual: string | undefined;
}

function diffMaps(expected: Record<string, string>, actual: Record<string, string>): Diff[] {
  const diffs: Diff[] = [];
  for (const key of Object.keys(expected)) {
    const exp = expected[key].toLowerCase();
    const act = actual[key]?.toLowerCase();
    if (exp !== act) diffs.push({ key, expected: exp, actual: act });
  }
  // Also surface keys in actual that aren't in expected (the generator adds something the JSON doesn't).
  for (const key of Object.keys(actual)) {
    if (!(key in expected)) diffs.push({ key, expected: '<missing in JSON>', actual: actual[key] });
  }
  return diffs;
}

process.exit(main());
