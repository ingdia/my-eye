// ─── Detection Service ────────────────────────────────────────────────────────
// FRONTEND MOCK — simulates realistic AI detections for UI development.
// The backend team will replace `detectFromFrame` with a real API call.
// All types, danger logic, voice summaries stay exactly the same.
// ─────────────────────────────────────────────────────────────────────────────

export type DangerLevel = 'safe' | 'warning' | 'danger';

export type Direction = 'left' | 'center' | 'right';

export interface DetectedObject {
  name: string;          // e.g. "car", "chair", "person"
  isMoving: boolean;     // heuristic: vehicles, animals, people = potentially moving
  distanceMeters: number;// estimated from bounding box area
  direction: Direction;  // left / center / right based on bounding box x position
  dangerLevel: DangerLevel;
}

export interface DetectionResult {
  objects: DetectedObject[];
  summary: string;       // human-readable voice string
  topDanger: DangerLevel;
}

// Objects we consider potentially moving
const MOVING_OBJECTS = new Set([
  'car', 'truck', 'bus', 'motorcycle', 'bicycle', 'person', 'dog', 'cat',
  'vehicle', 'van', 'scooter', 'animal',
]);

// Objects that are always dangerous regardless of distance
const HIGH_DANGER_OBJECTS = new Set([
  'car', 'truck', 'bus', 'motorcycle', 'vehicle', 'van',
]);

// Objects that are medium danger
const MEDIUM_DANGER_OBJECTS = new Set([
  'bicycle', 'scooter', 'person', 'dog', 'cat', 'animal',
  'chair', 'table', 'bench', 'pole', 'fire hydrant', 'trash can',
  'staircase', 'stairs', 'step',
]);

/**
 * Estimates distance in meters from the bounding box area.
 * Larger bounding box = closer object.
 * This is a heuristic — replace with depth sensor data if available.
 */
function estimateDistance(bbox: { x: number; y: number; width: number; height: number }): number {
  const area = bbox.width * bbox.height; // 0.0 – 1.0 normalized
  if (area > 0.4) return 0.5;
  if (area > 0.2) return 1.0;
  if (area > 0.1) return 2.0;
  if (area > 0.05) return 3.5;
  if (area > 0.02) return 6.0;
  if (area > 0.01) return 10.0;
  return 15.0;
}

function getDirection(bboxX: number, bboxWidth: number): Direction {
  const center = bboxX + bboxWidth / 2;
  if (center < 0.35) return 'left';
  if (center > 0.65) return 'right';
  return 'center';
}

function getDangerLevel(name: string, distance: number, isMoving: boolean): DangerLevel {
  const lower = name.toLowerCase();
  if (HIGH_DANGER_OBJECTS.has(lower)) {
    if (distance <= 5) return 'danger';
    return 'warning';
  }
  if (MEDIUM_DANGER_OBJECTS.has(lower)) {
    if (distance <= 1.5) return 'danger';
    if (distance <= 4) return 'warning';
  }
  if (distance <= 1) return 'warning';
  return 'safe';
}

import { Lang } from '../i18n/translations';

let _lang: Lang = 'en';
export function setDetectionLanguage(lang: Lang): void { _lang = lang; }

// Kinyarwanda object name translations
const RW_NAMES: Record<string, string> = {
  chair:      'intebe',
  car:        'imodoka',
  person:     'umuntu',
  table:      'ameza',
  dog:        'imbwa',
  stairs:     'inzitiro',
  bench:      'intebe ndefu',
  bus:        'bisi',
  pole:       'inkingi',
  bicycle:    'igare',
  'trash can':'agasanduku',
  truck:      'kamyo',
  motorcycle: 'moto',
  cat:        'injangwe',
  step:       'intambwe',
};

