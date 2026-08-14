import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { NAV_ITEMS } from "@/components/shell/nav-items";

export function QuickLinks() {
  const links = NAV_ITEMS.filter((item) => item.href !== "/");

  return (
    <GlassCard className="flex flex-col gap-3">
      <h3 className="text-sm font-extrabold uppercase tracking-wide text-gray-500">Jump to</h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between gap-2 rounded-2xl bg-white/60 px-4 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-white"
            >
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-blue-600" aria-hidden />
                {item.label}
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-gray-400" aria-hidden />
            </Link>
          );
        })}
      </div>
    </GlassCard>
  );
}
