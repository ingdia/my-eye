import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@emboni_location_consent';

export async function saveLocationConsent(allowed: boolean): Promise<void> {
  await AsyncStorage.setItem(KEY, allowed ? 'true' : 'false');
}

export async function getLocationConsent(): Promise<boolean | null> {
  const val = await AsyncStorage.getItem(KEY);
  if (val === null) return null;   // never answered yet
  return val === 'true';
}
