import React from "react";
import { View } from "react-native";

type Props = { active: boolean };

export default function VoiceIndicator({ active }: Props) {
  return (
    <View
      style={{
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: active ? "#22C55E" : "#475569",
      }}
    />
  );
}
