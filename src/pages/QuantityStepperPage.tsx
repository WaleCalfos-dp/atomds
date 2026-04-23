import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

// Figma-exported variant thumbnails — used in Section 4 to show the two
// concrete published variants at a glance. Section 1's preview is procedural
// so every rail toggle actually mutates it.
import stepperOnlySvg            from '../assets/stepper-variants/stepper-only.svg';
import stepperWithDescriptionSvg from '../assets/stepper-variants/stepper-with-description.svg';

interface QuantityStepperPageProps {
  brand: Brand;
}

type Style = 'Stepper only' | 'Stepper with description';
const STYLES: Style[] = ['Stepper only', 'Stepper with description'];

const VARIANT_SRC: Record<Style, string> = {
  'Stepper only':             stepperOnlySvg,
  'Stepper with description': stepperWithDescriptionSvg,
};

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// ── Figma property catalogue — cached manifest: QuantityStepper (36ee573b…) ───
// 1 VARIANT (Style, default "Stepper only") · 17 BOOLEANs · 7 TEXT slots · 2 variants.
const FIGMA_PROPERTIES: Array<{
  category: string;
  rows: Array<{ label: string; type: string; default: string }>;
}> = [
  {
    category: 'Variant',
    rows: [
      { label: 'Style',                 type: 'VARIANT', default: 'Stepper only' },
    ],
  },
  {
    category: 'Row 1 toggles',
    rows: [
      { label: 'Data 1',                type: 'BOOLEAN', default: 'true'  },
      { label: 'Title 1',               type: 'BOOLEAN', default: 'true'  },
      { label: 'Description 1',         type: 'BOOLEAN', default: 'true'  },
      { label: 'Stepper 1',             type: 'BOOLEAN', default: 'true'  },
      { label: 'Badge',                 type: 'BOOLEAN', default: 'false' },
    ],
  },
  {
    category: 'Row 2 toggles',
    rows: [
      { label: 'Data 2',                type: 'BOOLEAN', default: 'false' },
      { label: 'Title 2',               type: 'BOOLEAN', default: 'true'  },
      { label: 'Description 2',         type: 'BOOLEAN', default: 'true'  },
      { label: 'Stepper 2',             type: 'BOOLEAN', default: 'true'  },
      { label: 'Badge 2',               type: 'BOOLEAN', default: 'true'  },
    ],
  },
  {
    category: 'Row 3 toggles',
    rows: [
      { label: 'Data 3',                type: 'BOOLEAN', default: 'false' },
      { label: 'Title 3',               type: 'BOOLEAN', default: 'true'  },
      { label: 'Description 3',         type: 'BOOLEAN', default: 'true'  },
      { label: 'Stepper 3',             type: 'BOOLEAN', default: 'true'  },
      { label: 'Badge 3',               type: 'BOOLEAN', default: 'true'  },
    ],
  },
  {
    category: 'Footer toggles',
    rows: [
      { label: 'More Information',      type: 'BOOLEAN', default: 'true'  },
      { label: 'Slot',                  type: 'BOOLEAN', default: 'false' },
    ],
  },
  {
    category: 'Text slots',
    rows: [
      { label: 'Title Text 1',          type: 'TEXT',    default: '"Title 1"' },
      { label: 'Description Text 1',    type: 'TEXT',    default: '"Description 1"' },
      { label: 'Title Text 2',          type: 'TEXT',    default: '"Title 2"' },
      { label: 'Description Text 2',    type: 'TEXT',    default: '"Description 2"' },
      { label: 'Title Text 3',          type: 'TEXT',    default: '"Title 3"' },
      { label: 'Description Text 3',    type: 'TEXT',    default: '"Description 3"' },
      { label: 'More Information Text', type: 'TEXT',    default: '"Info text here"' },
    ],
  },
];

