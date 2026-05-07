import { Vibration } from "react-native";

export function vibrate(pattern: number | number[] = 400): void {
  Vibration.vibrate(pattern);
}
