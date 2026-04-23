import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { QRCodeType } from '../components/qr-code/QRCodeLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

// Figma-exported variant SVGs. One per shipped combination of
// (Code Type, Product Module, State, Type). These are the definitive
// rendering truth — they override any procedural reconstruction.
import barcodeAllFailedDark       from '../assets/qr-variants/barcode-all-failed-dark.svg';
import barcodeAllFailedLight      from '../assets/qr-variants/barcode-all-failed-light.svg';
import barcodeAllGeneratingDark   from '../assets/qr-variants/barcode-all-generating-dark.svg';
import barcodeAllGeneratingLight  from '../assets/qr-variants/barcode-all-generating-light.svg';
import barcodeAllSuccessDark      from '../assets/qr-variants/barcode-all-success-dark.svg';
import barcodeAllSuccessLight     from '../assets/qr-variants/barcode-all-success-light.svg';
import healthDefaultLight         from '../assets/qr-variants/health-healthandwellness-default-light.svg';
import membershipAllDefaultDark   from '../assets/qr-variants/membership-all-default-dark.svg';
import membershipAllDefaultLight  from '../assets/qr-variants/membership-all-default-light.svg';
import membershipAllFailedDark    from '../assets/qr-variants/membership-all-failed-dark.svg';
import membershipAllFailedLight   from '../assets/qr-variants/membership-all-failed-light.svg';
import membershipAllGenDark       from '../assets/qr-variants/membership-all-generating-dark.svg';
import membershipAllGenLight      from '../assets/qr-variants/membership-all-generating-light.svg';
import qrAllFailedDark            from '../assets/qr-variants/qr-all-failed-dark.svg';
import qrAllFailedLight           from '../assets/qr-variants/qr-all-failed-light.svg';
import qrAllGeneratingDark        from '../assets/qr-variants/qr-all-generating-dark.svg';
import qrAllGeneratingLight       from '../assets/qr-variants/qr-all-generating-light.svg';
import qrDiningSuccessDark        from '../assets/qr-variants/qr-dining-success-dark.svg';
import qrDiningSuccessLight       from '../assets/qr-variants/qr-dining-success-light.svg';
import qrESIMSuccessDark          from '../assets/qr-variants/qr-esim-success-dark.svg';
import qrESIMSuccessLight         from '../assets/qr-variants/qr-esim-success-light.svg';
import qrFastTrackSuccessDark     from '../assets/qr-variants/qr-fasttrack-success-dark.svg';
import qrFastTrackSuccessLight    from '../assets/qr-variants/qr-fasttrack-success-light.svg';
import qrLoungeSuccessDark        from '../assets/qr-variants/qr-lounge-success-dark.svg';
import qrLoungeSuccessLight       from '../assets/qr-variants/qr-lounge-success-light.svg';

interface QRCodePageProps {
  brand: Brand;
}

/* ──────────────────────────────────────────────────────────────────────────
 * Figma property catalogue — mirrors componentPropertyDefinitions 1:1
 * ────────────────────────────────────────────────────────────────────────── */

type CodeType       = 'QR' | 'Barcode' | 'Membership ID' | 'Health';
type ProductModule  = 'Fast Track' | 'eSIM' | 'Lounge' | 'Dining' | 'All' | 'Health and Wellness';
type QRState        = 'Default' | 'Success' | 'Generating' | 'Failed';

const CODE_TYPES:      CodeType[]      = ['QR', 'Barcode', 'Membership ID', 'Health'];
const PRODUCT_MODULES: ProductModule[] = ['Fast Track', 'eSIM', 'Lounge', 'Dining', 'All', 'Health and Wellness'];
const QR_STATES:       QRState[]       = ['Default', 'Success', 'Generating', 'Failed'];
const QR_TYPES:        QRCodeType[]    = ['Dark', 'Light'];

