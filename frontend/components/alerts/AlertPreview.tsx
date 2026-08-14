"use client";

import { useState } from "react";
import { AlertOctagon, Languages, MapPin } from "lucide-react";
import type { AlertDraft } from "@/lib/types";
import { GlassCard } from "@/components/shared/GlassCard";
import { ALERT_TRANSLATION_NOTE } from "@/lib/fixtures/alerts";

const APPROVAL_LABEL: Record<AlertDraft["approvalState"], string> = {
  draft: "Draft",
  pending_approval: "Pending approval",
  approved: "Approved for authorised publication",
};

export function AlertPreview({
  alert,
  canApprove,
  onApprove,
}: {
  alert: AlertDraft;
  canApprove: boolean;
  onApprove: () => void;
}) {
  const [lang, setLang] = useState<"en" | "ml">("en");
  const copy = alert[lang];

  return (
    <GlassCard tint="red" className="flex flex-col gap-4">
      <div className="flex items-start gap-2 rounded-2xl bg-red-600 px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-white">
        <AlertOctagon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        Draft for authorised publication — not sent
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1 text-[11px] font-bold text-gray-700">
          <MapPin className="h-3.5 w-3.5" aria-hidden />
          {alert.affectedZone}
        </span>
        <span className="rounded-full bg-white/60 px-3 py-1 text-[11px] font-extrabold uppercase text-gray-700">
          {APPROVAL_LABEL[alert.approvalState]}
        </span>
      </div>

      <div className="flex gap-1.5">
        {(["en", "ml"] as const).map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            className={
              lang === code
                ? "rounded-full bg-blue-600 px-4 py-1.5 text-xs font-bold text-white"
                : "rounded-full bg-white/60 px-4 py-1.5 text-xs font-bold text-gray-600"
            }
          >
            {code === "en" ? "English" : "Malayalam"}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-white/70 p-4">
        <h3 className="text-sm font-extrabold text-gray-900">{copy.headline}</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-700">{copy.body}</p>
      </div>

      {lang === "ml" && (
        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-700">
          <Languages className="h-3.5 w-3.5" aria-hidden />
          {ALERT_TRANSLATION_NOTE}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          disabled={!canApprove || alert.approvalState === "approved"}
          onClick={onApprove}
          className="rounded-full bg-gray-900 px-4 py-2 text-xs font-bold text-white disabled:opacity-30"
          title={canApprove ? "Approve for authorised publication" : "Only the Collector / authorised communicator role can approve"}
        >
          {alert.approvalState === "approved" ? "Approved" : "Approve for authorised publication"}
        </button>
      </div>
    </GlassCard>
  );
}
