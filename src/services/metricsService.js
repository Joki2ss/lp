import { createId } from '../utils/id';
import { getItem, setItem } from './storage';

function keyConfig(userId) {
  return `metrics:config:${userId}`;
}

function keyData(userId) {
  return `metrics:data:${userId}`;
}

function dayKey(d = new Date()) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export const METRICS = {
  REQUESTS: 'requests',
  MESSAGES: 'messages',
  NOTIFICATIONS: 'notifications',
};

export async function getSeriesConfig({ userId }) {
  const raw = await getItem(keyConfig(userId));
  if (Array.isArray(raw) && raw.length) return raw;
  const defaults = [
    { id: createId('s'), name: 'Requests', metric: METRICS.REQUESTS, color: '#2D6CDF', enabled: true },
    { id: createId('s'), name: 'Messages', metric: METRICS.MESSAGES, color: '#0F8E73', enabled: true },
  ];
  await setItem(keyConfig(userId), defaults);
  return defaults;
}

export async function saveSeriesConfig({ userId, config }) {
  await setItem(keyConfig(userId), config);
}

export async function bumpMetric({ userId, metric, when = new Date(), by = 1 }) {
  const dk = dayKey(when);
  const data = (await getItem(keyData(userId))) ?? {};
  const next = { ...data };
  const bucket = typeof next[metric] === 'object' && next[metric] ? { ...next[metric] } : {};
  bucket[dk] = (bucket[dk] ?? 0) + by;
  next[metric] = bucket;
  await setItem(keyData(userId), next);
}

export async function getMetricSeries({ userId, metric, days = 14 }) {
  const data = (await getItem(keyData(userId))) ?? {};
  const bucket = (typeof data[metric] === 'object' && data[metric]) || {};

  const out = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dk = dayKey(d);
    out.push(bucket[dk] ?? 0);
  }
  return out;
}
