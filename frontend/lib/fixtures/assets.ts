import type { EapState, MapAsset } from "@/lib/types";

// Positions are [lat, lng]. Demo-scenario placements along the Idamalayar Dam /
// Bhoothathankettu regulator stretch of the Periyar river system, Ernakulam
// district — illustrative, not surveyed, unless noted otherwise in `rationale`.

export const CRITICAL_ASSETS: MapAsset[] = [
  {
    id: "asset-idamalayar-dam",
    type: "critical_asset",
    name: "Idamalayar Dam",
    priority: "P1",
    verified: true,
    status: "verified-demo",
    position: [10.1667, 76.7833],
    rationale:
      "Source dam for the modeled release scenario; named in the Idamalayar EAP.",
  },
  {
    id: "asset-bhoothathankettu-regulator",
    type: "critical_asset",
    name: "Bhoothathankettu Regulator",
    priority: "P1",
    verified: true,
    status: "verified-demo",
    position: [10.156, 76.633],
    rationale:
      "Named downstream control structure for Idamalayar releases; P1 because every downstream impact path in the cascade view depends on it.",
  },
  {
    id: "asset-taluk-hospital-kothamangalam",
    type: "hospital",
    name: "Taluk Hospital, Kothamangalam",
    priority: "P1",
    verified: false,
    status: "demo scenario assumption",
    position: [10.065, 76.629],
    rationale:
      "Nearest major hospital in the downstream corridor; P1 because it is the only facility on this stretch. Coordinates are an illustrative placement, not a surveyed asset record.",
  },
];

// --- Bridges (Idamalayar basin submersion markers, EAP Annexure-style) -----

interface BridgeDef {
  id: string;
  code: string;
  name: string;
  position: [number, number];
  byState: Record<
    EapState,
    { status: "normal" | "inundated" | "submerged"; depthMeters: number; velocityMps: number }
  >;
}

const BRIDGE_DEFS: BridgeDef[] = [
  {
    id: "asset-bridge-pooyamkutty",
    code: "B1",
    name: "Pooyamkutty Bridge",
    position: [10.194, 76.732],
    byState: {
      blue: { status: "normal", depthMeters: 0.4, velocityMps: 0.5 },
      orange: { status: "inundated", depthMeters: 0.9, velocityMps: 1.1 },
      red: { status: "submerged", depthMeters: 1.8, velocityMps: 2.4 },
    },
  },
  {
    id: "asset-bridge-thattekadu",
    code: "B2",
    name: "Thattekadu Bridge",
    position: [10.176, 76.696],
    byState: {
      blue: { status: "normal", depthMeters: 0.3, velocityMps: 0.4 },
      orange: { status: "normal", depthMeters: 0.6, velocityMps: 0.7 },
      red: { status: "inundated", depthMeters: 1.3, velocityMps: 1.6 },
    },
  },
  {
    id: "asset-bridge-neriamangalam",
    code: "B3",
    name: "Neriamangalam Bridge",
    position: [10.1167, 76.6667],
    byState: {
      blue: { status: "normal", depthMeters: 0.3, velocityMps: 0.5 },
      orange: { status: "inundated", depthMeters: 1.0, velocityMps: 1.3 },
      red: { status: "submerged", depthMeters: 2.1, velocityMps: 2.8 },
    },
  },
  {
    id: "asset-bridge-bhoothathankettu-barrage",
    code: "B4",
    name: "Bhoothathankettu Barrage",
    position: [10.156, 76.636],
    byState: {
      blue: { status: "normal", depthMeters: 0.5, velocityMps: 0.6 },
      orange: { status: "inundated", depthMeters: 1.2, velocityMps: 1.5 },
      red: { status: "submerged", depthMeters: 2.4, velocityMps: 3.0 },
    },
  },
  {
    id: "asset-bridge-malayattoor-kodanad",
    code: "B5",
    name: "Malayattoor Kodanad Bridge",
    position: [10.19, 76.575],
    byState: {
      blue: { status: "normal", depthMeters: 0.2, velocityMps: 0.3 },
      orange: { status: "normal", depthMeters: 0.5, velocityMps: 0.6 },
      red: { status: "inundated", depthMeters: 1.1, velocityMps: 1.4 },
    },
  },
];

export function buildBridges(eapState?: EapState): MapAsset[] {
  const safeState = eapState === "red" || eapState === "blue" ? eapState : "orange";
  return BRIDGE_DEFS.map((def) => {
    const s = def.byState[safeState] || def.byState["orange"];
    return {
      id: def.id,
      type: "bridge",
      name: def.name,
      code: def.code,
      priority: s.status === "normal" ? "P2" : "P1",
      verified: true,
      status: "demo scenario assumption",
      position: def.position,
      submersionStatus: s.status,
      depthMeters: s.depthMeters,
      velocityMps: s.velocityMps,
      rationale:
        "Named EAP-cited bridge; depth/velocity are a demo scenario estimate, not a gauge reading.",
    };
  });
}

