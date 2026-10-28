import { StatCardProps } from "@/types/dashboard";

const COLOR_MAP = {
  red: "text-red-600",
  orange: "text-orange-600",
  blue: "text-blue-600",
  green: "text-emerald-600",
};

export function StatCard({ title, value, color }: StatCardProps) {
  return (
    <div className="dashboard-stat">
      <p>{title}</p>
      <h3 className={COLOR_MAP[color]}>{value}</h3>
    </div>
  );
}
