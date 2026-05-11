import type { StudioBrand } from './types';
import { DEFAULT_FONT } from './fonts';

export const DRAGONPASS_REFERENCE_ID = 'dragonpass-ref';

// The reference entry. Its seeds are the dragonpass anchors from the generator,
// so generateBrandTokens reproduces the production dragonpass tokens
// byte-for-byte. New brands clone this entry and edit the seeds.
export const DRAGONPASS_REFERENCE: StudioBrand = {
  id: DRAGONPASS_REFERENCE_ID,
  name: 'Dragonpass (reference)',
  logo: '',
  font: "'Poppins', sans-serif",
  seeds: {
    primary: '#006b99',
    secondary: '#d53f34',
    neutral: '#737272',
    success: '#17b26a',
    warning: '#fcbc2c',
    error: '#e02d3c',
  },
};

export const DEFAULT_CATALOG: StudioBrand[] = [DRAGONPASS_REFERENCE];

export function makeBrandId(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${slug || 'brand'}-${suffix}`;
}

export function cloneBrand(source: StudioBrand, newName: string): StudioBrand {
  return {
    ...source,
    id: makeBrandId(newName),
    name: newName,
    seeds: { ...source.seeds },
  };
}

export function emptyBrand(name = 'New brand'): StudioBrand {
  return {
    id: makeBrandId(name),
    name,
    logo: '',
    font: DEFAULT_FONT,
    seeds: {
      primary: '#006b99',
      secondary: '#d53f34',
      neutral: '#737272',
      success: '#17b26a',
      warning: '#fcbc2c',
      error: '#e02d3c',
    },
  };
}
