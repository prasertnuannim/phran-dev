import { StatCardProps } from "@/types/dashboard";

type Props = StatCardProps;

export function StatCard({ title, value, color, delay }: Props) {
const colorClass =
  color === "red"
    ? "text-red-400 font-semibold"
    : color === "orange"
    ? "text-orange-400 font-semibold"
    : color === "blue"
    ? "text-blue-400 font-semibold"
    : "text-emerald-400 font-semibold";

  return (
    <div
      className="
        backdrop-blur-md bg-white/[0.04]
        border border-white/[0.08]
        rounded-2xl p-5
        transition-all duration-300
        shadow-[0_0_20px_-5px_rgba(255,255,255,0.08)]
        hover:bg-white/[0.07] hover:border-white/[0.12]
      "
      style={{ animationDelay: delay }}
    >
      <p className="text-sm text-white/60 mb-1">{title}</p>
      <h2 className={`text-3xl font-semibold tracking-tight ${colorClass}`}>
        {value}
      </h2>
    </div>
  );
}
