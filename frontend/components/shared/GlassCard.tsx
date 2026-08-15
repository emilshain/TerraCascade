import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function GlassCard({
  children,
  className,
  tint,
  id,
  style,
}: {
  children: ReactNode;
  className?: string;
  tint?: "red" | "orange" | "amber" | "emerald" | "blue";
  id?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      id={id}
      style={style}
      className={cn(
        "glass-card rounded-3xl p-6 animate-fade-in hover-lift",
        tint && `glass-tint-${tint}`,
        className
      )}
    >
      {children}
    </div>
  );
}
