"use client";

import { useState } from "react";
import { Database, Activity, RefreshCw, CheckCircle2, AlertTriangle, Cloud, Server } from "lucide-react";
import { useAuth } from "@/lib/store/auth-context";

export function ClusterStatusBadge() {
  const { clusterStatus, refreshClusterStatus } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshClusterStatus();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const isConnected = clusterStatus?.connected ?? false;
  const isAtlas = clusterStatus?.isAtlas ?? false;

  return (
    <div className="glass-card flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3 border border-gray-200/50 bg-white/60 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur-md">
      <div className="flex items-center gap-2.5">
        <div className="relative flex h-3 w-3 items-center justify-center">
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
              isConnected ? "bg-emerald-400" : "bg-amber-400"
            }`}
          />
          <span
            className={`relative inline-flex h-2 w-2 rounded-full ${
              isConnected ? "bg-emerald-500" : "bg-amber-500"
            }`}
          />
        </div>

        <div className="flex items-center gap-1.5 font-bold">
          {isAtlas ? (
            <Cloud className="h-3.5 w-3.5 text-blue-600" />
          ) : (
            <Server className="h-3.5 w-3.5 text-indigo-600" />
          )}
          <span className="text-gray-900">MongoDB Cluster:</span>
          <span className={isConnected ? "text-emerald-700 font-extrabold" : "text-amber-700 font-extrabold"}>
            {clusterStatus ? clusterStatus.statusText : "Checking Connection..."}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-[11px] text-gray-500">
        {clusterStatus?.clusterHost && (
          <div className="hidden sm:flex items-center gap-1">
            <Database className="h-3 w-3 text-gray-400" />
            <span className="font-mono text-gray-600">{clusterStatus.clusterHost}</span>
          </div>
        )}

        {isConnected && clusterStatus?.latencyMs !== undefined && clusterStatus.latencyMs > 0 && (
          <div className="flex items-center gap-1 text-emerald-600 font-mono">
            <Activity className="h-3 w-3" />
            <span>{clusterStatus.latencyMs}ms</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleRefresh}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-blue-600 hover:bg-blue-50 transition-colors"
          title="Refresh cluster telemetry"
        >
          <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Telemetry</span>
        </button>
      </div>
    </div>
  );
}
