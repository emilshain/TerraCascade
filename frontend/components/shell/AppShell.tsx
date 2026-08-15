"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShieldCheck, Lock } from "lucide-react";
import { DemoStoreProvider } from "@/lib/store/demo-store";
import { AuthProvider, useAuth } from "@/lib/store/auth-context";
import { Sidebar } from "@/components/shell/Sidebar";
import { Topbar } from "@/components/shell/Topbar";
import { MobileNav } from "@/components/shell/MobileNav";

function AppShellContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const isAuthRoute = pathname === "/login" || pathname === "/signin" || pathname === "/signup";

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isAuthRoute) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, isAuthRoute, router]);

  // Auth pages (Login, Sign In / Sign Up) render in dedicated full-screen layout
  if (isAuthRoute) {
    return <main className="min-h-screen w-full bg-[var(--background)]">{children}</main>;
  }

  // Loading state while checking localStorage session
  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[var(--background)] p-4">
        <div className="glass-card flex flex-col items-center gap-4 rounded-3xl border border-gray-200/60 bg-white/80 p-8 shadow-xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 animate-pulse">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="text-center">
            <h2 className="text-base font-black text-gray-900">TerraCascade EAP Command</h2>
            <p className="mt-1 text-xs font-semibold text-gray-500">Verifying Officer Clearance...</p>
          </div>
          <div className="h-1.5 w-48 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-2/3 animate-pulse bg-blue-600 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // Unauthenticated guard state before redirection
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[var(--background)] p-4">
        <div className="glass-card flex flex-col items-center gap-3 rounded-3xl border border-gray-200/60 bg-white/80 p-8 shadow-xl text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <Lock className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Authentication Required</h3>
          <p className="text-xs font-medium text-gray-500 max-w-xs">
            Redirecting to official login portal...
          </p>
        </div>
      </div>
    );
  }

  // Authenticated command dashboard layout
  return (
    <div className="flex min-h-full w-full">
      <Sidebar />
      <div className="flex min-h-full flex-1 flex-col lg:ml-72">
        <Topbar />
        <MobileNav />
        <main className="custom-scrollbar flex-1 overflow-y-auto bg-[var(--background)] px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <DemoStoreProvider>
      <AuthProvider>
        <AppShellContent>{children}</AppShellContent>
      </AuthProvider>
    </DemoStoreProvider>
  );
}
