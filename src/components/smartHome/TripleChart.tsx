"use client";

import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from "chart.js";
import { TripleChartProps } from "@/types/dashboard";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export function TripleChart({ data, range }: TripleChartProps) {
    const isTemperatureOutOfRange = (value: number | null | undefined) =>
        value != null && (value < 24 || value > 32);
    const isHumidityOutOfRange = (value: number | null | undefined) =>
        value != null && (value < 45 || value > 60);

    const labelFormat: Intl.DateTimeFormatOptions =
        range === "day"
            ? { hour: "2-digit", minute: "2-digit" }
        : range === "week"
            ? { day: "2-digit", month: "2-digit" }
            : { day: "2-digit", month: "short" }; // month view: day + month

    const labels = data.map((e) => new Date(e.createdAt).toLocaleString("th-TH", labelFormat));

    return (
        <div className="w-full h-[300px] md:h-[400px]
                    backdrop-blur-xl bg-white
                    rounded-2xl p-4 border border-white/10">
            {/* Temperature shifts to green when within range, red when out-of-range */}

            <Line
                data={{
                    labels,
                    datasets: [
                        {
                            label: "Temperature",
                            data: data.map((e) => e.temperature),
                            borderColor: (ctx) =>
                                isTemperatureOutOfRange(
                                    typeof ctx.raw === "number" ? ctx.raw : null
                                )
                                    ? "#FF0000"
                                    : "#009E0C",
                            pointBackgroundColor: data.map((e) =>
                                isTemperatureOutOfRange(e.temperature) ? "#FF0000" : "#009E0C"
                            ),
                            pointBorderColor: data.map((e) =>
                                isTemperatureOutOfRange(e.temperature) ? "#FF0000" : "#009E0C"
                            ),
                            segment: {
                                borderColor: (ctx) => {
                                    const start = ctx.p0.parsed.y;
                                    const end = ctx.p1.parsed.y;
                                    return isTemperatureOutOfRange(start) || isTemperatureOutOfRange(end)
                                        ? "#FF0000"
                                        : "#009E0C";
                                },
                            },
                            tension: 0.35,
                            pointRadius: 0
                        },
                        {
                            label: "Humidity",
                            data: data.map((e) => e.humidity),
                            borderColor: (ctx) =>
                                isHumidityOutOfRange(typeof ctx.raw === "number" ? ctx.raw : null)
                                    ? "#FF0000"
                                    : "#00819E",
                            pointBackgroundColor: data.map((e) =>
                                isHumidityOutOfRange(e.humidity) ? "#FF0000" : "#00819E"
                            ),
                            pointBorderColor: data.map((e) =>
                                isHumidityOutOfRange(e.humidity) ? "#FF0000" : "#00819E"
                            ),
                            segment: {
                                borderColor: (ctx) => {
                                    const start = ctx.p0.parsed.y;
                                    const end = ctx.p1.parsed.y;
                                    return isHumidityOutOfRange(start) || isHumidityOutOfRange(end)
                                        ? "#FF0000"
                                        : "#00819E";
                                },
                            },
                            tension: 0.35,
                            pointRadius: 0,
                        },
                    ],
                }}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,

                    plugins: {
                        legend: {
                            labels: {
                                color: "#ccc",
                                usePointStyle: true,       // 👈 ใช้วงกลมแทนกล่อง
                                pointStyle: "circle",      // 👈 วงกลมทึบ
                                boxWidth: 10,
                                boxHeight: 10,
                            },
                        },
                    },

                    scales: {
                        x: {
                            ticks: { color: "#777" },
                            grid: { color: "rgba(255,255,255,0.05)" },
                        },
                        y: {
                            ticks: { color: "#777" },
                            grid: { color: "rgba(255,255,255,0.05)" },
                        },
                    },
                }}

            />
        </div>
    );
}
