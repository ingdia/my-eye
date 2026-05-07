import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ACCENT = '#A855F7';
const BG     = '#0C0B12';
const CARD   = '#13111C';
const BORDER = '#1E1A2E';
const MUTED  = '#6B6480';

const TABS = [
  { name: 'index',   icon: 'grid-outline'  as const, iconActive: 'grid'           as const, label: 'Overview' },
  { name: 'users',   icon: 'people-outline'as const, iconActive: 'people'         as const, label: 'Users'    },
  { name: 'logs',    icon: 'list-outline'  as const, iconActive: 'list'           as const, label: 'Logs'     },
  { name: 'asettings',icon:'settings-outline'as const,iconActive:'settings'       as const, label: 'Settings' },
];

function AdminTabBar({ state, navigation }: any) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        {state.routes.map((route: any, i: number) => {
          const tab      = TABS[i] ?? TABS[0];
          const isActive = state.index === i;
          const color    = isActive ? ACCENT : MUTED;
          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tab}
              onPress={() => navigation.navigate(route.name)}
              activeOpacity={0.7}
            >
              <View style={[styles.topDot, { backgroundColor: isActive ? ACCENT : 'transparent' }]} />
              <View style={[styles.iconWrap, isActive && { backgroundColor: ACCENT + '18' }]}>
                <Ionicons name={isActive ? tab.iconActive : tab.icon} size={22} color={color} />
              </View>
              <Text style={[styles.label, { color, fontWeight: isActive ? '700' : '500' }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function AdminLayout() {
  return (
    <Tabs tabBar={(props) => <AdminTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index"    />
      <Tabs.Screen name="users"    />
      <Tabs.Screen name="logs"     />
      <Tabs.Screen name="asettings"/>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrapper:  { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingBottom: Platform.OS === 'ios' ? 24 : 12, paddingTop: 8 },
  bar:      { flexDirection: 'row', backgroundColor: CARD, borderRadius: 28, borderWidth: 1, borderColor: BORDER, paddingVertical: 6, paddingHorizontal: 4, shadowColor: ACCENT, shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 24 },
  tab:      { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 4, gap: 2 },
  topDot:   { width: 4, height: 4, borderRadius: 2, marginBottom: 2 },
  iconWrap: { width: 48, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  label:    { fontSize: 10, letterSpacing: 0.1 },
});
