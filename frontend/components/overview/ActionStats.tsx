import { AlertOctagon, ListTodo, CheckCircle2 } from "lucide-react";
import type { ActionItem } from "@/lib/types";
import { GlassCard } from "@/components/shared/GlassCard";

export function ActionStats({ actions }: { actions: ActionItem[] }) {
  const pending = actions.filter((a) => a.status !== "complete").length;
  const attention = actions.filter((a) => a.attentionRequired && a.status !== "complete").length;
  const complete = actions.filter((a) => a.status === "complete").length;

  const tiles = [
    {
      label: "Attention required",
      value: attention,
      icon: AlertOctagon,
      tint: attention > 0 ? ("red" as const) : ("emerald" as const),
      emphasize: attention > 0,
    },
    {
      label: "Pending actions",
      value: pending,
      icon: ListTodo,
      tint: "amber" as const,
      emphasize: false,
    },
    {
      label: "Complete",
      value: complete,
      icon: CheckCircle2,
      tint: "emerald" as const,
      emphasize: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {tiles.map((tile) => {
        const Icon = tile.icon;
        return (
          <GlassCard
            key={tile.label}
            tint={tile.tint}
            className={
              tile.emphasize
                ? "glow-red border-2 !border-red-300 flex items-center gap-4"
                : "flex items-center gap-4"
            }
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70">
              <Icon className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{tile.value}</p>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{tile.label}</p>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
