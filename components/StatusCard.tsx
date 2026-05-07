import React from "react";
import { Text, View } from "react-native";

type Props = { title: string; description: string };

export default function StatusCard({ title, description }: Props) {
  return (
    <View style={{ backgroundColor: "#151B2F", padding: 18, borderRadius: 18 }}>
      <Text style={{ color: "white", fontSize: 18 }}>{title}</Text>
      <Text style={{ color: "#94A3B8", marginTop: 6 }}>{description}</Text>
    </View>
  );
}
