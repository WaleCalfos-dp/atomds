import type { SemanticTokenKey } from './tokens';

export interface BrandSwitcherTokenRow {
  token: string;
  tokenKey?: SemanticTokenKey;
  purpose: string;
  usage: string;
}

/* ───────────────────────────────────────────────────────────────────────────
 * Background – Core
 * ──────────────────────────────────────────────────────────────────────── */

export const BG_CORE: BrandSwitcherTokenRow[] = [
  {
    token: 'bg-overlay',
    tokenKey: 'atom.background.core.bg-overlay',
    purpose: 'Dimmed overlay layer behind modals or drawers',
    usage: 'Used to reduce visual focus on background content',
  },
  {
    token: 'bg-muted',
    tokenKey: 'atom.background.core.bg-muted',
    purpose: 'Subtle neutral background',
    usage: 'Badge, cards, or non-interactive surfaces',
  },
  {
    token: 'bg-accent',
    tokenKey: 'atom.background.core.bg-accent',
    purpose: 'Accent surface for emphasis',
    usage: 'Small highlights, avatars, or visual indicators',
  },
  {
    token: 'bg-secondary',
    tokenKey: 'atom.background.core.bg-secondary',
    purpose: 'Secondary container surface',
    usage: 'Alternating backgrounds or secondary panels',
  },
  {
    token: 'bg-secondary-hover',
    tokenKey: 'atom.background.core.bg-secondary-hover',
    purpose: 'Hover state for secondary surfaces',
    usage: 'Hover state for elements placed on dark/inverse backgrounds',
  },
];

/* ───────────────────────────────────────────────────────────────────────────
 * Background – Primary
 * ──────────────────────────────────────────────────────────────────────── */

export const BG_PRIMARY: BrandSwitcherTokenRow[] = [
  {
    token: 'bg-primary-default',
    tokenKey: 'atom.background.primary.bg-primary-default',
    purpose: 'Base background for primary brand actions',
    usage: 'Buttons, key CTAs, active navigation',
  },
  {
    token: 'bg-primary-hover',
    tokenKey: 'atom.background.primary.bg-primary-hover',
    purpose: 'Hover state for primary actions',
    usage: 'Slightly intensified feedback when hovered',
  },
  {
    token: 'bg-primary-pressed',
    tokenKey: 'atom.background.primary.bg-primary-pressed',
    purpose: 'Active or pressed state',
    usage: 'When primary buttons are clicked or toggled',
  },
  {
    token: 'bg-primary-pressed-brand',
    tokenKey: 'atom.background.primary.bg-primary-pressed-brand',
    purpose: 'Brand-specific pressed colour for distinctive contrast',
    usage: 'Use when brand palettes require stronger state contrast',
  },
  {
    token: 'bg-primary-focus',
    tokenKey: 'atom.background.primary.bg-primary-focus',
    purpose: 'Focus outline background',
    usage: 'For accessible focus states on interactive components',
  },
  {
    token: 'bg-primary-disabled',
    tokenKey: 'atom.background.primary.bg-primary-disabled',
    purpose: 'Disabled state background',
    usage: 'Used for inactive or non-clickable UI',
  },
  {
    token: 'bg-primary-inverse',
    tokenKey: 'atom.background.primary.bg-primary-inverse',
    purpose: 'Inverse variant for dark or brand-coloured surfaces',
    usage: 'Cards, buttons, key CTAs, active navigation',
  },
  {
    token: 'bg-primary-hover-inverse',
    tokenKey: 'atom.background.primary.bg-primary-hover-inverse',
    purpose: 'Hover variant of inverse background',
    usage: 'Used in dark themes or reversed contexts',
  },
  {
    token: 'bg-primary-pressed-inverse',
    tokenKey: 'atom.background.primary.bg-primary-pressed-inverse',
    purpose: 'Pressed state for inverse backgrounds',
    usage: 'For dark or coloured UI areas',
  },
  {
    token: 'bg-primary-focus-inverse',
    tokenKey: 'atom.background.primary.bg-primary-focus-inverse',
    purpose: 'Focus outline on inverse backgrounds',
    usage: 'Maintains contrast on dark surfaces',
  },
  {
    token: 'bg-primary-disabled-inverse',
    tokenKey: 'atom.background.primary.bg-primary-disabled-inverse',
    purpose: 'Disabled inverse state',
    usage: 'For non-interactive elements on dark or coloured backgrounds',
  },
  {
    token: 'accent',
    tokenKey: 'atom.background.primary.accent',
    purpose: 'Brand accent background surface',
    usage: 'Highlight elements that need strong brand presence, such as accent bars or brand badges',
  },
];

