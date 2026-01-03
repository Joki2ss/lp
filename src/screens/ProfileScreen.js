import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '../components/ScreenContainer';
import { theme } from '../styles/theme';
import { useAppStore } from '../store/useAppStore';
import { TextField } from '../components/TextField';
import { PrimaryButton } from '../components/PrimaryButton';
import { useT } from '../i18n/t';

export function ProfileScreen() {
  const { t } = useT();
  const { state, setEmail } = useAppStore();
  const [email, setEmailLocal] = useState(state.session.email);

  const canChangeEmail = state.session.role !== 'customer';

  const onSave = () => {
    if (!canChangeEmail) {
      Alert.alert(t('profile'), t('changeEmailRestricted'));
      return;
    }
    setEmail(email.trim());
    Alert.alert(t('profile'), 'Saved');
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>{t('profile')}</Text>
      <View style={styles.card}>
        <TextField label={t('email')} value={email} onChangeText={setEmailLocal} placeholder="name@example.com" />
        <PrimaryButton title="Save" onPress={onSave} />
        {!canChangeEmail ? <Text style={styles.muted}>{t('changeEmailRestricted')}</Text> : null}
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
    gap: theme.spacing.md,
  },
  muted: { color: theme.colors.muted },
});
