import { createId } from '../utils/id';
import { nowIso } from '../utils/date';
import { getItem, setItem } from './storage';
import { bumpMetric, METRICS } from './metricsService';

function keyFor(userId) {
  return `notifications:${userId}`;
}

export async function listNotifications({ userId }) {
  const items = (await getItem(keyFor(userId))) ?? [];
  return Array.isArray(items) ? items : [];
}

export async function addMessageNotification({ toUserId, fromUserId, fromName, chatId, messageId, previewText }) {
  const next = {
    id: createId('n'),
    type: 'message',
    createdAt: nowIso(),
    read: false,
    fromUserId,
    fromName: fromName || fromUserId,
    chatId,
    messageId,
    previewText: previewText || '',
  };
  const list = await listNotifications({ userId: toUserId });
  await setItem(keyFor(toUserId), [next, ...list]);

  // Syncable metrics
  await Promise.all([
    bumpMetric({ userId: toUserId, metric: METRICS.NOTIFICATIONS, by: 1 }).catch(() => null),
    bumpMetric({ userId: toUserId, metric: METRICS.MESSAGES, by: 1 }).catch(() => null),
    bumpMetric({ userId: toUserId, metric: METRICS.REQUESTS, by: 1 }).catch(() => null),
  ]);

  return next;
}

export async function markNotificationRead({ userId, notificationId }) {
  const list = await listNotifications({ userId });
  const next = list.map((n) => (n.id === notificationId ? { ...n, read: true } : n));
  await setItem(keyFor(userId), next);
}
