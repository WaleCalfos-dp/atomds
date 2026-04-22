import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

// ─────────────────────────────────────────────────────────────────────────────
// Figma source of truth
//   Component: Select (componentKey e3f088af0482bd58be47b63849a939f16fcddd26)
//   File:      Atom  (nKc4ep7mNdD5IqFRhNRNlW)
//   Property surface (from componentPropertyDefinitions):
//     VARIANT  Type     → Single · Multiple Choice  (default Multiple Choice)
//     VARIANT  State    → Default · Error · Disabled · Hover · Pressed / Active · Focused · Selected
//     VARIANT  Status   → Close · Open · Single
//     BOOLEAN  × 25     (outer chrome + option-level slots + per-option visibility)
//     TEXT     × 9      (Label, Placeholder, Option 1-6, Selected Option)
// ─────────────────────────────────────────────────────────────────────────────

interface SelectPageProps {
  brand: Brand;
}

type SelectType = 'Single' | 'Multiple Choice';
type SelectState =
  | 'Default' | 'Error' | 'Disabled' | 'Hover' | 'Pressed / Active' | 'Focused' | 'Selected';
type SelectStatus = 'Close' | 'Open' | 'Single';

const ALL_TYPES: SelectType[] = ['Single', 'Multiple Choice'];
const ALL_STATES: SelectState[] = [
  'Default', 'Error', 'Disabled', 'Hover', 'Pressed / Active', 'Focused', 'Selected',
];
const ALL_STATUSES: SelectStatus[] = ['Close', 'Open', 'Single'];

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// ─── Figma BOOLEAN properties (25) ────────────────────────────────────────────
interface SelectBooleans {
  // Outer / field chrome
  Label: boolean;
  Placeholder: boolean;
  'Icon Left': boolean;
  'Icon Right': boolean;
  'Pill Left': boolean;
  'Pill Right': boolean;
  Chevron: boolean;
  Toggle: boolean;
  'Helper Text': boolean;
  // Option row layout
  'Option Icon Left': boolean;
  'Option Icon After Badge': boolean;
  'Option Badge': boolean;
  'Option Checkbox Left': boolean;
  'Option Toggle Right': boolean;
  'Option Content Right': boolean;
  'Content Right': boolean;
  'Checkbox Left': boolean;
  'Checkbox Right': boolean;
  'Country Flags': boolean;
  // Per-option visibility
  'Show Option 1 (First)': boolean;
  'Show Option 2': boolean;
  'Show Option 3': boolean;
  'Show Option 4': boolean;
  'Show Option 5': boolean;
  'Show Option 6 (Last)': boolean;
}

const DEFAULT_BOOLEANS: SelectBooleans = {
  Label: true,
  Placeholder: true,
  'Icon Left': false,
  'Icon Right': false,
  'Pill Left': false,
  'Pill Right': false,
  Chevron: true,
  Toggle: false,
  'Helper Text': false,
  'Option Icon Left': false,
  'Option Icon After Badge': false,
  'Option Badge': false,
  'Option Checkbox Left': false,
  'Option Toggle Right': false,
  'Option Content Right': true,
  'Content Right': true,
  'Checkbox Left': true,
  'Checkbox Right': false,
  'Country Flags': false,
  'Show Option 1 (First)': true,
  'Show Option 2': true,
  'Show Option 3': true,
  'Show Option 4': true,
  'Show Option 5': true,
  'Show Option 6 (Last)': true,
};

// ─── Figma TEXT properties (9) ────────────────────────────────────────────────
interface SelectTexts {
  'Label Text': string;
  'Placeholder Text': string;
  'Selected Option': string;
  'Option 1 (First)': string;
  'Option 2': string;
  'Option 3': string;
  'Option 4': string;
  'Option 5': string;
  'Option 6 (Last)': string;
}

const DEFAULT_TEXTS: SelectTexts = {
  'Label Text': 'Label',
  'Placeholder Text': 'Placeholder',
  'Selected Option': 'Option 2',
  'Option 1 (First)': 'Option 1 (first)',
  'Option 2': 'Option 2',
  'Option 3': 'Option 3',
  'Option 4': 'Option 4',
  'Option 5': 'Option 5',
  'Option 6 (Last)': 'Option 6 (last)',
};

