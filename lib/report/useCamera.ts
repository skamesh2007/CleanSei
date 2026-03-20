"use client";

import { useEffect, useRef, useState } from "react";
import type { CameraMode, LocationStatus, PhotoData } from "./types";

export function useCamera(locationStatus: LocationStatus) {
  const [cameraMode, setCameraMode] = useState<CameraMode>("idle");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<PhotoData | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => videoRef.current?.play();
    }
  }, [stream]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setStream(s);
      setCameraMode("camera");
    } catch {
      setCameraError("Camera blocked — enable it in browser settings and reload.");
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setCameraMode("idle");
  };

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

  const resetCamera = () => {
    setPhoto(null);
    setCameraMode("idle");
    setCameraError(null);
  };

  return {
    cameraMode,
    cameraError,
    photo,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    takePicture,
    resetCamera,
  };
}