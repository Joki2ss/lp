import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ScreenContainer } from '../components/ScreenContainer';
import { theme } from '../styles/theme';
import { listChats } from '../services/messageService';
import { useAppStore } from '../store/useAppStore';
import { ChatListItem } from '../components/ChatListItem';
import { ROUTES } from '../navigation/routes';
import { useT } from '../i18n/t';

export function MessagesScreen() {
  const { t } = useT();
  const nav = useNavigation();
  const { state } = useAppStore();
  const [chats, setChats] = useState([]);

  const refresh = async () => {
    const data = await listChats();
    setChats(data);
  };

  useEffect(() => {
    const unsub = nav.addListener('focus', refresh);
    refresh();
    return unsub;
  }, [nav]);

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
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...theme.typography.title, color: theme.colors.text, marginBottom: theme.spacing.md },
});
