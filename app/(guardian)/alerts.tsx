import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { apiFetch } from '../../services/api';

export default function AlertsScreen() {
  const { colors } = useTheme();
  const [alerts,     setAlerts]     = useState<any[]>([]);
  const [blindName,  setBlindName]  = useState('');
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error,      setError]      = useState('');

  const load = useCallback(async () => {
    try {
      // Load blind user name from dashboard, alerts from /alerts
      const [dash, alertData] = await Promise.all([
        apiFetch('/guardian/dashboard'),
        apiFetch('/alerts'),
      ]);
      setBlindName(dash?.blind_user?.name ?? '');
      setAlerts(alertData ?? []);
      setError('');
    } catch (e: any) {
      setError(e.message ?? 'Failed to load alerts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  function levelColor(level: string) {
    if (level === 'danger')  return colors.danger;
    if (level === 'warning') return colors.warning;
    return colors.safe;
  }

  function levelIcon(level: string) {
    if (level === 'danger')  return 'alert-circle';
    if (level === 'warning') return 'warning';
    return 'checkmark-circle';
  }

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="sync-outline" size={32} color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.muted }]}>Loading alerts...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
    >
      <Text style={[styles.title, { color: colors.text }]}>Alerts</Text>
      {blindName ? (
        <Text style={[styles.sub, { color: colors.muted }]}>{blindName}</Text>
      ) : null}

      {error ? (
        <View style={[styles.errorBox, { backgroundColor: colors.danger + '18', borderColor: colors.danger + '44' }]}>
          <Ionicons name="cloud-offline-outline" size={16} color={colors.danger} />
          <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
          <TouchableOpacity onPress={load}>
            <Text style={[styles.retryText, { color: colors.accent }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {alerts.length === 0 && !error ? (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.emptyInner}>
            <Ionicons name="notifications-off-outline" size={32} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.muted }]}>No alerts yet.{'\n'}They will appear here when the blind user is navigating.</Text>
          </View>
        </View>
      ) : (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {alerts.map((a: any, i: number) => {
            const color  = levelColor(a.level);
            const icon   = levelIcon(a.level);
            const isLast = i === alerts.length - 1;
            const time   = a.created_at
              ? new Date(a.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
              : '';
            return (
              <View
                key={a.id ?? i}
                style={[styles.row, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
              >
                <View style={[styles.iconBox, { backgroundColor: color + '18' }]}>
                  <Ionicons name={icon as any} size={16} color={color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.msg,  { color: colors.text }]}>{a.message}</Text>
                  <Text style={[styles.time, { color: colors.muted }]}>{time}</Text>
                </View>
                <View style={[styles.levelBadge, { backgroundColor: color + '18' }]}>
                  <Text style={[styles.levelText, { color }]}>{a.level}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center:      { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, padding: 32 },
  loadingText: { fontSize: 14, marginTop: 8 },
  content:     { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 120, gap: 12 },
  title:       { fontSize: 26, fontWeight: '700' },
  sub:         { fontSize: 13, marginTop: -8 },
  errorBox:    { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, borderWidth: 1 },
  errorText:   { flex: 1, fontSize: 13 },
  retryText:   { fontSize: 13, fontWeight: '700' },
  card:        { borderRadius: 24, borderWidth: 1, overflow: 'hidden' },
  emptyInner:  { padding: 32, alignItems: 'center', gap: 10 },
  emptyText:   { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  row:         { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  iconBox:     { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  msg:         { fontSize: 14, fontWeight: '500', lineHeight: 20 },
  time:        { fontSize: 11, marginTop: 2 },
  levelBadge:  { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  levelText:   { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
});
