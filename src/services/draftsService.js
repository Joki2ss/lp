import { createId } from '../utils/id';
import { nowIso } from '../utils/date';
import { getItem, setItem } from './storage';

const DRAFTS_KEY = 'drafts';

export async function listDrafts() {
  const drafts = (await getItem(DRAFTS_KEY)) ?? [];
  return Array.isArray(drafts) ? drafts : [];
}

export async function upsertDraft({ id, title, content }) {
  const drafts = await listDrafts();
  const draftId = id ?? createId('draft');
  const next = {
    id: draftId,
    title: title?.trim() || 'Untitled',
    // Backward compatible: keep `content` for older data, but store rich HTML in `contentHtml`.
    content: typeof content === 'string' ? content : '',
    contentHtml: typeof content === 'string' ? content : '',
    updatedAt: nowIso(),
  };

  const idx = drafts.findIndex((d) => d.id === draftId);
  const updated = idx >= 0 ? drafts.map((d) => (d.id === draftId ? next : d)) : [next, ...drafts];
  await setItem(DRAFTS_KEY, updated);
  return next;
}

export async function upsertRichDraft({ id, title, contentHtml }) {
  const drafts = await listDrafts();
  const draftId = id ?? createId('draft');
  const next = {
    id: draftId,
    title: title?.trim() || 'Untitled',
    content: '',
    contentHtml: contentHtml ?? '',
    updatedAt: nowIso(),
  };

  const idx = drafts.findIndex((d) => d.id === draftId);
  const updated = idx >= 0 ? drafts.map((d) => (d.id === draftId ? { ...d, ...next } : d)) : [next, ...drafts];
  await setItem(DRAFTS_KEY, updated);
  return next;
}

export async function deleteDraft(id) {
  const drafts = await listDrafts();
  await setItem(
    DRAFTS_KEY,
    drafts.filter((d) => d.id !== id)
  );
}
