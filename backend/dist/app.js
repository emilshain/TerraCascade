"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const logger_js_1 = require("./middleware/logger.js");
const error_handler_js_1 = require("./middleware/error-handler.js");
const events_js_1 = __importDefault(require("./routes/events.js"));
const actions_js_1 = __importDefault(require("./routes/actions.js"));
const portfolio_js_1 = __importDefault(require("./routes/portfolio.js"));
const health_js_1 = __importDefault(require("./routes/health.js"));
function createApp() {
    const app = (0, express_1.default)();
    // Cross-Origin Resource Sharing
    app.use((0, cors_1.default)({
        origin: "*",
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }));
    // Body Parsing
    app.use(express_1.default.json());
    // Logging
    app.use(logger_js_1.requestLogger);
    // Routes
    app.use("/events", events_js_1.default);
    app.use("/actions", actions_js_1.default);
    app.use("/portfolio", portfolio_js_1.default);
    app.use("/", health_js_1.default);
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
    app.use(error_handler_js_1.errorHandler);
    return app;
}
exports.app = createApp();
