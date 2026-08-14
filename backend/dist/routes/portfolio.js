"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const optimizer_service_js_1 = require("../services/optimizer-service.js");
const router = (0, express_1.Router)();
/**
 * POST /portfolio/optimise
 * Budget-feasible funded/unfunded mitigation list using 0/1 knapsack dynamic programming
 */
router.post("/optimise", (req, res, next) => {
    try {
        const body = req.body;
        if (body.budget === undefined && body.budgetLakhs === undefined) {
            res.status(400).json({
                error: "ValidationError",
                message: "A 'budget' (or 'budgetLakhs') field is required in rupees or lakhs.",
            });
            return;
        }
        const result = optimizer_service_js_1.optimizerService.optimizePortfolio(body);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
});
/**
 * GET /portfolio/projects
 * Get candidate mitigation projects for planning
 */
router.get("/projects", (_req, res) => {
    const projects = optimizer_service_js_1.optimizerService.getDefaultProjects();
    res.json({
        count: projects.length,
        projects,
        provenance: {
            status: "demo scenario assumption",
            disclaimer: "Mitigation projects list for demo planning only.",
        },
    });
});
exports.default = router;
