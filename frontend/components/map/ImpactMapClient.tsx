"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import type { EapState, HazardEvent, MapAsset } from "@/lib/types";

const SEVERITY_COLOR: Record<EapState, string> = {
  blue: "#2563eb",
  orange: "#f97316",
  red: "#ef4444",
};

const ASSET_COLOR: Record<MapAsset["type"], string> = {
  hospital: "#dc2626",
  shelter: "#059669",
  critical_asset: "#2563eb",
  road: "#64748b",
  bridge: "#0891b2",
};

const BRIDGE_STATUS_COLOR: Record<NonNullable<MapAsset["submersionStatus"]>, string> = {
  normal: "#0891b2",
  inundated: "#f97316",
  submerged: "#ef4444",
};

function markerIcon(color: string, hazardBorder?: boolean) {
  const border = hazardBorder ? "3px dashed #ef4444" : "2px solid white";
  return L.divIcon({
    className: "",
    html: `<div style="background:${color};width:14px;height:14px;border-radius:50%;border:${border};box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

function buildPopup(asset: MapAsset): HTMLElement {
  const root = document.createElement("div");
  root.className = "map-tooltip-card";

  const header = document.createElement("div");
  header.className = "tooltip-header";

  const title = document.createElement("span");
  title.className = "tooltip-title";
  title.textContent = asset.code ? `${asset.name} (${asset.code})` : asset.name;
  header.appendChild(title);

  const badge = document.createElement("span");
  badge.className = "tooltip-badge";
  badge.style.background = asset.verified ? "#d1fae5" : "#fef3c7";
  badge.style.color = asset.verified ? "#047857" : "#b45309";
  badge.textContent = asset.verified ? "Verified asset" : "Scenario assumption";
  header.appendChild(badge);

  root.appendChild(header);

  if (asset.type === "bridge" && asset.submersionStatus) {
    const status = document.createElement("p");
    status.style.fontSize = "0.7rem";
    status.style.fontWeight = "800";
    status.style.color = "#0f172a";
    const statusLabel = asset.submersionStatus === "normal" ? "Normal" : asset.submersionStatus === "inundated" ? "Inundated" : "Submerged";
    status.textContent = `EAP Status: ${statusLabel} | Depth: ${asset.depthMeters}m | Water Velocity: ${asset.velocityMps} m/s`;
    root.appendChild(status);
  } else if (asset.type === "shelter" && asset.accessBlocked) {
    const badge = document.createElement("p");
    badge.style.fontSize = "0.65rem";
    badge.style.fontWeight = "800";
    badge.style.color = "#b91c1c";
    badge.style.textTransform = "uppercase";
    badge.textContent = asset.deployNote ?? "Access Road Blocked - Deploy Amphibious Support";
    root.appendChild(badge);
  } else {
    const priority = document.createElement("p");
    priority.style.fontSize = "0.7rem";
    priority.style.fontWeight = "800";
    priority.style.color = "#0f172a";
    priority.textContent = `Priority ${asset.priority}${asset.blocked ? " · Blocked route" : ""}`;
    root.appendChild(priority);
  }

  const rationale = document.createElement("p");
  rationale.style.fontSize = "0.68rem";
  rationale.style.color = "#475569";
  rationale.style.marginTop = "0.4rem";
  rationale.style.maxWidth = "220px";
  rationale.textContent = asset.rationale;
  root.appendChild(rationale);

  return root;
}

export function ImpactMapClient({
  hazard,
  assets,
  center,
}: {
  hazard: HazardEvent;
  assets: MapAsset[];
  center: [number, number];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center,
      zoom: 12,
      minZoom: 10,
      maxZoom: 16,
      zoomControl: true,
      attributionControl: false,
    });
    mapRef.current = map;
    layerGroupRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      layerGroupRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;
    layerGroup.clearLayers();

    const color = SEVERITY_COLOR[hazard.eapState];
    const floodLayer = L.geoJSON(hazard.floodExtentGeoJson, {
      style: { color, weight: 2, fillColor: color, fillOpacity: 0.32 },
    });
    floodLayer.bindTooltip(
      `${hazard.source.model} flood extent — ${hazard.status}, single-timestamp, not a live feed`,
      { className: "cascade-tooltip-simple", sticky: true }
    );
    floodLayer.addTo(layerGroup);

    assets.forEach((asset) => {
      if (asset.position) {
        const markerColor =
          asset.type === "bridge" && asset.submersionStatus
            ? BRIDGE_STATUS_COLOR[asset.submersionStatus]
            : ASSET_COLOR[asset.type];
        const hazardBorder = asset.type === "shelter" && asset.accessBlocked;
        L.marker(asset.position, { icon: markerIcon(markerColor, hazardBorder) })
          .bindPopup(() => buildPopup(asset))
          .addTo(layerGroup);
      } else if (asset.path) {
        L.polyline(asset.path, {
          color: asset.blocked ? "#dc2626" : ASSET_COLOR[asset.type],
          weight: asset.blocked ? 4 : 3,
          dashArray: asset.blocked ? "8,8" : undefined,
          opacity: 0.85,
        })
          .bindPopup(() => buildPopup(asset))
          .addTo(layerGroup);
      }
    });

    map.setView(center, map.getZoom());
  }, [hazard, assets, center]);

  return <div ref={containerRef} className="map-container h-full w-full" />;
}
