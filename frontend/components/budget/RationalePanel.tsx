import { Lightbulb } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";

export function RationalePanel({ rationale }: { rationale: string }) {
  return (
    <GlassCard tint="blue" className="flex items-start gap-3">
      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" aria-hidden />
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-wide text-blue-700">
          Explainable optimization rationale
        </p>
        <p className="mt-1 text-sm text-gray-700">{rationale}</p>
      </div>
    </GlassCard>
  );
}
