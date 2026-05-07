import { Vibration } from 'react-native';

export function vibrateObstacle(): void {
  Vibration.vibrate([0, 200, 100, 200]);
}

export function vibrateDanger(): void {
  Vibration.vibrate([0, 500, 100, 500, 100, 500]);
}

export function vibrateLeft(): void {
  Vibration.vibrate([0, 100, 50, 100]);
}

export function vibrateRight(): void {
  Vibration.vibrate([0, 50, 50, 300]);
}
