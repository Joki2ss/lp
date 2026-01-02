import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../styles/theme';

export function PrimaryButton({ title, onPress, disabled, variant = 'primary' }) {
  const bg =
    variant === 'danger'
      ? theme.colors.danger
      : variant === 'muted'
        ? theme.colors.card2
        : theme.colors.brand;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.btn, { backgroundColor: bg }, disabled && styles.disabled, pressed && styles.pressed]}
    >
      <View>
        <Text style={styles.text}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: theme.colors.text, fontSize: 15, fontWeight: '700' },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.9 },
});
