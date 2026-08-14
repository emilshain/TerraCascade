"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const app_js_1 = require("../app.js");
const action_service_js_1 = require("../services/action-service.js");
const timeline_service_js_1 = require("../services/timeline-service.js");
const event_service_js_1 = require("../services/event-service.js");
(0, vitest_1.describe)("TerraCascade EAP Command — Backend API Integration Suite", () => {
    let server;
    let baseUrl;
    (0, vitest_1.beforeAll)(async () => {
        const app = (0, app_js_1.createApp)();
        await new Promise((resolve) => {
            server = app.listen(0, () => {
                const address = server.address();
                baseUrl = `http://127.0.0.1:${address.port}`;
                resolve();
            });
        });
    });
    (0, vitest_1.afterAll)(async () => {
        await new Promise((resolve, reject) => {
            server.close((err) => (err ? reject(err) : resolve()));
        });
    });
    (0, vitest_1.beforeEach)(() => {
        action_service_js_1.actionService.resetToInitial();
        timeline_service_js_1.timelineService.resetToInitial();
        event_service_js_1.eventService.setActiveState("orange");
    });
    (0, vitest_1.it)("GET /health returns healthy status, flood-only scope, and provenance tags", async () => {
        const res = await fetch(`${baseUrl}/health`);
        (0, vitest_1.expect)(res.status).toBe(200);
        const data = await res.json();
        (0, vitest_1.expect)(data.status).toBe("healthy");
        (0, vitest_1.expect)(data.hazardScope).toContain("flood only");
        (0, vitest_1.expect)(data.provenance.model).toBe("Prithvi-100M-sen1floods11");
        (0, vitest_1.expect)(data.provenance.status).toBe("verified-demo");
        (0, vitest_1.expect)(data.provenance.limitations).toContain("single-timestamp inference");
        (0, vitest_1.expect)(data.provenance.limitations).toContain("not a live feed");
    });
    (0, vitest_1.it)("GET /events/active returns active flood demo event with Prithvi extent", async () => {
        const res = await fetch(`${baseUrl}/events/active`);
        (0, vitest_1.expect)(res.status).toBe(200);
        const event = await res.json();
        (0, vitest_1.expect)(event.hazard).toBe("flood");
        (0, vitest_1.expect)(event.source).toContain("Prithvi-100M-sen1floods11");
        (0, vitest_1.expect)(event.status).toBe("verified-demo");
        (0, vitest_1.expect)(event.limitations).toContain("single-timestamp inference");
        (0, vitest_1.expect)(event.floodExtentGeoJson).toBeDefined();
        (0, vitest_1.expect)(event.floodExtentGeoJson.type).toBe("FeatureCollection");
        (0, vitest_1.expect)(event.floodExtentGeoJson.features.length).toBeGreaterThan(0);
    });
    (0, vitest_1.it)("POST /events/active/state switches active scenario and records audit entry", async () => {
        const res = await fetch(`${baseUrl}/events/active/state`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ state: "red", actorRole: "district_authority" }),
        });
        (0, vitest_1.expect)(res.status).toBe(200);
        const data = await res.json();
        (0, vitest_1.expect)(data.activeState).toBe("red");
        (0, vitest_1.expect)(data.event.severity).toBe("red");
        // Check that GET /events/active now returns the Red state
        const activeRes = await fetch(`${baseUrl}/events/active`);
        const activeEvent = await activeRes.json();
        (0, vitest_1.expect)(activeEvent.severity).toBe("red");
    });
    (0, vitest_1.it)("GET /events/:id/actions returns role-specific actions with protocol citations", async () => {
        const res = await fetch(`${baseUrl}/events/hazard-orange/actions`);
        (0, vitest_1.expect)(res.status).toBe(200);
        const data = await res.json();
        (0, vitest_1.expect)(data.count).toBeGreaterThan(0);
        for (const action of data.actions) {
            (0, vitest_1.expect)(action.eventId).toBe("hazard-orange");
            (0, vitest_1.expect)(action.ownerRole).toBeDefined();
            (0, vitest_1.expect)(action.protocolSource).toContain("Idamalayar EAP");
        }
    });
    (0, vitest_1.it)("PATCH /actions/:id advances action status and logs audit entry", async () => {
        // Let's update act-orange-2 to approved
        const patchRes = await fetch(`${baseUrl}/actions/act-orange-2`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                status: "approved",
                actorRole: "kseb_epm",
            }),
        });
        (0, vitest_1.expect)(patchRes.status).toBe(200);
        const patchData = await patchRes.json();
        (0, vitest_1.expect)(patchData.action.status).toBe("approved");
        // Check that audit timeline has the new entry
        const timelineRes = await fetch(`${baseUrl}/events/active/timeline`);
        const timelineData = await timelineRes.json();
        const latestAudit = timelineData.timeline[timelineData.timeline.length - 1];
        (0, vitest_1.expect)(latestAudit.relatedActionId).toBe("act-orange-2");
        (0, vitest_1.expect)(latestAudit.eventType).toBe("approval");
    });
    (0, vitest_1.it)("PATCH /actions/:id handles override with reason", async () => {
        const patchRes = await fetch(`${baseUrl}/actions/act-orange-3`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                status: "in_progress",
                actorRole: "district_eoc",
                overrideReason: "Manual override: emergency liaison staged early.",
            }),
        });
        (0, vitest_1.expect)(patchRes.status).toBe(200);
        const patchData = await patchRes.json();
        (0, vitest_1.expect)(patchData.action.status).toBe("in_progress");
        (0, vitest_1.expect)(patchData.action.overrideReason).toBe("Manual override: emergency liaison staged early.");
        // Check timeline for override event
        const timelineRes = await fetch(`${baseUrl}/events/active/timeline`);
        const timelineData = await timelineRes.json();
        const overrideEntry = timelineData.timeline.find((entry) => entry.relatedActionId === "act-orange-3" &&
            entry.reason === "Manual override: emergency liaison staged early.");
        (0, vitest_1.expect)(overrideEntry).toBeDefined();
        (0, vitest_1.expect)(overrideEntry.eventType).toBe("override");
    });
    (0, vitest_1.it)("GET /events/:id/impact returns assets, cascade graph, dependencies, and resources", async () => {
        const res = await fetch(`${baseUrl}/events/hazard-orange/impact`);
        (0, vitest_1.expect)(res.status).toBe(200);
        const impact = await res.json();
        (0, vitest_1.expect)(impact.assets.length).toBeGreaterThan(0);
        (0, vitest_1.expect)(impact.cascadeNodes.length).toBeGreaterThan(0);
        (0, vitest_1.expect)(impact.edges.length).toBeGreaterThan(0);
        (0, vitest_1.expect)(impact.resourcePools.length).toBeGreaterThan(0);
        // Verify P1 asset presence and rationales
        const damAsset = impact.assets.find((a) => a.id === "asset-idamalayar-dam");
        (0, vitest_1.expect)(damAsset).toBeDefined();
        (0, vitest_1.expect)(damAsset.priority).toBe("P1");
        (0, vitest_1.expect)(damAsset.evidenceLabel).toBeDefined();
    });
    (0, vitest_1.it)("POST /portfolio/optimise returns budget-feasible mitigation list with explanations", async () => {
        const res = await fetch(`${baseUrl}/portfolio/optimise`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ budget: 150 }),
        });
        (0, vitest_1.expect)(res.status).toBe(200);
        const result = await res.json();
        (0, vitest_1.expect)(result.totalCost).toBeLessThanOrEqual(150);
        (0, vitest_1.expect)(result.selectedProjects.length).toBeGreaterThan(0);
        (0, vitest_1.expect)(result.unselectedProjects.length).toBeGreaterThan(0);
        (0, vitest_1.expect)(result.provenance.algorithm).toBe("0/1 Knapsack Dynamic Programming (Exact)");
        (0, vitest_1.expect)(result.provenance.disclaimer).toContain("not a government funding decision");
        (0, vitest_1.expect)(result.explanations.selected.length).toBe(result.selectedProjects.length);
    });
    (0, vitest_1.it)("GET /events/:id/timeline returns chronologically ordered timeline", async () => {
        const res = await fetch(`${baseUrl}/events/hazard-orange/timeline`);
        (0, vitest_1.expect)(res.status).toBe(200);
        const data = await res.json();
        (0, vitest_1.expect)(data.timeline.length).toBeGreaterThan(0);
        // Verify chronological order
        for (let i = 1; i < data.timeline.length; i++) {
            const prev = new Date(data.timeline[i - 1].timestamp).getTime();
            const curr = new Date(data.timeline[i].timestamp).getTime();
            (0, vitest_1.expect)(curr).toBeGreaterThanOrEqual(prev);
        }
    });
    (0, vitest_1.it)("POST /events/:id/alerts/approve signs off bilingual alert draft", async () => {
        const res = await fetch(`${baseUrl}/events/orange/alerts/approve`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ actorRole: "collector" }),
        });
        (0, vitest_1.expect)(res.status).toBe(200);
        const data = await res.json();
        (0, vitest_1.expect)(data.alert.approvalState).toBe("approved");
        (0, vitest_1.expect)(data.alert.en).toBeDefined();
        (0, vitest_1.expect)(data.alert.ml).toBeDefined();
    });
});
