/**
 * EventService manages flood scenario events using pre-computed
 * Prithvi-100M-sen1floods11 inference outputs with status "verified-demo",
 * "single-timestamp inference", and "not a live feed" limitations.
 */
import type { HazardEvent, EapSeverity } from "../types/index.js";
export declare class EventService {
    private activeState;
    getActiveEvent(): HazardEvent;
    getAllEvents(): HazardEvent[];
    getEventById(id: string): HazardEvent | null;
    setActiveState(state: EapSeverity, actorRole?: string): HazardEvent;
    getActiveState(): EapSeverity;
}
export declare const eventService: EventService;
