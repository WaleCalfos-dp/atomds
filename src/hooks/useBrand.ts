import { useState } from 'react';
import { type Brand } from '../data/tokens';

const STORAGE_KEY = 'atom.activeBrand';
const VALID_BRANDS: Brand[] = [
  'dragonpass',
  'mastercard',
  'investec',
  'visa',
  'greyscale',
  'assurant',
  'custom',
];

function readInitialBrand(): Brand {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && VALID_BRANDS.includes(stored as Brand)) return stored as Brand;
  } catch {
    /* ignore */
  }
  return 'dragonpass';
}

export function useBrand() {
  const [brand, setBrandState] = useState<Brand>(readInitialBrand);

  const setBrand = (next: Brand) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore storage errors */
    }
    setBrandState(next);
  };

  return { brand, setBrand };
}
