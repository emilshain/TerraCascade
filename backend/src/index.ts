import { createApp } from "./app.js";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
const app = createApp();

const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` TerraCascade EAP Command Backend running on port ${PORT}`);
  console.log(` Scope: Flood only (Idamalayar Dam & Periyar River System)`);
  console.log(` Mode: Verified-Demo (Prithvi-100M-sen1floods11 inference)`);
  console.log(` Health check: http://localhost:${PORT}/health`);
  console.log(` Active Event: http://localhost:${PORT}/events/active`);
  console.log(`=======================================================`);
});

// Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated.");
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated.");
  });
});
