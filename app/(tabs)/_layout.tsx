import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: "#0B1020" }, tabBarActiveTintColor: "#2563EB", tabBarInactiveTintColor: "#94A3B8" }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="navigation" options={{ title: "Navigate" }} />
      <Tabs.Screen name="stop" options={{ title: "Stop" }} />
    </Tabs>
  );
}
