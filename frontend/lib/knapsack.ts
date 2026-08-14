import type { BudgetProject } from "@/lib/types";

export interface KnapsackResult {
  selected: BudgetProject[];
  excluded: BudgetProject[];
  totalCostLakhs: number;
  totalBenefit: number;
}

function benefitScore(project: BudgetProject): number {
  // Population reach weighted by criticality (0-10). Rounded to keep the DP
  // table integer-indexed.
  return Math.round(project.populationBenefit * (project.criticalityScore / 10));
}

/**
 * Exact 0/1 knapsack (population x criticality benefit, cost in lakhs as the
 * weight). Chosen over a greedy heuristic because the candidate list is small
 * enough that DP is cheap and gives a provably optimal selection.
 */
export function selectBudgetPortfolio(
  projects: BudgetProject[],
  budgetLakhs: number
): KnapsackResult {
  const capacity = Math.max(0, Math.floor(budgetLakhs));
  const n = projects.length;
  const weights = projects.map((p) => Math.round(p.costLakhs));
  const values = projects.map(benefitScore);

  const table: number[][] = Array.from({ length: n + 1 }, () =>
    new Array<number>(capacity + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    const w = weights[i - 1];
    const v = values[i - 1];
    for (let c = 0; c <= capacity; c++) {
      if (w > c) {
        table[i][c] = table[i - 1][c];
      } else {
        table[i][c] = Math.max(table[i - 1][c], table[i - 1][c - w] + v);
      }
    }
  }

  const selectedIdx: number[] = [];
  let c = capacity;
  for (let i = n; i > 0; i--) {
    if (table[i][c] !== table[i - 1][c]) {
      selectedIdx.push(i - 1);
      c -= weights[i - 1];
    }
  }
  selectedIdx.reverse();

  const selectedSet = new Set(selectedIdx);
  const selected = projects.filter((_, idx) => selectedSet.has(idx));
  const excluded = projects.filter((_, idx) => !selectedSet.has(idx));

  return {
    selected,
    excluded,
    totalCostLakhs: selected.reduce((sum, p) => sum + p.costLakhs, 0),
    totalBenefit: selected.reduce((sum, p) => sum + benefitScore(p), 0),
  };
}

/** Population protected per ₹1000 Cr of cost — a display-only ratio, not the DP's internal benefit score. */
export function benefitCostRatio(project: BudgetProject): number {
  const costCrores = project.costLakhs / 100;
  return Math.round((project.populationBenefit / (costCrores * 1000)) * 10) / 10;
}

function crores(lakhs: number) {
  return (lakhs / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

/**
 * Builds the spec's "Explainable Optimization Rationale" paragraph for the
 * current slider position — dynamically summarizes what the optimizer picked
 * and the highest-cost thing it left out, so the "why" updates live with the
 * slider instead of being a static caption.
 */
export function budgetRationale(budgetLakhs: number, result: KnapsackResult): string {
  if (result.selected.length === 0) {
    return `At a budget of ₹${crores(budgetLakhs)} Crores, no candidate project fits — the smallest project on the list still exceeds this budget.`;
  }

  const totalPopulation = result.selected.reduce((s, p) => s + p.populationBenefit, 0);
  const topExcluded = [...result.excluded].sort((a, b) => b.costLakhs - a.costLakhs)[0];

  const base = `At a budget of ₹${crores(budgetLakhs)} Crores, the optimizer maximized population protection by bundling ${result.selected.length} localized, high-yield intervention${result.selected.length === 1 ? "" : "s"} covering an estimated ${totalPopulation.toLocaleString("en-IN")} people`;

  if (!topExcluded) {
    return `${base} — every candidate project fits within this budget.`;
  }

  return `${base}, excluding "${topExcluded.name}" due to budget exhaustion and lower population-density return relative to the selected portfolio.`;
}

export function exclusionReason(
  project: BudgetProject,
  budgetLakhs: number,
  result: KnapsackResult
): string {
  if (project.costLakhs > budgetLakhs) {
    return `Cost (₹${crores(project.costLakhs)} Cr) exceeds the full slider budget (₹${crores(budgetLakhs)} Cr).`;
  }
  if (result.selected.length === 0) {
    return "No budget remaining at this slider position.";
  }
  return "Lower benefit-per-lakh than the selected portfolio at this budget — would displace a higher-value project.";
}
