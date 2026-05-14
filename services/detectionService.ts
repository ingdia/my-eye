import { Lang } from '../i18n/translations';
import { API_BASE, getToken } from './api';

export type DangerLevel = 'safe' | 'warning' | 'danger';
export type Direction   = 'left' | 'center' | 'right';

export interface DetectedObject {
  name:           string;
  isMoving:       boolean;
  distanceMeters: number;
  direction:      Direction;
  dangerLevel:    DangerLevel;
}

export interface DetectionResult {
  objects:   DetectedObject[];
  summary:   string;
  topDanger: DangerLevel;
}

let _lang: Lang = 'en';
export function setDetectionLanguage(lang: Lang): void { _lang = lang; }

const RW_NAMES: Record<string, string> = {
  chair: 'intebe', car: 'imodoka', person: 'umuntu', table: 'ameza',
  dog: 'imbwa', stairs: 'inzitiro', bench: 'intebe ndefu', bus: 'bisi',
  pole: 'inkingi', bicycle: 'igare', 'trash can': 'agasanduku',
  truck: 'kamyo', motorcycle: 'moto', cat: 'injangwe', step: 'intambwe',
};

function formatDistance(meters: number): string {
  if (_lang === 'rw') {
    if (meters < 1) return 'munsi ya metero imwe';
    return `metero ${meters < 10 ? meters.toFixed(1) : Math.round(meters)}`;
  }
  if (meters < 1) return 'less than 1 meter';
  return `${meters < 10 ? meters.toFixed(1) : Math.round(meters)} meters`;
}

export function buildVoiceSummary(objects: DetectedObject[]): string {
  if (objects.length === 0) return _lang === 'rw' ? 'Inzira irahari' : 'Path is clear';
  return objects.slice(0, 3).map((obj) => {
    const dist   = formatDistance(obj.distanceMeters);
    const moving = obj.isMoving ? (_lang === 'rw' ? 'igenda ' : 'moving ') : '';
    if (_lang === 'rw') {
      const name = RW_NAMES[obj.name] ?? obj.name;
      const dir  = obj.direction === 'center' ? 'imbere yawe' : obj.direction === 'left' ? 'ibumoso bwawe' : 'iburyo bwawe';
      return `${moving}${name}, ${dist} ${dir}`;
    }
    const dir = obj.direction === 'center' ? 'ahead' : `on your ${obj.direction}`;
    return `${moving}${obj.name}, ${dist} ${dir}`;
  }).join('. ');
}

/**
 * Sends a camera frame to /detect using React Native's native FormData.
 * React Native FormData accepts { uri, name, type } directly — no blob needed.
 * This is the only reliable way to upload files from Expo camera.
 */
export async function detectFromFrame(imageUri: string): Promise<DetectionResult> {
  const token = await getToken();

  const form = new FormData();
  form.append('file', {
    uri:  imageUri,
    name: 'frame.jpg',
    type: 'image/jpeg',
  } as any);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(`${API_BASE}/detect`, {
      method:  'POST',
      signal:  controller.signal,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: form,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }));
      throw new Error(err.detail ?? `HTTP ${res.status}`);
    }
    return await res.json() as DetectionResult;
  } finally {
    clearTimeout(timer);
  }
}
