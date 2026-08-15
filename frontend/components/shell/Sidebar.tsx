"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, LogIn, LogOut, User } from "lucide-react";
import { cn } from "@/lib/cn";
import { NAV_ITEMS } from "@/components/shell/nav-items";
import { useAuth } from "@/lib/store/auth-context";

export function Sidebar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <aside className="hidden fixed left-4 top-4 bottom-4 w-64 flex-col rounded-3xl border border-gray-100 bg-white/70 backdrop-blur-xl shadow-lg lg:flex lg:flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 px-6 py-6">
          <img src="/logo.svg" alt="TerraCascade" className="h-9 w-9" />
          <div>
            <p className="brand-font text-lg font-bold text-gray-900 leading-tight">TerraCascade</p>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">EAP Command</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-3">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-colors",
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="px-3 pb-4 space-y-3">
        {/* Officer Card */}
        {isAuthenticated && user ? (
          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                  <p className="text-[10px] font-mono font-semibold text-blue-700 truncate">{user.badgeId}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                title="Sign out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-1.5 text-[10px] font-medium text-gray-500 line-clamp-1">{user.agency}</p>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-blue-50/80 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors shadow-sm"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Official Sign In</span>
          </Link>
        )}

        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-[10px] font-semibold leading-relaxed text-amber-800">
          Verified demo — fixture data only. No live feed, no dispatched alerts.
        </div>
      </div>
    </aside>
  );
}
