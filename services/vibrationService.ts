import { Vibration } from 'react-native';

// warning — low soft buzz
export function vibrateObstacle(): void {
  Vibration.vibrate([0, 80]);
}

export function vibrateLeft(): void {
  Vibration.vibrate([0, 80]);
}

export function vibrateRight(): void {
  Vibration.vibrate([0, 80]);
}

// danger — deep long strong vibration
export function vibrateDanger(): void {
  Vibration.vibrate([0, 800, 200, 800, 200, 800]);
}
