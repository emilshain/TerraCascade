// Shared domain types for the TerraCascade EAP Command frontend.
// No backend exists yet (01_BACKEND.md is not in the repo) — these types are the
// provisional contract. Fixture data under lib/fixtures/* is shaped to match.

export type EapState = "blue" | "orange" | "red";

export type Role =
  | "kseb_epm"
  | "district_eoc"
  | "district_collector"
  | "budget_planner";

export interface RoleDefinition {
  id: Role;
  label: string;
  shortLabel: string;
  description: string;
  focus: string;
}

export type DataStatus = "verified-demo" | "demo scenario assumption";

export type EpistemicStatus =
  | "official_rule_curve"
  | "demo_simulation"
  | "vit_model_output"
  | "needs_verification";

export interface ProtocolSource {
  document: string;
  section: string;
  status: "agency validation required" | "verified";
}

export interface HazardSource {
  model: string;
  scene: string;
  sceneId: string;
  sceneDate: string;
  aoi: string;
}

export interface HazardEvent {
  id: string;
  eapState: EapState;
  label: string;
  hazardType: "flood";
  severityLabel: "Watch" | "Warning" | "Danger/Emergency";
  source: HazardSource;
  status: DataStatus;
  limitations: string[];
  timestampReceived: string;
  confidence: number;
  confidenceLabel: string;
  protocolSource: ProtocolSource;
  floodExtentGeoJson: GeoJSON.FeatureCollection;
}

export type ActionStatus =
  | "drafted"
  | "pending_approval"
  | "acknowledged"
  | "in_progress"
  | "complete";

export const ACTION_STATUS_ORDER: ActionStatus[] = [
  "drafted",
  "pending_approval",
  "acknowledged",
  "in_progress",
  "complete",
];

export interface ActionItem {
  id: string;
  eapState: EapState;
  title: string;
  description: string;
  status: ActionStatus;
  ownerRole: string;
  approverRole: string;
  authorityBoundary: string;
  protocolSource: ProtocolSource;
  attentionRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MapAssetType =
  | "hospital"
  | "shelter"
  | "road"
  | "critical_asset"
  | "bridge";

export type AssetPriority = "P1" | "P2" | "P3";

export type BridgeSubmersionStatus = "normal" | "inundated" | "submerged";

export interface MapAsset {
  id: string;
  type: MapAssetType;
  name: string;
  priority: AssetPriority;
  verified: boolean;
  status: DataStatus;
  position?: [number, number];
  path?: [number, number][];
  blocked?: boolean;
  rationale: string;
  /** Bridge markers only. */
  code?: string;
  submersionStatus?: BridgeSubmersionStatus;
  depthMeters?: number;
  velocityMps?: number;
  /** Shelter markers only. */
  accessBlocked?: boolean;
  deployNote?: string;
  /** Shelter markers only — id of the road asset whose blocked state gates access. */
  nearRoadId?: string;
}

export type CascadeRisk = "low" | "medium" | "high" | "critical";
export type CascadeStatus = "nominal" | "at_risk" | "blocked";

export interface CascadeNode {
  id: string;
  label: string;
  kind: "trigger" | "infrastructure" | "route" | "asset";
  riskLabel: CascadeRisk;
  status: CascadeStatus;
  dependsOn: string[];
  note: string;
  metricLabel?: string;
  metricValue?: string;
}

export type ResourceKind = "fuel" | "boat" | "generator" | "team" | "vehicle" | "shelter";

export interface ResourcePool {
  id: string;
  kind: ResourceKind;
  label: string;
  available: number;
  total: number;
  unit: string;
  location: string;
  status: DataStatus;
  capacityPercent?: number;
}

export interface BudgetProject {
  id: string;
  name: string;
  costLakhs: number;
  populationBenefit: number;
  criticalityScore: number;
  rationale: string;
  sourceCitation: string;
  region: string;
  status: DataStatus;
}

export interface AlertCopy {
  headline: string;
  body: string;
}

export interface AlertDraft {
  id: string;
  eapState: EapState;
  affectedZone: string;
  approvalState: "draft" | "pending_approval" | "approved";
  en: AlertCopy;
  ml: AlertCopy;
}

export type AuditEventType =
  | "source_received"
  | "action_created"
  | "approval"
  | "acknowledgement"
  | "override"
  | "alert_drafted";

export interface AuditEntry {
  id: string;
  timestamp: string;
  actorRole: Role | "system";
  eventType: AuditEventType;
  description: string;
  relatedActionId?: string;
  reason?: string;
  validation: "verified" | "demo_override";
  protocolTag?: string;
}
