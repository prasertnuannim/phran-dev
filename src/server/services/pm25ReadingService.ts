
import { startOfDay, subDays } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { DashboardRange } from "@/types/dashboard";
import { createAppError } from "../security/appError";
import { Pm25ReadingPayload } from "@/types/pm25Reading";
import { Pm25Reading } from "../domain/pm25Reading.entity";
import { createPm25ReadingDto } from "../dto/pm25Reading.dto";
import { Pm25ReadingRepository } from "../repositories/pm25Reading.repository";
import { Pm25ReadingMapper } from "../mappers/pm25Reading.mapper";

const TZ = "Asia/Bangkok";

export const Pm25ReadingService = {
  async createReading(
    body: Pm25ReadingPayload
  ): Promise<Pm25Reading> {
    const parsed = createPm25ReadingDto.safeParse(body);
    if (!parsed.success) {
      throw createAppError(
        "VALIDATION_ERROR",
        "Invalid PM2.5 payload",
        400
      );
    }

    const created =
      await Pm25ReadingRepository.create(parsed.data);

    return Pm25ReadingMapper.toDomain(created);
  },

  async getLatest(deviceId: string): Promise<Pm25Reading> {
    const data =
      await Pm25ReadingRepository.latestByDevice(deviceId);

    if (!data) {
      throw createAppError(
        "NOT_FOUND",
        "No PM2.5 data for device",
        404
      );
    }

    return Pm25ReadingMapper.toDomain(data);
  },

  async getLatestAny(): Promise<Pm25Reading> {
    const data = await Pm25ReadingRepository.latest();

    if (!data) {
      throw createAppError(
        "NOT_FOUND",
        "No PM2.5 data",
        404
      );
    }

    return Pm25ReadingMapper.toDomain(data);
  },

  async getHistory(
    deviceId: string,
    hours = 24
  ): Promise<Pm25Reading[]> {
    const since = new Date(
      Date.now() - hours * 60 * 60 * 1000
    );

    const data =
      await Pm25ReadingRepository.findSince(deviceId, since);

    return data.map(Pm25ReadingMapper.toDomain);
  },

  async getRange(
    range: DashboardRange
  ): Promise<Pm25Reading[]> {
    const nowTH = toZonedTime(new Date(), TZ);

    const fromTH =
      range === "day"
        ? startOfDay(nowTH)
        : range === "week"
          ? subDays(nowTH, 7)
          : subDays(nowTH, 30);

    const fromUTC = fromZonedTime(fromTH, TZ);

    const data =
      await Pm25ReadingRepository.findFrom(fromUTC);

    return data.map(Pm25ReadingMapper.toDomain);
  },
};
