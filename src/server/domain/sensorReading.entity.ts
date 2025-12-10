export interface SensorReading {
  id: string;
  deviceId: string;
  type: string;
  co2: number;
  temperature: number;
  humidity: number;
  createdAt: Date;
}
