import { Stack } from 'expo-router';
import { View } from 'react-native';
import { LanguageProvider, useLang } from '../context/LanguageContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

function AppStack() {
  const { ready: themeReady, colors } = useTheme();
  const { ready: langReady }          = useLang();

  // Show blank screen in background color until storage is loaded
  // This prevents a flash of wrong theme/language
  if (!themeReady || !langReady) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)"     />
      <Stack.Screen name="(guardian)" />
      <Stack.Screen name="(tabs)"     />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AppStack />
      </ThemeProvider>
    </LanguageProvider>
  );
}
