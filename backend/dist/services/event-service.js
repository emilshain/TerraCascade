"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventService = exports.EventService = void 0;
const hazard_fixtures_js_1 = require("../fixtures/hazard-fixtures.js");
const timeline_service_js_1 = require("./timeline-service.js");
const model_client_js_1 = require("./model-client.js");
class EventService {
    activeState = "orange";
    customLiveEvent = null;
    getActiveEvent() {
        if (this.customLiveEvent && this.customLiveEvent.severity === this.activeState) {
            return this.customLiveEvent;
        }
        return hazard_fixtures_js_1.HAZARD_EVENTS[this.activeState];
    }
    getAllEvents() {
        const events = Object.values(hazard_fixtures_js_1.HAZARD_EVENTS);
        if (this.customLiveEvent) {
            return [...events, this.customLiveEvent];
        }
        return events;
    }
    getEventById(id) {
        if (id === "active") {
            return this.getActiveEvent();
        }
        if (this.customLiveEvent && (this.customLiveEvent.id === id || id === "live")) {
            return this.customLiveEvent;
        }
        const state = id.replace("hazard-", "").toLowerCase();
        if (hazard_fixtures_js_1.HAZARD_EVENTS[state]) {
            return hazard_fixtures_js_1.HAZARD_EVENTS[state];
        }
        return null;
    }
    setActiveState(state, actorRole = "system") {
        if (!hazard_fixtures_js_1.HAZARD_EVENTS[state]) {
            throw new Error(`Invalid EAP state: ${state}. Must be 'blue', 'orange', or 'red'.`);
        }
        const previousState = this.activeState;
        this.activeState = state;
        this.customLiveEvent = null;
        const event = hazard_fixtures_js_1.HAZARD_EVENTS[state];
        timeline_service_js_1.timelineService.recordEvent({
            actorRole,
            eventType: "status_change",
            description: `Active flood incident switched from ${previousState.toUpperCase()} to ${state.toUpperCase()} state.`,
            provenance: "TerraCascade EAP Incident Controller",
        });
        return event;
    }
    async triggerLivePrediction(params = {}, actorRole = "kseb_epm") {
        const t0 = Date.now();
        const fetched = await model_client_js_1.modelClient.predictFlood(params);
        let fromDockerModel = true;
        let liveEvent;
        if (fetched) {
            liveEvent = fetched;
        }
        else {
            fromDockerModel = false;
            // Synthesize based on discharge/rainfall if container is offline
            const discharge = params.discharge_cumecs || 1200;
            const rain = params.rainfall_mm_hr || 45;
            const intensity = (discharge / 1500) * 0.6 + (rain / 80) * 0.4;
            const severity = intensity < 0.65 ? "blue" : intensity < 1.15 ? "orange" : "red";
            const baseEvent = hazard_fixtures_js_1.HAZARD_EVENTS[severity];
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
        timeline_service_js_1.timelineService.recordEvent({
            actorRole,
            eventType: "source_received",
            description: `Live Prithvi-100M ViT flood prediction ingested (${liveEvent.severity.toUpperCase()} state, ${liveEvent.metrics?.totalFloodedAreaKm2 || 24.5} km² inundated).`,
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
    getActiveState() {
        return this.activeState;
    }
}
exports.EventService = EventService;
exports.eventService = new EventService();
