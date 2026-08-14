"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const action_service_js_1 = require("../services/action-service.js");
const router = (0, express_1.Router)();
/**
 * GET /actions
 * List all actions with optional query filters
 */
router.get("/", (req, res) => {
    const { eventId, ownerRole, status, attentionRequired } = req.query;
    const actions = action_service_js_1.actionService.getActions({
        eventId: eventId,
        ownerRole: ownerRole,
        status: status,
        attentionRequired: attentionRequired !== undefined ? attentionRequired === "true" : undefined,
    });
    res.json({
        count: actions.length,
        actions,
    });
});
/**
 * GET /actions/:id
 * Retrieve a single action by ID
 */
router.get("/:id", (req, res) => {
    const action = action_service_js_1.actionService.getActionById(req.params.id);
    if (!action) {
        res.status(404).json({
            error: "NotFound",
            message: `Action with ID '${req.params.id}' not found.`,
        });
        return;
    }
    res.json(action);
});
/**
 * PATCH /actions/:id
 * Valid status transition and audit entry
 */
router.patch("/:id", (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, overrideReason, actorRole, title, description, dueAt, attentionRequired } = req.body;
        const updated = action_service_js_1.actionService.updateAction(id, {
            status,
            overrideReason,
            actorRole,
            title,
            description,
            dueAt,
            attentionRequired,
        });
        res.json({
            message: `Action '${id}' updated successfully.`,
            action: updated,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
