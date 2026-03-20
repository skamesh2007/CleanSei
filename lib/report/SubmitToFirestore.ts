
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";   
import type { WasteReport, Severity, WasteType } from "@/lib/report/types";

export interface SubmitReportPayload {
  imageUrl:    string;
  description: string;
  wasteType:   WasteType;
  severity:    Severity;
  lat:         number | null;
  lng:         number | null;
  locationLabel: string;
  uid:         string;
  pointsEarned: number;
}

export async function submitToFirestore(
  payload: SubmitReportPayload
): Promise<string> {
  const report: Omit<WasteReport, "timestamp"> & { timestamp: ReturnType<typeof serverTimestamp> } = {
    images:       [payload.imageUrl],
    description:  payload.description,
    wasteType:    payload.wasteType,
    severity:     payload.severity,
    status:       "pending",
    location: {
      lat:   payload.lat,
      lng:   payload.lng,
      label: payload.locationLabel,
    },
    reportedBy:   payload.uid,
    pointsEarned: payload.pointsEarned,
    timestamp:    serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "reports"), report);
  return docRef.id;
}