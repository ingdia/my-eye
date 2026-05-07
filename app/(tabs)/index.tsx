import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import VoiceIndicator from '../../components/VoiceIndicator';
import { COLORS } from '../../constants/colors';
import { useLang } from '../../context/LanguageContext';
import { speak } from '../../services/speechService';
import { startListening, stopListening } from '../../services/voiceService';

export default function HomeScreen() {
  const { t } = useLang();
  const [listening, setListening] = useState(false);
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    speak(t('ready'));
  }, []);

  function handleTap() {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      if (tapCount.current === 1) handleSingleTap();
      else handleDoubleTap();
      tapCount.current = 0;
    }, 300);
  }

  function handleSingleTap() {
    speak(t('startingNav'));
    router.push('/(tabs)/navigation');
  }

  function handleDoubleTap() {
    if (listening) {
      stopListening();
      setListening(false);
      speak(t('doneListening'));
    } else {
      setListening(true);
      speak(t('listening'));
      startListening((result) => {
        setListening(false);
        if (result.toLowerCase().includes('start') || result.toLowerCase().includes('tangira')) {
          handleSingleTap();
        } else {
          speak(t('sayStart'));
        }
      });
    }
  }

  return (
    <TouchableOpacity
      style={styles.screen}
      onPress={handleTap}
      activeOpacity={1}
      accessibilityRole="button"
      accessibilityLabel={t('ready')}
    >
      <Text style={styles.appName}>{t('appName')}</Text>
      <Text style={styles.tagline}>{t('tagline')}</Text>
      <Text style={styles.hint}>{t('tapHint')}</Text>
      <VoiceIndicator active={listening} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 32,
  },
  appName:  { color: COLORS.text, fontSize: 42, fontWeight: '600', letterSpacing: 2 },
  tagline:  { color: COLORS.muted, fontSize: 15, marginBottom: 40 },
  hint:     { color: COLORS.muted, fontSize: 14, marginBottom: 32 },
});
