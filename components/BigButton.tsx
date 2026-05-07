import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';

type Props = {
  title: string;
  onPress: () => void;
  color?: string;
};

export default function BigButton({ title, onPress, color = COLORS.button }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor: color }]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <Text style={styles.label}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 260,
    height: 260,
    borderRadius: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: COLORS.buttonText,
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});
