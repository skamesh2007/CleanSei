"use client";

import { useEffect, useRef } from "react";
import type { Hotspot } from "@/lib/home/type";

const SEVERITY_COLOR: Record<string, string> = {
  high:   "#ef4444",
  medium: "#f97316",
  low:    "#22c55e",
};

function getColor(severity: string) {
  return SEVERITY_COLOR[severity] ?? SEVERITY_COLOR.low;
}

function makePinSvg(color: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
    <ellipse cx="14" cy="34" rx="5" ry="2" fill="rgba(0,0,0,0.20)" />
    <path d="M14 0C7.373 0 2 5.373 2 12c0 8 12 24 12 24S26 20 26 12C26 5.373 20.627 0 14 0Z"
      fill="${color}" stroke="white" stroke-width="1.8" />
    <circle cx="14" cy="12" r="5" fill="white" opacity="0.9" />
  </svg>`;
}

interface HotspotsMapProps {
  hotspots: Hotspot[];
  height?:  number;
}

export function HotspotsMap({ hotspots, height = 180 }: HotspotsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<any>(null);
  const markersRef   = useRef<any[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // ── Guard: if Leaflet already marked this container, destroy first ──────
    // Handles React StrictMode double-invocation in development.
    const container = containerRef.current as any;
    if (container._leaflet_id) {
      container._leaflet_id = undefined;
    }

    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;

      // Inject CSS once
      if (!document.getElementById("leaflet-css")) {
        const link  = document.createElement("link");
        link.id     = "leaflet-css";
        link.rel    = "stylesheet";
        link.href   = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Double-check container still clean after async gap
      const el = containerRef.current as any;
      if (el._leaflet_id) {
        el._leaflet_id = undefined;
      }

      const map = L.map(containerRef.current!, {
        zoomControl:        false,
        attributionControl: false,
        dragging:           true,
        scrollWheelZoom:    false,
        doubleClickZoom:    false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = { map, L };

      // Initial markers
      syncMarkers(map, L, hotspots);
    });

    return () => {
      cancelled = true;
      // Remove map and clear the leaflet container ID so it can re-init
      if (mapRef.current) {
        mapRef.current.map.remove();
        mapRef.current = null;
      }
      markersRef.current = [];
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Sync markers when hotspots update ─────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || hotspots.length === 0) return;
    const { map, L } = mapRef.current;
    syncMarkers(map, L, hotspots);
  }, [hotspots]);

  function syncMarkers(map: any, L: any, spots: Hotspot[]) {
    // Clear old
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const latLngs: [number, number][] = [];

    spots.forEach((spot) => {
      const color = getColor(spot.severity);
      const svg   = makePinSvg(color);
      const blob  = new Blob([svg], { type: "image/svg+xml" });
      const url   = URL.createObjectURL(blob);

      const icon = L.icon({
        iconUrl:     url,
        iconSize:    [28, 36],
        iconAnchor:  [14, 36],
        popupAnchor: [0, -36],
      });

      const marker = L.marker([spot.latitude, spot.longitude], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="font-size:12px;font-weight:600;max-width:160px">${spot.title}</div>
           <div style="font-size:11px;color:#6b7280;margin-top:2px">${spot.distance ?? "Nearby"} · ${spot.time ?? ""}</div>`,
          { closeButton: false, offset: [0, -4] }
        );

      markersRef.current.push(marker);
      latLngs.push([spot.latitude, spot.longitude]);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    });

    if (latLngs.length === 1) {
      map.setView(latLngs[0], 15);
    } else {
      map.fitBounds(L.latLngBounds(latLngs), { padding: [32, 32] });
    }
  }

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className="w-full [&_.leaflet-tile]:grayscale-[0.4] [&_.leaflet-tile]:contrast-[1.1]"
    />
  );
}