const TOKEN_TABLE_ROWS: {
  label: string; cssVar: string; fallback: string; tokenKey?: string; scope: string;
}[] = [
  { label: 'Container bg',               cssVar: '--atom-background-primary-bg-primary-inverse',  tokenKey: 'atom.background.primary.bg-primary-inverse',  fallback: '#ffffff', scope: 'Outer card fill' },
  { label: 'Container border',           cssVar: '--atom-border-default-border-default',          tokenKey: 'atom.border.default.border-default',          fallback: '#cdcbcb', scope: '1 px outline around the whole card' },
  { label: 'Title',                      cssVar: '--atom-foreground-core-fg-primary',             tokenKey: 'atom.foreground.core.fg-primary',             fallback: '#4b4a4a', scope: 'Title 1 / 2 / 3 text (14 px Regular)' },
  { label: 'Description',                cssVar: '--atom-foreground-core-fg-secondary',           tokenKey: 'atom.foreground.core.fg-secondary',           fallback: '#737272', scope: 'Description 1 / 2 / 3 text (14 px Regular)' },
  { label: 'Stepper fg (+/−, value)',    cssVar: '--atom-foreground-primary-fg-brand-primary',    tokenKey: 'atom.foreground.primary.fg-brand-primary',    fallback: '#0a2333', scope: '+ / − glyphs + numeric value' },
  { label: 'Divider',                    cssVar: '--atom-border-default-border-divider',          tokenKey: 'atom.border.default.border-divider',          fallback: '#cdcbcb', scope: 'Hairline between rows and footer (with-description only)' },
  { label: 'More-info text',             cssVar: '--atom-foreground-core-fg-primary',             tokenKey: 'atom.foreground.core.fg-primary',             fallback: '#4b4a4a', scope: 'Footer helper text (14 px Regular)' },
  { label: 'Badge bg',                   cssVar: '--atom-background-alert-bg-info-default',       tokenKey: 'atom.background.alert.bg-info-default',       fallback: '#e6f0f5', scope: 'Badge pill fill' },
  { label: 'Badge text',                 cssVar: '--atom-foreground-primary-fg-brand-primary',    tokenKey: 'atom.foreground.primary.fg-brand-primary',    fallback: '#0a2333', scope: 'Badge label + icons' },
  { label: 'Slot border',                cssVar: '--atom-border-default-border-default',          tokenKey: 'atom.border.default.border-default',          fallback: '#cdcbcb', scope: 'INSTANCE_SWAP placeholder outline' },
];

const A11Y_ROWS = [
  { icon: '⌨️', title: 'Keyboard interaction', body: '+ and − buttons are reached via Tab and activated with Enter or Space. When a row is disabled at min or max, the corresponding button is excluded from the tab order.' },
  { icon: '🔤', title: 'Accessible names',     body: 'Both buttons need an aria-label that identifies both the action and the item — e.g. "Increase quantity of Premium lounge pass". Never rely on the + / − glyph alone for assistive-tech users.' },
  { icon: '🚫', title: 'Disabled boundaries',  body: 'Use the disabled attribute (not opacity alone) once the value hits min or max. Screen readers will announce the unavailable state and the button is skipped during focus traversal.' },
  { icon: '🔢', title: 'Value announcement',   body: 'Wrap the value field in aria-live="polite" or aria-atomic so count changes are announced without focus movement. Do not announce on every keystroke — announce only on value commit.' },
  { icon: '📋', title: 'List semantics',       body: 'When rows appear inside a cart, wrap them in a role="list" (or native <ul>) so the total item count is announced. Each row is a list item with its title/description grouped.' },
  { icon: '🎨', title: 'Colour contrast',      body: 'Title (fg-primary on white) and stepper glyphs (fg-brand-primary on white) meet WCAG AA 4.5:1 across all brands. Disabled state is exempt per WCAG 1.4.3.' },
];

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

// ─── Figma-accurate preview primitives ──────────────────────────────────────
// Sourced via the Figma MCP tools for component set 36ee573b… (QuantityStepper).
// Container: white, 1px border-default, 8px radius, 12px horizontal +
// 16px vertical padding, 16px vertical gap. Rows: flex justify-between, content
// on the left (title + description), stepper + badge on the right.

