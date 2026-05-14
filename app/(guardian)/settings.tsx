import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { apiFetch, clearSession } from '../../services/api';

export default function SettingsScreen() {
  const { colors, theme, toggle } = useTheme();
  const [guardian,   setGuardian]   = useState<any>(null);
  const [blind,      setBlind]      = useState<any>(null);
  const [push,       setPush]       = useState(true);
  const [vib,        setVib]        = useState(true);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    apiFetch('/guardian/dashboard')
      .then(data => {
        setGuardian(data?.guardian   ?? null);
        setBlind(data?.blind_user ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive',
        onPress: async () => {
          await clearSession();
          router.replace('/(auth)');
        },
      },
    ]);
  }

  const initials = guardian?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() ?? '?';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.text }]}>Profile</Text>

      {/* Guardian profile pill */}
      <View style={[styles.profilePill, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.profileAvatar, { backgroundColor: colors.accent + '22', borderColor: colors.accent + '44' }]}>
          {loading
            ? <Ionicons name="person-outline" size={20} color={colors.accent} />
            : <Text style={[styles.profileInitials, { color: colors.accent }]}>{initials}</Text>
          }
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.profileName,  { color: colors.text }]}>{guardian?.name  ?? '—'}</Text>
          <Text style={[styles.profilePhone, { color: colors.muted }]}>{guardian?.phone ?? '—'}</Text>
        </View>
        <View style={[styles.roleBadge, { backgroundColor: colors.accent + '18' }]}>
          <Text style={[styles.roleText, { color: colors.accent }]}>Guardian</Text>
        </View>
      </View>

      {/* Appearance */}
      <Group label="APPEARANCE" colors={colors}>
        <Row
          label={theme === 'dark' ? '🌙  Dark Mode' : '☀️  Light Mode'}
          sub={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          colors={colors}
          right={
            <Switch
              value={theme === 'light'}
              onValueChange={toggle}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor="#fff"
            />
          }
        />
      </Group>

      {/* Blind user info */}
      <Group label="BLIND USER" colors={colors}>
        <Row label="Name"            value={blind?.name        ?? '—'} colors={colors} />
        <Row label="Phone"           value={blind?.phone       ?? '—'} colors={colors} />
        <Row label="Language"        value={blind?.language === 'rw' ? 'Kinyarwanda' : 'English'} colors={colors} />
        <Row label="Voice Speed"     value={blind?.voice_speed ?? '—'} colors={colors} />
        <Row label="Status"          value={blind?.status      ?? '—'} colors={colors} last />
      </Group>

      {/* Emergency contact */}
      <Group label="EMERGENCY CONTACT" colors={colors}>
        <Row
          label="Guardian phone (auto)"
          value={guardian?.phone ?? '—'}
          colors={colors}
          last
        />
      </Group>

      {/* Notifications */}
      <Group label="NOTIFICATIONS" colors={colors}>
        <Row label="Push Notifications" colors={colors}
          right={<Switch value={push} onValueChange={setPush} trackColor={{ false: colors.border, true: colors.accent }} thumbColor="#fff" />}
        />
        <Row label="Vibration" colors={colors} last
          right={<Switch value={vib} onValueChange={setVib} trackColor={{ false: colors.border, true: colors.accent }} thumbColor="#fff" />}
        />
      </Group>

      {/* Sign out */}
      <TouchableOpacity
        style={[styles.signOutPill, { borderColor: colors.danger + '44', backgroundColor: colors.danger + '10' }]}
        onPress={handleSignOut}
      >
        <Ionicons name="log-out-outline" size={18} color={colors.danger} />
        <Text style={[styles.signOutText, { color: colors.danger }]}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={[styles.version, { color: colors.muted }]}>E-mboni v1.0.0</Text>
    </ScrollView>
  );
}

function Group({ label, colors, children }: { label: string; colors: any; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={[styles.groupLabel, { color: colors.muted }]}>{label}</Text>
      <View style={[styles.groupPill, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {children}
      </View>
    </View>
  );
}

function Row({ label, sub, value, colors, last, right }: {
  label: string; sub?: string; value?: string; colors: any; last?: boolean; right?: React.ReactNode;
}) {
  return (
    <View style={[styles.row, !last && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
        {sub && <Text style={[styles.rowSub, { color: colors.muted }]}>{sub}</Text>}
      </View>
      {value && <Text style={[styles.rowValue, { color: colors.muted }]}>{value}</Text>}
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  content:          { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 120, gap: 12 },
  title:            { fontSize: 26, fontWeight: '700', marginBottom: 4 },
  profilePill:      { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 24, borderWidth: 1 },
  profileAvatar:    { width: 50, height: 50, borderRadius: 25, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  profileInitials:  { fontSize: 16, fontWeight: '700' },
  profileName:      { fontSize: 16, fontWeight: '600' },
  profilePhone:     { fontSize: 12, marginTop: 2 },
  roleBadge:        { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  roleText:         { fontSize: 11, fontWeight: '700' },
  group:            { gap: 6 },
  groupLabel:       { fontSize: 11, fontWeight: '700', letterSpacing: 1, paddingLeft: 4 },
  groupPill:        { borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  row:              { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16 },
  rowLabel:         { fontSize: 15 },
  rowSub:           { fontSize: 11, marginTop: 2 },
  rowValue:         { fontSize: 13, maxWidth: 160, textAlign: 'right' },
  signOutPill:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 20, borderWidth: 1, padding: 14, marginTop: 4 },
  signOutText:      { fontSize: 14, fontWeight: '600' },
  version:          { textAlign: 'center', fontSize: 11, marginTop: 4 },
});
