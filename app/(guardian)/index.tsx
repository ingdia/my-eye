import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { apiFetch } from '../../services/api';

const BLIND_PHONE = '+250711000002';

const FALLBACK_USER = { name: 'James Kamau', status: 'Scanning', battery: 82, lastSeen: '2 min ago' };
const FALLBACK_ALERTS = [
  { message: 'Chair — 1.5m ahead',         time: '5 min ago',  level: 'warning' },
  { message: 'Path was clear',              time: '12 min ago', level: 'safe'    },
  { message: 'Moving car — 3m on the left', time: '1 hr ago',   level: 'danger'  },
];

export default function GuardianDashboard() {
  const { colors } = useTheme();
  const [showMsg,       setShowMsg]       = useState(false);
  const [msgText,       setMsgText]       = useState('');
  const [user,          setUser]          = useState<any>(FALLBACK_USER);
  const [alerts,        setAlerts]        = useState<any[]>(FALLBACK_ALERTS);
  const [guardianName,  setGuardianName]  = useState('Sarah Kamau');
  const [blindPhone,    setBlindPhone]    = useState(BLIND_PHONE);

  useEffect(() => {
    apiFetch('/guardian/dashboard')
      .then(data => {
        if (data.blind_user)     setUser(data.blind_user);
        if (data.recent_alerts)  setAlerts(data.recent_alerts);
        if (data.guardian?.name) setGuardianName(data.guardian.name);
        if (data.blind_user?.phone) setBlindPhone(data.blind_user.phone);
      })
      .catch(() => {}); // keep fallback on error
  }, []);

  const statusDot =
    user.status === 'Safe'              ? colors.safe    :
    user.status === 'Obstacle Detected' ? colors.warning :
    user.status === 'Danger Alert'      ? colors.danger  : colors.muted;

  function handleCall() {
    Linking.openURL(`tel:${blindPhone}`).catch(() =>
      Alert.alert('Cannot call', 'Phone dialer is not available on this device.')
    );
  }

  function handleSendMessage() {
    if (!msgText.trim()) return;
    Linking.openURL(`sms:${blindPhone}?body=${encodeURIComponent(msgText.trim())}`).catch(() =>
      Alert.alert('Cannot send SMS', 'SMS is not available on this device.')
    );
    setMsgText('');
    setShowMsg(false);
  }

  const initials = guardianName.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  const userInitials = user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.muted }]}>Guardian</Text>
          <Text style={[styles.name, { color: colors.text }]}>{guardianName}</Text>
        </View>
        <View style={[styles.avatar, { backgroundColor: colors.accent + '22', borderColor: colors.accent + '44' }]}>
          <Text style={[styles.avatarText, { color: colors.accent }]}>{initials}</Text>
        </View>
      </View>

      {/* User status card */}
      <View style={[styles.pillCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.cardRow}>
          <View style={[styles.userAvatar, { backgroundColor: colors.accent + '18', borderColor: colors.accent + '33' }]}>
            <Text style={[styles.userAvatarText, { color: colors.accent }]}>{userInitials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
            <Text style={[styles.userSub, { color: colors.muted }]}>Last seen {user.lastSeen}</Text>
          </View>
          <View style={[styles.statusPill, { backgroundColor: statusDot + '18', borderColor: statusDot + '44' }]}>
            <View style={[styles.statusDot, { backgroundColor: statusDot }]} />
            <Text style={[styles.statusText, { color: statusDot }]}>{user.status}</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.batteryRow}>
          <Text style={[styles.batteryLabel, { color: colors.muted }]}>Battery</Text>
          <View style={[styles.batteryTrack, { backgroundColor: colors.border }]}>
            <View style={[styles.batteryFill, { width: `${user.battery}%` as any, backgroundColor: colors.accent }]} />
          </View>
          <Text style={[styles.batteryPct, { color: colors.text }]}>{user.battery}%</Text>
        </View>
      </View>

      {/* Action pills */}
      <View style={styles.actions}>
        <ActionPill icon="call"             label="Call"    onPress={handleCall}                                colors={colors} />
        <ActionPill icon="chatbubble"       label="Message" onPress={() => setShowMsg(v => !v)}                colors={colors} />
        <ActionPill icon="location-outline" label="Track"   onPress={() => router.push('/(guardian)/tracking')} colors={colors} primary />
      </View>

      {/* Message composer */}
      {showMsg && (
        <View style={[styles.msgCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.msgTitle, { color: colors.text }]}>Send message to {user.name}</Text>
          <TextInput
            style={[styles.msgInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
            placeholder="Type a message..."
            placeholderTextColor={colors.muted}
            value={msgText}
            onChangeText={setMsgText}
            multiline
            autoFocus
          />
          <View style={styles.msgActions}>
            <TouchableOpacity style={[styles.msgBtn, { backgroundColor: colors.border }]} onPress={() => { setShowMsg(false); setMsgText(''); }}>
              <Text style={[styles.msgBtnText, { color: colors.muted }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.msgBtn, { backgroundColor: colors.accent }]} onPress={handleSendMessage}>
              <Ionicons name="send" size={14} color="#fff" />
              <Text style={[styles.msgBtnText, { color: '#fff' }]}>Send SMS</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Recent activity */}
      <Text style={[styles.sectionLabel, { color: colors.muted }]}>Recent Activity</Text>
      <View style={[styles.pillCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {alerts.map((a: any, i: number) => {
          const dc = a.level === 'safe' ? colors.safe : a.level === 'warning' ? colors.warning : colors.danger;
          return (
            <View key={i} style={[styles.alertRow, i < alerts.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
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
        borderColor:     primary ? colors.accent : colors.border,
      }]}
    >
      <Ionicons name={icon} size={20} color={primary ? '#fff' : colors.muted} />
      <Text style={[styles.actionLabel, { color: primary ? '#fff' : colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  content:        { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 120, gap: 14 },
  header:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  greeting:       { fontSize: 12, fontWeight: '500', letterSpacing: 0.3 },
  name:           { fontSize: 24, fontWeight: '700', marginTop: 2 },
  avatar:         { width: 44, height: 44, borderRadius: 22, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  avatarText:     { fontSize: 14, fontWeight: '700' },
  pillCard:       { borderRadius: 24, borderWidth: 1, overflow: 'hidden', elevation: 4 },
  cardRow:        { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  userAvatar:     { width: 46, height: 46, borderRadius: 23, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  userAvatarText: { fontSize: 15, fontWeight: '700' },
  userName:       { fontSize: 15, fontWeight: '600' },
  userSub:        { fontSize: 12, marginTop: 2 },
  statusPill:     { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20, borderWidth: 1 },
  statusDot:      { width: 6, height: 6, borderRadius: 3 },
  statusText:     { fontSize: 11, fontWeight: '600' },
  divider:        { height: 1, marginHorizontal: 16 },
  batteryRow:     { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  batteryLabel:   { fontSize: 12, width: 48 },
  batteryTrack:   { flex: 1, height: 4, borderRadius: 2, overflow: 'hidden' },
  batteryFill:    { height: '100%', borderRadius: 2 },
  batteryPct:     { fontSize: 12, fontWeight: '600', width: 32, textAlign: 'right' },
  actions:        { flexDirection: 'row', gap: 10 },
  actionPill:     { flex: 1, borderRadius: 20, borderWidth: 1, paddingVertical: 14, alignItems: 'center', gap: 6, elevation: 4 },
  actionLabel:    { fontSize: 12, fontWeight: '600' },
  sectionLabel:   { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, paddingLeft: 4 },
  alertRow:       { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  alertIconBox:   { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  alertDot:       { width: 8, height: 8, borderRadius: 4 },
  alertMsg:       { fontSize: 14, fontWeight: '500', lineHeight: 20 },
  alertTime:      { fontSize: 11, marginTop: 2 },
  msgCard:        { borderRadius: 20, borderWidth: 1, padding: 16, gap: 12 },
  msgTitle:       { fontSize: 14, fontWeight: '600' },
  msgInput:       { borderRadius: 12, borderWidth: 1, padding: 12, fontSize: 15, minHeight: 80, textAlignVertical: 'top' },
  msgActions:     { flexDirection: 'row', gap: 10, justifyContent: 'flex-end' },
  msgBtn:         { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12 },
  msgBtnText:     { fontSize: 13, fontWeight: '700' },
});
