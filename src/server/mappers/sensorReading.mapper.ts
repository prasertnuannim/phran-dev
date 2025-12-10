import { SensorReadingRecord } from "@/types/sensorReading";
import { SensorReading } from "@/server/domain/sensorReading.entity";

export const SensorReadingMapper = {
  toDomain: (data: SensorReadingRecord): SensorReading => ({
    id: data.id,
    deviceId: data.deviceId,
    type: data.type,
    co2: data.co2,
    temperature: data.temperature,
    humidity: data.humidity,
    createdAt: data.createdAt,
  }),
};
