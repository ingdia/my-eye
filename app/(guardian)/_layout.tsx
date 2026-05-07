import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const TABS = [
  { name: 'index',    icon: 'home-outline',          iconActive: 'home',          label: 'Home'     },
  { name: 'tracking', icon: 'navigate-outline',      iconActive: 'navigate',      label: 'Tracking' },
  { name: 'alerts',   icon: 'notifications-outline', iconActive: 'notifications', label: 'Alerts'   },
  { name: 'settings', icon: 'person-outline',        iconActive: 'person',        label: 'Profile'  },
];

function FloatingTabBar({ state, navigation }: any) {
  const { colors } = useTheme();

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, {
        backgroundColor: colors.card,
        borderColor: colors.border,
        shadowColor: '#000',
      }]}>
        {state.routes.map((route: any, i: number) => {
          const tab      = TABS[i] ?? TABS[0];
          const isActive = state.index === i;

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tab}
              onPress={() => navigation.navigate(route.name)}
              activeOpacity={0.7}
            >
              {/* Active dot indicator on top */}
              <View style={[styles.topDot, {
                backgroundColor: isActive ? colors.accent : 'transparent',
              }]} />

              {/* Icon */}
              <View style={[styles.iconContainer, isActive && {
                backgroundColor: colors.accent + '15',
              }]}>
                <Ionicons
                  name={(isActive ? tab.iconActive : tab.icon) as any}
                  size={24}
                  color={isActive ? colors.accent : colors.muted}
                />
              </View>

              {/* Label */}
              <Text style={[styles.label, {
                color: isActive ? colors.accent : colors.muted,
                fontWeight: isActive ? '700' : '500',
              }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function GuardianTabs() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index"    />
      <Tabs.Screen name="tracking" />
      <Tabs.Screen name="alerts"   />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}

export default function GuardianLayout() {
  return <GuardianTabs />;
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 8,
  },
  container: {
    flexDirection: 'row',
    borderRadius: 28,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 4,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 24,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 2,
  },
  topDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginBottom: 2,
  },
  iconContainer: {
    width: 48,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.1,
  },
});
