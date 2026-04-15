import { useState } from 'react';
import { type Brand } from '../data/tokens';

export function useBrand() {
  const [brand, setBrand] = useState<Brand>('dragonpass');
  return { brand, setBrand };
}
