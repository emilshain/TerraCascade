"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alertService = exports.AlertService = void 0;
const alerts_fixtures_js_1 = require("../fixtures/alerts-fixtures.js");
const timeline_service_js_1 = require("./timeline-service.js");
const event_service_js_1 = require("./event-service.js");
const sms_service_js_1 = require("./sms-service.js");
const env_js_1 = require("../config/env.js");
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
    async approveAlert(state, actorRole = "district_authority") {
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
        // Send emergency SMS via Twilio to configured numbers (+919539367173, +919074121510)
        const smsMessage = `[TerraCascade EAP ALERT - ${state.toUpperCase()} STATE]\n${alert.en.headline}\n${alert.en.body}\nAffected Zone: ${alert.affectedZone}`;
        const smsResults = await sms_service_js_1.smsService.dispatchAlertSms(smsMessage);
        const successfulDispatches = smsResults.filter((r) => r.success);
        if (successfulDispatches.length > 0) {
            timeline_service_js_1.timelineService.recordEvent({
                actorRole,
                eventType: "approval",
                description: `Twilio Emergency SMS broadcast dispatched to ${successfulDispatches.length} contacts (${successfulDispatches.map((r) => r.recipient).join(", ")}). SIDs: ${successfulDispatches.map((r) => r.messageSid).join(", ")}`,
                provenance: "Twilio REST API SMS Gateway",
            });
        }
        return { alert: updatedAlert, smsResults };
    }
    async dispatchSmsManually(state, customRecipients, actorRole = "district_authority") {
        const alert = this.alerts[state];
        const recipients = customRecipients && customRecipients.length > 0 ? customRecipients : env_js_1.ENV.ALERT_RECIPIENTS;
        const smsMessage = `[TerraCascade EAP ALERT - ${state.toUpperCase()} STATE]\n${alert.en.headline}\n${alert.en.body}\nAffected Zone: ${alert.affectedZone}`;
        const smsResults = await sms_service_js_1.smsService.dispatchAlertSms(smsMessage, recipients);
        const successfulDispatches = smsResults.filter((r) => r.success);
        timeline_service_js_1.timelineService.recordEvent({
            actorRole,
            eventType: "approval",
            description: `Manual Emergency SMS alert triggered via Twilio. Sent to: ${recipients.join(", ")}. Status: ${successfulDispatches.length}/${recipients.length} delivered.`,
            provenance: "Twilio REST API SMS Gateway",
        });
        return smsResults;
    }
    resetToInitial() {
        this.alerts = { ...alerts_fixtures_js_1.ALERT_DRAFTS };
    }
}
exports.AlertService = AlertService;
exports.alertService = new AlertService();
