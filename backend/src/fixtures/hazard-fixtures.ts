import type { HazardEvent } from "../types/index.js";
import type { FeatureCollection } from "geojson";

const blueExtentGeoJson: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "extent-blue-1",
      properties: {
        eapState: "blue",
        zone: "Idamalayar Reservoir & Bhoothathankettu Upper Reach",
        inferenceDate: "2026-06-02",
        provenance: "Prithvi-100M-sen1floods11, Sentinel-2 scene S2B_MSIL2A_20260602T045701_Idamalayar",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [76.628, 10.152],
            [76.638, 10.15],
            [76.64, 10.144],
            [76.633, 10.14],
            [76.626, 10.144],
            [76.628, 10.152],
          ],
        ],
      },
    },
  ],
};

const orangeExtentGeoJson: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "extent-orange-1",
      properties: {
        eapState: "orange",
        zone: "Bhoothathankettu Regulator Downstream Spillway Corridor",
        inferenceDate: "2026-07-14",
        provenance: "Prithvi-100M-sen1floods11, Sentinel-2 scene S2A_MSIL2A_20260714T045659_Idamalayar",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [76.618, 10.162],
            [76.642, 10.158],
            [76.648, 10.146],
            [76.64, 10.128],
            [76.622, 10.126],
            [76.61, 10.14],
            [76.612, 10.154],
            [76.618, 10.162],
          ],
        ],
      },
    },
  ],
};

const redExtentGeoJson: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "extent-red-1",
      properties: {
        eapState: "red",
        zone: "Periyar River Basin Downstream Floodplain & Kothamangalam Corridor",
        inferenceDate: "2026-08-09",
        provenance: "Prithvi-100M-sen1floods11, Sentinel-2 scene S2B_MSIL2A_20260809T045701_Idamalayar",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [76.604, 10.17],
            [76.646, 10.164],
            [76.66, 10.148],
            [76.652, 10.118],
            [76.628, 10.102],
            [76.6, 10.108],
            [76.59, 10.132],
            [76.594, 10.156],
            [76.604, 10.17],
          ],
        ],
      },
    },
  ],
};

export const HAZARD_EVENTS: Record<"blue" | "orange" | "red", HazardEvent> = {
  blue: {
    id: "hazard-blue",
    hazard: "flood",
    severity: "blue",
    label: "Blue flood/EAP state — Idamalayar watch scenario",
    severityLabel: "Watch",
    source: "Prithvi-100M-sen1floods11 inference, Sentinel-2 scene S2B_MSIL2A_20260602T045701_Idamalayar, Idamalayar AOI",
    sourceDetail: {
      model: "Prithvi-100M-sen1floods11",
      scene: "Sentinel-2 L2A, single scene",
      sceneId: "S2B_MSIL2A_20260602T045701_Idamalayar",
      sceneDate: "2026-06-02",
      aoi: "Idamalayar Dam – Bhoothathankettu regulator stretch, Periyar river system, Ernakulam district",
    },
    status: "verified-demo",
    confidence: 0.61,
    confidenceLabel: "Moderate — partial cloud cover on scene edge",
    issuedAt: "2026-06-02T05:14:00+05:30",
    affectedZones: ["extent-blue-1"],
    limitations: [
      "single-timestamp inference",
      "not a live feed",
      "cloud-sensitive optical input; not ground-truthed",
    ],
    protocolSource: {
      document: "Idamalayar EAP",
      section: "Alert Level 1 / Blue (Watch) — exact section/clause number not yet verified against the source document",
      status: "agency validation required",
      frameworkBasis: "National definition (CWC, Emergency Action Planning for Dams, 2016): 'Internal Alert for BLUE level emergency (monitor and repair)'",
    },
    floodExtentGeoJson: blueExtentGeoJson,
  },
  orange: {
    id: "hazard-orange",
    hazard: "flood",
    severity: "orange",
    label: "Orange flood/EAP state — Idamalayar controlled-release scenario",
    severityLabel: "Warning",
    source: "Prithvi-100M-sen1floods11 inference, Sentinel-2 scene S2A_MSIL2A_20260714T045659_Idamalayar, Idamalayar AOI",
    sourceDetail: {
      model: "Prithvi-100M-sen1floods11",
      scene: "Sentinel-2 L2A, single scene",
      sceneId: "S2A_MSIL2A_20260714T045659_Idamalayar",
      sceneDate: "2026-07-14",
      aoi: "Idamalayar Dam – Bhoothathankettu regulator stretch, Periyar river system, Ernakulam district",
    },
    status: "verified-demo",
    confidence: 0.74,
    confidenceLabel: "Moderate-high — clear scene over AOI core",
    issuedAt: "2026-07-14T11:42:00+05:30",
    affectedZones: ["extent-orange-1"],
    limitations: [
      "single-timestamp inference",
      "not a live feed",
      "cloud-sensitive optical input; not ground-truthed",
    ],
    protocolSource: {
      document: "Idamalayar EAP",
      section: "Alert Level 2 / Orange (Warning) — exact section/clause number not yet verified against the source document",
      status: "agency validation required",
      frameworkBasis: "National definition (CWC, Emergency Action Planning for Dams, 2016): 'External Alert for ORANGE (prepare to evacuate)'. In Kerala practice an Orange Alert is issued before opening dam shutters, ahead of a Red Alert to the public.",
    },
    floodExtentGeoJson: orangeExtentGeoJson,
  },
  red: {
    id: "hazard-red",
    hazard: "flood",
    severity: "red",
    label: "Red flood/EAP state — Idamalayar large-release scenario",
    severityLabel: "Danger/Emergency",
    source: "Prithvi-100M-sen1floods11 inference, Sentinel-2 scene S2B_MSIL2A_20260809T045701_Idamalayar, Idamalayar AOI",
    sourceDetail: {
      model: "Prithvi-100M-sen1floods11",
      scene: "Sentinel-2 L2A, single scene",
      sceneId: "S2B_MSIL2A_20260809T045701_Idamalayar",
      sceneDate: "2026-08-09",
      aoi: "Idamalayar Dam – Bhoothathankettu regulator stretch, Periyar river system, Ernakulam district",
    },
    status: "verified-demo",
    confidence: 0.68,
    confidenceLabel: "Moderate — scene predates reported peak release",
    issuedAt: "2026-08-09T19:05:00+05:30",
    affectedZones: ["extent-red-1"],
    limitations: [
      "single-timestamp inference",
      "not a live feed",
      "cloud-sensitive optical input; not ground-truthed",
    ],
    protocolSource: {
      document: "Idamalayar EAP",
      section: "Alert Level 3 / Red (Danger/Emergency) — exact section/clause number not yet verified against the source document",
      status: "agency validation required",
      frameworkBasis: "National definition (CWC, Emergency Action Planning for Dams, 2016): 'External Alert for RED (evacuate immediately)'. In Kerala practice, Red Alert is the final public warning, issued after Orange.",
    },
    floodExtentGeoJson: redExtentGeoJson,
  },
};
