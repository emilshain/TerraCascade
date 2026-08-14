"use client";

import { Ban, CheckCircle2 } from "lucide-react";
import type { MapAsset } from "@/lib/types";
import { GlassCard } from "@/components/shared/GlassCard";
import { cn } from "@/lib/cn";

export function RouteBlockerList({
  roads,
  onToggle,
}: {
  roads: MapAsset[];
  onToggle: (roadId: string) => void;
}) {
  return (
    <GlassCard className="flex flex-col gap-3">
      <h3 className="text-sm font-extrabold uppercase tracking-wide text-gray-500">
        Map route blocker controller
      </h3>
      <p className="text-xs text-gray-500">
        Marking a segment blocked here updates its state on the shared Map and dynamically
        reroutes downstream logistics.
      </p>
      <ul className="flex flex-col gap-2">
        {roads.map((road) => (
          <li
            key={road.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/60 px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-gray-800">{road.name}</p>
              <p className="text-[11px] text-gray-500">{road.status}</p>
            </div>
            <button
              type="button"
              onClick={() => onToggle(road.id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-extrabold uppercase",
                road.blocked ? "glass-red" : "glass-emerald"
              )}
            >
              {road.blocked ? (
                <Ban className="h-3.5 w-3.5" aria-hidden />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
              )}
              {road.blocked ? "Blocked" : "Open"}
            </button>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
