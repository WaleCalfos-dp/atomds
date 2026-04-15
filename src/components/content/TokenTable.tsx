import { type Brand, type SemanticTokenKey, RESOLVED_SEMANTIC_TOKENS } from '../../data/tokens';

export interface TokenRow {
  token: string;
  tokenKey?: SemanticTokenKey;
  values: string[];
}

interface TokenTableProps {
  title?: string;
  description?: string;
  columns: string[];
  rows: TokenRow[];
  brand: Brand;
  showSwatch?: boolean;
}

export function TokenTable({
  title,
  description,
  columns,
  rows,
  brand,
  showSwatch = false,
}: TokenTableProps) {
  const resolved = RESOLVED_SEMANTIC_TOKENS[brand];

  return (
    <div className="mb-8">
      {title && (
        <h3 className="text-lg font-semibold text-slate-800 mb-1">{title}</h3>
      )}
      {description && (
        <p className="text-sm text-slate-500 mb-3">{description}</p>
      )}
      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {showSwatch && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-12" />
              )}
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const color =
                showSwatch && row.tokenKey ? resolved[row.tokenKey] : undefined;
              return (
                <tr
                  key={row.token + i}
                  className="border-b border-slate-100 last:border-0"
                >
                  {showSwatch && (
                    <td className="px-4 py-3">
                      {color ? (
                        <div
                          className="w-5 h-5 rounded border border-slate-200"
                          style={{ backgroundColor: color }}
                        />
                      ) : (
                        <div className="w-5 h-5" />
                      )}
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                      {row.token}
                    </code>
                  </td>
                  {row.values.map((v, j) => (
                    <td key={j} className="px-4 py-3 text-slate-600">
                      {v}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