/* ───────────────────────────────────────────────────────────────────────────
 * Background – Alert
 * ──────────────────────────────────────────────────────────────────────── */

export const BG_ALERT: BrandSwitcherTokenRow[] = [
  {
    token: 'bg-success-full',
    tokenKey: 'atom.background.alert.bg-success-full',
    purpose: 'Strong success background',
    usage: 'Positive confirmation backgrounds (toast, success tag)',
  },
  {
    token: 'bg-success-light',
    tokenKey: 'atom.background.alert.bg-success-light',
    purpose: 'Light success tint',
    usage: 'Mild success states (form completion)',
  },
  {
    token: 'bg-success-lightest',
    tokenKey: 'atom.background.alert.bg-success-lightest',
    purpose: 'Subtle success surface',
    usage: 'Large success backgrounds',
  },
  {
    token: 'bg-warning-default',
    tokenKey: 'atom.background.alert.bg-warning-default',
    purpose: 'Warning surface',
    usage: 'Alerts that need attention without urgency',
  },
  {
    token: 'bg-warning-lightest',
    tokenKey: 'atom.background.alert.bg-warning-lightest',
    purpose: 'Light warning tint',
    usage: 'For passive warnings or guidance',
  },
  {
    token: 'bg-info-default',
    tokenKey: 'atom.background.alert.bg-info-default',
    purpose: 'Informational surface',
    usage: 'Used for hints, help panels, or notifications',
  },
  {
    token: 'bg-info-lightest',
    tokenKey: 'atom.background.alert.bg-info-lightest',
    purpose: 'Light informational tint',
    usage: 'Subtle background for info banners',
  },
  {
    token: 'bg-error-full',
    tokenKey: 'atom.background.alert.bg-error-full',
    purpose: 'Critical or destructive background',
    usage: 'Error banners or destructive actions',
  },
  {
    token: 'bg-error-pressed',
    tokenKey: 'atom.background.alert.bg-error-pressed',
    purpose: 'Pressed error state',
    usage: 'When a destructive button is clicked',
  },
  {
    token: 'bg-error-hover',
    tokenKey: 'atom.background.alert.bg-error-hover',
    purpose: 'Hover error state',
    usage: 'Before confirmation of a destructive action',
  },
  {
    token: 'bg-error-light',
    tokenKey: 'atom.background.alert.bg-error-light',
    purpose: 'Light error tint',
    usage: 'Gentle feedback for minor validation errors',
  },
  {
    token: 'bg-error-lightest',
    tokenKey: 'atom.background.alert.bg-error-lightest',
    purpose: 'Subtle error background',
    usage: 'Use behind text or icons indicating an issue',
  },
];

/* ───────────────────────────────────────────────────────────────────────────
 * Border – Core
 * ──────────────────────────────────────────────────────────────────────── */

export const BORDER_CORE_TOKENS: BrandSwitcherTokenRow[] = [
  {
    token: 'border-default',
    tokenKey: 'atom.border.default.border-default',
    purpose: 'Neutral outline colour',
    usage: 'General border - Input fields, Interactive cards etc.',
  },
  {
    token: 'border-default-brand',
    tokenKey: 'atom.border.default.border-default-brand',
    purpose: 'Brand-coloured default border',
    usage: 'Containers or sections needing brand accent',
  },
  {
    token: 'border-divider',
    tokenKey: 'atom.border.default.border-divider',
    purpose: 'Divider between grouped items',
    usage: 'Lists, tables, or content sections',
  },
  {
    token: 'border-muted',
    tokenKey: 'atom.border.default.border-muted',
    purpose: 'Subtle divider',
    usage: 'Light or background dividers',
  },
];

/* ───────────────────────────────────────────────────────────────────────────
 * Border – States
 * ──────────────────────────────────────────────────────────────────────── */

