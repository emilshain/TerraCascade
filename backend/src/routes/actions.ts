import { Router } from "express";
import { actionService } from "../services/action-service.js";
import type { ActionStatus } from "../types/index.js";

const router = Router();

/**
 * GET /actions
 * List all actions with optional query filters
 */
router.get("/", (req, res) => {
  const { eventId, ownerRole, status, attentionRequired } = req.query;

  const actions = actionService.getActions({
    eventId: eventId as string | undefined,
    ownerRole: ownerRole as string | undefined,
    status: status as ActionStatus | undefined,
    attentionRequired:
      attentionRequired !== undefined ? attentionRequired === "true" : undefined,
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
  const action = actionService.getActionById(req.params.id);
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
    const { status, overrideReason, actorRole, title, description, dueAt, attentionRequired } =
      req.body;

    const updated = actionService.updateAction(id, {
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
  } catch (err) {
    next(err);
  }
});

export default router;
