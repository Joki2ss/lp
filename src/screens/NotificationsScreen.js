import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ScreenContainer } from '../components/ScreenContainer';
import { theme } from '../styles/theme';
import { useAppStore } from '../store/useAppStore';
import { useT } from '../i18n/t';
import { listNotifications, markNotificationRead } from '../services/notificationService';
import { ROUTES } from '../navigation/routes';

export function NotificationsScreen() {
  const { t } = useT();
  const { state } = useAppStore();

  const nav = useNavigation();
  const [items, setItems] = useState([]);
  const [openId, setOpenId] = useState(null);

  const refresh = async () => {
    const data = await listNotifications({ userId: state.session.userId });
    setItems(data);
  };

  useEffect(() => {
    const unsub = nav.addListener('focus', refresh);
    refresh();
    return unsub;
  }, [nav, state.session.userId]);

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items]);

  return (
    <ScreenContainer>
      <Text style={styles.title}>{t('notifications')}</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Inbox</Text>
        <Text style={styles.muted}>Unread: {unreadCount}</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(n) => n.id}
        contentContainerStyle={{ gap: theme.spacing.sm, paddingBottom: theme.spacing.xxl }}
        renderItem={({ item }) => {
          const isOpen = openId === item.id;
          return (
            <View style={[styles.row, !item.read ? styles.rowUnread : null]}>
              <Pressable
                onPress={async () => {
                  setOpenId(isOpen ? null : item.id);
                  if (!item.read) {
                    await markNotificationRead({ userId: state.session.userId, notificationId: item.id });
                    refresh();
                  }
                }}
                style={({ pressed }) => [styles.rowHeader, pressed ? { opacity: 0.92 } : null]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle} numberOfLines={1}>
                    {item.fromName}
                  </Text>
                  <Text style={styles.rowPreview} numberOfLines={1}>
                    {item.previewText || '—'}
                  </Text>
                </View>
                <Text style={styles.rowMeta}>{item.type}</Text>
              </Pressable>

              {isOpen ? (
                <View style={styles.rowBody}>
                  <Text style={styles.detailLabel}>Notifica:</Text>
                  <Text style={styles.detailText}>
                    {item.fromName} has sent you a message
                  </Text>
                  <Pressable
                    onPress={() =>
                      nav.navigate(ROUTES.CHAT, {
                        chatId: item.chatId,
                        title: 'Chat',
                        highlightMessageId: item.messageId,
                      })
                    }
                    style={({ pressed }) => [styles.openBtn, pressed ? { opacity: 0.92 } : null]}
                  >
                    <Text style={styles.openBtnText}>Open message</Text>
                  </Pressable>
                </View>
              ) : null}
            </View>
          );
        }}
      />
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
    gap: 6,
    marginBottom: theme.spacing.md,
  },
  cardTitle: { color: theme.colors.text, fontWeight: '800' },
  muted: { color: theme.colors.muted },
  row: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  rowUnread: { borderColor: theme.colors.brand },
  rowHeader: { flexDirection: 'row', alignItems: 'center', padding: theme.spacing.md, gap: theme.spacing.md },
  rowTitle: { color: theme.colors.text, fontWeight: '800' },
  rowPreview: { color: theme.colors.muted, marginTop: 4 },
  rowMeta: { color: theme.colors.muted, fontSize: 12 },
  rowBody: { padding: theme.spacing.md, borderTopWidth: 1, borderTopColor: theme.colors.border, gap: 8 },
  detailLabel: { color: theme.colors.muted, fontWeight: '700' },
  detailText: { color: theme.colors.text },
  openBtn: {
    alignSelf: 'flex-start',
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 10,
    backgroundColor: theme.colors.brand,
  },
  openBtnText: { color: '#fff', fontWeight: '800' },
});
