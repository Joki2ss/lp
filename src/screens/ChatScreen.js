import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRoute } from '@react-navigation/native';

import { ScreenContainer } from '../components/ScreenContainer';
import { theme } from '../styles/theme';
import { getChat, markChatRead, sendMessage } from '../services/messageService';
import { useAppStore } from '../store/useAppStore';
import { MessageBubble } from '../components/MessageBubble';
import { ComposerBar } from '../components/ComposerBar';
import { ChevronDownIcon, ChevronUpIcon, SearchIcon } from '../components/icons/TabIcon';

export function ChatScreen() {
  const route = useRoute();
  const { state } = useAppStore();
  const chatId = route?.params?.chatId;
  const highlightMessageId = route?.params?.highlightMessageId ?? null;
  const [chat, setChat] = useState(null);
  const listRef = React.useRef(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [matchIdx, setMatchIdx] = useState(0);
  const [focusedMessageId, setFocusedMessageId] = useState(null);

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
    await sendMessage({ chatId, senderId: state.session.userId, fromName: state.session.displayName, text });
    await refresh();
  };

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return messages
      .map((m, idx) => ({ idx, id: m.id, text: String(m.text || '') }))
      .filter((m) => m.text.toLowerCase().includes(q));
  }, [messages, query]);

  useEffect(() => {
    if (!matches.length) {
      setMatchIdx(0);
      setFocusedMessageId(null);
      return;
    }
    const next = Math.max(0, Math.min(matchIdx, matches.length - 1));
    setMatchIdx(next);
    setFocusedMessageId(matches[next]?.id ?? null);
  }, [matches.length]);

  const jumpToMatch = (nextIdx) => {
    if (!matches.length) return;
    const idx = (nextIdx + matches.length) % matches.length;
    setMatchIdx(idx);
    const target = matches[idx];
    setFocusedMessageId(target?.id ?? null);
    requestAnimationFrame(() => {
      try {
        listRef.current?.scrollToIndex?.({ index: target.idx, viewPosition: 0.5 });
      } catch {
        // ignore
      }
    });
  };

  useEffect(() => {
    if (!highlightMessageId || !messages.length) return;
    const idx = messages.findIndex((m) => m.id === highlightMessageId);
    if (idx < 0) return;
    requestAnimationFrame(() => {
      try {
        listRef.current?.scrollToIndex?.({ index: idx, viewPosition: 0.5 });
      } catch {
        // ignore
      }
    });
  }, [highlightMessageId, messages]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScreenContainer>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{chat?.title ?? 'Chat'}</Text>
          <Pressable
            onPress={() => setSearchOpen((v) => !v)}
            style={({ pressed }) => [styles.iconBtn, pressed ? { opacity: 0.9 } : null]}
          >
            <SearchIcon color={theme.colors.text} />
          </Pressable>
        </View>

        {searchOpen ? (
          <View style={styles.searchRow}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search in this chat"
              placeholderTextColor={theme.colors.muted}
              style={styles.searchInput}
              autoCapitalize="none"
            />
            <View style={styles.searchNav}>
              <Text style={styles.searchCount}>{matches.length ? `${matchIdx + 1}/${matches.length}` : '0'}</Text>
              <Pressable onPress={() => jumpToMatch(matchIdx - 1)} style={styles.iconBtnSmall}>
                <ChevronUpIcon color={theme.colors.text} size={18} />
              </Pressable>
              <Pressable onPress={() => jumpToMatch(matchIdx + 1)} style={styles.iconBtnSmall}>
                <ChevronDownIcon color={theme.colors.text} size={18} />
              </Pressable>
            </View>
          </View>
        ) : null}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              isMine={item.senderId === state.session.userId}
              showReadReceipt={item.id === lastMine?.id ? receipt : null}
              highlighted={highlightMessageId === item.id || focusedMessageId === item.id}
            />
          )}
        />
      </ScreenContainer>
      <ComposerBar onSend={onSend} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { ...theme.typography.h2, color: theme.colors.text, marginBottom: theme.spacing.md },
  iconBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card2,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    backgroundColor: theme.colors.card,
    color: theme.colors.text,
  },
  searchNav: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  searchCount: { color: theme.colors.muted, minWidth: 44, textAlign: 'right' },
  iconBtnSmall: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card2,
  },
});
