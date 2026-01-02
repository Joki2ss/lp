import { I18nManager, Platform } from 'react-native';

export const RTL_LANGS = new Set(['ar', 'he']);

export function isLanguageRTL(lang) {
  return RTL_LANGS.has(lang);
}

export async function applyLanguage(lang) {
  const shouldBeRTL = isLanguageRTL(lang);
  try {
    I18nManager.allowRTL(true);
    if (I18nManager.isRTL !== shouldBeRTL) {
      I18nManager.forceRTL(shouldBeRTL);
      if (Platform.OS !== 'web') {
        // Requires a reload for full RTL layout changes on native.
      }
    }
  } catch {
    // Some environments may restrict RTL toggles.
  }
}
