import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import { speak } from '../../services/speechService';
import { vibrateDanger } from '../../services/vibrationService';

const BG     = '#0D0005';
const DANGER = '#F87171';

export default function EmergencyScreen() {
  const pulse  = useRef(new Animated.Value(1)).current;
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    vibrateDanger();

    // Voice tells the blind user exactly what to do
    speak('Emergency active. Tap once to call your guardian. Hold to cancel.', true);

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.15, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  function handleTap() {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      const count = tapCount.current;
      tapCount.current = 0;
      if (count === 1) callGuardian();
    }, 400);
  }

  function callGuardian() {
    speak('Calling your guardian now.', true);
    Linking.openURL('tel:+250711000001');
  }

  function cancelEmergency() {
    speak('Emergency cancelled. Going back.', true);
    router.replace('/(tabs)');
  }

  return (
    <TouchableOpacity
      style={styles.screen}
      onPress={handleTap}
      onLongPress={cancelEmergency}
      delayLongPress={1500}
      activeOpacity={1}
      accessibilityRole="button"
      accessibilityLabel="Tap to call guardian. Hold to cancel emergency."
    >
      {/* Pulsing red ring — visual only */}
      <Animated.View style={[styles.ring, { transform: [{ scale: pulse }] }]} />
      <View style={styles.innerDot} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen:   { flex: 1, backgroundColor: BG, justifyContent: 'center', alignItems: 'center' },
  ring:     { width: 200, height: 200, borderRadius: 100, borderWidth: 3, borderColor: DANGER + '66', position: 'absolute' },
  innerDot: { width: 80, height: 80, borderRadius: 40, backgroundColor: DANGER + '33', borderWidth: 2, borderColor: DANGER },
});
