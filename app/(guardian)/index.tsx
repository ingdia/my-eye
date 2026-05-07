import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const USER = { name: 'James Kamau', status: 'Scanning', battery: 82, lastSeen: '2 min ago' };

const ALERTS = [
  { message: 'Chair — 1.5m ahead',          time: '5 min ago',  level: 'warning' },
  { message: 'Path was clear',               time: '12 min ago', level: 'safe'    },
  { message: 'Moving car — 3m on the left',  time: '1 hr ago',   level: 'danger'  },
];

export default function GuardianDashboard() {
  const { colors } = useTheme();

  const statusDot =
    USER.status === 'Safe'               ? colors.safe    :
    USER.status === 'Obstacle Detected'  ? colors.warning :
    USER.status === 'Danger Alert'       ? colors.danger  : colors.muted;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.muted }]}>Guardian</Text>
          <Text style={[styles.name, { color: colors.text }]}>Sarah Kamau</Text>
        </View>
        <View style={[styles.avatar, { backgroundColor: colors.accent + '22', borderColor: colors.accent + '44' }]}>
          <Text style={[styles.avatarText, { color: colors.accent }]}>SK</Text>
        </View>
      </View>

      {/* ── User status pill card ── */}
      <View style={[styles.pillCard, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.accent }]}>
        <View style={styles.cardRow}>
          <View style={[styles.userAvatar, { backgroundColor: colors.accent + '18', borderColor: colors.accent + '33' }]}>
            <Text style={[styles.userAvatarText, { color: colors.accent }]}>JK</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.userName, { color: colors.text }]}>{USER.name}</Text>
            <Text style={[styles.userSub, { color: colors.muted }]}>Last seen {USER.lastSeen}</Text>
          </View>
          <View style={[styles.statusPill, { backgroundColor: statusDot + '18', borderColor: statusDot + '44' }]}>
            <View style={[styles.statusDot, { backgroundColor: statusDot }]} />
            <Text style={[styles.statusText, { color: statusDot }]}>{USER.status}</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.batteryRow}>
          <Text style={[styles.batteryLabel, { color: colors.muted }]}>Battery</Text>
          <View style={[styles.batteryTrack, { backgroundColor: colors.border }]}>
            <View style={[styles.batteryFill, {
              width: `${USER.battery}%` as any,
              backgroundColor: colors.accent,
            }]} />
          </View>
          <Text style={[styles.batteryPct, { color: colors.text }]}>{USER.battery}%</Text>
        </View>
      </View>

      {/* ── Action pills ── */}
      <View style={styles.actions}>
        <ActionPill icon="call-outline"     label="Call"    onPress={() => {}}                                          colors={colors} />
        <ActionPill icon="mic-outline"      label="Message" onPress={() => {}}                                          colors={colors} />
        <ActionPill icon="location-outline" label="Track"   onPress={() => router.push('/(guardian)/tracking')} colors={colors} primary />
      </View>

      {/* ── Recent activity ── */}
      <Text style={[styles.sectionLabel, { color: colors.muted }]}>Recent Activity</Text>
      <View style={[styles.pillCard, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.accent }]}>
        {ALERTS.map((a, i) => {
          const dc = a.level === 'safe' ? colors.safe : a.level === 'warning' ? colors.warning : colors.danger;
          return (
            <View key={i} style={[styles.alertRow, i < ALERTS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
              <View style={[styles.alertIconBox, { backgroundColor: dc + '18' }]}>
                <View style={[styles.alertDot, { backgroundColor: dc }]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.alertMsg, { color: colors.text }]}>{a.message}</Text>
                <Text style={[styles.alertTime, { color: colors.muted }]}>{a.time}</Text>
              </View>
            </View>
          );
        })}
      </View>

    </ScrollView>
  );
}

function ActionPill({ icon, label, onPress, colors, primary }: {
  icon: any; label: string; onPress: () => void; colors: any; primary?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.actionPill, {
        backgroundColor: primary ? colors.accent : colors.card,
        borderColor: primary ? colors.accent : colors.border,
        shadowColor: primary ? colors.accent : 'transparent',
      }]}
    >
      <Ionicons name={icon} size={20} color={primary ? '#fff' : colors.muted} />
      <Text style={[styles.actionLabel, { color: primary ? '#fff' : colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  content:       { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 120, gap: 14 },

  header:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  greeting:      { fontSize: 12, fontWeight: '500', letterSpacing: 0.3 },
  name:          { fontSize: 24, fontWeight: '700', marginTop: 2 },
  avatar:        { width: 44, height: 44, borderRadius: 22, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  avatarText:    { fontSize: 14, fontWeight: '700' },

  pillCard:      { borderRadius: 24, borderWidth: 1, overflow: 'hidden', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },
  cardRow:       { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  userAvatar:    { width: 46, height: 46, borderRadius: 23, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  userAvatarText:{ fontSize: 15, fontWeight: '700' },
  userName:      { fontSize: 15, fontWeight: '600' },
  userSub:       { fontSize: 12, marginTop: 2 },
  statusPill:    { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20, borderWidth: 1 },
  statusDot:     { width: 6, height: 6, borderRadius: 3 },
  statusText:    { fontSize: 11, fontWeight: '600' },
  divider:       { height: 1, marginHorizontal: 16 },
  batteryRow:    { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  batteryLabel:  { fontSize: 12, width: 48 },
  batteryTrack:  { flex: 1, height: 4, borderRadius: 2, overflow: 'hidden' },
  batteryFill:   { height: '100%', borderRadius: 2 },
  batteryPct:    { fontSize: 12, fontWeight: '600', width: 32, textAlign: 'right' },

  actions:       { flexDirection: 'row', gap: 10 },
  actionPill:    { flex: 1, borderRadius: 20, borderWidth: 1, paddingVertical: 14, alignItems: 'center', gap: 6, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 4 },
  actionLabel:   { fontSize: 12, fontWeight: '600' },

  sectionLabel:  { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, paddingLeft: 4 },
  alertRow:      { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  alertIconBox:  { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  alertDot:      { width: 8, height: 8, borderRadius: 4 },
  alertMsg:      { fontSize: 14, fontWeight: '500', lineHeight: 20 },
  alertTime:     { fontSize: 11, marginTop: 2 },
});
