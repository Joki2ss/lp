import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Asset } from 'expo-asset';

import { theme } from '../styles/theme';

async function loadSvgXml(moduleRef) {
  const asset = Asset.fromModule(moduleRef);
  await asset.downloadAsync();
  const uri = asset.uri;

  // Prefer fetch (works on web and many runtimes). For file:// on native,
  // fall back to expo-file-system if available.
  try {
    const res = await fetch(uri);
    return await res.text();
  } catch {
    if (uri.startsWith('file://')) {
      const FileSystem = await getOptionalFileSystem();
      if (FileSystem?.readAsStringAsync) {
        return await FileSystem.readAsStringAsync(uri);
      }
    }
    throw new Error('Unable to load flag asset');
  }
}

async function getOptionalFileSystem() {
  try {
    const mod = await import('expo-file-system');
    return mod;
  } catch {
    return null;
  }
}

export function FlagIcon({ source, size = 22 }) {
  const [xml, setXml] = useState(null);
  const dim = useMemo(() => ({ width: size, height: size }), [size]);

  useEffect(() => {
    let cancelled = false;
    setXml(null);
    loadSvgXml(source)
      .then((text) => {
        if (cancelled) return;
        setXml(text);
      })
      .catch(() => {
        if (cancelled) return;
        setXml(null);
      });
    return () => {
      cancelled = true;
    };
  }, [source]);

  return (
    <View style={[styles.wrap, dim]}>
      {xml ? <SvgXml xml={xml} width={size} height={size} /> : <ActivityIndicator color={theme.colors.muted} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 999,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
});
