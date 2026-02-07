import type {
  PM25Reading as PM25ReadingModel,
} from "@/server/db/sensor/prisma/generated/client";
import { sensorDb } from "@/server/db/sensor/client";
import { CreatePm25ReadingDto } from "@/server/dto/pm25Reading.dto";

export const Pm25ReadingRepository = {
  create: async (
    data: CreatePm25ReadingDto,
  ): Promise<PM25ReadingModel> => {
    return sensorDb.pM25Reading.create({
      data: {
        deviceId: data.deviceId,
        pm25: data.pm25,
      },
    });
  },

  latestByDevice: async (
    deviceId: string,
  ): Promise<PM25ReadingModel | null> => {
    return sensorDb.pM25Reading.findFirst({
      where: { deviceId },
      orderBy: { createdAt: "desc" },
    });
  },

  latest: async (): Promise<PM25ReadingModel | null> => {
    return sensorDb.pM25Reading.findFirst({
      orderBy: { createdAt: "desc" },
    });
  },

  findSince: async (
    deviceId: string,
    since: Date,
  ): Promise<PM25ReadingModel[]> => {
    return sensorDb.pM25Reading.findMany({
      where: {
        deviceId,
        createdAt: { gte: since },
      },
      orderBy: { createdAt: "asc" },
    });
  },

  findFrom: async (
    fromUTC: Date,
  ): Promise<PM25ReadingModel[]> => {
    return sensorDb.pM25Reading.findMany({
      where: {
        createdAt: { gte: fromUTC },
      },
      orderBy: { createdAt: "asc" },
    });
  },
};
