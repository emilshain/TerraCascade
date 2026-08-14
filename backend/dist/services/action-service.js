"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionService = exports.ActionService = void 0;
const actions_fixtures_js_1 = require("../fixtures/actions-fixtures.js");
const timeline_service_js_1 = require("./timeline-service.js");
const event_service_js_1 = require("./event-service.js");
const VALID_STATUSES = new Set([
    "drafted",
    "awaiting_approval",
    "pending_approval",
    "approved",
    "acknowledged",
    "in_progress",
    "completed",
    "complete",
    "overridden",
]);
function mapStatusToAuditEvent(newStatus, isOverride) {
    if (isOverride)
        return "override";
    switch (newStatus) {
        case "approved":
        case "acknowledged":
            return "approval";
        case "in_progress":
        case "completed":
        case "complete":
            return "acknowledgement";
        default:
            return "status_change";
    }
}
class ActionService {
    actions = [...actions_fixtures_js_1.INITIAL_ACTIONS];
    getActions(filters) {
        let result = [...this.actions];
        if (filters?.eventId) {
            const eventId = filters.eventId === "active" ? event_service_js_1.eventService.getActiveEvent().id : filters.eventId;
            result = result.filter((a) => a.eventId === eventId);
        }
        if (filters?.ownerRole) {
            const roleLower = filters.ownerRole.toLowerCase();
            result = result.filter((a) => a.ownerRole.toLowerCase().includes(roleLower));
        }
        if (filters?.status) {
            result = result.filter((a) => a.status === filters.status);
        }
        if (filters?.attentionRequired !== undefined) {
            result = result.filter((a) => a.attentionRequired === filters.attentionRequired);
        }
        return result;
    }
    getActionById(id) {
        return this.actions.find((a) => a.id === id) || null;
    }
    updateAction(id, updates) {
        const actionIndex = this.actions.findIndex((a) => a.id === id);
        if (actionIndex === -1) {
            throw new Error(`Action with ID '${id}' not found.`);
        }
        const currentAction = this.actions[actionIndex];
        const newStatus = updates.status;
        if (newStatus && !VALID_STATUSES.has(newStatus)) {
            throw new Error(`Invalid status: '${newStatus}'. Valid statuses: ${Array.from(VALID_STATUSES).join(", ")}`);
        }
        const isOverride = Boolean(updates.overrideReason || newStatus === "overridden");
        const actorRole = updates.actorRole || currentAction.ownerRole;
        const updatedAction = {
            ...currentAction,
            ...updates,
            updatedAt: new Date().toISOString(),
        };
        if (newStatus && newStatus !== currentAction.status) {
            const eventType = mapStatusToAuditEvent(newStatus, isOverride);
            const formattedStatus = newStatus.replace(/_/g, " ");
            let desc = `Action "${currentAction.title}" transitioned from ${currentAction.status} to ${formattedStatus}.`;
            if (isOverride) {
                desc = `Action "${currentAction.title}" manually overridden to ${formattedStatus}.`;
            }
            timeline_service_js_1.timelineService.recordEvent({
                actorRole,
                eventType,
                description: desc,
                relatedActionId: currentAction.id,
                reason: updates.overrideReason,
                provenance: `Protocol citation: ${currentAction.protocolSource}`,
            });
        }
        this.actions[actionIndex] = updatedAction;
        return updatedAction;
    }
    resetToInitial() {
        this.actions = [...actions_fixtures_js_1.INITIAL_ACTIONS];
    }
}
exports.ActionService = ActionService;
exports.actionService = new ActionService();
