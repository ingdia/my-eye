import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { G_DARK } from '../../constants/colors';
import { useLang } from '../../context/LanguageContext';
import { Lang } from '../../i18n/translations';
import { apiFetch, saveToken, saveUser } from '../../services/api';
import { setDetectionLanguage } from '../../services/detectionService';
import { saveLocationConsent } from '../../services/locationConsentService';
import { setLanguage } from '../../services/speechService';

const C = G_DARK;

const LANGUAGES: { label: string; value: Lang; flag: string }[] = [
  { label: 'English',     value: 'en', flag: '🇬🇧' },
  { label: 'Kinyarwanda', value: 'rw', flag: '🇷🇼' },
];
const SPEEDS = ['Slow', 'Normal', 'Fast'];

export default function BlindRegisterScreen() {
  const { t, setLang } = useLang();

  const {
    guardianName  = '',
    guardianPhone = '',
    password      = '',
    relationship  = '',
  } = useLocalSearchParams<{
    guardianName:  string;
    guardianPhone: string;
    password:      string;
    relationship:  string;
  }>();

  const [blindName,       setBlindName]       = useState('');
  const [blindPhone,      setBlindPhone]       = useState('');
  const [lang,            setLangLocal]        = useState<Lang>('en');
  const [speed,           setSpeed]            = useState('Normal');
  const [locationAllowed, setLocationAllowed]  = useState<boolean | null>(null);
  const [loading,         setLoading]          = useState(false);
  const [error,           setError]            = useState('');

  const canSubmit = locationAllowed !== null
    && blindName.trim().length >= 2
    && blindPhone.trim().length >= 9
    && !loading;

  async function handleDone() {
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          guardian: {
            name:         guardianName.trim(),
            phone:        guardianPhone,
            password:     password,
            relationship: relationship.trim() || 'Guardian',
          },
          blind_user: {
            name:        blindName.trim(),
            phone:       blindPhone.trim().replace(/\s/g, ''),
            language:    lang,
            voice_speed: speed,
          },
        }),
      });

      await saveLocationConsent(locationAllowed!);
      await saveToken(data.token);
      await saveUser(data.guardian);
      setLang(lang);
      setLanguage(lang);
      setDetectionLanguage(lang);

      router.replace('/(guardian)');
    } catch (e: any) {
      setError(e.message ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← {t('back')}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{t('registerBlind')}</Text>
      <Text style={styles.subtitle}>{t('registeringFor')}</Text>

      {/* Guardian is the emergency contact — info banner */}
      <View style={styles.infoBanner}>
        <Ionicons name="shield-checkmark-outline" size={16} color={C.accent} />
        <Text style={styles.infoText}>
          {lang === 'rw'
            ? `Nimero ya ${guardianName || 'umurezi'} izakoreshwa nk'uwahamagarwa mu bihe bikomeye.`
            : `${guardianName || 'Guardian'}'s number will be used as the emergency contact.`}
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>{t('theirName')}</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. James Kamau"
          placeholderTextColor={C.muted}
          value={blindName}
          onChangeText={setBlindName}
          autoCapitalize="words"
        />

        <Text style={styles.label}>
          {lang === 'rw' ? 'Nimero ya Telefoni (izakoreshwa kwinjira)' : 'Phone Number (used to log in)'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="+250 780 000 000"
          placeholderTextColor={C.muted}
          keyboardType="phone-pad"
          value={blindPhone}
          onChangeText={setBlindPhone}
        />

        <View style={styles.passwordNote}>
          <Ionicons name="information-circle-outline" size={14} color={C.muted} />
          <Text style={styles.passwordNoteText}>
            {lang === 'rw'
              ? 'Ijambo banga ry\'impumyi ni imibare 6 y\'imperuka ya nimero yabo ya telefoni.'
              : 'The blind user\'s password will be the last 6 digits of their phone number.'}
          </Text>
        </View>

        <Text style={styles.label}>{t('preferredLang')}</Text>
        <View style={styles.chips}>
          {LANGUAGES.map((l) => (
            <TouchableOpacity
              key={l.value}
              style={[styles.chip, lang === l.value && styles.chipActive]}
              onPress={() => setLangLocal(l.value)}
            >
              <Text style={styles.chipFlag}>{l.flag}</Text>
              <Text style={[styles.chipText, lang === l.value && styles.chipTextActive]}>{l.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>{t('voiceSpeed')}</Text>
        <View style={styles.chips}>
          {SPEEDS.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, speed === s && styles.chipActive]}
              onPress={() => setSpeed(s)}
            >
              <Text style={[styles.chipText, speed === s && styles.chipTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>
          {lang === 'rw' ? 'Emera ko umurezi abona aho uri' : 'Allow guardian to see your location?'}
        </Text>
        <View style={styles.chips}>
          <TouchableOpacity
            style={[styles.chip, locationAllowed === true && styles.chipActive]}
            onPress={() => setLocationAllowed(true)}
          >
            <Text style={[styles.chipText, locationAllowed === true && styles.chipTextActive]}>
              {lang === 'rw' ? '✓  Emera' : '✓  Allow'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, locationAllowed === false && styles.chipDeny]}
            onPress={() => setLocationAllowed(false)}
          >
            <Text style={[styles.chipText, locationAllowed === false && styles.chipTextActive]}>
              {lang === 'rw' ? '✕  Anga' : '✕  Deny'}
            </Text>
          </TouchableOpacity>
        </View>

        {locationAllowed === null && (
          <Text style={styles.warn}>
            {lang === 'rw' ? 'Hitamo imwe' : 'Please make a choice to continue'}
          </Text>
        )}

        {error ? <Text style={[styles.warn, { marginTop: 8 }]}>{error}</Text> : null}
      </View>

      <TouchableOpacity
        style={[styles.button, !canSubmit && styles.buttonDisabled]}
        onPress={handleDone}
        disabled={!canSubmit}
      >
        <Text style={styles.buttonText}>{loading ? '...' : t('done')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen:           { flexGrow: 1, backgroundColor: C.background, padding: 28, paddingTop: 60, paddingBottom: 40 },
  back:             { marginBottom: 16 },
  backText:         { color: C.accent, fontSize: 15 },
  title:            { color: C.text, fontSize: 28, fontWeight: '700', marginBottom: 6 },
  subtitle:         { color: C.muted, fontSize: 14, lineHeight: 22, marginBottom: 16 },
  infoBanner:       { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: C.accent + '18', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: C.accent + '40', marginBottom: 16 },
  infoText:         { color: C.text, fontSize: 12, lineHeight: 18, flex: 1 },
  form:             { gap: 4 },
  label:            { color: C.muted, fontSize: 13, marginBottom: 4, marginTop: 10 },
  input:            { backgroundColor: C.card, borderRadius: 12, padding: 16, color: C.text, fontSize: 16, borderWidth: 1, borderColor: C.border },
  passwordNote:     { flexDirection: 'row', alignItems: 'flex-start', gap: 6, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 10, marginTop: 6 },
  passwordNoteText: { color: C.muted, fontSize: 12, lineHeight: 17, flex: 1 },
  warn:             { color: '#F87171', fontSize: 12, marginTop: 4 },
  chips:            { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  chip:             { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  chipActive:       { backgroundColor: C.accent, borderColor: C.accent },
  chipDeny:         { backgroundColor: '#EF4444', borderColor: '#EF4444' },
  chipFlag:         { fontSize: 16 },
  chipText:         { color: C.muted, fontSize: 14 },
  chipTextActive:   { color: '#fff', fontWeight: '600' },
  button:           { backgroundColor: C.accent, borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 28 },
  buttonDisabled:   { opacity: 0.4 },
  buttonText:       { color: '#fff', fontSize: 16, fontWeight: '600' },
});
