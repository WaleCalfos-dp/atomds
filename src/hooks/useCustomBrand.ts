import { useEffect, useState } from 'react';
import { setCustomTokens } from '../data/tokens';
import {
  type CustomBrand,
  DEFAULT_PRIMITIVES,
  resolveCustomBrandTokens,
} from '../data/deriveTokens';

const STORAGE_KEY = 'atom.customBrand';

function readFromStorage(): CustomBrand | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CustomBrand>;
    if (!parsed?.primitives) return null;
    // Backward compat:
    // - older saves (before Full mode existed) have no `mode` key — assume simple
    // - older saves (before v2 added `accent`) lack accent — fill with default
    return {
      name: parsed.name ?? 'Custom',
      logo: parsed.logo ?? '',
      font: parsed.font,
      mode: parsed.mode ?? 'simple',
      primitives: { ...DEFAULT_PRIMITIVES, ...parsed.primitives },
      tokens: parsed.tokens,
    } as CustomBrand;
  } catch {
    return null;
  }
}

// Synchronous read for pages that need custom brand metadata (name, primary)
// without subscribing to updates — e.g. BrandFoundationsPage's hero card.
export function getCustomBrandSnapshot(): CustomBrand | null {
  return readFromStorage();
}

export function useCustomBrand() {
  const [customBrand, setCustomBrandState] = useState<CustomBrand | null>(() => {
    const loaded = readFromStorage();
    if (loaded) setCustomTokens(resolveCustomBrandTokens(loaded));
    return loaded;
  });

  // Keep the module-level token cache in sync whenever customBrand changes.
  useEffect(() => {
    if (customBrand) {
      setCustomTokens(resolveCustomBrandTokens(customBrand));
    } else {
      setCustomTokens(null);
    }
  }, [customBrand]);

  const setCustomBrand = (next: CustomBrand) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage quota / private mode — still update in-memory state */
    }
    setCustomBrandState(next);
  };

  const clearCustomBrand = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setCustomBrandState(null);
  };

  return { customBrand, setCustomBrand, clearCustomBrand, DEFAULT_PRIMITIVES };
}
