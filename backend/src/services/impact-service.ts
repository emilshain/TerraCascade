import type { ImpactGraphResponse, EapSeverity } from "../types/index.js";
import {
  IMPACT_ASSETS,
  CASCADE_NODES,
  DEPENDENCY_EDGES,
  RESOURCE_POOLS,
} from "../fixtures/impact-fixtures.js";
import { eventService } from "./event-service.js";

export class ImpactService {
  public getImpactGraph(eventId?: string): ImpactGraphResponse {
    const event = eventId && eventId !== "active" ? eventService.getEventById(eventId) : eventService.getActiveEvent();
    const severity: EapSeverity = event ? event.severity : eventService.getActiveState();

    // Adjust blocked/at-risk states dynamically based on severity if required
    const assets = IMPACT_ASSETS.map((asset) => {
      if (asset.id === "asset-road-bridge-segment") {
        return {
          ...asset,
          blocked: severity !== "blue",
        };
      }
      return asset;
    });

    const cascadeNodes = CASCADE_NODES.map((node) => {
      if (node.id === "cn-school-capacity") {
        return {
          ...node,
          status: severity === "red" ? ("at_risk" as const) : ("nominal" as const),
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
      edges: DEPENDENCY_EDGES,
      resourcePools: RESOURCE_POOLS,
    };
  }

  public getResourcePools() {
    return RESOURCE_POOLS;
  }
}

export const impactService = new ImpactService();
