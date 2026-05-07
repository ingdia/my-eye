import * as Speech from 'expo-speech';

let lastSpoken = '';
let lastSpokenTime = 0;

export function speak(text: string, urgent = false): void {
  const now = Date.now();
  const isDuplicate = text === lastSpoken && now - lastSpokenTime < 6000;
  if (isDuplicate && !urgent) return;

  lastSpoken = text;
  lastSpokenTime = now;

  // Small delay ensures any previous speech finishes stopping before new one starts
  setTimeout(() => {
    Speech.speak(text, { language: 'en', rate: 0.85, pitch: 1.0 });
  }, urgent ? 0 : 100);
}
