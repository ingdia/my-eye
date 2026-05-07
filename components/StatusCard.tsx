import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';

type Props = { status: 'safe' | 'warning' | 'danger' | 'scanning'; message: string };

export default function StatusCard({ status, message }: Props) {
  const color =
    status === 'safe' ? COLORS.safe :
    status === 'warning' ? COLORS.warning :
    status === 'danger' ? COLORS.danger :
    COLORS.muted;

  return (
    <View style={styles.card}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.message, { color }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', gap: 14 },
  dot: { width: 52, height: 52, borderRadius: 26, opacity: 0.85 },
  message: { fontSize: 22, fontWeight: '500', textAlign: 'center' },
});
