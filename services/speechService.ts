import * as Speech from 'expo-speech';
import { Lang } from '../i18n/translations';

let lastSpoken = '';
let lastSpokenTime = 0;
let consecutiveClearCount = 0;
let currentLang: Lang = 'en';

// French is used for Kinyarwanda — closest supported TTS language
const TTS_LANG: Record<Lang, string> = {
  en: 'en-US',
  rw: 'fr-FR',
};

export function setLanguage(lang: Lang): void {
  currentLang = lang;
}

export function speak(text: string, urgent = false): void {
  const now = Date.now();

  const clearKey = currentLang === 'rw' ? 'Inzira irahari' : 'Path is clear';
  if (text === clearKey) {
    consecutiveClearCount++;
    if (consecutiveClearCount > 1) return; // silent after first clear
  } else {
    consecutiveClearCount = 0;
  }

  const isDuplicate = text === lastSpoken && now - lastSpokenTime < 7000;
  if (isDuplicate && !urgent) return;

  lastSpoken = text;
  lastSpokenTime = now;

  setTimeout(() => {
    Speech.speak(text, {
      language: TTS_LANG[currentLang],
      rate:  urgent ? 1.1 : 0.75, // danger = fast, warning = medium/calm
      pitch: urgent ? 1.2 : 1.0,
    });
  }, urgent ? 0 : 100);
}

export function resetSpeech(): void {
  lastSpoken = '';
  lastSpokenTime = 0;
  consecutiveClearCount = 0;
  Speech.stop();
}
