import { StatCardProps } from "@/types/dashboard";

type Props = StatCardProps;

const COLOR_MAP: Record<string, string> = {
  red: "text-red-400",
  orange: "text-orange-400",
  blue: "text-blue-400",
  emerald: "text-emerald-400",
};

export function StatCard({ title, value, color, delay }: Props) {
  const colorClass = COLOR_MAP[color] ?? "text-emerald-400";

  return (
    <div
className="
  relative group
  backdrop-blur-xl bg-gradient-to-r from-sky-200 to-gray-200
  rounded-2xl p-5
  transition-all duration-300 ease-out
  shadow-xl
  hover:border-white/[0.14]
  hover:-translate-y-1
"

      style={{ animationDelay: delay }}
    >
      <p className="text-sm text-white tracking-wide mb-1">
        {title}
      </p>

      <h2 className={`text-3xl font-semibold tracking-tight ${colorClass}`}>
        {value}
      </h2>
    </div>
  );
}
