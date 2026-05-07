import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const ACTIVITY = [
  { time: '10:40', event: 'Navigation stopped',           level: 'muted'   },
  { time: '10:38', event: 'Path clear',                   level: 'safe'    },
  { time: '10:37', event: 'Moving car — 3m on the left', level: 'danger'  },
  { time: '10:35', event: 'Path clear',                   level: 'safe'    },
  { time: '10:34', event: 'Chair — 1.5m ahead',          level: 'warning' },
  { time: '10:32', event: 'Navigation started',           level: 'safe'    },
];

export default function TrackingScreen() {
  const { colors } = useTheme();

  function dc(level: string) {
    if (level === 'safe')    return colors.safe;
    if (level === 'warning') return colors.warning;
    if (level === 'danger')  return colors.danger;
    return colors.muted;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.text }]}>Tracking</Text>
      <Text style={[styles.sub, { color: colors.muted }]}>James Kamau · Active session</Text>

      {/* Map pill */}
      <View style={[styles.pillCard, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.accent }]}>
        <View style={styles.mapInner}>
          <View style={[styles.mapIconWrap, { backgroundColor: colors.accent + '18' }]}>
            <Ionicons name="map-outline" size={32} color={colors.accent} />
          </View>
          <Text style={[styles.mapTitle, { color: colors.text }]}>Live Map</Text>
          <Text style={[styles.mapSub, { color: colors.muted }]}>Available after backend setup</Text>
        </View>
      </View>

      {/* Stat pills */}
      <View style={styles.statsRow}>
        {[
          { label: 'Status',   value: 'Safe',  color: colors.safe    },
          { label: 'Duration', value: '8 min', color: colors.accent  },
          { label: 'Alerts',   value: '3',     color: colors.warning },
        ].map((s, i) => (
          <View key={i} style={[styles.statPill, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.accent }]}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Timeline pill */}
      <Text style={[styles.sectionLabel, { color: colors.muted }]}>Session Timeline</Text>
      <View style={[styles.pillCard, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.accent }]}>
        <View style={{ padding: 16 }}>
          {ACTIVITY.map((item, i) => {
            const isLast = i === ACTIVITY.length - 1;
            return (
              <View key={i} style={styles.timelineRow}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.timelineDot, { backgroundColor: dc(item.level), shadowColor: dc(item.level) }]} />
                  {!isLast && <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />}
                </View>
                <View style={[styles.timelineContent, !isLast && { paddingBottom: 18 }]}>
                  <Text style={[styles.timelineEvent, { color: colors.text }]}>{item.event}</Text>
                  <Text style={[styles.timelineTime, { color: colors.muted }]}>{item.time}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content:        { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 120, gap: 14 },
  title:          { fontSize: 26, fontWeight: '700' },
  sub:            { fontSize: 13, marginTop: -8 },

  pillCard:       { borderRadius: 24, borderWidth: 1, overflow: 'hidden', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },
  mapInner:       { padding: 32, alignItems: 'center', gap: 10 },
  mapIconWrap:    { width: 64, height: 64, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  mapTitle:       { fontSize: 15, fontWeight: '600' },
  mapSub:         { fontSize: 12 },

  statsRow:       { flexDirection: 'row', gap: 10 },
  statPill:       { flex: 1, borderRadius: 20, borderWidth: 1, padding: 14, alignItems: 'center', gap: 4, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  statValue:      { fontSize: 18, fontWeight: '700' },
  statLabel:      { fontSize: 11 },

  sectionLabel:   { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, paddingLeft: 4 },
  timelineRow:    { flexDirection: 'row', gap: 12 },
  timelineLeft:   { alignItems: 'center', width: 14 },
  timelineDot:    { width: 10, height: 10, borderRadius: 5, marginTop: 4, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 4, elevation: 2 },
  timelineLine:   { width: 2, flex: 1, marginTop: 4 },
  timelineContent:{ flex: 1 },
  timelineEvent:  { fontSize: 14, fontWeight: '500', lineHeight: 20 },
  timelineTime:   { fontSize: 11, marginTop: 2 },
});
