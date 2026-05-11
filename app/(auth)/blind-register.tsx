import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { G_DARK } from '../../constants/colors';
import { useLang } from '../../context/LanguageContext';
import { setLanguage } from '../../services/speechService';
import { setDetectionLanguage } from '../../services/detectionService';
import { saveLocationConsent } from '../../services/locationConsentService';
import { Lang } from '../../i18n/translations';

const C = G_DARK;

const LANGUAGES: { label: string; value: Lang; flag: string }[] = [
  { label: 'English',    value: 'en', flag: '🇬🇧' },
  { label: 'Kinyarwanda',value: 'rw', flag: '🇷🇼' },
];

const SPEEDS = ['Slow', 'Normal', 'Fast'];

export default function BlindRegisterScreen() {
  const { t, setLang } = useLang();
  const [name, setName]             = useState('');
  const [phone, setPhone]           = useState('');
  const [emergency, setEmergency]   = useState('');
  const [lang, setLangLocal]        = useState<Lang>('en');
  const [speed, setSpeed]           = useState('Normal');
  const [locationAllowed, setLocationAllowed] = useState<boolean | null>(null);

  async function handleDone() {
    if (locationAllowed === null) return; // force a choice
    setLang(lang);
    setLanguage(lang);
    setDetectionLanguage(lang);
    await saveLocationConsent(locationAllowed);
    // TODO: backend — save blind user
    router.replace('/(guardian)');
  }

  return (
    <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← {t('back')}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{t('registerBlind')}</Text>
      <Text style={styles.subtitle}>{t('registeringFor')}</Text>

      <View style={styles.form}>
        <Text style={styles.label}>{t('theirName')}</Text>
        <TextInput style={styles.input} placeholder="e.g. James Kamau" placeholderTextColor={C.muted} value={name} onChangeText={setName} />

        <Text style={styles.label}>{t('phonOptional')}</Text>
        <TextInput style={styles.input} placeholder="+250 700 000 000" placeholderTextColor={C.muted} keyboardType="phone-pad" value={phone} onChangeText={setPhone} />

        <Text style={styles.label}>{t('emergencyContact')}</Text>
        <TextInput style={styles.input} placeholder={t('emergencyPhone')} placeholderTextColor={C.muted} keyboardType="phone-pad" value={emergency} onChangeText={setEmergency} />

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

        {/* Location sharing consent */}
        <Text style={styles.label}>
          {lang === 'rw' ? 'Emera ko umurezi abona aho uri' : 'Allow guardian to see your location?'}
        </Text>
        <Text style={[styles.consentNote, { color: C.muted }]}>
          {lang === 'rw'
            ? 'Iyi ni amahitamo y\'impumyi. Bashobora guhindura ibi igihe icyo aricyo cyose.'
            : 'This is the blind user\'s choice. They can change it anytime.'}
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
            style={[styles.chip, locationAllowed === false && { backgroundColor: C.danger, borderColor: C.danger }]}
            onPress={() => setLocationAllowed(false)}
          >
            <Text style={[styles.chipText, locationAllowed === false && styles.chipTextActive]}>
              {lang === 'rw' ? '✕  Anga' : '✕  Deny'}
            </Text>
          </TouchableOpacity>
        </View>
        {locationAllowed === null && (
          <Text style={[styles.consentWarn, { color: C.danger }]}>
            {lang === 'rw' ? 'Hitamo imwe' : 'Please make a choice to continue'}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.button, locationAllowed === null && styles.buttonDisabled]}
        onPress={handleDone}
        disabled={locationAllowed === null}
      >
        <Text style={styles.buttonText}>{t('done')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen:          { flexGrow: 1, backgroundColor: C.background, padding: 28, paddingTop: 60, paddingBottom: 40 },
  back:            { marginBottom: 16 },
  backText:        { color: C.accent, fontSize: 15 },
  title:           { color: C.text, fontSize: 28, fontWeight: '700', marginBottom: 6 },
  subtitle:        { color: C.muted, fontSize: 14, lineHeight: 22, marginBottom: 24 },
  form:            { gap: 4 },
  label:           { color: C.muted, fontSize: 13, marginBottom: 4, marginTop: 8 },
  input:           { backgroundColor: C.card, borderRadius: 12, padding: 16, color: C.text, fontSize: 16, borderWidth: 1, borderColor: C.border, marginBottom: 4 },
  chips:           { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  chip:            { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  chipActive:      { backgroundColor: C.accent, borderColor: C.accent },
  chipFlag:        { fontSize: 16 },
  chipText:        { color: C.muted, fontSize: 14 },
  chipTextActive:  { color: '#fff', fontWeight: '600' },
  button:          { backgroundColor: C.accent, borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 24 },
  buttonText:      { color: '#fff', fontSize: 16, fontWeight: '600' },
  consentNote:     { fontSize: 12, lineHeight: 18, marginBottom: 8, marginTop: -2 },
  consentWarn:     { fontSize: 12, marginTop: 4 },
  buttonDisabled:  { opacity: 0.4 },
});