const FONT = "var(--atom-font-body, 'Poppins', sans-serif)";

function RowStepper() {
  // 32px tall, 105px wide, 16px gap between minus, value (12px wide), plus.
  const fg = 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)';
  const iconSize = 25.6;
  return (
    <div
      aria-hidden="true"
      style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        width: '105px', flexShrink: 0,
      }}
    >
      <span style={{ width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14" stroke={fg} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <span style={{
        width: 12, minWidth: 12, textAlign: 'center',
        fontFamily: FONT, fontWeight: 500, fontSize: '14px', lineHeight: '20px',
        color: fg,
      }}>0</span>
      <span style={{ width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke={fg} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  );
}

function RowBadge() {
  // 24px tall, min-width 24px, 4px corner radius, bg-info-default, 4px padding,
  // 4px gap. Icon-left + "Label" + icon-right (Figma hard-codes the text).
  const bg   = 'var(--atom-background-alert-bg-info-default, #e6f0f5)';
  const fg   = 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)';
  const iconSize = 9.6;
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: '4px', height: '24px', minWidth: '24px', padding: '0 4px',
        backgroundColor: bg, color: fg,
        borderRadius: '2px',
        fontFamily: FONT, fontSize: '12px', lineHeight: '18px', fontWeight: 400,
        whiteSpace: 'nowrap', flexShrink: 0,
      }}
    >
      <svg width={iconSize} height={iconSize} viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <circle cx="5" cy="5" r="4" stroke={fg} strokeWidth="1" />
        <circle cx="5" cy="5" r="1.3" fill={fg} />
      </svg>
      Label
      <svg width={iconSize} height={iconSize} viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <circle cx="5" cy="5" r="4" stroke={fg} strokeWidth="1" />
        <circle cx="5" cy="5" r="1.3" fill={fg} />
      </svg>
    </span>
  );
}

function Row({
  titleVisible, titleText,
  descriptionVisible, descriptionText,
  stepperVisible, badgeVisible,
}: {
  titleVisible: boolean; titleText: string;
  descriptionVisible: boolean; descriptionText: string;
  stepperVisible: boolean; badgeVisible: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex', flexDirection: 'column',
          flex: '1 1 0', minWidth: 0,
          paddingRight: '8px',
          fontFamily: FONT, fontSize: '14px', lineHeight: '20px',
        }}
      >
        {titleVisible && (
          <span
            style={{
              color: 'var(--atom-foreground-core-fg-primary, #4b4a4a)',
              fontWeight: 400,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}
          >
            {titleText || '\u00A0'}
          </span>
        )}
        {descriptionVisible && (
          <span
            style={{
              color: 'var(--atom-foreground-core-fg-secondary, #737272)',
              fontWeight: 400,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}
          >
            {descriptionText || '\u00A0'}
          </span>
        )}
        {!titleVisible && !descriptionVisible && (
          <span style={{ visibility: 'hidden' }}>&nbsp;</span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {stepperVisible && <RowStepper />}
        {badgeVisible && <RowBadge />}
      </div>
    </div>
  );
}

function HairlineDivider() {
  return (
    <div
      role="separator"
      aria-hidden="true"
      style={{
        height: '1px',
        width: '100%',
        backgroundColor: 'var(--atom-border-default-border-divider, #cdcbcb)',
        flexShrink: 0,
      }}
    />
  );
}

function FooterSlot() {
  return (
    <div
      style={{
        width: '100%',
        borderRadius: '8px',
        border: '1px dashed var(--atom-border-default-border-default, #cdcbcb)',
        padding: '14px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--atom-foreground-core-fg-secondary, #737272)',
        fontFamily: FONT,
        fontSize: '12px',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}
    >
      Swap
    </div>
  );
}

function StepperContainer({
  children,
}: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: '487px', maxWidth: '100%',
        backgroundColor: 'var(--atom-background-primary-bg-primary-inverse, #ffffff)',
        border: '1px solid var(--atom-border-default-border-default, #cdcbcb)',
        borderRadius: '8px',
        padding: '16px 12px',
        display: 'flex', flexDirection: 'column', alignItems: 'stretch',
        gap: '16px',
        fontFamily: FONT,
      }}
    >
      {children}
    </div>
  );
}

