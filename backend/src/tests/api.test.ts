import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import type { Server } from "http";
import type { AddressInfo } from "net";
import { createApp } from "../app.js";
import { actionService } from "../services/action-service.js";
import { timelineService } from "../services/timeline-service.js";
import { eventService } from "../services/event-service.js";
import type { Action, AuditEntry, HazardEvent, ImpactGraphResponse, OptimiseResponse } from "../types/index.js";

describe("TerraCascade EAP Command — Backend API Integration Suite", () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    const app = createApp();
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server.address() as AddressInfo;
        baseUrl = `http://127.0.0.1:${address.port}`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  beforeEach(() => {
    actionService.resetToInitial();
    timelineService.resetToInitial();
    eventService.setActiveState("orange");
  });

  it("GET /health returns healthy status, flood-only scope, and provenance tags", async () => {
    const res = await fetch(`${baseUrl}/health`);
    expect(res.status).toBe(200);

    const data = (await res.json()) as {
      status: string;
      hazardScope: string;
      provenance: {
        model: string;
        status: string;
        limitations: string[];
      };
    };
    expect(data.status).toBe("healthy");
    expect(data.hazardScope).toContain("flood only");
    expect(data.provenance.model).toBe("Prithvi-100M-sen1floods11");
    expect(data.provenance.status).toBe("verified-demo");
    expect(data.provenance.limitations).toContain("single-timestamp inference");
    expect(data.provenance.limitations).toContain("not a live feed");
  });

  it("GET /events/model-status returns model container status structure", async () => {
    const res = await fetch(`${baseUrl}/events/model-status`);
    expect(res.status).toBe(200);
    const data = (await res.json()) as { online: boolean; serviceUrl: string };
    expect(data.serviceUrl).toBeDefined();
    expect(typeof data.online).toBe("boolean");
  });

  it("POST /events/live-predict triggers live inference and updates active event and audit trail", async () => {
    const res = await fetch(`${baseUrl}/events/live-predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        discharge_cumecs: 2400,
        rainfall_mm_hr: 90,
        actorRole: "kseb_epm",
      }),
    });
    expect(res.status).toBe(200);

    const data = (await res.json()) as {
      message: string;
      event: HazardEvent;
      fromDockerModel: boolean;
    };
    expect(data.message).toContain("successfully");
    expect(data.event.severity).toBe("red");
    expect(data.event.floodExtentGeoJson).toBeDefined();
    expect(data.event.floodExtentGeoJson?.features.length).toBeGreaterThan(0);

    // Verify GET /events/active returns this live predicted event
    const activeRes = await fetch(`${baseUrl}/events/active`);
    const activeEvent = (await activeRes.json()) as HazardEvent;
    expect(activeEvent.severity).toBe("red");

    // Verify audit log has the source_received entry
    const timelineRes = await fetch(`${baseUrl}/events/active/timeline`);
    const timelineData = (await timelineRes.json()) as { timeline: AuditEntry[] };
    const latest = timelineData.timeline[timelineData.timeline.length - 1];
    expect(latest.eventType).toBe("source_received");
    expect(latest.description).toContain("Live Prithvi-100M ViT flood prediction");
  });

  it("GET /events/active returns active flood demo event with Prithvi extent", async () => {
    const res = await fetch(`${baseUrl}/events/active`);
    expect(res.status).toBe(200);

    const event = (await res.json()) as HazardEvent;
    expect(event.hazard).toBe("flood");
    expect(event.source).toContain("Prithvi-100M-sen1floods11");
    expect(event.status).toBe("verified-demo");
    expect(event.limitations).toContain("single-timestamp inference");
    expect(event.floodExtentGeoJson).toBeDefined();
    expect(event.floodExtentGeoJson?.type).toBe("FeatureCollection");
    expect(event.floodExtentGeoJson?.features.length).toBeGreaterThan(0);
  });

  it("POST /events/active/state switches active scenario and records audit entry", async () => {
    const res = await fetch(`${baseUrl}/events/active/state`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: "red", actorRole: "district_authority" }),
    });
    expect(res.status).toBe(200);

    const data = (await res.json()) as { activeState: string; event: HazardEvent };
    expect(data.activeState).toBe("red");
    expect(data.event.severity).toBe("red");

    // Check that GET /events/active now returns the Red state
    const activeRes = await fetch(`${baseUrl}/events/active`);
    const activeEvent = (await activeRes.json()) as HazardEvent;
    expect(activeEvent.severity).toBe("red");
  });

  it("GET /events/:id/actions returns role-specific actions with protocol citations", async () => {
    const res = await fetch(`${baseUrl}/events/hazard-orange/actions`);
    expect(res.status).toBe(200);

    const data = (await res.json()) as { count: number; actions: Action[] };
    expect(data.count).toBeGreaterThan(0);
    for (const action of data.actions) {
      expect(action.eventId).toBe("hazard-orange");
      expect(action.ownerRole).toBeDefined();
      expect(action.protocolSource).toContain("Idamalayar EAP");
    }
  });

  it("PATCH /actions/:id advances action status and logs audit entry", async () => {
    // Let's update act-orange-2 to approved
    const patchRes = await fetch(`${baseUrl}/actions/act-orange-2`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "approved",
        actorRole: "kseb_epm",
      }),
    });
    expect(patchRes.status).toBe(200);

    const patchData = (await patchRes.json()) as { action: Action };
    expect(patchData.action.status).toBe("approved");

    // Check that audit timeline has the new entry
    const timelineRes = await fetch(`${baseUrl}/events/active/timeline`);
    const timelineData = (await timelineRes.json()) as { timeline: AuditEntry[] };
    const latestAudit = timelineData.timeline[timelineData.timeline.length - 1];
    expect(latestAudit.relatedActionId).toBe("act-orange-2");
    expect(latestAudit.eventType).toBe("approval");
  });

  it("PATCH /actions/:id handles override with reason", async () => {
    const patchRes = await fetch(`${baseUrl}/actions/act-orange-3`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "in_progress",
        actorRole: "district_eoc",
        overrideReason: "Manual override: emergency liaison staged early.",
      }),
    });
    expect(patchRes.status).toBe(200);

    const patchData = (await patchRes.json()) as { action: Action };
    expect(patchData.action.status).toBe("in_progress");
    expect(patchData.action.overrideReason).toBe("Manual override: emergency liaison staged early.");

    // Check timeline for override event
    const timelineRes = await fetch(`${baseUrl}/events/active/timeline`);
    const timelineData = (await timelineRes.json()) as { timeline: AuditEntry[] };
    const overrideEntry = timelineData.timeline.find(
      (entry) =>
        entry.relatedActionId === "act-orange-3" &&
        entry.reason === "Manual override: emergency liaison staged early."
    );
    expect(overrideEntry).toBeDefined();
    expect(overrideEntry?.eventType).toBe("override");
  });

  it("GET /events/:id/impact returns assets, cascade graph, dependencies, and resources", async () => {
    const res = await fetch(`${baseUrl}/events/hazard-orange/impact`);
    expect(res.status).toBe(200);

    const impact = (await res.json()) as ImpactGraphResponse;
    expect(impact.assets.length).toBeGreaterThan(0);
    expect(impact.cascadeNodes.length).toBeGreaterThan(0);
    expect(impact.edges.length).toBeGreaterThan(0);
    expect(impact.resourcePools.length).toBeGreaterThan(0);

    // Verify P1 asset presence and rationales
    const damAsset = impact.assets.find((a) => a.id === "asset-idamalayar-dam");
    expect(damAsset).toBeDefined();
    expect(damAsset?.priority).toBe("P1");
    expect(damAsset?.evidenceLabel).toBeDefined();
  });

  it("POST /portfolio/optimise returns budget-feasible mitigation list with explanations", async () => {
    const res = await fetch(`${baseUrl}/portfolio/optimise`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ budget: 150 }),
    });
    expect(res.status).toBe(200);

    const result = (await res.json()) as OptimiseResponse;
    expect(result.totalCost).toBeLessThanOrEqual(150);
    expect(result.selectedProjects.length).toBeGreaterThan(0);
    expect(result.unselectedProjects.length).toBeGreaterThan(0);
    expect(result.provenance.algorithm).toBe("0/1 Knapsack Dynamic Programming (Exact)");
    expect(result.provenance.disclaimer).toContain("not a government funding decision");
    expect(result.explanations.selected.length).toBe(result.selectedProjects.length);
  });

  it("GET /events/:id/timeline returns chronologically ordered timeline", async () => {
    const res = await fetch(`${baseUrl}/events/hazard-orange/timeline`);
    expect(res.status).toBe(200);

    const data = (await res.json()) as { timeline: AuditEntry[] };
    expect(data.timeline.length).toBeGreaterThan(0);
    // Verify chronological order
    for (let i = 1; i < data.timeline.length; i++) {
      const prev = new Date(data.timeline[i - 1].timestamp).getTime();
      const curr = new Date(data.timeline[i].timestamp).getTime();
      expect(curr).toBeGreaterThanOrEqual(prev);
    }
  });

  it("POST /events/:id/alerts/approve signs off bilingual alert draft", async () => {
    const res = await fetch(`${baseUrl}/events/orange/alerts/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actorRole: "collector" }),
    });
    expect(res.status).toBe(200);

    const data = (await res.json()) as { alert: { approvalState: string; en: unknown; ml: unknown } };
    expect(data.alert.approvalState).toBe("approved");
    expect(data.alert.en).toBeDefined();
    expect(data.alert.ml).toBeDefined();
  });
});
