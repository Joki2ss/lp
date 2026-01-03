import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '../components/ScreenContainer';
import { theme } from '../styles/theme';
import { LanguageSelector } from '../components/LanguageSelector';
import { useT } from '../i18n/t';

export function SettingsScreen() {
  const { t } = useT();

  return (
    <ScreenContainer>
      <Text style={styles.title}>{t('settings')}</Text>
      <View style={styles.card}>
        <LanguageSelector />
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
  },
});
