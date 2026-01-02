import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { theme } from '../styles/theme';

export function ComposerBar({ onSend }) {
  const [text, setText] = useState('');
  const canSend = text.trim().length > 0;

  const send = () => {
    if (!canSend) return;
    const t = text.trim();
    setText('');
    onSend(t);
  };

  return (
    <View style={styles.wrap}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Message"
        placeholderTextColor={theme.colors.muted}
        style={styles.input}
      />
      <Pressable onPress={send} style={({ pressed }) => [styles.btn, (!canSend || pressed) && styles.btnPressed]}>
        <Text style={styles.btnText}>Send</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.bg,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.card,
    color: theme.colors.text,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  btn: {
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: { opacity: 0.65 },
  btnText: { color: theme.colors.text, fontWeight: '800' },
});
