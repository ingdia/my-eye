import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';

type Props = { message: string; level?: 'warning' | 'danger' };

export default function AlertBox({ message, level = 'warning' }: Props) {
  const borderColor = level === 'danger' ? COLORS.danger : COLORS.warning;

  return (
    <View style={[styles.box, { borderLeftColor: borderColor }]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderLeftWidth: 3,
    borderRadius: 12,
    padding: 18,
  },
  text: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '500',
  },
});
