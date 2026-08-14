"use client";

import { useDemoStore } from "@/lib/store/demo-store";
import { HAZARD_EVENTS } from "@/lib/fixtures/hazard";
import { PageHeader } from "@/components/shared/PageHeader";
import { HazardSummaryCard } from "@/components/overview/HazardSummaryCard";
import { ActionStats } from "@/components/overview/ActionStats";
import { AttentionActionsList } from "@/components/overview/AttentionActionsList";
import { QuickLinks } from "@/components/overview/QuickLinks";

export default function CommandOverviewPage() {
  const { eapState, actions, role } = useDemoStore();
  const hazard = HAZARD_EVENTS[eapState];
  const stateActions = actions.filter((a) => a.eapState === eapState);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Command overview"
        description="Idamalayar EAP flood scenario — verified-demo fixture data. Switch the EAP state or role above to explore Blue, Orange and Red."
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <HazardSummaryCard hazard={hazard} />
        </div>
        <div className="flex flex-col gap-6">
          <QuickLinks />
        </div>
      </div>
      <ActionStats actions={stateActions} />
      <AttentionActionsList actions={stateActions} role={role} />
    </div>
  );
}
