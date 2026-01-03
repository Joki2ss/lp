import React, { useMemo } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { LANGUAGES } from '../i18n/languages';
import { theme } from '../styles/theme';
import { FlagIcon } from './FlagIcon';
import { useAppStore } from '../store/useAppStore';
import { useT } from '../i18n/t';

export function LanguageSelector() {
  const { t } = useT();
  const { state, setLanguage } = useAppStore();

  const current = useMemo(
    () => LANGUAGES.find((l) => l.code === state.session.language) ?? LANGUAGES[0],
    [state.session.language]
  );

  const onPick = async (code) => {
    try {
      setLanguage(code);
      Alert.alert(t('language'), t('rtlNote'));
    } catch {
      // noop
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{t('language')}</Text>
      <View style={styles.grid}>
        {LANGUAGES.map((lang) => {
          const selected = lang.code === current.code;
          return (
            <Pressable
              key={lang.code}
              onPress={() => onPick(lang.code)}
              style={({ pressed }) => [styles.item, selected && styles.itemSelected, pressed && styles.itemPressed]}
            >
              <FlagIcon source={lang.flag} size={24} />
              <Text style={styles.itemText}>{lang.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: theme.spacing.sm },
  label: { color: theme.colors.muted, fontSize: 13 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  itemSelected: { borderColor: theme.colors.brand },
  itemPressed: { opacity: 0.9 },
  itemText: { color: theme.colors.text, fontSize: 13 },
});
