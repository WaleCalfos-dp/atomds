import { useState } from 'react';
import { type Language, DEFAULT_LANGUAGE } from '../data/languages';

const STORAGE_KEY = 'atom.activeLanguage';
const VALID_LANGUAGES: Language[] = ['en', 'zh'];

function readInitialLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && VALID_LANGUAGES.includes(stored as Language)) return stored as Language;
  } catch {
    /* ignore */
  }
  return DEFAULT_LANGUAGE;
}

export function useLanguage() {
  const [lang, setLangState] = useState<Language>(readInitialLanguage);

  const setLang = (next: Language) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore storage errors */
    }
    setLangState(next);
  };

  return { lang, setLang };
}
