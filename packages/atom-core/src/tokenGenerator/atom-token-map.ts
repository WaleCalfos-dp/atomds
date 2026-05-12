// The 67-row universal mapping: each atom semantic token points to one
// position in the primitive palette. Mapping is brand-agnostic — the same
// table applies to every brand under the universal recipe. Per-brand
// variation comes from the seeds (which shift each ramp's hue), not from
// changing which stop a token consumes.
//
// Cross-checked against `resolvedSemanticTokens.Dragonpass` in
// `scripts/raw/brand-switcher-variables.json` (lines 570–638). Every right-hand
// side here resolves to the same hex as that JSON when seeded with the
// dragonpass anchors.

import type { SemanticTokenKey } from '../tokens/tokens';

// Each atom token resolves to a primitive key. The string format matches
// `resolvedPalette` keys exactly: `colors.<Family>.<Stop>` or `colors.Opacity.<Pct>`.
export const ATOM_TOKEN_MAP: Record<SemanticTokenKey, string> = {
  // foreground.core
  'atom.foreground.core.fg-primary': 'colors.Neutral.700',
  'atom.foreground.core.fg-secondary': 'colors.Neutral.500',
  'atom.foreground.core.fg-tertiary': 'colors.Neutral.300',
  'atom.foreground.core.fg-link': 'colors.Primary.600',
  'atom.foreground.core.fg-interactive-icon': 'colors.Primary.600',

  // foreground.primary (brand)
  'atom.foreground.primary.fg-brand-primary': 'colors.Primary.900',
  'atom.foreground.primary.fg-brand-primary-inverse': 'colors.Neutral.white',
  'atom.foreground.primary.fg-brand-secondary': 'colors.Primary.700',
  'atom.foreground.primary.fg-brand-hover': 'colors.Primary.900',

  // foreground.feedback
  'atom.foreground.feedback.fg-success': 'colors.Success.700',
  'atom.foreground.feedback.fg-warning': 'colors.Warning.600',
  'atom.foreground.feedback.fg-error': 'colors.Error.500',
  'atom.foreground.feedback.fg-info': 'colors.Info.600',
  'atom.foreground.feedback.fg-error-pressed': 'colors.Error.700',
  'atom.foreground.feedback.fg-error-hover': 'colors.Error.800',

  // foreground.states
  'atom.foreground.states.fg-disabled': 'colors.Neutral.400',
  'atom.foreground.states.fg-hover': 'colors.Primary.700',
  'atom.foreground.states.fg-disabled-inverse': 'colors.Neutral.white',
  'atom.foreground.states.fg-pressed': 'colors.Primary.800',
  'atom.foreground.states.fg-pressed-inverse': 'colors.Neutral.white',

  // background.primary
  'atom.background.primary.bg-primary-default': 'colors.Primary.900',
  'atom.background.primary.bg-primary-inverse': 'colors.Neutral.white',
  'atom.background.primary.bg-primary-disabled': 'colors.Neutral.100',
  'atom.background.primary.bg-primary-hover': 'colors.Primary.700',
  'atom.background.primary.bg-primary-pressed': 'colors.Primary.800',
  'atom.background.primary.bg-primary-focus': 'colors.Primary.900',
  'atom.background.primary.bg-primary-focus-inverse': 'colors.Opacity.4%',
  'atom.background.primary.bg-primary-pressed-inverse': 'colors.Neutral.50',
  'atom.background.primary.bg-primary-disabled-inverse': 'colors.Neutral.50',
  'atom.background.primary.bg-primary-pressed-brand': 'colors.Primary.900',
  'atom.background.primary.bg-primary-hover-inverse': 'colors.Neutral.white',
  'atom.background.primary.accent': 'colors.Primary.900',

  // background.core
  'atom.background.core.bg-overlay': 'colors.Opacity.80%',
  'atom.background.core.bg-secondary-hover': 'colors.Opacity.4%',
  'atom.background.core.bg-muted': 'colors.Opacity.4%',
  'atom.background.core.bg-secondary': 'colors.Neutral.50',
  'atom.background.core.bg-accent': 'colors.Secondary.500',

  // background.alert
  'atom.background.alert.bg-success-light': 'colors.Success.100',
  'atom.background.alert.bg-warning-default': 'colors.Warning.100',
  'atom.background.alert.bg-error-light': 'colors.Error.100',
  'atom.background.alert.bg-info-default': 'colors.Info.100',
  'atom.background.alert.bg-success-lightest': 'colors.Success.50',
  'atom.background.alert.bg-warning-lightest': 'colors.Warning.50',
  'atom.background.alert.bg-error-lightest': 'colors.Error.50',
  'atom.background.alert.bg-info-lightest': 'colors.Info.50',
  'atom.background.alert.bg-success-full': 'colors.Success.500',
  'atom.background.alert.bg-error-full': 'colors.Error.500',
  'atom.background.alert.bg-error-hover': 'colors.Error.800',
  'atom.background.alert.bg-error-pressed': 'colors.Error.700',

  // border.default
  'atom.border.default.border-default': 'colors.Neutral.200',
  'atom.border.default.border-divider': 'colors.Neutral.200',
  'atom.border.default.border-default-brand': 'colors.Primary.900',
  'atom.border.default.border-muted': 'colors.Opacity.40%',

  // border.states
  'atom.border.states.border-disabled': 'colors.Neutral.200',
  'atom.border.states.border-pressed': 'colors.Primary.800',
  'atom.border.states.border-hover': 'colors.Primary.700',
  'atom.border.states.border-interactive': 'colors.Primary.600',
  'atom.border.states.no-interaction': 'colors.Neutral.white',

  // border.selection-and-focus
  'atom.border.selection-and-focus.border-primary-focus': 'colors.Primary.900',
  'atom.border.selection-and-focus.border-selected': 'colors.Primary.900',
  'atom.border.selection-and-focus.border-brand-hover': 'colors.Primary.900',
  'atom.border.selection-and-focus.border-secondary-focus': 'colors.Opacity.20%',

  // border.feedback
  'atom.border.feedback.border-error': 'colors.Error.500',
  'atom.border.feedback.border-warning': 'colors.Warning.600',
  'atom.border.feedback.success-border-color': 'colors.Success.500',
  'atom.border.feedback.border-info': 'colors.Info.600',

  // progress-indicator
  'atom.progress-indicator.active-color': 'colors.Neutral.white',
};

// Sanity check: 67 entries, no duplicates by key (TS already enforces uniqueness via Record<SemanticTokenKey, ...>).
export const ATOM_TOKEN_COUNT = Object.keys(ATOM_TOKEN_MAP).length;
