"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useDemoStore } from "@/lib/store/demo-store";
import { MAP_CENTER } from "@/lib/fixtures/hazard";
import { CRITICAL_ASSETS, buildBridges, buildShelters } from "@/lib/fixtures/assets";
import { PageHeader } from "@/components/shared/PageHeader";
import { SeverityBadge } from "@/components/shared/SeverityBadge";
import { MapCornerProvenanceTag } from "@/components/shared/ProvenanceTag";
import { ProtocolDrawer } from "@/components/shared/ProtocolDrawer";
import { MapLegend } from "@/components/map/MapLegend";
import { LiveModelTrigger } from "@/components/shared/LiveModelTrigger";

const ImpactMapClient = dynamic(
  () => import("@/components/map/ImpactMapClient").then((m) => m.ImpactMapClient),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-400">
        Loading satellite hybrid map…
      </div>
    ),
  }
);

export default function ImpactMapPage() {
  const { eapState, roads, activeHazard } = useDemoStore();
  const hazard = activeHazard;

  const assets = useMemo(() => {
    const roadsBlocked = Object.fromEntries(roads.map((r) => [r.id, Boolean(r.blocked)]));
    return [...CRITICAL_ASSETS, ...buildBridges(eapState), ...buildShelters(roadsBlocked), ...roads];
  }, [eapState, roads]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Shared map — command hub"
        description="High-resolution satellite hybrid basemap with Prithvi-100M-sen1floods11 flood extent, bridges, shelters, roads, and critical infrastructure assets. Visible to every role."
        actions={<SeverityBadge state={eapState} />}
      />

      <LiveModelTrigger />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_260px]">
        <div className="glass-card relative h-[540px] overflow-hidden rounded-3xl p-0 shadow-lg">
          <div className="absolute left-4 top-4 z-[500] flex flex-wrap gap-2">
            <MapCornerProvenanceTag />
          </div>
          <ImpactMapClient hazard={hazard} assets={assets} center={MAP_CENTER} />
        </div>
        <div className="flex flex-col gap-4">
          <MapLegend eapState={eapState} />
        </div>
      </div>

      <ProtocolDrawer protocolSource={hazard.protocolSource} />
    </div>
  );
}
