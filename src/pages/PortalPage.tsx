import { useMemo, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Brand, type BrandTokens, type SemanticTokenKey } from '../data/tokens';
import {
  type AccessibilityCheck,
  type CorePrimitives,
  type CustomBrand,
  type CustomBrandMode,
  DEFAULT_PRIMITIVES,
  PRIMITIVE_DESCRIPTORS,
  TOKEN_DERIVATION,
  TOKEN_GROUP_ORDER,
  TOKEN_INFO,
  auditTokens,
  deriveTokens,
  describeRule,
  generateCss,
  tokensInGroup,
} from '../data/deriveTokens';
import { ButtonLive } from '../components/button/ButtonLive';
import { AlertLive } from '../components/alert/AlertLive';
import { BadgeLive } from '../components/badge/BadgeLive';
import { InputLive } from '../components/input/InputLive';
import { CardLive } from '../components/card/CardLive';
import { ProgressIndicatorLive } from '../components/progress-indicator/ProgressIndicatorLive';
import { BreadcrumbsLive } from '../components/breadcrumbs/BreadcrumbsLive';

interface PortalPageProps {
  customBrand: CustomBrand | null;
  setCustomBrand: (brand: CustomBrand) => void;
  clearCustomBrand: () => void;
  setBrand: (brand: Brand) => void;
}

// ─── Form grouping for Simple mode ────────────────────────────────────────────
type PrimitiveKey = keyof CorePrimitives;

const SIMPLE_GROUPS: { title: string; keys: PrimitiveKey[] }[] = [
  { title: 'Core brand', keys: ['brandPrimary', 'brandHover', 'brandPressed'] },
  { title: 'Text', keys: ['textPrimary', 'textSecondary', 'textTertiary'] },
  { title: 'Neutral & link', keys: ['link', 'backgroundSecondary', 'borderDefault'] },
  { title: 'Feedback', keys: ['feedbackSuccess', 'feedbackWarning', 'feedbackError', 'feedbackInfo'] },
];

// Token → CSS var (same table generateCss uses; duplicated here so preview
// inline style doesn't have to import from tokens.ts).
const CSS_VAR_FOR: Record<SemanticTokenKey, string> = Object.fromEntries(
  (Object.keys(TOKEN_DERIVATION) as SemanticTokenKey[]).map((k) => [
    k,
    '--atom-' + k.replace(/^atom\./, '').replace(/\./g, '-'),
  ]),
) as Record<SemanticTokenKey, string>;

// ─── Tiny color input (shared by Simple and Full modes) ──────────────────────
function ColorSwatchInput({
  value,
  onChange,
  label,
  subtitle,
  extra,
  compact = false,
}: {
  value: string;
  onChange: (next: string) => void;
  label: string;
  subtitle?: string;
  extra?: React.ReactNode;
  compact?: boolean;
}) {
  // <input type="color"> requires 6-digit hex with no alpha.
  const safeValue = /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#000000';
  return (
    <div className={compact ? 'py-2' : 'py-3 border-b border-slate-100 last:border-0'}>
      <div className="flex items-center gap-3">
        <input
          type="color"
          aria-label={label}
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
          className="w-9 h-9 rounded-md cursor-pointer flex-shrink-0 border border-slate-200 bg-white p-0.5"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-slate-800">{label}</span>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              spellCheck={false}
              className="w-24 px-2 py-0.5 text-xs font-mono border border-slate-200 rounded bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {subtitle && (
            <p className={compact ? 'text-[11px] leading-tight text-slate-500 mt-0.5' : 'text-[11px] leading-tight text-slate-500 mt-1'}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {extra}
    </div>
  );
}

