import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '../../constants/colors';
import { DetectionResult, detectFromFrame } from '../../services/detectionService';
import { speak } from '../../services/speechService';
import { vibrateDanger, vibrateLeft, vibrateObstacle, vibrateRight } from '../../services/vibrationService';

const STATUS_COLOR = { safe: COLORS.safe, warning: COLORS.warning, danger: COLORS.danger, scanning: COLORS.muted };

export default function NavigationScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [result, setResult] = useState<DetectionResult | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isProcessing = useRef(false);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  useEffect(() => {
    if (!permission?.granted) return;
    speak('Navigation started.');
    startLoop();
    return stopLoop;
  }, [permission?.granted]);

  function startLoop() {
    intervalRef.current = setInterval(async () => {
      if (isProcessing.current || !cameraRef.current) return;
      isProcessing.current = true;
      try {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true, quality: 0.4, skipProcessing: true,
        });
        if (!photo?.base64) return;
        const detection = await detectFromFrame(photo.base64);
        setResult(detection);
        speak(detection.summary, detection.topDanger === 'danger');
        if (detection.topDanger === 'danger') vibrateDanger();
        else if (detection.topDanger === 'warning') {
          const top = detection.objects[0];
          if (top?.direction === 'left') vibrateLeft();
          else if (top?.direction === 'right') vibrateRight();
          else vibrateObstacle();
        }
      } catch (e) {
        console.warn('Detection error:', e);
      } finally {
        isProcessing.current = false;
      }
    }, 2500);
  }

  function stopLoop() {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  function stopNavigation() {
    stopLoop();
    speak('Navigation stopped. Stay safe.');
    router.replace('/(tabs)/stop');
  }

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permText}>Camera access is needed to detect obstacles.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permButton}>
          <Text style={styles.permButtonText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const topDanger = result?.topDanger ?? 'scanning';
  const dotColor = STATUS_COLOR[topDanger];

  return (
    <View style={styles.screen}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />

      <View style={styles.overlay}>
        {/* Soft status dot */}
        <View style={[styles.dot, { backgroundColor: dotColor }]} />

        {/* Summary */}
        <Text style={[styles.summary, { color: dotColor }]}>
          {result?.summary ?? 'Scanning...'}
        </Text>

        {/* Object rows — calm, readable */}
        {result && result.objects.length > 0 && (
          <View style={styles.list}>
            {result.objects.slice(0, 3).map((obj, i) => (
              <View key={i} style={styles.row}>
                <Text style={styles.objName}>{obj.name}</Text>
                <Text style={styles.objDetail}>
                  {obj.distanceMeters < 1 ? 'very close' : `${obj.distanceMeters.toFixed(1)} m`}
                  {'  ·  '}
                  {obj.direction === 'center' ? 'ahead' : obj.direction}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Soft stop button */}
        <TouchableOpacity
          onLongPress={stopNavigation}
          delayLongPress={800}
          style={styles.stopButton}
          accessibilityRole="button"
          accessibilityLabel="Hold to stop navigation"
        >
          <Text style={styles.stopLabel}>hold to stop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  camera: { ...StyleSheet.absoluteFillObject, opacity: 0.1 },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 20,
  },
  dot: {
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.85,
  },
  summary: {
    fontSize: 22,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 32,
  },
  list: { width: '100%', gap: 8 },
  row: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  objName: { color: COLORS.text, fontSize: 16, fontWeight: '500' },
  objDetail: { color: COLORS.muted, fontSize: 14 },
  stopButton: {
    marginTop: 24,
    backgroundColor: COLORS.stopButton,
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 50,
  },
  stopLabel: { color: COLORS.muted, fontSize: 16, letterSpacing: 1 },
  center: {
    flex: 1, backgroundColor: COLORS.background,
    justifyContent: 'center', alignItems: 'center', padding: 32,
  },
  permText: { color: COLORS.text, fontSize: 18, textAlign: 'center', marginBottom: 24 },
  permButton: { backgroundColor: COLORS.button, padding: 16, borderRadius: 12 },
  permButtonText: { color: COLORS.buttonText, fontSize: 16, fontWeight: '600' },
});
