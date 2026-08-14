import { Router } from "express";
import { optimizerService } from "../services/optimizer-service.js";
import type { OptimiseRequest } from "../types/index.js";

const router = Router();

/**
 * POST /portfolio/optimise
 * Budget-feasible funded/unfunded mitigation list using 0/1 knapsack dynamic programming
 */
router.post("/optimise", (req, res, next) => {
  try {
    const body = req.body as OptimiseRequest;

    if (body.budget === undefined && body.budgetLakhs === undefined) {
      res.status(400).json({
        error: "ValidationError",
        message: "A 'budget' (or 'budgetLakhs') field is required in rupees or lakhs.",
      });
      return;
    }

    const result = optimizerService.optimizePortfolio(body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /portfolio/projects
 * Get candidate mitigation projects for planning
 */
router.get("/projects", (_req, res) => {
  const projects = optimizerService.getDefaultProjects();
  res.json({
    count: projects.length,
    projects,
    provenance: {
      status: "demo scenario assumption",
      disclaimer: "Mitigation projects list for demo planning only.",
    },
  });
});

export default router;
