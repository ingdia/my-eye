import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';

import VoiceIndicator from '../../components/VoiceIndicator';
import { COLORS } from '../../constants/colors';
import { useLang } from '../../context/LanguageContext';
import { speak } from '../../services/speechService';
import { startListening, stopListening } from '../../services/voiceService';

export default function HomeScreen() {
  const { t, lang } = useLang();
  const [listening, setListening] = useState(false);
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulse    = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Tell the blind user exactly what to do as soon as screen opens
    speak(
      lang === 'rw'
        ? 'E-mboni irategurwa. Kanda rimwe gutangira kugenda. Kanda inshuro eshatu kugira impanuka.'
        : 'E-mboni ready. Tap once to start navigation. Triple tap for emergency.',
      true
    );

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  function handleTap() {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      const count = tapCount.current;
      tapCount.current = 0;
      if      (count === 1) handleSingleTap();
      else if (count === 2) handleDoubleTap();
      else if (count >= 3)  handleTripleTap();
    }, 400);
  }

  function handleSingleTap() {
    speak(lang === 'rw' ? 'Gutangira kuyobora' : 'Starting navigation', true);
    router.push('/(tabs)/navigation');
  }

  function handleDoubleTap() {
    if (listening) {
      stopListening();
      setListening(false);
      speak(lang === 'rw' ? 'Kumva byarangiye' : 'Done listening');
    } else {
      setListening(true);
      speak(lang === 'rw' ? 'Ndumva. Vuga gutangira.' : 'Listening. Say start to begin.');
      startListening((result) => {
        setListening(false);
        const lower = result.toLowerCase();
        if (lower.includes('start') || lower.includes('tangira')) {
          handleSingleTap();
        } else if (lower.includes('emergency') || lower.includes('impanuka')) {
          handleTripleTap();
        } else {
          speak(lang === 'rw' ? 'Vuga gutangira cyangwa impanuka.' : 'Say start or emergency.');
        }
      });
    }
  }

  function handleTripleTap() {
    speak(lang === 'rw' ? 'Impanuka. Komera.' : 'Emergency activated. Stay calm.', true);
    router.push('/(tabs)/emergency');
  }

  return (
    <TouchableOpacity
      style={styles.screen}
      onPress={handleTap}
      activeOpacity={1}
      accessibilityRole="button"
      accessibilityLabel={
        lang === 'rw'
          ? 'Kanda rimwe gutangira. Kanda inshuro eshatu kugira impanuka.'
          : 'Tap once to start. Triple tap for emergency.'
      }
    >
      {/* Pulsing circle — visual cue for sighted helpers */}
      <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulse }] }]} />

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
  },
  pulseRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: COLORS.accent + '33',
  },
});
