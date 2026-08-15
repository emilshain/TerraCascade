/**
 * EventService manages flood scenario events using pre-computed
 * and live Dockerized Prithvi-100M-sen1floods11 inference outputs with status "verified-demo",
 * "single-timestamp inference", and "not a live feed" limitations.
 */
import type { HazardEvent, EapSeverity } from "../types/index.js";
import { type PredictFloodParams } from "./model-client.js";
import { type SmsDispatchResult } from "./sms-service.js";
export declare class EventService {
    private activeState;
    private customLiveEvent;
    getActiveEvent(): HazardEvent;
    getAllEvents(): HazardEvent[];
    getEventById(id: string): HazardEvent | null;
    setActiveState(state: EapSeverity, actorRole?: string): HazardEvent;
    triggerLivePrediction(params?: PredictFloodParams, actorRole?: string): Promise<{
        event: HazardEvent;
        fromDockerModel: boolean;
        latencyMs?: number;
        smsResults?: SmsDispatchResult[];
    }>;
    getActiveState(): EapSeverity;
}
export declare const eventService: EventService;
