import { Fuel, Ship, Truck, Zap, Users, Home } from "lucide-react";
import type { ResourcePool } from "@/lib/types";
import { GlassCard } from "@/components/shared/GlassCard";
import { cn } from "@/lib/cn";

const ICON: Record<ResourcePool["kind"], typeof Fuel> = {
  fuel: Fuel,
  boat: Ship,
  generator: Zap,
  team: Users,
  vehicle: Truck,
  shelter: Home,
};

export function ResourceTile({ resource }: { resource: ResourcePool }) {
  const Icon = ICON[resource.kind];
  const ratio = resource.available / resource.total;
  const low = ratio <= 0.5;

  return (
    <GlassCard className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/70">
          <Icon className="h-4 w-4 text-blue-600" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-extrabold text-gray-900">{resource.label}</p>
          <p className="text-[11px] text-gray-500">{resource.location}</p>
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <span className="text-lg font-black text-gray-900">
            {resource.available.toLocaleString("en-IN")}
          </span>
          <span className="text-xs font-semibold text-gray-400">
            of {resource.total.toLocaleString("en-IN")} {resource.unit}
          </span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className={cn("h-full rounded-full", low ? "bg-amber-500" : "bg-emerald-500")}
            style={{ width: `${Math.round(ratio * 100)}%` }}
          />
        </div>
      </div>

      {resource.capacityPercent !== undefined && (
        <p className="text-[11px] font-bold text-gray-600">
          Operating at {resource.capacityPercent}% capacity
        </p>
      )}
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{resource.status}</p>
    </GlassCard>
  );
}
