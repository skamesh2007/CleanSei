"use client";

import { useState } from "react";
import { useLocation }  from "@/lib/report/useLocation";
import { useCamera }    from "@/lib/report/useCamera";
import { useReport }    from "@/lib/report/useReport";
import { LocationBar }  from "./LocationBar";
import { IdlePrompt }   from "./Idleprompt";
import { CameraView }   from "./CameraView";
import { PhotoPreview } from "./PhotoPreview";
import { SuccessView }  from "./SuccessView";
import type { WasteType,Severity } from "@/lib/report/types";

export function ReportPage() {
  const [note,         setNote]         = useState("");
  const [selectedType, setSelectedType] = useState<WasteType | null>(null);
  const [severity,     setSeverity]     = useState<Severity>("medium");

  const { locationStatus, locationLabel } = useLocation();

  const {
    step,
    loading,
    submitted,
    pointsEarned,
    error,
    submitReport,
    resetReport,
  } = useReport();

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
    setSeverity("medium");
  };

  const handleTypeSelect = (type: WasteType) => {
    setSelectedType(type);
    if (!note) setNote(type);
  };

  const handleSubmit = () => {
    if (!photo || !selectedType) return;
    submitReport(photo, note, selectedType, severity, locationLabel);
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
          severity={severity}
          loading={loading}
          step={step}
          error={error}
          onNoteChange={setNote}
          onTypeSelect={handleTypeSelect}
          onSeverity={setSeverity}
          onRetake={handleReset}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}