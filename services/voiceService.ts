// TODO: replace with a real voice recognition library e.g. @react-native-voice/voice
let _callback: ((text: string) => void) | null = null;

export function startListening(onResult: (text: string) => void): void {
  _callback = onResult;
  console.log('startListening — wire up real voice recognition here');
}

export function stopListening(): void {
  _callback = null;
  console.log('stopListening');
}

// Call this from your real voice recognition result handler
export function onVoiceResult(text: string): void {
  if (_callback) _callback(text);
}
