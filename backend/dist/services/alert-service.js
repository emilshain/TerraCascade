"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alertService = exports.AlertService = void 0;
const alerts_fixtures_js_1 = require("../fixtures/alerts-fixtures.js");
const timeline_service_js_1 = require("./timeline-service.js");
const event_service_js_1 = require("./event-service.js");
class AlertService {
    alerts = { ...alerts_fixtures_js_1.ALERT_DRAFTS };
    getAlerts(eventId) {
        if (!eventId || eventId === "active") {
            const activeState = event_service_js_1.eventService.getActiveState();
            return [this.alerts[activeState]];
        }
        const state = eventId.replace("hazard-", "").toLowerCase();
        if (this.alerts[state]) {
            return [this.alerts[state]];
        }
        return Object.values(this.alerts);
    }
    getAlertByState(state) {
        return this.alerts[state];
    }
    approveAlert(state, actorRole = "district_authority") {
        const alert = this.alerts[state];
        if (!alert) {
            throw new Error(`Alert for state '${state}' not found.`);
        }
        const updatedAlert = {
            ...alert,
            approvalState: "approved",
        };
        this.alerts[state] = updatedAlert;
        timeline_service_js_1.timelineService.recordEvent({
            actorRole,
            eventType: "approval",
            description: `Public-alert draft for ${state.toUpperCase()} state approved for authorized publication by ${actorRole}.`,
            provenance: "District Authority Public Information Sign-off",
        });
        return updatedAlert;
    }
    resetToInitial() {
        this.alerts = { ...alerts_fixtures_js_1.ALERT_DRAFTS };
    }
}
exports.AlertService = AlertService;
exports.alertService = new AlertService();
