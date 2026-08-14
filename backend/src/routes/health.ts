import { Router } from "express";
import { eventService } from "../services/event-service.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    status: "healthy",
    service: "TerraCascade EAP Command Backend API",
    version: "1.0.0",
    hazardScope: "flood only (no landslide component)",
    activeState: eventService.getActiveState(),
    provenance: {
      model: "Prithvi-100M-sen1floods11",
      aoi: "Idamalayar Dam – Bhoothathankettu regulator stretch, Periyar river system",
      status: "verified-demo",
      limitations: [
        "single-timestamp inference",
        "not a live feed",
        "portfolio recommendation only — not a government funding decision",
      ],
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
