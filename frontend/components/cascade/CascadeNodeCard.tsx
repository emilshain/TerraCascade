import { AlertOctagon, Ban, ShieldCheck } from "lucide-react";
import type { CascadeNode } from "@/lib/types";
import { GlassCard } from "@/components/shared/GlassCard";
import { cn } from "@/lib/cn";

const RISK_STYLE: Record<CascadeNode["riskLabel"], string> = {
  low: "glass-emerald",
  medium: "glass-amber",
  high: "glass-orange",
  critical: "glass-red glow-red",
};

const STATUS_ICON: Record<CascadeNode["status"], typeof ShieldCheck> = {
  nominal: ShieldCheck,
  at_risk: AlertOctagon,
  blocked: Ban,
};

const STATUS_LABEL: Record<CascadeNode["status"], string> = {
  nominal: "Nominal",
  at_risk: "At risk",
  blocked: "Blocked",
};

const KIND_LABEL: Record<CascadeNode["kind"], string> = {
  trigger: "Trigger",
  infrastructure: "Infrastructure",
  route: "Route",
  asset: "Asset",
};

export function CascadeNodeCard({
  node,
  dependencyLabels,
}: {
  node: CascadeNode;
  dependencyLabels: string[];
}) {
  const StatusIcon = STATUS_ICON[node.status];

  return (
    <GlassCard className="flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{KIND_LABEL[node.kind]}</p>
          <h3 className="mt-0.5 text-sm font-extrabold text-gray-900">{node.label}</h3>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase",
            RISK_STYLE[node.riskLabel]
          )}
        >
          {node.riskLabel} risk
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
        <StatusIcon className="h-3.5 w-3.5" aria-hidden />
        {STATUS_LABEL[node.status]}
      </div>

      {dependencyLabels.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500">
          <span className="font-bold uppercase tracking-wide text-gray-400">Depends on:</span>
          {dependencyLabels.map((label) => (
            <span key={label} className="rounded-full bg-gray-100 px-2 py-0.5 font-semibold text-gray-600">
              {label}
            </span>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-600">{node.note}</p>
    </GlassCard>
  );
}
