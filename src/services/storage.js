import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_PREFIX = 'sxr2:';

function keyOf(key) {
  return `${KEY_PREFIX}${key}`;
}

async function canUseSecureStore() {
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

export async function setItem(key, value) {
  const k = keyOf(key);
  const raw = typeof value === 'string' ? value : JSON.stringify(value);
  const useSecure = await canUseSecureStore();
  if (useSecure) {
    await SecureStore.setItemAsync(k, raw);
    return;
  }
  await AsyncStorage.setItem(k, raw);
}

export async function getItem(key) {
  const k = keyOf(key);
  const useSecure = await canUseSecureStore();
  const raw = useSecure ? await SecureStore.getItemAsync(k) : await AsyncStorage.getItem(k);
  if (raw == null) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

export async function removeItem(key) {
  const k = keyOf(key);
  const useSecure = await canUseSecureStore();
  if (useSecure) {
    await SecureStore.deleteItemAsync(k);
    return;
  }
  await AsyncStorage.removeItem(k);
}
