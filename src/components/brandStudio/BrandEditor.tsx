import { FONT_PRESETS } from '../../lib/brandStudio/fonts';
import type { BrandSeeds, StudioBrand } from '../../lib/brandStudio/types';

interface BrandEditorProps {
  brand: StudioBrand;
  isActive: boolean;
  onChange: (patch: Partial<StudioBrand>) => void;
  onApply: () => void;
}

const SEED_META: Array<{ key: keyof BrandSeeds; label: string; caption: string }> = [
  { key: 'primary', label: 'Primary', caption: 'Brand interactive colour' },
  { key: 'secondary', label: 'Secondary', caption: 'Brand accent' },
  { key: 'neutral', label: 'Neutral', caption: 'Mid grey for text + UI' },
  { key: 'success', label: 'Success', caption: 'Positive feedback' },
  { key: 'warning', label: 'Warning', caption: 'Caution feedback' },
  { key: 'error', label: 'Error', caption: 'Negative feedback' },
];

export function BrandEditor({ brand, isActive, onChange, onApply }: BrandEditorProps) {
  const updateSeed = (key: keyof BrandSeeds, value: string) => {
    const v = value.trim().toLowerCase();
    const normalised = v.length === 0 ? '#000000' : v.startsWith('#') ? v : `#${v}`;
    onChange({ seeds: { ...brand.seeds, [key]: normalised } });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Edit brand</h2>
        <button
          onClick={onApply}
          disabled={isActive}
          className="text-xs px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isActive ? 'Currently applied' : 'Apply to app'}
        </button>
      </div>

      <div className="space-y-4">
        <Field label="Name">
          <input
            type="text"
            value={brand.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md outline-none focus:border-slate-400 transition-colors"
            spellCheck={false}
          />
        </Field>

        <Field label="Logo URL" hint="Optional. URL or data: URL.">
          <input
            type="text"
            value={brand.logo}
            onChange={(e) => onChange({ logo: e.target.value })}
            placeholder="https://example.com/logo.svg"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md outline-none focus:border-slate-400 transition-colors font-mono"
            spellCheck={false}
          />
        </Field>

        <Field label="Font">
          <select
            value={brand.font}
            onChange={(e) => onChange({ font: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md outline-none focus:border-slate-400 transition-colors bg-white"
          >
            {FONT_PRESETS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </Field>

        <div>
          <div className="text-sm font-medium text-slate-900 mb-2">Seed colours</div>
          <p className="text-xs text-slate-500 mb-3">
            Six hex codes. The generator derives 90 primitives and 67 atom tokens from these.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SEED_META.map((m) => (
              <SeedInput
                key={m.key}
                label={m.label}
                caption={m.caption}
                value={brand.seeds[m.key]}
                onChange={(v) => updateSeed(m.key, v)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-medium text-slate-900">{label}</span>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

function SeedInput({
  label,
  caption,
  value,
  onChange,
}: {
  label: string;
  caption: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const isValidHex = /^#[0-9a-fA-F]{6}$/.test(value);
  return (
    <label className="block">
      <div className="text-sm font-medium text-slate-900 mb-1">{label}</div>
      <div className="flex items-stretch gap-2 border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-400 transition-colors bg-white">
        <input
          type="color"
          value={isValidHex ? value : '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 cursor-pointer border-0 p-0 m-0 bg-transparent"
          aria-label={`${label} colour picker`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-2 text-sm font-mono outline-none bg-transparent"
          spellCheck={false}
          maxLength={9}
        />
      </div>
      <p className="text-xs text-slate-500 mt-1">{caption}</p>
    </label>
  );
}
