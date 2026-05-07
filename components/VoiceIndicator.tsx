import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';

export default function VoiceIndicator({ active }: { active: boolean }) {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.circle, { borderColor: active ? COLORS.safe : COLORS.muted }]}>
        <Text style={[styles.icon, { color: active ? COLORS.safe : COLORS.muted }]}>🎤</Text>
      </View>
      <Text style={[styles.label, { color: active ? COLORS.safe : COLORS.muted }]}>
        {active ? 'Listening...' : 'Tap to speak'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 10,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
