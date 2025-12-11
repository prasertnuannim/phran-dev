"use client";

import { useEffect, useActionState, useTransition } from "react";
import { DashboardRange, DashboardReading } from "@/types/dashboard";
import { FilterTabs } from "@/components/smartHome/FilterTabs";
import { StatCard } from "@/components/smartHome/StatCard";
import { TripleChart } from "@/components/smartHome/TripleChart";
import { getSensorData } from "./action";
import Loading from "@/components/form/loading";

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

  /** ---------------------------------------------
   *  Initial Load → ทำงานครั้งเดียว ไม่ใช้ state.range
   * ---------------------------------------------- */
  useEffect(() => {
    startTransition(() => loadData("day"));
  }, [loadData, startTransition]); // ไม่มี state.range!

  /** -------------------------------------------------
   *   Auto Refresh → 30 วินาทีต่อครั้ง เมื่อ range เปลี่ยน
   * -------------------------------------------------- */
  useEffect(() => {
    const interval = setInterval(
      () => startTransition(() => loadData(state.range)),
      30000
    );
    return () => clearInterval(interval);
  }, [state.range, loadData, startTransition]);

  /** Change Range */
  const handleRangeChange = (nextRange: DashboardRange) => {
    startTransition(() => loadData(nextRange));
  };

  const latest = state.data.at(-1);

  const isTemperatureNormal = latest
    ? latest.temperature >= 24 && latest.temperature <= 32
    : true;

  const isHumidityNormal = latest
    ? latest.humidity >= 45 && latest.humidity <= 60
    : true;

  const temperatureValue = latest
    ? `${latest.temperature} ${isTemperatureNormal ? "(ปกติ)" : "(ผิดปกติ)"}`
    : "--";

  const humidityValue = latest
    ? `${latest.humidity} ${isHumidityNormal ? "(ปกติ)" : "(ผิดปกติ)"}`
    : "--";

  return (
    <div
      className="
        min-h-screen px-6 pt-10
        bg-gradient-to-b from-black/40 to-black/20
        backdrop-blur-2xl
        text-white/90
        font-[450] rounded-lg
      "
    >
      <h1 className="text-3xl font-semibold tracking-tight mb-8 text-white">
        Smart Home Monitor
      </h1>

      <FilterTabs value={state.range} onChange={handleRangeChange} />

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
          border border-white/[0.08]
          rounded-2xl p-6
          shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]
        "
      >
        <TripleChart data={state.data} range={state.range} />
      </div>

      {(actionPending || isTransitionPending) && <Loading message="Loading" />}
    </div>
  );
}
