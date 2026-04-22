import type { BrandTokens, SemanticTokenKey } from './tokens';

// ─── Primitives the user fills in the portal ─────────────────────────────────
export type CorePrimitives = {
  brandPrimary: string;        // dominant brand color
  brandHover: string;          // lighter brand shade for hover
  brandPressed: string;        // darker brand shade for pressed
  textPrimary: string;         // body text
  textSecondary: string;       // supporting text
  textTertiary: string;        // placeholders, dividers
  link: string;                // hyperlinks, interactive icons
  backgroundSecondary: string; // secondary page surface
  borderDefault: string;       // default border
  feedbackSuccess: string;     // fg-success, derives bg-success-*
  feedbackWarning: string;     // fg-warning, derives bg-warning-*
  feedbackError: string;       // fg-error, derives bg-error-*
  feedbackInfo: string;        // fg-info, derives bg-info-*
};

export type CustomBrandMode = 'simple' | 'full';

export type CustomBrand = {
  name: string;                 // e.g. "Acme"
  logo: string;                 // URL or data: URL — maps to Brand Switcher brand-logo
  mode: CustomBrandMode;        // 'simple' = 13 primitives drive tokens; 'full' = 67 explicit tokens
  primitives: CorePrimitives;   // always present (simple source + full-mode seed)
  tokens?: BrandTokens;         // only populated in 'full' mode
};

// Resolve the final tokens a custom brand should render, regardless of mode.
export function resolveCustomBrandTokens(cb: CustomBrand): BrandTokens {
  if (cb.mode === 'full' && cb.tokens) return cb.tokens;
  return deriveTokens(cb.primitives);
}

export const DEFAULT_PRIMITIVES: CorePrimitives = {
  brandPrimary: '#0a2333',
  brandHover: '#045477',
  brandPressed: '#063e56',
  textPrimary: '#4b4a4a',
  textSecondary: '#737272',
  textTertiary: '#afaead',
  link: '#006b99',
  backgroundSecondary: '#faf8f7',
  borderDefault: '#cdcbcb',
  feedbackSuccess: '#067647',
  feedbackWarning: '#d6a025',
  feedbackError: '#e02d3c',
  feedbackInfo: '#006b99',
};

// ─── Which primitive drives which semantic tokens (for portal UI hints) ───────
export const PRIMITIVE_DESCRIPTORS: Record<
  keyof CorePrimitives,
  { label: string; group: string; drives: string; seenOn: string }
> = {
  brandPrimary: {
    label: 'Brand primary',
    group: 'Core brand',
    drives:
      'fg-brand-primary, bg-primary-default, border-default-brand, border-selected, border-primary-focus, accent, bg-muted (@4%)',
    seenOn: 'Button primary, Badge brand, Progress fill, Tabs active, Checkbox checked',
  },
  brandHover: {
    label: 'Brand hover',
    group: 'Core brand',
    drives: 'bg-primary-hover, fg-brand-secondary, fg-hover, border-hover',
    seenOn: 'Button primary hover, Link hover, Input focus',
  },
  brandPressed: {
    label: 'Brand pressed',
    group: 'Core brand',
    drives: 'bg-primary-pressed, fg-pressed, border-pressed',
    seenOn: 'Button primary pressed, Breadcrumb pressed',
  },
  textPrimary: {
    label: 'Text primary',
    group: 'Text',
    drives: 'fg-primary',
    seenOn: 'Body text, Input labels, Card body',
  },
  textSecondary: {
    label: 'Text secondary',
    group: 'Text',
    drives: 'fg-secondary',
    seenOn: 'Helper text, captions, Alert descriptions',
  },
  textTertiary: {
    label: 'Text tertiary',
    group: 'Text',
    drives: 'fg-tertiary, fg-disabled',
    seenOn: 'Placeholders, disabled text, dividers',
  },
  link: {
    label: 'Link',
    group: 'Neutral & link',
    drives: 'fg-link, fg-interactive-icon, border-interactive',
    seenOn: 'Anchor tags, Tertiary button, interactive icons',
  },
  backgroundSecondary: {
    label: 'Background secondary',
    group: 'Neutral & link',
    drives: 'bg-secondary, bg-primary-pressed-inverse, bg-primary-disabled-inverse',
    seenOn: 'Page sections, Card surfaces, pressed overlays',
  },
  borderDefault: {
    label: 'Border default',
    group: 'Neutral & link',
    drives: 'border-default, border-divider, border-disabled, no-interaction',
    seenOn: 'Input border, Card outline, Divider',
  },
  feedbackSuccess: {
    label: 'Success',
    group: 'Feedback',
    drives: 'fg-success, bg-success-full, bg-success-light, bg-success-lightest, success-border-color',
    seenOn: 'Success Alert, success Badge, success Toast',
  },
  feedbackWarning: {
    label: 'Warning',
    group: 'Feedback',
    drives: 'fg-warning, bg-warning-default, bg-warning-lightest, border-warning',
    seenOn: 'Warning Alert, warning Badge',
  },
  feedbackError: {
    label: 'Error',
    group: 'Feedback',
    drives:
      'fg-error, fg-error-hover, fg-error-pressed, bg-error-full, bg-error-light, bg-error-lightest, bg-error-hover, bg-error-pressed, border-error',
    seenOn: 'Error Alert, Destructive button, Input error, error Badge',
  },
  feedbackInfo: {
    label: 'Info',
    group: 'Feedback',
    drives: 'fg-info, bg-info-default, bg-info-lightest, border-info',
    seenOn: 'Info Alert, info Badge',
  },
};