export const BORDER_STATES_TOKENS: BrandSwitcherTokenRow[] = [
  {
    token: 'border-primary-focus',
    tokenKey: 'atom.border.selection-and-focus.border-primary-focus',
    purpose: 'Primary focus outline',
    usage: 'Buttons and inputs during keyboard focus',
  },
  {
    token: 'border-secondary-focus',
    tokenKey: 'atom.border.selection-and-focus.border-secondary-focus',
    purpose: 'Secondary focus outline',
    usage: 'Neutral or low-priority elements',
  },
  {
    token: 'border-hover',
    tokenKey: 'atom.border.states.border-hover',
    purpose: 'Hover border color',
    usage: 'Components on hover (where applicable)',
  },
  {
    token: 'border-interactive',
    tokenKey: 'atom.border.states.border-interactive',
    purpose: 'Active or clickable border',
    usage: 'Inputs, buttons, or controls',
  },
  {
    token: 'border-brand-hover',
    tokenKey: 'atom.border.selection-and-focus.border-brand-hover',
    purpose: 'Hover border using brand colour',
    usage: 'Brand buttons or tabs',
  },
  {
    token: 'border-selected',
    tokenKey: 'atom.border.selection-and-focus.border-selected',
    purpose: 'Border for selected elements',
    usage: 'Cards, chips, or toggled options',
  },
  {
    token: 'border-pressed',
    tokenKey: 'atom.border.states.border-pressed',
    purpose: 'Active border colour',
    usage: 'Pressed or clicked state outlines',
  },
  {
    token: 'border-disabled',
    tokenKey: 'atom.border.states.border-disabled',
    purpose: 'Disabled state border',
    usage: 'Disabled fields or inactive areas',
  },
];

/* ───────────────────────────────────────────────────────────────────────────
 * Border – Feedback
 * ──────────────────────────────────────────────────────────────────────── */

export const BORDER_FEEDBACK_TOKENS: BrandSwitcherTokenRow[] = [
  {
    token: 'success-border-color',
    tokenKey: 'atom.border.feedback.success-border-color',
    purpose: 'Success state outline',
    usage: 'Valid inputs, success banners',
  },
  {
    token: 'border-warning',
    tokenKey: 'atom.border.feedback.border-warning',
    purpose: 'Warning outline',
    usage: 'Attention states or caution borders',
  },
  {
    token: 'border-error',
    tokenKey: 'atom.border.feedback.border-error',
    purpose: 'Error outline',
    usage: 'Invalid inputs, destructive confirmations',
  },
  {
    token: 'border-info',
    tokenKey: 'atom.border.feedback.border-info',
    purpose: 'Informational outline',
    usage: 'Informative alert, callouts or tooltips',
  },
  {
    token: 'no-interaction',
    tokenKey: 'atom.border.states.no-interaction',
    purpose: 'Non-interactive static border',
    usage: 'Static cards or visual grouping',
  },
];

/* ───────────────────────────────────────────────────────────────────────────
 * Foreground – Core
 * ──────────────────────────────────────────────────────────────────────── */

export const FG_CORE: BrandSwitcherTokenRow[] = [
  {
    token: 'fg-primary',
    tokenKey: 'atom.foreground.core.fg-primary',
    purpose: 'Default text colour',
    usage: 'Primary text, body copy',
  },
  {
    token: 'fg-secondary',
    tokenKey: 'atom.foreground.core.fg-secondary',
    purpose: 'Secondary text colour',
    usage: 'Subtitles, secondary labels',
  },
  {
    token: 'fg-tertiary',
    tokenKey: 'atom.foreground.core.fg-tertiary',
    purpose: 'Tertiary or placeholder text',
    usage: 'Hint text or placeholders',
  },
  {
    token: 'fg-interactive-icon',
    tokenKey: 'atom.foreground.core.fg-interactive-icon',
    purpose: 'Icon colour for interactive components',
    usage: 'Buttons, menus, navigation icons',
  },
  {
    token: 'fg-link',
    tokenKey: 'atom.foreground.core.fg-link',
    purpose: 'Link or CTA text colour',
    usage: 'Inline links or hyperlink text',
  },
];

/* ───────────────────────────────────────────────────────────────────────────
 * Foreground – Primary
 * ──────────────────────────────────────────────────────────────────────── */

