import { MIN_BUDGET_LAKHS, MAX_BUDGET_LAKHS, BUDGET_STEP_LAKHS } from "@/lib/fixtures/budget";

function crores(lakhs: number) {
  return (lakhs / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export function BudgetSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs font-extrabold uppercase tracking-wide text-gray-400">Mitigation budget</p>
        <p className="text-2xl font-black text-gray-900">₹{crores(value)} Cr</p>
      </div>
      <input
        type="range"
        min={MIN_BUDGET_LAKHS}
        max={MAX_BUDGET_LAKHS}
        step={BUDGET_STEP_LAKHS}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-4 h-2 w-full cursor-pointer accent-blue-600"
        aria-label="Mitigation budget in crores of rupees"
      />
      <div className="mt-1 flex justify-between text-[11px] font-semibold text-gray-400">
        <span>₹{crores(MIN_BUDGET_LAKHS)} Cr</span>
        <span>₹{crores(MAX_BUDGET_LAKHS)} Cr</span>
      </div>
      <p className="mt-3 text-[11px] font-semibold text-amber-700">
        Portfolio recommendation only — funding decisions are made by the responsible agency.
      </p>
    </div>
  );
}
