// Cross-brand smoke + override + out-of-gamut demos. Run with `npm run gen:demo`.
//
// Demonstrates the three behaviours called out in the plan's verification:
//   3. Cross-brand smoke — Mastercard-style seeds produce a complete palette.
//   4. Override test     — primitiveOverrides propagates through to atom tokens.
//   5. Out-of-gamut test — extreme seed clamps cleanly without throwing.

import { generateBrandTokens } from './generate-brand-tokens.ts';

function header(title: string): void {
  console.log(`\n=== ${title} ===\n`);
}

function showRamp(palette: Record<string, string>, family: string): void {
  for (const stop of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]) {
    console.log(`  ${family}.${String(stop).padStart(3)}  ${palette[`colors.${family}.${stop}`]}`);
  }
}

// 3 — Mastercard-style seeds. Output is similar-feel ramps in orange.
header('Cross-brand smoke: Mastercard-style seeds');
{
  const result = generateBrandTokens({
    primary: '#ea580c', // Mastercard's current Primary.600
    secondary: '#f59e0b',
    neutral: '#737373',
    success: '#22c55e',
    warning: '#eab308',
    error: '#dc2626',
  });
  console.log('Primary ramp:');
  showRamp(result.resolvedPalette, 'Primary');
  console.log('\nSelected atom tokens:');
  for (const k of [
    'atom.background.primary.bg-primary-default',
    'atom.foreground.primary.fg-brand-primary',
    'atom.foreground.feedback.fg-success',
    'atom.background.core.bg-overlay',
  ] as const) {
    console.log(`  ${k.padEnd(60)}  ${result.resolvedSemanticTokens[k]}`);
  }
}

// 4 — Override test. Force Primary.900 to a specific hex; atom tokens that
// reference it should pick up the override.
header('Override test: pin colors.Primary.900 = #cf4500');
{
  const result = generateBrandTokens(
    {
      primary: '#006b99',
      secondary: '#d53f34',
      neutral: '#737272',
      success: '#17b26a',
      warning: '#fcbc2c',
      error: '#e02d3c',
    },
    { 'colors.Primary.900': '#cf4500' },
  );
  console.log(`  colors.Primary.900                                  = ${result.resolvedPalette['colors.Primary.900']}`);
  console.log(`  atom.background.primary.bg-primary-default         = ${result.resolvedSemanticTokens['atom.background.primary.bg-primary-default']}`);
  console.log(`  atom.foreground.primary.fg-brand-primary           = ${result.resolvedSemanticTokens['atom.foreground.primary.fg-brand-primary']}`);
  console.log(`  atom.border.selection-and-focus.border-primary-focus = ${result.resolvedSemanticTokens['atom.border.selection-and-focus.border-primary-focus']}`);
}

// 5 — Out-of-gamut seed. Cyan #00ffff has more chroma than sRGB allows for
// many ramp positions; clampChroma should keep everything in-gamut.
header('Out-of-gamut test: primary = #00ffff (extreme cyan)');
{
  try {
    const result = generateBrandTokens({
      primary: '#00ffff',
      secondary: '#d53f34',
      neutral: '#737272',
      success: '#17b26a',
      warning: '#fcbc2c',
      error: '#e02d3c',
    });
    console.log('Primary ramp (clamped):');
    showRamp(result.resolvedPalette, 'Primary');
    const bgPrimary = result.resolvedSemanticTokens['atom.background.primary.bg-primary-default'];
    console.log(`\n  atom.background.primary.bg-primary-default = ${bgPrimary}`);
    if (!/^#[0-9a-f]{6,8}$/.test(bgPrimary)) {
      console.error(`✗ FAIL: clamped output is not a valid hex: "${bgPrimary}"`);
      process.exit(1);
    }
    console.log('\n✓ PASS: extreme seed produced in-gamut ramp without throwing.');
  } catch (err) {
    console.error('✗ FAIL: extreme seed threw:', err);
    process.exit(1);
  }
}

console.log('\n✓ Demos complete.\n');
