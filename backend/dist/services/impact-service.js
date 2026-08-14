"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.impactService = exports.ImpactService = void 0;
const impact_fixtures_js_1 = require("../fixtures/impact-fixtures.js");
const event_service_js_1 = require("./event-service.js");
class ImpactService {
    getImpactGraph(eventId) {
        const event = eventId && eventId !== "active" ? event_service_js_1.eventService.getEventById(eventId) : event_service_js_1.eventService.getActiveEvent();
        const severity = event ? event.severity : event_service_js_1.eventService.getActiveState();
        // Adjust blocked/at-risk states dynamically based on severity if required
        const assets = impact_fixtures_js_1.IMPACT_ASSETS.map((asset) => {
            if (asset.id === "asset-road-bridge-segment") {
                return {
                    ...asset,
                    blocked: severity !== "blue",
                };
            }
            return asset;
        });
        const cascadeNodes = impact_fixtures_js_1.CASCADE_NODES.map((node) => {
            if (node.id === "cn-school-capacity") {
                return {
                    ...node,
                    status: severity === "red" ? "at_risk" : "nominal",
                };
            }
            return node;
        });
        return {
            eventId: event ? event.id : `hazard-${severity}`,
            severity,
            source: "TerraCascade Downstream Impact Model & Infrastructure Graph",
            status: "verified-demo",
            limitations: [
                "Modeled cascade graph for demo scenario",
                "Not validated engineering data by PWD/KSEB",
                "Releases framed as rule-curve context, not live telemetry",
            ],
            assets,
            cascadeNodes,
            edges: impact_fixtures_js_1.DEPENDENCY_EDGES,
            resourcePools: impact_fixtures_js_1.RESOURCE_POOLS,
        };
    }
    getResourcePools() {
        return impact_fixtures_js_1.RESOURCE_POOLS;
    }
}
exports.ImpactService = ImpactService;
exports.impactService = new ImpactService();
