import { type SemanticTokenKey } from './tokens';

export interface BorderTokenRow {
  token: string;
  tokenKey?: SemanticTokenKey;
  use: string;
}

export const BORDER_CORE: BorderTokenRow[] = [
  { token: 'border-weight-1', use: 'Standard 1px border weight used across most components' },
  { token: 'border-weight-2', use: 'Stronger 2px weight used for focus and selected states' },
];

export const BORDER_DEFAULT: BorderTokenRow[] = [
  { token: 'border-default', tokenKey: 'atom.border.default.border-default', use: 'Standard neutral border for components' },
  { token: 'border-default-brand', tokenKey: 'atom.border.default.border-default-brand', use: 'Neutral border tuned for brand-based surfaces' },
  { token: 'border-divider', tokenKey: 'atom.border.default.border-divider', use: 'Subtle dividing lines for layout separation' },
  { token: 'border-muted', tokenKey: 'atom.border.default.border-muted', use: 'Low-contrast borders for low-priority UI elements' },
];

export const BORDER_FEEDBACK: BorderTokenRow[] = [
  { token: 'success-border-color', tokenKey: 'atom.border.feedback.success-border-color', use: 'Success confirmation or valid input' },
  { token: 'border-warning', tokenKey: 'atom.border.feedback.border-warning', use: 'Warnings and caution states' },
  { token: 'border-error', tokenKey: 'atom.border.feedback.border-error', use: 'Errors and invalid input' },
  { token: 'border-info', tokenKey: 'atom.border.feedback.border-info', use: 'Informational messages or neutral alerts' },
];

export const BORDER_SELECTION_FOCUS: BorderTokenRow[] = [
  { token: 'border-selected', tokenKey: 'atom.border.selection-and-focus.border-selected', use: 'Selected items, active tabs, and chosen elements' },
  { token: 'border-primary-focus', tokenKey: 'atom.border.selection-and-focus.border-primary-focus', use: 'Primary focus ring for accessibility and keyboard navigation' },
  { token: 'border-secondary-focus', tokenKey: 'atom.border.selection-and-focus.border-secondary-focus', use: 'Secondary focus ring for nested or layered components' },
  { token: 'border-brand-hover', tokenKey: 'atom.border.selection-and-focus.border-brand-hover', use: 'Brand-tinted hover state' },
];

export const BORDER_STATES: BorderTokenRow[] = [
  { token: 'border-hover', tokenKey: 'atom.border.states.border-hover', use: 'Hover state for interactive elements' },
  { token: 'border-pressed', tokenKey: 'atom.border.states.border-pressed', use: 'Pressed or active-press state' },
  { token: 'border-interactive', tokenKey: 'atom.border.states.border-interactive', use: 'Enhanced border for elements that must appear clickable by default' },
  { token: 'border-disabled', tokenKey: 'atom.border.states.border-disabled', use: 'Reduced-contrast border for disabled components' },
  { token: 'no-interaction', tokenKey: 'atom.border.states.no-interaction', use: 'For elements that should not show any interactive response' },
];
