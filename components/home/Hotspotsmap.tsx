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

function makePinSvg(color: string, highlighted = false): string {
  const scale = highlighted ? 1.35 : 1;
  const w = Math.round(28 * scale);
  const h = Math.round(36 * scale);
  const ring = highlighted
    ? `<circle cx="${w / 2}" cy="${h * 0.33}" r="${w * 0.42}" fill="none" stroke="${color}" stroke-width="2.5" opacity="0.35"/>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    ${ring}
    <ellipse cx="${w / 2}" cy="${h - 2}" rx="${w * 0.18}" ry="${h * 0.056}" fill="rgba(0,0,0,0.22)" />
    <path d="M${w / 2} 0C${w * 0.263} 0 ${w * 0.071} ${h * 0.149} ${w * 0.071} ${h * 0.333}c0 ${h * 0.222} ${w * 0.429} ${h * 0.667} ${w * 0.429} ${h * 0.667}S${w * 0.929} ${h * 0.556} ${w * 0.929} ${h * 0.333}C${w * 0.929} ${h * 0.149} ${w * 0.737} 0 ${w / 2} 0Z"
      fill="${color}" stroke="white" stroke-width="${highlighted ? 2.2 : 1.8}" />
    <circle cx="${w / 2}" cy="${h * 0.333}" r="${w * 0.178}" fill="white" opacity="0.92" />
  </svg>`;
}

interface HotspotsMapProps {
  hotspots:    Hotspot[];
  selectedId?: string | null;
  height?:     number;
}

export function HotspotsMap({ hotspots, selectedId, height = 180 }: HotspotsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<any>(null);
  const markersRef   = useRef<Map<string, any>>(new Map());

  // ── Init map ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current as any;
    if (container._leaflet_id) container._leaflet_id = undefined;

    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;

      if (!document.getElementById("leaflet-css")) {
        const link  = document.createElement("link");
        link.id     = "leaflet-css";
        link.rel    = "stylesheet";
        link.href   = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      const el = containerRef.current as any;
      if (el._leaflet_id) el._leaflet_id = undefined;

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
      syncMarkers(map, L, hotspots, null);
    });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.map.remove();
        mapRef.current = null;
      }
      markersRef.current.clear();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Re-sync markers when hotspots list changes ────────────────────────────
  useEffect(() => {
    if (!mapRef.current || hotspots.length === 0) return;
    const { map, L } = mapRef.current;
    syncMarkers(map, L, hotspots, selectedId ?? null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotspots]);

  // ── Fly to + highlight when selectedId changes ────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    const { map, L } = mapRef.current;

    // Refresh all marker icons (highlight selected, normal for rest)
    hotspots.forEach((spot) => {
      const marker = markersRef.current.get(spot.id);
      if (!marker) return;
      const isSelected = spot.id === selectedId;
      const svg  = makePinSvg(getColor(spot.severity), isSelected);
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url  = URL.createObjectURL(blob);
      const size: [number, number] = isSelected ? [38, 49] : [28, 36];
      marker.setIcon(L.icon({
        iconUrl:     url,
        iconSize:    size,
        iconAnchor:  [size[0] / 2, size[1]],
        popupAnchor: [0, -size[1]],
      }));
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    });

    if (!selectedId) return;

    const spot = hotspots.find((h) => h.id === selectedId);
    if (!spot) return;

    const marker = markersRef.current.get(selectedId);

    map.flyTo([spot.latitude, spot.longitude], 16, { duration: 0.6 });

    // Open popup after fly completes
    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 650);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  function syncMarkers(map: any, L: any, spots: Hotspot[], activeId: string | null) {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    const latLngs: [number, number][] = [];

    spots.forEach((spot) => {
      const isSelected = spot.id === activeId;
      const color = getColor(spot.severity);
      const svg   = makePinSvg(color, isSelected);
      const blob  = new Blob([svg], { type: "image/svg+xml" });
      const url   = URL.createObjectURL(blob);
      const size: [number, number] = isSelected ? [38, 49] : [28, 36];

      const icon = L.icon({
        iconUrl:     url,
        iconSize:    size,
        iconAnchor:  [size[0] / 2, size[1]],
        popupAnchor: [0, -size[1]],
      });

      const marker = L.marker([spot.latitude, spot.longitude], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="font-size:12px;font-weight:600;max-width:160px">${spot.title}</div>
           <div style="font-size:11px;color:#6b7280;margin-top:2px">${spot.distance ?? "Nearby"} · ${spot.time ?? ""}</div>`,
          { closeButton: false, offset: [0, -4] }
        );

      markersRef.current.set(spot.id, marker);
      latLngs.push([spot.latitude, spot.longitude]);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    });

    if (latLngs.length === 1) {
      map.setView(latLngs[0], 15);
    } else if (latLngs.length > 1) {
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