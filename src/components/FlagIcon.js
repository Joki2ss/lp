import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

import { theme } from '../styles/theme';

async function loadSvgXml(moduleRef) {
  const asset = Asset.fromModule(moduleRef);
  await asset.downloadAsync();
  const uri = asset.uri;
  if (uri.startsWith('file://')) {
    return await FileSystem.readAsStringAsync(uri);
  }
  const res = await fetch(uri);
  return await res.text();
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
