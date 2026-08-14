import { Satellite } from "lucide-react";
import type { HazardSource } from "@/lib/types";

export function ProvenanceTag({ source, sceneDate }: { source: string; sceneDate: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-900/80 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
      <Satellite className="h-3 w-3 opacity-80" aria-hidden />
      {source}, Sentinel-2, {sceneDate}
    </span>
  );
}

export function ProvenanceTagFromHazardSource({ source }: { source: HazardSource }) {
  return <ProvenanceTag source={source.model} sceneDate={source.sceneDate} />;
}

/** Required exact on-map floating corner label — see spec §2A. */
export function MapCornerProvenanceTag() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-900/80 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
      <Satellite className="h-3 w-3 opacity-80" aria-hidden />
      ViT-derived flood extent (pre-computed) - Source: Prithvi-100M-sen1floods11 / Sentinel-2 / L2A
    </span>
  );
}
