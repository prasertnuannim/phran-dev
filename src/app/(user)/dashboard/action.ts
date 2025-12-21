"use server";

import { DashboardRange, DashboardReading } from "@/types/dashboard";
import { SensorReadingService } from "@/server/services/sensorReadingService";
import { withAuthAction } from "@/server/security/safeAction";

export const getSensorData = withAuthAction(
  async (_sessionUserId: string | null, range: DashboardRange): Promise<DashboardReading[]> => {
    const rows = await SensorReadingService.getRange(range);
    return rows;
  },
);
