import {
  Prisma as SensorPrisma,
  SensorReading as SensorReadingModel,
} from "@/server/db/sensor/prisma/generated/client";
import { sensorDb } from "@/server/db/sensor/client";

export const SensorReadingRepository = {
  create: async (
    data: SensorPrisma.SensorReadingCreateInput,
  ): Promise<SensorReadingModel> => {
    return sensorDb.sensorReading.create({ data });
  },

  latestByDevice: async (
    deviceId: string,
  ): Promise<SensorReadingModel | null> => {
    return sensorDb.sensorReading.findFirst({
      where: { deviceId },
      orderBy: { createdAt: "desc" },
    });
  },

  findSince: async (
    deviceId: string,
    since: Date,
  ): Promise<SensorReadingModel[]> => {
    return sensorDb.sensorReading.findMany({
      where: { deviceId, createdAt: { gte: since } },
      orderBy: { createdAt: "asc" },
    });
  },

  findFrom: async (since: Date): Promise<SensorReadingModel[]> => {
    return sensorDb.sensorReading.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "asc" },
    });
  },
};
