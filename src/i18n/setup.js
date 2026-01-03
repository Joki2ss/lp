// Lightweight i18n setup (no external i18n libraries)
// We keep translations in `resources.js` and expose a small `t()` helper.

import { resources } from './resources';

export const DEFAULT_LANGUAGE = 'en';

export function getSupportedLanguage(lang) {
  if (!lang) return DEFAULT_LANGUAGE;
  return resources[lang] ? lang : DEFAULT_LANGUAGE;
}