// ─── Svg glyphs ───────────────────────────────────────────────────────────────
function ChevronDown({ color, open }: { color: string; open: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"
      style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease', flexShrink: 0 }}>
      <path d="M3.5 5L7 8.5L10.5 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="6" cy="6" r="4" stroke={color} strokeWidth="1.5" />
      <path d="M10 10l2.5 2.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function StarIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M6 1.5l1.35 2.9 3.15.3-2.4 2.1.75 3.1L6 8.4 3.15 9.9l.75-3.1-2.4-2.1 3.15-.3z"
        fill={color} stroke={color} strokeWidth="0.5" strokeLinejoin="round" />
    </svg>
  );
}

function FlagGlyph() {
  // Generic country flag placeholder
  return (
    <div style={{
      width: '18px', height: '12px', borderRadius: '2px', flexShrink: 0,
      background: 'linear-gradient(to bottom, #dc2626 33%, #ffffff 33%, #ffffff 66%, #1d4ed8 66%)',
      border: '1px solid rgba(0,0,0,0.08)',
    }} />
  );
}

function CheckboxSquare({ checked, disabled, color }: { checked: boolean; disabled?: boolean; color: string }) {
  return (
    <span style={{
      width: '16px', height: '16px', borderRadius: '3px',
      border: `1.5px solid ${checked ? color : '#cdcbcb'}`,
      backgroundColor: checked ? color : 'transparent',
      opacity: disabled ? 0.5 : 1,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      {checked && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

function ToggleSwitch({ on, color }: { on: boolean; color: string }) {
  return (
    <span style={{
      width: '28px', height: '16px', borderRadius: '999px', padding: '2px',
      backgroundColor: on ? color : '#cdcbcb',
      display: 'inline-flex', alignItems: 'center', flexShrink: 0,
      transition: 'background-color 0.15s ease',
    }}>
      <span style={{
        width: '12px', height: '12px', borderRadius: '50%',
        backgroundColor: '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
        transform: on ? 'translateX(12px)' : 'translateX(0)',
        transition: 'transform 0.15s ease',
      }} />
    </span>
  );
}

function PillBadge({ text, color, bg }: { text: string; color: string; bg: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '1px 6px', borderRadius: '999px', fontSize: '10px', fontWeight: 600,
      color, backgroundColor: bg, border: `1px solid ${color}33`,
      flexShrink: 0, letterSpacing: '0.02em',
    }}>{text}</span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SelectPreview — inline, Figma-accurate preview that exposes every property.
// This is NOT the runtime SelectLive; it mirrors the Figma component 1:1 so
// designers can confirm every toggle is covered.
// ─────────────────────────────────────────────────────────────────────────────
interface SelectPreviewProps {
  selectType: SelectType;
  state: SelectState;
  status: SelectStatus;
  booleans: SelectBooleans;
  texts: SelectTexts;
}

function SelectPreview({ selectType, state, status, booleans, texts }: SelectPreviewProps) {
  const fontFamily = 'var(--atom-font-body, Poppins, sans-serif)';
  const labelColor = 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)';
  const valueColor = 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)';
  const placeholderColor = 'var(--atom-foreground-core-fg-secondary, #737272)';
  const fgSecondary = 'var(--atom-foreground-core-fg-secondary, #737272)';
  const fgTertiary = 'var(--atom-foreground-core-fg-tertiary, #afaead)';
  const brandColor = 'var(--atom-background-primary-bg-primary-default, #0a2333)';
  const menuBg = 'var(--atom-background-primary-bg-primary-inverse, #ffffff)';
  const menuHover = 'var(--atom-background-core-bg-secondary-hover, #0a23330a)';

  const borderColor =
    state === 'Error'  ? 'var(--atom-border-feedback-border-error, #e02d3c)' :
    state === 'Hover'  ? 'var(--atom-border-states-border-hover, #045477)' :
    state === 'Focused'? 'var(--atom-border-selection-and-focus-border-primary-focus, #0a2333)' :
    state === 'Pressed / Active' ? 'var(--atom-border-states-border-pressed, #063e56)' :
    state === 'Selected' ? 'var(--atom-border-selection-and-focus-border-selected, #0a2333)' :
                         'var(--atom-border-default-border-default, #cdcbcb)';

  const bgColor =
    state === 'Disabled' ? 'var(--atom-background-primary-bg-primary-disabled, #ebe9e8)' :
    state === 'Pressed / Active' ? 'var(--atom-background-core-bg-secondary-hover, #0a23330a)' :
                         'var(--atom-background-primary-bg-primary-inverse, #ffffff)';

  const helperColor =
    state === 'Error'
      ? 'var(--atom-foreground-feedback-fg-error, #e02d3c)'
      : 'var(--atom-foreground-core-fg-secondary, #737272)';

  const isOpenMenu = status === 'Open';
  const showDropdown = isOpenMenu && state !== 'Disabled';

  // Value rendered in the trigger
  const triggerLabel = texts['Selected Option'] && state !== 'Default'
    ? texts['Selected Option']
    : undefined;
  const showPlaceholder = booleans.Placeholder && !triggerLabel;

  const focusRing: React.CSSProperties = state === 'Focused'
    ? { boxShadow: '0 0 0 3px var(--atom-border-selection-and-focus-border-secondary-focus, #0a233333)' }
    : {};

  const allOptionKeys = [
    'Option 1 (First)', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6 (Last)',
  ] as const;
  type OptionKey = typeof allOptionKeys[number];
  const showMap: Record<OptionKey, boolean> = {
    'Option 1 (First)': booleans['Show Option 1 (First)'],
    'Option 2':         booleans['Show Option 2'],
    'Option 3':         booleans['Show Option 3'],
    'Option 4':         booleans['Show Option 4'],
    'Option 5':         booleans['Show Option 5'],
    'Option 6 (Last)':  booleans['Show Option 6 (Last)'],
  };

  return (
    <div style={{ fontFamily, width: '320px', position: 'relative' }}>
      {/* Label */}
      {booleans.Label && (
        <label style={{
          display: 'block', marginBottom: '6px',
          fontSize: '12px', fontWeight: 500, color: labelColor,
        }}>
          {texts['Label Text']}
        </label>
      )}

      {/* Trigger / field */}
      <div
        role="combobox"
        aria-expanded={isOpenMenu}
        aria-disabled={state === 'Disabled'}
        style={{
          width: '100%', minHeight: '40px',
          padding: '0 12px',
          display: 'flex', alignItems: 'center', gap: '8px',
          backgroundColor: bgColor,
          border: `1px solid ${borderColor}`,
          borderRadius: '8px',
          fontSize: '13px', fontFamily,
          color: showPlaceholder ? placeholderColor : valueColor,
          cursor: state === 'Disabled' ? 'not-allowed' : 'pointer',
          opacity: state === 'Disabled' ? 0.65 : 1,
          ...focusRing,
        }}
      >
        {/* Left cluster */}
        {booleans['Pill Left'] && (
          <PillBadge text="Pill" color="#7c3aed" bg="#f3e8ff" />
        )}
        {booleans['Country Flags'] && <FlagGlyph />}
        {booleans['Icon Left'] && <SearchIcon color={fgSecondary} />}

        {/* Middle value / placeholder */}
        <span style={{
          flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          fontWeight: triggerLabel ? 500 : 400,
        }}>
          {showPlaceholder ? texts['Placeholder Text'] : triggerLabel ?? ' '}
        </span>

        {/* Right cluster */}
        {booleans['Content Right'] && booleans['Pill Right'] && (
          <PillBadge text="New" color="#dc2626" bg="#fef2f2" />
        )}
        {booleans['Content Right'] && booleans['Icon Right'] && (
          <StarIcon color={fgSecondary} />
        )}
        {booleans['Content Right'] && booleans.Toggle && (
          <ToggleSwitch on={state === 'Selected'} color={brandColor} />
        )}
        {booleans['Content Right'] && booleans.Chevron && (
          <ChevronDown color={state === 'Disabled' ? fgTertiary : valueColor} open={isOpenMenu} />
        )}
      </div>

      {/* Helper text */}
      {booleans['Helper Text'] && (
        <p style={{
          margin: '6px 0 0', fontSize: '11px', color: helperColor, lineHeight: 1.4,
        }}>
          {state === 'Error'
            ? 'Please choose a valid option to continue.'
            : 'Choose one or more items from the list.'}
        </p>
      )}

      {/* Dropdown menu */}
      {showDropdown && (
        <div
          role="listbox"
          style={{
            position: 'absolute', left: 0, right: 0,
            top: `calc(${booleans.Label ? '24px' : '0px'} + 40px + 6px)`,
            backgroundColor: menuBg,
            border: `1px solid ${borderColor}`,
            borderRadius: '8px',
            boxShadow: '0 10px 24px rgba(10,35,51,0.12), 0 2px 6px rgba(10,35,51,0.08)',
            overflow: 'hidden',
            zIndex: 10,
          }}
        >
          {allOptionKeys.filter((k) => showMap[k]).map((k, idx) => {
            const optLabel = texts[k];
            const isSelectedRow =
              (selectType === 'Single'   && optLabel === texts['Selected Option']) ||
              (selectType === 'Multiple Choice' && optLabel === texts['Selected Option']);
            return (
              <div
                key={k}
                role="option"
                aria-selected={isSelectedRow}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 12px',
                  backgroundColor: isSelectedRow ? menuHover : 'transparent',
                  borderBottom: idx < allOptionKeys.length - 1
                    ? '1px solid var(--atom-border-default-border-divider, #cdcbcb)'
                    : 'none',
                  fontSize: '13px',
                  color: valueColor,
                }}
              >
                {/* Left side adornments */}
                {(booleans['Option Checkbox Left'] || booleans['Checkbox Left']) && (
                  <CheckboxSquare checked={isSelectedRow} color={brandColor} />
                )}
                {booleans['Option Icon Left'] && <SearchIcon color={fgSecondary} />}
                {booleans['Country Flags'] && <FlagGlyph />}

                {/* Label */}
                <span style={{ flex: 1, fontWeight: isSelectedRow ? 500 : 400 }}>{optLabel}</span>

                {/* Badge + badge-following icon */}
                {booleans['Option Badge'] && (
                  <PillBadge text="Popular" color="#0f766e" bg="#ccfbf1" />
                )}
                {booleans['Option Icon After Badge'] && (
                  <StarIcon color={fgSecondary} />
                )}

                {/* Right-side adornments */}
                {booleans['Option Content Right'] && booleans['Checkbox Right'] && (
                  <CheckboxSquare checked={isSelectedRow} color={brandColor} />
                )}
                {booleans['Option Content Right'] && booleans['Option Toggle Right'] && (
                  <ToggleSwitch on={isSelectedRow} color={brandColor} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Controls rail helpers (match ButtonPage styling)
// ─────────────────────────────────────────────────────────────────────────────
function ControlSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{title}</p>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}

function PillSelect<T extends string>({
  options, active, onChange,
}: { options: readonly T[]; active: T; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={[
            'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
            active === opt
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
          ].join(' ')}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function BooleanCheck({
  label, value, onChange, disabled,
}: { label: string; value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <label className={['flex items-center gap-2 text-xs select-none',
      disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'].join(' ')}>
      <button
        type="button" role="checkbox" aria-checked={value}
        disabled={disabled}
        onClick={() => !disabled && onChange(!value)}
        className={[
          'w-4 h-4 rounded border-2 flex items-center justify-center transition flex-shrink-0',
          value ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-300',
        ].join(' ')}
      >
        {value && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none" aria-hidden="true">
            <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <span className="text-slate-700">{label}</span>
    </label>
  );
}

function TextField({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] text-slate-500">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 py-1 text-xs border border-slate-200 rounded-md text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
      />
    </label>
  );
}

// ─── Figma property inventories (for chip table & preview grid) ──────────────
const BOOLEAN_NAMES: (keyof SelectBooleans)[] = [
  'Label', 'Placeholder', 'Icon Left', 'Icon Right', 'Pill Left', 'Pill Right',
  'Chevron', 'Toggle', 'Helper Text',
  'Option Icon Left', 'Option Icon After Badge', 'Option Badge',
  'Option Checkbox Left', 'Option Toggle Right', 'Option Content Right',
  'Content Right', 'Checkbox Left', 'Checkbox Right', 'Country Flags',
  'Show Option 1 (First)', 'Show Option 2', 'Show Option 3',
  'Show Option 4', 'Show Option 5', 'Show Option 6 (Last)',
];
const TEXT_NAMES: (keyof SelectTexts)[] = [
  'Label Text', 'Placeholder Text', 'Selected Option',
  'Option 1 (First)', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6 (Last)',
];

const TOKEN_TABLE_ROWS = [
  { label: 'Label fg',      cssVar: '--atom-foreground-primary-fg-brand-primary',         tokenKey: 'atom.foreground.primary.fg-brand-primary',         fallback: '#0a2333' },
  { label: 'Value fg',      cssVar: '--atom-foreground-primary-fg-brand-primary',         tokenKey: 'atom.foreground.primary.fg-brand-primary',         fallback: '#0a2333' },
  { label: 'Placeholder fg',cssVar: '--atom-foreground-core-fg-secondary',                tokenKey: 'atom.foreground.core.fg-secondary',                fallback: '#737272' },
  { label: 'Field bg',      cssVar: '--atom-background-primary-bg-primary-inverse',       tokenKey: 'atom.background.primary.bg-primary-inverse',       fallback: '#ffffff' },
  { label: 'Field bg (disabled)', cssVar: '--atom-background-primary-bg-primary-disabled', tokenKey: 'atom.background.primary.bg-primary-disabled',     fallback: '#ebe9e8' },
  { label: 'Field border',  cssVar: '--atom-border-default-border-default',               tokenKey: 'atom.border.default.border-default',               fallback: '#cdcbcb' },
  { label: 'Hover border',  cssVar: '--atom-border-states-border-hover',                  tokenKey: 'atom.border.states.border-hover',                  fallback: '#045477' },
  { label: 'Focus border',  cssVar: '--atom-border-selection-and-focus-border-primary-focus', tokenKey: 'atom.border.selection-and-focus.border-primary-focus', fallback: '#0a2333' },
  { label: 'Pressed border',cssVar: '--atom-border-states-border-pressed',                tokenKey: 'atom.border.states.border-pressed',                fallback: '#063e56' },
  { label: 'Selected border',cssVar:'--atom-border-selection-and-focus-border-selected',  tokenKey: 'atom.border.selection-and-focus.border-selected',  fallback: '#0a2333' },
  { label: 'Error border',  cssVar: '--atom-border-feedback-border-error',                tokenKey: 'atom.border.feedback.border-error',                fallback: '#e02d3c' },
  { label: 'Menu hover bg', cssVar: '--atom-background-core-bg-secondary-hover',          tokenKey: 'atom.background.core.bg-secondary-hover',          fallback: '#0a23330a' },
  { label: 'Helper text',   cssVar: '--atom-foreground-core-fg-secondary',                tokenKey: 'atom.foreground.core.fg-secondary',                fallback: '#737272' },
  { label: 'Helper (error)',cssVar: '--atom-foreground-feedback-fg-error',                tokenKey: 'atom.foreground.feedback.fg-error',                fallback: '#e02d3c' },
] as const;

const A11Y_ROWS = [
  { icon: '⌨️', title: 'Keyboard interaction', body: 'Trigger opens on Enter / Space / Down-arrow. Down / Up moves highlight, Enter commits, Esc closes, Tab closes and moves focus. Typing scans to matching options.' },
  { icon: '🏷️', title: 'Labelling', body: 'Every Select needs an associated Label — either the visible Label (role="combobox" with aria-labelledby) or an aria-label on the trigger when the label is omitted visually.' },
  { icon: '📏', title: 'Target size', body: 'The trigger height is 40px with a 44×44px minimum hit area including padding. Option rows are 40px tall to support comfortable touch targets.' },
  { icon: '🚫', title: 'Disabled state', body: 'Use the disabled attribute on the underlying <select> / <button>, not opacity alone. Disabled components are exempt from WCAG 1.4.3 contrast.' },
  { icon: '🎨', title: 'Color contrast', body: 'Label, value, and border in Default / Hover / Pressed / Focused / Selected states meet WCAG AA 4.5:1. The Focused state adds a 3px outer ring for visible focus.' },
  { icon: '🔄', title: 'State announcements', body: 'The Error state pairs with an aria-describedby on the helper text so screen readers announce the validation message. Use aria-invalid="true" on the trigger.' },
];

// ─────────────────────────────────────────────────────────────────────────────
export function SelectPage({ brand }: SelectPageProps) {
  const [selectType, setSelectType] = useState<SelectType>('Multiple Choice');
  const [state, setState] = useState<SelectState>('Default');
  const [status, setStatus] = useState<SelectStatus>('Close');
  const [booleans, setBooleans] = useState<SelectBooleans>(DEFAULT_BOOLEANS);
  const [texts, setTexts] = useState<SelectTexts>(DEFAULT_TEXTS);

  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  const setBool = (k: keyof SelectBooleans) => (v: boolean) =>
    setBooleans((b) => ({ ...b, [k]: v }));
  const setText = (k: keyof SelectTexts) => (v: string) =>
    setTexts((t) => ({ ...t, [k]: v }));

  const previewKey = [
    selectType, state, status,
    ...BOOLEAN_NAMES.map((k) => (booleans[k] ? '1' : '0')),
    ...TEXT_NAMES.map((k) => texts[k]),
  ].join('|');

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-[480px]">
            {/* Canvas */}
            <div className="flex-1 flex items-start justify-center p-12" style={DOTTED_BG}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.14 }}
                >
                  <SelectPreview
                    selectType={selectType}
                    state={state}
                    status={status}
                    booleans={booleans}
                    texts={texts}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls rail */}
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5 overflow-y-auto max-h-[640px]">
              <ControlSection title="Type">
                <PillSelect options={ALL_TYPES} active={selectType} onChange={setSelectType} />
              </ControlSection>
              <ControlSection title="State">
                <PillSelect options={ALL_STATES} active={state} onChange={setState} />
              </ControlSection>
              <ControlSection title="Status">
                <PillSelect options={ALL_STATUSES} active={status} onChange={setStatus} />
              </ControlSection>

              <ControlSection title="Outer chrome">
                {(['Label','Placeholder','Helper Text','Chevron','Toggle','Country Flags'] as const).map((k) => (
                  <BooleanCheck key={k} label={k} value={booleans[k]} onChange={setBool(k)} />
                ))}
                {(['Icon Left','Icon Right','Pill Left','Pill Right','Content Right'] as const).map((k) => (
                  <BooleanCheck key={k} label={k} value={booleans[k]} onChange={setBool(k)} />
                ))}
              </ControlSection>

              <ControlSection title="Option row">
                {(['Option Icon Left','Option Icon After Badge','Option Badge',
                   'Option Checkbox Left','Option Toggle Right','Option Content Right',
                   'Checkbox Left','Checkbox Right'] as const).map((k) => (
                  <BooleanCheck key={k} label={k} value={booleans[k]} onChange={setBool(k)} />
                ))}
              </ControlSection>

              <ControlSection title="Option visibility">
                {(['Show Option 1 (First)','Show Option 2','Show Option 3',
                   'Show Option 4','Show Option 5','Show Option 6 (Last)'] as const).map((k) => (
                  <BooleanCheck key={k} label={k} value={booleans[k]} onChange={setBool(k)} />
                ))}
              </ControlSection>

              <ControlSection title="Text slots">
                {TEXT_NAMES.map((k) => (
                  <TextField key={k} label={k} value={texts[k]} onChange={setText(k)} />
                ))}
              </ControlSection>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Select</h1>
            <p className="text-slate-500 text-sm max-w-xl">
              Dropdown that lets users pick one option (Single) or many (Multiple Choice) from a
              predefined list. Use when space is constrained or when showing every option at once
              would overwhelm the interface — e.g. country, language, category pickers. Seven
              interaction states and three open/closed statuses mirror the Figma component.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.25" />
                <path d="M5 3v3M5 7.5v.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              </svg>
              Feedback
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Stable
            </span>
          </div>
        </div>
      </section>

      <hr className="border-slate-200" />

      {/* ── 3. ANATOMY ───────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Anatomy</h2>
        <p className="text-sm text-slate-500 mb-5">
          The Select field has 4 primary slots. The open dropdown adds an option list with its own row structure.
        </p>

        <div className="relative flex items-center justify-center py-20 px-8 rounded-xl" style={DOTTED_BG}>
          <SelectPreview
            selectType="Multiple Choice"
            state="Default"
            status="Close"
            booleans={{
              ...DEFAULT_BOOLEANS,
              'Icon Left': true, 'Icon Right': true, 'Helper Text': true,
            }}
            texts={DEFAULT_TEXTS}
          />
        </div>

        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {[
            { num: '1', name: 'Label',       desc: '12px / weight 500. Colour atom.foreground.primary.fg-brand-primary. Optional — toggled by the Label boolean.' },
            { num: '2', name: 'Trigger',     desc: 'The clickable field. 40px tall, 8px radius, 1px border. Background, border and text colours shift per State (Default, Hover, Focused, Pressed, Selected, Error, Disabled).' },
            { num: '3', name: 'Leading slot',desc: 'Optional icon, pill, or country flag surfaced to the left of the value. Booleans: Icon Left, Pill Left, Country Flags.' },
            { num: '4', name: 'Value',       desc: 'Either placeholder (fg-secondary) or the selected option (fg-brand-primary). Text slot: Selected Option or Placeholder Text.' },
            { num: '5', name: 'Trailing slot',desc: 'Optional icon, pill, toggle, and/or chevron. Booleans: Icon Right, Pill Right, Toggle, Chevron. Content Right gates the whole cluster.' },
            { num: '6', name: 'Helper text', desc: '11px / fg-secondary (or fg-error on Error). Optional inline validation or guidance. Boolean: Helper Text.' },
            { num: '7', name: 'Option list', desc: 'Dropdown shown when Status=Open. Each row has its own leading (checkbox / icon / flag), label, badge, and trailing (toggle / checkbox) slots, all independently toggled.' },
          ].map((row) => (
            <div key={row.num} style={{ display: 'flex', gap: '10px', padding: '12px', borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827', flexShrink: 0, marginTop: '1px', minWidth: '12px' }}>{row.num}</span>
              <div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#111827' }}>{row.name}</p>
                <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#6b7280', lineHeight: 1.4 }}>{row.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. VARIANTS ──────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-4">Variants</h2>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">Property</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Values</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Type',   chips: [
                  { text: 'Single', note: '' },
                  { text: 'Multiple Choice', note: 'default' },
                ]},
                { label: 'State',  chips: [
                  { text: 'Default', note: 'default' },
                  { text: 'Error', note: '' },
                  { text: 'Disabled', note: '' },
                  { text: 'Hover', note: '' },
                  { text: 'Pressed / Active', note: '' },
                  { text: 'Focused', note: '' },
                  { text: 'Selected', note: '' },
                ]},
                { label: 'Status', chips: [
                  { text: 'Close', note: 'default' },
                  { text: 'Open', note: '' },
                  { text: 'Single', note: 'paired with Type=Single' },
                ]},
                { label: 'Booleans (25)', chips: BOOLEAN_NAMES.map((n) => ({ text: n, note: '' })) },
                { label: 'Text slots (9)', chips: TEXT_NAMES.map((n) => ({ text: n, note: '' })) },
                { label: 'Font family', chips: [
                  { text: 'Poppins',  note: 'Dragonpass' },
                  { text: 'Arial',    note: 'Mastercard' },
                  { text: 'Inter',    note: 'Investec' },
                  { text: 'Manrope',  note: 'Visa · Greyscale' },
                  { text: 'Lato',     note: 'Assurant' },
                ]},
              ].map((row, i, arr) => (
                <tr key={row.label} className={i < arr.length - 1 ? 'border-b border-slate-100' : ''}>
                  <td className="px-5 py-3.5 font-medium text-slate-700 text-sm align-top">{row.label}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      {row.chips.map(({ text, note }) => (
                        <span key={text} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium">
                          {text}{note && <span className="text-slate-400 font-normal">· {note}</span>}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual preview of representative variants */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { label: 'Single / Default / Single',         type: 'Single' as SelectType,          state: 'Default' as SelectState,          status: 'Single' as SelectStatus },
            { label: 'Multiple / Default / Close',        type: 'Multiple Choice' as SelectType, state: 'Default' as SelectState,          status: 'Close'  as SelectStatus },
            { label: 'Single / Error / Single',           type: 'Single' as SelectType,          state: 'Error' as SelectState,            status: 'Single' as SelectStatus },
            { label: 'Single / Focused / Single',         type: 'Single' as SelectType,          state: 'Focused' as SelectState,          status: 'Single' as SelectStatus },
            { label: 'Single / Disabled / Single',        type: 'Single' as SelectType,          state: 'Disabled' as SelectState,         status: 'Single' as SelectStatus },
            { label: 'Multiple / Pressed / Open',         type: 'Multiple Choice' as SelectType, state: 'Pressed / Active' as SelectState, status: 'Open'   as SelectStatus },
          ].map((card) => {
            const showHelper = card.state === 'Error';
            return (
              <div key={card.label} style={{
                padding: '20px', borderRadius: '10px',
                border: '1px solid #f3f4f6', backgroundColor: '#fafafa',
                display: 'flex', flexDirection: 'column', gap: '10px',
                minHeight: card.status === 'Open' ? '360px' : '140px',
              }}>
                <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: '#6b7280' }}>{card.label}</p>
                <SelectPreview
                  selectType={card.type}
                  state={card.state}
                  status={card.status}
                  booleans={{ ...DEFAULT_BOOLEANS, 'Helper Text': showHelper }}
                  texts={DEFAULT_TEXTS}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Design Tokens</h2>
        <p className="text-sm text-slate-500 mb-4">
          Every token below resolves per active brand. Brand primitives flow in via
          <code className="text-xs bg-slate-100 px-1 mx-1 rounded">Brand Switcher → Atom</code>
          and mirror the Figma variable of the same name.
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">Usage</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">CSS variable</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">Value ({brand})</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_TABLE_ROWS.map((row, i) => {
                const resolved = (tokens as Record<string, string>)[row.tokenKey] ?? row.fallback;
                const raw = resolved.replace('#', '').slice(0, 6);
                const r = parseInt(raw.slice(0, 2), 16);
                const g = parseInt(raw.slice(2, 4), 16);
                const b = parseInt(raw.slice(4, 6), 16);
                const light = (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
                return (
                  <tr key={row.label + i} className={i < TOKEN_TABLE_ROWS.length - 1 ? 'border-b border-slate-100' : ''}>
                    <td className="px-5 py-3 font-medium text-slate-700 text-xs">{row.label}</td>
                    <td className="px-5 py-3">
                      <code className="font-mono text-xs text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                        {row.cssVar}
                      </code>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded flex-shrink-0 border border-black/10" style={{ backgroundColor: resolved }} />
                        <span className="font-mono text-xs px-1.5 py-0.5 rounded border"
                          style={{
                            backgroundColor: resolved,
                            color: light ? '#1e293b' : '#f8fafc',
                            borderColor: light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)',
                          }}>
                          {resolved.toUpperCase()}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 6. ACCESSIBILITY ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Accessibility</h2>
        <p className="text-sm text-slate-500 mb-4">Guidelines for implementing Select inclusively across brands.</p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm divide-y divide-slate-100">
          {A11Y_ROWS.map((row, i) => (
            <div key={row.title} className={['flex items-start gap-4 px-5 py-4', i % 2 === 1 ? 'bg-slate-50/50' : ''].join(' ')}>
              <span className="text-xl flex-shrink-0 mt-0.5" aria-hidden="true">{row.icon}</span>
              <div>
                <p className="text-sm font-semibold text-slate-800">{row.title}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{row.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. USAGE ─────────────────────────────────────────────────────────── */}
      <section>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>Usage</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          When to use each Type, and how to compose option rows.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
          {[
            { title: 'Single', color: '#0a2333', bg: '#f0f4f8', when: 'One and only one value. Use Status=Single for a field that always stays "closed" look — no chevron-toggled list. Best for country, language, timezone.' },
            { title: 'Multiple Choice', color: '#0a2333', bg: '#f9fafb', when: 'Zero to many values. The trigger summarises with "N selected". Show checkbox-left on options so the multi-select intent is obvious at a glance.' },
            { title: 'With Country Flags', color: '#166534', bg: '#f0fdf4', when: 'Country / locale pickers. Turn on Country Flags on the trigger and on option rows so the visual scan matches the text.' },
            { title: 'With Option Badge', color: '#9a3412', bg: '#fff7ed', when: 'Surface metadata per option — "Popular", "New", "Pro". Pair with Option Icon After Badge when a secondary cue is needed.' },
            { title: 'With Toggles', color: '#4338ca', bg: '#eef2ff', when: 'Settings-style pickers where each option is an on/off preference. Turn on Toggle (trigger) and/or Option Toggle Right (rows).' },
            { title: 'With Helper Text', color: '#b91c1c', bg: '#fef2f2', when: 'Always pair State=Error with Helper Text so screen readers announce the validation message. Also useful for neutral guidance ("Choose one").' },
          ].map((card) => (
            <div key={card.title} style={{ padding: '14px 16px', borderRadius: '10px', border: `1px solid ${card.color}22`, backgroundColor: card.bg }}>
              <p style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: 600, color: card.color }}>{card.title}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#4b5563', lineHeight: 1.5 }}>{card.when}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>✓ When to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>• Use Single for a required, single-value picker</li>
              <li style={{ marginBottom: '6px' }}>• Use Multiple Choice with Checkbox Left for clarity</li>
              <li style={{ marginBottom: '6px' }}>• Pair State=Error with Helper Text for validation</li>
              <li style={{ marginBottom: '6px' }}>• Use Country Flags when options are locales</li>
              <li>• Keep option labels short — under ~30 chars</li>
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>✗ When not to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>• Don't use for 2–3 options — use Radio Group or Tabs</li>
              <li style={{ marginBottom: '6px' }}>• Don't omit the Label — placeholder ≠ label</li>
              <li style={{ marginBottom: '6px' }}>• Don't mix Checkbox Left and Checkbox Right on the same list</li>
              <li style={{ marginBottom: '6px' }}>• Don't show Error state without Helper Text</li>
              <li>• Don't cram too many booleans — pick one visual pattern per instance</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
