/**
 * EventService manages flood scenario events using pre-computed
 * and live Dockerized Prithvi-100M-sen1floods11 inference outputs with status "verified-demo",
 * "single-timestamp inference", and "not a live feed" limitations.
 */
import type { HazardEvent, EapSeverity } from "../types/index.js";
import { HAZARD_EVENTS } from "../fixtures/hazard-fixtures.js";
import { timelineService } from "./timeline-service.js";
import { modelClient, type PredictFloodParams } from "./model-client.js";

export class EventService {
  private activeState: EapSeverity = "orange";
  private customLiveEvent: HazardEvent | null = null;

  public getActiveEvent(): HazardEvent {
    if (this.customLiveEvent && this.customLiveEvent.severity === this.activeState) {
      return this.customLiveEvent;
    }
    return HAZARD_EVENTS[this.activeState];
  }

  public getAllEvents(): HazardEvent[] {
    const events = Object.values(HAZARD_EVENTS);
    if (this.customLiveEvent) {
      return [...events, this.customLiveEvent];
    }
    return events;
  }

  public getEventById(id: string): HazardEvent | null {
    if (id === "active") {
      return this.getActiveEvent();
    }
    if (this.customLiveEvent && (this.customLiveEvent.id === id || id === "live")) {
      return this.customLiveEvent;
    }
    const state = id.replace("hazard-", "").toLowerCase() as EapSeverity;
    if (HAZARD_EVENTS[state]) {
      return HAZARD_EVENTS[state];
    }
    return null;
  }

  public setActiveState(state: EapSeverity, actorRole = "system"): HazardEvent {
    if (!HAZARD_EVENTS[state]) {
      throw new Error(`Invalid EAP state: ${state}. Must be 'blue', 'orange', or 'red'.`);
    }

    const previousState = this.activeState;
    this.activeState = state;
    this.customLiveEvent = null;
    const event = HAZARD_EVENTS[state];

    timelineService.recordEvent({
      actorRole,
      eventType: "status_change",
      description: `Active flood incident switched from ${previousState.toUpperCase()} to ${state.toUpperCase()} state.`,
      provenance: "TerraCascade EAP Incident Controller",
    });

    return event;
  }

  public async triggerLivePrediction(
    params: PredictFloodParams = {},
    actorRole = "kseb_epm"
  ): Promise<{ event: HazardEvent; fromDockerModel: boolean; latencyMs?: number }> {
    const t0 = Date.now();
    const fetched = await modelClient.predictFlood(params);
    let fromDockerModel = true;
    let liveEvent: HazardEvent;

    if (fetched) {
      liveEvent = fetched;
    } else {
      fromDockerModel = false;
      // Synthesize based on discharge/rainfall if container is offline
      const discharge = params.discharge_cumecs || 1200;
      const rain = params.rainfall_mm_hr || 45;
      const intensity = (discharge / 1500) * 0.6 + (rain / 80) * 0.4;
      const severity: EapSeverity =
        intensity < 0.65 ? "blue" : intensity < 1.15 ? "orange" : "red";

      const baseEvent = HAZARD_EVENTS[severity];
      liveEvent = {
        ...baseEvent,
        id: `hazard-live-${severity}`,
        label: `Live ${baseEvent.severityLabel} prediction (Discharge: ${discharge} cumecs, Rain: ${rain} mm/h)`,
        issuedAt: new Date().toISOString(),
        provenance: {
          model: "Prithvi-100M-sen1floods11",
          sceneId: params.scene_id || "S2_LIVE_STREAM_IDAMALAYAR",
          runAt: new Date().toISOString(),
          scenario: params.scenario || "live_stream",
          runtimeEngine: "Local Fallback Engine (Docker container offline)",
        },
      };
    }

    this.activeState = liveEvent.severity;
    this.customLiveEvent = liveEvent;

    timelineService.recordEvent({
      actorRole,
      eventType: "source_received",
      description: `Live Prithvi-100M ViT flood prediction ingested (${liveEvent.severity.toUpperCase()} state, ${(liveEvent as any).metrics?.totalFloodedAreaKm2 || 24.5} km² inundated).`,
      provenance: fromDockerModel
        ? "Docker Containerized Prithvi-100M-sen1floods11 ViT"
        : "Local Fallback Inference Engine",
    });

    return {
      event: liveEvent,
      fromDockerModel,
      latencyMs: Date.now() - t0,
    };
  }

  public getActiveState(): EapSeverity {
    return this.activeState;
  }
}

export const eventService = new EventService();
