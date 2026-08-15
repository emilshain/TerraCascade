"use strict";
/**
 * Client for communicating with the Dockerized Prithvi Model Inference Service.
 * Provides live flood segmentation, polygonization, and health check querying.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelClient = exports.ModelClient = void 0;
const MODEL_SERVICE_URL = process.env.MODEL_SERVICE_URL || "http://localhost:8000";
class ModelClient {
    serviceUrl;
    constructor(serviceUrl = MODEL_SERVICE_URL) {
        this.serviceUrl = serviceUrl;
    }
    async getStatus() {
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
            const data = (await res.json());
            return {
                online: true,
                serviceUrl: this.serviceUrl,
                runtime: data.runtime || "Docker Containerized PyTorch ViT",
                model: data.model || "Prithvi-100M-sen1floods11",
                latencyMs: Date.now() - t0,
            };
        }
        catch (err) {
            return {
                online: false,
                serviceUrl: this.serviceUrl,
                error: err?.message || "Model service unreachable",
            };
        }
    }
    async predictFlood(params = {}) {
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
            const hazardEvent = (await res.json());
            return hazardEvent;
        }
        catch (err) {
            console.warn(`[ModelClient] Live inference request to ${this.serviceUrl} failed:`, err.message);
            return null;
        }
    }
}
exports.ModelClient = ModelClient;
exports.modelClient = new ModelClient();
