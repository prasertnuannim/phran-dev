export interface SensorReadingPayload {
  deviceId: string;
  type?: string;
  co2: number;
  temperature: number;
  humidity: number;
}

export interface SensorReadingRecord {
  id: string;
  deviceId: string;
  type: string;
  co2: number;
  temperature: number;
  humidity: number;
  createdAt: Date;
}
