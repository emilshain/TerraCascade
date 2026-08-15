import express from "express";
import cors from "cors";
import { requestLogger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/error-handler.js";
import eventsRouter from "./routes/events.js";
import actionsRouter from "./routes/actions.js";
import portfolioRouter from "./routes/portfolio.js";
import healthRouter from "./routes/health.js";
import authRouter from "./routes/auth.js";

export function createApp() {
  const app = express();

  // Cross-Origin Resource Sharing
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Body Parsing
  app.use(express.json());

  // Logging
  app.use(requestLogger);

  // Routes
  app.use("/auth", authRouter);
  app.use("/events", eventsRouter);
  app.use("/actions", actionsRouter);
  app.use("/portfolio", portfolioRouter);
  app.use("/", healthRouter);


  // Root Welcome Endpoint
  app.get("/", (_req, res) => {
    res.json({
      name: "TerraCascade EAP Command — Backend API",
      hazardScope: "flood only (no landslide component)",
      endpoints: {
        activeEvent: "GET /events/active",
        allEvents: "GET /events",
        switchState: "POST /events/active/state",
        eventActions: "GET /events/:id/actions",
        patchAction: "PATCH /actions/:id",
        eventImpact: "GET /events/:id/impact",
        budgetOptimizer: "POST /portfolio/optimise",
        eventTimeline: "GET /events/:id/timeline",
        health: "GET /health",
      },
      provenance: {
        model: "Prithvi-100M-sen1floods11 pre-computed inference",
        status: "verified-demo",
        limitations: [
          "single-timestamp inference",
          "not a live feed",
          "portfolio recommendation only — not a government funding decision",
        ],
      },
    });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
}

export const app = createApp();