export const FG_PRIMARY: BrandSwitcherTokenRow[] = [
  {
    token: 'fg-brand-primary',
    tokenKey: 'atom.foreground.primary.fg-brand-primary',
    purpose: 'Primary brand text or icon',
    usage: 'Brand emphasis text or icon',
  },
  {
    token: 'fg-brand-primary-inverse',
    tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse',
    purpose: 'Inverse for text over brand backgrounds',
    usage: 'Text or icons on primary brand fills',
  },
  {
    token: 'fg-brand-secondary',
    tokenKey: 'atom.foreground.primary.fg-brand-secondary',
    purpose: 'Secondary brand tone',
    usage: 'Smaller brand elements or accents',
  },
  {
    token: 'fg-brand-hover',
    tokenKey: 'atom.foreground.primary.fg-brand-hover',
    purpose: 'Hover variant of brand colour',
    usage: 'Links or icons when hovered',
  },
];

/* ───────────────────────────────────────────────────────────────────────────
 * Foreground – States
 * ──────────────────────────────────────────────────────────────────────── */

export const FG_STATES: BrandSwitcherTokenRow[] = [
  {
    token: 'fg-hover',
    tokenKey: 'atom.foreground.states.fg-hover',
    purpose: 'Hovered text or icon',
    usage: 'Buttons, navigation links',
  },
  {
    token: 'fg-pressed',
    tokenKey: 'atom.foreground.states.fg-pressed',
    purpose: 'Pressed or active text/icon',
    usage: 'Toggled buttons or active menu items',
  },
  {
    token: 'fg-pressed-inverse',
    tokenKey: 'atom.foreground.states.fg-pressed-inverse',
    purpose: 'Pressed variant on dark or brand surfaces',
    usage: 'Dark mode or inverse states',
  },
  {
    token: 'fg-disabled',
    tokenKey: 'atom.foreground.states.fg-disabled',
    purpose: 'Disabled text and icon colour',
    usage: 'Non-interactive states',
  },
  {
    token: 'fg-disabled-inverse',
    tokenKey: 'atom.foreground.states.fg-disabled-inverse',
    purpose: 'Disabled text and icon on dark backgrounds',
    usage: 'Inverse themes',
  },
];

/* ───────────────────────────────────────────────────────────────────────────
 * Foreground – Feedback
 * ──────────────────────────────────────────────────────────────────────── */

export const FG_FEEDBACK: BrandSwitcherTokenRow[] = [
  {
    token: 'fg-success',
    tokenKey: 'atom.foreground.feedback.fg-success',
    purpose: 'Text or icon colour for success messages',
    usage: 'Validation, confirmation, success banners',
  },
  {
    token: 'fg-warning',
    tokenKey: 'atom.foreground.feedback.fg-warning',
    purpose: 'Text or icon for warnings',
    usage: 'Mild caution or non-blocking alerts',
  },
  {
    token: 'fg-error',
    tokenKey: 'atom.foreground.feedback.fg-error',
    purpose: 'Text or icon for errors',
    usage: 'Destructive or invalid states',
  },
  {
    token: 'fg-info',
    tokenKey: 'atom.foreground.feedback.fg-info',
    purpose: 'Text or icon for information',
    usage: 'Help, hints, or contextual guidance',
  },
  {
    token: 'fg-error-hover',
    tokenKey: 'atom.foreground.feedback.fg-error-hover',
    purpose: 'Hover state for error text or icons',
    usage: 'Error links, destructive action labels on hover',
  },
  {
    token: 'fg-error-pressed',
    tokenKey: 'atom.foreground.feedback.fg-error-pressed',
    purpose: 'Pressed state for error text or icons',
    usage: 'Error links, destructive action labels when clicked or active',
  },
];

/* ───────────────────────────────────────────────────────────────────────────
 * Progress Indicator
 * ──────────────────────────────────────────────────────────────────────── */

export const PROGRESS_INDICATOR: BrandSwitcherTokenRow[] = [
  {
    token: 'active-color',
    tokenKey: 'atom.progress-indicator.active-color',
    purpose: 'Active colour for progress indicators',
    usage: 'Step indicators, loading bars, and active progress segments',
  },
];
