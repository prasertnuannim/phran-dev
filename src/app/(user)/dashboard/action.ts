"use server";

import { DashboardRange, DashboardReading } from "@/types/dashboard";
import { SensorReadingService } from "@/server/services/sensorReadingService";

export async function getSensorData(range: DashboardRange): Promise<DashboardReading[]> {
  const rows = await SensorReadingService.getRange(range);
  return rows;
}
