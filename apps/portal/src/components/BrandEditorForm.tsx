import type { StudioBrand } from '@atom-core/theming/types'
import { FONT_PRESETS } from '@atom-core/theming/fonts'

interface SeedRow {
  key: keyof StudioBrand['seeds']
  label: string
}

const SEEDS: SeedRow[] = [
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
  { key: 'neutral', label: 'Neutral' },
  { key: 'success', label: 'Success' },
  { key: 'warning', label: 'Warning' },
  { key: 'error', label: 'Error' },
]

interface Props {
  value: StudioBrand
  onChange: (next: StudioBrand) => void
  onSignOut: () => void
  email: string | undefined
}

export function BrandEditorForm({ value, onChange, onSignOut, email }: Props) {
  function patchSeed(key: SeedRow['key'], hex: string) {
    onChange({ ...value, seeds: { ...value.seeds, [key]: hex } })
  }

  return (
    <div className="space-y-5 p-6 bg-white border border-gray-200 rounded-md">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Brand</h2>
          <p className="text-xs text-gray-500">{email}</p>
        </div>
        <button onClick={onSignOut} className="text-xs text-gray-600 underline">
          Sign out
        </button>
      </header>

      <label className="block text-sm">
        <span className="block mb-1 text-gray-700">Brand name</span>
        <input
          type="text"
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </label>

      <label className="block text-sm">
        <span className="block mb-1 text-gray-700">Logo URL (optional)</span>
        <input
          type="url"
          value={value.logo}
          placeholder="https://…"
          onChange={(e) => onChange({ ...value, logo: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </label>

      <label className="block text-sm">
        <span className="block mb-1 text-gray-700">Font</span>
        <select
          value={value.font}
          onChange={(e) => onChange({ ...value, font: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
        >
          {FONT_PRESETS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </label>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Seed colours</p>
        <div className="grid grid-cols-2 gap-3">
          {SEEDS.map(({ key, label }) => (
            <label key={key} className="block text-xs">
              <span className="block mb-1 text-gray-600">{label}</span>
              <span className="flex items-center gap-2 border border-gray-300 rounded-md px-2 py-1">
                <input
                  type="color"
                  value={value.seeds[key]}
                  onChange={(e) => patchSeed(key, e.target.value)}
                  className="h-7 w-9 border-0 bg-transparent p-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={value.seeds[key]}
                  onChange={(e) => patchSeed(key, e.target.value)}
                  className="flex-1 font-mono text-xs outline-none"
                />
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
