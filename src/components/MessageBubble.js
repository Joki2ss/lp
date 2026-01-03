import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../styles/theme';
import { formatTime } from '../utils/date';

export function MessageBubble({ message, isMine, showReadReceipt, highlighted = false }) {
  return (
    <View style={[styles.row, isMine ? styles.mineRow : styles.otherRow]}>
      <View style={[styles.bubble, isMine ? styles.mine : styles.other, highlighted ? styles.highlighted : null]}>
        <Text style={styles.text}>{message.text}</Text>
        <View style={styles.meta}>
          <Text style={styles.time}>{formatTime(message.createdAt)}</Text>
          {isMine && showReadReceipt ? (
            <Text style={styles.read}>{showReadReceipt === 'read' ? 'Read' : 'Sent'}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { width: '100%', marginBottom: theme.spacing.sm },
  mineRow: { alignItems: 'flex-end' },
  otherRow: { alignItems: 'flex-start' },
  bubble: {
    maxWidth: '86%',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  mine: { backgroundColor: theme.colors.card2, borderColor: theme.colors.brand },
  other: { backgroundColor: theme.colors.card },
  highlighted: {
    borderColor: theme.colors.warning,
    shadowColor: theme.colors.warning,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  text: { color: theme.colors.text, fontSize: 14 },
  meta: { flexDirection: 'row', gap: 10, marginTop: 6, justifyContent: 'flex-end' },
  time: { color: theme.colors.muted, fontSize: 11 },
  read: { color: theme.colors.muted, fontSize: 11 },
});