const BOOLEAN_PROPS: { name: string; default: boolean; appearsIn: string }[] = [
  { name: 'Counter',            default: false, appearsIn: 'QR / Barcode — page-of-page indicator' },
  { name: 'Chevron Left',       default: true,  appearsIn: 'QR / Barcode — previous-code affordance' },
  { name: 'Chevron Right',      default: true,  appearsIn: 'QR / Barcode — next-code affordance' },
  { name: 'Icon',               default: true,  appearsIn: 'Header icon above title' },
  { name: 'Title',              default: true,  appearsIn: 'Block heading' },
  { name: 'Validity',           default: true,  appearsIn: 'Dining, Lounge — expiry line' },
  { name: 'QR Code',            default: true,  appearsIn: 'Core glyph visibility toggle' },
  { name: 'Offer',              default: false, appearsIn: 'Dining — percentage-off ribbon' },
  { name: 'Description',        default: true,  appearsIn: 'Explanatory paragraph below pattern' },
  { name: 'Refresh Button',     default: false, appearsIn: 'Generating / Failed states — retry control' },
  { name: 'Add to Wallet',      default: true,  appearsIn: 'Lounge, eSIM — pass-kit CTA' },
  { name: 'Dining Location',    default: true,  appearsIn: 'Dining — venue line' },
  { name: 'Special Brand Logo', default: false, appearsIn: 'Co-branded lockups' },
  { name: 'Show Name',          default: true,  appearsIn: 'Fast Track — cardholder name row' },
  { name: 'Show Activity',      default: true,  appearsIn: 'Fast Track — activity row (Hatha Yoga etc.)' },
  { name: 'Show Date and Time', default: true,  appearsIn: 'Fast Track — date row' },
  { name: 'Footer',             default: true,  appearsIn: 'Fast Track — "Powered by" line' },
];

const TEXT_PROPS: { name: string; defaultValue: string }[] = [
  { name: 'Name',               defaultValue: 'John Smith' },
  { name: 'Card Number',        defaultValue: '4565 6374 4176 0934' },
  { name: 'Counter Text',       defaultValue: '1 of 2' },
  { name: 'Percentage Off',     defaultValue: '10% off' },
  { name: 'Validity Text',      defaultValue: 'Valid until 01 December 2026' },
  { name: 'Offer Text',         defaultValue: '3 course set meal' },
  { name: 'Description Text',   defaultValue: 'To install your eSIM, scan this QR code using another device or take a screenshot and follow the on-screen steps in your device settings.' },
  { name: 'Status Text',        defaultValue: 'Code status' },
  { name: 'Airport Name',       defaultValue: 'Guarulhos International Airport' },
  { name: 'Terminal',           defaultValue: 'Terminal 3, International Departures' },
  { name: 'Title Text',         defaultValue: 'You are checked in:' },
  { name: 'Location Text',      defaultValue: 'Fit @ Tottenham Court' },
  { name: 'Description Text 1', defaultValue: 'Please present this screen to a member of staff at the venue to gain access.' },
  { name: 'Name Label',         defaultValue: 'Name' },
  { name: 'Activity Label',     defaultValue: 'Activity' },
  { name: 'Activity',           defaultValue: 'Hatha Yoga' },
  { name: 'Check in Label',     defaultValue: 'Checked in ' },
  { name: 'Date and Time',      defaultValue: 'Sat, 14 Jan 2024, 10:30' },
  { name: 'Powered by Text',    defaultValue: 'Powered by' },
];

