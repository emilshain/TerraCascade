/**
 * EventService manages flood scenario events using pre-computed
 * Prithvi-100M-sen1floods11 inference outputs with status "verified-demo",
 * "single-timestamp inference", and "not a live feed" limitations.
 */
import type { HazardEvent, EapSeverity } from "../types/index.js";
import { HAZARD_EVENTS } from "../fixtures/hazard-fixtures.js";
import { timelineService } from "./timeline-service.js";

export class EventService {
  private activeState: EapSeverity = "orange";

  public getActiveEvent(): HazardEvent {
    return HAZARD_EVENTS[this.activeState];
  }

  public getAllEvents(): HazardEvent[] {
    return Object.values(HAZARD_EVENTS);
  }

  public getEventById(id: string): HazardEvent | null {
    if (id === "active") {
      return this.getActiveEvent();
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
    const event = HAZARD_EVENTS[state];

    timelineService.recordEvent({
      actorRole,
      eventType: "status_change",
      description: `Active flood incident switched from ${previousState.toUpperCase()} to ${state.toUpperCase()} state.`,
      provenance: "TerraCascade EAP Incident Controller",
    });

    return event;
  }

  public getActiveState(): EapSeverity {
    return this.activeState;
  }
}

export const eventService = new EventService();
