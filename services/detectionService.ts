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

function formatDistance(meters: number): string {
  if (meters < 1) return 'less than 1 meter';
  if (meters < 10) return `${meters.toFixed(1)} meters`;
  return `${Math.round(meters)} meters`;
}

function buildVoiceSummary(objects: DetectedObject[]): string {
  if (objects.length === 0) return 'Path is clear';

  // Sort by danger then distance
  const sorted = [...objects].sort((a, b) => {
    const dangerOrder = { danger: 0, warning: 1, safe: 2 };
    if (dangerOrder[a.dangerLevel] !== dangerOrder[b.dangerLevel])
      return dangerOrder[a.dangerLevel] - dangerOrder[b.dangerLevel];
    return a.distanceMeters - b.distanceMeters;
  });

  return sorted
    .slice(0, 3) // speak max 3 objects to avoid overload
    .map((obj) => {
      const moving = obj.isMoving ? 'moving ' : '';
      const dir = obj.direction === 'center' ? 'ahead' : `on your ${obj.direction}`;
      return `${moving}${obj.name}, ${formatDistance(obj.distanceMeters)} ${dir}`;
    })
    .join('. ');
}

// ─── Mock scenarios — realistic detections for UI testing ───────────────────
const MOCK_SCENARIOS: DetectedObject[][] = [
  [], // path clear
  [
    { name: 'chair', isMoving: false, distanceMeters: 1.5, direction: 'center', dangerLevel: 'danger' },
  ],
  [
    { name: 'car', isMoving: true, distanceMeters: 3.0, direction: 'left', dangerLevel: 'danger' },
    { name: 'person', isMoving: true, distanceMeters: 5.0, direction: 'center', dangerLevel: 'warning' },
  ],
  [
    { name: 'table', isMoving: false, distanceMeters: 2.0, direction: 'right', dangerLevel: 'warning' },
  ],
  [
    { name: 'dog', isMoving: true, distanceMeters: 1.0, direction: 'center', dangerLevel: 'danger' },
  ],
  [
    { name: 'stairs', isMoving: false, distanceMeters: 1.5, direction: 'center', dangerLevel: 'danger' },
    { name: 'bench', isMoving: false, distanceMeters: 4.0, direction: 'right', dangerLevel: 'warning' },
  ],
  [
    { name: 'bus', isMoving: true, distanceMeters: 6.0, direction: 'left', dangerLevel: 'danger' },
  ],
  [], // path clear
  [
    { name: 'pole', isMoving: false, distanceMeters: 1.0, direction: 'center', dangerLevel: 'danger' },
  ],
  [
    { name: 'bicycle', isMoving: true, distanceMeters: 2.5, direction: 'right', dangerLevel: 'warning' },
    { name: 'trash can', isMoving: false, distanceMeters: 3.5, direction: 'left', dangerLevel: 'warning' },
  ],
];

let mockIndex = 0;

/**
 * MOCK: Simulates AI detection results for frontend development.
 * Backend team will replace this function body with a real API call.
 * The function signature and return type must stay the same.
 */
export async function detectFromFrame(
  _base64Image: string
): Promise<DetectionResult> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 600));

  const objects = MOCK_SCENARIOS[mockIndex % MOCK_SCENARIOS.length];
  mockIndex++;

  const topDanger: DangerLevel =
    objects.some((o) => o.dangerLevel === 'danger')
      ? 'danger'
      : objects.some((o) => o.dangerLevel === 'warning')
      ? 'warning'
      : 'safe';

  return {
    objects,
    summary: buildVoiceSummary(objects),
    topDanger,
  };
}
