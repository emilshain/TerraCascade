/**
 * Client for communicating with the Dockerized Prithvi Model Inference Service.
 * Provides live flood segmentation, polygonization, and health check querying.
 */
import type { HazardEvent } from "../types/index.js";
export interface PredictFloodParams {
    scene_id?: string;
    scene_date?: string;
    discharge_cumecs?: number;
    rainfall_mm_hr?: number;
    scenario?: string;
    aoi_bounds?: [number, number, number, number];
}
export interface ModelStatus {
    online: boolean;
    serviceUrl: string;
    runtime?: string;
    model?: string;
    latencyMs?: number;
    error?: string;
}
export declare class ModelClient {
    private serviceUrl;
    constructor(serviceUrl?: string);
    getStatus(): Promise<ModelStatus>;
    predictFlood(params?: PredictFloodParams): Promise<HazardEvent | null>;
}
export declare const modelClient: ModelClient;
