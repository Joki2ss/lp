import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../styles/theme';
import { formatTime } from '../utils/date';

export function ChatListItem({ chat, currentUserId, onPress }) {
  const last = chat.messages?.[chat.messages.length - 1] ?? null;
  const unreadCount = useMemo(() => {
    if (!last) return 0;
    const unread = chat.messages.filter((m) => m.readBy?.[currentUserId] === false).length;
    return unread;
  }, [chat.messages, currentUserId, last]);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{chat.title}</Text>
        <Text style={styles.preview} numberOfLines={1}>
          {last ? last.text : '—'}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.time}>{last ? formatTime(last.createdAt) : ''}</Text>
        {unreadCount > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    gap: theme.spacing.md,
  },
  pressed: { opacity: 0.9 },
  title: { color: theme.colors.text, fontSize: 15, fontWeight: '700' },
  preview: { color: theme.colors.muted, marginTop: 4 },
  right: { alignItems: 'flex-end', gap: 8 },
  time: { color: theme.colors.muted, fontSize: 12 },
  badge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 999,
    backgroundColor: theme.colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: theme.colors.text, fontSize: 12, fontWeight: '700' },
});
