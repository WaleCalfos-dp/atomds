import { type SemanticTokenKey } from './tokens';

// ─── Types ──────────────────────────────────────────────────────────────────

export type CSSPropertyKind =
  | 'text'        // CSS color / SVG fill on text
  | 'background'  // backgroundColor / background
  | 'border'      // borderColor / border-* / box-side borders
  | 'icon-fill'   // SVG <path fill>
  | 'icon-stroke' // SVG <path stroke>
  | 'outline'     // outline / focus ring
  | 'shadow';     // box-shadow

// Where a binding was observed.
// - 'react' = present as `var(--atom-…)` in a *Live.tsx file (rendered by docs).
// - 'figma' = present in the Atom Figma component set's variable bindings, but
//   not implemented in the React Live preview (typically state variants:
//   hover, pressed, focus, error-hover, etc.). Verified via MCP introspection.
export type BindingSource = 'react' | 'figma';

export interface TokenUsage {
  component: string;
  componentPath: string;
  componentFile: string;
  property: CSSPropertyKind;
  description: string;
  scope?: string;
  source?: BindingSource; // default 'react'
}

export type TokenCategory =
  | 'foreground.core'
  | 'foreground.primary'
  | 'foreground.feedback'
  | 'foreground.states'
  | 'background.primary'
  | 'background.core'
  | 'background.alert'
  | 'border.default'
  | 'border.states'
  | 'border.selection-and-focus'
  | 'border.feedback'
  | 'progress-indicator';

export const CATEGORY_LABELS: Record<TokenCategory, string> = {
  'foreground.core': 'Foreground / Core',
  'foreground.primary': 'Foreground / Primary',
  'foreground.feedback': 'Foreground / Feedback',
  'foreground.states': 'Foreground / States',
  'background.primary': 'Background / Primary',
  'background.core': 'Background / Core',
  'background.alert': 'Background / Alert',
  'border.default': 'Border / Default',
  'border.states': 'Border / States',
  'border.selection-and-focus': 'Border / Selection & Focus',
  'border.feedback': 'Border / Feedback',
  'progress-indicator': 'Progress Indicator',
};

export const CATEGORY_ORDER: TokenCategory[] = [
  'foreground.core',
  'foreground.primary',
  'foreground.feedback',
  'foreground.states',
  'background.primary',
  'background.core',
  'background.alert',
  'border.default',
  'border.states',
  'border.selection-and-focus',
  'border.feedback',
  'progress-indicator',
];

export function tokenCategory(key: SemanticTokenKey): TokenCategory {
  const stripped = key.replace(/^atom\./, '');
  const parts = stripped.split('.');
  if (parts[0] === 'progress-indicator') return 'progress-indicator';
  return `${parts[0]}.${parts[1]}` as TokenCategory;
}

// Short name = last segment after the final dot.
export function tokenShortName(key: SemanticTokenKey): string {
  const parts = key.split('.');
  return parts[parts.length - 1];
}

// CSS variable: dot/segment → dash, prefix --atom-
export function tokenCssVar(key: SemanticTokenKey): string {
  return '--' + key.replace(/\./g, '-');
}

// ─── Designer-readable purpose for every token ───────────────────────────────

