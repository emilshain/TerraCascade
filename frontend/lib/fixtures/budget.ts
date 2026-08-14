import type { BudgetProject } from "@/lib/types";

export const BUDGET_PROJECTS: BudgetProject[] = [
  {
    id: "bp-regulator-automation",
    name: "Bhoothathankettu regulator gate-automation retrofit",
    costLakhs: 120,
    populationBenefit: 42000,
    criticalityScore: 9.2,
    rationale:
      "Reduces manual response time at the single control structure every downstream path in the cascade view depends on.",
    sourceCitation: "demo scenario assumption — not individually cited to an official source",
    region: "Bhoothathankettu regulator",
    status: "demo scenario assumption",
  },
  {
    id: "bp-siren-network",
    name: "Early-warning siren network, Periyar downstream panchayats",
    costLakhs: 35,
    populationBenefit: 65000,
    criticalityScore: 8.8,
    rationale:
      "Highest population reach per lakh of any candidate project — covers every downstream panchayat in the modeled corridor.",
    sourceCitation: "demo scenario assumption — not individually cited to an official source",
    region: "Periyar downstream corridor",
    status: "demo scenario assumption",
  },
  {
    id: "bp-causeway-raising",
    name: "Kuttampuzha–Kothamangalam causeway raising",
    costLakhs: 85,
    populationBenefit: 18000,
    criticalityScore: 7.5,
    rationale:
      "Targets the bridge segment flagged as the single point of route failure in the cascade view.",
    sourceCitation: "demo scenario assumption — not individually cited to an official source",
    region: "Bridge segment, Kuttampuzha road",
    status: "demo scenario assumption",
  },
  {
    id: "bp-gauge-telemetry",
    name: "Real-time gauge telemetry, Idamalayar–Bhoothathankettu stretch",
    costLakhs: 48,
    populationBenefit: 30000,
    criticalityScore: 7.9,
    rationale:
      "Would let a future version replace single-timestamp satellite inference with continuous gauge readings on this stretch.",
    sourceCitation: "demo scenario assumption — not individually cited to an official source",
    region: "Idamalayar–Bhoothathankettu stretch",
    status: "demo scenario assumption",
  },
  {
    id: "bp-generator-bank",
    name: "Backup generator bank, Kothamangalam Taluk Hospital",
    costLakhs: 26,
    populationBenefit: 15000,
    criticalityScore: 7.2,
    rationale:
      "Protects the only P1 hospital asset on this stretch against a supply-route disruption during a Red-state scenario.",
    sourceCitation: "demo scenario assumption — not individually cited to an official source",
    region: "Kothamangalam",
    status: "demo scenario assumption",
  },
  {
    id: "bp-boats-lifejackets",
    name: "Boat and lifejacket procurement, KSEB EPM disaster cell",
    costLakhs: 18,
    populationBenefit: 12000,
    criticalityScore: 6.8,
    rationale:
      "Directly increases the rescue-boat resource pool shown on the cascade/resource view, currently at 3 of 5 available.",
    sourceCitation: "demo scenario assumption — not individually cited to an official source",
    region: "Bhoothathankettu boat station",
    status: "demo scenario assumption",
  },
  {
    id: "bp-pump-sets",
    name: "Portable pump sets, low-lying wards, Kothamangalam municipality",
    costLakhs: 14,
    populationBenefit: 9000,
    criticalityScore: 5.5,
    rationale:
      "Lower cost, localized benefit — a candidate for exclusion first when the budget is constrained.",
    sourceCitation: "demo scenario assumption — not individually cited to an official source",
    region: "Kothamangalam municipality",
    status: "demo scenario assumption",
  },
  {
    id: "bp-shelter-upgrade",
    name: "Community flood-shelter upgrade, Kuttampuzha LP School",
    costLakhs: 22,
    populationBenefit: 4000,
    criticalityScore: 6.0,
    rationale:
      "Raises shelter capacity flagged as sufficient only for the Orange-state scenario in the cascade view.",
    sourceCitation: "demo scenario assumption — not individually cited to an official source",
    region: "Kuttampuzha",
    status: "demo scenario assumption",
  },
];

export const DEFAULT_BUDGET_LAKHS = 150;
export const MIN_BUDGET_LAKHS = 0;
export const MAX_BUDGET_LAKHS = 250;
