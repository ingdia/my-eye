import React from "react";
import { ScrollView } from "react-native";

type Props = { children: React.ReactNode };

export default function ScreenContainer({ children }: Props) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0B1020", padding: 20 }}>
      {children}
    </ScrollView>
  );
}
