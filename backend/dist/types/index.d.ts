import type { FeatureCollection } from "geojson";
export type EapSeverity = "blue" | "orange" | "red";
export type EventStatus = "verified-demo" | "advisory-demo" | "scenario";
export interface ProtocolCitation {
    document: string;
    section: string;
    status: "agency validation required" | "verified";
    frameworkBasis?: string;
}
export interface HazardSourceDetail {
    model: string;
    scene: string;
    sceneId: string;
    sceneDate: string;
    aoi: string;
}
/**
 * Canonical HazardEvent per 01_BACKEND.md
 */
export interface HazardEvent {
    id: string;
    hazard: "flood";
    severity: EapSeverity;
    source: string;
    status: EventStatus;
    confidence?: number;
    confidenceLabel?: string;
    issuedAt: string;
    affectedZones: string[];
    limitations: string[];
    label?: string;
    severityLabel?: "Watch" | "Warning" | "Danger/Emergency";
    sourceDetail?: HazardSourceDetail;
    protocolSource?: ProtocolCitation;
    floodExtentGeoJson?: FeatureCollection;
}
export type ActionStatus = "drafted" | "awaiting_approval" | "pending_approval" | "approved" | "acknowledged" | "in_progress" | "completed" | "complete" | "overridden";
export declare const CANONICAL_ACTION_STATUS_ORDER: ActionStatus[];
/**
 * Canonical Action per 01_BACKEND.md
 */
export interface Action {
    id: string;
    eventId: string;
    title: string;
    ownerRole: string;
    approverRole?: string;
    protocolSource: string;
    status: ActionStatus;
    dueAt?: string;
    overrideReason?: string;
    description?: string;
    authorityBoundary?: string;
    protocolSourceDetail?: ProtocolCitation;
    attentionRequired?: boolean;
    restricted?: boolean;
    createdAt?: string;
    updatedAt?: string;
}
export type AssetPriority = "P1" | "P2" | "P3";
export type MapAssetType = "hospital" | "shelter" | "road" | "critical_asset";
export interface ImpactAsset {
    id: string;
    type: MapAssetType;
    name: string;
    priority: AssetPriority;
    verified: boolean;
    status: EventStatus | "demo scenario assumption";
    position?: [number, number];
    path?: [number, number][];
    blocked?: boolean;
    rationale: string;
    evidenceLabel: string;
}
export type CascadeRisk = "low" | "medium" | "high" | "critical";
export type CascadeNodeStatus = "nominal" | "at_risk" | "blocked";
export interface CascadeNode {
    id: string;
    label: string;
    kind: "trigger" | "infrastructure" | "route" | "asset";
    riskLabel: CascadeRisk;
    status: CascadeNodeStatus;
    dependsOn: string[];
    note: string;
}
export interface DependencyEdge {
    from: string;
    to: string;
    type: "blocks" | "supplies" | "triggers" | "affects";
    label?: string;
}
export type ResourceKind = "fuel" | "boat" | "generator" | "team";
export interface ResourcePool {
    id: string;
    kind: ResourceKind;
    label: string;
    available: number;
    total: number;
    unit: string;
    location: string;
    status: EventStatus | "demo scenario assumption";
}
export interface ImpactGraphResponse {
    eventId: string;
    severity: EapSeverity;
    source: string;
    status: EventStatus;
    limitations: string[];
    assets: ImpactAsset[];
    cascadeNodes: CascadeNode[];
    edges: DependencyEdge[];
    resourcePools: ResourcePool[];
}
export interface BudgetProject {
    id: string;
    name: string;
    cost: number;
    costLakhs?: number;
    criticality: number;
    criticalityScore?: number;
    populationImpact: number;
    populationBenefit?: number;
    evidenceLabel: string;
    rationale: string;
    sourceCitation?: string;
    region?: string;
    status?: EventStatus | "demo scenario assumption";
}
export interface OptimiseRequest {
    projects?: BudgetProject[];
    budget: number;
    budgetLakhs?: number;
}
export interface SelectedProjectExplanation {
    projectId: string;
    name: string;
    cost: number;
    criticality: number;
    populationImpact: number;
    benefitScore: number;
    explanation: string;
}
export interface ExcludedProjectExplanation {
    projectId: string;
    name: string;
    cost: number;
    explanation: string;
}
export interface OptimiseResponse {
    selectedProjects: BudgetProject[];
    unselectedProjects: BudgetProject[];
    totalCost: number;
    remainingBudget: number;
    totalProtectedImpact: number;
    explanations: {
        selected: SelectedProjectExplanation[];
        unselected: ExcludedProjectExplanation[];
    };
    provenance: {
        algorithm: "0/1 Knapsack Dynamic Programming (Exact)";
        runtimeMs: number;
        status: "portfolio recommendation";
        disclaimer: "Portfolio recommendation only — not a government funding decision.";
    };
}
export type AuditEventType = "source_received" | "action_created" | "approval" | "acknowledgement" | "override" | "alert_drafted" | "status_change";
export interface AuditEntry {
    id: string;
    timestamp: string;
    actorRole: string;
    eventType: AuditEventType;
    description: string;
    relatedActionId?: string;
    reason?: string;
    provenance?: string;
}
export interface AlertCopy {
    headline: string;
    body: string;
}
export interface AlertDraft {
    id: string;
    eventId: string;
    eapSeverity: EapSeverity;
    affectedZone: string;
    approvalState: "draft" | "pending_approval" | "approved";
    en: AlertCopy;
    ml: AlertCopy;
    notice: string;
    sourceCitation: string;
}
