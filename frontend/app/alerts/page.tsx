"use client";

import { useDemoStore } from "@/lib/store/demo-store";
import { PageHeader } from "@/components/shared/PageHeader";
import { SeverityBadge } from "@/components/shared/SeverityBadge";
import { AlertPreview } from "@/components/alerts/AlertPreview";

export default function AlertComposerPage() {
  const { eapState, alerts, role, approveAlert } = useDemoStore();
  const alert = alerts[eapState];
  const canApprove = role === "district_authority";

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <PageHeader
        title="Alert composer"
        description="Every draft below is explicitly labeled draft for authorised publication. TerraCascade never sends an alert — only a Collector or authorised communicator can approve one."
        actions={<SeverityBadge state={eapState} />}
      />
      <AlertPreview
        alert={alert}
        canApprove={canApprove}
        onApprove={() => approveAlert(eapState)}
      />
      {!canApprove && (
        <p className="text-center text-xs font-semibold text-gray-400">
          Switch to the District Authority role to approve this draft.
        </p>
      )}
    </div>
  );
}
