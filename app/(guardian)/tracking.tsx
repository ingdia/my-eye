import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getLocationConsent } from '../../services/locationConsentService';
import { apiFetch } from '../../services/api';

const FALLBACK_ACTIVITY = [
  { time: '10:40', event: 'Navigation stopped',          level: 'muted'   },
  { time: '10:38', event: 'Path clear',                  level: 'safe'    },
  { time: '10:37', event: 'Moving car — 3m on the left', level: 'danger'  },
  { time: '10:35', event: 'Path clear',                  level: 'safe'    },
  { time: '10:34', event: 'Chair — 1.5m ahead',          level: 'warning' },
  { time: '10:32', event: 'Navigation started',          level: 'safe'    },
];

export default function TrackingScreen() {
  const { colors } = useTheme();

  const [consent,   setConsent]   = useState<boolean | null>(null);
  const [location,  setLocation]  = useState<{ lat: number; lng: number } | null>(null);
  const [locError,  setLocError]  = useState('');
  const [loading,   setLoading]   = useState(true);
  const [activity,  setActivity]  = useState<any[]>(FALLBACK_ACTIVITY);
  const [session,   setSession]   = useState({ status: 'Safe', duration_minutes: 8, alert_count: 3 });

  useEffect(() => {
    async function init() {
      const allowed = await getLocationConsent();
      setConsent(allowed);

      apiFetch('/guardian/tracking')
        .then(data => {
          if (data.timeline) setActivity(data.timeline);
          if (data.session)  setSession(data.session);
        })
        .catch(() => {});

      if (allowed === true) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocError('Location permission denied on this device.');
          setLoading(false);
          return;
        }
        try {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
          setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
        } catch {
          setLocError('Could not get location. Make sure GPS is on.');
        }
      }
      setLoading(false);
    }
    init();
  }, []);

  function openInMaps() {
    if (!location) return;
    Linking.openURL(`https://www.google.com/maps?q=${location.lat},${location.lng}`);
  }

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

      {/* Location card */}
      <View style={[styles.pillCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {consent === false && (
          <View style={styles.mapInner}>
            <View style={[styles.iconWrap, { backgroundColor: colors.danger + '18' }]}>
              <Ionicons name="location-outline" size={32} color={colors.danger} />
            </View>
            <Text style={[styles.mapTitle, { color: colors.text }]}>Location Sharing Off</Text>
            <Text style={[styles.mapSub, { color: colors.muted, textAlign: 'center' }]}>
              The blind user has not allowed location sharing.{'\n'}They can change this in their settings.
            </Text>
          </View>
        )}

        {consent === null && !loading && (
          <View style={styles.mapInner}>
            <View style={[styles.iconWrap, { backgroundColor: colors.muted + '18' }]}>
              <Ionicons name="help-circle-outline" size={32} color={colors.muted} />
            </View>
            <Text style={[styles.mapTitle, { color: colors.text }]}>No Consent Given</Text>
            <Text style={[styles.mapSub, { color: colors.muted, textAlign: 'center' }]}>
              The blind user has not set a location preference yet.
            </Text>
          </View>
        )}

        {loading && (
          <View style={styles.mapInner}>
            <Ionicons name="locate-outline" size={32} color={colors.accent} />
            <Text style={[styles.mapSub, { color: colors.muted }]}>Getting location...</Text>
          </View>
        )}

        {consent === true && !loading && locError !== '' && (
          <View style={styles.mapInner}>
            <View style={[styles.iconWrap, { backgroundColor: colors.warning + '18' }]}>
              <Ionicons name="warning-outline" size={32} color={colors.warning} />
            </View>
            <Text style={[styles.mapTitle, { color: colors.text }]}>Location Unavailable</Text>
            <Text style={[styles.mapSub, { color: colors.muted, textAlign: 'center' }]}>{locError}</Text>
          </View>
        )}

        {consent === true && !loading && location && (
          <View style={styles.mapInner}>
            <View style={[styles.iconWrap, { backgroundColor: colors.safe + '18' }]}>
              <Ionicons name="location" size={32} color={colors.safe} />
            </View>
            <Text style={[styles.mapTitle, { color: colors.text }]}>Location Sharing On</Text>
            <View style={[styles.coordCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <View style={styles.coordRow}>
                <Text style={[styles.coordLabel, { color: colors.muted }]}>Latitude</Text>
                <Text style={[styles.coordValue, { color: colors.text }]}>{location.lat.toFixed(6)}</Text>
              </View>
              <View style={[styles.coordDivider, { backgroundColor: colors.border }]} />
              <View style={styles.coordRow}>
                <Text style={[styles.coordLabel, { color: colors.muted }]}>Longitude</Text>
                <Text style={[styles.coordValue, { color: colors.text }]}>{location.lng.toFixed(6)}</Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.mapsBtn, { backgroundColor: colors.accent }]} onPress={openInMaps}>
              <Ionicons name="map" size={16} color="#fff" />
              <Text style={styles.mapsBtnText}>Open in Google Maps</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Stat pills */}
      <View style={styles.statsRow}>
        {[
          { label: 'Status',   value: session.status,                        color: colors.safe    },
          { label: 'Duration', value: `${session.duration_minutes} min`,     color: colors.accent  },
          { label: 'Alerts',   value: `${session.alert_count}`,              color: colors.warning },
        ].map((s, i) => (
          <View key={i} style={[styles.statPill, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Session timeline */}
      <Text style={[styles.sectionLabel, { color: colors.muted }]}>Session Timeline</Text>
      <View style={[styles.pillCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={{ padding: 16 }}>
          {activity.map((item: any, i: number) => {
            const isLast = i === activity.length - 1;
            return (
              <View key={i} style={styles.timelineRow}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.timelineDot, { backgroundColor: dc(item.level) }]} />
                  {!isLast && <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />}
                </View>
                <View style={[styles.timelineContent, !isLast && { paddingBottom: 18 }]}>
                  <Text style={[styles.timelineEvent, { color: colors.text }]}>{item.event}</Text>
                  <Text style={[styles.timelineTime,  { color: colors.muted }]}>{item.time}</Text>
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
  content:         { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 120, gap: 14 },
  title:           { fontSize: 26, fontWeight: '700' },
  sub:             { fontSize: 13, marginTop: -8 },
  pillCard:        { borderRadius: 24, borderWidth: 1, overflow: 'hidden' },
  mapInner:        { padding: 28, alignItems: 'center', gap: 12 },
  iconWrap:        { width: 64, height: 64, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  mapTitle:        { fontSize: 16, fontWeight: '700' },
  mapSub:          { fontSize: 12, lineHeight: 18 },
  coordCard:       { width: '100%', borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  coordRow:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  coordDivider:    { height: 1 },
  coordLabel:      { fontSize: 12 },
  coordValue:      { fontSize: 14, fontWeight: '600' },
  mapsBtn:         { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 14 },
  mapsBtnText:     { color: '#fff', fontSize: 14, fontWeight: '700' },
  statsRow:        { flexDirection: 'row', gap: 10 },
  statPill:        { flex: 1, borderRadius: 20, borderWidth: 1, padding: 14, alignItems: 'center', gap: 4 },
  statValue:       { fontSize: 18, fontWeight: '700' },
  statLabel:       { fontSize: 11 },
  sectionLabel:    { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, paddingLeft: 4 },
  timelineRow:     { flexDirection: 'row', gap: 12 },
  timelineLeft:    { alignItems: 'center', width: 14 },
  timelineDot:     { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  timelineLine:    { width: 2, flex: 1, marginTop: 4 },
  timelineContent: { flex: 1 },
  timelineEvent:   { fontSize: 14, fontWeight: '500', lineHeight: 20 },
  timelineTime:    { fontSize: 11, marginTop: 2 },
});
