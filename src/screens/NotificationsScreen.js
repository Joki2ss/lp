import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '../components/ScreenContainer';
import { theme } from '../styles/theme';
import { useAppStore } from '../store/useAppStore';
import { useT } from '../i18n/t';

export function NotificationsScreen() {
  const { t } = useT();
  const { state } = useAppStore();

  const lastToast = useMemo(() => state.ui.lastToast, [state.ui.lastToast]);

  return (
    <ScreenContainer>
      <Text style={styles.title}>{t('notifications')}</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Notification feed</Text>
        <Text style={styles.muted}>This scaffold uses a simple in-app feed.</Text>
        <Text style={styles.muted}>Last event: {lastToast?.message ?? '—'}</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...theme.typography.title, color: theme.colors.text, marginBottom: theme.spacing.md },
  card: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    gap: 6,
  },
  cardTitle: { color: theme.colors.text, fontWeight: '800' },
  muted: { color: theme.colors.muted },
});
