import { Lock } from "lucide-react";

export function RestrictedNote({ label = "Restricted — sign in as an agency role to view" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-500">
      <Lock className="h-3.5 w-3.5" aria-hidden />
      {label}
    </div>
  );
}