// ─── Color math ───────────────────────────────────────────────────────────────
// All inputs must be 6-digit #rrggbb. 8-digit alpha hex is produced only by `alpha`.

function parseHex(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '').slice(0, 6).padEnd(6, '0');
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function toHex(r: number, g: number, b: number): string {
  const c = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

// Mix `hex` with white by `amount` (0-1). amount=0 → hex; amount=1 → white.
export function lighten(hex: string, amount: number): string {
  const { r, g, b } = parseHex(hex);
  return toHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
}

// Mix `hex` with black by `amount` (0-1). amount=0 → hex; amount=1 → black.
export function darken(hex: string, amount: number): string {
  const { r, g, b } = parseHex(hex);
  return toHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

// Returns 8-digit hex with alpha. opacity is 0-1.
export function alpha(hex: string, opacity: number): string {
  const clean = hex.replace('#', '').slice(0, 6).padEnd(6, '0');
  const a = Math.max(0, Math.min(255, Math.round(opacity * 255)))
    .toString(16)
    .padStart(2, '0');
  return `#${clean}${a}`;
}

// ─── Derivation rules ─────────────────────────────────────────────────────────
// Single source of truth for both `deriveTokens()` (runtime evaluation) and the
// Token Mapping page (human-readable documentation of the 67 → 13 compression).

export type TokenRule =
  | { kind: 'direct'; from: keyof CorePrimitives }
  | { kind: 'lighten'; from: keyof CorePrimitives; by: number }
  | { kind: 'darken'; from: keyof CorePrimitives; by: number }
  | { kind: 'alpha'; from: keyof CorePrimitives; a: number }
  | { kind: 'fixed'; value: string; note: string };

export const TOKEN_DERIVATION: Record<SemanticTokenKey, TokenRule> = {
  // foreground/core
  'atom.foreground.core.fg-primary': { kind: 'direct', from: 'textPrimary' },
  'atom.foreground.core.fg-secondary': { kind: 'direct', from: 'textSecondary' },
  'atom.foreground.core.fg-tertiary': { kind: 'direct', from: 'textTertiary' },
  'atom.foreground.core.fg-link': { kind: 'direct', from: 'link' },
  'atom.foreground.core.fg-interactive-icon': { kind: 'direct', from: 'link' },

  // foreground/primary
  'atom.foreground.primary.fg-brand-primary': { kind: 'direct', from: 'brandPrimary' },
  'atom.foreground.primary.fg-brand-primary-inverse': { kind: 'fixed', value: '#ffffff', note: 'Always white — used for text on brand surfaces' },
  'atom.foreground.primary.fg-brand-secondary': { kind: 'direct', from: 'brandHover' },
  'atom.foreground.primary.fg-brand-hover': { kind: 'direct', from: 'brandPrimary' },

  // foreground/feedback
  'atom.foreground.feedback.fg-success': { kind: 'direct', from: 'feedbackSuccess' },
  'atom.foreground.feedback.fg-warning': { kind: 'direct', from: 'feedbackWarning' },
  'atom.foreground.feedback.fg-error': { kind: 'direct', from: 'feedbackError' },
  'atom.foreground.feedback.fg-info': { kind: 'direct', from: 'feedbackInfo' },
  'atom.foreground.feedback.fg-error-hover': { kind: 'darken', from: 'feedbackError', by: 0.4 },
  'atom.foreground.feedback.fg-error-pressed': { kind: 'darken', from: 'feedbackError', by: 0.2 },

  // foreground/states
  'atom.foreground.states.fg-disabled': { kind: 'direct', from: 'textTertiary' },
  'atom.foreground.states.fg-disabled-inverse': { kind: 'fixed', value: '#ffffff', note: 'Always white' },
  'atom.foreground.states.fg-hover': { kind: 'direct', from: 'brandHover' },
  'atom.foreground.states.fg-pressed': { kind: 'direct', from: 'brandPressed' },
  'atom.foreground.states.fg-pressed-inverse': { kind: 'fixed', value: '#ffffff', note: 'Always white' },

  // background/primary
  'atom.background.primary.bg-primary-default': { kind: 'direct', from: 'brandPrimary' },
  'atom.background.primary.bg-primary-inverse': { kind: 'fixed', value: '#ffffff', note: 'Always white — the inverse surface' },
  'atom.background.primary.bg-primary-disabled': { kind: 'lighten', from: 'textTertiary', by: 0.6 },
  'atom.background.primary.bg-primary-hover': { kind: 'direct', from: 'brandHover' },
  'atom.background.primary.bg-primary-pressed': { kind: 'direct', from: 'brandPressed' },
  'atom.background.primary.bg-primary-focus': { kind: 'direct', from: 'brandPrimary' },
  'atom.background.primary.bg-primary-focus-inverse': { kind: 'alpha', from: 'brandPrimary', a: 0.04 },
  'atom.background.primary.bg-primary-pressed-inverse': { kind: 'direct', from: 'backgroundSecondary' },
  'atom.background.primary.bg-primary-disabled-inverse': { kind: 'direct', from: 'backgroundSecondary' },
  'atom.background.primary.bg-primary-pressed-brand': { kind: 'direct', from: 'brandPrimary' },
  'atom.background.primary.bg-primary-hover-inverse': { kind: 'fixed', value: '#ffffff', note: 'Always white' },
  'atom.background.primary.accent': { kind: 'direct', from: 'brandPrimary' },

  // background/core
  'atom.background.core.bg-overlay': { kind: 'fixed', value: '#000000cc', note: 'Black at 80% opacity — modal scrim' },
  'atom.background.core.bg-secondary-hover': { kind: 'alpha', from: 'brandPrimary', a: 0.04 },
  'atom.background.core.bg-muted': { kind: 'alpha', from: 'brandPrimary', a: 0.04 },
  'atom.background.core.bg-secondary': { kind: 'direct', from: 'backgroundSecondary' },
  'atom.background.core.bg-accent': { kind: 'direct', from: 'brandPrimary' },

  // background/alert — 4 feedback × 3 tints
  'atom.background.alert.bg-success-full': { kind: 'direct', from: 'feedbackSuccess' },
  'atom.background.alert.bg-success-light': { kind: 'lighten', from: 'feedbackSuccess', by: 0.75 },
  'atom.background.alert.bg-success-lightest': { kind: 'lighten', from: 'feedbackSuccess', by: 0.85 },
  'atom.background.alert.bg-warning-default': { kind: 'lighten', from: 'feedbackWarning', by: 0.7 },
  'atom.background.alert.bg-warning-lightest': { kind: 'lighten', from: 'feedbackWarning', by: 0.85 },
  'atom.background.alert.bg-error-full': { kind: 'direct', from: 'feedbackError' },
  'atom.background.alert.bg-error-light': { kind: 'lighten', from: 'feedbackError', by: 0.75 },
  'atom.background.alert.bg-error-lightest': { kind: 'lighten', from: 'feedbackError', by: 0.85 },
  'atom.background.alert.bg-error-hover': { kind: 'darken', from: 'feedbackError', by: 0.4 },
  'atom.background.alert.bg-error-pressed': { kind: 'darken', from: 'feedbackError', by: 0.2 },
  'atom.background.alert.bg-info-default': { kind: 'lighten', from: 'feedbackInfo', by: 0.85 },
  'atom.background.alert.bg-info-lightest': { kind: 'lighten', from: 'feedbackInfo', by: 0.92 },

  // border/default
  'atom.border.default.border-default': { kind: 'direct', from: 'borderDefault' },
  'atom.border.default.border-divider': { kind: 'direct', from: 'borderDefault' },
  'atom.border.default.border-default-brand': { kind: 'direct', from: 'brandPrimary' },
  'atom.border.default.border-muted': { kind: 'fixed', value: '#00000066', note: 'Black at 40% opacity' },

  // border/states
  'atom.border.states.border-disabled': { kind: 'direct', from: 'borderDefault' },
  'atom.border.states.border-pressed': { kind: 'direct', from: 'brandPressed' },
  'atom.border.states.border-hover': { kind: 'direct', from: 'brandHover' },
  'atom.border.states.border-interactive': { kind: 'direct', from: 'link' },
  'atom.border.states.no-interaction': { kind: 'fixed', value: '#ffffff', note: 'Always white — neutral non-interactive border' },

  // border/selection-and-focus
  'atom.border.selection-and-focus.border-primary-focus': { kind: 'direct', from: 'brandPrimary' },
  'atom.border.selection-and-focus.border-selected': { kind: 'direct', from: 'brandPrimary' },
  'atom.border.selection-and-focus.border-brand-hover': { kind: 'direct', from: 'brandPrimary' },
  'atom.border.selection-and-focus.border-secondary-focus': { kind: 'alpha', from: 'brandPrimary', a: 0.2 },

  // border/feedback
  'atom.border.feedback.border-error': { kind: 'direct', from: 'feedbackError' },
  'atom.border.feedback.border-warning': { kind: 'direct', from: 'feedbackWarning' },
  'atom.border.feedback.success-border-color': { kind: 'direct', from: 'feedbackSuccess' },
  'atom.border.feedback.border-info': { kind: 'direct', from: 'feedbackInfo' },

  // progress
  'atom.progress-indicator.active-color': { kind: 'fixed', value: '#ffffff', note: 'Always white — active segment on filled progress' },
};

// ─── Per-token documentation (group + purpose) ───────────────────────────────
// Purpose strings mirror Brand Switcher's own variable catalogue — same wording
// designers see inside Figma. Used by the Full-mode editor to tell the user
// exactly where each of the 67 tokens gets painted.
export type TokenInfo = { group: string; purpose: string };

export const TOKEN_INFO: Record<SemanticTokenKey, TokenInfo> = {
  // foreground/core
  'atom.foreground.core.fg-primary':          { group: 'Foreground / Core',    purpose: 'Default body text.' },
  'atom.foreground.core.fg-secondary':        { group: 'Foreground / Core',    purpose: 'Secondary / supporting text.' },
  'atom.foreground.core.fg-tertiary':         { group: 'Foreground / Core',    purpose: 'Tertiary text / divider glyphs / placeholders.' },
  'atom.foreground.core.fg-link':             { group: 'Foreground / Core',    purpose: 'Anchor colour.' },
  'atom.foreground.core.fg-interactive-icon': { group: 'Foreground / Core',    purpose: 'Interactive icon fill (links, chevrons).' },

  // foreground/primary
  'atom.foreground.primary.fg-brand-primary':         { group: 'Foreground / Primary', purpose: 'Brand colour for text / headings.' },
  'atom.foreground.primary.fg-brand-primary-inverse': { group: 'Foreground / Primary', purpose: 'Text on brand backgrounds.' },
  'atom.foreground.primary.fg-brand-secondary':       { group: 'Foreground / Primary', purpose: 'Brand secondary text.' },
  'atom.foreground.primary.fg-brand-hover':           { group: 'Foreground / Primary', purpose: 'Brand hover text.' },

  // foreground/feedback
  'atom.foreground.feedback.fg-success':       { group: 'Foreground / Feedback', purpose: 'Success text / icon.' },
  'atom.foreground.feedback.fg-warning':       { group: 'Foreground / Feedback', purpose: 'Warning text / icon.' },
  'atom.foreground.feedback.fg-error':         { group: 'Foreground / Feedback', purpose: 'Error text / icon.' },
  'atom.foreground.feedback.fg-info':          { group: 'Foreground / Feedback', purpose: 'Info text / icon.' },
  'atom.foreground.feedback.fg-error-pressed': { group: 'Foreground / Feedback', purpose: 'Error text pressed state.' },
  'atom.foreground.feedback.fg-error-hover':   { group: 'Foreground / Feedback', purpose: 'Error text hover state.' },

  // foreground/states
  'atom.foreground.states.fg-disabled':          { group: 'Foreground / States', purpose: 'Disabled text.' },
  'atom.foreground.states.fg-hover':             { group: 'Foreground / States', purpose: 'Hover text.' },
  'atom.foreground.states.fg-disabled-inverse':  { group: 'Foreground / States', purpose: 'Disabled text on dark.' },
  'atom.foreground.states.fg-pressed':           { group: 'Foreground / States', purpose: 'Pressed text (current breadcrumb uses this).' },
  'atom.foreground.states.fg-pressed-inverse':   { group: 'Foreground / States', purpose: 'Pressed text on dark.' },

  // background/primary
  'atom.background.primary.bg-primary-default':          { group: 'Background / Primary', purpose: 'Solid primary surface (e.g. Button primary).' },
  'atom.background.primary.bg-primary-inverse':          { group: 'Background / Primary', purpose: 'Inverse (white) surface.' },
  'atom.background.primary.bg-primary-disabled':         { group: 'Background / Primary', purpose: 'Disabled surface.' },
  'atom.background.primary.bg-primary-hover':            { group: 'Background / Primary', purpose: 'Primary hover surface.' },
  'atom.background.primary.bg-primary-pressed':          { group: 'Background / Primary', purpose: 'Primary pressed surface.' },
  'atom.background.primary.bg-primary-focus':            { group: 'Background / Primary', purpose: 'Focused primary surface.' },
  'atom.background.primary.bg-primary-focus-inverse':    { group: 'Background / Primary', purpose: 'Focus overlay on white.' },
  'atom.background.primary.bg-primary-pressed-inverse':  { group: 'Background / Primary', purpose: 'Pressed overlay on white.' },
  'atom.background.primary.bg-primary-disabled-inverse': { group: 'Background / Primary', purpose: 'Disabled overlay on white.' },
  'atom.background.primary.bg-primary-pressed-brand':    { group: 'Background / Primary', purpose: 'Brand-coloured pressed surface.' },
  'atom.background.primary.bg-primary-hover-inverse':    { group: 'Background / Primary', purpose: 'Hover overlay on white.' },
  'atom.background.primary.accent':                      { group: 'Background / Primary', purpose: 'Brand accent surface.' },

  // background/core
  'atom.background.core.bg-overlay':          { group: 'Background / Core', purpose: 'Modal scrim / overlay.' },
  'atom.background.core.bg-secondary-hover':  { group: 'Background / Core', purpose: 'Secondary hover overlay.' },
  'atom.background.core.bg-muted':            { group: 'Background / Core', purpose: 'Muted / subtle surface.' },
  'atom.background.core.bg-secondary':        { group: 'Background / Core', purpose: 'Secondary page / card surface.' },
  'atom.background.core.bg-accent':           { group: 'Background / Core', purpose: 'Decorative accent block.' },

  // background/alert
  'atom.background.alert.bg-success-light':    { group: 'Background / Alert', purpose: 'Light success surface.' },
  'atom.background.alert.bg-warning-default':  { group: 'Background / Alert', purpose: 'Default warning surface.' },
  'atom.background.alert.bg-error-light':      { group: 'Background / Alert', purpose: 'Light error surface.' },
  'atom.background.alert.bg-info-default':     { group: 'Background / Alert', purpose: 'Default info surface.' },
  'atom.background.alert.bg-success-lightest': { group: 'Background / Alert', purpose: 'Subtlest success tint.' },
  'atom.background.alert.bg-warning-lightest': { group: 'Background / Alert', purpose: 'Subtlest warning tint.' },
  'atom.background.alert.bg-error-lightest':   { group: 'Background / Alert', purpose: 'Subtlest error tint.' },
  'atom.background.alert.bg-info-lightest':    { group: 'Background / Alert', purpose: 'Subtlest info tint.' },
  'atom.background.alert.bg-success-full':     { group: 'Background / Alert', purpose: 'Solid success fill (e.g. toast).' },
  'atom.background.alert.bg-error-full':       { group: 'Background / Alert', purpose: 'Solid error fill.' },
  'atom.background.alert.bg-error-hover':      { group: 'Background / Alert', purpose: 'Error surface hover.' },
  'atom.background.alert.bg-error-pressed':    { group: 'Background / Alert', purpose: 'Error surface pressed.' },

  // border/default
  'atom.border.default.border-default':       { group: 'Border / Default', purpose: 'Default border / outline.' },
  'atom.border.default.border-divider':       { group: 'Border / Default', purpose: 'Subtle divider line.' },
  'atom.border.default.border-default-brand': { group: 'Border / Default', purpose: 'Brand-coloured border.' },
  'atom.border.default.border-muted':         { group: 'Border / Default', purpose: 'Muted / semi-transparent border.' },

  // border/states
  'atom.border.states.border-disabled':    { group: 'Border / States', purpose: 'Disabled border.' },
  'atom.border.states.border-pressed':     { group: 'Border / States', purpose: 'Pressed border.' },
  'atom.border.states.border-hover':       { group: 'Border / States', purpose: 'Hover border.' },
  'atom.border.states.border-interactive': { group: 'Border / States', purpose: 'Interactive border (link-like).' },
  'atom.border.states.no-interaction':     { group: 'Border / States', purpose: 'Non-interactive neutral border.' },

  // border/selection-and-focus
  'atom.border.selection-and-focus.border-primary-focus':   { group: 'Border / Selection & Focus', purpose: 'Focus ring, primary.' },
  'atom.border.selection-and-focus.border-selected':        { group: 'Border / Selection & Focus', purpose: 'Selected state border.' },
  'atom.border.selection-and-focus.border-brand-hover':     { group: 'Border / Selection & Focus', purpose: 'Brand hover focus.' },
  'atom.border.selection-and-focus.border-secondary-focus': { group: 'Border / Selection & Focus', purpose: 'Secondary focus (alpha-reduced).' },

  // border/feedback
  'atom.border.feedback.border-error':           { group: 'Border / Feedback', purpose: 'Error border.' },
  'atom.border.feedback.border-warning':         { group: 'Border / Feedback', purpose: 'Warning border.' },
  'atom.border.feedback.success-border-color':   { group: 'Border / Feedback', purpose: 'Success border.' },
  'atom.border.feedback.border-info':            { group: 'Border / Feedback', purpose: 'Info border.' },

  // progress-indicator
  'atom.progress-indicator.active-color': { group: 'Progress Indicator', purpose: 'Active segment fill on filled progress bars / circular.' },
};

// Ordered list of the 12 groups — stable for rendering.
export const TOKEN_GROUP_ORDER: string[] = [
  'Foreground / Core',
  'Foreground / Primary',
  'Foreground / Feedback',
  'Foreground / States',
  'Background / Primary',
  'Background / Core',
  'Background / Alert',
  'Border / Default',
  'Border / States',
  'Border / Selection & Focus',
  'Border / Feedback',
  'Progress Indicator',
];

export function tokensInGroup(group: string): SemanticTokenKey[] {
  return (Object.keys(TOKEN_INFO) as SemanticTokenKey[]).filter(
    (k) => TOKEN_INFO[k].group === group,
  );
}

function evaluateRule(rule: TokenRule, p: CorePrimitives): string {
  switch (rule.kind) {
    case 'direct':  return p[rule.from];
    case 'lighten': return lighten(p[rule.from], rule.by);
    case 'darken':  return darken(p[rule.from], rule.by);
    case 'alpha':   return alpha(p[rule.from], rule.a);
    case 'fixed':   return rule.value;
  }
}

// Human-readable rule summary used by the Token Mapping page.
export function describeRule(rule: TokenRule): string {
  switch (rule.kind) {
    case 'direct':  return `= ${rule.from}`;
    case 'lighten': return `lighten(${rule.from}, ${Math.round(rule.by * 100)}%)`;
    case 'darken':  return `darken(${rule.from}, ${Math.round(rule.by * 100)}%)`;
    case 'alpha':   return `${rule.from} @ ${Math.round(rule.a * 100)}%`;
    case 'fixed':   return `fixed (${rule.note})`;
  }
}

// ─── Derivation: 13 primitives → 67 semantic tokens ───────────────────────────
export function deriveTokens(p: CorePrimitives): BrandTokens {
  const out = {} as BrandTokens;
  (Object.keys(TOKEN_DERIVATION) as SemanticTokenKey[]).forEach((key) => {
    out[key] = evaluateRule(TOKEN_DERIVATION[key], p);
  });
  return out;
}

// ─── Accessibility (WCAG contrast) ────────────────────────────────────────────
function channelLuminance(c: number): number {
  const cs = c / 255;
  return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(hex: string): number {
  const { r, g, b } = parseHex(hex);
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);
}

export function contrast(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

// Walk `fg` away from `bg`'s luminance until contrast ≥ target. Returns null
// if even pure black/white can't satisfy (shouldn't happen on a white bg).
export function suggestAccessible(fg: string, bg: string, target: number): string | null {
  if (contrast(fg, bg) >= target) return fg;
  const fgLum = relativeLuminance(fg);
  const bgLum = relativeLuminance(bg);
  // If foreground is darker than background, keep darkening it; otherwise lighten.
  const direction: 'darken' | 'lighten' = fgLum < bgLum ? 'darken' : 'lighten';
  for (let step = 1; step <= 20; step++) {
    const amount = step * 0.05;
    const adjusted = direction === 'darken' ? darken(fg, amount) : lighten(fg, amount);
    if (contrast(adjusted, bg) >= target) return adjusted;
  }
  return null;
}

// ─── Accessibility audit — checks the pairings that ship in the system ───────
export type AccessibilityCheck = {
  id: string;
  label: string;
  description: string;
  fg: string;
  bg: string;
  target: number;      // required ratio
  actual: number;
  passes: boolean;
  suggestion: string | null;                            // replacement hex that passes
  // In simple mode: the primitive the user should tweak. In full mode: the token key.
  suggestedPrimitive: keyof CorePrimitives | null;
  suggestedToken: SemanticTokenKey | null;
};

// Pairings are defined against token keys (the real surface the cascade paints).
// Each pairing includes the "fallback primitive" we suggest editing when the app
// is in Simple mode (where individual tokens aren't directly editable).
type PairingSpec = {
  id: string;
  label: string;
  description: string;
  fg: SemanticTokenKey | '#ffffff' | '#000000';
  bg: SemanticTokenKey | '#ffffff' | '#000000';
  target: number;
  adjustToken: SemanticTokenKey;         // full-mode: the token to tweak
  adjustPrimitive: keyof CorePrimitives; // simple-mode: the primitive to tweak
};

const PAIRINGS: PairingSpec[] = [
  {
    id: 'button-primary',
    label: 'Primary button label',
    description: 'White text on bg-primary-default.',
    fg: '#ffffff',
    bg: 'atom.background.primary.bg-primary-default',
    target: 4.5,
    adjustToken: 'atom.background.primary.bg-primary-default',
    adjustPrimitive: 'brandPrimary',
  },
  {
    id: 'button-primary-hover',
    label: 'Primary button label (hover)',
    description: 'White text on bg-primary-hover.',
    fg: '#ffffff',
    bg: 'atom.background.primary.bg-primary-hover',
    target: 4.5,
    adjustToken: 'atom.background.primary.bg-primary-hover',
    adjustPrimitive: 'brandHover',
  },
  {
    id: 'button-primary-pressed',
    label: 'Primary button label (pressed)',
    description: 'White text on bg-primary-pressed.',
    fg: '#ffffff',
    bg: 'atom.background.primary.bg-primary-pressed',
    target: 4.5,
    adjustToken: 'atom.background.primary.bg-primary-pressed',
    adjustPrimitive: 'brandPressed',
  },
  {
    id: 'body-on-white',
    label: 'Body text on white',
    description: 'fg-primary on bg-primary-inverse.',
    fg: 'atom.foreground.core.fg-primary',
    bg: '#ffffff',
    target: 4.5,
    adjustToken: 'atom.foreground.core.fg-primary',
    adjustPrimitive: 'textPrimary',
  },
  {
    id: 'helper-on-white',
    label: 'Helper / secondary text on white',
    description: 'fg-secondary on white.',
    fg: 'atom.foreground.core.fg-secondary',
    bg: '#ffffff',
    target: 4.5,
    adjustToken: 'atom.foreground.core.fg-secondary',
    adjustPrimitive: 'textSecondary',
  },
  {
    id: 'link-on-white',
    label: 'Link on white',
    description: 'fg-link on white (also governs fg-interactive-icon).',
    fg: 'atom.foreground.core.fg-link',
    bg: '#ffffff',
    target: 4.5,
    adjustToken: 'atom.foreground.core.fg-link',
    adjustPrimitive: 'link',
  },
  {
    id: 'secondary-btn',
    label: 'Secondary button label on white',
    description: 'fg-brand-primary as text on bg-primary-inverse.',
    fg: 'atom.foreground.primary.fg-brand-primary',
    bg: '#ffffff',
    target: 4.5,
    adjustToken: 'atom.foreground.primary.fg-brand-primary',
    adjustPrimitive: 'brandPrimary',
  },
  {
    id: 'fg-success',
    label: 'Success text on white',
    description: 'fg-success on white — Badge, Toast, inline copy.',
    fg: 'atom.foreground.feedback.fg-success',
    bg: '#ffffff',
    target: 4.5,
    adjustToken: 'atom.foreground.feedback.fg-success',
    adjustPrimitive: 'feedbackSuccess',
  },
  {
    id: 'fg-warning',
    label: 'Warning text on white',
    description: 'fg-warning on white.',
    fg: 'atom.foreground.feedback.fg-warning',
    bg: '#ffffff',
    target: 4.5,
    adjustToken: 'atom.foreground.feedback.fg-warning',
    adjustPrimitive: 'feedbackWarning',
  },
  {
    id: 'fg-error',
    label: 'Error text on white',
    description: 'fg-error on white — inline errors, destructive-text Button.',
    fg: 'atom.foreground.feedback.fg-error',
    bg: '#ffffff',
    target: 4.5,
    adjustToken: 'atom.foreground.feedback.fg-error',
    adjustPrimitive: 'feedbackError',
  },
  {
    id: 'fg-info',
    label: 'Info text on white',
    description: 'fg-info on white.',
    fg: 'atom.foreground.feedback.fg-info',
    bg: '#ffffff',
    target: 4.5,
    adjustToken: 'atom.foreground.feedback.fg-info',
    adjustPrimitive: 'feedbackInfo',
  },
  {
    id: 'destructive-btn',
    label: 'Destructive button label',
    description: 'White text on bg-error-full.',
    fg: '#ffffff',
    bg: 'atom.background.alert.bg-error-full',
    target: 4.5,
    adjustToken: 'atom.background.alert.bg-error-full',
    adjustPrimitive: 'feedbackError',
  },
];

function resolveSlot(slot: SemanticTokenKey | '#ffffff' | '#000000', tokens: BrandTokens): string {
  return slot === '#ffffff' || slot === '#000000' ? slot : tokens[slot];
}

export function auditTokens(
  tokens: BrandTokens,
  mode: 'simple' | 'full',
): AccessibilityCheck[] {
  return PAIRINGS.map((pair) => {
    const fg = resolveSlot(pair.fg, tokens);
    const bg = resolveSlot(pair.bg, tokens);
    const actual = contrast(fg, bg);
    const passes = actual >= pair.target;
    let suggestion: string | null = null;
    if (!passes) {
      // Suggestion walks the adjustable side. In our pairings the "adjustable"
      // side is always a token (never a fixed white/black), so we figure out
      // whether fg or bg is the adjust token and push that one.
      const adjustIsFg = pair.fg === pair.adjustToken;
      suggestion = adjustIsFg
        ? suggestAccessible(fg, bg, pair.target)
        : suggestAccessible(bg, fg, pair.target);
    }
    return {
      id: pair.id,
      label: pair.label,
      description: pair.description,
      fg,
      bg,
      target: pair.target,
      actual,
      passes,
      suggestion,
      suggestedPrimitive: !passes && mode === 'simple' ? pair.adjustPrimitive : null,
      suggestedToken: !passes && mode === 'full' ? pair.adjustToken : null,
    };
  });
}

// Backward-compatible helper used by Simple-mode call sites.
export function auditAccessibility(p: CorePrimitives): AccessibilityCheck[] {
  return auditTokens(deriveTokens(p), 'simple');
}

// ─── CSS generator — turns derived tokens into a paste-ready `[data-brand]` block.
// Used by Shell.tsx to inject live theming, and by the portal's "Copy CSS" action.
const TOKEN_KEY_TO_CSS_VAR: Record<SemanticTokenKey, string> = {
  'atom.foreground.core.fg-primary': '--atom-foreground-core-fg-primary',
  'atom.foreground.primary.fg-brand-primary': '--atom-foreground-primary-fg-brand-primary',
  'atom.foreground.core.fg-interactive-icon': '--atom-foreground-core-fg-interactive-icon',
  'atom.background.primary.bg-primary-default': '--atom-background-primary-bg-primary-default',
  'atom.background.primary.bg-primary-inverse': '--atom-background-primary-bg-primary-inverse',
  'atom.border.default.border-default': '--atom-border-default-border-default',
  'atom.border.default.border-divider': '--atom-border-default-border-divider',
  'atom.border.selection-and-focus.border-primary-focus':
    '--atom-border-selection-and-focus-border-primary-focus',
  'atom.foreground.feedback.fg-success': '--atom-foreground-feedback-fg-success',
  'atom.foreground.feedback.fg-warning': '--atom-foreground-feedback-fg-warning',
  'atom.foreground.feedback.fg-error': '--atom-foreground-feedback-fg-error',
  'atom.foreground.feedback.fg-info': '--atom-foreground-feedback-fg-info',
  'atom.foreground.states.fg-disabled': '--atom-foreground-states-fg-disabled',
  'atom.foreground.primary.fg-brand-primary-inverse':
    '--atom-foreground-primary-fg-brand-primary-inverse',
  'atom.background.core.bg-overlay': '--atom-background-core-bg-overlay',
  'atom.background.primary.bg-primary-disabled': '--atom-background-primary-bg-primary-disabled',
  'atom.border.states.border-disabled': '--atom-border-states-border-disabled',
  'atom.foreground.core.fg-secondary': '--atom-foreground-core-fg-secondary',
  'atom.foreground.core.fg-link': '--atom-foreground-core-fg-link',
  'atom.background.primary.bg-primary-hover': '--atom-background-primary-bg-primary-hover',
  'atom.background.primary.bg-primary-pressed': '--atom-background-primary-bg-primary-pressed',
  'atom.background.primary.bg-primary-focus': '--atom-background-primary-bg-primary-focus',
  'atom.background.core.bg-secondary-hover': '--atom-background-core-bg-secondary-hover',
  'atom.background.primary.bg-primary-focus-inverse':
    '--atom-background-primary-bg-primary-focus-inverse',
  'atom.background.primary.bg-primary-pressed-inverse':
    '--atom-background-primary-bg-primary-pressed-inverse',
  'atom.background.alert.bg-success-light': '--atom-background-alert-bg-success-light',
  'atom.background.alert.bg-warning-default': '--atom-background-alert-bg-warning-default',
  'atom.background.alert.bg-error-light': '--atom-background-alert-bg-error-light',
  'atom.background.alert.bg-info-default': '--atom-background-alert-bg-info-default',
  'atom.border.feedback.border-error': '--atom-border-feedback-border-error',
  'atom.border.feedback.border-warning': '--atom-border-feedback-border-warning',
  'atom.border.feedback.success-border-color': '--atom-border-feedback-success-border-color',
  'atom.border.feedback.border-info': '--atom-border-feedback-border-info',
  'atom.border.selection-and-focus.border-selected':
    '--atom-border-selection-and-focus-border-selected',
  'atom.background.primary.bg-primary-disabled-inverse':
    '--atom-background-primary-bg-primary-disabled-inverse',
  'atom.border.default.border-default-brand': '--atom-border-default-border-default-brand',
  'atom.foreground.states.fg-hover': '--atom-foreground-states-fg-hover',
  'atom.foreground.primary.fg-brand-secondary': '--atom-foreground-primary-fg-brand-secondary',
  'atom.foreground.states.fg-disabled-inverse': '--atom-foreground-states-fg-disabled-inverse',
  'atom.foreground.states.fg-pressed': '--atom-foreground-states-fg-pressed',
  'atom.border.states.border-pressed': '--atom-border-states-border-pressed',
  'atom.foreground.states.fg-pressed-inverse': '--atom-foreground-states-fg-pressed-inverse',
  'atom.border.states.border-hover': '--atom-border-states-border-hover',
  'atom.foreground.primary.fg-brand-hover': '--atom-foreground-primary-fg-brand-hover',
  'atom.background.primary.bg-primary-pressed-brand':
    '--atom-background-primary-bg-primary-pressed-brand',
  'atom.border.selection-and-focus.border-brand-hover':
    '--atom-border-selection-and-focus-border-brand-hover',
  'atom.background.primary.bg-primary-hover-inverse':
    '--atom-background-primary-bg-primary-hover-inverse',
  'atom.border.selection-and-focus.border-secondary-focus':
    '--atom-border-selection-and-focus-border-secondary-focus',
  'atom.background.core.bg-muted': '--atom-background-core-bg-muted',
  'atom.background.alert.bg-success-lightest': '--atom-background-alert-bg-success-lightest',
  'atom.background.alert.bg-warning-lightest': '--atom-background-alert-bg-warning-lightest',
  'atom.background.alert.bg-error-lightest': '--atom-background-alert-bg-error-lightest',
  'atom.background.alert.bg-info-lightest': '--atom-background-alert-bg-info-lightest',
  'atom.background.alert.bg-success-full': '--atom-background-alert-bg-success-full',
  'atom.border.states.border-interactive': '--atom-border-states-border-interactive',
  'atom.background.core.bg-secondary': '--atom-background-core-bg-secondary',
  'atom.background.alert.bg-error-full': '--atom-background-alert-bg-error-full',
  'atom.background.alert.bg-error-hover': '--atom-background-alert-bg-error-hover',
  'atom.background.alert.bg-error-pressed': '--atom-background-alert-bg-error-pressed',
  'atom.foreground.core.fg-tertiary': '--atom-foreground-core-fg-tertiary',
  'atom.background.core.bg-accent': '--atom-background-core-bg-accent',
  'atom.border.default.border-muted': '--atom-border-default-border-muted',
  'atom.border.states.no-interaction': '--atom-border-states-no-interaction',
  'atom.progress-indicator.active-color': '--atom-progress-indicator-active-color',
  'atom.background.primary.accent': '--atom-background-primary-accent',
  'atom.foreground.feedback.fg-error-pressed': '--atom-foreground-feedback-fg-error-pressed',
  'atom.foreground.feedback.fg-error-hover': '--atom-foreground-feedback-fg-error-hover',
};

export function generateCss(
  tokens: BrandTokens,
  selector = '[data-brand="custom"]',
  primitives?: CorePrimitives,
): string {
  const lines = (Object.keys(TOKEN_KEY_TO_CSS_VAR) as SemanticTokenKey[]).map(
    (key) => `  ${TOKEN_KEY_TO_CSS_VAR[key]}: ${tokens[key]};`,
  );
  // Legacy `--color-*` aliases, used by the hero header strip on Brand Foundations
  // and the sidebar logo background. Keep them in sync with primitives.
  if (primitives) {
    lines.push(
      `  --color-brand: ${primitives.brandPrimary};`,
      `  --color-fg-primary: ${primitives.textPrimary};`,
      `  --color-fg-secondary: ${primitives.textSecondary};`,
      `  --color-bg-secondary: ${primitives.backgroundSecondary};`,
      `  --color-border: ${primitives.borderDefault};`,
    );
  }
  return `${selector} {\n${lines.join('\n')}\n}`;
}
