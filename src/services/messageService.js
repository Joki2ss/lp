import { createId } from '../utils/id';
import { nowIso } from '../utils/date';
import { getItem, setItem } from './storage';
import { addMessageNotification } from './notificationService';

const CHATS_KEY = 'chats';

function seedChats() {
  const chat1 = {
    id: 'chat_demo_1',
    type: 'dm',
    title: 'Support',
    members: ['admin', 'customer'],
    messages: [
      {
        id: 'm1',
        chatId: 'chat_demo_1',
        senderId: 'customer',
        text: 'Hi! I need help with my order.',
        createdAt: nowIso(),
        readBy: { admin: false, customer: true },
      },
    ],
  };

  const chat2 = {
    id: 'chat_demo_2',
    type: 'group',
    title: 'Team',
    members: ['admin', 'staff'],
    messages: [
      {
        id: 'm2',
        chatId: 'chat_demo_2',
        senderId: 'admin',
        text: 'Welcome — status updates here.',
        createdAt: nowIso(),
        readBy: { admin: true, staff: false },
      },
    ],
  };

  return [chat1, chat2];
}

export async function listChats() {
  const chats = (await getItem(CHATS_KEY)) ?? null;
  if (!Array.isArray(chats) || chats.length === 0) {
    const seeded = seedChats();
    await setItem(CHATS_KEY, seeded);
    return seeded;
  }
  return chats;
}

export async function getChat(chatId) {
  const chats = await listChats();
  return chats.find((c) => c.id === chatId) ?? null;
}

export async function createDmChat({ memberA, memberB, title }) {
  const chats = await listChats();
  const a = memberA;
  const b = memberB;
  const existing = chats.find(
    (c) =>
      c.type === 'dm' &&
      Array.isArray(c.members) &&
      c.members.length === 2 &&
      c.members.includes(a) &&
      c.members.includes(b)
  );
  if (existing) return existing;

  const id = createId('chat');
  const next = {
    id,
    type: 'dm',
    title: title?.trim() || 'Direct message',
    members: [a, b],
    messages: [],
  };
  await setItem(CHATS_KEY, [next, ...chats]);
  return next;
}

export async function sendMessage({ chatId, senderId, text, fromName }) {
  const chats = await listChats();
  const chat = chats.find((c) => c.id === chatId);
  if (!chat) throw new Error('Chat not found');
  const messageId = createId('msg');
  const readBy = Object.fromEntries(chat.members.map((m) => [m, m === senderId]));
  const message = { id: messageId, chatId, senderId, text, createdAt: nowIso(), readBy };
  const nextChats = chats.map((c) => (c.id === chatId ? { ...c, messages: [...c.messages, message] } : c));
  await setItem(CHATS_KEY, nextChats);

  // Notification for all other members
  const others = chat.members.filter((m) => m !== senderId);
  await Promise.all(
    others.map((toUserId) =>
      addMessageNotification({
        toUserId,
        fromUserId: senderId,
        fromName: fromName || senderId,
        chatId,
        messageId,
        previewText: text,
      }).catch(() => null)
    )
  );

  return message;
}

export async function markChatRead({ chatId, userId }) {
  const chats = await listChats();
  const chat = chats.find((c) => c.id === chatId);
  if (!chat) return;
  const nextChats = chats.map((c) => {
    if (c.id !== chatId) return c;
    const nextMessages = c.messages.map((m) => ({
      ...m,
      readBy: { ...m.readBy, [userId]: true },
    }));
    return { ...c, messages: nextMessages };
  });
  await setItem(CHATS_KEY, nextChats);
}

export async function createGroupChat({ title, members }) {
  const chats = await listChats();
  const id = createId('chat');
  const next = {
    id,
    type: 'group',
    title: title?.trim() || 'New group',
    members: Array.from(new Set(members)).filter(Boolean),
    messages: [],
  };
  await setItem(CHATS_KEY, [next, ...chats]);
  return next;
}

export async function setChatMembers({ chatId, members }) {
  const chats = await listChats();
  const nextChats = chats.map((c) => (c.id === chatId ? { ...c, members } : c));
  await setItem(CHATS_KEY, nextChats);
}
