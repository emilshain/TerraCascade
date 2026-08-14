import type { AlertDraft, EapSeverity } from "../types/index.js";
export declare class AlertService {
    private alerts;
    getAlerts(eventId?: string): AlertDraft[];
    getAlertByState(state: EapSeverity): AlertDraft;
    approveAlert(state: EapSeverity, actorRole?: string): AlertDraft;
    resetToInitial(): void;
}
export declare const alertService: AlertService;
