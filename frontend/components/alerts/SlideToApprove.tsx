"use client";

import { useCallback, useRef, useState, type PointerEvent } from "react";
import { CheckCircle2, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/cn";

const APPROVE_THRESHOLD = 0.85;
const HANDLE_PX = 48;

export function SlideToApprove({
  disabled,
  approved,
  label = "Slide to approve & draft",
  approvedLabel = "Approved for authorised publication",
  onApprove,
}: {
  disabled?: boolean;
  approved?: boolean;
  label?: string;
  approvedLabel?: string;
  onApprove: () => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragPercent, setDragPercent] = useState(0);
  const [dragging, setDragging] = useState(false);

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (disabled || approved) return;
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [disabled, approved]
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!dragging || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const usable = Math.max(rect.width - HANDLE_PX, 1);
      const x = Math.min(Math.max(e.clientX - rect.left - HANDLE_PX / 2, 0), usable);
      const percent = x / usable;
      setDragPercent(percent);
      if (percent >= APPROVE_THRESHOLD) {
        setDragging(false);
        setDragPercent(1);
        onApprove();
      }
    },
    [dragging, onApprove]
  );

  const handlePointerUp = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    setDragPercent((p) => (p >= APPROVE_THRESHOLD ? 1 : 0));
  }, [dragging]);

  const percent = approved ? 1 : dragPercent;
  const leftCss = `calc(${(percent * 100).toFixed(2)}% - ${(percent * HANDLE_PX).toFixed(1)}px)`;
  const widthCss = `calc(${(percent * 100).toFixed(2)}% + ${((1 - percent) * HANDLE_PX).toFixed(1)}px)`;

  return (
    <div
      ref={trackRef}
      className={cn(
        "relative h-14 w-full select-none overflow-hidden rounded-full bg-gray-900/90",
        disabled && "opacity-40"
      )}
    >
      <div
        className={cn(
          "absolute inset-y-0 left-0 rounded-full bg-emerald-500/70",
          !dragging && "transition-[width] duration-300"
        )}
        style={{ width: widthCss }}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs font-extrabold uppercase tracking-wide text-white">
        {approved ? approvedLabel : label}
      </div>
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ left: leftCss, touchAction: "none" }}
        className={cn(
          "absolute top-1 flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg",
          !dragging && "transition-[left] duration-300",
          !disabled && !approved && "cursor-grab active:cursor-grabbing"
        )}
      >
        {approved ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden />
        ) : (
          <ChevronsRight className="h-5 w-5" aria-hidden />
        )}
      </div>
    </div>
  );
}