export const TOKEN_PURPOSE: Record<SemanticTokenKey, string> = {
  'atom.foreground.core.fg-primary': 'Default body text.',
  'atom.foreground.core.fg-interactive-icon': 'Interactive icon fill (links, chevrons, decorative icons).',
  'atom.foreground.core.fg-secondary': 'Secondary / supporting text.',
  'atom.foreground.core.fg-link': 'Anchor / link colour.',
  'atom.foreground.core.fg-tertiary': 'Tertiary text and divider glyphs.',
  'atom.foreground.primary.fg-brand-primary': 'Brand colour for emphasis text and headings.',
  'atom.foreground.primary.fg-brand-primary-inverse': 'Text on brand-coloured backgrounds.',
  'atom.foreground.primary.fg-brand-secondary': 'Brand secondary text — softer emphasis.',
  'atom.foreground.primary.fg-brand-hover': 'Brand text on hover.',
  'atom.foreground.feedback.fg-success': 'Success text / icon.',
  'atom.foreground.feedback.fg-warning': 'Warning text / icon.',
  'atom.foreground.feedback.fg-error': 'Error text / icon.',
  'atom.foreground.feedback.fg-info': 'Info text / icon.',
  'atom.foreground.feedback.fg-error-pressed': 'Error text in pressed state.',
  'atom.foreground.feedback.fg-error-hover': 'Error text on hover.',
  'atom.foreground.states.fg-disabled': 'Disabled text.',
  'atom.foreground.states.fg-hover': 'Hover text.',
  'atom.foreground.states.fg-disabled-inverse': 'Disabled text on dark surfaces.',
  'atom.foreground.states.fg-pressed': 'Pressed text (current breadcrumb item, depressed link).',
  'atom.foreground.states.fg-pressed-inverse': 'Pressed text on dark surfaces.',
  'atom.background.primary.bg-primary-default': 'Solid primary brand surface (e.g. primary Button).',
  'atom.background.primary.bg-primary-inverse': 'Inverse / white surface.',
  'atom.background.primary.bg-primary-disabled': 'Disabled surface.',
  'atom.background.primary.bg-primary-hover': 'Primary hover surface.',
  'atom.background.primary.bg-primary-pressed': 'Primary pressed surface.',
  'atom.background.primary.bg-primary-focus': 'Focused primary surface.',
  'atom.background.primary.bg-primary-focus-inverse': 'Focus overlay on white surfaces.',
  'atom.background.primary.bg-primary-pressed-inverse': 'Pressed overlay on white surfaces.',
  'atom.background.primary.bg-primary-disabled-inverse': 'Disabled overlay on white surfaces.',
  'atom.background.primary.bg-primary-pressed-brand': 'Brand-coloured pressed / active surface.',
  'atom.background.primary.bg-primary-hover-inverse': 'Hover overlay on white surfaces.',
  'atom.background.primary.accent': 'Brand accent surface (decorative).',
  'atom.background.core.bg-overlay': 'Modal scrim / overlay backdrop.',
  'atom.background.core.bg-secondary-hover': 'Secondary hover overlay.',
  'atom.background.core.bg-muted': 'Muted / subtle surface for placeholders, hover washes, attached panels.',
  'atom.background.core.bg-secondary': 'Secondary page or card surface.',
  'atom.background.core.bg-accent': 'Decorative accent block — explicitly distinct from brand primary.',
  'atom.background.alert.bg-success-light': 'Light success surface (containers).',
  'atom.background.alert.bg-warning-default': 'Default warning surface (containers).',
  'atom.background.alert.bg-error-light': 'Light error surface (containers).',
  'atom.background.alert.bg-info-default': 'Default info surface (containers).',
  'atom.background.alert.bg-success-lightest': 'Subtlest success tint (row washes, callouts).',
  'atom.background.alert.bg-warning-lightest': 'Subtlest warning tint.',
  'atom.background.alert.bg-error-lightest': 'Subtlest error tint.',
  'atom.background.alert.bg-info-lightest': 'Subtlest info tint.',
  'atom.background.alert.bg-success-full': 'Solid success fill (toast solid bg, success Badge with white text).',
  'atom.background.alert.bg-error-full': 'Solid error fill (destructive Button, error Toast solid).',
  'atom.background.alert.bg-error-hover': 'Error surface on hover.',
  'atom.background.alert.bg-error-pressed': 'Error surface when pressed.',
  'atom.border.default.border-default': 'Default border / outline.',
  'atom.border.default.border-divider': 'Subtle divider line (between rows, sections).',
  'atom.border.default.border-default-brand': 'Brand-coloured border (secondary buttons, selected toggles).',
  'atom.border.default.border-muted': 'Muted / semi-transparent border.',
  'atom.border.states.border-disabled': 'Disabled border.',
  'atom.border.states.border-pressed': 'Pressed border.',
  'atom.border.states.border-hover': 'Hover border.',
  'atom.border.states.border-interactive': 'Interactive border (link-like).',
  'atom.border.states.no-interaction': 'Non-interactive neutral border.',
  'atom.border.selection-and-focus.border-primary-focus': 'Focus ring (primary).',
  'atom.border.selection-and-focus.border-selected': 'Selected-state border or underline.',
  'atom.border.selection-and-focus.border-brand-hover': 'Brand hover focus.',
  'atom.border.selection-and-focus.border-secondary-focus': 'Secondary focus (alpha-reduced).',
  'atom.border.feedback.border-error': 'Error border.',
  'atom.border.feedback.border-warning': 'Warning border.',
  'atom.border.feedback.success-border-color': 'Success border.',
  'atom.border.feedback.border-info': 'Info border.',
  'atom.progress-indicator.active-color': 'Active segment fill on filled progress bars / circular indicators.',
};

// ─── Slug helpers ───────────────────────────────────────────────────────────

export function tokenToSlug(key: SemanticTokenKey): string {
  return key.replace(/^atom\./, '').replace(/\./g, '-');
}

const SLUG_TO_KEY: Map<string, SemanticTokenKey> = new Map(
  (Object.keys(TOKEN_PURPOSE) as SemanticTokenKey[]).map((k) => [tokenToSlug(k), k]),
);

export function slugToToken(slug: string): SemanticTokenKey | null {
  return SLUG_TO_KEY.get(slug) ?? null;
}

// ─── Component metadata catalogue ───────────────────────────────────────────
// Pulled from the 33 *Live.tsx files. Used to keep TOKEN_USAGE entries compact.

