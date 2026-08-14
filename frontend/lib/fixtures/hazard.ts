import type { EapState, HazardEvent } from "@/lib/types";

// Approximate demo coordinates around the Idamalayar Dam / Bhoothathankettu
// regulator stretch of the Periyar river system, Ernakulam district, Kerala.
// Not surveyed geodata — scenario shapes only, sized to illustrate increasing
// flood extent across EAP states.

const blueExtent: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { eapState: "blue" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [76.628, 10.152],
            [76.638, 10.150],
            [76.640, 10.144],
            [76.633, 10.140],
            [76.626, 10.144],
            [76.628, 10.152],
          ],
        ],
      },
    },
  ],
};

const orangeExtent: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { eapState: "orange" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [76.618, 10.162],
            [76.642, 10.158],
            [76.648, 10.146],
            [76.640, 10.128],
            [76.622, 10.126],
            [76.610, 10.140],
            [76.612, 10.154],
            [76.618, 10.162],
          ],
        ],
      },
    },
  ],
};

const redExtent: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { eapState: "red" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [76.604, 10.170],
            [76.646, 10.164],
            [76.660, 10.148],
            [76.652, 10.118],
            [76.628, 10.102],
            [76.600, 10.108],
            [76.590, 10.132],
            [76.594, 10.156],
            [76.604, 10.170],
          ],
        ],
      },
    },
  ],
};

const EXTENT_BY_STATE: Record<EapState, GeoJSON.FeatureCollection> = {
  blue: blueExtent,
  orange: orangeExtent,
  red: redExtent,
};

const SEVERITY_LABEL: Record<EapState, HazardEvent["severityLabel"]> = {
  blue: "Watch",
  orange: "Warning",
  red: "Danger/Emergency",
};

const CONFIDENCE_BY_STATE: Record<EapState, number> = {
  blue: 0.61,
  orange: 0.74,
  red: 0.68,
};

const CONFIDENCE_LABEL_BY_STATE: Record<EapState, string> = {
  blue: "Moderate — partial cloud cover on scene edge",
  orange: "Moderate-high — clear scene over AOI core",
  red: "Moderate — scene predates reported peak release",
};

const PROTOCOL_SECTION: Record<EapState, string> = {
  blue: "Alert Level 1 / Blue (Watch) — exact section/clause number not yet verified against the source document",
  orange:
    "Alert Level 2 / Orange (Warning) — exact section/clause number not yet verified against the source document",
  red: "Alert Level 3 / Red (Danger/Emergency) — exact section/clause number not yet verified against the source document",
};

const LABEL: Record<EapState, string> = {
  blue: "Blue flood/EAP state — Idamalayar watch scenario",
  orange: "Orange flood/EAP state — Idamalayar controlled-release scenario",
  red: "Red flood/EAP state — Idamalayar large-release scenario",
};

const SCENE_ID: Record<EapState, string> = {
  blue: "S2B_MSIL2A_20260602T045701_Idamalayar",
  orange: "S2A_MSIL2A_20260714T045659_Idamalayar",
  red: "S2B_MSIL2A_20260809T045701_Idamalayar",
};

const SCENE_DATE: Record<EapState, string> = {
  blue: "2026-06-02",
  orange: "2026-07-14",
  red: "2026-08-09",
};

const TIMESTAMP: Record<EapState, string> = {
  blue: "2026-06-02T05:14:00+05:30",
  orange: "2026-07-14T11:42:00+05:30",
  red: "2026-08-09T19:05:00+05:30",
};

export function buildHazardEvent(state: EapState): HazardEvent {
  return {
    id: `hazard-${state}`,
    eapState: state,
    label: LABEL[state],
    hazardType: "flood",
    severityLabel: SEVERITY_LABEL[state],
    source: {
      model: "Prithvi-100M-sen1floods11",
      scene: "Sentinel-2 L2A, single scene",
      sceneId: SCENE_ID[state],
      sceneDate: SCENE_DATE[state],
      aoi: "Idamalayar Dam – Bhoothathankettu regulator stretch, Periyar river system, Ernakulam district",
    },
    status: "verified-demo",
    limitations: [
      "single-timestamp inference",
      "not a live feed",
      "cloud-sensitive optical input; not ground-truthed",
    ],
    timestampReceived: TIMESTAMP[state],
    confidence: CONFIDENCE_BY_STATE[state],
    confidenceLabel: CONFIDENCE_LABEL_BY_STATE[state],
    protocolSource: {
      document: "Idamalayar EAP",
      section: PROTOCOL_SECTION[state],
      status: "agency validation required",
    },
    floodExtentGeoJson: EXTENT_BY_STATE[state],
  };
}

export const HAZARD_EVENTS: Record<EapState, HazardEvent> = {
  blue: buildHazardEvent("blue"),
  orange: buildHazardEvent("orange"),
  red: buildHazardEvent("red"),
};

export const MAP_CENTER: [number, number] = [10.145, 76.63];
