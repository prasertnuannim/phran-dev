"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { ChartWrapperProps } from "@/types/dashboard";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export function ChartWrapper({ data, label }: ChartWrapperProps) {
  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow">
      <Line
        data={{
          labels: data.map((e) =>
            new Date(e.createdAt).toLocaleTimeString("th-TH", {
              hour: "2-digit",
              minute: "2-digit",
            })
          ),
          datasets: [
            {
              label,
              data: data.map((e) => e[label]),
              borderWidth: 2,
              fill: false,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: { legend: { labels: { color: "#ddd" } } },
          scales: {
            x: { ticks: { color: "#888" } },
            y: { ticks: { color: "#888" } },
          },
        }}
      />
    </div>
  );
}
