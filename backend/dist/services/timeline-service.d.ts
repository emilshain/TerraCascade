import type { AuditEntry, AuditEventType } from "../types/index.js";
export declare class TimelineService {
    private auditLog;
    getTimeline(eventId?: string): AuditEntry[];
    recordEvent(params: {
        actorRole: string;
        eventType: AuditEventType;
        description: string;
        relatedActionId?: string;
        reason?: string;
        provenance?: string;
        timestamp?: string;
    }): AuditEntry;
    resetToInitial(): void;
}
export declare const timelineService: TimelineService;
