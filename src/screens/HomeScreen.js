import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ScreenContainer } from '../components/ScreenContainer';
import { theme } from '../styles/theme';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAppStore } from '../store/useAppStore';
import { APP_NAME, ROLES } from '../utils/constants';

export function HomeScreen() {
  const { t } = useTranslation();
  const { state, setRole } = useAppStore();

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <Text style={styles.title}>{APP_NAME}</Text>
        <Text style={styles.subtitle}>Standalone • Mobile-first • Web-compatible</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.h2}>{t('role')}</Text>
        <Text style={styles.muted}>Current: {state.session.role}</Text>
        <View style={styles.row}>
          <PrimaryButton title={t('admin')} onPress={() => setRole(ROLES.ADMIN)} />
          <PrimaryButton title={t('staff')} onPress={() => setRole(ROLES.STAFF)} variant="muted" />
        </View>
        <View style={styles.row}>
          <PrimaryButton title={t('customer')} onPress={() => setRole(ROLES.CUSTOMER)} variant="muted" />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: { gap: 6, marginBottom: theme.spacing.xl },
  title: { ...theme.typography.title, color: theme.colors.text },
  subtitle: { color: theme.colors.muted },
  section: { gap: theme.spacing.sm },
  h2: { ...theme.typography.h2, color: theme.colors.text },
  muted: { color: theme.colors.muted },
  row: { flexDirection: 'row', gap: theme.spacing.sm, flexWrap: 'wrap' },
});
