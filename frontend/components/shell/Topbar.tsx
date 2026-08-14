"use client";

import { WifiOff } from "lucide-react";
import { useDemoStore } from "@/lib/store/demo-store";
import { ROLES } from "@/lib/fixtures/roles";
import type { EapState } from "@/lib/types";
import { SeverityBadge } from "@/components/shared/SeverityBadge";

const EAP_STATES: EapState[] = ["blue", "orange", "red"];

export function Topbar() {
  const { role, setRole, eapState, setEapState } = useDemoStore();

  return (
    <header className="glass-header sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-8">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-3 py-1 text-[11px] font-bold text-white">
          <WifiOff className="h-3 w-3" aria-hidden />
          Offline-capable demo
        </span>
        <div className="hidden items-center gap-1.5 sm:flex">
          {EAP_STATES.map((state) => (
            <button
              key={state}
              type="button"
              onClick={() => setEapState(state)}
              className={
                eapState === state
                  ? "rounded-full ring-2 ring-offset-2 ring-blue-500"
                  : "rounded-full opacity-50 transition-opacity hover:opacity-100"
              }
              aria-pressed={eapState === state}
              title={`View the ${state} EAP scenario fixture`}
            >
              <SeverityBadge state={state} />
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-xs font-semibold text-gray-500">
        Viewing as
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as typeof role)}
          className="glass-select-compact"
        >
          {ROLES.map((r) => (
            <option key={r.id} value={r.id}>
              {r.shortLabel}
            </option>
          ))}
        </select>
      </label>
    </header>
  );
}