/* ──────────────────────────────────────────────────────────────────────────
 * Backgrounds & helpers
 * ────────────────────────────────────────────────────────────────────────── */

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const DARK_BG: React.CSSProperties = {
  backgroundColor: '#1e293b',
  backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

/* ──────────────────────────────────────────────────────────────────────────
 * Figma variant lookup + preview renderer
 *
 * The preview is a straight render of the Figma SVG export for the current
 * `(Code Type, Product Module, State, Type)` tuple. When the tuple is not
 * one of the 25 shipped variants, the renderer shows a dashed placeholder
 * explaining the gap.
 *
 * Note on brands: the SVGs are DragonPass-mode exports. Flipping the TopBar
 * brand pill does NOT repaint them (they are static assets, not CSS-
 * variable-driven). The token swatch table in Section 5 is where brand
 * colour changes are shown.
 * ────────────────────────────────────────────────────────────────────────── */

const VARIANT_SRC: Record<string, string> = {
  'Barcode|All|Failed|Dark':                    barcodeAllFailedDark,
  'Barcode|All|Failed|Light':                   barcodeAllFailedLight,
  'Barcode|All|Generating|Dark':                barcodeAllGeneratingDark,
  'Barcode|All|Generating|Light':               barcodeAllGeneratingLight,
  'Barcode|All|Success|Dark':                   barcodeAllSuccessDark,
  'Barcode|All|Success|Light':                  barcodeAllSuccessLight,
  'Health|Health and Wellness|Default|Light':   healthDefaultLight,
  'Membership ID|All|Default|Dark':             membershipAllDefaultDark,
  'Membership ID|All|Default|Light':            membershipAllDefaultLight,
  'Membership ID|All|Failed|Dark':              membershipAllFailedDark,
  'Membership ID|All|Failed|Light':             membershipAllFailedLight,
  'Membership ID|All|Generating|Dark':          membershipAllGenDark,
  'Membership ID|All|Generating|Light':         membershipAllGenLight,
  'QR|All|Failed|Dark':                         qrAllFailedDark,
  'QR|All|Failed|Light':                        qrAllFailedLight,
  'QR|All|Generating|Dark':                     qrAllGeneratingDark,
  'QR|All|Generating|Light':                    qrAllGeneratingLight,
  'QR|Dining|Success|Dark':                     qrDiningSuccessDark,
  'QR|Dining|Success|Light':                    qrDiningSuccessLight,
  'QR|eSIM|Success|Dark':                       qrESIMSuccessDark,
  'QR|eSIM|Success|Light':                      qrESIMSuccessLight,
  'QR|Fast Track|Success|Dark':                 qrFastTrackSuccessDark,
  'QR|Fast Track|Success|Light':                qrFastTrackSuccessLight,
  'QR|Lounge|Success|Dark':                     qrLoungeSuccessDark,
  'QR|Lounge|Success|Light':                    qrLoungeSuccessLight,
};

interface PreviewState {
  codeType: CodeType;
  productModule: ProductModule;
  state: QRState;
  type: QRCodeType;
  b: Record<string, boolean>;
  t: Record<string, string>;
}

function variantKey(c: CodeType, p: ProductModule, s: QRState, t: QRCodeType): string {
  return `${c}|${p}|${s}|${t}`;
}

function FigmaVariantImage({
  codeType, productModule, state, type,
  maxWidth,
}: {
  codeType: CodeType;
  productModule: ProductModule;
  state: QRState;
  type: QRCodeType;
  maxWidth?: number | string;
}) {
  const src = VARIANT_SRC[variantKey(codeType, productModule, state, type)];
  if (!src) {
    return (
      <div
        role="img"
        aria-label="No Figma export for this variant"
        style={{
          width: '100%',
          maxWidth: maxWidth ?? 281,
          aspectRatio: '281 / 485',
          borderRadius: 12,
          border: '1.5px dashed #cbd5e1',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24, textAlign: 'center',
          fontFamily: 'var(--atom-font-body, Poppins, sans-serif)',
          fontSize: 12, lineHeight: '18px', color: '#64748b',
          backgroundColor: '#f8fafc',
        }}
      >
        Figma ships 25 concrete variants, and this combination is not one of
        them. Pick a different Code Type / Product Module / State pairing to
        see the real design.
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={`${codeType} · ${productModule} · ${state} · ${type}`}
      style={{
        width: '100%',
        maxWidth: maxWidth ?? 281,
        height: 'auto',
        display: 'block',
      }}
    />
  );
}

function renderPreview(p: PreviewState) {
  return (
    <FigmaVariantImage
      codeType={p.codeType}
      productModule={p.productModule}
      state={p.state}
      type={p.type}
    />
  );
}

const DEFAULT_BOOLEANS = Object.fromEntries(BOOLEAN_PROPS.map(p => [p.name, p.default])) as Record<string, boolean>;
const DEFAULT_TEXTS    = Object.fromEntries(TEXT_PROPS.map(p => [p.name, p.defaultValue]))   as Record<string, string>;

/* ──────────────────────────────────────────────────────────────────────────
 * Shipped-variant lookup — Figma publishes only 25 of the 4×6×4×2 = 288
 * theoretical combinations. This set lets the preview rail warn the designer
 * when the current tuple has no Figma counterpart.
 * ────────────────────────────────────────────────────────────────────────── */

const SHIPPED_VARIANTS: ReadonlySet<string> = new Set([
  'QR|Fast Track|Success|Dark',
  'QR|Fast Track|Success|Light',
  'QR|eSIM|Success|Dark',
  'QR|eSIM|Success|Light',
  'QR|Lounge|Success|Dark',
  'QR|Lounge|Success|Light',
  'QR|Dining|Success|Dark',
  'QR|Dining|Success|Light',
  'QR|All|Generating|Dark',
  'QR|All|Generating|Light',
  'QR|All|Failed|Dark',
  'QR|All|Failed|Light',
  'Barcode|All|Success|Dark',
  'Barcode|All|Success|Light',
  'Barcode|All|Generating|Dark',
  'Barcode|All|Generating|Light',
  'Barcode|All|Failed|Dark',
  'Barcode|All|Failed|Light',
  'Membership ID|All|Default|Dark',
  'Membership ID|All|Default|Light',
  'Membership ID|All|Generating|Dark',
  'Membership ID|All|Generating|Light',
  'Membership ID|All|Failed|Dark',
  'Membership ID|All|Failed|Light',
  'Health|Health and Wellness|Default|Light',
]);

function isShippedVariant(c: CodeType, p: ProductModule, s: QRState, t: QRCodeType): boolean {
  return SHIPPED_VARIANTS.has(`${c}|${p}|${s}|${t}`);
}

function FigmaMatchBadge({ codeType, productModule, state, type }: {
  codeType: CodeType;
  productModule: ProductModule;
  state: QRState;
  type: QRCodeType;
}) {
  const shipped = isShippedVariant(codeType, productModule, state, type);
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold',
        shipped
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-amber-50 text-amber-700 border-amber-200',
      ].join(' ')}
      title={
        shipped
          ? 'This combination matches a shipped Figma variant.'
          : 'This combination does not match any of the 25 variants Figma publishes.'
      }
    >
      <span aria-hidden="true">{shipped ? '✓' : '⚠'}</span>
      {shipped ? 'Matches Figma variant' : 'Not a shipped variant'}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Preview-rail helpers
 * ────────────────────────────────────────────────────────────────────────── */

function ControlSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ margin: '0 0 6px', fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {title}
      </p>
      {children}
    </div>
  );
}

