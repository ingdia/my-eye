import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, ImageBackground, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  const logoScale   = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const tagOpacity  = useRef(new Animated.Value(0)).current;
  const dotOpacity  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Logo pops in
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // App name fades in
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Tagline fades in
      Animated.timing(tagOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Loading dots appear
      Animated.timing(dotOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Hold for a moment
      Animated.delay(900),
    ]).start(() => {
      router.replace('/(auth)');
    });
  }, []);

  return (
    <ImageBackground
      source={require('../assets/images/auth-bg.jpg')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.screen}>
        {/* Animated logo icon */}
        <Animated.View style={[styles.iconWrap, {
          opacity: logoOpacity,
          transform: [{ scale: logoScale }],
        }]}>
          <View style={styles.iconOuter}>
            <View style={styles.iconInner}>
              <Ionicons name="eye" size={44} color="#fff" />
            </View>
          </View>
        </Animated.View>

        {/* App name */}
        <Animated.Text style={[styles.appName, { opacity: textOpacity }]}>
          E-mboni
        </Animated.Text>

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, { opacity: tagOpacity }]}>
          AI Mobility Assistant
        </Animated.Text>

        {/* Loading dots */}
        <Animated.View style={[styles.dotsRow, { opacity: dotOpacity }]}>
          <LoadingDots />
        </Animated.View>
      </View>

      {/* Bottom version */}
      <Animated.Text style={[styles.version, { opacity: tagOpacity }]}>
        v1.0.0
      </Animated.Text>
    </ImageBackground>
  );
}

function LoadingDots() {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.delay(600),
        ])
      );

    Animated.parallel([
      animate(dot1, 0),
      animate(dot2, 200),
      animate(dot3, 400),
    ]).start();
  }, []);

  return (
    <View style={styles.dots}>
      {[dot1, dot2, dot3].map((dot, i) => (
        <Animated.View key={i} style={[styles.dot, { opacity: dot }]} />
      ))}
    </View>
  );
}

const ACCENT = '#A855F7';

const styles = StyleSheet.create({
  bg:       { flex: 1 },
  overlay:  { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8, 6, 18, 0.9)' },
  screen:   { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },

  iconWrap:  { marginBottom: 8 },
  iconOuter: { width: 110, height: 110, borderRadius: 36, backgroundColor: ACCENT + '22', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: ACCENT + '44' },
  iconInner: { width: 80, height: 80, borderRadius: 26, backgroundColor: ACCENT, justifyContent: 'center', alignItems: 'center' },

  appName:  { color: '#fff', fontSize: 48, fontWeight: '800', letterSpacing: 4 },
  tagline:  { color: 'rgba(255,255,255,0.45)', fontSize: 14, letterSpacing: 1 },

  dotsRow:  { marginTop: 40 },
  dots:     { flexDirection: 'row', gap: 8 },
  dot:      { width: 8, height: 8, borderRadius: 4, backgroundColor: ACCENT },

  version:  { position: 'absolute', bottom: 40, alignSelf: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 12 },
});
