"use client";

import { useDemoStore } from "@/lib/store/demo-store";
import { ROLES } from "@/lib/fixtures/roles";

export function Topbar() {
  const { role, setRole, eapState } = useDemoStore();

  return (
    <>
      <header className="pointer-events-none fixed left-1/2 top-8 z-30 -translate-x-1/2 glass-pill rounded-full">
        <div className="pointer-events-auto flex items-center gap-4 px-6 py-3">
        <span className={`text-xs font-bold uppercase tracking-wider ${
          eapState === 'blue' ? 'text-blue-600' :
          eapState === 'orange' ? 'text-orange-600' :
          'text-red-600'
        }`}>
          {eapState}
        </span>

        <div className="h-4 w-px bg-gray-300 opacity-40" />

        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600">
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
      </div>
      </header>
      <div className="h-20" />
    </>
  );
}
