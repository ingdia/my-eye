import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const ACCENT  = '#A855F7';
const BG      = '#0C0B12';
const CARD    = '#13111C';
const BORDER  = '#1E1A2E';
const TEXT    = '#EDE9F8';
const MUTED   = '#6B6480';
const SAFE    = '#4ADE80';

const USERS = [
  { name: 'James Kamau',   role: 'blind',    guardian: 'Sarah Kamau',  status: 'active',   initials: 'JK', lang: 'EN' },
  { name: 'Sarah Kamau',   role: 'guardian', guardian: '—',            status: 'active',   initials: 'SK', lang: 'EN' },
  { name: 'Alice Uwera',   role: 'blind',    guardian: 'Paul Uwera',   status: 'active',   initials: 'AU', lang: 'RW' },
  { name: 'Paul Uwera',    role: 'guardian', guardian: '—',            status: 'active',   initials: 'PU', lang: 'RW' },
  { name: 'Eric Mugisha',  role: 'blind',    guardian: 'Marie Mugisha',status: 'inactive', initials: 'EM', lang: 'RW' },
  { name: 'Marie Mugisha', role: 'guardian', guardian: '—',            status: 'inactive', initials: 'MM', lang: 'RW' },
];

export default function AdminUsers() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: BG }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      <Text style={[styles.title, { color: TEXT }]}>Users</Text>
      <Text style={[styles.sub, { color: MUTED }]}>{USERS.length} registered accounts</Text>

      {/* Summary pills */}
      <View style={styles.summaryRow}>
        {[
          { label: 'Blind Users', value: USERS.filter(u => u.role === 'blind').length,    icon: 'mic'              as const, color: ACCENT },
          { label: 'Guardians',   value: USERS.filter(u => u.role === 'guardian').length, icon: 'shield-checkmark' as const, color: '#60A5FA' },
          { label: 'Active',      value: USERS.filter(u => u.status === 'active').length, icon: 'radio-button-on'  as const, color: SAFE },
        ].map((s, i) => (
          <View key={i} style={[styles.summaryCard, { backgroundColor: CARD, borderColor: BORDER }]}>
            <Ionicons name={s.icon} size={18} color={s.color} />
            <Text style={[styles.summaryValue, { color: TEXT }]}>{s.value}</Text>
            <Text style={[styles.summaryLabel, { color: MUTED }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* User list */}
      <View style={[styles.pillCard, { backgroundColor: CARD, borderColor: BORDER }]}>
        {USERS.map((u, i) => (
          <View key={i} style={[styles.userRow, i < USERS.length - 1 && { borderBottomWidth: 1, borderBottomColor: BORDER }]}>
            <View style={[styles.avatar, { backgroundColor: u.role === 'blind' ? ACCENT + '22' : '#60A5FA22' }]}>
              <Text style={[styles.initials, { color: u.role === 'blind' ? ACCENT : '#60A5FA' }]}>{u.initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.nameRow}>
                <Text style={[styles.name, { color: TEXT }]}>{u.name}</Text>
                <View style={[styles.roleBadge, { backgroundColor: u.role === 'blind' ? ACCENT + '18' : '#60A5FA18' }]}>
                  <Text style={[styles.roleText, { color: u.role === 'blind' ? ACCENT : '#60A5FA' }]}>
                    {u.role === 'blind' ? 'Blind' : 'Guardian'}
                  </Text>
                </View>
              </View>
              <Text style={[styles.detail, { color: MUTED }]}>
                {u.role === 'blind' ? `Guardian: ${u.guardian}` : 'Guardian account'}
                {'  ·  '}{u.lang}
              </Text>
            </View>
            <View style={[styles.statusDot, { backgroundColor: u.status === 'active' ? SAFE : MUTED }]} />
          </View>
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content:      { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 120, gap: 14 },
  title:        { fontSize: 26, fontWeight: '700' },
  sub:          { fontSize: 13, marginTop: -8 },
  summaryRow:   { flexDirection: 'row', gap: 10 },
  summaryCard:  { flex: 1, borderRadius: 16, borderWidth: 1, padding: 12, alignItems: 'center', gap: 4 },
  summaryValue: { fontSize: 20, fontWeight: '800' },
  summaryLabel: { fontSize: 10 },
  pillCard:     { borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  userRow:      { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  avatar:       { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  initials:     { fontSize: 14, fontWeight: '700' },
  nameRow:      { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name:         { fontSize: 14, fontWeight: '600' },
  roleBadge:    { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  roleText:     { fontSize: 10, fontWeight: '700' },
  detail:       { fontSize: 11, marginTop: 2 },
  statusDot:    { width: 8, height: 8, borderRadius: 4 },
});
