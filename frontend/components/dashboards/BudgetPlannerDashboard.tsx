"use client";

import { useMemo } from "react";
import { useDemoStore } from "@/lib/store/demo-store";
import { BUDGET_PROJECTS } from "@/lib/fixtures/budget";
import { selectBudgetPortfolio, exclusionReason, budgetRationale } from "@/lib/knapsack";
import { GlassCard } from "@/components/shared/GlassCard";
import { BudgetSlider } from "@/components/budget/BudgetSlider";
import { BudgetProjectRow } from "@/components/budget/BudgetProjectRow";
import { RationalePanel } from "@/components/budget/RationalePanel";

function crores(lakhs: number) {
  return (lakhs / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export function BudgetPlannerDashboard() {
  const { budgetLakhs, setBudgetLakhs } = useDemoStore();

  const result = useMemo(
    () => selectBudgetPortfolio(BUDGET_PROJECTS, budgetLakhs),
    [budgetLakhs]
  );
  const rationale = useMemo(() => budgetRationale(budgetLakhs, result), [budgetLakhs, result]);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <BudgetSlider value={budgetLakhs} onChange={setBudgetLakhs} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <GlassCard className="text-center">
          <p className="text-2xl font-black text-gray-900">{result.selected.length}</p>
          <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">Projects selected</p>
        </GlassCard>
        <GlassCard className="text-center">
          <p className="text-2xl font-black text-gray-900">₹{crores(result.totalCostLakhs)} Cr</p>
          <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">Spent of budget</p>
        </GlassCard>
        <GlassCard className="text-center">
          <p className="text-2xl font-black text-gray-900">
            {result.selected.reduce((s, p) => s + p.populationBenefit, 0).toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">Population covered</p>
        </GlassCard>
      </div>

      <RationalePanel rationale={rationale} />

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-gray-500">
          Funded / selected ({result.selected.length})
        </h2>
        {result.selected.length === 0 ? (
          <GlassCard className="text-sm font-semibold text-gray-500">
            No projects fit at this budget.
          </GlassCard>
        ) : (
          result.selected.map((p) => <BudgetProjectRow key={p.id} project={p} selected />)
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-gray-500">
          Unfunded / excluded ({result.excluded.length})
        </h2>
        {result.excluded.map((p) => (
          <BudgetProjectRow
            key={p.id}
            project={p}
            selected={false}
            reason={exclusionReason(p, budgetLakhs, result)}
          />
        ))}
      </section>
    </div>
  );
}
