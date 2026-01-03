import { useMemo } from 'react';

import { resources } from './resources';
import { getSupportedLanguage } from './setup';
import { useAppStore } from '../store/useAppStore';

function lookup(lang, key) {
  const safeLang = getSupportedLanguage(lang);
  const pack = resources[safeLang]?.translation ?? {};
  const fallback = resources.en?.translation ?? {};
  return pack[key] ?? fallback[key] ?? key;
}

export function t(lang, key) {
  return lookup(lang, key);
}

export function useT() {
  const { state } = useAppStore();
  const lang = state.session.language;
  return useMemo(() => {
    return {
      language: lang,
      t: (key) => lookup(lang, key),
    };
  }, [lang]);
}
