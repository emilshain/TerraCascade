import type { EapState } from "@/lib/types";

const SEVERITY_COLOR: Record<EapState, string> = {
  blue: "#2563eb",
  orange: "#f97316",
  red: "#ef4444",
};

function Swatch({ color, shape = "circle" }: { color: string; shape?: "circle" | "square" | "line" | "dashed" }) {
  if (shape === "line" || shape === "dashed") {
    return (
      <span
        className="inline-block h-0.5 w-5 rounded-full"
        style={{
          background: shape === "dashed" ? "transparent" : color,
          borderTop: shape === "dashed" ? `3px dashed ${color}` : undefined,
        }}
      />
    );
  }
  return (
    <span
      className="inline-block h-3 w-3 shrink-0 rounded-full border-2 border-white"
      style={{ background: color, boxShadow: "0 1px 3px rgba(0,0,0,.3)" }}
    />
  );
}

export function MapLegend({ eapState }: { eapState: EapState }) {
  return (
    <div className="glass-card rounded-3xl p-4 text-xs">
      <p className="text-[10px] font-extrabold uppercase tracking-wide text-gray-400">
        Legend — by epistemic status
      </p>

      <div className="mt-3 flex flex-col gap-2">
        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
          🛰️ Hydrological layer (pre-computed ViT)
        </p>
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <Swatch color={SEVERITY_COLOR[eapState]} shape="square" />
          ViT-derived flood extent — {eapState} state
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3">
        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
          🏷️ Verified physical assets (ground truth)
        </p>
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <Swatch color="#2563eb" /> Reservoir / regulator (named EAP structure)
        </div>
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <Swatch color="#0891b2" /> Bridge (submersion status — cyan/orange/red by depth)
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3">
        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
          🧪 Assumed / scenario assets (demo assumptions)
        </p>
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <Swatch color="#dc2626" /> Hospital (illustrative placement)
        </div>
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <Swatch color="#059669" /> Shelter (dashed red ring = access road blocked)
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3">
        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Routes</p>
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <Swatch color="#dc2626" shape="dashed" /> Blocked (EOC route-blocker control)
        </div>
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <Swatch color="#64748b" shape="line" /> Open
        </div>
      </div>
    </div>
  );
}
