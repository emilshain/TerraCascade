import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function GlassCard({
  children,
  className,
  tint,
}: {
  children: ReactNode;
  className?: string;
  tint?: "red" | "orange" | "amber" | "emerald" | "blue";
}) {
  return (
    <div
      className={cn(
        "glass-card rounded-3xl p-6",
        tint && `glass-tint-${tint}`,
        className
      )}
    >
      {children}
    </div>
  );
}
