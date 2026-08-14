/**
 * TerraCascade API Client for backend communication with local fallback.
 * Uses Prithvi-100M-sen1floods11 pre-computed fixtures, status "verified-demo",
 * "single-timestamp inference", and "not a live feed" limitations.
 */
import type {
  ActionItem,
  ActionStatus,
  AlertDraft,
  AuditEntry,
  BudgetProject,
  EapState,
  HazardEvent,
  MapAsset,
  CascadeNode,
  ResourcePool,
} from "./types";
import { HAZARD_EVENTS } from "./fixtures/hazard";
import { ACTIONS } from "./fixtures/actions";
import { CASCADE_NODES, RESOURCE_POOLS } from "./fixtures/cascade";
import { MAP_ASSETS } from "./fixtures/assets";
import { selectBudgetPortfolio, type KnapsackResult } from "./knapsack";
import { BUDGET_PROJECTS } from "./fixtures/budget";
import { INITIAL_AUDIT_LOG } from "./fixtures/audit";
import { ALERT_DRAFTS } from "./fixtures/alerts";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface ImpactResponse {
  eventId: string;
  severity: EapState;
  source: string;
  status: string;
  limitations: string[];
  assets: MapAsset[];
  cascadeNodes: CascadeNode[];
  resourcePools: ResourcePool[];
}

export class TerraCascadeApiClient {
  private baseUrl: string;

  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  public async getHealth(): Promise<{ status: string; hazardScope: string } | null> {
    try {
      const res = await fetch(`${this.baseUrl}/health`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public async getActiveEvent(): Promise<HazardEvent> {
    try {
      const res = await fetch(`${this.baseUrl}/events/active`);
      if (!res.ok) throw new Error("Backend unavailable");
      return (await res.json()) as HazardEvent;
    } catch {
      return HAZARD_EVENTS.orange;
    }
  }

  public async getActions(eventId = "active", role?: string): Promise<ActionItem[]> {
    try {
      const url = new URL(`${this.baseUrl}/events/${eventId}/actions`);
      if (role) url.searchParams.set("role", role);
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Backend unavailable");
      const data = await res.json();
      return data.actions as ActionItem[];
    } catch {
      return ACTIONS;
    }
  }

  public async updateAction(
    actionId: string,
    updates: { status?: ActionStatus; overrideReason?: string; actorRole?: string }
  ): Promise<ActionItem | null> {
    try {
      const res = await fetch(`${this.baseUrl}/actions/${actionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();
      return data.action as ActionItem;
    } catch {
      return null;
    }
  }

  public async getImpact(eventId = "active"): Promise<ImpactResponse> {
    try {
      const res = await fetch(`${this.baseUrl}/events/${eventId}/impact`);
      if (!res.ok) throw new Error("Backend unavailable");
      return (await res.json()) as ImpactResponse;
    } catch {
      return {
        eventId: "hazard-orange",
        severity: "orange",
        source: "TerraCascade Downstream Impact Fixtures",
        status: "verified-demo",
        limitations: ["demo scenario fallback"],
        assets: MAP_ASSETS,
        cascadeNodes: CASCADE_NODES,
        resourcePools: RESOURCE_POOLS,
      };
    }
  }

  public async optimizePortfolio(
    budgetLakhs: number,
    projects: BudgetProject[] = BUDGET_PROJECTS
  ): Promise<KnapsackResult> {
    try {
      const res = await fetch(`${this.baseUrl}/portfolio/optimise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budget: budgetLakhs, projects }),
      });
      if (!res.ok) throw new Error("Backend unavailable");
      const data = await res.json();
      return {
        selected: data.selectedProjects,
        excluded: data.unselectedProjects,
        totalCostLakhs: data.totalCost,
        totalBenefit: data.totalProtectedImpact,
      };
    } catch {
      return selectBudgetPortfolio(projects, budgetLakhs);
    }
  }

  public async getTimeline(eventId = "active"): Promise<AuditEntry[]> {
    try {
      const res = await fetch(`${this.baseUrl}/events/${eventId}/timeline`);
      if (!res.ok) throw new Error("Backend unavailable");
      const data = await res.json();
      return data.timeline as AuditEntry[];
    } catch {
      return INITIAL_AUDIT_LOG;
    }
  }

  public async approveAlert(eapState: EapState, actorRole = "district_authority"): Promise<AlertDraft | null> {
    try {
      const res = await fetch(`${this.baseUrl}/events/${eapState}/alerts/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actorRole }),
      });
      if (!res.ok) throw new Error("Backend unavailable");
      const data = await res.json();
      return data.alert as AlertDraft;
    } catch {
      return ALERT_DRAFTS[eapState];
    }
  }
}

export const apiClient = new TerraCascadeApiClient();
