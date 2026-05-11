import type { BrandSeeds } from '../tokenGenerator/generate-brand-tokens';

export interface StudioBrand {
  id: string;
  name: string;
  logo: string;
  font: string;
  seeds: BrandSeeds;
}

export interface StudioState {
  catalog: StudioBrand[];
  activeId: string | null;
}

export type { BrandSeeds };