function Segmented({ values, selected, onSelect }: { values: string[]; selected: string; onSelect: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {values.map(v => {
        const active = v === selected;
        return (
          <button
            key={v}
            onClick={() => onSelect(v)}
            style={{
              padding: '4px 9px', fontSize: 11, borderRadius: 6,
              border: '1px solid', cursor: 'pointer', fontWeight: active ? 600 : 500,
              transition: 'all 0.1s ease',
              ...(active
                ? { backgroundColor: '#0f172a', color: '#ffffff', borderColor: '#0f172a' }
                : { backgroundColor: 'transparent', color: '#475569', borderColor: '#e2e8f0' }),
            }}
          >
            {v}
          </button>
        );
      })}
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 11, userSelect: 'none' }}>
      <button
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          width: 14, height: 14, borderRadius: 3, border: '1.5px solid',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, cursor: 'pointer',
          backgroundColor: checked ? '#0f172a' : '#ffffff',
          borderColor: checked ? '#0f172a' : '#cbd5e1',
          transition: 'all 0.1s ease',
        }}
      >
        {checked && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path d="M1 3l2 2 4-4" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <span style={{ color: '#475569' }}>{label}</span>
    </label>
  );
}

function TextInput({ label, value, onChange, multiline = false, maxLength = 80 }:
  { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; maxLength?: number }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 10, color: '#6b7280', fontWeight: 500 }}>{label}</span>
      {multiline ? (
        <textarea
          rows={3} value={value} maxLength={maxLength}
          onChange={e => onChange(e.target.value)}
          style={{
            padding: '6px 8px', fontSize: 11, borderRadius: 4, border: '1px solid #e2e8f0',
            color: '#1f2937', backgroundColor: '#ffffff', resize: 'vertical', fontFamily: 'inherit',
          }}
        />
      ) : (
        <input
          type="text" value={value} maxLength={maxLength}
          onChange={e => onChange(e.target.value)}
          style={{
            padding: '5px 8px', fontSize: 11, borderRadius: 4, border: '1px solid #e2e8f0',
            color: '#1f2937', backgroundColor: '#ffffff',
          }}
        />
      )}
    </label>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Design Tokens + Accessibility catalogues
 * ────────────────────────────────────────────────────────────────────────── */