const C = {
  Accordion:       { component: 'Accordion',         componentPath: '/components/accordion',          componentFile: 'src/components/accordion/AccordionLive.tsx' },
  Alert:           { component: 'Alert',             componentPath: '/components/alert',              componentFile: 'src/components/alert/AlertLive.tsx' },
  Avatar:          { component: 'Avatar',            componentPath: '/components/avatar',             componentFile: 'src/components/avatar/AvatarLive.tsx' },
  Badge:           { component: 'Badge',             componentPath: '/components/badge',              componentFile: 'src/components/badge/BadgeLive.tsx' },
  Breadcrumbs:     { component: 'Breadcrumbs',       componentPath: '/components/breadcrumbs',        componentFile: 'src/components/breadcrumbs/BreadcrumbsLive.tsx' },
  Button:          { component: 'Button',            componentPath: '/components/button',             componentFile: 'src/components/button/ButtonLive.tsx' },
  ButtonGroup:     { component: 'Button Group',      componentPath: '/components/button-group',       componentFile: 'src/components/button-group/ButtonGroupLive.tsx' },
  Card:            { component: 'Card',              componentPath: '/components/card',               componentFile: 'src/components/card/CardLive.tsx' },
  TransportCard:   { component: 'Transport Card',    componentPath: '/components/transport-card',     componentFile: 'src/components/card/TransportCardLive.tsx' },
  Checkbox:        { component: 'Checkbox',          componentPath: '/components/checkbox',           componentFile: 'src/components/checkbox/CheckboxLive.tsx' },
  DataGroup:       { component: 'Data Group',        componentPath: '/components/data-group',         componentFile: 'src/components/data-row/DataGroupLive.tsx' },
  DataGroupNoSlot: { component: 'Data Group (No Slot)', componentPath: '/components/data-group-no-slot', componentFile: 'src/components/data-row/DataGroupNoSlotLive.tsx' },
  DataRow:         { component: 'Data Row',          componentPath: '/components/data-row',           componentFile: 'src/components/data-row/DataRowLive.tsx' },
  DatePicker:      { component: 'Date Picker',       componentPath: '/components/date-picker',        componentFile: 'src/components/date-picker/DatePickerLive.tsx' },
  Dialog:          { component: 'Dialog',            componentPath: '/components/dialog',             componentFile: 'src/components/dialog/DialogLive.tsx' },
  Divider:         { component: 'Divider',           componentPath: '/components/divider',            componentFile: 'src/components/divider/DividerLive.tsx' },
  Input:           { component: 'Input',             componentPath: '/components/input',              componentFile: 'src/components/input/InputLive.tsx' },
  LineItem:        { component: 'Line Item',         componentPath: '/components/line-item',          componentFile: 'src/components/line-item/LineItemLive.tsx' },
  ListItem:        { component: 'List Item',         componentPath: '/components/list-item',          componentFile: 'src/components/list-item/ListItemLive.tsx' },
  Media:           { component: 'Media',             componentPath: '/components/media',              componentFile: 'src/components/media/MediaLive.tsx' },
  ProgressIndicator: { component: 'Progress Indicator', componentPath: '/components/progress-indicator', componentFile: 'src/components/progress-indicator/ProgressIndicatorLive.tsx' },
  QRCode:          { component: 'QR Code',           componentPath: '/components/qr-code',            componentFile: 'src/components/qr-code/QRCodeLive.tsx' },
  QuantityStepper: { component: 'Quantity Stepper',  componentPath: '/components/quantity-stepper',   componentFile: 'src/components/quantity-stepper/QuantityStepperLive.tsx' },
  Select:          { component: 'Select',            componentPath: '/components/select',             componentFile: 'src/components/select/SelectLive.tsx' },
  Steps:           { component: 'Steps',             componentPath: '/components/steps',              componentFile: 'src/components/steps/StepsLive.tsx' },
  Switch:          { component: 'Switch',            componentPath: '/components/switch',             componentFile: 'src/components/switch/SwitchLive.tsx' },
  Tabs:            { component: 'Tabs',              componentPath: '/components/tabs',               componentFile: 'src/components/tabs/TabsLive.tsx' },
  Tags:            { component: 'Tags',              componentPath: '/components/tags',               componentFile: 'src/components/tags/TagsLive.tsx' },
  Tiles:           { component: 'Tiles',             componentPath: '/components/tiles',              componentFile: 'src/components/tiles/TilesLive.tsx' },
  TimePicker:      { component: 'Time Picker',       componentPath: '/components/time-picker',        componentFile: 'src/components/time-picker/TimePickerLive.tsx' },
  Toast:           { component: 'Toast',             componentPath: '/components/toast',              componentFile: 'src/components/toast/ToastLive.tsx' },
  Tooltip:         { component: 'Tooltip',           componentPath: '/components/tooltip',            componentFile: 'src/components/tooltip/TooltipLive.tsx' },
} as const;

// ─── Token → component bindings ──────────────────────────────────────────────
// Hand-curated from every var(--atom-*) usage in the 33 *Live.tsx files.
// Tokens with no bindings are present with an empty array.

