"use client";

import { useDemoStore } from "@/lib/store/demo-store";
import { PageHeader } from "@/components/shared/PageHeader";
import { AuditEntryRow } from "@/components/audit/AuditEntryRow";

export default function AuditTimelinePage() {
  const { auditLog } = useDemoStore();
  const sorted = [...auditLog].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <PageHeader
        title="Audit timeline"
        description="Source received, actions created, approvals, acknowledgements and overrides — the full trail across Blue, Orange and Red states for this demo scenario."
      />
      <ol className="flex flex-col">
        {sorted.map((entry) => (
          <AuditEntryRow key={entry.id} entry={entry} />
        ))}
      </ol>
    </div>
  );
}