// ─── PortalPage ──────────────────────────────────────────────────────────────
export function PortalPage({
  customBrand,
  setCustomBrand,
  clearCustomBrand,
  setBrand,
}: PortalPageProps) {
  const navigate = useNavigate();

  // Seed form state from saved custom brand (if any), else defaults.
  const [mode, setMode] = useState<CustomBrandMode>(customBrand?.mode ?? 'simple');
  const [name, setName] = useState(customBrand?.name ?? 'Acme');
  const [logo, setLogo] = useState(customBrand?.logo ?? '');
  const [primitives, setPrimitives] = useState<CorePrimitives>(
    customBrand?.primitives ?? DEFAULT_PRIMITIVES,
  );
  const [fullTokens, setFullTokens] = useState<BrandTokens>(
    customBrand?.tokens ?? deriveTokens(customBrand?.primitives ?? DEFAULT_PRIMITIVES),
  );
  const [copied, setCopied] = useState(false);

  // Effective token set for preview and audit. In simple mode we derive; in
  // full mode we use the user's explicit edits.
  const effectiveTokens = useMemo<BrandTokens>(
    () => (mode === 'simple' ? deriveTokens(primitives) : fullTokens),
    [mode, primitives, fullTokens],
  );

  const audit = useMemo(() => auditTokens(effectiveTokens, mode), [effectiveTokens, mode]);
  const failing = audit.filter((c) => !c.passes);

  // Preview inline CSS vars.
  const previewStyle = useMemo<CSSProperties>(() => {
    const css: Record<string, string> = {};
    (Object.keys(CSS_VAR_FOR) as SemanticTokenKey[]).forEach((k) => {
      css[CSS_VAR_FOR[k]] = effectiveTokens[k];
    });
    return css as CSSProperties;
  }, [effectiveTokens]);

  const updatePrimitive = (key: PrimitiveKey, value: string) =>
    setPrimitives((prev) => ({ ...prev, [key]: value }));

  const updateToken = (key: SemanticTokenKey, value: string) =>
    setFullTokens((prev) => ({ ...prev, [key]: value }));

  const onLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogo(typeof reader.result === 'string' ? reader.result : '');
    reader.readAsDataURL(file);
  };

  // Mode switch — Simple→Full seeds the 67 tokens from the current primitives
  // so the user keeps what they had. Full→Simple keeps primitives unchanged
  // but discards individual token overrides (we warn before doing it).
  const handleModeChange = (nextMode: CustomBrandMode) => {
    if (nextMode === mode) return;
    if (nextMode === 'full') {
      setFullTokens(deriveTokens(primitives));
      setMode('full');
    } else {
      // Simple mode — warn if there are per-token edits about to be lost.
      const derivedFromPrims = deriveTokens(primitives);
      const hasOverrides = (Object.keys(derivedFromPrims) as SemanticTokenKey[]).some(
        (k) => derivedFromPrims[k].toLowerCase() !== fullTokens[k]?.toLowerCase(),
      );
      if (hasOverrides) {
        const ok = window.confirm(
          'Switching to Simple will discard your per-token edits and re-derive all 67 tokens from the 13 primitives. Continue?',
        );
        if (!ok) return;
      }
      setMode('simple');
    }
  };

  const handleApply = () => {
    const next: CustomBrand = {
      name: name.trim() || 'Custom',
      logo,
      mode,
      primitives,
      tokens: mode === 'full' ? fullTokens : undefined,
    };
    setCustomBrand(next);
    setBrand('custom');
  };

  const handleClear = () => {
    clearCustomBrand();
    setBrand('dragonpass');
    setName('Acme');
    setLogo('');
    setPrimitives(DEFAULT_PRIMITIVES);
    setFullTokens(deriveTokens(DEFAULT_PRIMITIVES));
    setMode('simple');
  };

  const handleCopyCss = async () => {
    const css = generateCss(effectiveTokens, '[data-brand="custom"]', primitives);
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const applySuggestion = (check: AccessibilityCheck) => {
    if (!check.suggestion) return;
    if (mode === 'simple' && check.suggestedPrimitive) {
      setPrimitives((prev) => ({ ...prev, [check.suggestedPrimitive!]: check.suggestion! }));
    } else if (mode === 'full' && check.suggestedToken) {
      setFullTokens((prev) => ({ ...prev, [check.suggestedToken!]: check.suggestion! }));
    }
  };

  const isSaved = Boolean(customBrand);

  return (
    <div className="pb-16">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">White-label Portal</h1>
            <p className="text-sm text-slate-600 mt-1">
              Define a brand that mirrors Brand Switcher's token structure. Switch between
              Simple (13 primitives, auto-derived) and Full (all 67 tokens, explicit) based on
              how much control you need.
            </p>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="mt-5 inline-flex items-stretch rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
          {(
            [
              {
                id: 'simple' as const,
                label: 'Simple',
                count: '13 primitives',
                hint: 'Edit 13 brand colors; the portal derives the other 54 via lighten/darken/alpha rules.',
              },
              {
                id: 'full' as const,
                label: 'Full',
                count: '67 tokens',
                hint: 'Edit every Brand Switcher variable individually. No derivation — what you see is what ships.',
              },
            ] as const
          ).map((opt) => {
            const active = mode === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleModeChange(opt.id)}
                title={opt.hint}
                className={[
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  active
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100',
                ].join(' ')}
              >
                <span className="block text-left">{opt.label}</span>
                <span className={['block text-[10px]', active ? 'text-slate-300' : 'text-slate-400'].join(' ')}>
                  {opt.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action bar */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            onClick={handleApply}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            Apply &amp; Save
          </button>
          <button
            onClick={handleCopyCss}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            {copied ? 'Copied!' : 'Copy CSS block'}
          </button>
          {isSaved && (
            <button
              onClick={handleClear}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-white text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
            >
              Clear custom brand
            </button>
          )}
          <button
            onClick={() => navigate('/components/button')}
            className="ml-auto px-4 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            View components with active brand →
          </button>
        </div>

        {isSaved && (
          <p className="mt-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Saved as "{customBrand?.name}" ({customBrand?.mode})
            </span>{' '}
            — active in TopBar, persists across reloads.
          </p>
        )}
      </header>

      {/* Accessibility audit (works in both modes) */}
      <section
        className={[
          'mb-6 rounded-xl border shadow-sm overflow-hidden',
          failing.length === 0
            ? 'bg-green-50 border-green-200'
            : 'bg-amber-50 border-amber-200',
        ].join(' ')}
      >
        <div className="px-5 py-4 flex items-center gap-3">
          <div
            className={[
              'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold',
              failing.length === 0 ? 'bg-green-500' : 'bg-amber-500',
            ].join(' ')}
            aria-hidden="true"
          >
            {failing.length === 0 ? '✓' : '!'}
          </div>
          <div className="flex-1">
            <h2
              className={[
                'text-sm font-semibold',
                failing.length === 0 ? 'text-green-900' : 'text-amber-900',
              ].join(' ')}
            >
              {failing.length === 0
                ? `Accessibility — all ${audit.length} pairings meet WCAG AA (4.5:1)`
                : `Accessibility — ${failing.length} of ${audit.length} pairings fail WCAG AA`}
            </h2>
            <p
              className={[
                'text-xs mt-0.5',
                failing.length === 0 ? 'text-green-700' : 'text-amber-800',
              ].join(' ')}
            >
              Checks run on every change against component pairings that paint text on
              white or brand surfaces.
            </p>
          </div>
        </div>

        {failing.length > 0 && (
          <div className="divide-y divide-amber-200 border-t border-amber-200 bg-white">
            {failing.map((check) => {
              const targetLabel =
                check.suggestedPrimitive ?? check.suggestedToken?.replace('atom.', '');
              return (
                <div key={check.id} className="px-5 py-3 flex items-start gap-4 text-sm">
                  <div className="flex-shrink-0 flex items-center gap-1.5 pt-0.5">
                    <div className="w-4 h-4 rounded border border-slate-200" style={{ backgroundColor: check.bg }} aria-hidden="true" />
                    <div className="w-4 h-4 rounded border border-slate-200" style={{ backgroundColor: check.fg }} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-medium text-slate-900">{check.label}</span>
                      <code className="text-xs font-mono px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-100">
                        {check.actual.toFixed(2)} : 1
                      </code>
                      <span className="text-xs text-slate-500">needs ≥ {check.target} : 1</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{check.description}</p>
                    {check.suggestion && targetLabel && (
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-slate-600">Suggestion:</span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                          <span className="w-3 h-3 rounded border border-slate-300 flex-shrink-0" style={{ backgroundColor: check.suggestion }} />
                          {check.suggestion}
                        </span>
                        <button
                          onClick={() => applySuggestion(check)}
                          className="text-xs font-medium px-2 py-0.5 rounded bg-slate-900 text-white hover:bg-slate-700"
                        >
                          Apply to {targetLabel}
                        </button>
                      </div>
                    )}
                    {!check.suggestion && (
                      <div className="mt-2 text-xs text-slate-600">
                        Could not find a nearby accessible color. Consider a completely different shade.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Left: form (shape differs per mode) ──────────────────────────── */}
        <div className="space-y-6">
          {/* Identity card — shared */}
          <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-3">
              Identity
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Brand name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Logo URL</label>
                <input
                  type="text"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="https://… or leave blank to upload"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex items-center gap-3 mt-2">
                  <label className="text-xs text-slate-600 cursor-pointer hover:text-slate-900">
                    <input type="file" accept="image/*" onChange={onLogoFileChange} className="hidden" />
                    <span className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 font-medium inline-block transition-colors">
                      Upload file
                    </span>
                  </label>
                  {logo && (
                    <div className="flex items-center gap-2">
                      <img
                        src={logo}
                        alt="logo preview"
                        className="w-8 h-8 rounded bg-slate-100 object-contain"
                        onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
                      />
                      <button onClick={() => setLogo('')} className="text-xs text-slate-500 hover:text-red-600">
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Simple mode — 13 primitives */}
          {mode === 'simple' &&
            SIMPLE_GROUPS.map((group) => (
              <section
                key={group.title}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"
              >
                <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-2">
                  {group.title}
                </h2>
                <div>
                  {group.keys.map((k) => {
                    const d = PRIMITIVE_DESCRIPTORS[k];
                    return (
                      <ColorSwatchInput
                        key={k}
                        value={primitives[k]}
                        onChange={(next) => updatePrimitive(k, next)}
                        label={d.label}
                        extra={
                          <div className="mt-2 pl-[48px] space-y-1">
                            <p className="text-[11px] leading-tight text-slate-500">
                              <span className="font-medium text-slate-600">Drives: </span>
                              <span className="font-mono">{d.drives}</span>
                            </p>
                            <p className="text-[11px] leading-tight text-slate-500">
                              <span className="font-medium text-slate-600">Seen on: </span>
                              {d.seenOn}
                            </p>
                          </div>
                        }
                      />
                    );
                  })}
                </div>
              </section>
            ))}

          {/* Full mode — 67 tokens grouped by Brand Switcher category */}
          {mode === 'full' && (
            <>
              <div className="rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 px-4 py-3">
                <strong>Full mode.</strong> You're editing all 67 tokens directly. No derivation —
                changes here do not cascade. The <code className="font-mono">Drives:</code> and{' '}
                <code className="font-mono">Seen on:</code> descriptions below come from Brand
                Switcher's variable catalogue so you know where each token gets painted.
              </div>
              {TOKEN_GROUP_ORDER.map((group) => {
                const keys = tokensInGroup(group);
                return (
                  <section
                    key={group}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"
                  >
                    <div className="flex items-baseline justify-between mb-2">
                      <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
                        {group}
                      </h2>
                      <span className="text-[11px] text-slate-400">
                        {keys.length} token{keys.length === 1 ? '' : 's'}
                      </span>
                    </div>
                    <div>
                      {keys.map((k) => {
                        const info = TOKEN_INFO[k];
                        const rule = TOKEN_DERIVATION[k];
                        const shortName = k.replace(/^atom\./, '');
                        return (
                          <ColorSwatchInput
                            key={k}
                            compact
                            value={fullTokens[k]}
                            onChange={(next) => updateToken(k, next)}
                            label={shortName}
                            subtitle={info.purpose}
                            extra={
                              <p className="mt-1 pl-[48px] text-[10px] text-slate-400 font-mono">
                                Simple rule: {describeRule(rule)}
                              </p>
                            }
                          />
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </>
          )}
        </div>

        {/* ── Right: live preview (scoped with CSS vars) ───────────────────── */}
        <div>
          <div className="lg:sticky lg:top-20 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
                Live preview
              </h2>
              <span className="text-[11px] text-slate-500">
                Reacts to form changes in real time · {mode} mode
              </span>
            </div>

            <div
              data-brand="custom"
              style={previewStyle}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6"
            >
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Button</p>
                <div className="flex flex-wrap items-center gap-3">
                  <ButtonLive variant="Primary" size="Small" label="Primary" brand="custom" />
                  <ButtonLive variant="Secondary" size="Small" label="Secondary" brand="custom" />
                  <ButtonLive variant="Destructive" size="Small" label="Delete" brand="custom" />
                  <ButtonLive variant="Primary" size="Small" label="Disabled" state="Disabled" brand="custom" />
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Alert (feedback colors)</p>
                <div className="space-y-2">
                  <AlertLive type="Success" option="Full Border" title="Payment received" description="Your order is on its way." brand="custom" showDismiss={false} />
                  <AlertLive type="Warning" option="Full Border" title="Session expiring" description="You'll be signed out in 2 minutes." brand="custom" showDismiss={false} />
                  <AlertLive type="Error" option="Full Border" title="Could not save" description="Check your connection and try again." brand="custom" showDismiss={false} />
                  <AlertLive type="Information" option="Full Border" title="New feature" description="We updated the dashboard layout." brand="custom" showDismiss={false} />
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Badge</p>
                <div className="flex flex-wrap items-center gap-2">
                  <BadgeLive state="Brand" label="Brand" brand="custom" />
                  <BadgeLive state="Success" label="Success" brand="custom" />
                  <BadgeLive state="Warning" label="Warning" brand="custom" />
                  <BadgeLive state="Error" label="Error" brand="custom" />
                  <BadgeLive state="Information" label="Info" brand="custom" />
                  <BadgeLive state="Muted" label="Muted" brand="custom" />
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Input</p>
                <div className="space-y-3">
                  <InputLive type="Basic" label="Default" placeholder="Type something…" helperText="Helper text in secondary color" brand="custom" />
                  <InputLive type="Basic" label="Focused" state="Focus" placeholder="Focused state" brand="custom" />
                  <InputLive type="Basic" label="Error" state="Error" placeholder="Invalid value" helperText="Something went wrong" brand="custom" />
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Card</p>
                <CardLive
                  imagePosition="None"
                  textLine="Single"
                  titleText="Welcome to your dashboard"
                  bodyText="Track orders, redeem offers, and manage benefits — all in one place."
                  actionLabel="Learn more"
                  brand="custom"
                />
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Progress indicator</p>
                <div className="space-y-3 max-w-md">
                  <ProgressIndicatorLive variant="Percentage Bar" value={60} showTitle titleText="Uploading" brand="custom" />
                  <ProgressIndicatorLive variant="Multiple Bars" segments={4} activeSegments={2} showTitle titleText="Step 2 of 4" brand="custom" />
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Breadcrumbs</p>
                <BreadcrumbsLive
                  items={[
                    { label: 'Home', href: '#' },
                    { label: 'Account', href: '#' },
                    { label: 'Preferences' },
                  ]}
                  brand="custom"
                />
              </div>
            </div>

            <details className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
              <summary className="cursor-pointer px-4 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wider hover:bg-slate-800">
                Generated CSS block (all 67 tokens)
              </summary>
              <pre className="px-4 py-3 text-[11px] leading-relaxed text-slate-300 font-mono overflow-auto max-h-80">
                {generateCss(effectiveTokens, '[data-brand="custom"]', primitives)}
              </pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
