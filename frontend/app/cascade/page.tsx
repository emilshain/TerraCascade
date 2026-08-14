"use client";

import { CASCADE_NODES, RESOURCE_POOLS } from "@/lib/fixtures/cascade";
import { PageHeader } from "@/components/shared/PageHeader";
import { CascadeNodeCard } from "@/components/cascade/CascadeNodeCard";
import { ResourceTile } from "@/components/cascade/ResourceTile";

export default function CascadeResourcePage() {
  const nodesById = new Map(CASCADE_NODES.map((n) => [n.id, n]));

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <PageHeader
        title="Cascade & resource view"
        description="Modeled dependency chain for the demo scenario — not validated engineering data — alongside live resource-readiness levels."
      />

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-gray-500">Dependency chain</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CASCADE_NODES.map((node) => (
            <CascadeNodeCard
              key={node.id}
              node={node}
              dependencyLabels={node.dependsOn.map((id) => nodesById.get(id)?.label ?? id)}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-gray-500">Resource readiness</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RESOURCE_POOLS.map((resource) => (
            <ResourceTile key={resource.id} resource={resource} />
          ))}
        </div>
      </section>
    </div>
  );
}
