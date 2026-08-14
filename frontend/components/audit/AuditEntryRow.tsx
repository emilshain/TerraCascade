import { Satellite, FilePlus2, ShieldCheck, CheckCheck, ShieldAlert, Send, CheckCircle2, AlertTriangle } from "lucide-react";
import type { AuditEntry } from "@/lib/types";
import { ROLES } from "@/lib/fixtures/roles";

const EVENT_ICON: Record<AuditEntry["eventType"], typeof Satellite> = {
  source_received: Satellite,
  action_created: FilePlus2,
  approval: ShieldCheck,
  acknowledgement: CheckCheck,
  override: ShieldAlert,
  alert_drafted: Send,
};

const EVENT_LABEL: Record<AuditEntry["eventType"], string> = {
  source_received: "Source received",
  action_created: "Action created",
  approval: "Approval",
  acknowledgement: "Acknowledgement",
  override: "Override",
  alert_drafted: "Alert drafted",
};

function actorLabel(actorRole: AuditEntry["actorRole"]) {
  if (actorRole === "system") return "System (fixture ingest)";
  return ROLES.find((r) => r.id === actorRole)?.shortLabel ?? actorRole;
}

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export function AuditEntryRow({ entry }: { entry: AuditEntry }) {
  const Icon = EVENT_ICON[entry.eventType];
  const isOverride = entry.eventType === "override";

  return (
    <li className="flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className={
            isOverride
              ? "flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600"
              : "flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600"
          }
        >
          <Icon className="h-4 w-4" aria-hidden />
        </div>
        <div className="mt-1 w-px flex-1 bg-gray-200" />
      </div>
      <div className="glass-card mb-4 flex-1 rounded-2xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wide text-gray-400">
            {EVENT_LABEL[entry.eventType]} · {actorLabel(entry.actorRole)}
          </span>
          <span className="text-[11px] font-semibold text-gray-400">{formatTimestamp(entry.timestamp)}</span>
        </div>
        <p className="mt-1.5 text-sm font-semibold text-gray-800">{entry.description}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {entry.protocolTag && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
              [{entry.protocolTag}]
            </span>
          )}
          {entry.validation === "verified" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              <CheckCircle2 className="h-3 w-3" aria-hidden />
              [Verified Action]
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
              <AlertTriangle className="h-3 w-3" aria-hidden />
              [Demo Simulation Override]
            </span>
          )}
        </div>
        {entry.reason && (
          <p className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
            Reason: {entry.reason}
          </p>
        )}
      </div>
    </li>
  );
}
