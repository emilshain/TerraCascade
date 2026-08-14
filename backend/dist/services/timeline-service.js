"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timelineService = exports.TimelineService = void 0;
const audit_fixtures_js_1 = require("../fixtures/audit-fixtures.js");
class TimelineService {
    auditLog = [...audit_fixtures_js_1.INITIAL_AUDIT_TIMELINE];
    getTimeline(eventId) {
        if (!eventId) {
            return [...this.auditLog].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        }
        const stateMatch = eventId.replace("hazard-", "").toLowerCase();
        return this.auditLog
            .filter((entry) => {
            if (!entry.relatedActionId && !entry.description)
                return true;
            if (entry.relatedActionId?.includes(stateMatch))
                return true;
            if (entry.description.toLowerCase().includes(stateMatch))
                return true;
            return true; // Keep general context visible in timeline
        })
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
    recordEvent(params) {
        const entry = {
            id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            timestamp: params.timestamp || new Date().toISOString(),
            actorRole: params.actorRole,
            eventType: params.eventType,
            description: params.description,
            relatedActionId: params.relatedActionId,
            reason: params.reason,
            provenance: params.provenance || "TerraCascade EAP Rules Engine",
        };
        this.auditLog.push(entry);
        return entry;
    }
    resetToInitial() {
        this.auditLog = [...audit_fixtures_js_1.INITIAL_AUDIT_TIMELINE];
    }
}
exports.TimelineService = TimelineService;
exports.timelineService = new TimelineService();
