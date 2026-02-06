import type { PM25Reading } from "@/server/db/sensor/prisma/generated/client";
import { Pm25Reading } from "@/server/domain/pm25Reading.entity";

export class Pm25ReadingMapper {
  static toDomain(raw: PM25Reading): Pm25Reading {
    return new Pm25Reading(
      raw.id,
      raw.deviceId,
      raw.pm25,
      raw.createdAt
    );
  }
}
