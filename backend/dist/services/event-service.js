"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventService = exports.EventService = void 0;
const hazard_fixtures_js_1 = require("../fixtures/hazard-fixtures.js");
const timeline_service_js_1 = require("./timeline-service.js");
class EventService {
    activeState = "orange";
    getActiveEvent() {
        return hazard_fixtures_js_1.HAZARD_EVENTS[this.activeState];
    }
    getAllEvents() {
        return Object.values(hazard_fixtures_js_1.HAZARD_EVENTS);
    }
    getEventById(id) {
        if (id === "active") {
            return this.getActiveEvent();
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
        const event = hazard_fixtures_js_1.HAZARD_EVENTS[state];
        timeline_service_js_1.timelineService.recordEvent({
            actorRole,
            eventType: "status_change",
            description: `Active flood incident switched from ${previousState.toUpperCase()} to ${state.toUpperCase()} state.`,
            provenance: "TerraCascade EAP Incident Controller",
        });
        return event;
    }
    getActiveState() {
        return this.activeState;
    }
}
exports.EventService = EventService;
exports.eventService = new EventService();
