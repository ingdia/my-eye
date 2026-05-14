import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';
import { Linking, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { apiFetch } from '../../services/api';
import { getLocationConsent } from '../../services/locationConsentService';

export default function TrackingScreen() {
  const { colors } = useTheme();

  const [trackData,  setTrackData]  = useState<any>(null);
  const [location,   setLocation]   = useState<{ lat: number; lng: number } | null>(null);
  const [locError,   setLocError]   = useState('');
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error,      setError]      = useState('');

  const load = useCallback(async () => {
    try {
      const data = await apiFetch('/guardian/tracking');
      setTrackData(data);
      setError('');

      const consent = await getLocationConsent();
      if (consent === true) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocError('Location permission denied on this device.');
        } else {
          try {
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
            setLocError('');
          } catch {
            setLocError('Could not get location. Make sure GPS is on.');
          }
        }
      }
    } catch (e: any) {
      setError(e.message ?? 'Failed to load tracking data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

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

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="sync-outline" size={32} color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.muted }]}>Loading tracking data...</Text>
      </View>
    );
  }

  const blindName  = trackData?.blind_name  ?? '—';
  const isScanning = trackData?.is_scanning ?? false;
  const session    = trackData?.session     ?? { status: 'Offline', duration_minutes: 0, alert_count: 0 };
  const timeline   = trackData?.timeline    ?? [];

  const scanColor  = isScanning ? colors.safe : colors.muted;
  const scanLabel  = isScanning ? 'Scanning' : 'Not scanning';
  const scanIcon   = isScanning ? 'radio' : 'radio-outline';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
    >
      <Text style={[styles.title, { color: colors.text }]}>Tracking</Text>
      <Text style={[styles.sub,   { color: colors.muted }]}>{blindName}</Text>

      {/* Scanning status banner */}
      <View style={[styles.scanBanner, { backgroundColor: scanColor + '18', borderColor: scanColor + '44' }]}>
        <Ionicons name={scanIcon as any} size={18} color={scanColor} />
        <Text style={[styles.scanText, { color: scanColor }]}>
          {isScanning ? `${blindName} is actively scanning right now` : `${blindName} is not currently scanning`}
        </Text>
      </View>

      {error ? (
        <View style={[styles.errorBox, { backgroundColor: colors.danger + '18', borderColor: colors.danger + '44' }]}>
          <Ionicons name="cloud-offline-outline" size={16} color={colors.danger} />
          <Text style={[styles.errorText, { color: colors.danger, flex: 1 }]}>{error}</Text>
          <TouchableOpacity onPress={load}>
            <Text style={[{ color: colors.accent, fontWeight: '700', fontSize: 13 }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Location card */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {locError !== '' && (
          <View style={styles.mapInner}>
            <View style={[styles.iconWrap, { backgroundColor: colors.warning + '18' }]}>
              <Ionicons name="warning-outline" size={32} color={colors.warning} />
            </View>
            <Text style={[styles.mapTitle, { color: colors.text }]}>Location Unavailable</Text>
            <Text style={[styles.mapSub,   { color: colors.muted, textAlign: 'center' }]}>{locError}</Text>
          </View>
        )}

        {locError === '' && !location && (
          <View style={styles.mapInner}>
            <View style={[styles.iconWrap, { backgroundColor: colors.muted + '18' }]}>
              <Ionicons name="location-outline" size={32} color={colors.muted} />
            </View>
            <Text style={[styles.mapTitle, { color: colors.text }]}>Location Not Shared</Text>
            <Text style={[styles.mapSub,   { color: colors.muted, textAlign: 'center' }]}>
              The blind user has not allowed location sharing.
            </Text>
          </View>
        )}

        {location && (
          <View style={styles.mapInner}>
            <View style={[styles.iconWrap, { backgroundColor: colors.safe + '18' }]}>
              <Ionicons name="location" size={32} color={colors.safe} />
            </View>
            <Text style={[styles.mapTitle, { color: colors.text }]}>Live Location</Text>
            <View style={[styles.coordCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <View style={styles.coordRow}>
                <Text style={[styles.coordLabel, { color: colors.muted }]}>Latitude</Text>
                <Text style={[styles.coordValue, { color: colors.text }]}>{location.lat.toFixed(6)}</Text>
              </View>
              <View style={[{ height: 1, backgroundColor: colors.border }]} />
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
          { label: 'Status',   value: session.status,                    color: isScanning ? colors.safe : colors.muted },
          { label: 'Duration', value: `${session.duration_minutes} min`, color: colors.accent  },
          { label: 'Alerts',   value: `${session.alert_count}`,          color: session.alert_count > 0 ? colors.warning : colors.muted },
        ].map((s, i) => (
          <View key={i} style={[styles.statPill, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Session timeline */}
      <Text style={[styles.sectionLabel, { color: colors.muted }]}>Session Timeline</Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {timeline.length === 0 ? (
          <View style={styles.emptyInner}>
            <Text style={[styles.emptyText, { color: colors.muted }]}>No activity yet.</Text>
          </View>
        ) : (
          <View style={{ padding: 16 }}>
            {timeline.map((item: any, i: number) => {
              const isLast = i === timeline.length - 1;
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
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center:          { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, padding: 32 },
  loadingText:     { fontSize: 14, marginTop: 8 },
  content:         { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 120, gap: 14 },
  title:           { fontSize: 26, fontWeight: '700' },
  sub:             { fontSize: 13, marginTop: -8 },
  scanBanner:      { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 16, borderWidth: 1 },
  scanText:        { fontSize: 13, fontWeight: '600', flex: 1 },
  errorBox:        { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, borderWidth: 1 },
  errorText:       { fontSize: 13 },
  card:            { borderRadius: 24, borderWidth: 1, overflow: 'hidden' },
  mapInner:        { padding: 28, alignItems: 'center', gap: 12 },
  iconWrap:        { width: 64, height: 64, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  mapTitle:        { fontSize: 16, fontWeight: '700' },
  mapSub:          { fontSize: 12, lineHeight: 18 },
  coordCard:       { width: '100%', borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  coordRow:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  coordLabel:      { fontSize: 12 },
  coordValue:      { fontSize: 14, fontWeight: '600' },
  mapsBtn:         { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 14 },
  mapsBtnText:     { color: '#fff', fontSize: 14, fontWeight: '700' },
  statsRow:        { flexDirection: 'row', gap: 10 },
  statPill:        { flex: 1, borderRadius: 20, borderWidth: 1, padding: 14, alignItems: 'center', gap: 4 },
  statValue:       { fontSize: 18, fontWeight: '700' },
  statLabel:       { fontSize: 11 },
  sectionLabel:    { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, paddingLeft: 4 },
  emptyInner:      { padding: 24, alignItems: 'center' },
  emptyText:       { fontSize: 13 },
  timelineRow:     { flexDirection: 'row', gap: 12 },
  timelineLeft:    { alignItems: 'center', width: 14 },
  timelineDot:     { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  timelineLine:    { width: 2, flex: 1, marginTop: 4 },
  timelineContent: { flex: 1 },
  timelineEvent:   { fontSize: 14, fontWeight: '500', lineHeight: 20 },
  timelineTime:    { fontSize: 11, marginTop: 2 },
});
