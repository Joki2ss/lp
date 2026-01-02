import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';

import { stripHtml, wrapHtmlDocument } from '../utils/html';

function toSafeFilename(name) {
  return (name || 'export').replace(/[^a-z0-9\-_]+/gi, '_').slice(0, 64);
}

export async function exportDraftToPdf({ title, content }) {
  const bodyHtml = content || '';
  const html = wrapHtmlDocument({ title: title || 'Untitled', bodyHtml });

  const file = await Print.printToFileAsync({ html });
  return file;
}

export async function exportDraftToTxt({ title, content }) {
  if (Platform.OS === 'web') {
    throw new Error('TXT export is not supported on web in this build.');
  }
  const filename = `${toSafeFilename(title)}.txt`;
  const uri = `${FileSystem.documentDirectory}${filename}`;
  const text = stripHtml(content || '');
  await FileSystem.writeAsStringAsync(uri, text, { encoding: FileSystem.EncodingType.UTF8 });
  return { uri };
}
