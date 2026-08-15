/**
 * TerraCascade API Client for backend communication with Docker model live prediction
 * and local fallback. Uses Prithvi-100M-sen1floods11 inference outputs.
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
  Role,
} from "./types";

import { HAZARD_EVENTS, buildHazardEvent } from "./fixtures/hazard";
import { ACTIONS } from "./fixtures/actions";
import { CASCADE_NODES, RESOURCE_POOLS } from "./fixtures/cascade";
import { MAP_ASSETS } from "./fixtures/assets";
import { selectBudgetPortfolio, type KnapsackResult } from "./knapsack";
import { BUDGET_PROJECTS } from "./fixtures/budget";
import { INITIAL_AUDIT_LOG } from "./fixtures/audit";
import { ALERT_DRAFTS } from "./fixtures/alerts";

function normalizeUrl(url: string): string {
  let cleaned = (url || "").trim().replace(/\/+$/, "");
  if (!cleaned) return "http://localhost:4000";
  if (!cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
    cleaned = `https://${cleaned}`;
  }
  return cleaned;
}

const API_BASE_URL = normalizeUrl(process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000");

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

export interface ModelStatusResponse {
  online: boolean;
  serviceUrl: string;
  runtime?: string;
  model?: string;
  latencyMs?: number;
  error?: string;
}

export interface LivePredictionResult {
  message: string;
  event: HazardEvent;
  fromDockerModel: boolean;
  latencyMs?: number;
  smsResults?: any[];
}

export class TerraCascadeApiClient {
  private baseUrl: string;

  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = normalizeUrl(baseUrl);
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

  public async getModelStatus(): Promise<ModelStatusResponse> {
    try {
      const res = await fetch(`${this.baseUrl}/events/model-status`);
      if (!res.ok) throw new Error("Status failed");
      return (await res.json()) as ModelStatusResponse;
    } catch {
      return {
        online: false,
        serviceUrl: "http://localhost:8000",
        runtime: "Offline (Local Fallback Engine)",
        model: "Prithvi-100M-sen1floods11",
      };
    }
  }

  public async triggerLivePrediction(params: {
    discharge_cumecs?: number;
    rainfall_mm_hr?: number;
    scenario?: string;
    actorRole?: string;
  } = {}): Promise<LivePredictionResult> {
    try {
      const res = await fetch(`${this.baseUrl}/events/live-predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error("Live prediction request failed");
      return (await res.json()) as LivePredictionResult;
    } catch (err) {
      // Local fallback simulation
      const discharge = params.discharge_cumecs || 1200;
      const rain = params.rainfall_mm_hr || 45;
      const intensity = (discharge / 1500) * 0.6 + (rain / 80) * 0.4;
      const state: EapState = intensity < 0.65 ? "blue" : intensity < 1.15 ? "orange" : "red";
      const fallbackEvent = buildHazardEvent(state);
      
      return {
        message: "Live simulation fallback executed locally",
        event: {
          ...fallbackEvent,
          id: `hazard-live-${state}`,
          label: `Live ${fallbackEvent.severityLabel} prediction (Discharge: ${discharge} cumecs, Rain: ${rain} mm/h)`,
        },
        fromDockerModel: false,
        latencyMs: 145,
      };
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

  public async approveAlert(eapState: EapState, actorRole = "district_authority"): Promise<{ alert: AlertDraft; smsResults?: any[] } | null> {
    try {
      const res = await fetch(`${this.baseUrl}/events/${eapState}/alerts/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actorRole }),
      });
      if (!res.ok) throw new Error("Backend unavailable");
      const data = await res.json();
      return { alert: data.alert as AlertDraft, smsResults: data.smsResults };
    } catch {
      return { alert: ALERT_DRAFTS[eapState] };
    }
  }

  public async dispatchSmsAlert(eapState: EapState, recipients?: string[], actorRole = "district_authority") {
    try {
      const res = await fetch(`${this.baseUrl}/events/${eapState}/alerts/dispatch-sms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actorRole, recipients }),
      });
      if (!res.ok) throw new Error("SMS dispatch request failed");
      return await res.json();
    } catch (err: any) {
      return {
        message: "SMS dispatch error",
        error: err.message || "Failed to trigger SMS alert",
        smsResults: [],
      };
    }
  }

  // --- Auth & MongoDB Cluster Telemetry ---

  public async getClusterStatus(): Promise<ClusterStatus> {
    try {
      const res = await fetch(`${this.baseUrl}/auth/cluster-status`);
      if (!res.ok) throw new Error("Failed to fetch cluster status");
      return await res.json();
    } catch (err: any) {
      return {
        connected: false,
        readyState: 0,
        statusText: "Disconnected (Fallback Mode)",
        isAtlas: false,
        clusterHost: "localhost:27017",
        dbName: "terracascade",
        latencyMs: 0,
        collections: [],
        lastCheckedAt: new Date().toISOString(),
        error: err.message || "Backend offline or cluster unreachable",
      };
    }
  }

  public async getDemoOfficers(): Promise<Array<{ name: string; email: string; role: Role; badgeId: string; agency: string }>> {
    try {
      const res = await fetch(`${this.baseUrl}/auth/demo-officers`);
      if (!res.ok) throw new Error("Failed to load demo officers");
      const data = await res.json();
      return data.officers;
    } catch {
      return [
        {
          name: "Biju P.N",
          email: "epm.biju@kseb.in",
          role: "kseb_epm",
          badgeId: "KSEB-EPM-04",
          agency: "Kerala State Electricity Board (Dam Safety)",
        },
        {
          name: "Salim M.",
          email: "eoc.salim@kerala.gov.in",
          role: "district_eoc",
          badgeId: "DDMA-EOC-02",
          agency: "District Emergency Operations Centre",
        },
        {
          name: "Dr. Renu Raj, IAS",
          email: "collector.ernakulam@kerala.gov.in",
          role: "district_collector",
          badgeId: "IAS-KL-COL-01",
          agency: "District Administration & DDMA",
        },
        {
          name: "Priya V.",
          email: "planner.priya@kerala.gov.in",
          role: "budget_planner",
          badgeId: "KDMA-FIN-08",
          agency: "Disaster Mitigation & Finance",
        },
      ];
    }
  }

  public async login(identifier: string, password: string): Promise<{ user: SafeUser; token: string }> {
    const res = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || "Login failed");
    }
    return { user: data.user, token: data.token };
  }

  public async register(payload: {
    name: string;
    email: string;
    password: string;
    role: Role;
    badgeId: string;
    agency?: string;
    phoneNumber?: string;
  }): Promise<{ user: SafeUser; token: string }> {
    const res = await fetch(`${this.baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      const msg = Array.isArray(data.details) ? data.details.join(", ") : data.message || data.error || "Registration failed";
      throw new Error(msg);
    }
    return { user: data.user, token: data.token };
  }

  public async getMe(token: string): Promise<SafeUser | null> {
    try {
      const res = await fetch(`${this.baseUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public async seedDemoUsers(): Promise<{ message: string; createdCount: number }> {
    try {
      const res = await fetch(`${this.baseUrl}/auth/seed-demo`, { method: "POST" });
      return await res.json();
    } catch (err: any) {
      return { message: err.message || "Failed to seed demo accounts", createdCount: 0 };
    }
  }
}

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  badgeId: string;
  agency: string;
  phoneNumber?: string;
  isVerified?: boolean;
  lastLogin?: string;
  createdAt?: string;
}

export interface ClusterStatus {
  connected: boolean;
  readyState: number;
  statusText: string;
  isAtlas: boolean;
  clusterHost: string;
  dbName: string;
  latencyMs: number;
  collections: string[];
  userCount?: number;
  lastCheckedAt: string;
  error?: string | null;
}

export const apiClient = new TerraCascadeApiClient();


