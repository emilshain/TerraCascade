"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { ACTION_STATUS_ORDER, type ActionItem, type ActionStatus } from "@/lib/types";

const STAGE_LABEL: Record<ActionStatus, string> = {
  drafted: "Drafted",
  pending_approval: "Pending approval",
  acknowledged: "Acknowledged",
  in_progress: "In progress",
  complete: "Complete",
};

export function OverrideModal({
  action,
  onClose,
  onSubmit,
}: {
  action: ActionItem;
  onClose: () => void;
  onSubmit: (newStatus: ActionStatus, reason: string) => void;
}) {
  const [newStatus, setNewStatus] = useState<ActionStatus>(action.status);
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" role="dialog" aria-modal>
      <div className="glass-card w-full max-w-md rounded-3xl p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-red-600">Manual override</p>
            <h3 className="mt-1 text-base font-extrabold text-gray-900">{action.title}</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-1 hover:bg-gray-100">
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <form
          className="mt-4 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!reason.trim()) return;
            onSubmit(newStatus, reason.trim());
            onClose();
          }}
        >
          <label className="flex flex-col gap-1.5 text-xs font-bold text-gray-600">
            New status
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as ActionStatus)}
              className="glass-select text-sm"
            >
              {ACTION_STATUS_ORDER.map((s) => (
                <option key={s} value={s}>
                  {STAGE_LABEL[s]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-bold text-gray-600">
            Reason for override (required — appears on the audit timeline)
            <textarea
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="glass-input text-sm font-medium"
              placeholder="e.g. Field liaison confirmed status by phone ahead of the scheduled review."
            />
          </label>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reason.trim()}
              className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-40"
            >
              Log override
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
