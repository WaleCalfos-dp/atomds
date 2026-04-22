import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TransportCardLive,
  type TransportCardType,
  type TransportCardState,
  type TransportCardBackground,
  type TransportCarModel,
} from '../components/card/TransportCardLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

interface TransportCardPageProps {
  brand: Brand;
}

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// Figma order on the component set:
const ALL_TYPES:   TransportCardType[]        = ['Info', 'Selectable with price'];
const ALL_STATES:  TransportCardState[]       = ['Default', 'Selected'];
const ALL_BG:      TransportCardBackground[]  = ['Yes', 'No'];

const CAR_MODELS: { model: TransportCarModel; src: string; capacity: string; bags: string }[] = [
  { model: 'Economy',            src: '/cars/economy.png',        capacity: 'Up to 3', bags: '2 bags max' },
  { model: 'Comfort Sedan',      src: '/cars/comfort-sedan.png',  capacity: 'Up to 3', bags: '2 bags max' },
  { model: 'Comfort Van / MPV',  src: '/cars/comfort-van.png',    capacity: 'Up to 6', bags: '4 bags max' },
  { model: 'Business Sedan',     src: '/cars/business-sedan.png', capacity: 'Up to 3', bags: '3 bags max' },
  { model: 'Business Van / MPV', src: '/cars/business-van.png',   capacity: 'Up to 6', bags: '5 bags max' },
  { model: 'First Class',        src: '/cars/first-class.png',    capacity: 'Up to 2', bags: '3 bags max' },
];

type TokenRow = { label: string; cssVar: string; tokenKey: string; fallback: string };

const TOKEN_TABLE_ROWS: TokenRow[] = [
  { label: 'Surface (Fill=Yes)',  cssVar: '--atom-background-primary-bg-primary-inverse',  tokenKey: 'atom.background.primary.bg-primary-inverse',  fallback: '#ffffff' },
  { label: 'Border',              cssVar: '--atom-border-default-border-default',          tokenKey: 'atom.border.default.border-default',          fallback: '#cdcbcb' },
  { label: 'Divider (Fill=No)',   cssVar: '--atom-border-default-border-divider',          tokenKey: 'atom.border.default.border-divider',          fallback: '#cdcbcb' },
  { label: 'Selected border',     cssVar: '--atom-border-selection-and-focus-border-selected', tokenKey: 'atom.border.selection-and-focus.border-selected', fallback: '#0a2333' },
  { label: 'Title',               cssVar: '--atom-foreground-primary-fg-brand-primary',    tokenKey: 'atom.foreground.primary.fg-brand-primary',    fallback: '#0a2333' },
  { label: 'Description / meta',  cssVar: '--atom-foreground-core-fg-secondary',           tokenKey: 'atom.foreground.core.fg-secondary',           fallback: '#737272' },
  { label: 'Strike-through price', cssVar: '--atom-foreground-core-fg-tertiary',           tokenKey: 'atom.foreground.core.fg-tertiary',            fallback: '#afaead' },
];

const A11Y_ROWS = [
  { icon: '🎛️', title: 'Radio semantics',   body: 'Selectable cards behave as a radio group — exactly one is selected at a time. Use <input type="radio"> (visually hidden) with a real name, or role="radio" inside role="radiogroup".' },
  { icon: '⌨️', title: 'Keyboard navigation', body: 'Arrow keys move selection within the group; Space/Enter commits it. Tab enters the group once; subsequent Tabs leave it. Never put each card in its own tab-stop.' },
  { icon: '🎨', title: 'Selection not by colour alone', body: 'The Selected state adds a 2px border in addition to any colour change. Don\'t rely on the colour shift alone — keep the border at 2px so low-vision users can see it.' },
  { icon: '🏷️', title: 'Labelling',         body: 'Associate the visible car title, capacity, luggage, and price with the radio via aria-labelledby and aria-describedby so screen readers announce the full offer.' },
  { icon: '🖼️', title: 'Car image',         body: 'The car illustration is decorative — it has aria-hidden on the <img> and never carries meaningful alt text. Never let it be the only indicator of the vehicle type.' },
  { icon: '📏', title: 'Touch target',      body: 'The whole card (327px × ≥64px) is the hit target. Meets the 44×44 minimum with margin. Never shrink below 60px height even at cramped breakpoints.' },
];

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

