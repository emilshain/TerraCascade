"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_service_js_1 = require("../services/event-service.js");
const action_service_js_1 = require("../services/action-service.js");
const impact_service_js_1 = require("../services/impact-service.js");
const timeline_service_js_1 = require("../services/timeline-service.js");
const alert_service_js_1 = require("../services/alert-service.js");
const router = (0, express_1.Router)();
/**
 * GET /events/active
 * The flood demo event, including the Prithvi-derived flood-extent geometry
 */
router.get("/active", (_req, res) => {
    const activeEvent = event_service_js_1.eventService.getActiveEvent();
    res.json(activeEvent);
});
/**
 * GET /events
 * All available flood scenario events (blue, orange, red)
 */
router.get("/", (_req, res) => {
    const events = event_service_js_1.eventService.getAllEvents();
    res.json({
        activeState: event_service_js_1.eventService.getActiveState(),
        count: events.length,
        events,
    });
});
/**
 * POST /events/active/state
 * Switch active flood scenario state
 */
router.post("/active/state", (req, res, next) => {
    try {
        const { state, actorRole } = req.body;
        if (!state || !["blue", "orange", "red"].includes(state)) {
            res.status(400).json({
                error: "ValidationError",
                message: "Invalid state. Must be 'blue', 'orange', or 'red'.",
            });
            return;
        }
        const event = event_service_js_1.eventService.setActiveState(state, actorRole);
        res.json({
            message: `Active scenario switched to ${state.toUpperCase()}.`,
            activeState: state,
            event,
        });
    }
    catch (err) {
        next(err);
    }
});
/**
 * GET /events/:id
 * Retrieve specific flood scenario event
 */
router.get("/:id", (req, res) => {
    const event = event_service_js_1.eventService.getEventById(req.params.id);
    if (!event) {
        res.status(404).json({
            error: "NotFound",
            message: `Hazard event '${req.params.id}' not found.`,
        });
        return;
    }
    res.json(event);
});
/**
 * GET /events/:id/actions
 * Role-specific actions with protocol citations
 */
router.get("/:id/actions", (req, res) => {
    const { id } = req.params;
    const role = req.query.role;
    let eventId = id;
    if (id === "active") {
        eventId = event_service_js_1.eventService.getActiveEvent().id;
    }
    else if (!id.startsWith("hazard-")) {
        eventId = `hazard-${id.toLowerCase()}`;
    }
    const actions = action_service_js_1.actionService.getActions({
        eventId,
        ownerRole: role,
    });
    res.json({
        eventId,
        count: actions.length,
        actions,
    });
});
/**
 * GET /events/:id/impact
 * Assets, dependency edges, evidence labels and priority
 */
router.get("/:id/impact", (req, res) => {
    const { id } = req.params;
    const impact = impact_service_js_1.impactService.getImpactGraph(id);
    res.json(impact);
});
/**
 * GET /events/:id/timeline
 * Ordered audit/activity timeline
 */
router.get("/:id/timeline", (req, res) => {
    const { id } = req.params;
    const timeline = timeline_service_js_1.timelineService.getTimeline(id);
    res.json({
        eventId: id,
        count: timeline.length,
        timeline,
    });
});
/**
 * GET /events/:id/resources
 * Resource pools (fuel, boats, generators, teams)
 */
router.get("/:id/resources", (_req, res) => {
    const resources = impact_service_js_1.impactService.getResourcePools();
    res.json({
        count: resources.length,
        resources,
    });
});
/**
 * GET /events/:id/alerts
 * Bilingual alert preview drafts
 */
router.get("/:id/alerts", (req, res) => {
    const { id } = req.params;
    const alerts = alert_service_js_1.alertService.getAlerts(id);
    res.json({
        eventId: id,
        alerts,
    });
});
/**
 * POST /events/:id/alerts/approve
 * Sign-off and approve bilingual alert draft
 */
router.post("/:id/alerts/approve", (req, res, next) => {
    try {
        const { id } = req.params;
        const { actorRole } = req.body;
        let state;
        if (id === "active") {
            state = event_service_js_1.eventService.getActiveState();
        }
        else {
            state = id.replace("hazard-", "").toLowerCase();
        }
        if (!["blue", "orange", "red"].includes(state)) {
            res.status(400).json({
                error: "ValidationError",
                message: `Invalid state '${state}' for alert approval.`,
            });
            return;
        }
        const approvedAlert = alert_service_js_1.alertService.approveAlert(state, actorRole);
        res.json({
            message: `Alert draft for ${state.toUpperCase()} state approved for authorized publication.`,
            alert: approvedAlert,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
