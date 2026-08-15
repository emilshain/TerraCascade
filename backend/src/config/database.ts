import mongoose from "mongoose";
import { ENV } from "./env.js";

export interface ClusterStatus {
  connected: boolean;
  readyState: number;
  statusText: string;
  isAtlas: boolean;
  clusterHost: string;
  dbName: string;
  latencyMs: number;
  collections: string[];
  userCount?: number;
  lastCheckedAt: string;
  error?: string | null;
}

let lastConnectionError: string | null = null;

function sanitizeMongoUri(uri: string): { host: string; isAtlas: boolean; dbName: string } {
  try {
    const isAtlas = uri.startsWith("mongodb+srv://") || uri.includes(".mongodb.net");
    const clean = uri.replace(/^mongodb(\+srv)?:\/\//, "");
    const parts = clean.split("/");
    const authAndHost = parts[0];
    const hostWithQuery = authAndHost.includes("@") ? authAndHost.split("@")[1] : authAndHost;
    const host = hostWithQuery.split(",")[0];
    const dbAndQuery = parts[1] || "terracascade";
    const dbName = dbAndQuery.split("?")[0] || "terracascade";

    return { host, isAtlas, dbName };
  } catch {
    return { host: "mongodb-cluster", isAtlas: false, dbName: "terracascade" };
  }
}

export async function connectDatabase(customUri?: string): Promise<boolean> {
  const uri = customUri || ENV.MONGODB_URI;
  const { host, isAtlas } = sanitizeMongoUri(uri);

  // Set mongoose options
  mongoose.set("strictQuery", true);

  // Connection event listeners
  mongoose.connection.on("connected", () => {
    lastConnectionError = null;
    console.log(`[MongoDB] Successfully connected to cluster host: ${host} ${isAtlas ? "(MongoDB Atlas)" : "(Local / Standalone)"}`);
  });

  mongoose.connection.on("error", (err) => {
    lastConnectionError = err.message;
    console.warn(`[MongoDB] Cluster connection warning: ${err.message}`);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("[MongoDB] Connection to cluster closed / disconnected.");
  });

  try {
    console.log(`[MongoDB] Initializing connection to cluster at ${host}...`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      autoIndex: true,
    });
    return true;
  } catch (err: any) {
    lastConnectionError = err.message;
    console.warn(`[MongoDB] Initial connection to cluster failed: ${err.message}`);
    console.warn(`[MongoDB] Operating in local memory fallback mode for auth & sessions.`);
    return false;
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log("[MongoDB] Gracefully disconnected from cluster.");
  }
}

export async function getClusterStatus(): Promise<ClusterStatus> {
  const uri = ENV.MONGODB_URI;
  const { host, isAtlas, dbName } = sanitizeMongoUri(uri);
  let readyState = mongoose.connection.readyState;

  // If disconnected, attempt a reconnection
  if (readyState === 0) {
    try {
      await connectDatabase(uri);
      readyState = mongoose.connection.readyState;
    } catch {
      // Handled in connectDatabase
    }
  }

  const isConnected = readyState === 1;

  let latencyMs = 0;
  let collections: string[] = [];
  let userCount = 0;

  if (isConnected && mongoose.connection.db) {
    try {
      const startTime = Date.now();
      const adminDb = mongoose.connection.db.admin();
      await adminDb.ping();
      latencyMs = Date.now() - startTime;

      const collList = await mongoose.connection.db.listCollections().toArray();
      collections = collList.map((c) => c.name);

      if (collections.includes("users")) {
        userCount = await mongoose.connection.db.collection("users").countDocuments();
      }
    } catch (err: any) {
      latencyMs = 0;
      lastConnectionError = err.message;
    }
  }

  let friendlyError = lastConnectionError;
  if (lastConnectionError) {
    if (lastConnectionError.includes("SSL alert number 80") || lastConnectionError.includes("ERR_SSL")) {
      friendlyError = "IP not whitelisted in MongoDB Atlas Network Access";
    } else if (lastConnectionError.includes("bad auth") || lastConnectionError.includes("Authentication failed")) {
      friendlyError = "Invalid Atlas Database User or Password";
    } else if (lastConnectionError.includes("ENOTFOUND") || lastConnectionError.includes("querySrv")) {
      friendlyError = "Atlas cluster hostname not found";
    }
  }

  const statusMap: Record<number, string> = {
    0: friendlyError ? `Disconnected (${friendlyError})` : "Disconnected (Offline Fallback)",
    1: isAtlas ? "Connected (MongoDB Atlas Cluster)" : "Connected (Local Cluster)",
    2: "Connecting...",
    3: "Disconnecting...",
  };

  return {
    connected: isConnected,
    readyState,
    statusText: statusMap[readyState] || "Unknown",
    isAtlas,
    clusterHost: host,
    dbName,
    latencyMs,
    collections,
    userCount,
    lastCheckedAt: new Date().toISOString(),
    error: isConnected ? null : friendlyError || lastConnectionError,
  };
}


