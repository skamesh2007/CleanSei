"use client";

import { ThemeToggle } from "@/components/theme-toggle";

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
  Upload,
  Loader2,
  X,
  AlertCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Constants ────────────────────────────────────────────────────────────────

const wasteTypes = [
  "Plastic", "Paper", "Glass", "Metal", "Organic", "Electronic", "Other",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Report() {
  const [cameraMode, setCameraMode]   = useState<CameraMode>("idle");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [stream, setStream]           = useState<MediaStream | null>(null);
  const [photo, setPhoto]             = useState<PhotoData | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>({ state: "pending" });
  const [note, setNote]               = useState("");
  const [loading, setLoading]         = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);

  const videoRef     = useRef<HTMLVideoElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Geolocation — runs once on mount ────────────────────────────────────────
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocationStatus({ state: "unavailable" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationStatus({
          state: "granted",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        // code 1 = PERMISSION_DENIED, 2 = POSITION_UNAVAILABLE, 3 = TIMEOUT
        setLocationStatus(err.code === 1 ? { state: "denied" } : { state: "unavailable" });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // ── FIX 1: Attach stream to <video> via useEffect, not setTimeout ───────────
  // This fires whenever `stream` changes AND the video element is in the DOM.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) return;

    video.srcObject = stream;

    // FIX 2: Only play after metadata is loaded (ensures width/height are known)
    const onLoaded = () => video.play().catch(() => {});
    video.addEventListener("loadedmetadata", onLoaded);

    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [stream, cameraMode]); // cameraMode dep ensures video is rendered before this fires

  // ── Cleanup stream on unmount ───────────────────────────────────────────────
  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Start camera ────────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 } },
        audio: false,
      });
      setStream(s);
      setCameraMode("camera"); // video element renders → useEffect attaches stream
    } catch (err: unknown) {
      // FIX 3: Specific error messages per error type
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setCameraError(
            "Camera permission denied. Please allow camera access in your browser settings, then reload."
          );
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          setCameraError("No camera found on this device. Use 'Upload Photo' instead.");
        } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
          setCameraError(
            "Camera is already in use by another app. Close it and try again."
          );
        } else if (err.name === "OverconstrainedError") {
          // Retry without facingMode constraint
          try {
            const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            setStream(s);
            setCameraMode("camera");
            return;
          } catch {
            setCameraError("Could not start camera. Try uploading a photo instead.");
          }
        } else {
          setCameraError(`Camera error: ${err.message}`);
        }
      } else {
        setCameraError("Could not access camera. Use 'Upload Photo' instead.");
      }
    }
  }, []);

  // ── Stop camera ─────────────────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setCameraMode("idle");
  }, [stream]);

  // ── Capture frame ───────────────────────────────────────────────────────────
  const takePicture = useCallback(() => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // FIX 4: Guard against 0-size frame (video not ready)
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setCameraError("Camera not ready yet. Please wait a moment and try again.");
      return;
    }

    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    const uri = canvas.toDataURL("image/jpeg", 0.85);

    // Stop stream before switching view
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
  }, [stream, locationStatus]);

  // ── File upload ─────────────────────────────────────────────────────────────
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      // Revoke any previous object URL to avoid memory leak
      if (photo?.uri.startsWith("blob:")) URL.revokeObjectURL(photo.uri);

      const uri = URL.createObjectURL(file);
      const loc = locationStatus.state === "granted" ? locationStatus : null;
      setPhoto({
        uri,
        lat: loc?.lat ?? null,
        lng: loc?.lng ?? null,
        timestamp: new Date().toISOString(),
      });
      setCameraMode("preview");
      // Reset file input so the same file can be re-selected
      e.target.value = "";
    },
    [photo, locationStatus]
  );

  // ── Submit report ────────────────────────────────────────────────────────────
  const submitReport = useCallback(async () => {
    if (!photo) return;
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1500));
      const points = Math.floor(Math.random() * 41) + 10;
      setPointsEarned(points);
      setSubmitted(true);
    } catch {
      alert("Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [photo]);

  // ── Reset all ───────────────────────────────────────────────────────────────
  const resetAll = useCallback(() => {
    if (photo?.uri.startsWith("blob:")) URL.revokeObjectURL(photo.uri);
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setPhoto(null);
    setNote("");
    setSubmitted(false);
    setPointsEarned(0);
    setCameraMode("idle");
    setCameraError(null);
  }, [photo, stream]);

  // ── Location label helper ────────────────────────────────────────────────────
  const locationLabel = (() => {
    switch (locationStatus.state) {
      case "pending":   return "Getting location…";
      case "granted":   return `${locationStatus.lat.toFixed(4)}, ${locationStatus.lng.toFixed(4)}`;
      case "denied":    return "Location permission denied";
      case "unavailable": return "Location unavailable";
    }
  })();

  const locationReady = locationStatus.state === "granted";

  // ── Shared header ────────────────────────────────────────────────────────────
  const Header = () => (
    <div className="bg-white dark:bg-card px-6 pt-8 pb-5 shadow-sm sticky top-0 z-10 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-foreground">
          Report Waste
        </h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center">
            <Camera size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>
    </div>
  );

  // ── Success screen ───────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-white dark:bg-background transition-colors duration-300">
        <div className="max-w-2xl mx-auto">
          <Header />
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-90px)] px-6 animate-in fade-in zoom-in-95 duration-500">
            <CheckCircle size={80} className="text-green-500 dark:text-green-400" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-foreground mt-4">
              Report Submitted!
            </h2>
            <p className="text-xl text-green-600 dark:text-green-400 font-semibold mt-2">
              +{pointsEarned} Points Earned 🎉
            </p>
            <p className="text-gray-600 dark:text-muted-foreground text-center mt-2 max-w-xs">
              Thank you for helping keep our environment clean!
            </p>
            <Button
              onClick={resetAll}
              className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3 text-lg font-semibold"
            >
              Report More Waste
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background transition-colors duration-300">
      <div className="max-w-2xl mx-auto pb-16">
        <Header />

        <div className="px-6 pt-6 space-y-5">

          {/* ── Location status pill ──────────────────────────────────────── */}
          <div className={`flex items-center gap-2 rounded-full px-4 py-2 w-fit border transition-colors ${
            locationReady
              ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
              : locationStatus.state === "denied"
              ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
              : "bg-gray-50 dark:bg-muted border-gray-200 dark:border-border"
          }`}>
            <MapPin
              size={14}
              className={
                locationReady ? "text-green-500" :
                locationStatus.state === "denied" ? "text-red-500" :
                "text-gray-400 animate-pulse"
              }
            />
            <span className={`text-sm font-medium ${
              locationReady ? "text-green-700 dark:text-green-400" :
              locationStatus.state === "denied" ? "text-red-600 dark:text-red-400" :
              "text-gray-600 dark:text-muted-foreground"
            }`}>
              {locationLabel}
            </span>
          </div>

          {/* ── HTTPS warning (shown only if not localhost/https) ─────────── */}
          {typeof window !== "undefined" &&
            window.location.protocol !== "https:" &&
            window.location.hostname !== "localhost" &&
            window.location.hostname !== "127.0.0.1" && (
            <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
              <AlertCircle size={16} className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-700 dark:text-amber-300">
                <strong>Camera & Location require HTTPS.</strong> Run your dev server on{" "}
                <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 rounded">localhost</code>{" "}
                or deploy to HTTPS for these features to work.
              </p>
            </div>
          )}

          {/* ── Idle: camera / upload card ───────────────────────────────── */}
          {cameraMode === "idle" && (
            <Card className="rounded-2xl border border-dashed border-gray-300 dark:border-border bg-gray-50 dark:bg-card animate-in fade-in duration-300">
              <CardContent className="p-8 flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center">
                  <Camera size={32} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-800 dark:text-foreground text-lg">
                    Capture Waste Photo
                  </p>
                  <p className="text-gray-500 dark:text-muted-foreground text-sm mt-0.5">
                    Use your camera or upload an existing photo
                  </p>
                </div>

                {/* Camera error banner */}
                {cameraError && (
                  <div className="flex items-start gap-2 w-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl px-4 py-3">
                    <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600 dark:text-red-400">{cameraError}</p>
                  </div>
                )}

                <div className="flex gap-3 w-full">
                  <Button
                    onClick={startCamera}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3 font-semibold"
                  >
                    <Camera size={18} /> Open Camera
                  </Button>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2 rounded-full py-3 font-semibold border-gray-300 dark:border-border text-gray-700 dark:text-foreground hover:bg-gray-100 dark:hover:bg-muted"
                  >
                    <Upload size={18} /> Upload Photo
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </CardContent>
            </Card>
          )}

          {/* ── Live camera feed ─────────────────────────────────────────── */}
          {cameraMode === "camera" && (
            <div className="relative rounded-2xl overflow-hidden bg-black animate-in fade-in duration-300">
              {/* FIX: video must be in DOM before useEffect can attach srcObject */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full aspect-[4/3] object-cover"
              />
              {/* Hidden canvas used only for snapshot */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Location overlay */}
              <div className="absolute top-3 left-3 bg-black/70 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                <MapPin size={13} className={locationReady ? "text-green-400" : "text-gray-400"} />
                <span className="text-white text-xs">{locationLabel}</span>
              </div>

              {/* Close */}
              <button
                onClick={stopCamera}
                className="absolute top-3 right-3 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center hover:bg-black/90 transition-colors"
              >
                <X size={16} className="text-white" />
              </button>

              {/* Capture button */}
              <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2">
                <button
                  onClick={takePicture}
                  className="w-20 h-20 rounded-full bg-white border-[5px] border-white/60 shadow-xl hover:scale-95 active:scale-90 transition-transform"
                  aria-label="Take photo"
                />
                <span className="text-white text-sm font-semibold drop-shadow">
                  Tap to Capture
                </span>
              </div>
            </div>
          )}

          {/* ── Preview + submit form ────────────────────────────────────── */}
          {cameraMode === "preview" && photo && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-400">

              {/* Photo preview */}
              <div className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-muted">
                <img
                  src={photo.uri}
                  alt="Captured waste"
                  className="w-full aspect-[4/3] object-cover"
                />

                {/* Metadata overlay */}
                <div className="absolute top-3 left-3 right-3 bg-black/70 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className={photo.lat ? "text-green-400" : "text-gray-400"} />
                    <span className="text-white text-xs">
                      {photo.lat
                        ? `${photo.lat.toFixed(4)}, ${photo.lng?.toFixed(4)}`
                        : "Location not captured"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} className="text-blue-400" />
                    <span className="text-white text-xs">
                      {new Date(photo.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                {/* Retake shortcut */}
                <button
                  onClick={resetAll}
                  className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 text-white rounded-full px-3 py-1.5 text-xs font-semibold flex items-center gap-1"
                >
                  <RefreshCcw size={12} /> Retake
                </button>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-foreground mb-1.5">
                  Description{" "}
                  <span className="text-gray-400 dark:text-muted-foreground font-normal">(Optional)</span>
                </label>
                <Textarea
                  placeholder="e.g., Plastic bottles near the bin…"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="rounded-xl border-gray-300 dark:border-border bg-white dark:bg-muted text-gray-800 dark:text-foreground placeholder:text-gray-400 dark:placeholder:text-muted-foreground resize-none"
                  rows={3}
                />
              </div>

              {/* Quick select chips */}
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-foreground mb-2">
                  Quick Select:
                </p>
                <div className="flex flex-wrap gap-2">
                  {wasteTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setNote((prev) => (prev === type ? "" : type))}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        note === type
                          ? "bg-blue-600 dark:bg-blue-500 text-white"
                          : "bg-gray-100 dark:bg-muted text-gray-700 dark:text-foreground hover:bg-gray-200 dark:hover:bg-accent"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <Button
                  onClick={resetAll}
                  variant="outline"
                  className="flex-1 rounded-full py-3 text-base font-semibold border-gray-400 dark:border-border text-gray-600 dark:text-foreground hover:bg-gray-100 dark:hover:bg-muted"
                >
                  Retake
                </Button>
                <Button
                  onClick={submitReport}
                  disabled={loading}
                  className="flex-1 rounded-full py-3 text-base font-semibold bg-green-600 hover:bg-green-700 text-white disabled:opacity-70"
                >
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin mr-2" /> Submitting…</>
                  ) : (
                    "Submit Report"
                  )}
                </Button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}