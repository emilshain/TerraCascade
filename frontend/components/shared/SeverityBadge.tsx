import type { EapState } from "@/lib/types";
import { cn } from "@/lib/cn";

const EAP_STYLE: Record<EapState, { label: string; className: string }> = {
  blue: { label: "Blue — Watch", className: "glass-blue" },
  orange: { label: "Orange — Controlled spillage", className: "glass-orange" },
  red: { label: "Red — Imminent failure", className: "glass-red" },
};

export function SeverityBadge({ state, className }: { state: EapState; className?: string }) {
  const style = EAP_STYLE[state];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide transition-all hover-scale",
        style.className,
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          state === "blue" && "bg-blue-600",
          state === "orange" && "bg-orange-600 animate-pulse-slow",
          state === "red" && "bg-red-600 animate-pulse-slow"
        )}
      />
      {style.label}
    </span>
  );
}
