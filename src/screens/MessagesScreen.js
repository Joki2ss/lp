import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ScreenContainer } from '../components/ScreenContainer';
import { theme } from '../styles/theme';
import { createDmChat, listChats, sendMessage } from '../services/messageService';
import { useAppStore } from '../store/useAppStore';
import { ChatListItem } from '../components/ChatListItem';
import { ROUTES } from '../navigation/routes';
import { useT } from '../i18n/t';
import { PlusIcon } from '../components/icons/TabIcon';

function NewMessageModal({ visible, onClose, onCreate }) {
  const [toUserId, setToUserId] = useState('');
  const [title, setTitle] = useState('');
  const [firstMessage, setFirstMessage] = useState('');

  useEffect(() => {
    if (!visible) return;
    setToUserId('');
    setTitle('');
    setFirstMessage('');
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>New message</Text>
          <Text style={styles.modalMuted}>Enter recipient user id (admin/staff/customer)</Text>

          <Text style={styles.inputLabel}>To</Text>
          <TextInput
            value={toUserId}
            onChangeText={setToUserId}
            style={styles.input}
            placeholder="customer"
            placeholderTextColor={theme.colors.muted}
            autoCapitalize="none"
          />

          <Text style={styles.inputLabel}>Chat title (optional)</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            placeholder="Support"
            placeholderTextColor={theme.colors.muted}
          />

          <Text style={styles.inputLabel}>First message (optional)</Text>
          <TextInput
            value={firstMessage}
            onChangeText={setFirstMessage}
            style={[styles.input, { height: 86, textAlignVertical: 'top' }]}
            multiline
            placeholder="Hello…"
            placeholderTextColor={theme.colors.muted}
          />

          <View style={styles.modalActions}>
            <Pressable onPress={onClose} style={[styles.actionBtn, styles.actionBtnMuted]}>
              <Text style={styles.actionBtnTextMuted}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                onCreate({
                  toUserId: toUserId.trim(),
                  title: title.trim(),
                  firstMessage: firstMessage.trim(),
                })
              }
              style={[styles.actionBtn, styles.actionBtnPrimary]}
            >
              <Text style={styles.actionBtnTextPrimary}>Create</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function MessagesScreen() {
  const { t } = useT();
  const nav = useNavigation();
  const { state } = useAppStore();
  const [chats, setChats] = useState([]);
  const [composeOpen, setComposeOpen] = useState(false);

  const refresh = async () => {
    const data = await listChats();
    setChats(data);
  };

  useEffect(() => {
    const unsub = nav.addListener('focus', refresh);
    refresh();
    return unsub;
  }, [nav]);

  useEffect(() => {
    nav.setOptions({
      headerRight: () => (
        <Pressable onPress={() => setComposeOpen(true)} style={{ paddingHorizontal: 10, paddingVertical: 6 }}>
          <PlusIcon color={theme.colors.text} />
        </Pressable>
      ),
    });
  }, [nav]);

  const canMessage = useMemo(() => !!state.session.userId, [state.session.userId]);

  return (
    <ScreenContainer>
      <Text style={styles.title}>{t('messages')}</Text>
      <FlatList
        data={chats}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ gap: theme.spacing.sm, paddingBottom: theme.spacing.xxl }}
        renderItem={({ item }) => (
          <ChatListItem
            chat={item}
            currentUserId={state.session.userId}
            onPress={() => nav.navigate(ROUTES.CHAT, { chatId: item.id, title: item.title })}
          />
        )}
      />

      <NewMessageModal
        visible={composeOpen}
        onClose={() => setComposeOpen(false)}
        onCreate={async ({ toUserId, title, firstMessage }) => {
          if (!canMessage || !toUserId) {
            setComposeOpen(false);
            return;
          }
          const chat = await createDmChat({ memberA: state.session.userId, memberB: toUserId, title });
          if (firstMessage) {
            await sendMessage({
              chatId: chat.id,
              senderId: state.session.userId,
              fromName: state.session.displayName,
              text: firstMessage,
            });
          }
          setComposeOpen(false);
          await refresh();
          nav.navigate(ROUTES.CHAT, { chatId: chat.id, title: chat.title });
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...theme.typography.title, color: theme.colors.text, marginBottom: theme.spacing.md },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 560,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  modalTitle: { ...theme.typography.h2, color: theme.colors.text, marginBottom: 6 },
  modalMuted: { color: theme.colors.muted },
  inputLabel: { color: theme.colors.muted, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    color: theme.colors.text,
    backgroundColor: theme.colors.card2,
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: theme.spacing.sm, marginTop: theme.spacing.md },
  actionBtn: {
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 12,
    borderWidth: 1,
  },
  actionBtnMuted: {
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card2,
  },
  actionBtnPrimary: {
    borderColor: theme.colors.brand,
    backgroundColor: theme.colors.brand,
  },
  actionBtnTextMuted: { color: theme.colors.text, fontWeight: '800' },
  actionBtnTextPrimary: { color: '#fff', fontWeight: '900' },
});
