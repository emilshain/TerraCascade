"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { NAV_ITEMS } from "@/components/shell/nav-items";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden fixed left-4 top-4 bottom-4 w-64 flex-col rounded-3xl border border-gray-100 bg-white/70 backdrop-blur-xl shadow-lg lg:flex lg:flex-col">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-600 text-sm font-black text-white">
          TC
        </div>
        <div>
          <p className="brand-font text-sm text-gray-900">TerraCascade</p>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            EAP Command
          </p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
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
      <div className="mx-3 mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[11px] font-semibold leading-relaxed text-amber-800">
        Verified demo — fixture data only. No live feed, no dispatched alerts.
      </div>
    </aside>
  );
}
