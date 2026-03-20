"use client";

import { useEffect, useState } from "react";
import type { LocationStatus } from "./types";

export function useLocation() {
  const [locationStatus, setLocationStatus] = useState<LocationStatus>({
    state: "pending",
  });

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
        setLocationStatus(
          err.code === 1 ? { state: "denied" } : { state: "unavailable" }
        )
    );
  }, []);

  const locationLabel =
    locationStatus.state === "granted"
      ? `${locationStatus.lat.toFixed(4)}, ${locationStatus.lng.toFixed(4)}`
      : locationStatus.state === "denied"
      ? "Location access blocked"
      : locationStatus.state === "unavailable"
      ? "Location unavailable"
      : "Acquiring location…";

  return { locationStatus, locationLabel };
}