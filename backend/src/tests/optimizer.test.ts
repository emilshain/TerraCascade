import { describe, it, expect } from "vitest";
import { optimizerService } from "../services/optimizer-service.js";
import { DEFAULT_BUDGET_PROJECTS } from "../fixtures/budget-fixtures.js";

describe("OptimizerService — 0/1 Knapsack Dynamic Programming", () => {
  it("executes ₹10 crore demo input deterministically in under 1 second", () => {
    const startTime = performance.now();

    // ₹10 Crore = 100,000,000 INR (or 1000 Lakhs)
    const result = optimizerService.optimizePortfolio({
      budget: 100000000,
    });

    const duration = performance.now() - startTime;

    expect(duration).toBeLessThan(1000); // Must be under 1 second (Definition of Done)
    expect(result.selectedProjects.length).toBeGreaterThan(0);
    expect(result.totalCost).toBeLessThanOrEqual(1000); // Total cost in lakhs <= 1000L
    expect(result.provenance.algorithm).toBe("0/1 Knapsack Dynamic Programming (Exact)");
    expect(result.provenance.status).toBe("portfolio recommendation");
    expect(result.provenance.disclaimer).toContain("not a government funding decision");
  });

  it("handles standard ₹150 Lakh demo slider budget optimally", () => {
    const result = optimizerService.optimizePortfolio({
      budget: 150,
    });

    expect(result.totalCost).toBeLessThanOrEqual(150);
    expect(result.selectedProjects.length).toBeGreaterThan(0);
    expect(result.unselectedProjects.length).toBeGreaterThan(0);
    expect(result.remainingBudget).toBe(150 - result.totalCost);

    // Selected projects must have explanations
    for (const exp of result.explanations.selected) {
      expect(exp.explanation).toContain("Selected");
      expect(exp.benefitScore).toBeGreaterThan(0);
    }

    // Unselected projects must have rationales
    for (const exp of result.explanations.unselected) {
      expect(exp.explanation).toContain("Excluded");
    }
  });

  it("handles ₹0 budget edge case gracefully", () => {
    const result = optimizerService.optimizePortfolio({
      budget: 0,
    });

    expect(result.selectedProjects.length).toBe(0);
    expect(result.unselectedProjects.length).toBe(DEFAULT_BUDGET_PROJECTS.length);
    expect(result.totalCost).toBe(0);
    expect(result.remainingBudget).toBe(0);
    expect(result.totalProtectedImpact).toBe(0);
  });

  it("handles custom project lists with exact knapsack selection", () => {
    const customProjects = [
      {
        id: "proj-1",
        name: "Small Pump",
        cost: 10,
        criticality: 6,
        populationImpact: 1000,
        evidenceLabel: "Demo",
        rationale: "Small area",
      },
      {
        id: "proj-2",
        name: "Big Levee",
        cost: 20,
        criticality: 9,
        populationImpact: 5000,
        evidenceLabel: "Demo",
        rationale: "High benefit",
      },
      {
        id: "proj-3",
        name: "Mega Wall",
        cost: 40,
        criticality: 8,
        populationImpact: 6000,
        evidenceLabel: "Demo",
        rationale: "High cost",
      },
    ];

    // With budget 25, optimal choice should select proj-1 and proj-2 (total cost 30 is > 25, so only proj-2 cost 20 benefit 4500, or proj-1 + proj-2 cost 30, so proj-2 alone gives 4500 vs proj-1 gives 600)
    const result = optimizerService.optimizePortfolio({
      projects: customProjects,
      budget: 25,
    });

    expect(result.selectedProjects.map((p) => p.id)).toEqual(["proj-2"]);
    expect(result.totalCost).toBe(20);
    expect(result.remainingBudget).toBe(5);
  });
});
