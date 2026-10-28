"use client";

import { FilterTabsProps, DashboardRange } from "@/types/dashboard";

const items: { value: DashboardRange; label: string }[] = [
  { value: "day", label: "วัน" },
  { value: "week", label: "สัปดาห์" },
  { value: "month", label: "เดือน" },
];

export function FilterTabs({ value, onChange, loading = false }: FilterTabsProps) {
  return <div className="dashboard-range" role="group" aria-label="ช่วงเวลาของข้อมูล">
    {items.map((item) => <button key={item.value} type="button" aria-pressed={value === item.value} disabled={loading} onClick={() => onChange(item.value)}>{item.label}</button>)}
  </div>;
}