export const TOKEN_USAGE: Record<SemanticTokenKey, TokenUsage[]> = {
  'atom.foreground.core.fg-primary': [
    { ...C.Accordion,         property: 'text',       description: 'Item element / body text in the default state.', scope: 'when state === "default"' },
    { ...C.Alert,             property: 'text',       description: 'Body text in every Alert variant (info, success, warning, error, muted).' },
    { ...C.Avatar,            property: 'text',       description: 'Initials text on the neutral fallback fill.', scope: 'when type === "neutral"' },
    { ...C.Badge,             property: 'text',       description: 'Label text on tonal Badges (Success, Warning, Error, Information, Muted).', scope: 'when variant !== "Brand"' },
    { ...C.Breadcrumbs,       property: 'text',       description: 'Intermediate breadcrumb link text.', scope: 'when not the current item' },
    { ...C.ButtonGroup,       property: 'text',       description: 'Helper text below the button group.' },
    { ...C.Card,              property: 'text',       description: 'Card body / supporting copy.' },
    { ...C.TransportCard,     property: 'text',       description: 'Body / detail text rows.' },
    { ...C.Checkbox,          property: 'text',       description: 'Checkbox label text.' },
    { ...C.DataRow,           property: 'text',       description: 'Body text within a row.' },
    { ...C.Dialog,            property: 'text',       description: 'Dialog body copy and the close-affordance label.' },
    { ...C.Input,             property: 'text',       description: 'Input value & label text.' },
    { ...C.LineItem,          property: 'text',       description: 'Default body text when the row is not selected.', scope: 'when !selected' },
    { ...C.ListItem,          property: 'text',       description: 'Item label / supporting text.' },
    { ...C.ProgressIndicator, property: 'text',       description: 'Indicator caption when active.', scope: 'when !disabled' },
    { ...C.QRCode,            property: 'text',       description: 'Caption / value label below the QR code.' },
    { ...C.Steps,             property: 'text',       description: 'Step label text (active and completed steps).' },
    { ...C.Switch,            property: 'text',       description: 'Switch label text in the unselected state.', scope: 'when !checked' },
    { ...C.Tabs,              property: 'text',       description: 'Inactive tab label colour.', scope: 'when !active' },
    { ...C.Tags,              property: 'text',       description: 'Tag label text in the default state.', scope: 'when default state' },
  ],
  'atom.foreground.primary.fg-brand-primary': [
    { ...C.Accordion,         property: 'text',       description: 'Expanded section title.', scope: 'when state === "default"' },
    { ...C.Button,            property: 'text',       description: 'Label colour on Secondary, Inverse and segmented variants.', scope: 'when variant ∈ {secondary, inverse, segmented}' },
    { ...C.ButtonGroup,       property: 'text',       description: 'Label on the secondary/inverse button.' },
    { ...C.Card,              property: 'text',       description: 'Card title and decorative accent.' },
    { ...C.TransportCard,     property: 'text',       description: 'Card title.' },
    { ...C.DataRow,           property: 'text',       description: 'Value text and primary action label.' },
    { ...C.Dialog,            property: 'text',       description: 'Dialog title.' },
    { ...C.LineItem,          property: 'text',       description: 'Title / value emphasis when the row is not selected.', scope: 'when !selected' },
    { ...C.ListItem,          property: 'text',       description: 'Brand-emphasised label / title text.' },
    { ...C.ProgressIndicator, property: 'text',       description: 'Indicator title / current-value label.' },
    { ...C.QRCode,            property: 'text',       description: 'QR pixel fill (or background, depending on theme polarity).', scope: 'theme polarity dependent' },
    { ...C.QuantityStepper,   property: 'text',       description: 'Numeric value and label text.' },
    { ...C.Select,            property: 'text',       description: 'Label and selected-value text.' },
    { ...C.Switch,            property: 'text',       description: 'Switch label text when checked.', scope: 'when checked' },
    { ...C.Tabs,              property: 'text',       description: 'Active tab label (segmented + underline variants).', scope: 'when active' },
    { ...C.Tiles,             property: 'text',       description: 'Tile title / primary text.' },
    { ...C.Toast,             property: 'text',       description: 'Toast body text.' },
  ],
  'atom.foreground.core.fg-interactive-icon': [
    { ...C.Input,             property: 'text',       description: 'Info icon fill (CSS color cascaded into SVG) and prefix/suffix glyph colour.' },
  ],
  'atom.background.primary.bg-primary-default': [
    { ...C.Badge,             property: 'background', description: 'Solid Brand Badge fill.', scope: 'when variant === "Brand"' },
    { ...C.Button,            property: 'background', description: 'Primary and Toggle button surface.', scope: 'when variant ∈ {primary, toggle}' },
    { ...C.ButtonGroup,       property: 'background', description: 'Primary segment fill.' },
    { ...C.Dialog,            property: 'background', description: 'Primary action button surface.' },
    { ...C.Tabs,              property: 'background', description: 'Active pill background on the dark-pill variant.', scope: 'when variant === "pill" && active' },
    { ...C.Tooltip,           property: 'background', description: 'Tooltip body fill and arrow colour (all four directions).' },
    { ...C.TransportCard,     property: 'background', description: 'Brand colour bar / pressed state surface.' },
  ],
  'atom.background.primary.bg-primary-inverse': [
    { ...C.Alert,             property: 'background', description: 'Close-button fill on coloured Alert containers.' },
    { ...C.Button,            property: 'background', description: 'Inverse / segmented button surface.', scope: 'when variant ∈ {inverse, segmented}' },
    { ...C.ButtonGroup,       property: 'background', description: 'Secondary button surface and group panel surface.' },
    { ...C.Card,              property: 'background', description: 'Card surface.' },
    { ...C.TransportCard,     property: 'background', description: 'Card surface.' },
    { ...C.DataGroup,         property: 'background', description: 'Group surface.' },
    { ...C.DataGroupNoSlot,   property: 'background', description: 'Group surface.' },
    { ...C.DatePicker,        property: 'background', description: 'Calendar surface.' },
    { ...C.Dialog,            property: 'background', description: 'Dialog surface.' },
    { ...C.Input,             property: 'background', description: 'Input field surface (default state).', scope: 'when !disabled' },
    { ...C.ListItem,          property: 'background', description: 'List item surface (default).' },
    { ...C.QRCode,            property: 'background', description: 'QR code background (or pixel fill on inverse theme).', scope: 'theme polarity dependent' },
    { ...C.QuantityStepper,   property: 'background', description: 'Stepper surface.' },
    { ...C.Select,            property: 'background', description: 'Trigger surface (default) and dropdown menu surface.' },
    { ...C.Tabs,              property: 'background', description: 'Active pill background on the light-pill variant.', scope: 'when variant === "pill" && active' },
    { ...C.Tags,              property: 'background', description: 'Default tag fill.', scope: 'when default state' },
    { ...C.Tiles,             property: 'background', description: 'Tile surface.' },
    { ...C.Toast,             property: 'background', description: 'Toast surface.' },
  ],
  'atom.border.default.border-default': [
    { ...C.ButtonGroup,       property: 'border',     description: 'Inter-segment divider on a connected group.' },
    { ...C.DatePicker,        property: 'border',     description: 'Calendar grid and outer border.' },
    { ...C.DataGroup,         property: 'border',     description: 'Outer border.' },
    { ...C.DataGroupNoSlot,   property: 'border',     description: 'Outer border.' },
    { ...C.Dialog,            property: 'border',     description: 'Dialog edge and Tertiary action button outline.' },
    { ...C.Input,             property: 'border',     description: 'Input outline (rest state).', scope: 'when default state' },
    { ...C.ListItem,          property: 'border',     description: 'Default item outline.' },
    { ...C.QRCode,            property: 'border',     description: 'Outer container border.' },
    { ...C.QuantityStepper,   property: 'border',     description: 'Stepper outline and segment dividers.' },
    { ...C.Select,            property: 'border',     description: 'Trigger outline (default + muted/disabled fall-back).', scope: 'default and disabled states' },
    { ...C.Tabs,              property: 'border',     description: 'Bottom rule below the tab strip (underline variant).', scope: 'when variant === "underline"' },
    { ...C.Tags,              property: 'border',     description: 'Default tag outline.', scope: 'when default state' },
    { ...C.Tiles,             property: 'border',     description: 'Tile outline.' },
    { ...C.TimePicker,        property: 'border',     description: 'Dashed placeholder border around the time slot.' },
    { ...C.TransportCard,     property: 'border',     description: 'Outer border and ticket perforation lines.' },
  ],
  'atom.border.default.border-divider': [
    { ...C.Accordion,         property: 'border',     description: 'Section divider line between accordion items.' },
    { ...C.Card,              property: 'border',     description: 'Card outline.' },
    { ...C.DataRow,           property: 'border',     description: 'Row separator below each data row.' },
    { ...C.Divider,           property: 'border',     description: 'The divider line itself (solid or dashed).' },
    { ...C.ListItem,          property: 'border',     description: 'Inter-row divider.' },
    { ...C.Steps,             property: 'border',     description: 'Connector line between step circles.' },
    { ...C.Toast,             property: 'border',     description: 'Toast outline.' },
  ],
  'atom.border.selection-and-focus.border-primary-focus': [
    { ...C.Accordion,         property: 'outline',    description: 'Keyboard focus outline on the accordion header.', scope: 'on :focus-visible' },
    { ...C.Input,             property: 'border',     description: 'Input border on focus.', scope: 'when focused' },
  ],
  'atom.foreground.feedback.fg-success': [
    { ...C.Alert,             property: 'icon-fill',  description: 'Success icon glyph.', scope: 'when type === "success"' },
    { ...C.DataRow,           property: 'text',       description: 'Status badge text on success rows.' },
    { ...C.Toast,             property: 'icon-fill',  description: 'Leading icon for success toasts.', scope: 'when type === "success"' },
  ],
  'atom.foreground.feedback.fg-warning': [
    { ...C.Alert,             property: 'icon-fill',  description: 'Warning icon glyph.', scope: 'when type === "warning"' },
  ],
  'atom.foreground.feedback.fg-error': [
    { ...C.Alert,             property: 'icon-fill',  description: 'Error icon glyph.', scope: 'when type === "error"' },
    { ...C.Button,            property: 'text',       description: 'Label and overlay colour on destructive-text/link variants.', scope: 'when variant === "destructive-text" or "destructive-link"' },
    { ...C.Input,             property: 'text',       description: 'Helper text and validation message in error state.', scope: 'when error' },
    { ...C.Select,            property: 'text',       description: 'Helper text in error state.', scope: 'when error' },
    { ...C.Toast,             property: 'icon-fill',  description: 'Leading icon for error toasts.', scope: 'when type === "error"' },
    { ...C.TransportCard,     property: 'text',       description: 'Disrupted/cancelled price strikethrough or warning copy.' },
  ],
  'atom.foreground.feedback.fg-info': [
    { ...C.Alert,             property: 'icon-fill',  description: 'Info icon glyph.', scope: 'when type === "info"' },
  ],
  'atom.foreground.states.fg-disabled': [
    { ...C.Accordion,         property: 'text',       description: 'All text colours (element / title / subtitle / body) in the disabled state.', scope: 'when state === "disabled"' },
    { ...C.Checkbox,          property: 'icon-fill',  description: 'Checkmark glyph when the box is disabled.', scope: 'when disabled && checked' },
    { ...C.Input,             property: 'text',       description: 'Input value text when disabled.', scope: 'when disabled' },
    { ...C.ListItem,          property: 'text',       description: 'Item text when disabled.', scope: 'when disabled' },
    { ...C.Switch,            property: 'text',       description: 'Switch label when the control is disabled.', scope: 'when disabled' },
  ],
  'atom.foreground.primary.fg-brand-primary-inverse': [
    { ...C.Avatar,            property: 'text',       description: 'Initials text on the brand-coloured fill.', scope: 'when type === "brand"' },
    { ...C.Badge,             property: 'text',       description: 'Label text on the Brand Badge.', scope: 'when variant === "Brand"' },
    { ...C.Button,            property: 'text',       description: 'Label colour on Primary and Destructive variants.', scope: 'when variant ∈ {primary, destructive, toggle}' },
    { ...C.ButtonGroup,       property: 'text',       description: 'Label on the primary segment.' },
    { ...C.DatePicker,        property: 'text',       description: 'Selected-day text colour.', scope: 'when day is selected' },
    { ...C.Dialog,            property: 'text',       description: 'Primary action button label.' },
    { ...C.LineItem,          property: 'text',       description: 'All text within a selected row.', scope: 'when selected' },
    { ...C.Steps,             property: 'text',       description: 'Active step number and the active checkmark glyph (CSS fill + SVG stroke).' },
    { ...C.Tabs,              property: 'text',       description: 'Active pill text on the dark-pill variant.', scope: 'when variant === "pill" && active' },
    { ...C.Tooltip,           property: 'text',       description: 'Tooltip body text.' },
  ],
  'atom.background.core.bg-overlay': [
    { ...C.Dialog,            property: 'background', description: 'Modal scrim behind the dialog.' },
  ],
  'atom.background.primary.bg-primary-disabled': [
    { ...C.Checkbox,          property: 'background', description: 'Box fill when disabled.', scope: 'when disabled' },
    { ...C.Input,             property: 'background', description: 'Input field fill when disabled.', scope: 'when disabled' },
    { ...C.ProgressIndicator, property: 'background', description: 'Bar / circular track (always — represents the unfilled portion).' },
    { ...C.Steps,             property: 'background', description: 'Upcoming step circle fill.', scope: 'when status === "upcoming"' },
  ],
  'atom.border.states.border-disabled': [
    { ...C.Checkbox,          property: 'border',     description: 'Box outline when disabled.', scope: 'when disabled' },
    { ...C.Input,             property: 'border',     description: 'Input outline when disabled.', scope: 'when disabled' },
    { ...C.ListItem,          property: 'border',     description: 'Item outline when disabled.', scope: 'when disabled' },
    { ...C.Tags,              property: 'border',     description: 'Tag outline when disabled.', scope: 'when disabled' },
  ],
  'atom.foreground.core.fg-secondary': [
    { ...C.Accordion,         property: 'text',       description: 'Subtitle text in the default state.', scope: 'when state === "default"' },
    { ...C.Alert,             property: 'icon-fill',  description: 'Icon glyph and close-button colour for the muted variant.', scope: 'when type === "muted"' },
    { ...C.DataRow,           property: 'text',       description: 'Label text and inline icon glyph.' },
    { ...C.Input,             property: 'text',       description: 'Helper / placeholder / supporting text.' },
    { ...C.Media,             property: 'text',       description: 'Caption / muted overlay text.' },
    { ...C.ProgressIndicator, property: 'text',       description: 'Caption beneath the bar / circular indicator and disabled state text.' },
    { ...C.QRCode,            property: 'text',       description: 'Caption beneath the QR code.' },
    { ...C.Select,            property: 'text',       description: 'Placeholder text and helper text in the rest state.' },
    { ...C.Steps,             property: 'text',       description: 'Disabled / upcoming step label colour.', scope: 'when status === "upcoming"' },
    { ...C.TimePicker,        property: 'text',       description: 'Placeholder text inside the time slot.' },
    { ...C.Toast,             property: 'text',       description: 'Close-button glyph colour.' },
  ],
  'atom.foreground.core.fg-link': [
    { ...C.Button,            property: 'text',       description: 'Label colour on the Link / Ghost variant (and overlay).', scope: 'when variant === "link"' },
    { ...C.Dialog,            property: 'text',       description: 'Inline link colour inside dialog body copy.' },
  ],
  'atom.background.primary.bg-primary-hover': [
    { ...C.Button,            property: 'background', description: 'Primary button surface on hover (Full Button + Icon Only).',                                            scope: 'when variant === "primary" && state === "hover"',  source: 'figma' },
  ],
  'atom.background.primary.bg-primary-pressed': [
    { ...C.Checkbox,          property: 'background', description: 'Filled box surface when checked.', scope: 'when checked && !disabled' },
    { ...C.Checkbox,          property: 'icon-fill',  description: 'Checkmark glyph when checked.', scope: 'when checked && !disabled' },
    { ...C.Button,            property: 'background', description: 'Primary button surface in active / pressed state (Full Button + Icon Only).', scope: 'when variant === "primary" && state === "active"',                                source: 'figma' },
    { ...C.ListItem,          property: 'background', description: 'Selected list item surface (interactive and not-interactive styles).',         scope: 'when state === "selected"',                                                       source: 'figma' },
    { ...C.Switch,            property: 'background', description: 'Track fill when the switch is on.',                                             scope: 'when on === true (default + focused)',                                            source: 'figma' },
    { ...C.Select,            property: 'background', description: 'Trigger surface in selected state (single-choice).',                            scope: 'when type === "single" && state === "selected"',                                  source: 'figma' },
  ],
  'atom.background.primary.bg-primary-focus': [
    { ...C.Button,            property: 'background', description: 'Primary button surface in focus state (Full Button).',                          scope: 'when variant === "primary" && state === "focus"',  source: 'figma' },
  ],
  'atom.background.core.bg-secondary-hover': [
    { ...C.ListItem,          property: 'background', description: 'Subtle hover overlay on list rows.', scope: 'on hover' },
  ],
  'atom.background.primary.bg-primary-focus-inverse': [],
  'atom.background.primary.bg-primary-pressed-inverse': [
    { ...C.Tabs,              property: 'background', description: 'Pressed-state pill background (default tab variant).',          scope: 'when state === "pressed" && type === "default"', source: 'figma' },
    { ...C.TimePicker,        property: 'background', description: 'Selected time slot surface in the vertical layout.',            scope: 'when style === "vertical"',                       source: 'figma' },
  ],
  'atom.background.alert.bg-success-light': [
    { ...C.Badge,             property: 'background', description: 'Success Badge fill.', scope: 'when variant === "Success"' },
  ],
  'atom.background.alert.bg-warning-default': [
    { ...C.Badge,             property: 'background', description: 'Warning Badge fill.', scope: 'when variant === "Warning"' },
  ],
  'atom.background.alert.bg-error-light': [
    { ...C.Badge,             property: 'background', description: 'Error Badge fill.', scope: 'when variant === "Error"' },
  ],
  'atom.background.alert.bg-info-default': [
    { ...C.Badge,             property: 'background', description: 'Information Badge fill.', scope: 'when variant === "Information"' },
  ],
  'atom.border.feedback.border-error': [
    { ...C.Alert,             property: 'border',     description: 'Container outline.', scope: 'when type === "error"' },
    { ...C.Input,             property: 'border',     description: 'Input outline in error state.', scope: 'when error' },
  ],
  'atom.border.feedback.border-warning': [
    { ...C.Alert,             property: 'border',     description: 'Container outline.', scope: 'when type === "warning"' },
  ],
  'atom.border.feedback.success-border-color': [
    { ...C.Alert,             property: 'border',     description: 'Container outline.', scope: 'when type === "success"' },
  ],
  'atom.border.feedback.border-info': [
    { ...C.Alert,             property: 'border',     description: 'Container outline.', scope: 'when type === "info"' },
  ],
  'atom.border.selection-and-focus.border-selected': [
    { ...C.ListItem,          property: 'border',     description: 'Outline on the selected list item.', scope: 'when selected' },
    { ...C.Tabs,              property: 'border',     description: 'Underline beneath the active tab.', scope: 'when variant === "underline" && active' },
    { ...C.Tags,              property: 'shadow',     description: 'Focus ring rendered as a 2px box-shadow.', scope: 'on :focus-visible' },
  ],
  'atom.background.primary.bg-primary-disabled-inverse': [
    { ...C.ListItem,          property: 'background', description: 'List item surface when disabled.', scope: 'when disabled' },
    { ...C.Tags,              property: 'background', description: 'Tag fill when disabled.', scope: 'when disabled' },
  ],
  'atom.border.default.border-default-brand': [
    { ...C.Button,            property: 'border',     description: 'Outline on Secondary and Segmented variants.', scope: 'when variant ∈ {secondary, segmented}' },
    { ...C.ButtonGroup,       property: 'border',     description: 'Outline around the connected button group.' },
    { ...C.Checkbox,          property: 'border',     description: 'Outline when checked.', scope: 'when checked && !disabled' },
    { ...C.Dialog,            property: 'border',     description: 'Brand-coloured edge on the secondary action button.' },
    { ...C.TransportCard,     property: 'border',     description: 'Brand-emphasised outline.' },
  ],
  'atom.foreground.states.fg-hover': [
    { ...C.Accordion,         property: 'text',       description: 'All text colours (element / title / subtitle / body) when the row is hovered.', scope: 'when state === "hover"' },
  ],
  'atom.foreground.primary.fg-brand-secondary': [],
  'atom.foreground.states.fg-disabled-inverse': [
    { ...C.Steps,             property: 'text',       description: 'Step number colour on upcoming step circles.', scope: 'when status === "upcoming"' },
  ],
  'atom.foreground.states.fg-pressed': [
    { ...C.Breadcrumbs,       property: 'text',       description: 'Current breadcrumb item label.', scope: 'when isCurrent' },
  ],
  'atom.border.states.border-pressed': [
    { ...C.Button,            property: 'border',     description: 'Secondary button border in active / pressed state (Full Button + Social Login).', scope: 'when variant === "secondary" && state === "active"',                  source: 'figma' },
    { ...C.Select,            property: 'border',     description: 'Trigger outline in pressed / selected state (multiple-choice).',                  scope: 'when type === "multiple" && state ∈ {pressed, selected}',           source: 'figma' },
  ],
  'atom.foreground.states.fg-pressed-inverse': [
    { ...C.Tags,              property: 'text',       description: 'Tag label when the tag is pressed / active.', scope: 'when active state' },
  ],
  'atom.border.states.border-hover': [
    { ...C.ListItem,          property: 'border',     description: 'Item outline on hover.', scope: 'on hover' },
  ],
  'atom.foreground.primary.fg-brand-hover': [
    { ...C.Button,            property: 'text',       description: 'Tertiary button label colour on hover.',                                          scope: 'when variant === "tertiary" && state === "hover"',                  source: 'figma' },
    { ...C.Tags,              property: 'text',       description: 'Tag label colour on hover.',                                                      scope: 'when state === "hover"',                                            source: 'figma' },
  ],
  'atom.background.primary.bg-primary-pressed-brand': [
    { ...C.DatePicker,        property: 'background', description: 'Selected-day fill.', scope: 'when day is selected' },
    { ...C.ProgressIndicator, property: 'background', description: 'Active fill on the circular indicator.' },
    { ...C.Select,            property: 'background', description: 'Active / selected option fill in the dropdown.' },
    { ...C.Steps,             property: 'background', description: 'Active step circle fill.', scope: 'when status === "active"' },
    { ...C.Tags,              property: 'background', description: 'Tag fill when active / pressed.', scope: 'when active state' },
  ],
  'atom.border.selection-and-focus.border-brand-hover': [
    { ...C.Tags,              property: 'border',     description: 'Tag outline on hover.',                                                            scope: 'when state === "hover"',                                            source: 'figma' },
  ],
  'atom.background.primary.bg-primary-hover-inverse': [
    { ...C.Accordion,         property: 'background', description: 'Hover-state row surface across all border styles.',                              scope: 'when state === "hover"',                                            source: 'figma' },
    { ...C.Tags,              property: 'background', description: 'Tag fill on hover.',                                                              scope: 'when state === "hover"',                                            source: 'figma' },
  ],
  'atom.border.selection-and-focus.border-secondary-focus': [
    { ...C.Input,             property: 'outline',    description: 'Outer focus ring around the input field.',                                        scope: 'when state === "focus"',                                            source: 'figma' },
    { ...C.Select,            property: 'outline',    description: 'Outer focus ring around the trigger.',                                            scope: 'when state === "focused"',                                          source: 'figma' },
  ],
  'atom.background.core.bg-muted': [
    { ...C.Accordion,         property: 'background', description: 'Badge background (all states) and the disabled-state row fill.' },
    { ...C.Alert,             property: 'background', description: 'Container fill for the muted variant.', scope: 'when type === "muted"' },
    { ...C.Avatar,            property: 'background', description: 'Initials background on the neutral fallback.', scope: 'when type === "neutral"' },
    { ...C.Badge,             property: 'background', description: 'Muted Badge fill.', scope: 'when variant === "Muted"' },
    { ...C.ButtonGroup,       property: 'background', description: 'Surrounding panel fill behind the segments.' },
    { ...C.Card,              property: 'background', description: 'Muted block within the card.' },
    { ...C.DataRow,           property: 'background', description: 'Subtle row wash on alternate rows or icon containers.' },
    { ...C.DatePicker,        property: 'background', description: 'Hover wash on calendar cells.', scope: 'on hover' },
    { ...C.LineItem,          property: 'background', description: 'Active / pressed wash behind the row.', scope: 'when active state' },
    { ...C.Media,             property: 'background', description: 'Placeholder / skeleton fill before media loads.' },
    { ...C.QuantityStepper,   property: 'background', description: 'Attached-button surface on the segmented variant.', scope: 'when variant === "attached"' },
    { ...C.Select,            property: 'background', description: 'Disabled trigger fill and option-hover wash.', scope: 'when disabled or on hover' },
    { ...C.Tabs,              property: 'background', description: 'Track behind segmented pill tabs.', scope: 'when variant === "pill"' },
    { ...C.Tags,              property: 'background', description: 'Tag fill on hover.', scope: 'on hover' },
  ],
  'atom.background.alert.bg-success-lightest': [
    { ...C.Alert,             property: 'background', description: 'Container fill.', scope: 'when type === "success"' },
    { ...C.DataRow,           property: 'background', description: 'Status badge background on success rows.' },
  ],
  'atom.background.alert.bg-warning-lightest': [
    { ...C.Alert,             property: 'background', description: 'Container fill.', scope: 'when type === "warning"' },
  ],
  'atom.background.alert.bg-error-lightest': [
    { ...C.Alert,             property: 'background', description: 'Container fill.', scope: 'when type === "error"' },
  ],
  'atom.background.alert.bg-info-lightest': [
    { ...C.Alert,             property: 'background', description: 'Container fill.', scope: 'when type === "info"' },
  ],
  'atom.background.alert.bg-success-full': [],
  'atom.border.states.border-interactive': [
    { ...C.DatePicker,        property: 'border',     description: 'Outline around the "today" calendar cell.',                                       scope: 'when day represents today',                                         source: 'figma' },
  ],
  'atom.background.core.bg-secondary': [
    { ...C.ListItem,          property: 'background', description: 'Secondary list-item surface (e.g. nested rows or alternate cards).' },
  ],
  'atom.background.alert.bg-error-full': [
    { ...C.Button,            property: 'background', description: 'Surface on the Destructive button variant.', scope: 'when variant === "destructive"' },
  ],
  'atom.background.alert.bg-error-hover': [
    { ...C.Button,            property: 'background', description: 'Destructive button surface on hover.',                                            scope: 'when variant === "destructive" && state === "hover"',               source: 'figma' },
  ],
  'atom.background.alert.bg-error-pressed': [
    { ...C.Button,            property: 'background', description: 'Destructive button surface in active / pressed state.',                          scope: 'when variant === "destructive" && state === "active"',              source: 'figma' },
  ],
  'atom.foreground.core.fg-tertiary': [
    { ...C.Breadcrumbs,       property: 'text',       description: 'Divider glyph (chevron / slash) between breadcrumb items.' },
    { ...C.Card,              property: 'text',       description: 'Tertiary metadata copy (timestamps, captions).' },
  ],
  'atom.background.core.bg-accent': [
    { ...C.Avatar,            property: 'background', description: 'Initials background on the brand fill.', scope: 'when type === "brand"' },
  ],
  'atom.border.default.border-muted': [
    { ...C.Alert,             property: 'border',     description: 'Container outline for the muted variant.', scope: 'when type === "muted"' },
  ],
  'atom.border.states.no-interaction': [
    { ...C.Card,              property: 'border',     description: 'Outline on non-interactive Card variants (Description copy, Number Top).',       scope: 'when image-position ∈ {description, number-top}',                   source: 'figma' },
    { ...C.DataGroup,         property: 'border',     description: 'Outer border on the Data Group container.',                                       source: 'figma' },
    { ...C.DataGroupNoSlot,   property: 'border',     description: 'Outer border on the No-Slot Data Group container.',                              scope: 'when border === "on"',                                              source: 'figma' },
    { ...C.Select,            property: 'border',     description: 'Outline in pressed / selected state on multi-choice Select.',                    scope: 'when type === "multiple" && state ∈ {pressed, selected}',           source: 'figma' },
  ],
  'atom.progress-indicator.active-color': [],
  'atom.background.primary.accent': [
    { ...C.ProgressIndicator, property: 'background', description: 'Active fill on the linear progress bar.' },
  ],
  'atom.foreground.feedback.fg-error-pressed': [
    { ...C.Button,            property: 'text',       description: 'Destructive-Text button label in active / pressed state.',                       scope: 'when variant === "destructive-text" && state === "active"',         source: 'figma' },
  ],
  'atom.foreground.feedback.fg-error-hover': [
    { ...C.Button,            property: 'text',       description: 'Destructive-Text button label on hover.',                                         scope: 'when variant === "destructive-text" && state === "hover"',          source: 'figma' },
  ],
};

