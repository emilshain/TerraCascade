"use client";

import { ShieldAlert } from "lucide-react";
import { useDemoStore } from "@/lib/store/demo-store";
import { AlertPreview } from "@/components/alerts/AlertPreview";

export function CollectorDashboard() {
  const { eapState, alerts, role, approveAlert } = useDemoStore();
  const alert = alerts[eapState];
  const canApprove = role === "district_collector";

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex items-start gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-xs font-bold text-white">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden />
        WARNING: This interface drafts alerts for authorized emergency networks. No message will be
        broadcast without physical magistrate authentication.
      </div>

      <AlertPreview alert={alert} canApprove={canApprove} onApprove={() => approveAlert(eapState)} />
    </div>
  );
}
