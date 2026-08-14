import type { AuditEntry, AuditEventType } from "../types/index.js";
import { INITIAL_AUDIT_TIMELINE } from "../fixtures/audit-fixtures.js";

export class TimelineService {
  private auditLog: AuditEntry[] = [...INITIAL_AUDIT_TIMELINE];

  public getTimeline(eventId?: string): AuditEntry[] {
    if (!eventId) {
      return [...this.auditLog].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    }

    const stateMatch = eventId.replace("hazard-", "").toLowerCase();
    return this.auditLog
      .filter((entry) => {
        if (!entry.relatedActionId && !entry.description) return true;
        if (entry.relatedActionId?.includes(stateMatch)) return true;
        if (entry.description.toLowerCase().includes(stateMatch)) return true;
        return true; // Keep general context visible in timeline
      })
      .sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
  }

  public recordEvent(params: {
    actorRole: string;
    eventType: AuditEventType;
    description: string;
    relatedActionId?: string;
    reason?: string;
    provenance?: string;
    timestamp?: string;
  }): AuditEntry {
    const entry: AuditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: params.timestamp || new Date().toISOString(),
      actorRole: params.actorRole,
      eventType: params.eventType,
      description: params.description,
      relatedActionId: params.relatedActionId,
      reason: params.reason,
      provenance: params.provenance || "TerraCascade EAP Rules Engine",
    };

    this.auditLog.push(entry);
    return entry;
  }

  public resetToInitial(): void {
    this.auditLog = [...INITIAL_AUDIT_TIMELINE];
  }
}

export const timelineService = new TimelineService();
