import React from "react";
import { Text, View } from "react-native";

type Props = { message: string };

export default function AlertBox({ message }: Props) {
  return (
    <View style={{ backgroundColor: "#7F1D1D", padding: 16, borderRadius: 14 }}>
      <Text style={{ color: "#FCA5A5", fontWeight: "600" }}>{message}</Text>
    </View>
  );
}