// --- Shelters / relief camps (Annexure 9a/9b style) ------------------------

interface ShelterDef {
  id: string;
  code: string;
  name: string;
  position: [number, number];
  nearRoadId?: string;
}

const SHELTER_DEFS: ShelterDef[] = [
  { id: "asset-shelter-s1", code: "S1", name: "SNDP HSS Adimali", position: [10.212, 76.943] },
  {
    id: "asset-shelter-s2",
    code: "S2",
    name: "Govt. UP School, Kuttampuzha",
    position: [10.198, 76.747],
    nearRoadId: "asset-road-bridge-segment",
  },
  {
    id: "asset-shelter-s3",
    code: "S3",
    name: "Community Hall, Bhoothathankettu",
    position: [10.153, 76.636],
    nearRoadId: "asset-road-bridge-segment",
  },
  { id: "asset-shelter-s4", code: "S4", name: "St. Mary's HS, Kothamangalam", position: [10.062, 76.626] },
  { id: "asset-shelter-s5", code: "S5", name: "Govt. LP School, Neriamangalam", position: [10.114, 76.668] },
  { id: "asset-shelter-s6", code: "S6", name: "Panchayat Community Hall, Malayattoor", position: [10.191, 76.578] },
  { id: "asset-shelter-s7", code: "S7", name: "Govt. HSS, Odakkali", position: [10.13, 76.56] },
  { id: "asset-shelter-s8", code: "S8", name: "St. George HS, Perumbavoor", position: [10.109, 76.478] },
  { id: "asset-shelter-s9", code: "S9", name: "Govt. LP School, Asamannoor", position: [10.15, 76.52] },
  { id: "asset-shelter-s10", code: "S10", name: "Community Hall, Manjapra", position: [10.171, 76.607] },
  { id: "asset-shelter-s11", code: "S11", name: "Govt. UP School, Pindimana", position: [10.086, 76.548] },
  { id: "asset-shelter-s12", code: "S12", name: "Bhavan's College, Kakkanad", position: [10.007, 76.348] },
];

export function buildShelters(roadsBlocked: Record<string, boolean>): MapAsset[] {
  return SHELTER_DEFS.map((def) => {
    const accessBlocked = def.nearRoadId ? Boolean(roadsBlocked[def.nearRoadId]) : false;
    return {
      id: def.id,
      type: "shelter",
      name: def.name,
      code: def.code,
      priority: accessBlocked ? "P1" : "P2",
      verified: false,
      status: "demo scenario assumption",
      position: def.position,
      accessBlocked,
      nearRoadId: def.nearRoadId,
      deployNote: accessBlocked ? "Access Road Blocked - Deploy Amphibious Support" : undefined,
      rationale:
        "Modeled shelter from the Idamalayar EAP relief-camp annexure; capacity and access are demo scenario assumptions, not confirmed with the panchayat office.",
    };
  });
}

// --- Roads (moved into store state so the EOC route-blocker can toggle them) ---

export const INITIAL_ROADS: MapAsset[] = [
  {
    id: "asset-road-bridge-segment",
    type: "road",
    name: "Kuttampuzha–Bhoothathankettu–Kothamangalam road (bridge segment)",
    priority: "P1",
    verified: false,
    status: "demo scenario assumption",
    path: [
      [10.198, 76.747],
      [10.17, 76.7],
      [10.156, 76.66],
      [10.153, 76.636],
      [10.1, 76.631],
      [10.065, 76.629],
    ],
    blocked: true,
    rationale:
      "Bridge segment modeled impassable under the Orange/Red rule-curve scenario. This is a demo scenario assumption, not validated against PWD road-condition data.",
  },
  {
    id: "asset-road-r19-malayattoor-kodanad",
    type: "road",
    name: "R19 Malayattoor–Kodanad Road (alternate route)",
    priority: "P2",
    verified: false,
    status: "demo scenario assumption",
    path: [
      [10.156, 76.636],
      [10.19, 76.578],
      [10.19, 76.56],
    ],
    blocked: false,
    rationale:
      "Modeled alternate supply/evacuation route if the bridge segment is blocked; adds an estimated ~40 minutes, not measured.",
  },
];

export const MAP_ASSETS: MapAsset[] = [
  ...CRITICAL_ASSETS,
  ...buildBridges("orange"),
  ...buildShelters({}),
  ...INITIAL_ROADS,
];
