import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { G_DARK } from '../../constants/colors';
import { useLang } from '../../context/LanguageContext';

const C = G_DARK;

export default function RoleSelectScreen() {
  const { t, lang, setLang } = useLang();

  return (
    <ImageBackground
      source={require('../../assets/images/auth-bg.jpg')}
      style={styles.bg}
      resizeMode="cover"
    >
      {/* Dark overlay */}
      <View style={styles.overlay} />

      {/* Content */}
      <View style={styles.screen}>

        {/* Language toggle */}
        <View style={styles.langRow}>
          <TouchableOpacity
            style={[styles.langBtn, lang === 'en' && styles.langBtnActive]}
            onPress={() => setLang('en')}
          >
            <Text style={[styles.langText, lang === 'en' && styles.langTextActive]}>🇬🇧 EN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.langBtn, lang === 'rw' && styles.langBtnActive]}
            onPress={() => setLang('rw')}
          >
            <Text style={[styles.langText, lang === 'rw' && styles.langTextActive]}>🇷🇼 RW</Text>
          </TouchableOpacity>
        </View>

        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoIcon}>
            <Ionicons name="eye" size={36} color="#fff" />
          </View>
          <Text style={styles.logo}>E-mboni</Text>
          <Text style={styles.tagline}>{t('tagline')}</Text>
        </View>

        {/* Cards */}
        <View style={styles.cards}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push('/(auth)/guardian-register')}
            activeOpacity={0.85}
          >
            <View style={[styles.cardIconWrap, { backgroundColor: C.accent + '22' }]}>
              <Ionicons name="shield-checkmark" size={28} color={C.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{t('guardian')}</Text>
              <Text style={styles.cardDesc}>{t('guardianDesc')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.4)" />
          </TouchableOpacity>

          {/* Blind users are registered by their guardian — this card is informational only */}
          <View style={[styles.card, styles.cardMuted]}>
            <View style={[styles.cardIconWrap, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
              <Ionicons name="mic" size={28} color="rgba(255,255,255,0.35)" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: 'rgba(255,255,255,0.4)' }]}>{t('blindUser')}</Text>
              <Text style={[styles.cardDesc, { color: 'rgba(255,255,255,0.3)' }]}>{t('blindUserDesc')}</Text>
            </View>
          </View>
        </View>

        {/* Sign in link */}
        <TouchableOpacity
          style={styles.signInRow}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.signInText}>{t('alreadyAccount')} </Text>
          <Text style={styles.signInLink}>{t('signIn')}</Text>
          <Ionicons name="arrow-forward" size={14} color={C.accent} style={{ marginLeft: 2 }} />
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg:           { flex: 1 },
  overlay:      { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10, 8, 20, 0.82)' },
  screen:       { flex: 1, justifyContent: 'center', padding: 28, gap: 24 },

  langRow:      { position: 'absolute', top: 56, right: 24, flexDirection: 'row', gap: 8 },
  langBtn:      { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.08)' },
  langBtnActive:{ backgroundColor: C.accent, borderColor: C.accent },
  langText:     { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.5)' },
  langTextActive:{ color: '#fff' },

  logoSection:  { alignItems: 'center', gap: 10, marginBottom: 8 },
  logoIcon:     { width: 72, height: 72, borderRadius: 24, backgroundColor: C.accent, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  logo:         { color: '#fff', fontSize: 40, fontWeight: '800', letterSpacing: 3 },
  tagline:      { color: 'rgba(255,255,255,0.5)', fontSize: 14 },

  cards:        { gap: 14 },
  card:         { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 20, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  cardAccent:   { backgroundColor: C.accent, borderColor: C.accent },
  cardMuted:    { opacity: 0.6 },
  cardIconWrap: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  cardTitle:    { color: '#fff', fontSize: 17, fontWeight: '700', marginBottom: 3 },
  cardDesc:     { color: 'rgba(255,255,255,0.5)', fontSize: 12, lineHeight: 18 },

  signInRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  signInText:   { color: 'rgba(255,255,255,0.45)', fontSize: 13 },
  signInLink:   { color: C.accent, fontSize: 13, fontWeight: '700' },
});
