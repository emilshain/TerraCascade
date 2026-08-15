"use client";

import { useState } from "react";
import { AlertTriangle, ShieldAlert, User, UserCheck } from "lucide-react";
import { ACTION_STATUS_ORDER, type ActionItem, type ActionStatus, type Role } from "@/lib/types";
import { GlassCard } from "@/components/shared/GlassCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StatusStepper } from "@/components/actions/StatusStepper";
import { ProtocolDrawer } from "@/components/shared/ProtocolDrawer";
import { OverrideModal } from "@/components/actions/OverrideModal";
import { roleCanActOn } from "@/lib/store/demo-store";

export function ActionCard({
  action,
  role,
  onAdvance,
  onOverride,
}: {
  action: ActionItem;
  role: Role;
  onAdvance: (id: string) => void;
  onOverride: (id: string, status: ActionStatus, reason: string) => void;
}) {
  const [overrideOpen, setOverrideOpen] = useState(false);
  const canAct = roleCanActOn(role, action.ownerRole) || roleCanActOn(role, action.approverRole);
  const isLast = action.status === ACTION_STATUS_ORDER[ACTION_STATUS_ORDER.length - 1];

  return (
    <GlassCard id={`action-${action.id}`} className={action.attentionRequired && action.status !== "complete" ? "border-2 !border-amber-300" : undefined}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {action.attentionRequired && action.status !== "complete" && (
              <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden />
            )}
            <h3 className="text-base font-extrabold text-gray-900">{action.title}</h3>
          </div>
          <p className="mt-1 text-sm text-gray-600">{action.description}</p>
        </div>
        <StatusBadge status={action.status} />
      </div>

      <div className="mt-4">
        <StatusStepper status={action.status} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-2 rounded-2xl bg-white/60 px-3 py-2 text-xs font-semibold text-gray-700">
          <User className="h-3.5 w-3.5 text-blue-600" aria-hidden />
          Owner: {action.ownerRole}
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-white/60 px-3 py-2 text-xs font-semibold text-gray-700">
          <UserCheck className="h-3.5 w-3.5 text-blue-600" aria-hidden />
          Approver: {action.approverRole}
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-2xl bg-white/50 px-4 py-3 text-xs text-gray-600">
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden />
        {action.authorityBoundary}
      </div>

      <div className="mt-4">
        <ProtocolDrawer protocolSource={action.protocolSource} />
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          disabled={!canAct}
          onClick={() => setOverrideOpen(true)}
          className="rounded-full border border-red-200 px-4 py-2 text-xs font-bold text-red-600 disabled:opacity-30 transition-all hover:bg-red-50 active:scale-95"
          title={canAct ? "Manually set a status with a reason" : "Only the owner or approver role can override"}
        >
          Override
        </button>
        <button
          type="button"
          disabled={!canAct || isLast}
          onClick={() => onAdvance(action.id)}
          className="rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-30 transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95"
          title={canAct ? "Advance to the next workflow stage" : "Only the owner or approver role can advance this action"}
        >
          {isLast ? "Complete" : "Advance"}
        </button>
      </div>

      {overrideOpen && (
        <OverrideModal
          action={action}
          onClose={() => setOverrideOpen(false)}
          onSubmit={(status, reason) => onOverride(action.id, status, reason)}
        />
      )}
    </GlassCard>
  );
}
