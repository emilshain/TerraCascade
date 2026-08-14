"use client";

import dynamic from "next/dynamic";
import { useDemoStore } from "@/lib/store/demo-store";
import { HAZARD_EVENTS, MAP_CENTER } from "@/lib/fixtures/hazard";
import { MAP_ASSETS } from "@/lib/fixtures/assets";
import { PageHeader } from "@/components/shared/PageHeader";
import { SeverityBadge } from "@/components/shared/SeverityBadge";
import { ProvenanceTag } from "@/components/shared/ProvenanceTag";
import { ProtocolDrawer } from "@/components/shared/ProtocolDrawer";
import { MapLegend } from "@/components/map/MapLegend";

const ImpactMapClient = dynamic(
  () => import("@/components/map/ImpactMapClient").then((m) => m.ImpactMapClient),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-400">
        Loading map…
      </div>
    ),
  }
);

export default function ImpactMapPage() {
  const { eapState } = useDemoStore();
  const hazard = HAZARD_EVENTS[eapState];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Impact map"
        description="No basemap tiles are fetched — this view is fully offline. Flood extent, roads, hospital, shelter and critical assets are drawn from bundled fixture geometry only."
        actions={<SeverityBadge state={eapState} />}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_260px]">
        <div className="glass-card relative h-[520px] overflow-hidden rounded-3xl p-0">
          <div className="absolute left-4 top-4 z-[500] flex flex-wrap gap-2">
            <ProvenanceTag source={hazard.source.model} sceneDate={hazard.source.sceneDate} />
          </div>
          <ImpactMapClient hazard={hazard} assets={MAP_ASSETS} center={MAP_CENTER} />
        </div>
        <div className="flex flex-col gap-4">
          <MapLegend eapState={eapState} />
        </div>
      </div>

      <ProtocolDrawer protocolSource={hazard.protocolSource} />
    </div>
  );
}
