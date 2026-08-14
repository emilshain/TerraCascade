"use client";

import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import type { ProtocolSource } from "@/lib/types";
import { cn } from "@/lib/cn";

export function ProtocolDrawer({ protocolSource }: { protocolSource: ProtocolSource }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-gray-200 bg-white/60">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-xs font-bold text-gray-700"
      >
        <span className="flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-blue-600" aria-hidden />
          {protocolSource.document} — protocol citation
        </span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open && (
        <div className="border-t border-gray-100 px-4 py-3 text-xs text-gray-600">
          <p className="font-semibold text-gray-800">{protocolSource.section}</p>
          <p className="mt-1 uppercase tracking-wide text-[10px] font-bold text-amber-700">
            Status: {protocolSource.status}
          </p>
        </div>
      )}
    </div>
  );
}
