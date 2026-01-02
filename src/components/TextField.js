import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { theme } from '../styles/theme';

export function TextField({ label, value, onChangeText, placeholder, multiline, numberOfLines }) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.muted}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={[styles.input, multiline && styles.multiline]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: theme.spacing.xs },
  label: { color: theme.colors.muted, fontSize: 13 },
  input: {
    backgroundColor: theme.colors.card,
    color: theme.colors.text,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  multiline: { minHeight: 140, textAlignVertical: 'top' },
});
