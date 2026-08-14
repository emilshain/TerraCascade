import type { AlertDraft, EapSeverity } from "../types/index.js";
import { ALERT_DRAFTS } from "../fixtures/alerts-fixtures.js";
import { timelineService } from "./timeline-service.js";
import { eventService } from "./event-service.js";

export class AlertService {
  private alerts: Record<EapSeverity, AlertDraft> = { ...ALERT_DRAFTS };

  public getAlerts(eventId?: string): AlertDraft[] {
    if (!eventId || eventId === "active") {
      const activeState = eventService.getActiveState();
      return [this.alerts[activeState]];
    }

    const state = eventId.replace("hazard-", "").toLowerCase() as EapSeverity;
    if (this.alerts[state]) {
      return [this.alerts[state]];
    }
    return Object.values(this.alerts);
  }

  public getAlertByState(state: EapSeverity): AlertDraft {
    return this.alerts[state];
  }

  public approveAlert(state: EapSeverity, actorRole = "district_authority"): AlertDraft {
    const alert = this.alerts[state];
    if (!alert) {
      throw new Error(`Alert for state '${state}' not found.`);
    }

    const updatedAlert: AlertDraft = {
      ...alert,
      approvalState: "approved",
    };

    this.alerts[state] = updatedAlert;

    timelineService.recordEvent({
      actorRole,
      eventType: "approval",
      description: `Public-alert draft for ${state.toUpperCase()} state approved for authorized publication by ${actorRole}.`,
      provenance: "District Authority Public Information Sign-off",
    });

    return updatedAlert;
  }

  public resetToInitial(): void {
    this.alerts = { ...ALERT_DRAFTS };
  }
}

export const alertService = new AlertService();
