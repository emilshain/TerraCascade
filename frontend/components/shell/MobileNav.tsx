"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { NAV_ITEMS } from "@/components/shell/nav-items";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="no-scrollbar flex gap-1.5 overflow-x-auto border-b border-gray-100 bg-white/80 px-3 py-2 backdrop-blur-xl lg:hidden">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap",
              active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
