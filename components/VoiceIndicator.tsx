import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';

export default function VoiceIndicator({ active }: { active: boolean }) {
  const ring1 = useRef(new Animated.Value(1)).current;
  const ring2 = useRef(new Animated.Value(1)).current;
  const ring1Opacity = useRef(new Animated.Value(0.6)).current;
  const ring2Opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (active) {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(ring1, { toValue: 1.8, duration: 800, useNativeDriver: true }),
            Animated.timing(ring1, { toValue: 1,   duration: 0,   useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(ring1Opacity, { toValue: 0, duration: 800, useNativeDriver: true }),
            Animated.timing(ring1Opacity, { toValue: 0.6, duration: 0, useNativeDriver: true }),
          ]),
        ])
      ).start();
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.delay(300),
            Animated.timing(ring2, { toValue: 2.2, duration: 800, useNativeDriver: true }),
            Animated.timing(ring2, { toValue: 1,   duration: 0,   useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.delay(300),
            Animated.timing(ring2Opacity, { toValue: 0, duration: 800, useNativeDriver: true }),
            Animated.timing(ring2Opacity, { toValue: 0.3, duration: 0, useNativeDriver: true }),
          ]),
        ])
      ).start();
    } else {
      ring1.stopAnimation();
      ring2.stopAnimation();
      ring1.setValue(1);
      ring2.setValue(1);
      ring1Opacity.setValue(0.6);
      ring2Opacity.setValue(0.3);
    }
  }, [active]);

  const color = active ? COLORS.safe : COLORS.muted;

  return (
    <View style={styles.wrapper}>
      {/* Ripple rings — only visible when active */}
      {active && (
        <>
          <Animated.View style={[styles.ring, {
            borderColor: COLORS.safe,
            opacity: ring1Opacity,
            transform: [{ scale: ring1 }],
          }]} />
          <Animated.View style={[styles.ring, {
            borderColor: COLORS.safe,
            opacity: ring2Opacity,
            transform: [{ scale: ring2 }],
          }]} />
        </>
      )}

      {/* Mic circle */}
      <View style={[styles.circle, {
        borderColor: color,
        backgroundColor: active ? COLORS.safe + '18' : 'transparent',
      }]}>
        <Ionicons name={active ? 'mic' : 'mic-outline'} size={32} color={color} />
      </View>

      <Text style={[styles.label, { color }]}>
        {active ? 'Listening...' : 'Double tap to speak'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center', gap: 10 },
  ring: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: { fontSize: 14, fontWeight: '600' },
});
