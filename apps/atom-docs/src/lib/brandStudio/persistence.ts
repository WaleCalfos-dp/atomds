import type { StudioBrand, StudioState } from '@atom-core/theming/types';

const STORAGE_KEY = 'atom.brandStudio';

export function loadState(): StudioState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StudioState>;
    if (!Array.isArray(parsed.catalog)) return null;
    const catalog = parsed.catalog.filter(isStudioBrand);
    if (catalog.length === 0) return null;
    const activeId =
      typeof parsed.activeId === 'string' && catalog.some((b) => b.id === parsed.activeId)
        ? parsed.activeId
        : null;
    return { catalog, activeId };
  } catch {
    return null;
  }
}

export function saveState(state: StudioState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage quota / private mode — silently drop, in-memory state still works */
  }
}

function isStudioBrand(value: unknown): value is StudioBrand {
  if (!value || typeof value !== 'object') return false;
  const b = value as Partial<StudioBrand>;
  if (typeof b.id !== 'string') return false;
  if (typeof b.name !== 'string') return false;
  if (typeof b.font !== 'string') return false;
  if (typeof b.logo !== 'string') return false;
  if (!b.seeds || typeof b.seeds !== 'object') return false;
  const seeds = b.seeds as unknown as Record<string, unknown>;
  const required = ['primary', 'secondary', 'neutral', 'success', 'warning', 'error'] as const;
  return required.every((k) => typeof seeds[k] === 'string');
}
