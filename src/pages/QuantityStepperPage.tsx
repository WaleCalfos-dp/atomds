import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuantityStepperLive } from '../components/quantity-stepper/QuantityStepperLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

interface QuantityStepperPageProps {
  brand: Brand;
}

type Style = 'Stepper only' | 'Stepper with description';
const STYLES: Style[] = ['Stepper only', 'Stepper with description'];

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// ── Figma property catalogue (exactly matches Brand Switcher → Atom spec) ────
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
  { label: 'Stepper fg (+/−, value)',    cssVar: '--atom-foreground-primary-fg-brand-primary',    tokenKey: 'atom.foreground.primary.fg-brand-primary',    fallback: '#0a2333', scope: 'Stepper symbols + value text' },
  { label: 'Stepper border',             cssVar: '--atom-border-default-border-default',          tokenKey: 'atom.border.default.border-default',          fallback: '#cdcbcb', scope: 'Stepper outline (all three)' },
  { label: 'Stepper field bg',           cssVar: '--atom-background-primary-bg-primary-inverse',  tokenKey: 'atom.background.primary.bg-primary-inverse',  fallback: '#ffffff', scope: 'Value panel background' },
  { label: 'Attached-button bg',         cssVar: '--atom-background-core-bg-muted',               tokenKey: 'atom.background.core.bg-muted',               fallback: '#0a23330a', scope: '+ / − button fill (Style 1 only)' },
  { label: 'Title',                      cssVar: '--atom-foreground-core-fg-primary',             tokenKey: 'atom.foreground.core.fg-primary',             fallback: '#4b4a4a', scope: 'Title 1 / 2 / 3 text' },
  { label: 'Description',                cssVar: '--atom-foreground-core-fg-secondary',           tokenKey: 'atom.foreground.core.fg-secondary',           fallback: '#737272', scope: 'Description 1 / 2 / 3 text' },
  { label: 'Divider',                    cssVar: '--atom-border-default-border-divider',          tokenKey: 'atom.border.default.border-divider',          fallback: '#cdcbcb', scope: 'Hairline between rows and footer' },
  { label: 'More-info icon',             cssVar: '--atom-foreground-core-fg-interactive-icon',    tokenKey: 'atom.foreground.core.fg-interactive-icon',    fallback: '#006b99', scope: 'Info (i) glyph' },
  { label: 'More-info text',             cssVar: '--atom-foreground-core-fg-secondary',           tokenKey: 'atom.foreground.core.fg-secondary',           fallback: '#737272', scope: 'Information helper text' },
  { label: 'Badge bg',                   cssVar: '--atom-background-core-bg-muted',               tokenKey: 'atom.background.core.bg-muted',               fallback: '#0a23330a', scope: 'Badge pill fill' },
  { label: 'Badge text',                 cssVar: '--atom-foreground-primary-fg-brand-primary',    tokenKey: 'atom.foreground.primary.fg-brand-primary',    fallback: '#0a2333', scope: 'Badge label' },
];

const A11Y_ROWS = [
  { icon: '⌨️', title: 'Keyboard interaction', body: '+ and − buttons are reached via Tab and activated with Enter or Space. When a row is disabled at min or max, the corresponding button is excluded from the tab order.' },
  { icon: '🔤', title: 'Accessible names',     body: 'Both buttons need an aria-label that identifies both the action and the item — e.g. "Increase quantity of Premium lounge pass". Never rely on the + / − glyph alone for assistive-tech users.' },
  { icon: '🚫', title: 'Disabled boundaries',  body: 'Use the disabled attribute (not opacity alone) once the value hits min or max. Screen readers will announce the unavailable state and the button is skipped during focus traversal.' },
  { icon: '🔢', title: 'Value announcement',   body: 'Wrap the value field in aria-live="polite" or aria-atomic so count changes are announced without focus movement. Do not announce on every keystroke — announce only on value commit.' },
  { icon: '📋', title: 'List semantics',       body: 'When rows appear inside a cart, wrap them in a role="list" (or native <ul>) so the total item count is announced. Each row is a list item with its title/description grouped.' },
  { icon: '🎨', title: 'Colour contrast',      body: 'Title (fg-primary on white) and stepper glyphs (fg-brand-primary on white / bg-muted) meet WCAG AA 4.5:1 across all brands. Disabled state is exempt per WCAG 1.4.3.' },
];

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

// ─── Sub-elements used by the preview canvas ────────────────────────────────

