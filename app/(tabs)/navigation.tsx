import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '../../constants/colors';
import { useLang } from '../../context/LanguageContext';
import { DetectionResult, buildVoiceSummary, detectFromFrame, setDetectionLanguage } from '../../services/detectionService';
import { speak } from '../../services/speechService';
import { vibrateDanger, vibrateLeft, vibrateObstacle, vibrateRight } from '../../services/vibrationService';
import { apiFetch } from '../../services/api';

const STATUS_COLOR = { safe: COLORS.safe, warning: COLORS.warning, danger: COLORS.danger, scanning: COLORS.muted };

export default function NavigationScreen() {
  const { t, lang }  = useLang();
  const [permission, requestPermission] = useCameraPermissions();
  const [result,   setResult]   = useState<DetectionResult | null>(null);
  const [offline,  setOffline]  = useState(false);
  const [errCount, setErrCount] = useState(0);

  const cameraRef    = useRef<CameraView>(null);
  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const isProcessing = useRef(false);

  useEffect(() => { setDetectionLanguage(lang); }, [lang]);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  useEffect(() => {
    if (!permission?.granted) return;
    speak(t('navStarted'));
    // Start real session on backend so guardian sees "Scanning"
    apiFetch('/session/start', { method: 'POST' }).catch(() => {});
    startLoop();
    return () => {
      stopLoop();
      // End session when screen unmounts
      apiFetch('/session/end', { method: 'POST' }).catch(() => {});
    };
  }, [permission?.granted]);

  function startLoop() {
    intervalRef.current = setInterval(async () => {
      if (isProcessing.current || !cameraRef.current) return;
      isProcessing.current = true;
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.4,
          skipProcessing: true,
        });
        if (!photo?.uri) return;

        const detection = await detectFromFrame(photo.uri);
        setResult(detection);
        setOffline(false);
        setErrCount(0);

        if (detection.summary) speak(detection.summary, detection.topDanger === 'danger');

        if (detection.topDanger === 'danger') {
          vibrateDanger();
        } else if (detection.topDanger === 'warning') {
          const top = detection.objects[0];
          if (top?.direction === 'left')       vibrateLeft();
          else if (top?.direction === 'right') vibrateRight();
          else                                 vibrateObstacle();
        }
      } catch {
        setErrCount(c => {
          const next = c + 1;
          if (next >= 3) setOffline(true);
          return next;
        });
      } finally {
        isProcessing.current = false;
      }
    }, 3500);
  }

  function stopLoop() {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  async function stopNavigation() {
    stopLoop();
    speak(t('navStopped'), true);
    try { await apiFetch('/session/end', { method: 'POST' }); } catch {}
    router.replace('/(tabs)/stop');
  }

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permText}>{t('cameraNeeded')}</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permButton}>
          <Text style={styles.permButtonText}>{t('allowCamera')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const topDanger = result?.topDanger ?? 'scanning';
  const dotColor  = STATUS_COLOR[topDanger];

  return (
    <View style={styles.screen}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />

      <View style={styles.overlay}>

        {offline && (
          <View style={styles.offlinePill}>
            <Ionicons name="cloud-offline-outline" size={14} color="#FBBF24" />
            <Text style={styles.offlineText}>Server unreachable — check WiFi</Text>
          </View>
        )}

        <View style={[styles.dot, { backgroundColor: dotColor }]} />

        <Text style={[styles.summary, { color: dotColor }]}>
          {result?.summary ?? t('scanning')}
        </Text>

        {result && result.objects.length > 0 && (
          <View style={styles.list}>
            {result.objects.slice(0, 3).map((obj, i) => {
              const moving = obj.isMoving ? (lang === 'rw' ? 'igenda ' : 'moving ') : '';
              const dist   = obj.distanceMeters < 1 ? t('veryClose') : `${obj.distanceMeters.toFixed(1)} m`;
              const dir    = obj.direction === 'center' ? t('ahead') : obj.direction === 'left' ? t('onYourLeft') : t('onYourRight');
              const dc     = STATUS_COLOR[obj.dangerLevel];
              return (
                <View key={i} style={[styles.row, { borderLeftColor: dc, borderLeftWidth: 3 }]}>
                  <Text style={[styles.objName,   { color: dc }]}>{moving}{obj.name}</Text>
                  <Text style={[styles.objDetail, { color: COLORS.muted }]}>{dist}{'  ·  '}{dir}</Text>
                </View>
              );
            })}
          </View>
        )}

        <TouchableOpacity
          style={styles.stopZone}
          onLongPress={stopNavigation}
          delayLongPress={800}
          activeOpacity={1}
          accessibilityRole="button"
          accessibilityLabel={t('holdToStop')}
        >
          <Text style={styles.stopLabel}>{t('holdToStop')}</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:         { flex: 1, backgroundColor: COLORS.background },
  camera:         { ...StyleSheet.absoluteFillObject, opacity: 0.12 },
  overlay:        { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 28, gap: 20 },
  offlinePill:    { position: 'absolute', top: 56, left: 20, right: 20, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FBBF2418', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#FBBF2444' },
  offlineText:    { color: '#FBBF24', fontSize: 12, fontWeight: '600', flex: 1 },
  dot:            { width: 64, height: 64, borderRadius: 32, opacity: 0.9 },
  summary:        { fontSize: 22, fontWeight: '500', textAlign: 'center', lineHeight: 32 },
  list:           { width: '100%', gap: 8 },
  row:            { backgroundColor: COLORS.surface, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  objName:        { fontSize: 16, fontWeight: '600' },
  objDetail:      { fontSize: 13 },
  stopZone:       { position: 'absolute', bottom: 0, left: 0, right: 0, height: 140, justifyContent: 'center', alignItems: 'center' },
  stopLabel:      { color: COLORS.muted, fontSize: 14, letterSpacing: 1 },
  center:         { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', padding: 32 },
  permText:       { color: COLORS.text, fontSize: 18, textAlign: 'center', marginBottom: 24 },
  permButton:     { backgroundColor: COLORS.button, padding: 16, borderRadius: 12 },
  permButtonText: { color: COLORS.buttonText, fontSize: 16, fontWeight: '600' },
});
