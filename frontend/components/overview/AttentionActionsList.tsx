import { AlertOctagon } from "lucide-react";
import type { ActionItem } from "@/lib/types";
import { GlassCard } from "@/components/shared/GlassCard";
import { StatusBadge } from "@/components/shared/StatusBadge";

export function AttentionActionsList({ actions }: { actions: ActionItem[] }) {
  const flagged = actions.filter((a) => a.attentionRequired && a.status !== "complete");

  if (flagged.length === 0) {
    return (
      <GlassCard tint="emerald" className="text-sm font-semibold text-emerald-800">
        No actions currently need attention for this EAP state.
      </GlassCard>
    );
  }

  return (
    <GlassCard className="flex flex-col gap-3">
      <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-gray-500">
        <AlertOctagon className="h-4 w-4 text-amber-600" aria-hidden />
        Needs attention
      </h3>
      <ul className="flex flex-col gap-2">
        {flagged.map((action) => (
          <li
            key={action.id}
            onClick={() => document.getElementById(`action-${action.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="stagger-item cursor-pointer flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white/60 px-4 py-3 transition-all hover:bg-white hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-gray-800">{action.title}</p>
              <p className="text-xs text-gray-500">
                Owner: {action.ownerRole} · Approver: {action.approverRole}
              </p>
            </div>
            <StatusBadge status={action.status} />
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
