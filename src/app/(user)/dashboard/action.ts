"use server";

import { DashboardRange, DashboardReading } from "@/types/dashboard";
import { SensorReadingService } from "@/server/services/sensorReadingService";
import { Pm25ReadingService } from "@/server/services/pm25ReadingService";
import { withAuthAction } from "@/server/security/safeAction";

export type LatestPm25Snapshot = {
  pm25: number;
  createdAt: string;
};

export const getSensorData = withAuthAction(
  async (_sessionUserId: string | null, range: DashboardRange): Promise<DashboardReading[]> => {
    const rows = await SensorReadingService.getRange(range);
    return rows;
  },
);

export const getLatestPm25 = withAuthAction(
  async (): Promise<LatestPm25Snapshot | null> => {
    try {
      const reading = await Pm25ReadingService.getLatestAny();
      return {
        pm25: reading.pm25,
        createdAt: reading.createdAt.toISOString(),
      };
    } catch {
      return null;
    }
  },
);
