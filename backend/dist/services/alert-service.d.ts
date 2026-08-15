import type { AlertDraft, EapSeverity } from "../types/index.js";
import { type SmsDispatchResult } from "./sms-service.js";
export declare class AlertService {
    private alerts;
    getAlerts(eventId?: string): AlertDraft[];
    getAlertByState(state: EapSeverity): AlertDraft;
    approveAlert(state: EapSeverity, actorRole?: string): Promise<{
        alert: AlertDraft;
        smsResults: SmsDispatchResult[];
    }>;
    dispatchSmsManually(state: EapSeverity, customRecipients?: string[], actorRole?: string): Promise<SmsDispatchResult[]>;
    resetToInitial(): void;
}
export declare const alertService: AlertService;
