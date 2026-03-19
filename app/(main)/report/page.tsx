"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Camera,
  CheckCircle,
  MapPin,
  Clock,
  RefreshCcw,
  Loader2,
  X,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface PhotoData {
  uri: string;
  lat: number | null;
  lng: number | null;
  timestamp: string;
}

type CameraMode = "idle" | "camera" | "preview";

type LocationStatus =
  | { state: "pending" }
  | { state: "granted"; lat: number; lng: number }
  | { state: "denied" }
  | { state: "unavailable" };

const wasteTypes = ["Plastic", "Paper", "Glass", "Metal", "Organic", "Electronic", "Other"];

export default function Report() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth/login");
  }, [authLoading, user, router]);

  const [cameraMode, setCameraMode] = useState<CameraMode>("idle");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<PhotoData | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>({ state: "pending" });
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ── Location ──
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocationStatus({ state: "unavailable" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocationStatus({
          state: "granted",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      (err) =>
        setLocationStatus(err.code === 1 ? { state: "denied" } : { state: "unavailable" })
    );
  }, []);

  // ── Attach stream ──
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => videoRef.current?.play();
    }
  }, [stream]);

  // ── Camera start ──
  const startCamera = async () => {
    setCameraError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setStream(s);
      setCameraMode("camera");
    } catch {
      setCameraError("Camera blocked — enable it in browser settings and reload");
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setCameraMode("idle");
  };

  // ── Capture ──
  const takePicture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);

    const uri = canvas.toDataURL("image/jpeg");

    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);

    const loc = locationStatus.state === "granted" ? locationStatus : null;

    setPhoto({
      uri,
      lat: loc?.lat ?? null,
      lng: loc?.lng ?? null,
      timestamp: new Date().toISOString(),
    });

    setCameraMode("preview");
  };

  // ── Submit ──
  const submitReport = async () => {
    if (!photo) return;
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1500));
    setPointsEarned(Math.floor(Math.random() * 40) + 10);
    setSubmitted(true);
    setLoading(false);
  };

  const resetAll = () => {
    setPhoto(null);
    setNote("");
    setSubmitted(false);
    setCameraMode("idle");
  };

  const locationLabel =
    locationStatus.state === "granted"
      ? `${locationStatus.lat.toFixed(4)}, ${locationStatus.lng.toFixed(4)}`
      : locationStatus.state === "denied"
      ? "Location blocked — enable in browser"
      : "Getting location...";

  // ── SUCCESS ──
  if (submitted) {
    return (
      <div className="p-6 text-center">
        <CheckCircle size={60} className="text-green-500 mx-auto" />
        <h2 className="text-xl font-bold mt-4">Report Submitted</h2>
        <p className="text-green-600 mt-2">+{pointsEarned} Points</p>
        <Button onClick={resetAll} className="mt-6">Report Again</Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">

      {/* Location */}
      <div className="text-sm text-gray-500 flex items-center gap-2">
        <MapPin size={14} /> {locationLabel}
      </div>

      {/* Idle */}
      {cameraMode === "idle" && (
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <Camera size={40} className="mx-auto text-blue-500" />
            <p>Capture Waste Photo</p>

            {cameraError && (
              <div className="text-red-500 text-sm">{cameraError}</div>
            )}

            <Button onClick={startCamera}>
              Open Camera
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Camera */}
      {cameraMode === "camera" && (
        <div className="relative">
          <video ref={videoRef} className="w-full rounded-xl" />
          <canvas ref={canvasRef} className="hidden" />

          <button onClick={stopCamera} className="absolute top-2 right-2">
            <X />
          </button>

          <button onClick={takePicture} className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full w-16 h-16" />
        </div>
      )}

      {/* Preview */}
      {cameraMode === "preview" && photo && (
        <div className="space-y-4">
          <img src={photo.uri} className="rounded-xl" />

          {!photo.lat && (
            <p className="text-yellow-500 text-xs">
              Location missing — report will still submit
            </p>
          )}

          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add description"
          />

          <div className="flex gap-2 flex-wrap">
            {wasteTypes.map((t) => (
              <button key={t} onClick={() => setNote(t)} className="px-3 py-1 bg-gray-200 rounded-full text-sm">
                {t}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <Button onClick={resetAll} variant="outline">Retake</Button>
            <Button onClick={submitReport} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Submit"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}