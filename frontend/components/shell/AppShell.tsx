"use client";

import type { ReactNode } from "react";
import { DemoStoreProvider } from "@/lib/store/demo-store";
import { Sidebar } from "@/components/shell/Sidebar";
import { Topbar } from "@/components/shell/Topbar";
import { MobileNav } from "@/components/shell/MobileNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <DemoStoreProvider>
      <div className="flex min-h-full w-full">
        <Sidebar />
        <div className="flex min-h-full flex-1 flex-col">
          <Topbar />
          <MobileNav />
          <main className="custom-scrollbar flex-1 overflow-y-auto bg-[var(--background)] px-4 py-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </DemoStoreProvider>
  );
}
