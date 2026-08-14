import { AlertTriangle, Clock, Gauge } from "lucide-react";
import type { HazardEvent } from "@/lib/types";
import { GlassCard } from "@/components/shared/GlassCard";
import { SeverityBadge } from "@/components/shared/SeverityBadge";
import { ProvenanceTag } from "@/components/shared/ProvenanceTag";
import { ProtocolDrawer } from "@/components/shared/ProtocolDrawer";

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function HazardSummaryCard({ hazard }: { hazard: HazardEvent }) {
  const tint = hazard.eapState === "red" ? "red" : hazard.eapState === "orange" ? "orange" : "blue";

  return (
    <GlassCard tint={tint} className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SeverityBadge state={hazard.eapState} />
        <ProvenanceTag source={hazard.source.model} sceneDate={hazard.source.sceneDate} />
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
          {hazard.severityLabel} · {hazard.hazardType}
        </p>
        <h2 className="mt-1 text-xl font-extrabold text-gray-900">{hazard.label}</h2>
        <p className="mt-1 text-sm text-gray-600">{hazard.source.aoi}</p>
      </div>

      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-white/60 px-4 py-3">
          <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-400">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            Received
          </dt>
          <dd className="mt-1 text-sm font-bold text-gray-800">{formatTimestamp(hazard.timestampReceived)}</dd>
        </div>
        <div className="rounded-2xl bg-white/60 px-4 py-3">
          <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-400">
            <Gauge className="h-3.5 w-3.5" aria-hidden />
            Confidence
          </dt>
          <dd className="mt-1 text-sm font-bold text-gray-800">
            {Math.round(hazard.confidence * 100)}% — {hazard.confidenceLabel}
          </dd>
        </div>
        <div className="rounded-2xl bg-white/60 px-4 py-3">
          <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-400">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
            Status
          </dt>
          <dd className="mt-1 text-sm font-bold text-gray-800">{hazard.status}</dd>
        </div>
      </dl>

      <div className="rounded-2xl bg-white/50 px-4 py-3 text-xs text-gray-600">
        <p className="font-bold uppercase tracking-wide text-[10px] text-gray-400">Limitations</p>
        <ul className="mt-1 list-inside list-disc space-y-0.5">
          {hazard.limitations.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </div>

      <ProtocolDrawer protocolSource={hazard.protocolSource} />
    </GlassCard>
  );
}
