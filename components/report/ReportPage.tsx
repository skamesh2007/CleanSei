"use client";

import { useState } from "react";
import { useLocation } from "@/lib/report/useLocation";
import { useCamera } from "@/lib/report/useCamera";
import { useReport } from "@/lib/report/useReport";
import { LocationBar } from "./LocationBar";
import { IdlePrompt } from "./Idleprompt";
import { CameraView } from "./CameraView";
import { PhotoPreview } from "./PhotoPreview";
import { SuccessView } from "./SuccessView";
import type { WasteType } from "@/lib/report/types";

export function ReportPage() {
  const [note, setNote] = useState("");
  const [selectedType, setSelectedType] = useState<WasteType | null>(null);

  const { locationStatus, locationLabel } = useLocation();
  const { loading, submitted, pointsEarned, submitReport, resetReport } = useReport();
  const {
    cameraMode,
    cameraError,
    photo,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    takePicture,
    resetCamera,
  } = useCamera(locationStatus);

  const handleReset = () => {
    resetCamera();
    resetReport();
    setNote("");
    setSelectedType(null);
  };

  const handleTypeSelect = (type: WasteType) => {
    setSelectedType(type);
    if (!note) setNote(type);
  };

  if (submitted) {
    return <SuccessView pointsEarned={pointsEarned} onReset={handleReset} />;
  }

  return (
    <div className="space-y-4">
      <LocationBar label={locationLabel} status={locationStatus} />

      {cameraMode === "idle" && (
        <IdlePrompt onStart={startCamera} error={cameraError} />
      )}

      {cameraMode === "camera" && (
        <CameraView
          videoRef={videoRef}
          canvasRef={canvasRef}
          onCapture={takePicture}
          onClose={stopCamera}
        />
      )}

      {cameraMode === "preview" && photo && (
        <PhotoPreview
          photo={photo}
          note={note}
          selectedType={selectedType}
          loading={loading}
          onNoteChange={setNote}
          onTypeSelect={handleTypeSelect}
          onRetake={handleReset}
          onSubmit={() => submitReport(photo, note)}
        />
      )}
    </div>
  );
}