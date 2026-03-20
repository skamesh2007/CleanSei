"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { uploadToCloudinary, CloudinaryUploadError } from "./UploadToCloudinary";
import { submitToFirestore } from "./SubmitToFirestore";
import type { PhotoData, Severity } from "@/lib/report/types";

export type SubmitStep =
  | "idle"
  | "uploading_image"
  | "saving_report"
  | "done";

export interface UseReportReturn {
  step:         SubmitStep;
  loading:      boolean;
  submitted:    boolean;
  pointsEarned: number;
  error:        string | null;
  submitReport: (
    photo:       PhotoData,
    description: string,
    wasteType:   string,
    severity:    Severity,
    locationLabel: string
  ) => Promise<void>;
  resetReport: () => void;
}

export function useReport(): UseReportReturn {
  const { user } = useAuth();

  const [step,         setStep]         = useState<SubmitStep>("idle");
  const [submitted,    setSubmitted]    = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [error,        setError]        = useState<string | null>(null);

  const submitReport = async (
    photo:         PhotoData,
    description:   string,
    wasteType:     string,
    severity:      Severity,
    locationLabel: string
  ) => {
    if (!user) {
      setError("You must be signed in to submit a report.");
      return;
    }

    setError(null);

    try {
      // ── 1. Upload image to Cloudinary ──────────────────────────────────────
      setStep("uploading_image");
      const imageUrl = await uploadToCloudinary(photo.uri, "reports");

      // ── 2. Save report to Firestore ────────────────────────────────────────
      setStep("saving_report");
      const points = Math.floor(Math.random() * 40) + 10;

      await submitToFirestore({
        imageUrl,
        description:   description || wasteType,
        wasteType,
        severity,
        lat:           photo.lat,
        lng:           photo.lng,
        locationLabel,
        uid:           user.uid,
        pointsEarned:  points,
      });

      setPointsEarned(points);
      setStep("done");
      setSubmitted(true);
    } catch (err) {
      const message =
        err instanceof CloudinaryUploadError
          ? `Image upload failed: ${err.message}`
          : err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";

      setError(message);
      setStep("idle");
    }
  };

  const resetReport = () => {
    setSubmitted(false);
    setPointsEarned(0);
    setError(null);
    setStep("idle");
  };

  return {
    step,
    loading:  step === "uploading_image" || step === "saving_report",
    submitted,
    pointsEarned,
    error,
    submitReport,
    resetReport,
  };
}