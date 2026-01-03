import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../components/ScreenContainer';
import { theme } from '../styles/theme';
import { useAppStore } from '../store/useAppStore';
import { useT } from '../i18n/t';
import { listNotifications } from '../services/notificationService';
import { ROUTES } from '../navigation/routes';
import { LineChart } from '../components/charts/LineChart';
import { getMetricSeries, getSeriesConfig, METRICS, saveSeriesConfig } from '../services/metricsService';

export function DashboardScreen() {
  const { t } = useT();
  const { state } = useAppStore();
  const role = state.session.role;
  const nav = useNavigation();
  const [latest, setLatest] = useState([]);
  const [showLines, setShowLines] = useState(true);
  const [seriesCfg, setSeriesCfg] = useState([]);
  const [seriesData, setSeriesData] = useState([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const [name, setName] = useState('');
  const [color, setColor] = useState('#2D6CDF');
  const [metric, setMetric] = useState(METRICS.REQUESTS);

  const refresh = async () => {
    const items = await listNotifications({ userId: state.session.userId });
    setLatest(items.slice(0, 2));
  };

  const syncChart = async () => {
    const cfg = await getSeriesConfig({ userId: state.session.userId });
    setSeriesCfg(cfg);
    const datasets = await Promise.all(
      cfg
        .filter((c) => c.enabled)
        .map(async (c) => ({
          id: c.id,
          name: c.name,
          color: c.color,
          values: await getMetricSeries({ userId: state.session.userId, metric: c.metric, days: 14 }),
        }))
    );
    setSeriesData(datasets);
  };

  useEffect(() => {
    const unsub = nav.addListener('focus', refresh);
    refresh();
    return unsub;
  }, [nav, state.session.userId]);

  useEffect(() => {
    const unsub = nav.addListener('focus', syncChart);
    syncChart();
    return unsub;
  }, [nav, state.session.userId]);

  const hasLatest = useMemo(() => latest.length > 0, [latest.length]);

  return (
    <ScreenContainer>
      <Text style={styles.title}>{t('dashboard')}</Text>

      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Requests tracker</Text>
          <Pressable onPress={() => setShowLines((v) => !v)}>
            <Text style={styles.link}>{showLines ? 'Hide line' : 'Show line'}</Text>
          </Pressable>
        </View>
        <LineChart
          width={340}
          height={170}
          series={seriesData}
          showLines={showLines}
          axisColor={theme.colors.border}
          labelColor={theme.colors.muted}
        />

        <View style={styles.chartActions}>
          <Pressable onPress={syncChart} style={({ pressed }) => [styles.smallBtn, pressed ? styles.pressed : null]}>
            <Text style={styles.smallBtnText}>Sync</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setEditTarget(null);
              setName('');
              setColor('#2D6CDF');
              setMetric(METRICS.REQUESTS);
              setEditorOpen(true);
            }}
            style={({ pressed }) => [styles.smallBtn, pressed ? styles.pressed : null]}
          >
            <Text style={styles.smallBtnText}>Add series</Text>
          </Pressable>
        </View>

        <View style={{ gap: 8, marginTop: theme.spacing.md }}>
          {seriesCfg.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => {
                setEditTarget(s);
                setName(s.name);
                setColor(s.color);
                setMetric(s.metric);
                setEditorOpen(true);
              }}
              style={({ pressed }) => [styles.seriesRow, pressed ? styles.pressed : null]}
            >
              <View style={[styles.colorDot, { backgroundColor: s.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.seriesName}>{s.name}</Text>
                <Text style={styles.seriesMeta}>{s.metric}</Text>
              </View>
              <Text style={styles.seriesMeta}>{s.enabled ? 'on' : 'off'}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick status</Text>
        <Text style={styles.muted}>Role: {role}</Text>
        <Text style={styles.muted}>Pro: {String(state.session.isPro)}</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Notifications</Text>
          <Pressable onPress={() => nav.navigate(ROUTES.NOTIFICATIONS)}>
            <Text style={styles.link}>Open</Text>
          </Pressable>
        </View>
        {hasLatest ? (
          <View style={{ gap: 8 }}>
            {latest.map((n) => (
              <Pressable
                key={n.id}
                onPress={() => nav.navigate(ROUTES.NOTIFICATIONS)}
                style={({ pressed }) => [styles.previewRow, pressed ? { opacity: 0.92 } : null]}
              >
                <Text style={styles.previewTitle} numberOfLines={1}>
                  {n.fromName}
                </Text>
                <Text style={styles.previewText} numberOfLines={1}>
                  {n.previewText || '—'}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <Text style={styles.muted}>No notifications yet.</Text>
        )}
      </View>

      <Modal visible={editorOpen} transparent animationType="fade" onRequestClose={() => setEditorOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editTarget ? 'Edit series' : 'Add series'}</Text>

            <Text style={styles.inputLabel}>Name</Text>
            <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="e.g. Requests" />

            <Text style={styles.inputLabel}>Color (hex)</Text>
            <TextInput value={color} onChangeText={setColor} style={styles.input} placeholder="#2D6CDF" autoCapitalize="none" />

            <Text style={styles.inputLabel}>Track</Text>
            <View style={styles.metricRow}>
              {[METRICS.REQUESTS, METRICS.MESSAGES, METRICS.NOTIFICATIONS].map((m) => (
                <Pressable
                  key={m}
                  onPress={() => setMetric(m)}
                  style={({ pressed }) => [
                    styles.metricPill,
                    metric === m ? styles.metricPillActive : null,
                    pressed ? styles.pressed : null,
                  ]}
                >
                  <Text style={[styles.metricText, metric === m ? styles.metricTextActive : null]}>{m}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.modalActions}>
              {editTarget ? (
                <Pressable
                  onPress={async () => {
                    const next = seriesCfg.filter((s) => s.id !== editTarget.id);
                    setSeriesCfg(next);
                    await saveSeriesConfig({ userId: state.session.userId, config: next });
                    setEditorOpen(false);
                    await syncChart();
                  }}
                  style={[styles.actionBtn, styles.actionBtnDanger]}
                >
                  <Text style={styles.actionBtnTextPrimary}>Remove</Text>
                </Pressable>
              ) : null}

              <Pressable onPress={() => setEditorOpen(false)} style={[styles.actionBtn, styles.actionBtnMuted]}>
                <Text style={styles.actionBtnTextMuted}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={async () => {
                  const cleanedName = (name || '').trim() || 'Series';
                  const cleanedColor = (color || '').trim() || '#2D6CDF';

                  const next = editTarget
                    ? seriesCfg.map((s) =>
                        s.id === editTarget.id
                          ? { ...s, name: cleanedName, color: cleanedColor, metric }
                          : s
                      )
                    : [
                        ...seriesCfg,
                        {
                          id: `s_${Date.now()}`,
                          name: cleanedName,
                          color: cleanedColor,
                          metric,
                          enabled: true,
                        },
                      ];

                  setSeriesCfg(next);
                  await saveSeriesConfig({ userId: state.session.userId, config: next });
                  setEditorOpen(false);
                  await syncChart();
                }}
                style={[styles.actionBtn, styles.actionBtnPrimary]}
              >
                <Text style={styles.actionBtnTextPrimary}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...theme.typography.title, color: theme.colors.text, marginBottom: theme.spacing.lg },
  card: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    gap: 6,
  },
  cardTitle: { color: theme.colors.text, fontWeight: '800' },
  muted: { color: theme.colors.muted },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  link: { color: theme.colors.brand, fontWeight: '800' },
  previewRow: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card2,
  },
  previewTitle: { color: theme.colors.text, fontWeight: '800' },
  previewText: { color: theme.colors.muted, marginTop: 4 },
  chartActions: { flexDirection: 'row', gap: theme.spacing.sm, marginTop: theme.spacing.md },
  smallBtn: {
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 10,
    backgroundColor: theme.colors.card2,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  smallBtnText: { color: theme.colors.text, fontWeight: '800' },
  seriesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card2,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  colorDot: { width: 12, height: 12, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(0,0,0,0.12)' },
  seriesName: { color: theme.colors.text, fontWeight: '800' },
  seriesMeta: { color: theme.colors.muted, marginTop: 2, fontSize: 12 },
  pressed: { opacity: 0.92 },
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
  metricRow: { flexDirection: 'row', gap: theme.spacing.sm, flexWrap: 'wrap', marginTop: 8 },
  metricPill: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card2,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 8,
    borderRadius: 999,
  },
  metricPillActive: {
    borderColor: theme.colors.brand,
    backgroundColor: 'rgba(45,108,223,0.10)',
  },
  metricText: { color: theme.colors.text, fontWeight: '700' },
  metricTextActive: { color: theme.colors.brand, fontWeight: '900' },
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
  actionBtnDanger: {
    borderColor: theme.colors.danger,
    backgroundColor: theme.colors.danger,
  },
  actionBtnTextMuted: { color: theme.colors.text, fontWeight: '800' },
  actionBtnTextPrimary: { color: '#fff', fontWeight: '900' },
});
