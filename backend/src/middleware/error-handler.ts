import type { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("API Error:", err.message);

  const statusCode = (err as { status?: number }).status || 400;

  res.status(statusCode).json({
    error: err.name || "Error",
    message: err.message || "An unexpected error occurred.",
    timestamp: new Date().toISOString(),
    status: "verified-demo",
    limitations: ["demo scenario exception handling"],
  });
}
