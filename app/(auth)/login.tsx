import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { G_DARK } from '../../constants/colors';
import { useLang } from '../../context/LanguageContext';
import { setDetectionLanguage } from '../../services/detectionService';
import { setLanguage } from '../../services/speechService';

const C = G_DARK;

const DEMO_ACCOUNTS = [
  { role: 'guardian', phone: '+250 711 000 001', password: 'guardian123', icon: 'shield-checkmark' as const, route: '/(guardian)' },
  { role: 'blind',    phone: '+250 711 000 002', password: 'blind123',    icon: 'mic'              as const, route: '/(tabs)'     },
];

export default function LoginScreen() {
  const { t, lang, setLang } = useLang();
  const [phone, setPhone]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');

  function applyLang(l: 'en' | 'rw') {
    setLang(l);
    setLanguage(l);
    setDetectionLanguage(l);
  }

  function handleLogin() {
    const match = DEMO_ACCOUNTS.find(a => a.phone === phone.trim() && a.password === password.trim());
    if (match) {
      router.replace(match.route as any);
    } else {
      setError(lang === 'rw'
        ? 'Nimero cyangwa ijambo banga sibyo.'
        : 'Wrong phone or password.');
    }
  }

  return (
    <ImageBackground
      source={require('../../assets/images/auth-bg.jpg')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">

        {/* Top row */}
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.langRow}>
            <TouchableOpacity
              style={[styles.langBtn, lang === 'en' && styles.langBtnActive]}
              onPress={() => applyLang('en')}
            >
              <Text style={[styles.langText, lang === 'en' && styles.langTextActive]}>🇬🇧 EN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.langBtn, lang === 'rw' && styles.langBtnActive]}
              onPress={() => applyLang('rw')}
            >
              <Text style={[styles.langText, lang === 'rw' && styles.langTextActive]}>🇷🇼 RW</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoIcon}>
            <Ionicons name="eye" size={28} color="#fff" />
          </View>
          <Text style={styles.title}>{t('welcomeBack')}</Text>
          <Text style={styles.subtitle}>{t('signInAccount')}</Text>
        </View>

        {/* Form card */}
        <View style={styles.formCard}>
          {/* Phone */}
          <View style={styles.inputWrap}>
            <Ionicons name="call-outline" size={18} color={C.muted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={lang === 'rw' ? 'Nimero ya Telefoni' : 'Phone Number'}
              placeholderTextColor={C.muted}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={v => { setPhone(v); setError(''); }}
            />
          </View>

          {/* Password */}
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color={C.muted} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder={t('password')}
              placeholderTextColor={C.muted}
              secureTextEntry={!showPass}
              value={password}
              onChangeText={v => { setPassword(v); setError(''); }}
            />
            <TouchableOpacity onPress={() => setShowPass(p => !p)} style={styles.eyeBtn}>
              <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={C.muted} />
            </TouchableOpacity>
          </View>

          {error ? (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle-outline" size={14} color="#F87171" />
              <Text style={styles.error}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>{t('signIn')}</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Demo accounts */}
        <View style={styles.demoSection}>
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>
              {lang === 'rw' ? 'Konti za Demo' : 'Demo Accounts'}
            </Text>
            <View style={styles.dividerLine} />
          </View>

          {DEMO_ACCOUNTS.map((a) => (
            <TouchableOpacity
              key={a.role}
              style={styles.demoCard}
              onPress={() => router.replace(a.route as any)}
              activeOpacity={0.8}
            >
              <View style={styles.demoIconWrap}>
                <Ionicons name={a.icon} size={22} color={C.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.demoRole}>
                  {a.role === 'guardian' ? t('guardian') : t('blindUser')}
                </Text>
                <Text style={styles.demoCred}>{a.phone}  ·  {a.password}</Text>
              </View>
              <View style={styles.demoBadge}>
                <Text style={styles.demoBadgeText}>
                  {lang === 'rw' ? 'Injira' : 'Login'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg:            { flex: 1 },
  overlay:       { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10, 8, 20, 0.88)' },
  screen:        { flexGrow: 1, padding: 24, paddingTop: 56, paddingBottom: 40, gap: 20 },

  topRow:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn:       { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  langRow:       { flexDirection: 'row', gap: 8 },
  langBtn:       { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.08)' },
  langBtnActive: { backgroundColor: C.accent, borderColor: C.accent },
  langText:      { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.5)' },
  langTextActive:{ color: '#fff' },

  header:        { alignItems: 'center', gap: 8 },
  logoIcon:      { width: 56, height: 56, borderRadius: 18, backgroundColor: C.accent, justifyContent: 'center', alignItems: 'center' },
  title:         { color: '#fff', fontSize: 26, fontWeight: '800' },
  subtitle:      { color: 'rgba(255,255,255,0.45)', fontSize: 13 },

  formCard:      { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', padding: 20, gap: 12 },
  inputWrap:     { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 14 },
  inputIcon:     { marginRight: 10 },
  input:         { flex: 1, paddingVertical: 14, color: '#fff', fontSize: 15 },
  eyeBtn:        { padding: 8 },
  errorRow:      { flexDirection: 'row', alignItems: 'center', gap: 6 },
  error:         { color: '#F87171', fontSize: 13 },
  button:        { backgroundColor: C.accent, borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  buttonText:    { color: '#fff', fontSize: 16, fontWeight: '700' },

  demoSection:   { gap: 12 },
  dividerRow:    { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dividerLine:   { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.12)' },
  dividerText:   { color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: '600', letterSpacing: 0.6 },
  demoCard:      { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  demoIconWrap:  { width: 46, height: 46, borderRadius: 14, backgroundColor: C.accent + '22', justifyContent: 'center', alignItems: 'center' },
  demoRole:      { color: '#fff', fontSize: 14, fontWeight: '700', marginBottom: 2 },
  demoCred:      { color: 'rgba(255,255,255,0.4)', fontSize: 11 },
  demoBadge:     { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: C.accent + '22' },
  demoBadgeText: { color: C.accent, fontSize: 11, fontWeight: '700' },
});
