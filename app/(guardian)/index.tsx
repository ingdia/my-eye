import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Linking, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { apiFetch, clearSession, getUser } from '../../services/api';

export default function GuardianDashboard() {
  const { colors } = useTheme();
  const [dashboard,   setDashboard]   = useState<any>(null);
  const [refreshing,  setRefreshing]  = useState(false);
  const [error,       setError]       = useState('');

  const load = useCallback(async () => {
    try {
      const data = await apiFetch('/guardian/dashboard');
      setDashboard(data);
      setError('');
    } catch (e: any) {
      setError(e.message ?? 'Failed to load dashboard.');
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  function handleCall() {
    const phone = dashboard?.blind_user?.phone;
    if (!phone) return Alert.alert('No phone', 'Blind user phone not found.');
    Linking.openURL(`tel:${phone}`).catch(() =>
      Alert.alert('Cannot call', 'Phone dialer is not available on this device.')
    );
  }

  async function handleSignOut() {
    await clearSession();
    router.replace('/(auth)');
  }

  if (!dashboard && !error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="sync-outline" size={32} color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.muted }]}>Loading dashboard...</Text>
      </View>
    );
  }

  if (error && !dashboard) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="cloud-offline-outline" size={40} color={colors.danger} />
        <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
        <TouchableOpacity style={[styles.retryBtn, { backgroundColor: colors.accent }]} onPress={load}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const guardian   = dashboard?.guardian;
  const blind      = dashboard?.blind_user;
  const alerts     = dashboard?.recent_alerts ?? [];
  const session    = dashboard?.active_session;

  const guardianInitials = guardian?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() ?? '?';
  const blindInitials    = blind?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() ?? '?';

  const isScanning  = session?.status === 'active';
  const statusLabel = isScanning ? 'Scanning' : 'Offline';
  const statusColor = isScanning ? colors.safe : colors.muted;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.muted }]}>Guardian</Text>
          <Text style={[styles.name, { color: colors.text }]}>{guardian?.name ?? '—'}</Text>
        </View>
        <TouchableOpacity
          style={[styles.avatar, { backgroundColor: colors.accent + '22', borderColor: colors.accent + '44' }]}
          onPress={handleSignOut}
        >
          <Text style={[styles.avatarText, { color: colors.accent }]}>{guardianInitials}</Text>
        </TouchableOpacity>
      </View>

      {/* Blind user status card */}
      {blind ? (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardRow}>
            <View style={[styles.userAvatar, { backgroundColor: colors.accent + '18', borderColor: colors.accent + '33' }]}>
              <Text style={[styles.userAvatarText, { color: colors.accent }]}>{blindInitials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.userName, { color: colors.text }]}>{blind.name}</Text>
              <Text style={[styles.userSub,  { color: colors.muted }]}>{blind.phone}</Text>
            </View>
            <View style={[styles.statusPill, { backgroundColor: statusColor + '18', borderColor: statusColor + '44' }]}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <Ionicons name="language-outline" size={14} color={colors.muted} />
            <Text style={[styles.infoText, { color: colors.muted }]}>
              {blind.language?.toUpperCase() ?? 'EN'} · {blind.voice_speed ?? 'Normal'} speed
            </Text>
            <View style={{ flex: 1 }} />
            <Ionicons name="shield-checkmark-outline" size={14} color={colors.muted} />
            <Text style={[styles.infoText, { color: colors.muted }]}>{blind.status ?? 'active'}</Text>
          </View>
        </View>
      ) : (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.emptyInner}>
            <Ionicons name="person-add-outline" size={28} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.muted }]}>No blind user linked to your account.</Text>
          </View>
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.actions}>
        <ActionPill
          icon="call"
          label="Call"
          onPress={handleCall}
          colors={colors}
          disabled={!blind?.phone}
        />
        <ActionPill
          icon="navigate"
          label="Track"
          onPress={() => router.push('/(guardian)/tracking')}
          colors={colors}
          primary
        />
        <ActionPill
          icon="notifications"
          label="Alerts"
          onPress={() => router.push('/(guardian)/alerts')}
          colors={colors}
          badge={alerts.filter((a: any) => a.level === 'danger').length || undefined}
        />
      </View>

      {/* Recent alerts */}
      <Text style={[styles.sectionLabel, { color: colors.muted }]}>Recent Activity</Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {alerts.length === 0 ? (
          <View style={styles.emptyInner}>
            <Text style={[styles.emptyText, { color: colors.muted }]}>No alerts yet.</Text>
          </View>
        ) : (
          alerts.slice(0, 5).map((a: any, i: number) => {
            const dc = a.level === 'safe' ? colors.safe : a.level === 'warning' ? colors.warning : colors.danger;
            const time = a.created_at ? new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
            return (
              <View key={a.id ?? i} style={[styles.alertRow, i < Math.min(alerts.length, 5) - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                <View style={[styles.alertIconBox, { backgroundColor: dc + '18' }]}>
                  <View style={[styles.alertDot, { backgroundColor: dc }]} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.alertMsg,  { color: colors.text }]}>{a.message}</Text>
                  <Text style={[styles.alertTime, { color: colors.muted }]}>{time}</Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

function ActionPill({ icon, label, onPress, colors, primary, disabled, badge }: {
  icon: any; label: string; onPress: () => void; colors: any; primary?: boolean; disabled?: boolean; badge?: number;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      style={[styles.actionPill, {
        backgroundColor: primary ? colors.accent : colors.card,
        borderColor:     primary ? colors.accent : colors.border,
        opacity: disabled ? 0.4 : 1,
      }]}
    >
      <Ionicons name={icon} size={20} color={primary ? '#fff' : colors.muted} />
      <Text style={[styles.actionLabel, { color: primary ? '#fff' : colors.text }]}>{label}</Text>
      {!!badge && (
        <View style={[styles.badge, { backgroundColor: colors.danger }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  center:         { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, padding: 32 },
  loadingText:    { fontSize: 14, marginTop: 8 },
  errorText:      { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  retryBtn:       { paddingVertical: 10, paddingHorizontal: 24, borderRadius: 12, marginTop: 8 },
  retryText:      { color: '#fff', fontWeight: '700' },
  content:        { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 120, gap: 14 },
  header:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  greeting:       { fontSize: 12, fontWeight: '500', letterSpacing: 0.3 },
  name:           { fontSize: 24, fontWeight: '700', marginTop: 2 },
  avatar:         { width: 44, height: 44, borderRadius: 22, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  avatarText:     { fontSize: 14, fontWeight: '700' },
  card:           { borderRadius: 24, borderWidth: 1, overflow: 'hidden' },
  cardRow:        { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  userAvatar:     { width: 46, height: 46, borderRadius: 23, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  userAvatarText: { fontSize: 15, fontWeight: '700' },
  userName:       { fontSize: 15, fontWeight: '600' },
  userSub:        { fontSize: 12, marginTop: 2 },
  statusPill:     { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20, borderWidth: 1 },
  statusDot:      { width: 6, height: 6, borderRadius: 3 },
  statusText:     { fontSize: 11, fontWeight: '600' },
  divider:        { height: 1, marginHorizontal: 16 },
  infoRow:        { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 12, paddingHorizontal: 16 },
  infoText:       { fontSize: 12 },
  emptyInner:     { padding: 24, alignItems: 'center', gap: 8 },
  emptyText:      { fontSize: 13, textAlign: 'center' },
  actions:        { flexDirection: 'row', gap: 10 },
  actionPill:     { flex: 1, borderRadius: 20, borderWidth: 1, paddingVertical: 14, alignItems: 'center', gap: 6 },
  actionLabel:    { fontSize: 12, fontWeight: '600' },
  badge:          { position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  badgeText:      { color: '#fff', fontSize: 9, fontWeight: '700' },
  sectionLabel:   { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, paddingLeft: 4 },
  alertRow:       { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  alertIconBox:   { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  alertDot:       { width: 8, height: 8, borderRadius: 4 },
  alertMsg:       { fontSize: 14, fontWeight: '500', lineHeight: 20 },
  alertTime:      { fontSize: 11, marginTop: 2 },
});
