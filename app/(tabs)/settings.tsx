import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { useLang } from '../../context/LanguageContext';
import { speak } from '../../services/speechService';
import { apiFetch, clearSession } from '../../services/api';
import { getLocationConsent, saveLocationConsent } from '../../services/locationConsentService';

const BG    = COLORS.background;
const CARD  = COLORS.surface;
const TEXT  = COLORS.text;
const MUTED = COLORS.muted;
const ACCENT = COLORS.accent;
const SAFE   = COLORS.safe;
const DANGER = COLORS.danger;

export default function BlindSettingsScreen() {
  const { lang } = useLang();
  const [profile,  setProfile]  = useState<any>(null);
  const [consent,  setConsent]  = useState<boolean | null>(null);
  const [saved,    setSaved]    = useState(false);

  useEffect(() => {
    getLocationConsent().then(setConsent);
    apiFetch('/auth/me').then(setProfile).catch(() => {});
    speak(
      lang === 'rw'
        ? 'Igenamiterere. Amakuru yawe.'
        : 'Settings. Your profile.',
    );
  }, []);

  async function allow() {
    setConsent(true);
    await saveLocationConsent(true);
    setSaved(true);
    speak(lang === 'rw' ? 'Emerewe.' : 'Location sharing allowed.');
    setTimeout(() => setSaved(false), 2000);
  }

  async function deny() {
    setConsent(false);
    await saveLocationConsent(false);
    setSaved(true);
    speak(lang === 'rw' ? 'Yanganiwe.' : 'Location sharing denied.');
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleSignOut() {
    await clearSession();
    router.replace('/(auth)');
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={MUTED} />
      </TouchableOpacity>

      <Text style={styles.title}>{lang === 'rw' ? 'Igenamiterere' : 'Settings'}</Text>

      {/* Profile card */}
      {profile && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="person-circle-outline" size={22} color={ACCENT} />
            <Text style={styles.cardTitle}>{lang === 'rw' ? 'Umwirondoro' : 'My Profile'}</Text>
          </View>
          <InfoRow label={lang === 'rw' ? 'Izina' : 'Name'}          value={profile.name} />
          <InfoRow label={lang === 'rw' ? 'Telefoni' : 'Phone'}       value={profile.phone} />
          <InfoRow label={lang === 'rw' ? 'Ururimi' : 'Language'}     value={profile.language === 'rw' ? 'Kinyarwanda' : 'English'} />
          <InfoRow label={lang === 'rw' ? 'Intera y\'Ijwi' : 'Voice Speed'} value={profile.voice_speed} />
          {profile.emergency_phone && (
            <InfoRow label={lang === 'rw' ? 'Uwahamagarwa' : 'Emergency Contact'} value={profile.emergency_phone} />
          )}
        </View>
      )}

      {/* Location consent card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="location-outline" size={22} color={ACCENT} />
          <Text style={styles.cardTitle}>
            {lang === 'rw' ? 'Gusangira Aho Uri' : 'Location Sharing'}
          </Text>
        </View>
        <Text style={styles.cardDesc}>
          {lang === 'rw'
            ? 'Emera cyangwa anga ko umurezi wawe abona aho uri.'
            : 'Allow or deny your guardian from seeing your location.'}
        </Text>
        <View style={[styles.statusRow, {
          backgroundColor: consent === true ? SAFE + '15' : consent === false ? DANGER + '15' : MUTED + '15',
          borderColor:     consent === true ? SAFE + '44' : consent === false ? DANGER + '44' : MUTED + '44',
        }]}>
          <View style={[styles.statusDot, {
            backgroundColor: consent === true ? SAFE : consent === false ? DANGER : MUTED,
          }]} />
          <Text style={[styles.statusText, {
            color: consent === true ? SAFE : consent === false ? DANGER : MUTED,
          }]}>
            {consent === true
              ? (lang === 'rw' ? 'Emerewe' : 'Currently Allowed')
              : consent === false
              ? (lang === 'rw' ? 'Yanganiwe' : 'Currently Denied')
              : (lang === 'rw' ? 'Ntabwo byashyizweho' : 'Not set yet')}
          </Text>
        </View>
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: SAFE, opacity: consent === true ? 0.5 : 1 }]}
            onPress={allow}
            disabled={consent === true}
          >
            <Ionicons name="checkmark-circle" size={18} color="#fff" />
            <Text style={styles.btnText}>{lang === 'rw' ? 'Emera' : 'Allow'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: DANGER, opacity: consent === false ? 0.5 : 1 }]}
            onPress={deny}
            disabled={consent === false}
          >
            <Ionicons name="close-circle" size={18} color="#fff" />
            <Text style={styles.btnText}>{lang === 'rw' ? 'Anga' : 'Deny'}</Text>
          </TouchableOpacity>
        </View>
        {saved && <Text style={[styles.savedMsg, { color: SAFE }]}>{lang === 'rw' ? '✓ Byabitswe' : '✓ Saved'}</Text>}
      </View>

      {/* Sign out */}
      <TouchableOpacity style={styles.signOut} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={18} color={DANGER} />
        <Text style={[styles.signOutText, { color: DANGER }]}>{lang === 'rw' ? 'Sohoka' : 'Sign Out'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={infoStyles.row}>
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={infoStyles.value}>{value}</Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row:   { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: 1, borderTopColor: COLORS.muted + '22' },
  label: { color: MUTED, fontSize: 13 },
  value: { color: TEXT,  fontSize: 13, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
});

const styles = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: BG },
  content:     { padding: 24, paddingTop: 60, paddingBottom: 60, gap: 16 },
  backBtn:     { marginBottom: 8 },
  title:       { color: TEXT, fontSize: 28, fontWeight: '700', marginBottom: 8 },
  card:        { backgroundColor: CARD, borderRadius: 20, padding: 20, gap: 12 },
  cardHeader:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardTitle:   { color: TEXT, fontSize: 17, fontWeight: '700' },
  cardDesc:    { color: MUTED, fontSize: 14, lineHeight: 22 },
  statusRow:   { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, borderWidth: 1 },
  statusDot:   { width: 8, height: 8, borderRadius: 4 },
  statusText:  { fontSize: 14, fontWeight: '600' },
  btnRow:      { flexDirection: 'row', gap: 12 },
  btn:         { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14 },
  btnText:     { color: '#fff', fontSize: 15, fontWeight: '700' },
  savedMsg:    { textAlign: 'center', fontSize: 13, fontWeight: '600' },
  signOut:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: DANGER + '44', backgroundColor: DANGER + '10' },
  signOutText: { fontSize: 14, fontWeight: '600' },
});
