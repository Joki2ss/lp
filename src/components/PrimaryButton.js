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

  const textColor = variant === 'muted' ? theme.colors.text : '#fff';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg },
        variant === 'muted' ? styles.muted : null,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.topGlow} />
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
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
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    overflow: 'hidden',
  },
  muted: {
    borderColor: theme.colors.border,
  },
  topGlow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  text: { fontSize: 15, fontWeight: '800' },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.95, transform: [{ translateY: 0.5 }] },
});
