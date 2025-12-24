"use client";

import { useEffect, useActionState, useTransition } from "react";
import { DashboardRange, DashboardReading } from "@/types/dashboard";
import { FilterTabs } from "@/components/smartHome/FilterTabs";
import { StatCard } from "@/components/smartHome/StatCard";
import { TripleChart } from "@/components/smartHome/TripleChart";
import { getSensorData } from "./action";
import Loading from "@/components/form/loading";
import { RefreshCw } from "lucide-react";

type DashboardActionState = {
  range: DashboardRange;
  data: DashboardReading[];
};

export default function DashboardPage() {
  const [state, loadData, actionPending] = useActionState<
    DashboardActionState,
    DashboardRange
  >(
    async (_prevState, nextRange) => {
      const rows = await getSensorData(nextRange);
      return { range: nextRange, data: rows };
    },
    { range: "day", data: [] }
  );

  const [isTransitionPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => loadData("day"));
  }, [loadData, startTransition]); // ไม่มี state.range!

  const handleRefresh = () => {
    startTransition(() => loadData(state.range));
  };

  /** Change Range */
  const handleRangeChange = (nextRange: DashboardRange) => {
    startTransition(() => loadData(nextRange));
  };

  const latest = state.data.at(-1);

  const isTemperatureNormal = latest
    ? latest.temperature >= 24 && latest.temperature <= 32
    : true;

  const isHumidityNormal = latest
    ? latest.humidity >= 45 && latest.humidity <= 63
    : true;

  const temperatureValue = latest
    ? `${latest.temperature} ${isTemperatureNormal ? "(ปกติ)" : "(ผิดปกติ)"}`
    : "--";

  const humidityValue = latest
    ? `${latest.humidity} ${isHumidityNormal ? "(ปกติ)" : "(ผิดปกติ)"}`
    : "--";

  return (
    <div
      className="relative overflow-hidden min-h-auto px-6 pt-5 bg-gradient-to-t from-sky-200 to-gray-200 shadow-lg backdrop-blur-2xl text-white/90 font-[450] rounded-lg pb-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 shadow-md"
      ></div>
      <div className="flex items-center gap-4">
        <FilterTabs value={state.range} onChange={handleRangeChange} />

        <button
          type="button"
          onClick={handleRefresh}
          disabled={actionPending || isTransitionPending}
          className="
      group flex h-10 w-10 items-center justify-center rounded-full
      bg-white/80 shadow hover:bg-white transition text-gray-700
      disabled:opacity-60 disabled:cursor-not-allowed
      hover:shadow-md hover:scale-[1.03]
    "
          aria-label="Refresh"
        >
          <RefreshCw
            className="
        h-5 w-5
        transition-transform duration-500 ease-out
        group-hover:rotate-180
      "
            aria-hidden
          />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6 mb-10">
        <StatCard
          title="Temperature (°C)"
          value={temperatureValue}
          color={isTemperatureNormal ? "green" : "red"}
          delay="100ms"
        />
        <StatCard
          title="Humidity (%)"
          value={humidityValue}
          color={isHumidityNormal ? "blue" : "red"}
          delay="200ms"
        />
      </div>

      <div
        className="
          backdrop-blur-md bg-white/[0.04]
          rounded-2xl
          shadow-xl
        "
      >
        <TripleChart data={state.data} range={state.range} />
      </div>

      {(actionPending || isTransitionPending) && <Loading message="Loading" />}
    </div>
  );
}
