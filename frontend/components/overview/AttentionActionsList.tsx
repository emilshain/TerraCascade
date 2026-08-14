import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ActionItem, Role } from "@/lib/types";
import { GlassCard } from "@/components/shared/GlassCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { RestrictedNote } from "@/components/shared/RestrictedNote";

export function AttentionActionsList({ actions, role }: { actions: ActionItem[]; role: Role }) {
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
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-gray-500">
          Needs attention
        </h3>
        <Link href="/actions" className="flex items-center gap-1 text-xs font-bold text-blue-600">
          Open action board <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
      <ul className="flex flex-col gap-2">
        {flagged.map((action) => (
          <li
            key={action.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white/60 px-4 py-3"
          >
            <div className="min-w-0">
              {action.restricted && role === "public_observer" ? (
                <RestrictedNote label="Restricted action detail" />
              ) : (
                <>
                  <p className="truncate text-sm font-bold text-gray-800">{action.title}</p>
                  <p className="text-xs text-gray-500">
                    Owner: {action.ownerRole} · Approver: {action.approverRole}
                  </p>
                </>
              )}
            </div>
            <StatusBadge status={action.status} />
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
