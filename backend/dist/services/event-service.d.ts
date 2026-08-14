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
