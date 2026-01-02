import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '../components/ScreenContainer';
import { theme } from '../styles/theme';
import { useAppStore } from '../store/useAppStore';

export function DashboardScreen() {
  const { t } = useTranslation();
  const { state } = useAppStore();
  const role = state.session.role;

  return (
    <ScreenContainer>
      <Text style={styles.title}>{t('dashboard')}</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick status</Text>
        <Text style={styles.muted}>Role: {role}</Text>
        <Text style={styles.muted}>Pro: {String(state.session.isPro)}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Notifications</Text>
        <Text style={styles.muted}>Local notifications feed is available in the Notifications tab.</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...theme.typography.title, color: theme.colors.text, marginBottom: theme.spacing.lg },
  card: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    gap: 6,
  },
  cardTitle: { color: theme.colors.text, fontWeight: '800' },
  muted: { color: theme.colors.muted },
});
