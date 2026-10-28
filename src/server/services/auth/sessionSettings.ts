import { prisma } from "@/server/db/auth/client";

export const SESSION_MAX_AGE_DEFAULT_SECONDS = 60 * 50;
export const SESSION_MAX_AGE_LIMIT_SECONDS = 60 * 60 * 24 * 30;

export function resolveSessionMaxAgeSeconds(raw?: string | null): number {
  const parsed = raw ? Number(raw) : NaN;
  if (!Number.isFinite(parsed) || parsed < 60 || parsed > SESSION_MAX_AGE_LIMIT_SECONDS) {
    return SESSION_MAX_AGE_DEFAULT_SECONDS;
  }
  return Math.floor(parsed);
}

export async function getSessionMaxAgeSeconds(): Promise<number> {
  let settings: { value: string }[];
  try {
    // Check the catalog first: querying a missing table can surface as a nested
    // driver-adapter error rather than Prisma's usual meta.code shape.
    const tables = await prisma.$queryRaw<{ exists: boolean }[]>`
      SELECT to_regclass('"AppSetting"') IS NOT NULL AS "exists"
    `;
    if (!tables[0]?.exists) return resolveSessionMaxAgeSeconds(process.env.SESSION_MAX_AGE);

    settings = await prisma.$queryRaw<{ value: string }[]>`
      SELECT "value" FROM "AppSetting" WHERE "key" = 'sessionMaxAge'
    `;
  } catch (error) {
    // Permit the public site to render during an additive migration rollout.
    // Settings writes and credential/sensor limits still fail closed until deployed.
    if (isMissingRelation(error)) return resolveSessionMaxAgeSeconds(process.env.SESSION_MAX_AGE);
    throw error;
  }
  return resolveSessionMaxAgeSeconds(settings[0]?.value ?? process.env.SESSION_MAX_AGE);
}

function isMissingRelation(error: unknown, seen = new Set<object>()): boolean {
  if (typeof error !== "object" || error === null || seen.has(error)) return false;
  seen.add(error);
  const details = error as Record<string, unknown>;
  if (details.code === "42P01" || details.originalCode === "42P01") return true;
  return ["meta", "cause", "driverAdapterError"].some(key => isMissingRelation(details[key], seen));
}

export async function saveSessionMaxAgeSeconds(value: number): Promise<void> {
  if (!Number.isInteger(value) || value < 60 || value > SESSION_MAX_AGE_LIMIT_SECONDS) {
    throw new Error("Session lifetime must be between 1 minute and 30 days");
  }
  await prisma.$executeRaw`
    INSERT INTO "AppSetting" ("key", "value") VALUES ('sessionMaxAge', ${String(value)})
    ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value"
  `;
}
