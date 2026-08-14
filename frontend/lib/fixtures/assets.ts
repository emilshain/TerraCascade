import type { MapAsset } from "@/lib/types";

// Positions are [lat, lng]. Demo-scenario placements near the Idamalayar Dam /
// Bhoothathankettu regulator stretch — illustrative, not surveyed, unless
// noted otherwise in `rationale`.

export const MAP_ASSETS: MapAsset[] = [
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
  {
    id: "asset-shelter-kuttampuzha-school",
    type: "shelter",
    name: "Govt. LP School, Kuttampuzha",
    priority: "P2",
    verified: false,
    status: "demo scenario assumption",
    position: [10.198, 76.747],
    rationale:
      "Modeled shelter capacity for Kuttampuzha panchayat; capacity figure is a demo scenario assumption, not confirmed with the panchayat office.",
  },
  {
    id: "asset-shelter-bhoothathankettu-hall",
    type: "shelter",
    name: "Community Hall, Bhoothathankettu",
    priority: "P2",
    verified: false,
    status: "demo scenario assumption",
    position: [10.153, 76.636],
    rationale:
      "Secondary shelter for the regulator-side settlement; access depends on the bridge segment below.",
  },
  {
    id: "asset-road-bridge-segment",
    type: "road",
    name: "Kuttampuzha–Bhoothathankettu–Kothamangalam road (bridge segment)",
    priority: "P1",
    verified: false,
    status: "demo scenario assumption",
    path: [
      [10.198, 76.747],
      [10.170, 76.700],
      [10.156, 76.660],
      [10.153, 76.636],
      [10.100, 76.631],
      [10.065, 76.629],
    ],
    blocked: true,
    rationale:
      "Bridge segment modeled impassable under the Orange/Red rule-curve scenario. This is a demo scenario assumption, not validated against PWD road-condition data.",
  },
  {
    id: "asset-road-malayattoor-approach",
    type: "road",
    name: "Malayattoor approach road (alternate route)",
    priority: "P2",
    verified: false,
    status: "demo scenario assumption",
    path: [
      [10.156, 76.636],
      [10.190, 76.560],
      [10.170, 76.495],
    ],
    blocked: false,
    rationale:
      "Modeled alternate supply/evacuation route if the bridge segment is blocked; adds an estimated ~40 minutes, not measured.",
  },
];
