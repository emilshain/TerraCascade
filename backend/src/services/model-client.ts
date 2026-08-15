/**
 * Client for communicating with the Dockerized Prithvi Model Inference Service.
 * Provides live flood segmentation, polygonization, and health check querying.
 */

import type { HazardEvent } from "../types/index.js";

const MODEL_SERVICE_URL =
  process.env.MODEL_SERVICE_URL || "http://localhost:8000";

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

export class ModelClient {
  private serviceUrl: string;

  constructor(serviceUrl = MODEL_SERVICE_URL) {
    this.serviceUrl = serviceUrl;
  }

  public async getStatus(): Promise<ModelStatus> {
    const t0 = Date.now();
    try {
      const res = await fetch(`${this.serviceUrl}/health`, {
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) {
        return {
          online: false,
          serviceUrl: this.serviceUrl,
          error: `HTTP ${res.status}: ${res.statusText}`,
        };
      }
      const data = (await res.json()) as any;
      return {
        online: true,
        serviceUrl: this.serviceUrl,
        runtime: data.runtime || "Docker Containerized PyTorch ViT",
        model: data.model || "Prithvi-100M-sen1floods11",
        latencyMs: Date.now() - t0,
      };
    } catch (err: any) {
      return {
        online: false,
        serviceUrl: this.serviceUrl,
        error: err?.message || "Model service unreachable",
      };
    }
  }

  public async predictFlood(params: PredictFloodParams = {}): Promise<HazardEvent | null> {
    try {
      const res = await fetch(`${this.serviceUrl}/predict/flood`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
        signal: AbortSignal.timeout(6000),
      });

      if (!res.ok) {
        throw new Error(`Model service error: ${res.status} ${res.statusText}`);
      }

      const hazardEvent = (await res.json()) as HazardEvent;
      return hazardEvent;
    } catch (err) {
      console.warn(
        `[ModelClient] Live inference request to ${this.serviceUrl} failed:`,
        (err as Error).message
      );
      return null;
    }
  }
}

export const modelClient = new ModelClient();
