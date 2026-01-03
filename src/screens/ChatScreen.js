import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';

import { ScreenContainer } from '../components/ScreenContainer';
import { theme } from '../styles/theme';
import { getChat, markChatRead, sendMessage } from '../services/messageService';
import { useAppStore } from '../store/useAppStore';
import { MessageBubble } from '../components/MessageBubble';
import { ComposerBar } from '../components/ComposerBar';

export function ChatScreen() {
  const route = useRoute();
  const { state } = useAppStore();
  const chatId = route?.params?.chatId;
  const [chat, setChat] = useState(null);

  const refresh = useCallback(async () => {
    if (!chatId) return;
    const c = await getChat(chatId);
    setChat(c);
  }, [chatId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!chatId) return;
    markChatRead({ chatId, userId: state.session.userId }).then(refresh).catch(() => {});
  }, [chatId, state.session.userId, refresh]);

  const messages = useMemo(() => chat?.messages ?? [], [chat?.messages]);

  const lastMine = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].senderId === state.session.userId) return messages[i];
    }
    return null;
  }, [messages, state.session.userId]);

  const receipt = useMemo(() => {
    if (!lastMine || !chat) return null;
    const others = chat.members.filter((m) => m !== state.session.userId);
    const allRead = others.every((m) => lastMine.readBy?.[m] === true);
    return allRead ? 'read' : 'sent';
  }, [lastMine, chat, state.session.userId]);

  const onSend = async (text) => {
    await sendMessage({ chatId, senderId: state.session.userId, text });
    await refresh();
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScreenContainer>
        <Text style={styles.title}>{chat?.title ?? 'Chat'}</Text>
        <FlatList
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              isMine={item.senderId === state.session.userId}
              showReadReceipt={item.id === lastMine?.id ? receipt : null}
            />
          )}
        />
      </ScreenContainer>
      <ComposerBar onSend={onSend} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { ...theme.typography.h2, color: theme.colors.text, marginBottom: theme.spacing.md },
});
