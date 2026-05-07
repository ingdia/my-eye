import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import VoiceIndicator from '../../components/VoiceIndicator';
import { COLORS } from '../../constants/colors';
import { speak } from '../../services/speechService';
import { startListening, stopListening } from '../../services/voiceService';

export default function HomeScreen() {
  const [listening, setListening] = useState(false);
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    speak('E-mboni is ready. Tap once to start. Tap twice to record.');
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
    speak('Starting navigation');
    router.push('/(tabs)/navigation');
  }

  function handleDoubleTap() {
    if (listening) {
      stopListening();
      setListening(false);
      speak('Done listening');
    } else {
      setListening(true);
      speak('Listening. Say start to begin.');
      startListening((result) => {
        setListening(false);
        if (result.toLowerCase().includes('start')) handleSingleTap();
        else speak('Say start to begin, or tap the screen.');
      });
    }
  }

  return (
    <TouchableOpacity
      style={styles.screen}
      onPress={handleTap}
      activeOpacity={1}
      accessibilityRole="button"
      accessibilityLabel="Tap once to start. Tap twice to use voice."
    >
      <Text style={styles.appName}>E-mboni</Text>
      <Text style={styles.tagline}>Your mobility companion</Text>

      <Text style={styles.hint}>tap anywhere to begin</Text>

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
  appName: {
    color: COLORS.text,
    fontSize: 42,
    fontWeight: '600',
    letterSpacing: 2,
  },
  tagline: {
    color: COLORS.muted,
    fontSize: 15,
    marginBottom: 40,
  },
  hint: {
    color: COLORS.muted,
    fontSize: 14,
    marginBottom: 32,
  },
});
