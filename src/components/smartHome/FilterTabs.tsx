"use client";

import { FilterTabsProps, DashboardRange } from "@/types/dashboard";
import { motion } from "framer-motion";

export function FilterTabs({ value, onChange, loading = false }: FilterTabsProps) {
  const items: DashboardRange[] = ["day", "week", "month"];

  return (
    <div className="relative w-full flex justify-center items-center gap-6">
      {/* {loading && (
        <div className="absolute right-0 flex items-center gap-2 text-xs text-white">
          <span className="h-2 w-2 rounded-full bg-white/60 animate-ping" aria-hidden />
          <span className="sr-only">Loading</span>
        </div>
      )} */}

      {items.map((item) => {
        const active = value === item;

        return (
          <button
            key={item}
            onClick={() => !loading && onChange(item)}
            disabled={loading}
            className={`
              relative pb-1 text-md tracking-wide font-medium
              transition-colors duration-200
              ${
                active
                  ? "text-white cursor-pointer"
                  : "text-gray-500 hover:text-white cursor-pointer "
              }
              ${loading ? "opacity-60 cursor-not-allowed" : ""}
            `}
          >
            {item.toUpperCase()}
            {active && (
              <motion.div
                layoutId="underline"
                className="
                  absolute left-0 right-0 -bottom-[2px] h-[2px]
                  bg-white rounded-full
                "
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
