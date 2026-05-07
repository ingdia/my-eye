import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const ALERTS = [
  { message: 'Chair detected — 1.5m ahead',       time: 'Just now',   level: 'warning' },
  { message: 'Moving car — 3m on the left',        time: '5 min ago',  level: 'danger'  },
  { message: 'Navigation started',                 time: '8 min ago',  level: 'safe'    },
  { message: 'Dog detected — 1m ahead',            time: '20 min ago', level: 'danger'  },
  { message: 'Stairs detected — 1.5m ahead',       time: '1 hr ago',   level: 'warning' },
  { message: 'Navigation stopped',                 time: '1 hr ago',   level: 'safe'    },
  { message: 'Moving bus — 6m on the left',        time: '2 hrs ago',  level: 'danger'  },
];

export default function AlertsScreen() {
  const { colors } = useTheme();

  function levelColor(level: string) {
    if (level === 'danger')  return colors.danger;
    if (level === 'warning') return colors.warning;
    return colors.safe;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.text }]}>Alerts</Text>
      <Text style={[styles.sub, { color: colors.muted }]}>James Kamau · Today</Text>

      <View style={[styles.pillCard, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.accent }]}>
        {ALERTS.map((a, i) => {
          const color  = levelColor(a.level);
          const isLast = i === ALERTS.length - 1;
          return (
            <View
              key={i}
              style={[styles.row, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
            >
              <View style={[styles.iconBox, { backgroundColor: color + '18' }]}>
                <View style={[styles.dot, { backgroundColor: color }]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.msg, { color: colors.text }]}>{a.message}</Text>
                <Text style={[styles.time, { color: colors.muted }]}>{a.time}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content:  { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 120, gap: 12 },
  title:    { fontSize: 26, fontWeight: '700' },
  sub:      { fontSize: 13, marginTop: -8 },
  pillCard: { borderRadius: 24, borderWidth: 1, overflow: 'hidden', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },
  row:      { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  iconBox:  { width: 34, height: 34, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  dot:      { width: 8, height: 8, borderRadius: 4 },
  msg:      { fontSize: 14, fontWeight: '500', lineHeight: 20 },
  time:     { fontSize: 11, marginTop: 2 },
});
