import type { EpistemicStatus } from "@/lib/types";

const EPISTEMIC_STYLE: Record<EpistemicStatus, { icon: string; label: string; title: string }> = {
  official_rule_curve: {
    icon: "🏷️",
    label: "Official rule curve",
    title: "Sourced from the official rule curve.",
  },
  demo_simulation: {
    icon: "🧪",
    label: "Demo simulation assumption",
    title: "Demo simulation assumption — not agency-verified.",
  },
  vit_model_output: {
    icon: "🛰️",
    label: "Pre-computed ViT model output",
    title: "Pre-computed ViT model output — single-timestamp inference, not a live feed.",
  },
  needs_verification: {
    icon: "📋",
    label: "Needs agency verification",
    title: "Needs agency verification before operational use.",
  },
};

export function EpistemicTag({ status, className }: { status: EpistemicStatus; className?: string }) {
  const style = EPISTEMIC_STYLE[status];
  return (
    <span
      title={style.title}
      className={
        "inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600 " +
        (className ?? "")
      }
    >
      <span aria-hidden>{style.icon}</span>
      {style.label}
    </span>
  );
}
