import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import ScreenContainer from '../../components/ScreenContainer';
import { COLORS } from '../../constants/colors';
import { useLang } from '../../context/LanguageContext';
import { speak } from '../../services/speechService';

export default function StopScreen() {
  const { t } = useLang();

  useEffect(() => {
    speak(t('navStopped'));
  }, []);

  return (
    <ScreenContainer>
      <Text style={styles.title}>{t('stopped')}</Text>
      <Text style={styles.subtitle}>{t('youAreSafe')}</Text>
      <TouchableOpacity
        onPress={() => router.replace('/(tabs)')}
        style={styles.homeButton}
        accessibilityRole="button"
        accessibilityLabel={t('goHome')}
      >
        <Text style={styles.homeLabel}>{t('goHome')}</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title:      { color: COLORS.text, fontSize: 36, fontWeight: '600', marginBottom: 12 },
  subtitle:   { color: COLORS.muted, fontSize: 18, textAlign: 'center', lineHeight: 28, marginBottom: 48 },
  homeButton: { backgroundColor: COLORS.surface, paddingVertical: 18, paddingHorizontal: 56, borderRadius: 50 },
  homeLabel:  { color: COLORS.text, fontSize: 18, fontWeight: '500', letterSpacing: 1 },
});
