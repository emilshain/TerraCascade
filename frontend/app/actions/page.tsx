"use client";

import { useDemoStore } from "@/lib/store/demo-store";
import { PageHeader } from "@/components/shared/PageHeader";
import { SeverityBadge } from "@/components/shared/SeverityBadge";
import { ActionCard } from "@/components/actions/ActionCard";

export default function ActionBoardPage() {
  const { eapState, actions, role, advanceAction, overrideAction } = useDemoStore();
  const stateActions = actions.filter((a) => a.eapState === eapState);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <PageHeader
        title="Action board"
        description="Drafted → approval → acknowledged → in progress → complete. Every action carries a named owner, approver and Idamalayar EAP citation."
        actions={<SeverityBadge state={eapState} />}
      />
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
    </div>
  );
}