function formatDistance(meters: number, lang: Lang): string {
  if (lang === 'rw') {
    if (meters < 1) return 'munsi ya metero imwe';
    if (meters < 10) return `metero ${meters.toFixed(1)}`;
    return `metero ${Math.round(meters)}`;
  }
  if (meters < 1) return 'less than 1 meter';
  if (meters < 10) return `${meters.toFixed(1)} meters`;
  return `${Math.round(meters)} meters`;
}

function buildVoiceSummary(objects: DetectedObject[]): string {
  const lang = _lang;
  if (objects.length === 0) return lang === 'rw' ? 'Inzira irahari' : 'Path is clear';

  const sorted = [...objects].sort((a, b) => {
    const dangerOrder = { danger: 0, warning: 1, safe: 2 };
    if (dangerOrder[a.dangerLevel] !== dangerOrder[b.dangerLevel])
      return dangerOrder[a.dangerLevel] - dangerOrder[b.dangerLevel];
    return a.distanceMeters - b.distanceMeters;
  });

  return sorted
    .slice(0, 3)
    .map((obj) => {
      const dist = formatDistance(obj.distanceMeters, lang);
      if (lang === 'rw') {
        const name   = RW_NAMES[obj.name] ?? obj.name;
        const moving = obj.isMoving ? 'igenda ' : '';
        const dir    = obj.direction === 'center' ? 'imbere yawe' : obj.direction === 'left' ? 'ibumoso bwawe' : 'iburyo bwawe';
        return `${moving}${name}, ${dist} ${dir}`;
      }
      const moving = obj.isMoving ? 'moving ' : '';
      const dir    = obj.direction === 'center' ? 'ahead' : `on your ${obj.direction}`;
      return `${moving}${obj.name}, ${dist} ${dir}`;
    })
    .join('. ');
}

// ─── Demo scenarios — cycles through DANGER → WARNING → SAFE clearly ────────
const MOCK_SCENARIOS: DetectedObject[][] = [

  // 1. DANGER — moving car very close
  [
    { name: 'car',    isMoving: true,  distanceMeters: 2.0, direction: 'center', dangerLevel: 'danger' },
  ],

  // 2. DANGER — dog right in front
  [
    { name: 'dog',    isMoving: true,  distanceMeters: 1.0, direction: 'center', dangerLevel: 'danger' },
  ],

  // 3. DANGER — stairs ahead + bus on left
  [
    { name: 'stairs', isMoving: false, distanceMeters: 1.5, direction: 'center', dangerLevel: 'danger' },
    { name: 'bus',    isMoving: true,  distanceMeters: 4.0, direction: 'left',   dangerLevel: 'danger' },
  ],

  // 4. WARNING — chair nearby
  [
    { name: 'chair',  isMoving: false, distanceMeters: 2.5, direction: 'center', dangerLevel: 'warning' },
  ],

  // 5. WARNING — person on right + bicycle on left
  [
    { name: 'person',  isMoving: true,  distanceMeters: 3.0, direction: 'right', dangerLevel: 'warning' },
    { name: 'bicycle', isMoving: true,  distanceMeters: 3.5, direction: 'left',  dangerLevel: 'warning' },
  ],

  // 6. WARNING — table on right
  [
    { name: 'table',  isMoving: false, distanceMeters: 2.0, direction: 'right',  dangerLevel: 'warning' },
  ],

  // 7. SAFE — path clear
  [],

  // 8. SAFE — path clear
  [],

];

let mockIndex = 0;

export async function detectFromFrame(
  _base64Image: string
): Promise<DetectionResult> {
  await new Promise((r) => setTimeout(r, 600));

  const objects = MOCK_SCENARIOS[mockIndex % MOCK_SCENARIOS.length];
  mockIndex++;

  const topDanger: DangerLevel =
    objects.some((o) => o.dangerLevel === 'danger')  ? 'danger'  :
    objects.some((o) => o.dangerLevel === 'warning') ? 'warning' : 'safe';

  return {
    objects,
    summary:   buildVoiceSummary(objects),
    topDanger,
  };
}
