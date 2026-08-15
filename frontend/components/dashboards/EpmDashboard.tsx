"use client";

import { useDemoStore } from "@/lib/store/demo-store";
import { HazardSummaryCard } from "@/components/overview/HazardSummaryCard";
import { ActionStats } from "@/components/overview/ActionStats";
import { AttentionActionsList } from "@/components/overview/AttentionActionsList";
import { ActionCard } from "@/components/actions/ActionCard";
import { LiveModelTrigger } from "@/components/shared/LiveModelTrigger";

export function EpmDashboard() {
  const { eapState, actions, role, advanceAction, overrideAction, activeHazard } = useDemoStore();
  const stateActions = actions
    .filter((a) => a.eapState === eapState)
    .sort((a, b) => {
      if (a.status === "complete" && b.status !== "complete") return 1;
      if (a.status !== "complete" && b.status === "complete") return -1;
      return 0;
    });

  return (
    <div className="flex flex-col gap-6">
      <LiveModelTrigger />

      <div>
        <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-gray-400">
          Active EAP incident & prediction
        </p>
        <HazardSummaryCard hazard={activeHazard} />
      </div>

      <ActionStats actions={stateActions} />
      <AttentionActionsList actions={stateActions} />

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-gray-500">
          Interactive EAP action board
        </h2>
        <div className="flex flex-col gap-4">
          {stateActions.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              role={role}
              onAdvance={advanceAction}
              onOverride={overrideAction}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
