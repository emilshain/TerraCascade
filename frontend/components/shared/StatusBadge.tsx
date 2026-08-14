import type { ActionStatus } from "@/lib/types";
import { cn } from "@/lib/cn";

const STATUS_STYLE: Record<ActionStatus, { label: string; className: string }> = {
  drafted: { label: "Drafted", className: "bg-gray-100 text-gray-600 border border-gray-200" },
  pending_approval: { label: "Pending approval", className: "glass-amber glow-amber" },
  acknowledged: { label: "Acknowledged", className: "glass-blue" },
  in_progress: { label: "In progress", className: "glass-blue glow-primary" },
  complete: { label: "Complete", className: "glass-emerald" },
};

export function StatusBadge({ status, className }: { status: ActionStatus; className?: string }) {
  const style = STATUS_STYLE[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide whitespace-nowrap",
        style.className,
        className
      )}
    >
      {style.label}
    </span>
  );
}
