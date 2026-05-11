import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
      <Tabs.Screen name="index"     />
      <Tabs.Screen name="navigation"/>
      <Tabs.Screen name="stop"      />
      <Tabs.Screen name="emergency" />
      <Tabs.Screen name="settings"  />
    </Tabs>
  );
}
