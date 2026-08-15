import { createApp } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
const app = createApp();

// Connect to MongoDB Cluster
connectDatabase().catch((err) => {
  console.warn("[Startup] MongoDB initial connection deferred:", err.message);
});

const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` TerraCascade EAP Command Backend running on port ${PORT}`);
  console.log(` Scope: Flood only (Idamalayar Dam & Periyar River System)`);
  console.log(` Mode: Verified-Demo (Prithvi-100M-sen1floods11 inference)`);
  console.log(` Auth & Cluster: http://localhost:${PORT}/auth/cluster-status`);
  console.log(` Health check: http://localhost:${PORT}/health`);
  console.log(` Active Event: http://localhost:${PORT}/events/active`);
  console.log(`=======================================================`);
});

// Graceful shutdown handling
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully...");
  await disconnectDatabase();
  server.close(() => {
    console.log("Process terminated.");
  });
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully...");
  await disconnectDatabase();
  server.close(() => {
    console.log("Process terminated.");
  });
});

