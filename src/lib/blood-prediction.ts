export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export interface PredictionResult {
  bloodGroup: BloodGroup;
  confidence: number;
  agglutination: { antiA: number; antiB: number; antiD: number };
  regions: { x: number; y: number; r: number }[];
  processedAt: string;
}

const GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Deterministic pseudo-prediction from image bytes — replace with real model call later.
export async function predictFromImage(file: File): Promise<PredictionResult> {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let hash = 2166136261;
  const step = Math.max(1, Math.floor(bytes.length / 4096));
  for (let i = 0; i < bytes.length; i += step) {
    hash ^= bytes[i];
    hash = Math.imul(hash, 16777619);
  }
  const seed = Math.abs(hash);
  const group = GROUPS[seed % GROUPS.length];
  const confidence = 0.86 + ((seed % 130) / 1000); // 0.86 - 0.99

  const antiA = group.startsWith("A") || group.startsWith("AB") ? 0.7 + ((seed % 30) / 100) : 0.05 + ((seed % 15) / 100);
  const antiB = group.startsWith("B") || group.startsWith("AB") ? 0.7 + ((seed % 27) / 100) : 0.05 + ((seed % 12) / 100);
  const antiD = group.endsWith("+") ? 0.75 + ((seed % 20) / 100) : 0.05 + ((seed % 10) / 100);

  const regions = Array.from({ length: 3 }, (_, i) => ({
    x: 20 + ((seed >> (i * 3)) % 60),
    y: 20 + ((seed >> (i * 5)) % 60),
    r: 8 + ((seed >> (i * 2)) % 10),
  }));

  // Simulate processing latency
  await new Promise((r) => setTimeout(r, 1400));

  return {
    bloodGroup: group,
    confidence,
    agglutination: { antiA, antiB, antiD },
    regions,
    processedAt: new Date().toISOString(),
  };
}

export interface PatientRecord {
  id: string;
  name: string;
  patientId: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  imageDataUrl: string;
  result: PredictionResult;
  createdAt: string;
}

const KEY = "sbgds.records.v1";

export function loadRecords(): PatientRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveRecord(rec: PatientRecord) {
  const list = loadRecords();
  list.unshift(rec);
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 100)));
}

export function deleteRecord(id: string) {
  const list = loadRecords().filter((r) => r.id !== id);
  localStorage.setItem(KEY, JSON.stringify(list));
}