// ─── Derived helpers ────────────────────────────────────────────────────────

export const ALL_TOKENS = Object.keys(TOKEN_USAGE) as SemanticTokenKey[];
export const USED_TOKENS: SemanticTokenKey[] = ALL_TOKENS.filter(
  (k) => TOKEN_USAGE[k].length > 0,
);
export const UNUSED_TOKENS: SemanticTokenKey[] = ALL_TOKENS.filter(
  (k) => TOKEN_USAGE[k].length === 0,
);

export const TOTAL_BINDINGS = ALL_TOKENS.reduce(
  (acc, k) => acc + TOKEN_USAGE[k].length,
  0,
);

export const COMPONENTS_COVERED = new Set<string>(
  ALL_TOKENS.flatMap((k) => TOKEN_USAGE[k].map((u) => u.component)),
).size;

// Property-kind summary for a single token — unique kinds across all bindings.
export function tokenPropertyKinds(key: SemanticTokenKey): CSSPropertyKind[] {
  const set = new Set<CSSPropertyKind>();
  for (const u of TOKEN_USAGE[key]) set.add(u.property);
  return Array.from(set);
}

// Source helper — defaults a missing field to 'react'.
export function bindingSource(u: TokenUsage): BindingSource {
  return u.source ?? 'react';
}

// Distinct sources observed for a token across its bindings.
export function tokenSources(key: SemanticTokenKey): BindingSource[] {
  const set = new Set<BindingSource>();
  for (const u of TOKEN_USAGE[key]) set.add(bindingSource(u));
  return Array.from(set);
}

// Aggregate counts.
export const REACT_BINDINGS = ALL_TOKENS.reduce(
  (acc, k) => acc + TOKEN_USAGE[k].filter((u) => bindingSource(u) === 'react').length,
  0,
);
export const FIGMA_BINDINGS = ALL_TOKENS.reduce(
  (acc, k) => acc + TOKEN_USAGE[k].filter((u) => bindingSource(u) === 'figma').length,
  0,
);

// Reverse index: which tokens does a given component bind?
export function tokensForComponent(component: string): SemanticTokenKey[] {
  return ALL_TOKENS.filter((k) =>
    TOKEN_USAGE[k].some((u) => u.component === component),
  );
}
