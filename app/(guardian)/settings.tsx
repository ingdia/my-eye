import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export default function SettingsScreen() {
  const { colors, theme, toggle } = useTheme();
  const [push, setPush]     = useState(true);
  const [sms, setSms]       = useState(false);
  const [vib, setVib]       = useState(true);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

      {/* Profile pill */}
      <View style={[styles.profilePill, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.accent }]}>
        <View style={[styles.profileAvatar, { backgroundColor: colors.accent + '22', borderColor: colors.accent + '44' }]}>
          <Text style={[styles.profileInitials, { color: colors.accent }]}>SK</Text>
        </View>
        <View>
          <Text style={[styles.profileName, { color: colors.text }]}>Sarah Kamau</Text>
          <Text style={[styles.profilePhone, { color: colors.muted }]}>+254 711 000 000</Text>
        </View>
      </View>

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

      <Group label="BLIND USER" colors={colors}>
        <Row label="Name"        value="James Kamau" colors={colors} />
        <Row label="Language"    value="English"     colors={colors} />
        <Row label="Voice Speed" value="Normal"      colors={colors} last />
      </Group>

      <Group label="ALERTS" colors={colors}>
        <Row label="Push Notifications" colors={colors}
          right={<Switch value={push} onValueChange={setPush} trackColor={{ false: colors.border, true: colors.accent }} thumbColor="#fff" />}
        />
        <Row label="SMS Alerts" colors={colors}
          right={<Switch value={sms} onValueChange={setSms} trackColor={{ false: colors.border, true: colors.accent }} thumbColor="#fff" />}
        />
        <Row label="Vibration" colors={colors} last
          right={<Switch value={vib} onValueChange={setVib} trackColor={{ false: colors.border, true: colors.accent }} thumbColor="#fff" />}
        />
      </Group>

      <Group label="EMERGENCY CONTACTS" colors={colors}>
        <Row label="Primary"   value="+254 700 000 000" colors={colors} />
        <Row label="Secondary" value="Not set"          colors={colors} last />
      </Group>

      <TouchableOpacity
        style={[styles.signOutPill, { borderColor: colors.border, backgroundColor: colors.card }]}
        onPress={() => router.replace('/(auth)')}
      >
        <Ionicons name="log-out-outline" size={18} color={colors.muted} />
        <Text style={[styles.signOutText, { color: colors.muted }]}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={[styles.version, { color: colors.muted }]}>E-mboni v1.0.0</Text>
    </ScrollView>
  );
}

function Group({ label, colors, children }: { label: string; colors: any; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={[styles.groupLabel, { color: colors.muted }]}>{label}</Text>
      <View style={[styles.groupPill, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.accent }]}>
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
  content:         { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 120, gap: 12 },
  title:           { fontSize: 26, fontWeight: '700', marginBottom: 4 },

  profilePill:     { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 24, borderWidth: 1, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },
  profileAvatar:   { width: 50, height: 50, borderRadius: 25, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  profileInitials: { fontSize: 16, fontWeight: '700' },
  profileName:     { fontSize: 16, fontWeight: '600' },
  profilePhone:    { fontSize: 12, marginTop: 2 },

  group:           { gap: 6 },
  groupLabel:      { fontSize: 11, fontWeight: '700', letterSpacing: 1, paddingLeft: 4 },
  groupPill:       { borderRadius: 20, borderWidth: 1, overflow: 'hidden', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  row:             { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16 },
  rowLabel:        { fontSize: 15 },
  rowSub:          { fontSize: 11, marginTop: 2 },
  rowValue:        { fontSize: 14 },

  signOutPill:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 20, borderWidth: 1, padding: 14, marginTop: 4 },
  signOutText:     { fontSize: 14, fontWeight: '600' },
  version:         { textAlign: 'center', fontSize: 11, marginTop: 4 },
});
