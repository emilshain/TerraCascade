"use client";

import Link from "next/link";
import { User, LogIn, LogOut, ShieldCheck } from "lucide-react";
import { useDemoStore } from "@/lib/store/demo-store";
import { useAuth } from "@/lib/store/auth-context";
import { ROLES } from "@/lib/fixtures/roles";

export function Topbar() {
  const { role, setRole, eapState } = useDemoStore();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <>
      <header className="pointer-events-none fixed left-1/2 top-8 z-30 -translate-x-1/2 glass-pill rounded-full shadow-lg">
        <div className="pointer-events-auto flex items-center gap-3.5 px-5 py-2.5 sm:px-6 sm:py-3">
          {/* EAP State Indicator */}
          <span
            className={`text-xs font-black uppercase tracking-wider ${
              eapState === "blue"
                ? "text-blue-600"
                : eapState === "orange"
                ? "text-orange-600"
                : "text-red-600"
            }`}
          >
            {eapState} ALERT
          </span>

          <div className="h-4 w-px bg-gray-300 opacity-40" />

          {/* Role Selector */}
          <label className="flex items-center gap-2 text-xs font-bold text-gray-700">
            <span className="hidden sm:inline">Viewing as</span>
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

          <div className="h-4 w-px bg-gray-300 opacity-40" />

          {/* Authenticated Officer Badge / Sign In Link */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full bg-blue-50/80 px-2.5 py-1 text-[11px] font-extrabold text-blue-900 border border-blue-200/60">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                <span className="max-w-[100px] truncate sm:max-w-none">{user.name}</span>
                <span className="hidden md:inline font-mono text-[10px] text-blue-600">({user.badgeId})</span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600 transition-colors"
                title="Sign out of official workstation"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <LogIn className="h-3 w-3" />
              <span>Officer Sign In</span>
            </Link>
          )}
        </div>
      </header>
      <div className="h-20" />
    </>
  );
}
