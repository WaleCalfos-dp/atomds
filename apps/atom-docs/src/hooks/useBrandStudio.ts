import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_CATALOG, DRAGONPASS_REFERENCE_ID } from '../lib/brandStudio/catalog';
import { loadState, saveState } from '../lib/brandStudio/persistence';
import type { StudioBrand, StudioState } from '@atom-core/theming/types';
import { generateBrandTokens } from '@atom-core/tokenGenerator/generate-brand-tokens';
import { setStudioTokens } from '@atom-core/tokens/tokens';

function initialState(): StudioState {
  const persisted = loadState();
  if (persisted) return persisted;
  return { catalog: DEFAULT_CATALOG, activeId: DRAGONPASS_REFERENCE_ID };
}

export function useBrandStudio() {
  const [state, setState] = useState<StudioState>(initialState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeBrand = useMemo<StudioBrand | null>(() => {
    if (!state.activeId) return null;
    return state.catalog.find((b) => b.id === state.activeId) ?? null;
  }, [state]);

  // Keep the module-level token cache in sync so pages that read
  // RESOLVED_SEMANTIC_TOKENS[brand] for swatch tables see the studio brand.
  // Tolerate invalid seeds (mid-edit "#" etc.) — fall back to dragonpass.
  useEffect(() => {
    if (!activeBrand) {
      setStudioTokens(null);
      return;
    }
    try {
      setStudioTokens(generateBrandTokens(activeBrand.seeds).resolvedSemanticTokens);
    } catch {
      setStudioTokens(null);
    }
  }, [activeBrand]);

  const setActive = useCallback((id: string | null) => {
    setState((s) => {
      if (id === null) return { ...s, activeId: null };
      if (!s.catalog.some((b) => b.id === id)) return s;
      return { ...s, activeId: id };
    });
  }, []);

  const addBrand = useCallback((brand: StudioBrand) => {
    setState((s) => ({ catalog: [...s.catalog, brand], activeId: brand.id }));
  }, []);

  const editBrand = useCallback((id: string, patch: Partial<StudioBrand>) => {
    setState((s) => ({
      ...s,
      catalog: s.catalog.map((b) => (b.id === id ? { ...b, ...patch, id: b.id } : b)),
    }));
  }, []);

  const deleteBrand = useCallback((id: string) => {
    setState((s) => {
      const catalog = s.catalog.filter((b) => b.id !== id);
      const activeId =
        s.activeId === id ? (catalog[0]?.id ?? null) : s.activeId;
      return { catalog, activeId };
    });
  }, []);

  return {
    catalog: state.catalog,
    activeId: state.activeId,
    activeBrand,
    setActive,
    addBrand,
    editBrand,
    deleteBrand,
  };
}
