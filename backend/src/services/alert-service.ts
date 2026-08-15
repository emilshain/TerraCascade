import type { AlertDraft, EapSeverity } from "../types/index.js";
import { ALERT_DRAFTS } from "../fixtures/alerts-fixtures.js";
import { timelineService } from "./timeline-service.js";
import { eventService } from "./event-service.js";
import { smsService, type SmsDispatchResult } from "./sms-service.js";
import { ENV } from "../config/env.js";

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

  public async approveAlert(state: EapSeverity, actorRole = "district_authority"): Promise<{ alert: AlertDraft; smsResults: SmsDispatchResult[] }> {
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

    // Send emergency SMS via Twilio to configured numbers (+919539367173, +919074121510)
    const smsMessage = `[TerraCascade EAP ALERT - ${state.toUpperCase()} STATE]\n${alert.en.headline}\n${alert.en.body}\nAffected Zone: ${alert.affectedZone}`;
    const smsResults = await smsService.dispatchAlertSms(smsMessage);

    const successfulDispatches = smsResults.filter((r) => r.success);
    if (successfulDispatches.length > 0) {
      timelineService.recordEvent({
        actorRole,
        eventType: "approval",
        description: `Twilio Emergency SMS broadcast dispatched to ${successfulDispatches.length} contacts (${successfulDispatches.map((r) => r.recipient).join(", ")}). SIDs: ${successfulDispatches.map((r) => r.messageSid).join(", ")}`,
        provenance: "Twilio REST API SMS Gateway",
      });
    }

    return { alert: updatedAlert, smsResults };
  }

  public async dispatchSmsManually(
    state: EapSeverity,
    customRecipients?: string[],
    actorRole = "district_authority"
  ): Promise<SmsDispatchResult[]> {
    const alert = this.alerts[state];
    const recipients = customRecipients && customRecipients.length > 0 ? customRecipients : ENV.ALERT_RECIPIENTS;
    const smsMessage = `[TerraCascade EAP ALERT - ${state.toUpperCase()} STATE]\n${alert.en.headline}\n${alert.en.body}\nAffected Zone: ${alert.affectedZone}`;
    
    const smsResults = await smsService.dispatchAlertSms(smsMessage, recipients);

    const successfulDispatches = smsResults.filter((r) => r.success);
    timelineService.recordEvent({
      actorRole,
      eventType: "approval",
      description: `Manual Emergency SMS alert triggered via Twilio. Sent to: ${recipients.join(", ")}. Status: ${successfulDispatches.length}/${recipients.length} delivered.`,
      provenance: "Twilio REST API SMS Gateway",
    });

    return smsResults;
  }

  public resetToInitial(): void {
    this.alerts = { ...ALERT_DRAFTS };
  }
}

export const alertService = new AlertService();

