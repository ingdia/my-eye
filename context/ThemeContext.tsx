import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { G_DARK, G_LIGHT } from '../constants/colors';

export type Theme = 'dark' | 'light';
export type ThemeColors = typeof G_DARK;

const STORAGE_KEY = '@emboni_theme';

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  toggle: () => void;
  ready: boolean; // true once theme is loaded from storage
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  colors: G_DARK,
  toggle: () => {},
  ready: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [ready, setReady] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark') setTheme(saved);
      setReady(true);
    });
  }, []);

  // Save whenever theme changes (skip first render before load)
  useEffect(() => {
    if (ready) AsyncStorage.setItem(STORAGE_KEY, theme);
  }, [theme, ready]);

  const colors = theme === 'dark' ? G_DARK : G_LIGHT;

  function toggle() {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  }

  return (
    <ThemeContext.Provider value={{ theme, colors, toggle, ready }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
