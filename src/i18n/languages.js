export const LANGUAGES = [
  // NOTE: Snack/Metro doesn't treat .svg as a standard asset without an SVG transformer.
  // We store SVG XML as .txt in /assets and render it via react-native-svg's SvgXml.
  { code: 'en', label: 'English', flag: require('../../assets/flags/en.txt') },
  { code: 'it', label: 'Italiano', flag: require('../../assets/flags/it.txt') },
  { code: 'fr', label: 'Français', flag: require('../../assets/flags/fr.txt') },
  { code: 'es', label: 'Español', flag: require('../../assets/flags/es.txt') },
  { code: 'pt', label: 'Português', flag: require('../../assets/flags/pt.txt') },
  { code: 'ru', label: 'Русский', flag: require('../../assets/flags/ru.txt') },
  { code: 'de', label: 'Deutsch', flag: require('../../assets/flags/de.txt') },
  { code: 'he', label: 'עברית', flag: require('../../assets/flags/he.txt') },
  { code: 'ar', label: 'العربية', flag: require('../../assets/flags/ar.txt') },
  { code: 'zh', label: '中文', flag: require('../../assets/flags/zh.txt') },
];
