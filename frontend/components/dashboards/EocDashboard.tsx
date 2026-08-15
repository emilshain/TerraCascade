"use client";

import { useDemoStore } from "@/lib/store/demo-store";
import { CASCADE_NODES, RESOURCE_POOLS } from "@/lib/fixtures/cascade";
import { CascadeFlowGraph } from "@/components/cascade/CascadeFlowGraph";
import { ResourceTile } from "@/components/cascade/ResourceTile";
import { RouteBlockerList } from "@/components/eoc/RouteBlockerList";

export function EocDashboard() {
  const { roads, toggleRouteBlocked } = useDemoStore();

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4 animate-slide-down">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-gray-500">
          Critical dependency cascade
        </h2>
        <CascadeFlowGraph nodes={CASCADE_NODES} />
      </section>

      <section className="flex flex-col gap-4 animate-slide-up">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-gray-500">
          Downstream resource grid
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RESOURCE_POOLS.map((resource, idx) => (
            <div key={resource.id} className="stagger-item" style={{ animationDelay: `${0.1 + idx * 0.05}s` } as any}>
              <ResourceTile resource={resource} />
            </div>
          ))}
        </div>
      </section>

      <RouteBlockerList roads={roads} onToggle={toggleRouteBlocked} />
    </div>
  );
}
