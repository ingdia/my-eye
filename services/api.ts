import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE = 'http://192.168.0.104:8000';

const TOKEN_KEY = '@emboni_token';
const USER_KEY  = '@emboni_user';

export async function saveToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function saveUser(user: any): Promise<void> {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getUser(): Promise<any | null> {
  const val = await AsyncStorage.getItem(USER_KEY);
  return val ? JSON.parse(val) : null;
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}

export async function apiFetch(path: string, options: RequestInit = {}): Promise<any> {
  const token = await getToken();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {}),
      },
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({ detail: 'Unknown error' }));
      const error: any = new Error(errBody.detail ?? 'Request failed');
      error.status = res.status;
      throw error;
    }
    return res.json();
  } catch (e: any) {
    if (e.name === 'AbortError') {
      throw new Error('Cannot reach server. Make sure you are on the same WiFi network.');
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
