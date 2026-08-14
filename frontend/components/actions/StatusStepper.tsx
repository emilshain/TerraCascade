import { Check } from "lucide-react";
import { ACTION_STATUS_ORDER, type ActionStatus } from "@/lib/types";
import { cn } from "@/lib/cn";

const STAGE_LABEL: Record<ActionStatus, string> = {
  drafted: "Drafted",
  pending_approval: "Approval",
  acknowledged: "Acknowledged",
  in_progress: "In progress",
  complete: "Complete",
};

export function StatusStepper({ status }: { status: ActionStatus }) {
  const currentIdx = ACTION_STATUS_ORDER.indexOf(status);

  return (
    <ol className="flex items-center gap-1">
      {ACTION_STATUS_ORDER.map((stage, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        return (
          <li key={stage} className="flex flex-1 items-center gap-1">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black",
                  done && "bg-emerald-500 text-white",
                  active && "bg-blue-600 text-white ring-4 ring-blue-100",
                  !done && !active && "bg-gray-200 text-gray-500"
                )}
              >
                {done ? <Check className="h-3 w-3" aria-hidden /> : idx + 1}
              </div>
              <span
                className={cn(
                  "text-[9px] font-bold uppercase tracking-wide",
                  active ? "text-blue-700" : "text-gray-400"
                )}
              >
                {STAGE_LABEL[stage]}
              </span>
            </div>
            {idx < ACTION_STATUS_ORDER.length - 1 && (
              <div className={cn("h-0.5 flex-1 rounded-full", done ? "bg-emerald-400" : "bg-gray-200")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
