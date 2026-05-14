import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import { apiFetch } from '../../services/api';
import { speak } from '../../services/speechService';
import { vibrateDanger } from '../../services/vibrationService';
import { useLang } from '../../context/LanguageContext';

const BG     = '#0D0005';
const DANGER = '#F87171';

export default function EmergencyScreen() {
  const { lang } = useLang();
  const pulse      = useRef(new Animated.Value(1)).current;
  const tapCount   = useRef(0);
  const tapTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [guardianPhone, setGuardianPhone] = useState<string | null>(null);

  useEffect(() => {
    vibrateDanger();
    speak(
      lang === 'rw'
        ? 'Impanuka. Kanda rimwe guhamagara umurezi wawe. Shikama guhagarika.'
        : 'Emergency active. Tap once to call your guardian. Hold to cancel.',
      true
    );

    // Load real guardian phone from backend
    apiFetch('/auth/me').then((data: any) => {
      if (data?.emergency_phone) setGuardianPhone(data.emergency_phone);
    }).catch(() => {});

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
    const phone = guardianPhone;
    if (!phone) {
      speak(lang === 'rw' ? 'Nimero ntiboneka.' : 'Guardian phone not found.', true);
      return;
    }
    speak(lang === 'rw' ? 'Guhamagara umurezi.' : 'Calling your guardian now.', true);
    Linking.openURL(`tel:${phone}`);
  }

  function cancelEmergency() {
    speak(lang === 'rw' ? 'Impanuka ihagaritswe.' : 'Emergency cancelled. Going back.', true);
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
      accessibilityLabel={
        lang === 'rw'
          ? 'Kanda guhamagara umurezi. Shikama guhagarika impanuka.'
          : 'Tap to call guardian. Hold to cancel emergency.'
      }
    >
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
