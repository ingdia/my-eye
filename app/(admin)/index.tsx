import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ACCENT  = '#A855F7';
const BG      = '#0C0B12';
const CARD    = '#13111C';
const BORDER  = '#1E1A2E';
const TEXT    = '#EDE9F8';
const MUTED   = '#6B6480';
const SAFE    = '#4ADE80';
const WARNING = '#FBBF24';
const DANGER  = '#F87171';

const STATS = [
  { label: 'Total Users',    value: '128',  icon: 'people'       as const, color: ACCENT  },
  { label: 'Active Now',     value: '14',   icon: 'radio-button-on' as const, color: SAFE    },
  { label: 'Guardians',      value: '76',   icon: 'shield-checkmark' as const, color: '#60A5FA' },
  { label: 'Alerts Today',   value: '32',   icon: 'notifications' as const, color: WARNING },
];

const RECENT_ALERTS = [
  { user: 'James Kamau',   msg: 'Moving car — 3m ahead',    time: '2 min ago',  level: 'danger'  },
  { user: 'Alice Uwera',   msg: 'Chair detected — 1.5m',    time: '8 min ago',  level: 'warning' },
  { user: 'Eric Mugisha',  msg: 'Navigation started',        time: '15 min ago', level: 'safe'    },
  { user: 'Grace Ineza',   msg: 'Stairs — 1m ahead',        time: '22 min ago', level: 'danger'  },
];

const ACTIVE_USERS = [
  { name: 'James Kamau',  status: 'Navigating', initials: 'JK' },
  { name: 'Alice Uwera',  status: 'Scanning',   initials: 'AU' },
  { name: 'Eric Mugisha', status: 'Idle',        initials: 'EM' },
];

export default function AdminOverview() {
  function levelColor(l: string) {
    return l === 'danger' ? DANGER : l === 'warning' ? WARNING : SAFE;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: BG }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: MUTED }]}>Admin Panel</Text>
          <Text style={[styles.title, { color: TEXT }]}>Overview</Text>
        </View>
        <TouchableOpacity style={[styles.avatarWrap, { backgroundColor: ACCENT + '22', borderColor: ACCENT + '44' }]}>
          <Ionicons name="person" size={20} color={ACCENT} />
        </TouchableOpacity>
      </View>

      {/* Stats grid */}
      <View style={styles.statsGrid}>
        {STATS.map((s, i) => (
          <View key={i} style={[styles.statCard, { backgroundColor: CARD, borderColor: BORDER }]}>
            <View style={[styles.statIcon, { backgroundColor: s.color + '18' }]}>
              <Ionicons name={s.icon} size={20} color={s.color} />
            </View>
            <Text style={[styles.statValue, { color: TEXT }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: MUTED }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Active users */}
      <Text style={[styles.sectionTitle, { color: MUTED }]}>ACTIVE USERS</Text>
      <View style={[styles.pillCard, { backgroundColor: CARD, borderColor: BORDER }]}>
        {ACTIVE_USERS.map((u, i) => (
          <View key={i} style={[styles.userRow, i < ACTIVE_USERS.length - 1 && { borderBottomWidth: 1, borderBottomColor: BORDER }]}>
            <View style={[styles.userAvatar, { backgroundColor: ACCENT + '22' }]}>
              <Text style={[styles.userInitials, { color: ACCENT }]}>{u.initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.userName, { color: TEXT }]}>{u.name}</Text>
              <Text style={[styles.userStatus, { color: MUTED }]}>{u.status}</Text>
            </View>
            <View style={[styles.statusDot, { backgroundColor: u.status === 'Navigating' ? SAFE : u.status === 'Scanning' ? WARNING : MUTED }]} />
          </View>
        ))}
      </View>

      {/* Recent alerts */}
      <Text style={[styles.sectionTitle, { color: MUTED }]}>RECENT ALERTS</Text>
      <View style={[styles.pillCard, { backgroundColor: CARD, borderColor: BORDER }]}>
        {RECENT_ALERTS.map((a, i) => (
          <View key={i} style={[styles.alertRow, i < RECENT_ALERTS.length - 1 && { borderBottomWidth: 1, borderBottomColor: BORDER }]}>
            <View style={[styles.alertIconBox, { backgroundColor: levelColor(a.level) + '18' }]}>
              <View style={[styles.alertDot, { backgroundColor: levelColor(a.level) }]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.alertUser, { color: TEXT }]}>{a.user}</Text>
              <Text style={[styles.alertMsg, { color: MUTED }]}>{a.msg}</Text>
            </View>
            <Text style={[styles.alertTime, { color: MUTED }]}>{a.time}</Text>
          </View>
        ))}
      </View>

      {/* Sign out */}
      <TouchableOpacity style={[styles.signOut, { borderColor: BORDER, backgroundColor: CARD }]} onPress={() => router.replace('/(auth)')}>
        <Ionicons name="log-out-outline" size={18} color={MUTED} />
        <Text style={[styles.signOutText, { color: MUTED }]}>Sign Out</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content:      { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 120, gap: 14 },
  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  greeting:     { fontSize: 12, fontWeight: '500' },
  title:        { fontSize: 26, fontWeight: '700', marginTop: 2 },
  avatarWrap:   { width: 44, height: 44, borderRadius: 22, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },

  statsGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard:     { width: '47%', borderRadius: 20, borderWidth: 1, padding: 16, gap: 8 },
  statIcon:     { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  statValue:    { fontSize: 26, fontWeight: '800' },
  statLabel:    { fontSize: 12 },

  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, paddingLeft: 2 },
  pillCard:     { borderRadius: 20, borderWidth: 1, overflow: 'hidden' },

  userRow:      { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  userAvatar:   { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  userInitials: { fontSize: 14, fontWeight: '700' },
  userName:     { fontSize: 14, fontWeight: '600' },
  userStatus:   { fontSize: 12, marginTop: 2 },
  statusDot:    { width: 8, height: 8, borderRadius: 4 },

  alertRow:     { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  alertIconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  alertDot:     { width: 8, height: 8, borderRadius: 4 },
  alertUser:    { fontSize: 13, fontWeight: '600' },
  alertMsg:     { fontSize: 12, marginTop: 2 },
  alertTime:    { fontSize: 11 },

  signOut:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 20, borderWidth: 1, padding: 14 },
  signOutText:  { fontSize: 14, fontWeight: '600' },
});
