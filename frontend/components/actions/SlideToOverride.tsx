"use client";

import { useCallback, useRef, useState, type PointerEvent } from "react";
import { AlertCircle, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/cn";

const OVERRIDE_THRESHOLD = 0.85;
const HANDLE_PX = 48;

export function SlideToOverride({
  disabled,
  overridden,
  label = "Slide to override",
  overriddenLabel = "Override confirmed",
  onOverride,
}: {
  disabled?: boolean;
  overridden?: boolean;
  label?: string;
  overriddenLabel?: string;
  onOverride: () => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragPercent, setDragPercent] = useState(0);
  const [dragging, setDragging] = useState(false);

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (disabled || overridden) return;
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [disabled, overridden]
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!dragging || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const usable = Math.max(rect.width - HANDLE_PX, 1);
      const x = Math.min(Math.max(e.clientX - rect.left - HANDLE_PX / 2, 0), usable);
      const percent = x / usable;
      setDragPercent(percent);
    },
    [dragging]
  );

  const handlePointerUp = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    setDragPercent((p) => {
      if (p >= OVERRIDE_THRESHOLD) {
        onOverride();
        return 1;
      }
      return 0;
    });
  }, [dragging, onOverride]);

  const percent = overridden ? 1 : dragPercent;
  const leftCss = `calc(${(percent * 100).toFixed(2)}% - ${(percent * HANDLE_PX).toFixed(1)}px)`;
  const widthCss = `calc(${(percent * 100).toFixed(2)}% + ${((1 - percent) * HANDLE_PX).toFixed(1)}px)`;

  return (
    <div
      ref={trackRef}
      className={cn(
        "relative h-12 w-full select-none overflow-hidden rounded-full bg-red-600/20 pointer-events-auto",
        disabled && "opacity-40"
      )}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        className={cn(
          "absolute inset-y-0 left-0 rounded-full bg-red-600/60 pointer-events-none",
          !dragging && "transition-[width] duration-300"
        )}
        style={{ width: widthCss }}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center pl-6 text-xs font-extrabold uppercase tracking-wide text-gray-900">
        {overridden ? overriddenLabel : label}
      </div>
      <div
        onPointerDown={handlePointerDown}
        style={{ left: leftCss, touchAction: "none" }}
        className={cn(
          "absolute top-0.5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-red-600 shadow-lg pointer-events-auto",
          !dragging && "transition-[left] duration-300",
          !disabled && !overridden && "cursor-grab active:cursor-grabbing"
        )}
      >
        {overridden ? (
          <AlertCircle className="h-5 w-5 text-red-600" aria-hidden />
        ) : (
          <ChevronsRight className="h-5 w-5" aria-hidden />
        )}
      </div>
    </div>
  );
}
