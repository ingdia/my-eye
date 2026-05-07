import React from "react";
import { Text, TouchableOpacity } from "react-native";

type Props = { label: string; onPress: () => void };

export default function BigButton({ label, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ backgroundColor: "#2563EB", padding: 18, borderRadius: 16, alignItems: "center" }}
    >
      <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>{label}</Text>
    </TouchableOpacity>
  );
}
