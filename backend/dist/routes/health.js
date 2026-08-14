"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_service_js_1 = require("../services/event-service.js");
const router = (0, express_1.Router)();
router.get("/health", (_req, res) => {
    res.json({
        status: "healthy",
        service: "TerraCascade EAP Command Backend API",
        version: "1.0.0",
        hazardScope: "flood only (no landslide component)",
        activeState: event_service_js_1.eventService.getActiveState(),
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
exports.default = router;