// ─── Small UI helpers for the controls rail ──────────────────────────────────

function Checkbox({ label, value, onToggle, disabled }: {
  label: string; value: boolean; onToggle: () => void; disabled?: boolean;
}) {
  return (
    <label
      className={[
        'flex items-center gap-2.5 select-none group',
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      <button
        role="checkbox"
        aria-checked={value}
        disabled={disabled}
        onClick={() => !disabled && onToggle()}
        className={[
          'w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-100 flex-shrink-0',
          value
            ? 'bg-slate-900 border-slate-900'
            : 'bg-white border-slate-300 group-hover:border-slate-400',
        ].join(' ')}
      >
        {value && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <span className="text-xs text-slate-600">{label}</span>
    </label>
  );
}

function TextInput({ label, value, onChange, placeholder, disabled }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; disabled?: boolean;
}) {
  return (
    <div className={disabled ? 'opacity-40 pointer-events-none' : ''}>
      <p className="text-[10px] font-medium text-slate-500 mb-1">{label}</p>
      <input
        type="text" value={value} maxLength={60}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-2 py-1 text-[11px] border border-slate-200 rounded-md text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition"
      />
    </div>
  );
}

function ControlSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-slate-200 pt-4 first:pt-0 first:border-0">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{title}</p>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function QuantityStepperPage({ brand }: QuantityStepperPageProps) {
  // Variant — Figma default is "Stepper only".
  const [style, setStyle] = useState<Style>('Stepper only');

  // Row 1 — Data 1 on, all sub-toggles on, Badge off
  const [data1,        setData1]        = useState(true);
  const [title1,       setTitle1]       = useState(true);
  const [description1, setDescription1] = useState(true);
  const [stepper1,     setStepper1]     = useState(true);
  const [badge1,       setBadge1]       = useState(false);
  const [titleText1,   setTitleText1]   = useState('Title 1');
  const [descText1,    setDescText1]    = useState('Description 1');

  // Row 2 — Data 2 off by default
  const [data2,        setData2]        = useState(false);
  const [title2,       setTitle2]       = useState(true);
  const [description2, setDescription2] = useState(true);
  const [stepper2,     setStepper2]     = useState(true);
  const [badge2,       setBadge2]       = useState(true);
  const [titleText2,   setTitleText2]   = useState('Title 2');
  const [descText2,    setDescText2]    = useState('Description 2');

  // Row 3 — Data 3 off by default
  const [data3,        setData3]        = useState(false);
  const [title3,       setTitle3]       = useState(true);
  const [description3, setDescription3] = useState(true);
  const [stepper3,     setStepper3]     = useState(true);
  const [badge3,       setBadge3]       = useState(true);
  const [titleText3,   setTitleText3]   = useState('Title 3');
  const [descText3,    setDescText3]    = useState('Description 3');

  // Footer — only meaningful in "Stepper with description"
  const [moreInfo,     setMoreInfo]     = useState(true);
  const [moreInfoText, setMoreInfoText] = useState('Info text here');
  const [slot,         setSlot]         = useState(false);

  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  // "Stepper only" = single-row layout, no divider / footer / rows 2-3.
  // "Stepper with description" = up to 3 rows + divider + footer + slot.
  const isFull = style === 'Stepper with description';

  const previewKey = [
    style,
    data1, title1, description1, stepper1, badge1, titleText1, descText1,
    data2, title2, description2, stepper2, badge2, titleText2, descText2,
    data3, title3, description3, stepper3, badge3, titleText3, descText3,
    moreInfo, moreInfoText, slot,
  ].join('|');

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-96">

            {/* Canvas */}
            <div
              className="flex-1 flex items-center justify-center p-10 min-h-72"
              style={DOTTED_BG}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                >
                  <StepperContainer>
                    {/* Row 1 — available in both styles */}
                    {data1 && (
                      <Row
                        titleVisible={title1} titleText={titleText1}
                        descriptionVisible={description1} descriptionText={descText1}
                        stepperVisible={stepper1} badgeVisible={badge1}
                      />
                    )}

                    {/* Rows 2 + 3 — only in "Stepper with description" */}
                    {isFull && data2 && (
                      <Row
                        titleVisible={title2} titleText={titleText2}
                        descriptionVisible={description2} descriptionText={descText2}
                        stepperVisible={stepper2} badgeVisible={badge2}
                      />
                    )}
                    {isFull && data3 && (
                      <Row
                        titleVisible={title3} titleText={titleText3}
                        descriptionVisible={description3} descriptionText={descText3}
                        stepperVisible={stepper3} badgeVisible={badge3}
                      />
                    )}

                    {/* Footer — only in "Stepper with description". The divider is
                        Figma's default footer hairline and it renders whenever the
                        footer exists, even if MI/Slot are off (matches Figma truth). */}
                    {isFull && (moreInfo || slot) && <HairlineDivider />}

                    {isFull && moreInfo && (
                      <div
                        style={{
                          color: 'var(--atom-foreground-core-fg-primary, #4b4a4a)',
                          fontFamily: FONT,
                          fontSize: '14px', lineHeight: '20px', fontWeight: 400,
                        }}
                      >
                        {moreInfoText || '\u00A0'}
                      </div>
                    )}

                    {isFull && slot && <FooterSlot />}
                  </StepperContainer>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-4 overflow-y-auto max-h-[640px]">

              {/* Style */}
              <ControlSection title="Style (variant)">
                <div className="flex rounded-lg border border-slate-200 overflow-hidden w-full">
                  {STYLES.map((s) => (
                    <button key={s} onClick={() => setStyle(s)}
                      className={[
                        'flex-1 px-2 py-1.5 text-[11px] font-medium transition-all duration-100',
                        style === s ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50',
                      ].join(' ')}>
                      {s}
                    </button>
                  ))}
                </div>
                {!isFull && (
                  <p className="text-[10px] text-slate-400 mt-2 leading-snug">
                    Rows 2/3, divider, More Information and Slot are only available
                    in <strong>Stepper with description</strong>. Those controls are
                    disabled below.
                  </p>
                )}
              </ControlSection>

              {/* Row 1 */}
              <ControlSection title="Row 1">
                <Checkbox label="Data 1 (row visible)" value={data1} onToggle={() => setData1(!data1)} />
                <Checkbox label="Title 1"       value={title1}       onToggle={() => setTitle1(!title1)}       disabled={!data1} />
                <Checkbox label="Description 1" value={description1} onToggle={() => setDescription1(!description1)} disabled={!data1} />
                <Checkbox label="Stepper 1"     value={stepper1}     onToggle={() => setStepper1(!stepper1)}     disabled={!data1} />
                <Checkbox label="Badge"         value={badge1}       onToggle={() => setBadge1(!badge1)}         disabled={!data1} />
                <TextInput label="Title Text 1"       value={titleText1} onChange={setTitleText1} disabled={!data1 || !title1} />
                <TextInput label="Description Text 1" value={descText1}  onChange={setDescText1}  disabled={!data1 || !description1} />
              </ControlSection>

              {/* Row 2 */}
              <ControlSection title="Row 2">
                <Checkbox label="Data 2 (row visible)" value={data2} onToggle={() => setData2(!data2)} disabled={!isFull} />
                <Checkbox label="Title 2"       value={title2}       onToggle={() => setTitle2(!title2)}       disabled={!isFull || !data2} />
                <Checkbox label="Description 2" value={description2} onToggle={() => setDescription2(!description2)} disabled={!isFull || !data2} />
                <Checkbox label="Stepper 2"     value={stepper2}     onToggle={() => setStepper2(!stepper2)}     disabled={!isFull || !data2} />
                <Checkbox label="Badge 2"       value={badge2}       onToggle={() => setBadge2(!badge2)}         disabled={!isFull || !data2} />
                <TextInput label="Title Text 2"       value={titleText2} onChange={setTitleText2} disabled={!isFull || !data2 || !title2} />
                <TextInput label="Description Text 2" value={descText2}  onChange={setDescText2}  disabled={!isFull || !data2 || !description2} />
              </ControlSection>

              {/* Row 3 */}
              <ControlSection title="Row 3">
                <Checkbox label="Data 3 (row visible)" value={data3} onToggle={() => setData3(!data3)} disabled={!isFull} />
                <Checkbox label="Title 3"       value={title3}       onToggle={() => setTitle3(!title3)}       disabled={!isFull || !data3} />
                <Checkbox label="Description 3" value={description3} onToggle={() => setDescription3(!description3)} disabled={!isFull || !data3} />
                <Checkbox label="Stepper 3"     value={stepper3}     onToggle={() => setStepper3(!stepper3)}     disabled={!isFull || !data3} />
                <Checkbox label="Badge 3"       value={badge3}       onToggle={() => setBadge3(!badge3)}         disabled={!isFull || !data3} />
                <TextInput label="Title Text 3"       value={titleText3} onChange={setTitleText3} disabled={!isFull || !data3 || !title3} />
                <TextInput label="Description Text 3" value={descText3}  onChange={setDescText3}  disabled={!isFull || !data3 || !description3} />
              </ControlSection>

              {/* Footer */}
              <ControlSection title="Footer">
                <Checkbox label="More Information" value={moreInfo} onToggle={() => setMoreInfo(!moreInfo)} disabled={!isFull} />
                <Checkbox label="Slot"             value={slot}     onToggle={() => setSlot(!slot)}         disabled={!isFull} />
                <TextInput label="More Information Text" value={moreInfoText} onChange={setMoreInfoText} disabled={!isFull || !moreInfo} />
              </ControlSection>

            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Quantity Stepper</h1>
            <p className="text-slate-500 text-sm max-w-xl">
              Allows users to increment or decrement numeric values inline with
              a labelled item. Published as a data-row pattern with an optional
              title, description and badge on the left and a Stepper control on
              the right. In <strong>Stepper with description</strong> up to three
              rows can stack, with an optional divider, helper text and an
              INSTANCE_SWAP slot underneath — useful for carts, forms, or any
              list where each line has its own adjustable quantity.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.25" />
                <path d="M5 3v3M5 7.5v.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              </svg>
              Forms
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
          Per Figma spec the component is a 487-px-wide rounded-rectangle
          container (12 px horizontal + 16 px vertical padding, 16 px gap
          between children). Each data row aligns a Title / Description block
          on the left with a Stepper and optional Badge on the right. Optional
          footer slots — hairline divider, More Information and an
          INSTANCE_SWAP — live beneath the row stack in the
          <strong> Stepper with description </strong> variant only.
        </p>

        <div className="rounded-xl p-8 border border-slate-200" style={{ ...DOTTED_BG }}>
          <div style={{ width: '520px', maxWidth: '100%', margin: '0 auto' }}>
            <img
              src={stepperWithDescriptionSvg}
              alt="Quantity Stepper anatomy — Style=Stepper with description"
              style={{ width: '100%', height: 'auto', display: 'block' }}
              draggable={false}
            />
          </div>
        </div>

        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {[
            { num: '1', name: 'Container',       desc: 'Outer frame. White fill, 1 px border (border-default), 8 px corner radius, 487 px wide. Vertical flex, 12 × 16 px padding, 16 px gap between children.' },
            { num: '2', name: 'Title',           desc: '14 px Regular, fg-primary (#4b4a4a). Controlled by Title 1 / 2 / 3 toggles and their Title Text slots. Truncates to one line with ellipsis.' },
            { num: '3', name: 'Description',     desc: '14 px Regular, fg-secondary (#737272). Controlled by the row\'s Description toggle and Description Text slot. Sits directly under the title.' },
            { num: '4', name: 'Stepper',         desc: '32 px tall, 105 px wide. Minus icon + numeric value + plus icon, 16 px gap. Uses the Stepper component instance (Stepper=Default, Style=1).' },
            { num: '5', name: 'Badge',           desc: '24 px tall, 2 px corner radius, bg-info-default fill, fg-brand-primary text. Icon-left + "Label" + icon-right with 4 px gap. Badge / Badge 2 / Badge 3 per row.' },
            { num: '6', name: 'Divider',         desc: '1 px hairline using border-divider. Present in the Stepper-with-description variant whenever at least one footer item (More Information / Slot) is visible.' },
            { num: '7', name: 'More Information', desc: 'Plain 14 px Regular text, fg-primary. Free-form string from More Information Text — no icon in the Figma spec (despite the name).' },
            { num: '8', name: 'Slot',            desc: 'INSTANCE_SWAP placeholder. Dashed rounded-rectangle at rest, 8 px radius. Designers swap in any component (alert, CTA button, promotion) when the stock footer is not enough.' },
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
        <h2 className="text-base font-semibold text-slate-900 mb-1">Figma properties</h2>
        <p className="text-sm text-slate-500 mb-4">
          Exact published surface per the Atom manifest. One VARIANT, seventeen
          BOOLEAN toggles and seven TEXT slots — twenty-five properties in total.
          Only two concrete variants ship (one per Style value); every other
          property is an in-variant toggle surfaced in the preview rail above.
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-48">Property</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-28">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Default</th>
              </tr>
            </thead>
            <tbody>
              {FIGMA_PROPERTIES.flatMap((group, gi) => ([
                <tr key={`h-${group.category}`} className="bg-slate-50/70">
                  <td colSpan={3} className="px-5 py-2 text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                    {group.category}
                  </td>
                </tr>,
                ...group.rows.map((row, ri) => (
                  <tr
                    key={`${group.category}-${row.label}`}
                    className={(gi + ri) > 0 ? 'border-t border-slate-100' : ''}
                  >
                    <td className="px-5 py-2.5 font-medium text-slate-700 text-sm">{row.label}</td>
                    <td className="px-5 py-2.5">
                      <span className={[
                        'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border',
                        row.type === 'VARIANT' ? 'bg-violet-50 text-violet-700 border-violet-200'
                        : row.type === 'BOOLEAN' ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200',
                      ].join(' ')}>
                        {row.type}
                      </span>
                    </td>
                    <td className="px-5 py-2.5 text-xs text-slate-500 font-mono">{row.default}</td>
                  </tr>
                )),
              ]))}
            </tbody>
          </table>
        </div>

        {/* Visual preview grid — both shipped variants at a glance */}
        <div className="mt-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Shipped variants (2)</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {STYLES.map((s) => (
              <div
                key={s}
                className="rounded-xl border border-slate-200 p-5 flex flex-col gap-3"
                style={{ ...DOTTED_BG, backgroundColor: '#f8fafc' }}
              >
                <div className="rounded-lg bg-white border border-slate-100 p-4 flex items-center justify-center">
                  <img
                    src={VARIANT_SRC[s]}
                    alt={`Style=${s}`}
                    style={{ width: '100%', maxWidth: '440px', height: 'auto', display: 'block' }}
                    draggable={false}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Style</span>
                  <span className="text-xs font-medium text-slate-800">{s}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Design Tokens</h2>
        <p className="text-sm text-slate-500 mb-4">
          Semantic tokens bound across the container, rows, stepper, divider,
          badge and footer. Values shown resolve to the active brand.
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-48">Token</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">CSS Variable</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">Resolved</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-64">Scope</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_TABLE_ROWS.map((row, i) => {
                const resolvedValue = row.tokenKey ? (tokens[row.tokenKey as keyof typeof tokens] ?? row.fallback) : row.fallback;
                const isHexColor    = resolvedValue.startsWith('#');
                const light         = isHexColor ? isLightColor(resolvedValue) : true;
                return (
                  <tr
                    key={row.cssVar + '-' + i}
                    className={i < TOKEN_TABLE_ROWS.length - 1 ? 'border-b border-slate-100' : ''}
                  >
                    <td className="px-5 py-3 font-medium text-slate-700 text-xs">{row.label}</td>
                    <td className="px-5 py-3">
                      <code className="font-mono text-[11px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                        {row.cssVar}
                      </code>
                    </td>
                    <td className="px-5 py-3">
                      {isHexColor ? (
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded flex-shrink-0 border border-black/10" style={{ backgroundColor: resolvedValue }} />
                          <span className="font-mono text-xs px-1.5 py-0.5 rounded border"
                            style={{ backgroundColor: resolvedValue, color: light ? '#1e293b' : '#f8fafc', borderColor: light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)' }}>
                            {resolvedValue.toUpperCase()}
                          </span>
                        </div>
                      ) : (
                        <code className="font-mono text-xs text-slate-500">{resolvedValue}</code>
                      )}
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500">{row.scope}</td>
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
        <p className="text-sm text-slate-500 mb-4">Guidelines for designers specifying quantity-stepper flows inclusively.</p>
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
          When each pattern is appropriate, and common do's & don'ts.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
          {[
            { title: 'Single line',            color: '#0a2333', bg: '#f0f4f8', when: 'Style="Stepper only". One title (+ optional description), compact rows where context is obvious — e.g. "Adults" in a booking form.' },
            { title: 'With description',       color: '#0a2333', bg: '#f9fafb', when: 'Style="Stepper with description". When rows need extra context, a divider, or a "More information" line below.' },
            { title: 'With badge',             color: '#0a2333', bg: '#f0f9ff', when: 'Status ("In stock"), popularity, or a short numeric tag. Keep copy ≤ 2 words to preserve the compact 24 px height.' },
            { title: 'Shopping cart',          color: '#0a2333', bg: '#f0fdf4', when: '3 rows, each with title + description + badge + stepper. Footer carries tax / totals / legal notice.' },
            { title: 'Form group',             color: '#0a2333', bg: '#fffbeb', when: 'Adults / Children / Infants patterns. Hide badges; show More Information for limits ("Infants on lap travel free").' },
            { title: 'Slot override',          color: '#0a2333', bg: '#fef2f2', when: 'Slot=true. When the built-in footer is not enough — swap in a CTA button, an alert, or a promotion.' },
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
              <li style={{ marginBottom: '6px' }}>• Small bounded integers (0–99) such as cart quantities, people counts, portions</li>
              <li style={{ marginBottom: '6px' }}>• Lists of ≤ 3 adjustable items — go multi-row rather than stacking</li>
              <li style={{ marginBottom: '6px' }}>• When current value must always be visible while adjusting</li>
              <li style={{ marginBottom: '6px' }}>• Use <strong>Stepper with description</strong> whenever context helps the user decide</li>
              <li>• Use Badge for status words or counts — keep it short enough to fit 72 px</li>
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>✗ When not to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>• Large numbers (&gt; 99) — use a numeric text input instead</li>
              <li style={{ marginBottom: '6px' }}>• Free-form values with decimals or negatives — the stepper is integer-only</li>
              <li style={{ marginBottom: '6px' }}>• More than 3 rows — compose multiple list sections rather than one long stepper stack</li>
              <li style={{ marginBottom: '6px' }}>• When a row has no Title — users need text context, never just a control</li>
              <li>• Badges ≥ 3 words — they overflow the pill and break the 24 px row height</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
