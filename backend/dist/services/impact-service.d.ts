import type { ImpactGraphResponse } from "../types/index.js";
export declare class ImpactService {
    getImpactGraph(eventId?: string): ImpactGraphResponse;
    getResourcePools(): import("../types/index.js").ResourcePool[];
}
export declare const impactService: ImpactService;
