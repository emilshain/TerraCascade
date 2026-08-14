import { CheckCircle2, XCircle } from "lucide-react";
import type { BudgetProject } from "@/lib/types";
import { GlassCard } from "@/components/shared/GlassCard";

export function BudgetProjectRow({
  project,
  selected,
  reason,
}: {
  project: BudgetProject;
  selected: boolean;
  reason?: string;
}) {
  return (
    <GlassCard tint={selected ? "emerald" : undefined} className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          {selected ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
          ) : (
            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden />
          )}
          <div>
            <h3 className="text-sm font-extrabold text-gray-900">{project.name}</h3>
            <p className="text-[11px] text-gray-500">{project.region}</p>
          </div>
        </div>
        <span className="shrink-0 text-sm font-black text-gray-900">₹{project.costLakhs}L</span>
      </div>

      <div className="flex flex-wrap gap-3 text-[11px] font-semibold text-gray-600">
        <span>Population benefit: {project.populationBenefit.toLocaleString("en-IN")}</span>
        <span>Criticality: {project.criticalityScore.toFixed(1)}/10</span>
      </div>

      <p className="text-xs text-gray-600">{project.rationale}</p>

      {!selected && reason && (
        <p className="rounded-xl bg-gray-50 px-3 py-2 text-[11px] font-semibold text-gray-500">
          Excluded: {reason}
        </p>
      )}

      <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-700">{project.sourceCitation}</p>
    </GlassCard>
  );
}
