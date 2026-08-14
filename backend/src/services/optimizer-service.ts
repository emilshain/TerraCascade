import type {
  BudgetProject,
  OptimiseRequest,
  OptimiseResponse,
  SelectedProjectExplanation,
  ExcludedProjectExplanation,
} from "../types/index.js";
import { DEFAULT_BUDGET_PROJECTS } from "../fixtures/budget-fixtures.js";

function calculateBenefitScore(project: BudgetProject): number {
  const criticality = project.criticality ?? project.criticalityScore ?? 5;
  const population = project.populationImpact ?? project.populationBenefit ?? 0;
  return Math.round(population * (criticality / 10));
}

function normalizeProject(p: BudgetProject): BudgetProject {
  const cost = p.cost ?? p.costLakhs ?? 0;
  const criticality = p.criticality ?? p.criticalityScore ?? 5;
  const populationImpact = p.populationImpact ?? p.populationBenefit ?? 0;

  return {
    ...p,
    cost,
    costLakhs: cost,
    criticality,
    criticalityScore: criticality,
    populationImpact,
    populationBenefit: populationImpact,
    evidenceLabel: p.evidenceLabel || "Demo scenario assumption",
    status: p.status || "demo scenario assumption",
  };
}

export class OptimizerService {
  public optimizePortfolio(request: OptimiseRequest): OptimiseResponse {
    const startTime = performance.now();

    const rawProjects = request.projects && request.projects.length > 0 ? request.projects : DEFAULT_BUDGET_PROJECTS;
    const projects = rawProjects.map(normalizeProject);

    let budget = request.budget ?? request.budgetLakhs ?? 0;

    // Normalization heuristic: If budget is provided in raw rupees (e.g. ₹10 Crore = 100,000,000 INR or 10,000,000 INR)
    // while project costs are defined in lakhs (e.g. 120 = 120 Lakhs = 1.2 Crore):
    const maxProjectCost = Math.max(...projects.map((p) => p.cost), 1);
    if (budget > 100000 && maxProjectCost <= 1000) {
      budget = Math.round(budget / 100000); // convert INR to Lakhs
    }

    const n = projects.length;
    const weights = projects.map((p) => Math.max(0, Math.round(p.cost)));
    const values = projects.map(calculateBenefitScore);
    const totalWeightSum = weights.reduce((sum, w) => sum + w, 0);

    // Bounded capacity for exact 0/1 knapsack dynamic programming
    const capacity = Math.max(0, Math.floor(budget));
    const effectiveCapacity = Math.min(capacity, totalWeightSum);

    // DP Table: (n + 1) x (effectiveCapacity + 1)
    const dp: number[][] = Array.from({ length: n + 1 }, () =>
      new Array<number>(effectiveCapacity + 1).fill(0)
    );

    for (let i = 1; i <= n; i++) {
      const w = weights[i - 1];
      const v = values[i - 1];
      for (let c = 0; c <= effectiveCapacity; c++) {
        if (w > c) {
          dp[i][c] = dp[i - 1][c];
        } else {
          dp[i][c] = Math.max(dp[i - 1][c], dp[i - 1][c - w] + v);
        }
      }
    }

    // Backtrack to reconstruct optimal selected item set
    const selectedIndices: number[] = [];
    let currentCap = effectiveCapacity;

    for (let i = n; i > 0; i--) {
      if (dp[i][currentCap] !== dp[i - 1][currentCap]) {
        selectedIndices.push(i - 1);
        currentCap -= weights[i - 1];
      }
    }
    selectedIndices.reverse();

    const selectedSet = new Set(selectedIndices);
    const selectedProjects = projects.filter((_, idx) => selectedSet.has(idx));
    const unselectedProjects = projects.filter((_, idx) => !selectedSet.has(idx));

    const totalCost = selectedProjects.reduce((sum, p) => sum + p.cost, 0);
    const remainingBudget = Math.max(0, budget - totalCost);
    const totalProtectedImpact = selectedProjects.reduce((sum, p) => sum + calculateBenefitScore(p), 0);

    const selectedExplanations: SelectedProjectExplanation[] = selectedProjects.map((p) => {
      const benefit = calculateBenefitScore(p);
      return {
        projectId: p.id,
        name: p.name,
        cost: p.cost,
        criticality: p.criticality,
        populationImpact: p.populationImpact,
        benefitScore: benefit,
        explanation: `Selected: Allocates ₹${p.cost}L to protect ~${p.populationImpact.toLocaleString()} residents (Criticality: ${p.criticality}/10, Weighted impact: ${benefit}). ${p.rationale}`,
      };
    });

    const unselectedExplanations: ExcludedProjectExplanation[] = unselectedProjects.map((p) => {
      let explanation = `Excluded: Marginal benefit per lakh is lower than selected projects within the ₹${budget}L ceiling.`;
      if (p.cost > budget) {
        explanation = `Excluded: Project cost (₹${p.cost}L) exceeds the total available budget (₹${budget}L).`;
      } else if (p.cost > remainingBudget) {
        explanation = `Excluded: Project cost (₹${p.cost}L) exceeds remaining unallocated budget (₹${remainingBudget}L).`;
      }
      return {
        projectId: p.id,
        name: p.name,
        cost: p.cost,
        explanation,
      };
    });

    const endTime = performance.now();
    const runtimeMs = Number((endTime - startTime).toFixed(3));

    return {
      selectedProjects,
      unselectedProjects,
      totalCost,
      remainingBudget,
      totalProtectedImpact,
      explanations: {
        selected: selectedExplanations,
        unselected: unselectedExplanations,
      },
      provenance: {
        algorithm: "0/1 Knapsack Dynamic Programming (Exact)",
        runtimeMs,
        status: "portfolio recommendation",
        disclaimer: "Portfolio recommendation only — not a government funding decision.",
      },
    };
  }

  public getDefaultProjects(): BudgetProject[] {
    return DEFAULT_BUDGET_PROJECTS.map(normalizeProject);
  }
}

export const optimizerService = new OptimizerService();
