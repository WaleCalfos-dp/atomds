interface DosDontsProps {
  dos: string[];
  donts: string[];
}

export function DosDonts({ dos, donts }: DosDontsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {/* Do */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5">
        <p className="text-sm font-semibold text-emerald-700 mb-3 flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs">
            ✓
          </span>
          Do
        </p>
        <ul className="space-y-2">
          {dos.map((d, i) => (
            <li key={i} className="text-sm text-emerald-800 flex items-start gap-2">
              <span className="text-emerald-400 mt-1">•</span>
              {d}
            </li>
          ))}
        </ul>
      </div>

      {/* Don't */}
      <div className="rounded-xl border border-red-200 bg-red-50/60 p-5">
        <p className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs">
            ✕
          </span>
          Don't
        </p>
        <ul className="space-y-2">
          {donts.map((d, i) => (
            <li key={i} className="text-sm text-red-800 flex items-start gap-2">
              <span className="text-red-400 mt-1">•</span>
              {d}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
