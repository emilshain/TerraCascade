import { Router } from "express";
import { eventService } from "../services/event-service.js";
import { actionService } from "../services/action-service.js";
import { impactService } from "../services/impact-service.js";
import { timelineService } from "../services/timeline-service.js";
import { alertService } from "../services/alert-service.js";
import { modelClient } from "../services/model-client.js";
import type { EapSeverity } from "../types/index.js";

const router = Router();

/**
 * GET /events/model-status
 * Check connection and health of the Dockerized Prithvi model service
 */
router.get("/model-status", async (_req, res) => {
  const status = await modelClient.getStatus();
  res.json(status);
});

/**
 * POST /events/live-predict
 * Trigger live flood prediction from the Docker model service,
 * update active event, and register timeline audit entry
 */
router.post("/live-predict", async (req, res, next) => {
  try {
    const { discharge_cumecs, rainfall_mm_hr, scene_id, scenario, actorRole } = req.body || {};
    
    const result = await eventService.triggerLivePrediction(
      {
        discharge_cumecs: discharge_cumecs ? parseFloat(discharge_cumecs) : undefined,
        rainfall_mm_hr: rainfall_mm_hr ? parseFloat(rainfall_mm_hr) : undefined,
        scene_id,
        scenario,
      },
      actorRole || "kseb_epm"
    );

    res.json({
      message: "Live flood inference executed successfully.",
      event: result.event,
      fromDockerModel: result.fromDockerModel,
      latencyMs: result.latencyMs,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /events/active
 * The flood demo event, including the Prithvi-derived flood-extent geometry
 */
router.get("/active", (_req, res) => {
  const activeEvent = eventService.getActiveEvent();
  res.json(activeEvent);
});

/**
 * GET /events
 * All available flood scenario events (blue, orange, red)
 */
router.get("/", (_req, res) => {
  const events = eventService.getAllEvents();
  res.json({
    activeState: eventService.getActiveState(),
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

    const event = eventService.setActiveState(state as EapSeverity, actorRole);
    res.json({
      message: `Active scenario switched to ${state.toUpperCase()}.`,
      activeState: state,
      event,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /events/:id
 * Retrieve specific flood scenario event
 */
router.get("/:id", (req, res) => {
  const event = eventService.getEventById(req.params.id);
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
  const role = req.query.role as string | undefined;

  let eventId = id;
  if (id === "active") {
    eventId = eventService.getActiveEvent().id;
  } else if (!id.startsWith("hazard-")) {
    eventId = `hazard-${id.toLowerCase()}`;
  }

  const actions = actionService.getActions({
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
  const impact = impactService.getImpactGraph(id);
  res.json(impact);
});

/**
 * GET /events/:id/timeline
 * Ordered audit/activity timeline
 */
router.get("/:id/timeline", (req, res) => {
  const { id } = req.params;
  const timeline = timelineService.getTimeline(id);
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
  const resources = impactService.getResourcePools();
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
  const alerts = alertService.getAlerts(id);
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

    let state: EapSeverity;
    if (id === "active") {
      state = eventService.getActiveState();
    } else {
      state = id.replace("hazard-", "").toLowerCase() as EapSeverity;
    }

    if (!["blue", "orange", "red"].includes(state)) {
      res.status(400).json({
        error: "ValidationError",
        message: `Invalid state '${state}' for alert approval.`,
      });
      return;
    }

    const approvedAlert = alertService.approveAlert(state, actorRole);
    res.json({
      message: `Alert draft for ${state.toUpperCase()} state approved for authorized publication.`,
      alert: approvedAlert,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