export function TransportCardPage({ brand }: TransportCardPageProps) {
  const [type,   setType]   = useState<TransportCardType>('Selectable with price');
  const [state,  setState]  = useState<TransportCardState>('Default');
  const [bg,     setBg]     = useState<TransportCardBackground>('Yes');
  const [car,    setCar]    = useState<TransportCarModel>('Comfort Sedan');
  const [showInformation, setShowInformation] = useState(true);
  const [showPrices,      setShowPrices]      = useState(true);
  const [showRadio,       setShowRadio]       = useState(true);
  const [showCarImage,    setShowCarImage]    = useState(true);

  // Figma lock: Info only ships Default state.
  const effectiveState: TransportCardState = type === 'Info' ? 'Default' : state;
  const activeCar = CAR_MODELS.find(c => c.model === car) ?? CAR_MODELS[1];

  const previewKey = [type, effectiveState, bg, car, showInformation, showPrices, showRadio, showCarImage].join('-');
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-80">
            <div className="flex-1 flex items-center justify-center p-12 min-h-60" style={DOTTED_BG}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                >
                  <TransportCardLive
                    type={type}
                    state={effectiveState}
                    backgroundFill={bg}
                    carModel={activeCar.model}
                    carType={activeCar.model}
                    description1={activeCar.capacity}
                    description2={activeCar.bags}
                    showInformation={showInformation}
                    showPrices={showPrices}
                    showRadio={showRadio}
                    showCarImage={showCarImage}
                    brand={brand}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5 overflow-y-auto">

              {/* Type */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Type</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={[
                        'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        type === t
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* State */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">State</p>
                <div className={['flex flex-wrap gap-1.5', type === 'Info' ? 'opacity-50' : ''].join(' ')}>
                  {ALL_STATES.map((s) => (
                    <button
                      key={s}
                      onClick={() => type !== 'Info' && setState(s)}
                      disabled={type === 'Info'}
                      className={[
                        'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        effectiveState === s
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {type === 'Info' && (
                  <p className="text-[11px] text-slate-400 mt-1">Info only ships Default state.</p>
                )}
              </div>

              {/* Background Fill */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Background Fill</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_BG.map((b) => (
                    <button
                      key={b}
                      onClick={() => setBg(b)}
                      className={[
                        'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        bg === b
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Car Model */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Car Model</p>
                <div className="flex flex-col gap-1">
                  {CAR_MODELS.map(({ model }) => (
                    <button
                      key={model}
                      onClick={() => setCar(model)}
                      className={[
                        'text-left px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        car === model
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>

              {/* Booleans */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Booleans</p>
                <div className="flex flex-col gap-1.5">
                  {[
                    { label: 'Information',  value: showInformation, set: setShowInformation },
                    { label: 'Prices',       value: showPrices,      set: setShowPrices },
                    { label: 'Radio Button', value: showRadio,       set: setShowRadio },
                    { label: 'Car Image',    value: showCarImage,    set: setShowCarImage },
                  ].map(({ label, value, set }) => (
                    <label key={label} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => set(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 accent-slate-900"
                      />
                      <span className="text-xs text-slate-600">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ────────────────────────────────────────────── */}
      <section>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Transport Card</h1>
        <p className="text-[15px] text-slate-500 leading-relaxed mb-4 max-w-2xl">
          A specialised card for choosing a mode of transport. Two Types (Info · Selectable with price), a Default/Selected state on Selectable, and a Background Fill axis that swaps between a filled card surface and a divider-only rule. Ships with six car illustrations (Economy → First Class).
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-slate-200 bg-slate-50 text-xs text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Domain · Transport
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-emerald-200 bg-emerald-50 text-xs text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Stable
          </span>
        </div>
      </section>

      {/* ── 3. ANATOMY ───────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Anatomy</h2>
        <p className="text-sm text-slate-500 mb-4">The parts that make up a Transport Card in Figma.</p>
        <div className="grid md:grid-cols-2 gap-6 rounded-xl border border-slate-200 bg-white shadow-sm p-6">
          <div className="flex items-center justify-center p-6 rounded-lg border border-slate-100 bg-slate-50" style={DOTTED_BG}>
            <TransportCardLive
              type="Selectable with price"
              state="Default"
              backgroundFill="Yes"
              carModel="Comfort Sedan"
              carType="Comfort Sedan"
              description1="Up to 3"
              description2="2 bags max"
              brand={brand}
            />
          </div>
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-12">#</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">Label</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { n: 1, label: 'Container',     body: '327px wide, 8px radius, 1px border on Fill=Yes or a bottom hairline rule on Fill=No. Height tracks content (64 / 80 / 92 / 108 px spec heights).' },
                  { n: 2, label: 'Radio button',  body: '20px circle on the leading edge (Selectable only). Unselected = 1.5px border, Selected = 2px filled ring. Controlled by the Radio Button boolean.' },
                  { n: 3, label: 'Car image',     body: '48×48 illustration from the _cars component set (six models). Controlled by the Car Image boolean; hidden for metadata-only rows.' },
                  { n: 4, label: 'Car title',     body: 'The Car Type text slot — 14px / weight 600, color fg-brand-primary.' },
                  { n: 5, label: 'Information',   body: 'Two optional icon+label chips (capacity, luggage). Bound to the Item 1 / Item 2 and Description 1 / Description 2 slots; collapsed when Information=off.' },
                  { n: 6, label: 'Prices',        body: 'Strike-through Price 1 + effective Price 2, right-aligned. Controlled by Prices / Price 1 / Price 2 booleans.' },
                ].map((row, i, arr) => (
                  <tr key={row.n} className={i < arr.length - 1 ? 'border-b border-slate-100' : ''}>
                    <td className="px-4 py-2.5 text-xs text-slate-500 font-mono">{row.n}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-700 font-medium">{row.label}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-500">{row.body}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 4. VARIANTS ──────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-4">Variants</h2>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">Property</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Values</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Type',             chips: [{text: 'Info', note: 'Default'}, {text: 'Selectable with price', note: ''}] },
                { label: 'State',            chips: [{text: 'Default', note: 'Default'}, {text: 'Selected', note: 'Selectable only'}] },
                { label: 'Background Fill', chips: [{text: 'Yes', note: 'Default'}, {text: 'No', note: ''}] },
                { label: 'Booleans (8)',     chips: [
                  {text: 'Item 1', note: ''}, {text: 'Item 2', note: ''}, {text: 'Car Image', note: ''},
                  {text: 'Price 1', note: ''}, {text: 'Price 2', note: ''}, {text: 'Prices', note: ''},
                  {text: 'Information', note: ''}, {text: 'Radio Button', note: ''},
                ]},
                { label: 'Text slots (5)',   chips: [
                  {text: 'Car Type', note: ''}, {text: 'Description 1', note: ''}, {text: 'Description 2', note: ''},
                  {text: 'Price 1 Text', note: ''}, {text: 'Price 2 Text', note: ''},
                ]},
                { label: 'Car illustrations', chips: CAR_MODELS.map(c => ({text: c.model, note: ''})) },
                { label: 'Font family',      chips: [
                  {text: 'Poppins', note: 'Dragonpass'}, {text: 'Arial', note: 'Mastercard'}, {text: 'Inter', note: 'Investec'},
                  {text: 'Manrope', note: 'Visa · Greyscale'}, {text: 'Lato', note: 'Assurant'},
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

        {/* Visual preview grid — 6 concrete Figma permutations */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {[
            { label: 'Info · Default · Fill',             t: 'Info'                    as TransportCardType, s: 'Default'  as TransportCardState, b: 'Yes' as TransportCardBackground },
            { label: 'Info · Default · No fill',          t: 'Info'                    as TransportCardType, s: 'Default'  as TransportCardState, b: 'No'  as TransportCardBackground },
            { label: 'Selectable · Default · Fill',       t: 'Selectable with price'   as TransportCardType, s: 'Default'  as TransportCardState, b: 'Yes' as TransportCardBackground },
            { label: 'Selectable · Default · No fill',    t: 'Selectable with price'   as TransportCardType, s: 'Default'  as TransportCardState, b: 'No'  as TransportCardBackground },
            { label: 'Selectable · Selected · Fill',      t: 'Selectable with price'   as TransportCardType, s: 'Selected' as TransportCardState, b: 'Yes' as TransportCardBackground },
            { label: 'Selectable · Selected · No fill',   t: 'Selectable with price'   as TransportCardType, s: 'Selected' as TransportCardState, b: 'No'  as TransportCardBackground },
          ].map(({ label, t, s, b }) => (
            <div key={label} style={{
              borderRadius: '12px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa',
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid #f3f4f6', backgroundColor: '#ffffff' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#374151' }}>{label}</p>
              </div>
              <div style={{ flex: 1, padding: '28px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', ...DOTTED_BG }}>
                <TransportCardLive type={t} state={s} backgroundFill={b} brand={brand} />
              </div>
            </div>
          ))}
        </div>

        {/* Car model reference strip */}
        <div style={{ marginTop: '24px' }}>
          <p style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Car illustrations
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {CAR_MODELS.map(({ model, src, capacity, bags }) => (
              <div key={model} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 16px', borderRadius: '10px',
                backgroundColor: '#ffffff', border: '1px solid #e5e7eb',
              }}>
                <img src={src} alt="" aria-hidden="true" width={56} height={56}
                  style={{ width: '56px', height: '56px', objectFit: 'contain', flexShrink: 0 }}
                  draggable={false} />
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#0A2333', lineHeight: 1.3 }}>{model}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#6b7280' }}>{capacity} · {bags}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Design Tokens</h2>
        <p className="text-sm text-slate-500 mb-4">All colour decisions are token-backed. Values update with the brand selector.</p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">Token</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">CSS Variable</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">Value</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_TABLE_ROWS.map((row, i) => {
                const resolvedValue = (tokens[row.tokenKey as keyof typeof tokens] as string | undefined) ?? row.fallback;
                const swatchHex = resolvedValue.length > 7 ? resolvedValue.slice(0, 7) : resolvedValue;
                const light = isLightColor(swatchHex);
                return (
                  <tr key={row.cssVar} className={i < TOKEN_TABLE_ROWS.length - 1 ? 'border-b border-slate-100' : ''}>
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

      {/* ── 6. ACCESSIBILITY ─────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Accessibility</h2>
        <p className="text-sm text-slate-500 mb-4">Guidelines for implementing Transport Card inclusively.</p>
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

      {/* ── 7. USAGE ─────────────────────────────────────────────────────── */}
      <section>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>Usage</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          When and how to use Transport Card. For general-purpose scannable blocks (media + title + action), use Card.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>✓ When to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>• Chauffeur / ride-hail booking with a radio group of options</li>
              <li style={{ marginBottom: '6px' }}>• Comparing transport tiers side-by-side (capacity, luggage, price)</li>
              <li style={{ marginBottom: '6px' }}>• Itinerary summary row (Type = Info, State = Default)</li>
              <li style={{ marginBottom: '6px' }}>• Confirmation screens showing the selected vehicle</li>
              <li>• Use Background Fill = No when stacked inside another Card or Dialog</li>
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>✗ When not to use</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              <li style={{ marginBottom: '6px' }}>• Non-transport selections — use Card or List Item</li>
              <li style={{ marginBottom: '6px' }}>• Multi-select scenarios — use Checkbox rows</li>
              <li style={{ marginBottom: '6px' }}>• Selectable with an Info type — Info is always read-only</li>
              <li style={{ marginBottom: '6px' }}>• Custom car illustrations outside the six Figma models</li>
              <li>• Cramped layouts ({'<'} 327px) — the card has a fixed width</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
