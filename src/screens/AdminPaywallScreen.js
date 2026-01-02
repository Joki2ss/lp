import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { theme } from '../styles/theme';
import { PRO_PRICE_EUR } from '../utils/constants';
import { useAppStore } from '../store/useAppStore';

export function AdminPaywallScreen() {
  const { t } = useTranslation();
  const { state, setPro } = useAppStore();

  return (
    <ScreenContainer>
      <View style={styles.card}>
        <Text style={styles.title}>{t('proUnlockTitle')}</Text>
        <Text style={styles.body}>{t('proUnlockBody')}</Text>
        <Text style={styles.price}>€ {PRO_PRICE_EUR.toFixed(2)}</Text>
        <PrimaryButton
          title={state.session.isPro ? t('subscribed') : t('subscribe')}
          onPress={() => setPro(true)}
          disabled={state.session.isPro}
        />
        <Text style={styles.note}>
          Payments are stubbed in this scaffold. Wire to your payment provider later.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  title: { ...theme.typography.title, color: theme.colors.text },
  body: { color: theme.colors.muted },
  price: { color: theme.colors.text, fontSize: 18, fontWeight: '900', marginTop: theme.spacing.sm },
  note: { color: theme.colors.muted, fontSize: 12, marginTop: theme.spacing.sm },
});
