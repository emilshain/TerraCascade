import type { BudgetProject, OptimiseRequest, OptimiseResponse } from "../types/index.js";
export declare class OptimizerService {
    optimizePortfolio(request: OptimiseRequest): OptimiseResponse;
    getDefaultProjects(): BudgetProject[];
}
export declare const optimizerService: OptimizerService;
