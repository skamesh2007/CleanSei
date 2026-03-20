"use client";

import { useState } from "react";
import type { PhotoData } from "./types";

export function useReport() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);

  const submitReport = async (photo: PhotoData, note: string) => {
    setLoading(true);
    // TODO: replace with real API call
    await new Promise((res) => setTimeout(res, 1500));
    setPointsEarned(Math.floor(Math.random() * 40) + 10);
    setSubmitted(true);
    setLoading(false);
  };

  const resetReport = () => {
    setSubmitted(false);
    setPointsEarned(0);
  };

  return { loading, submitted, pointsEarned, submitReport, resetReport };
}