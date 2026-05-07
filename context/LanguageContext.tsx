import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Lang, TranslationKeys, translations } from '../i18n/translations';

const STORAGE_KEY = '@emboni_lang';

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKeys) => string;
  ready: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key) => translations.en[key],
  ready: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');
  const [ready, setReady]    = useState(false);

  // Load saved language on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === 'en' || saved === 'rw') setLangState(saved);
      setReady(true);
    });
  }, []);

  // Save whenever language changes
  useEffect(() => {
    if (ready) AsyncStorage.setItem(STORAGE_KEY, lang);
  }, [lang, ready]);

  function setLang(l: Lang) {
    setLangState(l);
  }

  const t = (key: TranslationKeys) => translations[lang][key] ?? translations.en[key];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, ready }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
