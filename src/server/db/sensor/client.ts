import { PrismaClient } from "./prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const sensorSingleton = () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL_SENSOR,
  });

  return new PrismaClient({
    adapter: new PrismaPg(pool),
  });
};

const globalForSensor = global as unknown as {
  sensorDb: ReturnType<typeof sensorSingleton>;
};

export const sensorDb = globalForSensor.sensorDb || sensorSingleton();

if (process.env.NODE_ENV !== "production") globalForSensor.sensorDb = sensorDb;
