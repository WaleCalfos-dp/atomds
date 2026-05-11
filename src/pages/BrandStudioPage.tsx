import { useEffect, useState } from 'react';
import { type Brand } from '../data/tokens';
import { type Language } from '../data/languages';
import { useBrandStudio } from '../hooks/useBrandStudio';
import { cloneBrand, emptyBrand } from '../lib/brandStudio/catalog';
import { BrandList } from '../components/brandStudio/BrandList';
import { BrandEditor } from '../components/brandStudio/BrandEditor';
import { BrandPreview } from '../components/brandStudio/BrandPreview';
import { HowItWorks } from '../components/brandStudio/HowItWorks';

interface BrandStudioPageProps {
  brand: Brand;
  lang?: Language;
  setBrand: (brand: Brand) => void;
}

export function BrandStudioPage({ brand, setBrand }: BrandStudioPageProps) {
  const { catalog, activeId, setActive, addBrand, editBrand, deleteBrand } = useBrandStudio();
  const [selectedId, setSelectedId] = useState<string | null>(activeId ?? catalog[0]?.id ?? null);

  // If the selected brand vanishes (e.g. just deleted), fall back to the active one or the first.
  useEffect(() => {
    if (selectedId && !catalog.some((b) => b.id === selectedId)) {
      setSelectedId(activeId ?? catalog[0]?.id ?? null);
    }
  }, [catalog, activeId, selectedId]);

  const selected = catalog.find((b) => b.id === selectedId) ?? null;

  const handleApply = (id: string) => {
    setActive(id);
    setBrand('studio');
  };

  const handleDuplicate = (id: string) => {
    const source = catalog.find((b) => b.id === id);
    if (!source) return;
    const copy = cloneBrand(source, `${source.name} (copy)`);
    addBrand(copy);
    setSelectedId(copy.id);
  };

  const handleAdd = () => {
    const fresh = emptyBrand();
    addBrand(fresh);
    setSelectedId(fresh.id);
  };

  const handleDelete = (id: string) => {
    if (catalog.length <= 1) return;
    deleteBrand(id);
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium tracking-wide uppercase mb-4">
          Tools · Brand Studio
        </div>
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight mb-3">
          Theme the design system from a handful of colours
        </h1>
        <p className="text-slate-600 text-base leading-relaxed max-w-3xl">
          Define a brand by six seed colours, a name, a logo, and a font. The token generator
          derives the full 67-token atom palette, and clicking <strong>Apply</strong> retheme
          every component in this app. Dragonpass is pre-seeded as the reference — its seeds
          produce the production dragonpass tokens byte-for-byte.
          {brand === 'studio' && (
            <span className="block mt-2 text-emerald-700 font-medium">
              Studio brand is currently live — switch to a fixed brand from the top-right pill row to release it.
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <BrandList
            catalog={catalog}
            selectedId={selectedId}
            activeId={brand === 'studio' ? activeId : null}
            onSelect={setSelectedId}
            onApply={handleApply}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onAdd={handleAdd}
          />
          <HowItWorks />
        </div>
        <div className="space-y-10">
          {selected ? (
            <>
              <BrandEditor
                brand={selected}
                isActive={brand === 'studio' && activeId === selected.id}
                onChange={(patch) => editBrand(selected.id, patch)}
                onApply={() => handleApply(selected.id)}
              />
              <BrandPreview brand={selected} />
            </>
          ) : (
            <div className="text-sm text-slate-500 p-6 border border-dashed border-slate-200 rounded-md">
              Select a brand on the left to edit and preview it.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
