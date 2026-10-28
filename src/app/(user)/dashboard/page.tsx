"use client";

import { useEffect, useActionState, useTransition, useState } from "react";
import { DashboardRange, DashboardReading } from "@/types/dashboard";
import { FilterTabs } from "@/components/smartHome/FilterTabs";
import { StatCard } from "@/components/smartHome/StatCard";
import { TripleChart } from "@/components/smartHome/TripleChart";
import {
  getLatestPm25,
  getSensorData,
  type LatestPm25Snapshot,
} from "./action";
import { RefreshCw } from "lucide-react";

type DashboardActionState = {
  range: DashboardRange;
  data: DashboardReading[];
};

export default function DashboardPage() {
  const [latestPm25, setLatestPm25] = useState<LatestPm25Snapshot | null>(null);

  const [state, loadData, actionPending] = useActionState<
    DashboardActionState,
    DashboardRange
  >(
    async (_prevState, nextRange) => {
      const rows = await getSensorData(nextRange);
      return { range: nextRange, data: rows };
    },
    { range: "day", data: [] },
  );

  const [isTransitionPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => loadData("day"));
  }, [loadData, startTransition]); // ไม่มี state.range!

  useEffect(() => {
    let active = true;

    const loadLatestPm25 = async () => {
      const pm25 = await getLatestPm25();
      if (active) {
        setLatestPm25(pm25);
      }
    };

    void loadLatestPm25();

    return () => {
      active = false;
    };
  }, [state.data]);

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

  const dateFormatter = new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Bangkok",
  });

  const hourFormatter = new Intl.DateTimeFormat("th-TH", {
    hour: "2-digit",
    hour12: false,
    timeZone: "Asia/Bangkok",
  });

  const pm25CreatedAt = latestPm25
    ? `ล่าสุด ${dateFormatter.format(new Date(latestPm25.createdAt))} : ${hourFormatter.format(new Date(latestPm25.createdAt))}`
    : null;

  function getPm25Color(pm?: number) {
    if (!pm) return "text-gray-400";
    if (pm <= 15) return "text-emerald-600";
    if (pm <= 25) return "text-yellow-600";
    if (pm <= 37) return "text-orange-600";
    if (pm <= 50) return "text-red-600";

    return "text-purple-600";
  }

  const pending = actionPending || isTransitionPending;

  return (
    <>
      <div className="dashboard-heading">
        <div>
          <div className="eyebrow">YOUR CONNECTED SPACE</div>
          <h1>Smart Home</h1>
          <p>ติดตามสภาพอากาศและคุณภาพอากาศภายในบ้าน</p>
        </div>
        <div className="dashboard-air-quality">
          <span>ค่าฝุ่น PM2.5 ภายในบ้าน</span>
          <strong className={getPm25Color(latestPm25?.pm25)}>{latestPm25 ? latestPm25.pm25 : "--"}<small> µg/m³</small></strong>
          <small>{pm25CreatedAt ?? "ยังไม่มีข้อมูลล่าสุด"}</small>
        </div>
      </div>

      <section className="dashboard-panel" aria-labelledby="climate-heading" aria-busy={pending}>
        <div className="dashboard-toolbar">
          <h2 id="climate-heading">สภาพอากาศภายในบ้าน</h2>
          <div className="dashboard-controls">
            <FilterTabs value={state.range} onChange={handleRangeChange} loading={pending} />
            <button type="button" onClick={handleRefresh} disabled={pending} className="dashboard-refresh" aria-label="รีเฟรชข้อมูล">
              <RefreshCw size={17} className={pending ? "animate-spin" : undefined} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="dashboard-stats">
          <StatCard title="อุณหภูมิ (°C)" value={temperatureValue} color={isTemperatureNormal ? "green" : "red"} />
          <StatCard title="ความชื้น (%)" value={humidityValue} color={isHumidityNormal ? "blue" : "red"} />
        </div>
        <div className="dashboard-chart">
          <TripleChart data={state.data} range={state.range} />
        </div>
        <p className="dashboard-data-status" role="status">
          {pending ? "กำลังโหลดข้อมูล…" : state.data.length === 0 ? "ยังไม่มีข้อมูลในช่วงเวลาที่เลือก" : `แสดงข้อมูล ${state.data.length} รายการ`}
        </p>
      </section>
    </>
  );
}
