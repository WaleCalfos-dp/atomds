import type { StudioBrand } from '../../lib/brandStudio/types';

interface BrandListProps {
  catalog: StudioBrand[];
  selectedId: string | null;
  activeId: string | null;
  onSelect: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function BrandList({
  catalog,
  selectedId,
  activeId,
  onSelect,
  onDuplicate,
  onDelete,
  onAdd,
}: BrandListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Brands</h2>
        <button
          onClick={onAdd}
          className="text-xs px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-800 transition-colors"
        >
          + New brand
        </button>
      </div>
      <ul className="space-y-2">
        {catalog.map((b) => {
          const isSelected = selectedId === b.id;
          const isActive = activeId === b.id;
          return (
            <li
              key={b.id}
              className={[
                'flex items-center gap-3 p-3 rounded-md border transition-colors cursor-pointer',
                isSelected
                  ? 'border-slate-900 bg-slate-50'
                  : 'border-slate-200 hover:bg-slate-50',
              ].join(' ')}
              onClick={() => onSelect(b.id)}
            >
              <BrandSwatch brand={b} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-900 truncate">{b.name}</span>
                  {isActive && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                      Live
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 font-mono truncate">{b.seeds.primary}</div>
              </div>
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onDuplicate(b.id)}
                  className="text-xs px-2 py-1 rounded border border-slate-200 text-slate-700 hover:bg-slate-100"
                >
                  Duplicate
                </button>
                <button
                  onClick={() => onDelete(b.id)}
                  disabled={catalog.length <= 1}
                  className="text-xs px-2 py-1 rounded border border-slate-200 text-rose-700 hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  title={catalog.length <= 1 ? 'Cannot delete the last brand' : 'Delete this brand'}
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function BrandSwatch({ brand }: { brand: StudioBrand }) {
  if (brand.logo) {
    return (
      <img
        src={brand.logo}
        alt=""
        className="w-8 h-8 rounded object-cover border border-slate-200 flex-shrink-0"
      />
    );
  }
  return (
    <span
      className="w-8 h-8 rounded border border-slate-200 flex-shrink-0"
      style={{ backgroundColor: brand.seeds.primary }}
      aria-hidden="true"
    />
  );
}