function Badge({ label }: { label: string }) {
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        height: '24px', padding: '0 10px',
        backgroundColor: 'var(--atom-background-core-bg-muted, #0a23330a)',
        color: 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)',
        borderRadius: '999px',
        fontSize: '11px', fontWeight: 600,
        fontFamily: 'var(--atom-font-body, Poppins, sans-serif)',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}

function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="7" stroke="var(--atom-foreground-core-fg-interactive-icon, #006b99)" strokeWidth="1.4" />
      <path d="M8 7v4.5M8 4.25v.5" stroke="var(--atom-foreground-core-fg-interactive-icon, #006b99)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function Row({
  title, titleText, description, descriptionText,
  stepperVisible, badgeVisible, badgeLabel, brand,
}: {
  title: boolean; titleText: string;
  description: boolean; descriptionText: string;
  stepperVisible: boolean; badgeVisible: boolean; badgeLabel: string;
  brand: Brand;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: '16px', padding: '4px 0',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {title && (
          <span style={{
            fontSize: '14px', fontWeight: 600, lineHeight: '20px',
            fontFamily: 'var(--atom-font-body, Poppins, sans-serif)',
            color: 'var(--atom-foreground-core-fg-primary, #4b4a4a)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{titleText}</span>
        )}
        {description && (
          <span style={{
            fontSize: '12px', fontWeight: 400, lineHeight: '18px',
            fontFamily: 'var(--atom-font-body, Poppins, sans-serif)',
            color: 'var(--atom-foreground-core-fg-secondary, #737272)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{descriptionText}</span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {stepperVisible && (
          <QuantityStepperLive stepperStyle="1" size="Small" defaultValue={1} brand={brand} />
        )}
        {badgeVisible && <Badge label={badgeLabel} />}
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div
      role="separator"
      aria-hidden="true"
      style={{
        height: '1px',
        backgroundColor: 'var(--atom-border-default-border-divider, #cdcbcb)',
        margin: '12px 0',
      }}
    />
  );
}

function Slot() {
  return (
    <div
      style={{
        border: '1px dashed var(--atom-border-default-border-muted, #00000066)',
        borderRadius: '8px',
        padding: '8px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--atom-foreground-core-fg-tertiary, #afaead)',
        fontSize: '11px', fontWeight: 500,
        fontFamily: 'var(--atom-font-body, Poppins, sans-serif)',
      }}
    >
      Swap component
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

function TextInput({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-medium text-slate-500 mb-1">{label}</p>
      <input
        type="text" value={value} maxLength={60}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
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
  // Variant
  const [style, setStyle] = useState<Style>('Stepper with description');

  // Row 1 (Figma defaults: all true, Badge false)
  const [data1,        setData1]        = useState(true);
  const [title1,       setTitle1]       = useState(true);
  const [description1, setDescription1] = useState(true);
  const [stepper1,     setStepper1]     = useState(true);
  const [badge1,       setBadge1]       = useState(false);
  const [titleText1,   setTitleText1]   = useState('Title 1');
  const [descText1,    setDescText1]    = useState('Description 1');

  // Row 2 (Figma defaults: Data false, others true)
  const [data2,        setData2]        = useState(true);
  const [title2,       setTitle2]       = useState(true);
  const [description2, setDescription2] = useState(true);
  const [stepper2,     setStepper2]     = useState(true);
  const [badge2,       setBadge2]       = useState(true);
  const [titleText2,   setTitleText2]   = useState('Title 2');
  const [descText2,    setDescText2]    = useState('Description 2');

  // Row 3 (Figma defaults: Data false, others true)
  const [data3,        setData3]        = useState(true);
  const [title3,       setTitle3]       = useState(true);
  const [description3, setDescription3] = useState(true);
  const [stepper3,     setStepper3]     = useState(true);
  const [badge3,       setBadge3]       = useState(true);
  const [titleText3,   setTitleText3]   = useState('Title 3');
  const [descText3,    setDescText3]    = useState('Description 3');

  // Footer
  const [moreInfo,     setMoreInfo]     = useState(true);
  const [moreInfoText, setMoreInfoText] = useState('Info text here');
  const [slot,         setSlot]         = useState(false);

  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  // If Style='Stepper only', descriptions never render regardless of toggle
  const showDesc1 = style === 'Stepper with description' && description1;
  const showDesc2 = style === 'Stepper with description' && description2;
  const showDesc3 = style === 'Stepper with description' && description3;

  const anyRowVisible = data1 || data2 || data3;

  const previewKey = [
    style, data1, title1, description1, stepper1, badge1, titleText1, descText1,
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
                  <div
                    style={{
                      width: '520px', maxWidth: '100%',
                      backgroundColor: 'var(--atom-background-primary-bg-primary-inverse, #ffffff)',
                      border: '1px solid var(--atom-border-default-border-default, #cdcbcb)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex', flexDirection: 'column', gap: '16px',
                      fontFamily: 'var(--atom-font-body, Poppins, sans-serif)',
                    }}
                  >
                    {data1 && (
                      <Row
                        title={title1} titleText={titleText1}
                        description={showDesc1} descriptionText={descText1}
                        stepperVisible={stepper1}
                        badgeVisible={badge1} badgeLabel="In stock"
                        brand={brand}
                      />
                    )}
                    {data2 && (
                      <Row
                        title={title2} titleText={titleText2}
                        description={showDesc2} descriptionText={descText2}
                        stepperVisible={stepper2}
                        badgeVisible={badge2} badgeLabel="Popular"
                        brand={brand}
                      />
                    )}
                    {data3 && (
                      <Row
                        title={title3} titleText={titleText3}
                        description={showDesc3} descriptionText={descText3}
                        stepperVisible={stepper3}
                        badgeVisible={badge3} badgeLabel="Limited"
                        brand={brand}
                      />
                    )}

                    {anyRowVisible && (moreInfo || slot) && <Divider />}

                    {moreInfo && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        fontSize: '12px', lineHeight: '18px',
                        color: 'var(--atom-foreground-core-fg-secondary, #737272)',
                      }}>
                        <InfoIcon />
                        <span>{moreInfoText}</span>
                      </div>
                    )}

                    {slot && <Slot />}
                  </div>
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
              </ControlSection>

              {/* Row 1 */}
              <ControlSection title="Row 1">
                <Checkbox label="Data 1 (row visible)" value={data1} onToggle={() => setData1(!data1)} />
                <Checkbox label="Title 1"       value={title1}       onToggle={() => setTitle1(!title1)}       disabled={!data1} />
                <Checkbox label="Description 1" value={description1} onToggle={() => setDescription1(!description1)} disabled={!data1 || style === 'Stepper only'} />
                <Checkbox label="Stepper 1"     value={stepper1}     onToggle={() => setStepper1(!stepper1)}     disabled={!data1} />
                <Checkbox label="Badge"         value={badge1}       onToggle={() => setBadge1(!badge1)}         disabled={!data1} />
                <TextInput label="Title Text 1"       value={titleText1} onChange={setTitleText1} />
                <TextInput label="Description Text 1" value={descText1}  onChange={setDescText1} />
              </ControlSection>

              {/* Row 2 */}
              <ControlSection title="Row 2">
                <Checkbox label="Data 2 (row visible)" value={data2} onToggle={() => setData2(!data2)} />
                <Checkbox label="Title 2"       value={title2}       onToggle={() => setTitle2(!title2)}       disabled={!data2} />
                <Checkbox label="Description 2" value={description2} onToggle={() => setDescription2(!description2)} disabled={!data2 || style === 'Stepper only'} />
                <Checkbox label="Stepper 2"     value={stepper2}     onToggle={() => setStepper2(!stepper2)}     disabled={!data2} />
                <Checkbox label="Badge 2"       value={badge2}       onToggle={() => setBadge2(!badge2)}         disabled={!data2} />
                <TextInput label="Title Text 2"       value={titleText2} onChange={setTitleText2} />
                <TextInput label="Description Text 2" value={descText2}  onChange={setDescText2} />
              </ControlSection>

              {/* Row 3 */}
              <ControlSection title="Row 3">
                <Checkbox label="Data 3 (row visible)" value={data3} onToggle={() => setData3(!data3)} />
                <Checkbox label="Title 3"       value={title3}       onToggle={() => setTitle3(!title3)}       disabled={!data3} />
                <Checkbox label="Description 3" value={description3} onToggle={() => setDescription3(!description3)} disabled={!data3 || style === 'Stepper only'} />
                <Checkbox label="Stepper 3"     value={stepper3}     onToggle={() => setStepper3(!stepper3)}     disabled={!data3} />
                <Checkbox label="Badge 3"       value={badge3}       onToggle={() => setBadge3(!badge3)}         disabled={!data3} />
                <TextInput label="Title Text 3"       value={titleText3} onChange={setTitleText3} />
                <TextInput label="Description Text 3" value={descText3}  onChange={setDescText3} />
              </ControlSection>

              {/* Footer */}
              <ControlSection title="Footer">
                <Checkbox label="More Information" value={moreInfo} onToggle={() => setMoreInfo(!moreInfo)} />
                <Checkbox label="Slot"             value={slot}     onToggle={() => setSlot(!slot)} />
                <TextInput label="More Information Text" value={moreInfoText} onChange={setMoreInfoText} />
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
              Allows users to increment or decrement numeric values. Published as a three-row data list with optional titles, descriptions, badges, a trailing divider, a "More information" note and an INSTANCE_SWAP slot — useful for carts, forms, or any list where each line has its own adjustable quantity.
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
          Per Figma spec: a container (487 × flex) wraps three 40 px data rows, then an optional 1 px divider, a helper text line and a swap slot.
        </p>

        <div className="rounded-xl p-8 border border-slate-200 bg-slate-50" style={{ ...DOTTED_BG }}>
          <div style={{
            width: '520px', maxWidth: '100%',
            backgroundColor: 'var(--atom-background-primary-bg-primary-inverse, #ffffff)',
            border: '1px solid var(--atom-border-default-border-default, #cdcbcb)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex', flexDirection: 'column', gap: '16px',
            margin: '0 auto',
            fontFamily: 'var(--atom-font-body, Poppins, sans-serif)',
          }}>
            <Row title titleText="Premium lounge pass" description descriptionText="Includes fast-track security"
              stepperVisible badgeVisible badgeLabel="In stock" brand={brand} />
            <Divider />
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '12px', lineHeight: '18px',
              color: 'var(--atom-foreground-core-fg-secondary, #737272)',
            }}>
              <InfoIcon />
              <span>Prices include all applicable taxes.</span>
            </div>
            <Slot />
          </div>
        </div>

        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {[
            { num: '1', name: 'Container',       desc: 'Outer frame. Card-style surface: white fill, 1 px border, 16 px radius, 24 px padding. Vertical auto-layout with 16 px gap.' },
            { num: '2', name: 'Title',           desc: '14 px / weight 600. Brand body font via --atom-font-body. One line, truncates with ellipsis. Controlled by Title 1 / 2 / 3 toggles and Title Text 1 / 2 / 3 strings.' },
            { num: '3', name: 'Description',     desc: '12 px / weight 400, fg-secondary. Only rendered when Style = "Stepper with description" AND the row\'s Description toggle is on.' },
            { num: '4', name: 'Stepper',         desc: 'Instance of the Stepper sub-component. Attached layout (Style 1), 32 px tall. Contains decrement button, value field and increment button.' },
            { num: '5', name: 'Badge',           desc: 'Optional pill (24 px tall, 999 px radius) placed 8 px to the right of the Stepper. Use for status ("In stock", "Popular") or numeric counts.' },
            { num: '6', name: 'Divider',         desc: '1 px hairline using border-divider. Appears only when at least one row is visible AND a footer (More Information or Slot) is present.' },
            { num: '7', name: 'More Information', desc: 'Info icon + helper text. 12 px / weight 400, fg-secondary. Free-form string controlled by More Information Text.' },
            { num: '8', name: 'Slot',            desc: 'INSTANCE_SWAP placeholder. Designers swap in any component (notices, inputs, buttons) when the stock footer isn\'t enough.' },
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
          Exact published surface. One VARIANT, seventeen BOOLEAN toggles and seven TEXT slots — twenty-five properties in total.
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
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Design Tokens</h2>
        <p className="text-sm text-slate-500 mb-4">
          Eleven semantic tokens bound across the stepper, rows, divider and footer. Values shown resolve to the active brand.
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
            { title: 'Single line',            color: '#0a2333', bg: '#f0f4f8', when: 'One title, no description. For compact rows where context is obvious — e.g. "Adults" in a booking form.' },
            { title: 'With description',       color: '#0a2333', bg: '#f9fafb', when: 'Style="Stepper with description". When a row needs extra context — ingredients, fees, or fine-print.' },
            { title: 'With badge',             color: '#0a2333', bg: '#f0f9ff', when: 'Status ("In stock"), popularity, or a short numeric tag. Keep copy ≤ 2 words to preserve the 72 px badge width.' },
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
              <li style={{ marginBottom: '6px' }}>• Set Style="Stepper with description" whenever context helps the user decide</li>
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
              <li>• Badges ≥ 3 words — they overflow the pill and break the 32 px row height</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
