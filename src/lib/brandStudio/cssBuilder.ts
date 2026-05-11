import { generateBrandTokens } from '../tokenGenerator/generate-brand-tokens';
import type { SemanticTokenKey } from '../../data/tokens';
import type { StudioBrand } from './types';

// Atom token key → CSS custom property name.
// Rule: drop the leading "atom." prefix, swap "." and "/" for "-", prepend "--atom-".
// Matches the convention in src/index.css (e.g. atom.foreground.core.fg-primary →
// --atom-foreground-core-fg-primary).
export function tokenKeyToCssVar(key: SemanticTokenKey): string {
  const stripped = key.startsWith('atom.') ? key.slice('atom.'.length) : key;
  return `--atom-${stripped.replace(/[./]/g, '-')}`;
}

// Build the CSS block that themes the page when data-brand="studio" is set.
// Emits all 67 atom CSS variables plus --atom-font-body.
export function buildStudioCss(brand: StudioBrand, selector = '[data-brand="studio"]'): string {
  const { resolvedSemanticTokens } = generateBrandTokens(brand.seeds);

  const lines: string[] = [`${selector} {`];
  lines.push(`  --atom-font-body: ${brand.font};`);
  for (const [tokenKey, hex] of Object.entries(resolvedSemanticTokens) as [
    SemanticTokenKey,
    string,
  ][]) {
    lines.push(`  ${tokenKeyToCssVar(tokenKey)}: ${hex};`);
  }
  lines.push('}');
  return lines.join('\n');
}
