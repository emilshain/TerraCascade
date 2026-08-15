"use client";

import { useState } from "react";
import {
  Activity,
  Cpu,
  Droplets,
  Layers,
  Loader2,
  Play,
  RotateCw,
  Satellite,
  Waves,
} from "lucide-react";
import { GlassCard } from "./GlassCard";
import { useDemoStore } from "@/lib/store/demo-store";
import { cn } from "@/lib/cn";

interface PresetScenario {
  id: string;
  name: string;
  badge: string;
  discharge: number;
  rainfall: number;
  expectedState: "blue" | "orange" | "red";
  description: string;
}

const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: "watch",
    name: "Watch Condition",
    badge: "520 cumecs",
    discharge: 520,
    rainfall: 18,
    expectedState: "blue",
    description: "Routine monsoon monitoring with baseline spillway bypass.",
  },
  {
    id: "controlled",
    name: "Controlled Release",
    badge: "1,380 cumecs",
    discharge: 1380,
    rainfall: 52,
    expectedState: "orange",
    description: "Controlled radial gate opening into Bhoothathankettu corridor.",
  },
  {
    id: "emergency",
    name: "Extreme Deluge",
    badge: "2,650 cumecs",
    discharge: 2650,
    rainfall: 110,
    expectedState: "red",
    description: "Peak catchment inflow with multi-gate full release.",
  },
];

export function LiveModelTrigger({ className }: { className?: string }) {
  const { isInferring, modelStatus, triggerLiveInference, activeHazard } = useDemoStore();
  const [selectedPreset, setSelectedPreset] = useState<PresetScenario>(PRESET_SCENARIOS[1]);
  const [customDischarge, setCustomDischarge] = useState<number>(1380);
  const [customRainfall, setCustomRainfall] = useState<number>(52);
  const [useCustom, setUseCustom] = useState<boolean>(false);

  const handleRunInference = async () => {
    if (isInferring) return;
    if (useCustom) {
      await triggerLiveInference({
        discharge_cumecs: customDischarge,
        rainfall_mm_hr: customRainfall,
        scenario: "custom_operator_run",
      });
    } else {
      await triggerLiveInference({
        discharge_cumecs: selectedPreset.discharge,
        rainfall_mm_hr: selectedPreset.rainfall,
        scenario: selectedPreset.id,
      });
    }
  };

  const metrics = (activeHazard as any).metrics;
  const isLive = activeHazard.id.startsWith("hazard-live-");

  return (
    <GlassCard className={cn("flex flex-col gap-4 border border-blue-200/60 bg-gradient-to-br from-slate-900/90 to-blue-950/95 text-white shadow-xl backdrop-blur-xl", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30">
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Prithvi-100M ViT Model Engine
            </h3>
            <p className="text-[11px] text-blue-200/70">
              Containerized Live Flood Segmentation & Inundation Inference
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border",
              modelStatus?.online
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                : "bg-amber-500/20 text-amber-300 border-amber-500/30"
            )}
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                modelStatus?.online ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              )}
            />
            {modelStatus?.online ? "Docker ML Online" : "Local Inference Engine"}
          </div>
        </div>
      </div>

      {/* Preset Scenarios Selector */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-wider text-blue-300/80">
            Hydrographic Scenario Inputs
          </label>
          <button
            type="button"
            onClick={() => setUseCustom(!useCustom)}
            className="text-[11px] font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            {useCustom ? "Use Presets" : "Custom Sliders"}
          </button>
        </div>

        {!useCustom ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {PRESET_SCENARIOS.map((preset) => {
              const active = selectedPreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedPreset(preset)}
                  className={cn(
                    "flex flex-col items-start rounded-xl p-2.5 text-left transition-all border",
                    active
                      ? "bg-blue-600/30 border-blue-400 text-white shadow-md shadow-blue-500/10"
                      : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                  )}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-xs font-bold">{preset.name}</span>
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-mono font-bold",
                        preset.expectedState === "blue"
                          ? "bg-blue-500/30 text-blue-300"
                          : preset.expectedState === "orange"
                          ? "bg-amber-500/30 text-amber-300"
                          : "bg-red-500/30 text-red-300"
                      )}
                    >
                      {preset.badge}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-gray-400 line-clamp-2 leading-tight">
                    {preset.description}
                  </p>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 rounded-xl bg-white/5 p-3 border border-white/10">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-300">Dam Discharge</span>
                <span className="font-mono font-bold text-blue-300">{customDischarge} cumecs</span>
              </div>
              <input
                type="range"
                min={300}
                max={3500}
                step={50}
                value={customDischarge}
                onChange={(e) => setCustomDischarge(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-300">Catchment Rainfall</span>
                <span className="font-mono font-bold text-cyan-300">{customRainfall} mm/hr</span>
              </div>
              <input
                type="range"
                min={5}
                max={150}
                step={5}
                value={customRainfall}
                onChange={(e) => setCustomRainfall(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Action and Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-4 text-xs text-gray-300">
          {metrics && (
            <>
              <div className="flex items-center gap-1.5">
                <Waves className="h-3.5 w-3.5 text-blue-400" />
                <span>
                  Flood Extent:{" "}
                  <strong className="text-white font-mono">{metrics.totalFloodedAreaKm2} km²</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-cyan-400" />
                <span>
                  Zones: <strong className="text-white font-mono">{metrics.polygonCount ?? activeHazard.affectedZones?.length ?? 1}</strong>
                </span>
              </div>
            </>
          )}
          {isLive && (
            <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
              <Activity className="h-3 w-3" /> Live Predicted
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={isInferring}
          onClick={handleRunInference}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-indigo-500 active:scale-95 disabled:opacity-50"
        >
          {isInferring ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              Running ViT Inference in Docker…
            </>
          ) : (
            <>
              <Satellite className="h-4 w-4" />
              Predict Flood Inundation
            </>
          )}
        </button>
      </div>
    </GlassCard>
  );
}
