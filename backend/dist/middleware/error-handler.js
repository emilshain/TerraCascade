"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, _req, res, _next) {
    console.error("API Error:", err.message);
    const statusCode = err.status || 400;
    res.status(statusCode).json({
        error: err.name || "Error",
        message: err.message || "An unexpected error occurred.",
        timestamp: new Date().toISOString(),
        status: "verified-demo",
        limitations: ["demo scenario exception handling"],
    });
}
