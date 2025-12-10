import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const schemaEnv = process.env.PRISMA_SCHEMA;
const schema =
  schemaEnv === "sensor"
    ? "./src/server/db/sensor/prisma/schema.prisma"
    : schemaEnv && schemaEnv !== "auth"
      ? schemaEnv
      : "./src/server/db/auth/prisma/schema.prisma";

const isSensor = schema.includes("/sensor/");
const datasourceUrl = isSensor ? env("DATABASE_URL_SENSOR") : env("DATABASE_URL");
const migrationsPath = isSensor
  ? "src/server/db/sensor/prisma/migrations"
  : "src/server/db/auth/prisma/migrations";

export default defineConfig({
  schema,
  migrations: { path: migrationsPath },
  datasource: { url: datasourceUrl },
});
