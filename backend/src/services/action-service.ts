import type { Action, ActionStatus, AuditEventType } from "../types/index.js";
import { INITIAL_ACTIONS } from "../fixtures/actions-fixtures.js";
import { timelineService } from "./timeline-service.js";
import { eventService } from "./event-service.js";

const VALID_STATUSES: Set<ActionStatus> = new Set([
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

function mapStatusToAuditEvent(newStatus: ActionStatus, isOverride: boolean): AuditEventType {
  if (isOverride) return "override";
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

export class ActionService {
  private actions: Action[] = [...INITIAL_ACTIONS];

  public getActions(filters?: {
    eventId?: string;
    ownerRole?: string;
    status?: ActionStatus;
    attentionRequired?: boolean;
  }): Action[] {
    let result = [...this.actions];

    if (filters?.eventId) {
      const eventId = filters.eventId === "active" ? eventService.getActiveEvent().id : filters.eventId;
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

  public getActionById(id: string): Action | null {
    return this.actions.find((a) => a.id === id) || null;
  }

  public updateAction(
    id: string,
    updates: {
      status?: ActionStatus;
      overrideReason?: string;
      actorRole?: string;
      title?: string;
      description?: string;
      dueAt?: string;
      attentionRequired?: boolean;
    }
  ): Action {
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

    const updatedAction: Action = {
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

      timelineService.recordEvent({
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

  public resetToInitial(): void {
    this.actions = [...INITIAL_ACTIONS];
  }
}

export const actionService = new ActionService();
