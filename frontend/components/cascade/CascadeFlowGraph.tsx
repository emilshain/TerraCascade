import { Fragment } from "react";
import { ChevronRight } from "lucide-react";
import type { CascadeNode } from "@/lib/types";
import { GlassCard } from "@/components/shared/GlassCard";
import { cn } from "@/lib/cn";

const RISK_STYLE: Record<CascadeNode["riskLabel"], string> = {
  low: "glass-emerald",
  medium: "glass-amber",
  high: "glass-orange",
  critical: "glass-red glow-red",
};

const RISK_DOT: Record<CascadeNode["riskLabel"], string> = {
  low: "bg-emerald-500",
  medium: "bg-amber-500",
  high: "bg-orange-500 animate-pulse-slow",
  critical: "bg-red-600 animate-pulse-slow",
};

function computeDepths(nodes: CascadeNode[]): Map<string, number> {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const depth = new Map<string, number>();

  function resolve(id: string, seen: Set<string>): number {
    if (depth.has(id)) return depth.get(id)!;
    if (seen.has(id)) return 0;
    seen.add(id);
    const node = byId.get(id);
    if (!node || node.dependsOn.length === 0) {
      depth.set(id, 0);
      return 0;
    }
    const d = 1 + Math.max(...node.dependsOn.map((dep) => resolve(dep, seen)));
    depth.set(id, d);
    return d;
  }

  nodes.forEach((n) => resolve(n.id, new Set()));
  return depth;
}

/**
 * Custom lightweight dependency-chain visualization (no graph library) —
 * lays nodes out in depth-ordered columns connected by chevrons, with a
 * pulsing dot on high/critical-risk nodes as water levels approach critical
 * elevations (spec §3, ROLE 2).
 */
export function CascadeFlowGraph({ nodes }: { nodes: CascadeNode[] }) {
  const depths = computeDepths(nodes);
  const maxDepth = Math.max(...nodes.map((n) => depths.get(n.id) ?? 0));
  const columns: CascadeNode[][] = Array.from({ length: maxDepth + 1 }, () => []);
  nodes.forEach((n) => columns[depths.get(n.id) ?? 0].push(n));

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:overflow-x-auto lg:pb-2">
      {columns.map((col, i) => (
        <Fragment key={i}>
          <div className="flex flex-col gap-3 lg:w-60 lg:shrink-0">
            {col.map((node) => (
              <GlassCard key={node.id} className="flex flex-col gap-2 !p-4">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn("h-2 w-2 shrink-0 rounded-full", RISK_DOT[node.riskLabel])}
                    aria-hidden
                  />
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase",
                      RISK_STYLE[node.riskLabel]
                    )}
                  >
                    {node.riskLabel} risk
                  </span>
                </div>
                <p className="text-sm font-extrabold text-gray-900">{node.label}</p>
                <p className="text-xs text-gray-600">{node.note}</p>
                {node.metricLabel && (
                  <p className="text-[11px] font-bold text-gray-700">
                    {node.metricLabel}: <span className="text-gray-900">{node.metricValue}</span>
                  </p>
                )}
              </GlassCard>
            ))}
          </div>
          {i < columns.length - 1 && (
            <div className="flex items-center justify-center lg:w-6 lg:shrink-0">
              <ChevronRight className="h-5 w-5 rotate-90 text-gray-300 lg:rotate-0" aria-hidden />
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}
