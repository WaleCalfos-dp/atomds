// Language definitions for the Atom design-system documentation site.
//
// The architecture mirrors `src/data/tokens.ts` exactly: a string union for the
// type, a constant array describing each option, and a default. The TopBar
// renders one pill per entry, identical in structure to the brand pill row.
//
// Adding a new language is a three-step change:
//   1. Append the literal to the `Language` union below.
//   2. Append a row to `LANGUAGES`.
//   3. Add a `<lang-key>` block to every page's per-file `COPY` map.
// No other code changes are required.

export type Language = 'en' | 'zh';

export const LANGUAGES: { id: Language; label: string; native: string }[] = [
  { id: 'en', label: 'English', native: 'EN' },
  { id: 'zh', label: '简体中文', native: '中文' },
];

export const DEFAULT_LANGUAGE: Language = 'en';
