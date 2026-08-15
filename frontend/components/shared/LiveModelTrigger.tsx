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
    <GlassCard tint="blue" className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 border border-blue-200">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-gray-900">
              Prithvi-100M ViT Model Engine
            </h3>
            <p className="mt-0.5 text-xs text-gray-500">
              Containerized Live Flood Segmentation & Inundation Inference
            </p>
          </div>
        </div>

        <div
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border",
            modelStatus?.online
              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
              : "bg-amber-100 text-amber-700 border-amber-200"
          )}
        >
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              modelStatus?.online ? "bg-emerald-600 animate-pulse" : "bg-amber-600"
            )}
          />
          {modelStatus?.online ? "Docker ML Online" : "Local Inference Engine"}
        </div>
      </div>

      {/* Preset Scenarios Selector */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wide text-gray-500">
            Hydrographic Scenario Inputs
          </label>
          <button
            type="button"
            onClick={() => setUseCustom(!useCustom)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
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
                    "flex flex-col items-start rounded-2xl p-3 text-left transition-all border",
                    active
                      ? "bg-blue-100 border-blue-300 text-gray-900 shadow-sm shadow-blue-200"
                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="text-sm font-bold">{preset.name}</span>
                    <span
                      className={cn(
                        "rounded px-2 py-0.5 text-xs font-mono font-semibold whitespace-nowrap",
                        preset.expectedState === "blue"
                          ? "bg-blue-100 text-blue-700"
                          : preset.expectedState === "orange"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      )}
                    >
                      {preset.badge}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-gray-600 line-clamp-2 leading-snug">
                    {preset.description}
                  </p>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 rounded-2xl bg-gray-50 p-4 border border-gray-200">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-gray-700">Dam Discharge</span>
                <span className="font-mono text-blue-600">{customDischarge} cumecs</span>
              </div>
              <input
                type="range"
                min={300}
                max={3500}
                step={50}
                value={customDischarge}
                onChange={(e) => setCustomDischarge(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-gray-700">Catchment Rainfall</span>
                <span className="font-mono text-blue-600">{customRainfall} mm/hr</span>
              </div>
              <input
                type="range"
                min={5}
                max={150}
                step={5}
                value={customRainfall}
                onChange={(e) => setCustomRainfall(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* Action and Telemetry Bar */}
      <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-700">
          {metrics && (
            <>
              <div className="flex items-center gap-1.5">
                <Waves className="h-4 w-4 text-blue-600" />
                <span>
                  Flood Extent:{" "}
                  <strong className="text-gray-900 font-semibold">{metrics.totalFloodedAreaKm2} km²</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-blue-600" />
                <span>
                  Zones: <strong className="text-gray-900 font-semibold">{metrics.polygonCount ?? activeHazard.affectedZones?.length ?? 1}</strong>
                </span>
              </div>
            </>
          )}
          {isLive && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200">
              <Activity className="h-3.5 w-3.5" /> Live Predicted
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={isInferring}
          onClick={handleRunInference}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
        >
          {isInferring ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Running Inference…
            </>
          ) : (
            <>
              <Satellite className="h-3.5 w-3.5" />
              Predict Flood
            </>
          )}
        </button>
      </div>
    </GlassCard>
  );
}
