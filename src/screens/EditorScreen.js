import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ScreenContainer } from '../components/ScreenContainer';
import { TextField } from '../components/TextField';
import { PrimaryButton } from '../components/PrimaryButton';
import { theme } from '../styles/theme';
import { deleteDraft, listDrafts, upsertDraft, upsertRichDraft } from '../services/draftsService';
import { exportDraftToPdf, exportDraftToTxt } from '../services/exportService';
import { useAppStore } from '../store/useAppStore';
import { RichTextEditor } from '../components/RichTextEditor';

export function EditorScreen() {
  const { t } = useTranslation();
  const { state } = useAppStore();
  const isLocked = state.session.role === 'admin' && !state.session.isPro;

  const [drafts, setDrafts] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const active = useMemo(() => drafts.find((d) => d.id === activeId) ?? null, [drafts, activeId]);
  const [title, setTitle] = useState('');
  const [contentHtml, setContentHtml] = useState('');

  const refresh = async () => {
    const next = await listDrafts();
    setDrafts(next);
    if (!activeId && next[0]?.id) setActiveId(next[0].id);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTitle(active?.title ?? '');
    setContentHtml(active?.contentHtml ?? active?.content ?? '');
  }, [activeId, active]);

  const onNew = async () => {
    const d = await upsertRichDraft({ title: 'Untitled', contentHtml: '' });
    await refresh();
    setActiveId(d.id);
  };

  const onSave = async () => {
    if (!activeId) {
      const d = await upsertRichDraft({ title, contentHtml });
      await refresh();
      setActiveId(d.id);
      return;
    }
    await upsertRichDraft({ id: activeId, title, contentHtml });
    await refresh();
  };

  const onDelete = async () => {
    if (!activeId) return;
    await deleteDraft(activeId);
    setActiveId(null);
    await refresh();
  };

  const onExportPdf = async () => {
    try {
      const file = await exportDraftToPdf({ title, content: contentHtml });
      Alert.alert('PDF', `Generated: ${file.uri}`);
    } catch (e) {
      Alert.alert('PDF export failed', String(e?.message || e));
    }
  };

  const onExportTxt = async () => {
    try {
      const file = await exportDraftToTxt({ title, content: contentHtml });
      Alert.alert('TXT', `Saved: ${file.uri}`);
    } catch (e) {
      Alert.alert('TXT export failed', String(e?.message || e));
    }
  };

  if (isLocked) {
    return (
      <ScreenContainer>
        <View style={styles.lockCard}>
          <Text style={styles.title}>{t('editor')}</Text>
          <Text style={styles.muted}>Pro required for the advanced editor & exports.</Text>
          <Text style={styles.muted}>Go to SXR Pro screen to subscribe.</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>{t('editor')}</Text>

      <View style={styles.actions}>
        <PrimaryButton title={t('newDraft')} onPress={onNew} />
        <PrimaryButton title={t('saveDraft')} onPress={onSave} variant="muted" />
        <PrimaryButton title="Delete" onPress={onDelete} variant="danger" disabled={!activeId} />
      </View>

      <View style={styles.exportRow}>
        <PrimaryButton title={t('exportPdf')} onPress={onExportPdf} />
        <PrimaryButton title={t('exportTxt')} onPress={onExportTxt} variant="muted" />
      </View>

      <View style={styles.editor}>
        <TextField label={t('title')} value={title} onChangeText={setTitle} placeholder="Untitled" />
        <Text style={styles.label}>{t('content')}</Text>
        <RichTextEditor valueHtml={contentHtml} onChangeHtml={setContentHtml} placeholder="Write here…" />
      </View>

      <Text style={styles.h2}>{t('drafts')}</Text>
      <FlatList
        data={drafts}
        keyExtractor={(d) => d.id}
        contentContainerStyle={{ gap: theme.spacing.sm, paddingBottom: theme.spacing.xxl }}
        renderItem={({ item }) => (
          <PrimaryButton
            title={`${item.title} • ${new Date(item.updatedAt).toLocaleString()}`}
            onPress={() => setActiveId(item.id)}
            variant={item.id === activeId ? 'primary' : 'muted'}
          />
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...theme.typography.title, color: theme.colors.text, marginBottom: theme.spacing.md },
  h2: { ...theme.typography.h2, color: theme.colors.text, marginTop: theme.spacing.lg, marginBottom: theme.spacing.sm },
  muted: { color: theme.colors.muted },
  label: { color: theme.colors.muted, fontSize: 13 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, marginBottom: theme.spacing.md },
  exportRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, marginBottom: theme.spacing.lg },
  editor: { gap: theme.spacing.md, marginBottom: theme.spacing.lg },
  lockCard: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    gap: 8,
  },
});