const TOKEN_TABLE_ROWS: {
  label: string; cssVar: string; fallback: string; tokenKey?: string; types: QRCodeType[];
}[] = [
  { label: 'Card bg (Light)',    cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff', types: ['Light'] },
  { label: 'Card bg (Dark)',     cssVar: '--atom-foreground-primary-fg-brand-primary',   tokenKey: 'atom.foreground.primary.fg-brand-primary',   fallback: '#0a2333', types: ['Dark']  },
  { label: 'Glyph fg (Light)',   cssVar: '--atom-foreground-primary-fg-brand-primary',   tokenKey: 'atom.foreground.primary.fg-brand-primary',   fallback: '#0a2333', types: ['Light'] },
  { label: 'Glyph fg (Dark)',    cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff', types: ['Dark']  },
  { label: 'Border',             cssVar: '--atom-border-default-border-default',         tokenKey: 'atom.border.default.border-default',         fallback: '#cdcbcb', types: ['Light'] },
  { label: 'Name text',          cssVar: '--atom-foreground-core-fg-primary',            tokenKey: 'atom.foreground.core.fg-primary',            fallback: '#4b4a4a', types: ['Light', 'Dark'] },
  { label: 'Card number / desc', cssVar: '--atom-foreground-core-fg-secondary',          tokenKey: 'atom.foreground.core.fg-secondary',          fallback: '#737272', types: ['Light'] },
  { label: 'Offer ribbon',       cssVar: '--atom-background-core-bg-accent',             tokenKey: 'atom.background.core.bg-accent',             fallback: '#d53f34', types: ['Light', 'Dark'] },
  { label: 'Divider',            cssVar: '--atom-border-default-border-divider',         tokenKey: 'atom.border.default.border-divider',         fallback: '#cdcbcb', types: ['Light'] },
  { label: 'Failed icon',        cssVar: '--atom-foreground-feedback-fg-error',          tokenKey: 'atom.foreground.feedback.fg-error',          fallback: '#e02d3c', types: ['Light'] },
  { label: 'Spinner',            cssVar: '--atom-foreground-core-fg-link',               tokenKey: 'atom.foreground.core.fg-link',               fallback: '#006b99', types: ['Light', 'Dark'] },
];

const A11Y_ROWS = [
  { icon: '🏷️', title: 'Semantic labelling', body: 'The code pattern should be exposed to assistive tech with a concise label (e.g. "QR code for eSIM install"). Decorative framing around it — chevrons, wallet icons — must carry its own label or be hidden from the accessibility tree.' },
  { icon: '👁️', title: 'Always provide an alternative', body: 'Not every user can scan with a camera. Pair every code with the same information in text form — a short code, a URL, or a "Copy to clipboard" affordance — so keyboard-only users, users with tremors, and users on desktops can still complete the task.' },
  { icon: '🎨', title: 'Contrast', body: 'Light uses dark glyph on white. Dark uses white glyph on brand primary. Both directions meet WCAG AAA (7:1) for the pattern. Do not re-tint the glyph in brand colors — scanners require strict binary contrast.' },
  { icon: '📏', title: 'Minimum size & quiet zone', body: 'Render the code at 140×140px minimum and never crop the quiet zone around the glyph. Scanner phones need ~4 modules of whitespace on each side to lock on reliably, especially in low light.' },
  { icon: '🧠', title: 'Context & trust', body: 'Always explain what scanning will do (install an eSIM, open a URL, verify identity). Users are increasingly cautious of QR-code phishing — an explicit description paragraph is a trust signal, not just decoration.' },
  { icon: '🔄', title: 'Loading / failed states', body: 'When the code is Generating or Failed, announce the status text to screen readers via aria-live="polite". The Refresh button must be reachable by keyboard when it appears.' },
];

/* ──────────────────────────────────────────────────────────────────────────
 * Page
 * ────────────────────────────────────────────────────────────────────────── */

export function QRCodePage({ brand }: QRCodePageProps) {
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  // Variant state
  const [codeType,      setCodeType]      = useState<CodeType>('QR');
  const [productModule, setProductModule] = useState<ProductModule>('Fast Track');
  const [state,         setState]         = useState<QRState>('Success');
  const [type,          setType]          = useState<QRCodeType>('Dark');

  // Boolean + text state — initialised from Figma defaults
  const [booleans, setBooleans] = useState<Record<string, boolean>>(() => ({ ...DEFAULT_BOOLEANS }));
  const [texts,    setTexts]    = useState<Record<string, string>>(()  => ({ ...DEFAULT_TEXTS }));

  const setBool = (name: string, v: boolean) => setBooleans(prev => ({ ...prev, [name]: v }));
  const setText = (name: string, v: string)  => setTexts   (prev => ({ ...prev, [name]: v }));

  const previewState: PreviewState = { codeType, productModule, state, type, b: booleans, t: texts };
  const previewKey = [
    codeType, productModule, state, type,
    ...Object.entries(booleans).map(([k, v]) => `${k}:${v}`),
    ...Object.entries(texts   ).map(([k, v]) => `${k}:${v.length}`),
  ].join('|');

  const canvasBg = type === 'Dark' ? DARK_BG : DOTTED_BG;

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-slate-50">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Interactive Preview</span>
            <FigmaMatchBadge codeType={codeType} productModule={productModule} state={state} type={type} />
          </div>
          <div className="flex flex-col md:flex-row" style={{ minHeight: 520 }}>

            {/* Canvas */}
            <div className="flex-1 flex items-center justify-center p-10" style={canvasBg}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                >
                  {renderPreview(previewState)}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls rail — every Figma property is exposed here */}
            <div
              className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-4 flex flex-col gap-4 overflow-y-auto"
              style={{ maxHeight: 720 }}
            >
              <ControlSection title="Code Type">
                <Segmented values={CODE_TYPES} selected={codeType} onSelect={v => setCodeType(v as CodeType)} />
              </ControlSection>

              <ControlSection title="Product Module">
                <Segmented values={PRODUCT_MODULES} selected={productModule} onSelect={v => setProductModule(v as ProductModule)} />
              </ControlSection>

              <ControlSection title="State">
                <Segmented values={QR_STATES} selected={state} onSelect={v => setState(v as QRState)} />
              </ControlSection>

              <ControlSection title="Type">
                <Segmented values={QR_TYPES} selected={type} onSelect={v => setType(v as QRCodeType)} />
              </ControlSection>

              <ControlSection title={`Booleans (${BOOLEAN_PROPS.length})`}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, rowGap: 6 }}>
                  {BOOLEAN_PROPS.map(p => (
                    <Checkbox key={p.name} label={p.name} checked={booleans[p.name]} onChange={v => setBool(p.name, v)} />
                  ))}
                </div>
              </ControlSection>

              <ControlSection title={`Text slots (${TEXT_PROPS.length})`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {TEXT_PROPS.map(p => (
                    <TextInput
                      key={p.name}
                      label={p.name}
                      value={texts[p.name]}
                      onChange={v => setText(p.name, v)}
                      multiline={p.name === 'Description Text' || p.name === 'Description Text 1'}
                      maxLength={p.name === 'Description Text' || p.name === 'Description Text 1' ? 240 : 80}
                    />
                  ))}
                </div>
              </ControlSection>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">QR Code</h1>
            <p className="text-slate-500 text-sm max-w-xl">
              A polymorphic scannable-code block. The <em>Product Module</em> variant reshapes the surrounding card
              for Fast Track check-in, eSIM activation, Lounge access, Dining vouchers, generic states, or
              Health &amp; Wellness. Font family updates per brand via <code className="text-xs bg-slate-100 px-1 rounded">--atom-font-body</code>.
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
          Shared structure across every Product Module. Each module re-uses or omits these parts — toggle them in the preview rail to see the effect.
        </p>

        <div className="relative flex items-center justify-center py-16 px-8 rounded-xl" style={DOTTED_BG}>
          {renderPreview({
            codeType: 'QR',
            productModule: 'eSIM',
            state: 'Success',
            type: 'Light',
            b: DEFAULT_BOOLEANS,
            t: DEFAULT_TEXTS,
          })}
        </div>

        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {[
            { num: '1', name: 'Container',    desc: 'Outer card: 16px radius, 1px border on Light, 24px padding, subtle drop-shadow. Background flips to brand primary on Dark.' },
            { num: '2', name: 'Header row',   desc: 'Chevrons for stepping between codes plus an optional Counter ("1 of 2"). Hides entirely on Health and Wellness.' },
            { num: '3', name: 'Code glyph',   desc: 'The scannable pattern. Swaps by Code Type — QR (21×21 modules), Barcode (linear), Membership ID (alphanumeric), Health (wellness glyph).' },
            { num: '4', name: 'Name / card',  desc: '14px weight 600 name and 12px weight 400 card number with 0.04em letter-spacing. Uses foreground-primary and foreground-secondary.' },
            { num: '5', name: 'Description',  desc: 'Optional 11px paragraph capped at ~260px wide, centered. Copy comes from Description Text or Description Text 1.' },
            { num: '6', name: 'Footer / CTA', desc: 'Product-Module-specific: Add to Wallet (eSIM, Lounge), Refresh Button (All · Generating / Failed), or Powered-by footer (Fast Track).' },
          ].map(row => (
            <div key={row.num} style={{ display: 'flex', gap: 10, padding: 12, borderRadius: 8, backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#111827', flexShrink: 0, marginTop: 1, minWidth: 12 }}>{row.num}</span>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#111827' }}>{row.name}</p>
                <p style={{ margin: '3px 0 0', fontSize: 12, color: '#6b7280', lineHeight: 1.4 }}>{row.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. VARIANTS ──────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Variants</h2>
        <p className="text-sm text-slate-500 mb-4">
          Figma ships <strong>25 concrete variants</strong>, not every cross-product of the four properties.{' '}
          <strong>QR</strong> appears in Fast Track, eSIM, Lounge, Dining, and All (Generating / Failed only for All).{' '}
          <strong>Barcode</strong> and <strong>Membership ID</strong> ship only in the <strong>All</strong> module.{' '}
          <strong>Health</strong> ships only in Health and Wellness, and only as <strong>Type = Light</strong>.
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">Property</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Values</th>
              </tr>
            </thead>
            <tbody>
              {([
                {
                  label: 'Code Type',
                  chips: [
                    { text: 'QR',            note: '21×21 modules', isDefault: true },
                    { text: 'Barcode',       note: 'linear' },
                    { text: 'Membership ID', note: 'alphanumeric' },
                    { text: 'Health',        note: 'wellness glyph' },
                  ],
                },
                {
                  label: 'Product Module',
                  chips: PRODUCT_MODULES.map(m => ({ text: m, note: '', isDefault: m === 'Fast Track' })),
                },
                {
                  label: 'State',
                  chips: QR_STATES.map(s => ({ text: s, note: '', isDefault: s === 'Success' })),
                },
                {
                  label: 'Type',
                  chips: [
                    { text: 'Dark',  note: 'brand-primary bg', isDefault: true },
                    { text: 'Light', note: 'white bg + border' },
                  ],
                },
                {
                  label: `Booleans (${BOOLEAN_PROPS.length})`,
                  chips: BOOLEAN_PROPS.map(p => ({ text: p.name, note: p.default ? 'default on' : 'default off' })),
                },
                {
                  label: `Text slots (${TEXT_PROPS.length})`,
                  chips: TEXT_PROPS.map(p => ({ text: p.name, note: '' })),
                },
                {
                  label: 'Font family',
                  chips: [
                    { text: 'Poppins',  note: 'Dragonpass' },
                    { text: 'Arial',    note: 'Mastercard' },
                    { text: 'Inter',    note: 'Investec' },
                    { text: 'Manrope',  note: 'Visa · Greyscale' },
                    { text: 'Lato',     note: 'Assurant' },
                  ],
                },
              ] as { label: string; chips: { text: string; note?: string; isDefault?: boolean }[] }[]).map((row, i, arr) => (
                <tr key={row.label} className={i < arr.length - 1 ? 'border-b border-slate-100' : ''}>
                  <td className="px-5 py-3.5 font-medium text-slate-700 text-sm align-top">{row.label}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      {row.chips.map(({ text, note, isDefault }) => (
                        <span
                          key={text}
                          className={[
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium',
                            isDefault
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'border-slate-200 bg-slate-50 text-slate-600',
                          ].join(' ')}
                        >
                          {text}
                          {note && (
                            <span className={isDefault ? 'text-slate-300 font-normal' : 'text-slate-400 font-normal'}>
                              · {note}
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual preview — 10 cards covering every Figma variant axis */}
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {([
            { id: 'ft-dark',    module: 'Fast Track',          codeType: 'QR'            as CodeType, state: 'Success'    as QRState, type: 'Dark'  as QRCodeType },
            { id: 'esim-light', module: 'eSIM',                codeType: 'QR'            as CodeType, state: 'Success'    as QRState, type: 'Light' as QRCodeType },
            { id: 'lng-dark',   module: 'Lounge',              codeType: 'QR'            as CodeType, state: 'Success'    as QRState, type: 'Dark'  as QRCodeType },
            { id: 'dn-light',   module: 'Dining',              codeType: 'QR'            as CodeType, state: 'Success'    as QRState, type: 'Light' as QRCodeType, bOverride: { Offer: true } },
            { id: 'all-bc',     module: 'All',                 codeType: 'Barcode'       as CodeType, state: 'Success'    as QRState, type: 'Dark'  as QRCodeType },
            { id: 'all-mid',    module: 'All',                 codeType: 'Membership ID' as CodeType, state: 'Default'    as QRState, type: 'Light' as QRCodeType },
            { id: 'all-gen',    module: 'All',                 codeType: 'QR'            as CodeType, state: 'Generating' as QRState, type: 'Dark'  as QRCodeType, bOverride: { 'Refresh Button': true } },
            { id: 'all-fail',   module: 'All',                 codeType: 'QR'            as CodeType, state: 'Failed'     as QRState, type: 'Light' as QRCodeType, bOverride: { 'Refresh Button': true } },
            { id: 'hw',         module: 'Health and Wellness', codeType: 'Health'        as CodeType, state: 'Default'    as QRState, type: 'Light' as QRCodeType },
            { id: 'dn-brand',   module: 'Dining',              codeType: 'QR'            as CodeType, state: 'Success'    as QRState, type: 'Dark'  as QRCodeType, bOverride: { Offer: true, 'Special Brand Logo': true } },
          ] as const).map(v => (
            <div key={v.id} style={{
              padding: '20px 16px', borderRadius: 10,
              border: '1px solid #f3f4f6', backgroundColor: '#fafafa',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#6b7280' }}>{v.module}</p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9ca3af' }}>
                  {v.codeType} · {v.state} · {v.type}
                </p>
              </div>
              {renderPreview({
                codeType: v.codeType,
                productModule: v.module as ProductModule,
                state: v.state,
                type: v.type,
                b: { ...DEFAULT_BOOLEANS, ...('bOverride' in v ? v.bOverride : {}) },
                t: DEFAULT_TEXTS,
              })}
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Design Tokens</h2>
        <p className="text-sm text-slate-500 mb-4">
          Active tokens for the selected Type are highlighted. Switch Type or Brand to see values update.
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">Token</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">CSS Variable</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">Value ({brand})</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_TABLE_ROWS.map((row, i) => {
                const isActive      = row.types.includes(type);
                const resolvedValue = row.tokenKey ? (tokens[row.tokenKey as keyof typeof tokens] ?? row.fallback) : row.fallback;
                const swatchHex     = resolvedValue.length > 7 ? resolvedValue.slice(0, 7) : resolvedValue;
                const light         = isLightColor(swatchHex);
                return (
                  <tr
                    key={`${row.cssVar}-${row.label}`}
                    className={[
                      i < TOKEN_TABLE_ROWS.length - 1 ? 'border-b border-slate-100' : '',
                      isActive ? 'bg-blue-50/60' : 'opacity-40',
                      'transition-all duration-150',
                    ].join(' ')}
                    style={isActive ? { borderLeft: '3px solid #3b82f6' } : { borderLeft: '3px solid transparent' }}
                  >
                    <td className="px-5 py-3 font-medium text-slate-700 text-xs">{row.label}</td>
                    <td className="px-5 py-3">
                      <code className="font-mono text-xs text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                        {row.cssVar}
                      </code>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded flex-shrink-0 border border-black/10" style={{ backgroundColor: swatchHex }} />
                        <span className="font-mono text-xs px-1.5 py-0.5 rounded border"
                          style={{ backgroundColor: swatchHex, color: light ? '#1e293b' : '#f8fafc', borderColor: light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)' }}>
                          {swatchHex.toUpperCase()}
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
        <p className="text-sm text-slate-500 mb-4">Guidelines for designing inclusive QR Code experiences.</p>
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
          When and how to reach for each Product Module.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
          {[
            { title: 'Fast Track',          color: '#0a2333', bg: '#f0f4f8', when: 'Airport check-in confirmations: show the user what they\'re checked into, who they are, and when they arrived.' },
            { title: 'eSIM',                color: '#0a2333', bg: '#f9fafb', when: 'Mobile-data provisioning flows. Pair the code with explanatory copy so users know what scanning will install.' },
            { title: 'Lounge',              color: '#0a2333', bg: '#f0f9ff', when: 'Airport-lounge access. Show airport name, terminal, and validity window; pair with Add to Wallet.' },
            { title: 'Dining',              color: '#0a2333', bg: '#fef9f4', when: 'Restaurant vouchers and percentage-off offers. Dining Location + Offer Text + Validity is the common shape.' },
            { title: 'All (states)',        color: '#0a2333', bg: '#f8fafc', when: 'Generic card for Generating / Failed states. Used across Barcode, Membership ID, and QR when the code isn\'t ready.' },
            { title: 'Health and Wellness', color: '#0a2333', bg: '#f0fdf4', when: 'Paired exclusively with Code Type = Health. Simpler shell without chevrons; presented to staff at wellness venues.' },
          ].map(card => (
            <div key={card.title} style={{ padding: '14px 16px', borderRadius: 10, border: `1px solid ${card.color}22`, backgroundColor: card.bg }}>
              <p style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 600, color: card.color }}>{card.title}</p>
              <p style={{ margin: 0, fontSize: 12, color: '#4b5563', lineHeight: 1.5 }}>{card.when}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: '#166534' }}>✓ When to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 12.5, color: '#15803d', lineHeight: 1.4 }}>
              <li style={{ marginBottom: 6 }}>• Pair every code with a readable alternative — code, URL, or copy button</li>
              <li style={{ marginBottom: 6 }}>• Pick the Product Module that matches the task — don't genericise</li>
              <li style={{ marginBottom: 6 }}>• Show Validity where it applies (Lounge, Dining)</li>
              <li style={{ marginBottom: 6 }}>• Show Status Text + Refresh Button on Generating / Failed states</li>
              <li>• Use Light on light surfaces, Dark on brand-colored surfaces</li>
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: '#991b1b' }}>✗ When not to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 12.5, color: '#b91c1c', lineHeight: 1.4 }}>
              <li style={{ marginBottom: 6 }}>• Don't rely on the code alone — always pair with a readable alternative</li>
              <li style={{ marginBottom: 6 }}>• Don't render smaller than 140×140px or remove the quiet-zone padding</li>
              <li style={{ marginBottom: 6 }}>• Don't re-tint the glyph in brand colors — scanners need binary contrast</li>
              <li style={{ marginBottom: 6 }}>• Don't mix Product Modules in one screen — pick one that matches the task</li>
              <li>• Don't hide the Refresh Button while the code is Failed — users need a way out</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
